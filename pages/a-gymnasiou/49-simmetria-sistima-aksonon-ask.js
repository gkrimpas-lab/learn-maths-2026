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

function randNonZero(min, max) {
  let n = 0;
  while (n === 0) {
    n = randInt(min, max);
  }
  return n;
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

function fmtSigned(n) {
  if (n < 0) return `－${Math.abs(n)}`;
  return `${n}`;
}

function fmtCoord(x, y) {
  return `(${fmtSigned(x)}, ${fmtSigned(y)})`;
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
    ? { M: 'Μ', Mp: "Μ'", O: 'Ο', A: 'Α', B: 'Β', C: 'Γ' }
    : { M: 'M', Mp: "M'", O: 'O', A: 'A', B: 'B', C: 'C' };

  // 1. Ανάκλαση σημείου στο Καρτεσιανό Επίπεδο (Ερ. 2, 3, 7, 8, 12)
  if (diagram.type === 'coordPoint') {
    const cx = 132;
    const cy = 82;
    const unit = 13;
    const { x1, y1, x2, y2, axis } = diagram;
    const px1 = cx + x1 * unit;
    const py1 = cy - y1 * unit;
    const px2 = cx + x2 * unit;
    const py2 = cy - y2 * unit;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Πλέγμα */}
          {[-6, -4, -2, 2, 4, 6].map((g) => (
            <line key={`gx-${g}`} x1={cx + g * unit} y1={14} x2={cx + g * unit} y2={150} stroke="#1e293b" strokeWidth="1" />
          ))}
          {[-4, -2, 2, 4].map((g) => (
            <line key={`gy-${g}`} x1={30} y1={cy - g * unit} x2={234} y2={cy - g * unit} stroke="#1e293b" strokeWidth="1" />
          ))}

          {/* Άξονες */}
          <line x1="26" y1={cy} x2="238" y2={cy} stroke={axis === 'x' ? '#fbbf24' : '#64748b'} strokeWidth={axis === 'x' ? '2.2' : '1.5'} />
          <line x1={cx} y1="12" x2={cx} y2="152" stroke={axis === 'y' ? '#34d399' : '#64748b'} strokeWidth={axis === 'y' ? '2.2' : '1.5'} />

          <text x="243" y={cy + 3} className="text-[9px] font-black fill-amber-300">x</text>
          <text x={cx + 4} y="16" className="text-[9px] font-black fill-emerald-300">y</text>

          {/* Διακεκομμένη γραμμή συμμετρίας */}
          <line x1={px1} y1={py1} x2={px2} y2={py2} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 3" />

          {/* Αρχικό σημείο */}
          <circle cx={px1} cy={py1} r="4" fill="#818cf8" />
          <text
            x={px1 + (x1 >= 0 ? 6 : -6)}
            y={py1 + (y1 >= 0 ? -6 : 12)}
            textAnchor={x1 >= 0 ? 'start' : 'end'}
            className="text-[9px] font-black fill-indigo-300"
          >
            {diagram.lbl1 || `${v.M}${fmtCoord(x1, y1)}`}
          </text>

          {/* Συμμετρικό σημείο */}
          <circle cx={px2} cy={py2} r="4" fill="#34d399" />
          <text
            x={px2 + (x2 >= 0 ? 6 : -6)}
            y={py2 + (y2 >= 0 ? -6 : 12)}
            textAnchor={x2 >= 0 ? 'start' : 'end'}
            className="text-[9px] font-black fill-emerald-300"
          >
            {diagram.lbl2 || `${v.Mp}${fmtCoord(x2, y2)}`}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Ανάκλαση τριγώνου στο Καρτεσιανό Επίπεδο (Ερ. 9, 10)
  if (diagram.type === 'coordTriangle') {
    const cx = 132;
    const cy = 82;
    const unit = 12;
    const toSvg = ([x, y]) => `${cx + x * unit},${cy - y * unit}`;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <line x1="26" y1={cy} x2="238" y2={cy} stroke={diagram.axis === 'x' ? '#fbbf24' : '#64748b'} strokeWidth={diagram.axis === 'x' ? '2.2' : '1.5'} />
          <line x1={cx} y1="12" x2={cx} y2="152" stroke={diagram.axis === 'y' ? '#34d399' : '#64748b'} strokeWidth={diagram.axis === 'y' ? '2.2' : '1.5'} />

          <polygon
            points={diagram.origPts.map(toSvg).join(' ')}
            fill="rgba(99, 102, 241, 0.25)"
            stroke="#818cf8"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            points={diagram.symPts.map(toSvg).join(' ')}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#34d399"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          <text x="132" y="158" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Σχήματα με άξονα συμμετρίας & αναδίπλωση (Ερ. 6, 11)
  if (diagram.type === 'foldingShape') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {diagram.shape === 'rect' && (
            <>
              <rect x="68" y="42" width="128" height="76" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" />
              <line x1="132" y1="18" x2="132" y2="142" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="44" y1="80" x2="220" y2="80" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
            </>
          )}
          {diagram.shape === 'isoTrap' && (
            <>
              <polygon points="92,42 172,42 204,122 60,122" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="132" y1="18" x2="132" y2="144" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
            </>
          )}
          {diagram.shape === 'square' && (
            <>
              <rect x="86" y="34" width="92" height="92" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.2" />
              <line x1="132" y1="14" x2="132" y2="146" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="66" y1="80" x2="198" y2="80" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="70" y1="18" x2="194" y2="142" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
              <line x1="194" y1="18" x2="70" y2="142" stroke="#fb7185" strokeWidth="1.8" strokeDasharray="4 3" />
            </>
          )}
          <text x="132" y="156" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function SimmetriaSistimaAksononExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Αξονική Συμμετρία στο Σύστημα Αξόνων | Α' Γυμνασίου" : "Exercises: Axial Symmetry in the Coordinate System | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στην αξονική συμμετρία στο ορθογώνιο σύστημα αξόνων (x'x, y'y) και στα σχήματα με άξονα συμμετρίας."
      : "Interactive Grade 7 geometry exercises on axial symmetry in the Cartesian coordinate system (x-axis, y-axis) and shapes with an axis of symmetry.",
    backNav: isEl ? "Θεωρία Κεφ. 12" : "Theory Ch. 12",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 12 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 12 • GRADE 7",
    heroTitle: isEl ? "Αξονική Συμμετρία στο Σύστημα Αξόνων: Εξάσκηση" : "Axial Symmetry in the Coordinate System: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στις συμμετρικές συντεταγμένες ως προς x'x και y'y, στα συμμετρικά πολύγωνα και στα σχήματα με άξονα συμμετρίας."
      : "12 dynamic questions and problems on symmetric coordinates across the x-axis and y-axis, reflected polygons, and shapes with symmetry axes.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τους κανόνες ανάκλασης (x, －y) και (－x, y) και τους άξονες συμμετρίας των σχημάτων."
      : "Outstanding performance! You have completely mastered the reflection rules (x, －y) and (－x, y) and the symmetry axes of shapes.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the detailed steps and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στους κανόνες συμμετρίας ως προς x'x και y'y!"
      : "Needs a bit more review on the reflection rules across the x-axis and y-axis!",
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

    // Q1: True / False - Βασικοί κανόνες ανάκλασης ως προς x'x και y'y
    const q1Pool = isEl
      ? [
          {
            p: "Το συμμετρικό ενός σημείου Μ(x, y) ως προς τον άξονα x'x έχει συντεταγμένες Μ₁(x, －y) (ίδια τετμημένη και αντίθετη τεταγμένη).",
            t: true,
            e: "Στη συμμετρία ως προς τον οριζόντιο άξονα x'x διατηρείται το x και αλλάζει πρόσημο το y: Μ(x, y) → Μ₁(x, －y)."
          },
          {
            p: "Το συμμετρικό ενός σημείου Μ(x, y) ως προς τον κατακόρυφο άξονα y'y έχει συντεταγμένες Μ₂(x, －y).",
            t: false,
            e: "Στη συμμετρία ως προς τον y'y διατηρείται η τεταγμένη y και αλλάζει πρόσημο η τετμημένη x: Μ(x, y) → Μ₂(－x, y)."
          },
          {
            p: "Ένα σημείο Κ(5, 0) που βρίσκεται πάνω στον άξονα x'x παραμένει αμετάβλητο στη συμμετρία ως προς τον x'x.",
            t: true,
            e: "Επειδή το Κ(5, 0) ανήκει στον άξονα x'x (y ＝ 0), το συμμετρικό του είναι το ίδιο το Κ(5, 0)."
          }
        ]
      : [
          {
            p: "The reflection of point M(x, y) across the x-axis (x'x) has coordinates M₁(x, －y) (same x-coordinate, opposite y-coordinate).",
            t: true,
            e: "Under reflection across the horizontal x-axis, x stays the same and y changes sign: M(x, y) → M₁(x, －y)."
          },
          {
            p: "The reflection of point M(x, y) across the vertical y-axis (y'y) has coordinates M₂(x, －y).",
            t: false,
            e: "Under reflection across the y-axis, y stays the same and x changes sign: M(x, y) → M₂(－x, y)."
          },
          {
            p: "A point K(5, 0) lying on the x-axis remains unchanged under reflection across the x-axis.",
            t: true,
            e: "Since K(5, 0) lies directly on the x-axis (y ＝ 0), its reflection is K(5, 0) itself."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Κανόνες Ανάκλασης στο Σύστημα Αξόνων' : 'Reflection Rules in the Coordinate System',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedQ1.e
    });

    // Q2: MCQ - Συμμετρικό σημείου Μ(x, y) ως προς x'x (+ SVG)
    const x2 = randNonZero(-5, 5);
    const y2 = randNonZero(-4, 4);
    const corr2 = fmtCoord(x2, -y2);
    const dist2 = [
      fmtCoord(x2, -y2),
      fmtCoord(-x2, y2),
      fmtCoord(-x2, -y2),
      fmtCoord(y2, x2),
      fmtCoord(-y2, -x2)
    ];

    qList.push({
      id: 2,
      title: isEl ? 'Συμμετρικό Σημείου ως προς Άξονα x\'x' : 'Point Reflection Across the x-Axis',
      prompt: isEl
        ? `Ποιες είναι οι συντεταγμένες του συμμετρικού του σημείου Μ${fmtCoord(x2, y2)} ως προς τον άξονα x'x;`
        : `What are the coordinates of the reflection of point M${fmtCoord(x2, y2)} across the x-axis (x'x)?`,
      type: 'mcq',
      correct: corr2,
      options: ensureFourUniqueOptions(corr2, () => pickRandom(dist2)),
      diagram: { type: 'coordPoint', x1: x2, y1: y2, x2: x2, y2: -y2, axis: 'x' },
      explanation: isEl
        ? `Ως προς τον άξονα x'x, η τετμημένη x ＝ ${fmtSigned(x2)} μένει ίδια και η τεταγμένη y ＝ ${fmtSigned(y2)} γίνεται αντίθετη (${fmtSigned(-y2)}), άρα παίρνουμε ${corr2}.`
        : `Across the x-axis, x ＝ ${fmtSigned(x2)} stays unchanged and y ＝ ${fmtSigned(y2)} becomes opposite (${fmtSigned(-y2)}), giving ${corr2}.`
    });

    // Q3: MCQ - Συμμετρικό σημείου Μ(x, y) ως προς y'y (+ SVG)
    const x3 = randNonZero(-5, 5);
    const y3 = randNonZero(-4, 4);
    const corr3 = fmtCoord(-x3, y3);
    const dist3 = [
      fmtCoord(-x3, y3),
      fmtCoord(x3, -y3),
      fmtCoord(-x3, -y3),
      fmtCoord(y3, x3),
      fmtCoord(-y3, x3)
    ];

    qList.push({
      id: 3,
      title: isEl ? 'Συμμετρικό Σημείου ως προς Άξονα y\'y' : 'Point Reflection Across the y-Axis',
      prompt: isEl
        ? `Ποιες είναι οι συντεταγμένες του συμμετρικού του σημείου Α${fmtCoord(x3, y3)} ως προς τον άξονα y'y;`
        : `What are the coordinates of the reflection of point A${fmtCoord(x3, y3)} across the y-axis (y'y)?`,
      type: 'mcq',
      correct: corr3,
      options: ensureFourUniqueOptions(corr3, () => pickRandom(dist3)),
      diagram: {
        type: 'coordPoint',
        x1: x3,
        y1: y3,
        x2: -x3,
        y2: y3,
        axis: 'y',
        lbl1: isEl ? `Α${fmtCoord(x3, y3)}` : `A${fmtCoord(x3, y3)}`,
        lbl2: isEl ? `Α'${fmtCoord(-x3, y3)}` : `A'${fmtCoord(-x3, y3)}`
      },
      explanation: isEl
        ? `Ως προς τον άξονα y'y, η τεταγμένη y ＝ ${fmtSigned(y3)} μένει ίδια και η τετμημένη x ＝ ${fmtSigned(x3)} γίνεται αντίθετη (${fmtSigned(-x3)}), άρα παίρνουμε ${corr3}.`
        : `Across the y-axis, y ＝ ${fmtSigned(y3)} stays unchanged and x ＝ ${fmtSigned(x3)} becomes opposite (${fmtSigned(-x3)}), giving ${corr3}.`
    });

    // Q4: MCQ - Αναγνώριση άξονα συμμετρίας από ζεύγος σημείων Ρ και Ρ'
    const isAxisX4 = Math.random() < 0.5;
    const x4 = randNonZero(2, 6);
    const y4 = randNonZero(2, 5);
    const p1_4 = fmtCoord(x4, y4);
    const p2_4 = isAxisX4 ? fmtCoord(x4, -y4) : fmtCoord(-x4, y4);
    const corr4 = isEl
      ? isAxisX4
        ? "Ο άξονας x'x"
        : "Ο άξονας y'y"
      : isAxisX4
      ? 'The x-axis (x\'x)'
      : 'The y-axis (y\'y)';

    const dist4 = isEl
      ? ["Ο άξονας x'x", "Ο άξονας y'y", 'Η αρχή των αξόνων Ο(0, 0)', 'Δεν είναι συμμετρικά']
      : ['The x-axis (x\'x)', 'The y-axis (y\'y)', 'The origin O(0, 0)', 'They are not symmetric'];

    qList.push({
      id: 4,
      title: isEl ? 'Αναγνώριση Άξονα Συμμετρίας' : 'Identifying the Axis of Symmetry',
      prompt: isEl
        ? `Τα σημεία Ρ${p1_4} και Ρ'${p2_4} είναι συμμετρικά ως προς έναν από τους άξονες των συντεταγμένων. Ποιος είναι ο άξονας συμμετρίας;`
        : `Points P${p1_4} and P'${p2_4} are symmetric across one of the coordinate axes. Which axis is the axis of symmetry?`,
      type: 'mcq',
      correct: corr4,
      options: ensureFourUniqueOptions(corr4, () => pickRandom(dist4)),
      explanation: isAxisX4
        ? (isEl
            ? `Τα σημεία ${p1_4} και ${p2_4} έχουν ίδια τετμημένη (${x4}) και αντίθετες τεταγμένες (${y4} και －${y4}), άρα είναι συμμετρικά ως προς τον άξονα x'x.`
            : `Points ${p1_4} and ${p2_4} have the same x-coordinate (${x4}) and opposite y-coordinates (${y4} and －${y4}), so they are symmetric across the x-axis.`)
        : (isEl
            ? `Τα σημεία ${p1_4} και ${p2_4} έχουν ίδια τεταγμένη (${y4}) και αντίθετες τετμημένες (${x4} και －${x4}), άρα είναι συμμετρικά ως προς τον άξονα y'y.`
            : `Points ${p1_4} and ${p2_4} have the same y-coordinate (${y4}) and opposite x-coordinates (${x4} and －${x4}), so they are symmetric across the y-axis.`)
    });

    // Q5: True / False - Αναδίπλωση (δίπλωμα) σχημάτων στους άξονες συμμετρίας
    const tfPool5 = isEl
      ? [
          {
            p: 'Αν διπλώσουμε ένα ορθογώνιο κατά μήκος της μεσοκαθέτου των απέναντι πλευρών του, το ένα μισό πέφτει και καλύπτει ακριβώς το άλλο μισό.',
            t: true,
            e: 'Οι δύο μεσοκάθετοι των απέναντι πλευρών του ορθογωνίου είναι άξονες συμμετρίας του, οπότε το δίπλωμα οδηγεί σε πλήρη επικάλυψη.'
          },
          {
            p: 'Αν διπλώσουμε ένα γενικό παραλληλόγραμμο κατά μήκος μιας διαγωνίου του, τα δύο μέρη συμπίπτουν απόλυτα.',
            t: false,
            e: 'Το γενικό παραλληλόγραμμο έχει 0 άξονες συμμετρίας: το δίπλωμα κατά μήκος διαγωνίου δεν ταυτίζει τις κορυφές του.'
          },
          {
            p: 'Ένα ισοσκελές τραπέζιο διπλώνει συμμετρικά κατά μήκος της κοινής μεσοκαθέτου των δύο παράλληλων βάσεών του.',
            t: true,
            e: 'Η κοινή μεσοκάθετος των βάσεων είναι ο μοναδικός άξονας συμμετρίας του ισοσκελούς τραπεζίου.'
          }
        ]
      : [
          {
            p: 'If we fold a rectangle along the perpendicular bisector of a pair of opposite sides, one half covers the other half completely.',
            t: true,
            e: 'The two perpendicular bisectors of opposite sides of a rectangle are axes of symmetry, producing an exact overlap.'
          },
          {
            p: 'If we fold a general parallelogram along one of its diagonals, the two halves match completely.',
            t: false,
            e: 'A general parallelogram has 0 axes of symmetry: folding along a diagonal does not align its vertices.'
          },
          {
            p: 'An isosceles trapezoid folds symmetrically along the common perpendicular bisector of its two parallel bases.',
            t: true,
            e: 'The common perpendicular bisector of the bases is the unique axis of symmetry of an isosceles trapezoid.'
          }
        ];

    const pickedTf5 = pickRandom(tfPool5);
    qList.push({
      id: 5,
      title: isEl ? 'Αναδίπλωση Σχημάτων (Folding)' : 'Folding Shapes Along Symmetry Axes',
      prompt: pickedTf5.p,
      type: 'tf',
      correct: pickedTf5.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedTf5.e
    });

    // Q6: MCQ - Πλήθος αξόνων συμμετρίας κατά την αναδίπλωση (+ SVG)
    const foldShapePool6 = isEl
      ? [
          {
            q: 'Πόσους διαφορετικούς άξονες συμμετρίας έχει ένα τετράγωνο (ώστε το δίπλωμα να δίνει 100% επικάλυψη);',
            c: '4 άξονες (2 μεσοκάθετοι πλευρών & 2 διαγώνιοι)',
            sh: 'square',
            cap: 'Τετράγωνο: 4 άξονες συμμετρίας',
            e: 'Το τετράγωνο διπλώνει συμμετρικά σε 4 άξονες: τις 2 μεσοκαθέτους των πλευρών και τις 2 διαγωνίους του.'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ορθογώνιο (που δεν είναι τετράγωνο);',
            c: '2 άξονες (τις 2 μεσοκαθέτους των απέναντι πλευρών)',
            sh: 'rect',
            cap: 'Ορθογώνιο: 2 άξονες συμμετρίας',
            e: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (τις μεσοκαθέτους των πλευρών του — όχι τις διαγωνίους).'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τραπέζιο;',
            c: '1 άξονα (την κοινή μεσοκάθετο των βάσεων)',
            sh: 'isoTrap',
            cap: 'Ισοσκελές Τραπέζιο: 1 άξονας συμμετρίας',
            e: 'Το ισοσκελές τραπέζιο έχει 1 άξονα συμμετρίας: την κοινή μεσοκάθετο των δύο βάσεων.'
          }
        ]
      : [
          {
            q: 'How many distinct axes of symmetry does a square have (giving 100% overlap when folded)?',
            c: '4 axes (2 perpendicular bisectors & 2 diagonals)',
            sh: 'square',
            cap: 'Square: 4 axes of symmetry',
            e: 'A square folds symmetrically along 4 axes: the 2 perpendicular bisectors of opposite sides and its 2 diagonals.'
          },
          {
            q: 'How many axes of symmetry does a non-square rectangle have?',
            c: '2 axes (the 2 perpendicular bisectors of opposite sides)',
            sh: 'rect',
            cap: 'Rectangle: 2 axes of symmetry',
            e: 'A rectangle has 2 axes of symmetry (the perpendicular bisectors of opposite sides — not the diagonals).'
          },
          {
            q: 'How many axes of symmetry does an isosceles trapezoid have?',
            c: '1 axis (the common perpendicular bisector of the bases)',
            sh: 'isoTrap',
            cap: 'Isosceles Trapezoid: 1 axis of symmetry',
            e: 'An isosceles trapezoid has 1 axis of symmetry: the common perpendicular bisector of its bases.'
          }
        ];

    const pickedFold6 = pickRandom(foldShapePool6);
    const dist6 = isEl
      ? [
          '4 άξονες (2 μεσοκάθετοι πλευρών & 2 διαγώνιοι)',
          '2 άξονες (τις 2 μεσοκαθέτους των απέναντι πλευρών)',
          '1 άξονα (την κοινή μεσοκάθετο των βάσεων)',
          '0 άξονες συμμετρίας',
          '3 άξονες συμμετρίας'
        ]
      : [
          '4 axes (2 perpendicular bisectors & 2 diagonals)',
          '2 axes (the 2 perpendicular bisectors of opposite sides)',
          '1 axis (the common perpendicular bisector of the bases)',
          '0 axes of symmetry',
          '3 axes of symmetry'
        ];

    qList.push({
      id: 6,
      title: isEl ? 'Άξονες Συμμετρίας Βασικών Σχημάτων' : 'Axes of Symmetry of Basic Shapes',
      prompt: pickedFold6.q,
      type: 'mcq',
      correct: pickedFold6.c,
      options: ensureFourUniqueOptions(pickedFold6.c, () => pickRandom(dist6)),
      diagram: { type: 'foldingShape', shape: pickedFold6.sh, caption: pickedFold6.cap },
      explanation: pickedFold6.e
    });

    // Q7: Input - Απόσταση ανάμεσα σε σημείο Μ(x, y) και το συμμετρικό του Μ₁(x, -y) ως προς x'x (+ SVG)
    const x7 = randNonZero(-5, 5);
    const absY7 = randInt(2, 7);
    const y7 = Math.random() < 0.5 ? absY7 : -absY7;
    const dist7 = 2 * absY7;

    qList.push({
      id: 7,
      title: isEl ? 'Απόσταση Συμμετρικών Σημείων ως προς x\'x' : 'Distance Between Symmetric Points Across x\'x',
      prompt: isEl
        ? `Το σημείο Μ₁ είναι το συμμετρικό του σημείου Μ${fmtCoord(x7, y7)} ως προς τον άξονα x'x. Πόσες μονάδες μήκους είναι η απόσταση ΜΜ₁;`
        : `Point M₁ is the reflection of point M${fmtCoord(x7, y7)} across the x-axis (x'x). What is the distance MM₁ in units?`,
      type: 'input',
      correct: dist7,
      unit: isEl ? 'μονάδες' : 'units',
      diagram: { type: 'coordPoint', x1: x7, y1: Math.min(4, Math.max(-4, y7)), x2: x7, y2: Math.min(4, Math.max(-4, -y7)), axis: 'x' },
      explanation: isEl
        ? `Το σημείο Μ${fmtCoord(x7, y7)} απέχει ${absY7} μονάδες από τον άξονα x'x, και το συμμετρικό του Μ₁${fmtCoord(x7, -y7)} απέχει επίσης ${absY7} μονάδες. Άρα ΜΜ₁ ＝ 2 · ${absY7} ＝ ${dist7} μονάδες.`
        : `Point M${fmtCoord(x7, y7)} is ${absY7} units from the x-axis, and its reflection M₁${fmtCoord(x7, -y7)} is also ${absY7} units away. Thus MM₁ ＝ 2 · ${absY7} ＝ ${dist7} units.`
    });

    // Q8: Input - Απόσταση ανάμεσα σε σημείο Α(x, y) και το συμμετρικό του Α₂(-x, y) ως προς y'y (+ SVG)
    const absX8 = randInt(2, 8);
    const x8 = Math.random() < 0.5 ? absX8 : -absX8;
    const y8 = randNonZero(-4, 4);
    const dist8 = 2 * absX8;

    qList.push({
      id: 8,
      title: isEl ? 'Απόσταση Συμμετρικών Σημείων ως προς y\'y' : 'Distance Between Symmetric Points Across y\'y',
      prompt: isEl
        ? `Το σημείο Α₂ είναι το συμμετρικό του σημείου Α${fmtCoord(x8, y8)} ως προς τον άξονα y'y. Πόσες μονάδες μήκους είναι η απόσταση ΑΑ₂;`
        : `Point A₂ is the reflection of point A${fmtCoord(x8, y8)} across the y-axis (y'y). What is the distance AA₂ in units?`,
      type: 'input',
      correct: dist8,
      unit: isEl ? 'μονάδες' : 'units',
      diagram: {
        type: 'coordPoint',
        x1: Math.min(5, Math.max(-5, x8)),
        y1: y8,
        x2: Math.min(5, Math.max(-5, -x8)),
        y2: y8,
        axis: 'y',
        lbl1: isEl ? `Α${fmtCoord(x8, y8)}` : `A${fmtCoord(x8, y8)}`,
        lbl2: isEl ? `Α₂${fmtCoord(-x8, y8)}` : `A₂${fmtCoord(-x8, y8)}`
      },
      explanation: isEl
        ? `Το σημείο Α${fmtCoord(x8, y8)} απέχει ${absX8} μονάδες από τον άξονα y'y, και το συμμετρικό του Α₂${fmtCoord(-x8, y8)} απέχει επίσης ${absX8} μονάδες. Άρα ΑΑ₂ ＝ 2 · ${absX8} ＝ ${dist8} μονάδες.`
        : `Point A${fmtCoord(x8, y8)} is ${absX8} units from the y-axis, and its reflection A₂${fmtCoord(-x8, y8)} is also ${absX8} units away. Thus AA₂ ＝ 2 · ${absX8} ＝ ${dist8} units.`
    });

    // Q9: MCQ + tableData + SVG - Συμμετρικό τρίγωνο στο Καρτεσιανό Επίπεδο (κορυφές ως προς x'x ή y'y)
    const refAxis9 = Math.random() < 0.5 ? 'x' : 'y';
    const A9 = [1, 1];
    const B9 = [4, 1];
    const C9 = [3, 4];

    const mapPt9 = ([x, y]) => (refAxis9 === 'x' ? [x, -y] : [-x, y]);
    const Ap9 = mapPt9(A9);
    const Bp9 = mapPt9(B9);
    const Cp9 = mapPt9(C9);

    const q9Correct = `Α'${fmtCoord(Ap9[0], Ap9[1])}, Β'${fmtCoord(Bp9[0], Bp9[1])}, Γ'${fmtCoord(Cp9[0], Cp9[1])}`;
    const q9Distractors = [
      `Α'${fmtCoord(Ap9[0], Ap9[1])}, Β'${fmtCoord(Bp9[0], Bp9[1])}, Γ'${fmtCoord(Cp9[0], Cp9[1])}`,
      `Α'${fmtCoord(-Ap9[0], -Ap9[1])}, Β'${fmtCoord(-Bp9[0], -Bp9[1])}, Γ'${fmtCoord(-Cp9[0], -Cp9[1])}`,
      `Α'${fmtCoord(-A9[0], -A9[1])}, Β'${fmtCoord(-B9[0], -B9[1])}, Γ'${fmtCoord(-C9[0], -C9[1])}`,
      `Α'${fmtCoord(A9[1], A9[0])}, Β'${fmtCoord(B9[1], B9[0])}, Γ'${fmtCoord(C9[1], C9[0])}`
    ];

    qList.push({
      id: 9,
      title: isEl ? 'Συμμετρικό Τρίγωνο στο Σύστημα Αξόνων' : 'Reflected Triangle in the Coordinate Plane',
      prompt: isEl
        ? `Δίνεται τρίγωνο ΑΒΓ με κορυφές Α(1, 1), Β(4, 1) και Γ(3, 4). Ποιες είναι οι κορυφές Α', Β', Γ' του συμμετρικού του τριγώνου ως προς τον άξονα ${refAxis9 === 'x' ? "x'x" : "y'y"};`
        : `Given triangle ABC with vertices A(1, 1), B(4, 1), and C(3, 4), what are the vertices A', B', C' of its reflection across the ${refAxis9 === 'x' ? "x-axis (x'x)" : "y-axis (y'y)"}?`,
      type: 'mcq',
      correct: q9Correct,
      options: ensureFourUniqueOptions(q9Correct, () => pickRandom(q9Distractors)),
      diagram: {
        type: 'coordTriangle',
        axis: refAxis9,
        origPts: [A9, B9, C9],
        symPts: [Ap9, Bp9, Cp9],
        caption: isEl ? `Ανάκλαση ως προς ${refAxis9 === 'x' ? "x'x" : "y'y"}` : `Reflection across ${refAxis9 === 'x' ? 'x-axis' : 'y-axis'}`
      },
      tableData: [
        {
          label: isEl ? '1. Κανόνας ανάκλασης' : '1. Reflection rule',
          details: refAxis9 === 'x' ? "Μ(x, y) ──▶ Μ'(x, －y)" : "Μ(x, y) ──▶ Μ'(－x, y)"
        },
        {
          label: isEl ? '2. Εφαρμογή στις κορυφές' : '2. Applying to vertices',
          details: q9Correct
        }
      ],
      explanation: isEl
        ? `Εφαρμόζουμε τον κανόνα ${refAxis9 === 'x' ? '(x, y) → (x, －y)' : '(x, y) → (－x, y)'} σε καθεμία από τις τρεις κορυφές Α(1, 1), Β(4, 1), Γ(3, 4) και παίρνουμε: ${q9Correct}.`
        : `Applying the rule ${refAxis9 === 'x' ? '(x, y) → (x, －y)' : '(x, y) → (－x, y)'} to each vertex A(1, 1), B(4, 1), C(3, 4) yields: ${q9Correct}.`
    });

    // Q10: Input + tableData + SVG - Περίμετρος ορθογωνίου που σχηματίζεται από συμμετρικές κορυφές
    const a10 = randInt(2, 5);
    const b10 = randInt(2, 4);
    const width10 = 2 * a10;
    const height10 = 2 * b10;
    const perim10 = 2 * (width10 + height10);

    qList.push({
      id: 10,
      title: isEl ? 'Ορθογώνιο από Συμμετρικές Κορυφές' : 'Rectangle Formed by Symmetric Vertices',
      prompt: isEl
        ? `Δίνεται το σημείο Α${fmtCoord(a10, b10)}. Βρίσκουμε το συμμετρικό του Β ως προς τον άξονα y'y, το συμμετρικό του Δ ως προς τον άξονα x'x και το σημείο Γ${fmtCoord(-a10, -b10)}. Πόσες μονάδες μήκους είναι η περίμετρος του ορθογωνίου ΑΒΓΔ;`
        : `Given point A${fmtCoord(a10, b10)}, let B be its reflection across the y-axis, D be its reflection across the x-axis, and C be ${fmtCoord(-a10, -b10)}. What is the perimeter of rectangle ABCD in units?`,
      type: 'input',
      correct: perim10,
      unit: isEl ? 'μονάδες' : 'units',
      diagram: {
        type: 'coordTriangle',
        axis: 'y',
        origPts: [[a10, b10], [-a10, b10], [-a10, -b10], [a10, -b10]],
        symPts: [[a10, b10], [-a10, b10], [-a10, -b10], [a10, -b10]],
        caption: isEl ? `Πλευρές ${width10} και ${height10} μονάδες` : `Sides ${width10} and ${height10} units`
      },
      tableData: [
        {
          label: isEl ? '1. Οριζόντια πλευρά ΑΒ' : '1. Horizontal side AB',
          details: `Α${fmtCoord(a10, b10)} & Β${fmtCoord(-a10, b10)} ⇒ ΑΒ ＝ 2 · ${a10} ＝ ${width10}`
        },
        {
          label: isEl ? '2. Κατακόρυφη πλευρά ΑΔ' : '2. Vertical side AD',
          details: `Α${fmtCoord(a10, b10)} & Δ${fmtCoord(a10, -b10)} ⇒ ΑΔ ＝ 2 · ${b10} ＝ ${height10}`
        },
        {
          label: isEl ? '3. Περίμετρος ορθογωνίου' : '3. Perimeter of rectangle',
          details: `Π ＝ 2 · (${width10} ＋ ${height10}) ＝ ${perim10}`
        }
      ],
      explanation: isEl
        ? `Η οριζόντια πλευρά ΑΒ έχει μήκος 2 · ${a10} ＝ ${width10} μονάδες και η κατακόρυφη ΑΔ έχει μήκος 2 · ${b10} ＝ ${height10} μονάδες. Άρα Π ＝ 2 · (${width10} ＋ ${height10}) ＝ ${perim10} μονάδες.`
        : `Horizontal side AB has length 2 · ${a10} ＝ ${width10} units and vertical side AD has length 2 · ${b10} ＝ ${height10} units. Thus P ＝ 2 · (${width10} ＋ ${height10}) ＝ ${perim10} units.`
    });

    // Q11: MCQ + tableData + SVG - Διαδοχική συμμετρία (πρώτα ως προς x'x και μετά ως προς y'y)
    const x11 = randNonZero(-4, 4);
    const y11 = randNonZero(-3, 3);
    const q11Correct = `Μ₁${fmtCoord(x11, -y11)} και Μ₂${fmtCoord(-x11, -y11)}`;
    const q11Distractors = [
      `Μ₁${fmtCoord(x11, -y11)} και Μ₂${fmtCoord(-x11, -y11)}`,
      `Μ₁${fmtCoord(-x11, y11)} και Μ₂${fmtCoord(-x11, -y11)}`,
      `Μ₁${fmtCoord(x11, -y11)} και Μ₂${fmtCoord(x11, y11)}`,
      `Μ₁${fmtCoord(-x11, -y11)} και Μ₂${fmtCoord(x11, -y11)}`
    ];

    qList.push({
      id: 11,
      title: isEl ? 'Διαδοχικές Ανακλάσεις (x\'x και μετά y\'y)' : 'Successive Reflections (x-Axis then y-Axis)',
      prompt: isEl
        ? `Δίνεται το σημείο Μ${fmtCoord(x11, y11)}. Βρίσκουμε πρώτα το συμμετρικό του Μ₁ ως προς τον άξονα x'x και στη συνέχεια το συμμετρικό Μ₂ του Μ₁ ως προς τον άξονα y'y. Ποιες είναι οι συντεταγμένες των σημείων Μ₁ και Μ₂;`
        : `Given point M${fmtCoord(x11, y11)}, first find its reflection M₁ across the x-axis, and then find the reflection M₂ of M₁ across the y-axis. What are the coordinates of M₁ and M₂?`,
      type: 'mcq',
      correct: q11Correct,
      options: ensureFourUniqueOptions(q11Correct, () => pickRandom(q11Distractors)),
      diagram: {
        type: 'coordPoint',
        x1: x11,
        y1: -y11,
        x2: -x11,
        y2: -y11,
        axis: 'y',
        lbl1: `Μ₁${fmtCoord(x11, -y11)}`,
        lbl2: `Μ₂${fmtCoord(-x11, -y11)}`
      },
      tableData: [
        {
          label: isEl ? '1. Ανάκλαση ως προς x\'x' : '1. Reflection across x-axis',
          details: `Μ${fmtCoord(x11, y11)} ──▶ Μ₁${fmtCoord(x11, -y11)}`
        },
        {
          label: isEl ? '2. Ανάκλαση Μ₁ ως προς y\'y' : '2. Reflection of M₁ across y-axis',
          details: `Μ₁${fmtCoord(x11, -y11)} ──▶ Μ₂${fmtCoord(-x11, -y11)}`
        }
      ],
      explanation: isEl
        ? `Πρώτα αλλάζουμε το πρόσημο του y (Μ₁${fmtCoord(x11, -y11)}) και έπειτα αλλάζουμε το πρόσημο του x (Μ₂${fmtCoord(-x11, -y11)}).`
        : `First negate y to get M₁${fmtCoord(x11, -y11)}, then negate x to get M₂${fmtCoord(-x11, -y11)}.`
    });

    // Q12: Input + tableData + SVG - Εύρεση άγνωστης συντεταγμένης από συμμετρικά σημεία
    const k12 = randInt(2, 7);
    const y12 = randNonZero(-5, 5);

    qList.push({
      id: 12,
      title: isEl ? 'Εύρεση Συντεταγμένης από Συμμετρία' : 'Finding Unknown Coordinate from Symmetry',
      prompt: isEl
        ? `Τα σημεία Α(－${k12}, ${y12}) και Β(α, ${y12}) είναι συμμετρικά ως προς τον άξονα y'y. Ποια είναι η τιμή του αριθμού α;`
        : `Points A(－${k12}, ${y12}) and B(a, ${y12}) are symmetric across the y-axis (y'y). What is the value of a?`,
      type: 'input',
      correct: k12,
      unit: '',
      diagram: {
        type: 'coordPoint',
        x1: -Math.min(5, k12),
        y1: Math.min(4, Math.max(-4, y12)),
        x2: Math.min(5, k12),
        y2: Math.min(4, Math.max(-4, y12)),
        axis: 'y',
        lbl1: `Α(－${k12}, ${y12})`,
        lbl2: `Β(${k12}, ${y12})`
      },
      tableData: [
        {
          label: isEl ? '1. Κριτήριο συμμετρίας y\'y' : '1. y-axis symmetry criterion',
          details: isEl
            ? 'Τα συμμετρικά ως προς y\'y έχουν αντίθετες τετμημένες'
            : 'Points symmetric across y-axis have opposite x-coordinates'
        },
        {
          label: isEl ? '2. Υπολογισμός του α' : '2. Finding a',
          details: `α ＝ －(－${k12}) ＝ ${k12}`
        }
      ],
      explanation: isEl
        ? `Επειδή τα Α και Β είναι συμμετρικά ως προς τον y'y, έχουν αντίθετες τετμημένες, άρα α ＝ －(－${k12}) ＝ ${k12}.`
        : `Since A and B are symmetric across the y-axis, their x-coordinates are opposites, so a ＝ －(－${k12}) ＝ ${k12}.`
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

  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou/49-simmetria-sistima-aksonon"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/49-simmetria-sistima-aksonon"
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
                                      <td className="p-2 sm:p-2.5 font-mono text-indigo-900 break-words [overflow-wrap:anywhere] align-top leading-relaxed">{row.details}</td>
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
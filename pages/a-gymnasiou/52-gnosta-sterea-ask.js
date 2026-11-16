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

  // 1. Κύβος / Ορθογώνιο Παραλληλεπίπεδο με διαγώνιο
  if (diagram.type === 'cuboid') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Πίσω έδρα */}
          <rect x="96" y="28" width="96" height="62" fill="none" stroke="#475569" strokeWidth="1.3" strokeDasharray="3 3" />
          {/* Μπροστινή έδρα */}
          <rect x="64" y="52" width="96" height="62" fill="rgba(99, 102, 241, 0.24)" stroke="#818cf8" strokeWidth="1.8" />
          {/* Ακμές βάθους */}
          <line x1="64" y1="52" x2="96" y2="28" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="160" y1="52" x2="192" y2="28" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="160" y1="114" x2="192" y2="90" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="64" y1="114" x2="96" y2="90" stroke="#475569" strokeWidth="1.3" strokeDasharray="3 3" />
          {/* Διαγώνιος στερεού ή έδρας */}
          {diagram.showSpaceDiag && (
            <line x1="64" y1="114" x2="192" y2="28" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
          )}
          {diagram.showFaceDiag && (
            <line x1="64" y1="114" x2="160" y2="52" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
          )}
          <text x="132" y="148" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Πυραμίδα με βάση n-γωνο
  if (diagram.type === 'pyramid') {
    const n = diagram.n || 4;
    const cx = 132;
    const baseCy = 116;
    const apex = { x: 132, y: 26 };
    const rx = 52;
    const ry = 17;

    const basePts = [];
    for (let i = 0; i < n; i++) {
      const theta = -Math.PI / 2 + (2 * Math.PI * i) / n + (n === 4 ? Math.PI / 4 : 0);
      basePts.push({
        x: Number((cx + rx * Math.cos(theta)).toFixed(1)),
        y: Number((baseCy + ry * Math.sin(theta)).toFixed(1))
      });
    }

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <polygon
            points={basePts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#34d399"
            strokeWidth="1.8"
          />
          {basePts.map((bp, idx) => (
            <line
              key={`pe-${idx}`}
              x1={apex.x}
              y1={apex.y}
              x2={bp.x}
              y2={bp.y}
              stroke="#818cf8"
              strokeWidth="1.6"
            />
          ))}
          {basePts.map((p, idx) => (
            <circle key={`pv-${idx}`} cx={p.x} cy={p.y} r="3" fill="#34d399" />
          ))}
          <circle cx={apex.x} cy={apex.y} r="4" fill="#fbbf24" />
          <text x="132" y="154" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Ανάπτυγμα Κύβου / Τετραέδρου
  if (diagram.type === 'net') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {diagram.shape === 'cubeNet' ? (
            <g transform="translate(82, 22)">
              {/* Σταυρός 6 τετραγώνων */}
              <rect x="26" y="0" width="26" height="26" fill="rgba(245, 158, 11, 0.35)" stroke="#fbbf24" strokeWidth="1.5" />
              <rect x="0" y="26" width="26" height="26" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" strokeWidth="1.5" />
              <rect x="26" y="26" width="26" height="26" fill="rgba(99, 102, 241, 0.4)" stroke="#818cf8" strokeWidth="1.5" />
              <rect x="52" y="26" width="26" height="26" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" strokeWidth="1.5" />
              <rect x="26" y="52" width="26" height="26" fill="rgba(14, 165, 233, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
              <rect x="26" y="78" width="26" height="26" fill="rgba(14, 165, 233, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
          ) : (
            <g transform="translate(86, 24)">
              {/* Ανάπτυγμα κανονικού τετραέδρου (4 ισόπλευρα τρίγωνα) */}
              <polygon points="46,12 22,54 70,54" fill="rgba(16, 185, 129, 0.3)" stroke="#34d399" strokeWidth="1.5" />
              <polygon points="22,54 70,54 46,96" fill="rgba(99, 102, 241, 0.4)" stroke="#818cf8" strokeWidth="1.5" />
              <polygon points="22,54 -2,96 46,96" fill="rgba(245, 158, 11, 0.3)" stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points="70,54 46,96 94,96" fill="rgba(14, 165, 233, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
            </g>
          )}
          <text x="132" y="152" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function GnostaStereaExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Κύβος, Παραλληλεπίπεδο, Πυραμίδα & Τετράεδρο | Α' Γυμνασίου" : "Exercises: Cube, Parallelepiped, Pyramid & Tetrahedron | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στον κύβο και τις διαγωνίους του, το ορθογώνιο παραλληλεπίπεδο, την πυραμίδα, το κανονικό τετράεδρο και τα αναπτύγματα στερεών."
      : "Interactive Grade 7 geometry exercises on the cube and its diagonals, rectangular parallelepiped, pyramid, regular tetrahedron, and nets of solids.",
    backNav: isEl ? "Θεωρία Κεφ. 14" : "Theory Ch. 14",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 14 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 14 • GRADE 7",
    heroTitle: isEl ? "Γνωστά Στερεά & Αναπτύγματα: Εξάσκηση" : "Familiar Solids & Nets: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στον κύβο, τις διαγωνίους, το ορθογώνιο παραλληλεπίπεδο, την πυραμίδα, το κανονικό τετράεδρο και τα αναπτύγματα."
      : "12 dynamic questions and problems on the cube, diagonals, rectangular parallelepiped, pyramid, regular tetrahedron, and solid nets.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τα στοιχεία του κύβου, του ορθογωνίου παραλληλεπιπέδου, της πυραμίδας, του κανονικού τετραέδρου και των αναπτυγμάτων."
      : "Outstanding performance! You have mastered the elements of the cube, rectangular parallelepiped, pyramid, regular tetrahedron, and solid nets.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τους πίνακες ανάλυσης και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the step-by-step tables and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στους τύπους ακμών/εδρών της πυραμίδας (2n, n＋1) και στις διαγωνίους του κύβου!"
      : "Needs a bit more review on pyramid edge/face formulas (2n, n＋1) and cube diagonals!",
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

    // Q1: True / False - Διαγώνιοι κύβου & ορθογωνίου παραλληλεπιπέδου
    const q1Pool = isEl
      ? [
          {
            p: "Ένας κύβος έχει συνολικά 12 διαγωνίους εδρών και 4 εσωτερικές διαγωνίους (διαγωνίους του κύβου).",
            t: true,
            e: "Κάθε μία από τις 6 τετραγωνικές έδρες έχει 2 διαγωνίους (6 · 2 ＝ 12), ενώ υπάρχουν 4 εσωτερικές διαγώνιοι που ενώνουν απέναντι κορυφές."
          },
          {
            p: "Οι 4 διαγώνιοι ενός ορθογωνίου παραλληλεπιπέδου είναι ίσες μεταξύ τους και τέμνονται στο μέσο τους.",
            t: true,
            e: "Σε κάθε ορθογώνιο παραλληλεπίπεδο (και στον κύβο) οι 4 εσωτερικές διαγώνιοι έχουν ίσο μήκος και διχοτομούνται."
          },
          {
            p: "Ο κύβος έχει 6 διαγωνίους στο εσωτερικό του (μία για κάθε έδρα).",
            t: false,
            e: "Ο κύβος έχει 8 κορυφές που σχηματίζουν 4 ζεύγη απέναντι κορυφών, άρα έχει 4 εσωτερικές διαγωνίους (και 12 διαγωνίους εδρών)."
          }
        ]
      : [
          {
            p: "A cube has 12 face diagonals and 4 space (internal) diagonals in total.",
            t: true,
            e: "Each of the 6 square faces has 2 diagonals (6 · 2 ＝ 12), while 4 space diagonals join opposite vertices through the interior."
          },
          {
            p: "The 4 space diagonals of a rectangular parallelepiped are equal in length and bisect each other.",
            t: true,
            e: "In every rectangular parallelepiped (including the cube), all 4 space diagonals are congruent and intersect at their midpoints."
          },
          {
            p: "A cube has 6 internal space diagonals (one for each face).",
            t: false,
            e: "A cube has 8 vertices forming 4 pairs of opposite vertices, so it has 4 internal space diagonals (and 12 face diagonals)."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Διαγώνιοι Κύβου & Παραλληλεπιπέδου' : 'Diagonals of Cube & Parallelepiped',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'cuboid',
        showSpaceDiag: true,
        showFaceDiag: true,
        caption: isEl ? '12 διαγώνιοι εδρών & 4 διαγώνιοι στερεού' : '12 face diagonals & 4 space diagonals'
      },
      explanation: pickedQ1.e
    });

    // Q2: MCQ - Ιδιότητες ορθογωνίου παραλληλεπιπέδου
    const q2Pool = isEl
      ? [
          {
            q: "Πόσα ζεύγη ίσων και παράλληλων εδρών έχει ένα ορθογώνιο παραλληλεπίπεδο;",
            c: "3 ζεύγη ίσων ορθογωνίων (6 έδρες συνολικά)",
            e: "Το ορθογώνιο παραλληλεπίπεδο έχει 6 ορθογώνιες έδρες, που χωρίζονται σε 3 ζεύγη απέναντι ίσων και παράλληλων εδρών."
          },
          {
            q: "Πώς ομαδοποιούνται οι 12 ακμές ενός ορθογωνίου παραλληλεπιπέδου διαστάσεων α, β, γ;",
            c: "Σε 3 τετράδες ίσων ακμών (4α, 4β και 4γ)",
            e: "Κάθε διάσταση (μήκος α, πλάτος β, ύψος γ) εμφανίζεται σε 4 παράλληλες και ίσες ακμές: 4α ＋ 4β ＋ 4γ."
          },
          {
            q: "Πότε ένα ορθογώνιο παραλληλεπίπεδο είναι κύβος;",
            c: "Όταν και οι 12 ακμές του είναι ίσες (α ＝ β ＝ γ)",
            e: "Ο κύβος είναι ειδική περίπτωση ορθογωνίου παραλληλεπιπέδου με ίσες διαστάσεις α ＝ β ＝ γ (6 τετραγωνικές έδρες)."
          }
        ]
      : [
          {
            q: "How many pairs of congruent parallel faces does a rectangular parallelepiped have?",
            c: "3 pairs of congruent rectangles (6 faces total)",
            e: "A rectangular parallelepiped has 6 rectangular faces grouped into 3 opposite congruent parallel pairs."
          },
          {
            q: "How are the 12 edges of a rectangular parallelepiped of dimensions a, b, c grouped?",
            c: "Into 3 groups of 4 equal edges (4a, 4b, and 4c)",
            e: "Each dimension (length a, width b, height c) appears along 4 equal parallel edges: 4a ＋ 4b ＋ 4c."
          },
          {
            q: "When is a rectangular parallelepiped a cube?",
            c: "When all 12 of its edges are equal (a ＝ b ＝ c)",
            e: "A cube is a special rectangular parallelepiped with equal dimensions a ＝ b ＝ c (6 square faces)."
          }
        ];

    const pickedQ2 = pickRandom(q2Pool);
    const dist2 = isEl
      ? [
          "3 ζεύγη ίσων ορθογωνίων (6 έδρες συνολικά)",
          "Σε 3 τετράδες ίσων ακμών (4α, 4β και 4γ)",
          "Όταν και οι 12 ακμές του είναι ίσες (α ＝ β ＝ γ)",
          "6 ζεύγη ίσων τριγωνικών εδρών",
          "Σε 4 τριάδες ίσων ακμών (3α, 3β, 3γ)"
        ]
      : [
          "3 pairs of congruent rectangles (6 faces total)",
          "Into 3 groups of 4 equal edges (4a, 4b, and 4c)",
          "When all 12 of its edges are equal (a ＝ b ＝ c)",
          "6 pairs of congruent triangular faces",
          "Into 4 groups of 3 equal edges (3a, 3b, 3c)"
        ];

    qList.push({
      id: 2,
      title: isEl ? 'Ορθογώνιο Παραλληλεπίπεδο' : 'Rectangular Parallelepiped',
      prompt: pickedQ2.q,
      type: 'mcq',
      correct: pickedQ2.c,
      options: ensureFourUniqueOptions(pickedQ2.c, () => pickRandom(dist2)),
      explanation: pickedQ2.e
    });

    // Q3: Input - Συνολικό μήκος ακμών κύβου (12α)
    const edge3 = randInt(3, 12);
    const sumEdges3 = 12 * edge3;

    qList.push({
      id: 3,
      title: isEl ? 'Άθροισμα Ακμών Κύβου' : 'Sum of Edges of a Cube',
      prompt: isEl
        ? `Ένας κύβος έχει ακμή μήκους α ＝ ${edge3} cm. Πόσα cm είναι το άθροισμα των μηκών όλων των ακμών του;`
        : `A cube has edge length a ＝ ${edge3} cm. What is the total sum of the lengths of all its edges in cm?`,
      type: 'input',
      correct: sumEdges3,
      unit: 'cm',
      diagram: {
        type: 'cuboid',
        showSpaceDiag: false,
        showFaceDiag: false,
        caption: isEl ? `12 ακμές × ${edge3} cm ＝ ${sumEdges3} cm` : `12 edges × ${edge3} cm ＝ ${sumEdges3} cm`
      },
      explanation: isEl
        ? `Ο κύβος έχει 12 ίσες ακμές μήκους ${edge3} cm, άρα το συνολικό μήκος είναι 12 · ${edge3} ＝ ${sumEdges3} cm.`
        : `A cube has 12 equal edges of length ${edge3} cm, so total edge length is 12 · ${edge3} ＝ ${sumEdges3} cm.`
    });

    // Q4: Input - Πλήθος ακμών πυραμίδας (2n)
    const pyrTypes4 = isEl
      ? [
          { name: 'τριγωνική', n: 3 },
          { name: 'τετραγωνική', n: 4 },
          { name: 'πενταγωνική', n: 5 },
          { name: 'εξαγωνική', n: 6 },
          { name: 'οκταγωνική', n: 8 }
        ]
      : [
          { name: 'triangular', n: 3 },
          { name: 'square', n: 4 },
          { name: 'pentagonal', n: 5 },
          { name: 'hexagonal', n: 6 },
          { name: 'octagonal', n: 8 }
        ];
    const p4 = pickRandom(pyrTypes4);
    const edges4 = 2 * p4.n;

    qList.push({
      id: 4,
      title: isEl ? 'Πλήθος Ακμών Πυραμίδας' : 'Number of Edges of a Pyramid',
      prompt: isEl
        ? `Πόσες ακμές έχει συνολικά μια ${p4.name} πυραμίδα;`
        : `How many edges in total does a ${p4.name} pyramid have?`,
      type: 'input',
      correct: edges4,
      unit: isEl ? 'ακμές' : 'edges',
      diagram: {
        type: 'pyramid',
        n: Math.min(6, p4.n),
        caption: isEl ? `Ακμές ＝ 2n ＝ 2 · ${p4.n} ＝ ${edges4}` : `Edges ＝ 2n ＝ 2 · ${p4.n} ＝ ${edges4}`
      },
      explanation: isEl
        ? `Μια ${p4.name} πυραμίδα (n ＝ ${p4.n}) έχει ${p4.n} ακμές στη βάση και ${p4.n} παράπλευρες ακμές: 2 · ${p4.n} ＝ ${edges4} ακμές.`
        : `A ${p4.name} pyramid (n ＝ ${p4.n}) has ${p4.n} base edges and ${p4.n} lateral edges: 2 · ${p4.n} ＝ ${edges4} edges.`
    });

    // Q5: Input - Πλήθος εδρών ή κορυφών πυραμίδας (n + 1)
    const p5 = pickRandom(pyrTypes4);
    const askVerts5 = Math.random() < 0.5;
    const ans5 = p5.n + 1;

    qList.push({
      id: 5,
      title: isEl ? 'Έδρες & Κορυφές Πυραμίδας' : 'Faces & Vertices of a Pyramid',
      prompt: isEl
        ? `Πόσες ${askVerts5 ? 'κορυφές' : 'έδρες'} έχει συνολικά μια ${p5.name} πυραμίδα;`
        : `How many ${askVerts5 ? 'vertices' : 'faces'} in total does a ${p5.name} pyramid have?`,
      type: 'input',
      correct: ans5,
      unit: askVerts5 ? (isEl ? 'κορυφές' : 'vertices') : (isEl ? 'έδρες' : 'faces'),
      diagram: {
        type: 'pyramid',
        n: Math.min(6, p5.n),
        caption: isEl ? `n ＋ 1 ＝ ${p5.n} ＋ 1 ＝ ${ans5}` : `n ＋ 1 ＝ ${p5.n} ＋ 1 ＝ ${ans5}`
      },
      explanation: isEl
        ? askVerts5
          ? `Η βάση έχει ${p5.n} κορυφές συν 1 κορυφή της πυραμίδας: ${p5.n} ＋ 1 ＝ ${ans5} κορυφές.`
          : `Η πυραμίδα έχει 1 βάση και ${p5.n} παράπλευρα τρίγωνα: ${p5.n} ＋ 1 ＝ ${ans5} έδρες.`
        : askVerts5
        ? `The base has ${p5.n} vertices plus 1 apex: ${p5.n} ＋ 1 ＝ ${ans5} vertices.`
        : `The pyramid has 1 base and ${p5.n} triangular lateral faces: ${p5.n} ＋ 1 ＝ ${ans5} faces.`
    });

    // Q6: True / False - Κανονικό Τετράεδρο
    const q6Pool = isEl
      ? [
          {
            p: "Το κανονικό τετράεδρο έχει 4 ίσες έδρες που είναι ισόπλευρα τρίγωνα, 6 ίσες ακμές και 4 κορυφές.",
            t: true,
            e: "Το κανονικό τετράεδρο είναι τριγωνική πυραμίδα με όλες τις ακμές ίσες (6 ακμές), οπότε και οι 4 έδρες του είναι ισόπλευρα τρίγωνα."
          },
          {
            p: "Κάθε τριγωνική πυραμίδα που έχει βάση ισόπλευρο τρίγωνο είναι υποχρεωτικά κανονικό τετράεδρο.",
            t: false,
            e: "Για να είναι κανονικό τετράεδρο πρέπει ΚΑΙ οι παράπλευρες ακμές να είναι ίσες με τις πλευρές της βάσης (ώστε και τα 4 τρίγωνα να είναι ισόπλευρα)."
          },
          {
            p: "Στο ανάπτυγμα ενός κανονικού τετραέδρου σχηματίζονται 4 ίσα ισόπλευρα τρίγωνα.",
            t: true,
            e: "Ανοίγοντας τις 3 παράπλευρες έδρες γύρω από τη βάση παίρνουμε 4 ίσα ισόπλευρα τρίγωνα στο επίπεδο."
          }
        ]
      : [
          {
            p: "A regular tetrahedron has 4 congruent equilateral triangle faces, 6 equal edges, and 4 vertices.",
            t: true,
            e: "A regular tetrahedron is a triangular pyramid with all 6 edges equal, making all 4 faces congruent equilateral triangles."
          },
          {
            p: "Every triangular pyramid whose base is an equilateral triangle is automatically a regular tetrahedron.",
            t: false,
            e: "For a regular tetrahedron, the lateral edges must ALSO equal the base sides so all 4 faces are equilateral triangles."
          },
          {
            p: "The net of a regular tetrahedron consists of 4 congruent equilateral triangles.",
            t: true,
            e: "Unfolding the 3 lateral faces onto the plane of the base yields 4 congruent equilateral triangles."
          }
        ];

    const pickedQ6 = pickRandom(q6Pool);
    qList.push({
      id: 6,
      title: isEl ? 'Κανονικό Τετράεδρο' : 'Regular Tetrahedron',
      prompt: pickedQ6.p,
      type: 'tf',
      correct: pickedQ6.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'net',
        shape: 'tetraNet',
        caption: isEl ? 'Ανάπτυγμα Κανονικού Τετραέδρου (4 ισόπλευρα τρίγωνα)' : 'Regular Tetrahedron Net (4 equilateral triangles)'
      },
      explanation: pickedQ6.e
    });

    // Q7: MCQ - Αναπτύγματα στερεών
    const q7Pool = isEl
      ? [
          {
            q: "Από ποια επίπεδα σχήματα αποτελείται το ανάπτυγμα μιας κανονικής τετραγωνικής πυραμίδας;",
            c: "1 τετράγωνο (βάση) και 4 ίσα ισοσκελή τρίγωνα",
            e: "Η τετραγωνική πυραμίδα έχει τετράγωνη βάση και 4 παράπλευρα τρίγωνα που στην κανονική πυραμίδα είναι ίσα ισοσκελή."
          },
          {
            q: "Πόσα τετράγωνα περιέχει κάθε έγκυρο ανάπτυγμα ενός κύβου;",
            c: "6 ίσα τετράγωνα (χωρίς να επικαλύπτονται)",
            e: "Ο κύβος έχει 6 ίσες τετραγωνικές έδρες, οπότε το ανάπτυγμά του αποτελείται πάντα από 6 ίσα τετράγωνα."
          },
          {
            q: "Από τι αποτελείται το ανάπτυγμα ενός ορθογωνίου παραλληλεπιπέδου (που δεν είναι κύβος);",
            c: "6 ορθογώνια (3 ζεύγη ίσων ορθογωνίων)",
            e: "Κάθε έδρα του ορθογωνίου παραλληλεπιπέδου είναι ορθογώνιο, άρα το ανάπτυγμα έχει 6 ορθογώνια (ανά 2 ίσα)."
          }
        ]
      : [
          {
            q: "Which flat shapes form the net of a regular square pyramid?",
            c: "1 square (base) and 4 congruent isosceles triangles",
            e: "A square pyramid has a square base and 4 triangular lateral faces (congruent isosceles triangles when regular)."
          },
          {
            q: "How many squares are contained in any valid net of a cube?",
            c: "6 congruent squares (with no overlap)",
            e: "A cube has 6 congruent square faces, so its net always consists of 6 congruent squares."
          },
          {
            q: "What shapes make up the net of a non-cube rectangular parallelepiped?",
            c: "6 rectangles (3 pairs of congruent rectangles)",
            e: "All 6 faces of a rectangular parallelepiped are rectangles arranged in 3 congruent pairs."
          }
        ];

    const pickedQ7 = pickRandom(q7Pool);
    const dist7 = isEl
      ? [
          "1 τετράγωνο (βάση) και 4 ίσα ισοσκελή τρίγωνα",
          "6 ίσα τετράγωνα (χωρίς να επικαλύπτονται)",
          "6 ορθογώνια (3 ζεύγη ίσων ορθογωνίων)",
          "4 ισόπλευρα τρίγωνα και 2 τετράγωνα",
          "2 τετράγωνα και 4 τρίγωνα"
        ]
      : [
          "1 square (base) and 4 congruent isosceles triangles",
          "6 congruent squares (with no overlap)",
          "6 rectangles (3 pairs of congruent rectangles)",
          "4 equilateral triangles and 2 squares",
          "2 squares and 4 triangles"
        ];

    qList.push({
      id: 7,
      title: isEl ? 'Αναπτύγματα Γνωστών Στερεών' : 'Nets of Familiar Solids',
      prompt: pickedQ7.q,
      type: 'mcq',
      correct: pickedQ7.c,
      options: ensureFourUniqueOptions(pickedQ7.c, () => pickRandom(dist7)),
      diagram: {
        type: 'net',
        shape: 'cubeNet',
        caption: isEl ? 'Ανάπτυγμα Κύβου (6 ίσα τετράγωνα)' : 'Net of a Cube (6 congruent squares)'
      },
      explanation: pickedQ7.e
    });

    // Q8: MCQ - Αναγνώριση πυραμίδας από έδρες ή ακμές
    const n8 = pickRandom([3, 4, 5, 6]);
    const pyrName8 = isEl
      ? { 3: 'Τριγωνική πυραμίδα', 4: 'Τετραγωνική πυραμίδα', 5: 'Πενταγωνική πυραμίδα', 6: 'Εξαγωνική πυραμίδα' }[n8]
      : { 3: 'Triangular pyramid', 4: 'Square pyramid', 5: 'Pentagonal pyramid', 6: 'Hexagonal pyramid' }[n8];

    const dist8 = isEl
      ? ['Τριγωνική πυραμίδα', 'Τετραγωνική πυραμίδα', 'Πενταγωνική πυραμίδα', 'Εξαγωνική πυραμίδα', 'Οκταγωνική πυραμίδα']
      : ['Triangular pyramid', 'Square pyramid', 'Pentagonal pyramid', 'Hexagonal pyramid', 'Octagonal pyramid'];

    qList.push({
      id: 8,
      title: isEl ? 'Αναγνώριση Είδους Πυραμίδας' : 'Identifying the Type of Pyramid',
      prompt: isEl
        ? `Μια πυραμίδα έχει συνολικά ${n8 + 1} έδρες και ${2 * n8} ακμές. Τι είδους πυραμίδα είναι;`
        : `A pyramid has ${n8 + 1} faces and ${2 * n8} edges in total. What type of pyramid is it?`,
      type: 'mcq',
      correct: pyrName8,
      options: ensureFourUniqueOptions(pyrName8, () => pickRandom(dist8)),
      diagram: {
        type: 'pyramid',
        n: n8,
        caption: isEl ? `Βάση με n ＝ ${n8} πλευρές` : `Base with n ＝ ${n8} sides`
      },
      explanation: isEl
        ? `Από τον τύπο εδρών n ＋ 1 ＝ ${n8 + 1} (ή ακμών 2n ＝ ${2 * n8}) προκύπτει n ＝ ${n8}, άρα είναι ${pyrName8.toLowerCase()}.`
        : `From faces n ＋ 1 ＝ ${n8 + 1} (or edges 2n ＝ ${2 * n8}) we find n ＝ ${n8}, so it is a ${pyrName8.toLowerCase()}.`
    });

    // Q9: Input + tableData + SVG - Συνολικό μήκος ακμών ορθογωνίου παραλληλεπιπέδου
    const a9 = randInt(4, 9);
    const b9 = randInt(3, 7);
    const c9 = randInt(2, 6);
    const sumEdges9 = 4 * (a9 + b9 + c9);

    qList.push({
      id: 9,
      title: isEl ? 'Συνολικό Μήκος Ακμών Παραλληλεπιπέδου' : 'Total Edge Length of a Parallelepiped',
      prompt: isEl
        ? `Ένα ορθογώνιο παραλληλεπίπεδο έχει μήκος α ＝ ${a9} cm, πλάτος β ＝ ${b9} cm και ύψος γ ＝ ${c9} cm. Πόσα cm είναι το συνολικό άθροισμα των μηκών όλων των 12 ακμών του;`
        : `A rectangular parallelepiped has length a ＝ ${a9} cm, width b ＝ ${b9} cm, and height c ＝ ${c9} cm. What is the total sum of the lengths of all 12 edges in cm?`,
      type: 'input',
      correct: sumEdges9,
      unit: 'cm',
      diagram: {
        type: 'cuboid',
        showSpaceDiag: false,
        showFaceDiag: false,
        caption: `${a9} cm × ${b9} cm × ${c9} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Τύπος αθροίσματος ακμών' : '1. Edge sum formula',
          details: '4α ＋ 4β ＋ 4γ ＝ 4 · (α ＋ β ＋ γ)'
        },
        {
          label: isEl ? '2. Αντικατάσταση & υπολογισμός' : '2. Substitution & calculation',
          details: `4 · (${a9} ＋ ${b9} ＋ ${c9}) ＝ 4 · ${a9 + b9 + c9} ＝ ${sumEdges9} cm`
        }
      ],
      explanation: isEl
        ? `Έχουμε 4 ακμές μήκους ${a9} cm, 4 ακμές πλάτους ${b9} cm και 4 ακμές ύψους ${c9} cm: 4 · (${a9} ＋ ${b9} ＋ ${c9}) ＝ ${sumEdges9} cm.`
        : `There are 4 edges of ${a9} cm, 4 of ${b9} cm, and 4 of ${c9} cm: 4 · (${a9} ＋ ${b9} ＋ ${c9}) ＝ ${sumEdges9} cm.`
    });

    // Q10: Input + tableData + SVG - Εμβαδόν αναπτύγματος κύβου ή ορθογωνίου παραλληλεπιπέδου
    const isCube10 = Math.random() < 0.5;
    const a10 = randInt(3, 7);
    const b10 = isCube10 ? a10 : randInt(2, 5);
    const c10 = isCube10 ? a10 : randInt(2, 4);
    const area10 = 2 * (a10 * b10 + a10 * c10 + b10 * c10);

    qList.push({
      id: 10,
      title: isEl ? 'Εμβαδόν Αναπτύγματος (Ολική Επιφάνεια)' : 'Area of Net (Total Surface Area)',
      prompt: isEl
        ? isCube10
          ? `Ένας κύβος έχει ακμή μήκους ${a10} cm. Πόσα cm² είναι το συνολικό εμβαδόν του αναπτύγματός του (και των 6 τετραγωνικών εδρών μαζί);`
          : `Ένα ορθογώνιο παραλληλεπίπεδο έχει διαστάσεις ${a10} cm, ${b10} cm και ${c10} cm. Πόσα cm² είναι το συνολικό εμβαδόν του αναπτύγματός του;`
        : isCube10
        ? `A cube has edge length ${a10} cm. What is the total area of its net (all 6 square faces combined) in cm²?`
        : `A rectangular parallelepiped has dimensions ${a10} cm, ${b10} cm, and ${c10} cm. What is the total area of its net in cm²?`,
      type: 'input',
      correct: area10,
      unit: 'cm²',
      diagram: {
        type: 'net',
        shape: 'cubeNet',
        caption: isEl ? `Ολικό εμβαδόν 6 εδρών ＝ ${area10} cm²` : `Total area of 6 faces ＝ ${area10} cm²`
      },
      tableData: isCube10
        ? [
            {
              label: isEl ? '1. Εμβαδόν 1 τετραγώνου' : '1. Area of 1 square face',
              details: `${a10} · ${a10} ＝ ${a10 * a10} cm²`
            },
            {
              label: isEl ? '2. Σύνολο 6 εδρών' : '2. Total for 6 faces',
              details: `6 · ${a10 * a10} ＝ ${area10} cm²`
            }
          ]
        : [
            {
              label: isEl ? '1. Τα 3 ζεύγη ορθογωνίων' : '1. The 3 rectangle pairs',
              details: `2·(${a10}·${b10}) ＋ 2·(${a10}·${c10}) ＋ 2·(${b10}·${c10})`
            },
            {
              label: isEl ? '2. Άθροισμα εμβαδών' : '2. Sum of areas',
              details: `${2 * a10 * b10} ＋ ${2 * a10 * c10} ＋ ${2 * b10 * c10} ＝ ${area10} cm²`
            }
          ],
      explanation: isEl
        ? isCube10
          ? `Κάθε τετραγωνική έδρα έχει εμβαδόν ${a10}² ＝ ${a10 * a10} cm², άρα και οι 6 έδρες του αναπτύγματος έχουν εμβαδόν 6 · ${a10 * a10} ＝ ${area10} cm².`
          : `Προσθέτουμε τα εμβαδά των 6 ορθογωνίων: 2·(${a10}·${b10}) ＋ 2·(${a10}·${c10}) ＋ 2·(${b10}·${c10}) ＝ ${area10} cm².`
        : isCube10
        ? `Each square face has area ${a10}² ＝ ${a10 * a10} cm², so all 6 faces in the net have area 6 · ${a10 * a10} ＝ ${area10} cm².`
        : `Summing the areas of all 6 rectangles: 2·(${a10}·${b10}) ＋ 2·(${a10}·${c10}) ＋ 2·(${b10}·${c10}) ＝ ${area10} cm².`
    });

    // Q11: Input + tableData + SVG - Εύρεση ακμής κανονικού τετραέδρου από άθροισμα ακμών
    const edge11 = randInt(4, 13);
    const total11 = 6 * edge11;

    qList.push({
      id: 11,
      title: isEl ? 'Ακμή Κανονικού Τετραέδρου' : 'Edge of a Regular Tetrahedron',
      prompt: isEl
        ? `Το άθροισμα των μηκών όλων των ακμών ενός κανονικού τετραέδρου είναι ${total11} cm. Πόσα cm είναι το μήκος κάθε ακμής του;`
        : `The sum of the lengths of all edges of a regular tetrahedron is ${total11} cm. What is the length of each edge in cm?`,
      type: 'input',
      correct: edge11,
      unit: 'cm',
      diagram: {
        type: 'pyramid',
        n: 3,
        caption: isEl ? `6 ίσες ακμές ⇒ α ＝ ${edge11} cm` : `6 equal edges ⇒ a ＝ ${edge11} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Πλήθος ακμών τετραέδρου' : '1. Tetrahedron edge count',
          details: isEl ? 'Το κανονικό τετράεδρο έχει 6 ίσες ακμές' : 'A regular tetrahedron has 6 equal edges'
        },
        {
          label: isEl ? '2. Μήκος κάθε ακμής (α)' : '2. Length of each edge (a)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>α ＝</span>
              <Frac num={total11} den="6" />
              <span>＝ {edge11} cm</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Το κανονικό τετράεδρο έχει 6 ίσες ακμές, άρα κάθε ακμή έχει μήκος ${total11} / 6 ＝ ${edge11} cm.`
        : `A regular tetrahedron has 6 equal edges, so each edge has length ${total11} / 6 ＝ ${edge11} cm.`
    });

    // Q12: MCQ + tableData + SVG - Συνδυαστικό πρόβλημα πυραμίδας (εύρεση n από ακμές και υπολογισμός εδρών + κορυφών)
    const n12 = pickRandom([4, 5, 6, 7]);
    const edges12 = 2 * n12;
    const faces12 = n12 + 1;
    const verts12 = n12 + 1;
    const corr12 = isEl
      ? `${faces12} έδρες και ${verts12} κορυφές`
      : `${faces12} faces and ${verts12} vertices`;
    const dist12 = isEl
      ? [
          `${faces12} έδρες και ${verts12} κορυφές`,
          `${n12} έδρες και ${n12 + 1} κορυφές`,
          `${n12 + 2} έδρες και ${2 * n12} κορυφές`,
          `${faces12 + 1} έδρες και ${verts12 + 1} κορυφές`,
          `${n12 + 1} έδρες και ${2 * n12} κορυφές`
        ]
      : [
          `${faces12} faces and ${verts12} vertices`,
          `${n12} faces and ${n12 + 1} vertices`,
          `${n12 + 2} faces and ${2 * n12} vertices`,
          `${faces12 + 1} faces and ${verts12 + 1} vertices`,
          `${n12 + 1} faces and ${2 * n12} vertices`
        ];

    qList.push({
      id: 12,
      title: isEl ? 'Συνδυασμός Στοιχείων Πυραμίδας' : 'Combining Elements of a Pyramid',
      prompt: isEl
        ? `Μια πυραμίδα έχει συνολικά ${edges12} ακμές. Πόσες έδρες και πόσες κορυφές έχει συνολικά;`
        : `A pyramid has ${edges12} edges in total. How many faces and how many vertices does it have in total?`,
      type: 'mcq',
      correct: corr12,
      options: ensureFourUniqueOptions(corr12, () => pickRandom(dist12)),
      diagram: {
        type: 'pyramid',
        n: Math.min(6, n12),
        caption: isEl ? `Ακμές ＝ ${edges12} ⇒ n ＝ ${n12}` : `Edges ＝ ${edges12} ⇒ n ＝ ${n12}`
      },
      tableData: [
        {
          label: isEl ? '1. Πλευρές βάσης (n)' : '1. Base sides (n)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>2n ＝ {edges12} ⇒ n ＝</span>
              <Frac num={edges12} den="2" />
              <span>＝ {n12}</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Έδρες & Κορυφές (n＋1)' : '2. Faces & Vertices (n＋1)',
          details: `${n12} ＋ 1 ＝ ${faces12}`
        }
      ],
      explanation: isEl
        ? `Από 2n ＝ ${edges12} βρίσκουμε n ＝ ${n12}. Επομένως η πυραμίδα έχει n ＋ 1 ＝ ${faces12} έδρες και n ＋ 1 ＝ ${verts12} κορυφές.`
        : `From 2n ＝ ${edges12} we find n ＝ ${n12}. Therefore the pyramid has n ＋ 1 ＝ ${faces12} faces and n ＋ 1 ＝ ${verts12} vertices.`
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
      backUrl="/a-gymnasiou/52-gnosta-sterea"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/52-gnosta-sterea"
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
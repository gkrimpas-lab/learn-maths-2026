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

// Επαναχρησιμοποιήσιμο Component Γωνίας
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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας
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

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction)
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

  // 1. Ορθό Πρίσμα με n πλευρές βάσης
  if (diagram.type === 'rightPrism') {
    const n = diagram.n || 4;
    const cx = 132;
    const topCy = 46;
    const botCy = 122;
    const rx = 50;
    const ry = 17;

    const getPts = (cy) => {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const theta = -Math.PI / 2 + (2 * Math.PI * i) / n + (n === 4 ? Math.PI / 4 : 0);
        pts.push({
          x: Number((cx + rx * Math.cos(theta)).toFixed(1)),
          y: Number((cy + ry * Math.sin(theta)).toFixed(1))
        });
      }
      return pts;
    };

    const topPts = getPts(topCy);
    const botPts = getPts(botCy);

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <polygon
            points={botPts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(16, 185, 129, 0.22)"
            stroke="#34d399"
            strokeWidth="1.8"
          />
          {topPts.map((tp, idx) => {
            const bp = botPts[idx];
            return (
              <line
                key={`e-${idx}`}
                x1={tp.x}
                y1={tp.y}
                x2={bp.x}
                y2={bp.y}
                stroke="#818cf8"
                strokeWidth="1.6"
              />
            );
          })}
          <polygon
            points={topPts.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="rgba(99, 102, 241, 0.34)"
            stroke="#818cf8"
            strokeWidth="2"
          />
          {[...topPts, ...botPts].map((p, i) => (
            <circle key={`v-${i}`} cx={p.x} cy={p.y} r="3" fill="#fbbf24" />
          ))}
          <text x="132" y="156" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 2. 2D Όψη (Grid τετραγώνων) για κατασκευές κύβων
  if (diagram.type === 'gridView') {
    const cells = diagram.cells || [];
    const colors = ['#6366f1', '#10b981', '#f59e0b'];
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Βοηθητικό πλέγμα 3x3 */}
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`bg-${r}-${c}`}
                x={92 + c * 26}
                y={34 + r * 26}
                width="26"
                height="26"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            ))
          )}
          {/* Ενεργά τετραγωνάκια της όψης */}
          {cells.map(([col, row, lvl = 0], idx) => (
            <rect
              key={`c-${idx}`}
              x={93 + col * 26}
              y={35 + row * 26}
              width="24"
              height="24"
              rx="3"
              fill={colors[lvl % colors.length]}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          ))}
          <text x="132" y="138" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Σύγκριση Πολυέδρων & Μη Πολυέδρων
  if (diagram.type === 'solidsCompare') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Κύβος (Πολύεδρο) */}
          <polygon points="75,45 103,32 131,45 103,58" fill="rgba(99, 102, 241, 0.35)" stroke="#818cf8" strokeWidth="1.8" />
          <polygon points="75,45 103,58 103,95 75,82" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="1.8" />
          <polygon points="103,58 131,45 131,82 103,95" fill="rgba(99, 102, 241, 0.18)" stroke="#818cf8" strokeWidth="1.8" />
          <text x="103" y="114" textAnchor="middle" className="text-[8px] font-bold fill-indigo-300">
            {isEl ? 'Πολύεδρο' : 'Polyhedron'}
          </text>

          {/* Κύλινδρος (Μη Πολύεδρο) */}
          <ellipse cx="182" cy="44" rx="22" ry="8" fill="rgba(16, 185, 129, 0.35)" stroke="#34d399" strokeWidth="1.8" />
          <line x1="160" y1="44" x2="160" y2="88" stroke="#34d399" strokeWidth="1.8" />
          <line x1="204" y1="44" x2="204" y2="88" stroke="#34d399" strokeWidth="1.8" />
          <path d="M 160,88 A 22,8 0 0,0 204,88" fill="none" stroke="#34d399" strokeWidth="1.8" />
          <text x="182" y="114" textAnchor="middle" className="text-[8px] font-bold fill-emerald-300">
            {isEl ? 'Μη Πολύεδρο' : 'Non-Polyhedron'}
          </text>

          <text x="132" y="148" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function StereaKaiOrthoprismaExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Στερεά Γεωμετρικά Σχήματα & Ορθό Πρίσμα | Α' Γυμνασίου" : "Exercises: 3D Geometric Solids & Right Prism | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στα στερεά γεωμετρικά σχήματα, τις όψεις 3D κατασκευών κύβων, το πρίσμα, το ορθό πρίσμα και τα στοιχεία του."
      : "Interactive Grade 7 geometry exercises on 3D geometric solids, views of 3D cube assemblies, prism, right prism, and its elements.",
    backNav: isEl ? "Θεωρία Κεφ. 13" : "Theory Ch. 13",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 13 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 13 • GRADE 7",
    heroTitle: isEl ? "Στερεά Γεωμετρικά Σχήματα & Ορθό Πρίσμα: Εξάσκηση" : "3D Geometric Solids & Right Prism: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στα πολύεδρα, τις όψεις (μπροστινή, πλαϊνή, κάτοψη) κατασκευών κύβων και τα στοιχεία του ορθού πρίσματος."
      : "12 dynamic questions and problems on polyhedra, views (front, side, top) of cube assemblies, and the elements of a right prism.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τα πολύεδρα, τις όψεις των 3D στερεών και τους τύπους κορυφών, ακμών και εδρών του ορθού πρίσματος."
      : "Outstanding performance! You have mastered polyhedra, 3D solid views, and the vertex, edge, and face formulas of right prisms.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τους πίνακες ανάλυσης και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the step-by-step tables and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στις όψεις στερεών και στα στοιχεία του ορθού πρίσματος (n＋2, 3n, 2n)!"
      : "Needs a bit more review on solid views and right prism elements (n＋2, 3n, 2n)!",
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

    // Q1: True / False - Πολύεδρα vs Μη Πολύεδρα
    const q1Pool = isEl
      ? [
          {
            p: "Ο κύλινδρος, ο κώνος και η σφαίρα ΔΕΝ είναι πολύεδρα, επειδή έχουν καμπύλες επιφάνειες.",
            t: true,
            e: "Πολύεδρα ονομάζονται μόνο τα στερεά που περιορίζονται αποκλειστικά από επίπεδα πολύγωνα (π.χ. κύβος, πρίσμα, πυραμίδα)."
          },
          {
            p: "Κάθε πρίσμα είναι πολύεδρο, επειδή όλες οι έδρες του (βάσεις και παράπλευρες έδρες) είναι επίπεδα πολύγωνα.",
            t: true,
            e: "Το πρίσμα περιορίζεται από 2 ίσες πολυγωνικές βάσεις και n παραλληλόγραμμα, άρα είναι πολύεδρο."
          },
          {
            p: "Ο κύλινδρος είναι πολύεδρο επειδή οι δύο βάσεις του είναι ίσοι και παράλληλοι κύκλοι.",
            t: false,
            e: "Ο κύκλος δεν είναι πολύγωνο και η παράπλευρη επιφάνεια του κυλίνδρου είναι καμπύλη, επομένως ο κύλινδρος δεν είναι πολύεδρο."
          }
        ]
      : [
          {
            p: "A cylinder, cone, and sphere are NOT polyhedra because they include curved surfaces.",
            t: true,
            e: "Polyhedra are 3D solids bounded exclusively by flat polygonal faces (such as cubes, prisms, and pyramids)."
          },
          {
            p: "Every prism is a polyhedron because all of its faces (bases and lateral faces) are flat polygons.",
            t: true,
            e: "A prism is bounded by 2 congruent polygonal bases and n parallelograms, making it a polyhedron."
          },
          {
            p: "A cylinder is a polyhedron because its two bases are congruent parallel circles.",
            t: false,
            e: "A circle is not a polygon and a cylinder's lateral surface is curved, so a cylinder is not a polyhedron."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Πολύεδρα και Μη Πολύεδρα' : 'Polyhedra and Non-Polyhedra',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'solidsCompare',
        caption: isEl ? 'Επίπεδες έδρες vs Καμπύλη επιφάνεια' : 'Flat faces vs Curved surface'
      },
      explanation: pickedQ1.e
    });

    // Q2: MCQ - Ιδιότητες Ορθού Πρίσματος
    const q2Pool = isEl
      ? [
          {
            q: "Τι είδους τετράπλευρα είναι ΠΑΝΤΑ οι παράπλευρες έδρες ενός ορθού πρίσματος;",
            c: "Ορθογώνια παραλληλόγραμμα",
            e: "Επειδή οι παράπλευρες ακμές είναι κάθετες στις βάσεις, οι παράπλευρες έδρες κάθε ορθού πρίσματος είναι ορθογώνια."
          },
          {
            q: "Πόσες βάσεις έχει ένα οποιοδήποτε ορθό πρίσμα;",
            c: "2 ίσες και παράλληλες πολυγωνικές βάσεις",
            e: "Κάθε πρίσμα διαθέτει ακριβώς 2 ίσες και παράλληλες πολυγωνικές έδρες που ονομάζονται βάσεις."
          },
          {
            q: "Με τι είναι ίσο το ύψος ενός ορθού πρίσματος;",
            c: "Με το μήκος κάθε παράπλευρης ακμής του",
            e: "Στο ορθό πρίσμα οι παράπλευρες ακμές είναι κάθετες στις βάσεις, άρα το μήκος τους ισούται με το ύψος του."
          }
        ]
      : [
          {
            q: "What type of quadrilaterals are ALWAYS the lateral faces of a right prism?",
            c: "Rectangles",
            e: "Since lateral edges are perpendicular to the bases, all lateral faces of a right prism are rectangles."
          },
          {
            q: "How many bases does any right prism have?",
            c: "2 congruent, parallel polygonal bases",
            e: "Every prism has exactly 2 congruent parallel polygonal faces called bases."
          },
          {
            q: "What is the height of a right prism equal to?",
            c: "The length of each lateral edge",
            e: "In a right prism, lateral edges are perpendicular to the bases, so their length equals the height."
          }
        ];

    const pickedQ2 = pickRandom(q2Pool);
    const dist2 = isEl
      ? [
          "Ορθογώνια παραλληλόγραμμα",
          "2 ίσες και παράλληλες πολυγωνικές βάσεις",
          "Με το μήκος κάθε παράπλευρης ακμής του",
          "Τρίγωνα που ενώνονται σε μία κορυφή",
          "Μόνο 1 πολυγωνική βάση"
        ]
      : [
          "Rectangles",
          "2 congruent, parallel polygonal bases",
          "The length of each lateral edge",
          "Triangles meeting at a single apex",
          "Only 1 polygonal base"
        ];

    qList.push({
      id: 2,
      title: isEl ? 'Χαρακτηριστικά Ορθού Πρίσματος' : 'Characteristics of a Right Prism',
      prompt: pickedQ2.q,
      type: 'mcq',
      correct: pickedQ2.c,
      options: ensureFourUniqueOptions(pickedQ2.c, () => pickRandom(dist2)),
      explanation: pickedQ2.e
    });

    // Q3: Input - Πλήθος Εδρών Ορθού Πρίσματος (n + 2)
    const shapes3 = isEl
      ? [
          { name: 'τριγωνικό', n: 3 },
          { name: 'τετραγωνικό', n: 4 },
          { name: 'πενταγωνικό', n: 5 },
          { name: 'εξαγωνικό', n: 6 },
          { name: 'οκταγωνικό', n: 8 }
        ]
      : [
          { name: 'triangular', n: 3 },
          { name: 'square', n: 4 },
          { name: 'pentagonal', n: 5 },
          { name: 'hexagonal', n: 6 },
          { name: 'octagonal', n: 8 }
        ];
    const sh3 = pickRandom(shapes3);
    const faces3 = sh3.n + 2;

    qList.push({
      id: 3,
      title: isEl ? 'Πλήθος Εδρών Ορθού Πρίσματος' : 'Number of Faces of a Right Prism',
      prompt: isEl
        ? `Πόσες έδρες έχει συνολικά ένα ορθό ${sh3.name} πρίσμα;`
        : `How many faces in total does a right ${sh3.name} prism have?`,
      type: 'input',
      correct: faces3,
      unit: isEl ? 'έδρες' : 'faces',
      diagram: {
        type: 'rightPrism',
        n: Math.min(6, sh3.n),
        caption: isEl ? `Έδρες ＝ n ＋ 2 ＝ ${sh3.n} ＋ 2 ＝ ${faces3}` : `Faces ＝ n ＋ 2 ＝ ${sh3.n} ＋ 2 ＝ ${faces3}`
      },
      explanation: isEl
        ? `Η βάση έχει n ＝ ${sh3.n} πλευρές, άρα το πρίσμα έχει 2 βάσεις και ${sh3.n} παράπλευρες έδρες: σύνολο ${sh3.n} ＋ 2 ＝ ${faces3} έδρες.`
        : `The base has n ＝ ${sh3.n} sides, giving 2 bases and ${sh3.n} lateral faces: ${sh3.n} ＋ 2 ＝ ${faces3} faces in total.`
    });

    // Q4: Input - Πλήθος Ακμών Ορθού Πρίσματος (3n)
    const sh4 = pickRandom(shapes3);
    const edges4 = 3 * sh4.n;

    qList.push({
      id: 4,
      title: isEl ? 'Πλήθος Ακμών Ορθού Πρίσματος' : 'Number of Edges of a Right Prism',
      prompt: isEl
        ? `Πόσες ακμές έχει συνολικά ένα ορθό ${sh4.name} πρίσμα;`
        : `How many edges in total does a right ${sh4.name} prism have?`,
      type: 'input',
      correct: edges4,
      unit: isEl ? 'ακμές' : 'edges',
      diagram: {
        type: 'rightPrism',
        n: Math.min(6, sh4.n),
        caption: isEl ? `Ακμές ＝ 3n ＝ 3 · ${sh4.n} ＝ ${edges4}` : `Edges ＝ 3n ＝ 3 · ${sh4.n} ＝ ${edges4}`
      },
      explanation: isEl
        ? `Ένα ορθό ${sh4.name} πρίσμα (n ＝ ${sh4.n}) έχει 3 · ${sh4.n} ＝ ${edges4} ακμές (${sh4.n} στην κάτω βάση, ${sh4.n} στην πάνω και ${sh4.n} παράπλευρες).`
        : `A right ${sh4.name} prism (n ＝ ${sh4.n}) has 3 · ${sh4.n} ＝ ${edges4} edges (${sh4.n} bottom, ${sh4.n} top, and ${sh4.n} lateral).`
    });

    // Q5: Input - Πλήθος Κορυφών Ορθού Πρίσματος (2n)
    const sh5 = pickRandom(shapes3);
    const vert5 = 2 * sh5.n;

    qList.push({
      id: 5,
      title: isEl ? 'Πλήθος Κορυφών Ορθού Πρίσματος' : 'Number of Vertices of a Right Prism',
      prompt: isEl
        ? `Πόσες κορυφές έχει συνολικά ένα ορθό ${sh5.name} πρίσμα;`
        : `How many vertices in total does a right ${sh5.name} prism have?`,
      type: 'input',
      correct: vert5,
      unit: isEl ? 'κορυφές' : 'vertices',
      explanation: isEl
        ? `Κάθε βάση έχει ${sh5.n} κορυφές, άρα το πρίσμα έχει 2 · ${sh5.n} ＝ ${vert5} κορυφές.`
        : `Each base has ${sh5.n} vertices, so the prism has 2 · ${sh5.n} ＝ ${vert5} vertices in total.`
    });

    // Q6: True / False - Διαφορετική θέα (όψεις) κατασκευών κύβων
    const q6Pool = isEl
      ? [
          {
            p: "Αν τοποθετήσουμε 4 ίσους κύβους τον έναν ακριβώς πάνω στον άλλον (κατακόρυφη στήλη), στην κάτοψη (όψη από πάνω) φαίνεται μόνο 1 τετράγωνο.",
            t: true,
            e: "Στην κάτοψη βλέπουμε μόνο την επάνω έδρα του ψηλότερου κύβου της στήλης, δηλαδή 1 μόνο τετραγωνάκι."
          },
          {
            p: "Δύο διαφορετικές 3D κατασκευές από κύβους δεν μπορούν ποτέ να έχουν την ίδια κάτοψη.",
            t: false,
            e: "Δύο κατασκευές με διαφορετικά ύψη στηλών (π.χ. 1 κύβος vs στήλη 3 κύβων) έχουν ακριβώς την ίδια κάτοψη."
          },
          {
            p: "Η μπροστινή όψη και η κάτοψη μιας 3D κατασκευής από κύβους είναι δισδιάστατα (επίπεδα) σχήματα.",
            t: true,
            e: "Οι όψεις αποτυπώνουν τη 2D προβολή του τρισδιάστατου στερεού στο επίπεδο."
          }
        ]
      : [
          {
            p: "If we stack 4 identical cubes vertically on top of each other, the top view shows only 1 square.",
            t: true,
            e: "From directly above (top view), only the top face of the highest cube in the stack is visible, showing just 1 square."
          },
          {
            p: "Two different 3D cube structures can never have the exact same top view.",
            t: false,
            e: "Two structures with different column heights over the same footprint produce the exact same top view."
          },
          {
            p: "The front view and top view of a 3D cube assembly are two-dimensional (flat) figures.",
            t: true,
            e: "Orthographic views represent 2D projections of a 3D solid onto a plane."
          }
        ];

    const pickedQ6 = pickRandom(q6Pool);
    qList.push({
      id: 6,
      title: isEl ? 'Όψεις Στερεών στον Χώρο' : 'Views of Solids in Space',
      prompt: pickedQ6.p,
      type: 'tf',
      correct: pickedQ6.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedQ6.e
    });

    // Q7: MCQ - Κάτοψη κατασκευής κύβων (Πόσα τετραγωνάκια φαίνονται από πάνω)
    const cols7 = randInt(3, 5);
    const extraTop7 = randInt(2, 4);
    const totalCubes7 = cols7 + extraTop7;
    const corr7 = isEl ? `${cols7} τετραγωνάκια` : `${cols7} squares`;
    const dist7 = isEl
      ? [
          `${cols7} τετραγωνάκια`,
          `${totalCubes7} τετραγωνάκια`,
          `${cols7 + 1} τετραγωνάκια`,
          `${extraTop7} τετραγωνάκια`,
          `${totalCubes7 + 2} τετραγωνάκια`
        ]
      : [
          `${cols7} squares`,
          `${totalCubes7} squares`,
          `${cols7 + 1} squares`,
          `${extraTop7} squares`,
          `${totalCubes7 + 2} squares`
        ];

    qList.push({
      id: 7,
      title: isEl ? 'Κάτοψη Κατασκευής από Κύβους' : 'Top View of a Cube Assembly',
      prompt: isEl
        ? `Μια κατασκευή αποτελείται από ${totalCubes7} ίσους μοναδιαίους κύβους, οι οποίοι πατούν πάνω σε ${cols7} τετράγωνα του τραπεζιού (σε ${cols7} κατακόρυφες στήλες). Πόσα τετραγωνάκια φαίνονται στην κάτοψη (όψη από πάνω);`
        : `A 3D assembly consists of ${totalCubes7} identical unit cubes resting on ${cols7} base squares on a table (arranged in ${cols7} vertical columns). How many squares appear in the top view?`,
      type: 'mcq',
      correct: corr7,
      options: ensureFourUniqueOptions(corr7, () => pickRandom(dist7)),
      diagram: {
        type: 'gridView',
        cells: Array.from({ length: cols7 }, (_, i) => [i % 3, Math.floor(i / 3), i === 0 ? 2 : 0]),
        caption: isEl ? `Κάτοψη: ${cols7} τετραγωνάκια` : `Top view: ${cols7} squares`
      },
      explanation: isEl
        ? `Στην κάτοψη βλέπουμε μόνο την κορυφή κάθε στήλης. Εφόσον υπάρχουν ${cols7} στήλες (βάση ${cols7} τετραγώνων), από πάνω φαίνονται ακριβώς ${cols7} τετραγωνάκια.`
        : `In the top view we only see the top of each column. Since there are ${cols7} columns (base footprint of ${cols7} squares), exactly ${cols7} squares are visible.`
    });

    // Q8: MCQ - Αναγνώριση πρίσματος από πλήθος εδρών ή κορυφών
    const n8 = pickRandom([3, 4, 5, 6]);
    const name8 = isEl
      ? { 3: 'Τριγωνικό πρίσμα', 4: 'Τετραγωνικό πρίσμα', 5: 'Πενταγωνικό πρίσμα', 6: 'Εξαγωνικό πρίσμα' }[n8]
      : { 3: 'Triangular prism', 4: 'Square prism', 5: 'Pentagonal prism', 6: 'Hexagonal prism' }[n8];

    const dist8 = isEl
      ? ['Τριγωνικό πρίσμα', 'Τετραγωνικό πρίσμα', 'Πενταγωνικό πρίσμα', 'Εξαγωνικό πρίσμα', 'Οκταγωνικό πρίσμα']
      : ['Triangular prism', 'Square prism', 'Pentagonal prism', 'Hexagonal prism', 'Octagonal prism'];

    qList.push({
      id: 8,
      title: isEl ? 'Αναγνώριση Είδους Πρίσματος' : 'Identifying the Type of Prism',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει συνολικά ${n8 + 2} έδρες και ${2 * n8} κορυφές. Τι είδους πρίσμα είναι;`
        : `A right prism has ${n8 + 2} faces and ${2 * n8} vertices in total. What type of prism is it?`,
      type: 'mcq',
      correct: name8,
      options: ensureFourUniqueOptions(name8, () => pickRandom(dist8)),
      diagram: {
        type: 'rightPrism',
        n: n8,
        caption: isEl ? `n ＝ ${n8} πλευρές βάσης` : `n ＝ ${n8} base sides`
      },
      explanation: isEl
        ? `Από τον τύπο εδρών n ＋ 2 ＝ ${n8 + 2} (ή κορυφών 2n ＝ ${2 * n8}) προκύπτει n ＝ ${n8}, άρα είναι ${name8.toLowerCase()}.`
        : `From faces n ＋ 2 ＝ ${n8 + 2} (or vertices 2n ＝ ${2 * n8}) we get n ＝ ${n8}, so it is a ${name8.toLowerCase()}.`
    });

    // Q9: Input + tableData + SVG - Εύρεση πλευρών βάσης n από πλήθος ακμών (3n)
    const n9 = pickRandom([4, 5, 6, 7, 8]);
    const edges9 = 3 * n9;

    qList.push({
      id: 9,
      title: isEl ? 'Εύρεση Πλευρών Βάσης από Ακμές' : 'Finding Base Sides from Edge Count',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει συνολικά ${edges9} ακμές. Πόσες πλευρές έχει το πολύγωνο της βάσης του;`
        : `A right prism has ${edges9} edges in total. How many sides does its base polygon have?`,
      type: 'input',
      correct: n9,
      unit: isEl ? 'πλευρές' : 'sides',
      diagram: {
        type: 'rightPrism',
        n: Math.min(6, n9),
        caption: `n ＝ ${edges9} / 3 ＝ ${n9}`
      },
      tableData: [
        {
          label: isEl ? '1. Τύπος ακμών' : '1. Edge formula',
          details: isEl ? `Σύνολο ακμών ＝ 3 · n ＝ ${edges9}` : `Total edges ＝ 3 · n ＝ ${edges9}`
        },
        {
          label: isEl ? '2. Υπολογισμός του n' : '2. Solving for n',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>n ＝</span>
              <Frac num={edges9} den="3" />
              <span>＝ {n9}</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Επειδή οι ακμές ενός πρίσματος είναι 3n, έχουμε 3n ＝ ${edges9}, άρα n ＝ ${n9} πλευρές.`
        : `Since a prism has 3n edges, 3n ＝ ${edges9}, which gives n ＝ ${n9} sides.`
    });

    // Q10: Input + tableData + SVG - Συνολικό μήκος όλων των ακμών ορθού πρίσματος
    const n10 = pickRandom([3, 4, 5, 6]);
    const side10 = randInt(3, 7);
    const height10 = randInt(5, 11);
    const baseEdgesSum10 = 2 * n10 * side10;
    const latEdgesSum10 = n10 * height10;
    const totalLen10 = baseEdgesSum10 + latEdgesSum10;

    qList.push({
      id: 10,
      title: isEl ? 'Συνολικό Μήκος Ακμών Ορθού Πρίσματος' : 'Total Edge Length of a Right Prism',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει βάση κανονικό ${n10}-γωνο πλευράς ${side10} cm και ύψος ${height10} cm. Πόσα cm είναι το άθροισμα των μηκών όλων των ακμών του;`
        : `A right prism has a regular ${n10}-gon base with side length ${side10} cm and height ${height10} cm. What is the total sum of the lengths of all its edges in cm?`,
      type: 'input',
      correct: totalLen10,
      unit: 'cm',
      diagram: {
        type: 'rightPrism',
        n: n10,
        caption: isEl ? `Πλευρά βάσης ${side10} cm, ύψος ${height10} cm` : `Base side ${side10} cm, height ${height10} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Ακμές των 2 βάσεων' : '1. Edges of both bases',
          details: `2 · ${n10} · ${side10} ＝ ${baseEdgesSum10} cm`
        },
        {
          label: isEl ? '2. Παράπλευρες ακμές' : '2. Lateral edges',
          details: `${n10} · ${height10} ＝ ${latEdgesSum10} cm`
        },
        {
          label: isEl ? '3. Συνολικό άθροισμα' : '3. Total sum',
          details: `${baseEdgesSum10} ＋ ${latEdgesSum10} ＝ ${totalLen10} cm`
        }
      ],
      explanation: isEl
        ? `Οι δύο βάσεις έχουν 2 · ${n10} ＝ ${2 * n10} ακμές των ${side10} cm (${baseEdgesSum10} cm) και υπάρχουν ${n10} παράπλευρες ακμές των ${height10} cm (${latEdgesSum10} cm). Σύνολο: ${totalLen10} cm.`
        : `The two bases have 2 · ${n10} ＝ ${2 * n10} edges of ${side10} cm (${baseEdgesSum10} cm) plus ${n10} lateral edges of ${height10} cm (${latEdgesSum10} cm). Total: ${totalLen10} cm.`
    });

    // Q11: MCQ + tableData + SVG - Ανάπτυγμα / Εμβαδόν παράπλευρης επιφάνειας ορθού πρίσματος
    const n11 = pickRandom([3, 4, 5, 6]);
    const side11 = randInt(3, 6);
    const height11 = randInt(4, 9);
    const perim11 = n11 * side11;
    const latArea11 = perim11 * height11;
    const corr11 = `${latArea11} cm²`;
    const dist11 = [
      `${latArea11} cm²`,
      `${side11 * height11} cm²`,
      `${perim11 + height11} cm²`,
      `${2 * latArea11} cm²`,
      `${latArea11 + perim11} cm²`
    ];

    qList.push({
      id: 11,
      title: isEl ? 'Εμβαδόν Παράπλευρων Εδρών Ορθού Πρίσματος' : 'Lateral Surface Area of a Right Prism',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει βάση κανονικό ${n11}-γωνο πλευράς ${side11} cm και ύψος ${height11} cm. Πόσο είναι το συνολικό εμβαδόν όλων των παράπλευρων εδρών του;`
        : `A right prism has a regular ${n11}-gon base of side ${side11} cm and height ${height11} cm. What is the total area of all its lateral faces?`,
      type: 'mcq',
      correct: corr11,
      options: ensureFourUniqueOptions(corr11, () => pickRandom(dist11)),
      diagram: {
        type: 'rightPrism',
        n: n11,
        caption: isEl ? `${n11} ορθογώνια διαστάσεων ${side11}×${height11} cm` : `${n11} rectangles of ${side11}×${height11} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Εμβαδόν 1 παράπλευρης έδρας' : '1. Area of 1 lateral face',
          details: `${side11} · ${height11} ＝ ${side11 * height11} cm²`
        },
        {
          label: isEl ? `2. Σύνολο ${n11} εδρών` : `2. Total for ${n11} faces`,
          details: `${n11} · ${side11 * height11} ＝ ${latArea11} cm²`
        }
      ],
      explanation: isEl
        ? `Κάθε παράπλευρη έδρα είναι ορθογώνιο διαστάσεων ${side11} cm × ${height11} cm (εμβαδόν ${side11 * height11} cm²). Επειδή έχει ${n11} παράπλευρες έδρες, το συνολικό παράπλευρο εμβαδόν είναι ${n11} · ${side11 * height11} ＝ ${latArea11} cm².`
        : `Each lateral face is a ${side11} cm × ${height11} cm rectangle (area ${side11 * height11} cm²). With ${n11} lateral faces, total lateral area is ${n11} · ${side11 * height11} ＝ ${latArea11} cm².`
    });

    // Q12: Input + tableData + SVG - Συνδυαστικό πρόβλημα: Εύρεση n από κορυφές και υπολογισμός εδρών + ακμών
    const n12 = pickRandom([4, 5, 6, 7]);
    const vert12 = 2 * n12;
    const sumFE12 = (n12 + 2) + (3 * n12);

    qList.push({
      id: 12,
      title: isEl ? 'Συνδυασμός Στοιχείων Ορθού Πρίσματος' : 'Combining Elements of a Right Prism',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει συνολικά ${vert12} κορυφές. Πόσο είναι το άθροισμα των εδρών και των ακμών του μαζί (Έδρες ＋ Ακμές);`
        : `A right prism has ${vert12} vertices in total. What is the sum of its faces and edges combined (Faces ＋ Edges)?`,
      type: 'input',
      correct: sumFE12,
      unit: '',
      diagram: {
        type: 'rightPrism',
        n: Math.min(6, n12),
        caption: isEl ? `Κορυφές ＝ ${vert12} ⇒ n ＝ ${n12}` : `Vertices ＝ ${vert12} ⇒ n ＝ ${n12}`
      },
      tableData: [
        {
          label: isEl ? '1. Πλευρές βάσης (n)' : '1. Base sides (n)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>2n ＝ {vert12} ⇒ n ＝</span>
              <Frac num={vert12} den="2" />
              <span>＝ {n12}</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Έδρες & Ακμές' : '2. Faces & Edges',
          details: isEl
            ? `Έδρες ＝ ${n12 + 2}, Ακμές ＝ 3·${n12} ＝ ${3 * n12}`
            : `Faces ＝ ${n12 + 2}, Edges ＝ 3·${n12} ＝ ${3 * n12}`
        },
        {
          label: isEl ? '3. Άθροισμα (Ε ＋ Α)' : '3. Sum (F ＋ E)',
          details: `${n12 + 2} ＋ ${3 * n12} ＝ ${sumFE12}`
        }
      ],
      explanation: isEl
        ? `Από 2n ＝ ${vert12} βρίσκουμε n ＝ ${n12}. Άρα το πρίσμα έχει ${n12 + 2} έδρες και ${3 * n12} ακμές, με άθροισμα ${n12 + 2} ＋ ${3 * n12} ＝ ${sumFE12}.`
        : `From 2n ＝ ${vert12} we get n ＝ ${n12}. Thus the prism has ${n12 + 2} faces and ${3 * n12} edges, summing to ${n12 + 2} ＋ ${3 * n12} ＝ ${sumFE12}.`
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
      backUrl="/a-gymnasiou/51-sterea"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/51-sterea"
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
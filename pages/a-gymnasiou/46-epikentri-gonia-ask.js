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
    ? { O: 'Ο', A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', M: 'Μ' }
    : { O: 'O', A: 'A', B: 'B', C: 'C', D: 'D', M: 'M' };

  // 1. Επίκεντρη γωνία & Κυκλικός τομέας (Ερ. 2, 7, 11)
  if (diagram.type === 'sector') {
    const cx = 132;
    const cy = 82;
    const R = 52;
    const omega = diagram.omega || 75;
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

  // 2. Άθροισμα διαδοχικών επίκεντρων γωνιών / τόξων (Ερ. 8, 9)
  if (diagram.type === 'consecutiveArcs') {
    const cx = 132;
    const cy = 82;
    const R = 52;
    const a1 = diagram.ang1 || 55;
    const a2 = diagram.ang2 || 70;
    const r1 = (a1 * Math.PI) / 180;
    const r12 = ((a1 + a2) * Math.PI) / 180;

    const Ax = cx + R;
    const Ay = cy;
    const Bx = cx + R * Math.cos(-r1);
    const By = cy + R * Math.sin(-r1);
    const Cx = cx + R * Math.cos(-r12);
    const Cy = cy + R * Math.sin(-r12);
    const largeArc = a1 + a2 > 180 ? 1 : 0;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx={cx} cy={cy} r={R} fill="rgba(99, 102, 241, 0.12)" stroke="#64748b" strokeWidth="1.8" />
          {/* Τόξο ΑΒ (πράσινο) & ΒΓ (πορτοκαλί) */}
          <path d={`M ${Ax},${Ay} A ${R},${R} 0 0,0 ${Bx.toFixed(1)},${By.toFixed(1)}`} fill="none" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
          <path d={`M ${Bx.toFixed(1)},${By.toFixed(1)} A ${R},${R} 0 0,0 ${Cx.toFixed(1)},${Cy.toFixed(1)}`} fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeLinecap="round" />
          {/* Συνολικό τόξο ΑΓ (εσωτερικό τόξο ένδειξης) */}
          <path
            d={`M ${cx + 22},${cy} A 22,22 0 ${largeArc},0 ${(cx + 22 * Math.cos(-r12)).toFixed(1)},${(cy + 22 * Math.sin(-r12)).toFixed(1)}`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2"
          />

          <line x1={cx} y1={cy} x2={Ax} y2={Ay} stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
          <line x1={cx} y1={cy} x2={Bx} y2={By} stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
          <line x1={cx} y1={cy} x2={Cx} y2={Cy} stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />

          <circle cx={cx} cy={cy} r="3.5" fill="#ffffff" />
          <circle cx={Ax} cy={Ay} r="3.6" fill="#34d399" />
          <circle cx={Bx} cy={By} r="3.6" fill="#fbbf24" />
          <circle cx={Cx} cy={Cy} r="3.6" fill="#fbbf24" />

          <text x={cx} y={cy + 14} textAnchor="middle" className="text-[10px] font-black fill-white">{v.O}</text>
          <text x={Ax + 8} y={Ay + 4} textAnchor="start" className="text-[11px] font-black fill-emerald-300">{v.A}</text>
          <text x={Bx + 6} y={By - 6} textAnchor="start" className="text-[11px] font-black fill-amber-300">{v.B}</text>
          <text x={Cx - 8} y={Cy - 4} textAnchor="end" className="text-[11px] font-black fill-amber-300">{v.C}</text>
          <text x={cx} y={154} textAnchor="middle" className="text-[10px] font-mono font-bold fill-sky-300">
            {a1}° + {a2}° = {a1 + a2}°
          </text>
        </svg>
      </div>
    );
  }

  // 3. Σχετικές θέσεις ευθείας & κύκλου (Ερ. 3, 10, 12)
  if (diagram.type === 'lineCircle') {
    const cx = 132;
    const cy = 74;
    const R = 48;
    const pos = diagram.pos || 'tangent'; // 'secant' | 'tangent' | 'exterior'
    const lineY = pos === 'secant' ? cy + 28 : pos === 'tangent' ? cy + R : cy + 68;
    const lineColor = pos === 'secant' ? '#34d399' : pos === 'tangent' ? '#fbbf24' : '#fb7185';
    const dx = pos === 'secant' ? Math.sqrt(R * R - 28 * 28) : 0;

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx={cx} cy={cy} r={R} fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2.2" />
          {/* Ακτίνα ρ */}
          <line x1={cx} y1={cy} x2={cx - R} y2={cy} stroke="#818cf8" strokeWidth="1.6" strokeDasharray="3 2" />
          <text x={cx - 24} y={cy - 5} textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-300">
            ρ={diagram.rLabel}
          </text>

          {/* Ευθεία (ε) */}
          <line x1="36" y1={lineY} x2="228" y2={lineY} stroke={lineColor} strokeWidth="2.2" />
          <text x="234" y={lineY + 4} className="text-[10px] font-black fill-white">({isEl ? 'ε' : 'l'})</text>

          {/* Απόσταση δ */}
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

  return null;
}

export default function EpikentriGoniaExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Επίκεντρη Γωνία, Κυκλικός Τομέας & Ευθεία – Κύκλος | Α' Γυμνασίου" : "Exercises: Central Angle, Circular Sector & Line – Circle | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στην επίκεντρη γωνία, το μέτρο τόξου, τον κυκλικό τομέα, τις ίσες/άνισες επίκεντρες γωνίες και τις σχετικές θέσεις ευθείας και κύκλου."
      : "Interactive Grade 7 geometry exercises on central angles, arc degree measure, circular sectors, equal/unequal central angles, and line-circle relative positions.",
    backNav: isEl ? "Θεωρία Κεφ. 10" : "Theory Ch. 10",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 10 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 10 • GRADE 7",
    heroTitle: isEl ? "Επίκεντρη Γωνία & Ευθεία – Κύκλος: Εξάσκηση" : "Central Angle & Line – Circle: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στις επίκεντρες γωνίες, στα τόξα, στους κυκλικούς τομείς και στις σχετικές θέσεις ευθείας και κύκλου."
      : "12 dynamic questions and problems on central angles, arcs, circular sectors, and relative positions of a line and a circle.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τις επίκεντρες γωνίες, τους κυκλικούς τομείς και τις σχετικές θέσεις ευθείας και κύκλου."
      : "Outstanding performance! You have mastered central angles, circular sectors, and line-circle relative positions.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the detailed steps and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στις επίκεντρες γωνίες, στα τόξα και στις εφαπτόμενες κύκλου!"
      : "Needs a bit more review on central angles, arcs, and circle tangents!",
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

    // Q1: True / False - Ορισμός επίκεντρης γωνίας & μέτρου τόξου
    const q1Pool = isEl
      ? [
          {
            p: 'Το μέτρο σε μοίρες ενός τόξου ενός κύκλου ισούται με το μέτρο της αντίστοιχης επίκεντρης γωνίας του.',
            t: true,
            e: 'Ως μέτρο τόξου (σε μοίρες) ορίζεται ακριβώς το μέτρο της επίκεντρης γωνίας που το περιέχει.'
          },
          {
            p: 'Δύο τόξα διαφορετικών κύκλων που έχουν μέτρο 90° το καθένα έχουν υποχρεωτικά και το ίδιο μήκος σε εκατοστά.',
            t: false,
            e: 'Το μέτρο σε μοίρες (90°) δείχνει ότι και τα δύο είναι τεταρτοκύκλια, αλλά το μήκος τους σε εκατοστά εξαρτάται από την ακτίνα ρ κάθε κύκλου.'
          },
          {
            p: 'Κάθε γωνία που έχει κορυφή το κέντρο Ο ενός κύκλου (Ο, ρ) ονομάζεται επίκεντρη γωνία.',
            t: true,
            e: 'Επίκεντρη γωνία ενός κύκλου (Ο, ρ) είναι κάθε γωνία με κορυφή το κέντρο Ο του κύκλου.'
          }
        ]
      : [
          {
            p: 'The degree measure of a circular arc equals the measure of its corresponding central angle.',
            t: true,
            e: 'By definition, the degree measure of an arc is equal to the measure of the central angle intercepting it.'
          },
          {
            p: 'Two arcs in circles of different radii that both measure 90° necessarily have the same length in centimeters.',
            t: false,
            e: 'Both are quarter circles (90°), but their physical length in centimeters depends on each circle’s radius ρ.'
          },
          {
            p: 'Any angle whose vertex is the center O of a circle (O, ρ) is called a central angle.',
            t: true,
            e: 'A central angle of circle (O, ρ) is any angle with its vertex at center O.'
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Επίκεντρη Γωνία & Μέτρο Τόξου' : 'Central Angle & Arc Degree Measure',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedQ1.e
    });

    // Q2: Input - Μέτρο τόξου / επίκεντρης γωνίας & Κυκλικός τομέας (+ SVG)
    const omega2 = randInt(35, 145);
    const askArc2 = Math.random() < 0.5;

    qList.push({
      id: 2,
      title: isEl ? 'Μέτρο Τόξου & Κυκλικού Τομέα' : 'Arc & Circular Sector Measure',
      prompt: askArc2
        ? (isEl ? (
            <span>
              Σε κύκλο (Ο, ρ) η επίκεντρη γωνία Α<Angle>Ο</Angle>Β είναι {omega2}°. Πόσες μοίρες είναι το μέτρο του αντίστοιχου τόξου <Arc>ΑΒ</Arc>;
            </span>
          ) : (
            <span>
              In circle (O, ρ), central angle ∠AOB measures {omega2}°. How many degrees is the measure of its intercepted arc <Arc>AB</Arc>?
            </span>
          ))
        : (isEl ? (
            <span>
              Σε κύκλο (Ο, ρ) το τόξο <Arc>ΑΒ</Arc> έχει μέτρο {omega2}°. Πόσες μοίρες είναι η γωνία του κυκλικού τομέα ΟΑΒ;
            </span>
          ) : (
            <span>
              In circle (O, ρ), arc <Arc>AB</Arc> has degree measure {omega2}°. How many degrees is the angle of circular sector OAB?
            </span>
          )),
      type: 'input',
      correct: omega2,
      unit: '°',
      diagram: { type: 'sector', omega: omega2, caption: isEl ? `Τόξο ΑΒ ＝ ΑΟΒ ＝ ${omega2}°` : `Arc AB ＝ ∠AOB ＝ ${omega2}°` },
      explanation: isEl ? (
        <span>
          Το μέτρο ενός τόξου σε μοίρες ισούται με την αντίστοιχη επίκεντρη γωνία (γωνία του κυκλικού τομέα), άρα είναι {omega2}°.
        </span>
      ) : (
        <span>
          The degree measure of an arc equals its corresponding central angle (the sector angle), which is {omega2}°.
        </span>
      )
    });

    // Q3: MCQ - Σχετική θέση ευθείας & κύκλου από δ και ρ (+ SVG)
    const r3 = randInt(6, 13);
    const posChoice3 = pickRandom(['secant', 'tangent', 'exterior']);
    let dist3, corr3, expl3;

    if (posChoice3 === 'secant') {
      dist3 = randInt(2, r3 - 1);
      corr3 = isEl ? 'Τέμνουσα ευθεία (2 κοινά σημεία)' : 'Secant line (2 common points)';
      expl3 = isEl
        ? `Επειδή δ ＝ ${dist3} cm ＜ ${r3} cm (δηλαδή δ ＜ ρ), η ευθεία (ε) τέμνει τον κύκλο σε 2 κοινά σημεία.`
        : `Since d ＝ ${dist3} cm ＜ ${r3} cm (d ＜ ρ), line (l) intersects the circle at 2 common points.`;
    } else if (posChoice3 === 'tangent') {
      dist3 = r3;
      corr3 = isEl ? 'Εφαπτόμενη ευθεία (1 κοινό σημείο)' : 'Tangent line (1 common point)';
      expl3 = isEl
        ? `Επειδή δ ＝ ${dist3} cm ＝ ρ, η ευθεία (ε) εφάπτεται στον κύκλο σε 1 κοινό σημείο.`
        : `Since d ＝ ${dist3} cm ＝ ρ, line (l) is tangent to the circle at 1 common point.`;
    } else {
      dist3 = r3 + randInt(2, 6);
      corr3 = isEl ? 'Εξωτερική ευθεία (0 κοινά σημεία)' : 'Exterior line (0 common points)';
      expl3 = isEl
        ? `Επειδή δ ＝ ${dist3} cm ＞ ${r3} cm (δηλαδή δ ＞ ρ), η ευθεία (ε) είναι εξωτερική (0 κοινά σημεία).`
        : `Since d ＝ ${dist3} cm ＞ ${r3} cm (d ＞ ρ), line (l) is exterior (0 common points).`;
    }

    const distOpts3 = isEl
      ? [
          'Τέμνουσα ευθεία (2 κοινά σημεία)',
          'Εφαπτόμενη ευθεία (1 κοινό σημείο)',
          'Εξωτερική ευθεία (0 κοινά σημεία)',
          'Διάμετρος του κύκλου',
          'Εξωτερική με 1 κοινό σημείο'
        ]
      : [
          'Secant line (2 common points)',
          'Tangent line (1 common point)',
          'Exterior line (0 common points)',
          'Diameter of the circle',
          'Exterior with 1 common point'
        ];

    qList.push({
      id: 3,
      title: isEl ? 'Σχετικές Θέσεις Ευθείας & Κύκλου' : 'Relative Positions of a Line & a Circle',
      prompt: isEl
        ? `Ένας κύκλος (Ο, ρ) έχει ακτίνα ρ ＝ ${r3} cm. Αν μια ευθεία (ε) απέχει από το κέντρο Ο απόσταση δ ＝ ${dist3} cm, ποια είναι η σχετική θέση της ευθείας ως προς τον κύκλο;`
        : `A circle (O, ρ) has radius ρ ＝ ${r3} cm. If a line (l) is at distance d ＝ ${dist3} cm from center O, what is its relative position to the circle?`,
      type: 'mcq',
      correct: corr3,
      options: ensureFourUniqueOptions(corr3, () => pickRandom(distOpts3)),
      diagram: { type: 'lineCircle', pos: posChoice3, rLabel: `${r3}`, dLabel: `${dist3}` },
      explanation: expl3
    });

    // Q4: MCQ - Κυκλικός τομέας (ορισμός & ειδικές περιπτώσεις 90°, 180°)
    const secPool4 = isEl
      ? [
          {
            q: 'Πώς ονομάζεται το μέρος ενός κυκλικού δίσκου που περιέχεται ανάμεσα σε δύο ακτίνες ΟΑ, ΟΒ και στο αντίστοιχο τόξο ΑΒ;',
            c: 'Κυκλικός τομέας',
            e: 'Κυκλικός τομέας είναι το μέρος του κυκλικού δίσκου ανάμεσα σε δύο ακτίνες και το αντίστοιχο τόξο.'
          },
          {
            q: 'Πόσες μοίρες είναι η επίκεντρη γωνία ενός κυκλικού τομέα που αποτελεί το τέταρτο (1/4) του κυκλικού δίσκου;',
            c: '90°',
            e: 'Το τέταρτο του κύκλου αντιστοιχεί σε επίκεντρη γωνία 360° ÷ 4 ＝ 90° (τεταρτοκύκλιο).'
          },
          {
            q: 'Πόσες μοίρες είναι η επίκεντρη γωνία ενός ημικυκλικού δίσκου;',
            c: '180°',
            e: 'Ο ημικυκλικός δίσκος είναι το μισό του κυκλικού δίσκου και αντιστοιχεί σε επίκεντρη γωνία 360° ÷ 2 ＝ 180°.'
          }
        ]
      : [
          {
            q: 'What is the region of a circular disk bounded by two radii OA, OB and their intercepted arc AB called?',
            c: 'Circular sector',
            e: 'A circular sector is the portion of a circular disk bounded by two radii and their intercepted arc.'
          },
          {
            q: 'How many degrees is the central angle of a circular sector representing one-quarter (1/4) of a circular disk?',
            c: '90°',
            e: 'One-quarter of a circle corresponds to a central angle of 360° ÷ 4 ＝ 90°.'
          },
          {
            q: 'How many degrees is the central angle of a semicircular disk?',
            c: '180°',
            e: 'A semicircular disk is half of a circular disk and corresponds to a central angle of 360° ÷ 2 ＝ 180°.'
          }
        ];

    const pickedSec4 = pickRandom(secPool4);
    const dist4 = isEl
      ? ['Κυκλικός τομέας', '90°', '180°', '60°', '45°', 'Χορδή κύκλου']
      : ['Circular sector', '90°', '180°', '60°', '45°', 'Chord of a circle'];

    qList.push({
      id: 4,
      title: isEl ? 'Ο Κυκλικός Τομέας' : 'The Circular Sector',
      prompt: pickedSec4.q,
      type: 'mcq',
      correct: pickedSec4.c,
      options: ensureFourUniqueOptions(pickedSec4.c, () => pickRandom(dist4)),
      explanation: pickedSec4.e
    });

    // Q5: True / False - Ίσες & Άνισες Επίκεντρες Γωνίες και Εφαπτομένη
    const tfPool5 = isEl
      ? [
          {
            p: 'Στον ίδιο κύκλο, σε ίσες επίκεντρες γωνίες αντιστοιχούν ίσα τόξα και ίσες χορδές.',
            t: true,
            e: 'Αν ΑΟ̂Β ＝ ΓΟ̂Δ στον ίδιο κύκλο, τότε τόξο ΑΒ ＝ τόξο ΓΔ και χορδή ΑΒ ＝ χορδή ΓΔ.'
          },
          {
            p: 'Αν μια ευθεία (ε) εφάπτεται σε κύκλο (Ο, ρ) στο σημείο Α, τότε η ακτίνα επαφής ΟΑ είναι κάθετη στην ευθεία (ε).',
            t: true,
            e: 'Η εφαπτομένη ενός κύκλου στο σημείο επαφής Α είναι πάντα κάθετη στην ακτίνα ΟΑ (ΟΑ ⊥ ε).'
          },
          {
            p: 'Μια εφαπτόμενη ευθεία τέμνει τον κύκλο σε δύο διαφορετικά σημεία.',
            t: false,
            e: 'Η ευθεία που τέμνει τον κύκλο σε 2 σημεία λέγεται τέμνουσα. Η εφαπτόμενη έχει ακριβώς 1 κοινό σημείο με τον κύκλο.'
          }
        ]
      : [
          {
            p: 'In the same circle, equal central angles intercept equal arcs and subtend equal chords.',
            t: true,
            e: 'If ∠AOB ＝ ∠COD in the same circle, then arc AB ＝ arc CD and chord AB ＝ chord CD.'
          },
          {
            p: 'If line (l) is tangent to circle (O, ρ) at point A, then radius OA is perpendicular to line (l).',
            t: true,
            e: 'A tangent to a circle at point A is always perpendicular to the radius OA (OA ⊥ l).'
          },
          {
            p: 'A tangent line intersects a circle at two distinct points.',
            t: false,
            e: 'A line intersecting a circle at 2 points is a secant. A tangent shares exactly 1 point with the circle.'
          }
        ];

    const pickedTf5 = pickRandom(tfPool5);
    qList.push({
      id: 5,
      title: isEl ? 'Ίσες Επίκεντρες Γωνίες & Εφαπτομένη' : 'Equal Central Angles & Tangents',
      prompt: pickedTf5.p,
      type: 'tf',
      correct: pickedTf5.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedTf5.e
    });

    // Q6: Input - Ίσες επίκεντρες γωνίες -> Ίσες χορδές
    const chordLen6 = randInt(5, 14);
    const ang6 = randInt(40, 110);

    qList.push({
      id: 6,
      title: isEl ? 'Ίσες Επίκεντρες Γωνίες & Χορδές' : 'Equal Central Angles & Chords',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) δίνονται δύο επίκεντρες γωνίες Α<Angle>Ο</Angle>Β ＝ {ang6}° και Γ<Angle>Ο</Angle>Δ ＝ {ang6}°. Αν η χορδή ΑΒ έχει μήκος {chordLen6} cm, πόσα εκατοστά (cm) είναι το μήκος της χορδής ΓΔ;
        </span>
      ) : (
        <span>
          In circle (O, ρ), two central angles measure ∠AOB ＝ {ang6}° and ∠COD ＝ {ang6}°. If chord AB has length {chordLen6} cm, what is the length of chord CD in cm?
        </span>
      ),
      type: 'input',
      correct: chordLen6,
      unit: 'cm',
      explanation: isEl ? (
        <span>
          Επειδή οι επίκεντρες γωνίες είναι ίσες (Α<Angle>Ο</Angle>Β ＝ Γ<Angle>Ο</Angle>Δ ＝ {ang6}°), υποτείνουν ίσες χορδές, άρα ΓΔ ＝ ΑΒ ＝ {chordLen6} cm.
        </span>
      ) : (
        <span>
          Since the central angles are equal (∠AOB ＝ ∠COD ＝ {ang6}°), they subtend equal chords, so CD ＝ AB ＝ {chordLen6} cm.
        </span>
      )
    });

    // Q7: Input - Συμπληρωματικό (μείζον) τόξο κύκλου (360° - ω) (+ SVG)
    const minor7 = randInt(55, 145);
    const major7 = 360 - minor7;

    qList.push({
      id: 7,
      title: isEl ? 'Μείζον & Ελασσον Τόξο Κύκλου (360°)' : 'Major & Minor Arcs of a Circle (360°)',
      prompt: isEl ? (
        <span>
          Δύο σημεία Α και Β ενός κύκλου (Ο, ρ) ορίζουν επίκεντρη γωνία Α<Angle>Ο</Angle>Β ＝ {minor7}°. Πόσες μοίρες είναι το μεγαλύτερο τόξο <Arc>ΑΒ</Arc> του κύκλου;
        </span>
      ) : (
        <span>
          Two points A and B on circle (O, ρ) form central angle ∠AOB ＝ {minor7}°. How many degrees is the major arc <Arc>AB</Arc> of the circle?
        </span>
      ),
      type: 'input',
      correct: major7,
      unit: '°',
      diagram: {
        type: 'sector',
        omega: major7,
        caption: isEl ? `Μείζον τόξο ＝ 360° － ${minor7}° ＝ ${major7}°` : `Major arc ＝ 360° － ${minor7}° ＝ ${major7}°`
      },
      explanation: isEl
        ? `Ολόκληρος ο κύκλος είναι 360°. Αφού το μικρότερο τόξο είναι ${minor7}°, το μεγαλύτερο τόξο είναι 360° － ${minor7}° ＝ ${major7}°.`
        : `A full circle is 360°. Since the minor arc is ${minor7}°, the major arc measures 360° － ${minor7}° ＝ ${major7}°.`,
    });

    // Q8: Input + tableData + SVG - Άθροισμα διαδοχικών τόξων / επίκεντρων γωνιών
    const a1_8 = randInt(40, 75);
    const a2_8 = randInt(50, 95);
    const total8 = a1_8 + a2_8;

    qList.push({
      id: 8,
      title: isEl ? 'Άθροισμα Διαδοχικών Τόξων' : 'Sum of Consecutive Arcs',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) παίρνουμε διαδοχικά τόξα <Arc>ΑΒ</Arc> και <Arc>ΒΓ</Arc> με αντίστοιχες επίκεντρες γωνίες Α<Angle>Ο</Angle>Β ＝ {a1_8}° και Β<Angle>Ο</Angle>Γ ＝ {a2_8}°. Πόσες μοίρες είναι το μέτρο του τόξου <Arc>ΑΓ</Arc>;
        </span>
      ) : (
        <span>
          In circle (O, ρ), consecutive arcs <Arc>AB</Arc> and <Arc>BC</Arc> have central angles ∠AOB ＝ {a1_8}° and ∠BOC ＝ {a2_8}°. How many degrees is the measure of arc <Arc>AC</Arc>?
        </span>
      ),
      type: 'input',
      correct: total8,
      unit: '°',
      diagram: { type: 'consecutiveArcs', ang1: a1_8, ang2: a2_8 },
      tableData: [
        {
          label: isEl ? '1. Επίκεντρη γωνία ΑΟΓ' : '1. Central angle ∠AOC',
          details: isEl ? (
            <span>
              Α<Angle>Ο</Angle>Γ ＝ Α<Angle>Ο</Angle>Β ＋ Β<Angle>Ο</Angle>Γ ＝ {a1_8}° ＋ {a2_8}° ＝ {total8}°
            </span>
          ) : (
            `∠AOC ＝ ∠AOB ＋ ∠BOC ＝ ${a1_8}° ＋ ${a2_8}° ＝ ${total8}°`
          )
        },
        {
          label: isEl ? '2. Μέτρο τόξου ΑΓ' : '2. Measure of arc AC',
          details: isEl ? (
            <span>
              Μέτρο <Arc>ΑΓ</Arc> ＝ Α<Angle>Ο</Angle>Γ ＝ {total8}°
            </span>
          ) : (
            `Measure of arc AC ＝ ∠AOC ＝ ${total8}°`
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Η επίκεντρη γωνία Α<Angle>Ο</Angle>Γ είναι το άθροισμα των δύο διαδοχικών γωνιών: {a1_8}° ＋ {a2_8}° ＝ {total8}°, άρα το τόξο <Arc>ΑΓ</Arc> είναι {total8}°.
        </span>
      ) : (
        <span>
          Central angle ∠AOC is the sum of the two consecutive angles: {a1_8}° ＋ {a2_8}° ＝ {total8}°, so arc <Arc>AC</Arc> measures {total8}°.
        </span>
      )
    });

    // Q9: MCQ + tableData + SVG - Σύγκριση άνισων επίκεντρων γωνιών, τόξων και χορδών
    const ang1_9 = randInt(45, 75);
    const ang2_9 = randInt(95, 135);

    const q9Correct = isEl
      ? 'Τόξο ΓΔ ＞ Τόξο ΑΒ και χορδή ΓΔ ＞ χορδή ΑΒ'
      : 'Arc CD ＞ Arc AB and chord CD ＞ chord AB';

    const q9Distractors = isEl
      ? [
          'Τόξο ΓΔ ＞ Τόξο ΑΒ και χορδή ΓΔ ＞ χορδή ΑΒ',
          'Τόξο ΓΔ ＞ Τόξο ΑΒ αλλά χορδή ΓΔ ＜ χορδή ΑΒ',
          'Τόξο ΑΒ ＞ Τόξο ΓΔ και χορδή ΑΒ ＞ χορδή ΓΔ',
          'Τόξο ΑΒ ＝ Τόξο ΓΔ επειδή ανήκουν στον ίδιο κύκλο',
          'Οι χορδές είναι ίσες (ΑΒ ＝ ΓΔ)'
        ]
      : [
          'Arc CD ＞ Arc AB and chord CD ＞ chord AB',
          'Arc CD ＞ Arc AB but chord CD ＜ chord AB',
          'Arc AB ＞ Arc CD and chord AB ＞ chord CD',
          'Arc AB ＝ Arc CD because they belong to the same circle',
          'The chords are equal (AB ＝ CD)'
        ];

    qList.push({
      id: 9,
      title: isEl ? 'Σύγκριση Άνισων Επίκεντρων Γωνιών & Χορδών' : 'Comparing Unequal Central Angles & Chords',
      prompt: isEl ? (
        <span>
          Στον ίδιο κύκλο (Ο, ρ) δίνονται δύο επίκεντρες γωνίες με Α<Angle>Ο</Angle>Β ＝ {ang1_9}° και Γ<Angle>Ο</Angle>Δ ＝ {ang2_9}°. Τι ισχύει για τα αντίστοιχα τόξα και τις χορδές τους;
        </span>
      ) : (
        <span>
          In the same circle (O, ρ), two central angles measure ∠AOB ＝ {ang1_9}° and ∠COD ＝ {ang2_9}°. What holds for their intercepted arcs and chords?
        </span>
      ),
      type: 'mcq',
      correct: q9Correct,
      options: ensureFourUniqueOptions(q9Correct, () => pickRandom(q9Distractors)),
      diagram: { type: 'consecutiveArcs', ang1: ang1_9, ang2: ang2_9 },
      tableData: [
        {
          label: isEl ? '1. Σύγκριση επίκεντρων γωνιών' : '1. Comparing central angles',
          details: isEl ? (
            <span>
              Γ<Angle>Ο</Angle>Δ ＝ {ang2_9}° ＞ {ang1_9}° ＝ Α<Angle>Ο</Angle>Β (και ≤ 180°)
            </span>
          ) : (
            `∠COD ＝ ${ang2_9}° ＞ ${ang1_9}° ＝ ∠AOB (and ≤ 180°)`
          )
        },
        {
          label: isEl ? '2. Συμπέρασμα για τόξα & χορδές' : '2. Conclusion for arcs & chords',
          details: isEl ? (
            <span>
              Μεγαλύτερη επίκεντρη γωνία ⇒ μεγαλύτερο τόξο (<Arc>ΓΔ</Arc> ＞ <Arc>ΑΒ</Arc>) και μεγαλύτερη χορδή (ΓΔ ＞ ΑΒ)
            </span>
          ) : (
            'Larger central angle ⇒ larger arc (CD ＞ AB) and longer chord (CD ＞ AB)'
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Επειδή Γ<Angle>Ο</Angle>Δ ＝ {ang2_9}° ＞ {ang1_9}° ＝ Α<Angle>Ο</Angle>Β (και οι δύο είναι μικρότερες από 180°), στη μεγαλύτερη επίκεντρη γωνία αντιστοιχεί μεγαλύτερο τόξο (<Arc>ΓΔ</Arc> ＞ <Arc>ΑΒ</Arc>) και μεγαλύτερη χορδή (ΓΔ ＞ ΑΒ).
        </span>
      ) : (
        <span>
          Since ∠COD ＝ {ang2_9}° ＞ {ang1_9}° ＝ ∠AOB (both ≤ 180°), the larger central angle corresponds to a larger arc (CD ＞ AB) and a longer chord (CD ＞ AB).
        </span>
      )
    });

    // Q10: MCQ + tableData + SVG - Σχετικές θέσεις ευθείας & κύκλου όταν δίνεται ΔΙΑΜΕΤΡΟΣ (όχι ακτίνα!)
    const r10 = randInt(6, 12);
    const d10 = 2 * r10;
    const lineDist10 = r10; // Ακριβώς ίση με την ακτίνα ρ -> Εφαπτόμενη! (παγίδα με διάμετρο d10)

    const q10Correct = isEl ? 'Εφαπτόμενη ευθεία (1 κοινό σημείο)' : 'Tangent line (1 common point)';
    const q10Distractors = isEl
      ? [
          'Εφαπτόμενη ευθεία (1 κοινό σημείο)',
          'Τέμνουσα ευθεία (2 κοινά σημεία)',
          'Εξωτερική ευθεία (0 κοινά σημεία)',
          'Διάμετρος του κύκλου',
          'Εξωτερική με 1 κοινό σημείο'
        ]
      : [
          'Tangent line (1 common point)',
          'Secant line (2 common points)',
          'Exterior line (0 common points)',
          'Diameter of the circle',
          'Exterior with 1 common point'
        ];

    qList.push({
      id: 10,
      title: isEl ? 'Πρόβλημα Διαμέτρου & Σχετικής Θέσης Ευθείας' : 'Diameter & Line Relative Position Problem',
      prompt: isEl
        ? `Ένας κύκλος (Ο, ρ) έχει διάμετρο ${d10} cm. Μια ευθεία (ε) απέχει από το κέντρο Ο απόσταση δ ＝ ${lineDist10} cm. Ποια είναι η σχετική θέση της ευθείας (ε) ως προς τον κύκλο;`
        : `A circle (O, ρ) has diameter ${d10} cm. A line (l) lies at distance d ＝ ${lineDist10} cm from center O. What is the relative position of line (l) to the circle?`,
      type: 'mcq',
      correct: q10Correct,
      options: ensureFourUniqueOptions(q10Correct, () => pickRandom(q10Distractors)),
      diagram: { type: 'lineCircle', pos: 'tangent', rLabel: `${r10}`, dLabel: `${lineDist10}` },
      tableData: [
        {
          label: isEl ? '1. Υπολογισμός ακτίνας ρ' : '1. Calculating radius ρ',
          details: (
            <span className="inline-flex items-center gap-1">
              ρ ＝ <Frac num={d10} den="2" /> ＝ {r10} cm
            </span>
          )
        },
        {
          label: isEl ? '2. Σύγκριση απόστασης δ με ρ' : '2. Comparing distance d with ρ',
          details: `δ ＝ ${lineDist10} cm ＝ ρ ⇒ Η ευθεία (ε) εφάπτεται στον κύκλο (1 κοινό σημείο)`
        }
      ],
      explanation: isEl
        ? `Η διάμετρος είναι ${d10} cm, άρα η ακτίνα του κύκλου είναι ρ ＝ ${d10} ÷ 2 ＝ ${r10} cm. Επειδή η απόσταση δ ＝ ${lineDist10} cm ισούται με την ακτίνα ρ, η ευθεία (ε) είναι εφαπτόμενη (1 κοινό σημείο).`
        : `The diameter is ${d10} cm, so radius ρ ＝ ${d10} ÷ 2 ＝ ${r10} cm. Since distance d ＝ ${lineDist10} cm equals radius ρ, line (l) is tangent (1 common point).`
    });

    // Q11: Input + tableData + SVG - Κατανομή κύκλου 360° σε ίσους κυκλικούς τομείς / επίκεντρες γωνίες
    const partsPool11 = [4, 5, 6, 8, 9, 10, 12];
    const n11 = pickRandom(partsPool11);
    const angleEach11 = 360 / n11;

    qList.push({
      id: 11,
      title: isEl ? 'Ίσοι Κυκλικοί Τομείς (Κατανομή 360°)' : 'Equal Circular Sectors (Partitioning 360°)',
      prompt: isEl
        ? `Χωρίζουμε έναν κυκλικό δίσκο (Ο, ρ) σε ${n11} ίσους κυκλικούς τομείς. Πόσες μοίρες είναι η επίκεντρη γωνία καθενός από αυτούς τους κυκλικούς τομείς;`
        : `We divide a circular disk (O, ρ) into ${n11} equal circular sectors. How many degrees is the central angle of each circular sector?`,
      type: 'input',
      correct: angleEach11,
      unit: '°',
      diagram: {
        type: 'sector',
        omega: angleEach11,
        caption: isEl ? `360° ÷ ${n11} ＝ ${angleEach11}°` : `360° ÷ ${n11} ＝ ${angleEach11}°`
      },
      tableData: [
        {
          label: isEl ? '1. Ολόκληρος κύκλος' : '1. Full circle',
          details: '360°'
        },
        {
          label: isEl ? '2. Διαίρεση σε ίσους τομείς' : '2. Dividing into equal sectors',
          details: (
            <span className="inline-flex items-center gap-1">
              ω ＝ <Frac num="360°" den={n11} /> ＝ {angleEach11}°
            </span>
          )
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl
              ? `Ολόκληρος ο κύκλος αντιστοιχεί σε 360°, οπότε η γωνία κάθε ίσου τομέα είναι:`
              : `A full circle corresponds to 360°, so each equal sector has angle:`}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            <Frac num="360°" den={n11} /> ＝ {angleEach11}°.
          </span>
        </span>
      )
    });

    // Q12: Input + tableData + SVG - Εφαπτόμενη ευθεία & Ορθογώνιο τρίγωνο ΟΑΜ (ΟΑ ⊥ ε)
    const angO12 = randInt(28, 64);
    const angM12 = 90 - angO12;

    qList.push({
      id: 12,
      title: isEl ? 'Ιδιότητα Εφαπτομένης & Υπολογισμός Γωνίας' : 'Tangent Property & Angle Calculation',
      prompt: isEl ? (
        <span>
          Μια ευθεία (ε) εφάπτεται σε κύκλο (Ο, ρ) στο σημείο Α, και Μ είναι ένα σημείο της (ε). Αν στο τρίγωνο ΟΑΜ η επίκεντρη γωνία Α<Angle>Ο</Angle>Μ είναι {angO12}°, πόσες μοίρες είναι η γωνία Ο<Angle>Μ</Angle>Α;
        </span>
      ) : (
        <span>
          A line (l) is tangent to circle (O, ρ) at point A, and M is a point on (l). If in triangle OAM angle ∠AOM measures {angO12}°, how many degrees is angle ∠OMA?
        </span>
      ),
      type: 'input',
      correct: angM12,
      unit: '°',
      diagram: { type: 'lineCircle', pos: 'tangent', rLabel: 'ρ', dLabel: 'ρ' },
      tableData: [
        {
          label: isEl ? '1. Καθετότητα εφαπτομένης' : '1. Tangent perpendicularity',
          details: isEl ? (
            <span>
              Επειδή η (ε) εφάπτεται στο Α, ισχύει ΟΑ ⊥ (ε) ⇒ Ο<Angle>Α</Angle>Μ ＝ 90°
            </span>
          ) : (
            'Since (l) is tangent at A, OA ⊥ (l) ⇒ ∠OAM ＝ 90°'
          )
        },
        {
          label: isEl ? '2. Ορθογώνιο τρίγωνο ΟΑΜ' : '2. Right triangle OAM',
          details: isEl ? (
            <span>
              Α<Angle>Ο</Angle>Μ ＋ Ο<Angle>Μ</Angle>Α ＝ 90° ⇒ Ο<Angle>Μ</Angle>Α ＝ 90° － {angO12}° ＝ {angM12}°
            </span>
          ) : (
            `∠AOM ＋ ∠OMA ＝ 90° ⇒ ∠OMA ＝ 90° － ${angO12}° ＝ ${angM12}°`
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Η ακτίνα επαφής ΟΑ είναι κάθετη στην εφαπτομένη (ε), άρα Ο<Angle>Α</Angle>Μ ＝ 90°. Στο ορθογώνιο τρίγωνο ΟΑΜ οι δύο οξείες γωνίες είναι συμπληρωματικές, οπότε Ο<Angle>Μ</Angle>Α ＝ 90° － {angO12}° ＝ {angM12}°.
        </span>
      ) : (
        <span>
          Radius OA is perpendicular to tangent (l), so ∠OAM ＝ 90°. In right triangle OAM, the two acute angles are complementary, hence ∠OMA ＝ 90° － {angO12}° ＝ {angM12}°.
        </span>
      )
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
      backUrl="/a-gymnasiou/46-epikentri-gonia"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/46-epikentri-gonia"
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
                      <div className="p-3 sm:p-4 bg-slate-100/70 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed">
                        <div className="font-bold text-slate-900 mb-1 flex flex-wrap items-center gap-1.5">
                          <span>{t.correctAnswerTitle}</span>
                          <span className="font-mono text-emerald-700 font-bold inline-flex items-center whitespace-nowrap gap-1">
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
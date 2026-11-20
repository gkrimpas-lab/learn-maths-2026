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
    ? { A: 'Α', B: 'Β', C: 'Γ', Ap: "Α'", Bp: "Β'", Cp: "Γ'", M: 'Μ', K: 'Κ', O: 'Ο' }
    : { A: 'A', B: 'B', C: 'C', Ap: "A'", Bp: "B'", Cp: "C'", M: 'M', K: 'K', O: 'O' };

  // 1. Συμμετρικό σημείου Α και Α' ως προς άξονα (ε)
  if (diagram.type === 'pointReflection') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <line x1="132" y1="12" x2="132" y2="148" stroke="#fb7185" strokeWidth="2.2" />
          <text x="139" y="22" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>

          {diagram.showK && (
            <>
              <polygon points="132,36 62,114 202,114" fill="rgba(99, 102, 241, 0.16)" stroke="#818cf8" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="132" cy="36" r="3.8" fill="#fbbf24" />
              <text x="124" y="34" textAnchor="end" className="text-[11px] font-black fill-amber-300">{v.K}</text>
              <text x="92" y="70" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">{diagram.kLabel}</text>
              <text x="172" y="70" textAnchor="start" className="text-[10px] font-mono font-bold fill-amber-300">{diagram.kLabel}</text>
            </>
          )}

          <line x1="62" y1="114" x2="202" y2="114" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
          <polyline points="132,104 142,104 142,114" fill="none" stroke="#fb7185" strokeWidth="1.6" />

          <circle cx="62" cy="114" r="3.8" fill="#818cf8" />
          <circle cx="202" cy="114" r="3.8" fill="#34d399" />
          <circle cx="132" cy="114" r="3.2" fill="#fb7185" />

          <text x="55" y="128" textAnchor="end" className="text-[11px] font-black fill-indigo-300">{v.A}</text>
          <text x="209" y="128" textAnchor="start" className="text-[11px] font-black fill-emerald-300">{v.Ap}</text>
          <text x="125" y="128" textAnchor="end" className="text-[10px] font-black fill-rose-300">{v.M}</text>

          <text x="97" y="106" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            {diagram.halfLabel}
          </text>
          <text x="167" y="106" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            {diagram.halfLabel}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Συμμετρικά τρίγωνα ΑΒΓ και Α'Β'Γ' ως προς άξονα (ε)
  if (diagram.type === 'triangleReflection') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 270 165" className="w-full max-w-[270px] h-38 select-none">
          <line x1="135" y1="10" x2="135" y2="155" stroke="#fb7185" strokeWidth="2.2" />
          <text x="142" y="20" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>

          <line x1="82" y1="36" x2="188" y2="36" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />
          <line x1="46" y1="92" x2="224" y2="92" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />
          <line x1="96" y1="136" x2="174" y2="136" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />

          <polygon points="82,36 46,92 96,136" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="188,36 224,92 174,136" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />

          <text x="82" y="28" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">{diagram.lblA || v.A}</text>
          <text x="40" y="96" textAnchor="end" className="text-[10px] font-black fill-indigo-300">{diagram.lblB || v.B}</text>
          <text x="96" y="150" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">{diagram.lblC || v.C}</text>

          <text x="188" y="28" textAnchor="middle" className="text-[10px] font-black fill-emerald-300">{diagram.lblAp || v.Ap}</text>
          <text x="230" y="96" textAnchor="start" className="text-[10px] font-black fill-emerald-300">{diagram.lblBp || v.Bp}</text>
          <text x="174" y="150" textAnchor="middle" className="text-[10px] font-black fill-emerald-300">{diagram.lblCp || v.Cp}</text>
        </svg>
      </div>
    );
  }

  // 3. Ανάκλαση σημείου στο Καρτεσιανό Επίπεδο
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
          {[-6, -4, -2, 2, 4, 6].map((g) => (
            <line key={`gx-${g}`} x1={cx + g * unit} y1={14} x2={cx + g * unit} y2={150} stroke="#1e293b" strokeWidth="1" />
          ))}
          {[-4, -2, 2, 4].map((g) => (
            <line key={`gy-${g}`} x1={30} y1={cy - g * unit} x2={234} y2={cy - g * unit} stroke="#1e293b" strokeWidth="1" />
          ))}

          <line x1="26" y1={cy} x2="238" y2={cy} stroke={axis === 'x' ? '#fbbf24' : '#64748b'} strokeWidth={axis === 'x' ? '2.2' : '1.5'} />
          <line x1={cx} y1="12" x2={cx} y2="152" stroke={axis === 'y' ? '#34d399' : '#64748b'} strokeWidth={axis === 'y' ? '2.2' : '1.5'} />

          <text x="243" y={cy + 3} className="text-[9px] font-black fill-amber-300">x</text>
          <text x={cx + 4} y="16" className="text-[9px] font-black fill-emerald-300">y</text>

          <line x1={px1} y1={py1} x2={px2} y2={py2} stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 3" />

          <circle cx={px1} cy={py1} r="4" fill="#818cf8" />
          <text
            x={px1 + (x1 >= 0 ? 6 : -6)}
            y={py1 + (y1 >= 0 ? -6 : 12)}
            textAnchor={x1 >= 0 ? 'start' : 'end'}
            className="text-[9px] font-black fill-indigo-300"
          >
            {diagram.lbl1 || `${v.M}${fmtCoord(x1, y1)}`}
          </text>

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

  // 4. Ανάκλαση πολυγώνου στο Καρτεσιανό Επίπεδο
  if (diagram.type === 'coordPoly') {
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

  return null;
}

export default function Epanalipsi4Exercises() {
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
    pageTitle: isEl ? "Επανάληψη 4: Κεφάλαια 11 & 12 | Α' Γυμνασίου" : "Review 4: Chapters 11 & 12 | Grade 7",
    pageDesc: isEl
      ? "Επαναληπτικές ασκήσεις και συνδυαστικά προβλήματα Α' Γυμνασίου στα Κεφάλαια 11 (Αξονική Συμμετρία & Συμμετρικά Βασικών Σχημάτων) και 12 (Αξονική Συμμετρία στο Σύστημα Αξόνων)."
      : "Grade 7 review exercises and challenging problems covering Chapters 11 (Axial Symmetry & Symmetry Axes of Shapes) and 12 (Axial Symmetry in the Coordinate System).",
    backNav: isEl ? "Α' Γυμνασίου" : "Grade 7",
    theoryBtn: isEl ? "ΚΕΦΑΛΑΙΑ 11-12" : "CHAPTERS 11-12",
    heroBadge: isEl ? "ΕΠΑΝΑΛΗΨΗ 4 • ΚΕΦΑΛΑΙΑ 11 & 12 • Α' ΓΥΜΝΑΣΙΟΥ" : "REVIEW 4 • CHAPTERS 11 & 12 • GRADE 7",
    heroTitle: isEl ? "Επανάληψη 4: Αξονική Συμμετρία & Σύστημα Αξόνων" : "Review 4: Axial Symmetry & Coordinate System",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις (4 ασκήσεις ανά κεφάλαιο + 4 απαιτητικά συνδυαστικά προβλήματα στο τέλος, 2 από κάθε κεφάλαιο). Κάθε νέο σετ παράγει διαφορετικά θέματα!"
      : "12 dynamic questions (4 exercises per chapter + 4 challenging combined problems at the end, 2 from each chapter). Every new set generates fresh problems!",
    btnNewSet: isEl ? "ΝΕΟ ΕΠΑΝΑΛΗΠΤΙΚΟ ΣΕΤ" : "NEW REVIEW SET",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Άριστη επίδοση! Κατέχετε πλήρως την αξονική συμμετρία, τους άξονες συμμετρίας βασικών σχημάτων και τις συμμετρικές συντεταγμένες (Κεφάλαια 11 και 12)."
      : "Excellent performance! You have mastered axial symmetry, symmetry axes of basic shapes, and coordinate reflections (Chapters 11 and 12).",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τις αναλυτικές λύσεις και τα σχήματα στα προβλήματα που δυσκολευτήκατε."
      : "Very good effort! Check the detailed solutions and diagrams for any problems you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στα Κεφάλαια 11 και 12!"
      : "Needs a bit more review on Chapters 11 and 12!",
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
    // ΜΕΡΟΣ Α: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 11 (Αξονική Συμμετρία & Άξονες Σχημάτων)
    // =========================================================================

    // --- ΚΕΦ. 11 • ΑΣΚΗΣΗ 1: Ορισμός συμμετρικού σημείου ως προς ευθεία (ε) ---
    const tfPool1 = isEl
      ? [
          {
            p: "Αν το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε), τότε η ευθεία (ε) είναι η μεσοκάθετος του τμήματος ΑΑ'.",
            t: true,
            e: "Εξ ορισμού, η (ε) είναι κάθετη στο ΑΑ' και το τέμνει στο μέσο του (μεσοκάθετος του ΑΑ')."
          },
          {
            p: "Αν ένα σημείο Κ ανήκει πάνω στον άξονα συμμετρίας (ε), τότε το συμμετρικό του Κ' είναι το ίδιο το σημείο Κ.",
            t: true,
            e: "Κάθε σημείο πάνω στον άξονα συμμετρίας (ε) παραμένει ακίνητο στην ανάκλαση (Κ' ≡ Κ)."
          },
          {
            p: "Οι διαγώνιοι ενός ορθογωνίου (που δεν είναι τετράγωνο) είναι άξονες συμμετρίας του.",
            t: false,
            e: "Στο ορθογώνιο άξονες συμμετρίας είναι μόνο οι 2 μεσοκάθετοι των απέναντι πλευρών του — όχι οι διαγώνιοί του."
          }
        ]
      : [
          {
            p: "If point A' is the reflection of point A across line (l), then line (l) is the perpendicular bisector of segment AA'.",
            t: true,
            e: "By definition, (l) is perpendicular to AA' and bisects it."
          },
          {
            p: "If a point K lies directly on the axis of symmetry (l), its reflection K' is point K itself.",
            t: true,
            e: "Every point on the axis of symmetry (l) remains fixed under reflection (K' ≡ K)."
          },
          {
            p: "The diagonals of a non-square rectangle are axes of symmetry of the shape.",
            t: false,
            e: "In a rectangle, only the 2 perpendicular bisectors of opposite sides are axes of symmetry — not its diagonals."
          }
        ];

    const pickedTf1 = pickRandom(tfPool1);
    qList.push({
      id: 1,
      chapterBadge: isEl ? 'ΚΕΦ. 11 • ΑΣΚΗΣΗ 1' : 'CH. 11 • EXERCISE 1',
      title: isEl ? 'Έννοια Αξονικής Συμμετρίας' : 'Concept of Axial Symmetry',
      prompt: pickedTf1.p,
      type: 'tf',
      correct: pickedTf1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedTf1.e
    });

    // --- ΚΕΦ. 11 • ΑΣΚΗΣΗ 2: Απόσταση σημείου Α και συμμετρικού Α' από άξονα (ε) ---
    const half2 = randInt(3, 12);
    const full2 = 2 * half2;
    const askFull2 = Math.random() < 0.5;

    qList.push({
      id: 2,
      chapterBadge: isEl ? 'ΚΕΦ. 11 • ΑΣΚΗΣΗ 2' : 'CH. 11 • EXERCISE 2',
      title: isEl ? 'Απόσταση Συμμετρικών Σημείων' : 'Distance Between Symmetric Points',
      prompt: askFull2
        ? (isEl
            ? `Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε). Αν το σημείο Α απέχει ${half2} cm από την ευθεία (ε), πόσα εκατοστά (cm) είναι το μήκος ΑΑ';`
            : `Point A' is the reflection of point A across line (l). If point A is ${half2} cm from line (l), what is the length of AA' in cm?`)
        : (isEl
            ? `Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε). Αν το τμήμα ΑΑ' έχει μήκος ${full2} cm, πόσα εκατοστά (cm) απέχει το σημείο Α από την ευθεία (ε);`
            : `Point A' is the reflection of point A across line (l). If segment AA' measures ${full2} cm, what is the distance from point A to line (l) in cm?`),
      type: 'input',
      correct: askFull2 ? full2 : half2,
      unit: 'cm',
      diagram: { type: 'pointReflection', halfLabel: `${half2} cm`, showK: false },
      explanation: askFull2
        ? (isEl
            ? `Επειδή η (ε) είναι μεσοκάθετος του ΑΑ', ΑΑ' ＝ 2 · ${half2} ＝ ${full2} cm.`
            : `Since (l) is the perpendicular bisector of AA', AA' ＝ 2 · ${half2} ＝ ${full2} cm.`)
        : (isEl
            ? `Η (ε) τέμνει το ΑΑ' στο μέσο του, άρα η απόσταση είναι ${full2} ÷ 2 ＝ ${half2} cm.`
            : `Line (l) bisects AA', so the distance is ${full2} ÷ 2 ＝ ${half2} cm.`)
    });

    // --- ΚΕΦ. 11 • ΑΣΚΗΣΗ 3: Πλήθος αξόνων συμμετρίας βασικών σχημάτων ---
    const axesPool3 = isEl
      ? [
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ισόπλευρο τρίγωνο;',
            c: '3 άξονες συμμετρίας',
            e: 'Το ισόπλευρο τρίγωνο έχει 3 άξονες συμμετρίας (τις μεσοκαθέτους των τριών πλευρών του).'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένας κύκλος (Ο, ρ);',
            c: 'Άπειρους άξονες συμμετρίας',
            e: 'Κάθε ευθεία που περνά από το κέντρο Ο του κύκλου (Ο, ρ) είναι άξονας συμμετρίας του.'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα τετράγωνο;',
            c: '4 άξονες συμμετρίας',
            e: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (τις 2 μεσοκαθέτους των πλευρών και τις 2 διαγωνίους του).'
          },
          {
            q: 'Πόσους άξονες συμμετρίας έχει ένα ισοσκελές τραπέζιο;',
            c: '1 άξονα συμμετρίας',
            e: 'Το ισοσκελές τραπέζιο έχει 1 άξονα συμμετρίας (την κοινή μεσοκάθετο των δύο βάσεών του).'
          }
        ]
      : [
          {
            q: 'How many axes of symmetry does an equilateral triangle have?',
            c: '3 axes of symmetry',
            e: 'An equilateral triangle has 3 axes of symmetry (the perpendicular bisectors of its 3 sides).'
          },
          {
            q: 'How many axes of symmetry does a circle (O, ρ) have?',
            c: 'Infinitely many axes of symmetry',
            e: 'Every line passing through center O of circle (O, ρ) is an axis of symmetry.'
          },
          {
            q: 'How many axes of symmetry does a square have?',
            c: '4 axes of symmetry',
            e: 'A square has 4 axes of symmetry (the 2 perpendicular bisectors of sides and 2 diagonals).'
          },
          {
            q: 'How many axes of symmetry does an isosceles trapezoid have?',
            c: '1 axis of symmetry',
            e: 'An isosceles trapezoid has 1 axis of symmetry (the common perpendicular bisector of its bases).'
          }
        ];

    const pickedAxes3 = pickRandom(axesPool3);
    const dist3 = isEl
      ? [
          '3 άξονες συμμετρίας',
          'Άπειρους άξονες συμμετρίας',
          '4 άξονες συμμετρίας',
          '1 άξονα συμμετρίας',
          '0 άξονες συμμετρίας'
        ]
      : [
          '3 axes of symmetry',
          'Infinitely many axes of symmetry',
          '4 axes of symmetry',
          '1 axis of symmetry',
          '0 axes of symmetry'
        ];

    qList.push({
      id: 3,
      chapterBadge: isEl ? 'ΚΕΦ. 11 • ΑΣΚΗΣΗ 3' : 'CH. 11 • EXERCISE 3',
      title: isEl ? 'Άξονες Συμμετρίας Βασικών Σχημάτων' : 'Symmetry Axes of Basic Shapes',
      prompt: pickedAxes3.q,
      type: 'mcq',
      correct: pickedAxes3.c,
      options: ensureFourUniqueOptions(pickedAxes3.c, () => pickRandom(dist3)),
      explanation: pickedAxes3.e
    });

    // --- ΚΕΦ. 11 • ΑΣΚΗΣΗ 4: Ισομετρία αξονικής συμμετρίας (γωνία ή πλευρά συμμετρικού τριγώνου) ---
    const angA4 = randInt(46, 74);
    const angB4 = randInt(44, 72);
    const angC4 = 180 - angA4 - angB4;

    qList.push({
      id: 4,
      chapterBadge: isEl ? 'ΚΕΦ. 11 • ΑΣΚΗΣΗ 4' : 'CH. 11 • EXERCISE 4',
      title: isEl ? 'Ιδιότητα Ισομετρίας (Γωνία Συμμετρικού)' : 'Isometry Property (Reflected Angle)',
      prompt: isEl ? (
        <span>
          Το τρίγωνο Α'Β'Γ' είναι το συμμετρικό του τριγώνου ΑΒΓ ως προς άξονα (ε). Αν <Angle>Α</Angle> ＝ {angA4}° και <Angle>Β</Angle> ＝ {angB4}°, πόσες μοίρες είναι η γωνία <Angle>Γ'</Angle>;
        </span>
      ) : (
        <span>
          Triangle A'B'C' is the reflection of triangle ABC across axis (l). If ∠A ＝ {angA4}° and ∠B ＝ {angB4}°, how many degrees is angle ∠C'?
        </span>
      ),
      type: 'input',
      correct: angC4,
      unit: '°',
      diagram: {
        type: 'triangleReflection',
        lblA: isEl ? `Α (${angA4}°)` : `A (${angA4}°)`,
        lblB: isEl ? `Β (${angB4}°)` : `B (${angB4}°)`,
        lblC: isEl ? `Γ (${angC4}°)` : `C (${angC4}°)`,
        lblCp: isEl ? `Γ' (${angC4}°)` : `C' (${angC4}°)`
      },
      explanation: isEl ? (
        <span>
          Στο τρίγωνο ΑΒΓ έχουμε <Angle>Γ</Angle> ＝ 180° － ({angA4}° ＋ {angB4}°) ＝ {angC4}°. Επειδή η αξονική συμμετρία διατηρεί τις γωνίες, <Angle>Γ'</Angle> ＝ <Angle>Γ</Angle> ＝ {angC4}°.
        </span>
      ) : (
        <span>
          In triangle ABC, ∠C ＝ 180° － ({angA4}° ＋ {angB4}°) ＝ {angC4}°. Since axial symmetry preserves angles, ∠C' ＝ ∠C ＝ {angC4}°.
        </span>
      )
    });

    // =========================================================================
    // ΜΕΡΟΣ Β: 4 ΑΣΚΗΣΕΙΣ ΑΠΟ ΤΟ ΚΕΦΑΛΑΙΟ 12 (Αξονική Συμμετρία στο Σύστημα Αξόνων)
    // =========================================================================

    // --- ΚΕΦ. 12 • ΑΣΚΗΣΗ 1: Συμμετρικό σημείου Μ(x, y) ως προς τον άξονα x'x ---
    const x5 = randNonZero(-5, 5);
    const y5 = randNonZero(-4, 4);
    const corr5 = fmtCoord(x5, -y5);
    const dist5 = [fmtCoord(x5, -y5), fmtCoord(-x5, y5), fmtCoord(-x5, -y5), fmtCoord(y5, x5)];

    qList.push({
      id: 5,
      chapterBadge: isEl ? 'ΚΕΦ. 12 • ΑΣΚΗΣΗ 1' : 'CH. 12 • EXERCISE 1',
      title: isEl ? 'Συμμετρικό Σημείου ως προς Άξονα x\'x' : 'Point Reflection Across the x-Axis',
      prompt: isEl
        ? `Ποιες είναι οι συντεταγμένες του συμμετρικού του σημείου Μ${fmtCoord(x5, y5)} ως προς τον άξονα x'x;`
        : `What are the coordinates of the reflection of point M${fmtCoord(x5, y5)} across the x-axis (x'x)?`,
      type: 'mcq',
      correct: corr5,
      options: ensureFourUniqueOptions(corr5, () => pickRandom(dist5)),
      diagram: { type: 'coordPoint', x1: x5, y1: y5, x2: x5, y2: -y5, axis: 'x' },
      explanation: isEl
        ? `Ως προς τον άξονα x'x, η τετμημένη x ＝ ${fmtSigned(x5)} μένει ίδια και η τεταγμένη y ＝ ${fmtSigned(y5)} γίνεται αντίθετη (${fmtSigned(-y5)}), άρα παίρνουμε ${corr5}.`
        : `Across the x-axis, x ＝ ${fmtSigned(x5)} stays the same and y ＝ ${fmtSigned(y5)} becomes opposite (${fmtSigned(-y5)}), giving ${corr5}.`
    });

    // --- ΚΕΦ. 12 • ΑΣΚΗΣΗ 2: Συμμετρικό σημείου Α(x, y) ως προς τον άξονα y'y ---
    const x6 = randNonZero(-5, 5);
    const y6 = randNonZero(-4, 4);
    const corr6 = fmtCoord(-x6, y6);
    const dist6 = [fmtCoord(-x6, y6), fmtCoord(x6, -y6), fmtCoord(-x6, -y6), fmtCoord(y6, -x6)];

    qList.push({
      id: 6,
      chapterBadge: isEl ? 'ΚΕΦ. 12 • ΑΣΚΗΣΗ 2' : 'CH. 12 • EXERCISE 2',
      title: isEl ? 'Συμμετρικό Σημείου ως προς Άξονα y\'y' : 'Point Reflection Across the y-Axis',
      prompt: isEl
        ? `Ποιες είναι οι συντεταγμένες του συμμετρικού του σημείου Α${fmtCoord(x6, y6)} ως προς τον άξονα y'y;`
        : `What are the coordinates of the reflection of point A${fmtCoord(x6, y6)} across the y-axis (y'y)?`,
      type: 'mcq',
      correct: corr6,
      options: ensureFourUniqueOptions(corr6, () => pickRandom(dist6)),
      diagram: {
        type: 'coordPoint',
        x1: x6,
        y1: y6,
        x2: -x6,
        y2: y6,
        axis: 'y',
        lbl1: isEl ? `Α${fmtCoord(x6, y6)}` : `A${fmtCoord(x6, y6)}`,
        lbl2: isEl ? `Α'${fmtCoord(-x6, y6)}` : `A'${fmtCoord(-x6, y6)}`
      },
      explanation: isEl
        ? `Ως προς τον άξονα y'y, η τεταγμένη y ＝ ${fmtSigned(y6)} μένει ίδια και η τετμημένη x ＝ ${fmtSigned(x6)} γίνεται αντίθετη (${fmtSigned(-x6)}), άρα παίρνουμε ${corr6}.`
        : `Across the y-axis, y ＝ ${fmtSigned(y6)} stays the same and x ＝ ${fmtSigned(x6)} becomes opposite (${fmtSigned(-x6)}), giving ${corr6}.`
    });

    // --- ΚΕΦ. 12 • ΑΣΚΗΣΗ 3: Αναγνώριση άξονα ανάκλασης από ζεύγος σημείων ---
    const isX7 = Math.random() < 0.5;
    const x7 = randInt(2, 6);
    const y7 = randInt(2, 5);
    const p1_7 = fmtCoord(x7, y7);
    const p2_7 = isX7 ? fmtCoord(x7, -y7) : fmtCoord(-x7, y7);
    const corr7 = isEl ? (isX7 ? "Ο άξονας x'x" : "Ο άξονας y'y") : isX7 ? "The x-axis (x'x)" : "The y-axis (y'y)";
    const dist7 = isEl
      ? ["Ο άξονας x'x", "Ο άξονας y'y", 'Η αρχή των αξόνων Ο(0, 0)', 'Δεν είναι συμμετρικά']
      : ["The x-axis (x'x)", "The y-axis (y'y)", 'The origin O(0, 0)', 'They are not symmetric'];

    qList.push({
      id: 7,
      chapterBadge: isEl ? 'ΚΕΦ. 12 • ΑΣΚΗΣΗ 3' : 'CH. 12 • EXERCISE 3',
      title: isEl ? 'Εύρεση Άξονα Συμμετρίας από Συντεταγμένες' : 'Finding Symmetry Axis from Coordinates',
      prompt: isEl
        ? `Τα σημεία Ρ${p1_7} και Ρ'${p2_7} είναι συμμετρικά ως προς έναν άξονα συντεταγμένων. Ποιος είναι αυτός ο άξονας;`
        : `Points P${p1_7} and P'${p2_7} are symmetric across a coordinate axis. Which axis is it?`,
      type: 'mcq',
      correct: corr7,
      options: ensureFourUniqueOptions(corr7, () => pickRandom(dist7)),
      explanation: isX7
        ? (isEl
            ? `Έχουν ίδια τετμημένη (${x7}) και αντίθετες τεταγμένες (${y7} και －${y7}), άρα είναι συμμετρικά ως προς τον x'x.`
            : `They have the same x-coordinate (${x7}) and opposite y-coordinates (${y7} and －${y7}), so they are symmetric across the x-axis.`)
        : (isEl
            ? `Έχουν ίδια τεταγμένη (${y7}) και αντίθετες τετμημένες (${x7} και －${x7}), άρα είναι συμμετρικά ως προς τον y'y.`
            : `They have the same y-coordinate (${y7}) and opposite x-coordinates (${x7} and －${x7}), so they are symmetric across the y-axis.`)
    });

    // --- ΚΕΦ. 12 • ΑΣΚΗΣΗ 4: Απόσταση μεταξύ σημείου και συμμετρικού του στο επίπεδο ---
    const axis8 = Math.random() < 0.5 ? 'x' : 'y';
    const val8 = randInt(2, 7);
    const other8 = randNonZero(-4, 4);
    const dist8 = 2 * val8;

    qList.push({
      id: 8,
      chapterBadge: isEl ? 'ΚΕΦ. 12 • ΑΣΚΗΣΗ 4' : 'CH. 12 • EXERCISE 4',
      title: isEl ? 'Απόσταση Συμμετρικών Σημείων στο Σύστημα Αξόνων' : 'Distance of Reflected Points in Coordinate Plane',
      prompt: axis8 === 'x'
        ? (isEl
            ? `Το σημείο Μ₁ είναι το συμμετρικό του σημείου Μ${fmtCoord(other8, val8)} ως προς τον άξονα x'x. Πόσες μονάδες μήκους είναι η απόσταση ΜΜ₁;`
            : `Point M₁ is the reflection of point M${fmtCoord(other8, val8)} across the x-axis (x'x). What is the distance MM₁ in units?`)
        : (isEl
            ? `Το σημείο Μ₂ είναι το συμμετρικό του σημείου Μ${fmtCoord(-val8, other8)} ως προς τον άξονα y'y. Πόσες μονάδες μήκους είναι η απόσταση ΜΜ₂;`
            : `Point M₂ is the reflection of point M${fmtCoord(-val8, other8)} across the y-axis (y'y). What is the distance MM₂ in units?`),
      type: 'input',
      correct: dist8,
      unit: isEl ? 'μονάδες' : 'units',
      explanation: isEl
        ? `Καθένα από τα δύο συμμετρικά σημεία απέχει ${val8} μονάδες από τον άξονα συμμετρίας, άρα η μεταξύ τους απόσταση είναι 2 · ${val8} ＝ ${dist8} μονάδες.`
        : `Each symmetric point lies ${val8} units from the axis of symmetry, so the distance between them is 2 · ${val8} ＝ ${dist8} units.`
    });

    // =========================================================================
    // ΜΕΡΟΣ Γ: 4 ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ (2 ΑΠΟ ΚΕΦ. 11 & 2 ΑΠΟ ΚΕΦ. 12)
    // =========================================================================

    // --- ΠΡΟΒΛΗΜΑ 1 (ΚΕΦ. 11 - Δύσκολο): Μεσοκάθετος, σημείο Κ στον άξονα (ε) & περίμετρος τριγώνου ΚΑΑ' ---
    const halfBase9 = randInt(3, 8);
    const fullBase9 = 2 * halfBase9;
    const sideKA9 = randInt(halfBase9 + 2, halfBase9 + 9);
    const perim9 = 2 * sideKA9 + fullBase9;

    qList.push({
      id: 9,
      chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ 1 • ΚΕΦ. 11 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 1 • CH. 11 • CHALLENGING',
      title: isEl ? 'Πρόβλημα 1: Μεσοκάθετος (ε) & Περίμετρος Τριγώνου ΚΑΑ\'' : 'Problem 1: Perpendicular Bisector (l) & Perimeter of KAA\'',
      prompt: isEl
        ? `Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε). Αν το σημείο Α απέχει ${halfBase9} cm από την ευθεία (ε) και Κ είναι ένα σημείο πάνω στην ευθεία (ε) ώστε ΚΑ ＝ ${sideKA9} cm, πόσα εκατοστά (cm) είναι η περίμετρος του τριγώνου ΚΑΑ';`
        : `Point A' is the reflection of point A across line (l). If point A is ${halfBase9} cm from line (l) and K is a point on line (l) such that KA ＝ ${sideKA9} cm, what is the perimeter of triangle KAA' in cm?`,
      type: 'input',
      correct: perim9,
      unit: 'cm',
      diagram: {
        type: 'pointReflection',
        halfLabel: `${halfBase9} cm`,
        showK: true,
        kLabel: `${sideKA9} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Βάση ΑΑ\' (ιδιότητα συμμετρίας)' : '1. Base AA\' (symmetry property)',
          details: `ΑΑ' ＝ 2 · ${halfBase9} ＝ ${fullBase9} cm`
        },
        {
          label: isEl ? '2. Ισαπόσταση ΚΑ\' ＝ ΚΑ' : '2. Equidistance KA\' ＝ KA',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>{isEl ? 'Το Κ ανήκει στη μεσοκάθετο (ε)' : 'K lies on perpendicular bisector (l)'}</span>
              <span className="whitespace-nowrap">⇒ ΚΑ' ＝ ΚΑ ＝ {sideKA9} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '3. Περίμετρος τριγώνου ΚΑΑ\'' : '3. Perimeter of triangle KAA\'',
          details: `Π ＝ ${sideKA9} ＋ ${sideKA9} ＋ ${fullBase9} ＝ ${perim9} cm`
        }
      ],
      explanation: isEl
        ? `Η ευθεία (ε) είναι μεσοκάθετος του ΑΑ', άρα ΑΑ' ＝ 2 · ${halfBase9} ＝ ${fullBase9} cm και ΚΑ' ＝ ΚΑ ＝ ${sideKA9} cm. Επομένως Π ＝ ${sideKA9} ＋ ${sideKA9} ＋ ${fullBase9} ＝ ${perim9} cm.`
        : `Line (l) is the perpendicular bisector of AA', so AA' ＝ 2 · ${halfBase9} ＝ ${fullBase9} cm and KA' ＝ KA ＝ ${sideKA9} cm. Thus P ＝ ${sideKA9} ＋ ${sideKA9} ＋ ${fullBase9} ＝ ${perim9} cm.`
    });

    // --- ΠΡΟΒΛΗΜΑ 2 (ΚΕΦ. 11 - Δύσκολο): Συμμετρικό ισοσκελούς τριγώνου + περίμετρος & γωνία βάσης ---
    const apex10 = randInt(22, 46) * 2;
    const baseAng10 = (180 - apex10) / 2;
    const leg10 = randInt(6, 12);
    const base10 = randInt(4, 10);
    const perim10 = 2 * leg10 + base10;

    const corr10 = isEl
      ? `Γωνία Β' ＝ ${baseAng10}° και περίμετρος ${perim10} cm`
      : `Angle ∠B' ＝ ${baseAng10}° and perimeter ${perim10} cm`;

    const dist10 = isEl
      ? [
          `Γωνία Β' ＝ ${baseAng10}° και περίμετρος ${perim10} cm`,
          `Γωνία Β' ＝ ${apex10}° και περίμετρος ${perim10} cm`,
          `Γωνία Β' ＝ ${baseAng10}° και περίμετρος ${leg10 + 2 * base10} cm`,
          `Γωνία Β' ＝ ${baseAng10 + 10}° και περίμετρος ${perim10 + 4} cm`,
          `Γωνία Β' ＝ 90° και περίμετρος ${perim10} cm`
        ]
      : [
          `Angle ∠B' ＝ ${baseAng10}° and perimeter ${perim10} cm`,
          `Angle ∠B' ＝ ${apex10}° and perimeter ${perim10} cm`,
          `Angle ∠B' ＝ ${baseAng10}° and perimeter ${leg10 + 2 * base10} cm`,
          `Angle ∠B' ＝ ${baseAng10 + 10}° and perimeter ${perim10 + 4} cm`,
          `Angle ∠B' ＝ 90° and perimeter ${perim10} cm`
        ];

    qList.push({
      id: 10,
      chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ 2 • ΚΕΦ. 11 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 2 • CH. 11 • CHALLENGING',
      title: isEl ? 'Πρόβλημα 2: Συμμετρικό Ισοσκελούς Τριγώνου (Γωνίες & Περίμετρος)' : 'Problem 2: Reflected Isosceles Triangle (Angles & Perimeter)',
      prompt: isEl ? (
        <span>
          Ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) έχει σκέλος ΑΒ ＝ {leg10} cm, βάση ΒΓ ＝ {base10} cm και γωνία κορυφής <Angle>Α</Angle> ＝ {apex10}°. Αν Α'Β'Γ' είναι το συμμετρικό του τρίγωνο ως προς ευθεία (ε), πόσες μοίρες είναι η γωνία <Angle>Β'</Angle> και πόσα εκατοστά (cm) είναι η περίμετρος του Α'Β'Γ';
        </span>
      ) : (
        <span>
          An isosceles triangle ABC (AB ＝ AC) has leg AB ＝ {leg10} cm, base BC ＝ {base10} cm, and vertex angle ∠A ＝ {apex10}°. If A'B'C' is its reflection across line (l), find angle ∠B' and the perimeter of triangle A'B'C'.
        </span>
      ),
      type: 'mcq',
      correct: corr10,
      options: ensureFourUniqueOptions(corr10, () => pickRandom(dist10)),
      diagram: {
        type: 'triangleReflection',
        lblA: isEl ? `Α (${apex10}°)` : `A (${apex10}°)`,
        lblB: isEl ? `Β (${baseAng10}°)` : `B (${baseAng10}°)`,
        lblBp: isEl ? `Β' (${baseAng10}°)` : `B' (${baseAng10}°)`
      },
      tableData: [
        {
          label: isEl ? '1. Γωνία βάσης Β & Β\'' : '1. Base angle ∠B & ∠B\'',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                {isEl ? <><Angle>Β</Angle> ＝</> : '∠B ＝'} <Frac num={`180° － ${apex10}°`} den="2" /> ＝ {baseAng10}°
              </span>
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                ⇒ {isEl ? <><Angle>Β'</Angle> ＝ {baseAng10}°</> : `∠B' ＝ ${baseAng10}°`}
              </span>
            </div>
          )
        },
        {
          label: isEl ? '2. Περίμετρος Α\'Β\'Γ\'' : '2. Perimeter of A\'B\'C\'',
          details: `Π ＝ ${leg10} ＋ ${leg10} ＋ ${base10} ＝ ${perim10} cm`
        }
      ],
      explanation: isEl ? (
        <span>
          Στο ισοσκελές ΑΒΓ έχουμε <Angle>Β</Angle> ＝ (180° － {apex10}°) ÷ 2 ＝ {baseAng10}° και περίμετρο {leg10} ＋ {leg10} ＋ {base10} ＝ {perim10} cm. Λόγω ισομετρίας, <Angle>Β'</Angle> ＝ {baseAng10}° και Π ＝ {perim10} cm.
        </span>
      ) : (
        <span>
          In isosceles ABC, ∠B ＝ (180° － {apex10}°) ÷ 2 ＝ {baseAng10}° and perimeter is {leg10} ＋ {leg10} ＋ {base10} ＝ {perim10} cm. By isometry, ∠B' ＝ {baseAng10}° and P ＝ {perim10} cm.
        </span>
      )
    });

    // --- ΠΡΟΒΛΗΜΑ 3 (ΚΕΦ. 12 - Δύσκολο): Ορθογώνιο από συμμετρικές κορυφές στο σύστημα αξόνων -> Περίμετρος & Εμβαδόν ---
    const a11 = randInt(2, 5);
    const b11 = randInt(2, 4);
    const width11 = 2 * a11;
    const height11 = 2 * b11;
    const perim11 = 2 * (width11 + height11);
    const area11 = width11 * height11;

    const corr11 = isEl
      ? `Περίμετρος ${perim11} μονάδες και εμβαδόν ${area11} τ.μ.`
      : `Perimeter ${perim11} units and area ${area11} sq. units`;

    const dist11 = isEl
      ? [
          `Περίμετρος ${perim11} μονάδες και εμβαδόν ${area11} τ.μ.`,
          `Περίμετρος ${a11 + b11} μονάδες και εμβαδόν ${a11 * b11} τ.μ.`,
          `Περίμετρος ${perim11} μονάδες και εμβαδόν ${a11 * b11} τ.μ.`,
          `Περίμετρος ${width11 + height11} μονάδες και εμβαδόν ${area11} τ.μ.`,
          `Περίμετρος ${perim11 + 4} μονάδες και εμβαδόν ${area11 + 4} τ.μ.`
        ]
      : [
          `Perimeter ${perim11} units and area ${area11} sq. units`,
          `Perimeter ${a11 + b11} units and area ${a11 * b11} sq. units`,
          `Perimeter ${perim11} units and area ${a11 * b11} sq. units`,
          `Perimeter ${width11 + height11} units and area ${area11} sq. units`,
          `Perimeter ${perim11 + 4} units and area ${area11 + 4} sq. units`
        ];

    qList.push({
      id: 11,
      chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ 3 • ΚΕΦ. 12 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 3 • CH. 12 • CHALLENGING',
      title: isEl ? 'Πρόβλημα 3: Ορθογώνιο από Συμμετρικές Κορυφές (Περίμετρος & Εμβαδόν)' : 'Problem 3: Rectangle from Symmetric Vertices (Perimeter & Area)',
      prompt: isEl
        ? `Στο ορθογώνιο σύστημα αξόνων δίνεται το σημείο Α${fmtCoord(a11, b11)}. Βρίσκουμε το συμμετρικό του Β ως προς τον άξονα y'y, το συμμετρικό του Δ ως προς τον άξονα x'x και το σημείο Γ${fmtCoord(-a11, -b11)}. Πόση είναι η περίμετρος και πόσο το εμβαδόν του ορθογωνίου ΑΒΓΔ;`
        : `In the Cartesian plane, given point A${fmtCoord(a11, b11)}, let B be its reflection across the y-axis, D be its reflection across the x-axis, and C be ${fmtCoord(-a11, -b11)}. Find the perimeter and area of rectangle ABCD.`,
      type: 'mcq',
      correct: corr11,
      options: ensureFourUniqueOptions(corr11, () => pickRandom(dist11)),
      diagram: {
        type: 'coordPoly',
        axis: 'y',
        origPts: [[a11, b11], [-a11, b11], [-a11, -b11], [a11, -b11]],
        symPts: [[a11, b11], [-a11, b11], [-a11, -b11], [a11, -b11]],
        caption: isEl ? `ΑΒ ＝ ${width11}, ΑΔ ＝ ${height11}` : `AB ＝ ${width11}, AD ＝ ${height11}`
      },
      tableData: [
        {
          label: isEl ? '1. Διαστάσεις ΑΒ & ΑΔ' : '1. Dimensions AB & AD',
          details: `ΑΒ ＝ 2 · ${a11} ＝ ${width11} και ΑΔ ＝ 2 · ${b11} ＝ ${height11}`
        },
        {
          label: isEl ? '2. Περίμετρος & Εμβαδόν' : '2. Perimeter & Area',
          details: `Π ＝ 2 · (${width11} ＋ ${height11}) ＝ ${perim11} • Ε ＝ ${width11} · ${height11} ＝ ${area11}`
        }
      ],
      explanation: isEl
        ? `Η οριζόντια πλευρά ΑΒ είναι 2 · ${a11} ＝ ${width11} και η κατακόρυφη ΑΔ είναι 2 · ${b11} ＝ ${height11}. Άρα Π ＝ 2 · (${width11} ＋ ${height11}) ＝ ${perim11} μονάδες και Ε ＝ ${width11} · ${height11} ＝ ${area11} τ.μ.`
        : `Horizontal side AB is 2 · ${a11} ＝ ${width11} and vertical side AD is 2 · ${b11} ＝ ${height11}. Thus P ＝ 2 · (${width11} ＋ ${height11}) ＝ ${perim11} units and Area ＝ ${width11} · ${height11} ＝ ${area11} sq. units.`
    });

    // --- ΠΡΟΒΛΗΜΑ 4 (ΚΕΦ. 12 - Δύσκολο): Διαδοχικές ανακλάσεις & σύγκριση με συμμετρία ως προς αρχή Ο(0,0) ---
    const x12 = randNonZero(-4, 4);
    const y12 = randNonZero(-3, 3);
    const corr12 = `Μ₁${fmtCoord(x12, -y12)} και Μ₂${fmtCoord(-x12, -y12)}`;
    const dist12 = [
      `Μ₁${fmtCoord(x12, -y12)} και Μ₂${fmtCoord(-x12, -y12)}`,
      `Μ₁${fmtCoord(-x12, y12)} και Μ₂${fmtCoord(-x12, -y12)}`,
      `Μ₁${fmtCoord(x12, -y12)} και Μ₂${fmtCoord(x12, y12)}`,
      `Μ₁${fmtCoord(-x12, -y12)} και Μ₂${fmtCoord(x12, -y12)}`
    ];

    qList.push({
      id: 12,
      chapterBadge: isEl ? 'ΠΡΟΒΛΗΜΑ 4 • ΚΕΦ. 12 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 4 • CH. 12 • CHALLENGING',
      title: isEl ? 'Πρόβλημα 4: Διαδοχικές Ανακλάσεις (x\'x & y\'y)' : 'Problem 4: Successive Reflections (x-Axis & y-Axis)',
      prompt: isEl
        ? `Δίνεται το σημείο Μ${fmtCoord(x12, y12)}. Βρίσκουμε πρώτα το συμμετρικό του Μ₁ ως προς τον άξονα x'x και στη συνέχεια το συμμετρικό Μ₂ του Μ₁ ως προς τον άξονα y'y. Ποιες είναι οι συντεταγμένες των σημείων Μ₁ και Μ₂;`
        : `Given point M${fmtCoord(x12, y12)}, first find its reflection M₁ across the x-axis (x'x), and then find the reflection M₂ of M₁ across the y-axis (y'y). What are the coordinates of M₁ and M₂?`,
      type: 'mcq',
      correct: corr12,
      options: ensureFourUniqueOptions(corr12, () => pickRandom(dist12)),
      diagram: {
        type: 'coordPoint',
        x1: x12,
        y1: -y12,
        x2: -x12,
        y2: -y12,
        axis: 'y',
        lbl1: `Μ₁${fmtCoord(x12, -y12)}`,
        lbl2: `Μ₂${fmtCoord(-x12, -y12)}`
      },
      tableData: [
        {
          label: isEl ? '1. Ανάκλαση ως προς x\'x' : '1. Reflection across x-axis',
          details: `Μ${fmtCoord(x12, y12)} ──▶ Μ₁${fmtCoord(x12, -y12)}`
        },
        {
          label: isEl ? '2. Ανάκλαση Μ₁ ως προς y\'y' : '2. Reflection of M₁ across y-axis',
          details: `Μ₁${fmtCoord(x12, -y12)} ──▶ Μ₂${fmtCoord(-x12, -y12)}`
        }
      ],
      explanation: isEl
        ? `Στην πρώτη ανάκλαση (x'x) αλλάζει το πρόσημο της τεταγμένης: Μ₁${fmtCoord(x12, -y12)}. Στη δεύτερη ανάκλαση (y'y) αλλάζει το πρόσημο της τετμημένης: Μ₂${fmtCoord(-x12, -y12)}.`
        : `First reflection (x-axis) negates y: M₁${fmtCoord(x12, -y12)}. Second reflection (y-axis) negates x: M₂${fmtCoord(-x12, -y12)}.`
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

  const totalCount = questions.length || 12;
  const answeredCount = Object.keys(userAnswers).filter(k => userAnswers[k] !== '' && userAnswers[k] !== undefined).length;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      
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
                      <>
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
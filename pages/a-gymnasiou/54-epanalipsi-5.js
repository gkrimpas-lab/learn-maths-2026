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

  // 1. Ορθό Πρίσμα (Κεφ. 13)
  if (diagram.type === 'rightPrism') {
    const n = diagram.n || 5;
    const cx = 132;
    const topCy = 44;
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
              <line key={`e-${idx}`} x1={tp.x} y1={tp.y} x2={bp.x} y2={bp.y} stroke="#818cf8" strokeWidth="1.6" />
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
          <text x="132" y="156" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 2. 2D Όψη κατασκευής κύβων (Κεφ. 13)
  if (diagram.type === 'gridView') {
    const cells = diagram.cells || [];
    const colors = ['#6366f1', '#10b981', '#f59e0b'];
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => (
              <rect
                key={`bg-${r}-${c}`}
                x={93 + c * 26}
                y={30 + r * 26}
                width="26"
                height="26"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            ))
          )}
          {cells.map(([col, row, lvl = 0], idx) => (
            <rect
              key={`c-${idx}`}
              x={94 + col * 26}
              y={31 + row * 26}
              width="24"
              height="24"
              rx="3"
              fill={colors[lvl % colors.length]}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          ))}
          <text x="132" y="138" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Κύβος / Ορθογώνιο Παραλληλεπίπεδο (Κεφ. 14)
  if (diagram.type === 'cuboid') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <rect x="96" y="28" width="96" height="62" fill="none" stroke="#475569" strokeWidth="1.3" strokeDasharray="3 3" />
          <rect x="64" y="52" width="96" height="62" fill="rgba(99, 102, 241, 0.24)" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="64" y1="52" x2="96" y2="28" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="160" y1="52" x2="192" y2="28" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="160" y1="114" x2="192" y2="90" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="64" y1="114" x2="96" y2="90" stroke="#475569" strokeWidth="1.3" strokeDasharray="3 3" />
          {diagram.showDiag && (
            <line x1="64" y1="114" x2="192" y2="28" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
          )}
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 4. Πυραμίδα / Κανονικό Τετράεδρο (Κεφ. 14)
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
            <line key={`pe-${idx}`} x1={apex.x} y1={apex.y} x2={bp.x} y2={bp.y} stroke="#818cf8" strokeWidth="1.6" />
          ))}
          {basePts.map((p, idx) => (
            <circle key={`pv-${idx}`} cx={p.x} cy={p.y} r="3" fill="#34d399" />
          ))}
          <circle cx={apex.x} cy={apex.y} r="4" fill="#fbbf24" />
          <text x="132" y="154" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 5. Ορθός Κύλινδρος & Ανάπτυγμα (Κεφ. 15)
  if (diagram.type === 'cylinder') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <ellipse cx="64" cy="118" rx="28" ry="9" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.7" />
          <ellipse cx="64" cy="44" rx="28" ry="9" fill="rgba(99, 102, 241, 0.35)" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="36" y1="44" x2="36" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="92" y1="44" x2="92" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="64" y1="118" x2="92" y2="118" stroke="#34d399" strokeWidth="1.7" />
          <text x="78" y="114" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">ρ</text>
          <text x="30" y="84" textAnchor="end" className="text-[8px] font-mono font-bold fill-amber-300">{isEl ? 'υ' : 'h'}</text>

          <rect x="128" y="54" width="110" height="54" fill="rgba(16, 185, 129, 0.24)" stroke="#34d399" strokeWidth="1.7" />
          <circle cx="183" cy="38" r="16" fill="rgba(245, 158, 11, 0.28)" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="183" cy="124" r="16" fill="rgba(99, 102, 241, 0.28)" stroke="#818cf8" strokeWidth="1.5" />
          <text x="183" y="84" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">2πρ × {isEl ? 'υ' : 'h'}</text>

          <text x="132" y="156" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 6. Ορθός Κώνος & Ανάπτυγμα με ακριβή επαφή (Κεφ. 15)
  if (diagram.type === 'cone') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <ellipse cx="68" cy="118" rx="30" ry="10" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.7" />
          <line x1="68" y1="34" x2="38" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="68" y1="34" x2="98" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="68" y1="34" x2="68" y2="118" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="68" y1="118" x2="98" y2="118" stroke="#34d399" strokeWidth="1.7" />
          <text x="83" y="114" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">ρ</text>
          <text x="63" y="82" textAnchor="end" className="text-[8px] font-mono font-bold fill-amber-300">{isEl ? 'υ' : 'h'}</text>
          <text x="88" y="74" textAnchor="start" className="text-[8px] font-mono font-bold fill-indigo-300">{isEl ? 'λ' : 'l'}</text>

          <path d="M 185,24 L 143,72 A 64,64 0 0,0 227,72 Z" fill="rgba(16, 185, 129, 0.28)" stroke="#34d399" strokeWidth="1.7" />
          <circle cx="185" cy="106" r="18" fill="rgba(99, 102, 241, 0.28)" stroke="#818cf8" strokeWidth="1.5" />
          <circle cx="185" cy="88" r="2" fill="#fbbf24" />

          <text x="132" y="156" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 7. Σφαίρα, Μέγιστος Κύκλος & Σφαιρικό Τρίγωνο (Κεφ. 15)
  if (diagram.type === 'sphere') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx="132" cy="76" r="50" fill="rgba(99, 102, 241, 0.20)" stroke="#818cf8" strokeWidth="1.8" />
          <ellipse cx="132" cy="76" rx="50" ry="15" fill="rgba(16, 185, 129, 0.14)" stroke="#34d399" strokeWidth="1.7" />
          {diagram.showTriangle ? (
            <>
              <path
                d="M 132,26 Q 118,58 132,91 A 50,15 0 0,0 174,83 Q 162,48 132,26 Z"
                fill="rgba(245, 158, 11, 0.42)"
                stroke="#fbbf24"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="132" cy="26" r="2.5" fill="#fbbf24" />
              <circle cx="132" cy="91" r="2.5" fill="#fbbf24" />
              <circle cx="174" cy="83" r="2.5" fill="#fbbf24" />
            </>
          ) : (
            <>
              <line x1="82" y1="76" x2="182" y2="76" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
              <line x1="132" y1="76" x2="182" y2="76" stroke="#34d399" strokeWidth="2.2" />
              <text x="157" y="71" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">ρ</text>
            </>
          )}
          <circle cx="132" cy="76" r="3" fill="#fbbf24" />
          <text x="125" y="72" textAnchor="end" className="text-[8.5px] font-bold fill-amber-300">{isEl ? 'Ο' : 'O'}</text>
          <text x="132" y="148" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function Epanalipsi5Test() {
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
    pageTitle: isEl ? "Επανάληψη 5: Στερεά, Πρίσματα, Πυραμίδες, Κύλινδρος, Κώνος & Σφαίρα | Α' Γυμνασίου" : "Review 5: Solids, Prisms, Pyramids, Cylinder, Cone & Sphere | Grade 7",
    pageDesc: isEl
      ? "Επαναληπτικό διαγώνισμα Α' Γυμνασίου στα Κεφάλαια 13, 14 και 15 (Στερεά γεωμετρικά σχήματα, ορθό πρίσμα, κύβος, παραλληλεπίπεδο, πυραμίδα, κύλινδρος, κώνος, σφαίρα & σφαιρικό τρίγωνο)."
      : "Grade 7 geometry review test covering Chapters 13, 14, and 15 (3D solids, right prism, cube, parallelepiped, pyramid, cylinder, cone, sphere & spherical triangle).",
    backNav: isEl ? "Α' Γυμνασίου" : "Grade 7",
    homeBtn: isEl ? "ΟΛΑ ΤΑ ΚΕΦΑΛΑΙΑ" : "ALL CHAPTERS",
    heroBadge: isEl ? "ΕΠΑΝΑΛΗΨΗ 5 • ΚΕΦΑΛΑΙΑ 13, 14 & 15 • Α' ΓΥΜΝΑΣΙΟΥ" : "REVIEW 5 • CHAPTERS 13, 14 & 15 • GRADE 7",
    heroTitle: isEl ? "Επαναληπτικό Τεστ: Στερεά Γεωμετρικά Σχήματα (Κεφ. 13–15)" : "Review Test: 3D Geometric Solids (Ch. 13–15)",
    heroDesc: isEl
      ? "15 δυναμικές ερωτήσεις: 3 ασκήσεις από κάθε κεφάλαιο (Κεφ. 13, 14, 15) και 6 συνδυαστικά προβλήματα αυξημένης δυσκολίας στο τέλος (2 από κάθε κεφάλαιο) με πλούσιες παραλλαγές!"
      : "15 dynamic questions: 3 exercises from each chapter (Ch. 13, 14, 15) and 6 advanced multi-step problems at the end (2 per chapter) with randomized variations!",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε απόλυτα όλη την ενότητα της Στερεομετρίας της Α' Γυμνασίου (Κεφάλαια 13, 14 και 15)!"
      : "Outstanding performance! You have completely mastered the entire Grade 7 3D Geometry unit (Chapters 13, 14, and 15)!",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τους αναλυτικούς πίνακες λύσης και τα σχήματα στα ερωτήματα που δυσκολευτήκατε."
      : "Very good effort! Review the detailed solution tables and diagrams for the questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στους τύπους πρισμάτων/πυραμίδων και στα αναπτύγματα κυλίνδρου και κώνου!"
      : "Needs a bit more review on prism/pyramid formulas and cylinder/cone nets!",
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
    // ΚΕΦΑΛΑΙΟ 13: Στερεά, Όψεις & Ορθό Πρίσμα (3 Ασκήσεις: Q1 - Q3)
    // =========================================================================

    // Q1 (Κεφ. 13 • Άσκηση 1): TF - Πολύεδρα vs Μη Πολύεδρα & Όψεις Στερεών
    const pool13_1 = isEl
      ? [
          {
            p: "Ο κύβος, το ορθό πρίσμα και η πυραμίδα είναι πολύεδρα, ενώ ο κύλινδρος, ο κώνος και η σφαίρα δεν είναι πολύεδρα.",
            t: true,
            e: "Πολύεδρα είναι μόνο τα στερεά που περιορίζονται αποκλειστικά από επίπεδες πολυγωνικές έδρες. Ο κύλινδρος, ο κώνος και η σφαίρα έχουν καμπύλες επιφάνειες."
          },
          {
            p: "Όταν παρατηρούμε μια κατακόρυφη στήλη 5 ίσων κύβων ακριβώς από πάνω (κάτοψη), βλέπουμε 5 τετραγωνάκια.",
            t: false,
            e: "Στην κάτοψη βλέπουμε μόνο την επάνω έδρα του ψηλότερου κύβου της στήλης, άρα φαίνεται 1 μόνο τετραγωνάκι."
          },
          {
            p: "Σε κάθε ορθό πρίσμα οι παράπλευρες έδρες είναι ορθογώνια παραλληλόγραμμα και το ύψος του ισούται με την παράπλευρη ακμή του.",
            t: true,
            e: "Επειδή οι παράπλευρες ακμές είναι κάθετες στις βάσεις, οι παράπλευρες έδρες είναι ορθογώνια και το μήκος τους ισούται με το ύψος υ."
          }
        ]
      : [
          {
            p: "A cube, right prism, and pyramid are polyhedra, whereas a cylinder, cone, and sphere are not polyhedra.",
            t: true,
            e: "Polyhedra are bounded exclusively by flat polygonal faces, while cylinders, cones, and spheres have curved surfaces."
          },
          {
            p: "When viewing a vertical column of 5 identical cubes directly from above (top view), we see 5 squares.",
            t: false,
            e: "In the top view we only see the top face of the highest cube in the column, which appears as just 1 square."
          },
          {
            p: "In every right prism, the lateral faces are rectangles and the height equals the lateral edge length.",
            t: true,
            e: "Because lateral edges are perpendicular to the bases, lateral faces are rectangles and their length equals height h."
          }
        ];
    const p13_1 = pickRandom(pool13_1);
    qList.push({
      id: 1,
      badge: isEl ? 'ΚΕΦ. 13 • ΑΣΚΗΣΗ 1' : 'CH. 13 • EXERCISE 1',
      title: isEl ? 'Στερεά Γεωμετρικά Σχήματα & Ορθό Πρίσμα' : '3D Geometric Solids & Right Prism',
      prompt: p13_1.p,
      type: 'tf',
      correct: p13_1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: p13_1.e
    });

    // Q2 (Κεφ. 13 • Άσκηση 2): Input - Στοιχεία Ορθού Πρίσματος (Έδρες, Ακμές ή Κορυφές)
    const prismPool2 = isEl
      ? [
          { name: 'τριγωνικό', n: 3 },
          { name: 'τετραγωνικό', n: 4 },
          { name: 'πενταγωνικό', n: 5 },
          { name: 'εξαγωνικό', n: 6 },
          { name: 'επταγωνικό', n: 7 }
        ]
      : [
          { name: 'triangular', n: 3 },
          { name: 'square', n: 4 },
          { name: 'pentagonal', n: 5 },
          { name: 'hexagonal', n: 6 },
          { name: 'heptagonal', n: 7 }
        ];
    const pr2 = pickRandom(prismPool2);
    const askType2 = pickRandom(['faces', 'edges', 'vertices']);
    const ans2 = askType2 === 'faces' ? pr2.n + 2 : askType2 === 'edges' ? 3 * pr2.n : 2 * pr2.n;
    const unit2 = askType2 === 'faces'
      ? (isEl ? 'έδρες' : 'faces')
      : askType2 === 'edges'
      ? (isEl ? 'ακμές' : 'edges')
      : (isEl ? 'κορυφές' : 'vertices');

    qList.push({
      id: 2,
      badge: isEl ? 'ΚΕΦ. 13 • ΑΣΚΗΣΗ 2' : 'CH. 13 • EXERCISE 2',
      title: isEl ? 'Στοιχεία Ορθού Πρίσματος' : 'Elements of a Right Prism',
      prompt: isEl
        ? `Πόσες ${unit2} έχει συνολικά ένα ορθό ${pr2.name} πρίσμα;`
        : `How many ${unit2} in total does a right ${pr2.name} prism have?`,
      type: 'input',
      correct: ans2,
      unit: unit2,
      diagram: {
        type: 'rightPrism',
        n: Math.min(6, pr2.n),
        caption: isEl ? `n ＝ ${pr2.n} ⇒ ${ans2} ${unit2}` : `n ＝ ${pr2.n} ⇒ ${ans2} ${unit2}`
      },
      explanation: isEl
        ? `Για ορθό πρίσμα με βάση n ＝ ${pr2.n}: Έδρες ＝ n ＋ 2 ＝ ${pr2.n + 2}, Ακμές ＝ 3n ＝ ${3 * pr2.n}, Κορυφές ＝ 2n ＝ ${2 * pr2.n}. Άρα έχει ${ans2} ${unit2}.`
        : `For a right prism with n ＝ ${pr2.n}: Faces ＝ n ＋ 2 ＝ ${pr2.n + 2}, Edges ＝ 3n ＝ ${3 * pr2.n}, Vertices ＝ 2n ＝ ${2 * pr2.n}. Thus ${ans2} ${unit2}.`
    });

    // Q3 (Κεφ. 13 • Άσκηση 3): MCQ - Κάτοψη κατασκευής από κύβους
    const baseCols3 = randInt(3, 6);
    const stackedExtra3 = randInt(2, 5);
    const totalBlocks3 = baseCols3 + stackedExtra3;
    const corr3 = isEl ? `${baseCols3} τετραγωνάκια` : `${baseCols3} squares`;
    const dist3 = isEl
      ? [
          `${baseCols3} τετραγωνάκια`,
          `${totalBlocks3} τετραγωνάκια`,
          `${stackedExtra3} τετραγωνάκια`,
          `${baseCols3 + 1} τετραγωνάκια`,
          `${totalBlocks3 + 1} τετραγωνάκια`
        ]
      : [
          `${baseCols3} squares`,
          `${totalBlocks3} squares`,
          `${stackedExtra3} squares`,
          `${baseCols3 + 1} squares`,
          `${totalBlocks3 + 1} squares`
        ];

    qList.push({
      id: 3,
      badge: isEl ? 'ΚΕΦ. 13 • ΑΣΚΗΣΗ 3' : 'CH. 13 • EXERCISE 3',
      title: isEl ? 'Κάτοψη Κατασκευής Κύβων' : 'Top View of a Cube Assembly',
      prompt: isEl
        ? `Μια 3D κατασκευή αποτελείται από ${totalBlocks3} ίσους κύβους τοποθετημένους σε ${baseCols3} κατακόρυφες στήλες πάνω στο τραπέζι. Πόσα τετραγωνάκια φαίνονται στην κάτοψη (όψη από πάνω);`
        : `A 3D structure consists of ${totalBlocks3} identical cubes arranged in ${baseCols3} vertical columns on a table. How many squares appear in the top view?`,
      type: 'mcq',
      correct: corr3,
      options: ensureFourUniqueOptions(corr3, () => pickRandom(dist3)),
      diagram: {
        type: 'gridView',
        cells: Array.from({ length: baseCols3 }, (_, i) => [i % 3, Math.floor(i / 3), i === 0 ? 2 : 0]),
        caption: isEl ? `Κάτοψη: ${baseCols3} τετραγωνάκια` : `Top view: ${baseCols3} squares`
      },
      explanation: isEl
        ? `Στην κάτοψη φαίνεται μόνο η κορυφή κάθε στήλης, δηλαδή τόσα τετραγωνάκια όσες και οι στήλες της βάσης: ${baseCols3} τετραγωνάκια.`
        : `The top view shows only the top of each column, matching the ${baseCols3} base columns: ${baseCols3} squares.`
    });

    // =========================================================================
    // ΚΕΦΑΛΑΙΟ 14: Κύβος, Παραλληλεπίπεδο, Πυραμίδα & Τετράεδρο (3 Ασκήσεις: Q4 - Q6)
    // =========================================================================

    // Q4 (Κεφ. 14 • Άσκηση 1): MCQ - Διαγώνιοι Κύβου & Ορθογωνίου Παραλληλεπιπέδου
    const pool14_1 = isEl
      ? [
          {
            q: "Πόσες διαγωνίους εδρών και πόσες εσωτερικές διαγωνίους (διαγωνίους στερεού) έχει ένας κύβος;",
            c: "12 διαγωνίους εδρών και 4 εσωτερικές διαγωνίους",
            e: "Κάθε μία από τις 6 έδρες έχει 2 διαγωνίους (6 · 2 ＝ 12 διαγώνιοι εδρών), ενώ στο εσωτερικό ενώνονται 4 ζεύγη απέναντι κορυφών (4 διαγώνιοι κύβου)."
          },
          {
            q: "Τι ισχύει για τις 4 εσωτερικές διαγωνίους ενός ορθογωνίου παραλληλεπιπέδου;",
            c: "Είναι ίσες μεταξύ τους και τέμνονται στο μέσο τους",
            e: "Σε κάθε ορθογώνιο παραλληλεπίπεδο οι 4 εσωτερικές διαγώνιοι έχουν ίσο μήκος και διχοτομούνται στο κέντρο του στερεού."
          },
          {
            q: "Από ποια επίπεδα σχήματα αποτελείται το ανάπτυγμα μιας κανονικής τετραγωνικής πυραμίδας;",
            c: "1 τετράγωνο και 4 ίσα ισοσκελή τρίγωνα",
            e: "Η βάση είναι τετράγωνο και οι 4 παράπλευρες έδρες είναι ίσα ισοσκελή τρίγωνα."
          }
        ]
      : [
          {
            q: "How many face diagonals and how many internal space diagonals does a cube have?",
            c: "12 face diagonals and 4 space diagonals",
            e: "Each of the 6 square faces has 2 diagonals (6 · 2 ＝ 12 face diagonals), while 4 space diagonals connect opposite vertices internally."
          },
          {
            q: "Which property holds for the 4 space diagonals of a rectangular parallelepiped?",
            c: "They are equal in length and bisect each other",
            e: "In every rectangular parallelepiped, all 4 space diagonals are congruent and intersect at their midpoints."
          },
          {
            q: "Which flat shapes form the net of a regular square pyramid?",
            c: "1 square and 4 congruent isosceles triangles",
            e: "The base is a square and the 4 lateral faces are congruent isosceles triangles."
          }
        ];
    const p14_1 = pickRandom(pool14_1);
    const dist14_1 = isEl
      ? [
          "12 διαγωνίους εδρών και 4 εσωτερικές διαγωνίους",
          "Είναι ίσες μεταξύ τους και τέμνονται στο μέσο τους",
          "1 τετράγωνο και 4 ίσα ισοσκελή τρίγωνα",
          "6 διαγωνίους εδρών και 8 εσωτερικές διαγωνίους",
          "4 διαγωνίους εδρών και 12 εσωτερικές διαγωνίους"
        ]
      : [
          "12 face diagonals and 4 space diagonals",
          "They are equal in length and bisect each other",
          "1 square and 4 congruent isosceles triangles",
          "6 face diagonals and 8 space diagonals",
          "4 face diagonals and 12 space diagonals"
        ];

    qList.push({
      id: 4,
      badge: isEl ? 'ΚΕΦ. 14 • ΑΣΚΗΣΗ 1' : 'CH. 14 • EXERCISE 1',
      title: isEl ? 'Διαγώνιοι Κύβου & Ιδιότητες Στερεών' : 'Cube Diagonals & Solid Properties',
      prompt: p14_1.q,
      type: 'mcq',
      correct: p14_1.c,
      options: ensureFourUniqueOptions(p14_1.c, () => pickRandom(dist14_1)),
      diagram: {
        type: 'cuboid',
        showDiag: true,
        caption: isEl ? '12 διαγώνιοι εδρών & 4 διαγώνιοι στερεού' : '12 face diagonals & 4 space diagonals'
      },
      explanation: p14_1.e
    });

    // Q5 (Κεφ. 14 • Άσκηση 2): Input - Στοιχεία Πυραμίδας (Ακμές 2n ή Έδρες/Κορυφές n+1)
    const pyrPool5 = isEl
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
    const py5 = pickRandom(pyrPool5);
    const askEdges5 = Math.random() < 0.5;
    const ans5 = askEdges5 ? 2 * py5.n : py5.n + 1;
    const unit5 = askEdges5 ? (isEl ? 'ακμές' : 'edges') : (isEl ? 'έδρες' : 'faces');

    qList.push({
      id: 5,
      badge: isEl ? 'ΚΕΦ. 14 • ΑΣΚΗΣΗ 2' : 'CH. 14 • EXERCISE 2',
      title: isEl ? 'Στοιχεία Πυραμίδας' : 'Elements of a Pyramid',
      prompt: isEl
        ? `Πόσες ${unit5} έχει συνολικά μια ${py5.name} πυραμίδα;`
        : `How many ${unit5} in total does a ${py5.name} pyramid have?`,
      type: 'input',
      correct: ans5,
      unit: unit5,
      diagram: {
        type: 'pyramid',
        n: Math.min(6, py5.n),
        caption: isEl ? `Βάση n ＝ ${py5.n} ⇒ ${ans5} ${unit5}` : `Base n ＝ ${py5.n} ⇒ ${ans5} ${unit5}`
      },
      explanation: isEl
        ? `Μια ${py5.name} πυραμίδα (n ＝ ${py5.n}) έχει 2n ＝ ${2 * py5.n} ακμές και n ＋ 1 ＝ ${py5.n + 1} έδρες (και ${py5.n + 1} κορυφές).`
        : `A ${py5.name} pyramid (n ＝ ${py5.n}) has 2n ＝ ${2 * py5.n} edges and n ＋ 1 ＝ ${py5.n + 1} faces (and ${py5.n + 1} vertices).`
    });

    // Q6 (Κεφ. 14 • Άσκηση 3): TF - Κανονικό Τετράεδρο & Αναπτύγματα
    const pool14_3 = isEl
      ? [
          {
            p: "Το κανονικό τετράεδρο έχει 4 ίσες έδρες που είναι ισόπλευρα τρίγωνα, 6 ίσες ακμές και 4 κορυφές.",
            t: true,
            e: "Το κανονικό τετράεδρο είναι τριγωνική πυραμίδα με όλες τις 6 ακμές ίσες, άρα και οι 4 έδρες του είναι ίσα ισόπλευρα τρίγωνα."
          },
          {
            p: "Ένας κύβος ακμής 5 cm έχει άθροισμα μηκών όλων των ακμών του ίσο με 40 cm.",
            t: false,
            e: "Ο κύβος έχει 12 ίσες ακμές (όχι 8), άρα το συνολικό μήκος των ακμών του είναι 12 · 5 ＝ 60 cm."
          },
          {
            p: "Στο ανάπτυγμα ενός κύβου σχηματίζονται πάντα 6 ίσα τετράγωνα χωρίς να επικαλύπτονται.",
            t: true,
            e: "Ο κύβος περιορίζεται από 6 ίσες τετραγωνικές έδρες, οπότε κάθε έγκυρο ανάπτυγμά του αποτελείται από 6 ίσα τετράγωνα."
          }
        ]
      : [
          {
            p: "A regular tetrahedron has 4 congruent equilateral triangle faces, 6 equal edges, and 4 vertices.",
            t: true,
            e: "A regular tetrahedron is a triangular pyramid with all 6 edges equal, making all 4 faces congruent equilateral triangles."
          },
          {
            p: "A cube of edge length 5 cm has a total sum of all its edge lengths equal to 40 cm.",
            t: false,
            e: "A cube has 12 equal edges (not 8), so the total sum of its edges is 12 · 5 ＝ 60 cm."
          },
          {
            p: "The net of a cube always consists of 6 congruent non-overlapping squares.",
            t: true,
            e: "A cube is bounded by 6 congruent square faces, so every valid net consists of 6 congruent squares."
          }
        ];
    const p14_3 = pickRandom(pool14_3);

    qList.push({
      id: 6,
      badge: isEl ? 'ΚΕΦ. 14 • ΑΣΚΗΣΗ 3' : 'CH. 14 • EXERCISE 3',
      title: isEl ? 'Κανονικό Τετράεδρο & Αναπτύγματα' : 'Regular Tetrahedron & Nets',
      prompt: p14_3.p,
      type: 'tf',
      correct: p14_3.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: p14_3.e
    });

    // =========================================================================
    // ΚΕΦΑΛΑΙΟ 15: Κύλινδρος, Κώνος & Σφαίρα (3 Ασκήσεις: Q7 - Q9)
    // =========================================================================

    // Q7 (Κεφ. 15 • Άσκηση 1): MCQ - Στοιχεία Κυλίνδρου, Κώνου & Σφαίρας
    const pool15_1 = isEl
      ? [
          {
            q: "Τι σχήμα είναι το ανάπτυγμα της παράπλευρης επιφάνειας ενός ορθού κώνου γενέτειρας λ και ακτίνας βάσης ρ;",
            c: "Κυκλικός τομέας ακτίνας λ και τόξου 2πρ",
            e: "Η παράπλευρη επιφάνεια του κώνου ξετυλίγεται σε κυκλικό τομέα ακτίνας λ (της γενέτειρας) και τόξου ίσου με την περιφέρεια βάσης (2πρ)."
          },
          {
            q: "Ποια ανισότητα ισχύει ΠΑΝΤΑ ανάμεσα στη γενέτειρα (λ) και το ύψος (υ) ενός ορθού κώνου;",
            c: "λ > υ (η γενέτειρα είναι πάντα μεγαλύτερη από το ύψος)",
            e: "Η γενέτειρα λ είναι υποτείνουσα του ορθογωνίου τριγώνου ΚΟΑ και το ύψος υ κάθετη πλευρά, άρα λ > υ."
          },
          {
            q: "Ποια ιδιότητα ισχύει για το άθροισμα των γωνιών κάθε σφαιρικού τριγώνου ΑΒΓ;",
            c: "Είναι πάντα μεγαλύτερο από 180° (180° < Α ＋ Β ＋ Γ < 540°)",
            e: "Σε αντίθεση με τα επίπεδα τρίγωνα (180°), κάθε σφαιρικό τρίγωνο έχει άθροισμα γωνιών μεγαλύτερο από 180°."
          }
        ]
      : [
          {
            q: "What shape is the lateral surface net of a right cone with slant height l and base radius ρ?",
            c: "A circular sector of radius l and arc length 2πρ",
            e: "The lateral surface of a cone unrolls into a circular sector of radius l (slant height) and arc length equal to base circumference (2πρ)."
          },
          {
            q: "Which inequality ALWAYS holds between slant height (l) and height (h) of a right cone?",
            c: "l > h (slant height is always greater than height)",
            e: "Slant height l is the hypotenuse of right triangle KOA while height h is a leg, so l > h."
          },
          {
            q: "Which property holds for the angle sum of any spherical triangle ABC?",
            c: "It is always greater than 180° (180° < A ＋ B ＋ C < 540°)",
            e: "Unlike planar triangles (180°), every spherical triangle has an angle sum strictly greater than 180°."
          }
        ];
    const p15_1 = pickRandom(pool15_1);
    const dist15_1 = isEl
      ? [
          "Κυκλικός τομέας ακτίνας λ και τόξου 2πρ",
          "λ > υ (η γενέτειρα είναι πάντα μεγαλύτερη από το ύψος)",
          "Είναι πάντα μεγαλύτερο από 180° (180° < Α ＋ Β ＋ Γ < 540°)",
          "Ορθογώνιο παραλληλόγραμμο διαστάσεων 2πρ × λ",
          "Είναι πάντα ίσο με 180° (Α ＋ Β ＋ Γ ＝ 180°)"
        ]
      : [
          "A circular sector of radius l and arc length 2πρ",
          "l > h (slant height is always greater than height)",
          "It is always greater than 180° (180° < A ＋ B ＋ C < 540°)",
          "A rectangle of dimensions 2πρ × l",
          "It is always equal to 180° (A ＋ B ＋ C ＝ 180°)"
        ];

    qList.push({
      id: 7,
      badge: isEl ? 'ΚΕΦ. 15 • ΑΣΚΗΣΗ 1' : 'CH. 15 • EXERCISE 1',
      title: isEl ? 'Κύλινδρος, Κώνος & Σφαιρικό Τρίγωνο' : 'Cylinder, Cone & Spherical Triangle',
      prompt: p15_1.q,
      type: 'mcq',
      correct: p15_1.c,
      options: ensureFourUniqueOptions(p15_1.c, () => pickRandom(dist15_1)),
      explanation: p15_1.e
    });

    // Q8 (Κεφ. 15 • Άσκηση 2): Input - Μήκος ορθογωνίου κυλίνδρου ή τόξου κώνου (2πρ)
    const r8 = pickRandom([3, 4, 5, 6, 10]);
    const circum8 = Number((2 * 3.14 * r8).toFixed(2));
    const isCyl8 = Math.random() < 0.5;

    qList.push({
      id: 8,
      badge: isEl ? 'ΚΕΦ. 15 • ΑΣΚΗΣΗ 2' : 'CH. 15 • EXERCISE 2',
      title: isEl ? 'Ανάπτυγμα Κυλίνδρου & Κώνου' : 'Cylinder & Cone Nets',
      prompt: isEl
        ? isCyl8
          ? `Ένας ορθός κύλινδρος έχει ακτίνα βάσης ρ ＝ ${r8} cm. Με π ≈ 3,14, πόσα cm είναι το μήκος του ορθογωνίου στο ανάπτυγμα της παράπλευρης επιφάνειάς του;`
          : `Ένας ορθός κώνος έχει ακτίνα βάσης ρ ＝ ${r8} cm. Με π ≈ 3,14, πόσα cm είναι το μήκος του τόξου του κυκλικού τομέα στο ανάπτυγμά του;`
        : isCyl8
        ? `A right cylinder has base radius ρ ＝ ${r8} cm. Using π ≈ 3.14, what is the length (in cm) of the rectangle in its lateral net?`
        : `A right cone has base radius ρ ＝ ${r8} cm. Using π ≈ 3.14, what is the arc length (in cm) of the circular sector in its net?`,
      type: 'input',
      correct: circum8,
      unit: 'cm',
      diagram: {
        type: isCyl8 ? 'cylinder' : 'cone',
        caption: `2 · π · ρ ＝ 2 · 3,14 · ${r8} ＝ ${circum8.toLocaleString(locCode)} cm`
      },
      explanation: isEl
        ? `Και στον κύλινδρο και στον κώνο, η διάσταση αυτή ισούται με την περιφέρεια της βάσης: 2 · 3,14 · ${r8} ＝ ${circum8.toLocaleString(locCode)} cm.`
        : `In both cylinder and cone, this length equals the base circumference: 2 · 3.14 · ${r8} ＝ ${circum8.toLocaleString(locCode)} cm.`
    });

    // Q9 (Κεφ. 15 • Άσκηση 3): TF - Σφαίρα, Μέγιστος Κύκλος & Ανάπτυγμα
    const pool15_3 = isEl
      ? [
          {
            p: "Αν τέμουμε μια σφαίρα (Ο, ρ) με ένα επίπεδο που περνά από το κέντρο της Ο, σχηματίζεται ένας μέγιστος κύκλος ακτίνας ρ.",
            t: true,
            e: "Κάθε επίπεδο που περνά από το κέντρο Ο της σφαίρας (Ο, ρ) την τέμνει κατά έναν μέγιστο κύκλο ακτίνας ρ (όπως ο Ισημερινός)."
          },
          {
            p: "Η σφαίρα έχει επίπεδο ανάπτυγμα που αποτελείται από δύο ίσους κύκλους.",
            t: false,
            e: "Η σφαίρα ΔΕΝ έχει επίπεδο ανάπτυγμα (δεν μπορεί να απλωθεί στο επίπεδο χωρίς παραμόρφωση)."
          },
          {
            p: "Ένα σφαιρικό τρίγωνο μπορεί να έχει και τις τρεις γωνίες του ορθές (90°, 90° και 90°).",
            t: true,
            e: "Ένα σφαιρικό τρίγωνο που σχηματίζεται από τον ισημερινό και δύο κάθετους μεσημβρινούς έχει τρεις γωνίες των 90° (άθροισμα 270° > 180°)."
          }
        ]
      : [
          {
            p: "If we slice a sphere (O, ρ) with a plane passing through its center O, a great circle of radius ρ is formed.",
            t: true,
            e: "Any plane passing through center O intersects sphere (O, ρ) along a great circle of radius ρ (such as Earth's Equator)."
          },
          {
            p: "A sphere has a flat net consisting of two congruent circles.",
            t: false,
            e: "A sphere has NO flat 2D net (it cannot be flattened onto a plane without distortion)."
          },
          {
            p: "A spherical triangle can have all three of its angles equal to 90° (90°, 90°, and 90°).",
            t: true,
            e: "A spherical triangle bounded by the equator and two perpendicular meridians has three 90° angles (sum 270° > 180°)."
          }
        ];
    const p15_3 = pickRandom(pool15_3);

    qList.push({
      id: 9,
      badge: isEl ? 'ΚΕΦ. 15 • ΑΣΚΗΣΗ 3' : 'CH. 15 • EXERCISE 3',
      title: isEl ? 'Σφαίρα & Μέγιστος Κύκλος' : 'Sphere & Great Circle',
      prompt: p15_3.p,
      type: 'tf',
      correct: p15_3.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'sphere',
        showTriangle: true,
        caption: isEl ? 'Σφαίρα (Ο, ρ) & Μέγιστος κύκλος' : 'Sphere (O, ρ) & Great circle'
      },
      explanation: p15_3.e
    });

    // =========================================================================
    // ΔΥΣΚΟΛΑ ΣΥΝΔΥΑΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ ΣΤΟ ΤΕΛΟΣ (2 από κάθε κεφάλαιο: Q10 - Q15)
    // =========================================================================

    // Q10 (ΠΡΟΒΛΗΜΑ 1 • ΚΕΦ. 13 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ): Ορθό Πρίσμα - Εύρεση n από ακμές & συνολικό μήκος ακμών
    const n10 = pickRandom([4, 5, 6, 7]);
    const edges10 = 3 * n10;
    const baseSide10 = randInt(3, 6);
    const height10 = randInt(6, 11);
    const totalLen10 = 2 * n10 * baseSide10 + n10 * height10;

    qList.push({
      id: 10,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 1 • ΚΕΦ. 13 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 1 • CH. 13 • HIGH DIFFICULTY',
      title: isEl ? 'Συνολικό Μήκος Ακμών Ορθού Πρίσματος' : 'Total Edge Length of a Right Prism',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει συνολικά ${edges10} ακμές. Κάθε πλευρά της κανονικής βάσης του έχει μήκος ${baseSide10} cm και το ύψος του πρίσματος είναι ${height10} cm. Πόσα cm είναι το άθροισμα των μηκών όλων των ακμών του;`
        : `A right prism has ${edges10} edges in total. Each side of its regular base has length ${baseSide10} cm and the prism's height is ${height10} cm. What is the total sum of the lengths of all its edges in cm?`,
      type: 'input',
      correct: totalLen10,
      unit: 'cm',
      diagram: {
        type: 'rightPrism',
        n: Math.min(6, n10),
        caption: isEl ? `n ＝ ${n10}, πλευρά ${baseSide10} cm, ύψος ${height10} cm` : `n ＝ ${n10}, side ${baseSide10} cm, height ${height10} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Πλευρές βάσης (n)' : '1. Base sides (n)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>3n ＝ {edges10} ⇒ n ＝</span>
              <Frac num={edges10} den="3" />
              <span>＝ {n10}</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Ακμές 2 βάσεων & παράπλευρες' : '2. Base & lateral edges',
          details: `(2·${n10}·${baseSide10}) ＋ (${n10}·${height10}) ＝ ${2 * n10 * baseSide10} ＋ ${n10 * height10}`
        },
        {
          label: isEl ? '3. Συνολικό άθροισμα' : '3. Total sum',
          details: `${totalLen10} cm`
        }
      ],
      explanation: isEl
        ? `Από 3n ＝ ${edges10} βρίσκουμε n ＝ ${n10}. Οι 2 βάσεις έχουν ${2 * n10} ακμές των ${baseSide10} cm (${2 * n10 * baseSide10} cm) και υπάρχουν ${n10} παράπλευρες ακμές των ${height10} cm (${n10 * height10} cm), άρα σύνολο ${totalLen10} cm.`
        : `From 3n ＝ ${edges10} we get n ＝ ${n10}. Both bases give ${2 * n10} edges of ${baseSide10} cm (${2 * n10 * baseSide10} cm) plus ${n10} lateral edges of ${height10} cm (${n10 * height10} cm), totaling ${totalLen10} cm.`
    });

    // Q11 (ΠΡΟΒΛΗΜΑ 2 • ΚΕΦ. 13 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ): Ορθό Πρίσμα - Εμβαδόν παράπλευρης επιφάνειας από κορυφές
    const n11 = pickRandom([3, 4, 5, 6]);
    const verts11 = 2 * n11;
    const side11 = randInt(3, 6);
    const height11 = randInt(5, 9);
    const latArea11 = n11 * side11 * height11;

    qList.push({
      id: 11,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 2 • ΚΕΦ. 13 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 2 • CH. 13 • HIGH DIFFICULTY',
      title: isEl ? 'Παράπλευρο Εμβαδόν Ορθού Πρίσματος' : 'Lateral Surface Area of a Right Prism',
      prompt: isEl
        ? `Ένα ορθό πρίσμα έχει συνολικά ${verts11} κορυφές, κανονική βάση πλευράς ${side11} cm και ύψος ${height11} cm. Πόσα cm² είναι το συνολικό εμβαδόν όλων των παράπλευρων εδρών του;`
        : `A right prism has ${verts11} vertices in total, a regular base of side ${side11} cm, and height ${height11} cm. What is the total area of all its lateral faces in cm²?`,
      type: 'input',
      correct: latArea11,
      unit: 'cm²',
      diagram: {
        type: 'rightPrism',
        n: n11,
        caption: isEl ? `n ＝ ${n11} ορθογώνια (${side11}×${height11} cm)` : `n ＝ ${n11} rectangles (${side11}×${height11} cm)`
      },
      tableData: [
        {
          label: isEl ? '1. Εύρεση n από κορυφές' : '1. Finding n from vertices',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>2n ＝ {verts11} ⇒ n ＝</span>
              <Frac num={verts11} den="2" />
              <span>＝ {n11}</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Εμβαδόν 1 παράπλευρης έδρας' : '2. Area of 1 lateral face',
          details: `${side11} · ${height11} ＝ ${side11 * height11} cm²`
        },
        {
          label: isEl ? `3. Σύνολο ${n11} παράπλευρων εδρών` : `3. Total for ${n11} lateral faces`,
          details: `${n11} · ${side11 * height11} ＝ ${latArea11} cm²`
        }
      ],
      explanation: isEl
        ? `Από 2n ＝ ${verts11} βρίσκουμε n ＝ ${n11} παράπλευρες ορθογώνιες έδρες. Κάθε έδρα έχει εμβαδόν ${side11} · ${height11} ＝ ${side11 * height11} cm², άρα συνολικά ${n11} · ${side11 * height11} ＝ ${latArea11} cm².`
        : `From 2n ＝ ${verts11} we find n ＝ ${n11} rectangular lateral faces. Each face has area ${side11} · ${height11} ＝ ${side11 * height11} cm², totaling ${latArea11} cm².`
    });

    // Q12 (ΠΡΟΒΛΗΜΑ 3 • ΚΕΦ. 14 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ): Ορθογώνιο Παραλληλεπίπεδο - Εύρεση ύψους γ από άθροισμα ακμών και εμβαδόν αναπτύγματος
    const a12 = randInt(5, 8);
    const b12 = randInt(3, 5);
    const c12 = randInt(2, 4);
    const sumEdges12 = 4 * (a12 + b12 + c12);
    const netArea12 = 2 * (a12 * b12 + a12 * c12 + b12 * c12);

    qList.push({
      id: 12,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 3 • ΚΕΦ. 14 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 3 • CH. 14 • HIGH DIFFICULTY',
      title: isEl ? 'Ανάπτυγμα Ορθογωνίου Παραλληλεπιπέδου' : 'Net Area of a Rectangular Parallelepiped',
      prompt: isEl
        ? `Ένα ορθογώνιο παραλληλεπίπεδο έχει μήκος α ＝ ${a12} cm, πλάτος β ＝ ${b12} cm και το άθροισμα όλων των 12 ακμών του είναι ${sumEdges12} cm. Πόσα cm² είναι το εμβαδόν του αναπτύγματός του (ολική επιφάνεια);`
        : `A rectangular parallelepiped has length a ＝ ${a12} cm, width b ＝ ${b12} cm, and the sum of all 12 of its edges is ${sumEdges12} cm. What is the area of its net (total surface area) in cm²?`,
      type: 'input',
      correct: netArea12,
      unit: 'cm²',
      diagram: {
        type: 'cuboid',
        showDiag: false,
        caption: `${a12} cm × ${b12} cm × ${c12} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Εύρεση ύψους γ' : '1. Finding height c',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>α ＋ β ＋ γ ＝</span>
              <Frac num={sumEdges12} den="4" />
              <span>＝ {a12 + b12 + c12} ⇒ γ ＝ {c12} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Εμβαδόν 6 ορθογωνίων' : '2. Area of 6 rectangles',
          details: `2·(${a12}·${b12}) ＋ 2·(${a12}·${c12}) ＋ 2·(${b12}·${c12})`
        },
        {
          label: isEl ? '3. Εμβαδόν αναπτύγματος' : '3. Total net area',
          details: `${2 * a12 * b12} ＋ ${2 * a12 * c12} ＋ ${2 * b12 * c12} ＝ ${netArea12} cm²`
        }
      ],
      explanation: isEl
        ? `Από 4(α ＋ β ＋ γ) ＝ ${sumEdges12} έχουμε α ＋ β ＋ γ ＝ ${a12 + b12 + c12}, άρα γ ＝ ${c12} cm. Τότε το εμβαδόν του αναπτύγματος είναι 2·(${a12}·${b12} ＋ ${a12}·${c12} ＋ ${b12}·${c12}) ＝ ${netArea12} cm².`
        : `From 4(a ＋ b ＋ c) ＝ ${sumEdges12} we get a ＋ b ＋ c ＝ ${a12 + b12 + c12}, so c ＝ ${c12} cm. The net area is 2·(${a12}·${b12} ＋ ${a12}·${c12} ＋ ${b12}·${c12}) ＝ ${netArea12} cm².`
    });

    // Q13 (ΠΡΟΒΛΗΜΑ 4 • ΚΕΦ. 14 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ): Κανονικό Τετράεδρο vs Κύβος (Ίδιο άθροισμα ακμών)
    const mult13 = randInt(2, 6);
    const totalWire13 = 12 * mult13;
    const tetraEdge13 = totalWire13 / 6;
    const cubeEdge13 = totalWire13 / 12;
    const diff13 = tetraEdge13 - cubeEdge13;

    qList.push({
      id: 13,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 4 • ΚΕΦ. 14 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 4 • CH. 14 • HIGH DIFFICULTY',
      title: isEl ? 'Σύγκριση Ακμών Κανονικού Τετραέδρου & Κύβου' : 'Comparing Edges of Regular Tetrahedron & Cube',
      prompt: isEl
        ? `Διαθέτουμε δύο σύρματα μήκους ${totalWire13} cm το καθένα. Με το πρώτο κατασκευάζουμε τον σκελετό ενός κανονικού τετραέδρου (6 ίσες ακμές) και με το δεύτερο τον σκελετό ενός κύβου (12 ίσες ακμές). Κατά πόσα cm είναι μεγαλύτερη η ακμή του κανονικού τετραέδρου από την ακμή του κύβου;`
        : `We have two wires of length ${totalWire13} cm each. Using the first we build the frame of a regular tetrahedron (6 equal edges) and using the second the frame of a cube (12 equal edges). By how many cm is the edge of the regular tetrahedron longer than the edge of the cube?`,
      type: 'input',
      correct: diff13,
      unit: 'cm',
      diagram: {
        type: 'pyramid',
        n: 3,
        caption: isEl ? `Τετράεδρο: ${tetraEdge13} cm vs Κύβος: ${cubeEdge13} cm` : `Tetrahedron: ${tetraEdge13} cm vs Cube: ${cubeEdge13} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Ακμή κανονικού τετραέδρου' : '1. Regular tetrahedron edge',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <Frac num={totalWire13} den="6" />
              <span>＝ {tetraEdge13} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Ακμή κύβου' : '2. Cube edge',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <Frac num={totalWire13} den="12" />
              <span>＝ {cubeEdge13} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '3. Διαφορά ακμών' : '3. Difference of edges',
          details: `${tetraEdge13} － ${cubeEdge13} ＝ ${diff13} cm`
        }
      ],
      explanation: isEl
        ? `Η ακμή του κανονικού τετραέδρου είναι ${totalWire13} / 6 ＝ ${tetraEdge13} cm και η ακμή του κύβου είναι ${totalWire13} / 12 ＝ ${cubeEdge13} cm. Η διαφορά τους είναι ${tetraEdge13} － ${cubeEdge13} ＝ ${diff13} cm.`
        : `The regular tetrahedron edge is ${totalWire13} / 6 ＝ ${tetraEdge13} cm and the cube edge is ${totalWire13} / 12 ＝ ${cubeEdge13} cm. Their difference is ${tetraEdge13} － ${cubeEdge13} ＝ ${diff13} cm.`
    });

    // Q14 (ΠΡΟΒΛΗΜΑ 5 • ΚΕΦ. 15 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ): Ορθός Κύλινδρος - Εύρεση ακτίνας ρ από παράπλευρο εμβαδόν & ύψος
    const r14 = randInt(2, 6);
    const h14 = randInt(4, 8);
    const circum14 = Number((2 * 3.14 * r14).toFixed(2));
    const latArea14 = Number((circum14 * h14).toFixed(2));

    qList.push({
      id: 14,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 5 • ΚΕΦ. 15 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 5 • CH. 15 • HIGH DIFFICULTY',
      title: isEl ? 'Εύρεση Ακτίνας ρ Κυλίνδρου από Παράπλευρο Εμβαδόν' : 'Finding Cylinder Radius ρ from Lateral Area',
      prompt: isEl
        ? `Το ορθογώνιο στο ανάπτυγμα της παράπλευρης επιφάνειας ενός ορθού κυλίνδρου έχει εμβαδόν ${latArea14.toLocaleString(locCode)} cm² και το ύψος του κυλίνδρου είναι υ ＝ ${h14} cm. Αν θεωρήσουμε π ≈ 3,14, πόσα cm είναι η ακτίνα ρ της βάσης του κυλίνδρου;`
        : `The rectangle in the lateral net of a right cylinder has area ${latArea14.toLocaleString(locCode)} cm² and the cylinder height is h ＝ ${h14} cm. Using π ≈ 3.14, what is the base radius ρ of the cylinder in cm?`,
      type: 'input',
      correct: r14,
      unit: 'cm',
      diagram: {
        type: 'cylinder',
        caption: isEl ? `Ε ＝ (2πρ)·υ ＝ ${latArea14.toLocaleString(locCode)} ⇒ ρ ＝ ${r14} cm` : `A ＝ (2πρ)·h ＝ ${latArea14.toLocaleString(locCode)} ⇒ ρ ＝ ${r14} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Μήκος ορθογωνίου (2πρ)' : '1. Rectangle length (2πρ)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>2πρ ＝</span>
              <Frac num={latArea14.toLocaleString(locCode)} den={h14} />
              <span>＝ {circum14.toLocaleString(locCode)} cm</span>
            </div>
          )
        },
        {
          label: isEl ? '2. Υπολογισμός ακτίνας ρ' : '2. Solving for radius ρ',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>ρ ＝</span>
              <Frac num={circum14.toLocaleString(locCode)} den="6,28" />
              <span>＝ {r14} cm</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Διαιρώντας το παράπλευρο εμβαδόν ${latArea14.toLocaleString(locCode)} με το ύψος ${h14} βρίσκουμε την περιφέρεια βάσης 2πρ ＝ ${circum14.toLocaleString(locCode)} cm. Έπειτα διαιρούμε με 2·3,14 ＝ 6,28 και βρίσκουμε ρ ＝ ${r14} cm.`
        : `Dividing lateral area ${latArea14.toLocaleString(locCode)} by height ${h14} gives base circumference 2πρ ＝ ${circum14.toLocaleString(locCode)} cm. Dividing by 2·3.14 ＝ 6.28 gives ρ ＝ ${r14} cm.`
    });

    // Q15 (ΠΡΟΒΛΗΜΑ 6 • ΚΕΦ. 15 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ): Σφαιρικό Τρίγωνο & Σφαίρα (Μέγιστος Κύκλος + Υπολογισμός γωνιών)
    const r15 = randInt(4, 9);
    const mult15 = randInt(15, 25);
    const totalAngle15 = 180 + 6 * mult15;
    const angA15 = mult15;
    const angB15 = 2 * mult15;
    const angC15 = 3 * mult15;
    const corr15 = isEl
      ? `Μέγιστος κύκλος ρ ＝ ${r15} cm & Γωνίες ${angA15}°, ${angB15}°, ${angC15}°`
      : `Great circle ρ ＝ ${r15} cm & Angles ${angA15}°, ${angB15}°, ${angC15}°`;
    const dist15 = isEl
      ? [
          `Μέγιστος κύκλος ρ ＝ ${r15} cm & Γωνίες ${angA15}°, ${angB15}°, ${angC15}°`,
          `Μέγιστος κύκλος ρ ＝ ${2 * r15} cm & Γωνίες ${angA15}°, ${angB15}°, ${angC15}°`,
          `Μέγιστος κύκλος ρ ＝ ${r15} cm & Γωνίες 30°, 60°, 90°`,
          `Μέγιστος κύκλος ρ ＝ ${r15} cm & Γωνίες ${angA15 + 10}°, ${angB15}°, ${angC15 - 10}°`
        ]
      : [
          `Great circle ρ ＝ ${r15} cm & Angles ${angA15}°, ${angB15}°, ${angC15}°`,
          `Great circle ρ ＝ ${2 * r15} cm & Angles ${angA15}°, ${angB15}°, ${angC15}°`,
          `Great circle ρ ＝ ${r15} cm & Angles 30°, 60°, 90°`,
          `Great circle ρ ＝ ${r15} cm & Angles ${angA15 + 10}°, ${angB15}°, ${angC15 - 10}°`
        ];

    qList.push({
      id: 15,
      badge: isEl ? 'ΠΡΟΒΛΗΜΑ 6 • ΚΕΦ. 15 • ΥΨΗΛΗ ΔΥΣΚΟΛΙΑ' : 'PROBLEM 6 • CH. 15 • HIGH DIFFICULTY',
      title: isEl ? 'Σφαίρα, Μέγιστος Κύκλος & Σφαιρικό Τρίγωνο' : 'Sphere, Great Circle & Spherical Triangle',
      prompt: isEl
        ? `Πάνω σε μια σφαίρα ακτίνας ρ ＝ ${r15} cm σχεδιάζουμε έναν μέγιστο κύκλο και ένα σφαιρικό τρίγωνο ΑΒΓ. Αν το άθροισμα των γωνιών του σφαιρικού τριγώνου είναι ${totalAngle15}° και ισχύει Β ＝ 2Α και Γ ＝ 3Α, ποια είναι η ακτίνα του μεγίστου κύκλου και ποιες οι γωνίες Α, Β, Γ;`
        : `On a sphere of radius ρ ＝ ${r15} cm we draw a great circle and a spherical triangle ABC. If the angle sum of the spherical triangle is ${totalAngle15}° with B ＝ 2A and C ＝ 3A, what is the radius of the great circle and what are angles A, B, C?`,
      type: 'mcq',
      correct: corr15,
      options: ensureFourUniqueOptions(corr15, () => pickRandom(dist15)),
      diagram: {
        type: 'sphere',
        showTriangle: true,
        caption: isEl ? `Α ＋ Β ＋ Γ ＝ ${totalAngle15}° > 180°` : `A ＋ B ＋ C ＝ ${totalAngle15}° > 180°`
      },
      tableData: [
        {
          label: isEl ? '1. Ακτίνα μεγίστου κύκλου' : '1. Great circle radius',
          details: isEl ? `Ίση με την ακτίνα της σφαίρας: ρ ＝ ${r15} cm` : `Equals sphere radius: ρ ＝ ${r15} cm`
        },
        {
          label: isEl ? '2. Εξίσωση γωνιών (6Α)' : '2. Angle equation (6A)',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>Α ＋ 2Α ＋ 3Α ＝ {totalAngle15}° ⇒ Α ＝</span>
              <Frac num={`${totalAngle15}°`} den="6" />
              <span>＝ {angA15}°</span>
            </div>
          )
        },
        {
          label: isEl ? '3. Τρεις γωνίες Α, Β, Γ' : '3. Three angles A, B, C',
          details: `${angA15}°, ${angB15}°, ${angC15}°`
        }
      ],
      explanation: isEl
        ? `Ο μέγιστος κύκλος έχει την ίδια ακτίνα ρ ＝ ${r15} cm με τη σφαίρα. Επίσης Α ＋ 2Α ＋ 3Α ＝ 6Α ＝ ${totalAngle15}°, άρα Α ＝ ${angA15}°, Β ＝ ${angB15}° και Γ ＝ ${angC15}°.`
        : `The great circle has the same radius ρ ＝ ${r15} cm as the sphere. Also A ＋ 2A ＋ 3A ＝ 6A ＝ ${totalAngle15}°, so A ＝ ${angA15}°, B ＝ ${angB15}°, and C ＝ ${angC15}°.`
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

  const totalQuestions = questions.length || 15;
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
        <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-blue-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
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
            <div className="shrink-0">
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
              {t.scoreLabel}: {score} / {totalQuestions} ({Math.round((score / totalQuestions) * 100)}%)
            </h2>
            <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-4">
              {score >= 12 ? t.scoreGreat : score >= 8 ? t.scoreGood : t.scoreNeedWork}
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
            const isHardProblem = idx >= 9;
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
                    className={`inline-block max-w-full px-2.5 py-0.5 rounded-xl text-[10px] sm:text-xs font-extrabold uppercase tracking-wide leading-snug break-words ${
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
                      isHardProblem ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-700'
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
                  {toCleanUppercase(t.answeredLabel)}: <span className="text-indigo-400 font-black">{answeredCount}</span> / {totalQuestions}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-black">
                  <span className="text-emerald-400">{toCleanUppercase(isEl ? 'ΣΚΟΡ' : 'SCORE')}: {score} / {totalQuestions}</span>
                  <span className="hidden xs:inline text-slate-500">|</span>
                  <span className="text-indigo-300">{Math.round((score / totalQuestions) * 100)}%</span>
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
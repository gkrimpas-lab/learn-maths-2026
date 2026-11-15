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
    ? { O: 'Ο', A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', M: 'Μ', E: 'Ε', Z: 'Ζ' }
    : { O: 'O', A: 'A', B: 'B', C: 'C', D: 'D', M: 'M', E: 'E', Z: 'Z' };

  // 1. Ακτίνα & Διάμετρος (Ερ. 2)
  if (diagram.type === 'diameter') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <circle cx="132" cy="80" r="54" fill="rgba(99, 102, 241, 0.16)" stroke="#818cf8" strokeWidth="2.2" />
          <line x1="78" y1="80" x2="186" y2="80" stroke="#fb7185" strokeWidth="2.4" />
          <circle cx="132" cy="80" r="3.5" fill="#ffffff" />
          <circle cx="78" cy="80" r="3.5" fill="#fb7185" />
          <circle cx="186" cy="80" r="3.5" fill="#fb7185" />
          <text x="132" y="96" textAnchor="middle" className="text-[11px] font-black fill-white">{v.O}</text>
          <text x="68" y="84" textAnchor="end" className="text-[11px] font-black fill-rose-300">{v.A}</text>
          <text x="196" y="84" textAnchor="start" className="text-[11px] font-black fill-rose-300">{v.B}</text>
          <text x="105" y="72" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            ρ = {diagram.rLabel}
          </text>
          <text x="159" y="72" textAnchor="middle" className="text-[10px] font-mono font-bold fill-emerald-300">
            ρ = {diagram.rLabel}
          </text>
          <text x="132" y="150" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
            {isEl ? 'δ' : 'd'} = {diagram.dLabel}
          </text>
        </svg>
      </div>
    );
  }

  // 2. Θέση σημείου ως προς κύκλο (Ερ. 3, 9)
  if (diagram.type === 'region') {
    const isInside = diagram.zone === 'inside';
    const isOn = diagram.zone === 'on';
    const ptX = isInside ? 148 : isOn ? 174 : 210;
    const ptY = isInside ? 62 : isOn ? 46 : 36;
    const ptColor = isInside ? '#34d399' : isOn ? '#fbbf24' : '#fb7185';

    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <circle cx="122" cy="82" r="54" fill="rgba(99, 102, 241, 0.16)" stroke="#818cf8" strokeWidth="2.2" />
          {/* Ακτίνα αναφοράς */}
          <line x1="122" y1="82" x2="122" y2="136" stroke="#818cf8" strokeWidth="1.8" strokeDasharray="3 2" />
          <text x="116" y="114" textAnchor="end" className="text-[10px] font-mono font-bold fill-indigo-300">
            ρ = {diagram.rLabel}
          </text>

          {/* Απόσταση ΟΜ */}
          <line x1="122" y1="82" x2={ptX} y2={ptY} stroke={ptColor} strokeWidth="2.2" />
          <circle cx="122" cy="82" r="3.5" fill="#ffffff" />
          <circle cx={ptX} cy={ptY} r="4.2" fill={ptColor} />
          <text x="112" y="86" textAnchor="end" className="text-[11px] font-black fill-white">{v.O}</text>
          <text x={ptX + 8} y={ptY - 2} textAnchor="start" className="text-[11px] font-black" fill={ptColor}>
            {diagram.ptName} ({diagram.distLabel})
          </text>
        </svg>
      </div>
    );
  }

  // 3. Ισοσκελές τρίγωνο ΟΑΒ από χορδή ΑΒ και ακτίνες ΟΑ, ΟΒ (Ερ. 8, 10, 11)
  if (diagram.type === 'chordTriangle') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          <circle cx="132" cy="82" r="56" fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2" />
          {/* Τρίγωνο ΟΑΒ */}
          <polygon points="132,82 88,116 176,116" fill="rgba(52, 211, 153, 0.18)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />
          {/* Χορδή ΑΒ */}
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

  // 4. Μέγιστη χορδή = Διάμετρος vs τυχαία χορδή (Ερ. 12)
  if (diagram.type === 'maxChord') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 160" className="w-full max-w-[265px] h-36 select-none">
          <circle cx="132" cy="80" r="54" fill="rgba(99, 102, 241, 0.14)" stroke="#818cf8" strokeWidth="2.2" />
          {/* Διάμετρος ΓΔ */}
          <line x1="78" y1="80" x2="186" y2="80" stroke="#fb7185" strokeWidth="2.4" />
          {/* Χορδή ΑΒ */}
          <line x1="94" y1="42" x2="170" y2="42" stroke="#fbbf24" strokeWidth="2.2" />
          <circle cx="132" cy="80" r="3.5" fill="#ffffff" />
          <circle cx="78" cy="80" r="3" fill="#fb7185" />
          <circle cx="186" cy="80" r="3" fill="#fb7185" />
          <circle cx="94" cy="42" r="3" fill="#fbbf24" />
          <circle cx="170" cy="42" r="3" fill="#fbbf24" />
          <text x="132" y="95" textAnchor="middle" className="text-[10px] font-black fill-white">{v.O}</text>
          <text x="69" y="84" textAnchor="end" className="text-[10px] font-black fill-rose-300">{v.C}</text>
          <text x="195" y="84" textAnchor="start" className="text-[10px] font-black fill-rose-300">{v.D}</text>
          <text x="86" y="38" textAnchor="end" className="text-[10px] font-black fill-amber-300">{v.A}</text>
          <text x="178" y="38" textAnchor="start" className="text-[10px] font-black fill-amber-300">{v.B}</text>
          <text x="132" y="150" textAnchor="middle" className="text-[10px] font-mono font-bold fill-rose-300">
            {diagram.maxLabel}
          </text>
        </svg>
      </div>
    );
  }

  return null;
}

export default function KiklosExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Ο Κύκλος & τα Στοιχεία του | Α' Γυμνασίου" : "Exercises: The Circle & Its Elements | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στον κύκλο (Ο, ρ): εσωτερικό και εξωτερικό κύκλου, κυκλικός δίσκος, ακτίνα ρ, χορδή, διάμετρος δ, τόξο και ημικύκλιο."
      : "Interactive Grade 7 geometry exercises on the circle (O, ρ): interior and exterior of a circle, circular disk, radius ρ, chord, diameter, arc, and semicircle.",
    backNav: isEl ? "Θεωρία Κεφ. 09" : "Theory Ch. 09",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 09 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 09 • GRADE 7",
    heroTitle: isEl ? "Ο Κύκλος & τα Στοιχεία του: Εξάσκηση" : "The Circle & Its Elements: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στον ορισμό του κύκλου (Ο, ρ), στο εσωτερικό/εξωτερικό, στις ακτίνες, χορδές, διαμέτρους και τόξα."
      : "12 dynamic questions and problems on the circle definition (O, ρ), interior/exterior regions, radii, chords, diameters, and arcs.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τον ορισμό του κύκλου (Ο, ρ) και όλα τα γεωμετρικά στοιχεία του."
      : "Outstanding performance! You have completely mastered the definition of a circle (O, ρ) and all its geometric elements.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Μελετήστε τα αναλυτικά βήματα και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the detailed steps and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στον κύκλο, την ακτίνα ρ, τη διάμετρο, τη χορδή και το τόξο!"
      : "Needs a bit more review on the circle, radius ρ, diameter, chord, and arc!",
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

    // Q1: True / False - Ορισμός κύκλου (Ο, ρ) vs Κυκλικός Δίσκος
    const q1Pool = isEl
      ? [
          {
            p: 'Το κέντρο Ο ενός κύκλου (Ο, ρ) ανήκει στο εσωτερικό του κύκλου, αλλά ΔΕΝ ανήκει στον ίδιο τον κύκλο.',
            t: true,
            e: 'Στον κύκλο (Ο, ρ) ανήκουν μόνο τα σημεία Μ με απόσταση ΟΜ ＝ ρ. Για το κέντρο Ο ισχύει ΟΟ ＝ 0 ＜ ρ, άρα βρίσκεται στο εσωτερικό του κύκλου.'
          },
          {
            p: 'Ο κυκλικός δίσκος (Ο, ρ) αποτελείται μόνο από την εξωτερική καμπύλη γραμμή του κύκλου, χωρίς το εσωτερικό του.',
            t: false,
            e: 'Η καμπύλη γραμμή (ΟΜ ＝ ρ) είναι ο κύκλος. Ο κυκλικός δίσκος περιλαμβάνει τον κύκλο μαζί με ολόκληρο το εσωτερικό του (ΟΜ ≤ ρ).'
          },
          {
            p: 'Σε έναν κύκλο (Ο, ρ), όλες οι ακτίνες έχουν ίσο μήκος ίσο με ρ.',
            t: true,
            e: 'Κάθε σημείο πάνω στον κύκλο απέχει από το κέντρο Ο απόσταση ίση με ρ, άρα όλες οι ακτίνες είναι ίσες.'
          }
        ]
      : [
          {
            p: 'The center O of a circle (O, ρ) lies in the interior of the circle, NOT on the circle itself.',
            t: true,
            e: 'Only points M with OM ＝ ρ lie on the circle. For center O, OO ＝ 0 ＜ ρ, so O is in the interior.'
          },
          {
            p: 'A circular disk (O, ρ) consists solely of the outer boundary curve, excluding the interior.',
            t: false,
            e: 'The boundary curve (OM ＝ ρ) is the circle. A circular disk consists of the circle together with its interior (OM ≤ ρ).'
          },
          {
            p: 'In any circle (O, ρ), all radii have equal length equal to ρ.',
            t: true,
            e: 'Every point on the circle is at distance ρ from center O, so all radii are equal.'
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Ορισμός Κύκλου & Κυκλικού Δίσκου' : 'Definition of Circle & Circular Disk',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedQ1.e
    });

    // Q2: Input - Ακτίνα ρ και Διάμετρος δ (+ SVG)
    const r2 = randInt(4, 19);
    const d2 = 2 * r2;
    const askRadius2 = Math.random() < 0.5;

    qList.push({
      id: 2,
      title: isEl ? 'Ακτίνα ρ & Διάμετρος Κύκλου' : 'Radius ρ & Diameter of a Circle',
      prompt: askRadius2
        ? (isEl
            ? `Ένας κύκλος (Ο, ρ) έχει διάμετρο δ ＝ ${d2} cm. Πόσα εκατοστά (cm) είναι η ακτίνα ρ του κύκλου;`
            : `A circle (O, ρ) has diameter d ＝ ${d2} cm. What is the radius ρ of the circle in cm?`)
        : (isEl
            ? `Ένας κύκλος (Ο, ρ) έχει ακτίνα ρ ＝ ${r2} cm. Πόσα εκατοστά (cm) είναι η διάμετρός του δ;`
            : `A circle (O, ρ) has radius ρ ＝ ${r2} cm. What is its diameter d in cm?`),
      type: 'input',
      correct: askRadius2 ? r2 : d2,
      unit: 'cm',
      diagram: { type: 'diameter', rLabel: `${r2} cm`, dLabel: `${d2} cm` },
      explanation: askRadius2 ? (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          <span>{isEl ? 'Η ακτίνα είναι το μισό της διαμέτρου:' : 'The radius is half the diameter:'}</span>
          <span className="inline-flex items-center font-mono">
            ρ ＝ <Frac num={d2} den="2" /> ＝ {r2} cm.
          </span>
        </span>
      ) : (
        <span className="font-mono">
          {isEl ? `δ ＝ 2 · ρ ＝ 2 · ${r2} ＝ ${d2} cm.` : `d ＝ 2 · ρ ＝ 2 · ${r2} ＝ ${d2} cm.`}
        </span>
      )
    });

    // Q3: MCQ - Θέση σημείου ως προς κύκλο (Ο, ρ) (+ SVG)
    const r3 = randInt(6, 14);
    const zoneChoice3 = pickRandom(['inside', 'on', 'outside']);
    let dist3, corr3, expl3;
    const ptName3 = isEl ? 'Μ' : 'M';

    if (zoneChoice3 === 'inside') {
      dist3 = randInt(2, r3 - 1);
      corr3 = isEl ? 'Στο εσωτερικό του κύκλου' : 'In the interior of the circle';
      expl3 = isEl
        ? `Επειδή ΟΜ ＝ ${dist3} cm ＜ ${r3} cm (δηλαδή ΟΜ ＜ ρ), το σημείο Μ βρίσκεται στο εσωτερικό του κύκλου.`
        : `Since OM ＝ ${dist3} cm ＜ ${r3} cm (OM ＜ ρ), point M lies in the interior of the circle.`;
    } else if (zoneChoice3 === 'on') {
      dist3 = r3;
      corr3 = isEl ? 'Πάνω στον κύκλο' : 'On the circle';
      expl3 = isEl
        ? `Επειδή ΟΜ ＝ ${dist3} cm ＝ ρ, το σημείο Μ βρίσκεται πάνω στον κύκλο (Ο, ρ).`
        : `Since OM ＝ ${dist3} cm ＝ ρ, point M lies on the circle (O, ρ).`;
    } else {
      dist3 = r3 + randInt(2, 7);
      corr3 = isEl ? 'Στο εξωτερικό του κύκλου' : 'In the exterior of the circle';
      expl3 = isEl
        ? `Επειδή ΟΜ ＝ ${dist3} cm ＞ ${r3} cm (δηλαδή ΟΜ ＞ ρ), το σημείο Μ βρίσκεται στο εξωτερικό του κύκλου.`
        : `Since OM ＝ ${dist3} cm ＞ ${r3} cm (OM ＞ ρ), point M lies in the exterior of the circle.`;
    }

    const distOpts3 = isEl
      ? [
          'Στο εσωτερικό του κύκλου',
          'Πάνω στον κύκλο',
          'Στο εξωτερικό του κύκλου',
          'Στο κέντρο Ο του κύκλου',
          'Δεν μπορεί να προσδιοριστεί'
        ]
      : [
          'In the interior of the circle',
          'On the circle',
          'In the exterior of the circle',
          'At the center O of the circle',
          'Cannot be determined'
        ];

    qList.push({
      id: 3,
      title: isEl ? 'Θέση Σημείου ως προς Κύκλο (Ο, ρ)' : 'Position of a Point Relative to Circle (O, ρ)',
      prompt: isEl
        ? `Δίνεται κύκλος (Ο, ρ) με ακτίνα ρ ＝ ${r3} cm. Αν ένα σημείο Μ απέχει από το κέντρο Ο απόσταση ΟΜ ＝ ${dist3} cm, πού βρίσκεται το σημείο Μ;`
        : `Given circle (O, ρ) with radius ρ ＝ ${r3} cm, if point M is at distance OM ＝ ${dist3} cm from center O, where is point M located?`,
      type: 'mcq',
      correct: corr3,
      options: ensureFourUniqueOptions(corr3, () => pickRandom(distOpts3)),
      diagram: { type: 'region', zone: zoneChoice3, rLabel: `${r3} cm`, distLabel: `${dist3} cm`, ptName: ptName3 },
      explanation: expl3
    });

    // Q4: MCQ - Αναγνώριση στοιχείων κύκλου (Χορδή, Διάμετρος, Ακτίνα, Τόξο, Ημικύκλιο)
    const defPool4 = isEl
      ? [
          {
            q: 'Πώς ονομάζεται το ευθύγραμμο τμήμα που ενώνει δύο οποιαδήποτε σημεία ενός κύκλου;',
            c: 'Χορδή',
            e: 'Χορδή ονομάζεται κάθε ευθύγραμμο τμήμα που ενώνει δύο οποιαδήποτε σημεία του κύκλου.'
          },
          {
            q: 'Πώς ονομάζεται η μεγαλύτερη χορδή ενός κύκλου, η οποία διέρχεται από το κέντρο του;',
            c: 'Διάμετρος',
            e: 'Η διάμετρος είναι χορδή που περνά από το κέντρο Ο, είναι η μεγαλύτερη χορδή και έχει μήκος 2ρ.'
          },
          {
            q: 'Πώς ονομάζεται καθένα από τα δύο καμπύλα μέρη στα οποία χωρίζουν έναν κύκλο δύο διαφορετικά σημεία του Α και Β;',
            c: 'Τόξο',
            e: 'Δύο σημεία Α και Β ενός κύκλου τον χωρίζουν σε δύο τόξα με κοινά άκρα τα Α και Β.'
          },
          {
            q: 'Πώς ονομάζεται καθένα από τα δύο ίσα τόξα που ορίζουν τα άκρα μιας διαμέτρου ενός κύκλου;',
            c: 'Ημικύκλιο',
            e: 'Τα άκρα μιας διαμέτρου χωρίζουν τον κύκλο σε δύο ίσα τόξα, καθένα από τα οποία λέγεται ημικύκλιο.'
          }
        ]
      : [
          {
            q: 'What is a line segment joining any two points on a circle called?',
            c: 'Chord',
            e: 'A chord is any line segment connecting two points on a circle.'
          },
          {
            q: 'What is the longest chord of a circle, which passes through its center, called?',
            c: 'Diameter',
            e: 'A diameter is a chord passing through center O; it is the longest chord and equals 2ρ.'
          },
          {
            q: 'What is each of the two curved parts into which two distinct points A and B divide a circle called?',
            c: 'Arc',
            e: 'Two distinct points A and B on a circle divide it into two arcs sharing endpoints A and B.'
          },
          {
            q: 'What is each of the two equal arcs determined by the endpoints of a diameter called?',
            c: 'Semicircle',
            e: 'The endpoints of a diameter divide the circle into two equal arcs, each called a semicircle.'
          }
        ];

    const pickedDef4 = pickRandom(defPool4);
    const dist4 = isEl
      ? ['Χορδή', 'Διάμετρος', 'Τόξο', 'Ημικύκλιο', 'Ακτίνα', 'Κυκλικός δίσκος']
      : ['Chord', 'Diameter', 'Arc', 'Semicircle', 'Radius', 'Circular disk'];

    qList.push({
      id: 4,
      title: isEl ? 'Στοιχεία του Κύκλου' : 'Elements of a Circle',
      prompt: pickedDef4.q,
      type: 'mcq',
      correct: pickedDef4.c,
      options: ensureFourUniqueOptions(pickedDef4.c, () => pickRandom(dist4)),
      explanation: pickedDef4.e
    });

    // Q5: True / False - Σχέση Χορδής - Διαμέτρου - Τόξου
    const tfPool5 = isEl
      ? [
          {
            p: 'Κάθε διάμετρος ενός κύκλου είναι χορδή του, αλλά δεν είναι κάθε χορδή διάμετρος.',
            t: true,
            e: 'Η διάμετρος ενώνει δύο σημεία του κύκλου (άρα είναι χορδή) και επιπλέον διέρχεται από το κέντρο Ο.'
          },
          {
            p: 'Σε έναν κύκλο ακτίνας ρ ＝ 6 cm, μπορεί να υπάρχει χορδή μήκους 14 cm.',
            t: false,
            e: 'Η μεγαλύτερη δυνατή χορδή ενός κύκλου είναι η διάμετρος (δ ＝ 2ρ ＝ 12 cm). Άρα καμία χορδή δεν μπορεί να έχει μήκος 14 cm.'
          },
          {
            p: 'Η χορδή ΑΒ και το τόξο ΑΒ έχουν τα ίδια άκρα (Α και Β), αλλά η χορδή είναι ευθύγραμμο τμήμα ενώ το τόξο είναι καμπύλη γραμμή.',
            t: true,
            e: 'Η χορδή ΑΒ είναι ευθύγραμμο τμήμα που υποτείνει τα δύο τόξα με άκρα Α και Β.'
          }
        ]
      : [
          {
            p: 'Every diameter of a circle is a chord, but not every chord is a diameter.',
            t: true,
            e: 'A diameter joins two points on the circle (so it is a chord) and also passes through center O.'
          },
          {
            p: 'In a circle of radius ρ ＝ 6 cm, there can be a chord of length 14 cm.',
            t: false,
            e: 'The longest possible chord is the diameter (d ＝ 2ρ ＝ 12 cm). Thus no chord can measure 14 cm.'
          },
          {
            p: 'Chord AB and arc AB share the same endpoints (A and B), but the chord is a straight segment whereas the arc is curved.',
            t: true,
            e: 'Chord AB is a line segment subtending the two arcs with endpoints A and B.'
          }
        ];

    const pickedTf5 = pickRandom(tfPool5);
    qList.push({
      id: 5,
      title: isEl ? 'Χορδή, Διάμετρος & Τόξο' : 'Chord, Diameter & Arc',
      prompt: pickedTf5.p,
      type: 'tf',
      correct: pickedTf5.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      explanation: pickedTf5.e
    });

    // Q6: Input - Μέγιστο δυνατό ακέραιο μήκος χορδής (δ = 2ρ) (+ SVG)
    const r6 = randInt(5, 16);
    const d6 = 2 * r6;

    qList.push({
      id: 6,
      title: isEl ? 'Μεγαλύτερη Χορδή Κύκλου' : 'Longest Chord of a Circle',
      prompt: isEl
        ? `Ένας κύκλος (Ο, ρ) έχει ακτίνα ρ ＝ ${r6} cm. Πόσα εκατοστά (cm) είναι το μήκος της μεγαλύτερης δυνατής χορδής του κύκλου;`
        : `A circle (O, ρ) has radius ρ ＝ ${r6} cm. What is the length in cm of the longest possible chord of the circle?`,
      type: 'input',
      correct: d6,
      unit: 'cm',
      diagram: { type: 'maxChord', maxLabel: `max = δ = 2ρ = ${d6} cm` },
      explanation: isEl
        ? `Η μεγαλύτερη χορδή κάθε κύκλου είναι η διάμετρός του: δ ＝ 2 · ρ ＝ 2 · ${r6} ＝ ${d6} cm.`
        : `The longest chord of any circle is its diameter: d ＝ 2 · ρ ＝ 2 · ${r6} ＝ ${d6} cm.`
    });

    // Q7: Input - Περίμετρος τριγώνου ΟΑΒ από ακτίνες & χορδή
    const r7 = randInt(6, 15);
    const chord7 = randInt(4, 2 * r7 - 2);
    const perim7 = 2 * r7 + chord7;

    qList.push({
      id: 7,
      title: isEl ? 'Τρίγωνο Ακτίνων & Χορδής (Περίμετρος)' : 'Triangle of Radii & Chord (Perimeter)',
      prompt: isEl
        ? `Σε κύκλο (Ο, ρ) με ακτίνα ρ ＝ ${r7} cm, φέρνουμε μια χορδή ΑΒ μήκους ${chord7} cm. Πόσα εκατοστά (cm) είναι η περίμετρος του τριγώνου ΟΑΒ;`
        : `In circle (O, ρ) with radius ρ ＝ ${r7} cm, we draw chord AB of length ${chord7} cm. What is the perimeter of triangle OAB in cm?`,
      type: 'input',
      correct: perim7,
      unit: 'cm',
      diagram: { type: 'chordTriangle', rLabel: `${r7} cm`, chordLabel: `${chord7} cm` },
      explanation: isEl
        ? `Οι πλευρές ΟΑ και ΟΒ είναι ακτίνες του κύκλου (ΟΑ ＝ ΟΒ ＝ ρ ＝ ${r7} cm). Άρα Π ＝ ${r7} ＋ ${r7} ＋ ${chord7} ＝ ${perim7} cm.`
        : `Sides OA and OB are radii of the circle (OA ＝ OB ＝ ρ ＝ ${r7} cm). Thus P ＝ ${r7} ＋ ${r7} ＋ ${chord7} ＝ ${perim7} cm.`
    });

    // Q8: Input - Γωνίες ισοσκελούς τριγώνου ΟΑΒ (δίνεται επίκεντρη γωνία ΑΟΒ -> ζητείται ΟΑΒ) (+ SVG)
    const angO8 = randInt(20, 62) * 2; // άρτια γωνία 40°..124°
    const baseAng8 = (180 - angO8) / 2;

    qList.push({
      id: 8,
      title: isEl ? 'Γωνίες Τριγώνου ΟΑΒ (Ακτίνες & Χορδή)' : 'Angles of Triangle OAB (Radii & Chord)',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) φέρνουμε μια χορδή ΑΒ ώστε η γωνία Α<Angle>Ο</Angle>Β να είναι {angO8}°. Πόσες μοίρες είναι η γωνία Ο<Angle>Α</Angle>Β;
        </span>
      ) : (
        <span>
          In circle (O, ρ), draw chord AB such that central angle ∠AOB ＝ {angO8}°. How many degrees is angle ∠OAB?
        </span>
      ),
      type: 'input',
      correct: baseAng8,
      unit: '°',
      diagram: { type: 'chordTriangle', angO: angO8, angA: baseAng8, angB: baseAng8 },
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl ? (
              <>
                Επειδή ΟΑ ＝ ΟΒ ＝ ρ, το τρίγωνο ΟΑΒ είναι ισοσκελές με βάση ΑΒ (Ο<Angle>Α</Angle>Β ＝ Ο<Angle>Β</Angle>Α):
              </>
            ) : (
              'Since OA ＝ OB ＝ ρ, triangle OAB is isosceles with base AB (∠OAB ＝ ∠OBA):'
            )}
          </span>
          <span className="inline-flex items-center gap-1 font-mono">
            Ο<Angle>Α</Angle>Β ＝ <Frac num={`180° － ${angO8}°`} den="2" /> ＝ {baseAng8}°.
          </span>
        </span>
      )
    });

    // Q9: MCQ + tableData + SVG - Συγκριτική κατάταξη 3 σημείων ως προς κύκλο (Ο, ρ)
    const d9 = randInt(6, 12) * 2; // διάμετρος 12..24 cm
    const r9 = d9 / 2; // ακτίνα 6..12 cm
    const distIn9 = r9 - randInt(2, 4);
    const distOut9 = r9 + randInt(2, 5);

    const q9Correct = isEl
      ? 'Α στο εσωτερικό, Β πάνω στον κύκλο, Γ στο εξωτερικό'
      : 'A in the interior, B on the circle, C in the exterior';

    const q9Distractors = isEl
      ? [
          'Α στο εσωτερικό, Β πάνω στον κύκλο, Γ στο εξωτερικό',
          'Α στο εσωτερικό, Β στο εσωτερικό, Γ πάνω στον κύκλο',
          'Α πάνω στον κύκλο, Β στο εξωτερικό, Γ στο εξωτερικό',
          'Α στο εξωτερικό, Β πάνω στον κύκλο, Γ στο εσωτερικό',
          'Και τα τρία σημεία στο εσωτερικό του κύκλου'
        ]
      : [
          'A in the interior, B on the circle, C in the exterior',
          'A in the interior, B in the interior, C on the circle',
          'A on the circle, B in the exterior, C in the exterior',
          'A in the exterior, B on the circle, C in the interior',
          'All three points in the interior of the circle'
        ];

    qList.push({
      id: 9,
      title: isEl ? 'Πρόβλημα Θέσης Σημείων & Διαμέτρου' : 'Point Positions & Diameter Problem',
      prompt: isEl
        ? `Ένας κύκλος (Ο, ρ) έχει διάμετρο δ ＝ ${d9} cm. Τα σημεία Α, Β και Γ απέχουν από το κέντρο Ο αποστάσεις ΟΑ ＝ ${distIn9} cm, ΟΒ ＝ ${r9} cm και ΟΓ ＝ ${distOut9} cm αντίστοιχα. Ποια πρόταση περιγράφει σωστά τη θέση των τριών σημείων;`
        : `A circle (O, ρ) has diameter d ＝ ${d9} cm. Points A, B, and C lie at distances OA ＝ ${distIn9} cm, OB ＝ ${r9} cm, and OC ＝ ${distOut9} cm from center O. Which statement correctly describes their positions?`,
      type: 'mcq',
      correct: q9Correct,
      options: ensureFourUniqueOptions(q9Correct, () => pickRandom(q9Distractors)),
      diagram: { type: 'region', zone: 'on', rLabel: `${r9} cm`, distLabel: `${r9} cm`, ptName: isEl ? 'Β' : 'B' },
      tableData: [
        {
          label: isEl ? '1. Υπολογισμός ακτίνας ρ' : '1. Calculating radius ρ',
          details: (
            <span className="inline-flex items-center gap-1">
              ρ ＝ <Frac num={d9} den="2" /> ＝ {r9} cm
            </span>
          )
        },
        {
          label: isEl ? '2. Σύγκριση ΟΑ, ΟΒ, ΟΓ με ρ' : '2. Comparing OA, OB, OC with ρ',
          details: `ΟΑ ＝ ${distIn9} ＜ ${r9} (εσωτερικό), ΟΒ ＝ ${r9} (κύκλος), ΟΓ ＝ ${distOut9} ＞ ${r9} (εξωτερικό)`
        }
      ],
      explanation: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-relaxed break-words [overflow-wrap:anywhere]">
          <span>
            {isEl
              ? `Πρώτα βρίσκουμε την ακτίνα ρ ＝ ${d9} ÷ 2 ＝ ${r9} cm. Επειδή ΟΑ ＝ ${distIn9} ＜ ${r9}, ΟΒ ＝ ${r9} και ΟΓ ＝ ${distOut9} ＞ ${r9}, το Α είναι στο εσωτερικό, το Β πάνω στον κύκλο και το Γ στο εξωτερικό.`
              : `First, radius ρ ＝ ${d9} ÷ 2 ＝ ${r9} cm. Since OA ＝ ${distIn9} ＜ ${r9}, OB ＝ ${r9}, and OC ＝ ${distOut9} ＞ ${r9}, A is inside, B is on the circle, and C is outside.`}
          </span>
        </span>
      )
    });

    // Q10: Input + tableData + SVG - Χορδή ίση με την ακτίνα ρ -> Ισόπλευρο τρίγωνο ΟΑΒ (γωνία 60°)
    const r10 = randInt(5, 14);
    qList.push({
      id: 10,
      title: isEl ? 'Χορδή Ίση με την Ακτίνα ρ' : 'Chord Equal to Radius ρ',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) με ακτίνα ρ ＝ {r10} cm, φέρνουμε μια χορδή ΑΒ που έχει μήκος ίσο με την ακτίνα (ΑΒ ＝ {r10} cm). Πόσες μοίρες είναι η γωνία Α<Angle>Ο</Angle>Β;
        </span>
      ) : (
        <span>
          In circle (O, ρ) with radius ρ ＝ {r10} cm, draw chord AB of length equal to the radius (AB ＝ {r10} cm). How many degrees is angle ∠AOB?
        </span>
      ),
      type: 'input',
      correct: 60,
      unit: '°',
      diagram: {
        type: 'chordTriangle',
        angO: 60,
        angA: 60,
        angB: 60,
        rLabel: `${r10} cm`,
        chordLabel: `${r10} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Πλευρές τριγώνου ΟΑΒ' : '1. Sides of triangle OAB',
          details: `ΟΑ ＝ ρ ＝ ${r10} cm, ΟΒ ＝ ρ ＝ ${r10} cm, ΑΒ ＝ ${r10} cm`
        },
        {
          label: isEl ? '2. Είδος τριγώνου' : '2. Triangle type',
          details: isEl
            ? 'ΟΑ ＝ ΟΒ ＝ ΑΒ ⇒ Το τρίγωνο ΟΑΒ είναι ισόπλευρο'
            : 'OA ＝ OB ＝ AB ⇒ Triangle OAB is equilateral'
        },
        {
          label: isEl ? '3. Γωνία ΑΟΒ' : '3. Angle ∠AOB',
          details: isEl ? (
            <span>
              Κάθε γωνία ισοπλεύρου είναι 60° ⇒ Α<Angle>Ο</Angle>Β ＝ 60°
            </span>
          ) : (
            'Every angle of an equilateral triangle is 60° ⇒ ∠AOB ＝ 60°'
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Επειδή ΟΑ ＝ ΟΒ ＝ ρ ＝ {r10} cm και ΑΒ ＝ {r10} cm, το τρίγωνο ΟΑΒ έχει και τις 3 πλευρές ίσες (ισόπλευρο), άρα Α<Angle>Ο</Angle>Β ＝ 60°.
        </span>
      ) : (
        <span>
          Since OA ＝ OB ＝ ρ ＝ {r10} cm and AB ＝ {r10} cm, triangle OAB is equilateral, so ∠AOB ＝ 60°.
        </span>
      )
    });

    // Q11: Input + tableData + SVG - Δίνεται η γωνία ΟΑΒ -> ζητείται η επίκεντρη ΑΟΒ
    const baseAng11 = randInt(32, 68);
    const angO11 = 180 - 2 * baseAng11;

    qList.push({
      id: 11,
      title: isEl ? 'Υπολογισμός Γωνίας ΑΟΒ από Χορδή' : 'Finding Angle ∠AOB from Chord Angle',
      prompt: isEl ? (
        <span>
          Σε κύκλο (Ο, ρ) φέρνουμε μια χορδή ΑΒ ώστε η γωνία Ο<Angle>Α</Angle>Β να είναι {baseAng11}°. Πόσες μοίρες είναι η γωνία Α<Angle>Ο</Angle>Β;
        </span>
      ) : (
        <span>
          In circle (O, ρ), draw chord AB such that ∠OAB ＝ {baseAng11}°. How many degrees is angle ∠AOB?
        </span>
      ),
      type: 'input',
      correct: angO11,
      unit: '°',
      diagram: { type: 'chordTriangle', angO: angO11, angA: baseAng11, angB: baseAng11 },
      tableData: [
        {
          label: isEl ? '1. Ισοσκελές τρίγωνο ΟΑΒ' : '1. Isosceles triangle OAB',
          details: isEl ? (
            <span>
              ΟΑ ＝ ΟΒ ＝ ρ ⇒ Ο<Angle>Β</Angle>Α ＝ Ο<Angle>Α</Angle>Β ＝ {baseAng11}°
            </span>
          ) : (
            `OA ＝ OB ＝ ρ ⇒ ∠OBA ＝ ∠OAB ＝ ${baseAng11}°`
          )
        },
        {
          label: isEl ? '2. Άθροισμα γωνιών (180°)' : '2. Angle sum (180°)',
          details: isEl ? (
            <span>
              Α<Angle>Ο</Angle>Β ＝ 180° － ({baseAng11}° ＋ {baseAng11}°) ＝ {angO11}°
            </span>
          ) : (
            `∠AOB ＝ 180° － (${baseAng11}° ＋ ${baseAng11}°) ＝ ${angO11}°`
          )
        }
      ],
      explanation: isEl ? (
        <span>
          Στο ισοσκελές τρίγωνο ΟΑΒ (ΟΑ ＝ ΟΒ ＝ ρ), οι γωνίες στη βάση ΑΒ είναι ίσες (Ο<Angle>Α</Angle>Β ＝ Ο<Angle>Β</Angle>Α ＝ {baseAng11}°). Άρα Α<Angle>Ο</Angle>Β ＝ 180° － 2 · {baseAng11}° ＝ {angO11}°.
        </span>
      ) : (
        <span>
          In isosceles triangle OAB (OA ＝ OB ＝ ρ), the base angles are equal (∠OAB ＝ ∠OBA ＝ {baseAng11}°). Thus ∠AOB ＝ 180° － 2 · {baseAng11}° ＝ {angO11}°.
        </span>
      )
    });

    // Q12: MCQ + tableData + SVG - Σύγκριση χορδής & διαμέτρου / Αδύνατο μήκος χορδής
    const r12 = randInt(7, 13);
    const d12 = 2 * r12;
    const validChord1 = d12 - 3;
    const validChord2 = d12 - 1;
    const validChord3 = d12; // η ίδια η διάμετρος είναι χορδή!
    const impossibleChord = d12 + randInt(2, 5);

    const q12Correct = `${impossibleChord} cm`;
    const q12Distractors = [
      `${impossibleChord} cm`,
      `${validChord3} cm`,
      `${validChord2} cm`,
      `${validChord1} cm`,
      `${r12} cm`
    ];

    qList.push({
      id: 12,
      title: isEl ? 'Περιορισμός Μήκους Χορδής Κύκλου' : 'Maximum Length Constraint of a Chord',
      prompt: isEl
        ? `Ένας κύκλος (Ο, ρ) έχει ακτίνα ρ ＝ ${r12} cm. Ποιο από τα παρακάτω μήκη ΔΕΝ μπορεί να έχει μια χορδή αυτού του κύκλου;`
        : `A circle (O, ρ) has radius ρ ＝ ${r12} cm. Which of the following lengths CANNOT be the length of a chord of this circle?`,
      type: 'mcq',
      correct: q12Correct,
      options: ensureFourUniqueOptions(q12Correct, () => pickRandom(q12Distractors)),
      diagram: { type: 'maxChord', maxLabel: `ΑΒ ≤ δ ＝ ${d12} cm` },
      tableData: [
        {
          label: isEl ? '1. Διάμετρος κύκλου (δ)' : '1. Circle diameter (d)',
          details: `δ ＝ 2 · ρ ＝ 2 · ${r12} ＝ ${d12} cm`
        },
        {
          label: isEl ? '2. Ιδιότητα μέγιστης χορδής' : '2. Longest chord property',
          details: isEl
            ? `Κάθε χορδή ΑΒ ικανοποιεί ΑΒ ≤ δ, δηλαδή ΑΒ ≤ ${d12} cm`
            : `Every chord AB satisfies AB ≤ d, i.e., AB ≤ ${d12} cm`
        },
        {
          label: isEl ? '3. Αδύνατη τιμή' : '3. Impossible value',
          details: `${impossibleChord} cm ＞ ${d12} cm`
        }
      ],
      explanation: isEl
        ? `Η μεγαλύτερη δυνατή χορδή ενός κύκλου ακτίνας ρ ＝ ${r12} cm είναι η διάμετρός του δ ＝ 2 · ${r12} ＝ ${d12} cm. Άρα καμία χορδή δεν μπορεί να έχει μήκος ${impossibleChord} cm.`
        : `The longest possible chord of a circle with radius ρ ＝ ${r12} cm is its diameter d ＝ 2 · ${r12} ＝ ${d12} cm. Thus no chord can measure ${impossibleChord} cm.`
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
      backUrl="/a-gymnasiou/45-kiklos"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/45-kiklos"
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
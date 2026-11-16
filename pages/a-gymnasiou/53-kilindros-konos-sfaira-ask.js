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

  // 1. Ορθός Κύλινδρος & Ορθογώνιο Ανάπτυγμα
  if (diagram.type === 'cylinder') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Κύλινδρος αριστερά */}
          <ellipse cx="64" cy="118" rx="28" ry="9" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.7" />
          <ellipse cx="64" cy="44" rx="28" ry="9" fill="rgba(99, 102, 241, 0.35)" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="36" y1="44" x2="36" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="92" y1="44" x2="92" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="64" y1="118" x2="92" y2="118" stroke="#34d399" strokeWidth="1.7" />
          <text x="78" y="114" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">ρ</text>
          <text x="30" y="84" textAnchor="end" className="text-[8px] font-mono font-bold fill-amber-300">{isEl ? 'υ' : 'h'}</text>

          {/* Ανάπτυγμα δεξιά (οι βάσεις εφάπτονται στο ορθογώνιο) */}
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

  // 2. Ορθός Κώνος & Κυκλικός Τομέας Ανάπτυγμα (ακριβής επαφή τόξου και κύκλου βάσης)
  if (diagram.type === 'cone') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Κώνος αριστερά */}
          <ellipse cx="68" cy="118" rx="30" ry="10" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="1.7" />
          <line x1="68" y1="34" x2="38" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="68" y1="34" x2="98" y2="118" stroke="#818cf8" strokeWidth="1.7" />
          <line x1="68" y1="34" x2="68" y2="118" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="68" y1="118" x2="98" y2="118" stroke="#34d399" strokeWidth="1.7" />
          <text x="83" y="114" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">ρ</text>
          <text x="63" y="82" textAnchor="end" className="text-[8px] font-mono font-bold fill-amber-300">{isEl ? 'υ' : 'h'}</text>
          <text x="88" y="74" textAnchor="start" className="text-[8px] font-mono font-bold fill-indigo-300">{isEl ? 'λ' : 'l'}</text>

          {/* Ανάπτυγμα κώνου δεξιά: Κορυφή (185, 24), ακτίνα τόξου 64 -> μέσο τόξου στο (185, 88) */}
          <path d="M 185,24 L 143,72 A 64,64 0 0,0 227,72 Z" fill="rgba(16, 185, 129, 0.28)" stroke="#34d399" strokeWidth="1.7" />
          {/* Κύκλος βάσης ακτίνας 18 με κέντρο (185, 106) -> κορυφή κύκλου ακριβώς στο (185, 88) */}
          <circle cx="185" cy="106" r="18" fill="rgba(99, 102, 241, 0.28)" stroke="#818cf8" strokeWidth="1.5" />
          <circle cx="185" cy="88" r="2" fill="#fbbf24" />

          <text x="132" y="156" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
            {diagram.caption}
          </text>
        </svg>
      </div>
    );
  }

  // 3. Σφαίρα (Ο, ρ), Μέγιστος Κύκλος & Σφαιρικό Τρίγωνο (με ακριβή καμπύλα τόξα)
  if (diagram.type === 'sphere') {
    return (
      <div className="bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-center border border-slate-800">
        <svg viewBox="0 0 265 165" className="w-full max-w-[265px] h-38 select-none">
          {/* Σφαίρα */}
          <circle cx="132" cy="76" r="50" fill="rgba(99, 102, 241, 0.20)" stroke="#818cf8" strokeWidth="1.8" />

          {/* Μέγιστος κύκλος (Ισημερινός) */}
          <ellipse cx="132" cy="76" rx="50" ry="15" fill="rgba(16, 185, 129, 0.14)" stroke="#34d399" strokeWidth="1.7" />

          {/* Σφαιρικό τρίγωνο με καμπύλα τόξα μεγίστων κύκλων (μόνο όταν ζητείται) */}
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
              {/* Ακτίνα ρ και διάμετρος του μεγίστου κύκλου */}
              <line x1="82" y1="76" x2="182" y2="76" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="3 3" />
              <line x1="132" y1="76" x2="182" y2="76" stroke="#34d399" strokeWidth="2.2" />
              <text x="157" y="71" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">ρ</text>
            </>
          )}

          {/* Κέντρο Ο */}
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

export default function KilindrosKonosSfairaExercises() {
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
    pageTitle: isEl ? "Ασκήσεις: Κύλινδρος, Κώνος, Σφαίρα & Σφαιρικό Τρίγωνο | Α' Γυμνασίου" : "Exercises: Cylinder, Cone, Sphere & Spherical Triangle | Grade 7",
    pageDesc: isEl
      ? "Διαδραστικές ασκήσεις Α' Γυμνασίου στον κύλινδρο, τον κώνο, τη σφαίρα, τον μέγιστο κύκλο, το σφαιρικό τρίγωνο και τα αναπτύγματα κυλίνδρου και κώνου."
      : "Interactive Grade 7 geometry exercises on the cylinder, cone, sphere, great circle, spherical triangle, and cylinder and cone nets.",
    backNav: isEl ? "Θεωρία Κεφ. 15" : "Theory Ch. 15",
    theoryBtn: isEl ? "ΘΕΩΡΙΑ" : "THEORY",
    heroBadge: isEl ? "ΑΣΚΗΣΕΙΣ • ΚΕΦΑΛΑΙΟ 15 • Α' ΓΥΜΝΑΣΙΟΥ" : "EXERCISES • CHAPTER 15 • GRADE 7",
    heroTitle: isEl ? "Κύλινδρος, Κώνος & Σφαίρα: Εξάσκηση" : "Cylinder, Cone & Sphere: Practice",
    heroDesc: isEl
      ? "12 δυναμικές ερωτήσεις και προβλήματα στα στοιχεία κυλίνδρου και κώνου (ρ, υ, γενέτειρα), στα αναπτύγματα, στον μέγιστο κύκλο και στο σφαιρικό τρίγωνο."
      : "12 dynamic questions and problems on cylinder and cone elements (ρ, h, generator), solid nets, great circles, and spherical triangles.",
    btnNewSet: isEl ? "ΝΕΕΣ ΑΣΚΗΣΕΙΣ" : "NEW EXERCISES",
    btnTryNewSet: isEl ? "ΔΟΚΙΜΑΣΤΕ ΝΕΟ ΣΕΤ" : "TRY NEW SET",
    scoreLabel: isEl ? "Αποτέλεσμα" : "Score",
    scoreGreat: isEl
      ? "Εξαιρετική επίδοση! Κατέχετε πλήρως τα στοιχεία του κυλίνδρου, του κώνου, της σφαίρας, τον μέγιστο κύκλο, το σφαιρικό τρίγωνο και τα αναπτύγματα."
      : "Outstanding performance! You have mastered the elements of the cylinder, cone, sphere, great circle, spherical triangle, and nets.",
    scoreGood: isEl
      ? "Πολύ καλή προσπάθεια! Ελέγξτε τους πίνακες ανάλυσης και τα σχήματα παρακάτω στα σημεία που δυσκολευτήκατε."
      : "Very good effort! Review the step-by-step tables and diagrams below for any questions you missed.",
    scoreNeedWork: isEl
      ? "Χρειάζεται λίγη επανάληψη ακόμα στα αναπτύγματα κυλίνδρου/κώνου και στις ιδιότητες της σφαίρας!"
      : "Needs a bit more review on cylinder/cone nets and sphere properties!",
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

    // Q1: True / False - Στοιχεία Ορθού Κυλίνδρου
    const q1Pool = isEl
      ? [
          {
            p: "Ο ορθός κύλινδρος έχει δύο ίσες και παράλληλες κυκλικές βάσεις και το ύψος του ισούται με το μήκος κάθε γενέτειράς του.",
            t: true,
            e: "Στον ορθό κύλινδρο οι γενέτειρες είναι κάθετες στις βάσεις και παράλληλες στον άξονα ΟΟ', οπότε το μήκος τους ισούται με το ύψος υ."
          },
          {
            p: "Ο κύλινδρος δημιουργείται όταν περιστραφεί ένα ορθογώνιο τρίγωνο γύρω από την υποτείνουσά του κατά 360°.",
            t: false,
            e: "Ο ορθός κύλινδρος δημιουργείται από την περιστροφή ενός ορθογωνίου παραλληλογράμμου γύρω από μία πλευρά του κατά 360°."
          },
          {
            p: "Το ανάπτυγμα της παράπλευρης επιφάνειας ενός ορθού κυλίνδρου είναι ορθογώνιο με διαστάσεις 2πρ και υ.",
            t: true,
            e: "Όταν ξετυλίξουμε την παράπλευρη επιφάνεια του κυλίνδρου, παίρνουμε ορθογώνιο με μήκος ίσο με την περιφέρεια της βάσης (2πρ) και πλάτος ίσο με το ύψος υ."
          }
        ]
      : [
          {
            p: "A right circular cylinder has two congruent parallel circular bases and its height equals the length of each generator.",
            t: true,
            e: "In a right cylinder, generators are perpendicular to the bases and parallel to axis OO', so their length equals height h."
          },
          {
            p: "A cylinder is generated by rotating a right triangle 360° around its hypotenuse.",
            t: false,
            e: "A right cylinder is generated by rotating a rectangle 360° around one of its sides."
          },
          {
            p: "The lateral surface net of a right cylinder is a rectangle of dimensions 2πρ and h.",
            t: true,
            e: "Unrolling the lateral surface of a right cylinder yields a rectangle of length equal to base circumference (2πρ) and width equal to height h."
          }
        ];

    const pickedQ1 = pickRandom(q1Pool);
    qList.push({
      id: 1,
      title: isEl ? 'Στοιχεία Ορθού Κυλίνδρου' : 'Elements of a Right Cylinder',
      prompt: pickedQ1.p,
      type: 'tf',
      correct: pickedQ1.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'cylinder',
        caption: isEl ? 'Ορθός κύλινδρος: 2 βάσεις (Ο, ρ) & ορθογώνιο 2πρ × υ' : 'Right cylinder: 2 bases (O, ρ) & rectangle 2πρ × h'
      },
      explanation: pickedQ1.e
    });

    // Q2: MCQ - Στοιχεία Ορθού Κώνου & Ανάπτυγμα
    const q2Pool = isEl
      ? [
          {
            q: "Τι σχήμα είναι το ανάπτυγμα της παράπλευρης επιφάνειας ενός ορθού κώνου με γενέτειρα λ και ακτίνα βάσης ρ;",
            c: "Κυκλικός τομέας ακτίνας λ και μήκους τόξου 2πρ",
            e: "Το ανάπτυγμα της παράπλευρης επιφάνειας του κώνου είναι κυκλικός τομέας που έχει ακτίνα τη γενέτειρα λ και τόξο ίσο με την περιφέρεια της βάσης (2πρ)."
          },
          {
            q: "Ποια σχέση ισχύει ΠΑΝΤΑ ανάμεσα στη γενέτειρα (λ) και το ύψος (υ) ενός ορθού κώνου;",
            c: "Η γενέτειρα είναι πάντα μεγαλύτερη από το ύψος (λ > υ)",
            e: "Στο ορθογώνιο τρίγωνο ΚΟΑ (κορυφή Κ, κέντρο βάσης Ο, σημείο περιφέρειας Α), η γενέτειρα λ είναι η υποτείνουσα και το ύψος υ είναι κάθετη πλευρά, άρα λ > υ."
          },
          {
            q: "Από ποιο επίπεδο σχήμα και με ποια περιστροφή 360° δημιουργείται ένας ορθός κώνος;",
            c: "Από ορθογώνιο τρίγωνο γύρω από μία κάθετη πλευρά του",
            e: "Περιστρέφοντας ένα ορθογώνιο τρίγωνο γύρω από μία από τις δύο κάθετες πλευρές του (που γίνεται το ύψος υ) κατά 360° προκύπτει ορθός κώνος."
          }
        ]
      : [
          {
            q: "What shape is the lateral surface net of a right cone with slant height l and base radius ρ?",
            c: "A circular sector of radius l and arc length 2πρ",
            e: "Unrolling the lateral surface of a cone gives a circular sector of radius equal to slant height l and arc length equal to base circumference (2πρ)."
          },
          {
            q: "Which relation ALWAYS holds between the slant height (l) and height (h) of a right cone?",
            c: "Slant height is always greater than height (l > h)",
            e: "In right triangle KOA (apex K, base center O, boundary point A), slant height l is the hypotenuse and height h is a leg, so l > h."
          },
          {
            q: "From which plane figure and 360° rotation is a right cone generated?",
            c: "A right triangle rotated around one of its legs",
            e: "Rotating a right triangle 360° around one of its legs (which becomes the height h) generates a right circular cone."
          }
        ];

    const pickedQ2 = pickRandom(q2Pool);
    const dist2 = isEl
      ? [
          "Κυκλικός τομέας ακτίνας λ και μήκους τόξου 2πρ",
          "Η γενέτειρα είναι πάντα μεγαλύτερη από το ύψος (λ > υ)",
          "Από ορθογώνιο τρίγωνο γύρω από μία κάθετη πλευρά του",
          "Ορθογώνιο παραλληλόγραμμο διαστάσεων 2πρ × λ",
          "Η γενέτειρα είναι ίση με το ύψος (λ ＝ υ)"
        ]
      : [
          "A circular sector of radius l and arc length 2πρ",
          "Slant height is always greater than height (l > h)",
          "A right triangle rotated around one of its legs",
          "A rectangle of dimensions 2πρ × l",
          "Slant height equals height (l ＝ h)"
        ];

    qList.push({
      id: 2,
      title: isEl ? 'Στοιχεία & Ανάπτυγμα Κώνου' : 'Elements & Net of a Cone',
      prompt: pickedQ2.q,
      type: 'mcq',
      correct: pickedQ2.c,
      options: ensureFourUniqueOptions(pickedQ2.c, () => pickRandom(dist2)),
      diagram: {
        type: 'cone',
        caption: isEl ? 'Ορθός κώνος & κυκλικός τομέας ακτίνας λ' : 'Right cone & circular sector of radius l'
      },
      explanation: pickedQ2.e
    });

    // Q3: True / False - Σφαίρα, Μέγιστος Κύκλος & Σφαιρικό Τρίγωνο
    const q3Pool = isEl
      ? [
          {
            p: "Κάθε επίπεδο που τέμνει μια σφαίρα (Ο, ρ) και περνά από το κέντρο της Ο δημιουργεί έναν μέγιστο κύκλο ακτίνας ρ.",
            t: true,
            e: "Οι τομές της σφαίρας (Ο, ρ) με επίπεδα που διέρχονται από το κέντρο Ο έχουν ακτίνα ρ και ονομάζονται μέγιστοι κύκλοι."
          },
          {
            p: "Το άθροισμα των γωνιών ενός σφαιρικού τριγώνου είναι πάντα ίσο με 180°, όπως και στα επίπεδα τρίγωνα.",
            t: false,
            e: "Σε κάθε σφαιρικό τρίγωνο το άθροισμα των γωνιών είναι αυστηρά ΜΕΓΑΛΥΤΕΡΟ από 180° (μεταξύ 180° και 540°)."
          },
          {
            p: "Η σφαίρα δεν διαθέτει επίπεδο ανάπτυγμα, δηλαδή δεν μπορεί να απλωθεί στο επίπεδο χωρίς παραμόρφωση.",
            t: true,
            e: "Σε αντίθεση με τον κύλινδρο και τον κώνο, η σφαιρική επιφάνεια είναι διπλά καμπύλη και δεν έχει επίπεδο ανάπτυγμα."
          }
        ]
      : [
          {
            p: "Every plane intersecting a sphere (O, ρ) and passing through its center O creates a great circle of radius ρ.",
            t: true,
            e: "Intersections of sphere (O, ρ) with planes passing through center O have radius ρ and are called great circles."
          },
          {
            p: "The sum of the angles of a spherical triangle is always equal to 180°, just like planar triangles.",
            t: false,
            e: "The angle sum of any spherical triangle is strictly GREATER than 180° (between 180° and 540°)."
          },
          {
            p: "A sphere has no flat 2D net — it cannot be flattened onto a plane without distortion.",
            t: true,
            e: "Unlike cylinders and cones, a spherical surface is doubly curved and has no flat net."
          }
        ];

    const pickedQ3 = pickRandom(q3Pool);
    qList.push({
      id: 3,
      title: isEl ? 'Σφαίρα, Μέγιστος Κύκλος & Σφαιρικό Τρίγωνο' : 'Sphere, Great Circle & Spherical Triangle',
      prompt: pickedQ3.p,
      type: 'tf',
      correct: pickedQ3.t ? (isEl ? 'Σωστό' : 'True') : (isEl ? 'Λάθος' : 'False'),
      options: isEl ? ['Σωστό', 'Λάθος'] : ['True', 'False'],
      diagram: {
        type: 'sphere',
        showTriangle: true,
        caption: isEl ? 'Μέγιστος κύκλος & σφαιρικό τρίγωνο (>180°)' : 'Great circle & spherical triangle (>180°)'
      },
      explanation: pickedQ3.e
    });

    // Q4: Input - Μήκος ορθογωνίου στο ανάπτυγμα κυλίνδρου (2 * 3,14 * ρ)
    const r4 = pickRandom([2, 3, 4, 5, 10]);
    const len4 = Number((2 * 3.14 * r4).toFixed(2));

    qList.push({
      id: 4,
      title: isEl ? 'Μήκος Ορθογωνίου στο Ανάπτυγμα Κυλίνδρου' : 'Rectangle Length in Cylinder Net',
      prompt: isEl
        ? `Ένας ορθός κύλινδρος έχει ακτίνα βάσης ρ ＝ ${r4} cm. Αν θεωρήσουμε π ≈ 3,14, πόσα cm είναι το μήκος του ορθογωνίου που σχηματίζει η παράπλευρη επιφάνεια στο ανάπτυγμά του;`
        : `A right cylinder has base radius ρ ＝ ${r4} cm. Using π ≈ 3.14, what is the length (in cm) of the rectangle formed by its lateral surface in its net?`,
      type: 'input',
      correct: len4,
      unit: 'cm',
      diagram: {
        type: 'cylinder',
        caption: isEl ? `Μήκος ＝ 2πρ ＝ 2·3,14·${r4} ＝ ${len4.toLocaleString(locCode)} cm` : `Length ＝ 2πρ ＝ 2·3.14·${r4} ＝ ${len4.toLocaleString(locCode)} cm`
      },
      explanation: isEl
        ? `Το μήκος του ορθογωνίου ισούται με την περιφέρεια της κυκλικής βάσης: 2 · π · ρ ＝ 2 · 3,14 · ${r4} ＝ ${len4.toLocaleString(locCode)} cm.`
        : `The rectangle's length equals the base circumference: 2 · π · ρ ＝ 2 · 3.14 · ${r4} ＝ ${len4.toLocaleString(locCode)} cm.`
    });

    // Q5: Input - Μήκος τόξου κυκλικού τομέα στο ανάπτυγμα κώνου (2 * 3,14 * ρ)
    const r5 = pickRandom([3, 4, 5, 6, 8]);
    const arc5 = Number((2 * 3.14 * r5).toFixed(2));

    qList.push({
      id: 5,
      title: isEl ? 'Μήκος Τόξου στο Ανάπτυγμα Κώνου' : 'Arc Length in Cone Net',
      prompt: isEl
        ? `Ένας ορθός κώνος έχει βάση κύκλο ακτίνας ρ ＝ ${r5} cm. Με π ≈ 3,14, πόσα cm είναι το μήκος του τόξου του κυκλικού τομέα στο ανάπτυγμα του κώνου;`
        : `A right cone has a circular base of radius ρ ＝ ${r5} cm. Using π ≈ 3.14, what is the arc length (in cm) of the circular sector in the cone's net?`,
      type: 'input',
      correct: arc5,
      unit: 'cm',
      diagram: {
        type: 'cone',
        caption: isEl ? `Μήκος τόξου ＝ 2πρ ＝ ${arc5.toLocaleString(locCode)} cm` : `Arc length ＝ 2πρ ＝ ${arc5.toLocaleString(locCode)} cm`
      },
      explanation: isEl
        ? `Το τόξο του κυκλικού τομέα τυλίγεται γύρω από τη βάση, άρα έχει μήκος ίσο με την περιφέρεια του κύκλου: 2 · 3,14 · ${r5} ＝ ${arc5.toLocaleString(locCode)} cm.`
        : `The sector's arc wraps around the base circle, so its length equals the base circumference: 2 · 3.14 · ${r5} ＝ ${arc5.toLocaleString(locCode)} cm.`
    });

    // Q6: MCQ - Άθροισμα γωνιών σφαιρικού τριγώνου
    const triPools6 = isEl
      ? [
          {
            c: '90°, 90° και 90° (άθροισμα 270° > 180°)',
            e: 'Στο σφαιρικό τρίγωνο το άθροισμα των γωνιών είναι μεγαλύτερο από 180° (180° < Α ＋ Β ＋ Γ < 540°). Ένα σφαιρικό τρίγωνο που ορίζεται από τον ισημερινό και δύο κάθετους μεσημβρινούς έχει τρεις ορθές γωνίες (270°)!'
          },
          {
            c: '100°, 85° και 70° (άθροισμα 255° > 180°)',
            e: 'Το άθροισμα 100° ＋ 85° ＋ 70° ＝ 255° είναι μεταξύ 180° και 540°, οπότε αντιστοιχεί σε σφαιρικό τρίγωνο.'
          }
        ]
      : [
          {
            c: '90°, 90° and 90° (sum 270° > 180°)',
            e: 'In a spherical triangle the angle sum exceeds 180° (180° < A ＋ B ＋ C < 540°). One eighth of a sphere has three 90° angles (270°)!'
          },
          {
            c: '100°, 85° and 70° (sum 255° > 180°)',
            e: 'The sum 100° ＋ 85° ＋ 70° ＝ 255° lies between 180° and 540°, which characterizes a spherical triangle.'
          }
        ];

    const pickedTri6 = pickRandom(triPools6);
    const dist6 = isEl
      ? [
          '90°, 90° και 90° (άθροισμα 270° > 180°)',
          '100°, 85° και 70° (άθροισμα 255° > 180°)',
          '60°, 60° και 60° (άθροισμα 180°)',
          '50°, 60° και 40° (άθροισμα 150° < 180°)',
          '90°, 45° και 45° (άθροισμα 180°)'
        ]
      : [
          '90°, 90° and 90° (sum 270° > 180°)',
          '100°, 85° and 70° (sum 255° > 180°)',
          '60°, 60° and 60° (sum 180°)',
          '50°, 60° and 40° (sum 150° < 180°)',
          '90°, 45° and 45° (sum 180°)'
        ];

    qList.push({
      id: 6,
      title: isEl ? 'Γωνίες Σφαιρικού Τριγώνου' : 'Angles of a Spherical Triangle',
      prompt: isEl
        ? 'Ποια από τις παρακάτω τριάδες γωνιών μπορεί να ανήκει σε ένα σφαιρικό τρίγωνο πάνω σε μια σφαίρα;'
        : 'Which of the following angle triples can belong to a spherical triangle on a sphere?',
      type: 'mcq',
      correct: pickedTri6.c,
      options: ensureFourUniqueOptions(pickedTri6.c, () => pickRandom(dist6)),
      diagram: {
        type: 'sphere',
        showTriangle: true,
        caption: isEl ? '180° < Α ＋ Β ＋ Γ < 540°' : '180° < A ＋ B ＋ C < 540°'
      },
      explanation: pickedTri6.e
    });

    // Q7: Input - Υπολογισμός 3ης γωνίας σφαιρικού τριγώνου όταν δίνεται το άθροισμα
    const sum7 = pickRandom([210, 220, 230, 240, 250]);
    const a7 = randInt(70, 95);
    const b7 = randInt(65, 85);
    const c7 = sum7 - a7 - b7;

    qList.push({
      id: 7,
      title: isEl ? 'Υπολογισμός Γωνίας Σφαιρικού Τριγώνου' : 'Finding a Spherical Triangle Angle',
      prompt: isEl
        ? `Ένα σφαιρικό τρίγωνο ΑΒΓ έχει άθροισμα γωνιών ίσο με ${sum7}°. Αν οι δύο γωνίες του είναι Α ＝ ${a7}° και Β ＝ ${b7}°, πόσες μοίρες είναι η τρίτη γωνία Γ;`
        : `A spherical triangle ABC has an angle sum of ${sum7}°. If two of its angles are A ＝ ${a7}° and B ＝ ${b7}°, what is the measure of the third angle C in degrees?`,
      type: 'input',
      correct: c7,
      unit: '°',
      explanation: isEl
        ? `Αφαιρούμε από το συνολικό άθροισμα ${sum7}° τις δύο γνωστές γωνίες: Γ ＝ ${sum7}° － (${a7}° ＋ ${b7}°) ＝ ${sum7}° － ${a7 + b7}° ＝ ${c7}°.`
        : `Subtract the two known angles from the total sum ${sum7}°: C ＝ ${sum7}° － (${a7}° ＋ ${b7}°) ＝ ${sum7}° － ${a7 + b7}° ＝ ${c7}°.`
    });

    // Q8: MCQ - Μέγιστος Κύκλος και ακτίνα σφαίρας
    const r8 = randInt(4, 14);
    const askDiam8 = Math.random() < 0.5;
    const ans8 = askDiam8 ? `${2 * r8} cm` : `${r8} cm`;
    const dist8 = [
      `${r8} cm`,
      `${2 * r8} cm`,
      `${Number((r8 / 2).toFixed(1)).toLocaleString(locCode)} cm`,
      `${3 * r8} cm`,
      `${r8 + 2} cm`
    ];

    qList.push({
      id: 8,
      title: isEl ? 'Μέγιστος Κύκλος Σφαίρας' : 'Great Circle of a Sphere',
      prompt: isEl
        ? `Μια σφαίρα έχει ακτίνα ρ ＝ ${r8} cm. Αν την τέμουμε με ένα επίπεδο που περνά από το κέντρο της Ο, πόση θα είναι η ${askDiam8 ? 'διάμετρος' : 'ακτίνα'} του μεγίστου κύκλου που σχηματίζεται;`
        : `A sphere has radius ρ ＝ ${r8} cm. If we slice it with a plane passing through its center O, what is the ${askDiam8 ? 'diameter' : 'radius'} of the resulting great circle?`,
      type: 'mcq',
      correct: ans8,
      options: ensureFourUniqueOptions(ans8, () => pickRandom(dist8)),
      diagram: {
        type: 'sphere',
        showTriangle: false,
        caption: isEl ? `Μέγιστος κύκλος: ακτίνα ρ ＝ ${r8} cm` : `Great circle: radius ρ ＝ ${r8} cm`
      },
      explanation: isEl
        ? `Ο μέγιστος κύκλος έχει το ίδιο κέντρο Ο και την ίδια ακτίνα ρ ＝ ${r8} cm με τη σφαίρα (άρα διάμετρο 2ρ ＝ ${2 * r8} cm).`
        : `A great circle shares the same center O and radius ρ ＝ ${r8} cm as the sphere (so diameter 2ρ ＝ ${2 * r8} cm).`
    });

    // Q9: Input + tableData + SVG - Παράπλευρο εμβαδόν ορθού κυλίνδρου
    const r9 = pickRandom([2, 3, 4, 5]);
    const h9 = randInt(4, 9);
    const circum9 = Number((2 * 3.14 * r9).toFixed(2));
    const latArea9 = Number((circum9 * h9).toFixed(2));

    qList.push({
      id: 9,
      title: isEl ? 'Παράπλευρο Εμβαδόν Ορθού Κυλίνδρου' : 'Lateral Surface Area of a Right Cylinder',
      prompt: isEl
        ? `Ένας ορθός κύλινδρος έχει ακτίνα βάσης ρ ＝ ${r9} cm και ύψος υ ＝ ${h9} cm. Με π ≈ 3,14, πόσα cm² είναι το εμβαδόν της παράπλευρης επιφάνειάς του;`
        : `A right cylinder has base radius ρ ＝ ${r9} cm and height h ＝ ${h9} cm. Using π ≈ 3.14, what is its lateral surface area in cm²?`,
      type: 'input',
      correct: latArea9,
      unit: 'cm²',
      diagram: {
        type: 'cylinder',
        caption: isEl ? `Ε ＝ (2πρ) · υ ＝ ${latArea9.toLocaleString(locCode)} cm²` : `A ＝ (2πρ) · h ＝ ${latArea9.toLocaleString(locCode)} cm²`
      },
      tableData: [
        {
          label: isEl ? '1. Μήκος ορθογωνίου (2πρ)' : '1. Rectangle length (2πρ)',
          details: `2 · 3,14 · ${r9} ＝ ${circum9.toLocaleString(locCode)} cm`
        },
        {
          label: isEl ? '2. Εμβαδόν (μήκος · ύψος)' : '2. Area (length · height)',
          details: `${circum9.toLocaleString(locCode)} · ${h9} ＝ ${latArea9.toLocaleString(locCode)} cm²`
        }
      ],
      explanation: isEl
        ? `Η περιφέρεια της βάσης είναι 2 · 3,14 · ${r9} ＝ ${circum9.toLocaleString(locCode)} cm. Πολλαπλασιάζοντας με το ύψος υ ＝ ${h9} cm βρίσκουμε ${latArea9.toLocaleString(locCode)} cm².`
        : `Base circumference is 2 · 3.14 · ${r9} ＝ ${circum9.toLocaleString(locCode)} cm. Multiplying by height h ＝ ${h9} cm gives ${latArea9.toLocaleString(locCode)} cm².`
    });

    // Q10: Input + tableData + SVG - Εύρεση ακτίνας βάσης ρ από το μήκος του ορθογωνίου στο ανάπτυγμα κυλίνδρου
    const r10 = randInt(3, 9);
    const rectLen10 = Number((2 * 3.14 * r10).toFixed(2));

    qList.push({
      id: 10,
      title: isEl ? 'Εύρεση Ακτίνας Βάσης ρ από Ανάπτυγμα' : 'Finding Base Radius ρ from Net',
      prompt: isEl
        ? `Στο ανάπτυγμα ενός ορθού κυλίνδρου, το ορθογώνιο της παράπλευρης επιφάνειας έχει μήκος ${rectLen10.toLocaleString(locCode)} cm. Αν θεωρήσουμε π ≈ 3,14, πόσα cm είναι η ακτίνα ρ της βάσης του κυλίνδρου;`
        : `In the net of a right cylinder, the lateral rectangle has length ${rectLen10.toLocaleString(locCode)} cm. Using π ≈ 3.14, what is the base radius ρ of the cylinder in cm?`,
      type: 'input',
      correct: r10,
      unit: 'cm',
      diagram: {
        type: 'cylinder',
        caption: isEl ? `2πρ ＝ ${rectLen10.toLocaleString(locCode)} ⇒ ρ ＝ ${r10} cm` : `2πρ ＝ ${rectLen10.toLocaleString(locCode)} ⇒ ρ ＝ ${r10} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Εξίσωση περιφέρειας' : '1. Circumference equation',
          details: `2 · 3,14 · ρ ＝ ${rectLen10.toLocaleString(locCode)} ⇒ 6,28 · ρ ＝ ${rectLen10.toLocaleString(locCode)}`
        },
        {
          label: isEl ? '2. Υπολογισμός ακτίνας ρ' : '2. Solving for radius ρ',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>ρ ＝</span>
              <Frac num={rectLen10.toLocaleString(locCode)} den="6,28" />
              <span>＝ {r10} cm</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Επειδή 2πρ ＝ 6,28 · ρ ＝ ${rectLen10.toLocaleString(locCode)}, διαιρούμε με 6,28 και βρίσκουμε ρ ＝ ${r10} cm.`
        : `Since 2πρ ＝ 6.28 · ρ ＝ ${rectLen10.toLocaleString(locCode)}, dividing by 6.28 gives ρ ＝ ${r10} cm.`
    });

    // Q11: MCQ + tableData + SVG - Σύγκριση ακτίνας ρ, ύψους υ και γενέτειρας λ στον ορθό κώνο
    const triple11 = pickRandom([
      { r: 3, h: 4, l: 5 },
      { r: 6, h: 8, l: 10 },
      { r: 5, h: 12, l: 13 }
    ]);
    const corr11 = isEl
      ? `Ύψος υ ＝ ${triple11.h} cm και γενέτειρα λ ＝ ${triple11.l} cm (πάντα λ > υ)`
      : `Height h ＝ ${triple11.h} cm and slant height l ＝ ${triple11.l} cm (always l > h)`;
    const dist11 = isEl
      ? [
          `Ύψος υ ＝ ${triple11.h} cm και γενέτειρα λ ＝ ${triple11.l} cm (πάντα λ > υ)`,
          `Ύψος υ ＝ ${triple11.l} cm και γενέτειρα λ ＝ ${triple11.h} cm`,
          `Ύψος υ ＝ ${triple11.h} cm και γενέτειρα λ ＝ ${triple11.h} cm`,
          `Ύψος υ ＝ ${triple11.r} cm και γενέτειρα λ ＝ ${triple11.l} cm`
        ]
      : [
          `Height h ＝ ${triple11.h} cm and slant height l ＝ ${triple11.l} cm (always l > h)`,
          `Height h ＝ ${triple11.l} cm and slant height l ＝ ${triple11.h} cm`,
          `Height h ＝ ${triple11.h} cm and slant height l ＝ ${triple11.h} cm`,
          `Height h ＝ ${triple11.r} cm and slant height l ＝ ${triple11.l} cm`
        ];

    qList.push({
      id: 11,
      title: isEl ? 'Διάκριση Ύψους (υ) και Γενέτειρας (λ) Κώνου' : 'Distinguishing Cone Height (h) & Slant Height (l)',
      prompt: isEl
        ? `Ένας ορθός κώνος έχει ακτίνα βάσης ρ ＝ ${triple11.r} cm, ενώ τα άλλα δύο ευθύγραμμα τμήματά του (ύψος και γενέτειρα) έχουν μήκη ${triple11.h} cm και ${triple11.l} cm. Ποιο είναι το ύψος υ και ποια η γενέτειρα λ;`
        : `A right cone has base radius ρ ＝ ${triple11.r} cm, and its other two segments (height and slant height) have lengths ${triple11.h} cm and ${triple11.l} cm. Which is the height h and which is the slant height l?`,
      type: 'mcq',
      correct: corr11,
      options: ensureFourUniqueOptions(corr11, () => pickRandom(dist11)),
      diagram: {
        type: 'cone',
        caption: isEl ? `ρ ＝ ${triple11.r}, υ ＝ ${triple11.h} < λ ＝ ${triple11.l} cm` : `ρ ＝ ${triple11.r}, h ＝ ${triple11.h} < l ＝ ${triple11.l} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Γεωμετρική ιδιότητα' : '1. Geometric property',
          details: isEl
            ? 'Η γενέτειρα λ είναι υποτείνουσα και το ύψος υ κάθετη πλευρά'
            : 'Slant height l is the hypotenuse and height h is a leg'
        },
        {
          label: isEl ? '2. Σύγκριση τιμών' : '2. Comparing values',
          details: isEl
            ? `${triple11.l} cm > ${triple11.h} cm ⇒ λ ＝ ${triple11.l} cm, υ ＝ ${triple11.h} cm`
            : `${triple11.l} cm > ${triple11.h} cm ⇒ l ＝ ${triple11.l} cm, h ＝ ${triple11.h} cm`
        }
      ],
      explanation: isEl
        ? `Στον ορθό κώνο η γενέτειρα λ είναι πάντα μεγαλύτερη από το ύψος υ (υποτείνουσα > κάθετη πλευρά), άρα λ ＝ ${triple11.l} cm και υ ＝ ${triple11.h} cm.`
        : `In a right cone, slant height l is always greater than height h (hypotenuse > leg), so l ＝ ${triple11.l} cm and h ＝ ${triple11.h} cm.`
    });

    // Q12: Input + tableData + SVG - Συνδυαστικό πρόβλημα: Εύρεση διαμέτρου βάσης κώνου από τόξο τομέα
    const r12 = randInt(4, 10);
    const arc12 = Number((2 * 3.14 * r12).toFixed(2));
    const diam12 = 2 * r12;

    qList.push({
      id: 12,
      title: isEl ? 'Διάμετρος Βάσης Κώνου από Ανάπτυγμα' : 'Cone Base Diameter from Net',
      prompt: isEl
        ? `Στο ανάπτυγμα ενός ορθού κώνου, το τόξο του κυκλικού τομέα έχει μήκος ${arc12.toLocaleString(locCode)} cm. Αν θεωρήσουμε π ≈ 3,14, πόσα cm είναι η διάμετρος (δ ＝ 2ρ) της κυκλικής βάσης του κώνου;`
        : `In the net of a right cone, the arc of the circular sector has length ${arc12.toLocaleString(locCode)} cm. Using π ≈ 3.14, what is the diameter (d ＝ 2ρ) of the cone's circular base in cm?`,
      type: 'input',
      correct: diam12,
      unit: 'cm',
      diagram: {
        type: 'cone',
        caption: isEl ? `Περιφέρεια ＝ π · δ ＝ ${arc12.toLocaleString(locCode)} cm` : `Circumference ＝ π · d ＝ ${arc12.toLocaleString(locCode)} cm`
      },
      tableData: [
        {
          label: isEl ? '1. Περιφέρεια βάσης (π · δ)' : '1. Base circumference (π · d)',
          details: `3,14 · δ ＝ ${arc12.toLocaleString(locCode)} cm`
        },
        {
          label: isEl ? '2. Υπολογισμός διαμέτρου δ' : '2. Solving for diameter d',
          details: (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
              <span>δ ＝</span>
              <Frac num={arc12.toLocaleString(locCode)} den="3,14" />
              <span>＝ {diam12} cm</span>
            </div>
          )
        }
      ],
      explanation: isEl
        ? `Το μήκος του τόξου ισούται με την περιφέρεια της βάσης π · δ ＝ 3,14 · δ ＝ ${arc12.toLocaleString(locCode)} cm, οπότε η διάμετρος είναι δ ＝ ${diam12} cm (ακτίνα ρ ＝ ${r12} cm).`
        : `The arc length equals the base circumference π · d ＝ 3.14 · d ＝ ${arc12.toLocaleString(locCode)} cm, so diameter d ＝ ${diam12} cm (radius ρ ＝ ${r12} cm).`
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
      backUrl="/a-gymnasiou/53-kilindros-konos-sfaira"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/53-kilindros-konos-sfaira"
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
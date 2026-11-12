import React, { useState, useRef, useCallback } from 'react';
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
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
        {den}
      </span>
    </span>
  );
}

// 100% Αξιόπιστο Custom Interactive Slider
function CustomSlider({ label, min, max, step = 1, value, onChange, unit = "", color = "#4f46e5", locale = "el" }) {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const locCode = locale === 'en' ? 'en-US' : 'el-GR';

  const formatNum = (n) => {
    if (n < 0) return `－${Math.abs(n).toLocaleString(locCode)}`;
    return n.toLocaleString(locCode);
  };

  const updateFromPosition = useCallback((clientX) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const ratio = clickX / rect.width;
    const rawVal = min + ratio * (max - min);
    const steppedVal = Math.round(rawVal / step) * step;
    const clamped = Math.max(min, Math.min(max, Number(steppedVal.toFixed(2))));
    onChange(clamped);
  }, [min, max, step, onChange]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    updateFromPosition(e.clientX);

    const onMouseMove = (moveEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches[0]) updateFromPosition(e.touches[0].clientX);

    const onTouchMove = (moveEvent) => {
      if (moveEvent.touches[0]) updateFromPosition(moveEvent.touches[0].clientX);
    };

    const onTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="space-y-1.5 select-none">
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
        <span className="break-words">{label}</span>
        <span
          className="font-mono font-bold px-2 py-0.5 rounded border text-xs sm:text-sm bg-white shadow-xs shrink-0 ml-2"
          style={{ color }}
        >
          {formatNum(value)}{unit ? ` ${unit}` : ''}
        </span>
      </div>

      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative h-6 flex items-center cursor-pointer group"
      >
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden relative">
          <div
            className="h-full transition-all duration-75"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>

        <div
          className={`absolute w-5 h-5 bg-white border-2 rounded-full shadow-md transition-transform duration-75 -translate-x-1/2 flex items-center justify-center ${
            isDragging ? 'scale-125 ring-2 ring-indigo-300' : 'group-hover:scale-110'
          }`}
          style={{
            left: `${percentage}%`,
            borderColor: color
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
        <span>{formatNum(min)}</span>
        <span>{formatNum(Math.round((min + max) / 2))}</span>
        <span>{formatNum(max)}</span>
      </div>
    </div>
  );
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Τα Τρίγωνα: Στοιχεία και Κατηγορίες | Θεωρία Α' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία για τα τρίγωνα της Α' Γυμνασίου: πρωτεύοντα στοιχεία (κορυφές, πλευρές, γωνίες), κατηγορίες τριγώνων ως προς τις πλευρές και ως προς τις γωνίες, διαδραστικό εργαστήριο.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 05 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Τα Τρίγωνα: Στοιχεία και Κατηγορίες",
    heroDesc: "Γνωρίστε το πιο θεμελιώδες γεωμετρικό σχήμα! Ανακαλύψτε τα έξι πρωτεύοντα στοιχεία ενός τριγώνου, μάθετε να ταξινομείτε τα τρίγωνα ως προς τα μήκη των πλευρών και το είδος των γωνιών τους, και πειραματιστείτε ζωντανά.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1
    card1Badge: "1",
    card1Title: "Ορισμός & Πρωτεύοντα Στοιχεία",
    card1Desc: "Αν πάρουμε τρία σημεία Α, Β, Γ που δεν βρίσκονται στην ίδια ευθεία (μη συνευθειακά) και τα ενώσουμε ανά δύο με ευθύγραμμα τμήματα, σχηματίζεται το τρίγωνο ΑΒΓ.",
    card1ElementsTitle: "Τα 6 Πρωτεύοντα Στοιχεία του Τριγώνου:",
    card1Vertices: "3 Κορυφές: Τα σημεία Α, Β και Γ.",
    card1Sides: "3 Πλευρές: Τα ευθύγραμμα τμήματα ΒΓ (ή α), ΑΓ (ή β) και ΑΒ (ή γ).",
    card1Angles: "3 Γωνίες: Οι εσωτερικές γωνίες Α̂ (ΒΑ̂Γ), Β̂ (ΑΒ̂Γ) και Γ̂ (ΑΓ̂Β).",
    card1OppNoteTitle: "Απέναντι & Προσκείμενα Στοιχεία:",
    card1OppNoteDesc: "Η πλευρά ΒΓ βρίσκεται απέναντι από την κορυφή Α (γι' αυτό συμβολίζεται και με α), ενώ οι γωνίες Β̂ και Γ̂ λέγονται προσκείμενες στην πλευρά ΒΓ.",

    // Card 2
    card2Badge: "2",
    card2Title: "Κατηγορίες ως προς τις Πλευρές",
    card2Desc: "Ανάλογα με τη σύγκριση των μηκών των τριών πλευρών τους, τα τρίγωνα διακρίνονται σε τρεις κατηγορίες:",
    card2ScaleneTitle: "1. Σκαληνό Τρίγωνο:",
    card2ScaleneDesc: "Έχει και τις τρεις πλευρές του άνισες (α ≠ β ≠ γ). Επίσης, όλες οι γωνίες του είναι άνισες μεταξύ τους.",
    card2IsoTitle: "2. Ισοσκελές Τρίγωνο:",
    card2IsoDesc: "Έχει τουλάχιστον δύο ίσες πλευρές (π.χ. ΑΒ ＝ ΑΓ), οι οποίες ονομάζονται σκέλη. Η τρίτη πλευρά ΒΓ λέγεται βάση, η απέναντι γωνία Α̂ λέγεται γωνία κορυφής και οι γωνίες της βάσης είναι ίσες (Β̂ ＝ Γ̂).",
    card2EquiTitle: "3. Ισόπλευρο Τρίγωνο:",
    card2EquiDesc: "Έχει και τις τρεις πλευρές του ίσες (ΑΒ ＝ ΒΓ ＝ ΑΓ). Κάθε ισόπλευρο τρίγωνο είναι ταυτόχρονα και ισοσκελές, ενώ όλες οι γωνίες του είναι ίσες με 60°.",

    // Card 3
    card3Badge: "3",
    card3Title: "Κατηγορίες ως προς τις Γωνίες",
    card3Desc: "Ανάλογα με το είδος των γωνιών τους, τα τρίγωνα διακρίνονται επίσης σε τρεις κατηγορίες:",
    card3AcuteTitle: "1. Οξυγώνιο Τρίγωνο:",
    card3AcuteDesc: "Έχει και τις τρεις γωνίες του οξείες (κάθε γωνία είναι μικρότερη από 90°).",
    card3RightTitle: "2. Ορθογώνιο Τρίγωνο:",
    card3RightDesc: "Έχει μία ορθή γωνία (90°) και δύο οξείες. Η πλευρά απέναντι από την ορθή γωνία λέγεται υποτείνουσα (είναι πάντα η μεγαλύτερη πλευρά), ενώ οι δύο πλευρές που σχηματίζουν την ορθή γωνία λέγονται κάθετες πλευρές.",
    card3ObtuseTitle: "3. Αμβλυγώνιο Τρίγωνο:",
    card3ObtuseDesc: "Έχει μία αμβλεία γωνία (μεγαλύτερη από 90° και μικρότερη από 180°) και δύο οξείες γωνίες.",

    // Card 4
    card4Badge: "4",
    card4Title: "Διπλή Ταξινόμηση & Βασικές Ιδιότητες",
    card4Desc: "Κάθε τρίγωνο ανήκει ταυτόχρονα σε μία κατηγορία ως προς τις πλευρές και σε μία κατηγορία ως προς τις γωνίες:",
    card4RuleFormula: "Άθροισμα Γωνιών: Α̂ ＋ Β̂ ＋ Γ̂ ＝ 180°",
    card4Comb1Title: "Εφικτοί Συνδυασμοί:",
    card4Comb1Desc: "Ένα ισοσκελές ή ένα σκαληνό τρίγωνο μπορεί να είναι οξυγώνιο, ορθογώνιο ή αμβλυγώνιο (π.χ. ορθογώνιο ισοσκελές με γωνίες 90°, 45°, 45°).",
    card4Comb2Title: "Αδύνατοι Συνδυασμοί:",
    card4Comb2Desc: "Το ισόπλευρο τρίγωνο είναι ΠΑΝΤΑ οξυγώνιο (60°, 60°, 60°). Δεν υπάρχει ορθογώνιο ισόπλευρο ούτε αμβλυγώνιο ισόπλευρο τρίγωνο!",

    // Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΓΕΩΜΕΤΡΙΑΣ",
    labTitle: "Διαδραστικός Εξερευνητής Τριγώνου ΑΒΓ",
    labPresetsLabel: "ΕΤΟΙΜΑ ΠΡΟΤΥΠΑ:",
    presetScalene: "Σκαληνό Οξυγώνιο",
    presetIsosceles: "Ισοσκελές",
    presetEquilateral: "Ισόπλευρο",
    presetRight: "Ορθογώνιο (3-4-5)",
    presetObtuse: "Αμβλυγώνιο",
    labSidesHeader: "ΜΗΚΗ ΠΛΕΥΡΩΝ ΤΡΙΓΩΝΟΥ (cm)",
    labSideA: "Πλευρά α ＝ ΒΓ",
    labSideB: "Πλευρά β ＝ ΑΓ",
    labSideC: "Πλευρά γ ＝ ΑΒ",
    labInvalidTitle: "Δεν σχηματίζεται τρίγωνο!",
    labInvalidDesc: "Για να σχηματιστεί τρίγωνο, το άθροισμα οποιωνδήποτε δύο πλευρών πρέπει να είναι μεγαλύτερο από την τρίτη (τριγωνική ανισότητα).",
    labDiagSides: "ΚΑΤΗΓΟΡΙΑ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ",
    labDiagAngles: "ΚΑΤΗΓΟΡΙΑ ΩΣ ΠΡΟΣ ΤΙΣ ΓΩΝΙΕΣ",
    labDiagAnglesValues: "ΥΠΟΛΟΓΙΣΜΕΝΕΣ ΓΩΝΙΕΣ",
    labDiagPerimeter: "ΠΕΡΙΜΕΤΡΟΣ",
    typeScalene: "Σκαληνό",
    typeIsosceles: "Ισοσκελές",
    typeEquilateral: "Ισόπλευρο",
    typeAcute: "Οξυγώνιο",
    typeRight: "Ορθογώνιο",
    typeObtuse: "Αμβλυγώνιο",
    labRightHint: "Ορθή γωνία 90°! Η απέναντι πλευρά είναι η υποτείνουσα.",
    labIsoHint: "Δύο ίσες πλευρές (σκέλη) και ίσες προσκείμενες γωνίες στη βάση!",
    labEquiHint: "Και οι 3 πλευρές ίσες και όλες οι γωνίες 60°!",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΠΡΩΤΕΥΟΝΤΑ ΣΤΟΙΧΕΙΑ & ΤΑΞΙΝΟΜΗΣΗ",
    prob1Title: "Αναγνώριση στοιχείων και κατηγορίας τριγώνου",
    prob1DescPre: "Δίνεται τρίγωνο ΚΛΜ με πλευρές ΚΛ ＝ 6 cm, ΛΜ ＝ 8 cm, ΚΜ ＝ 10 cm και γωνίες Κ̂ ＝ 53°, Λ̂ ＝ 90°, Μ̂ ＝ 37°.",
    prob1DescPost: "Να προσδιοριστούν: α) η πλευρά που βρίσκεται απέναντι από την κορυφή Κ, β) η κατηγορία του τριγώνου ως προς τις πλευρές και τις γωνίες, και γ) η υποτείνουσα και οι κάθετες πλευρές του.",
    prob1ColQuestion: "Ερώτημα",
    prob1ColAnalysis: "Ανάλυση Δεδομένων",
    prob1ColResult: "Απάντηση",
    prob1Row1Q: "α) Πλευρά απέναντι από Κ",
    prob1Row1A: "Ενώνουμε τις άλλες δύο κορυφές Λ και Μ",
    prob1Row1R: "Η πλευρά ΛΜ (8 cm)",
    prob1Row2Q: "β) Είδος ως προς πλευρές",
    prob1Row2A: "6 cm ≠ 8 cm ≠ 10 cm (όλες άνισες)",
    prob1Row2R: "Σκαληνό τρίγωνο",
    prob1Row3Q: "β) Είδος ως προς γωνίες",
    prob1Row3A: "Έχει μία ορθή γωνία (Λ̂ ＝ 90°)",
    prob1Row3R: "Ορθογώνιο τρίγωνο",
    prob1Row4Q: "γ) Υποτείνουσα & Κάθετες",
    prob1Row4A: "Απέναντι από Λ̂ ＝ 90° είναι η ΚΜ",
    prob1Row4R: "Υποτείνουσα: ΚΜ, Κάθετες: ΚΛ, ΛΜ",
    prob1ResSummary: "Συμπέρασμα:",
    prob1ResText: "Το τρίγωνο ΚΛΜ είναι ορθογώνιο και σκαληνό, με υποτείνουσα ΚΜ ＝ 10 cm.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ & ΠΕΡΙΜΕΤΡΟΣ",
    prob2Title: "Υπολογισμός πλευρών ισοσκελούς τριγώνου",
    prob2DescPre: "Ένα ισοσκελές τρίγωνο ΑΒΓ έχει περίμετρο Π ＝ 28 cm. Η βάση του ΒΓ έχει μήκος 8 cm, ενώ η γωνία κορυφής Α̂ είναι 44° και καθεμία από τις γωνίες της βάσης είναι 68°.",
    prob2DescPost: "Να υπολογιστούν τα μήκη των δύο ίσων πλευρών (σκελών) ΑΒ και ΑΓ και να χαρακτηριστεί το τρίγωνο ως προς τις γωνίες του.",
    prob2ColStep: "Στάδιο",
    prob2ColExpr: "Σχέση / Τύπος",
    prob2ColCalc: "Υπολογισμός",
    prob2Step1: "1. Τύπος Περιμέτρου",
    prob2Step1Expr: "Π ＝ ΑΒ ＋ ΑΓ ＋ ΒΓ",
    prob2Step1Calc: "2 · ΑΒ ＋ 8 ＝ 28 (αφού ΑΒ ＝ ΑΓ)",
    prob2Step2: "2. Εύρεση Σκελών",
    prob2Step2Expr: "2 · ΑΒ ＝ 28 － 8",
    prob2Step2Calc: "2 · ΑΒ ＝ 20 ⇒ ΑΒ ＝ ΑΓ ＝ 10 cm",
    prob2Step3: "3. Έλεγχος Γωνιών",
    prob2Step3Expr: "Α̂ ＝ 44°, Β̂ ＝ 68°, Γ̂ ＝ 68°",
    prob2Step3Calc: "Όλες μικρότερες από 90° (οξείες)",
    prob2ResSide: "Μήκη πλευρών:",
    prob2ResSideVal: "ΑΒ ＝ 10 cm, ΑΓ ＝ 10 cm, ΒΓ ＝ 8 cm.",
    prob2ResCheck: "Χαρακτηρισμός: Το τρίγωνο ΑΒΓ είναι οξυγώνιο ισοσκελές.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΑ ΤΡΙΓΩΝΑ",
    alert1Title: "Ονομασία απέναντι πλευράς:",
    alert1DescPre: "Η πλευρά",
    alert1DescMid: "ενός τριγώνου ΑΒΓ είναι η πλευρά",
    alert1DescPost: "(αυτή που ΔΕΝ περιέχει το γράμμα Α), και όχι η ΑΒ!",
    alert2Title: "Τα ισοσκελή δεν είναι πάντα οξυγώνια:",
    alert2Desc: "Ένα ισοσκελές τρίγωνο μπορεί να έχει ορθή γωνία κορυφής (ορθογώνιο ισοσκελές) ή αμβλεία γωνία κορυφής (αμβλυγώνιο ισοσκελές).",
    alert3Title: "Εντοπισμός της υποτείνουσας:",
    alert3Desc: "Η υποτείνουσα δεν είναι η «κάτω» οριζόντια πλευρά του σχήματος — είναι ΠΑΝΤΑ η πλευρά που βρίσκεται απέναντι από την ορθή γωνία (90°).",
    alert4Title: "Πλήθος ορθών ή αμβλειών γωνιών:",
    alert4Desc: "Ένα τρίγωνο μπορεί να έχει το πολύ ΜΙΑ ορθή ή ΜΙΑ αμβλεία γωνία (αφού το άθροισμα των τριών γωνιών είναι 180°).",

    // Bottom
    bottomTitle: "Εμπεδώστε τα Τρίγωνα στην Πράξη!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας στα πρωτεύοντα στοιχεία και τις κατηγορίες τριγώνων με διαδραστικές ασκήσεις, σχήματα και αναλυτικές εξηγήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Triangles: Elements and Classification | Grade 7 Theory",
    pageDesc: "Comprehensive Grade 7 geometry theory on triangles: primary elements (vertices, sides, angles), classification by side lengths and angle measures, and interactive lab.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 05 • GRADE 7",
    heroTitle: "Triangles: Elements and Classification",
    heroDesc: "Explore the most fundamental polygon in geometry! Identify the six primary elements of a triangle, classify triangles by side lengths and angle types, and experiment interactively.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Definition & Primary Elements",
    card1Desc: "Given three non-collinear points A, B, and C, connecting them pairwise with line segments forms triangle ABC.",
    card1ElementsTitle: "The 6 Primary Elements of a Triangle:",
    card1Vertices: "3 Vertices: The points A, B, and C.",
    card1Sides: "3 Sides: The line segments BC (or a), AC (or b), and AB (or c).",
    card1Angles: "3 Angles: The interior angles ∠A (∠BAC), ∠B (∠ABC), and ∠C (∠ACB).",
    card1OppNoteTitle: "Opposite & Adjacent Elements:",
    card1OppNoteDesc: "Side BC lies opposite to vertex A (hence denoted by a), while angles ∠B and ∠C are adjacent to side BC.",

    // Card 2
    card2Badge: "2",
    card2Title: "Classification by Side Lengths",
    card2Desc: "Depending on the comparison of their three side lengths, triangles fall into three categories:",
    card2ScaleneTitle: "1. Scalene Triangle:",
    card2ScaleneDesc: "All three sides have different lengths (a ≠ b ≠ c). Consequently, all three interior angles are also unequal.",
    card2IsoTitle: "2. Isosceles Triangle:",
    card2IsoDesc: "Has at least two equal sides (e.g., AB ＝ AC), called legs. The third side BC is the base, the opposite angle ∠A is the vertex angle, and the base angles are equal (∠B ＝ ∠C).",
    card2EquiTitle: "3. Equilateral Triangle:",
    card2EquiDesc: "All three sides are equal (AB ＝ BC ＝ AC). Every equilateral triangle is also isosceles, and all three angles measure 60°.",

    // Card 3
    card3Badge: "3",
    card3Title: "Classification by Angle Measures",
    card3Desc: "Depending on the types of their interior angles, triangles are also classified into three categories:",
    card3AcuteTitle: "1. Acute Triangle:",
    card3AcuteDesc: "All three interior angles are acute (each angle is less than 90°).",
    card3RightTitle: "2. Right Triangle:",
    card3RightDesc: "Has one right angle (90°) and two acute angles. The side opposite the right angle is the hypotenuse (always the longest side), while the two sides forming the right angle are called legs.",
    card3ObtuseTitle: "3. Obtuse Triangle:",
    card3ObtuseDesc: "Has one obtuse angle (greater than 90° and less than 180°) and two acute angles.",

    // Card 4
    card4Badge: "4",
    card4Title: "Dual Classification & Key Properties",
    card4Desc: "Every triangle belongs simultaneously to one side-based category and one angle-based category:",
    card4RuleFormula: "Angle Sum Property: ∠A ＋ ∠B ＋ ∠C ＝ 180°",
    card4Comb1Title: "Valid Combinations:",
    card4Comb1Desc: "An isosceles or scalene triangle can be acute, right, or obtuse (e.g., a right isosceles triangle has angles 90°, 45°, 45°).",
    card4Comb2Title: "Impossible Combinations:",
    card4Comb2Desc: "An equilateral triangle is ALWAYS acute (60°, 60°, 60°). Right equilateral or obtuse equilateral triangles cannot exist!",

    // Lab
    labBadge: "GEOMETRY LAB",
    labTitle: "Interactive Triangle ABC Explorer",
    labPresetsLabel: "QUICK PRESETS:",
    presetScalene: "Scalene Acute",
    presetIsosceles: "Isosceles",
    presetEquilateral: "Equilateral",
    presetRight: "Right (3-4-5)",
    presetObtuse: "Obtuse",
    labSidesHeader: "TRIANGLE SIDE LENGTHS (cm)",
    labSideA: "Side a ＝ BC",
    labSideB: "Side b ＝ AC",
    labSideC: "Side c ＝ AB",
    labInvalidTitle: "Cannot form a triangle!",
    labInvalidDesc: "To form a valid triangle, the sum of any two sides must be strictly greater than the third side (triangle inequality).",
    labDiagSides: "CLASSIFICATION BY SIDES",
    labDiagAngles: "CLASSIFICATION BY ANGLES",
    labDiagAnglesValues: "COMPUTED ANGLES",
    labDiagPerimeter: "PERIMETER",
    typeScalene: "Scalene",
    typeIsosceles: "Isosceles",
    typeEquilateral: "Equilateral",
    typeAcute: "Acute",
    typeRight: "Right",
    typeObtuse: "Obtuse",
    labRightHint: "90° right angle! The opposite side is the hypotenuse.",
    labIsoHint: "Two equal sides (legs) and equal base angles!",
    labEquiHint: "All 3 sides equal and every angle is 60°!",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: PRIMARY ELEMENTS & CLASSIFICATION",
    prob1Title: "Identifying elements and classifying a triangle",
    prob1DescPre: "Given triangle KLM with side lengths KL ＝ 6 cm, LM ＝ 8 cm, KM ＝ 10 cm and angles ∠K ＝ 53°, ∠L ＝ 90°, ∠M ＝ 37°.",
    prob1DescPost: "Determine: (a) the side opposite to vertex K, (b) the classification by sides and by angles, and (c) the hypotenuse and legs.",
    prob1ColQuestion: "Question",
    prob1ColAnalysis: "Data Analysis",
    prob1ColResult: "Answer",
    prob1Row1Q: "(a) Side opposite vertex K",
    prob1Row1A: "Connect the other two vertices L and M",
    prob1Row1R: "Side LM (8 cm)",
    prob1Row2Q: "(b) Type by sides",
    prob1Row2A: "6 cm ≠ 8 cm ≠ 10 cm (all unequal)",
    prob1Row2R: "Scalene triangle",
    prob1Row3Q: "(b) Type by angles",
    prob1Row3A: "Has one right angle (∠L ＝ 90°)",
    prob1Row3R: "Right triangle",
    prob1Row4Q: "(c) Hypotenuse & Legs",
    prob1Row4A: "Opposite to ∠L ＝ 90° is KM",
    prob1Row4R: "Hypotenuse: KM, Legs: KL, LM",
    prob1ResSummary: "Conclusion:",
    prob1ResText: "Triangle KLM is a right scalene triangle with hypotenuse KM ＝ 10 cm.",

    prob2Badge: "PROBLEM 2: ISOSCELES TRIANGLE & PERIMETER",
    prob2Title: "Finding side lengths of an isosceles triangle",
    prob2DescPre: "An isosceles triangle ABC has perimeter P ＝ 28 cm. Its base BC measures 8 cm, its vertex angle ∠A is 44°, and each base angle is 68°.",
    prob2DescPost: "Calculate the lengths of the two equal legs AB and AC, and classify the triangle by its angles.",
    prob2ColStep: "Stage",
    prob2ColExpr: "Relation / Formula",
    prob2ColCalc: "Calculation",
    prob2Step1: "1. Perimeter Formula",
    prob2Step1Expr: "P ＝ AB ＋ AC ＋ BC",
    prob2Step1Calc: "2 · AB ＋ 8 ＝ 28 (since AB ＝ AC)",
    prob2Step2: "2. Finding Legs",
    prob2Step2Expr: "2 · AB ＝ 28 － 8",
    prob2Step2Calc: "2 · AB ＝ 20 ⇒ AB ＝ AC ＝ 10 cm",
    prob2Step3: "3. Checking Angles",
    prob2Step3Expr: "∠A ＝ 44°, ∠B ＝ 68°, ∠C ＝ 68°",
    prob2Step3Calc: "All less than 90° (acute angles)",
    prob2ResSide: "Side lengths:",
    prob2ResSideVal: "AB ＝ 10 cm, AC ＝ 10 cm, BC ＝ 8 cm.",
    prob2ResCheck: "Classification: Triangle ABC is an acute isosceles triangle.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH TRIANGLES",
    alert1Title: "Naming the opposite side:",
    alert1DescPre: "Side",
    alert1DescMid: "of triangle ABC is segment",
    alert1DescPost: "(the one NOT containing letter A), not AB!",
    alert2Title: "Isosceles triangles are not always acute:",
    alert2Desc: "An isosceles triangle can have a right vertex angle (right isosceles) or an obtuse vertex angle (obtuse isosceles).",
    alert3Title: "Identifying the hypotenuse:",
    alert3Desc: "The hypotenuse is not necessarily the horizontal bottom side—it is ALWAYS the side opposite the 90° right angle.",
    alert4Title: "Number of right or obtuse angles:",
    alert4Desc: "A triangle can have at most ONE right angle or ONE obtuse angle (since the three angles always sum to 180°).",

    // Bottom
    bottomTitle: "Master Triangles in Practice!",
    bottomDesc: "Test your understanding of primary elements and triangle classification with interactive exercises, diagrams, and step-by-step solutions.",
    bottomBtn: "START EXERCISES"
  }
};

export default function TrigonaTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];
  const locCode = isEl ? 'el-GR' : 'en-US';

  // State πλευρών τριγώνου (σε cm): α = ΒΓ, β = ΑΓ, γ = ΑΒ
  const [sideA, setSideA] = useState(5);
  const [sideB, setSideB] = useState(4);
  const [sideC, setSideC] = useState(3);

  // Έλεγχος τριγωνικής ανισότητας
  const isValidTriangle = sideA + sideB > sideC && sideA + sideC > sideB && sideB + sideC > sideA;

  // Υπολογισμός γωνιών & συντεταγμένων SVG
  let angleA = 0;
  let angleB = 0;
  let angleC = 0;
  let sideType = '';
  let angleType = '';
  let svgPoints = { Ax: 160, Ay: 40, Bx: 60, By: 190, Cx: 260, Cy: 190 };

  if (isValidTriangle) {
    const cosA = (sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC);
    const cosB = (sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC);
    const radA = Math.acos(Math.max(-1, Math.min(1, cosA)));
    const radB = Math.acos(Math.max(-1, Math.min(1, cosB)));

    angleA = Math.round((radA * 180) / Math.PI);
    angleB = Math.round((radB * 180) / Math.PI);
    angleC = 180 - angleA - angleB;

    // Ταξινόμηση ως προς τις πλευρές
    if (sideA === sideB && sideB === sideC) {
      sideType = t.typeEquilateral;
    } else if (sideA === sideB || sideB === sideC || sideA === sideC) {
      sideType = t.typeIsosceles;
    } else {
      sideType = t.typeScalene;
    }

    // Ταξινόμηση ως προς τις γωνίες
    const maxAngle = Math.max(angleA, angleB, angleC);
    if (maxAngle === 90) {
      angleType = t.typeRight;
    } else if (maxAngle > 90) {
      angleType = t.typeObtuse;
    } else {
      angleType = t.typeAcute;
    }

    // Τοποθέτηση τριγώνου στο viewBox 340x230 με βάση ΒΓ οριζόντια
    const rawBx = 0;
    const rawBy = 0;
    const rawCx = sideA;
    const rawCy = 0;
    const rawAx = sideC * Math.cos(radB);
    const rawAy = sideC * Math.sin(radB);

    const minX = Math.min(rawAx, rawBx, rawCx);
    const maxX = Math.max(rawAx, rawBx, rawCx);
    const minY = Math.min(rawAy, rawBy, rawCy);
    const maxY = Math.max(rawAy, rawBy, rawCy);

    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    const scale = Math.min(220 / spanX, 135 / spanY);

    const drawnW = spanX * scale;
    const drawnH = spanY * scale;
    const offsetX = (340 - drawnW) / 2 - minX * scale;
    const offsetY = (230 + drawnH) / 2;

    svgPoints = {
      Ax: Number((offsetX + rawAx * scale).toFixed(1)),
      Ay: Number((offsetY - rawAy * scale).toFixed(1)),
      Bx: Number((offsetX + rawBx * scale).toFixed(1)),
      By: Number((offsetY - rawBy * scale).toFixed(1)),
      Cx: Number((offsetX + rawCx * scale).toFixed(1)),
      Cy: Number((offsetY - rawCy * scale).toFixed(1))
    };
  }

  const applyPreset = (a, b, c) => {
    setSideA(a);
    setSideB(b);
    setSideC(c);
  };

  // Βοηθητική για σχεδίαση συμβόλου ορθής γωνίας στο SVG
  const renderRightAngleMarker = (Vx, Vy, P1x, P1y, P2x, P2y) => {
    const size = 14;
    const d1x = P1x - Vx;
    const d1y = P1y - Vy;
    const len1 = Math.hypot(d1x, d1y) || 1;
    const u1x = (d1x / len1) * size;
    const u1y = (d1y / len1) * size;

    const d2x = P2x - Vx;
    const d2y = P2y - Vy;
    const len2 = Math.hypot(d2x, d2y) || 1;
    const u2x = (d2x / len2) * size;
    const u2y = (d2y / len2) * size;

    const p1 = `${Vx + u1x},${Vy + u1y}`;
    const p2 = `${Vx + u1x + u2x},${Vy + u1y + u2y}`;
    const p3 = `${Vx + u2x},${Vy + u2y}`;

    return (
      <polyline
        points={`${p1} ${p2} ${p3}`}
        fill="none"
        stroke="#059669"
        strokeWidth="2"
      />
    );
  };

  const vertexLabels = isEl ? { A: 'Α', B: 'Β', C: 'Γ' } : { A: 'A', B: 'B', C: 'C' };
  const sideLabels = isEl ? { a: 'α', b: 'β', c: 'γ' } : { a: 'a', b: 'b', c: 'c' };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/39-trigona-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800 box-border">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl w-full min-w-0">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase(t.heroBadge)}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight break-words [overflow-wrap:anywhere]">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              {t.heroDesc}
            </p>
            <div>
              <Link
                href="/a-gymnasiou/39-trigona-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase(t.btnGoExercises)}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 w-full min-w-0">
          
          {/* ΚΑΡΤΑ 1: ΟΡΙΣΜΟΣ & ΠΡΩΤΕΥΟΝΤΑ ΣΤΟΙΧΕΙΑ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card1Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card1Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card1Desc}
              </p>

              {/* Εποπτικό Σχήμα Πρωτευόντων Στοιχείων */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 220 145" className="w-44 h-28 shrink-0">
                  <polygon points="110,22 35,122 185,122" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" />
                  {/* Γωνιακά τόξα */}
                  <path d="M 98,38 A 18,18 0 0,0 122,38" fill="none" stroke="#059669" strokeWidth="2" />
                  <path d="M 53,122 A 18,18 0 0,0 46,108" fill="none" stroke="#059669" strokeWidth="2" />
                  <path d="M 174,108 A 18,18 0 0,0 167,122" fill="none" stroke="#059669" strokeWidth="2" />
                  {/* Κορυφές */}
                  <circle cx="110" cy="22" r="3.5" fill="#1e1b4b" />
                  <circle cx="35" cy="122" r="3.5" fill="#1e1b4b" />
                  <circle cx="185" cy="122" r="3.5" fill="#1e1b4b" />
                  <text x="110" y="14" textAnchor="middle" className="text-[12px] font-black fill-indigo-950">{vertexLabels.A}</text>
                  <text x="22" y="130" textAnchor="middle" className="text-[12px] font-black fill-indigo-950">{vertexLabels.B}</text>
                  <text x="198" y="130" textAnchor="middle" className="text-[12px] font-black fill-indigo-950">{vertexLabels.C}</text>
                  {/* Πλευρές */}
                  <text x="110" y="137" textAnchor="middle" className="text-[11px] font-bold fill-indigo-700">{sideLabels.a}</text>
                  <text x="157" y="68" textAnchor="start" className="text-[11px] font-bold fill-indigo-700">{sideLabels.b}</text>
                  <text x="63" y="68" textAnchor="end" className="text-[11px] font-bold fill-indigo-700">{sideLabels.c}</text>
                </svg>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <span className="font-bold text-indigo-900 block">{t.card1ElementsTitle}</span>
                  <div>• <strong>{t.card1Vertices.split(':')[0]}:</strong> {t.card1Vertices.split(':')[1]}</div>
                  <div>• <strong>{t.card1Sides.split(':')[0]}:</strong> {t.card1Sides.split(':')[1]}</div>
                  <div>• <strong>{t.card1Angles.split(':')[0]}:</strong> {t.card1Angles.split(':')[1]}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 leading-relaxed">
                <span className="font-bold block mb-0.5">{t.card1OppNoteTitle}</span>
                {t.card1OppNoteDesc}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΚΑΤΗΓΟΡΙΕΣ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card2Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card2Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card2Desc}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-0.5">{t.card2ScaleneTitle}</span>
                  {t.card2ScaleneDesc}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-0.5">{t.card2IsoTitle}</span>
                  {t.card2IsoDesc}
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                  <span className="font-bold text-emerald-900 block mb-0.5">{t.card2EquiTitle}</span>
                  {t.card2EquiDesc}
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΚΑΤΗΓΟΡΙΕΣ ΩΣ ΠΡΟΣ ΤΙΣ ΓΩΝΙΕΣ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card3Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card3Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card3Desc}
              </p>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-0.5">{t.card3AcuteTitle}</span>
                  {t.card3AcuteDesc}
                </div>

                <div className="p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-indigo-950 leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-0.5">{t.card3RightTitle}</span>
                  {t.card3RightDesc}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <span className="font-bold text-indigo-900 block mb-0.5">{t.card3ObtuseTitle}</span>
                  {t.card3ObtuseDesc}
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΔΙΠΛΗ ΤΑΞΙΝΟΜΗΣΗ & ΙΔΙΟΤΗΤΕΣ */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors min-w-0">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  {t.card4Badge}
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug break-words [overflow-wrap:anywhere]">
                  {t.card4Title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                {t.card4Desc}
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner font-mono text-xs sm:text-sm font-bold break-words">
                {t.card4RuleFormula}
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-slate-900 block mb-0.5">{t.card4Comb1Title}</strong>
                  {t.card4Comb1Desc}
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
                  <strong className="text-amber-900 block mb-0.5">{t.card4Comb2Title}</strong>
                  {t.card4Comb2Desc}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                📐 {toCleanUppercase(t.labBadge)}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
                {t.labTitle}
              </h2>
            </div>

            {/* Presets Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                {toCleanUppercase(t.labPresetsLabel)}
              </span>
              <button
                type="button"
                onClick={() => applyPreset(6, 5, 4)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 text-xs font-bold transition"
              >
                {t.presetScalene}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(5, 6, 6)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 text-xs font-bold transition"
              >
                {t.presetIsosceles}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(5, 5, 5)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 text-xs font-bold transition"
              >
                {t.presetEquilateral}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(5, 4, 3)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-bold transition"
              >
                {t.presetRight}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(8, 5, 4)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-bold transition"
              >
                {t.presetObtuse}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Sliders Πλευρών */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2">
                {toCleanUppercase(t.labSidesHeader)}
              </h3>
              <div className="space-y-4">
                <CustomSlider
                  label={t.labSideA}
                  min={2}
                  max={10}
                  step={1}
                  value={sideA}
                  onChange={setSideA}
                  unit="cm"
                  color="#4f46e5"
                  locale={locale}
                />
                <CustomSlider
                  label={t.labSideB}
                  min={2}
                  max={10}
                  step={1}
                  value={sideB}
                  onChange={setSideB}
                  unit="cm"
                  color="#2563eb"
                  locale={locale}
                />
                <CustomSlider
                  label={t.labSideC}
                  min={2}
                  max={10}
                  step={1}
                  value={sideC}
                  onChange={setSideC}
                  unit="cm"
                  color="#059669"
                  locale={locale}
                />
              </div>
            </div>

            {/* Dynamic SVG Visualizer & Classification */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              {!isValidTriangle ? (
                <div className="p-6 bg-rose-50 border-2 border-rose-200 rounded-2xl text-center space-y-2">
                  <div className="text-2xl">⚠️</div>
                  <h3 className="text-base sm:text-lg font-black text-rose-900">
                    {t.labInvalidTitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-800 max-w-md mx-auto leading-relaxed">
                    {t.labInvalidDesc}
                  </p>
                </div>
              ) : (
                <>
                  {/* SVG Καμβάς */}
                  <div className="bg-slate-950 rounded-2xl p-3 sm:p-4 flex items-center justify-center shadow-inner overflow-hidden">
                    <svg viewBox="0 0 340 230" className="w-full max-w-md h-52 sm:h-60 select-none">
                      {/* Τρίγωνο */}
                      <polygon
                        points={`${svgPoints.Ax},${svgPoints.Ay} ${svgPoints.Bx},${svgPoints.By} ${svgPoints.Cx},${svgPoints.Cy}`}
                        fill="rgba(99, 102, 241, 0.22)"
                        stroke="#818cf8"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />

                      {/* Σύμβολα ορθής γωνίας (αν υπάρχει) */}
                      {angleA === 90 && renderRightAngleMarker(svgPoints.Ax, svgPoints.Ay, svgPoints.Bx, svgPoints.By, svgPoints.Cx, svgPoints.Cy)}
                      {angleB === 90 && renderRightAngleMarker(svgPoints.Bx, svgPoints.By, svgPoints.Ax, svgPoints.Ay, svgPoints.Cx, svgPoints.Cy)}
                      {angleC === 90 && renderRightAngleMarker(svgPoints.Cx, svgPoints.Cy, svgPoints.Ax, svgPoints.Ay, svgPoints.Bx, svgPoints.By)}

                      {/* Κορυφές & Γωνίες */}
                      <circle cx={svgPoints.Ax} cy={svgPoints.Ay} r="4" fill="#34d399" />
                      <text
                        x={svgPoints.Ax}
                        y={svgPoints.Ay - 10}
                        textAnchor="middle"
                        className="text-[12px] font-black fill-white"
                      >
                        {vertexLabels.A} ({angleA}°)
                      </text>

                      <circle cx={svgPoints.Bx} cy={svgPoints.By} r="4" fill="#34d399" />
                      <text
                        x={svgPoints.Bx - 6}
                        y={svgPoints.By + 18}
                        textAnchor="middle"
                        className="text-[12px] font-black fill-white"
                      >
                        {vertexLabels.B} ({angleB}°)
                      </text>

                      <circle cx={svgPoints.Cx} cy={svgPoints.Cy} r="4" fill="#34d399" />
                      <text
                        x={svgPoints.Cx + 6}
                        y={svgPoints.Cy + 18}
                        textAnchor="middle"
                        className="text-[12px] font-black fill-white"
                      >
                        {vertexLabels.C} ({angleC}°)
                      </text>

                      {/* Ετικέτες πλευρών */}
                      <text
                        x={(svgPoints.Bx + svgPoints.Cx) / 2}
                        y={svgPoints.By + 16}
                        textAnchor="middle"
                        className="text-[11px] font-mono font-bold fill-indigo-300"
                      >
                        {sideLabels.a} ＝ {sideA.toLocaleString(locCode)} cm
                      </text>
                      <text
                        x={(svgPoints.Ax + svgPoints.Cx) / 2 + 10}
                        y={(svgPoints.Ay + svgPoints.Cy) / 2}
                        textAnchor="start"
                        className="text-[11px] font-mono font-bold fill-sky-300"
                      >
                        {sideLabels.b} ＝ {sideB.toLocaleString(locCode)} cm
                      </text>
                      <text
                        x={(svgPoints.Ax + svgPoints.Bx) / 2 - 10}
                        y={(svgPoints.Ay + svgPoints.By) / 2}
                        textAnchor="end"
                        className="text-[11px] font-mono font-bold fill-emerald-300"
                      >
                        {sideLabels.c} ＝ {sideC.toLocaleString(locCode)} cm
                      </text>
                    </svg>
                  </div>

                  {/* Κάρτες Διάγνωσης */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                      <span className="font-bold text-indigo-700 block mb-1 text-[11px]">
                        {toCleanUppercase(t.labDiagSides)}
                      </span>
                      <div className="font-black text-indigo-950 text-sm sm:text-base">
                        {sideType}
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="font-bold text-emerald-700 block mb-1 text-[11px]">
                        {toCleanUppercase(t.labDiagAngles)}
                      </span>
                      <div className="font-black text-emerald-950 text-sm sm:text-base">
                        {angleType}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="font-bold text-slate-600 block mb-1 text-[11px]">
                        {toCleanUppercase(t.labDiagPerimeter)}
                      </span>
                      <div className="font-mono font-black text-slate-900 text-sm sm:text-base">
                        {(sideA + sideB + sideC).toLocaleString(locCode)} cm
                      </div>
                    </div>
                  </div>

                  {/* Επεξηγηματική παρατήρηση ανάλογα με την κατηγορία */}
                  {(angleType === t.typeRight || sideType === t.typeIsosceles || sideType === t.typeEquilateral) && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 font-medium">
                      💡{' '}
                      {angleType === t.typeRight
                        ? t.labRightHint
                        : sideType === t.typeEquilateral
                        ? t.labEquiHint
                        : t.labIsoHint}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12 w-full min-w-0">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full shrink-0" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.solvedTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full min-w-0">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase(t.prob1Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  {t.prob1Title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 space-y-1.5 break-words">
                  <p>{t.prob1DescPre}</p>
                  <p>{t.prob1DescPost}</p>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row1Q}</div>
                    <div className="text-slate-600">{t.prob1Row1A}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row1R}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row2A}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row2R}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row3A}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row3R}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row4Q}</div>
                    <div className="text-slate-600">{t.prob1Row4A}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row4R}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob1ColQuestion}</th>
                        <th className="p-2.5 border-b">{t.prob1ColAnalysis}</th>
                        <th className="p-2.5 border-b">{t.prob1ColResult}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row1Q}</td>
                        <td className="p-2.5">{t.prob1Row1A}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row1R}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row2Q}</td>
                        <td className="p-2.5 font-mono">{t.prob1Row2A}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row2R}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row3Q}</td>
                        <td className="p-2.5 font-mono">{t.prob1Row3A}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row3R}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row4Q}</td>
                        <td className="p-2.5">{t.prob1Row4A}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row4R}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800">
                  <strong>{t.prob1ResSummary}</strong> {t.prob1ResText}
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between min-w-0">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase(t.prob2Badge)}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  {t.prob2Title}
                </h3>
                <div className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 space-y-1.5 break-words">
                  <p>{t.prob2DescPre}</p>
                  <p>{t.prob2DescPost}</p>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs font-mono">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900 font-sans">{t.prob2Step1}</div>
                    <div className="text-slate-600">{t.prob2Step1Expr}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Step1Calc}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900 font-sans">{t.prob2Step2}</div>
                    <div className="text-slate-600">{t.prob2Step2Expr}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Step2Calc}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900 font-sans">{t.prob2Step3}</div>
                    <div className="text-slate-600">{t.prob2Step3Expr}</div>
                    <div className="font-bold text-indigo-700 font-sans">{t.prob2Step3Calc}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob2ColStep}</th>
                        <th className="p-2.5 border-b">{t.prob2ColExpr}</th>
                        <th className="p-2.5 border-b">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs font-mono">
                      <tr>
                        <td className="p-2.5 font-sans font-semibold">{t.prob2Step1}</td>
                        <td className="p-2.5">{t.prob2Step1Expr}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob2Step1Calc}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-sans font-semibold">{t.prob2Step2}</td>
                        <td className="p-2.5">{t.prob2Step2Expr}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob2Step2Calc}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-sans font-semibold">{t.prob2Step3}</td>
                        <td className="p-2.5">{t.prob2Step3Expr}</td>
                        <td className="p-2.5 font-sans font-bold text-indigo-700">{t.prob2Step3Calc}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>{t.prob2ResSide}</strong> <span className="font-mono font-bold text-emerald-900">{t.prob2ResSideVal}</span></div>
                  <div><strong>{t.prob2ResCheck}</strong></div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm min-w-0">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5 min-w-0">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase(t.alertTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert1Title}</strong> {t.alert1DescPre}{' '}
                    <strong>{isEl ? 'α' : 'a'}</strong> {t.alert1DescMid}{' '}
                    <strong>{isEl ? 'ΒΓ' : 'BC'}</strong> {t.alert1DescPost}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert2Title}</strong> {t.alert2Desc}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert3Title}</strong> {t.alert3Desc}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span className="break-words [overflow-wrap:anywhere]">
                    <strong>{t.alert4Title}</strong> {t.alert4Desc}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center min-w-0">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug break-words [overflow-wrap:anywhere]">
            {t.bottomTitle}
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            {t.bottomDesc}
          </p>
          <Link
            href="/a-gymnasiou/39-trigona-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

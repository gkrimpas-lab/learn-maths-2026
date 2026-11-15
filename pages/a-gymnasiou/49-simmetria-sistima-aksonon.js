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
    <span
      className={`inline-flex flex-col text-center align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 whitespace-nowrap">
        {num}
      </span>
      <span className="pt-0.5 whitespace-nowrap">
        {den}
      </span>
    </span>
  );
}

// Custom Interactive Slider για το Διαδραστικό Εργαστήριο
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
          {formatNum(value)}{unit}
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
        <span>{formatNum(min)}{unit}</span>
        <span>{formatNum(Math.round((min + max) / 2))}{unit}</span>
        <span>{formatNum(max)}{unit}</span>
      </div>
    </div>
  );
}

// Γεωμετρική προβολή αναδίπλωσης (folding) ενός σημείου (px, py) ως προς ευθεία (x1, y1)-(x2, y2)
// foldRatio in [0, 1] -> γωνία θ = foldRatio * π -> συντελεστής προβολής cos(θ) από +1 σε -1
function foldPoint(px, py, x1, y1, x2, y2, foldRatio) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-6) return { x: px, y: py };
  const t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const perpX = px - projX;
  const perpY = py - projY;
  const cosTheta = Math.cos(foldRatio * Math.PI);
  return {
    x: Number((projX + perpX * cosTheta).toFixed(2)),
    y: Number((projY + perpY * cosTheta).toFixed(2))
  };
}

function foldPolygonPoints(pts, x1, y1, x2, y2, foldRatio) {
  return pts
    .map(([px, py]) => {
      const f = foldPoint(px, py, x1, y1, x2, y2, foldRatio);
      return `${f.x},${f.y}`;
    })
    .join(' ');
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Αξονική Συμμετρία στο Σύστημα Αξόνων & Δίπλωμα Σχημάτων | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Α' Γυμνασίου για την αξονική συμμετρία στο ορθογώνιο σύστημα αξόνων: συμμετρικό σημείου ως προς x'x και y'y, συμμετρία σχημάτων και αναδίπλωση βασικών σχημάτων στους άξονες συμμετρίας.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 12 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Αξονική Συμμετρία στο Σύστημα Αξόνων & Σχήματα με Άξονα Συμμετρίας",
    heroDesc: "Μάθετε πώς αλλάζουν οι συντεταγμένες ενός σημείου Μ(x, y) όταν το ανακλάμε ως προς τον άξονα x'x ή τον άξονα y'y, και διπλώστε διαδραστικά τα βασικά γεωμετρικά σχήματα κατά μήκος των αξόνων συμμετρίας τους!",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Συμμετρικό σημείου ως προς x'x
    card1Badge: "1",
    card1Title: "Συμμετρικό Σημείου ως προς τον Άξονα x'x",
    card1Desc: "Όταν ανακλούμε ένα σημείο Μ(x, y) ως προς τον οριζόντιο άξονα x'x, η τετμημένη (x) μένει ίδια, ενώ η τεταγμένη (y) γίνεται αντίθετη:",
    card1Formula: "Μ(x, y)  ──(άξονας x'x)──▶  Μ₁(x, －y)",
    card1ExampleTitle: "Παραδείγματα:",
    card1Ex1: "• Το συμμετρικό του Α(3, 4) ως προς τον x'x είναι το Α₁(3, －4).",
    card1Ex2: "• Το συμμετρικό του Β(－2, －5) ως προς τον x'x είναι το Β₁(－2, 5).",
    card1Ex3: "• Αν ένα σημείο Κ(4, 0) βρίσκεται πάνω στον x'x, το συμμετρικό του είναι το ίδιο το Κ(4, 0).",

    // Card 2: Συμμετρικό σημείου ως προς y'y
    card2Badge: "2",
    card2Title: "Συμμετρικό Σημείου ως προς τον Άξονα y'y",
    card2Desc: "Όταν ανακλούμε ένα σημείο Μ(x, y) ως προς τον κατακόρυφο άξονα y'y, η τεταγμένη (y) μένει ίδια, ενώ η τετμημένη (x) γίνεται αντίθετη:",
    card2Formula: "Μ(x, y)  ──(άξονας y'y)──▶  Μ₂(－x, y)",
    card2ExampleTitle: "Παραδείγματα:",
    card2Ex1: "• Το συμμετρικό του Α(3, 4) ως προς τον y'y είναι το Α₂(－3, 4).",
    card2Ex2: "• Το συμμετρικό του Β(－2, －5) ως προς τον y'y είναι το Β₂(2, －5).",
    card2Ex3: "• Αν ένα σημείο Λ(0, －3) βρίσκεται πάνω στον y'y, το συμμετρικό του είναι το ίδιο το Λ(0, －3).",

    // Card 3: Συμμετρικά Σχημάτων στο Σύστημα Αξόνων
    card3Badge: "3",
    card3Title: "Συμμετρικά Σχημάτων στο Σύστημα Αξόνων",
    card3Desc: "Για να σχεδιάσουμε το συμμετρικό ενός πολυγώνου (π.χ. τριγώνου ΑΒΓ) ως προς τον άξονα x'x ή τον y'y:",
    card3Step1: "1. Βρίσκουμε τις συμμετρικές συντεταγμένες κάθε κορυφής Α, Β, Γ.",
    card3Step2: "2. Τοποθετούμε τις νέες κορυφές Α', Β', Γ' στο καρτεσιανό επίπεδο.",
    card3Step3: "3. Ενώνουμε τις νέες κορυφές με ευθύγραμμα τμήματα — το νέο σχήμα Α'Β'Γ' είναι ίσο με το αρχικό ΑΒΓ (διατηρεί πλευρές, γωνίες και εμβαδόν).",

    // Card 4: Σχήματα με Άξονα Συμμετρίας & Αναδίπλωση
    card4Badge: "4",
    card4Title: "Σχήματα με Άξονα Συμμετρίας & Αναδίπλωση",
    card4Desc: "Μια ευθεία (ε) είναι άξονας συμμετρίας ενός σχήματος Σ αν, όταν διπλώσουμε το επίπεδο κατά μήκος της (ε), το ένα μισό του σχήματος πέφτει και καλύπτει ακριβώς το άλλο μισό:",
    card4List1: "• 1 Άξονας: Ισοσκελές τρίγωνο, ισοσκελές τραπέζιο, γωνία.",
    card4List2: "• 2 Άξονες: Ευθύγραμμο τμήμα, ορθογώνιο (μεσοκάθετοι πλευρών), ρόμβος (διαγώνιοι).",
    card4List3: "• 3 Άξονες: Ισόπλευρο τρίγωνο • 4 Άξονες: Τετράγωνο.",
    card4List4: "• Άπειροι Άξονες: Κύκλος (Ο, ρ) • 0 Άξονες: Σκαληνό τρίγωνο, γενικό παραλληλόγραμμο.",

    // Interactive Lab
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Μέρος Α: Σύστημα Αξόνων & Μέρος Β: Δίπλωμα Βασικών Σχημάτων",

    // Lab Part A: Coordinate System
    labPartATitle: "ΜΕΡΟΣ Α: ΣΥΜΜΕΤΡΙΚΑ ΣΗΜΕΙΟΥ Μ(x, y) ΣΤΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ",
    labSliderX: "Τετμημένη x του σημείου Μ",
    labSliderY: "Τεταγμένη y του σημείου Μ",
    labAxisBtnX: "Ως προς άξονα x'x",
    labAxisBtnY: "Ως προς άξονα y'y",
    labAxisBtnBoth: "Και στους δύο άξονες",
    labOrigPt: "Αρχικό Σημείο Μ:",
    labSymXPt: "Συμμετρικό ως προς x'x (Μ₁):",
    labSymYPt: "Συμμετρικό ως προς y'y (Μ₂):",

    // Lab Part B: Folding Shapes Activity
    labPartBTitle: "ΜΕΡΟΣ Β: ΔΙΠΛΩΣΤΕ ΤΑ ΒΑΣΙΚΑ ΣΧΗΜΑΤΑ ΣΤΟΥΣ ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΟΥΣ",
    labSelectShape: "1. ΕΠΙΛΕΞΤΕ ΒΑΣΙΚΟ ΣΧΗΜΑ:",
    labSelectAxis: "2. ΕΠΙΛΕΞΤΕ ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ:",
    labFoldSlider: "3. ΜΠΑΡΑ ΑΝΑΔΙΠΛΩΣΗΣ (ΣΥΡΕΤΕ ΓΙΑ ΝΑ ΔΙΠΛΩΣΕΤΕ ΤΟ ΣΧΗΜΑ)",
    labFoldStatus0: "Ανοιχτό σχήμα (0%) — Σύρετε τη μπάρα δεξιά για να διπλώσετε!",
    labFoldStatusMid: "Διπλώνει κατά μήκος του επιλεγμένου άξονα...",
    labFoldStatus100Success: "✓ Τέλεια επικάλυψη (100%)! Το ένα μισό έπεσε ακριβώς πάνω στο άλλο μισό!",
    labFoldStatus100Fail: "✗ Δεν συμπίπτουν (100%)! Το γενικό παραλληλόγραμμο ΔΕΝ έχει άξονα συμμετρίας!",

    // Shapes & Axes names for Folding Activity
    shIsoTri: "Ισοσκελές Τρίγωνο",
    axIsoTri1: "Μεσοκάθετος βάσης",

    shEquiTri: "Ισόπλευρο Τρίγωνο",
    axEquiTri1: "1ος Άξονας (Κατακόρυφος)",
    axEquiTri2: "2ος Άξονας (Αριστερή κορυφή)",
    axEquiTri3: "3ος Άξονας (Δεξιά κορυφή)",

    shRect: "Ορθογώνιο",
    axRect1: "1ος Άξονας (Κατακόρυφη μεσοκάθετος)",
    axRect2: "2ος Άξονας (Οριζόντια μεσοκάθετος)",

    shRhombus: "Ρόμβος",
    axRhombus1: "1ος Άξονας (Κατακόρυφη διαγώνιος)",
    axRhombus2: "2ος Άξονας (Οριζόντια διαγώνιος)",

    shSquare: "Τετράγωνο",
    axSquare1: "1ος Άξονας (Κατακόρυφη μεσοκάθετος)",
    axSquare2: "2ος Άξονας (Οριζόντια μεσοκάθετος)",
    axSquare3: "3ος Άξονας (1η Διαγώνιος)",
    axSquare4: "4ος Άξονας (2η Διαγώνιος)",

    shIsoTrap: "Ισοσκελές Τραπέζιο",
    axIsoTrap1: "Κοινή μεσοκάθετος βάσεων",

    shCircle: "Κύκλος (Ο, ρ)",
    axCircle1: "Κατακόρυφη διάμετρος",
    axCircle2: "Οριζόντια διάμετρος",
    axCircle3: "Πλάγια διάμετρος (45°)",

    shParallelogram: "Παραλληλόγραμμο (Αντιπαράδειγμα)",
    axPara1: "Δοκιμή κατακόρυφης ευθείας (Δεν είναι άξονας)",
    axPara2: "Δοκιμή διαγωνίου (Δεν είναι άξονας)",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΣΥΜΜΕΤΡΙΚΟ ΤΡΙΓΩΝΟ ΣΤΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ",
    prob1Title: "Εύρεση συντεταγμένων συμμετρικού τριγώνου ως προς x'x και y'y",
    prob1DescPre: "Δίνεται το τρίγωνο ΑΒΓ με κορυφές Α(2, 1), Β(5, 1) και Γ(4, 4). Να βρεθούν οι συντεταγμένες των κορυφών: α) του συμμετρικού του τριγώνου Α₁Β₁Γ₁ ως προς τον άξονα x'x και β) του συμμετρικού του τριγώνου Α₂Β₂Γ₂ ως προς τον άξονα y'y.",
    prob1DiagramCaption: "Αρχικό τρίγωνο ΑΒΓ και τα συμμετρικά του Α₁Β₁Γ₁ (ως προς x'x) και Α₂Β₂Γ₂ (ως προς y'y)",
    prob1ColPart: "Ερώτημα / Κορυφή",
    prob1ColRule: "Κανόνας Μετασχηματισμού",
    prob1ColCalc: "Νέες Συντεταγμένες",
    prob1Row1Q: "α) Ως προς άξονα x'x",
    prob1Row1R: "Μ(x, y) ──▶ Μ₁(x, －y)",
    prob1Row1C: "Α₁(2, －1), Β₁(5, －1), Γ₁(4, －4)",
    prob1Row2Q: "β) Ως προς άξονα y'y",
    prob1Row2R: "Μ(x, y) ──▶ Μ₂(－x, y)",
    prob1Row2C: "Α₂(－2, 1), Β₂(－5, 1), Γ₂(－4, 4)",
    prob1ResSummary: "Συμπέρασμα:",
    prob1ResText: "Και τα δύο συμμετρικά τρίγωνα είναι ίσα με το ΑΒΓ (βάση 3 μονάδες, ύψος 3 μονάδες).",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΝΑΓΝΩΡΙΣΗ ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ ΑΠΟ ΣΥΝΤΕΤΑΓΜΕΝΕΣ",
    prob2Title: "Προσδιορισμός του άξονα ανάκλασης ανάμεσα σε δύο σημεία",
    prob2DescPre: "α) Το σημείο Ρ'(－4, 3) είναι το συμμετρικό του σημείου Ρ(4, 3) ως προς έναν από τους άξονες των συντεταγμένων. Ποιος είναι ο άξονας συμμετρίας και πόση είναι η απόσταση ΡΡ'; β) Αν ένα τετράγωνο έχει κορυφές Α(2, 2), Β(－2, 2), Γ(－2, －2) και Δ(2, －2), ποιοι είναι οι άξονες συμμετρίας του;",
    prob2DiagramCaption: "Σημεία Ρ(4, 3) και Ρ'(－4, 3) συμμετρικά ως προς y'y (απόσταση 8 μονάδες)",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Ανάλυση Συντεταγμένων",
    prob2ColCalc: "Απάντηση",
    prob2Row1Q: "α) Άξονας συμμετρίας Ρ & Ρ'",
    prob2Row1R: "Ίδια τεταγμένη (y ＝ 3), αντίθετες τετμημένες (4 και －4)",
    prob2Row1C: "Άξονας συμμετρίας είναι ο y'y",
    prob2Row2Q: "α) Απόσταση ΡΡ'",
    prob2Row2R: "Καθένα απέχει 4 μονάδες από τον y'y",
    prob2Row2C: "ΡΡ' ＝ 4 ＋ 4 ＝ 8 μονάδες",
    prob2Row3Q: "β) Άξονες τετραγώνου ΑΒΓΔ",
    prob2Row3R: "Κέντρο η αρχή Ο(0, 0), πλευρές παράλληλες στους άξονες",
    prob2Row3C: "Οι άξονες x'x, y'y και οι 2 διαγώνιοι ΑΓ, ΒΔ (4 άξονες)",
    prob2ResSummary: "Απάντηση:",
    prob2ResText: "α) Ο άξονας y'y και ΡΡ' ＝ 8 μονάδες. β) Οι 4 άξονες συμμετρίας του τετραγώνου.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ",
    alert1Title: "Μην μπερδεύετε ποια συντεταγμένη αλλάζει πρόσημο:",
    alert1Desc: "Στον άξονα x'x μένει ίδιο το x και αλλάζει το y: (x, y) → (x, －y). Στον άξονα y'y μένει ίδιο το y και αλλάζει το x: (x, y) → (－x, y).",
    alert2Title: "Σημεία που βρίσκονται πάνω στον άξονα ανάκλασης:",
    alert2Desc: "Ένα σημείο (x, 0) πάνω στον x'x δεν αλλάζει στη συμμετρία ως προς x'x. Αντίστοιχα, ένα σημείο (0, y) πάνω στον y'y δεν αλλάζει στη συμμετρία ως προς y'y.",
    alert3Title: "Δίπλωμα σχήματος (Αναδίπλωση):",
    alert3Desc: "Για να είναι μια ευθεία άξονας συμμετρίας, πρέπει μετά το δίπλωμα τα δύο μέρη του σχήματος να ταυτίζονται πλήρως — όχι απλώς να έχουν ίσο εμβαδόν (όπως συμβαίνει στη διαγώνιο του ορθογωνίου ή του παραλληλογράμμου).",

    // Bottom
    bottomTitle: "Εμπεδώστε την Αξονική Συμμετρία στο Σύστημα Αξόνων!",
    bottomDesc: "Εξασκηθείτε στον υπολογισμό συμμετρικών συντεταγμένων (x, －y) και (－x, y), στην ανάλυση πολυγώνων και στους άξονες συμμετρίας σχημάτων με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Axial Symmetry in the Coordinate System & Folding Shapes | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory on axial symmetry in the Cartesian plane: reflection across the x-axis and y-axis, figure reflections, and folding basic shapes along their axes of symmetry.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 12 • GRADE 7",
    heroTitle: "Axial Symmetry in the Coordinate System & Shapes with Symmetry Axes",
    heroDesc: "Learn how the coordinates of a point M(x, y) transform under reflection across the x-axis or y-axis, and interactively fold basic geometric shapes along their axes of symmetry!",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Reflection of a Point Across the x-Axis (x'x)",
    card1Desc: "When reflecting a point M(x, y) across the horizontal x-axis (x'x), the x-coordinate stays the same while the y-coordinate becomes opposite:",
    card1Formula: "M(x, y)  ──(x-axis)──▶  M₁(x, －y)",
    card1ExampleTitle: "Examples:",
    card1Ex1: "• The reflection of A(3, 4) across the x-axis is A₁(3, －4).",
    card1Ex2: "• The reflection of B(－2, －5) across the x-axis is B₁(－2, 5).",
    card1Ex3: "• If a point K(4, 0) lies on the x-axis, its reflection is K(4, 0) itself.",

    // Card 2
    card2Badge: "2",
    card2Title: "Reflection of a Point Across the y-Axis (y'y)",
    card2Desc: "When reflecting a point M(x, y) across the vertical y-axis (y'y), the y-coordinate stays the same while the x-coordinate becomes opposite:",
    card2Formula: "M(x, y)  ──(y-axis)──▶  M₂(－x, y)",
    card2ExampleTitle: "Examples:",
    card2Ex1: "• The reflection of A(3, 4) across the y-axis is A₂(－3, 4).",
    card2Ex2: "• The reflection of B(－2, －5) across the y-axis is B₂(2, －5).",
    card2Ex3: "• If a point L(0, －3) lies on the y-axis, its reflection is L(0, －3) itself.",

    // Card 3
    card3Badge: "3",
    card3Title: "Reflecting Figures in the Coordinate Plane",
    card3Desc: "To reflect a polygon (e.g., triangle ABC) across the x-axis or y-axis:",
    card3Step1: "1. Compute the reflected coordinates of each vertex A, B, C.",
    card3Step2: "2. Plot the new vertices A', B', C' on the Cartesian plane.",
    card3Step3: "3. Connect the new vertices — the reflected figure A'B'C' is congruent to ABC (preserving side lengths, angles, and area).",

    // Card 4
    card4Badge: "4",
    card4Title: "Shapes with an Axis of Symmetry & Folding",
    card4Desc: "A line (l) is an axis of symmetry of figure F if, when folding the plane along (l), one half of the figure falls directly onto and covers the other half:",
    card4List1: "• 1 Axis: Isosceles triangle, isosceles trapezoid, angle.",
    card4List2: "• 2 Axes: Line segment, rectangle (perpendicular bisectors of sides), rhombus (diagonals).",
    card4List3: "• 3 Axes: Equilateral triangle • 4 Axes: Square.",
    card4List4: "• Infinitely Many Axes: Circle (O, ρ) • 0 Axes: Scalene triangle, general parallelogram.",

    // Interactive Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Part A: Coordinate System & Part B: Folding Basic Shapes",

    labPartATitle: "PART A: REFLECTING POINT M(x, y) IN THE COORDINATE PLANE",
    labSliderX: "x-coordinate of point M",
    labSliderY: "y-coordinate of point M",
    labAxisBtnX: "Across x-axis (x'x)",
    labAxisBtnY: "Across y-axis (y'y)",
    labAxisBtnBoth: "Across both axes",
    labOrigPt: "Original Point M:",
    labSymXPt: "Reflected across x-axis (M₁):",
    labSymYPt: "Reflected across y-axis (M₂):",

    labPartBTitle: "PART B: FOLD BASIC SHAPES ALONG THEIR AXES OF SYMMETRY",
    labSelectShape: "1. SELECT BASIC SHAPE:",
    labSelectAxis: "2. SELECT AXIS OF SYMMETRY:",
    labFoldSlider: "3. FOLDING SLIDER (DRAG TO FOLD THE SHAPE)",
    labFoldStatus0: "Unfolded shape (0%) — Drag the slider right to fold!",
    labFoldStatusMid: "Folding along the selected axis...",
    labFoldStatus100Success: "✓ Perfect overlap (100%)! One half aligns completely onto the other half!",
    labFoldStatus100Fail: "✗ Does not align (100%)! A general parallelogram has NO axis of symmetry!",

    shIsoTri: "Isosceles Triangle",
    axIsoTri1: "Perpendicular bisector of base",

    shEquiTri: "Equilateral Triangle",
    axEquiTri1: "1st Axis (Vertical)",
    axEquiTri2: "2nd Axis (Left vertex)",
    axEquiTri3: "3rd Axis (Right vertex)",

    shRect: "Rectangle",
    axRect1: "1st Axis (Vertical bisector)",
    axRect2: "2nd Axis (Horizontal bisector)",

    shRhombus: "Rhombus",
    axRhombus1: "1st Axis (Vertical diagonal)",
    axRhombus2: "2nd Axis (Horizontal diagonal)",

    shSquare: "Square",
    axSquare1: "1st Axis (Vertical bisector)",
    axSquare2: "2nd Axis (Horizontal bisector)",
    axSquare3: "3rd Axis (1st Diagonal)",
    axSquare4: "4th Axis (2nd Diagonal)",

    shIsoTrap: "Isosceles Trapezoid",
    axIsoTrap1: "Common perpendicular bisector of bases",

    shCircle: "Circle (O, ρ)",
    axCircle1: "Vertical diameter",
    axCircle2: "Horizontal diameter",
    axCircle3: "Slanted diameter (45°)",

    shParallelogram: "Parallelogram (Counterexample)",
    axPara1: "Test vertical line (Not an axis)",
    axPara2: "Test diagonal line (Not an axis)",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: REFLECTED TRIANGLE IN COORDINATE PLANE",
    prob1Title: "Finding coordinates of a triangle reflected across the x-axis and y-axis",
    prob1DescPre: "Given triangle ABC with vertices A(2, 1), B(5, 1), and C(4, 4), find the coordinates of the vertices of: (a) reflected triangle A₁B₁C₁ across the x-axis and (b) reflected triangle A₂B₂C₂ across the y-axis.",
    prob1DiagramCaption: "Original triangle ABC and reflections A₁B₁C₁ (x-axis) and A₂B₂C₂ (y-axis)",
    prob1ColPart: "Question / Vertex",
    prob1ColRule: "Transformation Rule",
    prob1ColCalc: "New Coordinates",
    prob1Row1Q: "(a) Across x-axis (x'x)",
    prob1Row1R: "M(x, y) ──▶ M₁(x, －y)",
    prob1Row1C: "A₁(2, －1), B₁(5, －1), C₁(4, －4)",
    prob1Row2Q: "(b) Across y-axis (y'y)",
    prob1Row2R: "M(x, y) ──▶ M₂(－x, y)",
    prob1Row2C: "A₂(－2, 1), B₂(－5, 1), C₂(－4, 4)",
    prob1ResSummary: "Conclusion:",
    prob1ResText: "Both reflected triangles are congruent to ABC (base 3 units, height 3 units).",

    prob2Badge: "PROBLEM 2: IDENTIFYING SYMMETRY AXIS FROM COORDINATES",
    prob2Title: "Determining the axis of reflection between two points",
    prob2DescPre: "(a) Point P'(－4, 3) is the reflection of point P(4, 3) across one of the coordinate axes. Which axis is the axis of symmetry and what is the distance PP'? (b) If a square has vertices A(2, 2), B(－2, 2), C(－2, －2), and D(2, －2), what are its axes of symmetry?",
    prob2DiagramCaption: "Points P(4, 3) and P'(－4, 3) symmetric across the y-axis (distance 8 units)",
    prob2ColPart: "Question",
    prob2ColRule: "Coordinate Analysis",
    prob2ColCalc: "Answer",
    prob2Row1Q: "(a) Symmetry axis of P & P'",
    prob2Row1R: "Same y-coordinate (y ＝ 3), opposite x-coordinates (4 and －4)",
    prob2Row1C: "The y-axis (y'y) is the axis of symmetry",
    prob2Row2Q: "(a) Distance PP'",
    prob2Row2R: "Each point lies 4 units from the y-axis",
    prob2Row2C: "PP' ＝ 4 ＋ 4 ＝ 8 units",
    prob2Row3Q: "(b) Axes of square ABCD",
    prob2Row3R: "Centered at origin O(0, 0), sides parallel to axes",
    prob2Row3C: "The x-axis, y-axis, and both diagonals AC, BD (4 axes)",
    prob2ResSummary: "Answer:",
    prob2ResText: "(a) The y-axis and PP' ＝ 8 units. (b) All 4 axes of symmetry of the square.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS IN THE COORDINATE SYSTEM",
    alert1Title: "Do not mix up which coordinate changes sign:",
    alert1Desc: "Across the x-axis (x'x), x stays the same and y changes sign: (x, y) → (x, －y). Across the y-axis (y'y), y stays the same and x changes sign: (x, y) → (－x, y).",
    alert2Title: "Points lying ON the axis of reflection:",
    alert2Desc: "A point (x, 0) on the x-axis does not move under reflection across the x-axis. Similarly, (0, y) on the y-axis stays fixed under reflection across the y-axis.",
    alert3Title: "Folding a shape along a line:",
    alert3Desc: "For a line to be an axis of symmetry, folding along it must make the two halves match completely — merely having equal areas (like a rectangle's diagonal) is not enough.",

    // Bottom
    bottomTitle: "Master Axial Symmetry in the Coordinate Plane!",
    bottomDesc: "Practice computing reflected coordinates (x, －y) and (－x, y), analyzing polygons, and identifying symmetry axes with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function SimmetriaSistimaAksononTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const locCode = isEl ? 'el-GR' : 'en-US';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α: Καρτεσιανό Επίπεδο [-5, 5]
  const [ptX, setPtX] = useState(3);
  const [ptY, setPtY] = useState(2);
  const [coordAxisMode, setCoordAxisMode] = useState('both'); // 'x' | 'y' | 'both'

  // State Μέρος Β: Δίπλωμα Βασικών Σχημάτων με Μπάρα
  const [foldShape, setFoldShape] = useState('isoTri');
  const [axisIndex, setAxisIndex] = useState(0);
  const [foldPercent, setFoldPercent] = useState(0); // 0 έως 100

  const formatSigned = (n) => {
    if (n < 0) return `－${Math.abs(n).toLocaleString(locCode)}`;
    return n.toLocaleString(locCode);
  };

  // Μετατροπή καρτεσιανών συντεταγμένων [-5, 5] σε SVG (viewBox 320x240, κέντρο (160, 120), βήμα 20px)
  const cx = 160;
  const cy = 120;
  const unitPx = 20;

  const mx = cx + ptX * unitPx;
  const my = cy - ptY * unitPx;
  const m1x = cx + ptX * unitPx;
  const m1y = cy - -ptY * unitPx; // ως προς x'x: (x, -y)
  const m2x = cx + -ptX * unitPx;
  const m2y = cy - ptY * unitPx; // ως προς y'y: (-x, y)

  const vLbl = isEl
    ? { M: 'Μ', M1: 'Μ₁', M2: 'Μ₂', O: 'Ο' }
    : { M: 'M', M1: 'M₁', M2: 'M₂', O: 'O' };

  // Διαμόρφωση σχημάτων & αξόνων για το διαδραστικό δίπλωμα (Μέρος Β)
  // Σε κάθε σχήμα ορίζουμε: halfA (σταθερό μισό), halfB (μισό που διπλώνει), fullOutline (περίγραμμα) και axes[]
  const foldingConfigs = {
    isoTri: {
      name: t.shIsoTri,
      isSymmetric: true,
      fullOutline: '165,30 95,165 235,165',
      axes: [
        {
          label: t.axIsoTri1,
          x1: 165, y1: 14, x2: 165, y2: 185,
          staticHalf: [[165, 30], [235, 165], [165, 165]],
          foldingHalf: [[165, 30], [95, 165], [165, 165]]
        }
      ]
    },
    equiTri: {
      name: t.shEquiTri,
      isSymmetric: true,
      // Κορυφές ισοπλεύρου: Κορυφή Α(165, 30), Β(95, 151.2), Γ(235, 151.2)
      fullOutline: '165,30 95,151.2 235,151.2',
      axes: [
        {
          label: t.axEquiTri1,
          x1: 165, y1: 14, x2: 165, y2: 175,
          staticHalf: [[165, 30], [235, 151.2], [165, 151.2]],
          foldingHalf: [[165, 30], [95, 151.2], [165, 151.2]]
        },
        {
          label: t.axEquiTri2,
          // Από αριστερή κορυφή Β(95, 151.2) στο μέσο της ΑΓ (200, 90.6)
          x1: 80, y1: 159.9, x2: 222, y2: 77.9,
          staticHalf: [[95, 151.2], [235, 151.2], [200, 90.6]],
          foldingHalf: [[95, 151.2], [165, 30], [200, 90.6]]
        },
        {
          label: t.axEquiTri3,
          // Από δεξιά κορυφή Γ(235, 151.2) στο μέσο της ΑΒ (130, 90.6)
          x1: 250, y1: 159.9, x2: 108, y2: 77.9,
          staticHalf: [[235, 151.2], [95, 151.2], [130, 90.6]],
          foldingHalf: [[235, 151.2], [165, 30], [130, 90.6]]
        }
      ]
    },
    rect: {
      name: t.shRect,
      isSymmetric: true,
      // Ορθογώνιο [85, 245] x [52, 148]
      fullOutline: '85,52 245,52 245,148 85,148',
      axes: [
        {
          label: t.axRect1,
          x1: 165, y1: 24, x2: 165, y2: 176,
          staticHalf: [[165, 52], [245, 52], [245, 148], [165, 148]],
          foldingHalf: [[165, 52], [85, 52], [85, 148], [165, 148]]
        },
        {
          label: t.axRect2,
          x1: 55, y1: 100, x2: 275, y2: 100,
          staticHalf: [[85, 100], [245, 100], [245, 148], [85, 148]],
          foldingHalf: [[85, 100], [245, 100], [245, 52], [85, 52]]
        }
      ]
    },
    rhombus: {
      name: t.shRhombus,
      isSymmetric: true,
      // Ρόμβος κορυφών (165, 26), (245, 100), (165, 174), (85, 100)
      fullOutline: '165,26 245,100 165,174 85,100',
      axes: [
        {
          label: t.axRhombus1,
          x1: 165, y1: 10, x2: 165, y2: 190,
          staticHalf: [[165, 26], [245, 100], [165, 174]],
          foldingHalf: [[165, 26], [85, 100], [165, 174]]
        },
        {
          label: t.axRhombus2,
          x1: 60, y1: 100, x2: 270, y2: 100,
          staticHalf: [[85, 100], [245, 100], [165, 174]],
          foldingHalf: [[85, 100], [245, 100], [165, 26]]
        }
      ]
    },
    square: {
      name: t.shSquare,
      isSymmetric: true,
      // Τετράγωνο [105, 225] x [40, 160]
      fullOutline: '105,40 225,40 225,160 105,160',
      axes: [
        {
          label: t.axSquare1,
          x1: 165, y1: 16, x2: 165, y2: 184,
          staticHalf: [[165, 40], [225, 40], [225, 160], [165, 160]],
          foldingHalf: [[165, 40], [105, 40], [105, 160], [165, 160]]
        },
        {
          label: t.axSquare2,
          x1: 75, y1: 100, x2: 255, y2: 100,
          staticHalf: [[105, 100], [225, 100], [225, 160], [105, 160]],
          foldingHalf: [[105, 100], [225, 100], [225, 40], [105, 40]]
        },
        {
          label: t.axSquare3,
          x1: 85, y1: 20, x2: 245, y2: 180,
          staticHalf: [[105, 40], [225, 160], [105, 160]],
          foldingHalf: [[105, 40], [225, 40], [225, 160]]
        },
        {
          label: t.axSquare4,
          x1: 245, y1: 20, x2: 85, y2: 180,
          staticHalf: [[225, 40], [105, 160], [225, 160]],
          foldingHalf: [[225, 40], [105, 40], [105, 160]]
        }
      ]
    },
    isoTrap: {
      name: t.shIsoTrap,
      isSymmetric: true,
      // Ισοσκελές τραπέζιο (115, 50), (215, 50), (250, 152), (80, 152)
      fullOutline: '115,50 215,50 250,152 80,152',
      axes: [
        {
          label: t.axIsoTrap1,
          x1: 165, y1: 20, x2: 165, y2: 180,
          staticHalf: [[165, 50], [215, 50], [250, 152], [165, 152]],
          foldingHalf: [[165, 50], [115, 50], [80, 152], [165, 152]]
        }
      ]
    },
    circle: {
      name: t.shCircle,
      isSymmetric: true,
      isCircle: true,
      axes: [
        {
          label: t.axCircle1,
          x1: 165, y1: 16, x2: 165, y2: 184,
          angleDeg: 0
        },
        {
          label: t.axCircle2,
          x1: 75, y1: 100, x2: 255, y2: 100,
          angleDeg: 90
        },
        {
          label: t.axCircle3,
          x1: 102, y1: 37, x2: 228, y2: 163,
          angleDeg: 45
        }
      ]
    },
    parallelogram: {
      name: t.shParallelogram,
      isSymmetric: false,
      // Παραλληλόγραμμο (105, 52), (255, 52), (225, 152), (75, 152)
      fullOutline: '105,52 255,52 225,152 75,152',
      axes: [
        {
          label: t.axPara1,
          x1: 165, y1: 22, x2: 165, y2: 180,
          staticHalf: [[165, 52], [255, 52], [225, 152], [165, 152]],
          foldingHalf: [[165, 52], [105, 52], [75, 152], [165, 152]]
        },
        {
          label: t.axPara2,
          x1: 85, y1: 35, x2: 245, y2: 168,
          staticHalf: [[105, 52], [225, 152], [75, 152]],
          foldingHalf: [[105, 52], [255, 52], [225, 152]]
        }
      ]
    }
  };

  const activeFoldCfg = foldingConfigs[foldShape] || foldingConfigs.isoTri;
  const safeAxisIdx = Math.min(axisIndex, activeFoldCfg.axes.length - 1);
  const currentAxis = activeFoldCfg.axes[safeAxisIdx];
  const foldRatio = foldPercent / 100;

  const handleSelectFoldShape = (shKey) => {
    setFoldShape(shKey);
    setAxisIndex(0);
    setFoldPercent(0);
  };

  const handleSelectAxisIdx = (idx) => {
    setAxisIndex(idx);
    setFoldPercent(0);
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/49-simmetria-sistima-aksonon-ask"
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
                href="/a-gymnasiou/49-simmetria-sistima-aksonon-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΣΥΜΜΕΤΡΙΚΟ ΣΗΜΕΙΟΥ ΩΣ ΠΡΟΣ x'x */}
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

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold mb-3">
                {t.card1Formula}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-indigo-900 block">{t.card1ExampleTitle}</strong>
                <div>{t.card1Ex1}</div>
                <div>{t.card1Ex2}</div>
                <div>{t.card1Ex3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΣΥΜΜΕΤΡΙΚΟ ΣΗΜΕΙΟΥ ΩΣ ΠΡΟΣ y'y */}
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

              <div className="bg-emerald-800 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold mb-3">
                {t.card2Formula}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1">
                <strong className="text-emerald-900 block">{t.card2ExampleTitle}</strong>
                <div>{t.card2Ex1}</div>
                <div>{t.card2Ex2}</div>
                <div>{t.card2Ex3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΣΥΜΜΕΤΡΙΚΑ ΣΧΗΜΑΤΩΝ ΣΤΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ */}
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

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 space-y-1.5 leading-relaxed">
                <div>{t.card3Step1}</div>
                <div>{t.card3Step2}</div>
                <div>{t.card3Step3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΣΧΗΜΑΤΑ ΜΕ ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ & ΑΝΑΔΙΠΛΩΣΗ */}
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div>{t.card4List1}</div>
                <div>{t.card4List2}</div>
                <div>{t.card4List3}</div>
                <div>{t.card4List4}</div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              📐 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: ΚΑΡΤΕΣΙΑΝΟ ΣΥΣΤΗΜΑ ΑΞΟΝΩΝ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-4">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartATitle)}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSlider
                    label={t.labSliderX}
                    min={-5}
                    max={5}
                    step={1}
                    value={ptX}
                    onChange={setPtX}
                    unit=""
                    color="#4f46e5"
                    locale={locale}
                  />
                  <CustomSlider
                    label={t.labSliderY}
                    min={-4}
                    max={4}
                    step={1}
                    value={ptY}
                    onChange={setPtY}
                    unit=""
                    color="#059669"
                    locale={locale}
                  />
                </div>

                {/* Επιλογή Άξονα Ανάκλασης */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'x', label: t.labAxisBtnX },
                    { id: 'y', label: t.labAxisBtnY },
                    { id: 'both', label: t.labAxisBtnBoth }
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setCoordAxisMode(btn.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        coordAxisMode === btn.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* SVG Καρτεσιανό Επίπεδο */}
                <div className="bg-slate-950 rounded-2xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 240" className="w-full max-w-sm h-56 select-none">
                    {/* Πλέγμα */}
                    {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map((gx) => (
                      <line
                        key={`gx-${gx}`}
                        x1={cx + gx * unitPx}
                        y1={20}
                        x2={cx + gx * unitPx}
                        y2={220}
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                    ))}
                    {[-4, -3, -2, -1, 1, 2, 3, 4].map((gy) => (
                      <line
                        key={`gy-${gy}`}
                        x1={40}
                        y1={cy - gy * unitPx}
                        x2={280}
                        y2={cy - gy * unitPx}
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                    ))}

                    {/* Άξονες x'x και y'y */}
                    <line
                      x1="32"
                      y1={cy}
                      x2="288"
                      y2={cy}
                      stroke={coordAxisMode === 'x' || coordAxisMode === 'both' ? '#fbbf24' : '#64748b'}
                      strokeWidth={coordAxisMode === 'x' || coordAxisMode === 'both' ? '2.2' : '1.6'}
                    />
                    <line
                      x1={cx}
                      y1="14"
                      x2={cx}
                      y2="226"
                      stroke={coordAxisMode === 'y' || coordAxisMode === 'both' ? '#34d399' : '#64748b'}
                      strokeWidth={coordAxisMode === 'y' || coordAxisMode === 'both' ? '2.2' : '1.6'}
                    />

                    <text x="293" y={cy + 4} className="text-[10px] font-black fill-amber-300">x</text>
                    <text x="20" y={cy + 4} className="text-[10px] font-black fill-amber-300">x'</text>
                    <text x={cx + 5} y="16" className="text-[10px] font-black fill-emerald-300">y</text>
                    <text x={cx + 5} y="234" className="text-[10px] font-black fill-emerald-300">y'</text>
                    <text x={cx - 8} y={cy + 12} textAnchor="end" className="text-[10px] font-bold fill-slate-400">{vLbl.O}</text>

                    {/* Διακεκομμένες γραμμές συμμετρίας */}
                    {(coordAxisMode === 'x' || coordAxisMode === 'both') && (
                      <line x1={mx} y1={my} x2={m1x} y2={m1y} stroke="#fbbf24" strokeWidth="1.4" strokeDasharray="3 3" />
                    )}
                    {(coordAxisMode === 'y' || coordAxisMode === 'both') && (
                      <line x1={mx} y1={my} x2={m2x} y2={m2y} stroke="#34d399" strokeWidth="1.4" strokeDasharray="3 3" />
                    )}

                    {/* Συμμετρικό Μ₁(x, -y) ως προς x'x */}
                    {(coordAxisMode === 'x' || coordAxisMode === 'both') && (
                      <>
                        <circle cx={m1x} cy={m1y} r="4.5" fill="#fbbf24" />
                        <text
                          x={m1x + (ptX >= 0 ? 7 : -7)}
                          y={m1y + (ptY >= 0 ? 13 : -7)}
                          textAnchor={ptX >= 0 ? 'start' : 'end'}
                          className="text-[10px] font-black fill-amber-300"
                        >
                          {vLbl.M1}({formatSigned(ptX)}, {formatSigned(-ptY)})
                        </text>
                      </>
                    )}

                    {/* Συμμετρικό Μ₂(-x, y) ως προς y'y */}
                    {(coordAxisMode === 'y' || coordAxisMode === 'both') && (
                      <>
                        <circle cx={m2x} cy={m2y} r="4.5" fill="#34d399" />
                        <text
                          x={m2x + (-ptX >= 0 ? 7 : -7)}
                          y={m2y + (ptY >= 0 ? -7 : 13)}
                          textAnchor={-ptX >= 0 ? 'start' : 'end'}
                          className="text-[10px] font-black fill-emerald-300"
                        >
                          {vLbl.M2}({formatSigned(-ptX)}, {formatSigned(ptY)})
                        </text>
                      </>
                    )}

                    {/* Αρχικό σημείο Μ(x, y) */}
                    <circle cx={mx} cy={my} r="5" fill="#818cf8" stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={mx + (ptX >= 0 ? 7 : -7)}
                      y={my + (ptY >= 0 ? -7 : 13)}
                      textAnchor={ptX >= 0 ? 'start' : 'end'}
                      className="text-[11px] font-black fill-white"
                    >
                      {vLbl.M}({formatSigned(ptX)}, {formatSigned(ptY)})
                    </text>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-indigo-900 text-white rounded-xl">
                  <span className="text-[10px] text-indigo-200 block font-sans font-bold">{t.labOrigPt}</span>
                  <strong>{vLbl.M}({formatSigned(ptX)}, {formatSigned(ptY)})</strong>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
                  <span className="text-[10px] text-amber-800 block font-sans font-bold">{t.labSymXPt}</span>
                  <strong>{vLbl.M1}({formatSigned(ptX)}, {formatSigned(-ptY)})</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">{t.labSymYPt}</span>
                  <strong>{vLbl.M2}({formatSigned(-ptX)}, {formatSigned(ptY)})</strong>
                </div>
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΔΙΑΔΡΑΣΤΙΚΗ ΔΡΑΣΤΗΡΙΟΤΗΤΑ ΑΝΑΔΙΠΛΩΣΗΣ ΣΧΗΜΑΤΩΝ ΜΕ ΜΠΑΡΑ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartBTitle)}
                </span>

                {/* 1. Επιλογή Βασικού Σχήματος */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectShape)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(foldingConfigs).map(([key, cfg]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectFoldShape(key)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          foldShape === key
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {cfg.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Επιλογή Άξονα Συμμετρίας του Σχήματος */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectAxis)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFoldCfg.axes.map((ax, aIdx) => (
                      <button
                        key={aIdx}
                        type="button"
                        onClick={() => handleSelectAxisIdx(aIdx)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          safeAxisIdx === aIdx
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white hover:bg-rose-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {ax.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Μπάρα Αναδίπλωσης (Folding Slider 0% - 100%) */}
                <CustomSlider
                  label={t.labFoldSlider}
                  min={0}
                  max={100}
                  step={2}
                  value={foldPercent}
                  onChange={setFoldPercent}
                  unit="%"
                  color="#e11d48"
                  locale={locale}
                />

                {/* SVG Καμβάς Διπλώματος Σχήματος */}
                <div className="bg-slate-950 rounded-2xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* Ειδική απεικόνιση για Κύκλο (Ο, ρ) */}
                    {activeFoldCfg.isCircle ? (
                      <g transform={`rotate(${currentAxis.angleDeg || 0}, 165, 100)`}>
                        {/* Αρχικό περίγραμμα */}
                        <circle cx="165" cy="100" r="64" fill="none" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                        {/* Σταθερό δεξί ημικύκλιο */}
                        <path
                          d="M 165,36 A 64,64 0 0,1 165,164 Z"
                          fill="rgba(99, 102, 241, 0.30)"
                          stroke="#818cf8"
                          strokeWidth="2.2"
                        />
                        {/* Διπλούμενο αριστερό ημικύκλιο (κλιμακώνεται οριζόντια με cos(θ)) */}
                        <g transform={`translate(165, 0) scale(${Math.cos(foldRatio * Math.PI)}, 1) translate(-165, 0)`}>
                          <path
                            d="M 165,36 A 64,64 0 0,0 165,164 Z"
                            fill="rgba(16, 185, 129, 0.38)"
                            stroke="#34d399"
                            strokeWidth="2.2"
                          />
                        </g>
                        {/* Άξονας συμμετρίας (διάμετρος) */}
                        <line x1="165" y1="14" x2="165" y2="186" stroke="#fb7185" strokeWidth="2.4" strokeDasharray="5 3" />
                      </g>
                    ) : (
                      <>
                        {/* Αρχικό αχνό περίγραμμα του σχήματος */}
                        <polygon
                          points={activeFoldCfg.fullOutline}
                          fill="none"
                          stroke="#475569"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />

                        {/* Σταθερό μισό (Μπλε) */}
                        <polygon
                          points={currentAxis.staticHalf.map(([x, y]) => `${x},${y}`).join(' ')}
                          fill="rgba(99, 102, 241, 0.30)"
                          stroke="#818cf8"
                          strokeWidth="2.2"
                          strokeLinejoin="round"
                        />

                        {/* Διπλούμενο μισό (Πράσινο - υπολογίζεται δυναμικά με foldPolygonPoints) */}
                        <polygon
                          points={foldPolygonPoints(
                            currentAxis.foldingHalf,
                            currentAxis.x1,
                            currentAxis.y1,
                            currentAxis.x2,
                            currentAxis.y2,
                            foldRatio
                          )}
                          fill="rgba(16, 185, 129, 0.38)"
                          stroke="#34d399"
                          strokeWidth="2.2"
                          strokeLinejoin="round"
                        />

                        {/* Άξονας αναδίπλωσης (Κόκκινο/Ροζ) */}
                        <line
                          x1={currentAxis.x1}
                          y1={currentAxis.y1}
                          x2={currentAxis.x2}
                          y2={currentAxis.y2}
                          stroke="#fb7185"
                          strokeWidth="2.4"
                          strokeDasharray="5 3"
                        />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              {/* Μήνυμα κατάστασης διπλώματος */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold leading-snug ${
                  foldPercent === 100
                    ? activeFoldCfg.isSymmetric
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
              >
                {foldPercent === 0
                  ? t.labFoldStatus0
                  : foldPercent < 100
                  ? `${t.labFoldStatusMid} (${foldPercent}%)`
                  : activeFoldCfg.isSymmetric
                  ? t.labFoldStatus100Success
                  : t.labFoldStatus100Fail}
              </div>
            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ (ΜΕ ΣΧΗΜΑΤΑ) */}
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
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob1DescPre}
                </p>

                {/* Εποπτικό Σχήμα Προβλήματος 1 */}
                <div className="bg-slate-950 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 205" className="w-full max-w-[300px] h-44 select-none">
                    {/* Άξονες */}
                    <line x1="25" y1="100" x2="295" y2="100" stroke="#64748b" strokeWidth="1.6" />
                    <line x1="160" y1="12" x2="160" y2="188" stroke="#64748b" strokeWidth="1.6" />
                    <text x="300" y="103" className="text-[9px] font-bold fill-slate-400">x</text>
                    <text x="165" y="18" className="text-[9px] font-bold fill-slate-400">y</text>

                    {/* Αρχικό Α(2,1), Β(5,1), Γ(4,4) -> scale 16px */}
                    <polygon points="192,84 240,84 224,36" fill="rgba(99, 102, 241, 0.28)" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
                    {/* Ως προς x'x: Α₁(2,-1), Β₁(5,-1), Γ₁(4,-4) */}
                    <polygon points="192,116 240,116 224,164" fill="rgba(251, 191, 36, 0.25)" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
                    {/* Ως προς y'y: Α₂(-2,1), Β₂(-5,1), Γ₂(-4,4) */}
                    <polygon points="128,84 80,84 96,36" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />

                    <text x="232" y="32" className="text-[9px] font-black fill-indigo-300">ΑΒΓ</text>
                    <text x="232" y="174" className="text-[9px] font-black fill-amber-300">Α₁Β₁Γ₁</text>
                    <text x="86" y="32" textAnchor="end" className="text-[9px] font-black fill-emerald-300">Α₂Β₂Γ₂</text>
                  </svg>
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-1">
                    {t.prob1DiagramCaption}
                  </span>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row1Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row1R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[30%]">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b w-[32%]">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b w-[38%]">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row1Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row2Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row2C}</td>
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
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob2DescPre}
                </p>

                {/* Εποπτικό Σχήμα Προβλήματος 2 */}
                <div className="bg-slate-950 rounded-2xl p-3 mb-4 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 320 205" className="w-full max-w-[300px] h-44 select-none">
                    <line x1="25" y1="108" x2="295" y2="108" stroke="#64748b" strokeWidth="1.6" />
                    <line x1="160" y1="12" x2="160" y2="188" stroke="#34d399" strokeWidth="2.2" />
                    <text x="166" y="20" className="text-[9px] font-black fill-emerald-300">y'y</text>

                    {/* Σημεία Ρ(4,3) -> (232, 54) και Ρ'(-4,3) -> (88, 54) */}
                    <line x1="88" y1="54" x2="232" y2="54" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 3" />
                    <circle cx="232" cy="54" r="4" fill="#818cf8" />
                    <circle cx="88" cy="54" r="4" fill="#fbbf24" />
                    <text x="232" y="44" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">Ρ(4, 3)</text>
                    <text x="88" y="44" textAnchor="middle" className="text-[10px] font-black fill-amber-300">Ρ'(－4, 3)</text>
                    <text x="124" y="67" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">4</text>
                    <text x="196" y="67" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">4</text>
                  </svg>
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-1">
                    {t.prob2DiagramCaption}
                  </span>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row1Q}</div>
                    <div className="text-slate-600">{t.prob2Row1R}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row2Q}</div>
                    <div className="text-slate-600">{t.prob2Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row3Q}</div>
                    <div className="text-slate-600">{t.prob2Row3R}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[30%]">{t.prob2ColPart}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob2ColRule}</th>
                        <th className="p-2.5 border-b w-[34%]">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row1Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row3Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row3R}</td>
                        <td className="p-2.5 font-bold text-indigo-700 break-words">{t.prob2Row3C}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800">
                  <strong>{t.prob2ResSummary}</strong> {t.prob2ResText}
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
                    <strong>{t.alert1Title}</strong> {t.alert1Desc}
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
            href="/a-gymnasiou/49-simmetria-sistima-aksonon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
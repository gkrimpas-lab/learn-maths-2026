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

// Επαναχρησιμοποιήσιμο Component Τόξου (Το καμπύλο τόξο τοποθετείται από πάνω)
function Arc({ children, className = "" }) {
  return (
    <span className={`relative inline-block leading-none mx-[1px] ${className}`}>
      <svg
        viewBox="0 0 16 6"
        className="w-[0.95em] h-[0.36em] absolute -top-[0.4em] left-1/2 -translate-x-1/2 text-current overflow-visible pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M1 5 Q8 0.5 15 5" />
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

// Βοηθητική συνάρτηση για SVG τόξο γωνίας / επίκεντρης γωνίας
function describeSectorPath(cx, cy, r, startDeg, endDeg) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy - r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy - r * Math.sin(e);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;
}

function describeArcOnly(cx, cy, r, startDeg, endDeg) {
  const s = (startDeg * Math.PI) / 180;
  const e = (endDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(s);
  const y1 = cy - r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy - r * Math.sin(e);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${largeArc} 0 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Μέτρηση Γωνιών, Μέτρο Τόξου & Γωνίες Τριγώνου/Τετραπλεύρου | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Μαθηματικών Α' Γυμνασίου: μέτρο γωνίας και μονάδες μέτρησης (μοίρες, πρώτα, δεύτερα), σύγκριση, πρόσθεση και αφαίρεση γωνιών, μέτρο τόξου, άθροισμα γωνιών τριγώνου και τετραπλεύρου.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 17 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Μέτρηση Γωνιών • Μέτρο Τόξου & Γωνίες Τριγώνου και Τετραπλεύρου",
    heroDesc: "Γνωρίστε τη μοίρα (1°) και τις υποδιαιρέσεις της, συγκρίνετε, προσθέστε και αφαιρέστε γωνίες με ακρίβεια, ανακαλύψτε τη σχέση επίκεντρης γωνίας και τόξου στον κύκλο (Ο, ρ) και υπολογίστε τις γωνίες κάθε τριγώνου και τετραπλεύρου!",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Μέτρο Γωνίας & Μονάδες Μέτρησης
    card1Badge: "1",
    card1Title: "Μέτρο Γωνίας και Μονάδες Μέτρησης",
    card1Desc: "Μέτρηση μιας γωνίας είναι η σύγκρισή της με μια άλλη γωνία που παίρνουμε ως μονάδα. Ο αριθμός που προκύπτει λέγεται μέτρο της γωνίας (μετριέται με το μοιρογνωμόνιο):",
    card1List1: "• Μονάδα μέτρησης: Η μοίρα (1°), που είναι το 1/90 της ορθής γωνίας (ο κύκλος έχει 360°, η ευθεία γωνία 180°, η ορθή 90°).",
    card1List2: "• Υποδιαιρέσεις (Εξηκονταδικό σύστημα): 1° ＝ 60' (πρώτα λεπτά) και 1' ＝ 60'' (δεύτερα λεπτά), άρα 1° ＝ 3.600''.",
    card1List3: "• Είδη γωνιών: Οξεία (< 90°), Ορθή (＝ 90°), Αμβλεία (> 90° και < 180°), Ευθεία (＝ 180°), Πλήρης (＝ 360°).",

    // Card 2: Σύγκριση, Πρόσθεση & Αφαίρεση Γωνιών
    card2Badge: "2",
    card2Title: "Σύγκριση, Πρόσθεση και Αφαίρεση Γωνιών",
    card2Desc: "Μετατρέποντας τη γεωμετρική σύγκριση σε αριθμητική, μπορούμε να συγκρίνουμε και να εκτελούμε πράξεις με τα μέτρα των γωνιών:",
    card2List1: "• Σύγκριση γωνιών: Δύο γωνίες είναι ίσες όταν έχουν ίσο μέτρο. Αν το μέτρο της μίας είναι μεγαλύτερο, τότε και η γωνία είναι μεγαλύτερη.",
    card2List2: "• Πρόσθεση (σε μοίρες & πρώτα): Προσθέτουμε μοίρες με μοίρες και πρώτα με πρώτα. Αν τα πρώτα γίνουν ≥ 60', αφαιρούμε 60' και προσθέτουμε ＋1° στις μοίρες!",
    card2List3: "• Αφαίρεση: Αν τα πρώτα του μειωτέου είναι μικρότερα από του αφαιρετέου, δανειζόμαστε 1° ＝ 60' από τις μοίρες.",

    // Card 3: Μέτρο Επίκεντρης Γωνίας & Μέτρο Τόξου
    card3Badge: "3",
    card3Title: "Μέτρο Γωνίας και Μέτρο Τόξου",
    card3Desc: "Σε έναν κύκλο (Ο, ρ), κάθε επίκεντρη γωνία αντιστοιχεί σε ένα τόξο του κύκλου:",
    card3List1: "• Μέτρο τόξου: Μέτρο ενός τόξου ΑΒ κύκλου (Ο, ρ) ονομάζεται το μέτρο της αντίστοιχης επίκεντρης γωνίας ΑΟΒ.",
    card3List2: "• Κύκλος & Ημικύκλιο: Όλος ο κύκλος έχει μέτρο 360°, ενώ κάθε ημικύκλιο έχει μέτρο 180°.",
    card3Note: "Στον ίδιο κύκλο (Ο, ρ) ή σε ίσους κύκλους, ίσες επίκεντρες γωνίες βαίνουν σε ίσα τόξα (και αντίστροφα).",

    // Card 4: Υπολογισμός Γωνιών Τριγώνου & Τετραπλεύρου
    card4Badge: "4",
    card4Title: "Υπολογισμός Γωνιών Τριγώνου και Τετραπλεύρου",
    card4Desc: "Γνωρίζοντας το σταθερό άθροισμα των γωνιών ενός τριγώνου ή τετραπλεύρου, μπορούμε να υπολογίσουμε κάθε άγνωστη γωνία του:",
    card4List1: "• Άθροισμα γωνιών τριγώνου ΑΒΓ: Σε ΚΑΘΕ τρίγωνο, το άθροισμα των τριών γωνιών του ισούται με 180°.",
    card4List2: "• Άθροισμα γωνιών τετραπλεύρου ΑΒΓΔ: Επειδή μία διαγώνιος χωρίζει το τετράπλευρο σε 2 τρίγωνα, το άθροισμα των τεσσάρων γωνιών του ισούται με 2 · 180° ＝ 360°.",
    card4Note: "Σε ισοσκελές τρίγωνο οι προσκείμενες στη βάση γωνίες είναι ίσες, ενώ στο ισόπλευρο κάθε γωνία είναι 180° ÷ 3 ＝ 60°.",

    // Interactive Lab
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Μέρος Α: Επίκεντρη Γωνία & Τόξο Κύκλου (Ο, ρ) • Μέρος Β: Πρόσθεση & Αφαίρεση Γωνιών",

    labPartATitle: "ΜΕΡΟΣ Α: ΜΕΤΡΟ ΕΠΙΚΕΝΤΡΗΣ ΓΩΝΙΑΣ ΑΟΒ ΚΑΙ ΜΕΤΡΟ ΤΟΞΟΥ ΑΒ ΣΤΟΝ ΚΥΚΛΟ (Ο, ρ)",
    labArcSlider: "Μέτρο επίκεντρης γωνίας / τόξου",
    labPresetAcute: "Οξεία (45°)",
    labPresetRight: "Ορθή (90°)",
    labPresetObtuse: "Αμβλεία (135°)",
    labPresetSemi: "Ημικύκλιο (180°)",
    labArcCaption: "Μέτρο τόξου ΑΒ ＝ Μέτρο επίκεντρης γωνίας ΑΟΒ",
    labArcStatusAcute: "Οξεία επίκεντρη γωνία (< 90°) — Το τόξο ΑΒ είναι μικρότερο από τέταρτο κύκλου.",
    labArcStatusRight: "Ορθή επίκεντρη γωνία (＝ 90°) — Το τόξο ΑΒ είναι ακριβώς το 1/4 του κύκλου!",
    labArcStatusObtuse: "Αμβλεία επίκεντρη γωνία (90° < γωνία < 180°) — Το τόξο ΑΒ είναι μικρότερο από ημικύκλιο.",
    labArcStatusSemi: "Ευθεία γωνία (＝ 180°) — Το τόξο ΑΒ είναι ακριβώς ένα ΗΜΙΚΥΚΛΙΟ!",
    labArcStatusReflex: "Μη κυρτή γωνία (> 180°) — Το τόξο ΑΒ είναι μεγαλύτερο από ημικύκλιο!",

    labPartBTitle: "ΜΕΡΟΣ Β: ΕΡΓΑΣΤΗΡΙΟ ΣΥΓΚΡΙΣΗΣ, ΠΡΟΣΘΕΣΗΣ & ΑΦΑΙΡΕΣΗΣ ΔΥΟ ΓΩΝΙΩΝ (α, β)",
    labAngleASlider: "Μέτρο 1ης γωνίας (α)",
    labAngleBSlider: "Μέτρο 2ης γωνίας (β)",
    labOpMode: "ΠΡΑΞΗ ΜΕ ΤΙΣ ΓΩΝΙΕΣ:",
    labOpSum: "Πρόσθεση (α ＋ β)",
    labOpDiff: "Αφαίρεση (|α － β|)",
    labStatComp: "Σύγκριση",
    labStatSum: "Άθροισμα α＋β",
    labStatDiff: "Διαφορά |α－β|",
    labStatRemTri: "3η Γωνία Τριγώνου",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΠΡΟΣΘΕΣΗ & ΑΦΑΙΡΕΣΗ ΓΩΝΙΩΝ ΣΕ ΜΟΙΡΕΣ ΚΑΙ ΠΡΩΤΑ",
    prob1Title: "Πράξεις με γωνίες στο εξηκονταδικό σύστημα (° και ')",
    prob1DescPre: "Δίνονται δύο γωνίες με μέτρα α ＝ 48° 45' και β ＝ 26° 35'. Να υπολογίσετε: α) το άθροισμα α ＋ β και β) τη διαφορά α － β.",
    prob1DiagramCaption: "Γωνίες α ＝ 48° 45' και β ＝ 26° 35' • Άθροισμα 75° 20' & Διαφορά 22° 10'",
    prob1ColPart: "Πράξη",
    prob1ColRule: "Βήματα Εξηκονταδικού Συστήματος",
    prob1ColCalc: "Υπολογισμός & Απάντηση",
    prob1Row1Q: "α) Άθροισμα (α ＋ β)",
    prob1Row1R: "48° ＋ 26° ＝ 74° και 45' ＋ 35' ＝ 80'",
    prob1Row1C: "80' ＝ 60' ＋ 20' ＝ 1° 20' ⇒ 74° ＋ 1° 20' ＝ 75° 20'",
    prob1Row2Q: "β) Έλεγχος πρώτων",
    prob1Row2R: "45' ≥ 35' (δεν χρειάζεται δανεισμός 1°)",
    prob1Row2C: "45' － 35' ＝ 10' και 48° － 26° ＝ 22°",
    prob1Row3Q: "β) Διαφορά (α － β)",
    prob1Row3R: "Συνδυασμός μοιρών και πρώτων",
    prob1Row3C: "α － β ＝ 22° 10'",
    prob1ResSummary: "Απάντηση:",
    prob1ResText: "α) Το άθροισμα είναι α ＋ β ＝ 75° 20'. β) Η διαφορά είναι α － β ＝ 22° 10'.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΥΠΟΛΟΓΙΣΜΟΣ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ & ΤΕΤΡΑΠΛΕΥΡΟΥ",
    prob2Title: "Άγνωστες γωνίες σε τρίγωνο και τετράπλευρο",
    prob2DescPre: "α) Σε ένα τρίγωνο ΑΒΓ η γωνία Α είναι 54° και η γωνία Β είναι 78°. Πόσες μοίρες είναι η γωνία Γ; β) Ένα τετράπλευρο ΑΒΓΔ έχει γωνίες Α ＝ 95°, Β ＝ 85° και Γ ＝ 112°. Πόσες μοίρες είναι η τέταρτη γωνία Δ;",
    prob2DiagramCaption: "Τρίγωνο ΑΒΓ (άθροισμα 180° ⇒ Γ ＝ 48°) & Τετράπλευρο ΑΒΓΔ (άθροισμα 360° ⇒ Δ ＝ 68°)",
    prob2ColPart: "Σχήμα / Ερώτημα",
    prob2ColRule: "Ιδιότητα Αθροίσματος Γωνιών",
    prob2ColCalc: "Υπολογισμός & Απάντηση",
    prob2Row1Q: "α) Άθροισμα Α ＋ Β",
    prob2Row1R: "Γνωστές γωνίες τριγώνου ΑΒΓ",
    prob2Row1C: "54° ＋ 78° ＝ 132°",
    prob2Row2Q: "α) 3η γωνία Γ",
    prob2Row2R: "Α ＋ Β ＋ Γ ＝ 180°",
    prob2Row2C: "Γ ＝ 180° － 132° ＝ 48°",
    prob2Row3Q: "β) 4η γωνία Δ",
    prob2Row3R: "Α ＋ Β ＋ Γ ＋ Δ ＝ 360°",
    prob2Row3C: "Δ ＝ 360° － (95° ＋ 85° ＋ 112°) ＝ 360° － 292° ＝ 68°",
    prob2ResSummary: "Απάντηση:",
    prob2ResText: "α) Η γωνία Γ του τριγώνου είναι 48°. β) Η γωνία Δ του τετραπλεύρου είναι 68°.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΗ ΜΕΤΡΗΣΗ ΓΩΝΙΩΝ & ΣΤΑ ΠΟΛΥΓΩΝΑ",
    alert1Title: "1° ＝ 60' (όχι 100'!):",
    alert1Desc: "Οι υποδιαιρέσεις της μοίρας ακολουθούν το εξηκονταδικό σύστημα (όπως τα λεπτά της ώρας). Όταν τα πρώτα φτάσουν ή ξεπεράσουν το 60', μετατρέπουμε κάθε 60' σε ＋1°!",
    alert2Title: "Το μέτρο τόξου ΔΕΝ εξαρτάται από την ακτίνα ρ:",
    alert2Desc: "Μια επίκεντρη γωνία 60° ορίζει τόξο μέτρου 60° τόσο σε έναν μικρό κύκλο (ρ ＝ 2 cm) όσο και σε έναν μεγάλο κύκλο (ρ ＝ 20 cm).",
    alert3Title: "Τρίγωνο (180°) vs Τετράπλευρο (360°):",
    alert3Desc: "Μην μπερδεύετε τα δύο αθροίσματα! Το τρίγωνο έχει 3 γωνίες με άθροισμα 180°, ενώ το τετράπλευρο έχει 4 γωνίες με άθροισμα 360°.",

    // Bottom
    bottomTitle: "Εξασκηθείτε στη Μέτρηση Γωνιών, τα Τόξα και τις Γωνίες Τριγώνου & Τετραπλεύρου!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας στις μοίρες και τα πρώτα, στη σύγκριση, πρόσθεση και αφαίρεση γωνιών, στο μέτρο τόξου και στον υπολογισμό γωνιών τριγώνου και τετραπλεύρου με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Measuring Angles, Arc Measure & Triangle/Quadrilateral Angles | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory: angle measure and units (degrees, minutes, seconds), comparing, adding and subtracting angles, arc measure, triangle and quadrilateral angle sums.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 17 • GRADE 7",
    heroTitle: "Measuring Angles • Arc Measure & Triangle and Quadrilateral Angles",
    heroDesc: "Explore the degree (1°) and its subdivisions, compare, add, and subtract angles accurately, discover the connection between central angles and arcs on a circle (O, ρ), and calculate unknown angles in triangles and quadrilaterals!",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Angle Measure and Units of Measurement",
    card1Desc: "Measuring an angle means comparing it with another angle chosen as the unit. The resulting number is called the measure of the angle (measured with a protractor):",
    card1List1: "• Unit of measurement: The degree (1°), equal to 1/90 of a right angle (a full circle is 360°, a straight angle is 180°, a right angle is 90°).",
    card1List2: "• Subdivisions (Sexagesimal system): 1° ＝ 60' (arcminutes) and 1' ＝ 60'' (arcseconds), so 1° ＝ 3,600''.",
    card1List3: "• Types of angles: Acute (< 90°), Right (＝ 90°), Obtuse (> 90° and < 180°), Straight (＝ 180°), Full (＝ 360°).",

    // Card 2
    card2Badge: "2",
    card2Title: "Comparing, Adding and Subtracting Angles",
    card2Desc: "By turning geometric comparison into arithmetic, we can compare and perform operations with angle measures:",
    card2List1: "• Comparing angles: Two angles are congruent when they have equal measures. If one angle's measure is greater, that angle is larger.",
    card2List2: "• Addition (degrees & minutes): Add degrees with degrees and minutes with minutes. If minutes reach ≥ 60', subtract 60' and carry ＋1° to degrees!",
    card2List3: "• Subtraction: If the minuend's minutes are smaller than the subtrahend's, borrow 1° ＝ 60' from the degrees.",

    // Card 3
    card3Badge: "3",
    card3Title: "Angle Measure and Arc Measure",
    card3Desc: "On a circle (O, ρ), every central angle intercepts a corresponding circular arc:",
    card3List1: "• Arc measure: The degree measure of an arc AB on circle (O, ρ) is defined as the measure of its corresponding central angle AOB.",
    card3List2: "• Full Circle & Semicircle: A full circle measures 360°, while every semicircle measures 180°.",
    card3Note: "In the same circle (O, ρ) or congruent circles, equal central angles intercept equal arcs (and conversely).",

    // Card 4
    card4Badge: "4",
    card4Title: "Calculating Triangle and Quadrilateral Angles",
    card4Desc: "Using the constant angle sum of a triangle or quadrilateral, we can find any unknown interior angle:",
    card4List1: "• Triangle ABC angle sum: In EVERY triangle, the sum of its three interior angles equals 180°.",
    card4List2: "• Quadrilateral ABCD angle sum: Since one diagonal splits a quadrilateral into 2 triangles, the sum of its four interior angles equals 2 · 180° ＝ 360°.",
    card4Note: "In an isosceles triangle the base angles are equal, and in an equilateral triangle each angle is 180° ÷ 3 ＝ 60°.",

    // Interactive Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Part A: Central Angle & Arc on Circle (O, ρ) • Part B: Adding & Subtracting Angles",

    labPartATitle: "PART A: CENTRAL ANGLE AOB AND ARC MEASURE AB ON CIRCLE (O, ρ)",
    labArcSlider: "Central angle / arc measure",
    labPresetAcute: "Acute (45°)",
    labPresetRight: "Right (90°)",
    labPresetObtuse: "Obtuse (135°)",
    labPresetSemi: "Semicircle (180°)",
    labArcCaption: "Measure of arc AB ＝ Measure of central angle AOB",
    labArcStatusAcute: "Acute central angle (< 90°) — Arc AB is shorter than a quarter circle.",
    labArcStatusRight: "Right central angle (＝ 90°) — Arc AB is exactly 1/4 of the circle!",
    labArcStatusObtuse: "Obtuse central angle (90° < angle < 180°) — Arc AB is shorter than a semicircle.",
    labArcStatusSemi: "Straight angle (＝ 180°) — Arc AB is exactly a SEMICIRCLE!",
    labArcStatusReflex: "Reflex angle (> 180°) — Arc AB is longer than a semicircle!",

    labPartBTitle: "PART B: TWO-ANGLE COMPARISON, ADDITION & SUBTRACTION LAB (α, β)",
    labAngleASlider: "Measure of 1st angle (α)",
    labAngleBSlider: "Measure of 2nd angle (β)",
    labOpMode: "ANGLE OPERATION:",
    labOpSum: "Addition (α ＋ β)",
    labOpDiff: "Subtraction (|α － β|)",
    labStatComp: "Comparison",
    labStatSum: "Sum α＋β",
    labStatDiff: "Diff |α－β|",
    labStatRemTri: "3rd Triangle Angle",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: ADDING & SUBTRACTING ANGLES IN DEGREES AND MINUTES",
    prob1Title: "Operating with angles in the sexagesimal system (° and ')",
    prob1DescPre: "Two angles have measures α ＝ 48° 45' and β ＝ 26° 35'. Calculate: (a) their sum α ＋ β and (b) their difference α － β.",
    prob1DiagramCaption: "Angles α ＝ 48° 45' and β ＝ 26° 35' • Sum 75° 20' & Difference 22° 10'",
    prob1ColPart: "Operation",
    prob1ColRule: "Sexagesimal System Steps",
    prob1ColCalc: "Calculation & Answer",
    prob1Row1Q: "(a) Sum (α ＋ β)",
    prob1Row1R: "48° ＋ 26° ＝ 74° and 45' ＋ 35' ＝ 80'",
    prob1Row1C: "80' ＝ 60' ＋ 20' ＝ 1° 20' ⇒ 74° ＋ 1° 20' ＝ 75° 20'",
    prob1Row2Q: "(b) Check minutes",
    prob1Row2R: "45' ≥ 35' (no borrowing of 1° needed)",
    prob1Row2C: "45' － 35' ＝ 10' and 48° － 26° ＝ 22°",
    prob1Row3Q: "(b) Difference (α － β)",
    prob1Row3R: "Combine degrees and minutes",
    prob1Row3C: "α － β ＝ 22° 10'",
    prob1ResSummary: "Answer:",
    prob1ResText: "(a) The sum is α ＋ β ＝ 75° 20'. (b) The difference is α － β ＝ 22° 10'.",

    prob2Badge: "PROBLEM 2: TRIANGLE & QUADRILATERAL ANGLES",
    prob2Title: "Finding unknown angles in a triangle and a quadrilateral",
    prob2DescPre: "(a) In triangle ABC, angle A is 54° and angle B is 78°. How many degrees is angle C? (b) A quadrilateral ABCD has angles A ＝ 95°, B ＝ 85°, and C ＝ 112°. How many degrees is the fourth angle D?",
    prob2DiagramCaption: "Triangle ABC (sum 180° ⇒ C ＝ 48°) & Quadrilateral ABCD (sum 360° ⇒ D ＝ 68°)",
    prob2ColPart: "Figure / Question",
    prob2ColRule: "Angle Sum Property",
    prob2ColCalc: "Calculation & Answer",
    prob2Row1Q: "(a) Sum A ＋ B",
    prob2Row1R: "Known angles of triangle ABC",
    prob2Row1C: "54° ＋ 78° ＝ 132°",
    prob2Row2Q: "(a) 3rd angle C",
    prob2Row2R: "A ＋ B ＋ C ＝ 180°",
    prob2Row2C: "C ＝ 180° － 132° ＝ 48°",
    prob2Row3Q: "(b) 4th angle D",
    prob2Row3R: "A ＋ B ＋ C ＋ D ＝ 360°",
    prob2Row3C: "D ＝ 360° － (95° ＋ 85° ＋ 112°) ＝ 360° － 292° ＝ 68°",
    prob2ResSummary: "Answer:",
    prob2ResText: "(a) Angle C of the triangle is 48°. (b) Angle D of the quadrilateral is 68°.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH ANGLES & POLYGONS",
    alert1Title: "1° ＝ 60' (not 100'!):",
    alert1Desc: "Degree subdivisions follow the base-60 sexagesimal system (just like minutes in an hour). Whenever arcminutes reach or exceed 60', convert every 60' into ＋1°!",
    alert2Title: "Arc degree measure does NOT depend on radius ρ:",
    alert2Desc: "A 60° central angle intercepts a 60° arc on both a small circle (ρ ＝ 2 cm) and a large circle (ρ ＝ 20 cm).",
    alert3Title: "Triangle (180°) vs. Quadrilateral (360°):",
    alert3Desc: "Never mix up the two sums! A triangle has 3 angles summing to 180°, whereas a quadrilateral has 4 angles summing to 360°.",

    // Bottom
    bottomTitle: "Practice Measuring Angles, Arcs, and Triangle & Quadrilateral Angles!",
    bottomDesc: "Test your skills on degrees and arcminutes, comparing, adding, and subtracting angles, arc measures, and finding unknown angles in triangles and quadrilaterals with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function MetrisiGonionTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α: Επίκεντρη Γωνία & Μέτρο Τόξου στον Κύκλο (Ο, ρ)
  const [arcDeg, setArcDeg] = useState(65);

  // State Μέρος Β: Εργαστήριο Σύγκρισης, Πρόσθεσης & Αφαίρεσης Γωνιών
  const [angA, setAngA] = useState(55);
  const [angB, setAngB] = useState(35);
  const [opMode, setOpMode] = useState('sum'); // 'sum' | 'diff'

  // Υπολογισμοί Μέρος Α
  const cxA = 165;
  const cyA = 96;
  const radA = 66;
  const endRad = (arcDeg * Math.PI) / 180;
  const bxA = cxA + radA * Math.cos(endRad);
  const byA = cyA - radA * Math.sin(endRad);

  // Υπολογισμοί Μέρος Β (κεντραρισμένη κορυφή ώστε α + β > 180° να συνεχίζει και κάτω από την ευθεία)
  const angSum = angA + angB;
  const angDiff = Math.abs(angA - angB);
  const compSymbol = angA > angB ? '>' : angA < angB ? '<' : '＝';
  const remTri = angSum < 180 ? `${180 - angSum}°` : '—';

  const cxB = 165;
  const cyB = 96;
  const rayLen = 74;
  const sectorRad = 52;
  const ray1Deg = angA;
  const ray2Deg = opMode === 'sum' ? angA + angB : Math.max(angA, angB);
  const rayLowDeg = Math.min(angA, angB);

  const ptOnRay = (deg, r = rayLen) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: cxB + r * Math.cos(rad),
      y: cyB - r * Math.sin(rad)
    };
  };

  const pRay1 = ptOnRay(ray1Deg);
  const pRay2 = ptOnRay(ray2Deg);
  const pRayLow = ptOnRay(rayLowDeg);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/56-metrisi-gonion-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase(t.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-36 overflow-x-hidden text-slate-800 box-border">
        
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
                href="/a-gymnasiou/56-metrisi-gonion-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΜΕΤΡΟ ΓΩΝΙΑΣ & ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ */}
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div className="break-words [overflow-wrap:anywhere]">{t.card1List1}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card1List2}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card1List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΣΥΓΚΡΙΣΗ, ΠΡΟΣΘΕΣΗ & ΑΦΑΙΡΕΣΗ ΓΩΝΙΩΝ */}
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

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-1.5 leading-relaxed">
                <div className="break-words [overflow-wrap:anywhere]">{t.card2List1}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card2List2}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card2List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΜΕΤΡΟ ΓΩΝΙΑΣ & ΜΕΤΡΟ ΤΟΞΟΥ */}
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

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 mb-3 leading-relaxed">
                <div className="break-words [overflow-wrap:anywhere]">
                  {isEl ? (
                    <>• <strong>Μέτρο τόξου:</strong> Μέτρο ενός τόξου <Arc>ΑΒ</Arc> κύκλου (Ο, ρ) ονομάζεται το μέτρο της αντίστοιχης επίκεντρης γωνίας <Angle>ΑΟΒ</Angle>.</>
                  ) : (
                    <>• <strong>Arc measure:</strong> The degree measure of an arc <Arc>AB</Arc> on circle (O, ρ) equals the measure of its corresponding central angle <Angle>AOB</Angle>.</>
                  )}
                </div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card3List2}</div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.card3Note}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΥΠΟΛΟΓΙΣΜΟΣ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ & ΤΕΤΡΑΠΛΕΥΡΟΥ */}
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

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 space-y-1.5 mb-3 leading-relaxed">
                <div className="break-words [overflow-wrap:anywhere]">
                  {isEl ? (
                    <>• <strong>Άθροισμα γωνιών τριγώνου ΑΒΓ:</strong> Σε ΚΑΘΕ τρίγωνο ισχύει <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°.</>
                  ) : (
                    <>• <strong>Triangle ABC angle sum:</strong> In EVERY triangle, <Angle>A</Angle> ＋ <Angle>B</Angle> ＋ <Angle>C</Angle> ＝ 180°.</>
                  )}
                </div>
                <div className="break-words [overflow-wrap:anywhere]">
                  {isEl ? (
                    <>• <strong>Άθροισμα γωνιών τετραπλεύρου ΑΒΓΔ:</strong> Χωρίζεται σε 2 τρίγωνα, άρα <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＋ <Angle>Δ</Angle> ＝ 360°.</>
                  ) : (
                    <>• <strong>Quadrilateral ABCD angle sum:</strong> Split into 2 triangles, so <Angle>A</Angle> ＋ <Angle>B</Angle> ＋ <Angle>C</Angle> ＋ <Angle>D</Angle> ＝ 360°.</>
                  )}
                </div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-xs sm:text-sm font-medium leading-relaxed break-words [overflow-wrap:anywhere]">
                {t.card4Note}
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
            
            {/* ΜΕΡΟΣ Α: ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ & ΜΕΤΡΟ ΤΟΞΟΥ ΣΤΟΝ ΚΥΚΛΟ (Ο, ρ) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartATitle)}
                </span>

                {/* Προεπιλογές χαρακτηριστικών γωνιών */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { deg: 45, label: t.labPresetAcute },
                    { deg: 90, label: t.labPresetRight },
                    { deg: 135, label: t.labPresetObtuse },
                    { deg: 180, label: t.labPresetSemi }
                  ].map((p) => (
                    <button
                      key={p.deg}
                      type="button"
                      onClick={() => setArcDeg(p.deg)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        arcDeg === p.deg
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Slider μέτρου γωνίας / τόξου */}
                <CustomSlider
                  label={t.labArcSlider}
                  min={15}
                  max={315}
                  step={5}
                  value={arcDeg}
                  onChange={setArcDeg}
                  unit="°"
                  color="#4f46e5"
                  locale={locale}
                />

                {/* SVG Κύκλος (Ο, ρ), επίκεντρη γωνία ΑΟΒ και τόξο ΑΒ */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* Περιφέρεια κύκλου (Ο, ρ) */}
                    <circle cx={cxA} cy={cyA} r={radA} fill="rgba(30, 41, 59, 0.45)" stroke="#475569" strokeWidth="1.6" />

                    {/* Κυκλικός τομέας επίκεντρης γωνίας ΑΟΒ */}
                    <path
                      d={describeSectorPath(cxA, cyA, radA, 0, arcDeg)}
                      fill="rgba(99, 102, 241, 0.28)"
                    />

                    {/* Τόξο ΑΒ τονισμένο με emerald */}
                    <path
                      d={describeArcOnly(cxA, cyA, radA, 0, arcDeg)}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="4.2"
                      strokeLinecap="round"
                    />

                    {/* Εσωτερικό τόξο γωνίας ΑΟΒ */}
                    <path
                      d={describeArcOnly(cxA, cyA, 22, 0, arcDeg)}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                    />

                    {/* Ακτίνες ΟΑ και ΟΒ */}
                    <line x1={cxA} y1={cyA} x2={cxA + radA} y2={cyA} stroke="#a5b4fc" strokeWidth="2" />
                    <line x1={cxA} y1={cyA} x2={bxA} y2={byA} stroke="#a5b4fc" strokeWidth="2" />

                    {/* Σημεία Ο, Α, Β */}
                    <circle cx={cxA} cy={cyA} r="3.5" fill="#fbbf24" />
                    <circle cx={cxA + radA} cy={cyA} r="3.5" fill="#34d399" />
                    <circle cx={bxA} cy={byA} r="3.5" fill="#34d399" />

                    <text x={cxA - 10} y={cyA + 4} textAnchor="end" className="text-[9.5px] font-bold fill-amber-300">
                      {isEl ? 'Ο' : 'O'}
                    </text>
                    <text x={cxA + radA + 8} y={cyA + 4} textAnchor="start" className="text-[9.5px] font-bold fill-emerald-300">
                      {isEl ? 'Α' : 'A'}
                    </text>
                    <text
                      x={bxA + (bxA >= cxA ? 8 : -8)}
                      y={byA + (byA <= cyA ? -5 : 11)}
                      textAnchor={bxA >= cxA ? 'start' : 'end'}
                      className="text-[9.5px] font-bold fill-emerald-300"
                    >
                      {isEl ? 'Β' : 'B'}
                    </text>
                    <text x={cxA + radA / 2} y={cyA + 12} textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-200">
                      ρ
                    </text>

                    <text x="165" y="182" textAnchor="middle" className="text-[10px] font-mono font-bold fill-white">
                      {isEl ? `Γωνία ΑΟΒ ＝ ${arcDeg}° • Τόξο ΑΒ ＝ ${arcDeg}°` : `Angle AOB ＝ ${arcDeg}° • Arc AB ＝ ${arcDeg}°`}
                    </text>
                    <text x="165" y="197" textAnchor="middle" className="text-[8.5px] font-bold fill-slate-400">
                      {t.labArcCaption}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Μήνυμα κατάστασης */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold leading-snug ${
                  arcDeg === 90 || arcDeg === 180
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : arcDeg > 180
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
              >
                {arcDeg < 90
                  ? t.labArcStatusAcute
                  : arcDeg === 90
                  ? t.labArcStatusRight
                  : arcDeg < 180
                  ? t.labArcStatusObtuse
                  : arcDeg === 180
                  ? t.labArcStatusSemi
                  : t.labArcStatusReflex}
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΕΡΓΑΣΤΗΡΙΟ ΣΥΓΚΡΙΣΗΣ, ΠΡΟΣΘΕΣΗΣ & ΑΦΑΙΡΕΣΗΣ ΓΩΝΙΩΝ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartBTitle)}
                </span>

                {/* Sliders γωνιών α και β */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSlider
                    label={t.labAngleASlider}
                    min={15}
                    max={110}
                    step={5}
                    value={angA}
                    onChange={setAngA}
                    unit="°"
                    color="#4f46e5"
                    locale={locale}
                  />
                  <CustomSlider
                    label={t.labAngleBSlider}
                    min={15}
                    max={110}
                    step={5}
                    value={angB}
                    onChange={setAngB}
                    unit="°"
                    color="#059669"
                    locale={locale}
                  />
                </div>

                {/* Επιλογή Πρόσθεσης / Αφαίρεσης */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labOpMode)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { key: 'sum', label: t.labOpSum },
                      { key: 'diff', label: t.labOpDiff }
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setOpMode(m.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          opMode === m.key
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Γεωμετρική Πρόσθεση / Αφαίρεση Γωνιών */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* Βοηθητικός κύκλος-οδηγός για καθαρή οπτικοποίηση άνω & κάτω ημιεπιπέδου */}
                    <circle cx={cxB} cy={cyB} r={sectorRad} fill="rgba(30, 41, 59, 0.35)" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />

                    {/* Βάση ημιευθείας Οx (0°) */}
                    <line x1={cxB} y1={cyB} x2={cxB + rayLen} y2={cyB} stroke="#94a3b8" strokeWidth="2.2" />

                    {opMode === 'sum' ? (
                      <>
                        {/* Τομέας α (indigo) */}
                        <path d={describeSectorPath(cxB, cyB, sectorRad, 0, angA)} fill="rgba(99, 102, 241, 0.38)" />
                        {/* Τομέας β (emerald) συνεχόμενος και κάτω από τις 180° */}
                        <path d={describeSectorPath(cxB, cyB, sectorRad, angA, ray2Deg)} fill="rgba(16, 185, 129, 0.38)" />
                        {/* Εξωτερικό τόξο συνολικού αθροίσματος α + β */}
                        <path
                          d={describeArcOnly(cxB, cyB, sectorRad + 6, 0, ray2Deg)}
                          fill="none"
                          stroke="#fbbf24"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        {/* Κοινή πλευρά */}
                        <line x1={cxB} y1={cyB} x2={pRay1.x} y2={pRay1.y} stroke="#818cf8" strokeWidth="2.2" />
                        {/* Τελική πλευρά αθροίσματος */}
                        <line x1={cxB} y1={cyB} x2={pRay2.x} y2={pRay2.y} stroke="#34d399" strokeWidth="2.4" />
                        <text x="165" y="180" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
                          α ＋ β ＝ {angA}° ＋ {angB}° ＝ {angSum}°
                        </text>
                      </>
                    ) : (
                      <>
                        {/* Μεγαλύτερη γωνία max(α, β) */}
                        <path d={describeSectorPath(cxB, cyB, sectorRad, 0, ray2Deg)} fill="rgba(99, 102, 241, 0.28)" />
                        {/* Διαφορά |α - β| τονισμένη με amber */}
                        <path d={describeSectorPath(cxB, cyB, sectorRad, rayLowDeg, ray2Deg)} fill="rgba(245, 158, 11, 0.45)" />
                        <line x1={cxB} y1={cyB} x2={pRayLow.x} y2={pRayLow.y} stroke="#34d399" strokeWidth="2" strokeDasharray="3 2" />
                        <line x1={cxB} y1={cyB} x2={pRay2.x} y2={pRay2.y} stroke="#fbbf24" strokeWidth="2.4" />
                        <text x="165" y="180" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
                          |α － β| ＝ {Math.max(angA, angB)}° － {Math.min(angA, angB)}° ＝ {angDiff}°
                        </text>
                      </>
                    )}

                    <circle cx={cxB} cy={cyB} r="3.8" fill="#fbbf24" />
                    <text x="165" y="196" textAnchor="middle" className="text-[9px] font-bold fill-slate-300">
                      {isEl
                        ? `Σύγκριση: α (${angA}°) ${compSymbol} β (${angB}°)`
                        : `Comparison: α (${angA}°) ${compSymbol} β (${angB}°)`}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Κάρτες Στοιχείων */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-indigo-900 text-white rounded-xl">
                  <span className="text-[10px] text-indigo-200 block font-sans font-bold">{t.labStatComp}</span>
                  <strong>α {compSymbol} β</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">{t.labStatSum}</span>
                  <strong>{angSum}°</strong>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
                  <span className="text-[10px] text-amber-800 block font-sans font-bold">{t.labStatDiff}</span>
                  <strong>{angDiff}°</strong>
                </div>
                <div className="p-2.5 bg-slate-800 text-white rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sans font-bold">{t.labStatRemTri}</span>
                  <strong>{remTri}</strong>
                </div>
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
                  <svg viewBox="0 0 320 175" className="w-full max-w-[300px] h-40 select-none">
                    {/* Κορυφή Ο στο (82, 134) */}
                    <path d={describeSectorPath(82, 134, 88, 0, 48.75)} fill="rgba(99, 102, 241, 0.34)" />
                    <path d={describeSectorPath(82, 134, 88, 48.75, 75.33)} fill="rgba(16, 185, 129, 0.34)" />
                    <line x1="82" y1="134" x2="215" y2="134" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="82" y1="134" x2="170" y2="34" stroke="#818cf8" strokeWidth="2" />
                    <line x1="82" y1="134" x2="116" y2="12" stroke="#34d399" strokeWidth="2" />
                    <circle cx="82" cy="134" r="3.5" fill="#fbbf24" />
                    <text x="74" y="138" textAnchor="end" className="text-[9px] font-bold fill-amber-300">{isEl ? 'Ο' : 'O'}</text>
                    <text x="155" y="114" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-indigo-300">α ＝ 48° 45&apos;</text>
                    <text x="128" y="64" textAnchor="start" className="text-[8.5px] font-mono font-bold fill-emerald-300">β ＝ 26° 35&apos;</text>

                    {/* Κανόνας μετατροπής δεξιά */}
                    <rect x="195" y="28" width="112" height="72" rx="10" fill="rgba(30, 41, 59, 0.85)" stroke="#475569" strokeWidth="1.2" />
                    <text x="251" y="50" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">1° ＝ 60&apos;</text>
                    <text x="251" y="68" textAnchor="middle" className="text-[8px] font-mono font-bold fill-emerald-300">80&apos; ＝ 1° 20&apos;</text>
                    <text x="251" y="86" textAnchor="middle" className="text-[8px] font-mono font-bold fill-indigo-200">α＋β ＝ 75° 20&apos;</text>
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
                    <div className="text-slate-600">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600">{t.prob1Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[26%]">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob1ColRule}</th>
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
                        <td className="p-2.5 break-words">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row3Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row3C}</td>
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
                  <svg viewBox="0 0 320 175" className="w-full max-w-[300px] h-40 select-none">
                    {/* Τρίγωνο ΑΒΓ αριστερά */}
                    <polygon
                      points="28,128 134,128 102,42"
                      fill="rgba(99, 102, 241, 0.25)"
                      stroke="#818cf8"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <text x="24" y="139" textAnchor="end" className="text-[8.5px] font-bold fill-white">{isEl ? 'Α' : 'A'}</text>
                    <text x="138" y="139" textAnchor="start" className="text-[8.5px] font-bold fill-white">{isEl ? 'Β' : 'B'}</text>
                    <text x="102" y="34" textAnchor="middle" className="text-[8.5px] font-bold fill-white">{isEl ? 'Γ' : 'C'}</text>
                    <text x="52" y="121" textAnchor="middle" className="text-[8px] font-mono font-bold fill-indigo-300">54°</text>
                    <text x="115" y="121" textAnchor="middle" className="text-[8px] font-mono font-bold fill-indigo-300">78°</text>
                    <text x="98" y="64" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">48°</text>

                    {/* Τετράπλευρο ΑΒΓΔ δεξιά */}
                    <polygon
                      points="182,128 282,128 294,46 192,38"
                      fill="rgba(16, 185, 129, 0.24)"
                      stroke="#34d399"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <text x="200" y="120" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-200">95°</text>
                    <text x="266" y="120" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-200">85°</text>
                    <text x="275" y="58" textAnchor="middle" className="text-[7.5px] font-mono font-bold fill-emerald-200">112°</text>
                    <text x="206" y="54" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">68°</text>
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
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row2Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob2Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row3Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob2Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[26%]">{t.prob2ColPart}</th>
                        <th className="p-2.5 border-b w-[34%]">{t.prob2ColRule}</th>
                        <th className="p-2.5 border-b w-[40%]">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row1Q}</td>
                        <td className="p-2.5 break-words">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row2Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob2Row3Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob2Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob2Row3C}</td>
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
            href="/a-gymnasiou/56-metrisi-gonion-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
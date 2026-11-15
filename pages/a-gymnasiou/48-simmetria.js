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
      <span className="border-b border-current px-0.5 sm:px-1 pb-0.5 break-all">
        {num}
      </span>
      <span className="pt-0.5 break-all">
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

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Αξονική Συμμετρία & Συμμετρικά Βασικών Σχημάτων | Θεωρία Α' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία Α' Γυμνασίου για την αξονική συμμετρία: συμμετρία σημείου ως προς άξονα, συμμετρικός μετασχηματισμός σχήματος, ιδιότητες ισομετρίας και άξονες συμμετρίας βασικών γεωμετρικών σχημάτων.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 11 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Αξονική Συμμετρία & Συμμετρικά Βασικών Σχημάτων",
    heroDesc: "Ανακαλύψτε πώς λειτουργεί ο «καθρέφτης» της Γεωμετρίας! Μάθετε πώς βρίσκουμε το συμμετρικό ενός σημείου ή ενός σχήματος ως προς ευθεία (άξονα συμμετρίας), ποιες ιδιότητες διατηρεί ο μετασχηματισμός και πόσους άξονες συμμετρίας έχουν τα βασικά γεωμετρικά σχήματα.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Συμμετρικό Σημείου ως προς Ευθεία (Άξονα)
    card1Badge: "1",
    card1Title: "Συμμετρικό Σημείου ως προς Άξονα (ε)",
    card1Desc: (
      <>
        Έστω μια ευθεία (ε) (ο <strong>άξονας συμμετρίας</strong>) και ένα σημείο Α εκτός της (ε). <strong>Συμμετρικό</strong> του σημείου Α ως προς την ευθεία (ε) ονομάζεται το σημείο Α' τέτοιο ώστε η ευθεία (ε) να είναι η <strong>μεσοκάθετος</strong> του ευθύγραμμου τμήματος ΑΑ':
      </>
    ),
    card1Rule1: "• Καθετότητα: ΑΑ' ⊥ (ε)",
    card1Rule2: "• Ισαπόσταση: ΑΜ ＝ ΜΑ' (όπου Μ το σημείο τομής με την ε)",
    card1SpecialTitle: "Ειδική Περίπτωση:",
    card1SpecialDesc: "Αν ένα σημείο Κ ανήκει πάνω στον άξονα συμμετρίας (ε), τότε το συμμετρικό του είναι ο ίδιος ο εαυτός του (Κ' ≡ Κ)!",

    // Card 2: Συμμετρικός Μετασχηματισμός Σχήματος
    card2Badge: "2",
    card2Title: "Μετασχηματισμός Σχήματος & Ιδιότητες",
    card2Desc: "Το συμμετρικό ενός γεωμετρικού σχήματος Σ ως προς άξονα (ε) είναι το σχήμα Σ' που αποτελείται από τα συμμετρικά όλων των σημείων του Σ ως προς την (ε) (σαν αναδίπλωση κατά μήκος της ευθείας ε).",
    card2PropTitle: "Τι διατηρεί η Αξονική Συμμετρία (Ισομετρία);",
    card2Prop1: "1. Ίσα Τμήματα: Το συμμετρικό ενός τμήματος ΑΒ είναι ένα ίσο τμήμα Α'Β' (Α'Β' ＝ ΑΒ).",
    card2Prop2: (
      <>
        2. Ίσες Γωνίες: Το συμμετρικό μιας γωνίας Α<Angle>Β</Angle>Γ είναι μια ίση γωνία Α'<Angle>Β'</Angle>Γ' (Α'<Angle>Β'</Angle>Γ' ＝ Α<Angle>Β</Angle>Γ).
      </>
    ),
    card2Prop3: "3. Ίσα Σχήματα & Εμβαδά: Τα συμμετρικά σχήματα Σ και Σ' είναι ίσα (έχουν ίδιο σχήμα, ίδια περίμετρο και ίδιο εμβαδόν), αλλά αντίστροφο προσανατολισμό.",

    // Card 3: Άξονας Συμμετρίας Σχήματος & Βασικά Σχήματα (Μέρος Α)
    card3Badge: "3",
    card3Title: "Άξονας Συμμετρίας & Τρίγωνα – Τμήμα",
    card3Desc: "Μια ευθεία (ε) ονομάζεται άξονας συμμετρίας ενός σχήματος Σ, αν το συμμετρικό του Σ ως προς την (ε) ταυτίζεται με το ίδιο το σχήμα Σ:",
    card3Item1Title: "• Ευθύγραμμο Τμήμα ΑΒ:",
    card3Item1Desc: "Έχει 2 άξονες συμμετρίας: τη μεσοκάθετό του (ε) και την ευθεία που το περιέχει.",
    card3Item2Title: "• Γωνία χΟψ:",
    card3Item2Desc: "Έχει 1 άξονα συμμετρίας: την ευθεία της διχοτόμου της.",
    card3Item3Title: "• Ισοσκελές Τρίγωνο (όχι ισόπλευρο):",
    card3Item3Desc: "Έχει 1 άξονα συμμετρίας: τη μεσοκάθετο της βάσης του (που περιέχει το ύψος, τη διάμεσο και τη διχοτόμο της κορυφής).",
    card3Item4Title: "• Ισόπλευρο Τρίγωνο:",
    card3Item4Desc: "Έχει 3 άξονες συμμετρίας: τις μεσοκαθέτους των τριών πλευρών του.",

    // Card 4: Άξονες Συμμετρίας Τετραπλεύρων & Κύκλου (Μέρος Β)
    card4Badge: "4",
    card4Title: "Άξονες Συμμετρίας Τετραπλεύρων & Κύκλου",
    card4Desc: "Ο αριθμός των αξόνων συμμετρίας των τετραπλεύρων και του κύκλου συνοψίζεται παρακάτω:",
    card4Item1Title: "• Ισοσκελές Τραπέζιο:",
    card4Item1Desc: "Έχει 1 άξονα συμμετρίας (την κοινή μεσοκάθετο των δύο βάσεών του).",
    card4Item2Title: "• Ορθογώνιο (όχι τετράγωνο):",
    card4Item2Desc: "Έχει 2 άξονες συμμετρίας (τις μεσοκαθέτους των απέναντι πλευρών του — ΠΡΟΣΟΧΗ: όχι τις διαγωνίους!).",
    card4Item3Title: "• Ρόμβος (όχι τετράγωνο):",
    card4Item3Desc: "Έχει 2 άξονες συμμετρίας (τις ευθείες των δύο διαγωνίων του).",
    card4Item4Title: "• Τετράγωνο:",
    card4Item4Desc: "Έχει 4 άξονες συμμετρίας (τις 2 μεσοκαθέτους των πλευρών και τις 2 διαγωνίους του).",
    card4Item5Title: "• Κύκλος (Ο, ρ):",
    card4Item5Desc: "Έχει άπειρους άξονες συμμετρίας (κάθε ευθεία που διέρχεται από το κέντρο Ο, δηλαδή κάθε φορέας διαμέτρου).",

    // Interactive Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΑΞΟΝΙΚΗΣ ΣΥΜΜΕΤΡΙΑΣ",
    labTitle: "Διαδραστική Εξερεύνηση Συμμετρίας & Αξόνων Σχημάτων",
    labPart1Title: "ΜΕΡΟΣ Α: ΣΥΜΜΕΤΡΙΚΟ ΤΡΙΓΩΝΟΥ ΑΒΓ ΩΣ ΠΡΟΣ ΑΞΟΝΑ (ε)",
    labSliderDist: "Απόσταση κορυφής Β από τον άξονα (ε)",
    labPart1Summary: "Ιδιότητα Ανάκλασης:",
    labPart1Text: "Κάθε κορυφή Α, Β, Γ απέχει από τον άξονα (ε) ακριβώς την ίδια απόσταση με την αντίστοιχη συμμετρική της Α', Β', Γ', και τα τμήματα ΑΑ', ΒΒ', ΓΓ' είναι κάθετα στον άξονα (ε).",
    labPart2Title: "ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΣΗ ΑΞΟΝΩΝ ΣΥΜΜΕΤΡΙΑΣ ΣΧΗΜΑΤΩΝ",
    shapeIsoTri: "Ισοσκελές Τρίγωνο (1 άξονας)",
    shapeEquiTri: "Ισόπλευρο Τρίγωνο (3 άξονες)",
    shapeRect: "Ορθογώνιο (2 άξονες)",
    shapeRhombus: "Ρόμβος (2 άξονες)",
    shapeSquare: "Τετράγωνο (4 άξονες)",
    shapeIsoTrap: "Ισοσκελές Τραπέζιο (1 άξονας)",
    shapeParallelogram: "Γενικό Παραλληλόγραμμο (0 άξονες)",
    shapeCircle: "Κύκλος (Άπειροι άξονες)",
    labAxesCountLabel: "ΠΛΗΘΟΣ ΑΞΟΝΩΝ ΣΥΜΜΕΤΡΙΑΣ:",
    labAxesDescLabel: "ΠΕΡΙΓΡΑΦΗ ΑΞΟΝΩΝ:",

    // Part B dynamic texts
    axesIsoTriCount: "1 άξονας συμμετρίας",
    axesIsoTriDesc: "Η μεσοκάθετος της βάσης ΒΓ (που περιέχει το ύψος, τη διάμεσο και τη διχοτόμο της γωνίας κορυφής Α).",
    axesEquiTriCount: "3 άξονες συμμετρίας",
    axesEquiTriDesc: "Οι 3 μεσοκάθετοι των πλευρών του (που ταυτίζονται με τα 3 ύψη, τις 3 διαμέσους και τις 3 διχοτόμους).",
    axesRectCount: "2 άξονες συμμετρίας",
    axesRectDesc: "Οι 2 μεσοκάθετοι των απέναντι πλευρών του (οι διαγώνιοι ΔΕΝ είναι άξονες συμμετρίας στο ορθογώνιο!).",
    axesRhombusCount: "2 άξονες συμμετρίας",
    axesRhombusDesc: "Οι ευθείες των 2 διαγωνίων του (ΑΓ και ΒΔ).",
    axesSquareCount: "4 άξονες συμμετρίας",
    axesSquareDesc: "Οι 2 μεσοκάθετοι των απέναντι πλευρών ΚΑΙ οι 2 ευθείες των διαγωνίων του.",
    axesIsoTrapCount: "1 άξονας συμμετρίας",
    axesIsoTrapDesc: "Η κοινή μεσοκάθετος των δύο παράλληλων βάσεών του.",
    axesParaCount: "0 άξονες συμμετρίας",
    axesParaDesc: "Ένα γενικό (πλάγιο) παραλληλόγραμμο δεν έχει κανέναν άξονα συμμετρίας (ούτε οι διαγώνιοι ούτε οι μεσοκάθετοι διπλώνουν το σχήμα πάνω στον εαυτό του).",
    axesCircleCount: "Άπειροι άξονες συμμετρίας",
    axesCircleDesc: "Κάθε ευθεία που περνά από το κέντρο Ο του κύκλου (Ο, ρ) είναι άξονας συμμετρίας του.",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΣΥΜΜΕΤΡΙΚΟ ΤΡΙΓΩΝΟ ΩΣ ΠΡΟΣ ΑΞΟΝΑ",
    prob1Title: "Υπολογισμός πλευρών και γωνιών συμμετρικού τριγώνου",
    prob1DescPre: (
      <>
        Το τρίγωνο Α'Β'Γ' είναι το συμμετρικό του τριγώνου ΑΒΓ ως προς έναν άξονα συμμετρίας (ε). Αν γνωρίζουμε ότι ΑΒ ＝ 7 cm, ΒΓ ＝ 9 cm, <Angle>Α</Angle> ＝ 62° και <Angle>Β</Angle> ＝ 48°, να βρεθούν: α) τα μήκη Α'Β' και Β'Γ' και β) το μέτρο της γωνίας <Angle>Γ'</Angle>.
      </>
    ),
    prob1DiagramCaption: "Συμμετρικά τρίγωνα ΑΒΓ και Α'Β'Γ' ως προς άξονα (ε)",
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Ιδιότητα Αξονικής Συμμετρίας",
    prob1ColCalc: "Υπολογισμός / Απάντηση",
    prob1Row1Q: "α) Πλευρές Α'Β' & Β'Γ'",
    prob1Row1R: "Η αξονική συμμετρία διατηρεί τα μήκη των τμημάτων",
    prob1Row1C: "Α'Β' ＝ ΑΒ ＝ 7 cm και Β'Γ' ＝ ΒΓ ＝ 9 cm",
    prob1Row2Q: (
      <>
        β) Γωνία <Angle>Γ</Angle> αρχικού τριγώνου
      </>
    ),
    prob1Row2R: (
      <>
        <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°
      </>
    ),
    prob1Row2C: (
      <>
        <Angle>Γ</Angle> ＝ 180° － (62° ＋ 48°) ＝ 70°
      </>
    ),
    prob1Row3Q: (
      <>
        β) Συμμετρική γωνία <Angle>Γ'</Angle>
      </>
    ),
    prob1Row3R: "Η αξονική συμμετρία διατηρεί τα μέτρα των γωνιών",
    prob1Row3C: (
      <>
        <Angle>Γ'</Angle> ＝ <Angle>Γ</Angle> ＝ 70°
      </>
    ),
    prob1ResSummary: "Απάντηση:",
    prob1ResText: (
      <>
        Α'Β' ＝ 7 cm, Β'Γ' ＝ 9 cm και <Angle>Γ'</Angle> ＝ 70°.
      </>
    ),

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΜΕΣΟΚΑΘΕΤΟΣ ΩΣ ΑΞΟΝΑΣ ΣΥΜΜΕΤΡΙΑΣ",
    prob2Title: "Εφαρμογή συμμετρίας σημείου ως προς ευθεία (ε)",
    prob2DescPre: "Το σημείο Α' είναι το συμμετρικό του σημείου Α ως προς ευθεία (ε), και το τμήμα ΑΑ' τέμνει την (ε) στο σημείο Μ. Αν ΑΜ ＝ 4,5 cm και Κ είναι ένα σημείο πάνω στην ευθεία (ε) ώστε ΚΑ ＝ 6 cm, να βρεθούν: α) το μήκος του τμήματος ΑΑ' και β) το μήκος του τμήματος ΚΑ'.",
    prob2DiagramCaption: "Η (ε) είναι μεσοκάθετος του ΑΑ' (ΑΜ ＝ ΜΑ' ＝ 4,5 cm, ΚΑ ＝ ΚΑ' ＝ 6 cm)",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Ιδιότητα Μεσοκαθέτου",
    prob2ColCalc: "Υπολογισμός / Απάντηση",
    prob2Row1Q: "α) Μήκος ΑΑ'",
    prob2Row1R: "Η (ε) είναι μεσοκάθετος του ΑΑ', άρα ΜΑ' ＝ ΑΜ",
    prob2Row1C: "ΑΑ' ＝ 2 · 4,5 ＝ 9 cm",
    prob2Row2Q: "β) Μήκος ΚΑ'",
    prob2Row2R: "Κάθε σημείο Κ της μεσοκαθέτου (ε) ισαπέχει από τα άκρα Α και Α'",
    prob2Row2C: "ΚΑ' ＝ ΚΑ ＝ 6 cm",
    prob2ResSummary: "Συμπέρασμα:",
    prob2ResText: "ΑΑ' ＝ 9 cm και ΚΑ' ＝ 6 cm.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΗΝ ΑΞΟΝΙΚΗ ΣΥΜΜΕΤΡΙΑ",
    alert1Title: "Οι διαγώνιοι του ορθογωνίου ΔΕΝ είναι άξονες συμμετρίας:",
    alert1Desc: "Αν διπλώσετε ένα ορθογώνιο (που δεν είναι τετράγωνο) κατά μήκος της διαγωνίου του, οι κορυφές δεν συμπίπτουν! Άξονες συμμετρίας του ορθογωνίου είναι μόνο οι 2 μεσοκάθετοι των πλευρών του.",
    alert2Title: "Το γενικό παραλληλόγραμμο έχει 0 άξονες συμμετρίας:",
    alert2Desc: "Ένα πλάγιο παραλληλόγραμμο δεν έχει κανέναν άξονα συμμετρίας (άξονες συμμετρίας αποκτά μόνο όταν γίνει ορθογώνιο, ρόμβος ή τετράγωνο).",
    alert3Title: "Συμμετρικό σημείου που βρίσκεται ΠΑΝΩ στον άξονα:",
    alert3Desc: "Αν ένα σημείο ανήκει στην ευθεία (ε), το συμμετρικό του δεν μετακινείται: είναι το ίδιο σημείο.",
    alert4Title: "Ο κύκλος έχει άπειρους άξονες συμμετρίας (όχι μόνο 2 ή 4):",
    alert4Desc: "Κάθε ευθεία που περνά από το κέντρο Ο του κύκλου είναι άξονας συμμετρίας του.",

    // Bottom
    bottomTitle: "Εμπεδώστε την Αξονική Συμμετρία στην Πράξη!",
    bottomDesc: "Εξασκηθείτε στη συμμετρία σημείων και σχημάτων ως προς άξονα, στις ιδιότητες ισομετρίας και στους άξονες συμμετρίας βασικών σχημάτων με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Axial Symmetry & Symmetry Axes of Basic Shapes | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory on axial (line) symmetry: symmetric point across a line, symmetric figure transformation, isometry properties, and axes of symmetry of basic geometric shapes.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 11 • GRADE 7",
    heroTitle: "Axial Symmetry & Symmetry Axes of Basic Shapes",
    heroDesc: "Discover how Geometry's mirror works! Learn how to find the reflection of a point or figure across a line (axis of symmetry), what properties are preserved, and how many axes of symmetry basic shapes have.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Reflection of a Point Across an Axis (l)",
    card1Desc: "Given a line (l) (the axis of symmetry) and a point A not on (l), the symmetric point (reflection) of A across (l) is the point A' such that (l) is the perpendicular bisector of segment AA':",
    card1Rule1: "• Perpendicularity: AA' ⊥ (l)",
    card1Rule2: "• Equidistance: AM ＝ MA' (where M is the intersection with l)",
    card1SpecialTitle: "Special Case:",
    card1SpecialDesc: "If a point K lies directly on the axis of symmetry (l), then its reflection is the point itself (K' ≡ K)!",

    // Card 2
    card2Badge: "2",
    card2Title: "Figure Transformation & Properties",
    card2Desc: "The reflection of a geometric figure F across axis (l) is the figure F' formed by reflecting every point of F across (l) (like folding along line l).",
    card2PropTitle: "What does Axial Symmetry Preserve (Isometry)?",
    card2Prop1: "1. Equal Segments: The reflection of segment AB is a congruent segment A'B' (A'B' ＝ AB).",
    card2Prop2: "2. Equal Angles: The reflection of angle ∠ABC is a congruent angle ∠A'B'C' (∠A'B'C' ＝ ∠ABC).",
    card2Prop3: "3. Congruent Figures & Areas: Symmetric figures F and F' are congruent (same shape, perimeter, and area), with reversed orientation.",

    // Card 3
    card3Badge: "3",
    card3Title: "Axis of Symmetry: Segments, Angles & Triangles",
    card3Desc: "A line (l) is an axis of symmetry of figure F if reflecting F across (l) maps F onto itself:",
    card3Item1Title: "• Line Segment AB:",
    card3Item1Desc: "Has 2 axes of symmetry: its perpendicular bisector (l) and the line containing AB.",
    card3Item2Title: "• Angle ∠xOy:",
    card3Item2Desc: "Has 1 axis of symmetry: the line containing its angle bisector.",
    card3Item3Title: "• Isosceles Triangle (non-equilateral):",
    card3Item3Desc: "Has 1 axis of symmetry: the perpendicular bisector of its base (containing the altitude, median, and vertex angle bisector).",
    card3Item4Title: "• Equilateral Triangle:",
    card3Item4Desc: "Has 3 axes of symmetry: the perpendicular bisectors of its three sides.",

    // Card 4
    card4Badge: "4",
    card4Title: "Axes of Symmetry: Quadrilaterals & Circle",
    card4Desc: "The number of symmetry axes for quadrilaterals and circles is summarized below:",
    card4Item1Title: "• Isosceles Trapezoid:",
    card4Item1Desc: "Has 1 axis of symmetry (the common perpendicular bisector of its two parallel bases).",
    card4Item2Title: "• Rectangle (non-square):",
    card4Item2Desc: "Has 2 axes of symmetry (the perpendicular bisectors of opposite sides — CAUTION: NOT the diagonals!).",
    card4Item3Title: "• Rhombus (non-square):",
    card4Item3Desc: "Has 2 axes of symmetry (the lines containing its two diagonals).",
    card4Item4Title: "• Square:",
    card4Item4Desc: "Has 4 axes of symmetry (the 2 perpendicular bisectors of opposite sides AND the 2 diagonal lines).",
    card4Item5Title: "• Circle (O, ρ):",
    card4Item5Desc: "Has infinitely many axes of symmetry (every line passing through center O).",

    // Interactive Lab
    labBadge: "AXIAL SYMMETRY LAB",
    labTitle: "Interactive Reflection & Symmetry Axes Explorer",
    labPart1Title: "PART A: REFLECTION OF TRIANGLE ABC ACROSS AXIS (l)",
    labSliderDist: "Distance of vertex B from axis (l)",
    labPart1Summary: "Reflection Property:",
    labPart1Text: "Each vertex A, B, C is at the exact same distance from axis (l) as its reflection A', B', C', and segments AA', BB', CC' are perpendicular to (l).",
    labPart2Title: "PART B: EXPLORING AXES OF SYMMETRY OF SHAPES",
    shapeIsoTri: "Isosceles Triangle (1 axis)",
    shapeEquiTri: "Equilateral Triangle (3 axes)",
    shapeRect: "Rectangle (2 axes)",
    shapeRhombus: "Rhombus (2 axes)",
    shapeSquare: "Square (4 axes)",
    shapeIsoTrap: "Isosceles Trapezoid (1 axis)",
    shapeParallelogram: "General Parallelogram (0 axes)",
    shapeCircle: "Circle (Infinitely many axes)",
    labAxesCountLabel: "NUMBER OF SYMMETRY AXES:",
    labAxesDescLabel: "DESCRIPTION OF AXES:",

    axesIsoTriCount: "1 axis of symmetry",
    axesIsoTriDesc: "The perpendicular bisector of base BC (containing the altitude, median, and vertex angle bisector).",
    axesEquiTriCount: "3 axes of symmetry",
    axesEquiTriDesc: "The 3 perpendicular bisectors of its sides (coinciding with the 3 altitudes, medians, and angle bisectors).",
    axesRectCount: "2 axes of symmetry",
    axesRectDesc: "The 2 perpendicular bisectors of opposite sides (the diagonals are NOT axes of symmetry in a rectangle!).",
    axesRhombusCount: "2 axes of symmetry",
    axesRhombusDesc: "The lines containing its 2 diagonals (AC and BD).",
    axesSquareCount: "4 axes of symmetry",
    axesSquareDesc: "The 2 perpendicular bisectors of opposite sides AND the 2 diagonal lines.",
    axesIsoTrapCount: "1 axis of symmetry",
    axesIsoTrapDesc: "The common perpendicular bisector of its two parallel bases.",
    axesParaCount: "0 axes of symmetry",
    axesParaDesc: "A general (slanted) parallelogram has no axes of symmetry.",
    axesCircleCount: "Infinitely many axes of symmetry",
    axesCircleDesc: "Every line passing through the center O of circle (O, ρ) is an axis of symmetry.",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: REFLECTED TRIANGLE ACROSS AN AXIS",
    prob1Title: "Computing sides and angles of a reflected triangle",
    prob1DescPre: "Triangle A'B'C' is the reflection of triangle ABC across an axis of symmetry (l). Given AB ＝ 7 cm, BC ＝ 9 cm, ∠A ＝ 62°, and ∠B ＝ 48°, find: (a) lengths A'B' and B'C' and (b) the measure of angle ∠C'.",
    prob1DiagramCaption: "Symmetric triangles ABC and A'B'C' across axis (l)",
    prob1ColPart: "Question",
    prob1ColRule: "Axial Symmetry Property",
    prob1ColCalc: "Calculation / Answer",
    prob1Row1Q: "(a) Sides A'B' & B'C'",
    prob1Row1R: "Axial symmetry preserves segment lengths",
    prob1Row1C: "A'B' ＝ AB ＝ 7 cm and B'C' ＝ BC ＝ 9 cm",
    prob1Row2Q: "(b) Original angle ∠C",
    prob1Row2R: "∠A ＋ ∠B ＋ ∠C ＝ 180°",
    prob1Row2C: "∠C ＝ 180° － (62° ＋ 48°) ＝ 70°",
    prob1Row3Q: "(b) Reflected angle ∠C'",
    prob1Row3R: "Axial symmetry preserves angle measures",
    prob1Row3C: "∠C' ＝ ∠C ＝ 70°",
    prob1ResSummary: "Answer:",
    prob1ResText: "A'B' ＝ 7 cm, B'C' ＝ 9 cm, and ∠C' ＝ 70°.",

    prob2Badge: "PROBLEM 2: PERPENDICULAR BISECTOR AS SYMMETRY AXIS",
    prob2Title: "Applying point reflection across line (l)",
    prob2DescPre: "Point A' is the reflection of point A across line (l), and segment AA' intersects (l) at point M. If AM ＝ 4.5 cm and K is a point on line (l) such that KA ＝ 6 cm, find: (a) the length of segment AA' and (b) the length of segment KA'.",
    prob2DiagramCaption: "Line (l) is the perpendicular bisector of AA' (AM ＝ MA' ＝ 4.5 cm, KA ＝ KA' ＝ 6 cm)",
    prob2ColPart: "Question",
    prob2ColRule: "Perpendicular Bisector Property",
    prob2ColCalc: "Calculation / Answer",
    prob2Row1Q: "(a) Length AA'",
    prob2Row1R: "Line (l) is the perpendicular bisector of AA', so MA' ＝ AM",
    prob2Row1C: "AA' ＝ 2 · 4.5 ＝ 9 cm",
    prob2Row2Q: "(b) Length KA'",
    prob2Row2R: "Every point K on perpendicular bisector (l) is equidistant from A and A'",
    prob2Row2C: "KA' ＝ KA ＝ 6 cm",
    prob2ResSummary: "Conclusion:",
    prob2ResText: "AA' ＝ 9 cm and KA' ＝ 6 cm.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH AXIAL SYMMETRY",
    alert1Title: "Diagonals of a rectangle are NOT axes of symmetry:",
    alert1Desc: "Folding a non-square rectangle along a diagonal does not align its vertices! A rectangle's axes of symmetry are only the 2 perpendicular bisectors of its sides.",
    alert2Title: "A general parallelogram has 0 axes of symmetry:",
    alert2Desc: "A slanted parallelogram has no axes of symmetry unless it is a rectangle, rhombus, or square.",
    alert3Title: "Reflection of a point ON the axis:",
    alert3Desc: "If a point lies on line (l), its reflection does not move: it is the exact same point.",
    alert4Title: "A circle has infinitely many axes of symmetry (not just 2 or 4):",
    alert4Desc: "Every line passing through center O is an axis of symmetry of the circle.",

    // Bottom
    bottomTitle: "Master Axial Symmetry in Practice!",
    bottomDesc: "Practice point and figure reflections across a line, isometry properties, and axes of symmetry of basic shapes with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function SimmetriaTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α (Απόσταση κορυφής Β από άξονα x = 165) & Μέρος Β (Επιλογή βασικού σχήματος)
  const [distB, setDistB] = useState(55);
  const [selectedShape, setSelectedShape] = useState('isoTri');

  const vLbl = isEl
    ? { A: 'Α', B: 'Β', C: 'Γ', Ap: "Α'", Bp: "Β'", Cp: "Γ'", M: 'Μ', K: 'Κ', O: 'Ο' }
    : { A: 'A', B: 'B', C: 'C', Ap: "A'", Bp: "B'", Cp: "C'", M: 'M', K: 'K', O: 'O' };

  // Συντεταγμένες για Μέρος Α (άξονας x = 165)
  const axisX = 165;
  const Ax = 115;
  const Ay = 52;
  const Bx = axisX - distB;
  const By = 112;
  const Cx = 128;
  const Cy = 172;

  const Apx = 2 * axisX - Ax;
  const Bpx = 2 * axisX - Bx;
  const Cpx = 2 * axisX - Cx;

  // Δεδομένα για Μέρος Β (Άξονες συμμετρίας βασικών σχημάτων)
  const shapeInfo = {
    isoTri: { count: t.axesIsoTriCount, desc: t.axesIsoTriDesc },
    equiTri: { count: t.axesEquiTriCount, desc: t.axesEquiTriDesc },
    rect: { count: t.axesRectCount, desc: t.axesRectDesc },
    rhombus: { count: t.axesRhombusCount, desc: t.axesRhombusDesc },
    square: { count: t.axesSquareCount, desc: t.axesSquareDesc },
    isoTrap: { count: t.axesIsoTrapCount, desc: t.axesIsoTrapDesc },
    parallelogram: { count: t.axesParaCount, desc: t.axesParaDesc },
    circle: { count: t.axesCircleCount, desc: t.axesCircleDesc }
  };

  const activeInfo = shapeInfo[selectedShape] || shapeInfo.isoTri;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/48-simmetria-ask"
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
                href="/a-gymnasiou/48-simmetria-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΣΥΜΜΕΤΡΙΚΟ ΣΗΜΕΙΟΥ ΩΣ ΠΡΟΣ ΑΞΟΝΑ */}
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

              {/* Εποπτικό Σχήμα Συμμετρικού Σημείου */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 180 130" className="w-40 h-28 shrink-0">
                  {/* Άξονας (ε) */}
                  <line x1="90" y1="10" x2="90" y2="120" stroke="#e11d48" strokeWidth="2.2" />
                  <text x="96" y="18" className="text-[11px] font-black fill-rose-700">({isEl ? 'ε' : 'l'})</text>
                  {/* Τμήμα ΑΑ' */}
                  <line x1="35" y1="65" x2="145" y2="65" stroke="#4f46e5" strokeWidth="2" strokeDasharray="4 3" />
                  {/* Ορθή γωνία */}
                  <polyline points="90,55 100,55 100,65" fill="none" stroke="#e11d48" strokeWidth="1.6" />
                  {/* Τικ ισότητας ΑΜ = ΜΑ' */}
                  <line x1="62" y1="60" x2="62" y2="70" stroke="#059669" strokeWidth="2" />
                  <line x1="118" y1="60" x2="118" y2="70" stroke="#059669" strokeWidth="2" />
                  {/* Σημεία */}
                  <circle cx="35" cy="65" r="3.5" fill="#1e1b4b" />
                  <circle cx="145" cy="65" r="3.5" fill="#059669" />
                  <circle cx="90" cy="65" r="3" fill="#e11d48" />
                  <text x="35" y="54" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="145" y="54" textAnchor="middle" className="text-[11px] font-black fill-emerald-800">{vLbl.Ap}</text>
                  <text x="82" y="80" textAnchor="end" className="text-[10px] font-bold fill-rose-700">{vLbl.M}</text>
                </svg>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <div className="font-bold text-indigo-900">{t.card1Rule1}</div>
                  <div className="font-bold text-emerald-800">{t.card1Rule2}</div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-xs">
                    <strong className="text-slate-900 block">{t.card1SpecialTitle}</strong>
                    {t.card1SpecialDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΜΕΤΑΣΧΗΜΑΤΙΣΜΟΣ ΣΧΗΜΑΤΟΣ & ΙΔΙΟΤΗΤΕΣ */}
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

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 space-y-2 leading-relaxed">
                <strong className="text-emerald-900 block">{t.card2PropTitle}</strong>
                <div>{t.card2Prop1}</div>
                <div>{t.card2Prop2}</div>
                <div>{t.card2Prop3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΜΗΜΑΤΟΣ, ΓΩΝΙΑΣ & ΤΡΙΓΩΝΩΝ */}
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

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card3Item1Title}</strong> {t.card3Item1Desc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card3Item2Title}</strong> {t.card3Item2Desc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card3Item3Title}</strong> {t.card3Item3Desc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card3Item4Title}</strong> {t.card3Item4Desc}
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΤΕΤΡΑΠΛΕΥΡΩΝ & ΚΥΚΛΟΥ */}
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

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4Item1Title}</strong> {t.card4Item1Desc}
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4Item2Title}</strong> {t.card4Item2Desc}
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4Item3Title}</strong> {t.card4Item3Desc}
                </div>
                <div className="p-2 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                  <strong className="text-emerald-900">{t.card4Item4Title}</strong> {t.card4Item4Desc}
                </div>
                <div className="p-2 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-950 leading-relaxed">
                  <strong className="text-indigo-900">{t.card4Item5Title}</strong> {t.card4Item5Desc}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB (2 ΜΕΡΗ: ΣΥΜΜΕΤΡΙΚΟ ΣΧΗΜΑ & ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ ΣΧΗΜΑΤΩΝ) */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              🪞 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: ΣΥΜΜΕΤΡΙΚΟ ΤΡΙΓΩΝΟΥ ΑΒΓ ΩΣ ΠΡΟΣ ΑΞΟΝΑ (ε) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-4">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPart1Title)}
                </span>

                <CustomSlider
                  label={t.labSliderDist}
                  min={25}
                  max={135}
                  step={5}
                  value={distB}
                  onChange={setDistB}
                  unit=""
                  color="#4f46e5"
                  locale={locale}
                />

                <div className="bg-slate-950 rounded-2xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 220" className="w-full max-w-sm h-52 select-none">
                    {/* Άξονας συμμετρίας (ε) */}
                    <line x1={axisX} y1="12" x2={axisX} y2="208" stroke="#fb7185" strokeWidth="2.4" />
                    <text x={axisX + 7} y="22" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>

                    {/* Διακεκομμένες γραμμές αντιστοίχισης ΑΑ', ΒΒ', ΓΓ' */}
                    <line x1={Ax} y1={Ay} x2={Apx} y2={Ay} stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 3" />
                    <line x1={Bx} y1={By} x2={Bpx} y2={By} stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 3" />
                    <line x1={Cx} y1={Cy} x2={Cpx} y2={Cy} stroke="#64748b" strokeWidth="1.4" strokeDasharray="3 3" />

                    {/* Αρχικό τρίγωνο ΑΒΓ */}
                    <polygon
                      points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                      fill="rgba(99, 102, 241, 0.25)"
                      stroke="#818cf8"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />

                    {/* Συμμετρικό τρίγωνο Α'Β'Γ' */}
                    <polygon
                      points={`${Apx},${Ay} ${Bpx},${By} ${Cpx},${Cy}`}
                      fill="rgba(16, 185, 129, 0.25)"
                      stroke="#34d399"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />

                    {/* Κορυφές */}
                    <circle cx={Ax} cy={Ay} r="3.5" fill="#818cf8" />
                    <circle cx={Bx} cy={By} r="3.5" fill="#818cf8" />
                    <circle cx={Cx} cy={Cy} r="3.5" fill="#818cf8" />
                    <circle cx={Apx} cy={Ay} r="3.5" fill="#34d399" />
                    <circle cx={Bpx} cy={By} r="3.5" fill="#34d399" />
                    <circle cx={Cpx} cy={Cy} r="3.5" fill="#34d399" />

                    <text x={Ax} y={Ay - 8} textAnchor="middle" className="text-[11px] font-black fill-indigo-300">{vLbl.A}</text>
                    <text x={Bx - 8} y={By + 4} textAnchor="end" className="text-[11px] font-black fill-indigo-300">{vLbl.B}</text>
                    <text x={Cx} y={Cy + 15} textAnchor="middle" className="text-[11px] font-black fill-indigo-300">{vLbl.C}</text>

                    <text x={Apx} y={Ay - 8} textAnchor="middle" className="text-[11px] font-black fill-emerald-300">{vLbl.Ap}</text>
                    <text x={Bpx + 8} y={By + 4} textAnchor="start" className="text-[11px] font-black fill-emerald-300">{vLbl.Bp}</text>
                    <text x={Cpx} y={Cy + 15} textAnchor="middle" className="text-[11px] font-black fill-emerald-300">{vLbl.Cp}</text>
                  </svg>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-950 leading-relaxed">
                <strong className="text-indigo-900 block mb-0.5">{t.labPart1Summary}</strong>
                {t.labPart1Text}
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΕΞΕΡΕΥΝΗΣΗ ΑΞΟΝΩΝ ΣΥΜΜΕΤΡΙΑΣ ΒΑΣΙΚΩΝ ΣΧΗΜΑΤΩΝ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPart2Title)}
                </span>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'isoTri', label: t.shapeIsoTri },
                    { id: 'equiTri', label: t.shapeEquiTri },
                    { id: 'rect', label: t.shapeRect },
                    { id: 'rhombus', label: t.shapeRhombus },
                    { id: 'square', label: t.shapeSquare },
                    { id: 'isoTrap', label: t.shapeIsoTrap },
                    { id: 'parallelogram', label: t.shapeParallelogram },
                    { id: 'circle', label: t.shapeCircle }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedShape(item.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedShape === item.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {/* SVG Σχήματος & Αξόνων Συμμετρίας */}
                <div className="bg-slate-950 rounded-2xl p-3 flex items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* 1. Ισοσκελές Τρίγωνο (1 άξονας) */}
                    {selectedShape === 'isoTri' && (
                      <>
                        <polygon points="165,30 95,165 235,165" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" strokeLinejoin="round" />
                        <line x1="165" y1="12" x2="165" y2="192" stroke="#fbbf24" strokeWidth="2.2" strokeDasharray="5 3" />
                      </>
                    )}

                    {/* 2. Ισόπλευρο Τρίγωνο (3 άξονες) */}
                    {selectedShape === 'equiTri' && (
                      <>
                        <polygon points="165,32 95,153 235,153" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" strokeLinejoin="round" />
                        <line x1="165" y1="12" x2="165" y2="188" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" />
                        <line x1="80" y1="162" x2="225" y2="78" stroke="#34d399" strokeWidth="2" strokeDasharray="5 3" />
                        <line x1="250" y1="162" x2="105" y2="78" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 3" />
                      </>
                    )}

                    {/* 3. Ορθογώνιο (2 άξονες - μεσοκάθετοι πλευρών) */}
                    {selectedShape === 'rect' && (
                      <>
                        <rect x="85" y="52" width="160" height="100" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" />
                        <line x1="165" y1="24" x2="165" y2="180" stroke="#fbbf24" strokeWidth="2.2" strokeDasharray="5 3" />
                        <line x1="55" y1="102" x2="275" y2="102" stroke="#34d399" strokeWidth="2.2" strokeDasharray="5 3" />
                      </>
                    )}

                    {/* 4. Ρόμβος (2 άξονες - διαγώνιοι) */}
                    {selectedShape === 'rhombus' && (
                      <>
                        <polygon points="165,28 245,102 165,176 85,102" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" strokeLinejoin="round" />
                        <line x1="165" y1="12" x2="165" y2="192" stroke="#fbbf24" strokeWidth="2.2" strokeDasharray="5 3" />
                        <line x1="60" y1="102" x2="270" y2="102" stroke="#34d399" strokeWidth="2.2" strokeDasharray="5 3" />
                      </>
                    )}

                    {/* 5. Τετράγωνο (4 άξονες) */}
                    {selectedShape === 'square' && (
                      <>
                        <rect x="105" y="42" width="120" height="120" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" />
                        <line x1="165" y1="18" x2="165" y2="186" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" />
                        <line x1="80" y1="102" x2="250" y2="102" stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" />
                        <line x1="85" y1="22" x2="245" y2="182" stroke="#34d399" strokeWidth="2" strokeDasharray="5 3" />
                        <line x1="245" y1="22" x2="85" y2="182" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 3" />
                      </>
                    )}

                    {/* 6. Ισοσκελές Τραπέζιο (1 άξονας) */}
                    {selectedShape === 'isoTrap' && (
                      <>
                        <polygon points="115,52 215,52 250,152 80,152" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" strokeLinejoin="round" />
                        <line x1="165" y1="22" x2="165" y2="182" stroke="#fbbf24" strokeWidth="2.2" strokeDasharray="5 3" />
                      </>
                    )}

                    {/* 7. Γενικό Παραλληλόγραμμο (0 άξονες) */}
                    {selectedShape === 'parallelogram' && (
                      <>
                        <polygon points="105,52 255,52 225,152 75,152" fill="rgba(99, 102, 241, 0.22)" stroke="#818cf8" strokeWidth="2.4" strokeLinejoin="round" />
                        <text x="165" y="106" textAnchor="middle" className="text-[12px] font-black fill-rose-300">
                          {isEl ? '0 ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ' : '0 AXES OF SYMMETRY'}
                        </text>
                      </>
                    )}

                    {/* 8. Κύκλος (Άπειροι άξονες) */}
                    {selectedShape === 'circle' && (
                      <>
                        <circle cx="165" cy="102" r="64" fill="rgba(99, 102, 241, 0.2)" stroke="#818cf8" strokeWidth="2.4" />
                        <line x1="165" y1="20" x2="165" y2="184" stroke="#fbbf24" strokeWidth="1.8" strokeDasharray="4 3" />
                        <line x1="83" y1="102" x2="247" y2="102" stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
                        <line x1="107" y1="44" x2="223" y2="160" stroke="#fb7185" strokeWidth="1.8" strokeDasharray="4 3" />
                        <line x1="223" y1="44" x2="107" y2="160" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="4 3" />
                        <circle cx="165" cy="102" r="4" fill="#ffffff" />
                        <text x="173" y="96" className="text-[11px] font-black fill-white">{vLbl.O}</text>
                      </>
                    )}
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                <div className="sm:col-span-5 p-3 bg-indigo-900 text-white rounded-xl flex flex-col justify-center">
                  <span className="font-bold text-indigo-200 block mb-0.5 text-[10px]">
                    {toCleanUppercase(t.labAxesCountLabel)}
                  </span>
                  <div className="font-black text-sm">{activeInfo.count}</div>
                </div>
                <div className="sm:col-span-7 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-700 block mb-0.5 text-[10px]">
                    {toCleanUppercase(t.labAxesDescLabel)}
                  </span>
                  <div className="font-semibold text-emerald-950 leading-snug">{activeInfo.desc}</div>
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
                  <svg viewBox="0 0 320 190" className="w-full max-w-[300px] h-40 select-none">
                    <line x1="160" y1="12" x2="160" y2="178" stroke="#fb7185" strokeWidth="2.2" />
                    <text x="167" y="22" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>
                    <line x1="95" y1="42" x2="225" y2="42" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />
                    <line x1="55" y1="102" x2="265" y2="102" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />
                    <line x1="115" y1="152" x2="205" y2="152" stroke="#64748b" strokeWidth="1.3" strokeDasharray="3 3" />

                    <polygon points="95,42 55,102 115,152" fill="rgba(99, 102, 241, 0.25)" stroke="#818cf8" strokeWidth="2" strokeLinejoin="round" />
                    <polygon points="225,42 265,102 205,152" fill="rgba(16, 185, 129, 0.25)" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" />

                    <text x="95" y="33" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">{vLbl.A} (62°)</text>
                    <text x="48" y="106" textAnchor="end" className="text-[10px] font-black fill-indigo-300">{vLbl.B} (48°)</text>
                    <text x="115" y="166" textAnchor="middle" className="text-[10px] font-black fill-indigo-300">{vLbl.C} (70°)</text>

                    <text x="225" y="33" textAnchor="middle" className="text-[10px] font-black fill-emerald-300">{vLbl.Ap} (62°)</text>
                    <text x="272" y="106" textAnchor="start" className="text-[10px] font-black fill-emerald-300">{vLbl.Bp} (48°)</text>
                    <text x="205" y="166" textAnchor="middle" className="text-[10px] font-black fill-emerald-300">{vLbl.Cp} (70°)</text>
                  </svg>
                  <span className="text-[11px] text-slate-300 font-medium text-center mt-1">
                    {t.prob1DiagramCaption}
                  </span>
                </div>

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row1Q}</div>
                    <div className="text-slate-600">{t.prob1Row1R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600">{t.prob1Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row1Q}</td>
                        <td className="p-2.5">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row2Q}</td>
                        <td className="p-2.5 font-mono">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row3Q}</td>
                        <td className="p-2.5">{t.prob1Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row3C}</td>
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
                  <svg viewBox="0 0 320 190" className="w-full max-w-[300px] h-40 select-none">
                    {/* Άξονας (ε) */}
                    <line x1="160" y1="12" x2="160" y2="178" stroke="#fb7185" strokeWidth="2.2" />
                    <text x="167" y="22" className="text-[11px] font-black fill-rose-300">({isEl ? 'ε' : 'l'})</text>

                    {/* Τρίγωνο ΚΑΑ' */}
                    <polygon points="160,42 82,132 238,132" fill="rgba(99, 102, 241, 0.16)" stroke="#818cf8" strokeWidth="1.8" strokeLinejoin="round" />
                    <line x1="82" y1="132" x2="238" y2="132" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
                    <polyline points="160,122 170,122 170,132" fill="none" stroke="#fb7185" strokeWidth="1.6" />

                    <circle cx="160" cy="42" r="3.8" fill="#fbbf24" />
                    <circle cx="82" cy="132" r="3.8" fill="#34d399" />
                    <circle cx="238" cy="132" r="3.8" fill="#34d399" />
                    <circle cx="160" cy="132" r="3.2" fill="#fb7185" />

                    <text x="151" y="40" textAnchor="end" className="text-[11px] font-black fill-amber-300">{vLbl.K}</text>
                    <text x="74" y="136" textAnchor="end" className="text-[11px] font-black fill-emerald-300">{vLbl.A}</text>
                    <text x="246" y="136" textAnchor="start" className="text-[11px] font-black fill-emerald-300">{vLbl.Ap}</text>
                    <text x="153" y="146" textAnchor="end" className="text-[10px] font-black fill-rose-300">{vLbl.M}</text>

                    <text x="115" y="80" textAnchor="end" className="text-[10px] font-mono font-bold fill-amber-300">6 cm</text>
                    <text x="205" y="80" textAnchor="start" className="text-[10px] font-mono font-bold fill-amber-300">6 cm</text>
                    <text x="121" y="125" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">4,5 cm</text>
                    <text x="199" y="125" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">4,5 cm</text>
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
                    <div className="text-slate-600">{t.prob2Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row2C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob2ColPart}</th>
                        <th className="p-2.5 border-b">{t.prob2ColRule}</th>
                        <th className="p-2.5 border-b">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row1Q}</td>
                        <td className="p-2.5">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row2Q}</td>
                        <td className="p-2.5">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row2C}</td>
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
            href="/a-gymnasiou/48-simmetria-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
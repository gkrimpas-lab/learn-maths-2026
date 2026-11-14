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

// 100% Αξιόπιστο Custom Interactive Slider
function CustomSlider({ label, min, max, step = 1, value, onChange, unit = "°", color = "#4f46e5", locale = "el" }) {
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
    pageTitle: "Άθροισμα Γωνιών Τριγώνου & Ιδιότητες Ισοσκελούς | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Α' Γυμνασίου: άθροισμα γωνιών τριγώνου 180°, οξείες συμπληρωματικές γωνίες ορθογωνίου, γωνίες ισόπλευρου 60° και ιδιότητες ύψους-μεσοκαθέτου-διαμέσου-διχοτόμου σε ισοσκελές και ισόπλευρο τρίγωνο.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 07 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Άθροισμα Γωνιών Τριγώνου & Ιδιότητες Ισοσκελούς",
    heroDesc: "Ανακαλύψτε γιατί οι τρεις γωνίες κάθε τριγώνου έχουν πάντοτε άθροισμα 180°, ποιες σχέσεις ισχύουν στα ορθογώνια και ισόπλευρα τρίγωνα, και πώς ταυτίζονται ύψος, μεσοκάθετος, διάμεσος και διχοτόμος.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Άθροισμα Γωνιών 180°
    card1Badge: "1",
    card1Title: "Άθροισμα Γωνιών Τριγώνου",
    card1Desc: "Σε κάθε τρίγωνο ΑΒΓ, το άθροισμα των τριών εσωτερικών γωνιών του ισούται πάντοτε με 180° (μία ευθεία γωνία):",
    card1Formula: (
      <span>
        <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°
      </span>
    ),
    card1ProofTitle: "Γιατί ισχύει; (Με παράλληλη ευθεία):",
    card1ProofDesc: (
      <>
        Αν φέρουμε από την κορυφή Α ευθεία (ε) ∥ ΒΓ, σχηματίζονται εντός εναλλάξ γωνίες ίσες με <Angle>Β</Angle> και <Angle>Γ</Angle>, οι οποίες μαζί με τη γωνία <Angle>Α</Angle> σχηματίζουν ευθεία γωνία 180°.
      </>
    ),

    // Card 2: Συνέπειες σε Ορθογώνιο & Ισόπλευρο
    card2Badge: "2",
    card2Title: "Γωνίες Ορθογωνίου & Ισόπλευρου",
    card2Desc: "Από το θεώρημα του αθροίσματος γωνιών (180°) προκύπτουν δύο βασικά συμπεράσματα:",
    card2RightTitle: "1. Ορθογώνιο Τρίγωνο:",
    card2RightDesc: (
      <>
        Αν ένα τρίγωνο ΑΒΓ είναι ορθογώνιο (<Angle>Α</Angle> ＝ 90°), τότε οι άλλες δύο γωνίες του είναι <strong>οξείες</strong> και <strong>συμπληρωματικές</strong>, δηλαδή έχουν άθροισμα 90°:
      </>
    ),
    card2RightFormula: (
      <span>
        <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180° － 90° ＝ 90°
      </span>
    ),
    card2EquiTitle: "2. Ισόπλευρο Τρίγωνο:",
    card2EquiDesc: (
      <>
        Επειδή και οι τρεις γωνίες ενός ισόπλευρου τριγώνου είναι ίσες μεταξύ τους (<Angle>Α</Angle> ＝ <Angle>Β</Angle> ＝ <Angle>Γ</Angle>), καθεμία έχει μέτρο:
      </>
    ),
    card2EquiFormula: (
      <span className="inline-flex items-center gap-1">
        <Angle>Α</Angle> ＝ <Angle>Β</Angle> ＝ <Angle>Γ</Angle> ＝ <Frac num="180°" den="3" /> ＝ 60°
      </span>
    ),

    // Card 3: Ιδιότητα Ισοσκελούς Τριγώνου (4 σε 1)
    card3Badge: "3",
    card3Title: "Θεμελιώδης Ιδιότητα Ισοσκελούς",
    card3Desc: (
      <>
        Σε κάθε ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ), οι προσκείμενες γωνίες στη βάση είναι ίσες (<Angle>Β</Angle> ＝ <Angle>Γ</Angle>) και <strong>το ύψος ΑΥ που αντιστοιχεί στη βάση του ΒΓ είναι ταυτόχρονα</strong>:
      </>
    ),
    card3List1: "1. Ύψος (ΑΥ ⊥ ΒΓ)",
    card3List2: "2. Τμήμα της μεσοκαθέτου (ε) της βάσης ΒΓ",
    card3List3: "3. Διάμεσος της βάσης (ΒΥ ＝ ΥΓ)",
    card3List4: (
      <>
        4. Διχοτόμος της γωνίας της απέναντι κορυφής (Β<Angle>Α</Angle>Υ ＝ Υ<Angle>Α</Angle>Γ)
      </>
    ),
    card3Note: "Η ευθεία (ε) του ύψους ΑΥ αποτελεί άξονα συμμετρίας του ισοσκελούς τριγώνου!",

    // Card 4: Ιδιότητα Ισόπλευρου Τριγώνου
    card4Badge: "4",
    card4Title: "Απόλυτη Συμμετρία Ισόπλευρου",
    card4Desc: "Επειδή το ισόπλευρο τρίγωνο είναι ισοσκελές ως προς οποιαδήποτε πλευρά του, η παραπάνω ιδιότητα ισχύει και για τις τρεις κορυφές του:",
    card4HighlightTitle: "Και τα τρία ύψη του ισόπλευρου τριγώνου:",
    card4HighlightDesc: "Στο ισόπλευρο τρίγωνο, και τα τρία ύψη του είναι ταυτόχρονα τμήματα των μεσοκαθέτων των αντίστοιχων πλευρών, διάμεσοι και διχοτόμοι των γωνιών του!",
    card4Extra1Title: "Ισότητα Δευτερευόντων Στοιχείων:",
    card4Extra1Desc: (
      <>
        Τα τρία ύψη (υ<sub>α</sub> ＝ υ<sub>β</sub> ＝ υ<sub>γ</sub>), οι τρεις διάμεσοι και οι τρεις διχοτόμοι ενός ισόπλευρου τριγώνου έχουν όλα <strong>ίσο μήκος</strong>.
      </>
    ),
    card4Extra2Title: "Σύμπτωση Κέντρων:",
    card4Extra2Desc: "Το ορθόκεντρο, το έγκεντρο, το βαρύκεντρο και το περίκεντρο ταυτίζονται σε ένα μοναδικό σημείο στο κέντρο του ισόπλευρου τριγώνου.",

    // Interactive Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΓΩΝΙΩΝ & ΣΥΜΜΕΤΡΙΑΣ",
    labTitle: "Διαδραστικός Υπολογιστής Γωνιών Τριγώνου ΑΒΓ",
    labPresetsLabel: "ΕΤΟΙΜΑ ΠΡΟΤΥΠΑ:",
    presetAcute: "Οξυγώνιο",
    presetRight: "Ορθογώνιο (Α ＝ 90°)",
    presetIso: "Ισοσκελές (ΑΒ ＝ ΑΓ)",
    presetRightIso: "Ορθογώνιο Ισοσκελές",
    presetEqui: "Ισόπλευρο (60°)",
    labSlidersHeader: "ΡΥΘΜΙΣΗ ΓΩΝΙΩΝ Α ΚΑΙ Β:",
    labSliderA: "Γωνία Α",
    labSliderB: "Γωνία Β",
    labAutoCNote: "Η γωνία Γ υπολογίζεται αυτόματα ώστε το άθροισμα να είναι 180°:",
    labSumBar: "ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ:",
    labTypeLabel: "ΕΙΔΟΣ ΤΡΙΓΩΝΟΥ:",
    typeEquilateral: "Ισόπλευρο (Οξυγώνιο)",
    typeRightIso: "Ορθογώνιο Ισοσκελές",
    typeIsoBaseBC: "Ισοσκελές (βάση ΒΓ, ΑΒ ＝ ΑΓ)",
    typeIsoOther: "Ισοσκελές",
    typeRightScalene: "Ορθογώνιο Σκαληνό",
    typeObtuseScalene: "Αμβλυγώνιο Σκαληνό",
    typeAcuteScalene: "Οξυγώνιο Σκαληνό",
    obsEquilateral: "Ισόπλευρο (60°, 60°, 60°): Και τα 3 ύψη (διακεκομμένες γραμμές) είναι ταυτόχρονα τμήματα των μεσοκαθέτων, διάμεσοι και διχοτόμοι!",
    obsIsoBaseBC: "Ισοσκελές με βάση ΒΓ (Β ＝ Γ): Το ύψος ΑΥ προς τη βάση ΒΓ είναι ταυτόχρονα τμήμα της μεσοκαθέτου της ΒΓ, διάμεσος (ΒΥ ＝ ΥΓ) και διχοτόμος της γωνίας κορυφής Α!",
    obsRight: "Ορθογώνιο τρίγωνο: Η μία γωνία είναι 90° και οι άλλες δύο γωνίες είναι οξείες και συμπληρωματικές (άθροισμα 90°).",
    obsIsoOther: "Ισοσκελές τρίγωνο (δύο ίσες γωνίες): Το ύψος προς τη βάση του ταυτίζεται με τη μεσοκάθετο, τη διάμεσο και τη διχοτόμο της γωνίας κορυφής!",
    obsGeneral: "Σε κάθε τρίγωνο ισχύει Α ＋ Β ＋ Γ ＝ 180°. Δοκιμάστε να κάνετε Β ＝ Γ για να δείτε τον άξονα συμμετρίας του ισοσκελούς!",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ & ΟΡΘΟΓΩΝΙΟ ΤΡΙΓΩΝΟ",
    prob1Title: "Υπολογισμός άγνωστης γωνίας σε τρίγωνο και σε ορθογώνιο τρίγωνο",
    prob1DescPre: (
      <>
        α) Σε ένα τρίγωνο ΑΒΓ δίνονται <Angle>Α</Angle> ＝ 48° και <Angle>Β</Angle> ＝ 75°. Να υπολογιστεί η γωνία <Angle>Γ</Angle>. <br />
        β) Σε ένα ορθογώνιο τρίγωνο ΔΕΖ (<Angle>Δ</Angle> ＝ 90°), η μία οξεία γωνία <Angle>Ε</Angle> είναι 34°. Να υπολογιστεί η άλλη οξεία γωνία <Angle>Ζ</Angle>.
      </>
    ),
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Θεώρημα / Σχέση",
    prob1ColCalc: "Υπολογισμός",
    prob1Row1Q: (
      <>
        α) Εύρεση γωνίας <Angle>Γ</Angle>
      </>
    ),
    prob1Row1R: (
      <>
        <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°
      </>
    ),
    prob1Row1C: (
      <>
        <Angle>Γ</Angle> ＝ 180° － (48° ＋ 75°) ＝ 180° － 123° ＝ 57°
      </>
    ),
    prob1Row2Q: (
      <>
        β) Εύρεση γωνίας <Angle>Ζ</Angle>
      </>
    ),
    prob1Row2R: "Οι οξείες γωνίες ορθογωνίου είναι συμπληρωματικές (90°)",
    prob1Row2C: (
      <>
        <Angle>Ζ</Angle> ＝ 90° － 34° ＝ 56°
      </>
    ),
    prob1ResSummary: "Απάντηση:",
    prob1ResText: (
      <>
        α) <Angle>Γ</Angle> ＝ 57° και β) <Angle>Ζ</Angle> ＝ 56°.
      </>
    ),

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ & ΥΨΟΣ-ΜΕΣΟΚΑΘΕΤΟΣ",
    prob2Title: "Εφαρμογή ιδιοτήτων ισοσκελούς τριγώνου",
    prob2DescPre: (
      <>
        Σε ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) η γωνία της βάσης <Angle>Β</Angle> είναι 64° και η βάση ΒΓ έχει μήκος 10 cm. Φέρνουμε το ύψος ΑΥ προς τη βάση ΒΓ. Να υπολογιστούν: α) η γωνία κορυφής <Angle>Α</Angle>, β) η γωνία Β<Angle>Α</Angle>Υ και γ) το μήκος ΒΥ.
      </>
    ),
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Ιδιότητα Ισοσκελούς",
    prob2ColCalc: "Υπολογισμός",
    prob2Row1Q: (
      <>
        α) Γωνία κορυφής <Angle>Α</Angle>
      </>
    ),
    prob2Row1R: (
      <>
        <Angle>Β</Angle> ＝ <Angle>Γ</Angle> ＝ 64° και <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°
      </>
    ),
    prob2Row1C: (
      <>
        <Angle>Α</Angle> ＝ 180° － (64° ＋ 64°) ＝ 180° － 128° ＝ 52°
      </>
    ),
    prob2Row2Q: (
      <>
        β) Γωνία Β<Angle>Α</Angle>Υ
      </>
    ),
    prob2Row2R: (
      <>
        Το ύψος ΑΥ είναι και διχοτόμος της <Angle>Α</Angle>
      </>
    ),
    prob2Row2C: (
      <span className="inline-flex items-center gap-1">
        Β<Angle>Α</Angle>Υ ＝ <Frac num="52°" den="2" /> ＝ 26°
      </span>
    ),
    prob2Row3Q: "γ) Μήκος ΒΥ",
    prob2Row3R: "Το ύψος ΑΥ είναι τμήμα της μεσοκαθέτου (και διάμεσος) της ΒΓ",
    prob2Row3C: (
      <span className="inline-flex items-center gap-1">
        ΒΥ ＝ <Frac num="10" den="2" /> ＝ 5 cm
      </span>
    ),
    prob2ResSummary: "Συμπέρασμα:",
    prob2ResText: (
      <>
        <Angle>Α</Angle> ＝ 52°, Β<Angle>Α</Angle>Υ ＝ 26° και ΒΥ ＝ 5 cm.
      </>
    ),

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΙΣ ΓΩΝΙΕΣ ΤΡΙΓΩΝΩΝ",
    alert1Title: "Γωνία κορυφής vs Γωνία βάσης στο ισοσκελές:",
    alert1Desc: "Αν δίνεται η γωνία κορυφής (π.χ. 40°), τότε καθεμία γωνία βάσης είναι (180° － 40°) ÷ 2 ＝ 70°. Αν όμως δίνεται η γωνία βάσης (π.χ. 40°), τότε η γωνία κορυφής είναι 180° － 2 · 40° ＝ 100°!",
    alert2Title: "Μόνο το ύψος προς τη ΒΑΣΗ του ισοσκελούς:",
    alert2Desc: "Σε ένα ισοσκελές τρίγωνο, η ταύτιση ύψους, τμήματος μεσοκαθέτου, διαμέσου και διχοτόμου ισχύει ΜΟΝΟ για το ύψος προς τη βάση (εκτός αν το τρίγωνο είναι ισόπλευρο, οπότε ισχύει και για τα 3 ύψη).",
    alert3Title: "Συμπληρωματικές γωνίες στο ορθογώνιο:",
    alert3Desc: "Οι δύο οξείες γωνίες ενός ορθογωνίου τριγώνου έχουν άθροισμα 90° (συμπληρωματικές), και όχι 180°.",
    alert4Title: "Τμήμα της μεσοκαθέτου:",
    alert4Desc: "Η μεσοκάθετος είναι ευθεία (άπειρη), ενώ το ύψος είναι ευθύγραμμο τμήμα. Γι' αυτό λέμε ότι το ύψος του ισοσκελούς είναι τμήμα της μεσοκαθέτου της βάσης.",

    // Bottom
    bottomTitle: "Εμπεδώστε το Άθροισμα Γωνιών & τις Ιδιότητες στην Πράξη!",
    bottomDesc: "Εξασκηθείτε στον υπολογισμό γωνιών, σε ορθογώνια, ισοσκελή και ισόπλευρα τρίγωνα με 12 διαδραστικές ασκήσεις και πλήρη βήματα επίλυσης.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Sum of Angles in a Triangle & Isosceles Properties | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory: angle sum of a triangle equals 180°, acute complementary angles in right triangles, equilateral triangle angles (60°), and altitude-bisector-median-perpendicular bisector coincidence.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 07 • GRADE 7",
    heroTitle: "Sum of Triangle Angles & Isosceles Properties",
    heroDesc: "Discover why the interior angles of every triangle always sum to 180°, explore right and equilateral triangle angles, and master the symmetry of isosceles and equilateral triangles.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1: Angle Sum 180°
    card1Badge: "1",
    card1Title: "Sum of Angles in a Triangle",
    card1Desc: "In every triangle ABC, the sum of its three interior angles always equals 180° (a straight angle):",
    card1Formula: "∠A ＋ ∠B ＋ ∠C ＝ 180°",
    card1ProofTitle: "Why does this hold? (Parallel Line Proof):",
    card1ProofDesc: "Drawing a line (l) through vertex A parallel to BC creates alternate interior angles equal to ∠B and ∠C, which together with ∠A form a straight angle of 180°.",

    // Card 2: Right & Equilateral Consequences
    card2Badge: "2",
    card2Title: "Right & Equilateral Triangle Angles",
    card2Desc: "Two essential corollaries follow directly from the 180° triangle angle sum theorem:",
    card2RightTitle: "1. Right Triangle:",
    card2RightDesc: "If triangle ABC has a right angle (∠A ＝ 90°), its other two angles are acute and complementary, summing to 90°:",
    card2RightFormula: "∠B ＋ ∠C ＝ 180° － 90° ＝ 90°",
    card2EquiTitle: "2. Equilateral Triangle:",
    card2EquiDesc: "Since all three angles of an equilateral triangle are equal (∠A ＝ ∠B ＝ ∠C), each angle measures:",
    card2EquiFormula: (
      <span className="inline-flex items-center gap-1">
        ∠A ＝ ∠B ＝ ∠C ＝ <Frac num="180°" den="3" /> ＝ 60°
      </span>
    ),

    // Card 3: Isosceles Property (4 in 1)
    card3Badge: "3",
    card3Title: "Fundamental Property of Isosceles Triangles",
    card3Desc: "In every isosceles triangle ABC (AB ＝ AC), the base angles are equal (∠B ＝ ∠C) and the altitude AH drawn to base BC is simultaneously:",
    card3List1: "1. An altitude (AH ⊥ BC)",
    card3List2: "2. A segment of the perpendicular bisector (l) of base BC",
    card3List3: "3. A median to the base (BH ＝ HC)",
    card3List4: "4. The angle bisector of the vertex angle (∠BAH ＝ ∠HAC)",
    card3Note: "The line (l) containing altitude AH is the axis of symmetry of the isosceles triangle!",

    // Card 4: Equilateral Property
    card4Badge: "4",
    card4Title: "Complete Symmetry of Equilateral Triangles",
    card4Desc: "Since an equilateral triangle is isosceles with respect to any of its three sides, this property holds for all three vertices:",
    card4HighlightTitle: "All three altitudes of an equilateral triangle:",
    card4HighlightDesc: "In an equilateral triangle, all three altitudes are simultaneously segments of the perpendicular bisectors of their respective sides, medians, and angle bisectors!",
    card4Extra1Title: "Equality of Secondary Elements:",
    card4Extra1Desc: (
      <>
        All three altitudes (h<sub>a</sub> ＝ h<sub>b</sub> ＝ h<sub>c</sub>), all three medians, and all three angle bisectors of an equilateral triangle have <strong>equal length</strong>.
      </>
    ),
    card4Extra2Title: "Coincidence of Centers:",
    card4Extra2Desc: "The orthocenter, incenter, centroid, and circumcenter all coincide at a single point at the center of the equilateral triangle.",

    // Interactive Lab
    labBadge: "ANGLES & SYMMETRY LAB",
    labTitle: "Interactive Triangle ABC Angle Explorer",
    labPresetsLabel: "QUICK PRESETS:",
    presetAcute: "Acute",
    presetRight: "Right (∠A ＝ 90°)",
    presetIso: "Isosceles (AB ＝ AC)",
    presetRightIso: "Right Isosceles",
    presetEqui: "Equilateral (60°)",
    labSlidersHeader: "ADJUST ANGLES A AND B:",
    labSliderA: "Angle ∠A",
    labSliderB: "Angle ∠B",
    labAutoCNote: "Angle ∠C is computed automatically so the sum remains 180°:",
    labSumBar: "SUM OF ANGLES:",
    labTypeLabel: "TRIANGLE TYPE:",
    typeEquilateral: "Equilateral (Acute)",
    typeRightIso: "Right Isosceles",
    typeIsoBaseBC: "Isosceles (base BC, AB ＝ AC)",
    typeIsoOther: "Isosceles",
    typeRightScalene: "Right Scalene",
    typeObtuseScalene: "Obtuse Scalene",
    typeAcuteScalene: "Acute Scalene",
    obsEquilateral: "Equilateral (60°, 60°, 60°): All 3 altitudes (dashed lines) are simultaneously segments of the perpendicular bisectors, medians, and angle bisectors!",
    obsIsoBaseBC: "Isosceles with base BC (∠B ＝ ∠C): The altitude AH to base BC is simultaneously a segment of the perpendicular bisector of BC, a median (BH ＝ HC), and the bisector of vertex angle ∠A!",
    obsRight: "Right triangle: One angle is 90° and the other two angles are acute and complementary (summing to 90°).",
    obsIsoOther: "Isosceles triangle (two equal angles): The altitude to its base coincides with the perpendicular bisector, median, and vertex angle bisector!",
    obsGeneral: "In every triangle ∠A ＋ ∠B ＋ ∠C ＝ 180°. Try setting ∠B ＝ ∠C to reveal the symmetry axis of an isosceles triangle!",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: ANGLE SUM & RIGHT TRIANGLE",
    prob1Title: "Finding missing angles in general and right triangles",
    prob1DescPre: (
      <>
        (a) In triangle ABC, ∠A ＝ 48° and ∠B ＝ 75°. Find the measure of ∠C. <br />
        (b) In right triangle DEF (∠D ＝ 90°), one acute angle ∠E measures 34°. Find the other acute angle ∠F.
      </>
    ),
    prob1ColPart: "Question",
    prob1ColRule: "Theorem / Relation",
    prob1ColCalc: "Calculation",
    prob1Row1Q: "(a) Finding angle ∠C",
    prob1Row1R: "∠A ＋ ∠B ＋ ∠C ＝ 180°",
    prob1Row1C: "∠C ＝ 180° － (48° ＋ 75°) ＝ 180° － 123° ＝ 57°",
    prob1Row2Q: "(b) Finding angle ∠F",
    prob1Row2R: "Acute angles of a right triangle are complementary (90°)",
    prob1Row2C: "∠F ＝ 90° － 34° ＝ 56°",
    prob1ResSummary: "Answer:",
    prob1ResText: "(a) ∠C ＝ 57° and (b) ∠F ＝ 56°.",

    prob2Badge: "PROBLEM 2: ISOSCELES TRIANGLE & ALTITUDE-BISECTOR",
    prob2Title: "Applying isosceles triangle symmetry properties",
    prob2DescPre: "In isosceles triangle ABC (AB ＝ AC), base angle ∠B measures 64° and base BC has length 10 cm. Draw altitude AH to base BC. Determine: (a) vertex angle ∠A, (b) angle ∠BAH, and (c) length BH.",
    prob2ColPart: "Question",
    prob2ColRule: "Isosceles Property",
    prob2ColCalc: "Calculation",
    prob2Row1Q: "(a) Vertex angle ∠A",
    prob2Row1R: "∠B ＝ ∠C ＝ 64° and ∠A ＋ ∠B ＋ ∠C ＝ 180°",
    prob2Row1C: "∠A ＝ 180° － (64° ＋ 64°) ＝ 180° － 128° ＝ 52°",
    prob2Row2Q: "(b) Angle ∠BAH",
    prob2Row2R: "Altitude AH also bisects vertex angle ∠A",
    prob2Row2C: (
      <span className="inline-flex items-center gap-1">
        ∠BAH ＝ <Frac num="52°" den="2" /> ＝ 26°
      </span>
    ),
    prob2Row3Q: "(c) Length BH",
    prob2Row3R: "Altitude AH is part of the perpendicular bisector (and median) of BC",
    prob2Row3C: (
      <span className="inline-flex items-center gap-1">
        BH ＝ <Frac num="10" den="2" /> ＝ 5 cm
      </span>
    ),
    prob2ResSummary: "Conclusion:",
    prob2ResText: "∠A ＝ 52°, ∠BAH ＝ 26°, and BH ＝ 5 cm.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH TRIANGLE ANGLES",
    alert1Title: "Vertex angle vs. Base angle in an isosceles triangle:",
    alert1Desc: "If the vertex angle is given (e.g., 40°), each base angle is (180° － 40°) ÷ 2 ＝ 70°. If a base angle is given (e.g., 40°), the vertex angle is 180° － 2 · 40° ＝ 100°!",
    alert2Title: "Only the altitude to the BASE of an isosceles triangle:",
    alert2Desc: "In an isosceles triangle, the coincidence of altitude, perpendicular bisector segment, median, and angle bisector holds ONLY for the base (unless it is equilateral, where it holds for all 3 sides).",
    alert3Title: "Complementary angles in right triangles:",
    alert3Desc: "The two acute angles of a right triangle sum to 90° (complementary), not 180°.",
    alert4Title: "Segment of the perpendicular bisector:",
    alert4Desc: "A perpendicular bisector is an infinite line, whereas an altitude is a line segment. Thus, the altitude to the base of an isosceles triangle is a segment of its perpendicular bisector.",

    // Bottom
    bottomTitle: "Master Triangle Angle Sum & Symmetry in Practice!",
    bottomDesc: "Practice computing angles in general, right, isosceles, and equilateral triangles with 12 interactive exercises and step-by-step solutions.",
    bottomBtn: "START EXERCISES"
  }
};

export default function AthroismaGonionTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  // State γωνιών Α και Β (η Γ προκύπτει αυτόματα ώστε Α + Β + Γ = 180°)
  const [angleA, setAngleA] = useState(50);
  const [angleB, setAngleB] = useState(65);

  const handleAngleAChange = (newA) => {
    setAngleA(newA);
    // Διασφαλίζουμε ότι η Γ μένει τουλάχιστον 15°
    if (newA + angleB > 165) {
      setAngleB(Math.max(15, 165 - newA));
    }
  };

  const handleAngleBChange = (newB) => {
    setAngleB(newB);
    if (angleA + newB > 165) {
      setAngleA(Math.max(15, 165 - newB));
    }
  };

  const angleC = 180 - angleA - angleB;

  const applyPreset = (a, b) => {
    setAngleA(a);
    setAngleB(b);
  };

  // Κατηγοριοποίηση & Ειδικές ιδιότητες
  const isEquilateral = angleA === 60 && angleB === 60 && angleC === 60;
  const isIsoBaseBC = !isEquilateral && angleB === angleC;
  const isAnyIsosceles = !isEquilateral && (angleA === angleB || angleB === angleC || angleA === angleC);
  const isRight = angleA === 90 || angleB === 90 || angleC === 90;
  const isObtuse = angleA > 90 || angleB > 90 || angleC > 90;

  let triTypeLabel = t.typeAcuteScalene;
  if (isEquilateral) triTypeLabel = t.typeEquilateral;
  else if (isRight && isAnyIsosceles) triTypeLabel = t.typeRightIso;
  else if (isIsoBaseBC) triTypeLabel = t.typeIsoBaseBC;
  else if (isAnyIsosceles) triTypeLabel = t.typeIsoOther;
  else if (isRight) triTypeLabel = t.typeRightScalene;
  else if (isObtuse) triTypeLabel = t.typeObtuseScalene;

  let labObsText = t.obsGeneral;
  if (isEquilateral) labObsText = t.obsEquilateral;
  else if (isIsoBaseBC) labObsText = t.obsIsoBaseBC;
  else if (isRight) labObsText = t.obsRight;
  else if (isAnyIsosceles) labObsText = t.obsIsoOther;

  // Υπολογισμός συντεταγμένων κορυφών Α, Β, Γ στο SVG viewBox 360x230 με βάση ΒΓ οριζόντια
  const radA = (angleA * Math.PI) / 180;
  const radB = (angleB * Math.PI) / 180;
  const radC = (angleC * Math.PI) / 180;

  // Νόμος ημιτόνων με πλευρά α = ΒΓ = 1
  const sideA = 1;
  const sideC = Math.sin(radC) / Math.sin(radA);

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
  const scale = Math.min(220 / spanX, 130 / spanY);

  const drawnW = spanX * scale;
  const drawnH = spanY * scale;
  const offsetX = (360 - drawnW) / 2 - minX * scale;
  const offsetY = (230 + drawnH) / 2 + 6;

  const Ax = Number((offsetX + rawAx * scale).toFixed(1));
  const Ay = Number((offsetY - rawAy * scale).toFixed(1));
  const Bx = Number((offsetX + rawBx * scale).toFixed(1));
  const By = Number((offsetY - rawBy * scale).toFixed(1));
  const Cx = Number((offsetX + rawCx * scale).toFixed(1));
  const Cy = Number((offsetY - rawCy * scale).toFixed(1));

  // Μέσα πλευρών για σχεδίαση συμμετρίας (ύψος-μεσοκάθετος-διάμεσος-διχοτόμος)
  const M_bc = { x: (Bx + Cx) / 2, y: (By + Cy) / 2 };
  const M_ac = { x: (Ax + Cx) / 2, y: (Ay + Cy) / 2 };
  const M_ab = { x: (Ax + Bx) / 2, y: (Ay + By) / 2 };

  const vLbl = isEl ? { A: 'Α', B: 'Β', C: 'Γ' } : { A: 'A', B: 'B', C: 'C' };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/42-athroisma-gonion-ask"
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
                href="/a-gymnasiou/42-athroisma-gonion-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΑΘΡΟΙΣΜΑ ΓΩΝΙΩΝ ΤΡΙΓΩΝΟΥ */}
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

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-3.5 mb-3 text-center shadow-inner font-mono text-sm sm:text-base font-bold break-words">
                {t.card1Formula}
              </div>

              {/* Εποπτικό Σχήμα Απόδειξης με Παράλληλη Ευθεία */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 210 130" className="w-44 h-28 shrink-0">
                  {/* Παράλληλη ευθεία (ε) από την κορυφή Α */}
                  <line x1="25" y1="26" x2="185" y2="26" stroke="#059669" strokeWidth="1.8" strokeDasharray="4 3" />
                  <text x="190" y="29" className="text-[10px] font-bold fill-emerald-700">({isEl ? 'ε' : 'l'})</text>
                  {/* Τρίγωνο ΑΒΓ */}
                  <polygon points="105,26 40,108 175,108" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  {/* Τόξα γωνιών στην Α και στη βάση */}
                  <path d="M 87,26 A 18,18 0 0,0 94,40" fill="none" stroke="#d97706" strokeWidth="2" />
                  <path d="M 116,40 A 18,18 0 0,0 123,26" fill="none" stroke="#e11d48" strokeWidth="2" />
                  <path d="M 58,108 A 18,18 0 0,0 51,94" fill="none" stroke="#d97706" strokeWidth="2" />
                  <path d="M 164,94 A 18,18 0 0,0 157,108" fill="none" stroke="#e11d48" strokeWidth="2" />
                  {/* Κορυφές */}
                  <circle cx="105" cy="26" r="3" fill="#1e1b4b" />
                  <circle cx="40" cy="108" r="3" fill="#1e1b4b" />
                  <circle cx="175" cy="108" r="3" fill="#1e1b4b" />
                  <text x="105" y="18" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="29" y="114" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="186" y="114" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                </svg>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <strong className="text-indigo-900 block mb-1">{t.card1ProofTitle}</strong>
                  {t.card1ProofDesc}
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΓΩΝΙΕΣ ΟΡΘΟΓΩΝΙΟΥ & ΙΣΟΠΛΕΥΡΟΥ */}
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
                  <span className="font-bold text-indigo-900 block mb-1">{t.card2RightTitle}</span>
                  {t.card2RightDesc}
                  <div className="font-mono text-xs sm:text-sm font-bold text-indigo-800 mt-1.5 p-2 bg-white rounded border border-slate-200 break-words">
                    {t.card2RightFormula}
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                  <span className="font-bold text-emerald-900 block mb-1">{t.card2EquiTitle}</span>
                  {t.card2EquiDesc}
                  <div className="font-mono text-xs sm:text-sm font-bold text-emerald-900 mt-1.5 p-2 bg-white rounded border border-emerald-200 break-words">
                    {t.card2EquiFormula}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ ΙΣΟΣΚΕΛΟΥΣ */}
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

              {/* Εποπτικό Σχήμα Ισοσκελούς & Άξονα Συμμετρίας */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 200 140" className="w-40 h-28 shrink-0">
                  {/* Μεσοκάθετος ευθεία (ε) */}
                  <line x1="100" y1="8" x2="100" y2="132" stroke="#059669" strokeWidth="1.6" strokeDasharray="4 3" />
                  <text x="108" y="15" className="text-[10px] font-bold fill-emerald-700">({isEl ? 'ε' : 'l'})</text>
                  {/* Ισοσκελές Τρίγωνο */}
                  <polygon points="100,24 38,112 162,112" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  {/* Ύψος-Διάμεσος-Διχοτόμος ΑΥ */}
                  <line x1="100" y1="24" x2="100" y2="112" stroke="#059669" strokeWidth="2.4" />
                  {/* Ορθή γωνία */}
                  <polyline points="100,102 110,102 110,112" fill="none" stroke="#059669" strokeWidth="1.8" />
                  {/* Τικ ισότητας σκελών & βάσης */}
                  <line x1="65" y1="65" x2="73" y2="71" stroke="#4f46e5" strokeWidth="2" />
                  <line x1="135" y1="65" x2="127" y2="71" stroke="#4f46e5" strokeWidth="2" />
                  <line x1="69" y1="107" x2="69" y2="117" stroke="#059669" strokeWidth="2" />
                  <line x1="131" y1="107" x2="131" y2="117" stroke="#059669" strokeWidth="2" />
                  {/* Σημεία */}
                  <circle cx="100" cy="24" r="3" fill="#1e1b4b" />
                  <circle cx="38" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="162" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="100" cy="112" r="3" fill="#059669" />
                  <text x="90" y="21" textAnchor="end" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="27" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="173" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                  <text x="90" y="126" textAnchor="end" className="text-[11px] font-bold fill-emerald-700">{isEl ? 'Υ' : 'H'}</text>
                </svg>
                <div className="space-y-1 text-xs sm:text-sm text-slate-800 font-semibold">
                  <div>{t.card3List1}</div>
                  <div>{t.card3List2}</div>
                  <div>{t.card3List3}</div>
                  <div>{t.card3List4}</div>
                </div>
              </div>

              <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 font-medium">
                💡 {t.card3Note}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΙΔΙΟΤΗΤΑ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ */}
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

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 leading-relaxed mb-3">
                <strong className="text-emerald-900 block mb-1">{t.card4HighlightTitle}</strong>
                {t.card4HighlightDesc}
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4Extra1Title}</strong> {t.card4Extra1Desc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4Extra2Title}</strong> {t.card4Extra2Desc}
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

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                {toCleanUppercase(t.labPresetsLabel)}
              </span>
              <button
                type="button"
                onClick={() => applyPreset(52, 70)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 text-xs font-bold transition"
              >
                {t.presetAcute}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(90, 35)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 text-xs font-bold transition"
              >
                {t.presetRight}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(50, 65)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-bold transition"
              >
                {t.presetIso}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(90, 45)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800 text-xs font-bold transition"
              >
                {t.presetRightIso}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(60, 60)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 text-xs font-bold transition"
              >
                {t.presetEqui}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Sliders Γωνιών */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-1">
                {toCleanUppercase(t.labSlidersHeader)}
              </h3>
              <CustomSlider
                label={t.labSliderA}
                min={20}
                max={130}
                step={1}
                value={angleA}
                onChange={handleAngleAChange}
                unit="°"
                color="#4f46e5"
                locale={locale}
              />
              <CustomSlider
                label={t.labSliderB}
                min={20}
                max={130}
                step={1}
                value={angleB}
                onChange={handleAngleBChange}
                unit="°"
                color="#2563eb"
                locale={locale}
              />

              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="text-slate-500">{t.labAutoCNote}</div>
                <div className="font-mono font-bold text-emerald-700 text-sm">
                  {vLbl.C} ＝ 180° － ({angleA}° ＋ {angleB}°) ＝ {angleC}°
                </div>
              </div>
            </div>

            {/* Dynamic SVG Visualizer & Diagnostics */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* SVG Καμβάς */}
              <div className="bg-slate-950 rounded-2xl p-3 sm:p-4 flex items-center justify-center shadow-inner overflow-hidden">
                <svg viewBox="0 0 360 230" className="w-full max-w-md h-52 sm:h-60 select-none">
                  {/* Τρίγωνο ΑΒΓ */}
                  <polygon
                    points={`${Ax},${Ay} ${Bx},${By} ${Cx},${Cy}`}
                    fill="rgba(99, 102, 241, 0.22)"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Αν είναι Ισόπλευρο: δείχνουμε και τα 3 ύψη-μεσοκαθέτους-διαμέσους-διχοτόμους */}
                  {isEquilateral && (
                    <>
                      <line x1={Ax} y1={Ay} x2={M_bc.x} y2={M_bc.y} stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
                      <line x1={Bx} y1={By} x2={M_ac.x} y2={M_ac.y} stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
                      <line x1={Cx} y1={Cy} x2={M_ab.x} y2={M_ab.y} stroke="#34d399" strokeWidth="1.8" strokeDasharray="4 3" />
                      <circle cx={(Ax + Bx + Cx) / 3} cy={(Ay + By + Cy) / 3} r="4.5" fill="#34d399" />
                    </>
                  )}

                  {/* Αν είναι Ισοσκελές με βάση ΒΓ (Β = Γ): δείχνουμε το ύψος-μεσοκάθετο-διάμεσο-διχοτόμο ΑΥ */}
                  {isIsoBaseBC && (
                    <>
                      <line x1={Ax} y1={Ay} x2={M_bc.x} y2={M_bc.y} stroke="#34d399" strokeWidth="2.2" strokeDasharray="4 3" />
                      <polyline
                        points={`${M_bc.x},${M_bc.y - 10} ${M_bc.x + 10},${M_bc.y - 10} ${M_bc.x + 10},${M_bc.y}`}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="1.8"
                      />
                      <circle cx={M_bc.x} cy={M_bc.y} r="3.5" fill="#34d399" />
                      <text x={M_bc.x} y={M_bc.y + 16} textAnchor="middle" className="text-[11px] font-bold fill-emerald-300">
                        {isEl ? 'Υ' : 'H'}
                      </text>
                    </>
                  )}

                  {/* Κορυφές & Μέτρα Γωνιών */}
                  <circle cx={Ax} cy={Ay} r="4" fill="#34d399" />
                  <text x={Ax} y={Ay - 10} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.A} ({angleA}°)
                  </text>

                  <circle cx={Bx} cy={By} r="4" fill="#34d399" />
                  <text x={Bx - 8} y={By + 17} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.B} ({angleB}°)
                  </text>

                  <circle cx={Cx} cy={Cy} r="4" fill="#34d399" />
                  <text x={Cx + 8} y={Cy + 17} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.C} ({angleC}°)
                  </text>
                </svg>
              </div>

              {/* Μπάρα Αθροίσματος & Είδους */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-indigo-900 text-white rounded-xl">
                  <span className="font-bold text-indigo-200 block mb-0.5 text-[11px]">
                    {toCleanUppercase(t.labSumBar)}
                  </span>
                  <div className="font-mono font-black text-sm sm:text-base">
                    {angleA}° ＋ {angleB}° ＋ {angleC}° ＝ 180°
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-700 block mb-0.5 text-[11px]">
                    {toCleanUppercase(t.labTypeLabel)}
                  </span>
                  <div className="font-black text-emerald-950 text-sm sm:text-base">
                    {triTypeLabel}
                  </div>
                </div>
              </div>

              {/* Παρατήρηση */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                💡 {labObsText}
              </div>

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
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 break-words">
                  {t.prob1DescPre}
                </p>

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
                        <td className="p-2.5 font-mono">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row2Q}</td>
                        <td className="p-2.5">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row2C}</td>
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

                {/* Mobile View: Stacked Cards */}
                <div className="block sm:hidden space-y-2 mb-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row1Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob2Row1R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row2Q}</div>
                    <div className="text-slate-600">{t.prob2Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row3Q}</div>
                    <div className="text-slate-600">{t.prob2Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row3C}</div>
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
                        <td className="p-2.5 font-mono">{t.prob2Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row2Q}</td>
                        <td className="p-2.5">{t.prob2Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row3Q}</td>
                        <td className="p-2.5">{t.prob2Row3R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row3C}</td>
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
            href="/a-gymnasiou/42-athroisma-gonion-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
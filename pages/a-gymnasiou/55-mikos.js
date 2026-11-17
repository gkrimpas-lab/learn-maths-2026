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

// Επαναχρησιμοποιήσιμο Component Τόξου (Το ^ καμπύλο τόξο τοποθετείται από πάνω)
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

const UNIT_DEFS = [
  { key: 'km', factorToM: 1000, nameEl: 'Χιλιόμετρο', nameEn: 'Kilometer' },
  { key: 'hm', factorToM: 100, nameEl: 'Εκατόμετρο', nameEn: 'Hectometer' },
  { key: 'dam', factorToM: 10, nameEl: 'Δεκάμετρο', nameEn: 'Decameter' },
  { key: 'm', factorToM: 1, nameEl: 'Μέτρο (Βασική)', nameEn: 'Meter (Base)' },
  { key: 'dm', factorToM: 0.1, nameEl: 'Δεκατόμετρο', nameEn: 'Decimeter' },
  { key: 'cm', factorToM: 0.01, nameEl: 'Εκατοστόμετρο', nameEn: 'Centimeter' },
  { key: 'mm', factorToM: 0.001, nameEl: 'Χιλιοστόμετρο', nameEn: 'Millimeter' }
];

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Μέτρηση Μήκους, Μονάδες, Ευθύγραμμα Τμήματα & Περίμετρος Πολυγώνων | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Μαθηματικών Α' Γυμνασίου: μέτρηση μήκους, πολλαπλάσια και υποδιαιρέσεις του μέτρου, μετατροπές μονάδων, σύγκριση, άθροισμα και διαφορά ευθυγράμμων τμημάτων, περίμετρος πολυγώνων.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 16 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Μέτρηση Μήκους • Ευθύγραμμα Τμήματα & Περίμετρος Πολυγώνων",
    heroDesc: "Μάθετε πώς μετράμε το μήκος με το Διεθνές Σύστημα Μονάδων (SI), μετατρέψτε εύκολα πολλαπλάσια και υποδιαιρέσεις του μέτρου, συγκρίνετε, προσθέστε και αφαιρέστε ευθύγραμμα τμήματα και υπολογίστε την περίμετρο κάθε πολυγώνου!",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Μέτρηση Μήκους & Μονάδες Μέτρησης
    card1Badge: "1",
    card1Title: "Μέτρηση Μήκους και Μονάδες Μέτρησης (SI)",
    card1Desc: "Μέτρηση ενός ευθυγράμμου τμήματος ΑΒ είναι η σύγκρισή του με ένα άλλο τμήμα ΜΝ που επιλέγουμε ως μονάδα μέτρησης. Το αποτέλεσμα είναι ένας θετικός αριθμός που ονομάζεται μήκος του ΑΒ:",
    card1List1: "• Βασική Μονάδα (SI): Το μέτρο (1 m). Όργανα μέτρησης: υποδεκάμετρο (χάρακας), μεζούρα, παχύμετρο, αποστασιόμετρο laser.",
    card1List2: "• Πολλαπλάσια του μέτρου (×10 ανά βήμα): 1 dam ＝ 10 m (δεκάμετρο), 1 hm ＝ 100 m (εκατόμετρο), 1 km ＝ 1.000 m (χιλιόμετρο).",
    card1List3: "• Υποδιαιρέσεις του μέτρου (÷10 ανά βήμα): 1 dm ＝ 0,1 m (δεκατόμετρο), 1 cm ＝ 0,01 m (εκατοστόμετρο), 1 mm ＝ 0,001 m (χιλιοστόμετρο).",

    // Card 2: Μετατροπές Μονάδων Μήκους
    card2Badge: "2",
    card2Title: "Κανόνες Μετατροπής Μονάδων Μήκους",
    card2Desc: "Οι μονάδες μήκους αποτελούν δεκαδικό σύστημα (κάθε μονάδα είναι 10 φορές μεγαλύτερη από την αμέσως μικρότερή της):",
    card2List1: "• Από ΜΕΓΑΛΥΤΕΡΗ σε ΜΙΚΡΟΤΕΡΗ μονάδα: Πολλαπλασιάζουμε με 10, 100, 1.000... (μετακινούμε την υποδιαστολή ΔΕΞΙΑ κατά όσες θέσεις κατεβαίνουμε στην κλίμακα).",
    card2List2: "• Από ΜΙΚΡΟΤΕΡΗ σε ΜΕΓΑΛΥΤΕΡΗ μονάδα: Διαιρούμε με 10, 100, 1.000... (μετακινούμε την υποδιαστολή ΑΡΙΣΤΕΡΑ κατά όσες θέσεις ανεβαίνουμε στην κλίμακα).",
    card2List3: "• Χρήσιμες ισότητες: 1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm • 1 km ＝ 1.000 m ＝ 100.000 cm • 1 cm ＝ 10 mm.",

    // Card 3: Σύγκριση, Άθροισμα & Διαφορά Ευθυγράμμων Τμημάτων
    card3Badge: "3",
    card3Title: "Σύγκριση, Άθροισμα & Διαφορά Ευθυγράμμων Τμημάτων",
    card3Desc: "Για να συγκρίνουμε ή να κάνουμε πράξεις μεταξύ δύο ευθυγράμμων τμημάτων ΑΒ και ΓΔ, πρέπει τα μήκη τους να είναι εκφρασμένα στην ΙΔΙΑ μονάδα μέτρησης:",
    card3List1: "• Σύγκριση Τμημάτων: Αν τα μήκη τους είναι ίσα (ΑΒ ＝ ΓΔ), τα τμήματα είναι ίσα. Αν ΑΒ > ΓΔ (ή ΑΒ < ΓΔ), το ΑΒ είναι μεγαλύτερο (ή μικρότερο) από το ΓΔ.",
    card3List2: "• Άθροισμα Τμημάτων (ΑΒ ＋ ΓΔ): Εάν τοποθετήσουμε διαδοχικά πάνω στην ίδια ευθεία τα τμήματα ΑΒ και ΒΓ (με κοινό άκρο το Β), το τμήμα ΑΓ είναι το άθροισμά τους: ΑΓ ＝ ΑΒ ＋ ΒΓ.",
    card3List3: "• Διαφορά Τμημάτων (ΑΒ － ΓΔ, με ΑΒ > ΓΔ): Το τμήμα που προστιθέμενο στο ΓΔ δίνει το ΑΒ.",

    // Card 4: Μήκος Πλευρών & Περίμετρος Πολυγώνων
    card4Badge: "4",
    card4Title: "Μήκος Πλευρών και Περίμετρος Πολυγώνων",
    card4Desc: "Περίμετρος (Π) ενός πολυγώνου ονομάζεται το άθροισμα των μηκών όλων των πλευρών του (εκφρασμένων στην ίδια μονάδα μέτρησης):",
    card4List1: "• Τυχαίο Πολύγωνο ΑΒΓΔ...: Π ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＋ ... (για τρίγωνο ΑΒΓ: Π ＝ α ＋ β ＋ γ).",
    card4List2: "• Κανονικό Πολύγωνο ν πλευρών (π.χ. ισόπλευρο τρίγωνο ν ＝ 3, τετράγωνο ν ＝ 4, κανονικό εξάγωνο ν ＝ 6) με πλευρά α: Π ＝ ν · α.",
    card4Note: "Για ορθογώνιο παραλληλόγραμμο με μήκος α και πλάτος β: Π ＝ 2 · α ＋ 2 · β ＝ 2 · (α ＋ β).",

    // Interactive Lab
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Μέρος Α: Σκάλα Μετατροπών Μονάδων Μήκους • Μέρος Β: Άθροισμα & Διαφορά Τμημάτων",

    labPartATitle: "ΜΕΡΟΣ Α: ΜΕΤΑΤΡΟΠΕΑΣ ΜΟΝΑΔΩΝ ΜΗΚΟΥΣ (km ──▶ mm)",
    labSelectUnit: "1. ΕΠΙΛΕΞΤΕ ΑΡΧΙΚΗ ΜΟΝΑΔΑ:",
    labValueSlider: "2. ΑΡΧΙΚΗ ΤΙΜΗ ΜΗΚΟΥΣ",
    labTargetUnit: "3. ΜΕΤΑΤΡΟΠΗ ΣΕ ΜΟΝΑΔΑ:",
    labScaleCaption: "Κλίμακα SI: Κάθε βήμα δεξιά (×10) • Κάθε βήμα αριστερά (÷10)",
    labStepRight: "Κατεβαίνουμε {steps} θέσεις δεξιά ⇒ Πολλαπλασιάζουμε με {factor}!",
    labStepLeft: "Ανεβαίνουμε {steps} θέσεις αριστερά ⇒ Διαιρούμε με {factor}!",
    labStepSame: "Ίδια μονάδα μέτρησης (0 θέσεις μετακίνησης).",

    labPartBTitle: "ΜΕΡΟΣ Β: ΕΡΓΑΣΤΗΡΙΟ ΣΥΓΚΡΙΣΗΣ, ΑΘΡΟΙΣΜΑΤΟΣ & ΔΙΑΦΟΡΑΣ ΤΜΗΜΑΤΩΝ",
    labSegABSlider: "Μήκος τμήματος ΑΒ",
    labSegCDSlider: "Μήκος τμήματος ΓΔ",
    labOpMode: "ΠΡΑΞΗ ΠΑΝΩ ΣΤΗΝ ΕΥΘΕΙΑ:",
    labOpSum: "Άθροισμα (ΑΒ ＋ ΓΔ)",
    labOpDiff: "Διαφορά (|ΑΒ － ΓΔ|)",
    labStatComp: "Σύγκριση",
    labStatSum: "Άθροισμα ΑΒ＋ΓΔ",
    labStatDiff: "Διαφορά |ΑΒ－ΓΔ|",
    labStatPerim: "Περίμετρος Ορθογ. (ΑΒ, ΓΔ)",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΜΕΤΑΤΡΟΠΕΣ & ΑΘΡΟΙΣΜΑ ΤΜΗΜΑΤΩΝ",
    prob1Title: "Υπολογισμός μήκους τεθλασμένης γραμμής σε διαφορετικές μονάδες",
    prob1DescPre: "Ένας μαθητής σχεδίασε στον χάρακα τρία διαδοχικά ευθύγραμμα τμήματα: ΑΒ ＝ 4,5 cm, ΒΓ ＝ 38 mm και ΓΔ ＝ 0,7 dm. Να συγκρίνετε τα τμήματα και να βρείτε το συνολικό μήκος ΑΔ ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ σε εκατοστόμετρα (cm) και σε μέτρα (m).",
    prob1DiagramCaption: "Διαδοχικά τμήματα ΑΒ ＝ 4,5 cm, ΒΓ ＝ 3,8 cm και ΓΔ ＝ 7 cm (Σύνολο 15,3 cm)",
    prob1ColPart: "Βήμα",
    prob1ColRule: "Μαθηματική Σχέση / Μετατροπή",
    prob1ColCalc: "Υπολογισμός & Απάντηση",
    prob1Row1Q: "1. Μετατροπή σε cm",
    prob1Row1R: "1 cm ＝ 10 mm και 1 dm ＝ 10 cm",
    prob1Row1C: "ΑΒ ＝ 4,5 cm, ΒΓ ＝ 3,8 cm, ΓΔ ＝ 7 cm",
    prob1Row2Q: "2. Σύγκριση μηκών",
    prob1Row2R: "Διάταξη από το μικρότερο στο μεγαλύτερο",
    prob1Row2C: "ΒΓ < ΑΒ < ΓΔ (3,8 < 4,5 < 7)",
    prob1Row3Q: "3. Άθροισμα σε cm & m",
    prob1Row3R: "ΑΔ ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ και 1 m ＝ 100 cm",
    prob1Row3C: "15,3 cm ＝ 0,153 m",
    prob1ResSummary: "Απάντηση:",
    prob1ResText: "Ισχύει ΒΓ < ΑΒ < ΓΔ και το συνολικό μήκος είναι ΑΔ ＝ 15,3 cm (ή 0,153 m).",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΠΕΡΙΜΕΤΡΟΣ ΠΟΛΥΓΩΝΟΥ & ΕΥΡΕΣΗ ΠΛΕΥΡΑΣ",
    prob2Title: "Περίμετρος τετραπλεύρου και σύγκριση με κανονικό πεντάγωνο",
    prob2DescPre: "Ένα τετράπλευρο ΑΒΓΔ έχει πλευρές ΑΒ ＝ 6,4 cm, ΒΓ ＝ 52 mm, ΓΔ ＝ 0,8 dm και περίμετρο Π ＝ 25 cm. α) Να υπολογίσετε το μήκος της τέταρτης πλευράς ΔΑ σε cm. β) Αν ένα κανονικό πεντάγωνο έχει την ίδια περίμετρο (25 cm), πόσο είναι το μήκος κάθε πλευράς του;",
    prob2DiagramCaption: "Τετράπλευρο ΑΒΓΔ (Π ＝ 25 cm ⇒ ΔΑ ＝ 5,4 cm) & Κανονικό Πεντάγωνο",
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Μαθηματική Σχέση",
    prob2ColCalc: "Υπολογισμός & Απάντηση",
    prob2Row1Q: "α) Πλευρές σε cm",
    prob2Row1R: "ΒΓ ＝ 52 mm ＝ 5,2 cm, ΓΔ ＝ 0,8 dm ＝ 8 cm",
    prob2Row1C: "Άθροισμα 3 πλευρών: 6,4 ＋ 5,2 ＋ 8 ＝ 19,6 cm",
    prob2Row2Q: "α) Πλευρά ΔΑ",
    prob2Row2R: "ΔΑ ＝ Π － (ΑΒ ＋ ΒΓ ＋ ΓΔ)",
    prob2Row2C: "25 － 19,6 ＝ 5,4 cm",
    prob2Row3Q: "β) Πλευρά 5-γώνου",
    prob2Row3R: "Π ＝ 5 · α (κανονικό πεντάγωνο)",
    prob2Row3C: "α ＝ 25 ÷ 5 ＝ 5 cm",
    prob2ResSummary: "Απάντηση:",
    prob2ResText: "α) Η πλευρά ΔΑ έχει μήκος 5,4 cm. β) Κάθε πλευρά του κανονικού πενταγώνου είναι 5 cm.",

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΗ ΜΕΤΡΗΣΗ ΜΗΚΟΥΣ & ΠΕΡΙΜΕΤΡΟ",
    alert1Title: "Πράξεις με διαφορετικές μονάδες μέτρησης:",
    alert1Desc: "Ποτέ δεν προσθέτουμε ή συγκρίνουμε μήκη όπως 5 cm ＋ 30 mm ＝ 35! Μετατρέπουμε πάντα πρώτα όλα τα μήκη στην ΙΔΙΑ μονάδα (π.χ. 5 cm ＋ 3 cm ＝ 8 cm).",
    alert2Title: "Σύγχυση δεκατόμετρου (dm) και δεκάμετρου (dam):",
    alert2Desc: "Το dm (decimeter) είναι 0,1 m (10 cm), ενώ το dam (decameter) είναι 10 m. Προσέχετε το γράμμα «a»!",
    alert3Title: "Περίμετρος ≠ Εμβαδόν:",
    alert3Desc: "Η περίμετρος είναι μήκος (μετριέται σε cm, m, km) και βρίσκεται προσθέτοντας τις εξωτερικές πλευρές ενός πολυγώνου — δεν πολλαπλασιάζουμε πλευρές μεταξύ τους!",

    // Bottom
    bottomTitle: "Εξασκηθείτε στη Μέτρηση Μήκους, τα Ευθύγραμμα Τμήματα & την Περίμετρο!",
    bottomDesc: "Δοκιμάστε τις γνώσεις σας στις μετατροπές μονάδων μήκους, στη σύγκριση, το άθροισμα και τη διαφορά ευθυγράμμων τμημάτων και στην περίμετρο πολυγώνων με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Length Measurement, Units, Line Segments & Polygon Perimeter | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory: measuring length, multiples and submultiples of the meter, unit conversions, comparing, adding and subtracting line segments, polygon perimeter.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 16 • GRADE 7",
    heroTitle: "Measuring Length • Line Segments & Polygon Perimeter",
    heroDesc: "Learn how we measure length in the International System of Units (SI), convert multiples and submultiples of the meter, compare, add, and subtract line segments, and calculate polygon perimeters!",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Measuring Length and Units of Length (SI)",
    card1Desc: "Measuring a line segment AB means comparing it with another segment MN chosen as the unit of measurement. The result is a positive number called the length of AB:",
    card1List1: "• Base Unit (SI): The meter (1 m). Measuring tools: ruler, tape measure, caliper, laser distance meter.",
    card1List2: "• Multiples of the meter (×10 per step): 1 dam ＝ 10 m (decameter), 1 hm ＝ 100 m (hectometer), 1 km ＝ 1,000 m (kilometer).",
    card1List3: "• Submultiples of the meter (÷10 per step): 1 dm ＝ 0.1 m (decimeter), 1 cm ＝ 0.01 m (centimeter), 1 mm ＝ 0.001 m (millimeter).",

    // Card 2
    card2Badge: "2",
    card2Title: "Rules for Converting Length Units",
    card2Desc: "Metric length units form a decimal system where each unit is 10 times larger than the next smaller unit:",
    card2List1: "• From LARGER to SMALLER unit: Multiply by 10, 100, 1,000... (shift the decimal point RIGHT by as many steps as you move down the scale).",
    card2List2: "• From SMALLER to LARGER unit: Divide by 10, 100, 1,000... (shift the decimal point LEFT by as many steps as you move up the scale).",
    card2List3: "• Key equalities: 1 m ＝ 10 dm ＝ 100 cm ＝ 1,000 mm • 1 km ＝ 1,000 m ＝ 100,000 cm • 1 cm ＝ 10 mm.",

    // Card 3
    card3Badge: "3",
    card3Title: "Comparing, Adding & Subtracting Line Segments",
    card3Desc: "To compare or perform operations on two line segments AB and CD, their lengths must first be expressed in the SAME unit of measurement:",
    card3List1: "• Comparing Segments: If their lengths are equal (AB ＝ CD), the segments are congruent. If AB > CD (or AB < CD), segment AB is longer (or shorter) than CD.",
    card3List2: "• Sum of Segments (AB ＋ CD): Placing AB and BC consecutively along the same line (sharing endpoint B) forms their sum AC: AC ＝ AB ＋ BC.",
    card3List3: "• Difference of Segments (AB － CD, with AB > CD): The segment that added to CD yields AB.",

    // Card 4
    card4Badge: "4",
    card4Title: "Side Lengths and Perimeter of Polygons",
    card4Desc: "The perimeter (P) of a polygon is the sum of the lengths of all its sides (expressed in the same unit of measurement):",
    card4List1: "• General Polygon ABCD...: P ＝ AB ＋ BC ＋ CD ＋ ... (for triangle ABC: P ＝ a ＋ b ＋ c).",
    card4List2: "• Regular n-sided Polygon (e.g., equilateral triangle n ＝ 3, square n ＝ 4, regular hexagon n ＝ 6) with side a: P ＝ n · a.",
    card4Note: "For a rectangle with length a and width b: P ＝ 2 · a ＋ 2 · b ＝ 2 · (a ＋ b).",

    // Interactive Lab
    labBadge: "INTERACTIVE LAB",
    labTitle: "Part A: Length Unit Conversion Ladder • Part B: Segment Sum & Difference",

    labPartATitle: "PART A: METRIC LENGTH CONVERTER (km ──▶ mm)",
    labSelectUnit: "1. SELECT SOURCE UNIT:",
    labValueSlider: "2. INITIAL LENGTH VALUE",
    labTargetUnit: "3. CONVERT TO TARGET UNIT:",
    labScaleCaption: "SI Scale: Each step right (×10) • Each step left (÷10)",
    labStepRight: "Move {steps} step(s) right ⇒ Multiply by {factor}!",
    labStepLeft: "Move {steps} step(s) left ⇒ Divide by {factor}!",
    labStepSame: "Same unit of measurement (0 steps shifted).",

    labPartBTitle: "PART B: LINE SEGMENT COMPARISON, SUM & DIFFERENCE LAB",
    labSegABSlider: "Length of segment AB",
    labSegCDSlider: "Length of segment CD",
    labOpMode: "OPERATION ON A LINE:",
    labOpSum: "Sum (AB ＋ CD)",
    labOpDiff: "Difference (|AB － CD|)",
    labStatComp: "Comparison",
    labStatSum: "Sum AB＋CD",
    labStatDiff: "Diff |AB－CD|",
    labStatPerim: "Rect. Perimeter (AB, CD)",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: UNIT CONVERSIONS & SEGMENT SUM",
    prob1Title: "Finding the total length of a broken line across different units",
    prob1DescPre: "A student drew three consecutive line segments: AB ＝ 4.5 cm, BC ＝ 38 mm, and CD ＝ 0.7 dm. Compare the segments and find the total length AD ＝ AB ＋ BC ＋ CD in centimeters (cm) and in meters (m).",
    prob1DiagramCaption: "Consecutive segments AB ＝ 4.5 cm, BC ＝ 3.8 cm, and CD ＝ 7 cm (Total 15.3 cm)",
    prob1ColPart: "Step",
    prob1ColRule: "Mathematical Relation / Conversion",
    prob1ColCalc: "Calculation & Answer",
    prob1Row1Q: "1. Convert to cm",
    prob1Row1R: "1 cm ＝ 10 mm and 1 dm ＝ 10 cm",
    prob1Row1C: "AB ＝ 4.5 cm, BC ＝ 3.8 cm, CD ＝ 7 cm",
    prob1Row2Q: "2. Compare lengths",
    prob1Row2R: "Order from shortest to longest",
    prob1Row2C: "BC < AB < CD (3.8 < 4.5 < 7)",
    prob1Row3Q: "3. Sum in cm & m",
    prob1Row3R: "AD ＝ AB ＋ BC ＋ CD and 1 m ＝ 100 cm",
    prob1Row3C: "15.3 cm ＝ 0.153 m",
    prob1ResSummary: "Answer:",
    prob1ResText: "We have BC < AB < CD and the total length is AD ＝ 15.3 cm (or 0.153 m).",

    prob2Badge: "PROBLEM 2: POLYGON PERIMETER & UNKNOWN SIDE",
    prob2Title: "Perimeter of a quadrilateral and comparison with a regular pentagon",
    prob2DescPre: "A quadrilateral ABCD has sides AB ＝ 6.4 cm, BC ＝ 52 mm, CD ＝ 0.8 dm, and perimeter P ＝ 25 cm. (a) Calculate the length of the fourth side DA in cm. (b) If a regular pentagon has the same perimeter (25 cm), what is the length of each of its sides?",
    prob2DiagramCaption: "Quadrilateral ABCD (P ＝ 25 cm ⇒ DA ＝ 5.4 cm) & Regular Pentagon",
    prob2ColPart: "Question",
    prob2ColRule: "Mathematical Relation",
    prob2ColCalc: "Calculation & Answer",
    prob2Row1Q: "(a) Sides in cm",
    prob2Row1R: "BC ＝ 52 mm ＝ 5.2 cm, CD ＝ 0.8 dm ＝ 8 cm",
    prob2Row1C: "Sum of 3 sides: 6.4 ＋ 5.2 ＋ 8 ＝ 19.6 cm",
    prob2Row2Q: "(a) Side DA",
    prob2Row2R: "DA ＝ P － (AB ＋ BC ＋ CD)",
    prob2Row2C: "25 － 19.6 ＝ 5.4 cm",
    prob2Row3Q: "(b) Pentagon side",
    prob2Row3R: "P ＝ 5 · a (regular pentagon)",
    prob2Row3C: "a ＝ 25 ÷ 5 ＝ 5 cm",
    prob2ResSummary: "Answer:",
    prob2ResText: "(a) Side DA has length 5.4 cm. (b) Each side of the regular pentagon is 5 cm.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS IN LENGTH MEASUREMENT & PERIMETER",
    alert1Title: "Operating with different measurement units:",
    alert1Desc: "Never add or compare lengths like 5 cm ＋ 30 mm ＝ 35! Always convert all lengths to the SAME unit first (e.g., 5 cm ＋ 3 cm ＝ 8 cm).",
    alert2Title: "Confusing decimeter (dm) and decameter (dam):",
    alert2Desc: "1 dm (decimeter) equals 0.1 m (10 cm), whereas 1 dam (decameter) equals 10 m. Watch out for the letter 'a'!",
    alert3Title: "Perimeter ≠ Area:",
    alert3Desc: "Perimeter is a length (measured in cm, m, km) found by adding the outer sides of a polygon — never multiply side lengths together for perimeter!",

    // Bottom
    bottomTitle: "Practice Measuring Length, Line Segments & Polygon Perimeters!",
    bottomDesc: "Test your skills on metric unit conversions, comparing, adding, and subtracting line segments, and finding polygon perimeters with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function MikosTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const locCode = isEl ? 'el-GR' : 'en-US';
  const t = translations[isEl ? 'el' : 'en'];

  // State Μέρος Α: Μετατροπέας Μονάδων Μήκους
  const [srcUnit, setSrcUnit] = useState('m');
  const [dstUnit, setDstUnit] = useState('cm');
  const [inputVal, setInputVal] = useState(4.5);

  // State Μέρος Β: Εργαστήριο Σύγκρισης, Αθροίσματος & Διαφοράς Ευθυγράμμων Τμημάτων
  const [segAB, setSegAB] = useState(6);
  const [segCD, setSegCD] = useState(4);
  const [opMode, setOpMode] = useState('sum'); // 'sum' | 'diff'

  // Υπολογισμοί Μετατροπής Μονάδων (Μέρος Α)
  const srcIndex = UNIT_DEFS.findIndex((u) => u.key === srcUnit);
  const dstIndex = UNIT_DEFS.findIndex((u) => u.key === dstUnit);
  const stepDiff = dstIndex - srcIndex; // θετικό = δεξιά (πολλαπλασιασμός), αρνητικό = αριστερά (διαίρεση)
  const powerFactor = Math.pow(10, Math.abs(stepDiff));
  const convertedVal =
    stepDiff === 0
      ? inputVal
      : stepDiff > 0
      ? Number((inputVal * powerFactor).toPrecision(10))
      : Number((inputVal / powerFactor).toPrecision(10));

  const formatMetric = (num) => {
    if (Math.abs(num) >= 1000000 || (Math.abs(num) > 0 && Math.abs(num) < 0.0001)) {
      return num.toLocaleString(locCode, { maximumFractionDigits: 8 });
    }
    return num.toLocaleString(locCode, { maximumFractionDigits: 6 });
  };

  // Υπολογισμοί Ευθυγράμμων Τμημάτων (Μέρος Β)
  const segSum = Number((segAB + segCD).toFixed(1));
  const segDiff = Number(Math.abs(segAB - segCD).toFixed(1));
  const rectPerim = Number((2 * (segAB + segCD)).toFixed(1));
  const compSymbol = segAB > segCD ? '>' : segAB < segCD ? '<' : '＝';

  // Κλίμακα SVG για τα ευθύγραμμα τμήματα (max 20 cm -> 260 px)
  const pxPerCm = 13;
  const xStart = 35;
  const xEndAB = xStart + segAB * pxPerCm;
  const xEndSum = xStart + segSum * pxPerCm;
  const maxSeg = Math.max(segAB, segCD);
  const minSeg = Math.min(segAB, segCD);
  const xEndMax = xStart + maxSeg * pxPerCm;
  const xEndMin = xStart + minSeg * pxPerCm;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/55-mikos-ask"
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
                href="/a-gymnasiou/55-mikos-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΜΕΤΡΗΣΗ ΜΗΚΟΥΣ & ΜΟΝΑΔΕΣ ΜΕΤΡΗΣΗΣ */}
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

          {/* ΚΑΡΤΑ 2: ΜΕΤΑΤΡΟΠΕΣ ΜΟΝΑΔΩΝ ΜΗΚΟΥΣ */}
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

          {/* ΚΑΡΤΑ 3: ΣΥΓΚΡΙΣΗ, ΑΘΡΟΙΣΜΑ & ΔΙΑΦΟΡΑ ΕΥΘΥΓΡΑΜΜΩΝ ΤΜΗΜΑΤΩΝ */}
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

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div className="break-words [overflow-wrap:anywhere]">{t.card3List1}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card3List2}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card3List3}</div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΜΗΚΟΣ ΠΛΕΥΡΩΝ & ΠΕΡΙΜΕΤΡΟΣ ΠΟΛΥΓΩΝΩΝ */}
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
                <div className="break-words [overflow-wrap:anywhere]">{t.card4List1}</div>
                <div className="break-words [overflow-wrap:anywhere]">{t.card4List2}</div>
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
              📏 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-w-0">
            
            {/* ΜΕΡΟΣ Α: ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΜΟΝΑΔΩΝ ΜΗΚΟΥΣ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartATitle)}
                </span>

                {/* 1. Επιλογή αρχικής μονάδας */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labSelectUnit)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {UNIT_DEFS.map((u) => (
                      <button
                        key={u.key}
                        type="button"
                        onClick={() => setSrcUnit(u.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                          srcUnit === u.key
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Slider αρχικής τιμής */}
                <CustomSlider
                  label={t.labValueSlider}
                  min={0.5}
                  max={25}
                  step={0.5}
                  value={inputVal}
                  onChange={setInputVal}
                  unit={` ${srcUnit}`}
                  color="#4f46e5"
                  locale={locale}
                />

                {/* 3. Επιλογή τελικής μονάδας */}
                <div>
                  <span className="text-[11px] font-bold text-slate-600 block mb-1">
                    {toCleanUppercase(t.labTargetUnit)}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {UNIT_DEFS.map((u) => (
                      <button
                        key={u.key}
                        type="button"
                        onClick={() => setDstUnit(u.key)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                          dstUnit === u.key
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.key}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Οπτικό SVG Σκάλας Μονάδων SI */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 340 165" className="w-full max-w-md h-40 select-none">
                    {/* Οριζόντια γραμμή κλίμακας */}
                    <line x1="25" y1="68" x2="315" y2="68" stroke="#475569" strokeWidth="2" />

                    {/* Βέλη ×10 πάνω και ÷10 κάτω */}
                    <text x="170" y="22" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-300">
                      ×10 ──▶ ×10 ──▶ ×10 ──▶ ×10 ──▶ ×10 ──▶ ×10
                    </text>
                    <text x="170" y="114" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-300">
                      ◀── ÷10 ◀── ÷10 ◀── ÷10 ◀── ÷10 ◀── ÷10 ◀── ÷10
                    </text>

                    {/* Κόμβοι 7 μονάδων */}
                    {UNIT_DEFS.map((u, i) => {
                      const cx = 28 + i * 47.3;
                      const isSrc = u.key === srcUnit;
                      const isDst = u.key === dstUnit;
                      const minI = Math.min(srcIndex, dstIndex);
                      const maxI = Math.max(srcIndex, dstIndex);
                      const inRange = i >= minI && i <= maxI;

                      return (
                        <g key={u.key}>
                          {i < UNIT_DEFS.length - 1 && inRange && i < maxI && (
                            <line
                              x1={cx}
                              y1="68"
                              x2={cx + 47.3}
                              y2="68"
                              stroke={stepDiff >= 0 ? '#34d399' : '#fbbf24'}
                              strokeWidth="3.5"
                            />
                          )}
                          <circle
                            cx={cx}
                            cy="68"
                            r={isSrc || isDst ? 15 : 12}
                            fill={
                              isSrc
                                ? '#4f46e5'
                                : isDst
                                ? '#059669'
                                : u.key === 'm'
                                ? '#1e293b'
                                : '#0f172a'
                            }
                            stroke={
                              isSrc
                                ? '#a5b4fc'
                                : isDst
                                ? '#6ee7b7'
                                : u.key === 'm'
                                ? '#fbbf24'
                                : '#64748b'
                            }
                            strokeWidth={isSrc || isDst ? '2.2' : '1.4'}
                          />
                          <text
                            x={cx}
                            y="71.5"
                            textAnchor="middle"
                            className="text-[9.5px] font-mono font-bold fill-white"
                          >
                            {u.key}
                          </text>
                        </g>
                      );
                    })}

                    {/* Αποτέλεσμα μετατροπής μέσα στο SVG */}
                    <text x="170" y="138" textAnchor="middle" className="text-[11px] font-mono font-bold fill-white">
                      {formatMetric(inputVal)} {srcUnit} ＝ {formatMetric(convertedVal)} {dstUnit}
                    </text>
                    <text x="170" y="155" textAnchor="middle" className="text-[8.5px] font-bold fill-slate-400">
                      {t.labScaleCaption}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Μήνυμα βημάτων μετατροπής */}
              <div
                className={`p-3 rounded-xl border text-xs font-bold leading-snug ${
                  stepDiff > 0
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : stepDiff < 0
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-indigo-50 border-indigo-200 text-indigo-950'
                }`}
              >
                {stepDiff > 0
                  ? t.labStepRight
                      .replace('{steps}', String(Math.abs(stepDiff)))
                      .replace('{factor}', powerFactor.toLocaleString(locCode))
                  : stepDiff < 0
                  ? t.labStepLeft
                      .replace('{steps}', String(Math.abs(stepDiff)))
                      .replace('{factor}', powerFactor.toLocaleString(locCode))
                  : t.labStepSame}
              </div>
            </div>

            {/* ΜΕΡΟΣ Β: ΕΡΓΑΣΤΗΡΙΟ ΣΥΓΚΡΙΣΗΣ, ΑΘΡΟΙΣΜΑΤΟΣ & ΔΙΑΦΟΡΑΣ ΕΥΘΥΓΡΑΜΜΩΝ ΤΜΗΜΑΤΩΝ */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4 min-w-0">
              <div className="space-y-3">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                  {toCleanUppercase(t.labPartBTitle)}
                </span>

                {/* Sliders μηκών ΑΒ και ΓΔ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSlider
                    label={t.labSegABSlider}
                    min={1}
                    max={10}
                    step={0.5}
                    value={segAB}
                    onChange={setSegAB}
                    unit=" cm"
                    color="#4f46e5"
                    locale={locale}
                  />
                  <CustomSlider
                    label={t.labSegCDSlider}
                    min={1}
                    max={10}
                    step={0.5}
                    value={segCD}
                    onChange={setSegCD}
                    unit=" cm"
                    color="#059669"
                    locale={locale}
                  />
                </div>

                {/* Επιλογή Άθροισμα / Διαφορά */}
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

                {/* SVG Γεωμετρική Αναπαράσταση Ευθυγράμμων Τμημάτων */}
                <div className="bg-slate-950 rounded-2xl p-3 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                  <svg viewBox="0 0 330 205" className="w-full max-w-sm h-48 select-none">
                    {/* Τμήμα ΑΒ */}
                    <line x1={xStart} y1="36" x2={xEndAB} y2="36" stroke="#818cf8" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx={xStart} cy="36" r="3.5" fill="#a5b4fc" />
                    <circle cx={xEndAB} cy="36" r="3.5" fill="#a5b4fc" />
                    <text x={xStart} y="25" textAnchor="middle" className="text-[9.5px] font-bold fill-indigo-300">{isEl ? 'Α' : 'A'}</text>
                    <text x={xEndAB} y="25" textAnchor="middle" className="text-[9.5px] font-bold fill-indigo-300">{isEl ? 'Β' : 'B'}</text>
                    <text x={(xStart + xEndAB) / 2} y="50" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-200">
                      {segAB.toLocaleString(locCode)} cm
                    </text>

                    {/* Τμήμα ΓΔ */}
                    <line x1={xStart} y1="82" x2={xStart + segCD * pxPerCm} y2="82" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
                    <circle cx={xStart} cy="82" r="3.5" fill="#6ee7b7" />
                    <circle cx={xStart + segCD * pxPerCm} cy="82" r="3.5" fill="#6ee7b7" />
                    <text x={xStart} y="71" textAnchor="middle" className="text-[9.5px] font-bold fill-emerald-300">{isEl ? 'Γ' : 'C'}</text>
                    <text x={xStart + segCD * pxPerCm} y="71" textAnchor="middle" className="text-[9.5px] font-bold fill-emerald-300">{isEl ? 'Δ' : 'D'}</text>
                    <text x={xStart + (segCD * pxPerCm) / 2} y="96" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-200">
                      {segCD.toLocaleString(locCode)} cm
                    </text>

                    {/* Διαχωριστική γραμμή */}
                    <line x1="20" y1="112" x2="310" y2="112" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                    {/* Προκύπτον τμήμα (Άθροισμα ή Διαφορά) */}
                    {opMode === 'sum' ? (
                      <>
                        <line x1={xStart} y1="145" x2={xEndAB} y2="145" stroke="#818cf8" strokeWidth="4" />
                        <line x1={xEndAB} y1="145" x2={xEndSum} y2="145" stroke="#34d399" strokeWidth="4" />
                        <circle cx={xStart} cy="145" r="3.8" fill="#fbbf24" />
                        <circle cx={xEndAB} cy="145" r="3.2" fill="#e2e8f0" />
                        <circle cx={xEndSum} cy="145" r="3.8" fill="#fbbf24" />
                        <text x={(xStart + xEndSum) / 2} y="166" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
                          {isEl
                            ? `ΑΒ ＋ ΓΔ ＝ ${segAB.toLocaleString(locCode)} ＋ ${segCD.toLocaleString(locCode)} ＝ ${segSum.toLocaleString(locCode)} cm`
                            : `AB ＋ CD ＝ ${segAB.toLocaleString(locCode)} ＋ ${segCD.toLocaleString(locCode)} ＝ ${segSum.toLocaleString(locCode)} cm`}
                        </text>
                      </>
                    ) : (
                      <>
                        <line x1={xStart} y1="145" x2={xEndMin} y2="145" stroke="#64748b" strokeWidth="3.5" strokeDasharray="3 2" />
                        <line x1={xEndMin} y1="145" x2={xEndMax} y2="145" stroke="#fbbf24" strokeWidth="4.2" />
                        <circle cx={xStart} cy="145" r="3.5" fill="#94a3b8" />
                        <circle cx={xEndMin} cy="145" r="3.8" fill="#fbbf24" />
                        <circle cx={xEndMax} cy="145" r="3.8" fill="#fbbf24" />
                        <text x={(xStart + xEndMax) / 2} y="166" textAnchor="middle" className="text-[10px] font-mono font-bold fill-amber-300">
                          {isEl
                            ? `|ΑΒ － ΓΔ| ＝ ${maxSeg.toLocaleString(locCode)} － ${minSeg.toLocaleString(locCode)} ＝ ${segDiff.toLocaleString(locCode)} cm`
                            : `|AB － CD| ＝ ${maxSeg.toLocaleString(locCode)} － ${minSeg.toLocaleString(locCode)} ＝ ${segDiff.toLocaleString(locCode)} cm`}
                        </text>
                      </>
                    )}

                    <text x="165" y="194" textAnchor="middle" className="text-[9.5px] font-bold fill-slate-300">
                      {isEl
                        ? `Σύγκριση: ΑΒ (${segAB.toLocaleString(locCode)} cm) ${compSymbol} ΓΔ (${segCD.toLocaleString(locCode)} cm)`
                        : `Comparison: AB (${segAB.toLocaleString(locCode)} cm) ${compSymbol} CD (${segCD.toLocaleString(locCode)} cm)`}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Κάρτες Στοιχείων */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-indigo-900 text-white rounded-xl">
                  <span className="text-[10px] text-indigo-200 block font-sans font-bold">{t.labStatComp}</span>
                  <strong>{isEl ? `ΑΒ ${compSymbol} ΓΔ` : `AB ${compSymbol} CD`}</strong>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl">
                  <span className="text-[10px] text-emerald-800 block font-sans font-bold">{t.labStatSum}</span>
                  <strong>{segSum.toLocaleString(locCode)} cm</strong>
                </div>
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-950 rounded-xl">
                  <span className="text-[10px] text-amber-800 block font-sans font-bold">{t.labStatDiff}</span>
                  <strong>{segDiff.toLocaleString(locCode)} cm</strong>
                </div>
                <div className="p-2.5 bg-slate-800 text-white rounded-xl">
                  <span className="text-[10px] text-slate-300 block font-sans font-bold">{t.labStatPerim}</span>
                  <strong>{rectPerim.toLocaleString(locCode)} cm</strong>
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
                    {/* Διαδοχικά τμήματα ΑΒ, ΒΓ, ΓΔ */}
                    <line x1="28" y1="68" x2="104" y2="68" stroke="#818cf8" strokeWidth="3.5" />
                    <line x1="104" y1="68" x2="168" y2="68" stroke="#34d399" strokeWidth="3.5" />
                    <line x1="168" y1="68" x2="292" y2="68" stroke="#fbbf24" strokeWidth="3.5" />

                    {/* Κορυφές */}
                    <circle cx="28" cy="68" r="3.5" fill="#a5b4fc" />
                    <circle cx="104" cy="68" r="3.5" fill="#6ee7b7" />
                    <circle cx="168" cy="68" r="3.5" fill="#fde68a" />
                    <circle cx="292" cy="68" r="3.5" fill="#fbbf24" />

                    <text x="28" y="55" textAnchor="middle" className="text-[9.5px] font-bold fill-white">{isEl ? 'Α' : 'A'}</text>
                    <text x="104" y="55" textAnchor="middle" className="text-[9.5px] font-bold fill-white">{isEl ? 'Β' : 'B'}</text>
                    <text x="168" y="55" textAnchor="middle" className="text-[9.5px] font-bold fill-white">{isEl ? 'Γ' : 'C'}</text>
                    <text x="292" y="55" textAnchor="middle" className="text-[9.5px] font-bold fill-white">{isEl ? 'Δ' : 'D'}</text>

                    {/* Μήκη σε cm */}
                    <text x="66" y="85" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-indigo-300">4,5 cm</text>
                    <text x="136" y="85" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-300">3,8 cm</text>
                    <text x="230" y="85" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">7 cm</text>

                    {/* Συνολικό άγκιστρο κάτω */}
                    <path d="M 28,102 L 28,112 L 292,112 L 292,102" fill="none" stroke="#94a3b8" strokeWidth="1.4" />
                    <text x="160" y="128" textAnchor="middle" className="text-[9.5px] font-mono font-bold fill-white">
                      {isEl ? 'ΑΔ ＝ 15,3 cm ＝ 0,153 m' : 'AD ＝ 15.3 cm ＝ 0.153 m'}
                    </text>
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
                    <div className="text-slate-600">{t.prob1Row2R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600 font-mono">{t.prob1Row3R}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[28%]">{t.prob1ColPart}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob1ColRule}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row1Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row2Q}</td>
                        <td className="p-2.5 break-words">{t.prob1Row2R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold break-words">{t.prob1Row3Q}</td>
                        <td className="p-2.5 font-mono break-words">{t.prob1Row3R}</td>
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
                    {/* Τετράπλευρο ΑΒΓΔ αριστερά */}
                    <polygon
                      points="34,126 116,126 130,52 46,44"
                      fill="rgba(99, 102, 241, 0.24)"
                      stroke="#818cf8"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <text x="30" y="138" textAnchor="end" className="text-[8.5px] font-bold fill-white">{isEl ? 'Α' : 'A'}</text>
                    <text x="120" y="138" textAnchor="start" className="text-[8.5px] font-bold fill-white">{isEl ? 'Β' : 'B'}</text>
                    <text x="134" y="49" textAnchor="start" className="text-[8.5px] font-bold fill-white">{isEl ? 'Γ' : 'C'}</text>
                    <text x="42" y="40" textAnchor="end" className="text-[8.5px] font-bold fill-white">{isEl ? 'Δ' : 'D'}</text>

                    <text x="75" y="139" textAnchor="middle" className="text-[8px] font-mono font-bold fill-indigo-300">6,4</text>
                    <text x="131" y="92" textAnchor="start" className="text-[8px] font-mono font-bold fill-emerald-300">5,2</text>
                    <text x="88" y="42" textAnchor="middle" className="text-[8px] font-mono font-bold fill-indigo-300">8</text>
                    <text x="32" y="88" textAnchor="end" className="text-[8px] font-mono font-bold fill-amber-300">5,4</text>

                    {/* Κανονικό πεντάγωνο δεξιά */}
                    <polygon
                      points="236,36 284,71 266,127 206,127 188,71"
                      fill="rgba(16, 185, 129, 0.24)"
                      stroke="#34d399"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <text x="236" y="84" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-emerald-200">
                      {isEl ? 'Π ＝ 25 cm' : 'P ＝ 25 cm'}
                    </text>
                    <text x="236" y="98" textAnchor="middle" className="text-[8.5px] font-mono font-bold fill-amber-300">
                      {isEl ? 'α ＝ 5 cm' : 'a ＝ 5 cm'}
                    </text>
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
                    <div className="font-bold text-indigo-700 font-mono flex flex-wrap items-center gap-x-1.5 gap-y-1">
                      <span>α ＝</span>
                      <Frac num="25" den="5" />
                      <span>＝ 5 cm</span>
                    </div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full table-fixed text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b w-[26%]">{t.prob2ColPart}</th>
                        <th className="p-2.5 border-b w-[38%]">{t.prob2ColRule}</th>
                        <th className="p-2.5 border-b w-[36%]">{t.prob2ColCalc}</th>
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
                        <td className="p-2.5 font-mono font-bold text-indigo-700 break-words">
                          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                            <span>α ＝</span>
                            <Frac num="25" den="5" />
                            <span>＝ 5 cm</span>
                          </div>
                        </td>
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
            href="/a-gymnasiou/55-mikos-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
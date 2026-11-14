import React, { useState } from 'react';
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

// Συγκεντρωτικό Λεξικό i18n
const translations = {
  el: {
    pageTitle: "Τα Τετράπλευρα: Κανόνας 4-4-4-2, Είδη & Ιδιότητες | Θεωρία Α' Γυμνασίου",
    pageDesc: "Θεωρία Α' Γυμνασίου για τα τετράπλευρα: κανόνας 4-4-4-2, άθροισμα γωνιών 360°, παραλληλόγραμμο, ορθογώνιο, ρόμβος, τετράγωνο, τραπέζιο και οι ιδιότητές τους.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 08 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Τα Τετράπλευρα: Κανόνας 4-4-4-2, Είδη & Ιδιότητες",
    heroDesc: "Γνωρίστε τα γεωμετρικά σχήματα με 4 πλευρές! Ανακαλύψτε τον κανόνα 4-4-4-2, μάθετε γιατί το άθροισμα των γωνιών κάθε τετραπλεύρου είναι 360° και εξερευνήστε τις ιδιότητες του παραλληλογράμμου, του ορθογωνίου, του ρόμβου, του τετραγώνου και του τραπεζίου.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Ορισμός, Κανόνας 4-4-4-2 & Άθροισμα Γωνιών 360°
    card1Badge: "1",
    card1Title: "Ορισμός, Κανόνας 4-4-4-2 & Γωνίες 360°",
    card1Desc: "Αν πάρουμε τέσσερα σημεία Α, Β, Γ, Δ (χωρίς τρία από αυτά να είναι συνευθειακά) και τα ενώσουμε διαδοχικά, σχηματίζεται το κυρτό τετράπλευρο ΑΒΓΔ.",
    card1RuleTitle: "Ο Κανόνας «4 - 4 - 4 - 2» του Τετραπλεύρου:",
    card1Rule1: "• 4 Κορυφές: Τα σημεία Α, Β, Γ και Δ.",
    card1Rule2: "• 4 Πλευρές: Τα τμήματα ΑΒ, ΒΓ, ΓΔ και ΔΑ (απέναντι ή διαδοχικές).",
    card1Rule3: (
      <>
        • 4 Γωνίες: Οι εσωτερικές γωνίες <Angle>Α</Angle>, <Angle>Β</Angle>, <Angle>Γ</Angle> και <Angle>Δ</Angle>.
      </>
    ),
    card1Rule4: "• 2 Διαγώνιοι: Τα τμήματα ΑΓ και ΒΔ που ενώνουν απέναντι κορυφές.",
    card1AngleSumFormula: (
      <span>
        Άθροισμα Γωνιών: <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＋ <Angle>Δ</Angle> ＝ 360°
      </span>
    ),
    card1ProofNote: "Η διαγώνιος ΑΓ χωρίζει το τετράπλευρο σε δύο τρίγωνα (ΑΒΓ και ΑΓΔ), οπότε 180° ＋ 180° ＝ 360°!",

    // Card 2: Παραλληλόγραμμο
    card2Badge: "2",
    card2Title: "Το Παραλληλόγραμμο",
    card2Desc: "Παραλληλόγραμμο ονομάζεται το τετράπλευρο που έχει τις απέναντι πλευρές του παράλληλες ανά δύο (ΑΒ ∥ ΔΓ και ΑΔ ∥ ΒΓ).",
    card2PropTitle: "Οι 3 Βασικές Ιδιότητες του Παραλληλογράμμου:",
    card2Prop1: "1. Πλευρές: Οι απέναντι πλευρές του είναι ίσες (ΑΒ ＝ ΔΓ και ΑΔ ＝ ΒΓ).",
    card2Prop2: (
      <>
        2. Γωνίες: Οι απέναντι γωνίες είναι ίσες (<Angle>Α</Angle> ＝ <Angle>Γ</Angle>, <Angle>Β</Angle> ＝ <Angle>Δ</Angle>), ενώ δύο διαδοχικές γωνίες είναι παραπληρωματικές (<Angle>Α</Angle> ＋ <Angle>Β</Angle> ＝ 180°).
      </>
    ),
    card2Prop3: "3. Διαγώνιοι: Οι διαγώνιοί του ΑΓ και ΒΔ διχοτομούνται (τέμνονται στο μέσο τους Ο: ΟΑ ＝ ΟΓ και ΟΒ ＝ ΟΔ).",

    // Card 3: Ορθογώνιο, Ρόμβος & Τετράγωνο
    card3Badge: "3",
    card3Title: "Ειδικά Παραλληλόγραμμα: Ορθογώνιο, Ρόμβος, Τετράγωνο",
    card3Desc: "Αποτελούν ειδικές περιπτώσεις παραλληλογράμμου (άρα έχουν όλες τις ιδιότητές του) και επιπλέον ξεχωριστά χαρακτηριστικά:",
    card3RectTitle: "1. Ορθογώνιο (Παραλληλόγραμμο με 4 ορθές γωνίες):",
    card3RectDesc: "Έχει και τις 4 γωνίες του ορθές (90°) και τις διαγωνίους του ίσες (ΑΓ ＝ ΒΔ) και διχοτομούμενες.",
    card3RhombTitle: "2. Ρόμβος (Παραλληλόγραμμο με 4 ίσες πλευρές):",
    card3RhombDesc: "Έχει και τις 4 πλευρές του ίσες (ΑΒ ＝ ΒΓ ＝ ΓΔ ＝ ΔΑ) και τις διαγωνίους του κάθετες (ΑΓ ⊥ ΒΔ), διχοτομούμενες και διχοτόμους των γωνιών του.",
    card3SqTitle: "3. Τετράγωνο (Ταυτόχρονα Ορθογώνιο και Ρόμβος):",
    card3SqDesc: "Έχει 4 ίσες πλευρές ΚΑΙ 4 ορθές γωνίες (90°). Οι διαγώνιοί του είναι ίσες, κάθετες, διχοτομούνται και διχοτομούν τις γωνίες (45°).",

    // Card 4: Το Τραπέζιο & Ισοσκελές Τραπέζιο
    card4Badge: "4",
    card4Title: "Το Τραπέζιο & το Ισοσκελές Τραπέζιο",
    card4Desc: "Τραπέζιο ονομάζεται το τετράπλευρο που έχει μόνο δύο απέναντι πλευρές παράλληλες (τις βάσεις) και τις άλλες δύο μη παράλληλες (τις μη παράλληλες πλευρές).",
    card4Prop1Title: "Γωνίες Τραπεζίου (ΑΒ ∥ ΔΓ):",
    card4Prop1Desc: (
      <>
        Οι προσκείμενες γωνίες σε κάθε μη παράλληλη πλευρά είναι παραπληρωματικές: <Angle>Α</Angle> ＋ <Angle>Δ</Angle> ＝ 180° και <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＝ 180°.
      </>
    ),
    card4IsoTitle: "Ισοσκελές Τραπέζιο:",
    card4IsoDesc: (
      <>
        Είναι το τραπέζιο που έχει τις μη παράλληλες πλευρές του ίσες (ΑΔ ＝ ΒΓ). Σε αυτό: οι γωνίες καθεμιάς βάσης είναι ίσες (<Angle>Δ</Angle> ＝ <Angle>Γ</Angle> και <Angle>Α</Angle> ＝ <Angle>Β</Angle>) και οι διαγώνιοί του είναι ίσες (ΑΓ ＝ ΒΔ).
      </>
    ),
    card4RightTrapTitle: "Ορθογώνιο Τραπέζιο:",
    card4RightTrapDesc: "Είναι το τραπέζιο στο οποίο η μία μη παράλληλη πλευρά είναι κάθετη στις βάσεις (σχηματίζει δύο ορθές γωνίες 90°).",

    // Interactive Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΤΕΤΡΑΠΛΕΥΡΩΝ",
    labTitle: "Διαδραστικός Εξερευνητής Ειδών Τετραπλεύρων",
    labSelectLabel: "ΕΠΙΛΕΞΤΕ ΤΕΤΡΑΠΛΕΥΡΟ ΓΙΑ ΕΞΕΤΑΣΗ:",
    shapeParallelogram: "Παραλληλόγραμμο",
    shapeRectangle: "Ορθογώνιο",
    shapeRhombus: "Ρόμβος",
    shapeSquare: "Τετράγωνο",
    shapeTrapezoid: "Τραπέζιο",
    shapeIsoTrapezoid: "Ισοσκελές Τραπέζιο",
    labToggleDiag: "Εμφάνιση Διαγωνίων (ΑΓ, ΒΔ)",
    labCardSides: "ΠΛΕΥΡΕΣ",
    labCardAngles: "ΓΩΝΙΕΣ",
    labCardDiagonals: "ΔΙΑΓΩΝΙΟΙ",
    labCardHierarchy: "ΣΧΕΣΗ / ΚΑΤΗΓΟΡΙΑ",

    // Lab Details per shape
    detParaSides: "Απέναντι ίσες & παράλληλες (ΑΒ ＝ ΔΓ, ΑΔ ＝ ΒΓ)",
    detParaAngles: "Απέναντι ίσες, διαδοχικές άθροισμα 180°",
    detParaDiags: "Διχοτομούνται στο Ο (ΟΑ ＝ ΟΓ, ΟΒ ＝ ΟΔ)",
    detParaHier: "Βασικό παραλληλόγραμμο",

    detRectSides: "Απέναντι ίσες & παράλληλες (ΑΒ ＝ ΔΓ, ΑΔ ＝ ΒΓ)",
    detRectAngles: "Και οι 4 γωνίες ορθές (90°)",
    detRectDiags: "Ίσες (ΑΓ ＝ ΒΔ) & διχοτομούνται",
    detRectHier: "Ειδικό παραλληλόγραμμο",

    detRhombSides: "Και οι 4 πλευρές ίσες (ΑΒ ＝ ΒΓ ＝ ΓΔ ＝ ΔΑ)",
    detRhombAngles: "Απέναντι ίσες, διαδοχικές άθροισμα 180°",
    detRhombDiags: "Κάθετες (ΑΓ ⊥ ΒΔ), διχοτομούνται & διχοτόμοι γωνιών",
    detRhombHier: "Ειδικό παραλληλόγραμμο",

    detSqSides: "Και οι 4 πλευρές ίσες (ΑΒ ＝ ΒΓ ＝ ΓΔ ＝ ΔΑ)",
    detSqAngles: "Και οι 4 γωνίες ορθές (90°)",
    detSqDiags: "Ίσες, κάθετες, διχοτομούνται & διχοτομούν γωνίες (45°)",
    detSqHier: "Παραλληλόγραμμο, Ορθογώνιο & Ρόμβος μαζί!",

    detTrapSides: "Μόνο 2 παράλληλες (βάσεις ΑΒ ∥ ΔΓ)",
    detTrapAngles: "Α ＋ Δ ＝ 180° και Β ＋ Γ ＝ 180°",
    detTrapDiags: "Γενικά άνισες (δεν διχοτομούνται)",
    detTrapHier: "Τετράπλευρο (όχι παραλληλόγραμμο)",

    detIsoTrapSides: "Βάσεις ΑΒ ∥ ΔΓ & μη παράλληλες ίσες (ΑΔ ＝ ΒΓ)",
    detIsoTrapAngles: "Γωνίες βάσης ίσες (Δ ＝ Γ, Α ＝ Β)",
    detIsoTrapDiags: "Ίσες μεταξύ τους (ΑΓ ＝ ΒΔ)",
    detIsoTrapHier: "Ειδικό τραπέζιο με άξονα συμμετρίας",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΓΩΝΙΕΣ ΤΕΤΡΑΠΛΕΥΡΟΥ & ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ",
    prob1Title: "Υπολογισμός γωνιών σε τετράπλευρο και σε παραλληλόγραμμο",
    prob1DescPre: (
      <>
        α) Σε ένα κυρτό τετράπλευρο ΑΒΓΔ δίνονται <Angle>Α</Angle> ＝ 85°, <Angle>Β</Angle> ＝ 110° και <Angle>Γ</Angle> ＝ 72°. Να υπολογιστεί η γωνία <Angle>Δ</Angle>. <br />
        β) Σε ένα παραλληλόγραμμο ΚΛΜΝ, η γωνία <Angle>Κ</Angle> είναι 64°. Να υπολογιστούν οι υπόλοιπες τρεις γωνίες <Angle>Λ</Angle>, <Angle>Μ</Angle> και <Angle>Ν</Angle>.
      </>
    ),
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Ιδιότητα / Θεώρημα",
    prob1ColCalc: "Υπολογισμός",
    prob1Row1Q: (
      <>
        α) Γωνία <Angle>Δ</Angle> τετραπλεύρου
      </>
    ),
    prob1Row1R: (
      <>
        <Angle>Α</Angle> ＋ <Angle>Β</Angle> ＋ <Angle>Γ</Angle> ＋ <Angle>Δ</Angle> ＝ 360°
      </>
    ),
    prob1Row1C: (
      <>
        <Angle>Δ</Angle> ＝ 360° － (85° ＋ 110° ＋ 72°) ＝ 360° － 267° ＝ 93°
      </>
    ),
    prob1Row2Q: (
      <>
        β) Απέναντι γωνία <Angle>Μ</Angle>
      </>
    ),
    prob1Row2R: "Οι απέναντι γωνίες παραλληλογράμμου είναι ίσες",
    prob1Row2C: (
      <>
        <Angle>Μ</Angle> ＝ <Angle>Κ</Angle> ＝ 64°
      </>
    ),
    prob1Row3Q: (
      <>
        β) Διαδοχικές <Angle>Λ</Angle> και <Angle>Ν</Angle>
      </>
    ),
    prob1Row3R: "Οι διαδοχικές γωνίες παραλληλογράμμου έχουν άθροισμα 180°",
    prob1Row3C: (
      <>
        <Angle>Λ</Angle> ＝ <Angle>Ν</Angle> ＝ 180° － 64° ＝ 116°
      </>
    ),
    prob1ResSummary: "Απάντηση:",
    prob1ResText: (
      <>
        α) <Angle>Δ</Angle> ＝ 93° και β) <Angle>Λ</Angle> ＝ 116°, <Angle>Μ</Angle> ＝ 64°, <Angle>Ν</Angle> ＝ 116°.
      </>
    ),

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΡΟΜΒΟΣ & ΙΣΟΣΚΕΛΕΣ ΤΡΑΠΕΖΙΟ",
    prob2Title: "Εφαρμογή ιδιοτήτων διαγωνίων και γωνιών",
    prob2DescPre: (
      <>
        α) Ένας ρόμβος ΑΒΓΔ έχει περίμετρο 36 cm και οι διαγώνιοί του τέμνονται στο Ο. Αν η γωνία Α<Angle>Β</Angle>Ο ＝ 32°, να βρεθούν η πλευρά του ρόμβου, η γωνία Α<Angle>Ο</Angle>Β και η γωνία <Angle>Β</Angle> του ρόμβου. <br />
        β) Σε ισοσκελές τραπέζιο ΚΛΜΝ (ΚΛ ∥ ΝΜ και ΚΝ ＝ ΛΜ) η γωνία <Angle>Ν</Angle> ＝ 68°. Να υπολογιστεί η γωνία <Angle>Κ</Angle>.
      </>
    ),
    prob2ColPart: "Ερώτημα",
    prob2ColRule: "Ιδιότητα Σχήματος",
    prob2ColCalc: "Υπολογισμός",
    prob2Row1Q: "α) Πλευρά ρόμβου",
    prob2Row1R: "Ο ρόμβος έχει 4 ίσες πλευρές",
    prob2Row1C: (
      <span className="inline-flex items-center gap-1">
        ΑΒ ＝ <Frac num="36" den="4" /> ＝ 9 cm
      </span>
    ),
    prob2Row2Q: (
      <>
        α) Γωνίες Α<Angle>Ο</Angle>Β & <Angle>Β</Angle>
      </>
    ),
    prob2Row2R: "Οι διαγώνιοι είναι κάθετες (90°) και διχοτόμοι των γωνιών",
    prob2Row2C: (
      <>
        Α<Angle>Ο</Angle>Β ＝ 90° και <Angle>Β</Angle> ＝ 2 · 32° ＝ 64°
      </>
    ),
    prob2Row3Q: (
      <>
        β) Γωνία <Angle>Κ</Angle> τραπεζίου
      </>
    ),
    prob2Row3R: (
      <>
        Προσκείμενες στη μη παράλληλη ΚΝ: <Angle>Κ</Angle> ＋ <Angle>Ν</Angle> ＝ 180°
      </>
    ),
    prob2Row3C: (
      <>
        <Angle>Κ</Angle> ＝ 180° － 68° ＝ 112°
      </>
    ),
    prob2ResSummary: "Συμπέρασμα:",
    prob2ResText: (
      <>
        α) Πλευρά 9 cm, Α<Angle>Ο</Angle>Β ＝ 90°, <Angle>Β</Angle> ＝ 64° και β) <Angle>Κ</Angle> ＝ 112°.
      </>
    ),

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΑ ΤΕΤΡΑΠΛΕΥΡΑ",
    alert1Title: "Κάθε τετράγωνο είναι ρόμβος και ορθογώνιο (όχι το αντίστροφο!):",
    alert1Desc: "Το τετράγωνο διαθέτει όλες τις ιδιότητες του παραλληλογράμμου, του ορθογωνίου και του ρόμβου. Όμως ένας ρόμβος δεν είναι υποχρεωτικά τετράγωνο (αν δεν έχει ορθές γωνίες).",
    alert2Title: "Οι διαγώνιοι του παραλληλογράμμου δεν είναι πάντα ίσες ή κάθετες:",
    alert2Desc: "Σε ένα γενικό παραλληλόγραμμο οι διαγώνιοι μόνο διχοτομούνται. Γίνονται ίσες στο ορθογώνιο και κάθετες στον ρόμβο.",
    alert3Title: "Το τραπέζιο δεν είναι παραλληλόγραμμο:",
    alert3Desc: "Το τραπέζιο έχει ΜΟΝΟ ένα ζεύγος παράλληλων πλευρών (τις βάσεις). Επομένως οι απέναντι πλευρές του δεν είναι ίσες και οι διαγώνιοί του δεν διχοτομούνται.",
    alert4Title: "Ονομασία κορυφών με κυκλική σειρά:",
    alert4Desc: "Όταν γράφουμε «τετράπλευρο ΑΒΓΔ», ονομάζουμε τις κορυφές με τη σειρά γύρω από το σχήμα (όχι χιαστί).",

    // Bottom
    bottomTitle: "Εμπεδώστε τα Τετράπλευρα στην Πράξη!",
    bottomDesc: "Εξασκηθείτε στον κανόνα 4-4-4-2, στα είδη τετραπλεύρων και στις ιδιότητες παραλληλογράμμου, ορθογωνίου, ρόμβου, τετραγώνου και τραπεζίου.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Quadrilaterals: 4-4-4-2 Rule, Types & Properties | Grade 7 Theory",
    pageDesc: "Grade 7 geometry theory on quadrilaterals: 4-4-4-2 rule, 360° angle sum, parallelogram, rectangle, rhombus, square, trapezoid, and their properties.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 08 • GRADE 7",
    heroTitle: "Quadrilaterals: 4-4-4-2 Rule, Types & Properties",
    heroDesc: "Master four-sided polygons! Learn the 4-4-4-2 rule, see why the interior angles of every quadrilateral sum to 360°, and explore the properties of parallelograms, rectangles, rhombuses, squares, and trapezoids.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Definition, 4-4-4-2 Rule & 360° Angle Sum",
    card1Desc: "Given four points A, B, C, D (no three collinear) connected sequentially, a convex quadrilateral ABCD is formed.",
    card1RuleTitle: "The «4 - 4 - 4 - 2» Rule of a Quadrilateral:",
    card1Rule1: "• 4 Vertices: The points A, B, C, and D.",
    card1Rule2: "• 4 Sides: Segments AB, BC, CD, and DA (opposite or consecutive).",
    card1Rule3: "• 4 Angles: Interior angles ∠A, ∠B, ∠C, and ∠D.",
    card1Rule4: "• 2 Diagonals: Segments AC and BD joining opposite vertices.",
    card1AngleSumFormula: "Angle Sum: ∠A ＋ ∠B ＋ ∠C ＋ ∠D ＝ 360°",
    card1ProofNote: "Diagonal AC divides the quadrilateral into two triangles (ABC and ACD), so 180° ＋ 180° ＝ 360°!",

    // Card 2
    card2Badge: "2",
    card2Title: "The Parallelogram",
    card2Desc: "A parallelogram is a quadrilateral with both pairs of opposite sides parallel (AB ∥ DC and AD ∥ BC).",
    card2PropTitle: "The 3 Core Properties of a Parallelogram:",
    card2Prop1: "1. Sides: Opposite sides are equal in length (AB ＝ DC and AD ＝ BC).",
    card2Prop2: "2. Angles: Opposite angles are equal (∠A ＝ ∠C, ∠B ＝ ∠D), and consecutive angles are supplementary (∠A ＋ ∠B ＝ 180°).",
    card2Prop3: "3. Diagonals: Diagonals AC and BD bisect each other (intersect at their midpoint O: OA ＝ OC and OB ＝ OD).",

    // Card 3
    card3Badge: "3",
    card3Title: "Special Parallelograms: Rectangle, Rhombus, Square",
    card3Desc: "These are special types of parallelograms (inheriting all parallelogram properties) with additional features:",
    card3RectTitle: "1. Rectangle (Parallelogram with 4 right angles):",
    card3RectDesc: "All 4 angles are 90° and its diagonals are equal (AC ＝ BD) and bisect each other.",
    card3RhombTitle: "2. Rhombus (Parallelogram with 4 equal sides):",
    card3RhombDesc: "All 4 sides are equal (AB ＝ BC ＝ CD ＝ DA) and its diagonals are perpendicular (AC ⊥ BD), bisect each other, and bisect the interior angles.",
    card3SqTitle: "3. Square (Both a Rectangle and a Rhombus):",
    card3SqDesc: "Has 4 equal sides AND 4 right angles (90°). Its diagonals are equal, perpendicular, bisect each other, and bisect the angles into 45°.",

    // Card 4
    card4Badge: "4",
    card4Title: "The Trapezoid & Isosceles Trapezoid",
    card4Desc: "A trapezoid is a quadrilateral with exactly one pair of parallel opposite sides (called bases) and two non-parallel sides (legs).",
    card4Prop1Title: "Trapezoid Angles (AB ∥ DC):",
    card4Prop1Desc: "Angles adjacent to each non-parallel leg are supplementary: ∠A ＋ ∠D ＝ 180° and ∠B ＋ ∠C ＝ 180°.",
    card4IsoTitle: "Isosceles Trapezoid:",
    card4IsoDesc: "A trapezoid whose non-parallel legs are equal (AD ＝ BC). Base angles are equal (∠D ＝ ∠C and ∠A ＝ ∠B) and its diagonals are equal (AC ＝ BD).",
    card4RightTrapTitle: "Right Trapezoid:",
    card4RightTrapDesc: "A trapezoid in which one leg is perpendicular to the bases (forming two 90° right angles).",

    // Interactive Lab
    labBadge: "QUADRILATERALS LAB",
    labTitle: "Interactive Quadrilateral Types Explorer",
    labSelectLabel: "SELECT A QUADRILATERAL TO INSPECT:",
    shapeParallelogram: "Parallelogram",
    shapeRectangle: "Rectangle",
    shapeRhombus: "Rhombus",
    shapeSquare: "Square",
    shapeTrapezoid: "Trapezoid",
    shapeIsoTrapezoid: "Isosceles Trapezoid",
    labToggleDiag: "Show Diagonals (AC, BD)",
    labCardSides: "SIDES",
    labCardAngles: "ANGLES",
    labCardDiagonals: "DIAGONALS",
    labCardHierarchy: "HIERARCHY / TYPE",

    detParaSides: "Opposite sides equal & parallel (AB ＝ DC, AD ＝ BC)",
    detParaAngles: "Opposite equal, consecutive sum to 180°",
    detParaDiags: "Bisect each other at O (OA ＝ OC, OB ＝ OD)",
    detParaHier: "Base parallelogram",

    detRectSides: "Opposite sides equal & parallel (AB ＝ DC, AD ＝ BC)",
    detRectAngles: "All 4 angles are right angles (90°)",
    detRectDiags: "Equal (AC ＝ BD) & bisect each other",
    detRectHier: "Special parallelogram",

    detRhombSides: "All 4 sides equal (AB ＝ BC ＝ CD ＝ DA)",
    detRhombAngles: "Opposite equal, consecutive sum to 180°",
    detRhombDiags: "Perpendicular (AC ⊥ BD), bisect each other & angles",
    detRhombHier: "Special parallelogram",

    detSqSides: "All 4 sides equal (AB ＝ BC ＝ CD ＝ DA)",
    detSqAngles: "All 4 angles are right angles (90°)",
    detSqDiags: "Equal, perpendicular, bisect each other & angles (45°)",
    detSqHier: "Parallelogram, Rectangle & Rhombus combined!",

    detTrapSides: "Only 2 parallel sides (bases AB ∥ DC)",
    detTrapAngles: "∠A ＋ ∠D ＝ 180° and ∠B ＋ ∠C ＝ 180°",
    detTrapDiags: "Generally unequal (do not bisect each other)",
    detTrapHier: "Quadrilateral (not a parallelogram)",

    detIsoTrapSides: "Bases AB ∥ DC & equal legs (AD ＝ BC)",
    detIsoTrapAngles: "Equal base angles (∠D ＝ ∠C, ∠A ＝ ∠B)",
    detIsoTrapDiags: "Equal diagonals (AC ＝ BD)",
    detIsoTrapHier: "Special trapezoid with symmetry axis",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: QUADRILATERAL & PARALLELOGRAM ANGLES",
    prob1Title: "Finding missing angles in a quadrilateral and a parallelogram",
    prob1DescPre: (
      <>
        (a) In convex quadrilateral ABCD, ∠A ＝ 85°, ∠B ＝ 110°, and ∠C ＝ 72°. Find ∠D. <br />
        (b) In parallelogram KLMN, ∠K ＝ 64°. Find the remaining three angles ∠L, ∠M, and ∠N.
      </>
    ),
    prob1ColPart: "Question",
    prob1ColRule: "Property / Theorem",
    prob1ColCalc: "Calculation",
    prob1Row1Q: "(a) Quadrilateral angle ∠D",
    prob1Row1R: "∠A ＋ ∠B ＋ ∠C ＋ ∠D ＝ 360°",
    prob1Row1C: "∠D ＝ 360° － (85° ＋ 110° ＋ 72°) ＝ 360° － 267° ＝ 93°",
    prob1Row2Q: "(b) Opposite angle ∠M",
    prob1Row2R: "Opposite angles of a parallelogram are equal",
    prob1Row2C: "∠M ＝ ∠K ＝ 64°",
    prob1Row3Q: "(b) Consecutive ∠L and ∠N",
    prob1Row3R: "Consecutive angles of a parallelogram sum to 180°",
    prob1Row3C: "∠L ＝ ∠N ＝ 180° － 64° ＝ 116°",
    prob1ResSummary: "Answer:",
    prob1ResText: "(a) ∠D ＝ 93° and (b) ∠L ＝ 116°, ∠M ＝ 64°, ∠N ＝ 116°.",

    prob2Badge: "PROBLEM 2: RHOMBUS & ISOSCELES TRAPEZOID",
    prob2Title: "Applying diagonal and angle properties",
    prob2DescPre: (
      <>
        (a) A rhombus ABCD has perimeter 36 cm and its diagonals intersect at O. If ∠ABO ＝ 32°, find the side length, ∠AOB, and angle ∠B of the rhombus. <br />
        (b) In isosceles trapezoid KLMN (KL ∥ NM and KN ＝ LM), angle ∠N ＝ 68°. Find angle ∠K.
      </>
    ),
    prob2ColPart: "Question",
    prob2ColRule: "Shape Property",
    prob2ColCalc: "Calculation",
    prob2Row1Q: "(a) Rhombus side length",
    prob2Row1R: "A rhombus has 4 equal sides",
    prob2Row1C: (
      <span className="inline-flex items-center gap-1">
        AB ＝ <Frac num="36" den="4" /> ＝ 9 cm
      </span>
    ),
    prob2Row2Q: "(a) Angles ∠AOB & ∠B",
    prob2Row2R: "Diagonals are perpendicular (90°) and bisect the angles",
    prob2Row2C: "∠AOB ＝ 90° and ∠B ＝ 2 · 32° ＝ 64°",
    prob2Row3Q: "(b) Trapezoid angle ∠K",
    prob2Row3R: "Adjacent to leg KN: ∠K ＋ ∠N ＝ 180°",
    prob2Row3C: "∠K ＝ 180° － 68° ＝ 112°",
    prob2ResSummary: "Conclusion:",
    prob2ResText: "(a) Side 9 cm, ∠AOB ＝ 90°, ∠B ＝ 64° and (b) ∠K ＝ 112°.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH QUADRILATERALS",
    alert1Title: "Every square is a rhombus and a rectangle (not vice versa!):",
    alert1Desc: "A square has all properties of a parallelogram, rectangle, and rhombus. However, a rhombus is not necessarily a square (unless its angles are 90°).",
    alert2Title: "Parallelogram diagonals are not always equal or perpendicular:",
    alert2Desc: "In a general parallelogram, diagonals only bisect each other. They become equal in a rectangle and perpendicular in a rhombus.",
    alert3Title: "A trapezoid is not a parallelogram:",
    alert3Desc: "A trapezoid has ONLY one pair of parallel sides (the bases). Its opposite sides are not equal and its diagonals do not bisect each other.",
    alert4Title: "Name vertices in cyclic order:",
    alert4Desc: "When writing «quadrilateral ABCD», name the vertices sequentially around the perimeter (never criss-cross).",

    // Bottom
    bottomTitle: "Master Quadrilaterals in Practice!",
    bottomDesc: "Practice the 4-4-4-2 rule, quadrilateral classification, and properties of parallelograms, rectangles, rhombuses, squares, and trapezoids.",
    bottomBtn: "START EXERCISES"
  }
};

export default function TetrapleuraTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  const [selectedShape, setSelectedShape] = useState('parallelogram'); // 'parallelogram' | 'rectangle' | 'rhombus' | 'square' | 'trapezoid' | 'isoTrapezoid'
  const [showDiagonals, setShowDiagonals] = useState(true);

  const vLbl = isEl ? { A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', O: 'Ο' } : { A: 'A', B: 'B', C: 'C', D: 'D', O: 'O' };

  // Συντεταγμένες κορυφών Α, Β, Γ, Δ σε viewBox 360x230
  const shapesData = {
    parallelogram: {
      A: { x: 110, y: 55 },
      B: { x: 295, y: 55 },
      C: { x: 250, y: 175 },
      D: { x: 65, y: 175 },
      sides: t.detParaSides,
      angles: t.detParaAngles,
      diags: t.detParaDiags,
      hier: t.detParaHier
    },
    rectangle: {
      A: { x: 80, y: 55 },
      B: { x: 280, y: 55 },
      C: { x: 280, y: 175 },
      D: { x: 80, y: 175 },
      sides: t.detRectSides,
      angles: t.detRectAngles,
      diags: t.detRectDiags,
      hier: t.detRectHier
    },
    rhombus: {
      A: { x: 180, y: 32 },
      B: { x: 285, y: 115 },
      C: { x: 180, y: 198 },
      D: { x: 75, y: 115 },
      sides: t.detRhombSides,
      angles: t.detRhombAngles,
      diags: t.detRhombDiags,
      hier: t.detRhombHier
    },
    square: {
      A: { x: 115, y: 45 },
      B: { x: 245, y: 45 },
      C: { x: 245, y: 175 },
      D: { x: 115, y: 175 },
      sides: t.detSqSides,
      angles: t.detSqAngles,
      diags: t.detSqDiags,
      hier: t.detSqHier
    },
    trapezoid: {
      A: { x: 110, y: 55 },
      B: { x: 235, y: 55 },
      C: { x: 300, y: 175 },
      D: { x: 65, y: 175 },
      sides: t.detTrapSides,
      angles: t.detTrapAngles,
      diags: t.detTrapDiags,
      hier: t.detTrapHier
    },
    isoTrapezoid: {
      A: { x: 115, y: 55 },
      B: { x: 245, y: 55 },
      C: { x: 295, y: 175 },
      D: { x: 65, y: 175 },
      sides: t.detIsoTrapSides,
      angles: t.detIsoTrapAngles,
      diags: t.detIsoTrapDiags,
      hier: t.detIsoTrapHier
    }
  };

  const current = shapesData[selectedShape] || shapesData.parallelogram;
  const { A, B, C, D } = current;

  // Σημείο τομής διαγωνίων ΑΓ και ΒΔ
  const getDiagIntersection = () => {
    const denom = (A.x - C.x) * (B.y - D.y) - (A.y - C.y) * (B.x - D.x);
    if (Math.abs(denom) < 1e-6) return { x: 180, y: 115 };
    const x = ((A.x * C.y - A.y * C.x) * (B.x - D.x) - (A.x - C.x) * (B.x * D.y - B.y * D.x)) / denom;
    const y = ((A.x * C.y - A.y * C.x) * (B.y - D.y) - (A.y - C.y) * (B.x * D.y - B.y * D.x)) / denom;
    return { x, y };
  };

  const O = getDiagIntersection();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.backNav}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/44-tetrapleura-ask"
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
                href="/a-gymnasiou/44-tetrapleura-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΟΡΙΣΜΟΣ, ΚΑΝΟΝΑΣ 4-4-4-2 & ΓΩΝΙΕΣ 360° */}
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

              {/* Εποπτικό Σχήμα & Κανόνας 4-4-4-2 */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 190 130" className="w-40 h-28 shrink-0">
                  <polygon points="55,22 150,32 165,108 30,104" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  {/* 2 Διαγώνιοι */}
                  <line x1="55" y1="22" x2="165" y2="108" stroke="#059669" strokeWidth="1.6" strokeDasharray="4 3" />
                  <line x1="150" y1="32" x2="30" y2="104" stroke="#059669" strokeWidth="1.6" strokeDasharray="4 3" />
                  <circle cx="55" cy="22" r="3" fill="#1e1b4b" />
                  <circle cx="150" cy="32" r="3" fill="#1e1b4b" />
                  <circle cx="165" cy="108" r="3" fill="#1e1b4b" />
                  <circle cx="30" cy="104" r="3" fill="#1e1b4b" />
                  <text x="48" y="15" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="158" y="25" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="176" y="114" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                  <text x="20" y="110" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.D}</text>
                </svg>
                <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                  <strong className="text-indigo-900 block mb-1">{t.card1RuleTitle}</strong>
                  <div>{t.card1Rule1}</div>
                  <div>{t.card1Rule2}</div>
                  <div>{t.card1Rule3}</div>
                  <div>{t.card1Rule4}</div>
                </div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-3 text-center font-mono text-xs sm:text-sm font-bold mb-2">
                {t.card1AngleSumFormula}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                💡 {t.card1ProofNote}
              </p>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ */}
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

              {/* Εποπτικό Σχήμα Παραλληλογράμμου */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 210 120" className="w-44 h-24 shrink-0">
                  <polygon points="55,22 180,22 155,98 30,98" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  <line x1="55" y1="22" x2="155" y2="98" stroke="#059669" strokeWidth="1.6" strokeDasharray="4 3" />
                  <line x1="180" y1="22" x2="30" y2="98" stroke="#059669" strokeWidth="1.6" strokeDasharray="4 3" />
                  <circle cx="105" cy="60" r="3.5" fill="#059669" />
                  <text x="50" y="15" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="186" y="15" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="162" y="111" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                  <text x="24" y="111" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.D}</text>
                  <text x="105" y="49" textAnchor="middle" className="text-[10px] font-bold fill-emerald-700">{vLbl.O}</text>
                </svg>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <strong className="text-indigo-900 block">{t.card2PropTitle}</strong>
                  <div>{t.card2Prop1}</div>
                  <div>{t.card2Prop2}</div>
                  <div>{t.card2Prop3}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΕΙΔΙΚΑ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΑΤΑ */}
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
                  <strong className="text-indigo-900 block mb-0.5">{t.card3RectTitle}</strong>
                  {t.card3RectDesc}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900 block mb-0.5">{t.card3RhombTitle}</strong>
                  {t.card3RhombDesc}
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-950 leading-relaxed">
                  <strong className="text-emerald-900 block mb-0.5">{t.card3SqTitle}</strong>
                  {t.card3SqDesc}
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΤΡΑΠΕΖΙΟ & ΙΣΟΣΚΕΛΕΣ ΤΡΑΠΕΖΙΟ */}
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

              <div className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-950 leading-relaxed">
                  <strong className="text-indigo-900 block mb-0.5">{t.card4Prop1Title}</strong>
                  {t.card4Prop1Desc}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900 block mb-0.5">{t.card4IsoTitle}</strong>
                  {t.card4IsoDesc}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900 block mb-0.5">{t.card4RightTrapTitle}</strong>
                  {t.card4RightTrapDesc}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-5 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              🔷 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                {toCleanUppercase(t.labSelectLabel)}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                {[
                  { id: 'parallelogram', label: t.shapeParallelogram },
                  { id: 'rectangle', label: t.shapeRectangle },
                  { id: 'rhombus', label: t.shapeRhombus },
                  { id: 'square', label: t.shapeSquare },
                  { id: 'trapezoid', label: t.shapeTrapezoid },
                  { id: 'isoTrapezoid', label: t.shapeIsoTrapezoid }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedShape(item.id)}
                    className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all ${
                      selectedShape === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200">
                <label className="inline-flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={showDiagonals}
                    onChange={(e) => setShowDiagonals(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{t.labToggleDiag}</span>
                </label>
              </div>
            </div>

            {/* Dynamic SVG Visualizer & Properties */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* SVG Καμβάς */}
              <div className="bg-slate-950 rounded-2xl p-3 sm:p-5 flex items-center justify-center shadow-inner overflow-hidden">
                <svg viewBox="0 0 360 230" className="w-full max-w-md h-52 sm:h-60 select-none">
                  {/* Πολύγωνο ΑΒΓΔ */}
                  <polygon
                    points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
                    fill="rgba(99, 102, 241, 0.24)"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Ορθές γωνίες σε Ορθογώνιο & Τετράγωνο */}
                  {(selectedShape === 'rectangle' || selectedShape === 'square') && (
                    <>
                      <polyline points={`${A.x},${A.y + 12} ${A.x + 12},${A.y + 12} ${A.x + 12},${A.y}`} fill="none" stroke="#34d399" strokeWidth="1.8" />
                      <polyline points={`${B.x - 12},${B.y} ${B.x - 12},${B.y + 12} ${B.x},${B.y + 12}`} fill="none" stroke="#34d399" strokeWidth="1.8" />
                      <polyline points={`${C.x - 12},${C.y} ${C.x - 12},${C.y - 12} ${C.x},${C.y - 12}`} fill="none" stroke="#34d399" strokeWidth="1.8" />
                      <polyline points={`${D.x},${D.y - 12} ${D.x + 12},${D.y - 12} ${D.x + 12},${D.y}`} fill="none" stroke="#34d399" strokeWidth="1.8" />
                    </>
                  )}

                  {/* Διαγώνιοι ΑΓ και ΒΔ */}
                  {showDiagonals && (
                    <>
                      <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#fbbf24" strokeWidth="2" strokeDasharray="5 3" />
                      <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="#34d399" strokeWidth="2" strokeDasharray="5 3" />

                      {/* Κάθετες διαγώνιοι: οριζόντιες/κατακόρυφες στον Ρόμβο, περιστραμμένες κατά 45° στο Τετράγωνο */}
                      {selectedShape === 'rhombus' && (
                        <polyline points={`${O.x},${O.y - 10} ${O.x + 10},${O.y - 10} ${O.x + 10},${O.y}`} fill="none" stroke="#fb7185" strokeWidth="1.8" />
                      )}
                      {selectedShape === 'square' && (
                        <polyline points={`${O.x + 7},${O.y - 7} ${O.x + 14},${O.y} ${O.x + 7},${O.y + 7}`} fill="none" stroke="#fb7185" strokeWidth="1.8" />
                      )}

                      <circle cx={O.x} cy={O.y} r="4" fill="#fbbf24" />
                      <text x={O.x} y={O.y - 11} textAnchor="middle" className="text-[11px] font-black fill-amber-300">
                        {vLbl.O}
                      </text>
                    </>
                  )}

                  {/* Κορυφές Α, Β, Γ, Δ */}
                  <circle cx={A.x} cy={A.y} r="4" fill="#ffffff" />
                  <text x={A.x - 8} y={A.y - 8} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.A}
                  </text>

                  <circle cx={B.x} cy={B.y} r="4" fill="#ffffff" />
                  <text x={B.x + 8} y={B.y - 8} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.B}
                  </text>

                  <circle cx={C.x} cy={C.y} r="4" fill="#ffffff" />
                  <text x={C.x + 8} y={C.y + 16} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.C}
                  </text>

                  <circle cx={D.x} cy={D.y} r="4" fill="#ffffff" />
                  <text x={D.x - 8} y={D.y + 16} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.D}
                  </text>
                </svg>
              </div>

              {/* Ταυτότητα Ιδιοτήτων */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <span className="font-black text-indigo-800 block mb-0.5 text-[11px]">
                    {toCleanUppercase(t.labCardSides)}
                  </span>
                  <div className="text-indigo-950 font-semibold leading-snug">{current.sides}</div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-black text-emerald-800 block mb-0.5 text-[11px]">
                    {toCleanUppercase(t.labCardAngles)}
                  </span>
                  <div className="text-emerald-950 font-semibold leading-snug">{current.angles}</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-black text-amber-800 block mb-0.5 text-[11px]">
                    {toCleanUppercase(t.labCardDiagonals)}
                  </span>
                  <div className="text-amber-950 font-semibold leading-snug">{current.diags}</div>
                </div>

                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="font-black text-slate-700 block mb-0.5 text-[11px]">
                    {toCleanUppercase(t.labCardHierarchy)}
                  </span>
                  <div className="text-slate-900 font-bold leading-snug">{current.hier}</div>
                </div>
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
                        <td className="p-2.5 font-mono">{t.prob1Row1R}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row2Q}</td>
                        <td className="p-2.5">{t.prob1Row2R}</td>
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
                        <td className="p-2.5">{t.prob2Row1R}</td>
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
            href="/a-gymnasiou/44-tetrapleura-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
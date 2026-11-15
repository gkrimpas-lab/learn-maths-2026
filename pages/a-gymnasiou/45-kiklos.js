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
    pageTitle: "Ο Κύκλος, Εσωτερικό Κύκλου & Στοιχεία | Θεωρία Α' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία Α' Γυμνασίου για τον κύκλο: ορισμός και συμβολισμός (Ο, ρ), εσωτερικό και εξωτερικό κύκλου, κυκλικός δίσκος, ακτίνα, χορδή, διάμετρος, τόξο και ημικύκλιο.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 09 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Ο Κύκλος, Εσωτερικό & Στοιχεία του Κύκλου",
    heroDesc: "Ανακαλύψτε το πιο συμμετρικό γεωμετρικό σχήμα του επιπέδου! Μάθετε τον ορισμό του κύκλου (Ο, ρ), τη διαφορά του από τον κυκλικό δίσκο, καθώς και τα βασικά του στοιχεία: ακτίνα, χορδή, διάμετρο, τόξο και ημικύκλιο.",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Ορισμός Κύκλου & Συμβολισμός
    card1Badge: "1",
    card1Title: "Ορισμός Κύκλου & Συμβολισμός (Ο, ρ)",
    card1Desc: (
      <>
        <strong>Κύκλος</strong> με κέντρο ένα σημείο Ο και ακτίνα έναν θετικό αριθμό ρ ονομάζεται το σύνολο όλων των σημείων του επιπέδου που απέχουν από το κέντρο Ο σταθερή απόσταση ίση με ρ.
      </>
    ),
    card1NotationTitle: "Συμβολισμός & Βασική Συνθήκη:",
    card1NotationDesc: (
      <>
        Ο κύκλος με κέντρο Ο και ακτίνα ρ συμβολίζεται <strong>(Ο, ρ)</strong>. Ένα σημείο Μ ανήκει στον κύκλο αν και μόνο αν <strong>ΟΜ ＝ ρ</strong>.
      </>
    ),
    card1Note: "Όλα τα σημεία που βρίσκονται πάνω στον κύκλο ισαπέχουν από το κέντρο του Ο κατά απόσταση ρ!",

    // Card 2: Εσωτερικό, Εξωτερικό & Κυκλικός Δίσκος
    card2Badge: "2",
    card2Title: "Εσωτερικό Κύκλου & Κυκλικός Δίσκος",
    card2Desc: "Ένας κύκλος (Ο, ρ) χωρίζει τα σημεία του επιπέδου σε τρεις περιοχές ανάλογα με την απόστασή τους από το κέντρο Ο:",
    card2Zone1Title: "1. Πάνω στον Κύκλο:",
    card2Zone1Desc: "Σημείο Μ με απόσταση ΟΜ ＝ ρ (ανήκει στην περιφέρεια του κύκλου).",
    card2Zone2Title: "2. Εσωτερικό του Κύκλου:",
    card2Zone2Desc: "Όλα τα σημεία Ε του επιπέδου με απόσταση από το κέντρο μικρότερη της ακτίνας: ΟΕ ＜ ρ.",
    card2Zone3Title: "3. Εξωτερικό του Κύκλου:",
    card2Zone3Desc: "Όλα τα σημεία Ζ του επιπέδου με απόσταση από το κέντρο μεγαλύτερη της ακτίνας: ΟΖ ＞ ρ.",
    card2DiskTitle: "Κυκλικός Δίσκος (Ο, ρ):",
    card2DiskDesc: "Ο κύκλος μαζί με το εσωτερικό του ονομάζεται κυκλικός δίσκος (Ο, ρ). Αποτελείται από όλα τα σημεία Μ με ΟΜ ≤ ρ.",

    // Card 3: Ακτίνα, Χορδή & Διάμετρος
    card3Badge: "3",
    card3Title: "Ακτίνα, Χορδή & Διάμετρος",
    card3Desc: "Τα βασικά ευθύγραμμα τμήματα που ορίζονται πάνω σε έναν κύκλο (Ο, ρ) είναι:",
    card3Item1Title: "1. Ακτίνα (ρ):",
    card3Item1Desc: "Κάθε ευθύγραμμο τμήμα που ενώνει το κέντρο Ο με ένα σημείο Α του κύκλου (ΟΑ ＝ ρ). Όλες οι ακτίνες ενός κύκλου είναι ίσες.",
    card3Item2Title: "2. Χορδή:",
    card3Item2Desc: "Κάθε ευθύγραμμο τμήμα ΑΒ που ενώνει δύο οποιαδήποτε σημεία Α και Β του κύκλου.",
    card3Item3Title: "3. Διάμετρος (δ):",
    card3Item3Desc: (
      <>
        Κάθε χορδή ΓΔ που διέρχεται από το κέντρο Ο του κύκλου. Είναι η <strong>μεγαλύτερη χορδή</strong> του κύκλου και ισούται με το διπλάσιο της ακτίνας:
      </>
    ),
    card3DiamFormula: (
      <span className="inline-flex items-center gap-1">
        δ ＝ 2 · ρ &nbsp;⇔&nbsp; ρ ＝ <Frac num="δ" den="2" />
      </span>
    ),

    // Card 4: Τόξο & Ημικύκλιο
    card4Badge: "4",
    card4Title: "Τόξο Κύκλου & Ημικύκλιο",
    card4Desc: "Δύο διαφορετικά σημεία Α και Β ενός κύκλου (Ο, ρ) τον χωρίζουν σε δύο μέρη, καθένα από τα οποία ονομάζεται τόξο του κύκλου.",
    card4ArcNotationTitle: "Συμβολισμός Τόξου:",
    card4ArcNotationDesc: (
      <>
        Το τόξο με άκρα Α και Β συμβολίζεται <strong><Arc>ΑΒ</Arc></strong> (για να ξεχωρίζουμε ποιο από τα δύο τόξα εννοούμε, χρησιμοποιούμε συχνά ένα ενδιάμεσο σημείο Μ και γράφουμε <Arc>ΑΜΒ</Arc>).
      </>
    ),
    card4SubtendTitle: "Χορδή & Τόξο:",
    card4SubtendDesc: (
      <>
        Λέμε ότι η χορδή ΑΒ <strong>υποτείνει</strong> (ή αντιστοιχεί) στα δύο τόξα <Arc>ΑΒ</Arc> που έχουν τα ίδια άκρα Α και Β.
      </>
    ),
    card4SemiTitle: "Ημικύκλιο:",
    card4SemiDesc: "Αν τα άκρα Α και Β είναι αντιδιαμετρικά σημεία (δηλαδή το ΑΒ είναι διάμετρος του κύκλου), τότε τα δύο τόξα είναι ίσα και καθένα ονομάζεται ημικύκλιο.",

    // Interactive Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΚΥΚΛΟΥ",
    labTitle: "Διαδραστική Εξερεύνηση Στοιχείων & Περιοχών Κύκλου",
    labSelectLabel: "1. ΕΠΙΛΕΞΤΕ ΣΤΟΙΧΕΙΟ Η ΠΕΡΙΟΧΗ:",
    tabRadius: "ΑΚΤΙΝΑ (ρ)",
    tabChord: "ΧΟΡΔΗ (ΑΒ)",
    tabDiameter: "ΔΙΑΜΕΤΡΟΣ (δ ＝ 2ρ)",
    tabArc: "ΤΟΞΟ & ΗΜΙΚΥΚΛΙΟ",
    tabRegions: "ΕΣΩΤΕΡΙΚΟ - ΚΥΚΛΟΣ - ΕΞΩΤΕΡΙΚΟ",
    labInfoTitle: "ΓΕΩΜΕΤΡΙΚΗ ΠΕΡΙΓΡΑΦΗ:",
    descRadius: "Η ακτίνα ΟΑ ενώνει το κέντρο Ο με το σημείο Α του κύκλου. Κάθε σημείο πάνω στον κύκλο απέχει απόσταση ρ από το Ο (ΟΑ ＝ ΟΒ ＝ ρ).",
    descChord: "Η χορδή ΑΒ ενώνει δύο οποιαδήποτε σημεία Α και Β του κύκλου. Το μήκος κάθε χορδής είναι μικρότερο ή ίσο από τη διάμετρο (ΑΒ ≤ 2ρ).",
    descDiameter: "Η διάμετρος ΓΔ είναι χορδή που περνά από το κέντρο Ο. Αποτελεί άξονα συμμετρίας του κύκλου και έχει μήκος δ ＝ 2 · ρ.",
    descArc: (
      <>
        Τα σημεία Α και Β χωρίζουν τον κύκλο σε δύο τόξα: το μικρότερο τόξο <Arc>ΑΜΒ</Arc> (πορτοκαλί) και το μεγαλύτερο τόξο <Arc>ΑΝΒ</Arc>. Όταν η χορδή γίνει διάμετρος, κάθε τόξο είναι ημικύκλιο.
      </>
    ),
    descRegions: "Για ακτίνα ρ: Το σημείο Ε βρίσκεται στο εσωτερικό (ΟΕ ＜ ρ), το σημείο Μ βρίσκεται πάνω στον κύκλο (ΟΜ ＝ ρ), και το σημείο Ζ βρίσκεται στο εξωτερικό (ΟΖ ＞ ρ).",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΚΤΙΝΑ, ΔΙΑΜΕΤΡΟΣ & ΘΕΣΗ ΣΗΜΕΙΩΝ",
    prob1Title: "Προσδιορισμός θέσης σημείων ως προς κύκλο (Ο, ρ)",
    prob1DescPre: (
      <>
        Δίνεται κύκλος (Ο, ρ) με διάμετρο δ ＝ 14 cm. Αν τρία σημεία Α, Β και Γ απέχουν από το κέντρο Ο αποστάσεις ΟΑ ＝ 5 cm, ΟΒ ＝ 7 cm και ΟΓ ＝ 9,5 cm αντίστοιχα, να βρεθούν: α) η ακτίνα ρ του κύκλου και β) η θέση καθενός από τα σημεία Α, Β, Γ ως προς τον κύκλο.
      </>
    ),
    prob1ColPart: "Ερώτημα",
    prob1ColRule: "Σχέση / Κριτήριο",
    prob1ColCalc: "Απάντηση",
    prob1Row1Q: "α) Ακτίνα ρ",
    prob1Row1R: (
      <span className="inline-flex items-center gap-1">
        ρ ＝ <Frac num="δ" den="2" />
      </span>
    ),
    prob1Row1C: (
      <span className="inline-flex items-center gap-1">
        ρ ＝ <Frac num="14" den="2" /> ＝ 7 cm
      </span>
    ),
    prob1Row2Q: "β) Σημείο Α (ΟΑ ＝ 5 cm)",
    prob1Row2R: "ΟΑ ＜ ρ (5 cm ＜ 7 cm)",
    prob1Row2C: "Στο εσωτερικό του κύκλου",
    prob1Row3Q: "β) Σημεία Β (7 cm) & Γ (9,5 cm)",
    prob1Row3R: "ΟΒ ＝ ρ (7 cm) και ΟΓ ＞ ρ (9,5 cm)",
    prob1Row3C: "Το Β πάνω στον κύκλο, το Γ στο εξωτερικό",
    prob1ResSummary: "Συμπέρασμα:",
    prob1ResText: "Η ακτίνα είναι ρ ＝ 7 cm. Το Α βρίσκεται στο εσωτερικό, το Β πάνω στον κύκλο και το Γ στο εξωτερικό του.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΧΟΡΔΗ, ΑΚΤΙΝΕΣ & ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ",
    prob2Title: "Υπολογισμός γωνιών σε τρίγωνο που σχηματίζεται από χορδή και ακτίνες",
    prob2DescPre: (
      <>
        Σε κύκλο (Ο, ρ) φέρνουμε μια χορδή ΑΒ (που δεν είναι διάμετρος). Αν η γωνία Α<Angle>Ο</Angle>Β ＝ 70°, να βρεθεί τι είδους τρίγωνο είναι το ΟΑΒ και να υπολογιστούν οι γωνίες Ο<Angle>Α</Angle>Β και Ο<Angle>Β</Angle>Α.
      </>
    ),
    prob2ColPart: "Βήμα",
    prob2ColRule: "Γεωμετρική Ιδιότητα",
    prob2ColCalc: "Υπολογισμός",
    prob2Row1Q: "1. Είδος τριγώνου ΟΑΒ",
    prob2Row1R: "Οι ΟΑ και ΟΒ είναι ακτίνες του κύκλου (ΟΑ ＝ ΟΒ ＝ ρ)",
    prob2Row1C: "Το τρίγωνο ΟΑΒ είναι ισοσκελές (με βάση τη χορδή ΑΒ)",
    prob2Row2Q: "2. Γωνίες βάσης",
    prob2Row2R: (
      <>
        Οι προσκείμενες στη βάση ΑΒ είναι ίσες: Ο<Angle>Α</Angle>Β ＝ Ο<Angle>Β</Angle>Α
      </>
    ),
    prob2Row2C: (
      <span className="inline-flex items-center gap-1">
        Ο<Angle>Α</Angle>Β ＝ Ο<Angle>Β</Angle>Α ＝ <Frac num="180° － 70°" den="2" /> ＝ 55°
      </span>
    ),
    prob2ResSummary: "Απάντηση:",
    prob2ResText: (
      <>
        Το τρίγωνο ΟΑΒ είναι ισοσκελές και Ο<Angle>Α</Angle>Β ＝ Ο<Angle>Β</Angle>Α ＝ 55°.
      </>
    ),

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΟΝ ΚΥΚΛΟ",
    alert1Title: "Κύκλος vs Κυκλικός Δίσκος:",
    alert1Desc: "Ο κύκλος είναι ΜΟΝΟ η καμπύλη γραμμή (περιφέρεια) με ΟΜ ＝ ρ (το κέντρο Ο ΔΕΝ ανήκει στον κύκλο!). Ο κυκλικός δίσκος περιλαμβάνει και το εσωτερικό (ΟΜ ≤ ρ).",
    alert2Title: "Μην μπερδεύετε την ακτίνα ρ με τη διάμετρο δ:",
    alert2Desc: "Η διάμετρος περνά από το κέντρο και έχει διπλάσιο μήκος από την ακτίνα (δ ＝ 2 · ρ).",
    alert3Title: "Κάθε διάμετρος είναι χορδή, αλλά δεν είναι κάθε χορδή διάμετρος:",
    alert3Desc: "Μια χορδή είναι διάμετρος ΜΟΝΟ όταν διέρχεται από το κέντρο Ο του κύκλου. Καμία χορδή δεν μπορεί να είναι μεγαλύτερη από τη διάμετρο.",
    alert4Title: "Χορδή ΑΒ vs Τόξο ΑΒ:",
    alert4Desc: "Η χορδή ΑΒ είναι ευθύγραμμο τμήμα, ενώ το τόξο ΑΒ είναι καμπύλο τμήμα του κύκλου με άκρα τα σημεία Α και Β.",

    // Bottom
    bottomTitle: "Εμπεδώστε τον Κύκλο & τα Στοιχεία του στην Πράξη!",
    bottomDesc: "Εξασκηθείτε στον ορισμό (Ο, ρ), στο εσωτερικό/εξωτερικό, στις ακτίνες, χορδές, διαμέτρους και τόξα με 12 διαδραστικές ασκήσεις.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "The Circle, Interior & Elements of a Circle | Grade 7 Theory",
    pageDesc: "Comprehensive Grade 7 geometry theory on the circle: definition and notation (O, ρ), interior and exterior of a circle, circular disk, radius, chord, diameter, arc, and semicircle.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 09 • GRADE 7",
    heroTitle: "The Circle, Interior & Elements of a Circle",
    heroDesc: "Discover the most symmetric shape in plane geometry! Learn the definition of a circle (O, ρ), how it differs from a circular disk, and its fundamental elements: radius, chord, diameter, arc, and semicircle.",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1
    card1Badge: "1",
    card1Title: "Definition of a Circle & Notation (O, ρ)",
    card1Desc: "A circle with center O and radius ρ (where ρ > 0) is the set of all points in the plane at a fixed distance equal to ρ from the center O.",
    card1NotationTitle: "Notation & Defining Condition:",
    card1NotationDesc: "The circle with center O and radius ρ is denoted (O, ρ). A point M lies on the circle if and only if OM ＝ ρ.",
    card1Note: "Every point on the circle is equidistant from its center O by distance ρ!",

    // Card 2
    card2Badge: "2",
    card2Title: "Interior of a Circle & Circular Disk",
    card2Desc: "A circle (O, ρ) partitions the plane into three regions according to distance from center O:",
    card2Zone1Title: "1. On the Circle:",
    card2Zone1Desc: "A point M with distance OM ＝ ρ (lies on the circumference).",
    card2Zone2Title: "2. Interior of the Circle:",
    card2Zone2Desc: "All points E in the plane whose distance from center O is less than the radius: OE ＜ ρ.",
    card2Zone3Title: "3. Exterior of the Circle:",
    card2Zone3Desc: "All points Z in the plane whose distance from center O is greater than the radius: OZ ＞ ρ.",
    card2DiskTitle: "Circular Disk (O, ρ):",
    card2DiskDesc: "The circle together with its interior is called a circular disk (O, ρ), consisting of all points M with OM ≤ ρ.",

    // Card 3
    card3Badge: "3",
    card3Title: "Radius, Chord & Diameter",
    card3Desc: "The fundamental line segments defined on a circle (O, ρ) are:",
    card3Item1Title: "1. Radius (ρ):",
    card3Item1Desc: "Any line segment joining center O to a point A on the circle (OA ＝ ρ). All radii of a circle are equal.",
    card3Item2Title: "2. Chord:",
    card3Item2Desc: "Any line segment AB joining two points A and B on the circle.",
    card3Item3Title: "3. Diameter (d):",
    card3Item3Desc: "Any chord CD passing through center O. It is the longest chord of the circle and equals twice the radius:",
    card3DiamFormula: (
      <span className="inline-flex items-center gap-1">
        d ＝ 2 · ρ &nbsp;⇔&nbsp; ρ ＝ <Frac num="d" den="2" />
      </span>
    ),

    // Card 4
    card4Badge: "4",
    card4Title: "Circular Arc & Semicircle",
    card4Desc: "Two distinct points A and B on a circle (O, ρ) divide it into two curved parts, each called an arc of the circle.",
    card4ArcNotationTitle: "Arc Notation:",
    card4ArcNotationDesc: (
      <>
        An arc with endpoints A and B is denoted <strong><Arc>AB</Arc></strong> (to specify which of the two arcs is meant, a third intermediate point M is often included: <Arc>AMB</Arc>).
      </>
    ),
    card4SubtendTitle: "Chord & Subtended Arc:",
    card4SubtendDesc: (
      <>
        Chord AB is said to <strong>subtend</strong> the two arcs <Arc>AB</Arc> sharing endpoints A and B.
      </>
    ),
    card4SemiTitle: "Semicircle:",
    card4SemiDesc: "When endpoints A and B are diametrically opposite (AB is a diameter), the two arcs are equal and each is called a semicircle.",

    // Interactive Lab
    labBadge: "CIRCLE LAB",
    labTitle: "Interactive Circle Elements & Regions Explorer",
    labSelectLabel: "1. SELECT ELEMENT OR REGION:",
    tabRadius: "RADIUS (ρ)",
    tabChord: "CHORD (AB)",
    tabDiameter: "DIAMETER (d ＝ 2ρ)",
    tabArc: "ARC & SEMICIRCLE",
    tabRegions: "INTERIOR - CIRCLE - EXTERIOR",
    labInfoTitle: "GEOMETRIC DESCRIPTION:",
    descRadius: "Radius OA joins center O to point A on the circle. Every point on the circle lies at distance ρ from O (OA ＝ OB ＝ ρ).",
    descChord: "Chord AB connects any two points A and B on the circle. The length of any chord is at most the diameter (AB ≤ 2ρ).",
    descDiameter: "Diameter CD is a chord passing through center O. It is an axis of symmetry of the circle and has length d ＝ 2 · ρ.",
    descArc: (
      <>
        Points A and B divide the circle into two arcs: the minor arc <Arc>AMB</Arc> (orange) and the major arc <Arc>ANB</Arc>. When the chord is a diameter, each arc is a semicircle.
      </>
    ),
    descRegions: "For radius ρ: Point E lies in the interior (OE ＜ ρ), point M lies on the circle (OM ＝ ρ), and point Z lies in the exterior (OZ ＞ ρ).",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: RADIUS, DIAMETER & POINT LOCATIONS",
    prob1Title: "Determining point locations relative to a circle (O, ρ)",
    prob1DescPre: "Given circle (O, ρ) with diameter d ＝ 14 cm, three points A, B, and C lie at distances OA ＝ 5 cm, OB ＝ 7 cm, and OC ＝ 9.5 cm from center O. Find: (a) the radius ρ and (b) the position of each point A, B, C.",
    prob1ColPart: "Question",
    prob1ColRule: "Relation / Criterion",
    prob1ColCalc: "Answer",
    prob1Row1Q: "(a) Radius ρ",
    prob1Row1R: (
      <span className="inline-flex items-center gap-1">
        ρ ＝ <Frac num="d" den="2" />
      </span>
    ),
    prob1Row1C: (
      <span className="inline-flex items-center gap-1">
        ρ ＝ <Frac num="14" den="2" /> ＝ 7 cm
      </span>
    ),
    prob1Row2Q: "(b) Point A (OA ＝ 5 cm)",
    prob1Row2R: "OA ＜ ρ (5 cm ＜ 7 cm)",
    prob1Row2C: "In the interior of the circle",
    prob1Row3Q: "(b) Points B (7 cm) & C (9.5 cm)",
    prob1Row3R: "OB ＝ ρ (7 cm) and OC ＞ ρ (9.5 cm)",
    prob1Row3C: "B lies on the circle, C lies in the exterior",
    prob1ResSummary: "Conclusion:",
    prob1ResText: "The radius is ρ ＝ 7 cm. Point A is in the interior, B is on the circle, and C is in the exterior.",

    prob2Badge: "PROBLEM 2: CHORD, RADII & ISOSCELES TRIANGLE",
    prob2Title: "Finding angles in a triangle formed by a chord and two radii",
    prob2DescPre: "In circle (O, ρ), draw a chord AB (not a diameter). If central angle ∠AOB ＝ 70°, determine the type of triangle OAB and compute angles ∠OAB and ∠OBA.",
    prob2ColPart: "Step",
    prob2ColRule: "Geometric Property",
    prob2ColCalc: "Calculation",
    prob2Row1Q: "1. Type of triangle OAB",
    prob2Row1R: "OA and OB are radii of the circle (OA ＝ OB ＝ ρ)",
    prob2Row1C: "Triangle OAB is isosceles (with base chord AB)",
    prob2Row2Q: "2. Base angles",
    prob2Row2R: "Angles adjacent to base AB are equal: ∠OAB ＝ ∠OBA",
    prob2Row2C: (
      <span className="inline-flex items-center gap-1">
        ∠OAB ＝ ∠OBA ＝ <Frac num="180° － 70°" den="2" /> ＝ 55°
      </span>
    ),
    prob2ResSummary: "Answer:",
    prob2ResText: "Triangle OAB is isosceles and ∠OAB ＝ ∠OBA ＝ 55°.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH CIRCLES",
    alert1Title: "Circle vs. Circular Disk:",
    alert1Desc: "A circle is ONLY the curved boundary (circumference) with OM ＝ ρ (center O is NOT on the circle!). A circular disk includes the interior (OM ≤ ρ).",
    alert2Title: "Do not confuse radius ρ with diameter d:",
    alert2Desc: "The diameter passes through the center and is twice as long as the radius (d ＝ 2 · ρ).",
    alert3Title: "Every diameter is a chord, not every chord is a diameter:",
    alert3Desc: "A chord is a diameter ONLY when it passes through center O. No chord can be longer than the diameter.",
    alert4Title: "Chord AB vs. Arc AB:",
    alert4Desc: "Chord AB is a straight line segment, while arc AB is a curved portion of the circle joining endpoints A and B.",

    // Bottom
    bottomTitle: "Master the Circle & Its Elements in Practice!",
    bottomDesc: "Practice circle definition (O, ρ), interior/exterior regions, radii, chords, diameters, and arcs with 12 interactive exercises.",
    bottomBtn: "START EXERCISES"
  }
};

export default function KiklosTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  const [activeTab, setActiveTab] = useState('radius'); // 'radius' | 'chord' | 'diameter' | 'arc' | 'regions'

  const vLbl = isEl
    ? { O: 'Ο', A: 'Α', B: 'Β', C: 'Γ', D: 'Δ', M: 'Μ', N: 'Ν', E: 'Ε', Z: 'Ζ' }
    : { O: 'O', A: 'A', B: 'B', C: 'C', D: 'D', M: 'M', N: 'N', E: 'E', Z: 'Z' };

  const tabDescriptions = {
    radius: t.descRadius,
    chord: t.descChord,
    diameter: t.descDiameter,
    arc: t.descArc,
    regions: t.descRegions
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
          href="/a-gymnasiou/45-kiklos-ask"
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
                href="/a-gymnasiou/45-kiklos-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΟΡΙΣΜΟΣ ΚΥΚΛΟΥ & ΣΥΜΒΟΛΙΣΜΟΣ (Ο, ρ) */}
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

              {/* Εποπτικό Σχήμα Κύκλου (Ο, ρ) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 180 140" className="w-40 h-32 shrink-0">
                  <circle cx="90" cy="70" r="50" fill="rgba(99, 102, 241, 0.08)" stroke="#4f46e5" strokeWidth="2.4" />
                  {/* Ακτίνα ΟΜ = ρ */}
                  <line x1="90" y1="70" x2="133.3" y2="45" stroke="#059669" strokeWidth="2.2" />
                  <circle cx="90" cy="70" r="3.5" fill="#1e1b4b" />
                  <circle cx="133.3" cy="45" r="3.5" fill="#059669" />
                  <text x="82" y="75" textAnchor="end" className="text-[11px] font-black fill-indigo-950">{vLbl.O}</text>
                  <text x="143" y="43" textAnchor="start" className="text-[11px] font-black fill-emerald-800">{vLbl.M}</text>
                  <text x="110" y="51" textAnchor="middle" className="text-[11px] font-bold fill-emerald-700">ρ</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <strong className="text-indigo-900 block mb-0.5">{t.card1NotationTitle}</strong>
                    {t.card1NotationDesc}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    💡 {t.card1Note}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΕΣΩΤΕΡΙΚΟ ΚΥΚΛΟΥ & ΚΥΚΛΙΚΟΣ ΔΙΣΚΟΣ */}
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

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 mb-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card2Zone1Title}</strong> {t.card2Zone1Desc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-emerald-800">{t.card2Zone2Title}</strong> {t.card2Zone2Desc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-rose-800">{t.card2Zone3Title}</strong> {t.card2Zone3Desc}
                </div>
              </div>

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950 leading-relaxed">
                <strong className="text-indigo-900 block mb-0.5">{t.card2DiskTitle}</strong>
                {t.card2DiskDesc}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΑΚΤΙΝΑ, ΧΟΡΔΗ & ΔΙΑΜΕΤΡΟΣ */}
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

              {/* Εποπτικό Σχήμα Ακτίνας, Χορδής, Διαμέτρου */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 180 145" className="w-40 h-32 shrink-0">
                  <circle cx="90" cy="72" r="52" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" />
                  {/* Διάμετρος ΓΔ */}
                  <line x1="38" y1="72" x2="142" y2="72" stroke="#e11d48" strokeWidth="2.2" />
                  {/* Χορδή ΑΒ */}
                  <line x1="56" y1="32" x2="132" y2="41" stroke="#d97706" strokeWidth="2.2" />
                  {/* Ακτίνα ΟΕ */}
                  <line x1="90" y1="72" x2="118" y2="116" stroke="#059669" strokeWidth="2" strokeDasharray="3 2" />
                  <circle cx="90" cy="72" r="3.5" fill="#1e1b4b" />
                  <circle cx="38" cy="72" r="3" fill="#e11d48" />
                  <circle cx="142" cy="72" r="3" fill="#e11d48" />
                  <circle cx="56" cy="32" r="3" fill="#d97706" />
                  <circle cx="132" cy="41" r="3" fill="#d97706" />
                  <text x="90" y="64" textAnchor="middle" className="text-[10px] font-black fill-indigo-950">{vLbl.O}</text>
                  <text x="29" y="76" textAnchor="end" className="text-[10px] font-black fill-rose-700">{vLbl.C}</text>
                  <text x="150" y="76" textAnchor="start" className="text-[10px] font-black fill-rose-700">{vLbl.D}</text>
                  <text x="50" y="25" textAnchor="middle" className="text-[10px] font-black fill-amber-700">{vLbl.A}</text>
                  <text x="140" y="36" textAnchor="start" className="text-[10px] font-black fill-amber-700">{vLbl.B}</text>
                  <text x="110" y="96" textAnchor="start" className="text-[10px] font-bold fill-emerald-700">ρ</text>
                </svg>
                <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-emerald-800">{t.card3Item1Title}</strong> {t.card3Item1Desc}
                  </div>
                  <div>
                    <strong className="text-amber-800">{t.card3Item2Title}</strong> {t.card3Item2Desc}
                  </div>
                  <div>
                    <strong className="text-rose-800">{t.card3Item3Title}</strong> {t.card3Item3Desc}
                  </div>
                </div>
              </div>

              <div className="bg-indigo-900 text-white rounded-xl p-2.5 text-center font-mono text-xs sm:text-sm font-bold">
                {t.card3DiamFormula}
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΤΟΞΟ ΚΥΚΛΟΥ & ΗΜΙΚΥΚΛΙΟ */}
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

              {/* Εποπτικό Σχήμα Τόξου */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 180 140" className="w-40 h-32 shrink-0">
                  <circle cx="90" cy="70" r="50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 2" />
                  {/* Τόξο ΑΜΒ τονισμένο */}
                  <path d="M 46.7,45 A 50,50 0 0,1 133.3,45" fill="none" stroke="#d97706" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Χορδή ΑΒ */}
                  <line x1="46.7" y1="45" x2="133.3" y2="45" stroke="#4f46e5" strokeWidth="1.8" />
                  <circle cx="90" cy="70" r="3" fill="#1e1b4b" />
                  <circle cx="46.7" cy="45" r="3.5" fill="#d97706" />
                  <circle cx="133.3" cy="45" r="3.5" fill="#d97706" />
                  <circle cx="90" cy="20" r="3" fill="#d97706" />
                  <text x="90" y="83" textAnchor="middle" className="text-[10px] font-black fill-indigo-950">{vLbl.O}</text>
                  <text x="38" y="43" textAnchor="end" className="text-[10px] font-black fill-amber-800">{vLbl.A}</text>
                  <text x="142" y="43" textAnchor="start" className="text-[10px] font-black fill-amber-800">{vLbl.B}</text>
                  <text x="90" y="12" textAnchor="middle" className="text-[10px] font-black fill-amber-700">{vLbl.M}</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-indigo-900 block">{t.card4ArcNotationTitle}</strong>
                    {t.card4ArcNotationDesc}
                  </div>
                  <div>
                    <strong className="text-amber-800 block">{t.card4SubtendTitle}</strong>
                    {t.card4SubtendDesc}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 leading-relaxed">
                <strong className="text-emerald-900 block mb-0.5">{t.card4SemiTitle}</strong>
                {t.card4SemiDesc}
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-5 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              ⭕ {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-3 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block">
                {toCleanUppercase(t.labSelectLabel)}
              </span>

              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'radius', label: toCleanUppercase(t.tabRadius), activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow' },
                  { id: 'chord', label: toCleanUppercase(t.tabChord), activeClass: 'bg-amber-600 text-white border-amber-600 shadow' },
                  { id: 'diameter', label: toCleanUppercase(t.tabDiameter), activeClass: 'bg-rose-600 text-white border-rose-600 shadow' },
                  { id: 'arc', label: toCleanUppercase(t.tabArc), activeClass: 'bg-indigo-600 text-white border-indigo-600 shadow' },
                  { id: 'regions', label: toCleanUppercase(t.tabRegions), activeClass: 'bg-sky-600 text-white border-sky-600 shadow' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all ${
                      activeTab === item.id
                        ? item.activeClass
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic SVG Visualizer & Description */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* SVG Καμβάς */}
              <div className="bg-slate-950 rounded-2xl p-3 sm:p-5 flex items-center justify-center shadow-inner overflow-hidden">
                <svg viewBox="0 0 360 240" className="w-full max-w-md h-56 sm:h-64 select-none">
                  {/* Βασικός κύκλος (Ο, ρ) */}
                  <circle
                    cx="175"
                    cy="120"
                    r="82"
                    fill={activeTab === 'regions' ? 'rgba(16, 185, 129, 0.16)' : 'rgba(99, 102, 241, 0.14)'}
                    stroke="#818cf8"
                    strokeWidth="2.5"
                  />

                  {/* Κέντρο Ο */}
                  <circle cx="175" cy="120" r="4" fill="#ffffff" />
                  <text x="165" y="135" textAnchor="end" className="text-[12px] font-black fill-white">
                    {vLbl.O}
                  </text>

                  {/* 1. ΑΚΤΙΝΑ (ρ) */}
                  {activeTab === 'radius' && (
                    <>
                      <line x1="175" y1="120" x2="246" y2="79" stroke="#34d399" strokeWidth="3" />
                      <line x1="175" y1="120" x2="117" y2="62" stroke="#34d399" strokeWidth="2" strokeDasharray="4 3" />
                      <circle cx="246" cy="79" r="4.5" fill="#34d399" />
                      <circle cx="117" cy="62" r="4" fill="#34d399" />
                      <text x="256" y="77" textAnchor="start" className="text-[12px] font-black fill-emerald-300">{vLbl.A}</text>
                      <text x="107" y="57" textAnchor="end" className="text-[12px] font-black fill-emerald-300">{vLbl.B}</text>
                      <text x="210" y="92" textAnchor="middle" className="text-[13px] font-black fill-emerald-300">ρ</text>
                      <text x="142" y="101" textAnchor="middle" className="text-[12px] font-bold fill-emerald-300">ρ</text>
                    </>
                  )}

                  {/* 2. ΧΟΡΔΗ (ΑΒ) */}
                  {activeTab === 'chord' && (
                    <>
                      <line x1="117" y1="62" x2="253" y2="96" stroke="#fbbf24" strokeWidth="3" />
                      <circle cx="117" cy="62" r="4.5" fill="#fbbf24" />
                      <circle cx="253" cy="96" r="4.5" fill="#fbbf24" />
                      <text x="108" y="55" textAnchor="end" className="text-[12px] font-black fill-amber-300">{vLbl.A}</text>
                      <text x="263" y="96" textAnchor="start" className="text-[12px] font-black fill-amber-300">{vLbl.B}</text>
                    </>
                  )}

                  {/* 3. ΔΙΑΜΕΤΡΟΣ (δ = 2ρ) */}
                  {activeTab === 'diameter' && (
                    <>
                      <line x1="93" y1="120" x2="257" y2="120" stroke="#fb7185" strokeWidth="3" />
                      <circle cx="93" cy="120" r="4.5" fill="#fb7185" />
                      <circle cx="257" cy="120" r="4.5" fill="#fb7185" />
                      <text x="82" y="124" textAnchor="end" className="text-[12px] font-black fill-rose-300">{vLbl.C}</text>
                      <text x="268" y="124" textAnchor="start" className="text-[12px] font-black fill-rose-300">{vLbl.D}</text>
                      <text x="134" y="112" textAnchor="middle" className="text-[12px] font-black fill-rose-300">ρ</text>
                      <text x="216" y="112" textAnchor="middle" className="text-[12px] font-black fill-rose-300">ρ</text>
                    </>
                  )}

                  {/* 4. ΤΟΞΟ & ΗΜΙΚΥΚΛΙΟ */}
                  {activeTab === 'arc' && (
                    <>
                      {/* Μικρό τόξο ΑΜΒ (πορτοκαλί) */}
                      <path
                        d="M 104,79 A 82,82 0 0,1 246,79"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* Μεγάλο τόξο ΑΝΒ (γαλάζιο) */}
                      <path
                        d="M 246,79 A 82,82 0 1,1 104,79"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        strokeDasharray="5 3"
                      />
                      {/* Χορδή ΑΒ */}
                      <line x1="104" y1="79" x2="246" y2="79" stroke="#94a3b8" strokeWidth="1.6" />
                      <circle cx="104" cy="79" r="4.5" fill="#ffffff" />
                      <circle cx="246" cy="79" r="4.5" fill="#ffffff" />
                      <circle cx="175" cy="38" r="3.5" fill="#fbbf24" />
                      <circle cx="175" cy="202" r="3.5" fill="#38bdf8" />
                      <text x="94" y="76" textAnchor="end" className="text-[12px] font-black fill-white">{vLbl.A}</text>
                      <text x="256" y="76" textAnchor="start" className="text-[12px] font-black fill-white">{vLbl.B}</text>
                      <text x="175" y="28" textAnchor="middle" className="text-[12px] font-black fill-amber-300">{vLbl.M}</text>
                      <text x="175" y="219" textAnchor="middle" className="text-[12px] font-black fill-sky-300">{vLbl.N}</text>
                    </>
                  )}

                  {/* 5. ΠΕΡΙΟΧΕΣ: ΕΣΩΤΕΡΙΚΟ - ΚΥΚΛΟΣ - ΕΞΩΤΕΡΙΚΟ */}
                  {activeTab === 'regions' && (
                    <>
                      {/* Ακτίνα αναφοράς */}
                      <line x1="175" y1="120" x2="246" y2="79" stroke="#818cf8" strokeWidth="2" />
                      <circle cx="246" cy="79" r="4.5" fill="#818cf8" />
                      <text x="256" y="77" textAnchor="start" className="text-[11px] font-black fill-indigo-300">
                        {vLbl.M} (Ο{vLbl.M} ＝ ρ)
                      </text>

                      {/* Εσωτερικό σημείο Ε */}
                      <line x1="175" y1="120" x2="138" y2="95" stroke="#34d399" strokeWidth="1.6" strokeDasharray="3 2" />
                      <circle cx="138" cy="95" r="4.5" fill="#34d399" />
                      <text x="132" y="87" textAnchor="end" className="text-[11px] font-black fill-emerald-300">
                        {vLbl.E} (Ο{vLbl.E} ＜ ρ)
                      </text>

                      {/* Εξωτερικό σημείο Ζ */}
                      <line x1="175" y1="120" x2="285" y2="178" stroke="#fb7185" strokeWidth="1.6" strokeDasharray="3 2" />
                      <circle cx="285" cy="178" r="4.5" fill="#fb7185" />
                      <text x="292" y="182" textAnchor="start" className="text-[11px] font-black fill-rose-300">
                        {vLbl.Z} (Ο{vLbl.Z} ＞ ρ)
                      </text>
                    </>
                  )}
                </svg>
              </div>

              {/* Περιγραφή Επιλεγμένου Στοιχείου */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs sm:text-sm text-indigo-950 leading-relaxed">
                <span className="font-black text-indigo-800 block mb-1 text-xs">
                  💡 {toCleanUppercase(t.labInfoTitle)}
                </span>
                {tabDescriptions[activeTab]}
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
                    <div className="font-bold text-indigo-700">{t.prob1Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row3Q}</div>
                    <div className="text-slate-600">{t.prob1Row3R}</div>
                    <div className="font-bold text-indigo-700">{t.prob1Row3C}</div>
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
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row3Q}</td>
                        <td className="p-2.5">{t.prob1Row3R}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob1Row3C}</td>
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
                    <div className="font-bold text-indigo-700">{t.prob2Row1C}</div>
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
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob2Row1C}</td>
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
            href="/a-gymnasiou/45-kiklos-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
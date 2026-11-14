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
    pageTitle: "Δευτερεύοντα Στοιχεία των Τριγώνων | Θεωρία Α' Γυμνασίου",
    pageDesc: "Αναλυτική θεωρία Α' Γυμνασίου για τα δευτερεύοντα στοιχεία των τριγώνων: διάμεσος, διχοτόμος και έγκεντρο, ύψος και ορθόκεντρο, θέση ορθοκέντρου ανά είδος τριγώνου και διαδραστικό εργαστήριο.",
    backNav: "Α' Γυμνασίου",
    heroBadge: "ΚΕΦΑΛΑΙΟ 06 • Α' ΓΥΜΝΑΣΙΟΥ",
    heroTitle: "Δευτερεύοντα Στοιχεία των Τριγώνων",
    heroDesc: "Πέρα από τις κορυφές, τις πλευρές και τις γωνίες, κάθε τρίγωνο διαθέτει σημαντικά ευθύγραμμα τμήματα με ξεχωριστές γεωμετρικές ιδιότητες: τις διαμέσους, τις διχοτόμους (έγκεντρο) και τα ύψη (ορθόκεντρο).",
    btnExercises: "ΑΣΚΗΣΕΙΣ",
    btnGoExercises: "ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ",

    // Card 1: Διάμεσος
    card1Badge: "1",
    card1Title: "Διάμεσος Τριγώνου",
    card1Desc: (
      <>
        <strong>Διάμεσος</strong> ενός τριγώνου ονομάζεται το ευθύγραμμο τμήμα που ενώνει μια κορυφή του με το <strong>μέσο</strong> της απέναντι πλευράς (π.χ. η ΑΜ όπου ΒΜ ＝ ΜΓ).
      </>
    ),
    card1Prop1Title: "Πλήθος & Θέση:",
    card1Prop1Desc: (
      <>
        Κάθε τρίγωνο έχει <strong>3 διαμέσους</strong> (μ<sub>α</sub>, μ<sub>β</sub>, μ<sub>γ</sub>), οι οποίες βρίσκονται <strong>πάντοτε στο εσωτερικό</strong> του τριγώνου.
      </>
    ),
    card1Prop2Title: "Σημείο Τομής (Βαρύκεντρο):",
    card1Prop2Desc: "Οι τρεις διάμεσοι κάθε τριγώνου διέρχονται από το ίδιο σημείο, το οποίο ονομάζεται βαρύκεντρο (G) και αποτελεί το κέντρο βάρους του τριγώνου.",

    // Card 2: Διχοτόμος & Έγκεντρο
    card2Badge: "2",
    card2Title: "Διχοτόμος Γωνίας & Έγκεντρο",
    card2Desc: (
      <>
        <strong>Διχοτόμος</strong> μιας γωνίας τριγώνου ονομάζεται το ευθύγραμμο τμήμα της διχοτόμου της γωνίας από την κορυφή έως την απέναντι πλευρά (π.χ. η ΑΔ ώστε Β<Angle>Α</Angle>Δ ＝ Δ<Angle>Α</Angle>Γ).
      </>
    ),
    card2Prop1Title: "Το Έγκεντρο (Ι):",
    card2Prop1Desc: (
      <>
        Κάθε τρίγωνο έχει <strong>3 διχοτόμους</strong> (δ<sub>α</sub>, δ<sub>β</sub>, δ<sub>γ</sub>), οι οποίες βρίσκονται πάντα στο εσωτερικό του και τέμνονται σε ένα κοινό σημείο, το <strong>έγκεντρο (Ι)</strong>.
      </>
    ),
    card2Prop2Title: "Εγγεγραμμένος Κύκλος:",
    card2Prop2Desc: "Το έγκεντρο Ι ισαπέχει από τις τρεις πλευρές του τριγώνου και είναι το κέντρο του κύκλου που εφάπτεται εσωτερικά και στις τρεις πλευρές του (εγγεγραμμένος κύκλος).",

    // Card 3: Ύψος & Ορθόκεντρο
    card3Badge: "3",
    card3Title: "Ύψος Τριγώνου & Ορθόκεντρο",
    card3Desc: (
      <>
        <strong>Ύψος</strong> ενός τριγώνου ονομάζεται το <strong>κάθετο</strong> ευθύγραμμο τμήμα που φέρνουμε από μια κορυφή προς την ευθεία της απέναντι πλευράς (π.χ. ΑΥ ⊥ ΒΓ).
      </>
    ),
    card3Prop1Title: "Το Ορθόκεντρο (Η):",
    card3Prop1Desc: (
      <>
        Κάθε τρίγωνο έχει <strong>3 ύψη</strong> (υ<sub>α</sub>, υ<sub>β</sub>, υ<sub>γ</sub>). Οι ευθείες των τριών υψών διέρχονται από το ίδιο σημείο, το οποίο ονομάζεται <strong>ορθόκεντρο (Η)</strong>.
      </>
    ),
    card3Prop2Title: "Προσοχή στην Προέκταση:",
    card3Prop2Desc: "Σε ορισμένα τρίγωνα (αμβλυγώνια), το ύψος από μια κορυφή δεν πέφτει πάνω στην ίδια την απέναντι πλευρά, αλλά στην προέκτασή της!",

    // Card 4: Θέση Ορθοκέντρου & Ειδικές Περιπτώσεις
    card4Badge: "4",
    card4Title: "Θέση Ορθοκέντρου & Ειδικά Τρίγωνα",
    card4Desc: "Η θέση των υψών και του ορθοκέντρου Η εξαρτάται άμεσα από το είδος του τριγώνου ως προς τις γωνίες του:",
    card4AcuteTitle: "1. Οξυγώνιο Τρίγωνο:",
    card4AcuteDesc: "Και τα 3 ύψη και το ορθόκεντρο Η βρίσκονται στο εσωτερικό του τριγώνου.",
    card4RightTitle: "2. Ορθογώνιο Τρίγωνο:",
    card4RightDesc: "Οι δύο κάθετες πλευρές είναι και ύψη, και το ορθόκεντρο Η ταυτίζεται με την κορυφή της ορθής γωνίας.",
    card4ObtuseTitle: "3. Αμβλυγώνιο Τρίγωνο:",
    card4ObtuseDesc: "Τα δύο ύψη από τις οξείες γωνίες πέφτουν εκτός τριγώνου (στις προεκτάσεις), και το ορθόκεντρο Η βρίσκεται στο εξωτερικό του.",
    card4IsoNoteTitle: "Ειδική Ιδιότητα Ισοσκελούς & Ισόπλευρου:",
    card4IsoNoteDesc: "Στο ισοσκελές τρίγωνο, το ύψος που αντιστοιχεί στη βάση ταυτίζεται με τη διάμεσο και τη διχοτόμο της γωνίας κορυφής! Στο ισόπλευρο αυτό ισχύει και για τις 3 κορυφές (ορθόκεντρο ＝ έγκεντρο ＝ βαρύκεντρο).",

    // Interactive Lab
    labBadge: "ΕΡΓΑΣΤΗΡΙΟ ΓΕΩΜΕΤΡΙΑΣ",
    labTitle: "Διαδραστική Εξερεύνηση Δευτερευόντων Στοιχείων",
    labElementLabel: "1. ΕΠΙΛΕΞΤΕ ΣΤΟΙΧΕΙΟ:",
    tabMedians: "ΔΙΑΜΕΣΟΙ (G)",
    tabBisectors: "ΔΙΧΟΤΟΜΟΙ & ΕΓΚΕΝΤΡΟ (Ι)",
    tabAltitudes: "ΥΨΗ & ΟΡΘΟΚΕΝΤΡΟ (Η)",
    labShapeLabel: "2. ΕΠΙΛΕΞΤΕ ΕΙΔΟΣ ΤΡΙΓΩΝΟΥ:",
    shapeAcute: "Οξυγώνιο",
    shapeRight: "Ορθογώνιο (Α ＝ 90°)",
    shapeObtuse: "Αμβλυγώνιο (Α ＞ 90°)",
    shapeIsosceles: "Ισοσκελές (ΑΒ ＝ ΑΓ)",
    shapeEquilateral: "Ισόπλευρο",
    labLegendTitle: "ΠΑΡΑΤΗΡΗΣΗ ΣΧΗΜΑΤΟΣ:",
    obsMediansGeneral: "Οι 3 διάμεσοι ενώνουν κάθε κορυφή με το μέσο της απέναντι πλευράς και τέμνονται πάντα στο εσωτερικό του τριγώνου (βαρύκεντρο G).",
    obsMediansIso: "Στο ισοσκελές τρίγωνο (ΑΒ ＝ ΑΓ), η διάμεσος ΑΜ₁ προς τη βάση ΒΓ είναι ταυτόχρονα και ύψος και διχοτόμος!",
    obsMediansEqui: "Στο ισόπλευρο τρίγωνο, και οι 3 διάμεσοι είναι ίσες μεταξύ τους και ταυτίζονται με τα ύψη και τις διχοτόμους!",
    obsBisectorsGeneral: "Οι 3 διχοτόμοι χωρίζουν κάθε γωνία σε δύο ίσα μέρη και τέμνονται στο έγκεντρο Ι, που είναι το κέντρο του εγγεγραμμένου κύκλου (εφάπτεται και στις 3 πλευρές).",
    obsBisectorsIso: (
      <>
        Στο ισοσκελές τρίγωνο, η διχοτόμος της γωνίας κορυφής <Angle>Α</Angle> περνά από το μέσο της βάσης ΒΓ και είναι κάθετη σε αυτήν.
      </>
    ),
    obsBisectorsEqui: "Στο ισόπλευρο τρίγωνο, οι διχοτόμοι χωρίζουν κάθε γωνία 60° σε δύο γωνίες 30° και το έγκεντρο Ι ταυτίζεται με το ορθόκεντρο Η.",
    obsAltitudesAcute: "Επειδή το τρίγωνο είναι οξυγώνιο, και τα 3 ύψη πέφτουν πάνω στις πλευρές και το ορθόκεντρο Η βρίσκεται στο εσωτερικό του.",
    obsAltitudesRight: (
      <>
        Επειδή το τρίγωνο είναι ορθογώνιο (<Angle>Α</Angle> ＝ 90°), οι κάθετες πλευρές ΑΒ και ΑΓ είναι δύο από τα ύψη του, άρα το ορθόκεντρο Η ταυτίζεται με την κορυφή Α!
      </>
    ),
    obsAltitudesObtuse: (
      <>
        Επειδή το τρίγωνο είναι αμβλυγώνιο (<Angle>Α</Angle> ＞ 90°), τα ύψη από τις οξείες γωνίες Β και Γ πέφτουν στις προεκτάσεις των απέναντι πλευρών και το ορθόκεντρο Η βρίσκεται ΕΞΩ από το τρίγωνο!
      </>
    ),
    obsAltitudesIso: (
      <>
        Στο ισοσκελές τρίγωνο, το ύψος ΑΥ₁ προς τη βάση ΒΓ διχοτομεί τη βάση (ΒΥ₁ ＝ Υ₁Γ) και τη γωνία κορυφής <Angle>Α</Angle>.
      </>
    ),
    obsAltitudesEqui: "Στο ισόπλευρο τρίγωνο, και τα 3 ύψη είναι ίσα μεταξύ τους, πέφτουν στα μέσα των πλευρών και το ορθόκεντρο Η βρίσκεται στο κέντρο του τριγώνου.",

    // Solved Problems
    solvedTitle: "Λυμένα Προβλήματα Εφαρμογής",
    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΙΑΜΕΣΟΣ & ΔΙΧΟΤΟΜΟΣ",
    prob1Title: "Υπολογισμός τμημάτων και γωνιών με διάμεσο και διχοτόμο",
    prob1DescPre: (
      <>
        Σε ένα τρίγωνο ΑΒΓ, η ΒΓ έχει μήκος 14 cm και η γωνία <Angle>Α</Angle> είναι 76°. Αν ΑΜ είναι η διάμεσος που αντιστοιχεί στην πλευρά ΒΓ και ΑΔ είναι η διχοτόμος της γωνίας <Angle>Α</Angle>, να υπολογιστούν: α) το μήκος του τμήματος ΒΜ και β) το μέτρο της γωνίας Β<Angle>Α</Angle>Δ.
      </>
    ),
    prob1ColQuestion: "Ερώτημα",
    prob1ColProperty: "Γεωμετρική Ιδιότητα",
    prob1ColCalc: "Υπολογισμός",
    prob1Row1Q: "α) Μήκος ΒΜ",
    prob1Row1P: "Η διάμεσος ΑΜ τέμνει τη ΒΓ στο μέσο της (ΒΜ ＝ ΜΓ)",
    prob1Row1C: (
      <span className="inline-flex items-center gap-1">
        ΒΜ ＝ <Frac num="14" den="2" /> ＝ 7 cm
      </span>
    ),
    prob1Row2Q: (
      <>
        β) Γωνία Β<Angle>Α</Angle>Δ
      </>
    ),
    prob1Row2P: (
      <>
        Η διχοτόμος ΑΔ χωρίζει τη γωνία <Angle>Α</Angle> σε δύο ίσες γωνίες
      </>
    ),
    prob1Row2C: (
      <span className="inline-flex items-center gap-1">
        Β<Angle>Α</Angle>Δ ＝ <Frac num="76°" den="2" /> ＝ 38°
      </span>
    ),
    prob1ResSummary: "Απάντηση:",
    prob1ResText: (
      <>
        Το τμήμα ΒΜ έχει μήκος 7 cm και η γωνία Β<Angle>Α</Angle>Δ είναι 38°.
      </>
    ),

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΥΨΟΣ, ΟΡΘΟΚΕΝΤΡΟ & ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ",
    prob2Title: "Εφαρμογή ιδιοτήτων ύψους σε ισοσκελές τρίγωνο",
    prob2DescPre: (
      <>
        Σε ένα ισοσκελές τρίγωνο ΑΒΓ (ΑΒ ＝ ΑΓ) με βάση ΒΓ ＝ 12 cm και γωνία κορυφής <Angle>Α</Angle> ＝ 50°, φέρνουμε το ύψος ΑΥ προς τη βάση ΒΓ. Να υπολογιστούν: α) το μήκος του τμήματος ΒΥ, β) το μέτρο της γωνίας Β<Angle>Α</Angle>Υ και γ) πού βρίσκεται το ορθόκεντρο του τριγώνου.
      </>
    ),
    prob2ColQuestion: "Ερώτημα",
    prob2ColProperty: "Ιδιότητα Ισοσκελούς",
    prob2ColCalc: "Υπολογισμός / Απάντηση",
    prob2Row1Q: "α) Μήκος ΒΥ",
    prob2Row1P: "Το ύψος ΑΥ προς τη βάση είναι και διάμεσος",
    prob2Row1C: (
      <span className="inline-flex items-center gap-1">
        ΒΥ ＝ <Frac num="12" den="2" /> ＝ 6 cm
      </span>
    ),
    prob2Row2Q: (
      <>
        β) Γωνία Β<Angle>Α</Angle>Υ
      </>
    ),
    prob2Row2P: (
      <>
        Το ύψος ΑΥ είναι και διχοτόμος της γωνίας <Angle>Α</Angle>
      </>
    ),
    prob2Row2C: (
      <span className="inline-flex items-center gap-1">
        Β<Angle>Α</Angle>Υ ＝ <Frac num="50°" den="2" /> ＝ 25°
      </span>
    ),
    prob2Row3Q: "γ) Θέση ορθοκέντρου",
    prob2Row3P: (
      <>
        Οι γωνίες είναι <Angle>Α</Angle> ＝ 50°, <Angle>Β</Angle> ＝ <Angle>Γ</Angle> ＝ 65° (οξείες)
      </>
    ),
    prob2Row3C: "Οξυγώνιο ⇒ Ορθόκεντρο στο εσωτερικό",
    prob2ResSummary: "Συμπέρασμα:",
    prob2ResText: (
      <>
        ΒΥ ＝ 6 cm, Β<Angle>Α</Angle>Υ ＝ 25° και το ορθόκεντρο βρίσκεται στο εσωτερικό του τριγώνου ΑΒΓ.
      </>
    ),

    // Alerts
    alertTitle: "ΠΡΟΣΟΧΗ: ΚΛΑΣΙΚΑ ΛΑΘΗ ΣΤΑ ΔΕΥΤΕΡΕΥΟΝΤΑ ΣΤΟΙΧΕΙΑ",
    alert1Title: "Μην μπερδεύετε τη διάμεσο με το ύψος:",
    alert1Desc: "Η διάμεσος ενώνει την κορυφή με το ΜΕΣΟ της απέναντι πλευράς (δεν σχηματίζει απαραίτητα 90°). Το ύψος είναι ΚΑΘΕΤΟ (90°) στην απέναντι πλευρά (δεν πέφτει απαραίτητα στο μέσο).",
    alert2Title: "Το ύψος δεν είναι πάντα μέσα στο τρίγωνο:",
    alert2Desc: "Σε ένα αμβλυγώνιο τρίγωνο, τα δύο ύψη πέφτουν έξω από το τρίγωνο, πάνω στις προεκτάσεις των πλευρών, και το ορθόκεντρο βρίσκεται εκτός του τριγώνου.",
    alert3Title: "Έγκεντρο vs Ορθόκεντρο:",
    alert3Desc: "Το έγκεντρο είναι το σημείο τομής των διχοτόμων (και είναι ΠΑΝΤΑ μέσα στο τρίγωνο). Το ορθόκεντρο είναι το σημείο τομής των υψών (μπορεί να είναι μέσα, πάνω σε κορυφή ή έξω).",
    alert4Title: "Πότε ταυτίζονται ύψος, διάμεσος και διχοτόμος:",
    alert4Desc: "Σε ένα τυχαίο (σκαληνό) τρίγωνο είναι τρία διαφορετικά ευθύγραμμα τμήματα. Ταυτίζονται ΜΟΝΟ στο ισοσκελές (για τη βάση) και στο ισόπλευρο (για όλες τις πλευρές).",

    // Bottom
    bottomTitle: "Εμπεδώστε τα Δευτερεύοντα Στοιχεία στην Πράξη!",
    bottomDesc: "Εξασκηθείτε σε διαμέσους, διχοτόμους, έγκεντρο, ύψη και ορθόκεντρο με διαδραστικές ερωτήσεις, γεωμετρικά σχήματα και αναλυτικά βήματα.",
    bottomBtn: "ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ"
  },
  en: {
    pageTitle: "Secondary Elements of Triangles | Grade 7 Theory",
    pageDesc: "Comprehensive Grade 7 geometry theory on secondary elements of triangles: medians, angle bisectors and incenter, altitudes and orthocenter, and interactive lab.",
    backNav: "Grade 7",
    heroBadge: "CHAPTER 06 • GRADE 7",
    heroTitle: "Secondary Elements of Triangles",
    heroDesc: "Beyond vertices, sides, and angles, every triangle features special line segments with remarkable geometric properties: medians, angle bisectors (incenter), and altitudes (orthocenter).",
    btnExercises: "EXERCISES",
    btnGoExercises: "GO TO EXERCISES",

    // Card 1: Median
    card1Badge: "1",
    card1Title: "Median of a Triangle",
    card1Desc: (
      <>
        A <strong>median</strong> of a triangle is a line segment joining a vertex to the <strong>midpoint</strong> of the opposite side (e.g., AM where BM ＝ MC).
      </>
    ),
    card1Prop1Title: "Count & Position:",
    card1Prop1Desc: (
      <>
        Every triangle has <strong>3 medians</strong> (m<sub>a</sub>, m<sub>b</sub>, m<sub>c</sub>), which always lie <strong>strictly inside</strong> the triangle.
      </>
    ),
    card1Prop2Title: "Point of Intersection (Centroid):",
    card1Prop2Desc: "The three medians of any triangle intersect at a single common point called the centroid (G), which is the triangle's center of mass.",

    // Card 2: Bisector & Incenter
    card2Badge: "2",
    card2Title: "Angle Bisector & Incenter",
    card2Desc: (
      <>
        An <strong>angle bisector</strong> of a triangle is the segment bisecting an interior angle from its vertex to the opposite side (e.g., AD such that ∠BAD ＝ ∠DAC).
      </>
    ),
    card2Prop1Title: "The Incenter (I):",
    card2Prop1Desc: (
      <>
        Every triangle has <strong>3 angle bisectors</strong> (w<sub>a</sub>, w<sub>b</sub>, w<sub>c</sub>), always inside the triangle, intersecting at a single point called the <strong>incenter (I)</strong>.
      </>
    ),
    card2Prop2Title: "Inscribed Circle (Incircle):",
    card2Prop2Desc: "The incenter I is equidistant from all three sides of the triangle and serves as the center of the inscribed circle tangent to all three sides.",

    // Card 3: Altitude & Orthocenter
    card3Badge: "3",
    card3Title: "Altitude & Orthocenter",
    card3Desc: (
      <>
        An <strong>altitude</strong> of a triangle is the <strong>perpendicular</strong> segment drawn from a vertex to the line containing the opposite side (e.g., AH ⊥ BC).
      </>
    ),
    card3Prop1Title: "The Orthocenter (H):",
    card3Prop1Desc: (
      <>
        Every triangle has <strong>3 altitudes</strong> (h<sub>a</sub>, h<sub>b</sub>, h<sub>c</sub>). The lines containing the three altitudes intersect at a single point called the <strong>orthocenter (H)</strong>.
      </>
    ),
    card3Prop2Title: "Side Extensions:",
    card3Prop2Desc: "In obtuse triangles, the altitudes from the two acute vertices fall outside the triangle onto the extensions of the opposite sides!",

    // Card 4: Position of Orthocenter & Special Triangles
    card4Badge: "4",
    card4Title: "Orthocenter Position & Special Triangles",
    card4Desc: "The location of the altitudes and the orthocenter H depends directly on the triangle's angle classification:",
    card4AcuteTitle: "1. Acute Triangle:",
    card4AcuteDesc: "All 3 altitudes and the orthocenter H lie strictly inside the triangle.",
    card4RightTitle: "2. Right Triangle:",
    card4RightDesc: "The two legs coincide with two altitudes, and the orthocenter H coincides with the right-angle vertex.",
    card4ObtuseTitle: "3. Obtuse Triangle:",
    card4ObtuseDesc: "The two altitudes from the acute angles fall outside on side extensions, and the orthocenter H lies outside the triangle.",
    card4IsoNoteTitle: "Special Property of Isosceles & Equilateral Triangles:",
    card4IsoNoteDesc: "In an isosceles triangle, the altitude to the base coincides with the median and the vertex angle bisector! In an equilateral triangle, this holds for all 3 vertices (orthocenter ＝ incenter ＝ centroid).",

    // Interactive Lab
    labBadge: "GEOMETRY LAB",
    labTitle: "Interactive Secondary Elements Explorer",
    labElementLabel: "1. SELECT ELEMENT:",
    tabMedians: "MEDIANS (G)",
    tabBisectors: "BISECTORS & INCENTER (I)",
    tabAltitudes: "ALTITUDES & ORTHOCENTER (H)",
    labShapeLabel: "2. SELECT TRIANGLE TYPE:",
    shapeAcute: "Acute",
    shapeRight: "Right (∠A ＝ 90°)",
    shapeObtuse: "Obtuse (∠A ＞ 90°)",
    shapeIsosceles: "Isosceles (AB ＝ AC)",
    shapeEquilateral: "Equilateral",
    labLegendTitle: "DIAGRAM OBSERVATION:",
    obsMediansGeneral: "The 3 medians join each vertex to the midpoint of the opposite side and always intersect inside the triangle (centroid G).",
    obsMediansIso: "In an isosceles triangle (AB ＝ AC), the median AM₁ to base BC is simultaneously an altitude and an angle bisector!",
    obsMediansEqui: "In an equilateral triangle, all 3 medians have equal length and coincide with the altitudes and angle bisectors!",
    obsBisectorsGeneral: "The 3 angle bisectors divide each angle into two equal halves and meet at the incenter I, the center of the inscribed circle.",
    obsBisectorsIso: "In an isosceles triangle, the bisector of vertex angle ∠A passes through the midpoint of base BC and is perpendicular to it.",
    obsBisectorsEqui: "In an equilateral triangle, each 60° angle is bisected into two 30° angles, and the incenter I coincides with the orthocenter H.",
    obsAltitudesAcute: "Since the triangle is acute, all 3 altitudes fall directly on the sides and the orthocenter H lies inside the triangle.",
    obsAltitudesRight: "Since the triangle is right-angled (∠A ＝ 90°), legs AB and AC are two of its altitudes, so the orthocenter H is at vertex A!",
    obsAltitudesObtuse: "Since the triangle is obtuse (∠A ＞ 90°), the altitudes from acute vertices B and C fall onto the extensions of the opposite sides, placing the orthocenter H OUTSIDE the triangle!",
    obsAltitudesIso: "In an isosceles triangle, the altitude AH₁ to base BC bisects both the base (BH₁ ＝ H₁C) and the vertex angle ∠A.",
    obsAltitudesEqui: "In an equilateral triangle, all 3 altitudes are equal, hit the midpoints of the sides, and the orthocenter H is at the center.",

    // Solved Problems
    solvedTitle: "Solved Practice Problems",
    prob1Badge: "PROBLEM 1: MEDIAN & ANGLE BISECTOR",
    prob1Title: "Calculating segments and angles using median and bisector",
    prob1DescPre: "In triangle ABC, side BC has length 14 cm and angle ∠A measures 76°. If AM is the median to side BC and AD is the bisector of angle ∠A, find: (a) the length of segment BM and (b) the measure of angle ∠BAD.",
    prob1ColQuestion: "Question",
    prob1ColProperty: "Geometric Property",
    prob1ColCalc: "Calculation",
    prob1Row1Q: "(a) Length BM",
    prob1Row1P: "Median AM intersects BC at its midpoint (BM ＝ MC)",
    prob1Row1C: (
      <span className="inline-flex items-center gap-1">
        BM ＝ <Frac num="14" den="2" /> ＝ 7 cm
      </span>
    ),
    prob1Row2Q: "(b) Angle ∠BAD",
    prob1Row2P: "Angle bisector AD divides ∠A into two equal angles",
    prob1Row2C: (
      <span className="inline-flex items-center gap-1">
        ∠BAD ＝ <Frac num="76°" den="2" /> ＝ 38°
      </span>
    ),
    prob1ResSummary: "Answer:",
    prob1ResText: "Segment BM is 7 cm long and angle ∠BAD measures 38°.",

    prob2Badge: "PROBLEM 2: ALTITUDE, ORTHOCENTER & ISOSCELES TRIANGLE",
    prob2Title: "Applying altitude properties in an isosceles triangle",
    prob2DescPre: "In an isosceles triangle ABC (AB ＝ AC) with base BC ＝ 12 cm and vertex angle ∠A ＝ 50°, we draw the altitude AH to base BC. Determine: (a) the length of BH, (b) the measure of angle ∠BAH, and (c) the location of the orthocenter.",
    prob2ColQuestion: "Question",
    prob2ColProperty: "Isosceles Property",
    prob2ColCalc: "Calculation / Answer",
    prob2Row1Q: "(a) Length BH",
    prob2Row1P: "Altitude AH to the base is also a median",
    prob2Row1C: (
      <span className="inline-flex items-center gap-1">
        BH ＝ <Frac num="12" den="2" /> ＝ 6 cm
      </span>
    ),
    prob2Row2Q: "(b) Angle ∠BAH",
    prob2Row2P: "Altitude AH also bisects vertex angle ∠A",
    prob2Row2C: (
      <span className="inline-flex items-center gap-1">
        ∠BAH ＝ <Frac num="50°" den="2" /> ＝ 25°
      </span>
    ),
    prob2Row3Q: "(c) Orthocenter location",
    prob2Row3P: "Angles are ∠A ＝ 50°, ∠B ＝ ∠C ＝ 65° (all acute)",
    prob2Row3C: "Acute triangle ⇒ Orthocenter lies inside",
    prob2ResSummary: "Conclusion:",
    prob2ResText: "BH ＝ 6 cm, ∠BAH ＝ 25°, and the orthocenter lies inside triangle ABC.",

    // Alerts
    alertTitle: "CAUTION: CLASSIC PITFALLS WITH SECONDARY ELEMENTS",
    alert1Title: "Do not confuse a median with an altitude:",
    alert1Desc: "A median connects a vertex to the MIDPOINT of the opposite side (not necessarily at 90°). An altitude is PERPENDICULAR (90°) to the opposite side (not necessarily at the midpoint).",
    alert2Title: "Altitudes are not always inside the triangle:",
    alert2Desc: "In an obtuse triangle, two altitudes fall outside the triangle onto the extensions of the sides, and the orthocenter lies outside.",
    alert3Title: "Incenter vs. Orthocenter:",
    alert3Desc: "The incenter is the intersection of the angle bisectors (ALWAYS inside). The orthocenter is the intersection of the altitudes (inside, at a vertex, or outside).",
    alert4Title: "When altitude, median, and bisector coincide:",
    alert4Desc: "In a scalene triangle they are three distinct segments. They coincide ONLY for the base of an isosceles triangle and for all sides of an equilateral triangle.",

    // Bottom
    bottomTitle: "Master Secondary Elements in Practice!",
    bottomDesc: "Practice medians, angle bisectors, incenter, altitudes, and orthocenter with interactive questions, diagrams, and step-by-step explanations.",
    bottomBtn: "START EXERCISES"
  }
};

// Γεωμετρικοί υπολογισμοί ακριβείας για το διαδραστικό SVG εργαστήριο
function computeTriangleGeometry(shape) {
  // Συντεταγμένες κορυφών Α, Β, Γ σε viewBox 380x250
  // Στο obtuse το τρίγωνο τοποθετείται πιο ψηλά ώστε να φαίνονται ολόκληρα και τα 3 ύψη & το ορθόκεντρο Η
  const presets = {
    acute: { A: { x: 165, y: 45 }, B: { x: 85, y: 195 }, C: { x: 295, y: 195 } },
    right: { A: { x: 100, y: 195 }, B: { x: 100, y: 60 }, C: { x: 290, y: 195 } },
    obtuse: { A: { x: 155, y: 120 }, B: { x: 105, y: 35 }, C: { x: 295, y: 120 } },
    isosceles: { A: { x: 190, y: 42 }, B: { x: 105, y: 195 }, C: { x: 275, y: 195 } },
    equilateral: { A: { x: 190, y: 44 }, B: { x: 103, y: 195 }, C: { x: 277, y: 195 } }
  };

  const { A, B, C } = presets[shape] || presets.acute;

  // Μέσα πλευρών (για διαμέσους)
  const M_a = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
  const M_b = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 };
  const M_c = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const G = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 };

  // Μήκη πλευρών
  const a = Math.hypot(B.x - C.x, B.y - C.y);
  const b = Math.hypot(A.x - C.x, A.y - C.y);
  const c = Math.hypot(A.x - B.x, A.y - B.y);
  const perim = a + b + c;

  // Ίχνη διχοτόμων & Έγκεντρο (I)
  const D_a = { x: (b * B.x + c * C.x) / (b + c), y: (b * B.y + c * C.y) / (b + c) };
  const D_b = { x: (a * A.x + c * C.x) / (a + c), y: (a * A.y + c * C.y) / (a + c) };
  const D_c = { x: (a * A.x + b * B.x) / (a + b), y: (a * A.y + b * B.y) / (a + b) };
  const I = {
    x: (a * A.x + b * B.x + c * C.x) / perim,
    y: (a * A.y + b * B.y + c * C.y) / perim
  };
  // Ακτίνα εγγεγραμμένου κύκλου (Εμβαδόν / ημιπερίμετρος)
  const area = Math.abs((A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y)) / 2);
  const inradius = area / (perim / 2);

  // Προβολή σημείου P πάνω στην ευθεία L1-L2 (για ύψη)
  const projectPoint = (P, L1, L2) => {
    const dx = L2.x - L1.x;
    const dy = L2.y - L1.y;
    const lenSq = dx * dx + dy * dy || 1;
    const t = ((P.x - L1.x) * dx + (P.y - L1.y) * dy) / lenSq;
    return { x: L1.x + t * dx, y: L1.y + t * dy, t };
  };

  const H_a = projectPoint(A, B, C);
  const H_b = projectPoint(B, A, C);
  const H_c = projectPoint(C, A, B);

  // Τομή δύο ευθειών (για ορθόκεντρο Η)
  const lineIntersection = (P1, P2, P3, P4) => {
    const denom = (P1.x - P2.x) * (P3.y - P4.y) - (P1.y - P2.y) * (P3.x - P4.x);
    if (Math.abs(denom) < 1e-6) return A;
    const px =
      ((P1.x * P2.y - P1.y * P2.x) * (P3.x - P4.x) -
        (P1.x - P2.x) * (P3.x * P4.y - P3.y * P4.x)) /
      denom;
    const py =
      ((P1.x * P2.y - P1.y * P2.x) * (P3.y - P4.y) -
        (P1.y - P2.y) * (P3.x * P4.y - P3.y * P4.x)) /
      denom;
    return { x: px, y: py };
  };

  const H = shape === 'right' ? A : lineIntersection(A, H_a, B, H_b);

  return { A, B, C, M_a, M_b, M_c, G, D_a, D_b, D_c, I, inradius, H_a, H_b, H_c, H };
}

export default function StoixeiaTrigononTheory() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const isEl = locale === 'el';
  const t = translations[isEl ? 'el' : 'en'];

  const [activeElement, setActiveElement] = useState('medians'); // 'medians' | 'bisectors' | 'altitudes'
  const [shape, setShape] = useState('acute'); // 'acute' | 'right' | 'obtuse' | 'isosceles' | 'equilateral'

  const geo = computeTriangleGeometry(shape);
  const vLbl = isEl ? { A: 'Α', B: 'Β', C: 'Γ' } : { A: 'A', B: 'B', C: 'C' };
  const isApexB = shape === 'right' || shape === 'obtuse';

  // Επιλογή δυναμικού κειμένου παρατήρησης
  let observationText = t.obsMediansGeneral;
  if (activeElement === 'medians') {
    if (shape === 'isosceles') observationText = t.obsMediansIso;
    else if (shape === 'equilateral') observationText = t.obsMediansEqui;
    else observationText = t.obsMediansGeneral;
  } else if (activeElement === 'bisectors') {
    if (shape === 'isosceles') observationText = t.obsBisectorsIso;
    else if (shape === 'equilateral') observationText = t.obsBisectorsEqui;
    else observationText = t.obsBisectorsGeneral;
  } else {
    if (shape === 'right') observationText = t.obsAltitudesRight;
    else if (shape === 'obtuse') observationText = t.obsAltitudesObtuse;
    else if (shape === 'isosceles') observationText = t.obsAltitudesIso;
    else if (shape === 'equilateral') observationText = t.obsAltitudesEqui;
    else observationText = t.obsAltitudesAcute;
  }

  // Βοηθητική για σύμβολο ορθής γωνίας στο SVG
  const renderRightAngle = (Foot, Vertex, SidePt, color = '#34d399') => {
    const size = 10;
    const v1x = Vertex.x - Foot.x;
    const v1y = Vertex.y - Foot.y;
    const l1 = Math.hypot(v1x, v1y) || 1;
    const u1x = (v1x / l1) * size;
    const u1y = (v1y / l1) * size;

    const v2x = SidePt.x - Foot.x;
    const v2y = SidePt.y - Foot.y;
    const l2 = Math.hypot(v2x, v2y) || 1;
    const u2x = (v2x / l2) * size;
    const u2y = (v2y / l2) * size;

    return (
      <polyline
        points={`${Foot.x + u1x},${Foot.y + u1y} ${Foot.x + u1x + u2x},${Foot.y + u1y + u2y} ${Foot.x + u2x},${Foot.y + u2y}`}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
      />
    );
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
          href="/a-gymnasiou/41-stoixeia-trigonon-ask"
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
                href="/a-gymnasiou/41-stoixeia-trigonon-ask"
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
          
          {/* ΚΑΡΤΑ 1: ΔΙΑΜΕΣΟΣ */}
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

              {/* Μικρό Εποπτικό Σχήμα Διαμέσου */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 200 135" className="w-40 h-28 shrink-0">
                  <polygon points="95,20 30,112 175,112" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  {/* Διάμεσος ΑΜ */}
                  <line x1="95" y1="20" x2="102.5" y2="112" stroke="#059669" strokeWidth="2.2" />
                  {/* Τικ ισότητας στη βάση ΒΓ */}
                  <line x1="65" y1="107" x2="65" y2="117" stroke="#059669" strokeWidth="2" />
                  <line x1="138" y1="107" x2="138" y2="117" stroke="#059669" strokeWidth="2" />
                  <circle cx="95" cy="20" r="3" fill="#1e1b4b" />
                  <circle cx="30" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="175" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="102.5" cy="112" r="3.5" fill="#059669" />
                  <text x="95" y="13" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="19" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="186" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                  <text x="102.5" y="127" textAnchor="middle" className="text-[11px] font-bold fill-emerald-700">Μ</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-indigo-900 block">{t.card1Prop1Title}</strong>
                    {t.card1Prop1Desc}
                  </div>
                  <div>
                    <strong className="text-emerald-800 block">{t.card1Prop2Title}</strong>
                    {t.card1Prop2Desc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 2: ΔΙΧΟΤΟΜΟΣ & ΕΓΚΕΝΤΡΟ */}
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

              {/* Μικρό Εποπτικό Σχήμα Διχοτόμου & Εγκέντρου */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 200 135" className="w-40 h-28 shrink-0">
                  <polygon points="100,18 30,112 170,112" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  {/* Εγγεγραμμένος κύκλος (εφάπτεται ακριβώς και στις 3 πλευρές) */}
                  <circle cx="100" cy="76.85" r="35.15" fill="rgba(16, 185, 129, 0.12)" stroke="#059669" strokeWidth="1.6" strokeDasharray="3 2" />
                  {/* Διχοτόμος ΑΔ */}
                  <line x1="100" y1="18" x2="100" y2="112" stroke="#d97706" strokeWidth="2" />
                  {/* Έγκεντρο Ι και ίχνος Δ */}
                  <circle cx="100" cy="76.85" r="3.5" fill="#d97706" />
                  <circle cx="100" cy="112" r="3" fill="#d97706" />
                  <circle cx="100" cy="18" r="3" fill="#1e1b4b" />
                  <circle cx="30" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="170" cy="112" r="3" fill="#1e1b4b" />
                  <text x="100" y="12" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="19" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="181" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                  <text x="108" y="80" textAnchor="start" className="text-[11px] font-black fill-amber-700">{isEl ? 'Ι' : 'I'}</text>
                  <text x="100" y="127" textAnchor="middle" className="text-[11px] font-bold fill-amber-700">{isEl ? 'Δ' : 'D'}</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-indigo-900 block">{t.card2Prop1Title}</strong>
                    {t.card2Prop1Desc}
                  </div>
                  <div>
                    <strong className="text-amber-800 block">{t.card2Prop2Title}</strong>
                    {t.card2Prop2Desc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 3: ΥΨΟΣ & ΟΡΘΟΚΕΝΤΡΟ */}
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

              {/* Μικρό Εποπτικό Σχήμα Ύψους */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 flex flex-col sm:flex-row items-center gap-4">
                <svg viewBox="0 0 200 135" className="w-40 h-28 shrink-0">
                  <polygon points="80,20 30,112 175,112" fill="#eef2ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
                  {/* Ύψος ΑΥ */}
                  <line x1="80" y1="20" x2="80" y2="112" stroke="#e11d48" strokeWidth="2.2" />
                  {/* Σύμβολο ορθής γωνίας */}
                  <polyline points="80,101 91,101 91,112" fill="none" stroke="#e11d48" strokeWidth="1.8" />
                  <circle cx="80" cy="20" r="3" fill="#1e1b4b" />
                  <circle cx="30" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="175" cy="112" r="3" fill="#1e1b4b" />
                  <circle cx="80" cy="112" r="3.5" fill="#e11d48" />
                  <text x="80" y="13" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.A}</text>
                  <text x="19" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.B}</text>
                  <text x="186" y="118" textAnchor="middle" className="text-[11px] font-black fill-indigo-950">{vLbl.C}</text>
                  <text x="80" y="127" textAnchor="middle" className="text-[11px] font-bold fill-rose-700">{isEl ? 'Υ' : 'H'}</text>
                </svg>
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div>
                    <strong className="text-indigo-900 block">{t.card3Prop1Title}</strong>
                    {t.card3Prop1Desc}
                  </div>
                  <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-950 text-xs">
                    <strong>{t.card3Prop2Title}</strong> {t.card3Prop2Desc}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΚΑΡΤΑ 4: ΘΕΣΗ ΟΡΘΟΚΕΝΤΡΟΥ & ΙΔΙΑΙΤΕΡΟΤΗΤΕΣ */}
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

              <div className="space-y-2 text-xs sm:text-sm text-slate-700 mb-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4AcuteTitle}</strong> {t.card4AcuteDesc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4RightTitle}</strong> {t.card4RightDesc}
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed">
                  <strong className="text-indigo-900">{t.card4ObtuseTitle}</strong> {t.card4ObtuseDesc}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950 leading-relaxed">
                <strong className="text-emerald-900 block mb-0.5">{t.card4IsoNoteTitle}</strong>
                {t.card4IsoNoteDesc}
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12 w-full min-w-0">
          <div className="mb-5 pb-5 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              🧭 {toCleanUppercase(t.labBadge)}
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full min-w-0">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full min-w-0">
              
              {/* Επιλογή Δευτερεύοντος Στοιχείου */}
              <div>
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block mb-2">
                  {toCleanUppercase(t.labElementLabel)}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveElement('medians')}
                    className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all ${
                      activeElement === 'medians'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {toCleanUppercase(t.tabMedians)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveElement('bisectors')}
                    className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all ${
                      activeElement === 'bisectors'
                        ? 'bg-amber-600 text-white border-amber-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {toCleanUppercase(t.tabBisectors)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveElement('altitudes')}
                    className={`p-3 rounded-xl text-left font-bold text-xs sm:text-sm border transition-all ${
                      activeElement === 'altitudes'
                        ? 'bg-rose-600 text-white border-rose-600 shadow'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {toCleanUppercase(t.tabAltitudes)}
                  </button>
                </div>
              </div>

              {/* Επιλογή Είδους Τριγώνου */}
              <div className="pt-3 border-t border-slate-200">
                <span className="text-xs font-black text-indigo-900 uppercase tracking-wider block mb-2">
                  {toCleanUppercase(t.labShapeLabel)}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'acute', label: t.shapeAcute },
                    { id: 'right', label: t.shapeRight },
                    { id: 'obtuse', label: t.shapeObtuse },
                    { id: 'isosceles', label: t.shapeIsosceles },
                    { id: 'equilateral', label: t.shapeEquilateral }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setShape(item.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        shape === item.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Dynamic SVG Visualizer & Observation */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full min-w-0">
              
              {/* SVG Καμβάς */}
              <div className="bg-slate-950 rounded-2xl p-3 sm:p-5 flex items-center justify-center shadow-inner overflow-hidden">
                <svg viewBox="0 0 380 250" className="w-full max-w-lg h-56 sm:h-64 select-none">
                  
                  {/* Προεκτάσεις πλευρών για Αμβλυγώνιο στα Ύψη */}
                  {activeElement === 'altitudes' && shape === 'obtuse' && (
                    <>
                      <line
                        x1={geo.B.x}
                        y1={geo.B.y}
                        x2={geo.H_c.x}
                        y2={geo.H_c.y}
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1={geo.B.x}
                        y1={geo.B.y}
                        x2={geo.H_b.x}
                        y2={geo.H_b.y}
                        stroke="#64748b"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />
                      {/* Προέκταση υψών μέχρι το εξωτερικό ορθόκεντρο Η */}
                      <line
                        x1={geo.A.x}
                        y1={geo.A.y}
                        x2={geo.H.x}
                        y2={geo.H.y}
                        stroke="#fb7185"
                        strokeWidth="1.4"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1={geo.B.x}
                        y1={geo.B.y}
                        x2={geo.H.x}
                        y2={geo.H.y}
                        stroke="#fb7185"
                        strokeWidth="1.4"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1={geo.C.x}
                        y1={geo.C.y}
                        x2={geo.H.x}
                        y2={geo.H.y}
                        stroke="#fb7185"
                        strokeWidth="1.4"
                        strokeDasharray="3 3"
                      />
                    </>
                  )}

                  {/* Βασικό Τρίγωνο ΑΒΓ */}
                  <polygon
                    points={`${geo.A.x},${geo.A.y} ${geo.B.x},${geo.B.y} ${geo.C.x},${geo.C.y}`}
                    fill="rgba(99, 102, 241, 0.22)"
                    stroke="#818cf8"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Ορθή γωνία κορυφής Α αν shape === 'right' */}
                  {shape === 'right' && renderRightAngle(geo.A, geo.B, geo.C, '#818cf8')}

                  {/* 1. ΔΙΑΜΕΣΟΙ */}
                  {activeElement === 'medians' && (
                    <>
                      <line x1={geo.A.x} y1={geo.A.y} x2={geo.M_a.x} y2={geo.M_a.y} stroke="#34d399" strokeWidth="2" />
                      <line x1={geo.B.x} y1={geo.B.y} x2={geo.M_b.x} y2={geo.M_b.y} stroke="#34d399" strokeWidth="2" />
                      <line x1={geo.C.x} y1={geo.C.y} x2={geo.M_c.x} y2={geo.M_c.y} stroke="#34d399" strokeWidth="2" />

                      <circle cx={geo.M_a.x} cy={geo.M_a.y} r="3.5" fill="#10b981" />
                      <circle cx={geo.M_b.x} cy={geo.M_b.y} r="3.5" fill="#10b981" />
                      <circle cx={geo.M_c.x} cy={geo.M_c.y} r="3.5" fill="#10b981" />

                      <text
                        x={geo.M_a.x + (isApexB ? 10 : 0)}
                        y={geo.M_a.y + (isApexB ? -4 : 15)}
                        textAnchor={isApexB ? 'start' : 'middle'}
                        className="text-[10px] font-bold fill-emerald-300"
                      >
                        Μ₁
                      </text>
                      <text
                        x={geo.M_b.x + (isApexB ? 0 : 12)}
                        y={geo.M_b.y + (isApexB ? 15 : -3)}
                        textAnchor={isApexB ? 'middle' : 'start'}
                        className="text-[10px] font-bold fill-emerald-300"
                      >
                        Μ₂
                      </text>
                      <text x={geo.M_c.x - 12} y={geo.M_c.y - 3} textAnchor="end" className="text-[10px] font-bold fill-emerald-300">
                        Μ₃
                      </text>

                      {/* Βαρύκεντρο G */}
                      <circle cx={geo.G.x} cy={geo.G.y} r="5" fill="#34d399" stroke="#064e3b" strokeWidth="1.5" />
                      <text x={geo.G.x + 8} y={geo.G.y - 6} className="text-[12px] font-black fill-emerald-300">G</text>
                    </>
                  )}

                  {/* 2. ΔΙΧΟΤΟΜΟΙ & ΕΓΚΕΝΤΡΟ */}
                  {activeElement === 'bisectors' && (
                    <>
                      {/* Εγγεγραμμένος κύκλος */}
                      <circle
                        cx={geo.I.x}
                        cy={geo.I.y}
                        r={geo.inradius}
                        fill="rgba(251, 191, 36, 0.12)"
                        stroke="#fbbf24"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                      />
                      <line x1={geo.A.x} y1={geo.A.y} x2={geo.D_a.x} y2={geo.D_a.y} stroke="#fbbf24" strokeWidth="2" />
                      <line x1={geo.B.x} y1={geo.B.y} x2={geo.D_b.x} y2={geo.D_b.y} stroke="#fbbf24" strokeWidth="2" />
                      <line x1={geo.C.x} y1={geo.C.y} x2={geo.D_c.x} y2={geo.D_c.y} stroke="#fbbf24" strokeWidth="2" />

                      {/* Έγκεντρο Ι */}
                      <circle cx={geo.I.x} cy={geo.I.y} r="5" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
                      <text x={geo.I.x + 8} y={geo.I.y - 6} className="text-[12px] font-black fill-amber-300">
                        {isEl ? 'Ι' : 'I'}
                      </text>
                    </>
                  )}

                  {/* 3. ΥΨΗ & ΟΡΘΟΚΕΝΤΡΟ */}
                  {activeElement === 'altitudes' && (
                    <>
                      <line x1={geo.A.x} y1={geo.A.y} x2={geo.H_a.x} y2={geo.H_a.y} stroke="#fb7185" strokeWidth="2.2" />
                      <line x1={geo.B.x} y1={geo.B.y} x2={geo.H_b.x} y2={geo.H_b.y} stroke="#fb7185" strokeWidth="2.2" />
                      <line x1={geo.C.x} y1={geo.C.y} x2={geo.H_c.x} y2={geo.H_c.y} stroke="#fb7185" strokeWidth="2.2" />

                      {/* Ορθές γωνίες στα ίχνη των υψών */}
                      {renderRightAngle(geo.H_a, geo.A, geo.C, '#fb7185')}
                      {shape !== 'right' && renderRightAngle(geo.H_b, geo.B, geo.A, '#fb7185')}
                      {shape !== 'right' && renderRightAngle(geo.H_c, geo.C, geo.A, '#fb7185')}

                      {/* Ορθόκεντρο Η */}
                      <circle cx={geo.H.x} cy={geo.H.y} r="5.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                      <text
                        x={geo.H.x + (shape === 'obtuse' ? -10 : 8)}
                        y={geo.H.y + (shape === 'obtuse' ? 4 : -6)}
                        textAnchor={shape === 'obtuse' ? 'end' : 'start'}
                        className="text-[12px] font-black fill-rose-300"
                      >
                        {isEl ? 'Η' : 'H'}
                      </text>
                    </>
                  )}

                  {/* Κορυφές Α, Β, Γ */}
                  <circle cx={geo.A.x} cy={geo.A.y} r="4" fill="#ffffff" />
                  <text
                    x={isApexB ? geo.A.x - 10 : geo.A.x}
                    y={isApexB ? geo.A.y + 15 : geo.A.y - 10}
                    textAnchor="middle"
                    className="text-[12px] font-black fill-white"
                  >
                    {shape === 'right' ? `${vLbl.A} (90°)` : vLbl.A}
                  </text>

                  <circle cx={geo.B.x} cy={geo.B.y} r="4" fill="#ffffff" />
                  <text
                    x={isApexB ? geo.B.x : geo.B.x - 10}
                    y={isApexB ? geo.B.y - 10 : geo.B.y + 15}
                    textAnchor="middle"
                    className="text-[12px] font-black fill-white"
                  >
                    {vLbl.B}
                  </text>

                  <circle cx={geo.C.x} cy={geo.C.y} r="4" fill="#ffffff" />
                  <text x={geo.C.x + 10} y={geo.C.y + 15} textAnchor="middle" className="text-[12px] font-black fill-white">
                    {vLbl.C}
                  </text>
                </svg>
              </div>

              {/* Δυναμική Παρατήρηση */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs sm:text-sm text-indigo-950 leading-relaxed">
                <span className="font-black text-indigo-800 block mb-1 text-xs">
                  💡 {toCleanUppercase(t.labLegendTitle)}
                </span>
                {observationText}
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
                    <div className="text-slate-600">{t.prob1Row1P}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob1Row2Q}</div>
                    <div className="text-slate-600">{t.prob1Row2P}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob1Row2C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob1ColQuestion}</th>
                        <th className="p-2.5 border-b">{t.prob1ColProperty}</th>
                        <th className="p-2.5 border-b">{t.prob1ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row1Q}</td>
                        <td className="p-2.5">{t.prob1Row1P}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob1Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob1Row2Q}</td>
                        <td className="p-2.5">{t.prob1Row2P}</td>
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
                    <div className="text-slate-600">{t.prob2Row1P}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row1C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row2Q}</div>
                    <div className="text-slate-600">{t.prob2Row2P}</div>
                    <div className="font-bold text-indigo-700 font-mono">{t.prob2Row2C}</div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <div className="font-bold text-indigo-900">{t.prob2Row3Q}</div>
                    <div className="text-slate-600">{t.prob2Row3P}</div>
                    <div className="font-bold text-indigo-700">{t.prob2Row3C}</div>
                  </div>
                </div>

                {/* Desktop View: Πίνακας */}
                <div className="hidden sm:block w-full mb-4 rounded-xl border border-slate-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2.5 border-b">{t.prob2ColQuestion}</th>
                        <th className="p-2.5 border-b">{t.prob2ColProperty}</th>
                        <th className="p-2.5 border-b">{t.prob2ColCalc}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row1Q}</td>
                        <td className="p-2.5">{t.prob2Row1P}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row1C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row2Q}</td>
                        <td className="p-2.5">{t.prob2Row2P}</td>
                        <td className="p-2.5 font-mono font-bold text-indigo-700">{t.prob2Row2C}</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-semibold">{t.prob2Row3Q}</td>
                        <td className="p-2.5">{t.prob2Row3P}</td>
                        <td className="p-2.5 font-bold text-indigo-700">{t.prob2Row3C}</td>
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
            href="/a-gymnasiou/41-stoixeia-trigonon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase(t.bottomBtn)}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
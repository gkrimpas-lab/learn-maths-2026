import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ (Πρόσημο πάντα μπροστά από τη γραμμή)
// ============================================================================
function Frac({ num, den, isNeg = false, className = '' }) {
  const numStr = String(num);
  const denStr = String(den);
  const hasMinus = numStr.startsWith('-') || denStr.startsWith('-') || isNeg;

  const displayNum = numStr.replace(/^-/, '');
  const displayDen = denStr.replace(/^-/, '');

  return (
    <span
      className={`inline-flex items-center gap-0.5 align-middle mx-0.5 sm:mx-1 font-mono text-[0.85em] sm:text-[0.9em] leading-none shrink-0 max-w-full ${className}`}
    >
      {hasMinus && <span className="font-bold">－</span>}
      <span className="inline-flex flex-col items-center justify-center leading-none text-center">
        <span
          className="pb-0.5 px-0.5 sm:px-1 border-b-2 border-current w-full text-center break-all"
          style={{ borderColor: 'currentColor' }}
        >
          {displayNum}
        </span>
        <span className="pt-0.5 px-0.5 sm:px-1 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// Καθαρισμός τόνων για ελληνικά κεφαλαία (διατηρεί μόνο το Α')
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

// ============================================================================
// ΣΥΓΚΕΝΤΡΩΤΙΚΟ ΛΕΞΙΚΟ i18n
// ============================================================================
const DICTIONARY = {
  el: {
    pageTitle: "Γωνίες: Είδη, Σύγκριση & Σχέσεις Γωνιών | Α' Γυμνασίου",
    pageDesc:
      'Έννοια γωνίας, είδη γωνιών, σύγκριση, εφεξής, διαδοχικές, συμπληρωματικές, παραπληρωματικές, κατακορυφήν γωνίες και διχοτόμος με διαδραστικά εργαστήρια.',
    backText: "Α' Γυμνασίου",
    btnExercises: 'ΑΣΚΗΣΕΙΣ',
    bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 02 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    bannerTitle: 'Γωνίες: Είδη, Σύγκριση & Σχέσεις Γωνιών',
    bannerSubtitle:
      'Εξερευνούμε διαδραστικά πώς σχηματίζονται οι γωνίες, τα είδη τους (οξεία, ορθή, αμβλεία, ευθεία κ.ά.), τις εφεξής και διαδοχικές γωνίες, τα ειδικά ζεύγη και τη διχοτόμο.',
    sec1Title: 'Έννοια της Γωνίας, Κορυφή, Πλευρές & Είδη Γωνιών',
    sec2Title: 'Σχέσεις Γωνιών: Εφεξής, Συμπληρωματικές, Παραπληρωματικές & Κατακορυφήν',
    sec3Title: 'Διχοτόμος Γωνίας',
    sec4Title: 'Παραδείγματα με Προβλήματα',
    lab1Header: 'Εργαστήριο 1: Διαδραστικός Μοιρογνώμονας — Περίστρεψε την πλευρά Oy και δες το είδος της γωνίας',
    lab2Header: 'Εργαστήριο 2: Πειραματίσου με τα Ζεύγη Γωνιών (Εφεξής, Συμπληρωματικές, Παραπληρωματικές, Κατακορυφήν)',
    lab3Header: 'Εργαστήριο 3: Διχοτόμος Γωνίας — Ζωντανός Χωρισμός σε 2 Ίσα Μέρη',
    angleMeasure: 'ΜΕΤΡΟ ΓΩΝΙΑΣ',
    angleType: 'ΕΙΔΟΣ ΓΩΝΙΑΣ',
    stepAdjust: 'ΜΙΚΡΟΡΥΘΜΙΣΗ & ΣΥΝΗΘΗ ΜΕΤΡΑ',
    visProtractorHeader: 'ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΟΙΡΟΓΝΩΜΟΝΑ (0° - 360°)',
    visRelationHeader: 'ΑΠΕΙΚΟΝΙΣΗ ΣΧΕΣΗΣ',
    visBisectorHeader: 'ΗΜΙΕΥΘΕΙΑ ΔΙΧΟΤΟΜΟΥ Οδ',
    card1Badge: '1. ΟΡΙΣΜΟΣ ΓΩΝΙΑΣ',
    card1Title: 'Κορυφή & Πλευρές',
    card1Text:
      'Γωνία ονομάζεται το γεωμετρικό σχήμα που αποτελείται από δύο ημιευθείες Ox και Oy με κοινή αρχή το O (κορυφή), μαζί με το μέρος του επιπέδου που ορίζουν. Συμβολίζεται: xÔy ή απλά Ô.',
    card2Badge: '2. ΟΡΘΗ & ΕΥΘΕΙΑ',
    card2Title: 'Γωνίες Αναφοράς',
    card2Text:
      'Ορθή είναι η γωνία ίση με 90° (κάθετες πλευρές). Ευθεία είναι η γωνία ίση με 180°, της οποίας οι πλευρές είναι αντικείμενες ημιευθείες πάνω στην ίδια ευθεία.',
    card3Badge: '3. ΟΞΕΙΑ & ΑΜΒΛΕΙΑ',
    card3Title: 'Σύγκριση με την Ορθή',
    card3Text:
      'Οξεία είναι κάθε γωνία μικρότερη από ορθή (0° ＜ x ＜ 90°). Αμβλεία είναι κάθε γωνία μεγαλύτερη από ορθή και μικρότερη από ευθεία (90° ＜ x ＜ 180°).',
    card4Badge: '4. ΜΗ ΚΥΡΤΗ & ΠΛΗΡΗΣ',
    card4Title: 'Μεγαλύτερες των 180°',
    card4Text:
      'Μη κυρτή (ανακλώμενη) ονομάζεται η γωνία με 180° ＜ x ＜ 360°. Πλήρης ονομάζεται η γωνία 360° (πλήρης περιστροφή της κινούμενης πλευράς).',
    types: {
      zero: 'Μηδενική Γωνία (0°)',
      acute: 'Οξεία Γωνία (0° ＜ x ＜ 90°)',
      right: 'Ορθή Γωνία (90°)',
      obtuse: 'Αμβλεία Γωνία (90° ＜ x ＜ 180°)',
      straight: 'Ευθεία Γωνία (180°)',
      reflex: 'Μη Κυρτή / Ανακλώμενη (180° ＜ x ＜ 360°)',
      full: 'Πλήρης Γωνία (360°)'
    },
    relModes: {
      adjacent: 'ΕΦΕΞΗΣ ΓΩΝΙΕΣ',
      complementary: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ (90°)',
      supplementary: 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ (180°)',
      vertical: 'ΚΑΤΑΚΟΡΥΦΗΝ (ΙΣΕΣ)'
    },
    lab1ExplClasPrefix: 'Η γωνία',
    lab1ExplClasMid: 'ταξινομείται ως',
    lab1ExplRight: 'Οι ημιευθείες Ox και Oy είναι κάθετες μεταξύ τους (Ox ⊥ Oy).',
    lab1ExplStraight: 'Οι ημιευθείες Ox και Oy είναι αντικείμενες και σχηματίζουν μία ενιαία ευθεία xy.',
    sec2Card1Badge: 'ΕΦΕΞΗΣ & ΔΙΑΔΟΧΙΚΕΣ',
    sec2Card1Title: 'Κοινή Πλευρά & Κορυφή',
    sec2Card1Text:
      'Δύο γωνίες λέγονται εφεξής όταν έχουν κοινή κορυφή, μία κοινή πλευρά και κανένα άλλο κοινό σημείο. Τρεις ή περισσότερες γωνίες λέγονται διαδοχικές όταν ανά δύο είναι εφεξής.',
    sec2Card2Badge: 'ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ',
    sec2Card2Title: 'Άθροισμα ＝ 90°',
    sec2Card2Text:
      'Δύο γωνίες ονομάζονται συμπληρωματικές όταν το άθροισμα των μέτρων τους ισούται με 90° (μία ορθή γωνία). Κάθε μία λέγεται συμπλήρωμα της άλλης.',
    sec2Card3Badge: 'ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ',
    sec2Card3Title: 'Άθροισμα ＝ 180°',
    sec2Card3Text:
      'Δύο γωνίες ονομάζονται παραπληρωματικές όταν το άθροισμα των μέτρων τους ισούται με 180° (μία ευθεία γωνία). Κάθε μία λέγεται παραπλήρωμα της άλλης.',
    sec2Card4Badge: 'ΚΑΤΑΚΟΡΥΦΗΝ',
    sec2Card4Title: 'Αντικείμενες Πλευρές',
    sec2Card4Text:
      'Δύο γωνίες λέγονται κατακορυφήν όταν οι πλευρές της μίας είναι αντικείμενες ημιευθείες των πλευρών της άλλης. Οι κατακορυφήν γωνίες είναι πάντα ίσες μεταξύ τους.',
    adjustAngleA: 'ΡΥΘΜΙΣΗ ΓΩΝΙΑΣ α',
    angleALabel: 'Γωνία α:',
    angleBLabel: 'Γωνία β:',
    sumLabel: 'Άθροισμα (α ＋ β):',
    verticalEqualLabel: 'Κατακορυφήν: α ＝ β ＝',
    alwaysEqualLabel: '(ΠΑΝΤΑ ΙΣΕΣ)',
    lab2ExplComp: 'είναι συμπληρωματικές: σχηματίζουν μαζί μία ορθή γωνία xÔz ＝ 90°.',
    lab2ExplSupp: 'είναι παραπληρωματικές: σχηματίζουν μία ευθεία γωνία xÔz ＝ 180°.',
    lab2ExplAdj: 'είναι εφεξής: έχουν κοινή κορυφή το O, κοινή πλευρά την Oy και δεν επικαλύπτονται.',
    lab2ExplVert: 'είναι κατακορυφήν: έχουν αντικείμενες πλευρές και μέτρο ακριβώς',
    sec3Badge: 'ΟΡΙΣΜΟΣ ΔΙΧΟΤΟΜΟΥ',
    sec3TitleDef: 'Χωρισμός Γωνίας σε 2 Ίσα Μέρη',
    sec3TextDef:
      'Διχοτόμος μιας γωνίας xÔy ονομάζεται η εσωτερική ημιευθεία Οδ που ξεκινά από την κορυφή Ο και χωρίζει τη γωνία σε δύο ίσες γωνίες:',
    mainAngleLabel: 'ΚΥΡΙΑ ΓΩΝΙΑ xÔy',
    initialAngleLabel: 'Αρχική Γωνία xÔy:',
    eachEqualPart: 'Κάθε ίσο τμήμα:',
    lab3ExplLead: 'Η ημιευθεία Οδ είναι η διχοτόμος: χωρίζει τη γωνία',
    lab3ExplEnd: 'σε δύο ακριβώς ίσες γωνίες',
    prob1Badge: 'ΠΡΟΒΛΗΜΑ 1: ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ & ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ ΓΩΝΙΕΣ',
    prob1Title: 'Κλίση Στέγης σε Βιοκλιματική Κατοικία',
    prob1Text:
      'Η κλίση μιας ηλιακής στέγης σχηματίζει με τον κατακόρυφο τοίχο μία οξεία γωνία ω ＝ 28°. 1) Να βρεθεί η συμπληρωματική της γωνία (η κλίση ως προς το οριζόντιο έδαφος). 2) Να βρεθεί η παραπληρωματική της γωνία.',
    solTitle: 'Αναλυτική Λύση:',
    prob1Step1: '1. Συμπλήρωμα: 90° － 28° ＝ 62° (κλίση προς το έδαφος).',
    prob1Step2: '2. Παραπλήρωμα: 180° － 28° ＝ 152°.',
    prob2Badge: 'ΠΡΟΒΛΗΜΑ 2: ΕΦΕΞΗΣ ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ & ΔΙΧΟΤΟΜΟΣ',
    prob2Title: 'Διαχωρισμός Ακτίνας Laser σε Οπτικό Εργαστήριο',
    prob2Text:
      'Δύο εφεξής γωνίες α και β είναι παραπληρωματικές (α ＋ β ＝ 180°). Αν η γωνία α είναι διπλάσια της β (α ＝ 2 · β) και χαράξουμε τη διχοτόμο δ της γωνίας α, ποιο είναι το μέτρο της γωνίας που σχηματίζει η διχοτόμος με την πλευρά της γωνίας β;',
    prob2Step1: '1. α ＋ β ＝ 180° ⇒ 2 · β ＋ β ＝ 3 · β ＝ 180°.',
    prob2Step2Lead: '2. Άρα β ＝ ',
    prob2Step2Mid: ' ＝ 60° και α ＝ 2 · 60° ＝ 120°.',
    prob2Step3Lead: '3. Η διχοτόμος χωρίζει την α σε δύο γωνίες: ',
    prob2Step3End: ' ＝ 60°.',
    prob2Step4: '4. Ζητούμενη γωνία: 60° (μισό της α) ＋ 60° (γωνία β) ＝ 120°.'
  },
  en: {
    pageTitle: 'Angles: Types, Comparison & Relations | Grade 7',
    pageDesc:
      'Concept of angle, types, comparison, adjacent, consecutive, complementary, supplementary, vertically opposite angles and bisector with interactive labs.',
    backText: 'Grade 7',
    btnExercises: 'EXERCISES',
    bannerBadge: 'GRADE 7 • GEOMETRY CHAPTER 02 • THEORY & LAB',
    bannerTitle: 'Angles: Types, Comparison & Relations',
    bannerSubtitle:
      'Interactively explore how angles are formed, their types (acute, right, obtuse, straight, etc.), adjacent and consecutive angles, special pairs, and angle bisectors.',
    sec1Title: 'Concept of Angle, Vertex, Sides & Angle Types',
    sec2Title: 'Angle Relations: Adjacent, Complementary, Supplementary & Vertically Opposite',
    sec3Title: 'Angle Bisector',
    sec4Title: 'Worked Examples & Problems',
    lab1Header: 'Lab 1: Interactive Protractor — Rotate ray Oy to see the resulting angle classification',
    lab2Header: 'Lab 2: Experiment with Angle Pairs (Adjacent, Complementary, Supplementary, Vertically Opposite)',
    lab3Header: 'Lab 3: Angle Bisector — Live Equal Division into 2 Halves',
    angleMeasure: 'ANGLE MEASURE',
    angleType: 'ANGLE TYPE',
    stepAdjust: 'STEP ADJUSTMENT & PRESETS',
    visProtractorHeader: 'PROTRACTOR VISUALIZATION (0° - 360°)',
    visRelationHeader: 'RELATION VISUALIZATION',
    visBisectorHeader: 'BISECTOR RAY Od',
    card1Badge: '1. DEFINITION OF ANGLE',
    card1Title: 'Vertex & Sides',
    card1Text:
      'An angle is the geometric figure formed by two rays Ox and Oy sharing a common endpoint O (vertex), together with the region of the plane they define. Denoted as: xÔy or simply Ô.',
    card2Badge: '2. RIGHT & STRAIGHT',
    card2Title: 'Reference Angles',
    card2Text:
      'A right angle measures 90° (perpendicular rays). A straight angle measures 180°, and its sides are opposite rays lying on the exact same straight line.',
    card3Badge: '3. ACUTE & OBTUSE',
    card3Title: 'Comparison with Right Angle',
    card3Text:
      'An acute angle is smaller than a right angle (0° ＜ x ＜ 90°). An obtuse angle is greater than a right angle and smaller than a straight angle (90° ＜ x ＜ 180°).',
    card4Badge: '4. REFLEX & FULL',
    card4Title: 'Angles Greater than 180°',
    card4Text:
      'A reflex angle measures between 180° and 360° (180° ＜ x ＜ 360°). A full angle measures 360° (a complete 360-degree rotation of the revolving side).',
    types: {
      zero: 'Zero Angle (0°)',
      acute: 'Acute Angle (0° ＜ x ＜ 90°)',
      right: 'Right Angle (90°)',
      obtuse: 'Obtuse Angle (90° ＜ x ＜ 180°)',
      straight: 'Straight Angle (180°)',
      reflex: 'Reflex Angle (180° ＜ x ＜ 360°)',
      full: 'Full Angle (360°)'
    },
    relModes: {
      adjacent: 'ADJACENT ANGLES',
      complementary: 'COMPLEMENTARY (90°)',
      supplementary: 'SUPPLEMENTARY (180°)',
      vertical: 'VERTICALLY OPPOSITE (CONGRUENT)'
    },
    lab1ExplClasPrefix: 'Angle',
    lab1ExplClasMid: 'is classified as',
    lab1ExplRight: 'Rays Ox and Oy are perpendicular to each other (Ox ⊥ Oy).',
    lab1ExplStraight: 'Rays Ox and Oy are opposite rays forming a single line xy.',
    sec2Card1Badge: 'ADJACENT & CONSECUTIVE',
    sec2Card1Title: 'Common Side & Vertex',
    sec2Card1Text:
      'Two angles are adjacent when they share a common vertex and a common side without overlapping. Three or more angles are consecutive when each pair in sequence is adjacent.',
    sec2Card2Badge: 'COMPLEMENTARY',
    sec2Card2Title: 'Sum ＝ 90°',
    sec2Card2Text:
      'Two angles are complementary when the sum of their measures equals 90° (one right angle). Each angle is the complement of the other.',
    sec2Card3Badge: 'SUPPLEMENTARY',
    sec2Card3Title: 'Sum ＝ 180°',
    sec2Card3Text:
      'Two angles are supplementary when the sum of their measures equals 180° (one straight angle). Each angle is the supplement of the other.',
    sec2Card4Badge: 'VERTICALLY OPPOSITE',
    sec2Card4Title: 'Opposite Rays',
    sec2Card4Text:
      'Two angles are vertically opposite when the sides of one are opposite rays to the sides of the other. Vertically opposite angles are always congruent (equal).',
    adjustAngleA: 'ADJUST ANGLE α',
    angleALabel: 'Angle α:',
    angleBLabel: 'Angle β:',
    sumLabel: 'Sum (α ＋ β):',
    verticalEqualLabel: 'Vertically opposite: α ＝ β ＝',
    alwaysEqualLabel: '(ALWAYS CONGRUENT)',
    lab2ExplComp: 'are complementary: together they form a right angle xÔz ＝ 90°.',
    lab2ExplSupp: 'are supplementary: together they form a straight angle xÔz ＝ 180°.',
    lab2ExplAdj: 'are adjacent: they share common vertex O and common ray Oy without overlapping.',
    lab2ExplVert: 'are vertically opposite: formed by opposite rays, each measuring exactly',
    sec3Badge: 'DEFINITION OF ANGLE BISECTOR',
    sec3TitleDef: 'Bisecting into 2 Equal Angles',
    sec3TextDef:
      'The bisector of an angle xÔy is the interior ray Od originating from vertex O that divides the angle into two equal halves:',
    mainAngleLabel: 'MAIN ANGLE xÔy',
    initialAngleLabel: 'Initial Angle xÔy:',
    eachEqualPart: 'Each congruent half:',
    lab3ExplLead: 'Ray Od is the angle bisector: it divides angle',
    lab3ExplEnd: 'into two exactly equal halves of',
    prob1Badge: 'PROBLEM 1: COMPLEMENTARY & SUPPLEMENTARY ANGLES',
    prob1Title: 'Solar Roof Pitch in a Bioclimatic House',
    prob1Text:
      'The pitch of a solar roof makes an acute angle ω ＝ 28° with the vertical wall. 1) Find its complementary angle (the tilt with respect to horizontal ground). 2) Find its supplementary angle.',
    solTitle: 'Step-by-Step Solution:',
    prob1Step1: '1. Complement: 90° － 28° ＝ 62° (tilt with respect to ground).',
    prob1Step2: '2. Supplement: 180° － 28° ＝ 152°.',
    prob2Badge: 'PROBLEM 2: ADJACENT SUPPLEMENTARY ANGLES & BISECTOR',
    prob2Title: 'Laser Beam Splitting in an Optical Lab',
    prob2Text:
      'Two adjacent angles α and β are supplementary (α ＋ β ＝ 180°). If angle α is twice angle β (α ＝ 2 · β) and we draw the bisector δ of angle α, what is the measure of the angle formed by bisector δ and the non-common side of angle β?',
    prob2Step1: '1. α ＋ β ＝ 180° ⇒ 2 · β ＋ β ＝ 3 · β ＝ 180°.',
    prob2Step2Lead: '2. Thus β ＝ ',
    prob2Step2Mid: ' ＝ 60° and α ＝ 2 · 60° ＝ 120°.',
    prob2Step3Lead: '3. The bisector divides α into two equal angles: ',
    prob2Step3End: ' ＝ 60°.',
    prob2Step4: '4. Required angle: 60° (half of α) ＋ 60° (angle β) ＝ 120°.'
  }
};

export default function GoneiesTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const curr = DICTIONARY[locale] || DICTIONARY.el;

  const formatNumber = (num) => {
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Μοιρογνώμονας & Είδη Γωνιών (0° - 360°)
  // --------------------------------------------------------------------------
  const [angleDeg, setAngleDeg] = useState(55);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Εφεξής, Συμπληρωματικές, Παραπληρωματικές & Κατακορυφήν
  // --------------------------------------------------------------------------
  const [relationMode, setRelationMode] = useState('complementary');
  const [angleA, setAngleA] = useState(35);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Διχοτόμος Γωνίας
  // --------------------------------------------------------------------------
  const [bisectMainAngle, setBisectMainAngle] = useState(70);

  // Stepper με πλήρη αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Βοηθητική συνάρτηση ταξινόμησης γωνίας για το Εργαστήριο 1
  const getAngleTypeInfo = (deg) => {
    if (deg === 0) return { name: curr.types.zero, color: 'text-slate-300' };
    if (deg > 0 && deg < 90) return { name: curr.types.acute, color: 'text-amber-400' };
    if (deg === 90) return { name: curr.types.right, color: 'text-emerald-400' };
    if (deg > 90 && deg < 180) return { name: curr.types.obtuse, color: 'text-sky-400' };
    if (deg === 180) return { name: curr.types.straight, color: 'text-indigo-400' };
    if (deg > 180 && deg < 360) return { name: curr.types.reflex, color: 'text-purple-400' };
    return { name: curr.types.full, color: 'text-rose-400' };
  };

  const angleTypeInfo = useMemo(() => getAngleTypeInfo(angleDeg), [angleDeg, locale, curr]);

  // Υπολογισμοί Εργαστηρίου 2: Γωνία Β ανάλογα με τη λειτουργία
  const angleB = useMemo(() => {
    if (relationMode === 'complementary') return Math.max(0, 90 - angleA);
    if (relationMode === 'supplementary') return Math.max(0, 180 - angleA);
    if (relationMode === 'vertical') return angleA;
    return 45; // 'adjacent'
  }, [relationMode, angleA]);

  const pairSum = useMemo(() => {
    if (relationMode === 'vertical') return null;
    return angleA + angleB;
  }, [relationMode, angleA, angleB]);

  // Helper για συντεταγμένες ακτίνας (κέντρο cx, cy, ακτίνα r, μοίρες deg)
  const getRayPoint = (cx, cy, r, deg) => {
    const rad = ((360 - deg) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const rayLab1 = useMemo(() => getRayPoint(240, 150, 110, angleDeg), [angleDeg]);
  const rayLab2_A = useMemo(() => getRayPoint(240, 150, 105, angleA), [angleA]);
  const rayLab2_B = useMemo(
    () => getRayPoint(240, 150, 105, relationMode === 'vertical' ? 180 : angleA + angleB),
    [angleA, angleB, relationMode]
  );
  const rayLab2_OppA = useMemo(() => getRayPoint(240, 150, 105, (angleA + 180) % 360), [angleA]);

  // Υπολογισμοί Εργαστηρίου 3 (Διχοτόμος)
  const bisectHalf = useMemo(() => bisectMainAngle / 2, [bisectMainAngle]);
  const rayBisectMain = useMemo(() => getRayPoint(240, 150, 110, bisectMainAngle), [bisectMainAngle]);
  const rayBisectMid = useMemo(() => getRayPoint(240, 150, 110, bisectHalf), [bisectHalf]);

  return (
    <Layout
      title={curr.pageTitle}
      description={curr.pageDesc}
      backUrl="/a-gymnasiou"
      backText={curr.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/36-goneies-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(curr.btnExercises)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 sm:py-10 space-y-10 sm:space-y-16 overflow-x-hidden box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50 min-w-0">
          <div className="max-w-4xl space-y-4 min-w-0">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(curr.bannerBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {curr.bannerTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {curr.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* ====================================================================
            1. ΕΝΝΟΙΑ ΓΩΝΙΑΣ, ΚΟΡΥΦΗ, ΠΛΕΥΡΕΣ & ΕΙΔΗ ΓΩΝΙΩΝ + ΕΡΓΑΣΤΗΡΙΟ 1
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{curr.sec1Title}</span>
            </h2>
          </div>

          {/* Κάρτες Θεωρίας Ενότητας 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700 min-w-0">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.card1Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.card2Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.card3Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.card4Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.card4Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.card4Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΜΟΙΡΟΓΝΩΜΟΝΑΣ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab1Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-w-0">
              {/* Χειριστήρια & Κατηγοριοποίηση (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.angleMeasure)}</span>
                    <span className="text-base font-mono font-black text-indigo-700">{formatNumber(angleDeg)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={angleDeg}
                    onChange={(e) => setAngleDeg(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Steppers & Presets */}
                <div className="space-y-2 min-w-0">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {toCleanUppercase(curr.stepAdjust)}
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-w-0">
                    {[-10, -1, 1, 10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={(e) => handleStep(setAngleDeg, step, 0, 360, e)}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 font-bold text-xs font-mono hover:bg-slate-100 active:scale-95"
                      >
                        {step > 0 ? `＋${formatNumber(step)}°` : `－${formatNumber(Math.abs(step))}°`}
                      </button>
                    ))}
                    {[0, 45, 90, 135, 180, 270, 360].map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => setAngleDeg(pVal)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all active:scale-95 ${
                          angleDeg === pVal
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {formatNumber(pVal)}°
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-1 min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {toCleanUppercase(curr.angleType)}
                  </span>
                  <div className="font-bold text-sm sm:text-base text-slate-900 break-words [overflow-wrap:anywhere]">
                    {angleTypeInfo.name}
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visProtractorHeader)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    xÔy ＝ {formatNumber(angleDeg)}°
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto max-h-[240px]">
                    {/* Κυκλικός οδηγός μοιρογνωμόνα */}
                    <circle cx="240" cy="150" r="110" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

                    {/* Βαθμονομημένες γραμμές κάθε 30° */}
                    {Array.from({ length: 12 }).map((_, idx) => {
                      const ang = idx * 30;
                      const ptInner = getRayPoint(240, 150, 103, ang);
                      const ptOuter = getRayPoint(240, 150, 110, ang);
                      return (
                        <line
                          key={ang}
                          x1={ptInner.x}
                          y1={ptInner.y}
                          x2={ptOuter.x}
                          y2={ptOuter.y}
                          stroke="#475569"
                          strokeWidth="1.5"
                        />
                      );
                    })}

                    {/* Σταθερή ημιευθεία Ox (δεξιά, 0°) */}
                    <line x1="240" y1="150" x2="365" y2="150" stroke="#94a3b8" strokeWidth="3.5" />
                    <circle cx="365" cy="150" r="4" fill="#94a3b8" />
                    <text x="378" y="154" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Κινούμενη ημιευθεία Oy */}
                    <line x1="240" y1="150" x2={rayLab1.x} y2={rayLab1.y} stroke="#f59e0b" strokeWidth="4" />
                    <circle cx={rayLab1.x} cy={rayLab1.y} r="5" fill="#f59e0b" />
                    <text x={rayLab1.x + 8} y={rayLab1.y + 4} fill="#fde68a" fontSize="13" fontWeight="bold">y</text>

                    {/* Τόξο γωνίας */}
                    {angleDeg > 0 && angleDeg < 360 && (
                      <path
                        d={`M 275 150 A 35 35 0 ${angleDeg > 180 ? 1 : 0} 0 ${
                          240 + 35 * Math.cos(((360 - angleDeg) * Math.PI) / 180)
                        } ${150 + 35 * Math.sin(((360 - angleDeg) * Math.PI) / 180)}`}
                        fill="rgba(245, 158, 11, 0.2)"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />
                    )}

                    {/* Κορυφή O */}
                    <circle cx="240" cy="150" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="240" y="174" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {curr.lab1ExplClasPrefix} <strong>xÔy ({formatNumber(angleDeg)}°)</strong> {curr.lab1ExplClasMid} <strong className={angleTypeInfo.color}>{angleTypeInfo.name}</strong>.
                  {angleDeg === 90 && ` ${curr.lab1ExplRight}`}
                  {angleDeg === 180 && ` ${curr.lab1ExplStraight}`}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΣΧΕΣΕΙΣ ΓΩΝΙΩΝ & ΕΡΓΑΣΤΗΡΙΟ 2 (ΕΦΕΞΗΣ, ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ, ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ, ΚΑΤΑΚΟΡΥΦΗΝ)
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{curr.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700 min-w-0">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card1Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card2Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card3Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card4Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card4Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card4Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΖΕΥΓΩΝ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab2Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
              {/* Χειριστήρια & Επιλογή Mode (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                  {[
                    { id: 'complementary', label: curr.relModes.complementary },
                    { id: 'supplementary', label: curr.relModes.supplementary },
                    { id: 'adjacent', label: curr.relModes.adjacent },
                    { id: 'vertical', label: curr.relModes.vertical }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setRelationMode(m.id);
                        if (m.id === 'complementary' && angleA >= 90) setAngleA(40);
                      }}
                      className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                        relationMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {toCleanUppercase(m.label)}
                    </button>
                  ))}
                </div>

                {/* Ρύθμιση Γωνίας Α */}
                <div className="space-y-2 pt-2 border-t border-slate-200 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.adjustAngleA)}</span>
                    <span className="font-mono font-black text-amber-700 text-sm">{formatNumber(angleA)}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max={relationMode === 'complementary' ? 85 : relationMode === 'supplementary' ? 175 : 160}
                    step="1"
                    value={angleA}
                    onChange={(e) => setAngleA(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
                    {[-5, -1, 1, 5].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={(e) =>
                          handleStep(
                            setAngleA,
                            step,
                            5,
                            relationMode === 'complementary' ? 85 : relationMode === 'supplementary' ? 175 : 160,
                            e
                          )
                        }
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                      >
                        {step > 0 ? `＋${formatNumber(step)}°` : `－${formatNumber(Math.abs(step))}°`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    • <strong>{curr.angleALabel}</strong> {formatNumber(angleA)}°
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    • <strong>{curr.angleBLabel}</strong> {formatNumber(angleB)}°
                  </div>
                  {pairSum !== null && (
                    <div className="font-bold text-indigo-700 pt-0.5 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                      • {curr.sumLabel} {formatNumber(angleA)} ＋ {formatNumber(angleB)} ＝ {formatNumber(pairSum)}°
                    </div>
                  )}
                  {relationMode === 'vertical' && (
                    <div className="font-bold text-emerald-700 pt-0.5 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                      • {curr.verticalEqualLabel} {formatNumber(angleA)}° {curr.alwaysEqualLabel}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic SVG Ζεύγους (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visRelationHeader)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    {relationMode === 'complementary' && toCleanUppercase(curr.relModes.complementary)}
                    {relationMode === 'supplementary' && toCleanUppercase(curr.relModes.supplementary)}
                    {relationMode === 'adjacent' && toCleanUppercase(curr.relModes.adjacent)}
                    {relationMode === 'vertical' && toCleanUppercase(curr.relModes.vertical)}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto max-h-[240px]">
                    {/* Αρχική πλευρά Ox (οριζόντια, 0°) */}
                    <line x1="240" y1="150" x2="355" y2="150" stroke="#94a3b8" strokeWidth="3" />
                    <circle cx="355" cy="150" r="4" fill="#94a3b8" />
                    <text x="368" y="154" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Ενδιάμεση κοινή πλευρά Oy */}
                    <line x1="240" y1="150" x2={rayLab2_A.x} y2={rayLab2_A.y} stroke="#f59e0b" strokeWidth="3.5" />
                    <circle cx={rayLab2_A.x} cy={rayLab2_A.y} r="4.5" fill="#f59e0b" />
                    <text x={rayLab2_A.x + 8} y={rayLab2_A.y} fill="#fde68a" fontSize="13" fontWeight="bold">y</text>

                    {/* Τρίτη πλευρά Oz */}
                    <line x1="240" y1="150" x2={rayLab2_B.x} y2={rayLab2_B.y} stroke="#38bdf8" strokeWidth="3.5" />
                    <circle cx={rayLab2_B.x} cy={rayLab2_B.y} r="4.5" fill="#38bdf8" />
                    <text x={rayLab2_B.x - 12} y={rayLab2_B.y} fill="#38bdf8" fontSize="13" fontWeight="bold">z</text>

                    {/* Αντικείμενη ακτίνα για κατακορυφήν */}
                    {relationMode === 'vertical' && (
                      <g>
                        <line x1="240" y1="150" x2={rayLab2_OppA.x} y2={rayLab2_OppA.y} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="4 3" />
                        <text x={rayLab2_OppA.x - 12} y={rayLab2_OppA.y + 12} fill="#fde68a" fontSize="12">y'</text>
                        <line x1="240" y1="150" x2="125" y2="150" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="4 3" />
                        <text x={110} y={154} fill="#94a3b8" fontSize="12">x'</text>
                      </g>
                    )}

                    {/* Κορυφή O */}
                    <circle cx="240" cy="150" r="6" fill="#ffffff" />
                    <text x="240" y="174" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {relationMode === 'complementary' && (
                    <div>
                      {curr.angleALabel} <strong>α ({formatNumber(angleA)}°)</strong> {locale === 'el' ? 'και' : 'and'}{' '}
                      <strong>β ({formatNumber(angleB)}°)</strong> {curr.lab2ExplComp}
                    </div>
                  )}
                  {relationMode === 'supplementary' && (
                    <div>
                      {curr.angleALabel} <strong>α ({formatNumber(angleA)}°)</strong> {locale === 'el' ? 'και' : 'and'}{' '}
                      <strong>β ({formatNumber(angleB)}°)</strong> {curr.lab2ExplSupp}
                    </div>
                  )}
                  {relationMode === 'adjacent' && (
                    <div>
                      <strong>xÔy ({formatNumber(angleA)}°)</strong> {locale === 'el' ? 'και' : 'and'}{' '}
                      <strong>yÔz ({formatNumber(angleB)}°)</strong> {curr.lab2ExplAdj}
                    </div>
                  )}
                  {relationMode === 'vertical' && (
                    <div>
                      <strong>xÔy</strong> {locale === 'el' ? 'και' : 'and'} <strong>x'Ôy'</strong> {curr.lab2ExplVert}{' '}
                      <strong>{formatNumber(angleA)}°</strong>.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΔΙΧΟΤΟΜΟΣ ΓΩΝΙΑΣ & ΕΡΓΑΣΤΗΡΙΟ 3
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{curr.sec3Title}</span>
            </h2>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
              {toCleanUppercase(curr.sec3Badge)}
            </span>
            <h3 className="font-bold text-slate-900 text-base">{curr.sec3TitleDef}</h3>
            <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
              {curr.sec3TextDef}
            </p>
            <div className="p-2 bg-white rounded-xl border border-indigo-200 font-mono text-center font-bold text-indigo-950 inline-flex flex-wrap items-center justify-center max-w-md mx-auto gap-1">
              <span>xÔδ ＝ δÔy ＝ </span>
              <Frac num="xÔy" den="2" />
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΙΑΔΡΑΣΤΙΚΗ ΔΙΧΟΤΟΜΟΣ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab3Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-w-0">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.mainAngleLabel)}</span>
                    <span className="text-base font-mono font-black text-indigo-700">{formatNumber(bisectMainAngle)}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="180"
                    step="2"
                    value={bisectMainAngle}
                    onChange={(e) => setBisectMainAngle(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {[-10, -2, 2, 10].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={(e) => handleStep(setBisectMainAngle, step, 10, 180, e)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {step > 0 ? `＋${formatNumber(step)}°` : `－${formatNumber(Math.abs(step))}°`}
                    </button>
                  ))}
                  {[60, 90, 120].map((pVal) => (
                    <button
                      key={pVal}
                      type="button"
                      onClick={() => setBisectMainAngle(pVal)}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {formatNumber(pVal)}°
                    </button>
                  ))}
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    • <strong>{curr.initialAngleLabel}</strong> {formatNumber(bisectMainAngle)}°
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-1 max-w-full">
                    <span>• <strong>{curr.eachEqualPart}</strong> </span>
                    <Frac num={formatNumber(bisectMainAngle)} den="2" />
                    <span> ＝ <strong>{formatNumber(bisectHalf)}°</strong></span>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visBisectorHeader)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    xÔδ ＝ δÔy ＝ {formatNumber(bisectHalf)}°
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto max-h-[240px]">
                    {/* Πλευρά Ox */}
                    <line x1="240" y1="150" x2="365" y2="150" stroke="#94a3b8" strokeWidth="3" />
                    <text x="375" y="154" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    {/* Πλευρά Oy */}
                    <line x1="240" y1="150" x2={rayBisectMain.x} y2={rayBisectMain.y} stroke="#38bdf8" strokeWidth="3" />
                    <text x={rayBisectMain.x + 8} y={rayBisectMain.y} fill="#38bdf8" fontSize="13" fontWeight="bold">y</text>

                    {/* Διχοτόμος Οδ (διακεκομμένη πράσινη) */}
                    <line
                      x1="240"
                      y1="150"
                      x2={rayBisectMid.x}
                      y2={rayBisectMid.y}
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeDasharray="5 4"
                    />
                    <circle cx={rayBisectMid.x} cy={rayBisectMid.y} r="5" fill="#10b981" />
                    <text x={rayBisectMid.x + 8} y={rayBisectMid.y} fill="#6ee7b7" fontSize="13" fontWeight="bold">δ</text>

                    {/* Κορυφή O */}
                    <circle cx="240" cy="150" r="6" fill="#ffffff" />
                    <text x="240" y="174" fill="#ffffff" fontSize="14" fontWeight="bold" textAnchor="middle">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {curr.lab3ExplLead} <strong>xÔy ({formatNumber(bisectMainAngle)}°)</strong> {curr.lab3ExplEnd}{' '}
                  <strong>{formatNumber(bisectHalf)}°</strong>.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΠΡΟΒΛΗΜΑΤΑ
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{curr.sec4Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed min-w-0">
            {/* Πρόβλημα 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.prob1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words [overflow-wrap:anywhere]">
                {curr.prob1Title}
              </h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.prob1Text}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800 min-w-0">
                <div className="font-sans font-bold text-indigo-950">{curr.solTitle}</div>
                <div className="break-words [overflow-wrap:anywhere]">{curr.prob1Step1}</div>
                <div className="text-emerald-700 font-bold break-words [overflow-wrap:anywhere]">
                  {curr.prob1Step2}
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.prob2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words [overflow-wrap:anywhere]">
                {curr.prob2Title}
              </h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.prob2Text}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800 min-w-0">
                <div className="font-sans font-bold text-amber-950">{curr.solTitle}</div>
                <div className="break-words [overflow-wrap:anywhere]">{curr.prob2Step1}</div>
                <div className="inline-flex flex-wrap items-center gap-1 max-w-full">
                  <span>{curr.prob2Step2Lead}</span>
                  <Frac num="180°" den="3" />
                  <span>{curr.prob2Step2Mid}</span>
                </div>
                <div className="inline-flex flex-wrap items-center gap-1 max-w-full">
                  <span>{curr.prob2Step3Lead}</span>
                  <Frac num="120°" den="2" />
                  <span>{curr.prob2Step3End}</span>
                </div>
                <div className="text-emerald-700 font-bold break-words [overflow-wrap:anywhere]">
                  {curr.prob2Step4}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
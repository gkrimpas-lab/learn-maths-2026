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
    pageTitle: "Μεσοκάθετος, Αποστάσεις & Τρίγωνα | Α' Γυμνασίου",
    pageDesc:
      'Μεσοκάθετος ευθυγράμμου τμήματος, απόσταση σημείου από ευθεία, απόσταση παραλλήλων, ιδιότητα διχοτόμου, ισοσκελές και ισόπλευρο τρίγωνο.',
    backText: "Α' Γυμνασίου",
    btnExercises: 'ΑΣΚΗΣΕΙΣ',
    bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 03 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    bannerTitle: 'Μεσοκάθετος, Αποστάσεις, Διχοτόμος & Τρίγωνα',
    bannerSubtitle:
      'Ανακάλυψε διαδραστικά τη μεσοκάθετο και την ιδιότητα των σημείων της, τη συντομότερη απόσταση σημείου από ευθεία, την ισαπόσταση της διχοτόμου, καθώς και τις ιδιότητες του ισοσκελούς και ισόπλευρου τριγώνου.',

    // Section 1
    sec1Title: '1. Μεσοκάθετος Ευθυγράμμου Τμήματος',
    sec1Card1Badge: 'ΟΡΙΣΜΟΣ ΜΕΣΟΚΑΘΕΤΟΥ',
    sec1Card1Title: 'Κάθετη στο Μέσο',
    sec1Card1Text:
      'Μεσοκάθετος ενός ευθύγραμμου τμήματος ΑΒ ονομάζεται η ευθεία (ε) που είναι κάθετη στο τμήμα ΑΒ και διέρχεται από το μέσο Μ του.',
    sec1Card2Badge: 'ΧΑΡΑΚΤΗΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ',
    sec1Card2Title: 'Ισαπόσταση από τα Άκρα',
    sec1Card2Text:
      'Κάθε σημείο της μεσοκαθέτου ενός ευθύγραμμου τμήματος ισαπέχει από τα άκρα του:',
    sec1Card3Badge: 'ΑΝΤΙΣΤΡΟΦΗ ΙΔΙΟΤΗΤΑ',
    sec1Card3Title: 'Γεωμετρικός Τόπος',
    sec1Card3Text:
      'Αντίστροφα, αν ένα σημείο Σ ισαπέχει από τα άκρα Α και Β ενός τμήματος (δηλαδή ΣΑ ＝ ΣΒ), τότε το σημείο αυτό ανήκει υποχρεωτικά στη μεσοκάθετο του ΑΒ.',
    lab1Header: 'Εργαστήριο 1: Κίνησε το σημείο Μ πάνω στη μεσοκάθετο και δες την ισαπόσταση ΜΑ ＝ ΜΒ',
    lblPointMY: 'ΘΕΣΗ ΣΗΜΕΙΟΥ Μ (ΥΨΟΣ)',
    midpointBtn: 'Μέσο (0 cm)',
    segABInfo: '• Τμήμα ΑΒ ＝ 16,0 cm (Μέσο Ο: ΟΑ ＝ ΟΒ ＝ 8,0 cm)',
    distMALabel: '• Απόσταση ΜΑ ＝',
    distMBLabel: '• Απόσταση ΜΒ ＝',
    alwaysEqualMA_MB: 'Ισχύει πάντα: ΜΑ ＝ ΜΒ!',
    visLab1Header: 'ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕΣΟΚΑΘΕΤΟΥ',
    perpBisectorLineLabel: 'ε (μεσοκάθετος)',
    lab1ExplNote: 'Όπου κι αν τοποθετηθεί το σημείο Μ πάνω στη μεσοκάθετο, το τρίγωνο ΜΑΒ παραμένει πάντοτε ισοσκελές με ίσες πλευρές ΜΑ και ΜΒ!',

    // Section 2
    sec2Title: '2. Απόσταση Σημείου από Ευθεία & Απόσταση Παραλλήλων Ευθειών',
    sec2Card1Badge: 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ',
    sec2Card1Title: 'Το Κάθετο Τμήμα είναι το Συντομότερο',
    sec2Card1Text:
      'Απόσταση ενός σημείου Α από μια ευθεία ε ονομάζεται το μήκος του κάθετου ευθύγραμμου τμήματος ΑΗ που φέρνουμε από το Α προς την ε.',
    sec2Card1Box: 'ΑΗ ＜ ΑΒ (για κάθε πλάγιο σημείο Β της ευθείας ε)',
    sec2Card2Badge: 'ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ',
    sec2Card2Title: 'Σταθερό Πλάτος Παντού',
    sec2Card2Text:
      'Απόσταση δύο παράλληλων ευθειών ε₁ και ε₂ ονομάζεται η απόσταση οποιουδήποτε σημείου της μίας από την άλλη. Το κοινό κάθετο τμήμα έχει το ίδιο ακριβώς μήκος σε όλα τα σημεία τους.',
    lab2Header: 'Εργαστήριο 2: Κάθετη Απόσταση (Συντομότερη Οδός) & Απόσταση Παραλλήλων',
    distModes: {
      pointToLine: 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ',
      parallels: 'ΑΠΟΣΤΑΣΗ 2 ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ',
    },
    lblPerpDistAH: 'ΚΑΘΕΤΗ ΑΠΟΣΤΑΣΗ ΑΗ',
    lblObliquePosB: 'ΘΕΣΗ ΠΛΑΓΙΟΥ ΣΗΜΕΙΟΥ Β',
    perpSegLabel: '• Κάθετο Τμήμα ΑΗ:',
    obliqueSegLabel: '• Πλάγιο Τμήμα ΑΒ:',
    visLab2Header: 'ΑΠΕΙΚΟΝΙΣΗ ΑΠΟΣΤΑΣΗΣ',
    lab2ExplPointToLine: 'Το κάθετο τμήμα ΑΗ είναι η συντομότερη απόσταση από το σημείο Α στην ευθεία ε. Οποιοδήποτε άλλο σημείο Β της ευθείας απέχει περισσότερο (ΑΒ ＞ ΑΗ).',
    lab2ExplParallels: 'Η απόσταση μεταξύ δύο παράλληλων ευθειών είναι παντού η ίδια, όποιο σημείο κι αν επιλέξουμε για να φέρουμε την κάθετο.',
    parallelsConstantInfoLead: 'Η απόσταση των ε₁ και ε₂ παραμένει σταθερά',
    parallelsConstantInfoEnd: 'σε όλο το μήκος τους!',

    // Section 3
    sec3Title: '3. Χαρακτηριστική Ιδιότητα της Διχοτόμου Γωνίας',
    sec3Badge: 'ΘΕΩΡΗΜΑ ΔΙΧΟΤΟΜΟΥ',
    sec3TitleDef: 'Ισαπόσταση από τις Πλευρές της Γωνίας',
    sec3TextDef:
      'Κάθε σημείο Σ της διχοτόμου μιας γωνίας ισαπέχει από τις πλευρές της. Αν φέρουμε από το Σ τις κάθετες ΣΗ₁ και ΣΗ₂ στις πλευρές Ox και Oy, ισχύει πάντα:',
    lab3Header: 'Εργαστήριο 3: Κάθε σημείο της Διχοτόμου ισαπέχει από τις πλευρές της γωνίας',
    lblPosS: 'ΘΕΣΗ ΣΗΜΕΙΟΥ Σ ΠΑΝΩ ΣΤΗ ΔΙΧΟΤΟΜΟ',
    lblAngleAperture: 'ΑΝΟΙΓΜΑ ΓΩΝΙΑΣ xÔy',
    angleInfoLead: '• Γωνία xÔy ＝',
    angleInfoMid: '(Διχοτόμος στις',
    distSH1Label: '• Απόσταση ΣΗ₁ (από πλευρά Ox):',
    distSH2Label: '• Απόσταση ΣΗ₂ (από πλευρά Oy):',
    bisectorLocusText: 'ΣΗ₁ ＝ ΣΗ₂ (Η διχοτόμος είναι ο γεωμετρικός τόπος των σημείων που ισαπέχουν από τις πλευρές)',
    visLab3Header: 'ΟΠΤΙΚΟΠΟΙΗΣΗ ΔΙΧΟΤΟΜΟΥ & ΚΑΘΕΤΩΝ',
    lab3ExplNote: 'Τα δύο ορθογώνια τρίγωνα που σχηματίζονται εκατέρωθεν της διχοτόμου είναι ίσα, επιβεβαιώνοντας ότι ΣΗ₁ ＝ ΣΗ₂.',

    // Section 4
    sec4Title: '4. Ισοσκελές & Ισόπλευρο Τρίγωνο',
    sec4Card1Badge: 'ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ',
    sec4Card1Title: 'Δύο Ίσες Πλευρές & Ίσες Γωνίες Βάσης',
    sec4Card1Text: 'Ισοσκελές λέγεται το τρίγωνο που έχει δύο πλευρές ίσες (ΑΒ ＝ ΑΓ).',
    sec4Card1Li1: 'Οι γωνίες της βάσης είναι ίσες: Β̂ ＝ Γ̂.',
    sec4Card1Li2: 'Η διχοτόμος της γωνίας κορυφής είναι ταυτόχρονα διάμεσος, ύψος και μεσοκάθετος της βάσης.',
    sec4Card1Li3: 'Έχει 1 άξονα συμμετρίας (τη μεσοκάθετο της βάσης).',
    sec4Card2Badge: 'ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ',
    sec4Card2Title: 'Τρεις Ίσες Πλευρές & Όλες οι Γωνίες 60°',
    sec4Card2Text: 'Ισόπλευρο λέγεται το τρίγωνο που έχει και τις τρεις πλευρές του ίσες (ΑΒ ＝ ΒΓ ＝ ΓΑ).',
    sec4Card2Li1: 'Όλες οι γωνίες του είναι ίσες μεταξύ τους και ισούνται με 60° (180° : 3).',
    sec4Card2Li2: 'Κάθε ύψος είναι ταυτόχρονα διάμεσος, διχοτόμος και μεσοκάθετος.',
    sec4Card2Li3: 'Έχει 3 άξονες συμμετρίας.',
    lab4Header: 'Εργαστήριο 4: Ισοσκελές vs Ισόπλευρο Τρίγωνο — Γωνίες, Πλευρές & Άξονας Συμμετρίας',
    triModes: {
      isosceles: 'ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ',
      equilateral: 'ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ',
    },
    lblVertexAngle: 'ΓΩΝΙΑ ΚΟΡΥΦΗΣ Â',
    vertexAngleInfo: '• Γωνία Κορυφής Â ＝',
    baseAnglesInfo: '• Γωνίες Βάσης: Β̂ ＝ Γ̂ ＝',
    symmetryAxesInfo: '• Άξονες Συμμετρίας:',
    symmetryAxesIsosceles: '1 (η μεσοκάθετος της βάσης)',
    symmetryAxesEquilateral: '3',
    visLab4Header: 'ΑΠΕΙΚΟΝΙΣΗ ΤΡΙΓΩΝΟΥ & ΑΞΟΝΑ ΣΥΜΜΕΤΡΙΑΣ',
    lab4ExplNote:
      'Στο ισοσκελές τρίγωνο ΑΒΓ, ο άξονας συμμετρίας ταυτίζει τέσσερις θεμελιώδεις γραμμές: είναι ταυτόχρονα μεσοκάθετος της βάσης, ύψος, διάμεσος και διχοτόμος της γωνίας κορυφής!',

    // Section 5
    sec5Title: '5. Λυμένα Παραδείγματα & Προβλήματα',
    prob1Badge: 'ΠΡΟΒΛΗΜΑ 1: ΜΕΣΟΚΑΘΕΤΟΣ ΣΤΗΝ ΠΡΑΞΗ',
    prob1Title: 'Εγκατάσταση Κεραίας Κινητής Τηλεφωνίας',
    prob1Text:
      'Δύο οικισμοί Α και Β απέχουν μεταξύ τους 12 km. Μια εταιρεία τηλεπικοινωνιών θέλει να τοποθετήσει έναν σταθμό αναμετάδοσης Σ πάνω σε έναν ευθύγραμμο δρόμο ε, έτσι ώστε ο σταθμός να ισαπέχει ακριβώς από τους δύο οικισμούς (ΣΑ ＝ ΣΒ). Πώς θα προσδιοριστεί η ακριβής θέση του σταθμού;',
    solTitle: 'Αναλυτική Λύση:',
    prob1Step1:
      '1. Σύμφωνα με τη χαρακτηριστική ιδιότητα, όλα τα σημεία που ισαπέχουν από τα Α και Β ανήκουν στη μεσοκάθετο του τμήματος ΑΒ.',
    prob1Step2:
      '2. Κατασκευάζουμε τη μεσοκάθετο (μ) του τμήματος ΑΒ (κάθετη στο μέσο Μ, όπου ΑΜ ＝ 6 km).',
    prob1Step3:
      '3. Η ακριβής θέση του σταθμού Σ είναι το σημείο τομής της μεσοκαθέτου (μ) με τον δρόμο (ε)!',
    prob2Badge: 'ΠΡΟΒΛΗΜΑ 2: ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ & ΓΩΝΙΕΣ',
    prob2Title: 'Τριγωνικό Πλαίσιο Στέγης',
    prob2Text:
      'Σε ένα ισοσκελές τριγωνικό πλαίσιο στέγης ΑΒΓ (ΑΒ ＝ ΑΓ), η γωνία κορυφής είναι Â ＝ 44°. 1) Πόσο είναι το μέτρο των γωνιών βάσης Β̂ και Γ̂; 2) Αν φέρουμε το ύψος ΑΔ, πόσο είναι η γωνία ΒÂΔ;',
    prob2Step1: '1. Το άθροισμα των γωνιών είναι 180°: Â ＋ Β̂ ＋ Γ̂ ＝ 180°.',
    prob2Step2Lead: '2. Επειδή Β̂ ＝ Γ̂: Β̂ ＝ ',
    prob2Step3Lead: '3. Το ύψος ΑΔ είναι και διχοτόμος της Â, άρα ΒÂΔ ＝ ',
  },
  en: {
    pageTitle: 'Perpendicular Bisector, Distances & Triangles | Grade 7',
    pageDesc:
      'Perpendicular bisector of a segment, distance from point to line, distance between parallel lines, bisector property, isosceles and equilateral triangles.',
    backText: 'Grade 7',
    btnExercises: 'EXERCISES',
    bannerBadge: 'GRADE 7 • GEOMETRY CHAPTER 03 • THEORY & LAB',
    bannerTitle: 'Perpendicular Bisector, Distances, Bisector & Triangles',
    bannerSubtitle:
      'Interactively explore the perpendicular bisector and its equidistant property, shortest distance from point to line, angle bisector properties, and isosceles & equilateral triangles.',

    // Section 1
    sec1Title: '1. Perpendicular Bisector of a Line Segment',
    sec1Card1Badge: 'DEFINITION OF PERPENDICULAR BISECTOR',
    sec1Card1Title: 'Perpendicular at the Midpoint',
    sec1Card1Text:
      'The perpendicular bisector of a line segment AB is the straight line (l) perpendicular to segment AB passing through its midpoint M.',
    sec1Card2Badge: 'CHARACTERISTIC PROPERTY',
    sec1Card2Title: 'Equidistant from Endpoints',
    sec1Card2Text:
      'Every point on the perpendicular bisector of a line segment is equidistant from its endpoints:',
    sec1Card3Badge: 'CONVERSE PROPERTY',
    sec1Card3Title: 'Geometric Locus',
    sec1Card3Text:
      'Conversely, if a point P is equidistant from endpoints A and B (PA ＝ PB), then P necessarily lies on the perpendicular bisector of AB.',
    lab1Header: 'Lab 1: Move point M along the perpendicular bisector to observe MA ＝ MB',
    lblPointMY: 'POINT M POSITION (HEIGHT)',
    midpointBtn: 'Midpoint (0 cm)',
    segABInfo: '• Segment AB ＝ 16.0 cm (Midpoint O: OA ＝ OB ＝ 8.0 cm)',
    distMALabel: '• Distance MA ＝',
    distMBLabel: '• Distance MB ＝',
    alwaysEqualMA_MB: 'Always holds: MA ＝ MB!',
    visLab1Header: 'PERPENDICULAR BISECTOR VISUALIZATION',
    perpBisectorLineLabel: 'l (perpendicular bisector)',
    lab1ExplNote: 'Wherever point M is placed along the perpendicular bisector, triangle MAB remains strictly isosceles with MA ＝ MB!',

    // Section 2
    sec2Title: '2. Distance from a Point to a Line & Distance between Parallel Lines',
    sec2Card1Badge: 'DISTANCE FROM POINT TO LINE',
    sec2Card1Title: 'The Perpendicular Segment is Shortest',
    sec2Card1Text:
      'The distance of a point A from a straight line l is the length of the perpendicular segment AH drawn from A onto l.',
    sec2Card1Box: 'AH ＜ AB (for any oblique point B on line l)',
    sec2Card2Badge: 'DISTANCE BETWEEN PARALLEL LINES',
    sec2Card2Title: 'Constant Width Everywhere',
    sec2Card2Text:
      'The distance between two parallel lines l₁ and l₂ is the distance from any point on one line to the other. The perpendicular segment measures the exact same length everywhere.',
    lab2Header: 'Lab 2: Perpendicular Distance (Shortest Path) & Parallel Lines Distance',
    distModes: {
      pointToLine: 'POINT TO LINE DISTANCE',
      parallels: 'DISTANCE BETWEEN PARALLELS',
    },
    lblPerpDistAH: 'PERPENDICULAR DISTANCE AH',
    lblObliquePosB: 'POSITION OF OBLIQUE POINT B',
    perpSegLabel: '• Perpendicular Segment AH:',
    obliqueSegLabel: '• Oblique Segment AB:',
    visLab2Header: 'DISTANCE VISUALIZATION',
    lab2ExplPointToLine: 'The perpendicular segment AH is the shortest distance from point A to line l. Any other point B on the line lies strictly farther away (AB ＞ AH).',
    lab2ExplParallels: 'The distance between two parallel lines is constant everywhere, regardless of where the perpendicular is constructed.',
    parallelsConstantInfoLead: 'The distance between l₁ and l₂ remains constant at',
    parallelsConstantInfoEnd: 'along their entire length!',

    // Section 3
    sec3Title: '3. Equidistant Property of the Angle Bisector',
    sec3Badge: 'ANGLE BISECTOR THEOREM',
    sec3TitleDef: 'Equidistant from the Angle Sides',
    sec3TextDef:
      'Every point P on the bisector of an angle is equidistant from the sides of the angle. Drawing perpendiculars PH₁ and PH₂ to rays Ox and Oy, it always holds:',
    lab3Header: 'Lab 3: Every point on the Angle Bisector is equidistant from the sides',
    lblPosS: 'POINT P POSITION ALONG BISECTOR',
    lblAngleAperture: 'ANGLE xÔy APERTURE',
    angleInfoLead: '• Angle xÔy ＝',
    angleInfoMid: '(Bisector at',
    distSH1Label: '• Distance PH₁ (from ray Ox):',
    distSH2Label: '• Distance PH₂ (from ray Oy):',
    bisectorLocusText: 'PH₁ ＝ PH₂ (The bisector is the geometric locus of points equidistant from the sides of the angle)',
    visLab3Header: 'ANGLE BISECTOR & PERPENDICULARS VISUALIZATION',
    lab3ExplNote: 'The two right triangles formed on either side of the bisector are congruent, verifying that PH₁ ＝ PH₂.',

    // Section 4
    sec4Title: '4. Isosceles & Equilateral Triangles',
    sec4Card1Badge: 'ISOSCELES TRIANGLE',
    sec4Card1Title: 'Two Congruent Sides & Base Angles',
    sec4Card1Text: 'An isosceles triangle has two equal sides (AB ＝ AC).',
    sec4Card1Li1: 'The base angles are equal: B̂ ＝ Ĉ.',
    sec4Card1Li2: 'The bisector of the vertex angle coincides with the median, altitude, and perpendicular bisector of the base.',
    sec4Card1Li3: 'It has 1 line of symmetry (the perpendicular bisector of the base).',
    sec4Card2Badge: 'EQUILATERAL TRIANGLE',
    sec4Card2Title: 'Three Equal Sides & All Angles 60°',
    sec4Card2Text: 'An equilateral triangle has all three sides equal (AB ＝ BC ＝ CA).',
    sec4Card2Li1: 'All interior angles are equal, measuring 60° (180° : 3).',
    sec4Card2Li2: 'Every altitude is simultaneously a median, angle bisector, and perpendicular bisector.',
    sec4Card2Li3: 'It has 3 lines of symmetry.',
    lab4Header: 'Lab 4: Isosceles vs Equilateral Triangle — Angles, Sides & Axis of Symmetry',
    triModes: {
      isosceles: 'ISOSCELES TRIANGLE',
      equilateral: 'EQUILATERAL TRIANGLE',
    },
    lblVertexAngle: 'VERTEX ANGLE Â',
    vertexAngleInfo: '• Vertex Angle Â ＝',
    baseAnglesInfo: '• Base Angles: B̂ ＝ Ĉ ＝',
    symmetryAxesInfo: '• Lines of Symmetry:',
    symmetryAxesIsosceles: '1 (the perpendicular bisector of the base)',
    symmetryAxesEquilateral: '3',
    visLab4Header: 'TRIANGLE & SYMMETRY AXIS VISUALIZATION',
    lab4ExplNote:
      'In an isosceles triangle ABC, the axis of symmetry unifies four fundamental lines: altitude, median, angle bisector of the apex, and perpendicular bisector of the base!',

    // Section 5
    sec5Title: '5. Worked Examples & Problems',
    prob1Badge: 'PROBLEM 1: PERPENDICULAR BISECTOR IN PRACTICE',
    prob1Title: 'Cell Tower Installation',
    prob1Text:
      'Two settlements A and B are 12 km apart. A telecommunications company wants to install a relay station S on a straight road l so that the station is equidistant from both settlements (SA ＝ SB). How is the exact location determined?',
    solTitle: 'Step-by-Step Solution:',
    prob1Step1:
      '1. By the characteristic property, all points equidistant from A and B lie on the perpendicular bisector of segment AB.',
    prob1Step2:
      '2. We construct the perpendicular bisector (m) of segment AB (perpendicular at midpoint M, where AM ＝ 6 km).',
    prob1Step3:
      '3. The exact position of station S is the intersection of the perpendicular bisector (m) with the straight road (l)!',
    prob2Badge: 'PROBLEM 2: ISOSCELES TRIANGLE & ANGLES',
    prob2Title: 'Triangular Roof Truss',
    prob2Text:
      'In an isosceles triangular roof truss ABC (AB ＝ AC), the vertex angle is Â ＝ 44°. 1) What is the measure of base angles B̂ and Ĉ? 2) If altitude AD is drawn, what is angle BÂD?',
    prob2Step1: '1. The sum of triangle angles is 180°: Â ＋ B̂ ＋ Ĉ ＝ 180°.',
    prob2Step2Lead: '2. Since B̂ ＝ Ĉ: B̂ ＝ ',
    prob2Step3Lead: '3. Altitude AD also bisects Â, hence BÂD ＝ ',
  },
};

export default function MesokathetosTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const curr = DICTIONARY[locale] || DICTIONARY.el;

  const formatNumber = (num) => {
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  const formatDecimal = (num, decimals = 1) => {
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Μεσοκάθετος (Κινούμενο σημείο M κατά ύψος Y)
  // --------------------------------------------------------------------------
  const [pointMY, setPointMY] = useState(60);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Απόσταση Σημείου & Παράλληλες Ευθείες
  // --------------------------------------------------------------------------
  const [distMode, setDistMode] = useState('pointToLine'); // 'pointToLine' | 'parallels'
  const [pointHeight, setPointHeight] = useState(70);
  const [obliqueShift, setObliqueShift] = useState(50);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Διχοτόμος & Ισαπόσταση
  // --------------------------------------------------------------------------
  const [bisectPos, setBisectPos] = useState(80);
  const [angleTotal, setAngleTotal] = useState(60);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 4: Ισοσκελές & Ισόπλευρο Τρίγωνο
  // --------------------------------------------------------------------------
  const [triangleType, setTriangleType] = useState('isosceles'); // 'isosceles' | 'equilateral'
  const [vertexAngle, setVertexAngle] = useState(50);

  // Stepper με πλήρη αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 1 (Μεσοκάθετος)
  // --------------------------------------------------------------------------
  const segHalf = 80;
  const distMAVal = useMemo(() => {
    return Math.hypot(segHalf, pointMY) / 10;
  }, [pointMY]);
  const distMAFormatted = formatDecimal(distMAVal, 1);

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 2 (Απόσταση Σημείου & Παράλληλες)
  // --------------------------------------------------------------------------
  const perpDistCmVal = pointHeight / 10;
  const perpDistCmFormatted = formatDecimal(perpDistCmVal, 1);

  const obliqueDistCmVal = useMemo(() => {
    return Math.hypot(obliqueShift, pointHeight) / 10;
  }, [obliqueShift, pointHeight]);
  const obliqueDistCmFormatted = formatDecimal(obliqueDistCmVal, 1);

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 3 (Διχοτόμος)
  // --------------------------------------------------------------------------
  const halfAngle = angleTotal / 2;
  const perpDistFromBisectorVal = useMemo(() => {
    const rad = (halfAngle * Math.PI) / 180;
    return (bisectPos * Math.sin(rad)) / 10;
  }, [bisectPos, halfAngle]);
  const perpDistFromBisectorFormatted = formatDecimal(perpDistFromBisectorVal, 1);

  // --------------------------------------------------------------------------
  // ΥΠΟΛΟΓΙΣΜΟΙ ΕΡΓΑΣΤΗΡΙΟΥ 4 (Ισοσκελές & Ισόπλευρο)
  // --------------------------------------------------------------------------
  const baseAngleIsosceles = useMemo(() => {
    if (triangleType === 'equilateral') return 60;
    return Math.round((180 - vertexAngle) / 2);
  }, [triangleType, vertexAngle]);

  const effectiveVertex = triangleType === 'equilateral' ? 60 : vertexAngle;

  const apexY = useMemo(() => {
    const halfVertexRad = ((effectiveVertex / 2) * Math.PI) / 180;
    const rawH = 80 / Math.tan(halfVertexRad);
    const minRaw = 46.18;
    const maxRaw = 453.68;
    const norm = Math.max(0, Math.min(1, (rawH - minRaw) / (maxRaw - minRaw)));
    return Math.round(175 - norm * 140);
  }, [effectiveVertex]);

  return (
    <Layout
      title={curr.pageTitle}
      description={curr.pageDesc}
      backUrl="/a-gymnasiou"
      backText={curr.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/37-mesokathetos-ask"
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
            1. ΜΕΣΟΚΑΘΕΤΟΣ ΕΥΘΥΓΡΑΜΜΟΥ ΤΜΗΜΑΤΟΣ + ΕΡΓΑΣΤΗΡΙΟ 1
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed min-w-0">
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card1Text}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card2Text}
              </p>
              <div className="p-1.5 bg-white rounded-lg border border-emerald-200 font-mono text-center font-bold text-emerald-950 break-words [overflow-wrap:anywhere]">
                ΜΑ ＝ ΜΒ
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card3Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΜΕΣΟΚΑΘΕΤΟΣ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab1Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.lblPointMY)}</span>
                    <span className="text-base font-mono font-black text-indigo-700">
                      {formatDecimal(pointMY / 10, 1)} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    step="5"
                    value={pointMY}
                    onChange={(e) => setPointMY(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {[-20, -5, 5, 20].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={(e) => handleStep(setPointMY, step, -90, 90, e)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {step > 0 ? `＋${formatNumber(step)}` : formatNumber(step)}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setPointMY(0)}
                    className="px-2.5 py-1 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold text-xs font-mono active:scale-95"
                  >
                    {curr.midpointBtn}
                  </button>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">{curr.segABInfo}</div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.distMALabel} <strong className="text-emerald-700">{distMAFormatted} cm</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.distMBLabel} <strong className="text-emerald-700">{distMAFormatted} cm</strong>
                  </div>
                  <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                    {curr.alwaysEqualMA_MB}
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visLab1Header)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    ΜΑ ＝ ΜΒ ＝ {distMAFormatted} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 260" className="w-full max-w-[460px] h-auto max-h-[240px]">
                    {/* Ευθύγραμμο τμήμα ΑΒ */}
                    <line x1="160" y1="130" x2="320" y2="130" stroke="#38bdf8" strokeWidth="4" />
                    <circle cx="160" cy="130" r="5" fill="#38bdf8" />
                    <text x="145" y="135" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'Α' : 'A'}
                    </text>
                    <circle cx="320" cy="130" r="5" fill="#38bdf8" />
                    <text x="330" y="135" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      B
                    </text>

                    {/* Μεσοκάθετος ευθεία (ε) */}
                    <line x1="240" y1="20" x2="240" y2="240" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5 4" />
                    <text x="248" y="32" fill="#c084fc" fontSize="12" fontWeight="bold">
                      {curr.perpBisectorLineLabel}
                    </text>

                    {/* Σύμβολο ορθής γωνίας στο μέσο Ο */}
                    <rect x="240" y="118" width="12" height="12" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                    <circle cx="246" cy="124" r="1.5" fill="#a855f7" />
                    <circle cx="240" cy="130" r="4" fill="#ffffff" />
                    <text x="246" y="146" fill="#cbd5e1" fontSize="11" fontWeight="bold">
                      O
                    </text>

                    {/* Αποστάσεις ΜΑ και ΜΒ */}
                    <line x1="160" y1="130" x2="240" y2={130 - pointMY} stroke="#10b981" strokeWidth="2.5" />
                    <line x1="320" y1="130" x2="240" y2={130 - pointMY} stroke="#10b981" strokeWidth="2.5" />

                    {/* Κινούμενο σημείο Μ */}
                    <circle cx="240" cy={130 - pointMY} r="6.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <text x="252" y={130 - pointMY + 4} fill="#fde68a" fontSize="13" fontWeight="bold">
                      M
                    </text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 break-words [overflow-wrap:anywhere]">
                  {curr.lab1ExplNote}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ & ΠΑΡΑΛΛΗΛΩΝ + ΕΡΓΑΣΤΗΡΙΟ 2
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed min-w-0">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card1Text}
              </p>
              <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-xs text-indigo-950 font-bold break-words [overflow-wrap:anywhere]">
                {curr.sec2Card1Box}
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card2Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΑΠΟΣΤΑΣΗ & ΠΑΡΑΛΛΗΛΕΣ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab2Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setDistMode('pointToLine')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                      distMode === 'pointToLine'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {toCleanUppercase(curr.distModes.pointToLine)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistMode('parallels')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                      distMode === 'parallels'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {toCleanUppercase(curr.distModes.parallels)}
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.lblPerpDistAH)}</span>
                    <span className="font-mono font-black text-indigo-700 text-sm">
                      {perpDistCmFormatted} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={pointHeight}
                    onChange={(e) => setPointHeight(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {distMode === 'pointToLine' && (
                  <div className="space-y-2 min-w-0">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                      <span>{toCleanUppercase(curr.lblObliquePosB)}</span>
                      <span className="font-mono font-black text-amber-700 text-sm">
                        {formatDecimal(obliqueShift / 10, 1)} cm
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="5"
                      value={obliqueShift}
                      onChange={(e) => setObliqueShift(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.perpSegLabel} <strong>{perpDistCmFormatted} cm</strong>
                  </div>
                  {distMode === 'pointToLine' && (
                    <>
                      <div className="break-words [overflow-wrap:anywhere]">
                        {curr.obliqueSegLabel} <strong>{obliqueDistCmFormatted} cm</strong>
                      </div>
                      <div className="font-bold text-emerald-700 pt-1 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                        ΑΗ ({perpDistCmFormatted} cm) ＜ ΑΒ ({obliqueDistCmFormatted} cm)
                      </div>
                    </>
                  )}
                  {distMode === 'parallels' && (
                    <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                      {curr.parallelsConstantInfoLead} <strong>{perpDistCmFormatted} cm</strong> {curr.parallelsConstantInfoEnd}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visLab2Header)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    d ＝ {perpDistCmFormatted} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 240" className="w-full max-w-[460px] h-auto max-h-[230px]">
                    {/* Ευθεία ε (βάση) */}
                    <line x1="40" y1="180" x2="440" y2="180" stroke="#94a3b8" strokeWidth="3" />
                    <text x="445" y="184" fill="#94a3b8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε' : 'l'}
                    </text>

                    {distMode === 'parallels' && (
                      <>
                        <line x1="40" y1={180 - pointHeight} x2="440" y2={180 - pointHeight} stroke="#818cf8" strokeWidth="3" />
                        <text x="445" y={184 - pointHeight} fill="#818cf8" fontSize="13" fontWeight="bold">
                          {locale === 'el' ? 'ε₁' : 'l₁'}
                        </text>

                        <line x1="160" y1={180 - pointHeight} x2="160" y2="180" stroke="#10b981" strokeWidth="3" strokeDasharray="4 3" />
                        <rect x="160" y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <line x1="320" y1={180 - pointHeight} x2="320" y2="180" stroke="#10b981" strokeWidth="3" strokeDasharray="4 3" />
                        <rect x="320" y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <text x="168" y={180 - pointHeight / 2} fill="#6ee7b7" fontSize="11">{perpDistCmFormatted} cm</text>
                        <text x="328" y={180 - pointHeight / 2} fill="#6ee7b7" fontSize="11">{perpDistCmFormatted} cm</text>
                      </>
                    )}

                    {distMode === 'pointToLine' && (
                      <>
                        <circle cx="200" cy={180 - pointHeight} r="6" fill="#38bdf8" />
                        <text x="190" y={174 - pointHeight} fill="#38bdf8" fontSize="13" fontWeight="bold">
                          {locale === 'el' ? 'Α' : 'A'}
                        </text>

                        <line x1="200" y1={180 - pointHeight} x2="200" y2="180" stroke="#10b981" strokeWidth="3.5" />
                        <rect x="200" y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <circle cx="206" cy="174" r="1.5" fill="#10b981" />
                        <circle cx="200" cy="180" r="4.5" fill="#10b981" />
                        <text x="206" y="198" fill="#10b981" fontSize="12" fontWeight="bold">
                          H
                        </text>

                        <line x1="200" y1={180 - pointHeight} x2={200 + obliqueShift} y2="180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" />
                        <circle cx={200 + obliqueShift} cy="180" r="4.5" fill="#f59e0b" />
                        <text x={200 + obliqueShift + 6} y="198" fill="#f59e0b" fontSize="12" fontWeight="bold">
                          B
                        </text>
                      </>
                    )}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 break-words [overflow-wrap:anywhere]">
                  {distMode === 'pointToLine' ? curr.lab2ExplPointToLine : curr.lab2ExplParallels}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΧΑΡΑΚΤΗΡΙΣΤΙΚΗ ΙΔΙΟΤΗΤΑ ΔΙΧΟΤΟΜΟΥ ΓΩΝΙΑΣ + ΕΡΓΑΣΤΗΡΙΟ 3
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

          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs sm:text-sm leading-relaxed text-slate-700 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
              {toCleanUppercase(curr.sec3Badge)}
            </span>
            <h3 className="font-bold text-slate-900 text-base">{curr.sec3TitleDef}</h3>
            <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
              {curr.sec3TextDef}
            </p>
            <div className="p-2 bg-white rounded-lg border border-indigo-200 font-mono text-center font-bold text-indigo-950 max-w-sm mx-auto break-words [overflow-wrap:anywhere]">
              {locale === 'el' ? 'ΣΗ₁ ＝ ΣΗ₂' : 'PH₁ ＝ PH₂'}
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΙΑΔΡΑΣΤΙΚΗ ΙΣΑΠΟΣΤΑΣΗ ΔΙΧΟΤΟΜΟΥ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab3Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.lblPosS)}</span>
                    <span className="font-mono font-black text-indigo-700">
                      {formatDecimal(bisectPos / 10, 1)} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="140"
                    step="5"
                    value={bisectPos}
                    onChange={(e) => setBisectPos(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.lblAngleAperture)}</span>
                    <span className="font-mono font-black text-amber-700">{formatNumber(angleTotal)}°</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    step="2"
                    value={angleTotal}
                    onChange={(e) => setAngleTotal(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.angleInfoLead} {formatNumber(angleTotal)}° {curr.angleInfoMid} {formatNumber(halfAngle)}°)
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.distSH1Label} <strong className="text-emerald-700">{perpDistFromBisectorFormatted} cm</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.distSH2Label} <strong className="text-emerald-700">{perpDistFromBisectorFormatted} cm</strong>
                  </div>
                  <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                    {curr.bisectorLocusText}
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visLab3Header)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    d₁ ＝ d₂ ＝ {perpDistFromBisectorFormatted} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 250" className="w-full max-w-[460px] h-auto max-h-[240px]">
                    <line
                      x1="100"
                      y1="180"
                      x2={100 + 220 * Math.cos((halfAngle * Math.PI) / 180)}
                      y2={180 + 220 * Math.sin((halfAngle * Math.PI) / 180)}
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />
                    <text x="320" y="235" fill="#94a3b8" fontSize="13" fontWeight="bold">x</text>

                    <line
                      x1="100"
                      y1="180"
                      x2={100 + 220 * Math.cos((-halfAngle * Math.PI) / 180)}
                      y2={180 + 220 * Math.sin((-halfAngle * Math.PI) / 180)}
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />
                    <text x="320" y="70" fill="#94a3b8" fontSize="13" fontWeight="bold">y</text>

                    <line x1="100" y1="180" x2="330" y2="180" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="5 3" />
                    <text x="340" y="184" fill="#c084fc" fontSize="12" fontWeight="bold">
                      {locale === 'el' ? 'δ' : 'd'}
                    </text>

                    <circle cx={100 + bisectPos} cy="180" r="6" fill="#f59e0b" />
                    <text x={100 + bisectPos - 4} y="166" fill="#fde68a" fontSize="12" fontWeight="bold">
                      {locale === 'el' ? 'Σ' : 'P'}
                    </text>

                    {(() => {
                      const rad = (halfAngle * Math.PI) / 180;
                      const projLen = bisectPos * Math.cos(rad);
                      const ptH1 = {
                        x: 100 + projLen * Math.cos(rad),
                        y: 180 + projLen * Math.sin(rad),
                      };
                      const ptH2 = {
                        x: 100 + projLen * Math.cos(-rad),
                        y: 180 + projLen * Math.sin(-rad),
                      };
                      return (
                        <g>
                          <line x1={100 + bisectPos} y1="180" x2={ptH1.x} y2={ptH1.y} stroke="#10b981" strokeWidth="2.5" />
                          <circle cx={ptH1.x} cy={ptH1.y} r="4" fill="#10b981" />
                          <text x={ptH1.x + 6} y={ptH1.y + 12} fill="#6ee7b7" fontSize="11">
                            {locale === 'el' ? 'Η₁' : 'H₁'}
                          </text>

                          <line x1={100 + bisectPos} y1="180" x2={ptH2.x} y2={ptH2.y} stroke="#10b981" strokeWidth="2.5" />
                          <circle cx={ptH2.x} cy={ptH2.y} r="4" fill="#10b981" />
                          <text x={ptH2.x + 6} y={ptH2.y - 6} fill="#6ee7b7" fontSize="11">
                            {locale === 'el' ? 'Η₂' : 'H₂'}
                          </text>
                        </g>
                      );
                    })()}

                    <circle cx="100" cy="180" r="5" fill="#38bdf8" />
                    <text x="82" y="184" fill="#38bdf8" fontSize="13" fontWeight="bold">O</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 break-words [overflow-wrap:anywhere]">
                  {curr.lab3ExplNote}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΙΣΟΣΚΕΛΕΣ & ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ + ΕΡΓΑΣΤΗΡΙΟ 4
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{curr.sec4Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed min-w-0">
            {/* Ισοσκελές Τρίγωνο */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec4Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec4Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec4Card1Text}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                <li className="break-words [overflow-wrap:anywhere]">{curr.sec4Card1Li1}</li>
                <li className="break-words [overflow-wrap:anywhere]">{curr.sec4Card1Li2}</li>
                <li className="break-words [overflow-wrap:anywhere]">{curr.sec4Card1Li3}</li>
              </ul>
            </div>

            {/* Ισόπλευρο Τρίγωνο */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec4Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec4Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec4Card2Text}
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                <li className="break-words [overflow-wrap:anywhere]">{curr.sec4Card2Li1}</li>
                <li className="break-words [overflow-wrap:anywhere]">{curr.sec4Card2Li2}</li>
                <li className="break-words [overflow-wrap:anywhere]">{curr.sec4Card2Li3}</li>
              </ul>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 4: ΔΙΑΔΡΑΣΤΙΚΟ ΤΡΙΓΩΝΟ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab4Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="grid grid-cols-2 gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => setTriangleType('isosceles')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                      triangleType === 'isosceles'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {toCleanUppercase(curr.triModes.isosceles)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTriangleType('equilateral')}
                    className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                      triangleType === 'equilateral'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {toCleanUppercase(curr.triModes.equilateral)}
                  </button>
                </div>

                {triangleType === 'isosceles' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 min-w-0">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                      <span>{toCleanUppercase(curr.lblVertexAngle)}</span>
                      <span className="font-mono font-black text-amber-700 text-sm">
                        {formatNumber(vertexAngle)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="120"
                      step="2"
                      value={vertexAngle}
                      onChange={(e) => setVertexAngle(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
                      {[-10, -2, 2, 10].map((step) => (
                        <button
                          key={step}
                          type="button"
                          onClick={(e) => handleStep(setVertexAngle, step, 20, 120, e)}
                          className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                        >
                          {step > 0 ? `＋${formatNumber(step)}°` : `－${formatNumber(Math.abs(step))}°`}
                        </button>
                      ))}
                      {[30, 45, 90].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setVertexAngle(preset)}
                          className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                        >
                          {formatNumber(preset)}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-2 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.vertexAngleInfo} <strong>{formatNumber(effectiveVertex)}°</strong>
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-1 max-w-full">
                    <span>{curr.baseAnglesInfo} </span>
                    <Frac num={`180° － ${formatNumber(effectiveVertex)}°`} den="2" />
                    <span> ＝ <strong className="text-indigo-700">{formatNumber(baseAngleIsosceles)}°</strong></span>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.symmetryAxesInfo} <strong>{triangleType === 'equilateral' ? curr.symmetryAxesEquilateral : curr.symmetryAxesIsosceles}</strong>
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer με ομαλή κίνηση */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visLab4Header)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    Â ＝ {formatNumber(effectiveVertex)}°, Β̂ ＝ Γ̂ ＝ {formatNumber(baseAngleIsosceles)}°
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 250" className="w-full max-w-[460px] h-auto max-h-[240px]">
                    <line x1="160" y1="190" x2="320" y2="190" stroke="#38bdf8" strokeWidth="3.5" />
                    <circle cx="160" cy="190" r="5" fill="#38bdf8" />
                    <text x="145" y="205" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      B
                    </text>
                    <circle cx="320" cy="190" r="5" fill="#38bdf8" />
                    <text x="328" y="205" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'Γ' : 'C'}
                    </text>

                    <line x1="160" y1="190" x2="240" y2={apexY} stroke="#f59e0b" strokeWidth="3.5" />
                    <line x1="320" y1="190" x2="240" y2={apexY} stroke="#f59e0b" strokeWidth="3.5" />

                    <line x1="240" y1={Math.max(15, apexY - 20)} x2="240" y2="215" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 3" />
                    <rect x="240" y="178" width="12" height="12" fill="none" stroke="#a855f7" strokeWidth="1.5" />

                    <circle cx="240" cy={apexY} r="5.5" fill="#f59e0b" />
                    <text x="240" y={apexY - 10} fill="#fde68a" fontSize="13" fontWeight="bold" textAnchor="middle">
                      {locale === 'el' ? 'Α' : 'A'}
                    </text>

                    <text x="175" y="184" fill="#38bdf8" fontSize="11" fontWeight="bold">{formatNumber(baseAngleIsosceles)}°</text>
                    <text x="290" y="184" fill="#38bdf8" fontSize="11" fontWeight="bold">{formatNumber(baseAngleIsosceles)}°</text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 break-words [overflow-wrap:anywhere]">
                  {curr.lab4ExplNote}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            5. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΠΡΟΒΛΗΜΑΤΑ
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                5
              </span>
              <span>{curr.sec5Title}</span>
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
                <div className="break-words [overflow-wrap:anywhere]">{curr.prob1Step2}</div>
                <div className="text-emerald-700 font-bold break-words [overflow-wrap:anywhere]">
                  {curr.prob1Step3}
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
                  <Frac num="180° － 44°" den="2" />
                  <span> ＝ </span>
                  <Frac num="136°" den="2" />
                  <span> ＝ <strong>68°</strong>.</span>
                </div>
                <div className="inline-flex flex-wrap items-center gap-1 max-w-full text-emerald-700 font-bold">
                  <span>{curr.prob2Step3Lead}</span>
                  <Frac num="44°" den="2" />
                  <span> ＝ 22°.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
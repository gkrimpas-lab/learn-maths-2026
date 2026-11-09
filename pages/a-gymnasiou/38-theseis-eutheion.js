import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// ============================================================================
// ΕΠΑΝΑΧΡΗΣΙΜΟΠΟΙΗΣΙΜΟ COMPONENT ΚΛΑΣΜΑΤΟΣ
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
    pageTitle: "Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων | Α' Γυμνασίου",
    pageDesc:
      'Σχετικές θέσεις δύο ευθειών, παράλληλες, απόσταση παραλλήλων, τέμνουσα, εντός εναλλάξ, εντός εκτός και επί τα αυτά, εντός και επί τα αυτά γωνίες με διαδραστικά εργαστήρια.',
    backText: "Α' Γυμνασίου",
    btnExercises: 'ΑΣΚΗΣΕΙΣ',
    bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 04 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    bannerTitle: 'Σχετικές Θέσεις Ευθειών & Γωνίες Παραλλήλων',
    bannerSubtitle:
      'Εξερεύνησε διαδραστικά πώς συνδέονται δύο ευθείες στο επίπεδο (τεμνόμενες, κάθετες, παράλληλες, ταυτιζόμενες) και ανακάλυψε τους κανόνες των γωνιών που σχηματίζονται όταν δύο παράλληλες τέμνονται από μία τρίτη ευθεία.',

    // Section 1
    sec1Title: '1. Σχετικές Θέσεις Δύο Ευθειών στο Επίπεδο',
    sec1Card1Badge: '1. ΤΕΜΝΟΜΕΝΕΣ ΕΥΘΕΙΕΣ',
    sec1Card1Title: 'Ακριβώς 1 Κοινό Σημείο',
    sec1Card1Text:
      'Δύο ευθείες ε₁ και ε₂ στο ίδιο επίπεδο λέγονται τεμνόμενες όταν έχουν ένα και μοναδικό κοινό σημείο Α (σημείο τομής).',
    sec1Card2Badge: '2. ΚΑΘΕΤΕΣ ΕΥΘΕΙΕΣ (⊥)',
    sec1Card2Title: 'Ορθή Γωνία 90°',
    sec1Card2Text:
      'Ειδική περίπτωση τεμνομένων ευθειών. Τέμνονται σχηματίζοντας τέσσερις ορθές γωνίες (90°). Συμβολισμός: ε₁ ⊥ ε₂.',
    sec1Card3Badge: '3. ΠΑΡΑΛΛΗΛΕΣ ΕΥΘΕΙΕΣ (//)',
    sec1Card3Title: 'Κανένα Κοινό Σημείο',
    sec1Card3Text:
      'Δύο ευθείες του ίδιου επιπέδου που δεν έχουν κανένα κοινό σημείο, όσο κι αν προεκταθούν, λέγονται παράλληλες. Συμβολισμός: ε₁ // ε₂.',
    sec1Card4Badge: '4. ΤΑΥΤΙΖΟΜΕΝΕΣ ΕΥΘΕΙΕΣ',
    sec1Card4Title: 'Άπειρα Κοινά Σημεία',
    sec1Card4Text:
      'Αν δύο ευθείες έχουν δύο κοινά σημεία, τότε συμπίπτουν πλήρως και έχουν άπειρα κοινά σημεία (είναι η ίδια ευθεία).',
    lab1Header: 'Εργαστήριο 1: Εξερεύνησε τις 4 δυνατές σχετικές θέσεις δύο ευθειών στο επίπεδο',
    lblAcuteAngleInter: 'ΟΞΕΙΑ ΓΩΝΙΑ ΤΟΜΗΣ',
    commonPointsLabel: '• Κοινά Σημεία:',
    commonPoints1: '1 κοινό σημείο (το σημείο τομής)',
    commonPoints0: 'Κανένα κοινό σημείο (τομή ＝ ∅)',
    commonPointsInf: 'Άπειρα κοινά σημεία (πλήρης σύμπτωση)',
    notationLabel: '• Συμβολισμός:',
    notIntersecting: 'ε₁ τέμνει ε₂',
    notPerpendicular: 'ε₁ ⊥ ε₂ (ορθή γωνία 90°)',
    notParallel: 'ε₁ // ε₂ (παράλληλες)',
    notCoincident: 'ε₁ ≡ ε₂ (ταυτίζονται)',
    visLab1Header: 'ΟΠΤΙΚΟΠΟΙΗΣΗ ΣΧΕΤΙΚΗΣ ΘΕΣΗΣ',
    visBadgeAngle: 'ΓΩΝΙΑ:',
    visBadgePerp: 'ΟΡΘΗ ΓΩΝΙΑ 90°',
    lab1ExplInter: 'Οι ευθείες τέμνονται στο σημείο Α και σχηματίζουν δύο ζεύγη κατακορυφήν γωνιών.',
    lab1ExplPerp: 'Οι ευθείες είναι κάθετες (ε₁ ⊥ ε₂) και σχηματίζουν τέσσερις ορθές γωνίες των 90°.',
    lab1ExplPar: 'Οι ευθείες είναι παράλληλες (ε₁ // ε₂) και διατηρούν ακριβώς την ίδια απόσταση d σε κάθε σημείο.',
    lab1ExplCoinc: 'Οι ευθείες ταυτίζονται (ε₁ ≡ ε₂) έχοντας άπειρα κοινά σημεία.',
    coincidentSuffix: 'ε₂ (συμπίπτει)',

    // Section 2
    sec2Title: '2. Απόσταση Παράλληλων Ευθειών',
    sec2Card1Badge: 'ΟΡΙΣΜΟΣ',
    sec2Card1Title: 'Κοινό Κάθετο Τμήμα',
    sec2Card1Text:
      'Απόσταση δύο παράλληλων ευθειών ε₁ και ε₂ ονομάζεται το μήκος οποιουδήποτε κάθετου ευθύγραμμου τμήματος ΑΒ με τα άκρα του πάνω στις δύο ευθείες.',
    sec2Card2Badge: 'ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ',
    sec2Card2Title: 'Σταθερό Μήκος Παντού',
    sec2Card2Text:
      'Η απόσταση των παραλλήλων είναι ακριβώς η ίδια σε όλα τα σημεία τους (σταθερό πλάτος). Κάθε σημείο της μίας ισαπέχει από την άλλη.',
    sec2Card3Badge: 'ΕΦΑΡΜΟΓΕΣ',
    sec2Card3Title: 'Στην Πράξη',
    sec2Card3Text:
      'Οι σιδηροδρομικές ράγες, τα όρια ενός δρόμου σταθερού πλάτους και οι γραμμές ενός τετραδίου αποτελούν καθημερινά παραδείγματα παράλληλων ευθειών σταθερής απόστασης.',
    lab3Header: 'Εργαστήριο 2: Μεταβολή Απόστασης Παράλληλων Ευθειών & Σταθερό Πλάτος',
    lblDistParallels: 'ΑΠΟΣΤΑΣΗ d ΜΕΤΑΞΥ ε₁ ΚΑΙ ε₂',
    distLabelBullet: '• Απόσταση d:',
    perpSegmentsLabel: '• Κάθετο Τμήμα ΑΒ ＝ ΓΔ ＝ ΕΖ ＝ d',
    constantWidthInfo: 'Το πλάτος παραμένει αυστηρά σταθερό σε όλο το μήκος των ευθειών!',
    visLab3Header: 'ΣΤΑΘΕΡΗ ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ',
    lab3ExplNote:
      'Όλα τα κάθετα τμήματα ανάμεσα στις ευθείες ε₁ και ε₂ έχουν το ίδιο ακριβώς μήκος, αποδεικνύοντας ότι η απόσταση δύο παραλλήλων ευθειών είναι αναλλοίωτη.',

    // Section 3
    sec3Title: '3. Γωνίες Δύο Παράλληλων που Τέμνονται από Τρίτη',
    sec3Intro:
      'Όταν δύο παράλληλες ευθείες ε₁ // ε₂ τέμνονται από μία τρίτη ευθεία (τέμνουσα ε₃), σχηματίζονται συνολικά 8 γωνίες. Από αυτές: 4 είναι ίσες οξείες και 4 είναι ίσες αμβλείες (ή και οι 8 ορθές των 90° αν η τέμνουσα είναι κάθετη).',
    sec3Card1Badge: 'ΖΕΥΓΟΣ 1 (ΣΧΗΜΑ "Z")',
    sec3Card1Title: 'Εντός Εναλλάξ Γωνίες',
    sec3Card1Text:
      'Βρίσκονται ανάμεσα στις παράλληλες (εντός) και σε διαφορετικές πλευρές της τέμνουσας (εναλλάξ).',
    sec3Card1Box: 'ΕΙΝΑΙ ΠΑΝΤΑ ΙΣΕΣ!',
    sec3Card2Badge: 'ΖΕΥΓΟΣ 2 (ΣΧΗΜΑ "F")',
    sec3Card2Title: 'Εντός, Εκτός & Επί τα Αυτά',
    sec3Card2Text:
      'Η μία βρίσκεται εντός, η άλλη εκτός των παραλλήλων, και βρίσκονται στην ίδια πλευρά της τέμνουσας.',
    sec3Card2Box: 'ΕΙΝΑΙ ΠΑΝΤΑ ΙΣΕΣ!',
    sec3Card3Badge: 'ΖΕΥΓΟΣ 3 (ΣΧΗΜΑ "C / U")',
    sec3Card3Title: 'Εντός & Επί τα Αυτά',
    sec3Card3Text:
      'Βρίσκονται και οι δύο εντός των παραλλήλων και στην ίδια πλευρά της τέμνουσας ευθείας.',
    sec3Card3Box: 'ΑΘΡΟΙΣΜΑ ＝ 180° (ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ)',
    lab2Header: 'Εργαστήριο 3: Δύο Παράλληλες & Τέμνουσα — Εντός Εναλλάξ, Εντός Εκτός & Εντός Επί τα Αυτά',
    lblSelectPair: 'ΕΠΙΛΟΓΗ ΧΑΡΑΚΤΗΡΙΣΤΙΚΟΥ ΖΕΥΓΟΥΣ',
    lblTransversalSlope: 'ΚΛΙΣΗ ΤΕΜΝΟΥΣΑΣ (ΟΞΕΙΑ ΓΩΝΙΑ)',
    acuteAnglesBullet: '• Οξείες Γωνίες (4 ίσες):',
    obtuseAnglesBullet: '• Αμβλείες Γωνίες (4 ίσες):',
    explAltInt: 'Εντός εναλλάξ: Σχηματίζουν το γράμμα «Ζ» και είναι ίσες',
    explCorr: 'Εντός, εκτός & επί τα αυτά: Σχηματίζουν το γράμμα «F» και είναι ίσες',
    explConsecInt: 'Εντός & επί τα αυτά: Σχηματίζουν το γράμμα «C» και έχουν άθροισμα',
    visLab2Header: 'ΑΠΕΙΚΟΝΙΣΗ 8 ΓΩΝΙΩΝ',
    visBadgeAltInt: 'ΕΝΤΟΣ ΕΝΑΛΛΑΞ:',
    visBadgeCorr: 'ΑΝΤΙΣΤΟΙΧΕΣ:',
    visBadgeConsecInt: 'ΑΘΡΟΙΣΜΑ:',
    lab2ExplGeneral: 'Γνωρίζοντας μία μόνο γωνία, μπορούμε να υπολογίσουμε άμεσα και τις 8 γωνίες: τέσσερις είναι ίσες με την οξεία και τέσσερις είναι ίσες με το παραπλήρωμά της!',

    // Section 4
    sec4Title: '4. Κριτήρια Παραλληλίας Ευθειών',
    sec4SubTitle: 'Πώς αποδεικνύουμε ότι δύο ευθείες είναι παράλληλες;',
    sec4Text:
      'Αν δύο ευθείες ε₁ και ε₂ τέμνονται από μία τρίτη ευθεία ε₃, είναι παράλληλες (ε₁ // ε₂) αν ισχύει τουλάχιστον ένα από τα παρακάτω κριτήρια:',
    crit1Title: 'Κριτήριο 1',
    crit1Text: 'Δύο εντός εναλλάξ γωνίες είναι ίσες.',
    crit2Title: 'Κριτήριο 2',
    crit2Text: 'Δύο εντός, εκτός και επί τα αυτά γωνίες είναι ίσες.',
    crit3Title: 'Κριτήριο 3',
    crit3Text: 'Δύο εντός και επί τα αυτά γωνίες είναι παραπληρωματικές (άθροισμα 180°).',
    extraPerpCritLead: 'Επιπλέον Κριτήριο Καθετότητας:',
    extraPerpCritText:
      'Δύο ευθείες του επιπέδου που είναι κάθετες στην ίδια ευθεία είναι μεταξύ τους παράλληλες (αν ε₁ ⊥ ε₃ και ε₂ ⊥ ε₃, τότε ε₁ // ε₂).',

    // Section 5
    sec5Title: '5. Λυμένα Παραδείγματα & Προβλήματα',
    prob1Badge: 'ΠΡΟΒΛΗΜΑ 1: ΥΠΟΛΟΓΙΣΜΟΣ ΓΩΝΙΩΝ ΣΕ ΣΙΔΗΡΟΔΡΟΜΙΚΕΣ ΡΑΓΕΣ',
    prob1Title: 'Διαγώνιος Σύνδεσμος σε Γέφυρα',
    prob1Text:
      'Δύο παράλληλες σιδηροτροχιές ε₁ // ε₂ συνδέονται με μια λοξή μεταλλική ράβδο ε₃. Αν η μία οξεία γωνία που σχηματίζεται στη ράγα ε₁ είναι ω ＝ 52°: 1) Πόσο είναι η εντός εναλλάξ γωνία στη ράγα ε₂; 2) Πόσο είναι η εντός και επί τα αυτά γωνία στην ίδια πλευρά;',
    solTitle: 'Αναλυτική Λύση:',
    prob1Step1: '1. Επειδή ε₁ // ε₂, οι εντός εναλλάξ γωνίες είναι ίσες: ω\' ＝ 52°.',
    prob1Step2: '2. Οι εντός και επί τα αυτά γωνίες είναι παραπληρωματικές: 180° － 52° ＝ 128°.',
    prob2Badge: 'ΠΡΟΒΛΗΜΑ 2: ΕΛΕΓΧΟΣ ΠΑΡΑΛΛΗΛΙΑΣ',
    prob2Title: 'Ευθυγράμμιση Ηλιακών Πάνελ',
    prob2Text:
      'Ένας τεχνικός εγκαθιστά δύο βάσεις πάνελ ε₁ και ε₂. Μια ράβδος μέτρησης τέμνει τις δύο βάσεις και μετρά δύο γωνίες εντός και επί τα αυτά ίσες με 68° και 112°. Είναι οι βάσεις των πάνελ παράλληλες μεταξύ τους;',
    prob2Step1: '1. Εξετάζουμε το άθροισμα των γωνιών εντός και επί τα αυτά: 68° ＋ 112° ＝ 180°.',
    prob2Step2:
      '2. Σύμφωνα με το Κριτήριο 3, επειδή οι εντός και επί τα αυτά γωνίες είναι παραπληρωματικές (άθροισμα 180°), οι βάσεις είναι αυστηρά παράλληλες (ε₁ // ε₂)!',

    relModes: {
      intersecting: 'ΤΕΜΝΟΜΕΝΕΣ',
      perpendicular: 'ΚΑΘΕΤΕΣ (90°)',
      parallel: 'ΠΑΡΑΛΛΗΛΕΣ (//)',
      coincident: 'ΤΑΥΤΙΖΟΜΕΝΕΣ',
    },
    pairModes: {
      alternateInterior: 'ΕΝΤΟΣ ΕΝΑΛΛΑΞ (ΙΣΕΣ)',
      corresponding: 'ΕΝΤΟΣ, ΕΚΤΟΣ & ΕΠΙ ΤΑ ΑΥΤΑ (ΙΣΕΣ)',
      consecutiveInterior: 'ΕΝΤΟΣ & ΕΠΙ ΤΑ ΑΥΤΑ (180°)',
    },
  },
  en: {
    pageTitle: 'Relative Positions of Lines & Parallel Angles | Grade 7',
    pageDesc:
      'Relative positions of two lines, parallel lines, distance between parallels, transversal line, alternate interior, corresponding, consecutive interior angles with interactive labs.',
    backText: 'Grade 7',
    btnExercises: 'EXERCISES',
    bannerBadge: 'GRADE 7 • GEOMETRY CHAPTER 04 • THEORY & LAB',
    bannerTitle: 'Relative Positions of Lines & Angles Formed by Parallels',
    bannerSubtitle:
      'Interactively explore how two lines relate in a plane (intersecting, perpendicular, parallel, coincident) and discover angle relationships formed when two parallel lines are cut by a transversal.',

    // Section 1
    sec1Title: '1. Relative Positions of Two Lines in a Plane',
    sec1Card1Badge: '1. INTERSECTING LINES',
    sec1Card1Title: 'Exactly 1 Common Point',
    sec1Card1Text:
      'Two lines l₁ and l₂ in the same plane are called intersecting when they share exactly one common point A (point of intersection).',
    sec1Card2Badge: '2. PERPENDICULAR LINES (⊥)',
    sec1Card2Title: 'Right Angle 90°',
    sec1Card2Text:
      'A special case of intersecting lines. They intersect at four right angles (90°). Notation: l₁ ⊥ l₂.',
    sec1Card3Badge: '3. PARALLEL LINES (//)',
    sec1Card3Title: 'No Common Point',
    sec1Card3Text:
      'Two lines in the same plane that never intersect, no matter how far extended, are called parallel. Notation: l₁ // l₂.',
    sec1Card4Badge: '4. COINCIDENT LINES',
    sec1Card4Title: 'Infinitely Many Common Points',
    sec1Card4Text:
      'If two lines share two points, they coincide completely and have infinitely many points in common (they are the same line).',
    lab1Header: 'Lab 1: Explore the 4 possible relative positions of two lines in a plane',
    lblAcuteAngleInter: 'ACUTE ANGLE OF INTERSECTION',
    commonPointsLabel: '• Common Points:',
    commonPoints1: '1 common point (point of intersection)',
    commonPoints0: 'No common points (intersection ＝ ∅)',
    commonPointsInf: 'Infinitely many common points (coincident)',
    notationLabel: '• Notation:',
    notIntersecting: 'l₁ intersects l₂',
    notPerpendicular: 'l₁ ⊥ l₂ (right angle 90°)',
    notParallel: 'l₁ // l₂ (parallel lines)',
    notCoincident: 'l₁ ≡ l₂ (coincident lines)',
    visLab1Header: 'RELATIVE POSITION VISUALIZATION',
    visBadgeAngle: 'ANGLE:',
    visBadgePerp: 'RIGHT ANGLE 90°',
    lab1ExplInter: 'The lines intersect at point A, forming two pairs of vertically opposite angles.',
    lab1ExplPerp: 'The lines are perpendicular (l₁ ⊥ l₂), forming four 90° right angles.',
    lab1ExplPar: 'The lines are parallel (l₁ // l₂), maintaining the exact same distance d at every point.',
    lab1ExplCoinc: 'The lines coincide (l₁ ≡ l₂), sharing infinitely many points.',
    coincidentSuffix: 'l₂ (coincides)',

    // Section 2
    sec2Title: '2. Distance Between Parallel Lines',
    sec2Card1Badge: 'DEFINITION',
    sec2Card1Title: 'Common Perpendicular Segment',
    sec2Card1Text:
      'The distance between two parallel lines l₁ and l₂ is the length of any perpendicular segment AB with endpoints on the two lines.',
    sec2Card2Badge: 'FUNDAMENTAL PROPERTY',
    sec2Card2Title: 'Constant Length Everywhere',
    sec2Card2Text:
      'The distance between parallel lines is exactly the same at all points (constant width). Every point on one line is equidistant from the other.',
    sec2Card3Badge: 'APPLICATIONS',
    sec2Card3Title: 'In Practice',
    sec2Card3Text:
      'Railroad tracks, boundaries of a road with constant width, and notebook lines are everyday examples of parallel lines with constant distance.',
    lab3Header: 'Lab 2: Changing the Distance Between Parallel Lines & Constant Width',
    lblDistParallels: 'DISTANCE d BETWEEN l₁ AND l₂',
    distLabelBullet: '• Distance d:',
    perpSegmentsLabel: '• Perpendicular Segment AB ＝ CD ＝ EF ＝ d',
    constantWidthInfo: 'The width remains strictly constant along the entire length of the lines!',
    visLab3Header: 'CONSTANT PARALLEL DISTANCE',
    lab3ExplNote:
      'All perpendicular segments between lines l₁ and l₂ have the exact same length, proving that the distance between parallel lines is invariant.',

    // Section 3
    sec3Title: '3. Angles Formed by Two Parallel Lines Cut by a Transversal',
    sec3Intro:
      'When two parallel lines l₁ // l₂ are intersected by a third line (transversal l₃), 8 angles are formed in total: 4 congruent acute angles and 4 congruent obtuse angles (or all 8 right angles if the transversal is perpendicular).',
    sec3Card1Badge: 'PAIR 1 ("Z" SHAPE)',
    sec3Card1Title: 'Alternate Interior Angles',
    sec3Card1Text:
      'Located between the parallel lines (interior) on opposite sides of the transversal (alternate).',
    sec3Card1Box: 'ALWAYS EQUAL (CONGRUENT)!',
    sec3Card2Badge: 'PAIR 2 ("F" SHAPE)',
    sec3Card2Title: 'Corresponding Angles',
    sec3Card2Text:
      'One angle is interior, one is exterior, and both lie on the same side of the transversal line.',
    sec3Card2Box: 'ALWAYS EQUAL (CONGRUENT)!',
    sec3Card3Badge: 'PAIR 3 ("C / U" SHAPE)',
    sec3Card3Title: 'Consecutive Interior Angles',
    sec3Card3Text:
      'Both lie between the parallel lines (interior) and on the same side of the transversal.',
    sec3Card3Box: 'SUM ＝ 180° (SUPPLEMENTARY)',
    lab2Header: 'Lab 3: Two Parallel Lines & a Transversal — Alternate Interior, Corresponding & Consecutive Interior',
    lblSelectPair: 'SELECT ANGLE PAIR RELATION',
    lblTransversalSlope: 'TRANSVERSAL SLOPE (ACUTE ANGLE)',
    acuteAnglesBullet: '• Acute Angles (4 congruent):',
    obtuseAnglesBullet: '• Obtuse Angles (4 congruent):',
    explAltInt: 'Alternate interior: They form a "Z" pattern and are equal',
    explCorr: 'Corresponding: They form an "F" pattern and are equal',
    explConsecInt: 'Consecutive interior: They form a "C" pattern and sum to',
    visLab2Header: '8-ANGLE VISUALIZATION',
    visBadgeAltInt: 'ALTERNATE INTERIOR:',
    visBadgeCorr: 'CORRESPONDING:',
    visBadgeConsecInt: 'SUM:',
    lab2ExplGeneral: 'Knowing just a single angle, we can immediately determine all 8 angles: four are equal to the acute angle and four equal its supplement!',

    // Section 4
    sec4Title: '4. Tests for Parallel Lines',
    sec4SubTitle: 'How do we prove that two lines are parallel?',
    sec4Text:
      'If two lines l₁ and l₂ are intersected by a transversal l₃, they are parallel (l₁ // l₂) if at least one of the following tests is satisfied:',
    crit1Title: 'Test 1',
    crit1Text: 'A pair of alternate interior angles is equal.',
    crit2Title: 'Test 2',
    crit2Text: 'A pair of corresponding angles is equal.',
    crit3Title: 'Test 3',
    crit3Text: 'A pair of consecutive interior angles is supplementary (sum ＝ 180°).',
    extraPerpCritLead: 'Additional Perpendicularity Test:',
    extraPerpCritText:
      'Two lines in a plane perpendicular to the same line are parallel to each other (if l₁ ⊥ l₃ and l₂ ⊥ l₃, then l₁ // l₂).',

    // Section 5
    sec5Title: '5. Worked Examples & Problems',
    prob1Badge: 'PROBLEM 1: CALCULATING ANGLES ON RAILWAY TRACKS',
    prob1Title: 'Diagonal Strut on a Bridge',
    prob1Text:
      'Two parallel rails l₁ // l₂ are connected by an oblique steel strut l₃. If one acute angle formed with rail l₁ is ω ＝ 52°: 1) What is the alternate interior angle on rail l₂? 2) What is the consecutive interior angle on the same side?',
    solTitle: 'Step-by-Step Solution:',
    prob1Step1: '1. Since l₁ // l₂, alternate interior angles are equal: ω\' ＝ 52°.',
    prob1Step2: '2. Consecutive interior angles are supplementary: 180° － 52° ＝ 128°.',
    prob2Badge: 'PROBLEM 2: PARALLELISM VERIFICATION',
    prob2Title: 'Solar Panel Alignment',
    prob2Text:
      'A technician installs two mounting rails l₁ and l₂. A measuring rod intersects both rails, recording two consecutive interior angles equal to 68° and 112°. Are the mounting rails strictly parallel to each other?',
    prob2Step1: '1. We examine the sum of the consecutive interior angles: 68° ＋ 112° ＝ 180°.',
    prob2Step2:
      '2. By Test 3, since consecutive interior angles are supplementary (sum ＝ 180°), the rails are strictly parallel (l₁ // l₂)!',

    relModes: {
      intersecting: 'INTERSECTING',
      perpendicular: 'PERPENDICULAR (90°)',
      parallel: 'PARALLEL (//)',
      coincident: 'COINCIDENT',
    },
    pairModes: {
      alternateInterior: 'ALTERNATE INTERIOR (EQUAL)',
      corresponding: 'CORRESPONDING (EQUAL)',
      consecutiveInterior: 'CONSECUTIVE INTERIOR (180°)',
    },
  },
};

export default function TheseisEutheionTheoria() {
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
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Σχετική Θέση Δύο Ευθειών
  // --------------------------------------------------------------------------
  const [relPositionMode, setRelPositionMode] = useState('intersecting');
  const [interAngle, setInterAngle] = useState(55);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Παράλληλες που Τέμνονται από Τρίτη
  // --------------------------------------------------------------------------
  const [angleTrans, setAngleTrans] = useState(65); // οξεία γωνία τέμνουσας (35° - 80°)
  const [anglePairHighlight, setAnglePairHighlight] = useState('alternateInterior');

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Απόσταση Παράλληλων Ευθειών
  // --------------------------------------------------------------------------
  const [parallelDist, setParallelDist] = useState(70);

  // Stepper με πλήρη αποτροπή event propagation
  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  const obtuseAngle = useMemo(() => 180 - angleTrans, [angleTrans]);

  // --------------------------------------------------------------------------
  // ΑΚΡΙΒΕΙΣ ΔΥΝΑΜΙΚΟΙ ΥΠΟΛΟΓΙΣΜΟΙ ΓΙΑ ΤΗΝ ΤΕΜΝΟΥΣΑ ΚΑΙ ΤΑ ΤΟΞΑ ΓΩΝΙΩΝ
  // --------------------------------------------------------------------------
  const geom = useMemo(() => {
    const rad = (angleTrans * Math.PI) / 180;
    const cot = 1 / Math.tan(rad);
    const cosVal = Math.cos(rad);
    const sinVal = Math.sin(rad);

    // Παράλληλες στα y = 100 (K) και y = 170 (Λ). Μέσο στα y = 135, x = 240
    const kX = 240 - 35 * cot;
    const lX = 240 + 35 * cot;

    // Άκρα τέμνουσας (μήκος πάνω και κάτω από το μέσο)
    const tX1 = 240 - 100 * cot;
    const tY1 = 135 - 100;
    const tX2 = 240 + 100 * cot;
    const tY2 = 135 + 100;

    const R = 28; // ακτίνα τόξων

    // Τόξο 1: Στο Κ, κάτω-δεξιά (Εσωτερική δεξιά οξεία γωνία = angleTrans)
    const arcK_InteriorRight = `M ${kX + R} 100 A ${R} ${R} 0 0 1 ${kX + R * cosVal} ${100 + R * sinVal}`;

    // Τόξο 2: Στο Λ, πάνω-αριστερά (Εσωτερική αριστερή οξεία γωνία = angleTrans)
    const arcL_InteriorLeft = `M ${lX - R} 170 A ${R} ${R} 0 0 1 ${lX - R * cosVal} ${170 - R * sinVal}`;

    // Τόξο 3: Στο Κ, πάνω-δεξιά (Εξωτερική δεξιά αμβλεία γωνία = obtuseAngle)
    const arcK_ExteriorRight = `M ${kX + R} 100 A ${R} ${R} 0 0 0 ${kX - R * cosVal} ${100 - R * sinVal}`;

    // Τόξο 4: Στο Λ, πάνω-δεξιά (Εσωτερική δεξιά αμβλεία γωνία = obtuseAngle)
    const arcL_InteriorRight = `M ${lX + R} 170 A ${R} ${R} 0 0 0 ${lX - R * cosVal} ${170 - R * sinVal}`;

    // Τόξο 5: Στο Λ, κάτω-δεξιά (Εξωτερική δεξιά οξεία γωνία = angleTrans)
    const arcL_ExteriorRight = `M ${lX + R} 170 A ${R} ${R} 0 0 1 ${lX + R * cosVal} ${170 + R * sinVal}`;

    return {
      kX,
      lX,
      tX1,
      tY1,
      tX2,
      tY2,
      cosVal,
      sinVal,
      arcK_InteriorRight,
      arcL_InteriorLeft,
      arcK_ExteriorRight,
      arcL_InteriorRight,
      arcL_ExteriorRight,
    };
  }, [angleTrans]);

  return (
    <Layout
      title={curr.pageTitle}
      description={curr.pageDesc}
      backUrl="/a-gymnasiou"
      backText={curr.backText}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/38-theseis-eutheion-ask"
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
            1. ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ ΔΥΟ ΕΥΘΕΙΩΝ ΣΤΟ ΕΠΙΠΕΔΟ + ΕΡΓΑΣΤΗΡΙΟ 1
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700 min-w-0">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card1Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card2Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card3Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec1Card4Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec1Card4Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec1Card4Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΕΣ ΣΧΕΤΙΚΕΣ ΘΕΣΕΙΣ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab1Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                  {[
                    { id: 'intersecting', label: curr.relModes.intersecting },
                    { id: 'perpendicular', label: curr.relModes.perpendicular },
                    { id: 'parallel', label: curr.relModes.parallel },
                    { id: 'coincident', label: curr.relModes.coincident },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRelPositionMode(m.id)}
                      className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                        relPositionMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {toCleanUppercase(m.label)}
                    </button>
                  ))}
                </div>

                {relPositionMode === 'intersecting' && (
                  <div className="space-y-2 pt-2 border-t border-slate-200 min-w-0">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                      <span>{toCleanUppercase(curr.lblAcuteAngleInter)}</span>
                      <span className="font-mono font-black text-indigo-700 text-sm">
                        {formatNumber(interAngle)}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="85"
                      step="1"
                      value={interAngle}
                      onChange={(e) => setInterAngle(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                )}

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.commonPointsLabel}{' '}
                    <span className="font-bold text-indigo-700">
                      {relPositionMode === 'intersecting' || relPositionMode === 'perpendicular'
                        ? curr.commonPoints1
                        : relPositionMode === 'parallel'
                        ? curr.commonPoints0
                        : curr.commonPointsInf}
                    </span>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.notationLabel}{' '}
                    <span className="font-bold">
                      {relPositionMode === 'intersecting' && curr.notIntersecting}
                      {relPositionMode === 'perpendicular' && curr.notPerpendicular}
                      {relPositionMode === 'parallel' && curr.notParallel}
                      {relPositionMode === 'coincident' && curr.notCoincident}
                    </span>
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
                    {relPositionMode === 'intersecting' && `${curr.visBadgeAngle} ${formatNumber(interAngle)}°`}
                    {relPositionMode === 'perpendicular' && curr.visBadgePerp}
                    {relPositionMode === 'parallel' && (locale === 'el' ? 'ε₁ // ε₂' : 'l₁ // l₂')}
                    {relPositionMode === 'coincident' && (locale === 'el' ? 'ε₁ ≡ ε₂' : 'l₁ ≡ l₂')}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 230" className="w-full max-w-[460px] h-auto max-h-[230px]">
                    <line x1="40" y1="120" x2="440" y2="120" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="124" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε₁' : 'l₁'}
                    </text>

                    {relPositionMode === 'parallel' && (
                      <g>
                        <line x1="40" y1="60" x2="440" y2="60" stroke="#f59e0b" strokeWidth="3" />
                        <text x="445" y="64" fill="#f59e0b" fontSize="13" fontWeight="bold">
                          {locale === 'el' ? 'ε₂' : 'l₂'}
                        </text>
                        <line x1="240" y1="60" x2="240" y2="120" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
                        <rect x="240" y="108" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <text x="248" y="95" fill="#6ee7b7" fontSize="11" fontStyle="italic">d</text>
                      </g>
                    )}

                    {relPositionMode === 'coincident' && (
                      <g>
                        <line x1="40" y1="120" x2="440" y2="120" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="8 6" />
                        <text x="445" y="140" fill="#f59e0b" fontSize="13" fontWeight="bold">
                          {curr.coincidentSuffix}
                        </text>
                      </g>
                    )}

                    {relPositionMode === 'perpendicular' && (
                      <g>
                        <line x1="240" y1="30" x2="240" y2="210" stroke="#f59e0b" strokeWidth="3" />
                        <text x="248" y="35" fill="#f59e0b" fontSize="13" fontWeight="bold">
                          {locale === 'el' ? 'ε₂' : 'l₂'}
                        </text>
                        <rect x="240" y="108" width="12" height="12" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                        <circle cx="240" cy="120" r="5" fill="#ffffff" />
                        <text x="222" y="140" fill="#ffffff" fontSize="12" fontWeight="bold">
                          {locale === 'el' ? 'Α' : 'A'}
                        </text>
                      </g>
                    )}

                    {relPositionMode === 'intersecting' && (
                      <g>
                        {(() => {
                          const rad = (interAngle * Math.PI) / 180;
                          const dx = 100 * Math.cos(rad);
                          const dy = 100 * Math.sin(rad);
                          return (
                            <>
                              <line x1={240 - dx} y1={120 + dy} x2={240 + dx} y2={120 - dy} stroke="#f59e0b" strokeWidth="3" />
                              <text x={240 + dx + 6} y={120 - dy} fill="#f59e0b" fontSize="13" fontWeight="bold">
                                {locale === 'el' ? 'ε₂' : 'l₂'}
                              </text>
                              <circle cx="240" cy="120" r="5" fill="#ffffff" />
                              <text x="238" y="142" fill="#ffffff" fontSize="12" fontWeight="bold">
                                {locale === 'el' ? 'Α' : 'A'}
                              </text>
                              <path
                                d={`M 270 120 A 30 30 0 0 0 ${240 + 30 * Math.cos(rad)} ${120 - 30 * Math.sin(rad)}`}
                                fill="none"
                                stroke="#fde68a"
                                strokeWidth="2"
                              />
                              <text x="280" y="112" fill="#fde68a" fontSize="11">{formatNumber(interAngle)}°</text>
                            </>
                          );
                        })()}
                      </g>
                    )}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 break-words [overflow-wrap:anywhere]">
                  {relPositionMode === 'intersecting' && curr.lab1ExplInter}
                  {relPositionMode === 'perpendicular' && curr.lab1ExplPerp}
                  {relPositionMode === 'parallel' && curr.lab1ExplPar}
                  {relPositionMode === 'coincident' && curr.lab1ExplCoinc}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΑΠΟΣΤΑΣΗ ΠΑΡΑΛΛΗΛΩΝ ΕΥΘΕΙΩΝ + ΕΡΓΑΣΤΗΡΙΟ 2
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed min-w-0">
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card1Text}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card2Text}
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec2Card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec2Card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec2Card3Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΔΡΑΣΤΙΚΗ ΑΠΟΣΤΑΣΗ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab3Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.lblDistParallels)}</span>
                    <span className="font-mono font-black text-indigo-700 text-base">
                      {formatDecimal(parallelDist / 10, 1)} cm
                    </span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="110"
                    step="5"
                    value={parallelDist}
                    onChange={(e) => setParallelDist(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {[-15, -5, 5, 15].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={(e) => handleStep(setParallelDist, step, 35, 110, e)}
                      className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {step > 0 ? `＋${formatNumber(step)}` : formatNumber(step)}
                    </button>
                  ))}
                  {[50, 70, 90].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setParallelDist(preset)}
                      className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                    >
                      {formatDecimal(preset / 10, 1)} cm
                    </button>
                  ))}
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-1.5 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.distLabelBullet} <strong>{formatDecimal(parallelDist / 10, 1)} cm</strong>
                  </div>
                  <div className="break-words [overflow-wrap:anywhere]">
                    {curr.perpSegmentsLabel}
                  </div>
                  <div className="font-bold text-indigo-700 pt-1 border-t border-slate-100 break-words [overflow-wrap:anywhere]">
                    {curr.constantWidthInfo}
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
                    d ＝ {formatDecimal(parallelDist / 10, 1)} cm
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 230" className="w-full max-w-[460px] h-auto max-h-[230px]">
                    <line x1="40" y1="180" x2="440" y2="180" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="184" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε₂' : 'l₂'}
                    </text>

                    <line x1="40" y1={180 - parallelDist} x2="440" y2={180 - parallelDist} stroke="#f59e0b" strokeWidth="3" />
                    <text x="445" y={184 - parallelDist} fill="#f59e0b" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε₁' : 'l₁'}
                    </text>

                    {[120, 240, 360].map((xPos, idx) => (
                      <g key={idx}>
                        <line
                          x1={xPos}
                          y1={180 - parallelDist}
                          x2={xPos}
                          y2="180"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeDasharray="4 3"
                        />
                        <rect x={xPos} y="168" width="12" height="12" fill="none" stroke="#10b981" strokeWidth="1.5" />
                        <circle cx={xPos} cy={180 - parallelDist} r="4" fill="#f59e0b" />
                        <circle cx={xPos} cy="180" r="4" fill="#38bdf8" />
                        <text x={xPos + 6} y={180 - parallelDist / 2 + 4} fill="#6ee7b7" fontSize="11" fontWeight="bold">
                          {formatDecimal(parallelDist / 10, 1)}
                        </text>
                      </g>
                    ))}
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
            3. ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΩΝ ΠΟΥ ΤΕΜΝΟΝΤΑΙ ΑΠΟ ΤΡΙΤΗ + ΕΡΓΑΣΤΗΡΙΟ 3
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

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed break-words [overflow-wrap:anywhere]">
            {curr.sec3Intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed min-w-0">
            {/* Εντός Εναλλάξ */}
            <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec3Card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec3Card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec3Card1Text}
              </p>
              <div className="p-2 bg-white rounded-lg border border-indigo-200 font-mono text-center font-bold text-indigo-950 break-words [overflow-wrap:anywhere]">
                {curr.sec3Card1Box}
              </div>
            </div>

            {/* Εντός, Εκτός και Επί τα Αυτά */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec3Card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec3Card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec3Card2Text}
              </p>
              <div className="p-2 bg-white rounded-lg border border-emerald-200 font-mono text-center font-bold text-emerald-950 break-words [overflow-wrap:anywhere]">
                {curr.sec3Card2Box}
              </div>
            </div>

            {/* Εντός και Επί τα Αυτά */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(curr.sec3Card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{curr.sec3Card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {curr.sec3Card3Text}
              </p>
              <div className="p-2 bg-white rounded-lg border border-amber-200 font-mono text-center font-bold text-amber-950 break-words [overflow-wrap:anywhere]">
                {curr.sec3Card3Box}
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΙΑΔΡΑΣΤΙΚΕΣ ΓΩΝΙΕΣ ΠΑΡΑΛΛΗΛΩΝ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              🛠️ {curr.lab2Header}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start min-w-0">
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {toCleanUppercase(curr.lblSelectPair)}
                  </span>
                  <div className="grid grid-cols-1 gap-2 min-w-0">
                    {[
                      { id: 'alternateInterior', label: curr.pairModes.alternateInterior },
                      { id: 'corresponding', label: curr.pairModes.corresponding },
                      { id: 'consecutiveInterior', label: curr.pairModes.consecutiveInterior },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setAnglePairHighlight(p.id)}
                        className={`p-2.5 rounded-xl font-black text-xs border transition-all active:scale-95 text-left flex justify-between items-center break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                          anglePairHighlight === p.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="break-words [overflow-wrap:anywhere]">{toCleanUppercase(p.label)}</span>
                        {anglePairHighlight === p.id && <span className="ml-2 shrink-0">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200 min-w-0">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700 uppercase">
                    <span>{toCleanUppercase(curr.lblTransversalSlope)}</span>
                    <span className="font-mono font-black text-amber-700 text-sm">{formatNumber(angleTrans)}°</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="80"
                    step="1"
                    value={angleTrans}
                    onChange={(e) => setAngleTrans(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1 min-w-0">
                    {[-10, -1, 1, 10].map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={(e) => handleStep(setAngleTrans, step, 35, 80, e)}
                        className="px-2.5 py-1 rounded bg-white border border-slate-300 font-bold text-xs font-mono active:scale-95"
                      >
                        {step > 0 ? `＋${formatNumber(step)}°` : `－${formatNumber(Math.abs(step))}°`}
                      </button>
                    ))}
                    {[45, 60].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAngleTrans(preset)}
                        className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 font-bold text-xs font-mono active:scale-95"
                      >
                        {formatNumber(preset)}°
                      </button>
                    ))}
                  </div>
                </div>

                {/* Πίνακας Τιμών Γωνιών */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-2 text-slate-700 min-w-0">
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100 flex-wrap gap-1">
                    <span>{curr.acuteAnglesBullet}</span>
                    <strong className="text-amber-600 font-bold text-sm">{formatNumber(angleTrans)}°</strong>
                  </div>
                  <div className="flex justify-between items-center pb-1 border-b border-slate-100 flex-wrap gap-1">
                    <span>{curr.obtuseAnglesBullet}</span>
                    <strong className="text-indigo-600 font-bold text-sm">{formatNumber(obtuseAngle)}°</strong>
                  </div>
                  <div className="text-[11px] font-sans text-slate-600 break-words [overflow-wrap:anywhere]">
                    {anglePairHighlight === 'alternateInterior' && (
                      <span className="text-indigo-700 font-bold">
                        {curr.explAltInt} ({formatNumber(angleTrans)}° ＝ {formatNumber(angleTrans)}°).
                      </span>
                    )}
                    {anglePairHighlight === 'corresponding' && (
                      <span className="text-emerald-700 font-bold">
                        {curr.explCorr} ({formatNumber(angleTrans)}° ＝ {formatNumber(angleTrans)}°).
                      </span>
                    )}
                    {anglePairHighlight === 'consecutiveInterior' && (
                      <span className="text-amber-700 font-bold">
                        {curr.explConsecInt} {formatNumber(angleTrans)}° ＋ {formatNumber(obtuseAngle)}° ＝ 180°.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic SVG Visualizer με απόλυτη εφαρμογή τόξων και σημείων */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2 min-w-0">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(curr.visLab2Header)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    {anglePairHighlight === 'alternateInterior' &&
                      `${curr.visBadgeAltInt} ${formatNumber(angleTrans)}° ＝ ${formatNumber(angleTrans)}°`}
                    {anglePairHighlight === 'corresponding' &&
                      `${curr.visBadgeCorr} ${formatNumber(angleTrans)}° ＝ ${formatNumber(angleTrans)}°`}
                    {anglePairHighlight === 'consecutiveInterior' &&
                      `${curr.visBadgeConsecInt} ${formatNumber(angleTrans)}° ＋ ${formatNumber(obtuseAngle)}° ＝ 180°`}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg viewBox="0 0 480 270" className="w-full max-w-[460px] h-auto max-h-[250px]">
                    <line x1="40" y1="100" x2="440" y2="100" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="104" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε₁' : 'l₁'}
                    </text>

                    <line x1="40" y1="170" x2="440" y2="170" stroke="#38bdf8" strokeWidth="3" />
                    <text x="445" y="174" fill="#38bdf8" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε₂' : 'l₂'}
                    </text>

                    <line
                      x1={geom.tX1}
                      y1={geom.tY1}
                      x2={geom.tX2}
                      y2={geom.tY2}
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                    />
                    <text x={geom.tX2 + 8} y={geom.tY2} fill="#f59e0b" fontSize="13" fontWeight="bold">
                      {locale === 'el' ? 'ε₃' : 'l₃'}
                    </text>

                    {anglePairHighlight === 'alternateInterior' && (
                      <g>
                        <path
                          d={geom.arcK_InteriorRight}
                          fill="rgba(192, 132, 252, 0.25)"
                          stroke="#c084fc"
                          strokeWidth="2.5"
                        />
                        <text x={geom.kX + 18} y="126" fill="#c084fc" fontSize="11" fontWeight="bold">
                          {formatNumber(angleTrans)}°
                        </text>

                        <path
                          d={geom.arcL_InteriorLeft}
                          fill="rgba(192, 132, 252, 0.25)"
                          stroke="#c084fc"
                          strokeWidth="2.5"
                        />
                        <text x={geom.lX - 44} y="152" fill="#c084fc" fontSize="11" fontWeight="bold">
                          {formatNumber(angleTrans)}°
                        </text>
                      </g>
                    )}

                    {anglePairHighlight === 'corresponding' && (
                      <g>
                        <path
                          d={geom.arcK_InteriorRight}
                          fill="rgba(16, 185, 129, 0.25)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                        <text x={geom.kX + 18} y="126" fill="#6ee7b7" fontSize="11" fontWeight="bold">
                          {formatNumber(angleTrans)}°
                        </text>

                        <path
                          d={geom.arcL_ExteriorRight}
                          fill="rgba(16, 185, 129, 0.25)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                        <text x={geom.lX + 18} y="196" fill="#6ee7b7" fontSize="11" fontWeight="bold">
                          {formatNumber(angleTrans)}°
                        </text>
                      </g>
                    )}

                    {anglePairHighlight === 'consecutiveInterior' && (
                      <g>
                        <path
                          d={geom.arcK_InteriorRight}
                          fill="rgba(245, 158, 11, 0.25)"
                          stroke="#f59e0b"
                          strokeWidth="2.5"
                        />
                        <text x={geom.kX + 18} y="126" fill="#fde68a" fontSize="11" fontWeight="bold">
                          {formatNumber(angleTrans)}°
                        </text>

                        <path
                          d={geom.arcL_InteriorRight}
                          fill="rgba(56, 189, 248, 0.25)"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                        />
                        <text x={geom.lX + 12} y="152" fill="#7dd3fc" fontSize="11" fontWeight="bold">
                          {formatNumber(obtuseAngle)}°
                        </text>
                      </g>
                    )}

                    <circle cx={geom.kX} cy="100" r="5" fill="#ffffff" />
                    <text x={geom.kX - 16} y="94" fill="#ffffff" fontSize="12" fontWeight="bold">
                      {locale === 'el' ? 'Κ' : 'K'}
                    </text>

                    <circle cx={geom.lX} cy="170" r="5" fill="#ffffff" />
                    <text x={geom.lX - 16} y="188" fill="#ffffff" fontSize="12" fontWeight="bold">
                      {locale === 'el' ? 'Λ' : 'L'}
                    </text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 break-words [overflow-wrap:anywhere]">
                  {curr.lab2ExplGeneral}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΚΡΙΤΗΡΙΑ ΠΑΡΑΛΛΗΛΙΑΣ ΕΥΘΕΙΩΝ
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

          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs sm:text-sm leading-relaxed text-slate-700 min-w-0">
            <h3 className="font-bold text-slate-900 text-base break-words [overflow-wrap:anywhere]">
              {curr.sec4SubTitle}
            </h3>
            <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
              {curr.sec4Text}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 min-w-0">
              <div className="bg-white p-3.5 rounded-xl border border-indigo-200 space-y-1 min-w-0">
                <span className="font-bold text-indigo-950 block">{curr.crit1Title}</span>
                <div className="break-words [overflow-wrap:anywhere]">{curr.crit1Text}</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1 min-w-0">
                <span className="font-bold text-emerald-950 block">{curr.crit2Title}</span>
                <div className="break-words [overflow-wrap:anywhere]">{curr.crit2Text}</div>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1 min-w-0">
                <span className="font-bold text-amber-950 block">{curr.crit3Title}</span>
                <div className="break-words [overflow-wrap:anywhere]">{curr.crit3Text}</div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-800 break-words [overflow-wrap:anywhere]">
              <strong>{curr.extraPerpCritLead}</strong> {curr.extraPerpCritText}
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
                <div className="text-emerald-700 font-bold break-words [overflow-wrap:anywhere]">
                  {curr.prob2Step2}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
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
          className="pb-0.5 px-1 sm:px-1.5 border-b-2 w-full text-center break-all"
          style={{ borderColor: 'currentColor' }}
        >
          {displayNum}
        </span>
        <span className="pt-0.5 px-1 sm:px-1.5 w-full text-center break-all">
          {displayDen}
        </span>
      </span>
    </span>
  );
}

// ============================================================================
// ΚΑΘΑΡΙΣΜΟΣ ΤΟΝΩΝ ΓΙΑ ΚΕΦΑΛΑΙΑ (Διατηρείται μόνο το Α')
// ============================================================================
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
    pageTitle: "Βασικές Γεωμετρικές Έννοιες | Α' Γυμνασίου",
    pageDesc:
      'Σημείο, ευθεία, ημιευθεία, ευθύγραμμο τμήμα, μέσο τμήματος, απόσταση σημείων, επίπεδο, διαδοχικά τμήματα και τεθλασμένες γραμμές με διαδραστικά εργαστήρια.',
    navGrade: "Α' Γυμνασίου",
    exercisesBtn: 'ΑΣΚΗΣΕΙΣ',
    bannerBadge: "Α' ΓΥΜΝΑΣΙΟΥ • ΚΕΦΑΛΑΙΟ ΓΕΩΜΕΤΡΙΑΣ 01 • ΘΕΩΡΙΑ & ΕΡΓΑΣΤΗΡΙΟ",
    bannerTitle: 'Βασικές Γεωμετρικές Έννοιες & Σχήματα',
    bannerSubtitle:
      'Εξερευνούμε διαδραστικά τα θεμέλια της Ευκλείδειας Γεωμετρίας: το σημείο, την ευθεία, την ημιευθεία, το ευθύγραμμο τμήμα, το μέσο τμήματος, το επίπεδο και τις τεθλασμένες γραμμές.',

    // Section 1
    sec1Title: 'Σημείο, Ευθεία, Ημιευθεία, Ευθύγραμμο Τμήμα & Επίπεδο',
    card1Badge: '1. ΣΗΜΕΙΟ',
    card1Title: 'Αδιάστατο',
    card1Text:
      'Δεν έχει μήκος, πλάτος ή ύψος. Συμβολίζεται με κεφαλαία ελληνικά γράμματα (Α, Β, Γ, Μ...). Σημεία που ανήκουν στην ίδια ευθεία λέγονται συνευθειακά.',

    card2Badge: '2. ΕΥΘΕΙΑ',
    card2Title: 'Χωρίς Αρχή & Τέλος',
    card2Text:
      'Εκτείνεται απεριόριστα και προς τις δύο κατευθύνσεις. Από δύο σημεία Α και Β διέρχεται μία και μοναδική ευθεία (συμβολίζεται ε ή ΑΒ).',

    card3Badge: '3. ΗΜΙΕΥΘΕΙΑ',
    card3Title: 'Έχει Αρχή, όχι Τέλος',
    card3Text:
      'Ένα σημείο Ο πάνω σε μια ευθεία τη χωρίζει σε δύο αντικείμενες ημιευθείες (Οx και Οy) που έχουν κοινή αρχή το Ο.',

    card4Badge: '4. ΕΥΘ. ΤΜΗΜΑ',
    card4Title: 'Έχει Αρχή & Τέλος',
    card4Text:
      'Το κομμάτι της ευθείας ανάμεσα σε δύο σημεία Α και Β (τα άκρα του). Είναι η συντομότερη οδός που ενώνει το Α με το Β.',

    card5Badge: '5. ΕΠΙΠΕΔΟ',
    card5Title: 'Επιφάνεια (π)',
    card5Text:
      'Μια λεία επιφάνεια που εκτείνεται απεριόριστα προς κάθε κατεύθυνση. Το παριστάνουμε με ένα παραλληλόγραμμο και το συμβολίζουμε με π, ρ, σ.',

    lab1Title:
      '🛠️ Εργαστήριο 1: Πάτησε σε κάθε έννοια για να τη δεις να ζωντανεύει πάνω στο Επίπεδο π',
    lab1VisualHeader: 'ΟΠΤΙΚΟΠΟΙΗΣΗ ΣΤΟ ΕΠΙΠΕΔΟ π',
    btnPoint: '1. ΣΗΜΕΙΑ (Α, Ο, Β)',
    btnPointDesc: 'Συνευθειακά σημεία',
    btnLine: '2. ΕΥΘΕΙΑ (ε ή ΑΒ)',
    btnLineDesc: 'Απεριόριστη και στις 2 μεριές',
    btnRayRight: '3. ΗΜΙΕΥΘΕΙΑ Οx',
    btnRayRightDesc: 'Αρχή το Ο, προς τα δεξιά',
    btnRayLeft: '4. ΗΜΙΕΥΘΕΙΑ Οy',
    btnRayLeftDesc: 'Αντικείμενη της Οx (αριστερά)',
    btnSegment: '5. ΕΥΘ. ΤΜΗΜΑ ΑΒ',
    btnSegmentDesc: 'Περιορίζεται στα άκρα Α, Β',
    btnPlane: '6. ΕΠΙΠΕΔΟ (π)',
    btnPlaneDesc: 'Ολόκληρη η επιφάνεια',

    badgePoint: 'ΣΗΜΕΙΑ Α, Ο, Β',
    badgeLine: 'ΕΥΘΕΙΑ ε (ΑΒ)',
    badgeRayRight: 'ΗΜΙΕΥΘΕΙΑ Οx',
    badgeRayLeft: 'ΗΜΙΕΥΘΕΙΑ Οy (ΑΝΤΙΚΕΙΜΕΝΗ)',
    badgeSegment: 'ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ ΑΒ',
    badgePlane: 'ΕΠΙΠΕΔΟ π',

    svgLineText: 'Ευθεία ε (χωρίς αρχή και χωρίς τέλος)',
    svgRayRightText: 'Ημιευθεία Οx (αρχή το Ο)',
    svgRayLeftText: 'Αντικείμενη Ημιευθεία Οy (αρχή το Ο)',
    svgSegmentText: 'Ευθύγραμμο Τμήμα ΑΒ (άκρα Α και Β)',

    infoPoint:
      'Σημεία Α, Ο, Β: Επειδή βρίσκονται όλα πάνω στην ίδια ευθεία ε, ονομάζονται συνευθειακά σημεία.',
    infoLine:
      'Ευθεία ε (ή ΑΒ): Τα βέλη στα δύο άκρα δείχνουν ότι η ευθεία προεκτείνεται απεριόριστα και προς τις δύο κατευθύνσεις (δεν έχει μήκος).',
    infoRayRight:
      'Ημιευθεία Οx: Ξεκινά από το σημείο Ο (αρχή), περνά από το Β και προεκτείνεται απεριόριστα προς το x.',
    infoRayLeft:
      'Ημιευθεία Οy: Έχει την ίδια αρχή Ο με την Οx, αποτελεί προέκτασή της προς την αντίθετη κατεύθυνση και μαζί σχηματίζουν ολόκληρη την ευθεία. Οι Οx και Οy λέγονται αντικείμενες ημιευθείες.',
    infoSegment:
      'Ευθύγραμμο Τμήμα ΑΒ: Περιλαμβάνει μόνο τα σημεία της ευθείας που βρίσκονται ανάμεσα στα άκρα Α και Β. Έχει συγκεκριμένο μήκος που μπορεί να μετρηθεί!',
    infoPlane:
      'Επίπεδο π: Περιέχει όλα τα σημεία, τις ευθείες και τα ευθύγραμμα τμήματα του σχήματος. Από τρία μη συνευθειακά σημεία διέρχεται ένα και μοναδικό επίπεδο.',

    // Section 2
    sec2Title: 'Απόσταση Σημείων, Μέσο Τμήματος & Σύγκριση Ευθυγράμμων Τμημάτων',
    distBadge: 'ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΩΝ',
    distTitle: 'Μήκος Τμήματος ΑΒ',
    distText:
      'Απόσταση δύο σημείων Α και Β ονομάζεται το μήκος του ευθύγραμμου τμήματος ΑΒ (μετράται με τον βαθμονομημένο κανόνα/χάρακα σε cm, m, km κ.λπ.).',

    midBadge: 'ΜΕΣΟ ΤΜΗΜΑΤΟΣ (Μ)',
    midTitle: 'Χωρισμός σε 2 Ίσα Μέρη',
    midText:
      'Μέσο ενός ευθύγραμμου τμήματος ΑΒ ονομάζεται το εσωτερικό του σημείο Μ που ισαπέχει από τα άκρα του:',

    compBadge: 'ΣΥΓΚΡΙΣΗ ΤΜΗΜΑΤΩΝ',
    compTitle: 'Μεταφορά ή Μέτρηση',
    compText:
      'Για να συγκρίνουμε δύο τμήματα ΑΒ και ΓΔ, είτε μετράμε τα μήκη τους με χάρακα είτε μεταφέρουμε με διαβήτη το ένα πάνω στο άλλο ώστε να συμπέσουν οι αρχές τους.',

    lab2Title:
      '🛠️ Εργαστήριο 2: Μέτρηση Απόστασης ΑΒ, Αυτόματο Μέσο Μ & Σύγκριση με το ΓΔ',
    lblPosA: 'ΘΕΣΗ Α (cm)',
    lblPosB: 'ΘΕΣΗ Β (cm)',
    lblLenCD: 'ΜΗΚΟΣ ΓΔ (cm)',
    calcDistAB: 'Απόσταση ΑΒ:',
    calcMidM: 'Μέσο Μ: Χωρίζει το ΑΒ σε ΑΜ ＝ ΜΒ ＝ ',
    lab2VisualHeader: 'ΒΑΘΜΟΝΟΜΗΜΕΝΟΣ ΧΑΡΑΚΑΣ & ΣΥΓΚΡΙΣΗ',
    compEqual: 'ΑΒ ＝ ΓΔ (ΙΣΑ ΤΜΗΜΑΤΑ)',
    compGreater: 'ΑΒ ＞ ΓΔ (ΑΒ ΜΕΓΑΛΥΤΕΡΟ)',
    compLess: 'ΑΒ ＜ ΓΔ (ΑΒ ΜΙΚΡΟΤΕΡΟ)',
    midLabel: 'Μ (Μέσο)',
    compExpLead: 'Για να συγκρίνουμε τα τμήματα',
    compExpMid: ', τοποθετήσαμε την αρχή Γ πάνω από την αρχή Α: επειδή το Δ πέφτει',
    compExpEqEnd: 'ακριβώς πάνω στο Β, ισχύει ΑΒ ＝ ΓΔ!',
    compExpGtEnd: 'πριν από το Β (εσωτερικά του ΑΒ), ισχύει ΑΒ ＞ ΓΔ!',
    compExpLtEnd: 'πέρα από το Β (εξωτερικά του ΑΒ), ισχύει ΑΒ ＜ ΓΔ!',

    // Section 3
    sec3Title: 'Διαδοχικά Ευθύγραμμα Τμήματα & Τεθλασμένες Γραμμές',
    consecBadge: 'ΔΙΑΔΟΧΙΚΑ ΤΜΗΜΑΤΑ',
    consecTitle: 'Το τέλος του 1ου = Αρχή του 2ου',
    consecText:
      'Δύο ή περισσότερα ευθύγραμμα τμήματα (π.χ. ΑΒ, ΒΓ, ΓΔ) λέγονται διαδοχικά αν το τέλος του καθενός είναι η αρχή του επόμενου και δεν έχουν άλλα κοινά σημεία.',

    polyBadge: 'ΤΕΘΛΑΣΜΕΝΗ ΓΡΑΜΜΗ',
    polyTitle: 'Ανοιχτή ή Κλειστή',
    polyText:
      'Το σχήμα που σχηματίζουν διαδοχικά τμήματα όταν δεν βρίσκονται στην ίδια ευθεία λέγεται τεθλασμένη γραμμή. Αν το τέλος του τελευταίου συμπίπτει με την αρχή του πρώτου, λέγεται κλειστή τεθλασμένη (πολύγωνο).',

    propBadge: 'ΘΕΜΕΛΙΩΔΗΣ ΙΔΙΟΤΗΤΑ',
    propTitle: 'Η Συντομότερη Διαδρομή',
    propText:
      'Το μήκος του ευθύγραμμου τμήματος ΑΔ που ενώνει απευθείας τα άκρα μιας τεθλασμένης γραμμής ΑΒΓΔ είναι πάντα μικρότερο από το συνολικό μήκος της τεθλασμένης:',

    lab3Title:
      '🛠️ Εργαστήριο 3: Πειραματίσου με Διαδοχικά Τμήματα & Τεθλασμένες Γραμμές',
    btnOpenPoly: 'ΑΝΟΙΧΤΗ ΤΕΘΛΑΣΜΕΝΗ',
    btnClosedPoly: 'ΚΛΕΙΣΤΗ (ΠΟΛΥΓΩΝΟ)',
    btnCollinear: 'ΣΥΝΕΥΘΕΙΑΚΑ (ΕΥΘΕΙΑ)',
    btnShortest: 'ΣΥΝΤΟΜΟΤΕΡΗ ΟΔΟΣ',
    lblSegAB: 'ΑΒ (m)',
    lblSegBC: 'ΒΓ (m)',
    lblSegCD: 'ΓΔ (m)',
    totalPolyLabel: 'Συνολικό μήκος διαδοχικών τμημάτων:',
    lab3VisualHeader: 'ΜΟΡΦΗ ΓΡΑΜΜΗΣ (ΔΥΝΑΜΙΚΗ ΚΛΙΜΑΚΑ)',
    totalLengthBadge: 'ΜΗΚΟΣ:',
    triangleCannotClose:
      '⚠️ Τα τμήματα δεν μπορούν να κλείσουν σε τρίγωνο!',
    triangleInequalityDesc:
      'Το μεγαλύτερο τμήμα πρέπει να είναι αυστηρά μικρότερο από το άθροισμα των δύο άλλων.',
    shortestApprox: 'ΑΔ ≈ ',
    infoOpenPoly:
      'Ανοιχτή Τεθλασμένη Γραμμή ΑΒΓΔ: Τα τμήματα ΑΒ, ΒΓ και ΓΔ μεταβάλλονται ζωντανά στο σχήμα! Τα σημεία Α, Β, Γ, Δ λέγονται κορυφές και τα ΑΒ, ΒΓ, ΓΔ πλευρές της τεθλασμένης.',
    infoClosedPolySuccess:
      'Κλειστή Τεθλασμένη Γραμμή (Πολύγωνο): Το τέλος του τρίτου τμήματος συμπίπτει με την αρχή Α του πρώτου τμήματος, σχηματίζοντας ένα τρίγωνο!',
    infoClosedPolyFail:
      'Κλειστή Τεθλασμένη Γραμμή (Πολύγωνο): Δοκίμασε να αυξήσεις τα μικρά τμήματα ή να μειώσεις το μεγάλο ώστε να μπορέσει να κλείσει η τεθλασμένη γραμμή!',
    infoCollinear:
      'Διαδοχικά Συνευθειακά Τμήματα: Όταν τα διαδοχικά τμήματα βρίσκονται πάνω στην ίδια ευθεία, ΔΕΝ σχηματίζουν τεθλασμένη γραμμή, αλλά ένα ενιαίο ευθύγραμμο τμήμα ΑΔ μήκους ',
    infoShortest:
      'Συντομότερη Διαδρομή: Το ευθύγραμμο τμήμα ΑΔ που ενώνει απευθείας το Α με το Δ είναι μικρότερο από το μήκος της τεθλασμένης ΑΒ ＋ ΒΓ ＋ ΓΔ.',

    // Section 4
    sec4Title: 'Παραδείγματα με Προβλήματα',
    prob1Badge: 'ΠΡΟΒΛΗΜΑ 1: ΜΕΣΟ ΕΥΘΥΓΡΑΜΜΟΥ ΤΜΗΜΑΤΟΣ',
    prob1Title: 'Σταθμός Ανεφοδιασμού σε Αυτοκινητόδρομο',
    prob1Desc:
      'Πάνω σε έναν ευθύγραμμο αυτοκινητόδρομο βρίσκονται με τη σειρά οι πόλεις Α, Β και Γ. Η απόσταση ΑΒ είναι 80 km και η ΒΓ είναι 40 km. Αν στο μέσο Μ της συνολικής διαδρομής ΑΓ κατασκευαστεί ένας σταθμός ανεφοδιασμού, πόσο απέχει ο σταθμός Μ από την πόλη Β;',
    solTitle: 'Αναλυτική Λύση:',
    prob1Step1: '1. Συνολική απόσταση: ΑΓ ＝ ΑΒ ＋ ΒΓ ＝ 80 ＋ 40 ＝ ',
    prob1Step2Lead: '2. Επειδή το Μ είναι το μέσο του ΑΓ: ΑΜ ＝ ',
    prob1Step3: '3. Απόσταση από την πόλη Β: ΜΒ ＝ ΑΒ － ΑΜ ＝ 80 － 60 ＝ 20 km.',

    prob2Badge: 'ΠΡΟΒΛΗΜΑ 2: ΤΕΘΛΑΣΜΕΝΗ VS ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ',
    prob2Title: 'Εξοικονόμηση Καλωδίου Οπτικής Ίνας',
    prob2Desc:
      'Για να συνδεθεί το κτίριο Α με το κτίριο Δ, μια εταιρεία μπορεί είτε να ακολουθήσει την τεθλασμένη διαδρομή των δρόμων ΑΒ ＝ 120 m, ΒΓ ＝ 90 m, ΓΔ ＝ 140 m, είτε να περάσει απευθείας υπόγειο καλώδιο κατά μήκος του ευθύγραμμου τμήματος ΑΔ ＝ 260 m. Αν κάθε μέτρο καλωδίου κοστίζει 8 €, πόσα ευρώ εξοικονομεί με την απευθείας σύνδεση;',
    prob2Step1: '1. Μήκος τεθλασμένης: L ＝ 120 ＋ 90 ＋ 140 ＝ ',
    prob2Step2: '2. Μήκος που εξοικονομείται: 350 － 260 ＝ ',
    prob2Step3: '3. Οικονομικό όφελος: 90 · 8 ＝ 720 €.',
  },
  en: {
    pageTitle: 'Basic Geometric Concepts | Grade 7',
    pageDesc:
      'Point, line, ray, line segment, midpoint, distance between points, plane, consecutive segments, and polygonal paths with interactive labs.',
    navGrade: 'Grade 7',
    exercisesBtn: 'EXERCISES',
    bannerBadge: 'GRADE 7 • GEOMETRY CHAPTER 01 • THEORY & LAB',
    bannerTitle: 'Basic Geometric Concepts & Figures',
    bannerSubtitle:
      'Explore interactively the Euclidean foundations: points, lines, rays, line segments, midpoints, planes, and polygonal chains.',

    // Section 1
    sec1Title: 'Point, Line, Ray, Line Segment & Plane',
    card1Badge: '1. POINT',
    card1Title: 'Zero-dimensional',
    card1Text:
      'It has no length, width, or height. It is represented by uppercase Latin or Greek letters (A, B, C, M...). Points lying on the same line are called collinear.',

    card2Badge: '2. LINE',
    card2Title: 'No Endpoints',
    card2Text:
      'Extends infinitely in both directions. Through any two distinct points A and B passes exactly one unique line (denoted as l or AB).',

    card3Badge: '3. RAY',
    card3Title: 'One Endpoint',
    card3Text:
      'A point O on a line divides it into two opposite rays (Ox and Oy) sharing O as their common starting point.',

    card4Badge: '4. SEGMENT',
    card4Title: 'Two Endpoints',
    card4Text:
      'The part of a straight line between two endpoints A and B. It is the shortest path connecting A and B.',

    card5Badge: '5. PLANE',
    card5Title: 'Flat Surface (π)',
    card5Text:
      'A flat surface extending indefinitely in all directions. Often depicted as a parallelogram and labeled with letters such as π, ρ, or σ.',

    lab1Title:
      '🛠️ Lab 1: Click any concept to see it come to life on Plane π',
    lab1VisualHeader: 'VISUALIZATION ON PLANE π',
    btnPoint: '1. POINTS (A, O, B)',
    btnPointDesc: 'Collinear points',
    btnLine: '2. LINE (l or AB)',
    btnLineDesc: 'Infinite in both directions',
    btnRayRight: '3. RAY Ox',
    btnRayRightDesc: 'Starts at O, goes right',
    btnRayLeft: '4. RAY Oy',
    btnRayLeftDesc: 'Opposite to Ox (goes left)',
    btnSegment: '5. SEGMENT AB',
    btnSegmentDesc: 'Bounded by endpoints A, B',
    btnPlane: '6. PLANE (π)',
    btnPlaneDesc: 'The entire surface',

    badgePoint: 'POINTS A, O, B',
    badgeLine: 'LINE l (AB)',
    badgeRayRight: 'RAY Ox',
    badgeRayLeft: 'OPPOSITE RAY Oy',
    badgeSegment: 'LINE SEGMENT AB',
    badgePlane: 'PLANE π',

    svgLineText: 'Line l (extends infinitely in both directions)',
    svgRayRightText: 'Ray Ox (starts at origin O)',
    svgRayLeftText: 'Opposite Ray Oy (starts at origin O)',
    svgSegmentText: 'Line Segment AB (endpoints A and B)',

    infoPoint:
      'Points A, O, B: Because they all lie on the exact same line l, they are called collinear points.',
    infoLine:
      'Line l (or AB): The arrows on both ends show that the line extends indefinitely in both directions (it has infinite length).',
    infoRayRight:
      'Ray Ox: Starts at point O (origin), passes through B, and extends infinitely toward x.',
    infoRayLeft:
      'Ray Oy: Shares origin O with Ox, extends in the opposite direction, and together they form the full straight line. They are opposite rays.',
    infoSegment:
      'Line Segment AB: Contains strictly the points of the line between endpoints A and B. It has a measurable finite length!',
    infoPlane:
      'Plane π: Contains all points, lines, and segments shown. Any three non-collinear points define a unique plane.',

    // Section 2
    sec2Title: 'Distance Between Points, Midpoint & Segment Comparison',
    distBadge: 'DISTANCE',
    distTitle: 'Length of Segment AB',
    distText:
      'The distance between two points A and B is the length of segment AB (measured using a graduated ruler in cm, m, km, etc.).',

    midBadge: 'MIDPOINT (M)',
    midTitle: 'Bisected into 2 Equal Parts',
    midText:
      'The midpoint of a segment AB is the interior point M equidistant from its endpoints:',

    compBadge: 'COMPARISON',
    compTitle: 'Superposition or Measurement',
    compText:
      'To compare two segments AB and CD, we either measure their lengths with a ruler or superimpose them using a compass so that their origins match.',

    lab2Title:
      '🛠️ Lab 2: Measure Distance AB, Auto Midpoint M & Compare with CD',
    lblPosA: 'POSITION A (cm)',
    lblPosB: 'POSITION B (cm)',
    lblLenCD: 'LENGTH CD (cm)',
    calcDistAB: 'Distance AB:',
    calcMidM: 'Midpoint M: Divides AB into AM ＝ MB ＝ ',
    lab2VisualHeader: 'GRADUATED RULER & COMPARISON',
    compEqual: 'AB ＝ CD (CONGRUENT SEGMENTS)',
    compGreater: 'AB ＞ CD (AB IS LONGER)',
    compLess: 'AB ＜ CD (AB IS SHORTER)',
    midLabel: 'M (Midpoint)',
    compExpLead: 'To compare segments',
    compExpMid: ', we aligned origin C directly over origin A: since D lands',
    compExpEqEnd: 'exactly on B, therefore AB ＝ CD!',
    compExpGtEnd: 'before B (inside AB), therefore AB ＞ CD!',
    compExpLtEnd: 'beyond B (outside AB), therefore AB ＜ CD!',

    // Section 3
    sec3Title: 'Consecutive Segments & Polygonal Paths',
    consecBadge: 'CONSECUTIVE SEGMENTS',
    consecTitle: 'End of 1st = Start of 2nd',
    consecText:
      'Two or more line segments (e.g., AB, BC, CD) are consecutive if each segment ends where the next begins, sharing no other points.',

    polyBadge: 'POLYGONAL PATH',
    polyTitle: 'Open or Closed',
    polyText:
      'The figure formed by consecutive segments not lying on the same straight line is a polygonal path. If the end of the last segment meets the start of the first, it forms a closed polygon.',

    propBadge: 'FUNDAMENTAL PROPERTY',
    propTitle: 'The Shortest Path',
    propText:
      'The straight segment AD connecting the endpoints of a polygonal path ABCD is strictly shorter than the total path length:',

    lab3Title:
      '🛠️ Lab 3: Experiment with Consecutive Segments & Polygonal Chains',
    btnOpenPoly: 'OPEN POLYGONAL PATH',
    btnClosedPoly: 'CLOSED (POLYGON)',
    btnCollinear: 'COLLINEAR (LINE)',
    btnShortest: 'SHORTEST PATH',
    lblSegAB: 'AB (m)',
    lblSegBC: 'BC (m)',
    lblSegCD: 'CD (m)',
    totalPolyLabel: 'Total length of consecutive segments:',
    lab3VisualHeader: 'SHAPE VISUALIZATION (DYNAMIC SCALE)',
    totalLengthBadge: 'LENGTH:',
    triangleCannotClose:
      '⚠️ These segments cannot form a closed triangle!',
    triangleInequalityDesc:
      'The longest segment must be strictly smaller than the sum of the other two sides.',
    shortestApprox: 'AD ≈ ',
    infoOpenPoly:
      'Open Polygonal Path ABCD: Segments AB, BC, and CD update in real-time! Points A, B, C, D are called vertices, and segments AB, BC, CD are the sides.',
    infoClosedPolySuccess:
      'Closed Polygonal Path (Polygon): The endpoint of the third segment meets origin A, forming a closed triangle!',
    infoClosedPolyFail:
      'Closed Polygonal Path (Polygon): Try increasing the shorter sides or reducing the longest side so that the triangle inequality is satisfied!',
    infoCollinear:
      'Consecutive Collinear Segments: When consecutive segments lie along the exact same line, they DO NOT form a polygonal chain, but a single continuous segment AD of length ',
    infoShortest:
      'Shortest Path: The direct segment AD connecting A to D is strictly shorter than the polygonal path AB ＋ BC ＋ CD.',

    // Section 4
    sec4Title: 'Real-World Problem Walkthroughs',
    prob1Badge: 'PROBLEM 1: SEGMENT MIDPOINT',
    prob1Title: 'Highway Refueling Station',
    prob1Desc:
      'Along a straight highway lie cities A, B, and C in order. The distance AB is 80 km and BC is 40 km. If a refueling station M is built at the midpoint of route AC, what is the distance between station M and city B?',
    solTitle: 'Step-by-Step Solution:',
    prob1Step1: '1. Total distance: AC ＝ AB ＋ BC ＝ 80 ＋ 40 ＝ ',
    prob1Step2Lead: '2. Because M is the midpoint of AC: AM ＝ ',
    prob1Step3: '3. Distance from city B: MB ＝ AB － AM ＝ 80 － 60 ＝ 20 km.',

    prob2Badge: 'PROBLEM 2: POLYGONAL PATH VS DIRECT SEGMENT',
    prob2Title: 'Fiber Optic Cable Savings',
    prob2Desc:
      'To connect building A with building D, a company can either follow city streets along an open path AB ＝ 120 m, BC ＝ 90 m, CD ＝ 140 m, or lay direct underground cable along segment AD ＝ 260 m. If cable costs 8 € per meter, how much money is saved by choosing the direct route?',
    prob2Step1: '1. Polygonal path length: L ＝ 120 ＋ 90 ＋ 140 ＝ ',
    prob2Step2: '2. Length saved: 350 － 260 ＝ ',
    prob2Step3: '3. Total cost savings: 90 · 8 ＝ 720 €.',
  },
};

export default function GeometrikesEnnoiesTheoria() {
  const router = useRouter();
  const locale = router?.locale || 'el';
  const t = DICTIONARY[locale] || DICTIONARY.el;

  const formatNumber = (num) => {
    return Number(num).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
  };

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 1: Σημείο, Ευθεία, Ημιευθεία, Ευθύγραμμο Τμήμα, Επίπεδο
  // --------------------------------------------------------------------------
  const [geoMode, setGeoMode] = useState('segment');

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 2: Απόσταση, Μέσο M & Σύγκριση Ευθυγράμμων Τμημάτων
  // --------------------------------------------------------------------------
  const [posA, setPosA] = useState(2);
  const [posB, setPosB] = useState(10);
  const [lenCD, setLenCD] = useState(8);

  // --------------------------------------------------------------------------
  // STATE ΕΡΓΑΣΤΗΡΙΟΥ 3: Διαδοχικά Τμήματα & Τεθλασμένες Γραμμές
  // --------------------------------------------------------------------------
  const [polyMode, setPolyMode] = useState('openPoly');
  const [seg1, setSeg1] = useState(5); // Μήκος ΑΒ
  const [seg2, setSeg2] = useState(4); // Μήκος ΒΓ
  const [seg3, setSeg3] = useState(6); // Μήκος ΓΔ

  const handleStep = (setter, val, min, max, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setter((prev) => Math.max(min, Math.min(max, prev + val)));
  };

  // Υπολογισμοί Εργαστηρίου 2
  const lenAB = useMemo(() => posB - posA, [posA, posB]);
  const posM = useMemo(() => (posA + posB) / 2, [posA, posB]);
  const halfLen = useMemo(() => lenAB / 2, [lenAB]);

  // Υπολογισμοί Εργαστηρίου 3 (Δυναμική Γεωμετρία SVG)
  const totalPolyLen = useMemo(() => seg1 + seg2 + seg3, [seg1, seg2, seg3]);

  const polyGeometry = useMemo(() => {
    const degToRad = (deg) => (deg * Math.PI) / 180;
    const rawA = { x: 0, y: 0 };
    const rawB = {
      x: rawA.x + seg1 * Math.cos(degToRad(-38)),
      y: rawA.y + seg1 * Math.sin(degToRad(-38)),
    };
    const rawC = {
      x: rawB.x + seg2 * Math.cos(degToRad(28)),
      y: rawB.y + seg2 * Math.sin(degToRad(28)),
    };
    const rawD = {
      x: rawC.x + seg3 * Math.cos(degToRad(-18)),
      y: rawC.y + seg3 * Math.sin(degToRad(-18)),
    };

    const directAD = Number(
      Math.hypot(rawD.x - rawA.x, rawD.y - rawA.y).toFixed(1)
    );

    const xs = [rawA.x, rawB.x, rawC.x, rawD.x];
    const ys = [rawA.y, rawB.y, rawC.y, rawD.y];
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const scaleOpen = Math.min(380 / spanX, 115 / spanY, 21);

    const offsetX = 260 - ((minX + maxX) / 2) * scaleOpen;
    const offsetY = 98 - ((minY + maxY) / 2) * scaleOpen;

    const toSvgOpen = (pt) => ({
      x: Math.round(pt.x * scaleOpen + offsetX),
      y: Math.round(pt.y * scaleOpen + offsetY),
    });

    const openPts = {
      A: toSvgOpen(rawA),
      B: toSvgOpen(rawB),
      C: toSvgOpen(rawC),
      D: toSvgOpen(rawD),
    };

    const colScale = Math.min(400 / totalPolyLen, 18);
    const totalPx = totalPolyLen * colScale;
    const startColX = Math.round(260 - totalPx / 2);
    const colPts = {
      xA: startColX,
      xB: Math.round(startColX + seg1 * colScale),
      xC: Math.round(startColX + (seg1 + seg2) * colScale),
      xD: Math.round(startColX + totalPx),
    };

    const canClose =
      seg1 + seg2 > seg3 && seg1 + seg3 > seg2 && seg2 + seg3 > seg1;

    let closedPts = null;
    if (canClose) {
      const cBase = seg3;
      const aSide = seg1;
      const bSide = seg2;
      const cosA =
        (aSide * aSide + cBase * cBase - bSide * bSide) / (2 * aSide * cBase);
      const clampedCos = Math.max(-1, Math.min(1, cosA));
      const sinA = Math.sqrt(Math.max(0, 1 - clampedCos * clampedCos));

      const triA = { x: 0, y: 0 };
      const triC = { x: cBase, y: 0 };
      const triB = { x: aSide * clampedCos, y: -aSide * sinA };

      const tXs = [triA.x, triB.x, triC.x];
      const tYs = [triA.y, triB.y, triC.y];
      const tMinX = Math.min(...tXs);
      const tMaxX = Math.max(...tXs);
      const tMinY = Math.min(...tYs);
      const tMaxY = Math.max(...tYs);

      const scaleTri = Math.min(
        340 / Math.max(tMaxX - tMinX, 1),
        125 / Math.max(tMaxY - tMinY, 1),
        22
      );
      const offTriX = 260 - ((tMinX + tMaxX) / 2) * scaleTri;
      const offTriY = 105 - ((tMinY + tMaxY) / 2) * scaleTri;

      closedPts = {
        A: {
          x: Math.round(triA.x * scaleTri + offTriX),
          y: Math.round(triA.y * scaleTri + offTriY),
        },
        B: {
          x: Math.round(triB.x * scaleTri + offTriX),
          y: Math.round(triB.y * scaleTri + offTriY),
        },
        C: {
          x: Math.round(triC.x * scaleTri + offTriX),
          y: Math.round(triC.y * scaleTri + offTriY),
        },
      };
    }

    return {
      openPts,
      directAD,
      colPts,
      canClose,
      closedPts,
    };
  }, [seg1, seg2, seg3, totalPolyLen]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/a-gymnasiou"
      backText={t.navGrade}
      showAds={true}
      actionButton={
        <Link
          href="/a-gymnasiou/35-geometrikes-ennoies-ask"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-md shrink-0"
        >
          <span>🎯</span>
          <span>{toCleanUppercase(t.exercisesBtn)}</span>
        </Link>
      }
    >
      <div className="w-full min-w-0 max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 sm:py-10 space-y-10 sm:space-y-16 overflow-x-hidden box-border">
        {/* Banner Header */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-5 sm:p-10 lg:p-14 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-4 min-w-0">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 break-words [overflow-wrap:anywhere]">
              {toCleanUppercase(t.bannerBadge)}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white break-words [overflow-wrap:anywhere]">
              {t.bannerTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed break-words [overflow-wrap:anywhere]">
              {t.bannerSubtitle}
            </p>
          </div>
        </section>

        {/* ====================================================================
            1. ΣΗΜΕΙΟ, ΕΥΘΕΙΑ, ΗΜΙΕΥΘΕΙΑ, ΕΥΘΥΓΡΑΜΜΟ ΤΜΗΜΑ & ΕΠΙΠΕΔΟ + ΕΡΓΑΣΤΗΡΙΟ 1
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                1
              </span>
              <span>{t.sec1Title}</span>
            </h2>
          </div>

          {/* Κάρτες Θεωρίας */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-xs sm:text-sm leading-relaxed text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.card1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.card1Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.card1Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.card2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.card2Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.card2Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.card3Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.card3Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.card3Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.card4Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.card4Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.card4Text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.card5Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.card5Title}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.card5Text}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΟΣ ΕΞΕΡΕΥΝΗΤΗΣ ΕΝΝΟΙΩΝ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab1Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                {[
                  { id: 'point', label: t.btnPoint, desc: t.btnPointDesc },
                  { id: 'line', label: t.btnLine, desc: t.btnLineDesc },
                  { id: 'rayRight', label: t.btnRayRight, desc: t.btnRayRightDesc },
                  { id: 'rayLeft', label: t.btnRayLeft, desc: t.btnRayLeftDesc },
                  { id: 'segment', label: t.btnSegment, desc: t.btnSegmentDesc },
                  { id: 'plane', label: t.btnPlane, desc: t.btnPlaneDesc },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setGeoMode(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all active:scale-95 break-words whitespace-normal leading-snug flex-1 min-w-0 ${
                      geoMode === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-black tracking-wide [overflow-wrap:anywhere]">
                      {toCleanUppercase(item.label)}
                    </div>
                    <div
                      className={`text-[11px] mt-0.5 [overflow-wrap:anywhere] ${
                        geoMode === item.id ? 'text-indigo-100' : 'text-slate-500'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>

              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab1VisualHeader)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans break-words [overflow-wrap:anywhere]">
                    {geoMode === 'point' && toCleanUppercase(t.badgePoint)}
                    {geoMode === 'line' && toCleanUppercase(t.badgeLine)}
                    {geoMode === 'rayRight' && toCleanUppercase(t.badgeRayRight)}
                    {geoMode === 'rayLeft' && toCleanUppercase(t.badgeRayLeft)}
                    {geoMode === 'segment' && toCleanUppercase(t.badgeSegment)}
                    {geoMode === 'plane' && toCleanUppercase(t.badgePlane)}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg
                    viewBox="0 0 540 210"
                    className="w-full max-w-[520px] h-auto max-h-[220px]"
                  >
                    <polygon
                      points="50,25 510,25 480,185 20,185"
                      fill={geoMode === 'plane' ? '#312e81' : '#0f172a'}
                      stroke={geoMode === 'plane' ? '#818cf8' : '#334155'}
                      strokeWidth={geoMode === 'plane' ? '3' : '2'}
                      className="transition-all duration-300"
                    />
                    <text
                      x="45"
                      y="170"
                      fill="#a5b4fc"
                      fontSize="16"
                      fontWeight="bold"
                      fontStyle="italic"
                    >
                      π
                    </text>

                    <line
                      x1="45"
                      y1="105"
                      x2="495"
                      y2="105"
                      stroke="#334155"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <text x="55" y="92" fill="#64748b" fontSize="13" fontWeight="bold">
                      y
                    </text>
                    <text x="480" y="92" fill="#64748b" fontSize="13" fontWeight="bold">
                      x
                    </text>

                    {geoMode === 'line' && (
                      <g>
                        <line
                          x1="45"
                          y1="105"
                          x2="495"
                          y2="105"
                          stroke="#38bdf8"
                          strokeWidth="4"
                        />
                        <polygon points="40,105 55,98 55,112" fill="#38bdf8" />
                        <polygon points="500,105 485,98 485,112" fill="#38bdf8" />
                        <text
                          x="270"
                          y="75"
                          fill="#38bdf8"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {t.svgLineText}
                        </text>
                      </g>
                    )}

                    {geoMode === 'rayRight' && (
                      <g>
                        <line
                          x1="270"
                          y1="105"
                          x2="495"
                          y2="105"
                          stroke="#f59e0b"
                          strokeWidth="4.5"
                        />
                        <polygon points="500,105 485,98 485,112" fill="#f59e0b" />
                        <text
                          x="380"
                          y="75"
                          fill="#fde68a"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {t.svgRayRightText}
                        </text>
                      </g>
                    )}

                    {geoMode === 'rayLeft' && (
                      <g>
                        <line
                          x1="270"
                          y1="105"
                          x2="45"
                          y2="105"
                          stroke="#f43f5e"
                          strokeWidth="4.5"
                        />
                        <polygon points="40,105 55,98 55,112" fill="#f43f5e" />
                        <text
                          x="160"
                          y="75"
                          fill="#fda4af"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {t.svgRayLeftText}
                        </text>
                      </g>
                    )}

                    {geoMode === 'segment' && (
                      <g>
                        <line
                          x1="140"
                          y1="105"
                          x2="400"
                          y2="105"
                          stroke="#10b981"
                          strokeWidth="5"
                        />
                        <text
                          x="270"
                          y="75"
                          fill="#6ee7b7"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {t.svgSegmentText}
                        </text>
                      </g>
                    )}

                    <circle
                      cx="140"
                      cy="105"
                      r={geoMode === 'point' || geoMode === 'segment' ? '6.5' : '5'}
                      fill={geoMode === 'segment' ? '#10b981' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="140"
                      y="132"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {locale === 'el' ? 'Α' : 'A'}
                    </text>

                    <circle
                      cx="270"
                      cy="105"
                      r={
                        geoMode === 'rayRight' ||
                        geoMode === 'rayLeft' ||
                        geoMode === 'point'
                          ? '6.5'
                          : '5'
                      }
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="270"
                      y="132"
                      fill="#fde68a"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      O
                    </text>

                    <circle
                      cx="400"
                      cy="105"
                      r={geoMode === 'point' || geoMode === 'segment' ? '6.5' : '5'}
                      fill={geoMode === 'segment' ? '#10b981' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x="400"
                      y="132"
                      fill="#ffffff"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      B
                    </text>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {geoMode === 'point' && t.infoPoint}
                  {geoMode === 'line' && t.infoLine}
                  {geoMode === 'rayRight' && t.infoRayRight}
                  {geoMode === 'rayLeft' && t.infoRayLeft}
                  {geoMode === 'segment' && t.infoSegment}
                  {geoMode === 'plane' && t.infoPlane}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            2. ΑΠΟΣΤΑΣΗ 2 ΣΗΜΕΙΩΝ, ΜΕΣΟ ΤΜΗΜΑΤΟΣ & ΣΥΓΚΡΙΣΗ + ΕΡΓΑΣΤΗΡΙΟ 2
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                2
              </span>
              <span>{t.sec2Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.distBadge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.distTitle}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.distText}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.midBadge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.midTitle}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.midText}
              </p>
              <div className="p-1.5 bg-white rounded-xl border border-amber-200 font-mono text-center font-bold text-amber-950 flex items-center justify-center flex-wrap gap-1">
                <span>{locale === 'el' ? 'ΑΜ ＝ ΜΒ ＝ ' : 'AM ＝ MB ＝ '}</span>
                <Frac num={locale === 'el' ? 'ΑΒ' : 'AB'} den="2" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.compBadge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.compTitle}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.compText}
              </p>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 2: ΧΑΡΑΚΑΣ, ΜΕΣΟ Μ & ΣΥΓΚΡΙΣΗ ΜΕ ΓΔ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab2Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block truncate">
                    {toCleanUppercase(t.lblPosA)}
                  </label>
                  <div className="grid grid-cols-[28px_1fr_28px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosA, -1, 0, posB - 2, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {formatNumber(posA)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosA, 1, 0, posB - 2, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] font-bold text-indigo-900 uppercase block truncate">
                    {toCleanUppercase(t.lblPosB)}
                  </label>
                  <div className="grid grid-cols-[28px_1fr_28px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosB, -1, posA + 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-indigo-50 rounded-lg border border-indigo-200 font-bold text-sm font-mono text-indigo-950">
                      {formatNumber(posB)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setPosB, 1, posA + 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="space-y-1 min-w-0">
                  <label className="text-[10px] font-bold text-amber-800 uppercase block truncate">
                    {toCleanUppercase(t.lblLenCD)}
                  </label>
                  <div className="grid grid-cols-[28px_1fr_28px] items-center h-10 w-full gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStep(setLenCD, -1, 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      －
                    </button>
                    <div className="h-full flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200 font-bold text-sm font-mono text-amber-950">
                      {formatNumber(lenCD)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => handleStep(setLenCD, 1, 2, 14, e)}
                      className="w-full h-full flex items-center justify-center rounded-lg bg-white border border-slate-300 font-bold hover:bg-slate-100 active:scale-95 text-xs"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-3 p-3.5 bg-white rounded-xl border border-slate-200 text-xs font-mono space-y-2 text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    • <strong>{t.calcDistAB}</strong> {formatNumber(posB)} －{' '}
                    {formatNumber(posA)} ＝{' '}
                    <strong>{formatNumber(lenAB)} cm</strong>
                  </div>
                  <div className="inline-flex flex-wrap items-center gap-1 max-w-full">
                    <span>
                      • <strong>{t.calcMidM}</strong>
                    </span>
                    <Frac num={formatNumber(lenAB)} den="2" />
                    <span>
                      ＝ <strong>{formatNumber(halfLen)} cm</strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab2VisualHeader)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border font-sans break-words [overflow-wrap:anywhere] ${
                      lenAB === lenCD
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                        : lenAB > lenCD
                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                    }`}
                  >
                    {lenAB === lenCD && toCleanUppercase(t.compEqual)}
                    {lenAB > lenCD && toCleanUppercase(t.compGreater)}
                    {lenAB < lenCD && toCleanUppercase(t.compLess)}
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg
                    viewBox="0 0 560 210"
                    className="w-full max-w-[540px] h-auto max-h-[220px]"
                  >
                    <rect
                      x="25"
                      y="135"
                      width="510"
                      height="50"
                      rx="6"
                      fill="#1e293b"
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    {Array.from({ length: 15 }).map((_, cm) => {
                      const xPos = 42 + cm * 34;
                      return (
                        <g key={cm}>
                          <line
                            x1={xPos}
                            y1="135"
                            x2={xPos}
                            y2="152"
                            stroke="#94a3b8"
                            strokeWidth="2"
                          />
                          <text
                            x={xPos}
                            y="172"
                            fill="#cbd5e1"
                            fontSize="11"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {cm}
                          </text>
                        </g>
                      );
                    })}

                    <g>
                      <line
                        x1={42 + posA * 34}
                        y1="95"
                        x2={42 + posB * 34}
                        y2="95"
                        stroke="#38bdf8"
                        strokeWidth="5"
                      />
                      <circle
                        cx={42 + posA * 34}
                        cy="95"
                        r="6"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={42 + posA * 34}
                        y="78"
                        fill="#38bdf8"
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {locale === 'el' ? 'Α' : 'A'}
                      </text>

                      <circle
                        cx={42 + posM * 34}
                        cy="95"
                        r="6"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={42 + posM * 34}
                        y="78"
                        fill="#6ee7b7"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {t.midLabel}
                      </text>
                      <text
                        x={42 + ((posA + posM) / 2) * 34}
                        y="115"
                        fill="#7dd3fc"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {formatNumber(halfLen)} cm
                      </text>
                      <text
                        x={42 + ((posM + posB) / 2) * 34}
                        y="115"
                        fill="#7dd3fc"
                        fontSize="10"
                        textAnchor="middle"
                      >
                        {formatNumber(halfLen)} cm
                      </text>

                      <circle
                        cx={42 + posB * 34}
                        cy="95"
                        r="6"
                        fill="#38bdf8"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={42 + posB * 34}
                        y="78"
                        fill="#38bdf8"
                        fontSize="13"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        B
                      </text>
                    </g>

                    <g>
                      <line
                        x1={42 + posA * 34}
                        y1="40"
                        x2={42 + Math.min(14.5, posA + lenCD) * 34}
                        y2="40"
                        stroke="#f59e0b"
                        strokeWidth="5"
                      />
                      <circle
                        cx={42 + posA * 34}
                        cy="40"
                        r="5.5"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={42 + posA * 34}
                        y="25"
                        fill="#fde68a"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {locale === 'el' ? 'Γ' : 'C'}
                      </text>
                      <circle
                        cx={42 + Math.min(14.5, posA + lenCD) * 34}
                        cy="40"
                        r="5.5"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x={42 + Math.min(14.5, posA + lenCD) * 34}
                        y="25"
                        fill="#fde68a"
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {locale === 'el' ? 'Δ' : 'D'} ({formatNumber(lenCD)} cm)
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {t.compExpLead}{' '}
                  <strong>
                    {locale === 'el' ? 'ΑΒ' : 'AB'} ({formatNumber(lenAB)} cm)
                  </strong>{' '}
                  {locale === 'el' ? 'και' : 'and'}{' '}
                  <strong>
                    {locale === 'el' ? 'ΓΔ' : 'CD'} ({formatNumber(lenCD)} cm)
                  </strong>
                  {t.compExpMid}{' '}
                  {lenAB === lenCD ? (
                    <strong className="text-emerald-300">
                      {t.compExpEqEnd}
                    </strong>
                  ) : lenAB > lenCD ? (
                    <strong className="text-sky-300">
                      {t.compExpGtEnd}
                    </strong>
                  ) : (
                    <strong className="text-amber-300">
                      {t.compExpLtEnd}
                    </strong>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. ΔΙΑΔΟΧΙΚΑ ΕΥΘΥΓΡΑΜΜΑ ΤΜΗΜΑΤΑ & ΤΕΘΛΑΣΜΕΝΕΣ ΓΡΑΜΜΕΣ + ΕΡΓΑΣΤΗΡΙΟ 3
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-8 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                3
              </span>
              <span>{t.sec3Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.consecBadge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.consecTitle}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.consecText}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.polyBadge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.polyTitle}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.polyText}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded inline-block">
                {toCleanUppercase(t.propBadge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base">{t.propTitle}</h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.propText}
              </p>
              <div className="p-1.5 bg-white rounded-lg border border-slate-200 font-mono text-center font-bold text-emerald-700 break-words [overflow-wrap:anywhere]">
                {locale === 'el'
                  ? 'ΑΔ ＜ ΑΒ ＋ ΒΓ ＋ ΓΔ'
                  : 'AD ＜ AB ＋ BC ＋ CD'}
              </div>
            </div>
          </div>

          {/* ΕΡΓΑΣΤΗΡΙΟ 3: ΔΥΝΑΜΙΚΟ SVG ΜΕ ΑΝΑΛΟΓΙΚΑ ΜΗΚΗ ΤΜΗΜΑΤΩΝ */}
          <div className="pt-2 space-y-5 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.lab3Title}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Χειριστήρια (5 cols) */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'openPoly', label: t.btnOpenPoly },
                    { id: 'closedPoly', label: t.btnClosedPoly },
                    { id: 'collinear', label: t.btnCollinear },
                    { id: 'shortestPath', label: t.btnShortest },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPolyMode(m.id)}
                      className={`py-2.5 px-3 rounded-xl font-black text-xs border transition-all active:scale-95 break-words whitespace-normal leading-snug ${
                        polyMode === m.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {toCleanUppercase(m.label)}
                    </button>
                  ))}
                </div>

                {/* Steppers για τα μήκη ΑΒ, ΒΓ, ΓΔ */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                  <div className="space-y-1 min-w-0">
                    <label className="text-[10px] font-bold text-sky-800 uppercase block truncate">
                      {toCleanUppercase(t.lblSegAB)}
                    </label>
                    <div className="grid grid-cols-[24px_1fr_24px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg1, -1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-sky-50 rounded border border-sky-200 font-bold text-xs font-mono text-sky-950">
                        {formatNumber(seg1)}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg1, 1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <label className="text-[10px] font-bold text-amber-800 uppercase block truncate">
                      {toCleanUppercase(t.lblSegBC)}
                    </label>
                    <div className="grid grid-cols-[24px_1fr_24px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg2, -1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-amber-50 rounded border border-amber-200 font-bold text-xs font-mono text-amber-950">
                        {formatNumber(seg2)}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg2, 1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <label className="text-[10px] font-bold text-emerald-800 uppercase block truncate">
                      {toCleanUppercase(t.lblSegCD)}
                    </label>
                    <div className="grid grid-cols-[24px_1fr_24px] items-center h-9 w-full gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg3, -1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        －
                      </button>
                      <div className="h-full flex items-center justify-center bg-emerald-50 rounded border border-emerald-200 font-bold text-xs font-mono text-emerald-950">
                        {formatNumber(seg3)}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleStep(setSeg3, 1, 2, 10, e)}
                        className="w-full h-full flex items-center justify-center rounded bg-white border border-slate-300 font-bold text-xs active:scale-95"
                      >
                        ＋
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700 min-w-0">
                  <div className="break-words [overflow-wrap:anywhere]">
                    {t.totalPolyLabel}
                  </div>
                  <div className="font-bold text-indigo-700 text-sm pt-1 break-words [overflow-wrap:anywhere]">
                    {locale === 'el' ? 'L ＝ ΑΒ ＋ ΒΓ ＋ ΓΔ ＝ ' : 'L ＝ AB ＋ BC ＋ CD ＝ '}
                    {formatNumber(seg1)} ＋ {formatNumber(seg2)} ＋ {formatNumber(seg3)} ＝{' '}
                    {formatNumber(totalPolyLen)} m
                  </div>
                </div>
              </div>

              {/* Δυναμικό SVG Απεικόνισης Τεθλασμένης (7 cols) */}
              <div className="lg:col-span-7 p-4 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-4 shadow-md font-mono min-w-0 overflow-hidden">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold font-sans">
                    {toCleanUppercase(t.lab3VisualHeader)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 font-sans">
                    {toCleanUppercase(t.totalLengthBadge)} {formatNumber(totalPolyLen)} M
                  </span>
                </div>

                <div className="w-full max-w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 p-2 sm:p-3 flex justify-center">
                  <svg
                    viewBox="0 0 520 205"
                    className="w-full max-w-[500px] h-auto max-h-[220px]"
                  >
                    {polyMode === 'collinear' ? (
                      /* Διαδοχικά Συνευθειακά Τμήματα με δυναμικά μήκη */
                      <g>
                        <line
                          x1={polyGeometry.colPts.xA}
                          y1="100"
                          x2={polyGeometry.colPts.xB}
                          y2="100"
                          stroke="#38bdf8"
                          strokeWidth="5"
                        />
                        <line
                          x1={polyGeometry.colPts.xB}
                          y1="100"
                          x2={polyGeometry.colPts.xC}
                          y2="100"
                          stroke="#f59e0b"
                          strokeWidth="5"
                        />
                        <line
                          x1={polyGeometry.colPts.xC}
                          y1="100"
                          x2={polyGeometry.colPts.xD}
                          y2="100"
                          stroke="#10b981"
                          strokeWidth="5"
                        />

                        <circle cx={polyGeometry.colPts.xA} cy="100" r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.colPts.xA}
                          y="130"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {locale === 'el' ? 'Α' : 'A'}
                        </text>

                        <circle cx={polyGeometry.colPts.xB} cy="100" r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.colPts.xB}
                          y="130"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          B
                        </text>

                        <circle cx={polyGeometry.colPts.xC} cy="100" r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.colPts.xC}
                          y="130"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {locale === 'el' ? 'Γ' : 'C'}
                        </text>

                        <circle cx={polyGeometry.colPts.xD} cy="100" r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.colPts.xD}
                          y="130"
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {locale === 'el' ? 'Δ' : 'D'}
                        </text>

                        <text
                          x={(polyGeometry.colPts.xA + polyGeometry.colPts.xB) / 2}
                          y="78"
                          fill="#38bdf8"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {formatNumber(seg1)} m
                        </text>
                        <text
                          x={(polyGeometry.colPts.xB + polyGeometry.colPts.xC) / 2}
                          y="78"
                          fill="#f59e0b"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {formatNumber(seg2)} m
                        </text>
                        <text
                          x={(polyGeometry.colPts.xC + polyGeometry.colPts.xD) / 2}
                          y="78"
                          fill="#10b981"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {formatNumber(seg3)} m
                        </text>
                      </g>
                    ) : polyMode === 'closedPoly' ? (
                      /* Κλειστή Τεθλασμένη (Τρίγωνο με δυναμικές πλευρές) */
                      polyGeometry.canClose && polyGeometry.closedPts ? (
                        <g>
                          <polygon
                            points={`${polyGeometry.closedPts.A.x},${polyGeometry.closedPts.A.y} ${polyGeometry.closedPts.B.x},${polyGeometry.closedPts.B.y} ${polyGeometry.closedPts.C.x},${polyGeometry.closedPts.C.y}`}
                            fill="#1e1b4b"
                            fillOpacity="0.6"
                          />
                          <line
                            x1={polyGeometry.closedPts.A.x}
                            y1={polyGeometry.closedPts.A.y}
                            x2={polyGeometry.closedPts.B.x}
                            y2={polyGeometry.closedPts.B.y}
                            stroke="#38bdf8"
                            strokeWidth="4.5"
                          />
                          <line
                            x1={polyGeometry.closedPts.B.x}
                            y1={polyGeometry.closedPts.B.y}
                            x2={polyGeometry.closedPts.C.x}
                            y2={polyGeometry.closedPts.C.y}
                            stroke="#f59e0b"
                            strokeWidth="4.5"
                          />
                          <line
                            x1={polyGeometry.closedPts.C.x}
                            y1={polyGeometry.closedPts.C.y}
                            x2={polyGeometry.closedPts.A.x}
                            y2={polyGeometry.closedPts.A.y}
                            stroke="#10b981"
                            strokeWidth="4.5"
                          />

                          <circle
                            cx={polyGeometry.closedPts.A.x}
                            cy={polyGeometry.closedPts.A.y}
                            r="6"
                            fill="#ffffff"
                          />
                          <text
                            x={polyGeometry.closedPts.A.x - 10}
                            y={polyGeometry.closedPts.A.y + 18}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            {locale === 'el' ? 'Α (＝Δ)' : 'A (＝D)'}
                          </text>

                          <circle
                            cx={polyGeometry.closedPts.B.x}
                            cy={polyGeometry.closedPts.B.y}
                            r="6"
                            fill="#ffffff"
                          />
                          <text
                            x={polyGeometry.closedPts.B.x}
                            y={polyGeometry.closedPts.B.y - 12}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            B
                          </text>

                          <circle
                            cx={polyGeometry.closedPts.C.x}
                            cy={polyGeometry.closedPts.C.y}
                            r="6"
                            fill="#ffffff"
                          />
                          <text
                            x={polyGeometry.closedPts.C.x + 12}
                            y={polyGeometry.closedPts.C.y + 18}
                            fill="#ffffff"
                            fontSize="13"
                            fontWeight="bold"
                          >
                            {locale === 'el' ? 'Γ' : 'C'}
                          </text>

                          <text
                            x={(polyGeometry.closedPts.A.x + polyGeometry.closedPts.B.x) / 2 - 14}
                            y={(polyGeometry.closedPts.A.y + polyGeometry.closedPts.B.y) / 2 - 6}
                            fill="#38bdf8"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="end"
                          >
                            {formatNumber(seg1)} m
                          </text>
                          <text
                            x={(polyGeometry.closedPts.B.x + polyGeometry.closedPts.C.x) / 2 + 14}
                            y={(polyGeometry.closedPts.B.y + polyGeometry.closedPts.C.y) / 2 - 6}
                            fill="#f59e0b"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {formatNumber(seg2)} m
                          </text>
                          <text
                            x={(polyGeometry.closedPts.A.x + polyGeometry.closedPts.C.x) / 2}
                            y={polyGeometry.closedPts.A.y + 22}
                            fill="#10b981"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {formatNumber(seg3)} m
                          </text>
                        </g>
                      ) : (
                        <g>
                          <text
                            x="260"
                            y="90"
                            fill="#fda4af"
                            fontSize="14"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            {t.triangleCannotClose}
                          </text>
                          <text
                            x="260"
                            y="118"
                            fill="#cbd5e1"
                            fontSize="12"
                            textAnchor="middle"
                          >
                            {t.triangleInequalityDesc}
                          </text>
                        </g>
                      )
                    ) : (
                      /* Ανοιχτή Τεθλασμένη ΑΒΓΔ (+ Συντομότερη Διαδρομή ΑΔ) */
                      <g>
                        {polyMode === 'shortestPath' && (
                          <g>
                            <line
                              x1={polyGeometry.openPts.A.x}
                              y1={polyGeometry.openPts.A.y}
                              x2={polyGeometry.openPts.D.x}
                              y2={polyGeometry.openPts.D.y}
                              stroke="#f43f5e"
                              strokeWidth="3.5"
                              strokeDasharray="7 5"
                            />
                            <text
                              x={(polyGeometry.openPts.A.x + polyGeometry.openPts.D.x) / 2}
                              y={Math.max(polyGeometry.openPts.A.y, polyGeometry.openPts.D.y) + 28}
                              fill="#fda4af"
                              fontSize="12"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {locale === 'el' ? 'ΑΔ ≈ ' : 'AD ≈ '}
                              {formatNumber(polyGeometry.directAD)} m (＜ {formatNumber(totalPolyLen)} m)
                            </text>
                          </g>
                        )}

                        <line
                          x1={polyGeometry.openPts.A.x}
                          y1={polyGeometry.openPts.A.y}
                          x2={polyGeometry.openPts.B.x}
                          y2={polyGeometry.openPts.B.y}
                          stroke="#38bdf8"
                          strokeWidth="4.5"
                        />
                        <line
                          x1={polyGeometry.openPts.B.x}
                          y1={polyGeometry.openPts.B.y}
                          x2={polyGeometry.openPts.C.x}
                          y2={polyGeometry.openPts.C.y}
                          stroke="#f59e0b"
                          strokeWidth="4.5"
                        />
                        <line
                          x1={polyGeometry.openPts.C.x}
                          y1={polyGeometry.openPts.C.y}
                          x2={polyGeometry.openPts.D.x}
                          y2={polyGeometry.openPts.D.y}
                          stroke="#10b981"
                          strokeWidth="4.5"
                        />

                        <circle cx={polyGeometry.openPts.A.x} cy={polyGeometry.openPts.A.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.A.x - 14}
                          y={polyGeometry.openPts.A.y + 5}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          {locale === 'el' ? 'Α' : 'A'}
                        </text>

                        <circle cx={polyGeometry.openPts.B.x} cy={polyGeometry.openPts.B.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.B.x}
                          y={polyGeometry.openPts.B.y - 12}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          B
                        </text>

                        <circle cx={polyGeometry.openPts.C.x} cy={polyGeometry.openPts.C.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.C.x}
                          y={polyGeometry.openPts.C.y + 20}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {locale === 'el' ? 'Γ' : 'C'}
                        </text>

                        <circle cx={polyGeometry.openPts.D.x} cy={polyGeometry.openPts.D.y} r="6" fill="#ffffff" />
                        <text
                          x={polyGeometry.openPts.D.x + 14}
                          y={polyGeometry.openPts.D.y + 5}
                          fill="#ffffff"
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {locale === 'el' ? 'Δ' : 'D'}
                        </text>

                        <text
                          x={(polyGeometry.openPts.A.x + polyGeometry.openPts.B.x) / 2 - 10}
                          y={(polyGeometry.openPts.A.y + polyGeometry.openPts.B.y) / 2 - 8}
                          fill="#38bdf8"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="end"
                        >
                          {formatNumber(seg1)} m
                        </text>
                        <text
                          x={(polyGeometry.openPts.B.x + polyGeometry.openPts.C.x) / 2 + 8}
                          y={(polyGeometry.openPts.B.y + polyGeometry.openPts.C.y) / 2 - 8}
                          fill="#f59e0b"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {formatNumber(seg2)} m
                        </text>
                        <text
                          x={(polyGeometry.openPts.C.x + polyGeometry.openPts.D.x) / 2}
                          y={(polyGeometry.openPts.C.y + polyGeometry.openPts.D.y) / 2 - 10}
                          fill="#10b981"
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {formatNumber(seg3)} m
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                <div className="p-3.5 bg-white/10 rounded-xl border border-white/10 text-xs sm:text-sm font-sans text-slate-200 leading-relaxed break-words [overflow-wrap:anywhere]">
                  {polyMode === 'openPoly' && t.infoOpenPoly}
                  {polyMode === 'closedPoly' &&
                    (polyGeometry.canClose
                      ? t.infoClosedPolySuccess
                      : t.infoClosedPolyFail)}
                  {polyMode === 'collinear' &&
                    `${t.infoCollinear}${formatNumber(totalPolyLen)} m!`}
                  {polyMode === 'shortestPath' && t.infoShortest}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            4. ΠΑΡΑΔΕΙΓΜΑΤΑ ΜΕ ΡΕΑΛΙΣΤΙΚΑ ΠΡΟΒΛΗΜΑΤΑ
           ==================================================================== */}
        <section className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm border border-slate-200/80 space-y-6 min-w-0 overflow-hidden">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-3 break-words [overflow-wrap:anywhere]">
              <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-base sm:text-lg shrink-0">
                4
              </span>
              <span>{t.sec4Title}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
            {/* Πρόβλημα 1 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded inline-block">
                {toCleanUppercase(t.prob1Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words [overflow-wrap:anywhere]">
                {t.prob1Title}
              </h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.prob1Desc}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-indigo-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800 min-w-0">
                <div className="font-sans font-bold text-indigo-950">
                  {t.solTitle}
                </div>
                <div className="break-words [overflow-wrap:anywhere]">
                  {t.prob1Step1}
                  <strong>120 km</strong>.
                </div>
                <div className="inline-flex flex-wrap items-center gap-1 max-w-full">
                  <span>{t.prob1Step2Lead}</span>
                  <Frac num="120" den="2" />
                  <span>
                    ＝ <strong>60 km</strong>.
                  </span>
                </div>
                <div className="text-emerald-700 font-bold break-words [overflow-wrap:anywhere]">
                  {t.prob1Step3}
                </div>
              </div>
            </div>

            {/* Πρόβλημα 2 */}
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3 min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded inline-block">
                {toCleanUppercase(t.prob2Badge)}
              </span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg break-words [overflow-wrap:anywhere]">
                {t.prob2Title}
              </h3>
              <p className="text-slate-600 break-words [overflow-wrap:anywhere]">
                {t.prob2Desc}
              </p>
              <div className="p-3.5 bg-white rounded-xl border border-amber-100 font-mono text-xs sm:text-sm space-y-2 text-slate-800 min-w-0">
                <div className="font-sans font-bold text-amber-950">
                  {t.solTitle}
                </div>
                <div className="break-words [overflow-wrap:anywhere]">
                  {t.prob2Step1}
                  <strong>350 m</strong>.
                </div>
                <div className="break-words [overflow-wrap:anywhere]">
                  {t.prob2Step2}
                  <strong>90 m</strong>.
                </div>
                <div className="text-emerald-700 font-bold break-words [overflow-wrap:anywhere]">
                  {t.prob2Step3}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
// pages/st-dimotikou/77-anaptigma.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(ΣΤ')/g);
  return parts
    .map((part) => {
      if (part === "ΣΤ'") return "ΣΤ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Μορφοποίηση αριθμού ανά locale
function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'el' ? 'el-GR' : 'en-US';
  return Number(val).toLocaleString(loc, { maximumFractionDigits: 4 });
}

export default function AnaptigmaTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Ισομετρική Αναδίπλωση Αναπτύγματος (3D Forward Kinematics)
  // -------------------------------------------------------------------------
  const [selectedShape, setSelectedShape] = useState('cube'); // 'cube' ή 'cuboid'
  const [foldProgress, setFoldProgress] = useState(0); // 0 (επίπεδο) έως 100 (κλειστό 3D)

  // Διαστάσεις 3D για το animation
  const shapeDims = useMemo(() => {
    if (selectedShape === 'cube') {
      return { L: 55, W: 55, H: 55 };
    }
    return { L: 70, W: 45, H: 55 };
  }, [selectedShape]);

  // Μετατροπή 3D συντεταγμένων σε 2D ισομετρική προβολή SVG
  const project3Dto2D = (x, y, z) => {
    const originX = 180;
    const originY = 135;
    const cos30 = 0.866;
    const sin30 = 0.5;

    const screenX = originX + (x - y) * cos30;
    const screenY = originY + (x + y) * sin30 - z;
    return `${screenX.toFixed(1)},${screenY.toFixed(1)}`;
  };

  // Γωνία διπλώματος θ: από 0 rad (0°) έως π/2 rad (90°)
  const theta = (foldProgress / 100) * (Math.PI / 2);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  // Δημιουργία των 6 εδρών με γεωμετρική ακρίβεια
  const faces = useMemo(() => {
    const { L, W, H } = shapeDims;

    // 1. ΒΑΣΗ (Μπλε - σταθερή στο Z = 0)
    const basePts = [
      project3Dto2D(0, 0, 0),
      project3Dto2D(L, 0, 0),
      project3Dto2D(L, W, 0),
      project3Dto2D(0, W, 0)
    ].join(' ');

    // 2. ΕΜΠΡΟΣΘΙΑ ΕΔΡΑ (Πορτοκαλί)
    const frontEdgeP1 = { x: 0, y: W + H * cosT, z: H * sinT };
    const frontEdgeP2 = { x: L, y: W + H * cosT, z: H * sinT };

    const frontPts = [
      project3Dto2D(0, W, 0),
      project3Dto2D(L, W, 0),
      project3Dto2D(frontEdgeP2.x, frontEdgeP2.y, frontEdgeP2.z),
      project3Dto2D(frontEdgeP1.x, frontEdgeP1.y, frontEdgeP1.z)
    ].join(' ');

    // 3. ΟΠΙΣΘΙΑ ΕΔΡΑ (Πράσινη)
    const backPts = [
      project3Dto2D(0, 0, 0),
      project3Dto2D(L, 0, 0),
      project3Dto2D(L, -H * cosT, H * sinT),
      project3Dto2D(0, -H * cosT, H * sinT)
    ].join(' ');

    // 4. ΔΕΞΙΑ ΕΔΡΑ (Μωβ)
    const rightPts = [
      project3Dto2D(L, 0, 0),
      project3Dto2D(L + H * cosT, 0, H * sinT),
      project3Dto2D(L + H * cosT, W, H * sinT),
      project3Dto2D(L, W, 0)
    ].join(' ');

    // 5. ΑΡΙΣΤΕΡΗ ΕΔΡΑ (Indigo)
    const leftPts = [
      project3Dto2D(0, 0, 0),
      project3Dto2D(-H * cosT, 0, H * sinT),
      project3Dto2D(-H * cosT, W, H * sinT),
      project3Dto2D(0, W, 0)
    ].join(' ');

    // 6. ΚΑΠΑΚΙ (Κόκκινο)
    const lidEndP1 = {
      x: 0,
      y: W + H * cosT + W * Math.cos(2 * theta),
      z: H * sinT + W * Math.sin(2 * theta)
    };
    const lidEndP2 = {
      x: L,
      y: W + H * cosT + W * Math.cos(2 * theta),
      z: H * sinT + W * Math.sin(2 * theta)
    };

    const lidPts = [
      project3Dto2D(frontEdgeP1.x, frontEdgeP1.y, frontEdgeP1.z),
      project3Dto2D(frontEdgeP2.x, frontEdgeP2.y, frontEdgeP2.z),
      project3Dto2D(lidEndP2.x, lidEndP2.y, lidEndP2.z),
      project3Dto2D(lidEndP1.x, lidEndP1.y, lidEndP1.z)
    ].join(' ');

    return { basePts, frontPts, backPts, rightPts, leftPts, lidPts };
  }, [shapeDims, theta, cosT, sinT]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Ολικής Επιφάνειας Αναπτύγματος
  // -------------------------------------------------------------------------
  const [dimA, setDimA] = useState(6); // Μήκος α (cm)
  const [dimB, setDimB] = useState(4); // Πλάτος β (cm)
  const [dimC, setDimC] = useState(5); // Ύψος γ (cm)

  const faceArea1 = useMemo(() => dimA * dimB, [dimA, dimB]);
  const faceArea2 = useMemo(() => dimB * dimC, [dimB, dimC]);
  const faceArea3 = useMemo(() => dimA * dimC, [dimA, dimC]);

  const totalSurfaceAreaCm2 = useMemo(() => {
    return 2 * (faceArea1 + faceArea2 + faceArea3);
  }, [faceArea1, faceArea2, faceArea3]);

  const totalSurfaceAreaDm2 = useMemo(() => totalSurfaceAreaCm2 / 100, [totalSurfaceAreaCm2]);
  const totalSurfaceAreaM2 = useMemo(() => totalSurfaceAreaCm2 / 10000, [totalSurfaceAreaCm2]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Αναπτύγματα Κύβου & Ορθογωνίου Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε τι είναι οι έδρες, οι ακμές και τα αναπτύγματα του κύβου και του ορθογωνίου παραλληλεπιπέδου, πώς διπλώνουν σε 3D και πώς υπολογίζουμε την ολική επιφάνεια.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 77 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Γεωμετρικά Στερεά & Αναπτύγματα • Κύβος & Ορθογώνιο Παραλληλεπίπεδο",
      heroDesc: "Ανακαλύπτουμε πώς ένα τρισδιάστατο κουτί ξεδιπλώνεται σε μία επίπεδη επιφάνεια από χαρτόνι, γνωρίζουμε τα βασικά στοιχεία των στερεών (έδρες, ακμές, κορυφές), εξερευνούμε τα αναπτύγματα του κύβου και υπολογίζουμε το ολικό εμβαδόν της επιφάνειάς τους!",
      heroFeature: "Θεωρία, Έδρες, Ακμές, Κορυφές, Διαδραστικό Δίπλωμα (Folding) & SVG",
      tryExercises: "Δοκίμασε τις Ασκήσεις",

      stepsHeading: "Τα Αναπτύγματα Στερεών σε 4 Βήματα",
      stepsSubheading: "Από τη δομή των γεωμετρικών στερεών μέχρι το ξεδίπλωμα και τον υπολογισμό επιφάνειας.",

      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Στοιχεία Στερεών",
      step1Title: "Έδρες, Ακμές & Κορυφές",
      step1P1: "Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς:",
      step1L1: "• 6 Έδρες (οι επιφάνειες που το περιβάλλουν)",
      step1L2: "• 12 Ακμές (τα ευθύγραμμα τμήματα όπου ενώνονται οι έδρες)",
      step1L3: "• 8 Κορυφές (τα γωνιακά σημεία όπου συναντώνται 3 ακμές)",
      step1CubeDiff: "Κύβος: Και οι 6 έδρες είναι ίσα τετράγωνα.",
      step1CuboidDiff: "Ορθογώνιο Παραλληλεπίπεδο: Οι έδρες είναι ορθογώνια παραλληλόγραμμα (ανά 2 απέναντι είναι ίσες).",
      step1Tip: "💡 Ο κύβος είναι μια ειδική περίπτωση ορθογωνίου παραλληλεπιπέδου με όλες τις ακμές του ίσες!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Ορισμός",
      step2Title: "Τι είναι το Ανάπτυγμα;",
      step2P1: "Ανάπτυγμα ενός στερεού είναι το επίπεδο γεωμετρικό σχήμα που προκύπτει αν:",
      step2L1: "1. «Κόψουμε» κατάλληλα κάποιες ακμές του στερεού.",
      step2L2: "2. «Ανοίξουμε» όλες τις έδρες του ώστε να ακουμπούν επίπεδα πάνω σε ένα τραπέζι.",
      step2L3: "Αν διπλώσουμε το ανάπτυγμα στις κοινές ακμές των εδρών, επανασυναρμολογούμε ακριβώς το αρχικό κουτί!",
      step2Tip: "⚡ Όλες οι 6 έδρες του αναπτύγματος πρέπει να παραμένουν συνδεδεμένες, χωρίς να επικαλύπτονται όταν διπλώνουν!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Κανόνες Ελέγχου",
      step3Title: "Πότε ένα Σχήμα Είναι Ανάπτυγμα;",
      step3P1: "Για τον κύβο υπάρχουν ακριβώς 11 διαφορετικά δυνατά αναπτύγματα (π.χ. σχήμα σταυρού ή Τ):",
      step3NotTitle: "✗ ΔΕΝ είναι ανάπτυγμα αν:",
      step3Not1: "• Έχει 5 ή 6 τετράγωνα στην ίδια ευθεία γραμμή.",
      step3Not2: "• Περιέχει 4 τετράγωνα σε μπλοκ 2 × 2 (τετράγωνο από τετράγωνα).",
      step3Not3: "• Οι απέναντι βάσεις βρίσκονται στην ίδια πλευρά της κεντρικής λωρίδας.",
      step3Tip: "🎯 Ένας πρακτικός τρόπος: Φανταστείτε ποια έδρα είναι η βάση (κάτω) και «σηκώστε» νοερά τις πλαϊνές έδρες γύρω της!",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Ολική Επιφάνεια",
      step4Title: "Εμβαδόν Αναπτύγματος",
      step4P1: "Το εμβαδόν του αναπτύγματος ισούται με την ολική επιφάνεια του στερεού (άθροισμα των 6 εδρών):",
      step4CubeFormulaTitle: "• Κύβος με ακμή α:",
      step4CubeFormulaSub: "Κάθε έδρα έχει εμβαδόν α². Άρα:",
      step4CubeFormula: "Εολ ＝ 6 · α²",
      step4CuboidFormulaTitle: "• Ορθογώνιο με ακμές α, β, γ:",
      step4CuboidFormulaSub: "Έχει 3 ζεύγη ίσων εδρών. Άρα:",
      step4CuboidFormula: "Εολ ＝ 2 · (α · β ＋ β · γ ＋ α · γ)",
      step4Tip: "🚀 Το εμβαδόν του χαρτονιού που απαιτείται για να φτιάξουμε ένα κουτί ισούται ακριβώς με το εμβαδόν του αναπτύγματός του!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Διαδραστικό Δίπλωμα Αναπτύγματος σε 3D Κουτί (SVG)",
      lab1Desc: "Επίλεξε γεωμετρικό στερεό (Κύβος ή Ορθογώνιο Παραλληλεπίπεδο) και σύρε την μπάρα για να δεις πώς το επίπεδο ανάπτυγμα διπλώνει τις 6 έδρες του σχηματίζοντας το κλειστό τρισδιάστατο κουτί:",
      lab1SelectLabel: "1. ΕΠΙΛΟΓΗ ΣΤΕΡΕΟΥ:",
      lab1BtnCube: "🎲 Κύβος (6 ίσα τετράγωνα)",
      lab1BtnCuboid: "📦 Ορθογώνιο Παραλληλεπίπεδο",
      lab1SliderLabel: "ΑΝΑΔΙΠΛΩΣΗ ΕΔΡΩΝ (ΔΙΠΛΩΜΑ):",
      lab1State0: "0% (Επίπεδο Ανάπτυγμα)",
      lab1State50: "50% (Δίπλωμα)",
      lab1State100: "100% (Κλειστό 3D Στερεό)",
      lab1Info0: "🔷 Στάδιο 0: Επίπεδο ανάπτυγμα σταυρού με και τις 6 έδρες εντελώς απλωμένες.",
      lab1InfoProgress: "🔄 Οι 4 πλαϊνές έδρες σηκώνονται κάθετα γύρω από τη βάση και το καπάκι διπλώνει...",
      lab1InfoDone: "🟩 Στάδιο 100%: Όλες οι ακμές συναντήθηκαν απόλυτα! Το 3D κουτί έκλεισε.",
      lab1Stats: "6 Έδρες • 12 Ακμές • 8 Κορυφές",
      lab1ClosedMsg: "✓ Το τρισδιάστατο κουτί έκλεισε με 6 έδρες, 12 ακμές και 8 κορυφές!",
      lab1FoldingMsg: "Όλες οι έδρες παραμένουν απόλυτα ενωμένες κατά το δίπλωμα.",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΟΥ ΑΝΑΠΤΥΓΜΑΤΟΣ",
      lab2Title: "Υπολογισμός Εμβαδού Χαρτονιού (Ολική Επιφάνεια)",
      lab2Desc: "Ρύθμισε τις διαστάσεις του κουτιού (μήκος α, πλάτος β, ύψος γ) για να υπολογίσεις το εμβαδόν των 6 εδρών του και το συνολικό χαρτόνι που απαιτείται:",
      lab2LengthLabel: "ΜΗΚΟΣ (α):",
      lab2WidthLabel: "ΠΛΑΤΟΣ (β):",
      lab2HeightLabel: "ΥΨΟΣ (γ):",
      lab2Face1: "2 έδρες (α · β):",
      lab2Face2: "2 έδρες (β · γ):",
      lab2Face3: "2 έδρες (α · γ):",
      lab2TotalHeader: "ΟΛΙΚΟ ΕΜΒΑΔΟΝ ΑΝΑΠΤΥΓΜΑΤΟΣ (6 ΕΔΡΕΣ)",
      lab2TotalSub: "Συνολικό εμβαδόν χαρτονιού για την κατασκευή του κουτιού",
      lab2InDm2: "Σε dm² (: 100):",
      lab2InM2: "Σε m² (: 10.000):",
      lab2CubeEquivalent: "💡 Αν όλες οι ακμές ήταν ίσες ({a} cm), θα είχαμε κύβο με Εολ ＝ 6 · {a}² ＝ {cubeArea} cm²!",

      probHeading: "Λυμένα Προβλήματα με Αναπτύγματα & Επιφάνειες",
      probSubheading: "Εφαρμογές του εμβαδού αναπτύγματος σε κουτιά δώρων και κατασκευές.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΚΟΥΤΙ ΔΩΡΟΥ",
      prob1Subtitle: "Ορθογώνιο Παραλληλεπίπεδο",
      prob1Title: "Υπολογισμός Χαρτιού Περιτυλίγματος για Κουτί",
      prob1Text: "Ένα κουτί δώρου σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος 20 cm, πλάτος 15 cm και ύψος 10 cm. Πόσα τετραγωνικά εκατοστόμετρα (cm²) χαρτιού περιτυλίγματος χρειάζονται κατ' ελάχιστο για να καλυφθούν και οι 6 έδρες του;",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1LengthLabel: "Μήκος (α)",
      prob1WidthLabel: "Πλάτος (β)",
      prob1HeightLabel: "Ύψος (γ)",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "2 έδρες βάσεων (20 · 15): 2 · 300 ＝ 600 cm².",
      prob1Step2: "2 πλαϊνές έδρες (15 · 10): 2 · 150 ＝ 300 cm².",
      prob1Step3: "2 εμπρός/πίσω έδρες (20 · 10): 2 · 200 ＝ 400 cm².",
      prob1Step4: "Ολικό εμβαδόν αναπτύγματος: 600 ＋ 300 ＋ 400 ＝ 1.300 cm² (ή 13 dm²).",
      prob1Tip: "💡 Το ορθογώνιο παραλληλεπίπεδο έχει 3 ζεύγη ίσων εδρών, άρα υπολογίζουμε τα 3 επιμέρους εμβαδά και τα διπλασιάζουμε!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΑΤΑΣΚΕΥΗ ΚΥΒΟΥ",
      prob2Subtitle: "Ε ＝ 6 · α²",
      prob2Title: "Υπολογισμός Χαρτονιού για Κύβο",
      prob2Text: "Ένας μαθητής θέλει να φτιάξει ένα ζάρι σε σχήμα κύβου με μήκος ακμής 8 cm. Πόσο χαρτόνι σε cm² θα καταλαμβάνει το ανάπτυγμα του κύβου;",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2EdgeLabel: "Ακμή κύβου (α)",
      prob2FacesCountLabel: "Πλήθος εδρών",
      prob2FacesCountValue: "6 ίσα τετράγωνα",
      prob2FormulaLabel: "Τύπος",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "Εμβαδόν 1 έδρας (τετράγωνο): α² ＝ 8 · 8 ＝ 64 cm².",
      prob2Step2: "Ολική επιφάνεια 6 εδρών: 6 · 64 ＝ 384 cm².",
      prob2Tip: "⚡ Στον κύβο και οι 6 έδρες είναι απολύτως ίσες μεταξύ τους, άρα πολλαπλασιάζουμε το εμβαδόν της μίας έδρας επί 6!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Δεν είναι κάθε διάταξη 6 τετραγώνων ανάπτυγμα κύβου:",
      alertL1Text: " Αν 4 τετράγωνα σχηματίζουν ένα μεγάλο τετράγωνο (μπλοκ 2 × 2) ή αν 5 τετράγωνα είναι στη σειρά, το σχήμα δεν διπλώνει σε κύβο γιατί κάποιες έδρες θα επικαλυφθούν.",
      alertL2Bold: "Μην μπερδεύετε τις ακμές με τις κορυφές:",
      alertL2Text: " Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν 12 ακμές (γραμμές) και 8 κορυφές (σημεία/γωνίες).",
      alertL3Bold: "Στο ορθογώνιο παραλληλεπίπεδο οι απέναντι έδρες είναι ίσες:",
      alertL3Text: " Δεν έχουν και οι 6 έδρες το ίδιο μέγεθος (εκτός αν είναι κύβος). Υπάρχουν 3 ζεύγη ίσων εδρών (βάσεις, πλαϊνές, εμπρός/πίσω).",
      alertL4Bold: "Προσοχή στις μονάδες επιφάνειας:",
      alertL4Text: " Όπως σε κάθε εμβαδόν, το εμβαδόν του αναπτύγματος μετριέται σε τετραγωνικές μονάδες (cm², dm², m²), ενώ τα μήκη των ακμών σε απλές μονάδες μήκους (cm, m).",

      ctaTitle: "Ώρα για Εξάσκηση στα Αναπτύγματα Στερεών!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με έδρες, ακμές, κορυφές, αναπτύγματα κύβου και ολική επιφάνεια για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Nets of Cube & Rectangular Prism - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn about the faces, edges, vertices, and geometric nets of the cube and rectangular prism, how they fold into 3D, and how to calculate total surface area.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 77 • 6TH GRADE",
      heroTitle: "Geometric Solids & Nets • Cube & Rectangular Prism",
      heroDesc: "Discover how a three-dimensional box unfolds into a flat surface, explore solid components (faces, edges, vertices), examine cube nets, and calculate total surface area!",
      heroFeature: "Theory, Faces, Edges, Vertices, Interactive 3D Folding & SVG",
      tryExercises: "Try Exercises",

      stepsHeading: "Solid Nets in 4 Steps",
      stepsSubheading: "From solid geometry structures to unfolding and surface area calculations.",

      step1Badge: "STEP 1",
      step1Subtitle: "Solid Components",
      step1Title: "Faces, Edges & Vertices",
      step1P1: "Both the cube and the rectangular prism have exactly:",
      step1L1: "• 6 Faces (the flat surfaces bounding the solid)",
      step1L2: "• 12 Edges (line segments where faces meet)",
      step1L3: "• 8 Vertices (corner points where 3 edges meet)",
      step1CubeDiff: "Cube: All 6 faces are congruent squares.",
      step1CuboidDiff: "Rectangular Prism: Faces are rectangles (opposite faces are congruent pairs).",
      step1Tip: "💡 The cube is a special case of a rectangular prism where all edges are equal!",

      step2Badge: "STEP 2",
      step2Subtitle: "Definition",
      step2Title: "What is a Geometric Net?",
      step2P1: "A geometric net of a solid is the flat 2D shape obtained when we:",
      step2L1: "1. Cut open selected edges of the solid.",
      step2L2: "2. Flatten all its faces out so they lay flat on a surface.",
      step2L3: "Folding the net back along the common edges precisely reconstructs the original 3D box!",
      step2Tip: "⚡ All 6 faces of the net must stay connected without overlapping when folded!",

      step3Badge: "STEP 3",
      step3Subtitle: "Validation Rules",
      step3Title: "When is a Pattern a Valid Net?",
      step3P1: "For a cube, there are exactly 11 distinct valid nets (such as the cross or T-shape):",
      step3NotTitle: "✗ It is NOT a valid net if:",
      step3Not1: "• It has 5 or 6 squares in a straight row.",
      step3Not2: "• It contains a 2 × 2 block of squares (a larger square of 4 squares).",
      step3Not3: "• Opposite bases are on the same side of the central row.",
      step3Tip: "🎯 Practical tip: Imagine one square as the bottom base and mentally fold the surrounding walls upward!",

      step4Badge: "STEP 4",
      step4Subtitle: "Total Surface Area",
      step4Title: "Net Surface Area",
      step4P1: "The area of a net equals the total surface area of the solid (sum of all 6 faces):",
      step4CubeFormulaTitle: "• Cube with edge a:",
      step4CubeFormulaSub: "Each face has area a². Therefore:",
      step4CubeFormula: "Atot ＝ 6 · a²",
      step4CuboidFormulaTitle: "• Prism with edges a, b, c:",
      step4CuboidFormulaSub: "It has 3 pairs of congruent faces. Therefore:",
      step4CuboidFormula: "Atot ＝ 2 · (a · b ＋ b · c ＋ a · c)",
      step4Tip: "🚀 The total cardboard area needed to construct a box matches the area of its geometric net!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "Interactive Net Folding into a 3D Box (SVG)",
      lab1Desc: "Select a solid (Cube or Rectangular Prism) and drag the slider to watch the flat net fold its 6 faces to assemble a closed 3D box:",
      lab1SelectLabel: "1. SELECT SOLID:",
      lab1BtnCube: "🎲 Cube (6 congruent squares)",
      lab1BtnCuboid: "📦 Rectangular Prism",
      lab1SliderLabel: "FACE FOLDING PROGRESS:",
      lab1State0: "0% (Flat Net)",
      lab1State50: "50% (Folding)",
      lab1State100: "100% (Closed 3D Solid)",
      lab1Info0: "🔷 Stage 0: Flat cross net with all 6 faces spread out horizontally.",
      lab1InfoProgress: "🔄 The 4 side faces rise vertically around the base and the lid folds into place...",
      lab1InfoDone: "🟩 Stage 100%: All edges met perfectly! The 3D box is fully closed.",
      lab1Stats: "6 Faces • 12 Edges • 8 Vertices",
      lab1ClosedMsg: "✓ 3D box closed with 6 faces, 12 edges, and 8 vertices!",
      lab1FoldingMsg: "All faces remain connected during the folding process.",

      lab2Badge: "📐 INTERACTIVE LAB 2: NET AREA CALCULATOR",
      lab2Title: "Cardboard Area Calculator (Total Surface Area)",
      lab2Desc: "Adjust box dimensions (length a, width b, height c) to calculate individual face areas and total required cardboard:",
      lab2LengthLabel: "LENGTH (a):",
      lab2WidthLabel: "WIDTH (b):",
      lab2HeightLabel: "HEIGHT (c):",
      lab2Face1: "2 faces (a · b):",
      lab2Face2: "2 faces (b · c):",
      lab2Face3: "2 faces (a · c):",
      lab2TotalHeader: "TOTAL NET AREA (6 FACES)",
      lab2TotalSub: "Total cardboard area needed to craft the box",
      lab2InDm2: "In dm² (: 100):",
      lab2InM2: "In m² (: 10,000):",
      lab2CubeEquivalent: "💡 If all edges were equal ({a} cm), we would have a cube with Atot ＝ 6 · {a}² ＝ {cubeArea} cm²!",

      probHeading: "Solved Problems on Nets & Surfaces",
      probSubheading: "Practical applications of net surface area in gift boxes and geometric crafts.",

      prob1Badge: "PROBLEM 1: GIFT BOX",
      prob1Subtitle: "Rectangular Prism",
      prob1Title: "Calculating Wrapping Paper for a Box",
      prob1Text: "A gift box in the shape of a rectangular prism has length 20 cm, width 15 cm, and height 10 cm. How many square centimeters (cm²) of wrapping paper are required at minimum to cover all 6 faces?",
      prob1DataHeader: "PROBLEM DATA",
      prob1LengthLabel: "Length (a)",
      prob1WidthLabel: "Width (b)",
      prob1HeightLabel: "Height (c)",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "2 base faces (20 · 15): 2 · 300 ＝ 600 cm².",
      prob1Step2: "2 side faces (15 · 10): 2 · 150 ＝ 300 cm².",
      prob1Step3: "2 front/back faces (20 · 10): 2 · 200 ＝ 400 cm².",
      prob1Step4: "Total net area: 600 ＋ 300 ＋ 400 ＝ 1,300 cm² (or 13 dm²).",
      prob1Tip: "💡 A rectangular prism has 3 pairs of congruent faces, so calculate the 3 partial areas and double them!",

      prob2Badge: "PROBLEM 2: CUBE CONSTRUCTION",
      prob2Subtitle: "A ＝ 6 · a²",
      prob2Title: "Calculating Cardboard for a Cube",
      prob2Text: "A student wants to craft a cubic dice with edge length 8 cm. How many square centimeters (cm²) of cardboard will the cube's net occupy?",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2EdgeLabel: "Cube edge (a)",
      prob2FacesCountLabel: "Face count",
      prob2FacesCountValue: "6 congruent squares",
      prob2FormulaLabel: "Formula",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "Area of 1 face (square): a² ＝ 8 · 8 ＝ 64 cm².",
      prob2Step2: "Total area of 6 faces: 6 · 64 ＝ 384 cm².",
      prob2Tip: "⚡ All 6 faces of a cube are identical, so simply multiply one face's area by 6!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Not every arrangement of 6 squares forms a cube net:",
      alertL1Text: " If 4 squares form a 2 × 2 block or if 5 squares lie in a single row, the shape cannot fold into a cube because faces will overlap.",
      alertL2Bold: "Do not confuse edges with vertices:",
      alertL2Text: " Both cubes and rectangular prisms have 12 edges (lines) and 8 vertices (corner points).",
      alertL3Bold: "In a rectangular prism, opposite faces are equal:",
      alertL3Text: " Not all 6 faces share the same size (unless it is a cube). There are 3 pairs of congruent faces (bases, sides, front/back).",
      alertL4Bold: "Watch area units carefully:",
      alertL4Text: " Net area is measured in square units (cm², dm², m²), whereas edge lengths use linear units (cm, m).",

      ctaTitle: "Time to Practice Solid Nets!",
      ctaDesc: "Test your skills with 12 interactive exercises on faces, edges, vertices, cube nets, and surface area calculations for 6th Grade.",
      ctaButton: "Start Exercises"
    }
  };

  const tLoc = translations[locale] || translations.el;

  return (
    <Layout
      title={tLoc.metaTitle}
      description={tLoc.metaDesc}
      backUrl="/st-dimotikou"
      backText={tLoc.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/77-anaptigma-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{tLoc.actionExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{tLoc.chapterBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {tLoc.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {tLoc.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{tLoc.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/77-anaptigma-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{tLoc.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {tLoc.stepsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {tLoc.stepsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {tLoc.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{tLoc.step1Subtitle}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {tLoc.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {tLoc.step1P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-bold">{tLoc.step1L1}</div>
                  <div className="text-indigo-950 font-bold">{tLoc.step1L2}</div>
                  <div className="text-indigo-950 font-bold">{tLoc.step1L3}</div>
                  <div className="text-[11px] text-slate-600 font-sans pt-1 border-t border-slate-200">
                    <strong>{tLoc.step1CubeDiff}</strong><br />
                    <strong>{tLoc.step1CuboidDiff}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {tLoc.step1Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {tLoc.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{tLoc.step2Subtitle}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {tLoc.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {tLoc.step2P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>{tLoc.step2L1}</div>
                  <div>{tLoc.step2L2}</div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    {tLoc.step2L3}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {tLoc.step2Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {tLoc.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{tLoc.step3Subtitle}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {tLoc.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {tLoc.step3P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-rose-900 font-bold">{tLoc.step3NotTitle}</div>
                  <div>{tLoc.step3Not1}</div>
                  <div>{tLoc.step3Not2}</div>
                  <div>{tLoc.step3Not3}</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {tLoc.step3Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {tLoc.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{tLoc.step4Subtitle}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {tLoc.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {tLoc.step4P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    <strong>{tLoc.step4CubeFormulaTitle}</strong><br />
                    {tLoc.step4CubeFormulaSub}<br />
                    <strong className="text-emerald-700">{tLoc.step4CubeFormula}</strong>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <strong>{tLoc.step4CuboidFormulaTitle}</strong><br />
                    {tLoc.step4CuboidFormulaSub}<br />
                    <strong className="text-indigo-700">{tLoc.step4CuboidFormula}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {tLoc.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΙΣΟΜΕΤΡΙΚΟ ΔΙΠΛΩΜΑ ΑΝΑΠΤΥΓΜΑΤΟΣ ΣΕ 3D ΣΤΕΡΕΟ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{tLoc.lab1Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {tLoc.lab1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {tLoc.lab1Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Επιλογή & Slider (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {tLoc.lab1SelectLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedShape('cube');
                      setFoldProgress(0);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      selectedShape === 'cube'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tLoc.lab1BtnCube}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedShape('cuboid');
                      setFoldProgress(0);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      selectedShape === 'cuboid'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tLoc.lab1BtnCuboid}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1SliderLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {foldProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={foldProgress}
                  onChange={(e) => setFoldProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{tLoc.lab1State0}</span>
                  <span>{tLoc.lab1State50}</span>
                  <span>{tLoc.lab1State100}</span>
                </div>
              </div>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {foldProgress === 0 && tLoc.lab1Info0}
                  {foldProgress > 0 && foldProgress < 100 && tLoc.lab1InfoProgress}
                  {foldProgress === 100 && tLoc.lab1InfoDone}
                </div>
                <div className="text-slate-600 text-[11px] font-mono pt-1 border-t border-sky-200/60">
                  {tLoc.lab1Stats}
                </div>
              </div>
            </div>

            {/* SVG Visualizer Ισομετρικής Προβολής (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 270"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* 1. ΒΑΣΗ (Μπλε) */}
                <polygon
                  points={faces.basePts}
                  fill="rgba(56, 189, 248, 0.45)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. ΠΙΣΩ ΕΔΡΑ (Πράσινη) */}
                <polygon
                  points={faces.backPts}
                  fill="rgba(52, 211, 153, 0.4)"
                  stroke="#34d399"
                  strokeWidth="2"
                />

                {/* 3. ΑΡΙΣΤΕΡΗ ΕΔΡΑ (Indigo) */}
                <polygon
                  points={faces.leftPts}
                  fill="rgba(129, 140, 248, 0.4)"
                  stroke="#818cf8"
                  strokeWidth="2"
                />

                {/* 4. ΔΕΞΙΑ ΕΔΡΑ (Μωβ) */}
                <polygon
                  points={faces.rightPts}
                  fill="rgba(168, 85, 247, 0.4)"
                  stroke="#c084fc"
                  strokeWidth="2"
                />

                {/* 5. ΕΜΠΡΟΣΘΙΑ ΕΔΡΑ (Πορτοκαλί) */}
                <polygon
                  points={faces.frontPts}
                  fill="rgba(245, 158, 11, 0.45)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                {/* 6. ΚΑΠΑΚΙ (Κόκκινο) */}
                <polygon
                  points={faces.lidPts}
                  fill="rgba(244, 63, 94, 0.45)"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {foldProgress === 100 ? tLoc.lab1ClosedMsg : tLoc.lab1FoldingMsg}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΛΙΚΗΣ ΕΠΙΦΑΝΕΙΑΣ ΑΝΑΠΤΥΓΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{tLoc.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {tLoc.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {tLoc.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Διαστάσεων (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2LengthLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimA} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={dimA}
                  onChange={(e) => setDimA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2WidthLabel}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimB} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={dimB}
                  onChange={(e) => setDimB(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2HeightLabel}</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimC} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={dimC}
                  onChange={(e) => setDimC(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono space-y-1">
                <div>{tLoc.lab2Face1} 2 · ({dimA} · {dimB}) ＝ {2 * faceArea1} cm²</div>
                <div>{tLoc.lab2Face2} 2 · ({dimB} · {dimC}) ＝ {2 * faceArea2} cm²</div>
                <div>{tLoc.lab2Face3} 2 · ({dimA} · {dimC}) ＝ {2 * faceArea3} cm²</div>
              </div>
            </div>

            {/* Αποτελέσματα Ολικής Επιφάνειας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2TotalHeader}
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatNum(totalSurfaceAreaCm2, locale)} cm²
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {tLoc.lab2TotalSub}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InDm2}</span>
                  <span className="text-amber-400 font-black text-base">{formatNum(totalSurfaceAreaDm2, locale)} dm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InM2}</span>
                  <span className="text-purple-400 font-black text-base">{formatNum(totalSurfaceAreaM2, locale)} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {tLoc.lab2CubeEquivalent
                  .replace('{a}', String(dimA))
                  .replace('{cubeArea}', String(6 * dimA * dimA))}
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {tLoc.probHeading}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {tLoc.probSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  {tLoc.prob1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{tLoc.prob1Subtitle}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {tLoc.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tLoc.prob1Text}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {tLoc.prob1DataHeader}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1LengthLabel}</span> 20 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1WidthLabel}</span> 15 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1HeightLabel}</span> 10 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{tLoc.prob1StepHeader}</span>
                  <div>{tLoc.prob1Step1}</div>
                  <div>{tLoc.prob1Step2}</div>
                  <div>{tLoc.prob1Step3}</div>
                  <div className="pt-1 border-t border-slate-200 font-bold text-blue-700">{tLoc.prob1Step4}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                {tLoc.prob1Tip}
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  {tLoc.prob2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{tLoc.prob2Subtitle}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {tLoc.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {tLoc.prob2Text}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {tLoc.prob2DataHeader}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2EdgeLabel}</span> 8 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2FacesCountLabel}</span> {tLoc.prob2FacesCountValue}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2FormulaLabel}</span> Εολ ＝ 6 · α²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{tLoc.prob2StepHeader}</span>
                  <div>{tLoc.prob2Step1}</div>
                  <div className="pt-1 border-t border-slate-200 font-bold text-amber-700">{tLoc.prob2Step2}</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                {tLoc.prob2Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 6. ALERT BOX: ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ */}
        <section className="bg-amber-50 rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl sm:text-4xl flex-shrink-0">⚠️</span>
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-black text-amber-950">
                {toCleanUppercase(tLoc.alertTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>{tLoc.alertL1Bold}</strong>{tLoc.alertL1Text}
                </li>
                <li>
                  <strong>{tLoc.alertL2Bold}</strong>{tLoc.alertL2Text}
                </li>
                <li>
                  <strong>{tLoc.alertL3Bold}</strong>{tLoc.alertL3Text}
                </li>
                <li>
                  <strong>{tLoc.alertL4Bold}</strong>{tLoc.alertL4Text}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {tLoc.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {tLoc.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/77-anaptigma-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(tLoc.ctaButton)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
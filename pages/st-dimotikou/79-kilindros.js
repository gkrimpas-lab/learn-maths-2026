// pages/st-dimotikou/79-kilindros.js
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

export default function KilindrosTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστικό Άνοιγμα Καπακιών & Ξετύλιγμα Κυλίνδρου (SVG)
  // -------------------------------------------------------------------------
  const [animProgress, setAnimProgress] = useState(0);

  const radiusR = 34; // Ακτίνα ρ = 34px
  const heightH = 80; // Ύψος υ = 80px
  const rectW = 2 * Math.PI * radiusR; // 2 · 3,1415 · 34 ≈ 214px
  const centerX = 210; // Κέντρο καμβά
  const topY = 110;

  // Στάδιο 1: 0% έως 40% (Άνοιγμα καπακιών)
  const capStage = Math.min(1, animProgress / 40);
  const capTopOffset = capStage * (radiusR + 12);
  const capBottomOffset = capStage * (radiusR + 42);

  // Στάδιο 2: 40% έως 100% (Ξετύλιγμα παράπλευρης επιφάνειας)
  const unrollStage = Math.max(0, (animProgress - 40) / 60);

  const startW = radiusR * 2;
  const currentW = startW + unrollStage * (rectW - startW);
  const cylinderOpacity = Math.max(0, 1 - unrollStage * 1.5);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδών Κυλίνδρου
  // -------------------------------------------------------------------------
  const [calcRadius, setCalcRadius] = useState(5); // Ακτίνα σε cm
  const [calcHeight, setCalcHeight] = useState(10); // Ύψος σε cm
  const piVal = 3.14;

  const diameter = useMemo(() => calcRadius * 2, [calcRadius]);
  const baseCircumference = useMemo(() => 2 * piVal * calcRadius, [calcRadius]);
  const oneBaseArea = useMemo(() => piVal * calcRadius * calcRadius, [calcRadius]);
  const twoBasesArea = useMemo(() => 2 * oneBaseArea, [oneBaseArea]);
  const lateralArea = useMemo(() => baseCircumference * calcHeight, [baseCircumference, calcHeight]);
  const totalArea = useMemo(() => lateralArea + twoBasesArea, [lateralArea, twoBasesArea]);

  const totalAreaDm2 = useMemo(() => totalArea / 100, [totalArea]);
  const totalAreaM2 = useMemo(() => totalArea / 10000, [totalArea]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Κύλινδρος: Ανάπτυγμα & Εμβαδόν Επιφάνειας - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε για τον κύλινδρο, το ανάπτυγμά του, πώς υπολογίζουμε το εμβαδόν βάσεων, παράπλευρης και ολικής επιφάνειας με διαδραστικά εργαστήρια SVG.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 79 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ο Κύλινδρος • Ανάπτυγμα, Παράπλευρη & Ολική Επιφάνεια",
      heroDesc: "Ανακαλύπτουμε τα μυστικά του κυλίνδρου! Βλέπουμε πώς ένα κονσερβοκούτι ή ένα βαρέλι «ξετυλίγεται» σε ένα ορθογώνιο παραλληλόγραμμο και δύο ίσους κυκλικούς δίσκους, και μαθαίνουμε να υπολογίζουμε με ευκολία το εμβαδόν των βάσεων, την παράπλευρη επιφάνεια και το ολικό εμβαδόν.",
      heroFeature: "Θεωρία, Ανάπτυγμα, Παράπλευρη & Ολική Επιφάνεια & Διαδραστικά Εργαστήρια",
      tryExercises: "Δοκίμασε τις Ασκήσεις",

      stepsHeading: "Ο Κύλινδρος σε 4 Βήματα",
      stepsSubheading: "Από τη δομή του στερεού μέχρι το ξετύλιγμα της παράπλευρης επιφάνειας και τον τελικό υπολογισμό.",

      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Στοιχεία Στερεού",
      step1Title: "Τι είναι ο Κύλινδρος;",
      step1P1: "Ο κύλινδρος είναι ένα σώμα εκ περιστροφής (δεν είναι πολύεδρο) που αποτελείται από:",
      step1BasesTitle: "• 2 Παράλληλες Βάσεις:",
      step1BasesDesc: "Δύο απολύτως ίσοι κυκλικοί δίσκοι με ακτίνα ρ (πάνω και κάτω βάση).",
      step1LatTitle: "• 1 Καμπύλη Παράπλευρη Επιφάνεια:",
      step1LatDesc: "Η κυρτή επιφάνεια που αγκαλιάζει τις δύο βάσεις με ύψος υ.",
      step1Tip: "💡 Παραδείγματα στην καθημερινή ζωή: κονσέρβες, σωλήνες, κολόνες, ποτήρια, βαρέλια και μπαταρίες!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Το Ανάπτυγμα",
      step2Title: "Πώς Ξετυλίγεται ο Κύλινδρος;",
      step2P1: "Αν «κόψουμε» κατακόρυφα την παράπλευρη επιφάνεια και την ανοίξουμε επίπεδα:",
      step2L1: "1. Η παράπλευρη επιφάνεια γίνεται ένα ορθογώνιο παραλληλόγραμμο.",
      step2Length: "• Μήκος ορθογωνίου: Ίσο με την περίμετρο του κύκλου της βάσης: 2 · π · ρ.",
      step2Width: "• Πλάτος ορθογωνίου: Ίσο με το ύψος του κυλίνδρου: υ.",
      step2L2: "Επίσης, συνδέονται οι δύο κυκλικοί δίσκοι των βάσεων (επάνω και κάτω).",
      step2Tip: "⚡ Σκεφτείτε την ετικέτα μιας κονσέρβας: όταν την ξεκολλάμε, είναι ένα απλό ορθογώνιο χαρτί!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Οι Τύποι",
      step3Title: "Υπολογισμός Εμβαδών",
      step3P1: "Χρησιμοποιούμε τον μαθηματικό αριθμό π ≈ 3,14 και την ακτίνα ρ:",
      step3Base1: "• Εμβαδόν 1 Βάσης:",
      step3Base1Formula: "Εβ ＝ π · ρ² ＝ 3,14 · ρ · ρ",
      step3Base2: "• Εμβαδόν 2 Βάσεων:",
      step3Base2Formula: "2 · Εβ ＝ 2 · (π · ρ²)",
      step3Lat: "• Παράπλευρη Επιφάνεια:",
      step3LatFormula: "Επ ＝ (2 · π · ρ) · υ",
      step3Total: "• Ολική Επιφάνεια: Εολ ＝ Επ ＋ 2 · Εβ",
      step3Tip: "🎯 Αν το δοχείο είναι ανοιχτό από πάνω (χωρίς καπάκι), υπολογίζουμε μόνο τη 1 βάση: Εολ ＝ Επ ＋ Εβ!",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Εφαρμογές",
      step4Title: "Μονάδες & Προσοχή στη Διάμετρο",
      step4P1: "Πρακτικοί κανόνες για σωστή επίλυση προβλημάτων:",
      step4DiamRule: "• Αν δίνεται η διάμετρος (δ):",
      step4DiamSub: "Βρίσκουμε πρώτα την ακτίνα: ρ ＝ δ : 2.",
      step4UnitsRule: "• Μονάδες Επιφάνειας:",
      step4UnitsSub: "1 m² ＝ 100 dm² ＝ 10.000 cm². Όλα τα εμβαδά μετριούνται σε τετραγωνικές μονάδες (cm², m²).",
      step4Tip: "🚀 Βεβαιωθείτε ότι η ακτίνα ρ και το ύψος υ είναι εκφρασμένα στην ίδια μονάδα μέτρησης πριν πολλαπλασιάσετε!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Πώς Ανοίγει ο Κύλινδρος στο Ανάπτυγμά του; (SVG)",
      lab1Desc: "Σύρε την μπάρα προόδου: Στο πρώτο στάδιο τα 2 καπάκια ανοίγουν πάνω και κάτω, και στο δεύτερο στάδιο η κυρτή επιφάνεια ξετυλίγεται σε ορθογώνιο διαστάσεων (2 · π · ρ) επί υ:",
      lab1SliderLabel: "ΣΤΑΔΙΟ ΑΝΑΠΤΥΓΜΑΤΟΣ:",
      lab1State0: "0% (Κύλινδρος)",
      lab1State40: "40% (Άνοιγμα Καπακιών)",
      lab1State100: "100% (Πλήρες Ανάπτυγμα)",
      lab1Info0: "🔷 Στάδιο 0: Κλειστός κύλινδρος με 2 κυκλικές βάσεις και καμπύλη επιφάνεια.",
      lab1InfoStage1: "🔄 Στάδιο 1: Τα δύο κυκλικά καπάκια ξεκουμπώνουν και ανοίγουν πάνω & κάτω...",
      lab1InfoStage2: "🔄 Στάδιο 2: Η καμπύλη παράπλευρη επιφάνεια ξετυλίγεται ομαλά σε ορθογώνιο φύλλο...",
      lab1InfoDone: "🟩 Ολοκληρώθηκε: 1 ορθογώνιο μήκους (2 · π · ρ) και 2 κυκλικές βάσεις!",
      lab1SummaryRectLen: "Μήκος Ορθογωνίου: 2 · π · ρ ＝ 2 · 3,14 · 34 ≈ 214 px",
      lab1SummaryRectHeight: "Ύψος Ορθογωνίου: Ύψος υ ＝ 80 px",
      lab1SummaryLatArea: "Εμβαδόν Παράπλευρης: Επ ＝ (2 · π · ρ) · υ",
      lab1SummaryTotArea: "Ολικό Εμβαδόν: Εολ ＝ Επ ＋ 2 · (π · ρ²)",
      lab1SvgLatTitle: "Παράπλευρη Επιφάνεια",
      lab1SvgUnrolling: "Ξετύλιγμα...",
      lab1SvgLatFormula: "Επ ＝ (2 · π · ρ) · υ",
      lab1SvgRadiusSym: "ρ",
      lab1SvgBaseWord: "Βάση",
      lab1SvgRectLenLabel: "Μήκος ＝ 2 · π · ρ",
      lab1SvgHeightSym: "υ",
      lab1StatusClosed: "Τα δύο καπάκια ξεκουμπώνουν πάνω και κάτω από τον κύλινδρο.",
      lab1StatusUnrolling: "Τα καπάκια άνοιξαν και η παράπλευρη επιφάνεια απλώνει σε ορθογώνιο.",
      lab1StatusComplete: "✓ Το ανάπτυγμα ολοκληρώθηκε: 1 ορθογώνιο (2 · π · ρ) · υ και 2 κυκλικές βάσεις π · ρ².",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΩΝ",
      lab2Title: "Υπολογισμός Παράπλευρης & Ολικής Επιφάνειας",
      lab2Desc: "Άλλαξε την ακτίνα (ρ) και το ύψος (υ) σε cm για να υπολογίσεις αυτόματα όλα τα εμβαδά του κυλίνδρου:",
      lab2RadiusLabel: "ΑΚΤΙΝΑ ΒΑΣΗΣ (ρ):",
      lab2HeightLabel: "ΥΨΟΣ ΚΥΛΙΝΔΡΟΥ (υ):",
      lab2DiameterText: "Διάμετρος:",
      lab2BaseCirc: "Περίμετρος βάσης: 2 · π · ρ ＝ 2 · 3,14 ·",
      lab2OneBase: "Εμβαδόν 1 βάσης: π · ρ² ＝ 3,14 ·",
      lab2TwoBases: "Εμβαδόν 2 βάσεων: 2 ·",
      lab2LatArea: "Παράπλευρη επιφάνεια:",
      lab2TotalHeader: "ΟΛΙΚΟ ΕΜΒΑΔΟΝ ΚΥΛΙΝΔΡΟΥ (Εολ ＝ Επ ＋ 2 · Εβ)",
      lab2TotalSub: "({lat} cm² παράπλευρη ＋ {bases} cm² 2 βάσεις)",
      lab2InDm2: "Σε dm² (: 100):",
      lab2InM2: "Σε m² (: 10.000):",
      lab2OpenWarning: "💡 Αν ο κύλινδρος είναι ανοιχτός από πάνω (π.χ. ποτήρι), το ολικό εμβαδόν είναι Επ ＋ Εβ ＝ {openArea} cm².",

      probHeading: "Λυμένα Προβλήματα με Εμβαδόν Κυλίνδρου",
      probSubheading: "Εφαρμογές των τύπων σε μεταλλικές κονσέρβες και βαρέλια αποθήκευσης.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΕΤΙΚΕΤΑ ΚΟΝΣΕΡΒΑΣ",
      prob1Subtitle: "Παράπλευρη Επιφάνεια",
      prob1Title: "Υπολογισμός Χάρτινης Ετικέτας για Κονσέρβα",
      prob1Text: "Μια κυλινδρική κονσέρβα έχει διάμετρο βάσης 10 cm και ύψος 12 cm. Πόσα τετραγωνικά εκατοστόμετρα (cm²) χαρτιού χρειάζονται για να καλυφθεί ολόκληρη η γύρω-γύρω επιφάνειά της (η ετικέτα); (Χρησιμοποιήστε π ＝ 3,14)",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1Diameter: "Διάμετρος (δ)",
      prob1Radius: "Ακτίνα (ρ)",
      prob1Height: "Ύψος (υ)",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "Η ετικέτα καλύπτει μόνο την παράπλευρη επιφάνεια (όχι τα καπάκια).",
      prob1Step2: "Μήκος ετικέτας (περίμετρος βάσης): 2 · π · ρ ＝ 2 · 3,14 · 5 ＝ 31,4 cm.",
      prob1Step3: "Εμβαδόν ετικέτας (Επ): 31,4 · 12 ＝ 376,8 cm².",
      prob1Tip: "💡 Όταν μας ζητείται η ετικέτα, υπολογίζουμε αποκλειστικά την παράπλευρη επιφάνεια: Επ ＝ (2 · π · ρ) · υ!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΒΑΨΙΜΟ ΒΑΡΕΛΙΟΥ",
      prob2Subtitle: "Ολική Επιφάνεια",
      prob2Title: "Βάψιμο Κλειστού Κυλινδρικού Βαρελιού",
      prob2Text: "Ένα μεταλλικό κλειστό βαρέλι έχει ακτίνα βάσης 0,5 m και ύψος 2 m. Θέλουμε να βάψουμε ολόκληρη την εξωτερική του επιφάνεια (και τα δύο καπάκια και γύρω-γύρω). Πόσα m² θα βαφτούν; (π ＝ 3,14)",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2Radius: "Ακτίνα (ρ)",
      prob2Height: "Ύψος (υ)",
      prob2Formula: "Τύπος",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "Παράπλευρη επιφάνεια: 2 · 3,14 · 0,5 · 2 ＝ 3,14 · 2 ＝ 6,28 m².",
      prob2Step2: "Εμβαδόν 1 βάσης: 3,14 · 0,5 · 0,5 ＝ 3,14 · 0,25 ＝ 0,785 m².",
      prob2Step3: "Εμβαδόν 2 βάσεων: 2 · 0,785 ＝ 1,57 m².",
      prob2Step4: "Ολική επιφάνεια: 6,28 ＋ 1,57 ＝ 7,85 m².",
      prob2Tip: "⚡ Επειδή το βαρέλι είναι κλειστό, προσθέτουμε οπωσδήποτε και τις 2 κυκλικές βάσεις (καπάκια)!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Μην ξεχνάτε ότι οι βάσεις είναι ΔΥΟ:",
      alertL1Text: " Στην ολική επιφάνεια του κλειστού κυλίνδρου προσθέτουμε δύο βάσεις: Εολ ＝ Επ ＋ 2 · Εβ (όχι μόνο μία).",
      alertL2Bold: "Μην μπερδεύετε το 2 · π · ρ με το π · ρ²:",
      alertL2Text: " Το 2 · π · ρ είναι το μήκος της περιφέρειας (το μήκος του ορθογωνίου). Το π · ρ² είναι το εμβαδόν του κυκλικού δίσκου (της βάσης).",
      alertL3Bold: "Αν δίνεται η διάμετρος:",
      alertL3Text: " Πάντα πρώτα διαιρούμε με το 2 για να βρούμε την ακτίνα ρ: ρ ＝ δ : 2.",
      alertL4Bold: "Ανοιχτά δοχεία:",
      alertL4Text: " Προσέξτε την εκφώνηση! Αν το δοχείο είναι ανοιχτό από πάνω (όπως ένα ποτήρι ή κουβάς), έχει μόνο 1 βάση. Αν είναι σωλήνας ανοιχτός και από τις δύο μεριές, υπολογίζουμε μόνο την παράπλευρη επιφάνεια.",

      ctaTitle: "Ώρα για Εξάσκηση στον Κύλινδρο!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς παράπλευρης επιφάνειας, βάσεων και ολικού εμβαδού κυλίνδρου για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Cylinder: Net & Surface Area - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn about the cylinder, its geometric net, how to calculate base areas, lateral surface area, and total surface area with interactive SVG models.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 79 • 6TH GRADE",
      heroTitle: "The Cylinder • Net, Lateral & Total Surface Area",
      heroDesc: "Discover the geometry of cylinders! Observe how a metal can or barrel unfolds into a flat rectangle and two congruent circular discs, and learn how to easily compute base areas, lateral surface area, and total area.",
      heroFeature: "Theory, Cylinder Net, Lateral & Total Area & Interactive Labs",
      tryExercises: "Try Exercises",

      stepsHeading: "The Cylinder in 4 Steps",
      stepsSubheading: "From solid structure to lateral surface unrolling and total area formulas.",

      step1Badge: "STEP 1",
      step1Subtitle: "Solid Components",
      step1Title: "What is a Cylinder?",
      step1P1: "A cylinder is a solid of revolution (not a polyhedron) formed by:",
      step1BasesTitle: "• 2 Parallel Bases:",
      step1BasesDesc: "Two identical circular discs of radius r (top and bottom bases).",
      step1LatTitle: "• 1 Curved Lateral Surface:",
      step1LatDesc: "The curved surface wrapping the two bases with height h.",
      step1Tip: "💡 Real-life examples: tin cans, pipes, pillars, drinking glasses, barrels, and batteries!",

      step2Badge: "STEP 2",
      step2Subtitle: "The Net",
      step2Title: "How Does a Cylinder Unroll?",
      step2P1: "If we slice the lateral curved surface vertically and flatten it out:",
      step2L1: "1. The lateral surface becomes a flat rectangle.",
      step2Length: "• Rectangle length: Equal to base circumference: 2 · π · r.",
      step2Width: "• Rectangle width: Equal to cylinder height: h.",
      step2L2: "The two circular discs (bases) remain attached at top and bottom.",
      step2Tip: "⚡ Think of a tin can label: once peeled off, it is simply a flat rectangular sheet!",

      step3Badge: "STEP 3",
      step3Subtitle: "The Formulas",
      step3Title: "Area Calculations",
      step3P1: "Using the constant π ≈ 3.14 and radius r:",
      step3Base1: "• 1 Base Area:",
      step3Base1Formula: "Abase ＝ π · r² ＝ 3.14 · r · r",
      step3Base2: "• 2 Bases Area:",
      step3Base2Formula: "2 · Abase ＝ 2 · (π · r²)",
      step3Lat: "• Lateral Surface Area:",
      step3LatFormula: "Alat ＝ (2 · π · r) · h",
      step3Total: "• Total Surface Area: Atot ＝ Alat ＋ 2 · Abase",
      step3Tip: "🎯 If a container has no lid (open at top), add only 1 base: Atot ＝ Alat ＋ Abase!",

      step4Badge: "STEP 4",
      step4Subtitle: "Applications",
      step4Title: "Units & Diameter Caution",
      step4P1: "Essential problem-solving guidelines:",
      step4DiamRule: "• When diameter (d) is given:",
      step4DiamSub: "Always find the radius first: r ＝ d : 2.",
      step4UnitsRule: "• Area Units:",
      step4UnitsSub: "1 m² ＝ 100 dm² ＝ 10,000 cm². All areas are measured in square units (cm², m²).",
      step4Tip: "🚀 Make sure radius r and height h share the same unit of length before calculating!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "How the Cylinder Unfolds into its Net (SVG)",
      lab1Desc: "Drag the progress slider: First, the two lids open upwards and downwards. Second, the curved surface unrolls into a rectangle of dimensions (2 · π · r) by h:",
      lab1SliderLabel: "NET PROGRESS:",
      lab1State0: "0% (Cylinder)",
      lab1State40: "40% (Lids Open)",
      lab1State100: "100% (Complete Net)",
      lab1Info0: "🔷 Stage 0: Closed cylinder with 2 circular bases and curved lateral surface.",
      lab1InfoStage1: "🔄 Stage 1: The two circular lids unclip and open up and down...",
      lab1InfoStage2: "🔄 Stage 2: The curved surface unrolls smoothly into a flat rectangle...",
      lab1InfoDone: "🟩 Complete: 1 rectangle of length (2 · π · r) and 2 circular bases!",
      lab1SummaryRectLen: "Rectangle Length: 2 · π · r ＝ 2 · 3.14 · 34 ≈ 214 px",
      lab1SummaryRectHeight: "Rectangle Height: Height h ＝ 80 px",
      lab1SummaryLatArea: "Lateral Area: Alat ＝ (2 · π · r) · h",
      lab1SummaryTotArea: "Total Area: Atot ＝ Alat ＋ 2 · (π · r²)",
      lab1SvgLatTitle: "Lateral Surface",
      lab1SvgUnrolling: "Unrolling...",
      lab1SvgLatFormula: "Alat ＝ (2 · π · r) · h",
      lab1SvgRadiusSym: "r",
      lab1SvgBaseWord: "Base",
      lab1SvgRectLenLabel: "Length ＝ 2 · π · r",
      lab1SvgHeightSym: "h",
      lab1StatusClosed: "The two circular lids unclip from the cylinder.",
      lab1StatusUnrolling: "The lids opened and the lateral surface is flattening into a rectangle.",
      lab1StatusComplete: "✓ Net complete: 1 rectangle (2 · π · r) · h and 2 circular bases π · r².",

      lab2Badge: "📐 INTERACTIVE LAB 2: AREA CALCULATOR",
      lab2Title: "Lateral & Total Area Calculator",
      lab2Desc: "Adjust radius (r) and height (h) in cm to automatically compute all cylinder areas:",
      lab2RadiusLabel: "BASE RADIUS (r):",
      lab2HeightLabel: "CYLINDER HEIGHT (h):",
      lab2DiameterText: "Diameter:",
      lab2BaseCirc: "Base perimeter: 2 · π · r ＝ 2 · 3.14 ·",
      lab2OneBase: "1 Base area: π · r² ＝ 3.14 ·",
      lab2TwoBases: "2 Bases area: 2 ·",
      lab2LatArea: "Lateral area:",
      lab2TotalHeader: "TOTAL CYLINDER AREA (Atot ＝ Alat ＋ 2 · Abase)",
      lab2TotalSub: "({lat} cm² lateral ＋ {bases} cm² 2 bases)",
      lab2InDm2: "In dm² (: 100):",
      lab2InM2: "In m² (: 10,000):",
      lab2OpenWarning: "💡 If the cylinder is open at top (e.g., cup), total area is Alat ＋ Abase ＝ {openArea} cm².",

      probHeading: "Solved Cylinder Problems",
      probSubheading: "Practical formulas applied to cans and storage barrels.",

      prob1Badge: "PROBLEM 1: CAN LABEL",
      prob1Subtitle: "Lateral Surface Area",
      prob1Title: "Calculating Paper Label for a Can",
      prob1Text: "A cylindrical tin can has a base diameter of 10 cm and a height of 12 cm. How many square centimeters (cm²) of paper are needed to cover its side surface (the label)? (Use π ＝ 3.14)",
      prob1DataHeader: "PROBLEM DATA",
      prob1Diameter: "Diameter (d)",
      prob1Radius: "Radius (r)",
      prob1Height: "Height (h)",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "The label covers only the lateral surface (not the top or bottom lids).",
      prob1Step2: "Label length (base circumference): 2 · π · r ＝ 2 · 3.14 · 5 ＝ 31.4 cm.",
      prob1Step3: "Label area (Alat): 31.4 · 12 ＝ 376.8 cm².",
      prob1Tip: "💡 When asked for a label, compute strictly the lateral surface area: Alat ＝ (2 · π · r) · h!",

      prob2Badge: "PROBLEM 2: PAINTING A BARREL",
      prob2Subtitle: "Total Surface Area",
      prob2Title: "Painting a Closed Cylindrical Barrel",
      prob2Text: "A closed metal barrel has a base radius of 0.5 m and a height of 2 m. We want to paint its entire exterior surface (both lids and side). How many m² will be painted? (π ＝ 3.14)",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2Radius: "Radius (r)",
      prob2Height: "Height (h)",
      prob2Formula: "Formula",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "Lateral surface area: 2 · 3.14 · 0.5 · 2 ＝ 3.14 · 2 ＝ 6.28 m².",
      prob2Step2: "1 Base area: 3.14 · 0.5 · 0.5 ＝ 3.14 · 0.25 ＝ 0.785 m².",
      prob2Step3: "2 Bases area: 2 · 0.785 ＝ 1.57 m².",
      prob2Step4: "Total surface area: 6.28 ＋ 1.57 ＝ 7.85 m².",
      prob2Tip: "⚡ Since the barrel is closed, always include both circular bases (top and bottom lids)!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Remember that there are TWO bases:",
      alertL1Text: " In a closed cylinder, add both bases to the lateral area: Atot ＝ Alat ＋ 2 · Abase (not just one).",
      alertL2Bold: "Do not confuse 2 · π · r with π · r²:",
      alertL2Text: " 2 · π · r is the circumference of the circle (length of the rectangle). π · r² is the flat area of the circular base.",
      alertL3Bold: "When diameter is given:",
      alertL3Text: " Always divide by 2 first to find the radius r: r ＝ d : 2.",
      alertL4Bold: "Open containers:",
      alertL4Text: " Pay attention to the wording! If a container is open at the top (like a glass or bucket), it has only 1 base. If it is an open pipe on both sides, compute only the lateral area.",

      ctaTitle: "Time to Practice Cylinder Problems!",
      ctaDesc: "Test your skills with 12 interactive exercises on lateral area, base calculations, and total cylinder surface area for 6th Grade.",
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
          href="/st-dimotikou/79-kilindros-ask"
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
              href="/st-dimotikou/79-kilindros-ask"
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
                  <div className="text-indigo-950 font-bold">
                    {tLoc.step1BasesTitle}
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step1BasesDesc}
                  </div>
                  <div className="text-indigo-950 font-bold pt-1 border-t border-slate-200">
                    {tLoc.step1LatTitle}
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step1LatDesc}
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
                  <div className="font-mono text-xs">{tLoc.step2Length}</div>
                  <div className="font-mono text-xs">{tLoc.step2Width}</div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    {tLoc.step2L2}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    <strong>{tLoc.step3Base1}</strong><br />
                    {tLoc.step3Base1Formula}
                  </div>
                  <div>
                    <strong>{tLoc.step3Base2}</strong><br />
                    {tLoc.step3Base2Formula}
                  </div>
                  <div>
                    <strong>{tLoc.step3Lat}</strong><br />
                    {tLoc.step3LatFormula}
                  </div>
                  <div className="text-indigo-950 font-black pt-1 border-t border-slate-200">
                    {tLoc.step3Total}
                  </div>
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
                    <strong>{tLoc.step4DiamRule}</strong><br />
                    {tLoc.step4DiamSub}
                  </div>
                  <div>
                    <strong>{tLoc.step4UnitsRule}</strong><br />
                    {tLoc.step4UnitsSub}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {tLoc.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΝΟΙΓΜΑ ΚΑΠΑΚΙΩΝ & ΞΕΤΥΛΙΓΜΑ ΚΥΛΙΝΔΡΟΥ (SVG) */}
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

            {/* Slider & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1SliderLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {animProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={animProgress}
                  onChange={(e) => setAnimProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{tLoc.lab1State0}</span>
                  <span>{tLoc.lab1State40}</span>
                  <span>{tLoc.lab1State100}</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {animProgress === 0 && tLoc.lab1Info0}
                  {animProgress > 0 && animProgress < 40 && tLoc.lab1InfoStage1}
                  {animProgress >= 40 && animProgress < 100 && tLoc.lab1InfoStage2}
                  {animProgress === 100 && tLoc.lab1InfoDone}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div><strong>{tLoc.lab1SummaryRectLen}</strong></div>
                  <div><strong>{tLoc.lab1SummaryRectHeight}</strong></div>
                  <div><strong>{tLoc.lab1SummaryLatArea}</strong></div>
                  <div className="text-indigo-900 font-bold">
                    <strong>{tLoc.lab1SummaryTotArea}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[400px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 440 330"
                className="w-full max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* 1. Ξετυλιγμένη Παράπλευρη Επιφάνεια (Ορθογώνιο) */}
                <rect
                  x={centerX - currentW / 2}
                  y={topY}
                  width={currentW}
                  height={heightH}
                  fill="rgba(56, 189, 248, 0.35)"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  rx={unrollStage === 1 ? 2 : 4}
                />

                {/* Σκίαση 3D Κυλίνδρου όταν unrollStage < 1 */}
                {cylinderOpacity > 0 && (
                  <g opacity={cylinderOpacity}>
                    <line x1={centerX - startW / 2} y1={topY} x2={centerX - startW / 2} y2={topY + heightH} stroke="#38bdf8" strokeWidth="2" />
                    <line x1={centerX + startW / 2} y1={topY} x2={centerX + startW / 2} y2={topY + heightH} stroke="#38bdf8" strokeWidth="2" />
                  </g>
                )}

                {/* Ετικέτα Παράπλευρης Επιφάνειας */}
                {animProgress > 45 && (
                  <g>
                    <text
                      x={centerX}
                      y={topY + heightH / 2 - 3}
                      fill="#ffffff"
                      fontSize={animProgress === 100 ? 11 : 9.5}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {animProgress === 100 ? tLoc.lab1SvgLatTitle : tLoc.lab1SvgUnrolling}
                    </text>
                    {animProgress === 100 && (
                      <text
                        x={centerX}
                        y={topY + heightH / 2 + 13}
                        fill="#38bdf8"
                        fontSize="11"
                        fontWeight="black"
                        textAnchor="middle"
                      >
                        {tLoc.lab1SvgLatFormula}
                      </text>
                    )}
                  </g>
                )}

                {/* 2. Πάνω Κυκλική Βάση (Πράσινη) */}
                <g transform={`translate(${centerX}, ${topY - capTopOffset})`}>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={radiusR}
                    ry={14 + capStage * (radiusR - 14)}
                    fill="rgba(52, 211, 153, 0.45)"
                    stroke="#34d399"
                    strokeWidth="2"
                  />
                  {animProgress > 20 && (
                    <>
                      <line x1="0" y1="0" x2={radiusR} y2="0" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
                      <text x={radiusR / 2} y="-6" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                        {tLoc.lab1SvgRadiusSym}
                      </text>
                      <text x="0" y="14" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {tLoc.lab1SvgBaseWord}
                      </text>
                    </>
                  )}
                </g>

                {/* 3. Κάτω Κυκλική Βάση (Μωβ) */}
                <g transform={`translate(${centerX}, ${topY + heightH + capBottomOffset})`}>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={radiusR}
                    ry={14 + capStage * (radiusR - 14)}
                    fill="rgba(168, 85, 247, 0.45)"
                    stroke="#c084fc"
                    strokeWidth="2"
                  />
                  {animProgress > 20 && (
                    <text x="0" y="4" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {tLoc.lab1SvgBaseWord}
                    </text>
                  )}
                </g>

                {/* 4. Ετικέτες & Διαστάσεις Αναπτύγματος στο 100% */}
                {animProgress === 100 && (
                  <g>
                    {/* Ένδειξη Μήκους Ορθογωνίου */}
                    <line x1={centerX - rectW / 2} y1={topY + heightH + 12} x2={centerX + rectW / 2} y2={topY + heightH + 12} stroke="#38bdf8" strokeWidth="1.5" />
                    <text x={centerX} y={topY + heightH + 26} fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                      {tLoc.lab1SvgRectLenLabel}
                    </text>

                    {/* Ένδειξη Ύψους υ */}
                    <line x1={centerX + rectW / 2 + 14} y1={topY} x2={centerX + rectW / 2 + 14} y2={topY + heightH} stroke="#f59e0b" strokeWidth="2" />
                    <text x={centerX + rectW / 2 + 24} y={topY + heightH / 2 + 5} fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="start">
                      {tLoc.lab1SvgHeightSym}
                    </text>
                  </g>
                )}

                {/* Ένδειξη Ύψους υ στο 0% */}
                {animProgress === 0 && (
                  <g>
                    <line x1={centerX + radiusR + 14} y1={topY} x2={centerX + radiusR + 14} y2={topY + heightH} stroke="#f59e0b" strokeWidth="2" />
                    <text x={centerX + radiusR + 24} y={topY + heightH / 2 + 5} fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="start">
                      {tLoc.lab1SvgHeightSym}
                    </text>
                  </g>
                )}
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {animProgress === 100
                  ? tLoc.lab1StatusComplete
                  : animProgress >= 40
                  ? tLoc.lab1StatusUnrolling
                  : tLoc.lab1StatusClosed}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΩΝ ΚΥΛΙΝΔΡΟΥ */}
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

            {/* Sliders Ακτίνας ρ και Ύψους υ (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2RadiusLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcRadius} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={calcRadius}
                  onChange={(e) => setCalcRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1 cm</span>
                  <span>{tLoc.lab2DiameterText} {diameter} cm</span>
                  <span>20 cm</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2HeightLabel}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcHeight} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={30}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1.5">
                <div>{tLoc.lab2BaseCirc} {calcRadius} ＝ <strong>{formatNum(baseCircumference, locale)} cm</strong></div>
                <div>{tLoc.lab2OneBase} {calcRadius} · {calcRadius} ＝ <strong>{formatNum(oneBaseArea, locale)} cm²</strong></div>
                <div>{tLoc.lab2TwoBases} {formatNum(oneBaseArea, locale)} ＝ <strong>{formatNum(twoBasesArea, locale)} cm²</strong></div>
                <div className="text-indigo-900 font-bold">{tLoc.lab2LatArea} {formatNum(baseCircumference, locale)} · {calcHeight} ＝ <strong>{formatNum(lateralArea, locale)} cm²</strong></div>
              </div>
            </div>

            {/* Αποτελέσματα Ολικής Επιφάνειας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2TotalHeader}
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatNum(totalArea, locale)} cm²
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {tLoc.lab2TotalSub
                    .replace('{lat}', formatNum(lateralArea, locale))
                    .replace('{bases}', formatNum(twoBasesArea, locale))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InDm2}</span>
                  <span className="text-amber-400 font-black text-base">{formatNum(totalAreaDm2, locale)} dm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InM2}</span>
                  <span className="text-purple-400 font-black text-base">{formatNum(totalAreaM2, locale)} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {tLoc.lab2OpenWarning.replace('{openArea}', formatNum(lateralArea + oneBaseArea, locale))}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Diameter}</span> 10 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Radius}</span> 10 : 2 ＝ 5 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Height}</span> 12 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{tLoc.prob1StepHeader}</span>
                  <div>{tLoc.prob1Step1}</div>
                  <div>{tLoc.prob1Step2}</div>
                  <div className="pt-1 border-t border-slate-200 font-bold text-blue-700">{tLoc.prob1Step3}</div>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Radius}</span> 0,5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Height}</span> 2 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Formula}</span> {locale === 'el' ? 'Εολ ＝ Επ ＋ 2 · Εβ' : 'Atot ＝ Alat ＋ 2 · Abase'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{tLoc.prob2StepHeader}</span>
                  <div>{tLoc.prob2Step1}</div>
                  <div>{tLoc.prob2Step2}</div>
                  <div>{tLoc.prob2Step3}</div>
                  <div className="pt-1 border-t border-slate-200 font-bold text-amber-700">{tLoc.prob2Step4}</div>
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
            href="/st-dimotikou/79-kilindros-ask"
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
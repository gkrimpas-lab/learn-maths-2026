// pages/st-dimotikou/78-akmes-korifes.js
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

export default function AkmesKorifesTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Εξερεύνηση Στοιχείων (Έδρες, Ακμές, Κορυφές)
  // -------------------------------------------------------------------------
  const [selectedShape, setSelectedShape] = useState('cube'); // 'cube' ή 'cuboid'
  const [highlightMode, setHighlightMode] = useState('edges'); // 'faces', 'edges', 'vertices'

  // Ισομετρικές συντεταγμένες κορυφών
  // 8 κορυφές: 4 κάτω βάσης (0..3) και 4 πάνω βάσης (4..7)
  const cubeCoords = useMemo(() => {
    if (selectedShape === 'cube') {
      return {
        // Κάτω βάση
        v0: { x: 120, y: 150 }, // εμπρός-αριστερά
        v1: { x: 190, y: 185 }, // εμπρός-δεξιά
        v2: { x: 260, y: 150 }, // πίσω-δεξιά
        v3: { x: 190, y: 115 }, // πίσω-αριστερά (κρυφή)
        // Πάνω βάση (z offset: -80px)
        v4: { x: 120, y: 70 },
        v5: { x: 190, y: 105 },
        v6: { x: 260, y: 70 },
        v7: { x: 190, y: 35 }
      };
    }
    // Ορθογώνιο Παραλληλεπίπεδο
    return {
      v0: { x: 95, y: 155 },
      v1: { x: 195, y: 190 },
      v2: { x: 285, y: 145 },
      v3: { x: 185, y: 110 },
      v4: { x: 95, y: 85 },
      v5: { x: 195, y: 120 },
      v6: { x: 285, y: 75 },
      v7: { x: 185, y: 40 }
    };
  }, [selectedShape]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Συνολικού Μήκους Ακμών (Σκελετός)
  // -------------------------------------------------------------------------
  const [dimA, setDimA] = useState(10); // Μήκος σε cm
  const [dimB, setDimB] = useState(6); // Πλάτος σε cm
  const [dimC, setDimC] = useState(5); // Ύψος σε cm

  const totalEdgesCube = useMemo(() => 12 * dimA, [dimA]);
  const totalEdgesCuboid = useMemo(() => 4 * dimA + 4 * dimB + 4 * dimC, [dimA, dimB, dimC]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Ακμές & Κορυφές Κύβου & Ορθογωνίου Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε τι είναι οι ακμές και οι κορυφές του κύβου και του ορθογωνίου παραλληλεπιπέδου, τον τύπο του Euler και πώς υπολογίζουμε το συνολικό μήκος ακμών.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 78 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Ακμές & Κορυφές • Κύβος & Ορθογώνιο Παραλληλεπίπεδο",
      heroDesc: "Εξερευνούμε τη στερεομετρική δομή των βασικών πολυέδρων! Μαθαίνουμε τι είναι οι 12 ακμές και οι 8 κορυφές, ανακαλύπτουμε τη μαγική σχέση του Euler (Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2) και υπολογίζουμε με ακρίβεια το συνολικό μήκος του σκελετού ενός κουτιού.",
      heroFeature: "Θεωρία, 12 Ακμές, 8 Κορυφές, Τύπος του Euler & Διαδραστικά Εργαστήρια",
      tryExercises: "Δοκίμασε τις Ασκήσεις",

      stepsHeading: "Ακμές & Κορυφές σε 4 Βήματα",
      stepsSubheading: "Από την αναγνώριση των στοιχείων μέχρι τους υπολογισμούς συρμάτινων σκελετών.",

      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Έννοια",
      step1Title: "Τι είναι οι Ακμές;",
      step1P1: "Ακμή ονομάζεται το ευθύγραμμο τμήμα όπου ενώνονται δύο γειτονικές έδρες ενός στερεού:",
      step1Count: "• Πλήθος: Πάντοτε 12 Ακμές",
      step1CubeDiff: "• Στον κύβο: Και οι 12 ακμές είναι απολύτως ίσες μεταξύ τους (μήκος α).",
      step1CuboidDiff: "• Στο ορθογώνιο: Οι 12 ακμές χωρίζονται σε 3 ομάδες των τεσσάρων (4 μήκη, 4 πλάτη, 4 ύψη).",
      step1Tip: "💡 Σκεφτείτε τις ακμές σαν τα ξυλάκια ή τα καλαμάκια που σχηματίζουν το σκελετό ενός κουτιού!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Έννοια",
      step2Title: "Τι είναι οι Κορυφές;",
      step2P1: "Κορυφή ονομάζεται το γωνιακό σημείο όπου συναντώνται τρεις ακμές του στερεού:",
      step2Count: "• Πλήθος: Πάντοτε 8 Κορυφές",
      step2TopBase: "• 4 κορυφές βρίσκονται στην πάνω βάση.",
      step2BotBase: "• 4 κορυφές βρίσκονται στην κάτω βάση.",
      step2Corner: "• Σε κάθε κορυφή σχηματίζεται μια τρισδιάστατη στερεά γωνία.",
      step2Tip: "⚡ Σκεφτείτε τις κορυφές σαν τα μπαλάκια πλαστελίνης που ενώνουν τα καλαμάκια στις γωνίες!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Ο Νόμος",
      step3Title: "Ο Μαγικός Τύπος του Euler",
      step3P1: "Σε όλα τα κυρτά πολύεδρα (κύβους, πρίσματα, πυραμίδες), ισχύει πάντοτε η εξής μαθηματική σχέση:",
      step3Formula: "Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2",
      step3VerifyTitle: "Επαλήθευση στον Κύβο & στο Παραλληλεπίπεδο:",
      step3VerifyElements: "Έδρες ＝ 6, Κορυφές ＝ 8, Ακμές ＝ 12",
      step3VerifyCalc: "6 ＋ 8 ＝ 14 και 12 ＋ 2 ＝ 14 (Ισχύει απόλυτα!).",
      step3Tip: "🎯 Ο τύπος του Euler είναι ένα από τα πιο διάσημα θεωρήματα στην ιστορία της γεωμετρίας!",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Υπολογισμοί",
      step4Title: "Συνολικό Μήκος Ακμών",
      step4P1: "Πώς υπολογίζουμε το σύρμα ή το πηχάκι που χρειάζεται για να φτιάξουμε τον σκελετό ενός κουτιού:",
      step4CubeTitle: "• Κύβος με ακμή α:",
      step4CubeSub: "Έχει 12 ίσες ακμές:",
      step4CubeFormula: "Μήκος ＝ 12 · α",
      step4CuboidTitle: "• Ορθογώνιο με ακμές α, β, γ:",
      step4CuboidSub: "Έχει 4 μήκη, 4 πλάτη, 4 ύψη:",
      step4CuboidFormula1: "Μήκος ＝ 4 · α ＋ 4 · β ＋ 4 · γ",
      step4CuboidFormula2: "ή 4 · (α ＋ β ＋ γ)",
      step4Tip: "🚀 Προσοχή: Το μήκος των ακμών μετριέται σε απλά μέτρα ή cm (είναι μήκος, όχι επιφάνεια)!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Εξερευνητής Στοιχείων σε 3D: Έδρες, Ακμές & Κορυφές",
      lab1Desc: "Επίλεξε γεωμετρικό στερεό και πάτησε στα κουμπιά για να φωτίσεις και να μετρήσεις τις 6 Έδρες, τις 12 Ακμές ή τις 8 Κορυφές:",
      lab1SelectLabel: "1. ΕΠΙΛΟΓΗ ΣΤΕΡΕΟΥ:",
      lab1BtnCube: "🎲 Κύβος",
      lab1BtnCuboid: "📦 Παραλληλεπίπεδο",
      lab1ModeLabel: "2. ΕΠΙΛΟΓΗ ΣΤΟΙΧΕΙΟΥ ΠΡΟΣ ΕΜΦΑΝΙΣΗ:",
      lab1BtnEdges: "12 Ακμές",
      lab1BtnVertices: "8 Κορυφές",
      lab1BtnFaces: "6 Έδρες",
      lab1FacesLabel: "Έδρες (Ε):",
      lab1VerticesLabel: "Κορυφές (Κ):",
      lab1EdgesLabel: "Ακμές (Α):",
      lab1EulerCheck: "Έλεγχος Euler: 6 ＋ 8 ＝ 12 ＋ 2 ＝ 14 ✓",
      lab1LegendEdges: "🟡 Φωτισμένες οι 12 Ακμές (9 ορατές και 3 κρυφές διακεκομμένες πίσω).",
      lab1LegendVertices: "🔴 Φωτισμένες οι 8 Κορυφές (4 στην κάτω βάση και 4 στην πάνω).",
      lab1LegendFaces: "🔵 Φωτισμένες οι 6 Έδρες που περικλείουν το στερεό.",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΣΚΕΛΕΤΟΥ",
      lab2Title: "Πόσο Σύρμα Χρειάζεται για τις 12 Ακμές;",
      lab2Desc: "Ρύθμισε τις διαστάσεις για να υπολογίσεις το συνολικό μήκος σύρματος που απαιτείται για να κατασκευαστεί ο σκελετός του κουτιού:",
      lab2LengthLabel: "ΜΗΚΟΣ (α):",
      lab2WidthLabel: "ΠΛΑΤΟΣ (β):",
      lab2HeightLabel: "ΥΨΟΣ (γ):",
      lab2TotalHeader: "ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΣΥΡΜΑΤΟΣ ΓΙΑ ΤΙΣ 12 ΑΚΜΕΣ",
      lab2CubeCardTitle: "Αν ήταν Κύβος (ακμή {a} cm):",
      lab2CubeCalc: "12 ακμές · {a} cm ＝ {total} cm",
      lab2CuboidCardTitle: "Στο Ορθογώνιο Παραλληλεπίπεδο:",
      lab2CuboidCalc: "4 · ({a} ＋ {b} ＋ {c}) ＝ {total} cm",
      lab2FooterNote: "💡 Το ορθογώνιο παραλληλεπίπεδο περιλαμβάνει 4 ίσα μήκη, 4 ίσα πλάτη και 4 ίσα ύψη!",

      probHeading: "Λυμένα Προβλήματα με Ακμές & Κορυφές",
      probSubheading: "Εφαρμογές των ιδιοτήτων των στερεών σε κατασκευές σκελετών.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΞΥΛΙΝΟΣ ΣΚΕΛΕΤΟΣ",
      prob1Subtitle: "Ορθογώνιο Παραλληλεπίπεδο",
      prob1Title: "Υπολογισμός Πηχών για Σκελετό Κλουβιού",
      prob1Text: "Ένας ξυλουργός θέλει να φτιάξει τον σκελετό ενός κλουβιού σε σχήμα ορθογωνίου παραλληλεπιπέδου. Οι διαστάσεις του είναι μήκος 80 cm, πλάτος 50 cm και ύψος 60 cm. Πόσα μέτρα (m) ξύλινου πηχακίου θα χρειαστεί συνολικά για να κατασκευάσει όλες τις ακμές του;",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1Lengths: "4 μήκη (α)",
      prob1Widths: "4 πλάτη (β)",
      prob1Heights: "4 ύψη (γ)",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "Άθροισμα 3 διαστάσεων: 80 ＋ 50 ＋ 60 ＝ 190 cm.",
      prob1Step2: "Συνολικό μήκος 12 ακμών: 4 · 190 ＝ 760 cm.",
      prob1Step3: "Μετατροπή σε μέτρα (: 100): 760 : 100 ＝ 7,6 m.",
      prob1Tip: "💡 Θυμήσου: Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές, δηλαδή 4 ίσα μήκη, 4 ίσα πλάτη και 4 ίσα ύψη!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΣΥΡΜΑ ΚΥΒΟΥ",
      prob2Subtitle: "Κύβος (12 ίσες ακμές)",
      prob2Title: "Εύρεση Ακμής από το Συνολικό Σύρμα",
      prob2Text: "Ένας μαθητής χρησιμοποίησε ένα σύρμα συνολικού μήκους 108 cm για να φτιάξει τον σκελετό ενός κύβου, χωρίς να περισσέψει καθόλου σύρμα. Πόσα εκατοστόμετρα (cm) είναι το μήκος κάθε ακμής του κύβου;",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2WireLabel: "Συνολικό σύρμα",
      prob2EdgesCountLabel: "Πλήθος ακμών κύβου",
      prob2EdgesCountValue: "12 ίσες ακμές",
      prob2FormulaLabel: "Πράξη",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "Ο κύβος έχει 12 απολύτως ίσες ακμές.",
      prob2Step2: "Μήκος 1 ακμής: 108 : 12 ＝ 9 cm.",
      prob2Tip: "⚡ Επαλήθευση: 12 ακμές · 9 cm ＝ 108 cm σύρματος!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Μην μπερδεύετε τις ακμές με τις κορυφές:",
      alertL1Text: " Οι ακμές είναι 12 (γραμμές/πλευρές), ενώ οι κορυφές είναι 8 (γωνίες/σημεία).",
      alertL2Bold: "Στο ορθογώνιο παραλληλεπίπεδο πολλαπλασιάζουμε κάθε διάσταση με το 4:",
      alertL2Text: " Μην προσθέτετε απλώς μήκος ＋ πλάτος ＋ ύψος! Κάθε διάσταση επαναλαμβάνεται 4 φορές: 4 · α ＋ 4 · β ＋ 4 · γ.",
      alertL3Bold: "Μήκος ακμών vs Εμβαδόν επιφάνειας:",
      alertL3Text: " Το συνολικό μήκος των ακμών μετριέται σε απλά μέτρα (m) ή cm, ενώ το εμβαδόν των εδρών σε τετραγωνικά μέτρα (m²) ή cm².",
      alertL4Bold: "Ο τύπος του Euler:",
      alertL4Text: " Να θυμάστε πάντοτε ότι Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2 (για κύβο: 6 ＋ 8 ＝ 12 ＋ 2 ＝ 14).",

      ctaTitle: "Ώρα για Εξάσκηση στις Ακμές & τις Κορυφές!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς ακμών, κορυφών, σκελετών και τον τύπο του Euler για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Edges & Vertices of Cube & Rectangular Prism - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn about the edges and vertices of cubes and rectangular prisms, Euler's formula, and how to calculate total edge frame length.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 78 • 6TH GRADE",
      heroTitle: "Edges & Vertices • Cube & Rectangular Prism",
      heroDesc: "Explore the solid geometry of fundamental polyhedra! Learn what the 12 edges and 8 vertices are, discover Euler's formula (Faces ＋ Vertices ＝ Edges ＋ 2), and accurately calculate the total frame length of a 3D box.",
      heroFeature: "Theory, 12 Edges, 8 Vertices, Euler's Formula & Interactive Labs",
      tryExercises: "Try Exercises",

      stepsHeading: "Edges & Vertices in 4 Steps",
      stepsSubheading: "From identifying solid parts to computing wire frame lengths.",

      step1Badge: "STEP 1",
      step1Subtitle: "Concept",
      step1Title: "What are Edges?",
      step1P1: "An edge is the line segment where two adjacent faces of a solid meet:",
      step1Count: "• Count: Always 12 Edges",
      step1CubeDiff: "• In a cube: All 12 edges are completely equal to each other (length a).",
      step1CuboidDiff: "• In a rectangular prism: The 12 edges split into 3 groups of four (4 lengths, 4 widths, 4 heights).",
      step1Tip: "💡 Think of edges as the sticks or straws that form the skeleton frame of a box!",

      step2Badge: "STEP 2",
      step2Subtitle: "Concept",
      step2Title: "What are Vertices?",
      step2P1: "A vertex is the corner point where three edges of the solid intersect:",
      step2Count: "• Count: Always 8 Vertices",
      step2TopBase: "• 4 vertices are located on the top base.",
      step2BotBase: "• 4 vertices are located on the bottom base.",
      step2Corner: "• At each vertex, a three-dimensional solid corner is formed.",
      step2Tip: "⚡ Think of vertices as the clay balls connecting the straws at the corners!",

      step3Badge: "STEP 3",
      step3Subtitle: "The Law",
      step3Title: "Euler's Polyhedral Formula",
      step3P1: "For all convex polyhedra (cubes, prisms, pyramids), this fundamental relation always holds:",
      step3Formula: "Faces ＋ Vertices ＝ Edges ＋ 2",
      step3VerifyTitle: "Verification on Cube & Rectangular Prism:",
      step3VerifyElements: "Faces ＝ 6, Vertices ＝ 8, Edges ＝ 12",
      step3VerifyCalc: "6 ＋ 8 ＝ 14 and 12 ＋ 2 ＝ 14 (Perfect match!).",
      step3Tip: "🎯 Euler's formula is one of the most famous theorems in the history of geometry!",

      step4Badge: "STEP 4",
      step4Subtitle: "Calculations",
      step4Title: "Total Edge Length",
      step4P1: "How to calculate the wire or wood strip needed to build the skeletal frame of a box:",
      step4CubeTitle: "• Cube with edge a:",
      step4CubeSub: "Has 12 equal edges:",
      step4CubeFormula: "Length ＝ 12 · a",
      step4CuboidTitle: "• Prism with edges a, b, c:",
      step4CuboidSub: "Has 4 lengths, 4 widths, 4 heights:",
      step4CuboidFormula1: "Length ＝ 4 · a ＋ 4 · b ＋ 4 · c",
      step4CuboidFormula2: "or 4 · (a ＋ b ＋ c)",
      step4Tip: "🚀 Note: Edge length is measured in linear units like meters or cm (it is length, not area)!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "3D Element Explorer: Faces, Edges & Vertices",
      lab1Desc: "Select a solid and tap the buttons to highlight and count the 6 Faces, 12 Edges, or 8 Vertices:",
      lab1SelectLabel: "1. SELECT SOLID:",
      lab1BtnCube: "🎲 Cube",
      lab1BtnCuboid: "📦 Rectangular Prism",
      lab1ModeLabel: "2. SELECT ELEMENT TO HIGHLIGHT:",
      lab1BtnEdges: "12 Edges",
      lab1BtnVertices: "8 Vertices",
      lab1BtnFaces: "6 Faces",
      lab1FacesLabel: "Faces (F):",
      lab1VerticesLabel: "Vertices (V):",
      lab1EdgesLabel: "Edges (E):",
      lab1EulerCheck: "Euler's check: 6 ＋ 8 ＝ 12 ＋ 2 ＝ 14 ✓",
      lab1LegendEdges: "🟡 12 Edges highlighted (9 visible and 3 dashed hidden behind).",
      lab1LegendVertices: "🔴 8 Vertices highlighted (4 on bottom base and 4 on top).",
      lab1LegendFaces: "🔵 6 Faces highlighted enclosing the solid.",

      lab2Badge: "📐 INTERACTIVE LAB 2: FRAME CALCULATOR",
      lab2Title: "How Much Wire is Needed for the 12 Edges?",
      lab2Desc: "Adjust dimensions to calculate the total length of wire required to build the box frame:",
      lab2LengthLabel: "LENGTH (a):",
      lab2WidthLabel: "WIDTH (b):",
      lab2HeightLabel: "HEIGHT (c):",
      lab2TotalHeader: "TOTAL WIRE LENGTH FOR 12 EDGES",
      lab2CubeCardTitle: "If it were a Cube (edge {a} cm):",
      lab2CubeCalc: "12 edges · {a} cm ＝ {total} cm",
      lab2CuboidCardTitle: "For the Rectangular Prism:",
      lab2CuboidCalc: "4 · ({a} ＋ {b} ＋ {c}) ＝ {total} cm",
      lab2FooterNote: "💡 A rectangular prism contains 4 equal lengths, 4 equal widths, and 4 equal heights!",

      probHeading: "Solved Problems on Edges & Vertices",
      probSubheading: "Practical applications of polyhedral properties in frame construction.",

      prob1Badge: "PROBLEM 1: WOODEN FRAME",
      prob1Subtitle: "Rectangular Prism",
      prob1Title: "Calculating Wooden Strips for a Cage Frame",
      prob1Text: "A carpenter wants to construct a cage frame in the shape of a rectangular prism. Its dimensions are length 80 cm, width 50 cm, and height 60 cm. How many meters (m) of wooden strips will be needed in total to form all its edges?",
      prob1DataHeader: "PROBLEM DATA",
      prob1Lengths: "4 lengths (a)",
      prob1Widths: "4 widths (b)",
      prob1Heights: "4 heights (c)",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "Sum of 3 dimensions: 80 ＋ 50 ＋ 60 ＝ 190 cm.",
      prob1Step2: "Total length of 12 edges: 4 · 190 ＝ 760 cm.",
      prob1Step3: "Conversion to meters (: 100): 760 : 100 ＝ 7.6 m.",
      prob1Tip: "💡 Remember: A rectangular prism has 12 edges: 4 equal lengths, 4 equal widths, and 4 equal heights!",

      prob2Badge: "PROBLEM 2: CUBE WIRE",
      prob2Subtitle: "Cube (12 equal edges)",
      prob2Title: "Finding Edge Length from Total Wire",
      prob2Text: "A student used a single wire with total length 108 cm to build the frame of a cube with no wire left over. How many centimeters (cm) is the length of each edge of the cube?",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2WireLabel: "Total wire",
      prob2EdgesCountLabel: "Cube edge count",
      prob2EdgesCountValue: "12 equal edges",
      prob2FormulaLabel: "Calculation",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "A cube has 12 completely equal edges.",
      prob2Step2: "Length of 1 edge: 108 : 12 ＝ 9 cm.",
      prob2Tip: "⚡ Verification: 12 edges · 9 cm ＝ 108 cm of wire!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Do not confuse edges with vertices:",
      alertL1Text: " Edges are 12 (lines/sides), while vertices are 8 (corners/points).",
      alertL2Bold: "In a rectangular prism, multiply each dimension by 4:",
      alertL2Text: " Do not just add length ＋ width ＋ height! Each dimension appears 4 times: 4 · a ＋ 4 · b ＋ 4 · c.",
      alertL3Bold: "Edge length vs Surface area:",
      alertL3Text: " Total edge length is measured in linear units (m or cm), while face area is measured in square units (m² or cm²).",
      alertL4Bold: "Euler's formula:",
      alertL4Text: " Always remember that Faces ＋ Vertices ＝ Edges ＋ 2 (for cube: 6 ＋ 8 ＝ 12 ＋ 2 ＝ 14).",

      ctaTitle: "Time to Practice Edges & Vertices!",
      ctaDesc: "Test your knowledge with 12 interactive exercises on edge counts, vertex counts, wire frames, and Euler's formula for 6th Grade.",
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
          href="/st-dimotikou/78-akmes-korifes-ask"
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
              href="/st-dimotikou/78-akmes-korifes-ask"
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
                  <div className="text-indigo-950 font-bold">{tLoc.step1Count}</div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step1CubeDiff}<br />
                    {tLoc.step1CuboidDiff}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-amber-950 font-bold">{tLoc.step2Count}</div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step2TopBase}<br />
                    {tLoc.step2BotBase}<br />
                    {tLoc.step2Corner}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-950 font-black text-sm sm:text-base">
                    {tLoc.step3Formula}
                  </div>
                  <div className="text-slate-700 text-xs font-sans text-left pt-1">
                    <strong>{tLoc.step3VerifyTitle}</strong><br />
                    {tLoc.step3VerifyElements}<br />
                    {tLoc.step3VerifyCalc}
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
                    <strong>{tLoc.step4CubeTitle}</strong><br />
                    {tLoc.step4CubeSub}<br />
                    <strong className="text-emerald-700">{tLoc.step4CubeFormula}</strong>
                  </div>
                  <div className="pt-1 border-t border-slate-200">
                    <strong>{tLoc.step4CuboidTitle}</strong><br />
                    {tLoc.step4CuboidSub}<br />
                    <strong className="text-indigo-700">{tLoc.step4CuboidFormula1}</strong><br />
                    <span className="text-xs text-slate-500">{tLoc.step4CuboidFormula2}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {tLoc.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΟΣ ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΣΕ 3D (SVG) */}
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

            {/* Κουμπιά Επιλογής (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {tLoc.lab1SelectLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedShape('cube')}
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
                    onClick={() => setSelectedShape('cuboid')}
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

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {tLoc.lab1ModeLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setHighlightMode('edges')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                      highlightMode === 'edges'
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tLoc.lab1BtnEdges}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHighlightMode('vertices')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                      highlightMode === 'vertices'
                        ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tLoc.lab1BtnVertices}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHighlightMode('faces')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                      highlightMode === 'faces'
                        ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tLoc.lab1BtnFaces}
                  </button>
                </div>
              </div>

              {/* Κάρτα Σύνοψης */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-600">{tLoc.lab1FacesLabel}</span>
                  <span className={`font-mono text-base font-black ${highlightMode === 'faces' ? 'text-sky-600' : 'text-slate-800'}`}>
                    6
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-600">{tLoc.lab1VerticesLabel}</span>
                  <span className={`font-mono text-base font-black ${highlightMode === 'vertices' ? 'text-rose-600' : 'text-slate-800'}`}>
                    8
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-600">{tLoc.lab1EdgesLabel}</span>
                  <span className={`font-mono text-base font-black ${highlightMode === 'edges' ? 'text-amber-600' : 'text-slate-800'}`}>
                    12
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs font-mono text-center text-indigo-900 font-bold">
                  {tLoc.lab1EulerCheck}
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[320px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 220"
                className="w-full max-w-[360px] sm:max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* 1. ΕΔΡΕΣ */}
                <polygon
                  points={`${cubeCoords.v0.x},${cubeCoords.v0.y} ${cubeCoords.v1.x},${cubeCoords.v1.y} ${cubeCoords.v2.x},${cubeCoords.v2.y} ${cubeCoords.v3.x},${cubeCoords.v3.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.15)'}
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <polygon
                  points={`${cubeCoords.v4.x},${cubeCoords.v4.y} ${cubeCoords.v5.x},${cubeCoords.v5.y} ${cubeCoords.v6.x},${cubeCoords.v6.y} ${cubeCoords.v7.x},${cubeCoords.v7.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(52, 211, 153, 0.5)' : 'rgba(52, 211, 153, 0.2)'}
                  stroke="#34d399"
                  strokeWidth="1.5"
                />
                <polygon
                  points={`${cubeCoords.v0.x},${cubeCoords.v0.y} ${cubeCoords.v1.x},${cubeCoords.v1.y} ${cubeCoords.v5.x},${cubeCoords.v5.y} ${cubeCoords.v4.x},${cubeCoords.v4.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(129, 140, 248, 0.55)' : 'rgba(129, 140, 248, 0.2)'}
                  stroke="#818cf8"
                  strokeWidth="1.5"
                />
                <polygon
                  points={`${cubeCoords.v1.x},${cubeCoords.v1.y} ${cubeCoords.v2.x},${cubeCoords.v2.y} ${cubeCoords.v6.x},${cubeCoords.v6.y} ${cubeCoords.v5.x},${cubeCoords.v5.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(168, 85, 247, 0.55)' : 'rgba(168, 85, 247, 0.2)'}
                  stroke="#c084fc"
                  strokeWidth="1.5"
                />

                {/* 2. ΑΚΜΕΣ (12 Ακμές) */}
                <line
                  x1={cubeCoords.v3.x}
                  y1={cubeCoords.v3.y}
                  x2={cubeCoords.v0.x}
                  y2={cubeCoords.v0.y}
                  stroke={highlightMode === 'edges' ? '#f59e0b' : '#64748b'}
                  strokeWidth={highlightMode === 'edges' ? 3 : 1.5}
                  strokeDasharray="4 3"
                />
                <line
                  x1={cubeCoords.v3.x}
                  y1={cubeCoords.v3.y}
                  x2={cubeCoords.v2.x}
                  y2={cubeCoords.v2.y}
                  stroke={highlightMode === 'edges' ? '#f59e0b' : '#64748b'}
                  strokeWidth={highlightMode === 'edges' ? 3 : 1.5}
                  strokeDasharray="4 3"
                />
                <line
                  x1={cubeCoords.v3.x}
                  y1={cubeCoords.v3.y}
                  x2={cubeCoords.v7.x}
                  y2={cubeCoords.v7.y}
                  stroke={highlightMode === 'edges' ? '#f59e0b' : '#64748b'}
                  strokeWidth={highlightMode === 'edges' ? 3 : 1.5}
                  strokeDasharray="4 3"
                />

                {/* 9 Ορατές Ακμές */}
                <line x1={cubeCoords.v0.x} y1={cubeCoords.v0.y} x2={cubeCoords.v1.x} y2={cubeCoords.v1.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v1.x} y1={cubeCoords.v1.y} x2={cubeCoords.v2.x} y2={cubeCoords.v2.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v4.x} y1={cubeCoords.v4.y} x2={cubeCoords.v5.x} y2={cubeCoords.v5.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v5.x} y1={cubeCoords.v5.y} x2={cubeCoords.v6.x} y2={cubeCoords.v6.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v6.x} y1={cubeCoords.v6.y} x2={cubeCoords.v7.x} y2={cubeCoords.v7.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v7.x} y1={cubeCoords.v7.y} x2={cubeCoords.v4.x} y2={cubeCoords.v4.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v0.x} y1={cubeCoords.v0.y} x2={cubeCoords.v4.x} y2={cubeCoords.v4.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v1.x} y1={cubeCoords.v1.y} x2={cubeCoords.v5.x} y2={cubeCoords.v5.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v2.x} y1={cubeCoords.v2.y} x2={cubeCoords.v6.x} y2={cubeCoords.v6.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />

                {/* 3. ΚΟΡΥΦΕΣ (8 Σημεία) */}
                {Object.keys(cubeCoords).map((vKey, idx) => {
                  const pt = cubeCoords[vKey];
                  const isHidden = vKey === 'v3';
                  const isSelected = highlightMode === 'vertices';

                  return (
                    <g key={vKey}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? '#f43f5e' : isHidden ? '#64748b' : '#ffffff'}
                        stroke={isSelected ? '#ffffff' : '#0f172a'}
                        strokeWidth={1.5}
                      />
                      {isSelected && (
                        <text
                          x={pt.x + (pt.x < 190 ? -10 : 10)}
                          y={pt.y + (pt.y < 100 ? -8 : 12)}
                          fill="#f43f5e"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {locale === 'el' ? 'Κ' : 'V'}{idx + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {highlightMode === 'edges' && tLoc.lab1LegendEdges}
                {highlightMode === 'vertices' && tLoc.lab1LegendVertices}
                {highlightMode === 'faces' && tLoc.lab1LegendFaces}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΣΚΕΛΕΤΟΥ (ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΑΚΜΩΝ) */}
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
                  max={25}
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
                  max={25}
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
                  max={25}
                  step={1}
                  value={dimC}
                  onChange={(e) => setDimC(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>
            </div>

            {/* Αποτελέσματα Σκελετού (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-4">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2TotalHeader}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-sans text-xs block">
                    {tLoc.lab2CubeCardTitle.replace('{a}', String(dimA))}
                  </span>
                  <span className="text-2xl font-black text-indigo-400 block">
                    {formatNum(totalEdgesCube, locale)} cm
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    {tLoc.lab2CubeCalc.replace('{a}', String(dimA)).replace('{total}', String(totalEdgesCube))}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-sans text-xs block">
                    {tLoc.lab2CuboidCardTitle}
                  </span>
                  <span className="text-2xl font-black text-emerald-400 block">
                    {formatNum(totalEdgesCuboid, locale)} cm
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    {tLoc.lab2CuboidCalc
                      .replace('{a}', String(dimA))
                      .replace('{b}', String(dimB))
                      .replace('{c}', String(dimC))
                      .replace('{total}', String(totalEdgesCuboid))}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {tLoc.lab2FooterNote}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Lengths}</span> 4 · 80 cm ＝ 320 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Widths}</span> 4 · 50 cm ＝ 200 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Heights}</span> 4 · 60 cm ＝ 240 cm
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2WireLabel}</span> 108 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2EdgesCountLabel}</span> {tLoc.prob2EdgesCountValue}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2FormulaLabel}</span> 108 : 12
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
            href="/st-dimotikou/78-akmes-korifes-ask"
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
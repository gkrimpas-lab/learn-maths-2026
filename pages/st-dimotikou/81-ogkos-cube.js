// pages/st-dimotikou/81-ogkos-cube.js
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

export default function OgkosCubeTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Δόμηση με Κυβάκια 1 cm³ (SVG 3D Voxel Grid)
  // -------------------------------------------------------------------------
  const [cubesL, setCubesL] = useState(4); // Μήκος σε κυβάκια (1 έως 5)
  const [cubesW, setCubesW] = useState(3); // Πλάτος σε κυβάκια (1 έως 4)
  const [cubesH, setCubesH] = useState(2); // Ύψος σε στρώσεις (1 έως 4)

  const baseCubesCount = useMemo(() => cubesL * cubesW, [cubesL, cubesW]);
  const totalCubesCount = useMemo(() => baseCubesCount * cubesH, [baseCubesCount, cubesH]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Όγκου Κύβου και Παραλληλεπιπέδου
  // -------------------------------------------------------------------------
  const [shapeMode, setShapeMode] = useState('cuboid'); // 'cube' ή 'cuboid'
  const [dimA, setDimA] = useState(8); // Μήκος (cm)
  const [dimB, setDimB] = useState(5); // Πλάτος (cm)
  const [dimC, setDimC] = useState(4); // Ύψος (cm)

  // Υπολογισμός όγκου ανάλογα με το σχήμα
  const effectiveDims = useMemo(() => {
    if (shapeMode === 'cube') {
      return { a: dimA, b: dimA, c: dimA };
    }
    return { a: dimA, b: dimB, c: dimC };
  }, [shapeMode, dimA, dimB, dimC]);

  const baseAreaCm2 = useMemo(() => effectiveDims.a * effectiveDims.b, [effectiveDims]);
  const volumeCm3 = useMemo(() => baseAreaCm2 * effectiveDims.c, [baseAreaCm2, effectiveDims]);
  const volumeDm3 = useMemo(() => volumeCm3 / 1000, [volumeCm3]); // 1 dm³ = 1 L
  const volumeM3 = useMemo(() => volumeCm3 / 1000000, [volumeCm3]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Όγκος Κύβου και Ορθογωνίου Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε πώς υπολογίζουμε τον όγκο κύβου (V ＝ α³) και ορθογωνίου παραλληλεπιπέδου (V ＝ α · β · γ), τη δόμηση με κυβάκια 1 cm³ και τις εφαρμογές σε προβλήματα.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 81 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Υπολογισμός Όγκου • Κύβος • Ορθογώνιο Παραλληλεπίπεδο",
      heroDesc: "Μαθαίνουμε πώς υπολογίζεται ο χώρος που καταλαμβάνει ένα στερεό! Βλέπουμε πώς μετράμε τον όγκο γεμίζοντας ένα κουτί με μοναδιαία κυβάκια (1 cm³), εφαρμόζουμε τους θεμελιώδεις τύπους V ＝ α³ και V ＝ α · β · γ, και ανακαλύπτουμε τη σύνδεση ανάμεσα στο εμβαδόν της βάσης και το ύψος.",
      heroFeature: "Θεωρία, Δόμηση με Κυβάκια 1 cm³, Τύποι V ＝ α³ και V ＝ α · β · γ",
      tryExercises: "Δοκίμασε τις Ασκήσεις",

      stepsHeading: "Ο Όγκος Κύβου και Παραλληλεπιπέδου σε 4 Βήματα",
      stepsSubheading: "Από την οπτική καταμέτρηση κυβικών εκατοστομέτρων μέχρι την άλγεβρα και το αντίστροφο πρόβλημα.",

      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Οπτική Δόμηση",
      step1Title: "Πώς Μετράμε τον Όγκο;",
      step1P1: "Φανταστείτε ότι γεμίζουμε ένα κουτί με μικρά κυβάκια ακμής 1 cm (όγκου 1 cm³ το καθένα):",
      step1BaseDesc: "1. Στην κάτω βάση: Στρώνουμε μία στρώση από κυβάκια (Μήκος · Πλάτος). Αν το μήκος είναι 4 cm και το πλάτος 3 cm, η βάση έχει 4 · 3 ＝ 12 κυβάκια.",
      step1HeightDesc: "2. Στο ύψος: Τοποθετούμε πολλές τέτοιες στρώσεις προς τα πάνω. Αν το ύψος είναι 2 cm, έχουμε 2 στρώσεις: 12 · 2 ＝ 24 κυβάκια!",
      step1TotalDesc: "Συνολικός Όγκος ＝ 24 cm³.",
      step1Tip: "💡 Ο όγκος δείχνει ακριβώς πόσα μοναδιαία κυβάκια (1 cm³ ή 1 m³) χωράνε μέσα στο στερεό!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Ορθογώνιο",
      step2Title: "Όγκος Παραλληλεπιπέδου",
      step2P1: "Σε κάθε ορθογώνιο παραλληλεπίπεδο με μήκος α, πλάτος β και ύψος γ:",
      step2FormulaText: "Όγκος ＝ Μήκος · Πλάτος · Ύψος",
      step2FormulaMath: "V ＝ α · β · γ",
      step2BaseHeight: "V ＝ Εμβαδόν Βάσης · Ύψος (V ＝ Εβ · γ)",
      step2Tip: "⚡ Και οι τρεις διαστάσεις (α, β, γ) πρέπει να εκφράζονται πάντοτε στην ίδια μονάδα μέτρησης (π.χ. όλες σε cm ή όλες σε m)!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Ο Κύβος",
      step3Title: "Όγκος Κύβου",
      step3P1: "Επειδή στον κύβο και οι 3 διαστάσεις είναι ίσες με την ακμή α (μήκος ＝ πλάτος ＝ ύψος ＝ α):",
      step3FormulaText: "Όγκος ＝ Ακμή · Ακμή · Ακμή",
      step3FormulaMath: "V ＝ α · α · α ＝ α³",
      step3Example: "Παράδειγμα: Κύβος με ακμή 5 cm έχει όγκο: V ＝ 5 · 5 · 5 ＝ 125 cm³.",
      step3Tip: "🎯 Προσοχή: α³ σημαίνει α · α · α (τρίτη δύναμη), και όχι α · 3!",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Αντίστροφο Πρόβλημα",
      step4Title: "Εύρεση Ύψους ή Εμβαδού Βάσης",
      step4P1: "Αν γνωρίζουμε τον όγκο και το εμβαδόν της βάσης ενός δοχείου:",
      step4HeightFormula: "• Ύψος (γ) ＝ Όγκος : Εμβαδόν Βάσης",
      step4BaseFormula: "• Εμβαδόν Βάσης (Εβ) ＝ Όγκος : Ύψος",
      step4Example: "Παράδειγμα: Αν V ＝ 200 cm³ και η βάση έχει εμβαδόν 40 cm², τότε το ύψος είναι: 200 : 40 ＝ 5 cm.",
      step4Tip: "🚀 Θυμήσου τη χωρητικότητα: 1 dm³ ＝ 1 Λίτρο (L) και 1 m³ ＝ 1.000 L!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Κατασκευάζουμε τον Όγκο με Κυβάκια του 1 cm³",
      lab1Desc: "Άλλαξε το μήκος, το πλάτος και τις στρώσεις ύψους για να δεις πώς τα κυβάκια 1 cm³ χτίζουν βήμα-βήμα το στερεό και επαληθεύουν τον τύπο V ＝ α · β · γ:",
      lab1LengthLabel: "ΜΗΚΟΣ (α):",
      lab1WidthLabel: "ΠΛΑΤΟΣ (β):",
      lab1HeightLabel: "ΥΨΟΣ (γ):",
      lab1CubesWord: "κυβάκια",
      lab1LayersWord: "στρώσεις",
      lab1BaseCount: "Κυβάκια στη βάση: {l} · {w} ＝ {base} κυβάκια ({baseArea} cm²)",
      lab1LayersCount: "Στρώσεις καθ' ύψος: {h}",
      lab1TotalVolume: "• Συνολικός Όγκος: {base} · {h} ＝ {total} cm³",
      lab1FooterVisual: "{total} κυβάκια του 1 cm³ ＝ {total} cm³ όγκου!",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ ΚΑΙ ΛΙΤΡΩΝ",
      lab2Title: "Υπολογιστής Όγκου (V ＝ α³ ή V ＝ α · β · γ) και Λίτρα",
      lab2Desc: "Επίλεξε σχήμα (Κύβος ή Ορθογώνιο) και ρύθμισε τις διαστάσεις σε cm για να υπολογίσεις άμεσα τον όγκο και τη χωρητικότητα σε λίτρα:",
      lab2SelectLabel: "ΕΠΙΛΟΓΗ ΣΤΕΡΕΟΥ:",
      lab2BtnCuboid: "📦 Παραλληλεπίπεδο",
      lab2BtnCube: "🎲 Κύβος (α³)",
      lab2CubeEdgeLabel: "ΑΚΜΗ ΚΥΒΟΥ (α):",
      lab2DimLengthLabel: "ΜΗΚΟΣ (α):",
      lab2DimWidthLabel: "ΠΛΑΤΟΣ (β):",
      lab2DimHeightLabel: "ΥΨΟΣ (γ):",
      lab2FormulaCubeCalc: "V ＝ α³ ＝ {a} · {a} · {a} ＝ {vol} cm³",
      lab2FormulaCuboidCalc: "V ＝ α · β · γ ＝ {a} · {b} · {c} ＝ {vol} cm³",
      lab2BaseAreaCalc: "Εμβαδόν Βάσης: {a} · {b} ＝ {area} cm²",
      lab2TotalHeader: "ΥΠΟΛΟΓΙΣΜΕΝΟΣ ΟΓΚΟΣ ΚΑΙ ΧΩΡΗΤΙΚΟΤΗΤΑ",
      lab2CubeSubtitle: "Κύβος ακμής {a} cm",
      lab2CuboidSubtitle: "Ορθογώνιο {a} × {b} × {c} cm",
      lab2Dm3Label: "Σε dm³ (ή Λίτρα L):",
      lab2Dm3Calc: "{cm3} : 1.000 ＝ {dm3} dm³",
      lab2M3Label: "Σε m³ (: 1.000.000):",
      lab2M3Subtitle: "Κυβικά μέτρα",
      lab2FooterNote: "💡 1 dm³ ισούται ακριβώς με 1 Λίτρο (L). Άρα το δοχείο χωράει {dm3} λίτρα νερού!",

      probHeading: "Λυμένα Προβλήματα με Όγκο Κύβου και Παραλληλεπιπέδου",
      probSubheading: "Εφαρμογές των τύπων V ＝ α³ και V ＝ α · β · γ σε ενυδρεία και δεξαμενές.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΕΝΥΔΡΕΙΟ ΣΕ ΛΙΤΡΑ",
      prob1Subtitle: "Ορθογώνιο Παραλληλεπίπεδο",
      prob1Title: "Υπολογισμός Χωρητικότητας Ενυδρείου",
      prob1Text: "Ένα ενυδρείο έχει μήκος 80 cm, πλάτος 40 cm και ύψος 50 cm. Πόσα λίτρα (L) νερού περιέχει όταν γεμίσει μέχρι πάνω;",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1Length: "Μήκος (α)",
      prob1Width: "Πλάτος (β)",
      prob1Height: "Ύψος (γ)",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "1ος Τρόπος (μετατροπή σε dm): 8 dm · 4 dm · 5 dm ＝ 160 dm³.",
      prob1Step2: "Επειδή 1 dm³ ＝ 1 L: Το ενυδρείο χωράει 160 L νερού.",
      prob1Step3: "2ος Τρόπος (με cm³): 80 · 40 · 50 ＝ 160.000 cm³. Διαιρούμε με το 1.000: 160.000 : 1.000 ＝ 160 L.",
      prob1Tip: "💡 Η μετατροπή των εκατοστών (cm) σε δεκατόμετρα (dm) πριν τον πολλαπλασιασμό δίνει κατευθείαν το αποτέλεσμα σε λίτρα!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΥΡΕΣΗ ΥΨΟΥΣ",
      prob2Subtitle: "Αντίστροφο Πρόβλημα",
      prob2Title: "Εύρεση του Ύψους σε Δεξαμενή από τον Όγκο",
      prob2Text: "Μια αποθήκη έχει όγκο 180 m³. Το δάπεδό της (η βάση) έχει μήκος 10 m και πλάτος 6 m. Πόσο είναι το ύψος της αποθήκης;",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2Vol: "Όγκος (V)",
      prob2Floor: "Δάπεδο (α · β)",
      prob2Formula: "Τύπος ύψους",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "Εμβαδόν δαπέδου (βάσης): Εβ ＝ 10 · 6 ＝ 60 m².",
      prob2Step2: "Υπολογισμός ύψους: γ ＝ V : Εβ ＝ 180 : 60 ＝ 3 m.",
      prob2Tip: "⚡ Επαλήθευση: V ＝ α · β · γ ＝ 10 · 6 · 3 ＝ 60 · 3 ＝ 180 m³!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Μην μπερδεύετε το εμβαδόν επιφάνειας (cm²) με τον όγκο (cm³):",
      alertL1Text: " Το εμβαδόν μετράει το εξωτερικό τύλιγμα στις 2 διαστάσεις. Ο όγκος μετράει το εσωτερικό γέμισμα στις 3 διαστάσεις (Μήκος · Πλάτος · Ύψος).",
      alertL2Bold: "Στον κύβο είναι α · α · α (α³):",
      alertL2Text: " Αν η ακμή είναι 4 cm, ο όγκος είναι 4 · 4 · 4 ＝ 64 cm³ (και όχι 4 · 3 ＝ 12)!",
      alertL3Bold: "Ίδιες μονάδες μέτρησης:",
      alertL3Text: " Αν οι δύο διαστάσεις είναι σε μέτρα και η τρίτη σε εκατοστά, πρέπει οπωσδήποτε να μετατρέψετε πρώτα και την τρίτη διάσταση σε μέτρα πριν κάνετε τον πολλαπλασιασμό.",
      alertL4Bold: "1 dm³ ＝ 1 L:",
      alertL4Text: " Να θυμάστε πάντοτε ότι 1 κυβικό δεκατόμετρο είναι ακριβώς 1 λίτρο, και 1 κυβικό μέτρο είναι 1.000 λίτρα.",

      ctaTitle: "Ώρα για Εξάσκηση στον Όγκο Κύβου και Παραλληλεπιπέδου!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς όγκου (α³ και α · β · γ), εύρεση άγνωστων διαστάσεων και μετατροπές σε λίτρα για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Volume of Cube and Rectangular Prism - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn how to calculate the volume of a cube (V ＝ a³) and a rectangular prism (V ＝ a · b · c), voxel grid building with 1 cm³ blocks, and real-world problem solving.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 81 • 6TH GRADE",
      heroTitle: "Volume Calculation • Cube • Rectangular Prism",
      heroDesc: "Discover how to calculate the 3D space occupied by a solid! See how we measure volume by packing boxes with unit cubes (1 cm³), apply the fundamental formulas V ＝ a³ and V ＝ a · b · c, and connect base area to height.",
      heroFeature: "Theory, 1 cm³ Unit Cube Packing, Formulas V ＝ a³ and V ＝ a · b · c",
      tryExercises: "Try Exercises",

      stepsHeading: "Cube & Prism Volume in 4 Steps",
      stepsSubheading: "From visual cubic centimeter counting to algebraic formulas and inverse problem solving.",

      step1Badge: "STEP 1",
      step1Subtitle: "Visual Packing",
      step1Title: "How Do We Measure Volume?",
      step1P1: "Imagine packing a hollow box with unit cubes of edge length 1 cm (each having volume 1 cm³):",
      step1BaseDesc: "1. On the bottom base: We lay down a layer of cubes (Length · Width). If length is 4 cm and width is 3 cm, the base holds 4 · 3 ＝ 12 cubes.",
      step1HeightDesc: "2. Through height: We stack identical layers upwards. If height is 2 cm, we have 2 layers: 12 · 2 ＝ 24 cubes!",
      step1TotalDesc: "Total Volume ＝ 24 cm³.",
      step1Tip: "💡 Volume shows exactly how many unit cubes (1 cm³ or 1 m³) fit inside the solid!",

      step2Badge: "STEP 2",
      step2Subtitle: "Prism",
      step2Title: "Rectangular Prism Volume",
      step2P1: "For every rectangular prism with length a, width b, and height c:",
      step2FormulaText: "Volume ＝ Length · Width · Height",
      step2FormulaMath: "V ＝ a · b · c",
      step2BaseHeight: "V ＝ Base Area · Height (V ＝ Abase · c)",
      step2Tip: "⚡ All three dimensions (a, b, c) must always be expressed in the exact same unit of measurement (e.g. all in cm or all in m)!",

      step3Badge: "STEP 3",
      step3Subtitle: "The Cube",
      step3Title: "Volume of a Cube",
      step3P1: "Because a cube has all 3 dimensions equal to its edge a (length ＝ width ＝ height ＝ a):",
      step3FormulaText: "Volume ＝ Edge · Edge · Edge",
      step3FormulaMath: "V ＝ a · a · a ＝ a³",
      step3Example: "Example: A cube with edge 5 cm has volume: V ＝ 5 · 5 · 5 ＝ 125 cm³.",
      step3Tip: "🎯 Caution: a³ means a · a · a (third power), not a · 3!",

      step4Badge: "STEP 4",
      step4Subtitle: "Inverse Problem",
      step4Title: "Finding Height or Base Area",
      step4P1: "When volume and base area of a container are known:",
      step4HeightFormula: "• Height (c) ＝ Volume : Base Area",
      step4BaseFormula: "• Base Area (Abase) ＝ Volume : Height",
      step4Example: "Example: If V ＝ 200 cm³ and base area is 40 cm², the height is: 200 : 40 ＝ 5 cm.",
      step4Tip: "🚀 Remember capacity: 1 dm³ ＝ 1 Liter (L) and 1 m³ ＝ 1,000 L!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "Building Volume with 1 cm³ Unit Cubes",
      lab1Desc: "Change length, width, and height layers to watch 1 cm³ unit cubes build the 3D solid step-by-step and verify V ＝ a · b · c:",
      lab1LengthLabel: "LENGTH (a):",
      lab1WidthLabel: "WIDTH (b):",
      lab1HeightLabel: "HEIGHT (c):",
      lab1CubesWord: "cubes",
      lab1LayersWord: "layers",
      lab1BaseCount: "Base cubes: {l} · {w} ＝ {base} cubes ({baseArea} cm²)",
      lab1LayersCount: "Height layers: {h}",
      lab1TotalVolume: "• Total Volume: {base} · {h} ＝ {total} cm³",
      lab1FooterVisual: "{total} unit cubes of 1 cm³ ＝ {total} cm³ volume!",

      lab2Badge: "📐 INTERACTIVE LAB 2: VOLUME & LITERS CALCULATOR",
      lab2Title: "Volume (V ＝ a³ or V ＝ a · b · c) & Liters Calculator",
      lab2Desc: "Choose solid shape (Cube or Prism) and adjust dimensions in cm to instantly compute volume and capacity in liters:",
      lab2SelectLabel: "SELECT SOLID:",
      lab2BtnCuboid: "📦 Rectangular Prism",
      lab2BtnCube: "🎲 Cube (a³)",
      lab2CubeEdgeLabel: "CUBE EDGE (a):",
      lab2DimLengthLabel: "LENGTH (a):",
      lab2DimWidthLabel: "WIDTH (b):",
      lab2DimHeightLabel: "HEIGHT (c):",
      lab2FormulaCubeCalc: "V ＝ a³ ＝ {a} · {a} · {a} ＝ {vol} cm³",
      lab2FormulaCuboidCalc: "V ＝ a · b · c ＝ {a} · {b} · {c} ＝ {vol} cm³",
      lab2BaseAreaCalc: "Base Area: {a} · {b} ＝ {area} cm²",
      lab2TotalHeader: "CALCULATED VOLUME AND CAPACITY",
      lab2CubeSubtitle: "Cube with edge {a} cm",
      lab2CuboidSubtitle: "Prism {a} × {b} × {c} cm",
      lab2Dm3Label: "In dm³ (or Liters L):",
      lab2Dm3Calc: "{cm3} : 1,000 ＝ {dm3} dm³",
      lab2M3Label: "In m³ (: 1,000,000):",
      lab2M3Subtitle: "Cubic meters",
      lab2FooterNote: "💡 1 dm³ equals exactly 1 Liter (L). Therefore, the container holds {dm3} liters of water!",

      probHeading: "Solved Problems on Cube & Prism Volume",
      probSubheading: "Practical formulas V ＝ a³ and V ＝ a · b · c applied to aquariums and storage rooms.",

      prob1Badge: "PROBLEM 1: AQUARIUM IN LITERS",
      prob1Subtitle: "Rectangular Prism",
      prob1Title: "Calculating Aquarium Water Capacity",
      prob1Text: "An aquarium has length 80 cm, width 40 cm, and height 50 cm. How many liters (L) of water does it hold when full?",
      prob1DataHeader: "PROBLEM DATA",
      prob1Length: "Length (a)",
      prob1Width: "Width (b)",
      prob1Height: "Height (c)",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "Method 1 (convert to dm): 8 dm · 4 dm · 5 dm ＝ 160 dm³.",
      prob1Step2: "Since 1 dm³ ＝ 1 L: The aquarium holds 160 L of water.",
      prob1Step3: "Method 2 (in cm³): 80 · 40 · 50 ＝ 160,000 cm³. Divide by 1,000: 160,000 : 1,000 ＝ 160 L.",
      prob1Tip: "💡 Converting centimeters (cm) to decimeters (dm) before multiplying directly yields liters!",

      prob2Badge: "PROBLEM 2: FINDING HEIGHT",
      prob2Subtitle: "Inverse Problem",
      prob2Title: "Finding Storage Height from Volume",
      prob2Text: "A storage facility has volume 180 m³. Its floor (the base) has length 10 m and width 6 m. What is the height of the storage room?",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2Vol: "Volume (V)",
      prob2Floor: "Floor (a · b)",
      prob2Formula: "Height formula",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "Floor area (base): Abase ＝ 10 · 6 ＝ 60 m².",
      prob2Step2: "Height calculation: c ＝ V : Abase ＝ 180 : 60 ＝ 3 m.",
      prob2Tip: "⚡ Verification: V ＝ a · b · c ＝ 10 · 6 · 3 ＝ 60 · 3 ＝ 180 m³!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Do not confuse surface area (cm²) with volume (cm³):",
      alertL1Text: " Area measures outer wrapping in 2 dimensions. Volume measures interior capacity in 3 dimensions (Length · Width · Height).",
      alertL2Bold: "For cubes, use a · a · a (a³):",
      alertL2Text: " If edge length is 4 cm, volume is 4 · 4 · 4 ＝ 64 cm³ (not 4 · 3 ＝ 12)!",
      alertL3Bold: "Matching units of measurement:",
      alertL3Text: " If two dimensions are in meters and the third in centimeters, convert all dimensions to the same unit before multiplying.",
      alertL4Bold: "1 dm³ ＝ 1 L:",
      alertL4Text: " Always remember that 1 cubic decimeter is exactly 1 liter, and 1 cubic meter is 1,000 liters.",

      ctaTitle: "Time to Practice Cube & Prism Volume!",
      ctaDesc: "Test your skills with 12 interactive exercises on volume formulas (a³ and a · b · c), finding missing dimensions, and converting to liters for 6th Grade.",
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
          href="/st-dimotikou/81-ogkos-cube-ask"
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
              href="/st-dimotikou/81-ogkos-cube-ask"
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>{tLoc.step1BaseDesc}</div>
                  <div>{tLoc.step1HeightDesc}</div>
                  <div className="text-blue-900 font-bold pt-1 border-t border-slate-200">
                    {tLoc.step1TotalDesc}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    {tLoc.step2FormulaText}
                  </div>
                  <div className="text-slate-700 font-bold">
                    {tLoc.step2FormulaMath}
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200 text-xs">
                    {tLoc.step2BaseHeight}
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
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    {tLoc.step3FormulaText}
                  </div>
                  <div className="text-slate-700 font-bold">
                    {tLoc.step3FormulaMath}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    {tLoc.step3Example}
                  </p>
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
                  <div className="text-emerald-950 font-bold">
                    {tLoc.step4HeightFormula}
                  </div>
                  <div className="text-emerald-950 font-bold">
                    {tLoc.step4BaseFormula}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    {tLoc.step4Example}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {tLoc.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΚΑΤΑΣΚΕΥΗ ΜΕ ΚΥΒΑΚΙΑ 1 cm³ (SVG 3D) */}
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

            {/* Sliders Κυβικών Διαστάσεων (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1LengthLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cubesL} cm ({cubesL} {tLoc.lab1CubesWord})
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={cubesL}
                  onChange={(e) => setCubesL(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1WidthLabel}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cubesW} cm ({cubesW} {tLoc.lab1CubesWord})
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={cubesW}
                  onChange={(e) => setCubesW(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1HeightLabel}</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {cubesH} cm ({cubesH} {tLoc.lab1LayersWord})
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={1}
                  value={cubesH}
                  onChange={(e) => setCubesH(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 space-y-1.5 text-xs sm:text-sm font-mono">
                <div>
                  {tLoc.lab1BaseCount
                    .replace('{l}', String(cubesL))
                    .replace('{w}', String(cubesW))
                    .replace('{base}', String(baseCubesCount))
                    .replace('{baseArea}', String(baseCubesCount))}
                </div>
                <div>{tLoc.lab1LayersCount.replace('{h}', String(cubesH))}</div>
                <div className="text-indigo-950 font-black text-sm pt-1 border-t border-sky-200/60">
                  {tLoc.lab1TotalVolume
                    .replace('{base}', String(baseCubesCount))
                    .replace('{h}', String(cubesH))
                    .replace('{total}', String(totalCubesCount))}
                </div>
              </div>
            </div>

            {/* SVG Visualizer με Ισομετρική Προβολή των Κυβιδίων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 260"
                className="w-full max-w-[380px] h-auto select-none overflow-visible"
              >
                {Array.from({ length: cubesH }).map((_, z) => (
                  <g key={`layer-${z}`}>
                    {Array.from({ length: cubesW }).map((_, yRev) => {
                      const y = cubesW - 1 - yRev;
                      return Array.from({ length: cubesL }).map((_, x) => {
                        const cubeSize = 22; // Μέγεθος κυβιδίου
                        const cos30 = 0.866;
                        const sin30 = 0.5;

                        const originX = 190;
                        const originY = 165;

                        const px = originX + (x - y) * (cubeSize * cos30);
                        const py = originY + (x + y) * (cubeSize * sin30) - z * cubeSize;

                        const dx = cubeSize * cos30;
                        const dy = cubeSize * sin30;
                        const dz = cubeSize;

                        return (
                          <g key={`cube-${x}-${y}-${z}`}>
                            {/* Πάνω έδρα */}
                            <polygon
                              points={`
                                ${px},${py - dz} 
                                ${px + dx},${py - dz + dy} 
                                ${px},${py - dz + 2 * dy} 
                                ${px - dx},${py - dz + dy}
                              `}
                              fill="rgba(56, 189, 248, 0.8)"
                              stroke="#0284c7"
                              strokeWidth="1"
                            />
                            {/* Αριστερή έδρα */}
                            <polygon
                              points={`
                                ${px - dx},${py - dz + dy} 
                                ${px},${py - dz + 2 * dy} 
                                ${px},${py + 2 * dy} 
                                ${px - dx},${py + dy}
                              `}
                              fill="rgba(2, 132, 199, 0.75)"
                              stroke="#0369a1"
                              strokeWidth="1"
                            />
                            {/* Δεξιά έδρα */}
                            <polygon
                              points={`
                                ${px},${py - dz + 2 * dy} 
                                ${px + dx},${py - dz + dy} 
                                ${px + dx},${py + dy} 
                                ${px},${py + 2 * dy}
                              `}
                              fill="rgba(14, 165, 233, 0.9)"
                              stroke="#0284c7"
                              strokeWidth="1"
                            />
                          </g>
                        );
                      });
                    })}
                  </g>
                ))}
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                {tLoc.lab1FooterVisual.replace(/{total}/g, String(totalCubesCount))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ ΚΑΙ ΜΕΤΑΤΡΟΠΕΑΣ ΣΕ ΛΙΤΡΑ */}
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

            {/* Επιλογές & Sliders (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {tLoc.lab2SelectLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setShapeMode('cuboid')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      shapeMode === 'cuboid'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tLoc.lab2BtnCuboid}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShapeMode('cube')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      shapeMode === 'cube'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tLoc.lab2BtnCube}
                  </button>
                </div>
              </div>

              {/* Slider 1: Μήκος (ή Ακμή Κύβου) */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{shapeMode === 'cube' ? tLoc.lab2CubeEdgeLabel : tLoc.lab2DimLengthLabel}</span>
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

              {/* Sliders 2 & 3 μόνο αν είναι παραλληλεπίπεδο */}
              {shapeMode === 'cuboid' && (
                <>
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                      <span>{tLoc.lab2DimWidthLabel}</span>
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
                      <span>{tLoc.lab2DimHeightLabel}</span>
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
                </>
              )}

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                {shapeMode === 'cube' ? (
                  <div>
                    {tLoc.lab2FormulaCubeCalc
                      .replace(/{a}/g, String(dimA))
                      .replace('{vol}', formatNum(volumeCm3, locale))}
                  </div>
                ) : (
                  <div>
                    {tLoc.lab2FormulaCuboidCalc
                      .replace('{a}', String(dimA))
                      .replace('{b}', String(dimB))
                      .replace('{c}', String(dimC))
                      .replace('{vol}', formatNum(volumeCm3, locale))}
                  </div>
                )}
                <div>
                  {tLoc.lab2BaseAreaCalc
                    .replace('{a}', String(effectiveDims.a))
                    .replace('{b}', String(effectiveDims.b))
                    .replace('{area}', formatNum(baseAreaCm2, locale))}
                </div>
              </div>
            </div>

            {/* Αποτελέσματα Όγκου & Χωρητικότητας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-4">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2TotalHeader}
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 block">
                  {formatNum(volumeCm3, locale)} cm³
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {shapeMode === 'cube'
                    ? tLoc.lab2CubeSubtitle.replace('{a}', String(dimA))
                    : tLoc.lab2CuboidSubtitle
                        .replace('{a}', String(dimA))
                        .replace('{b}', String(dimB))
                        .replace('{c}', String(dimC))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2Dm3Label}</span>
                  <span className="text-xl font-black text-amber-400 block mt-0.5">
                    {formatNum(volumeDm3, locale)} L
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {tLoc.lab2Dm3Calc
                      .replace('{cm3}', formatNum(volumeCm3, locale))
                      .replace('{dm3}', formatNum(volumeDm3, locale))}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2M3Label}</span>
                  <span className="text-xl font-black text-sky-400 block mt-0.5">
                    {formatNum(volumeM3, locale)} m³
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {tLoc.lab2M3Subtitle}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {tLoc.lab2FooterNote.replace('{dm3}', formatNum(volumeDm3, locale))}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Length}</span> 80 cm ＝ 8 dm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Width}</span> 40 cm ＝ 4 dm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Height}</span> 50 cm ＝ 5 dm
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Vol}</span> 180 m³
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Floor}</span> 10 m · 6 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Formula}</span> {locale === 'el' ? 'γ ＝ V : Εβ' : 'c ＝ V : Abase'}
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
            href="/st-dimotikou/81-ogkos-cube-ask"
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
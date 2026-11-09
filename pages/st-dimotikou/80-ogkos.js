// pages/st-dimotikou/80-ogkos.js
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

export default function OgkosTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστικό Γέμισμα Δοχείου (1 dm³ = 1 L)
  // -------------------------------------------------------------------------
  const [fillPercent, setFillPercent] = useState(60); // 0% έως 100%

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Όγκου & Χωρητικότητας (Λίτρα)
  // -------------------------------------------------------------------------
  const [tankLength, setTankLength] = useState(2); // Μήκος σε μέτρα (m)
  const [tankWidth, setTankWidth] = useState(1.5); // Πλάτος σε μέτρα (m)
  const [tankHeight, setTankHeight] = useState(1); // Ύψος σε μέτρα (m)

  // Υπολογισμοί όγκου
  const volumeM3 = useMemo(() => {
    return tankLength * tankWidth * tankHeight;
  }, [tankLength, tankWidth, tankHeight]);

  const volumeDm3 = useMemo(() => volumeM3 * 1000, [volumeM3]);
  const volumeLiters = useMemo(() => volumeDm3, [volumeDm3]); // 1 dm³ = 1 L
  const volumeCm3 = useMemo(() => volumeDm3 * 1000, [volumeDm3]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Όγκος & Μονάδες Χωρητικότητας (Κυβικά Μέτρα & Λίτρα) - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε για τον όγκο, τις μονάδες μέτρησης (m³, dm³, cm³), τη χωρητικότητα και τη μαγική ισοδυναμία 1 dm³ ＝ 1 L με διαδραστικά εργαστήρια SVG.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 80 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Έννοια του Όγκου • Κυβικά Μέτρα, Μονάδες Χωρητικότητας & Λίτρα",
      heroDesc: "Ανακαλύπτουμε τι είναι ο όγκος ενός στερεού στις 3 διαστάσεις, γνωρίζουμε τα κυβικά μέτρα (m³), τα κυβικά δεκατόμετρα (dm³) και τα κυβικά εκατοστόμετρα (cm³), και ξεκλειδώνουμε τη σπουδαία γέφυρα με τη χωρητικότητα: 1 dm³ ＝ 1 Λίτρο (L)!",
      heroFeature: "Θεωρία, Κυβικά Μέτρα, Σχέση 1 dm³ ＝ 1 L, Μετατροπές & Διαδραστικά Εργαστήρια",
      tryExercises: "Δοκίμασε τις Ασκήσεις",

      stepsHeading: "Ο Όγκος & η Χωρητικότητα σε 4 Βήματα",
      stepsSubheading: "Από τον τρισδιάστατο χώρο μέχρι τις μονάδες μέτρησης και το γέμισμα δοχείων με λίτρα.",

      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Έννοια & Μονάδες",
      step1Title: "Τι είναι ο Όγκος;",
      step1P1: "Όγκος ενός σώματος είναι ο χώρος που αυτό καταλαμβάνει. Μετριέται σε 3 διαστάσεις: μήκος, πλάτος και ύψος.",
      step1BaseUnitTitle: "• Βασική Μονάδα: Κυβικό μέτρο (1 m³)",
      step1BaseUnitDesc: "Είναι ο όγκος ενός κύβου με ακμή 1 μέτρο (1 m · 1 m · 1 m).",
      step1Rule1000Title: "• Ο Κανόνας του 1.000:",
      step1Rule1000Desc: "Στις κυβικές μονάδες κάθε σκαλοπάτι είναι 1.000 φορές μεγαλύτερο ή μικρότερο! 1 m³ ＝ 1.000 dm³ ＝ 1.000.000 cm³.",
      step1Tip: "💡 Μήκος σε cm (βήμα 10) • Επιφάνεια σε cm² (βήμα 100) • Όγκος σε cm³ (βήμα 1.000)!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Η Μεγάλη Γέφυρα",
      step2Title: "Χωρητικότητα & Λίτρα (L)",
      step2P1: "Χωρητικότητα είναι ο όγκος των υγρών (ή αερίων) που χωράει μέσα σε ένα δοχείο. Μετριέται σε λίτρα (L):",
      step2BridgeTitle: "★ 1 dm³ ＝ 1 L (Λίτρο)",
      step2BridgeDesc: "Αν φτιάξουμε έναν κύβο με ακμή 1 dm (10 cm) και τον γεμίσουμε με νερό, χωράει ακριβώς 1 λίτρο!",
      step2Equivs: "• 1 m³ ＝ 1.000 dm³ ＝ 1.000 L | • 1 cm³ ＝ 1 mL (χιλιοστόλιτρο)",
      step2Tip: "⚡ Να θυμάστε για πάντα: 1 m³ χωράει 1.000 λίτρα νερού!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Υπολογισμός Όγκου",
      step3Title: "Πώς Βρίσκουμε τον Όγκο;",
      step3P1: "Πολλαπλασιάζουμε τις 3 διαστάσεις του στερεού:",
      step3CubeTitle: "• Κύβος με ακμή α:",
      step3CubeFormula: "V ＝ α · α · α ＝ α³",
      step3CuboidTitle: "• Ορθογώνιο Παραλληλεπίπεδο:",
      step3CuboidFormula1: "V ＝ Μήκος · Πλάτος · Ύψος",
      step3CuboidFormula2: "V ＝ α · β · γ",
      step3GeneralFormula: "V ＝ Εμβαδόν Βάσης · Ύψος",
      step3Tip: "🎯 Και οι τρεις διαστάσεις (α, β, γ) πρέπει να είναι στην ίδια μονάδα (π.χ. όλες σε m ή όλες σε dm) πριν πολλαπλασιάσουμε!",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Πρακτικές Εφαρμογές",
      step4Title: "Από τον Όγκο στα Λίτρα",
      step4P1: "Στα προβλήματα με δεξαμενές και πισίνες ακολουθούμε 2 απλά βήματα:",
      step4Step1: "1. Βρίσκουμε τον όγκο σε m³: Π.χ. 2 m · 1,5 m · 1 m ＝ 3 m³.",
      step4Step2: "2. Μετατρέπουμε σε λίτρα (· 1.000): 3 · 1.000 ＝ 3.000 L νερού!",
      step4Note: "Αν οι διαστάσεις είναι σε dm, ο όγκος βγαίνει κατευθείαν σε dm³, δηλαδή κατευθείαν σε λίτρα!",
      step4Tip: "🚀 Συμβουλή: Όταν ζητούνται λίτρα, μετατρέψτε τις διαστάσεις σε dm από την αρχή!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Η Μαγική Σχέση: 1 Κυβικό Δεκατόμετρο (dm³) ＝ 1 Λίτρο (L)",
      lab1Desc: "Σύρε τη στάθμη για να γεμίσεις το διαφανές δοχείο με νερό. Παρατήρησε πώς ο όγκος σε dm³ συμβαδίζει απόλυτα με τα λίτρα (L):",
      lab1SliderLabel: "ΣΤΑΘΜΗ ΝΕΡΟΥ ΣΤΟ ΔΟΧΕΙΟ:",
      lab1Empty: "0% (Άδειο)",
      lab1Half: "50% (Μισό)",
      lab1Full: "100% (Γεμάτο)",
      lab1TankSpec: "Δοχείο: Κύβος ακμής 1 dm (10 cm)",
      lab1VolWater: "Όγκος Νερού",
      lab1Capacity: "Χωρητικότητα",
      lab1InCm3: "• Σε cm³: {val} cm³ (ή mL)",
      lab1SvgDim1: "1 dm (10 cm)",
      lab1SvgDim2: "1 dm",
      lab1StatusFull: "✓ Το δοχείο γέμισε πλήρως: 1 dm³ νερού ＝ ακριβώς 1 Λίτρο (L)!",
      lab1StatusProgress: "Στάθμη: {dm3} dm³ ＝ {liters} L νερού.",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΧΩΡΗΤΙΚΟΤΗΤΑΣ",
      lab2Title: "Πόσα Λίτρα Χωράει μια Δεξαμενή;",
      lab2Desc: "Άλλαξε τις διαστάσεις μιας δεξαμενής (σε μέτρα) για να υπολογίσεις αυτόματα τον όγκο της σε m³, dm³ και τη χωρητικότητά της σε λίτρα:",
      lab2LengthLabel: "ΜΗΚΟΣ (α):",
      lab2WidthLabel: "ΠΛΑΤΟΣ (β):",
      lab2HeightLabel: "ΥΨΟΣ (γ):",
      lab2CalcLine1: "Υπολογισμός: V ＝ {l} · {w} · {h} ＝ {m3} m³",
      lab2CalcLine2: "Σε dm³ (· 1.000): {m3} · 1.000 ＝ {dm3} dm³",
      lab2TotalHeader: "ΧΩΡΗΤΙΚΟΤΗΤΑ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ",
      lab2LitersUnit: "L (Λίτρα)",
      lab2LitersEquiv: "Ισοδυναμεί ακριβώς με {dm3} κυβικά δεκατόμετρα (dm³)",
      lab2VolM3Label: "Όγκος σε m³:",
      lab2VolCm3Label: "Σε cm³ (ή mL):",
      lab2FooterNote: "💡 Κάθε κυβικό μέτρο (1 m³) περιέχει ακριβώς 1.000 λίτρα νερού!",

      probHeading: "Λυμένα Προβλήματα με Όγκο & Χωρητικότητα",
      probSubheading: "Εφαρμογές των μονάδων όγκου σε δεξαμενές πετρελαίου και πισίνες.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΕΞΑΜΕΝΗ ΠΕΤΡΕΛΑΙΟΥ",
      prob1Subtitle: "Μετατροπή m³ σε L",
      prob1Title: "Υπολογισμός Χωρητικότητας Δεξαμενής σε Λίτρα",
      prob1Text: "Μια δεξαμενή πετρελαίου σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος 2 m, πλάτος 1,2 m και ύψος 1,5 m. Πόσα λίτρα (L) πετρελαίου χωράει όταν γεμίσει εντελώς;",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1Length: "Μήκος (α)",
      prob1Width: "Πλάτος (β)",
      prob1Height: "Ύψος (γ)",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "Βρίσκουμε τον όγκο σε m³: V ＝ 2 · 1,2 · 1,5 ＝ 3,6 m³.",
      prob1Step2: "Γνωρίζουμε ότι: 1 m³ ＝ 1.000 dm³ ＝ 1.000 L.",
      prob1Step3: "Χωρητικότητα σε λίτρα: 3,6 · 1.000 ＝ 3.600 L.",
      prob1Tip: "💡 Εναλλακτικά: Μετατρέπουμε τα μέτρα σε dm (20 dm, 12 dm, 15 dm) και πολλαπλασιάζουμε: 20 · 12 · 15 ＝ 3.600 dm³ ＝ 3.600 L!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΥΒΙΚΟ ΔΟΧΕΙΟ",
      prob2Subtitle: "Κύβος & Λίτρα",
      prob2Title: "Χωρητικότητα Κύβου από cm³ σε Λίτρα",
      prob2Text: "Ένα διακοσμητικό δοχείο σε σχήμα κύβου έχει ακμή 20 cm. Πόσα λίτρα (L) νερού χωράει;",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2Edge: "Ακμή κύβου",
      prob2EdgeVal: "20 cm ＝ 2 dm",
      prob2VolDm3: "Όγκος σε dm³",
      prob2VolDm3Val: "2 · 2 · 2 ＝ 8 dm³",
      prob2Equiv: "Σχέση",
      prob2EquivVal: "1 dm³ ＝ 1 L",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "1ος Τρόπος (με dm): 20 cm ＝ 2 dm. Όγκος: 2 · 2 · 2 ＝ 8 dm³ ＝ 8 L.",
      prob2Step2: "2ος Τρόπος (με cm³): 20 · 20 · 20 ＝ 8.000 cm³. Διαιρούμε με το 1.000: 8.000 : 1.000 ＝ 8 L.",
      prob2Tip: "⚡ Η μετατροπή σε δεκατόμετρα (dm) πριν τον πολλαπλασιασμό κάνει τις πράξεις πολύ πιο γρήγορες και εύκολες!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Μην μπερδεύετε τις μονάδες επιφάνειας (cm²) με τις μονάδες όγκου (cm³):",
      alertL1Text: " Στην επιφάνεια ανεβοκατεβαίνουμε ανά 100, ενώ στον όγκο ανεβοκατεβαίνουμε ανά 1.000!",
      alertL2Bold: "Η μαγική ισοδυναμία:",
      alertL2Text: " Να θυμάστε πάντοτε ότι 1 dm³ ＝ 1 L (και 1 m³ ＝ 1.000 L). Ποτέ μην θεωρείτε ότι 1 m³ είναι 1 λίτρο!",
      alertL3Bold: "Ίδιες μονάδες μέτρησης πριν τον πολλαπλασιασμό:",
      alertL3Text: " Αν το μήκος είναι σε μέτρα και το ύψος σε εκατοστά, πρέπει πρώτα να τα μετατρέψετε στην ίδια μονάδα.",
      alertL4Bold: "Στον κύβο υψώνουμε στην 3η δύναμη:",
      alertL4Text: " Ο όγκος του κύβου είναι α · α · α (α³), και όχι α · 3!",

      ctaTitle: "Ώρα για Εξάσκηση στον Όγκο & τα Λίτρα!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς όγκου κύβου, παραλληλεπιπέδου, μετατροπές m³ σε λίτρα (L) και χωρητικότητα για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Volume & Capacity Units (Cubic Meters & Liters) - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn about volume, units of measurement (m³, dm³, cm³), capacity, and the fundamental equivalence 1 dm³ ＝ 1 L with interactive SVG models.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 80 • 6TH GRADE",
      heroTitle: "Concept of Volume • Cubic Meters, Capacity Units & Liters",
      heroDesc: "Discover what 3D volume represents, explore cubic meters (m³), cubic decimeters (dm³), and cubic centimeters (cm³), and unlock the bridge to capacity: 1 dm³ ＝ 1 Liter (L)!",
      heroFeature: "Theory, Cubic Meters, 1 dm³ ＝ 1 L Relation, Conversions & Interactive Labs",
      tryExercises: "Try Exercises",

      stepsHeading: "Volume & Capacity in 4 Steps",
      stepsSubheading: "From 3-dimensional space to measurement units and filling containers with liters.",

      step1Badge: "STEP 1",
      step1Subtitle: "Concept & Units",
      step1Title: "What is Volume?",
      step1P1: "Volume is the three-dimensional space that an object occupies. It is measured in 3 dimensions: length, width, and height.",
      step1BaseUnitTitle: "• Base Unit: Cubic meter (1 m³)",
      step1BaseUnitDesc: "It is the volume of a cube with edge length of 1 meter (1 m · 1 m · 1 m).",
      step1Rule1000Title: "• The 1,000 Step Rule:",
      step1Rule1000Desc: "For cubic units, each step is 1,000 times larger or smaller! 1 m³ ＝ 1,000 dm³ ＝ 1,000,000 cm³.",
      step1Tip: "💡 Length in cm (step 10) • Area in cm² (step 100) • Volume in cm³ (step 1,000)!",

      step2Badge: "STEP 2",
      step2Subtitle: "The Bridge",
      step2Title: "Capacity & Liters (L)",
      step2P1: "Capacity is the volume of liquids (or gases) that a hollow container can hold. It is measured in liters (L):",
      step2BridgeTitle: "★ 1 dm³ ＝ 1 L (Liter)",
      step2BridgeDesc: "If we build a cube with edge 1 dm (10 cm) and fill it with water, it holds exactly 1 liter!",
      step2Equivs: "• 1 m³ ＝ 1,000 dm³ ＝ 1,000 L | • 1 cm³ ＝ 1 mL (milliliter)",
      step2Tip: "⚡ Remember forever: 1 m³ holds exactly 1,000 liters of water!",

      step3Badge: "STEP 3",
      step3Subtitle: "Calculating Volume",
      step3Title: "How to Compute Volume?",
      step3P1: "Multiply the 3 linear dimensions of the solid:",
      step3CubeTitle: "• Cube with edge a:",
      step3CubeFormula: "V ＝ a · a · a ＝ a³",
      step3CuboidTitle: "• Rectangular Prism:",
      step3CuboidFormula1: "V ＝ Length · Width · Height",
      step3CuboidFormula2: "V ＝ a · b · c",
      step3GeneralFormula: "V ＝ Base Area · Height",
      step3Tip: "🎯 All three dimensions (a, b, c) must be in the same unit (e.g. all in m or all in dm) before multiplying!",

      step4Badge: "STEP 4",
      step4Subtitle: "Practical Applications",
      step4Title: "From Volume to Liters",
      step4P1: "In problems involving water tanks and pools, follow 2 simple steps:",
      step4Step1: "1. Find volume in m³: E.g., 2 m · 1.5 m · 1 m ＝ 3 m³.",
      step4Step2: "2. Convert to liters (· 1,000): 3 · 1,000 ＝ 3,000 L of water!",
      step4Note: "If dimensions are in dm, volume is calculated directly in dm³, which means directly in liters!",
      step4Tip: "🚀 Pro tip: When asked for liters, convert dimensions to dm right from the start!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "The Essential Relation: 1 Cubic Decimeter (dm³) ＝ 1 Liter (L)",
      lab1Desc: "Drag the water level to fill the transparent container. Notice how volume in dm³ matches capacity in liters (L):",
      lab1SliderLabel: "WATER LEVEL IN CONTAINER:",
      lab1Empty: "0% (Empty)",
      lab1Half: "50% (Half)",
      lab1Full: "100% (Full)",
      lab1TankSpec: "Container: Cube with edge 1 dm (10 cm)",
      lab1VolWater: "Water Volume",
      lab1Capacity: "Capacity",
      lab1InCm3: "• In cm³: {val} cm³ (or mL)",
      lab1SvgDim1: "1 dm (10 cm)",
      lab1SvgDim2: "1 dm",
      lab1StatusFull: "✓ Container full: 1 dm³ of water ＝ exactly 1 Liter (L)!",
      lab1StatusProgress: "Level: {dm3} dm³ ＝ {liters} L of water.",

      lab2Badge: "📐 INTERACTIVE LAB 2: CAPACITY CALCULATOR",
      lab2Title: "How Many Liters Does a Tank Hold?",
      lab2Desc: "Adjust tank dimensions (in meters) to automatically compute volume in m³, dm³, and capacity in liters:",
      lab2LengthLabel: "LENGTH (a):",
      lab2WidthLabel: "WIDTH (b):",
      lab2HeightLabel: "HEIGHT (c):",
      lab2CalcLine1: "Calculation: V ＝ {l} · {w} · {h} ＝ {m3} m³",
      lab2CalcLine2: "In dm³ (· 1,000): {m3} · 1,000 ＝ {dm3} dm³",
      lab2TotalHeader: "TANK CAPACITY IN LITERS",
      lab2LitersUnit: "L (Liters)",
      lab2LitersEquiv: "Exactly equals {dm3} cubic decimeters (dm³)",
      lab2VolM3Label: "Volume in m³:",
      lab2VolCm3Label: "In cm³ (or mL):",
      lab2FooterNote: "💡 Every single cubic meter (1 m³) holds exactly 1,000 liters of water!",

      probHeading: "Solved Problems on Volume & Capacity",
      probSubheading: "Real-world applications of volume units in fuel tanks and swimming pools.",

      prob1Badge: "PROBLEM 1: OIL TANK",
      prob1Subtitle: "Converting m³ to L",
      prob1Title: "Calculating Tank Capacity in Liters",
      prob1Text: "An oil tank in the shape of a rectangular prism has length 2 m, width 1.2 m, and height 1.5 m. How many liters (L) of oil does it hold when completely full?",
      prob1DataHeader: "PROBLEM DATA",
      prob1Length: "Length (a)",
      prob1Width: "Width (b)",
      prob1Height: "Height (c)",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "Calculate volume in m³: V ＝ 2 · 1.2 · 1.5 ＝ 3.6 m³.",
      prob1Step2: "Recall that: 1 m³ ＝ 1,000 dm³ ＝ 1,000 L.",
      prob1Step3: "Capacity in liters: 3.6 · 1,000 ＝ 3,600 L.",
      prob1Tip: "💡 Alternatively: Convert meters to dm (20 dm, 12 dm, 15 dm) and multiply: 20 · 12 · 15 ＝ 3,600 dm³ ＝ 3,600 L!",

      prob2Badge: "PROBLEM 2: CUBICAL CONTAINER",
      prob2Subtitle: "Cube & Liters",
      prob2Title: "Capacity of a Cube from cm³ to Liters",
      prob2Text: "A decorative cube-shaped container has edge length 20 cm. How many liters (L) of water does it hold?",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2Edge: "Cube edge",
      prob2EdgeVal: "20 cm ＝ 2 dm",
      prob2VolDm3: "Volume in dm³",
      prob2VolDm3Val: "2 · 2 · 2 ＝ 8 dm³",
      prob2Equiv: "Relation",
      prob2EquivVal: "1 dm³ ＝ 1 L",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "Method 1 (using dm): 20 cm ＝ 2 dm. Volume: 2 · 2 · 2 ＝ 8 dm³ ＝ 8 L.",
      prob2Step2: "Method 2 (using cm³): 20 · 20 · 20 ＝ 8,000 cm³. Divide by 1,000: 8,000 : 1,000 ＝ 8 L.",
      prob2Tip: "⚡ Converting to decimeters (dm) before multiplying makes calculations faster and simpler!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Do not confuse area units (cm²) with volume units (cm³):",
      alertL1Text: " Area steps by 100, while volume conversions step by 1,000!",
      alertL2Bold: "The fundamental equivalence:",
      alertL2Text: " Always remember that 1 dm³ ＝ 1 L (and 1 m³ ＝ 1,000 L). Never assume that 1 m³ is 1 liter!",
      alertL3Bold: "Matching units before multiplication:",
      alertL3Text: " If length is in meters and height is in centimeters, convert them to the same unit first.",
      alertL4Bold: "Cubes use the 3rd power:",
      alertL4Text: " Cube volume is a · a · a (a³), not a · 3!",

      ctaTitle: "Time to Practice Volume & Liters!",
      ctaDesc: "Test your skills with 12 interactive exercises on cube and prism volume, m³ to liter conversions, and capacity for 6th Grade.",
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
          href="/st-dimotikou/80-ogkos-ask"
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
              href="/st-dimotikou/80-ogkos-ask"
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
                    {tLoc.step1BaseUnitTitle}
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step1BaseUnitDesc}
                  </div>
                  <div className="text-indigo-950 font-bold pt-1 border-t border-slate-200">
                    {tLoc.step1Rule1000Title}
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step1Rule1000Desc}
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
                  <div className="text-amber-950 font-black text-sm">
                    {tLoc.step2BridgeTitle}
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    {tLoc.step2BridgeDesc}
                  </div>
                  <div className="pt-1 border-t border-slate-200 text-xs">
                    {tLoc.step2Equivs}
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
                    <strong>{tLoc.step3CubeTitle}</strong><br />
                    {tLoc.step3CubeFormula}
                  </div>
                  <div>
                    <strong>{tLoc.step3CuboidTitle}</strong><br />
                    {tLoc.step3CuboidFormula1}<br />
                    {tLoc.step3CuboidFormula2}
                  </div>
                  <div className="text-indigo-950 font-bold pt-1 border-t border-slate-200 text-xs">
                    {tLoc.step3GeneralFormula}
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
                  <div>{tLoc.step4Step1}</div>
                  <div>{tLoc.step4Step2}</div>
                  <div className="text-slate-700 font-sans text-xs pt-1 border-t border-slate-200">
                    {tLoc.step4Note}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {tLoc.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΓΕΜΙΣΜΑ ΚΥΒΟΥ ΜΕ ΝΕΡΟ (1 dm³ = 1 L) */}
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

            {/* Slider & Επεξηγήσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1SliderLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {fillPercent}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={fillPercent}
                  onChange={(e) => setFillPercent(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{tLoc.lab1Empty}</span>
                  <span>{tLoc.lab1Half}</span>
                  <span>{tLoc.lab1Full}</span>
                </div>
              </div>

              {/* Κάρτα Ενδείξεων */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2.5 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {tLoc.lab1TankSpec}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-500 block font-sans">{tLoc.lab1VolWater}</span>
                    <span className="text-base font-black text-indigo-700">
                      {formatNum((fillPercent / 100).toFixed(2), locale)} dm³
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                    <span className="text-[10px] text-slate-500 block font-sans">{tLoc.lab1Capacity}</span>
                    <span className="text-base font-black text-emerald-700">
                      {formatNum((fillPercent / 100).toFixed(2), locale)} L
                    </span>
                  </div>
                </div>
                <div className="text-slate-600 text-[11px] font-mono pt-1 border-t border-sky-200/60">
                  {tLoc.lab1InCm3.replace('{val}', formatNum(Math.round((fillPercent / 100) * 1000), locale))}
                </div>
              </div>
            </div>

            {/* SVG Visualizer Κύβου με Στάθμη Νερού (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 260"
                className="w-full max-w-[360px] h-auto select-none overflow-visible"
              >
                {/* 1. Πίσω ακμές δοχείου (διακεκομμένες) */}
                <line x1="180" y1="210" x2="270" y2="160" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="90" y1="160" x2="180" y2="210" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
                <line x1="180" y1="210" x2="180" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

                {/* 2. Στάθμη Νερού (εμφανίζεται αναλογικά με fillPercent) */}
                {fillPercent > 0 && (
                  <g>
                    <polygon
                      points="90,160 180,210 270,160 180,110"
                      fill="rgba(56, 189, 248, 0.25)"
                    />
                    {/* Μπροστινή αριστερή πλευρά νερού */}
                    <polygon
                      points={`
                        90,160 
                        180,210 
                        180,${210 - (fillPercent / 100) * 110} 
                        90,${160 - (fillPercent / 100) * 110}
                      `}
                      fill="rgba(56, 189, 248, 0.45)"
                    />
                    {/* Μπροστινή δεξιά πλευρά νερού */}
                    <polygon
                      points={`
                        180,210 
                        270,160 
                        270,${160 - (fillPercent / 100) * 110} 
                        180,${210 - (fillPercent / 100) * 110}
                      `}
                      fill="rgba(14, 165, 233, 0.55)"
                    />
                    {/* Επιφάνεια νερού (πάνω στάθμη) */}
                    <polygon
                      points={`
                        90,${160 - (fillPercent / 100) * 110} 
                        180,${210 - (fillPercent / 100) * 110} 
                        270,${160 - (fillPercent / 100) * 110} 
                        180,${110 - (fillPercent / 100) * 110}
                      `}
                      fill="rgba(125, 211, 252, 0.75)"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {/* 3. Μπροστινός γυάλινος σκελετός κύβου */}
                <polygon
                  points="90,160 180,110 270,160 180,210"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <polygon
                  points="90,50 180,0 270,50 180,100"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                />
                <line x1="90" y1="160" x2="90" y2="50" stroke="#94a3b8" strokeWidth="2" />
                <line x1="180" y1="210" x2="180" y2="100" stroke="#94a3b8" strokeWidth="2" />
                <line x1="270" y1="160" x2="270" y2="50" stroke="#94a3b8" strokeWidth="2" />

                {/* Ενδείξεις διαστάσεων κύβου (1 dm x 1 dm x 1 dm) */}
                <text x="125" y="195" fill="#f59e0b" fontSize="11" fontWeight="bold">{tLoc.lab1SvgDim1}</text>
                <text x="235" y="195" fill="#f59e0b" fontSize="11" fontWeight="bold">{tLoc.lab1SvgDim2}</text>
                <line x1="285" y1="160" x2="285" y2="50" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="295" y="110" fill="#f59e0b" fontSize="12" fontWeight="bold">{tLoc.lab1SvgDim2}</text>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {fillPercent === 100
                  ? tLoc.lab1StatusFull
                  : tLoc.lab1StatusProgress
                      .replace('{dm3}', formatNum((fillPercent / 100).toFixed(2), locale))
                      .replace('{liters}', formatNum((fillPercent / 100).toFixed(2), locale))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ ΔΕΞΑΜΕΝΗΣ ΣΕ ΛΙΤΡΑ */}
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

            {/* Sliders Διαστάσεων Δεξαμενής (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2LengthLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {tankLength} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.5}
                  value={tankLength}
                  onChange={(e) => setTankLength(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2WidthLabel}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {tankWidth} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={4}
                  step={0.5}
                  value={tankWidth}
                  onChange={(e) => setTankWidth(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2HeightLabel}</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {tankHeight} m
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={tankHeight}
                  onChange={(e) => setTankHeight(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                <div>
                  {tLoc.lab2CalcLine1
                    .replace('{l}', String(tankLength))
                    .replace('{w}', String(tankWidth))
                    .replace('{h}', String(tankHeight))
                    .replace('{m3}', formatNum(volumeM3, locale))}
                </div>
                <div>
                  {tLoc.lab2CalcLine2
                    .replace('{m3}', formatNum(volumeM3, locale))
                    .replace('{dm3}', formatNum(volumeDm3, locale))}
                </div>
              </div>
            </div>

            {/* Αποτελέσματα Χωρητικότητας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2TotalHeader}
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatNum(volumeLiters, locale)} {tLoc.lab2LitersUnit}
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {tLoc.lab2LitersEquiv.replace('{dm3}', formatNum(volumeDm3, locale))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2VolM3Label}</span>
                  <span className="text-sky-400 font-black text-lg">{formatNum(volumeM3, locale)} m³</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2VolCm3Label}</span>
                  <span className="text-amber-400 font-black text-lg">{formatNum(volumeCm3, locale)} cm³</span>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Length}</span> 2 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Width}</span> 1,2 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1Height}</span> 1,5 m
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Edge}</span> {tLoc.prob2EdgeVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2VolDm3}</span> {tLoc.prob2VolDm3Val}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2Equiv}</span> {tLoc.prob2EquivVal}
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
            href="/st-dimotikou/80-ogkos-ask"
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
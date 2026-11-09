// pages/st-dimotikou/82-ogkos-kilindrou.js
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

export default function OgkosKilindrouTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Στοίβαξη Κυκλικών Στρώσεων (SVG 3D)
  // -------------------------------------------------------------------------
  const [layersCount, setLayersCount] = useState(5); // Στρώσεις ύψους υ (1 έως 8)
  const [labRadius, setLabRadius] = useState(4); // Ακτίνα ρ (2 έως 6)

  const labBaseArea = useMemo(() => 3.14 * labRadius * labRadius, [labRadius]);
  const labVolume = useMemo(() => labBaseArea * layersCount, [labBaseArea, layersCount]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Όγκου και Χωρητικότητας Κυλίνδρου
  // -------------------------------------------------------------------------
  const [calcRadius, setCalcRadius] = useState(6); // Ακτίνα ρ σε cm
  const [calcHeight, setCalcHeight] = useState(15); // Ύψος υ σε cm
  const piVal = 3.14;

  const diameter = useMemo(() => calcRadius * 2, [calcRadius]);
  const baseAreaCm2 = useMemo(() => piVal * calcRadius * calcRadius, [calcRadius]);
  const volumeCm3 = useMemo(() => baseAreaCm2 * calcHeight, [baseAreaCm2, calcHeight]);
  const volumeDm3 = useMemo(() => volumeCm3 / 1000, [volumeCm3]); // 1 dm³ = 1 L
  const volumeLiters = useMemo(() => volumeDm3, [volumeDm3]);
  const volumeM3 = useMemo(() => volumeCm3 / 1000000, [volumeCm3]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Όγκος Κυλίνδρου και Χωρητικότητα σε Λίτρα - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε πώς υπολογίζουμε τον όγκο κυλίνδρου με τον τύπο V ＝ π · ρ² · υ, την οπτική απόδειξη με κυκλικές στρώσεις και τις εφαρμογές σε λίτρα.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 82 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Όγκος Κυλίνδρου • Εμβαδόν Βάσης, Ύψος και Χωρητικότητα σε Λίτρα",
      heroDesc: "Ανακαλύπτουμε πώς υπολογίζεται ο όγκος κάθε κυλινδρικού δοχείου με τον τύπο V ＝ π · ρ² · υ, κατανοούμε τη γεωμετρική του ερμηνεία ως στοίβαξη κυκλικών στρώσεων, και μαθαίνουμε πώς μετατρέπουμε εύκολα τον όγκο σε λίτρα (L) για δεξαμενές, θερμοσίφωνες και ποτήρια!",
      heroFeature: "Θεωρία, Τύπος V ＝ π · ρ² · υ, Στοίβαξη Δίσκων και Χωρητικότητα σε Λίτρα",
      tryExercises: "Δοκίμασε τις Ασκήσεις",

      stepsHeading: "Ο Όγκος Κυλίνδρου σε 4 Βήματα",
      stepsSubheading: "Από τον βασικό τύπο μέχρι την οπτική αναπαράσταση και τον υπολογισμό υγρών.",

      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Ο Τύπος",
      step1Title: "Πώς Βρίσκουμε τον Όγκο;",
      step1P1: "Όπως και στο πρίσμα, ο όγκος του κυλίνδρου ισούται με το εμβαδόν της βάσης του επί το ύψος:",
      step1FormulaText: "Όγκος ＝ Εμβαδόν Βάσης · Ύψος",
      step1FormulaMath: "V ＝ Εβ · υ",
      step1FormulaDetailed: "V ＝ π · ρ² · υ ＝ 3,14 · ρ · ρ · υ",
      step1Tip: "💡 Επειδή η βάση είναι κύκλος με εμβαδόν π · ρ², ο όγκος είναι απλά (π · ρ²) · υ!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Οπτική Ερμηνεία",
      step2Title: "Στοίβαξη Κυκλικών Κερμάτων",
      step2P1: "Φανταστείτε ότι στοιβάζουμε πολλά ίδια στρογγυλά κέρματα ή κυκλικούς δίσκους το ένα πάνω στο άλλο:",
      step2CoinDesc1: "1. Κάθε δίσκος έχει εμβαδόν επιφάνειας ίσο με π · ρ².",
      step2CoinDesc2: "2. Όσο προσθέτουμε δίσκους καθ' ύψος, η στοίβα ψηλώνει και αποκτά ύψος υ.",
      step2CoinSummary: "Ο συνολικός χώρος που καταλαμβάνει ολόκληρη η στήλη είναι το εμβαδόν του ενός δίσκου επί το ύψος: π · ρ² · υ!",
      step2Tip: "⚡ Όπως στο ορθογώνιο στρώναμε τετραγωνάκια, στον κύλινδρο στοιβάζουμε κυκλικούς δίσκους!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Χωρητικότητα",
      step3Title: "Από τα cm³ και m³ στα Λίτρα",
      step3P1: "Τα κυλινδρικά δοχεία χρησιμοποιούνται σχεδόν πάντοτε για υγρά (νερό, λάδι, γάλα, πετρέλαιο):",
      step3CoreEquiv: "★ 1 dm³ ＝ 1 L (Λίτρο)",
      step3M3Equiv: "• 1 m³ ＝ 1.000 dm³ ＝ 1.000 L",
      step3Cm3Equiv: "• 1.000 cm³ ＝ 1 dm³ ＝ 1 L (1 cm³ ＝ 1 mL)",
      step3Note: "Αν υπολογίσετε τον όγκο σε dm³, γνωρίζετε κατευθείαν πόσα λίτρα χωράει το δοχείο!",
      step3Tip: "🎯 Αν οι διαστάσεις δίνονται σε μέτρα, πολλαπλασιάζουμε τα m³ με το 1.000 για να βρούμε τα λίτρα!",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Αντίστροφο Πρόβλημα",
      step4Title: "Εύρεση Ύψους ή Εμβαδού Βάσης",
      step4P1: "Αν γνωρίζουμε τον όγκο (V) ενός κυλινδρικού δοχείου και μία από τις διαστάσεις του:",
      step4HeightFormula: "• Ύψος: υ ＝ V : Εβ ＝ V : (π · ρ²)",
      step4BaseFormula: "• Εμβαδόν Βάσης: Εβ ＝ V : υ",
      step4Example: "Παράδειγμα: Αν V ＝ 314 cm³ και Εβ ＝ 31,4 cm², τότε υ ＝ 314 : 31,4 ＝ 10 cm.",
      step4Tip: "🚀 Θυμήσου: Αν δίνεται η διάμετρος (δ), πρώτα βρίσκουμε την ακτίνα: ρ ＝ δ : 2!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Πώς οι Κυκλικοί Δίσκοι Χτίζουν τον Όγκο του Κυλίνδρου;",
      lab1Desc: "Άλλαξε την ακτίνα (ρ) και το πλήθος των στρώσεων (ύψος υ) για να δεις πώς οι δίσκοι στοιβάζονται και επαληθεύουν τον τύπο V ＝ (π · ρ²) · υ:",
      lab1RadiusLabel: "ΑΚΤΙΝΑ ΒΑΣΗΣ (ρ):",
      lab1HeightLabel: "ΥΨΟΣ ΣΤΡΩΣΕΩΝ (υ):",
      lab1DiscsWord: "δίσκοι",
      lab1DiskAreaText: "Εμβαδόν 1 δίσκου (βάση): 3,14 · {r} · {r} ＝ {base} cm²",
      lab1HeightLayersText: "Πλήθος στρώσεων (ύψος): {h} cm",
      lab1TotalVolText: "• Συνολικός Όγκος: {base} · {h} ＝ {vol} cm³",
      lab1SvgRadiusLabel: "ρ ＝ {r} cm",
      lab1SvgHeightLabel: "υ ＝ {h} cm",
      lab1FooterNote: "{layers} στρώσεις των {base} cm² ＝ {vol} cm³ όγκου!",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΧΩΡΗΤΙΚΟΤΗΤΑΣ",
      lab2Title: "Πόσα Λίτρα Χωράει ένα Κυλινδρικό Δοχείο;",
      lab2Desc: "Άλλαξε την ακτίνα (ρ) και το ύψος (υ) σε cm για να υπολογίσεις τον όγκο και τη χωρητικότητα σε λίτρα (L):",
      lab2CalcRadiusLabel: "ΑΚΤΙΝΑ ΒΑΣΗΣ (ρ):",
      lab2DiameterLabel: "Διάμετρος:",
      lab2CalcHeightLabel: "ΥΨΟΣ ΚΥΛΙΝΔΡΟΥ (υ):",
      lab2BaseAreaCalc: "Εμβαδόν βάσης: π · ρ² ＝ 3,14 · {r} · {r} ＝ {area} cm²",
      lab2VolumeCalc: "Όγκος (Εβ · υ): {area} · {h} ＝ {vol} cm³",
      lab2CardHeader: "ΧΩΡΗΤΙΚΟΤΗΤΑ ΚΥΛΙΝΔΡΙΚΟΥ ΔΟΧΕΙΟΥ ΣΕ ΛΙΤΡΑ",
      lab2LitersUnit: "L (Λίτρα)",
      lab2Dm3Equiv: "Ισοδυναμεί ακριβώς με {dm3} κυβικά δεκατόμετρα (dm³)",
      lab2Cm3CardLabel: "Όγκος σε cm³ (ή mL):",
      lab2Cm3Calc: "{cm3} : 1.000 ＝ {dm3} L",
      lab2M3CardLabel: "Σε m³ (: 1.000.000):",
      lab2M3Subtitle: "Κυβικά μέτρα",
      lab2FooterTip: "💡 Θυμήσου: 1 dm³ ＝ 1 Λίτρο (L). Άρα μετατρέπουμε τα cm³ σε dm³ διαιρώντας με το 1.000!",

      probHeading: "Λυμένα Προβλήματα με Όγκο Κυλίνδρου",
      probSubheading: "Εφαρμογές του τύπου V ＝ π · ρ² · υ σε θερμοσίφωνες, κατσαρόλες και βαρέλια.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΘΕΡΜΟΣΙΦΩΝΑΣ",
      prob1Subtitle: "Υπολογισμός Λίτρων",
      prob1Title: "Χωρητικότητα Κυλινδρικού Boiler σε Λίτρα",
      prob1Text: "Ένας ηλιακός θερμοσίφωνας έχει κυλινδρικό δοχείο με διάμετρο βάσης 50 cm και μήκος (ύψος) 120 cm. Πόσα λίτρα (L) ζεστού νερού χωράει ο θερμοσίφωνας όταν γεμίσει πλήρως; (π ＝ 3,14)",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1DiamLabel: "Διάμετρος (δ)",
      prob1RadiusLabel: "Ακτίνα (ρ)",
      prob1RadiusVal: "50 : 2 ＝ 25 cm ＝ 2,5 dm",
      prob1HeightLabel: "Ύψος (υ)",
      prob1HeightVal: "120 cm ＝ 12 dm",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "Βρίσκουμε την ακτίνα ρ: ρ ＝ δ : 2 ＝ 50 : 2 ＝ 25 cm ＝ 2,5 dm.",
      prob1Step2: "Μετατρέπουμε το ύψος σε dm: 120 cm ＝ 12 dm.",
      prob1Step3: "Εμβαδόν βάσης: 3,14 · 2,5 · 2,5 ＝ 3,14 · 6,25 ＝ 19,625 dm².",
      prob1Step4: "Όγκος σε dm³ (λίτρα): 19,625 · 12 ＝ 235,5 L.",
      prob1Tip: "💡 Μετατρέποντας τις διαστάσεις σε dm (2,5 dm και 12 dm), ο όγκος υπολογίζεται κατευθείαν σε λίτρα!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΥΡΕΣΗ ΥΨΟΥΣ",
      prob2Subtitle: "Αντίστροφο Πρόβλημα",
      prob2Title: "Εύρεση του Ύψους σε Κυλινδρικό Δοχείο από τον Όγκο",
      prob2Text: "Μια κυλινδρική κατσαρόλα έχει χωρητικότητα 6,28 L (6.280 cm³). Αν η ακτίνα της βάσης της είναι 10 cm, πόσο είναι το ύψος (το βάθος) της κατσαρόλας; (π ＝ 3,14)",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2VolLabel: "Όγκος (V)",
      prob2RadiusLabel: "Ακτίνα (ρ)",
      prob2FormulaLabel: "Τύπος ύψους",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "Εμβαδόν βάσης: Εβ ＝ 3,14 · 10 · 10 ＝ 3,14 · 100 ＝ 314 cm².",
      prob2Step2: "Υπολογισμός ύψους: υ ＝ V : Εβ ＝ 6.280 : 314 ＝ 20 cm.",
      prob2Tip: "⚡ Επαλήθευση: V ＝ π · ρ² · υ ＝ 314 · 20 ＝ 6.280 cm³ ＝ 6,28 dm³ ＝ 6,28 L!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Μην μπερδεύετε τον όγκο με την παράπλευρη επιφάνεια:",
      alertL1Text: " Η παράπλευρη επιφάνεια είναι (2 · π · ρ) · υ και μετριέται σε cm² (επιφάνεια). Ο όγκος είναι (π · ρ²) · υ και μετριέται σε cm³ ή λίτρα (χώρος).",
      alertL2Bold: "Προσοχή στο ρ²:",
      alertL2Text: " Το ρ² σημαίνει ρ · ρ (η ακτίνα πολλαπλασιασμένη με τον εαυτό της). Αν η ακτίνα είναι 4 cm, τότε ρ² ＝ 4 · 4 ＝ 16 cm² (και όχι 4 · 2 ＝ 8).",
      alertL3Bold: "Αν δίνεται η διάμετρος:",
      alertL3Text: " Μην ξεχνάτε να διαιρέσετε πρώτα με το 2 για να βρείτε την ακτίνα ρ: ρ ＝ δ : 2.",
      alertL4Bold: "1 dm³ ＝ 1 L:",
      alertL4Text: " Να θυμάστε πάντοτε ότι 1 κυβικό δεκατόμετρο είναι ακριβώς 1 λίτρο, και 1 κυβικό μέτρο είναι 1.000 λίτρα.",

      ctaTitle: "Ώρα για Εξάσκηση στον Όγκο Κυλίνδρου!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς όγκου κυλίνδρου (V ＝ π · ρ² · υ), εύρεση ύψους και χωρητικότητα σε λίτρα για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Cylinder Volume and Capacity in Liters - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn how to calculate cylinder volume using the formula V ＝ π · r² · h, visual proof with circular slices, and capacity applications in liters.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 82 • 6TH GRADE",
      heroTitle: "Cylinder Volume • Base Area, Height and Capacity in Liters",
      heroDesc: "Discover how to calculate the volume of any cylindrical vessel using V ＝ π · r² · h, understand its geometric interpretation as a stack of circular discs, and learn how to easily convert volume into liters (L) for storage tanks, water heaters, and cups!",
      heroFeature: "Theory, Formula V ＝ π · r² · h, Disc Stacking and Capacity in Liters",
      tryExercises: "Try Exercises",

      stepsHeading: "Cylinder Volume in 4 Steps",
      stepsSubheading: "From the fundamental formula to visual representation and liquid capacity calculation.",

      step1Badge: "STEP 1",
      step1Subtitle: "The Formula",
      step1Title: "How to Calculate Volume?",
      step1P1: "Just as with a prism, cylinder volume equals base area multiplied by height:",
      step1FormulaText: "Volume ＝ Base Area · Height",
      step1FormulaMath: "V ＝ Abase · h",
      step1FormulaDetailed: "V ＝ π · r² · h ＝ 3.14 · r · r · h",
      step1Tip: "💡 Because the base is a circle with area π · r², volume is simply (π · r²) · h!",

      step2Badge: "STEP 2",
      step2Subtitle: "Visual Model",
      step2Title: "Stacking Circular Coins",
      step2P1: "Imagine stacking identical round coins or circular discs on top of one another:",
      step2CoinDesc1: "1. Each disc has a surface area of π · r².",
      step2CoinDesc2: "2. As we add discs vertically, the column rises to height h.",
      step2CoinSummary: "The total 3D space occupied by the entire stack equals one disc area times height: π · r² · h!",
      step2Tip: "⚡ Just as we tiled unit squares in a prism, in a cylinder we stack circular discs!",

      step3Badge: "STEP 3",
      step3Subtitle: "Capacity",
      step3Title: "From cm³ and m³ to Liters",
      step3P1: "Cylindrical vessels are almost universally used to store liquids (water, oil, milk, fuel):",
      step3CoreEquiv: "★ 1 dm³ ＝ 1 L (Liter)",
      step3M3Equiv: "• 1 m³ ＝ 1,000 dm³ ＝ 1,000 L",
      step3Cm3Equiv: "• 1,000 cm³ ＝ 1 dm³ ＝ 1 L (1 cm³ ＝ 1 mL)",
      step3Note: "If you compute volume in dm³, you immediately know how many liters the vessel holds!",
      step3Tip: "🎯 If dimensions are given in meters, multiply m³ by 1,000 to find liters!",

      step4Badge: "STEP 4",
      step4Subtitle: "Inverse Problem",
      step4Title: "Finding Height or Base Area",
      step4P1: "When the volume (V) of a cylindrical vessel and one dimension are known:",
      step4HeightFormula: "• Height: h ＝ V : Abase ＝ V : (π · r²)",
      step4BaseFormula: "• Base Area: Abase ＝ V : h",
      step4Example: "Example: If V ＝ 314 cm³ and Abase ＝ 31.4 cm², then h ＝ 314 : 31.4 ＝ 10 cm.",
      step4Tip: "🚀 Remember: If diameter (d) is given, find radius first: r ＝ d : 2!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "How Circular Discs Build Cylinder Volume",
      lab1Desc: "Change base radius (r) and the number of layers (height h) to see discs stack and verify V ＝ (π · r²) · h:",
      lab1RadiusLabel: "BASE RADIUS (r):",
      lab1HeightLabel: "STACK HEIGHT (h):",
      lab1DiscsWord: "discs",
      lab1DiskAreaText: "Area of 1 disc (base): 3.14 · {r} · {r} ＝ {base} cm²",
      lab1HeightLayersText: "Layer count (height): {h} cm",
      lab1TotalVolText: "• Total Volume: {base} · {h} ＝ {vol} cm³",
      lab1SvgRadiusLabel: "r ＝ {r} cm",
      lab1SvgHeightLabel: "h ＝ {h} cm",
      lab1FooterNote: "{layers} layers of {base} cm² ＝ {vol} cm³ volume!",

      lab2Badge: "📐 INTERACTIVE LAB 2: CAPACITY CALCULATOR",
      lab2Title: "How Many Liters Does a Cylinder Hold?",
      lab2Desc: "Adjust base radius (r) and height (h) in cm to calculate volume and capacity in liters (L):",
      lab2CalcRadiusLabel: "BASE RADIUS (r):",
      lab2DiameterLabel: "Diameter:",
      lab2CalcHeightLabel: "CYLINDER HEIGHT (h):",
      lab2BaseAreaCalc: "Base area: π · r² ＝ 3.14 · {r} · {r} ＝ {area} cm²",
      lab2VolumeCalc: "Volume (Abase · h): {area} · {h} ＝ {vol} cm³",
      lab2CardHeader: "CYLINDRICAL VESSEL CAPACITY IN LITERS",
      lab2LitersUnit: "L (Liters)",
      lab2Dm3Equiv: "Exactly equals {dm3} cubic decimeters (dm³)",
      lab2Cm3CardLabel: "Volume in cm³ (or mL):",
      lab2Cm3Calc: "{cm3} : 1,000 ＝ {dm3} L",
      lab2M3CardLabel: "In m³ (: 1,000,000):",
      lab2M3Subtitle: "Cubic meters",
      lab2FooterTip: "💡 Remember: 1 dm³ ＝ 1 Liter (L). We convert cm³ to dm³ by dividing by 1,000!",

      probHeading: "Solved Cylinder Volume Problems",
      probSubheading: "Practical formulas V ＝ π · r² · h applied to water heaters, pots, and barrels.",

      prob1Badge: "PROBLEM 1: WATER HEATER",
      prob1Subtitle: "Calculating Liters",
      prob1Title: "Capacity of a Cylindrical Boiler in Liters",
      prob1Text: "A solar water heater has a cylindrical tank with base diameter 50 cm and length (height) 120 cm. How many liters (L) of hot water does the boiler hold when full? (π ＝ 3.14)",
      prob1DataHeader: "PROBLEM DATA",
      prob1DiamLabel: "Diameter (d)",
      prob1RadiusLabel: "Radius (r)",
      prob1RadiusVal: "50 : 2 ＝ 25 cm ＝ 2.5 dm",
      prob1HeightLabel: "Height (h)",
      prob1HeightVal: "120 cm ＝ 12 dm",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "Find radius r: r ＝ d : 2 ＝ 50 : 2 ＝ 25 cm ＝ 2.5 dm.",
      prob1Step2: "Convert height to dm: 120 cm ＝ 12 dm.",
      prob1Step3: "Base area: 3.14 · 2.5 · 2.5 ＝ 3.14 · 6.25 ＝ 19.625 dm².",
      prob1Step4: "Volume in dm³ (liters): 19.625 · 12 ＝ 235.5 L.",
      prob1Tip: "💡 By converting dimensions into dm (2.5 dm and 12 dm), volume is computed directly in liters!",

      prob2Badge: "PROBLEM 2: FINDING HEIGHT",
      prob2Subtitle: "Inverse Problem",
      prob2Title: "Finding Height of a Cylindrical Pot from Volume",
      prob2Text: "A cylindrical pot has capacity 6.28 L (6,280 cm³). If its base radius is 10 cm, what is the height (depth) of the cooking pot? (π ＝ 3.14)",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2VolLabel: "Volume (V)",
      prob2RadiusLabel: "Radius (r)",
      prob2FormulaLabel: "Height formula",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "Base area: Abase ＝ 3.14 · 10 · 10 ＝ 3.14 · 100 ＝ 314 cm².",
      prob2Step2: "Height calculation: h ＝ V : Abase ＝ 6,280 : 314 ＝ 20 cm.",
      prob2Tip: "⚡ Check: V ＝ π · r² · h ＝ 314 · 20 ＝ 6,280 cm³ ＝ 6.28 dm³ ＝ 6.28 L!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Do not confuse volume with lateral surface area:",
      alertL1Text: " Lateral area is (2 · π · r) · h in cm² (surface). Volume is (π · r²) · h in cm³ or liters (3D space).",
      alertL2Bold: "Caution with r²:",
      alertL2Text: " r² means r · r (radius multiplied by itself). If radius is 4 cm, r² ＝ 4 · 4 ＝ 16 cm² (not 4 · 2 ＝ 8).",
      alertL3Bold: "When diameter is given:",
      alertL3Text: " Always divide by 2 first to find radius r: r ＝ d : 2.",
      alertL4Bold: "1 dm³ ＝ 1 L:",
      alertL4Text: " Always remember that 1 cubic decimeter is exactly 1 liter, and 1 cubic meter is 1,000 liters.",

      ctaTitle: "Time to Practice Cylinder Volume!",
      ctaDesc: "Test your skills with 12 interactive exercises on cylinder volume (V ＝ π · r² · h), finding height, and capacity in liters for 6th Grade.",
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
          href="/st-dimotikou/82-ogkos-kilindrou-ask"
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
              href="/st-dimotikou/82-ogkos-kilindrou-ask"
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    {tLoc.step1FormulaText}
                  </div>
                  <div className="text-slate-700 font-bold">
                    {tLoc.step1FormulaMath}
                  </div>
                  <div className="text-emerald-900 font-black text-base pt-1 border-t border-slate-200">
                    {tLoc.step1FormulaDetailed}
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
                  <div>{tLoc.step2CoinDesc1}</div>
                  <div>{tLoc.step2CoinDesc2}</div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    {tLoc.step2CoinSummary}
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
                  <div className="text-indigo-950 font-black">
                    {tLoc.step3CoreEquiv}
                  </div>
                  <div>{tLoc.step3M3Equiv}</div>
                  <div>{tLoc.step3Cm3Equiv}</div>
                  <div className="text-[11px] text-slate-600 font-sans pt-1 border-t border-slate-200">
                    {tLoc.step3Note}
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

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΣΤΟΙΒΑΞΗ ΚΥΚΛΙΚΩΝ ΣΤΡΩΣΕΩΝ ΣΕ 3D (SVG) */}
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

            {/* Sliders Ακτίνας και Στρώσεων (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1RadiusLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {labRadius} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={6}
                  step={1}
                  value={labRadius}
                  onChange={(e) => setLabRadius(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab1HeightLabel}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {layersCount} cm ({layersCount} {tLoc.lab1DiscsWord})
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={layersCount}
                  onChange={(e) => setLayersCount(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 space-y-1.5 text-xs sm:text-sm font-mono">
                <div>
                  {tLoc.lab1DiskAreaText
                    .replace('{r}', String(labRadius))
                    .replace('{base}', formatNum(labBaseArea, locale))}
                </div>
                <div>
                  {tLoc.lab1HeightLayersText.replace('{h}', String(layersCount))}
                </div>
                <div className="text-indigo-950 font-black text-sm pt-1 border-t border-sky-200/60">
                  {tLoc.lab1TotalVolText
                    .replace('{base}', formatNum(labBaseArea, locale))
                    .replace('{h}', String(layersCount))
                    .replace('{vol}', formatNum(labVolume, locale))}
                </div>
              </div>
            </div>

            {/* SVG Visualizer Στοίβαξης Κερμάτων / Δίσκων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 260"
                className="w-full max-w-[380px] h-auto select-none overflow-visible"
              >
                {Array.from({ length: layersCount }).map((_, idx) => {
                  const cy = 200 - idx * 16;
                  const rx = labRadius * 12;
                  const ry = rx * 0.35;
                  const isTop = idx === layersCount - 1;

                  return (
                    <g key={`layer-${idx}`}>
                      <path
                        d={`
                          M ${190 - rx} ${cy} 
                          A ${rx} ${ry} 0 0 0 ${190 + rx} ${cy} 
                          L ${190 + rx} ${cy + 12} 
                          A ${rx} ${ry} 0 0 1 ${190 - rx} ${cy + 12} 
                          Z
                        `}
                        fill={isTop ? 'rgba(56, 189, 248, 0.9)' : 'rgba(14, 165, 233, 0.75)'}
                        stroke="#0284c7"
                        strokeWidth="1"
                      />
                      <ellipse
                        cx="190"
                        cy={cy}
                        rx={rx}
                        ry={ry}
                        fill={isTop ? 'rgba(125, 211, 252, 0.95)' : 'rgba(56, 189, 248, 0.8)'}
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })}

                {/* Ενδείξεις Ακτίνας ρ και Ύψους υ */}
                <g>
                  {(() => {
                    const topCy = 200 - (layersCount - 1) * 16;
                    const topRx = labRadius * 12;
                    return (
                      <>
                        <line x1="190" y1={topCy} x2={190 + topRx} y2={topCy} stroke="#f59e0b" strokeWidth="2" />
                        <circle cx="190" cy={topCy} r="2.5" fill="#ffffff" />
                        <text x={190 + topRx / 2} y={topCy - 7} fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">
                          {tLoc.lab1SvgRadiusLabel.replace('{r}', String(labRadius))}
                        </text>

                        <line x1={190 + topRx + 16} y1={topCy} x2={190 + topRx + 16} y2={212} stroke="#ffffff" strokeWidth="1.5" />
                        <text x={190 + topRx + 26} y={(topCy + 212) / 2 + 4} fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="start">
                          {tLoc.lab1SvgHeightLabel.replace('{h}', String(layersCount))}
                        </text>
                      </>
                    );
                  })()}
                </g>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                {tLoc.lab1FooterNote
                  .replace('{layers}', String(layersCount))
                  .replace('{base}', formatNum(labBaseArea, locale))
                  .replace('{vol}', formatNum(labVolume, locale))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΓΚΟΥ ΚΥΛΙΝΔΡΟΥ ΚΑΙ ΧΩΡΗΤΙΚΟΤΗΤΑΣ */}
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
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2CalcRadiusLabel}</span>
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
                  <span>{tLoc.lab2DiameterLabel} {diameter} cm</span>
                  <span>20 cm</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2CalcHeightLabel}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {calcHeight} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={40}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                <div>
                  {tLoc.lab2BaseAreaCalc
                    .replace(/{r}/g, String(calcRadius))
                    .replace('{area}', formatNum(baseAreaCm2, locale))}
                </div>
                <div>
                  {tLoc.lab2VolumeCalc
                    .replace('{area}', formatNum(baseAreaCm2, locale))
                    .replace('{h}', String(calcHeight))
                    .replace('{vol}', formatNum(volumeCm3, locale))}
                </div>
              </div>
            </div>

            {/* Αποτελέσματα Όγκου και Χωρητικότητας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-4">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2CardHeader}
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 block">
                  {formatNum(volumeLiters.toFixed(2), locale)} {tLoc.lab2LitersUnit}
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  {tLoc.lab2Dm3Equiv.replace('{dm3}', formatNum(volumeDm3.toFixed(2), locale))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2Cm3CardLabel}</span>
                  <span className="text-xl font-black text-amber-400 block mt-0.5">
                    {formatNum(volumeCm3, locale)} cm³
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {tLoc.lab2Cm3Calc
                      .replace('{cm3}', formatNum(volumeCm3, locale))
                      .replace('{dm3}', formatNum(volumeDm3.toFixed(2), locale))}
                  </span>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700 text-center">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2M3CardLabel}</span>
                  <span className="text-xl font-black text-sky-400 block mt-0.5">
                    {formatNum(volumeM3.toFixed(4), locale)} m³
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                    {tLoc.lab2M3Subtitle}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {tLoc.lab2FooterTip}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1DiamLabel}</span> 50 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1RadiusLabel}</span> {tLoc.prob1RadiusVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1HeightLabel}</span> {tLoc.prob1HeightVal}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2VolLabel}</span> 6.280 cm³
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2RadiusLabel}</span> 10 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2FormulaLabel}</span> {locale === 'el' ? 'υ ＝ V : (π · ρ²)' : 'h ＝ V : (π · r²)'}
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
            href="/st-dimotikou/82-ogkos-kilindrou-ask"
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
// pages/st-dimotikou/70-megethinsi-smikrinsi.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (διατήρηση μόνο του ΣΤ')
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

// Μορφοποίηση αριθμού βάσει γλώσσας (el-GR / en-US)
function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
}

// Component κανονικής μορφής κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function Fraction({ n, d, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono ${className}`}>
      <span className="text-[0.9em] leading-none px-1 pb-0.5 border-b border-current font-bold">
        {n}
      </span>
      <span className="text-[0.9em] leading-none px-1 pt-0.5 font-bold">
        {d}
      </span>
    </span>
  );
}

export default function MegethinsiSmikrinsiTheoriaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  // Συγκεντρωτικό Λεξικό Μεταφράσεων
  const translations = {
    el: {
      headTitle: "Μεγέθυνση, Σμίκρυνση & Κλίμακα - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Μαθαίνουμε πώς μεγεθύνουμε και σμικρύνουμε γεωμετρικά σχήματα, τι είναι η κλίμακα, πώς αλλάζουν οι πλευρές και τα εμβαδά με διαδραστικά εργαστήρια SVG.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      heroBadge: "ΚΕΦΑΛΑΙΟ 70 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Μεγέθυνση & Σμίκρυνση Σχημάτων • Η Έννοια της Κλίμακας",
      heroDesc: "Ανακαλύπτουμε πώς αλλάζουν οι διαστάσεις ενός σχήματος διατηρώντας ακέραια τη μορφή του, τι εκφράζει η κλίμακα στους χάρτες και τα αρχιτεκτονικά σχέδια, και εξετάζουμε τη συναρπαστική διαφορά ανάμεσα στη μεταβολή των πλευρών και των εμβαδών!",
      heroFeature: "Θεωρία, Κλίμακα Χαρτών, Μεγέθυνση, Σμίκρυνση & Διαδραστικά Εργαστήρια",
      heroCta: "Δοκίμασε τις Ασκήσεις",

      sec1Title: "Μεγέθυνση & Κλίμακα σε 4 Βήματα",
      sec1Subtitle: "Από την ομοιότητα των σχημάτων μέχρι τους υπολογισμούς πραγματικών αποστάσεων.",

      step1Badge: "ΒΗΜΑ 1",
      step1Tag: "Έννοια",
      step1Title: "Μεγέθυνση & Σμίκρυνση",
      step1Text: "Όταν μεγεθύνουμε ή σμικρύνουμε ένα γεωμετρικό σχήμα, δημιουργούμε ένα όμοιο σχήμα:",
      step1Enlarge: "• Μεγέθυνση: Πολλαπλασιάζουμε όλες τις διαστάσεις του σχήματος με τον ίδιο αριθμό (μεγαλύτερο του 1).",
      step1Reduce: "• Σμίκρυνση: Διαιρούμε όλες τις διαστάσεις του σχήματος με τον ίδιο αριθμό (ή πολλαπλασιάζουμε με κλάσμα μικρότερο του 1).",
      step1Rule: "Βασικός Κανόνας: Οι γωνίες παραμένουν απολύτως ίδιες! Το σχήμα διατηρεί πιστά τη γεωμετρική του μορφή.",
      step1Tip: "💡 Αν διπλασιάσουμε μόνο το μήκος και όχι το πλάτος, το σχήμα παραμορφώνεται και ΔΕΝ είναι μεγέθυνση!",

      step2Badge: "ΒΗΜΑ 2",
      step2Tag: "Ορισμός",
      step2Title: "Τι είναι η Κλίμακα;",
      step2Text: "Κλίμακα ονομάζεται ο λόγος του μήκους στο σχέδιο (ή στον χάρτη) προς το αντίστοιχο πραγματικό μήκος:",
      step2FormulaPrefix: "Κλίμακα ＝",
      step2FormulaTop: "Μήκος στο σχέδιο",
      step2FormulaBottom: "Πραγματικό μήκος",
      step2Scale100: "• Κλίμακα 1 : 100:",
      step2Scale100Desc: " 1 cm στο σχέδιο αντιστοιχεί σε 100 cm (1 m) στην πραγματικότητα (σμίκρυνση).",
      step2Scale2: "• Κλίμακα 2 : 1:",
      step2Scale2Desc: " 2 cm στο σχέδιο αντιστοιχούν σε 1 cm στην πραγματικότητα (μεγέθυνση μικρών αντικειμένων).",
      step2Tip: "⚡ Στον υπολογισμό της κλίμακας και τα δύο μεγέθη πρέπει να εκφράζονται στην ίδια μονάδα μέτρησης (π.χ. σε cm)!",

      step3Badge: "ΒΗΜΑ 3",
      step3Tag: "Χάρτες",
      step3Title: "Χρήση Κλίμακας σε Χάρτες",
      step3Text: "Στους γεωγραφικούς χάρτες η κλίμακα επιτρέπει τη μετατροπή μετρήσεων σε πραγματικές χιλιομετρικές αποστάσεις:",
      step3ExTitle: "Παράδειγμα: Κλίμακα 1 : 200.000",
      step3ExLine1: "Αν μετρήσουμε με τον χάρακα 3 cm στον χάρτη:",
      step3ExLine2: "3 cm · 200.000 ＝ 600.000 cm.",
      step3ExLine3: "Μετατροπή σε μέτρα: 600.000 : 100 ＝ 6.000 m.",
      step3ExLine4: "Μετατροπή σε χιλιόμετρα: 6.000 : 1.000 ＝ 6 km!",
      step3Tip: "🎯 Χρήσιμος κανόνας: 1 km ＝ 1.000 m ＝ 100.000 cm.",

      step4Badge: "ΒΗΜΑ 4",
      step4Tag: "Περίμετρος vs Εμβαδόν",
      step4Title: "Πώς Αλλάζει το Εμβαδόν;",
      step4Text: "Αν πολλαπλασιάσουμε όλες τις πλευρές ενός σχήματος επί έναν συντελεστή λ:",
      step4PerimRule: "• Η περίμετρος πολλαπλασιάζεται επί λ. (Αν διπλασιαστούν οι πλευρές, διπλασιάζεται η περίμετρος).",
      step4AreaRule: "• Το εμβαδόν πολλαπλασιάζεται επί λ · λ (δηλαδή λ²)!",
      step4AreaSummary: "Αν διπλασιάσουμε τις πλευρές (λ ＝ 2), το εμβαδόν τετραπλασιάζεται (2² ＝ 4)! Αν τριπλασιαστούν (λ ＝ 3), εννεαπλασιάζεται (3² ＝ 9)!",
      step4Tip: "🚀 Προσοχή: Το εμβαδόν μεγαλώνει πολύ ταχύτερα από τις γραμμικές διαστάσεις!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Διαδραστική Μεγέθυνση & Σμίκρυνση Ορθογωνίου (SVG)",
      lab1Desc: "Επίλεξε συντελεστή μεταβολής και δες πώς αλλάζουν οι πλευρές, η περίμετρος και το εμβαδόν σε σύγκριση με το αρχικό σχήμα:",
      lab1SliderLabel: "ΣΥΝΤΕΛΕΣΤΗΣ ΜΕΤΑΒΟΛΗΣ (λ):",
      lab1SliderMin: "0,5× (Σμίκρυνση)",
      lab1SliderMid: "1× (Ίσο)",
      lab1SliderMax: "3× (Μεγέθυνση)",
      lab1ThMeasure: "Μέγεθος",
      lab1ThBase: "Αρχικό (1×)",
      lab1ThNew: "Νέο",
      lab1DimLabel: "Διαστάσεις",
      lab1PerimLabel: "Περίμετρος",
      lab1AreaLabel: "Εμβαδόν",
      lab1SvgInitial: "Αρχικό",
      lab1SvgNew: "Νέο",
      lab1TipPrefix: "💡 Παρατήρησε: Για λ ＝ ",
      lab1TipPerim: ", η περίμετρος έγινε ",
      lab1TipArea: " φορές μεγαλύτερη, αλλά το εμβαδόν έγινε ",
      lab1TipSuffix: " φορές μεγαλύτερο!",
      lab1SvgFooter: "Ο λόγος των πλευρών μένει σταθερά 4 : 2,5 (1,6). Η γεωμετρική μορφή παραμένει απόλυτα πιστή.",

      lab2Badge: "🗺️ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΧΑΡΤΗΣ & ΑΠΟΣΤΑΣΗ",
      lab2Title: "Υπολογιστής Πραγματικής Απόστασης από τον Χάρτη",
      lab2Desc: "Επίλεξε την απόσταση που μέτρησες στον χάρτη με τον χάρακα και την κλίμακα για να βρεις την πραγματική απόσταση σε km:",
      lab2SliderLabel: "ΑΠΟΣΤΑΣΗ ΣΤΟΝ ΧΑΡΤΗ:",
      lab2ScaleSelectLabel: "ΕΠΙΛΟΓΗ ΚΛΙΜΑΚΑΣ ΧΑΡΤΗ (1 : Κ):",
      lab2ResultBadge: "ΠΡΑΓΜΑΤΙΚΗ ΑΠΟΣΤΑΣΗ ΣΤΗ ΓΗ",
      lab2StepCm: "Σε εκατοστά:",
      lab2StepM: "Σε μέτρα:",
      lab2StepKm: "Σε χιλιόμετρα:",

      probSecTitle: "Λυμένα Προβλήματα με Κλίμακα & Μεγέθυνση",
      probSecSubtitle: "Ρεαλιστικές εφαρμογές σε σχέδια κατοικιών και γεωγραφικούς χάρτες.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΚΑΤΟΨΗ ΔΩΜΑΤΙΟΥ",
      prob1Tag: "Κλίμακα 1 : 50",
      prob1Title: "Υπολογισμός Πραγματικών Διαστάσεων από Αρχιτεκτονικό Σχέδιο",
      prob1Desc: "Στην κάτοψη ενός σπιτιού με κλίμακα 1 : 50, ένα παιδικό δωμάτιο έχει μήκος 8 cm και πλάτος 6 cm. Ποιες είναι οι πραγματικές διαστάσεις και το εμβαδόν του δωματίου σε m;",
      prob1TableHeading: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1ThScale: "Κλίμακα",
      prob1ThLen: "Μήκος σχεδίου",
      prob1ThWid: "Πλάτος σχεδίου",
      prob1StepsHeading: "Βήματα Επίλυσης:",
      prob1Step1Prefix: "Πραγματικό μήκος:",
      prob1Step1Val: "8 cm · 50 ＝ 400 cm ＝ 4 m.",
      prob1Step2Prefix: "Πραγματικό πλάτος:",
      prob1Step2Val: "6 cm · 50 ＝ 300 cm ＝ 3 m.",
      prob1Step3Prefix: "Πραγματικό εμβαδόν:",
      prob1Step3Val: "4 m · 3 m ＝ 12 m².",
      prob1Tip: "💡 Στο σχέδιο το εμβαδόν ήταν 8 · 6 ＝ 48 cm². Στην πραγματικότητα είναι 12 m² (δηλαδή 120.000 cm²)! Το εμβαδόν μεγάλωσε 50 · 50 ＝ 2.500 φορές!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΠΟΣΤΑΣΗ ΠΟΛΕΩΝ",
      prob2Tag: "Χάρτης 1 : 1.000.000",
      prob2Title: "Μέτρηση με Χάρακα στον Οδικό Χάρτη",
      prob2Desc: "Σε έναν χάρτη με κλίμακα 1 : 1.000.000, η απόσταση σε ευθεία γραμμή ανάμεσα σε δύο πόλεις μετρήθηκε 6,5 cm. Πόσα χιλιόμετρα (km) απέχουν οι δύο πόλεις στην πραγματικότητα;",
      prob2TableHeading: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2ThDist: "Απόσταση χάρτη",
      prob2ThScale: "Κλίμακα",
      prob2ThRel: "Σχέση km/cm",
      prob2ThRelVal: "1 km ＝ 100.000 cm",
      prob2StepsHeading: "Βήματα Επίλυσης:",
      prob2Step1Prefix: "Πραγματική απόσταση σε cm:",
      prob2Step1Val: "6,5 · 1.000.000 ＝ 6.500.000 cm.",
      prob2Step2Prefix: "Μετατροπή σε m:",
      prob2Step2Val: "6.500.000 : 100 ＝ 65.000 m.",
      prob2Step3Prefix: "Μετατροπή σε km:",
      prob2Step3Val: "65.000 : 1.000 ＝ 65 km.",
      prob2Tip: "⚡ Στην κλίμακα 1 : 1.000.000, κάθε 1 cm στον χάρτη αντιστοιχεί ακριβώς σε 10 km στην πραγματικότητα!",

      alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
      alertItem1Title: "Οι γωνίες δεν αλλάζουν ποτέ:",
      alertItem1Desc: " Όταν ένα σχήμα μεγεθύνεται ή σμικρύνεται, οι γωνίες του παραμένουν ακριβώς ίδιες. Αν έχουμε ένα τρίγωνο με γωνίες 30°, 60°, 90°, η μεγέθυνσή του θα έχει πάλι γωνίες 30°, 60°, 90°!",
      alertItem2Title: "Μην μπερδεύετε τη μεταβολή πλευράς με τη μεταβολή εμβαδού:",
      alertItem2Desc: " Αν τριπλασιάσουμε τις πλευρές ενός τετραγώνου (λ ＝ 3), η περίμετρος τριπλασιάζεται, αλλά το εμβαδόν γίνεται 3 · 3 ＝ 9 φορές μεγαλύτερο!",
      alertItem3Title: "Ίδιες μονάδες μέτρησης στην κλίμακα:",
      alertItem3Desc: " Πριν υπολογίσετε την κλίμακα ως λόγο, πρέπει να μετατρέψετε και τα δύο μήκη στην ίδια μονάδα (συνήθως σε εκατοστά cm).",

      ctaTitle: "Ώρα για Εξάσκηση στην Κλίμακα & τη Μεγέθυνση!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με υπολογισμούς κλίμακας, χάρτες, περιμέτρους και εμβαδά για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      headTitle: "Enlargement, Reduction & Scale - 6th Grade | LearnMaths.gr",
      headDesc: "Learn how to enlarge and reduce geometric shapes, understand map scales, and explore side and area relationships with interactive SVG labs.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      heroBadge: "CHAPTER 70 • 6TH GRADE",
      heroTitle: "Shape Enlargement & Reduction • The Concept of Scale",
      heroDesc: "Discover how shape dimensions scale while preserving geometry, understand map and architectural scales, and explore the striking difference between perimeter and area scaling!",
      heroFeature: "Theory, Map Scales, Enlargement, Reduction & Interactive Labs",
      heroCta: "Try the Exercises",

      sec1Title: "Scale & Scaling in 4 Steps",
      sec1Subtitle: "From geometric similarity to calculating real-world distances.",

      step1Badge: "STEP 1",
      step1Tag: "Concept",
      step1Title: "Enlargement & Reduction",
      step1Text: "When we enlarge or reduce a geometric shape, we create a mathematically similar shape:",
      step1Enlarge: "• Enlargement: Multiply all dimensions of the shape by the same factor (greater than 1).",
      step1Reduce: "• Reduction: Divide all dimensions by the same number (or multiply by a fraction less than 1).",
      step1Rule: "Core Rule: All angles remain completely unchanged! The figure preserves its geometric proportions.",
      step1Tip: "💡 If you only double the length and not the width, the shape distorts and is NOT a true enlargement!",

      step2Badge: "STEP 2",
      step2Tag: "Definition",
      step2Title: "What is Scale?",
      step2Text: "Scale is defined as the ratio of drawing (or map) length to the corresponding actual real-world length:",
      step2FormulaPrefix: "Scale ＝",
      step2FormulaTop: "Drawing length",
      step2FormulaBottom: "Actual length",
      step2Scale100: "• Scale 1 : 100:",
      step2Scale100Desc: " 1 cm on the drawing corresponds to 100 cm (1 m) in reality (reduction).",
      step2Scale2: "• Scale 2 : 1:",
      step2Scale2Desc: " 2 cm on the drawing represent 1 cm in reality (enlargement of microscopic items).",
      step2Tip: "⚡ When calculating scale, both quantities must be expressed in the exact same unit (e.g. cm)!",

      step3Badge: "STEP 3",
      step3Tag: "Maps",
      step3Title: "Using Scales on Maps",
      step3Text: "On geographic maps, scale allows converting measured distance into real kilometers:",
      step3ExTitle: "Example: Scale 1 : 200,000",
      step3ExLine1: "If we measure 3 cm on the map with a ruler:",
      step3ExLine2: "3 cm · 200,000 ＝ 600,000 cm.",
      step3ExLine3: "Convert to meters: 600,000 : 100 ＝ 6,000 m.",
      step3ExLine4: "Convert to kilometers: 6,000 : 1,000 ＝ 6 km!",
      step3Tip: "🎯 Handy rule: 1 km ＝ 1,000 m ＝ 100,000 cm.",

      step4Badge: "STEP 4",
      step4Tag: "Perimeter vs Area",
      step4Title: "How Does Area Change?",
      step4Text: "If we scale all sides of a shape by a linear factor k:",
      step4PerimRule: "• The perimeter is multiplied by k. (Doubling side lengths doubles perimeter).",
      step4AreaRule: "• The area is multiplied by k · k (that is k²)!",
      step4AreaSummary: "If we double side lengths (k ＝ 2), area quadruples (2² ＝ 4)! If tripled (k ＝ 3), area becomes 9 times larger (3² ＝ 9)!",
      step4Tip: "🚀 Note: Area grows quadratically, much faster than linear lengths!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "Interactive Rectangle Scaling (SVG)",
      lab1Desc: "Select a scale factor to see how sides, perimeter, and area scale compared to the original figure:",
      lab1SliderLabel: "SCALE FACTOR (k):",
      lab1SliderMin: "0.5× (Reduction)",
      lab1SliderMid: "1× (Original)",
      lab1SliderMax: "3× (Enlargement)",
      lab1ThMeasure: "Measure",
      lab1ThBase: "Original (1×)",
      lab1ThNew: "Scaled",
      lab1DimLabel: "Dimensions",
      lab1PerimLabel: "Perimeter",
      lab1AreaLabel: "Area",
      lab1SvgInitial: "Original",
      lab1SvgNew: "Scaled",
      lab1TipPrefix: "💡 Notice: For k ＝ ",
      lab1TipPerim: ", the perimeter grew by ",
      lab1TipArea: "×, but the area expanded by ",
      lab1TipSuffix: "×!",
      lab1SvgFooter: "The aspect ratio remains strictly 4 : 2.5 (1.6). Geometric shape is fully preserved.",

      lab2Badge: "🗺️ INTERACTIVE LAB 2: MAP SCALE",
      lab2Title: "Real-World Distance Calculator from Map",
      lab2Desc: "Set the distance measured on the map with a ruler and select the scale to find the actual distance in km:",
      lab2SliderLabel: "DISTANCE ON MAP:",
      lab2ScaleSelectLabel: "SELECT MAP SCALE (1 : K):",
      lab2ResultBadge: "ACTUAL GROUND DISTANCE",
      lab2StepCm: "In centimeters:",
      lab2StepM: "In meters:",
      lab2StepKm: "In kilometers:",

      probSecTitle: "Solved Problems with Scale & Enlargement",
      probSecSubtitle: "Practical applications in architectural floor plans and road maps.",

      prob1Badge: "PROBLEM 1: ROOM FLOOR PLAN",
      prob1Tag: "Scale 1 : 50",
      prob1Title: "Calculating Real Dimensions from Floor Plan",
      prob1Desc: "On a home floor plan with scale 1 : 50, a bedroom measures 8 cm long by 6 cm wide. What are the actual dimensions and area in meters?",
      prob1TableHeading: "PROBLEM DATA",
      prob1ThScale: "Scale",
      prob1ThLen: "Plan length",
      prob1ThWid: "Plan width",
      prob1StepsHeading: "Solution Steps:",
      prob1Step1Prefix: "Real length:",
      prob1Step1Val: "8 cm · 50 ＝ 400 cm ＝ 4 m.",
      prob1Step2Prefix: "Real width:",
      prob1Step2Val: "6 cm · 50 ＝ 300 cm ＝ 3 m.",
      prob1Step3Prefix: "Real area:",
      prob1Step3Val: "4 m · 3 m ＝ 12 m².",
      prob1Tip: "💡 On the blueprint area was 8 · 6 ＝ 48 cm². In reality it is 12 m² (120,000 cm²)! The area grew by 50 · 50 ＝ 2,500 times!",

      prob2Badge: "PROBLEM 2: DISTANCE BETWEEN CITIES",
      prob2Tag: "Map 1 : 1,000,000",
      prob2Title: "Measuring Distance with a Ruler on a Map",
      prob2Desc: "On a map with scale 1 : 1,000,000, straight-line distance between two towns measures 6.5 cm. How many kilometers (km) apart are they in reality?",
      prob2TableHeading: "CALCULATION DATA",
      prob2ThDist: "Map distance",
      prob2ThScale: "Scale",
      prob2ThRel: "km/cm ratio",
      prob2ThRelVal: "1 km ＝ 100,000 cm",
      prob2StepsHeading: "Solution Steps:",
      prob2Step1Prefix: "Real distance in cm:",
      prob2Step1Val: "6.5 · 1,000,000 ＝ 6,500,000 cm.",
      prob2Step2Prefix: "Convert to m:",
      prob2Step2Val: "6,500,000 : 100 ＝ 65,000 m.",
      prob2Step3Prefix: "Convert to km:",
      prob2Step3Val: "65,000 : 1,000 ＝ 65 km.",
      prob2Tip: "⚡ At scale 1 : 1,000,000, every 1 cm on the map equals exactly 10 km on the ground!",

      alertTitle: "Caution / Common Errors to Avoid",
      alertItem1Title: "Angles never scale:",
      alertItem1Desc: " When scaling a shape up or down, all angles stay identical. A 30°-60°-90° triangle will still have 30°, 60°, and 90° angles upon enlargement!",
      alertItem2Title: "Do not confuse side scaling with area scaling:",
      alertItem2Desc: " If we triple the sides of a square (k ＝ 3), perimeter triples, but the area becomes 3 · 3 ＝ 9 times larger!",
      alertItem3Title: "Always match units in scale ratios:",
      alertItem3Desc: " Before expressing scale as a ratio, convert both drawing and real lengths to the identical unit (usually centimeters cm).",

      ctaTitle: "Time to Practice Scale & Enlargement!",
      ctaDesc: "Test your skills with 10 interactive questions on map scales, reductions, perimeters, and areas for 6th Grade.",
      ctaButton: "Start Exercises"
    }
  };

  const t = translations[locale];

  // Εργαστήριο 1: Διαδραστική Μεγέθυνση / Σμίκρυνση Ορθογωνίου
  const [scaleFactor, setScaleFactor] = useState(2);

  // Αρχικές διαστάσεις (cm)
  const baseW = 4;
  const baseH = 2.5;

  const scaledW = useMemo(() => baseW * scaleFactor, [baseW, scaleFactor]);
  const scaledH = useMemo(() => baseH * scaleFactor, [baseH, scaleFactor]);

  const basePerim = useMemo(() => 2 * (baseW + baseH), [baseW, baseH]);
  const scaledPerim = useMemo(() => 2 * (scaledW + scaledH), [scaledW, scaledH]);

  const baseArea = useMemo(() => baseW * baseH, [baseW, baseH]);
  const scaledArea = useMemo(() => scaledW * scaledH, [scaledW, scaledH]);

  // Ενιαία κλίμακα pixels ανά cm
  const pxPerCm = 18;
  const initialSvgW = baseW * pxPerCm;
  const initialSvgH = baseH * pxPerCm;
  const scaledSvgW = scaledW * pxPerCm;
  const scaledSvgH = scaledH * pxPerCm;

  const initialX = 45;
  const initialY = 150 - initialSvgH / 2;

  const scaledX = 230;
  const scaledY = 150 - scaledSvgH / 2;

  // Εργαστήριο 2: Υπολογιστής Κλίμακας Χάρτη (1 : Κ)
  const [mapDistanceCm, setMapDistanceCm] = useState(4);
  const [mapScaleDenominator, setMapScaleDenominator] = useState(50000);

  const { realMeters, realKm } = useMemo(() => {
    const totalCm = mapDistanceCm * mapScaleDenominator;
    const m = totalCm / 100;
    const km = m / 1000;
    return { realMeters: m, realKm: km };
  }, [mapDistanceCm, mapScaleDenominator]);

  return (
    <Layout
      title={t.headTitle}
      description={t.headDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/70-megethinsi-smikrinsi-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.heroDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroFeature}</span>
            </div>
            <Link
              href="/st-dimotikou/70-megethinsi-smikrinsi-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroCta}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.sec1Title}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.sec1Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step1Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>{t.step1Enlarge}</div>
                  <div>{t.step1Reduce}</div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    {t.step1Rule}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 2: ΜΕ ΚΑΝΟΝΙΚΗ ΚΛΑΣΜΑΤΙΚΗ ΜΟΡΦΗ */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step2Tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center">
                  <div className="text-amber-900 font-black text-sm sm:text-base flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step2FormulaPrefix}</span>
                    <Fraction n={t.step2FormulaTop} d={t.step2FormulaBottom} className="text-xs sm:text-sm" />
                  </div>
                  <div className="text-slate-700 text-xs font-sans text-left pt-2 border-t border-slate-200 space-y-1">
                    <div>
                      <strong>{t.step2Scale100}</strong> (ή <Fraction n="1" d="100" />) {t.step2Scale100Desc}
                    </div>
                    <div>
                      <strong>{t.step2Scale2}</strong> (ή <Fraction n="2" d="1" />) {t.step2Scale2Desc}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="font-bold text-indigo-950 flex items-center flex-wrap gap-1">
                    <span>{t.step3ExTitle}</span>
                    <span>(ή <Fraction n="1" d="200.000" />)</span>
                  </div>
                  <div className="text-slate-700 text-xs font-sans space-y-1 pt-1 border-t border-slate-200">
                    <div>{t.step3ExLine1}</div>
                    <div>{t.step3ExLine2}</div>
                    <div>{t.step3ExLine3}</div>
                    <div><strong>{t.step3ExLine4}</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Tag}
                  </span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>{t.step4PerimRule}</div>
                  <div>{t.step4AreaRule}</div>
                  <div className="text-emerald-900 font-bold text-xs pt-1 border-t border-slate-200">
                    {t.step4AreaSummary}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΜΕΓΕΘΥΝΣΗ / ΣΜΙΚΡΥΝΣΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.lab1Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab1Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Στοιχεία (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1SliderLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(scaleFactor, locale)} ×
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={scaleFactor}
                  onChange={(e) => setScaleFactor(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.lab1SliderMin}</span>
                  <span>{t.lab1SliderMid}</span>
                  <span>2×</span>
                  <span>{t.lab1SliderMax}</span>
                </div>
              </div>

              {/* Πίνακας Σύγκρισης Μεγεθών */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50/70 p-1">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-2 px-3">{t.lab1ThMeasure}</th>
                      <th className="py-2 px-3">{t.lab1ThBase}</th>
                      <th className="py-2 px-3 text-indigo-700 font-black">{t.lab1ThNew} ({formatNum(scaleFactor, locale)}×)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 font-mono">
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-700">{t.lab1DimLabel}</td>
                      <td className="py-2 px-3 text-slate-600">{formatNum(baseW, locale)} × {formatNum(baseH, locale)} cm</td>
                      <td className="py-2 px-3 font-bold text-indigo-700">{formatNum(scaledW, locale)} × {formatNum(scaledH, locale)} cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-700">{t.lab1PerimLabel}</td>
                      <td className="py-2 px-3 text-slate-600">{formatNum(basePerim, locale)} cm</td>
                      <td className="py-2 px-3 font-bold text-sky-700">{formatNum(scaledPerim, locale)} cm (· {formatNum(scaleFactor, locale)})</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans font-semibold text-slate-700">{t.lab1AreaLabel}</td>
                      <td className="py-2 px-3 text-slate-600">{formatNum(baseArea, locale)} cm²</td>
                      <td className="py-2 px-3 font-black text-emerald-700">{formatNum(scaledArea, locale)} cm² (· {formatNum(scaleFactor * scaleFactor, locale)})</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 font-medium">
                {t.lab1TipPrefix}{formatNum(scaleFactor, locale)}{t.lab1TipPerim}{formatNum(scaleFactor, locale)}{t.lab1TipArea}{formatNum(scaleFactor * scaleFactor, locale)}{t.lab1TipSuffix}
              </div>
            </div>

            {/* SVG Visualizer Σχημάτων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 460 300"
                className="w-full max-w-[460px] h-auto select-none overflow-visible"
              >
                {/* ΑΡΧΙΚΟ ΣΧΗΜΑ */}
                <g transform={`translate(${initialX}, ${initialY})`}>
                  <rect
                    x="0"
                    y="0"
                    width={initialSvgW}
                    height={initialSvgH}
                    fill="rgba(56, 189, 248, 0.15)"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    rx="4"
                  />
                  <text x={initialSvgW / 2} y="-10" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {formatNum(baseW, locale)} cm
                  </text>
                  <text x="-8" y={initialSvgH / 2 + 4} fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">
                    {formatNum(baseH, locale)} cm
                  </text>
                  <text x={initialSvgW / 2} y={initialSvgH / 2 + 4} fill="#e2e8f0" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {t.lab1SvgInitial}
                  </text>
                  <text x={initialSvgW / 2} y={initialSvgH + 18} fill="#64748b" fontSize="10" fontWeight="bold" textAnchor="middle">
                    {locale === 'el' ? 'Ε' : 'A'} ＝ {formatNum(baseArea, locale)} cm²
                  </text>
                </g>

                {/* ΝΕΟ ΣΧΗΜΑ */}
                <g transform={`translate(${scaledX}, ${scaledY})`}>
                  <rect
                    x="0"
                    y="0"
                    width={scaledSvgW}
                    height={scaledSvgH}
                    fill="rgba(129, 140, 248, 0.25)"
                    stroke="#818cf8"
                    strokeWidth="3"
                    rx="6"
                  />
                  <text x={scaledSvgW / 2} y="-12" fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                    {formatNum(scaledW, locale)} cm
                  </text>
                  <text x="-10" y={scaledSvgH / 2 + 4} fill="#818cf8" fontSize="13" fontWeight="bold" textAnchor="end">
                    {formatNum(scaledH, locale)} cm
                  </text>
                  <text x={scaledSvgW / 2} y={scaledSvgH / 2 + 5} fill="#ffffff" fontSize="14" fontWeight="black" textAnchor="middle">
                    {t.lab1SvgNew} ({formatNum(scaleFactor, locale)}×)
                  </text>
                  <text x={scaledSvgW / 2} y={scaledSvgH + 24} fill="#34d399" fontSize="13" fontWeight="black" textAnchor="middle">
                    {locale === 'el' ? 'Ε' : 'A'} ＝ {formatNum(scaledArea, locale)} cm²
                  </text>
                </g>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {t.lab1SvgFooter}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΚΛΙΜΑΚΑΣ ΧΑΡΤΗ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρυθμίσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2SliderLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {formatNum(mapDistanceCm, locale)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={mapDistanceCm}
                  onChange={(e) => setMapDistanceCm(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  {toCleanUppercase(t.lab2ScaleSelectLabel)}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[25000, 50000, 100000, 200000, 500000, 1000000].map((den) => (
                    <button
                      key={den}
                      type="button"
                      onClick={() => setMapScaleDenominator(den)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all ${
                        mapScaleDenominator === den
                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      1 : {den >= 1000000 ? `${formatNum(den / 1000000, locale)} ${locale === 'el' ? 'εκ.' : 'M'}` : `${formatNum(den / 1000, locale)} ${locale === 'el' ? 'χιλ.' : 'k'}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Αποτέλεσμα & Βήματα (7 στήλες) */}
            <div className="lg:col-span-7 bg-emerald-50/70 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-3 text-center">
              <span className="text-xs text-emerald-900 block font-bold tracking-wider">
                {toCleanUppercase(t.lab2ResultBadge)}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono">
                {formatNum(realKm, locale)} km
              </div>
              <div className="space-y-1.5 text-xs text-slate-700 font-mono text-left bg-white p-3.5 rounded-2xl border border-emerald-200/60">
                <div>
                  <strong>{t.lab2StepCm}</strong> {formatNum(mapDistanceCm, locale)} cm · {formatNum(mapScaleDenominator, locale)} ＝ {formatNum(mapDistanceCm * mapScaleDenominator, locale)} cm
                </div>
                <div>
                  <strong>{t.lab2StepM}</strong> {formatNum(mapDistanceCm * mapScaleDenominator, locale)} : 100 ＝ {formatNum(realMeters, locale)} m
                </div>
                <div>
                  <strong>{t.lab2StepKm}</strong> {formatNum(realMeters, locale)} : 1.000 ＝ <strong>{formatNum(realKm, locale)} km</strong>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.probSecTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.probSecSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob1Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob1TableHeading)}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThScale}</span>
                    <Fraction n="1" d="50" />
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThLen}</span> 8 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThWid}</span> 6 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeading}</span>
                  <div>
                    <strong>{t.prob1Step1Prefix}</strong> {t.prob1Step1Val}
                  </div>
                  <div>
                    <strong>{t.prob1Step2Prefix}</strong> {t.prob1Step2Val}
                  </div>
                  <div>
                    <strong>{t.prob1Step3Prefix}</strong> <strong className="text-blue-700">{t.prob1Step3Val}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  {toCleanUppercase(t.prob2Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob2TableHeading)}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThDist}</span> 6,5 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThScale}</span>
                    <Fraction n="1" d="1.000.000" />
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThRel}</span> {t.prob2ThRelVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeading}</span>
                  <div>
                    <strong>{t.prob2Step1Prefix}</strong> {t.prob2Step1Val}
                  </div>
                  <div>
                    <strong>{t.prob2Step2Prefix}</strong> {t.prob2Step2Val}
                  </div>
                  <div>
                    <strong>{t.prob2Step3Prefix}</strong> <strong className="text-amber-700">{t.prob2Step3Val}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                {t.prob2Tip}
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
                {toCleanUppercase(t.alertTitle)}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>{t.alertItem1Title}</strong>
                  {t.alertItem1Desc}
                </li>
                <li>
                  <strong>{t.alertItem2Title}</strong>
                  {t.alertItem2Desc}
                </li>
                <li>
                  <strong>{t.alertItem3Title}</strong>
                  {t.alertItem3Desc}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/70-megethinsi-smikrinsi-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaButton)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
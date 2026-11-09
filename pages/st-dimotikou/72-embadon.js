// pages/st-dimotikou/72-embadon.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (διατηρείται ακέραιο το ΣΤ')
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

// Μορφοποίηση αριθμού ανάλογα με τη γλώσσα
function formatNum(val, locale = 'el') {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');
}

// Component για κανονική κατακόρυφη μορφή κλάσματος (numerator πάνω, γραμμή, denominator κάτω)
function MathFraction({ num, den }) {
  return (
    <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-center font-mono leading-none text-xs sm:text-sm">
      <span className="border-b border-current pb-0.5 px-1">{num}</span>
      <span className="pt-0.5 px-1">{den}</span>
    </span>
  );
}

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    pageTitle: "Μέτρηση Επιφάνειας & Μονάδες Εμβαδού - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε τι είναι το εμβαδόν, τις μονάδες μέτρησης επιφάνειας, τη σκάλα μετατροπών ανά 100 και τα στρέμματα με διαδραστικά εργαστήρια SVG.",
    backText: "ΣΤ' Δημοτικού",
    actionButtonText: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 72 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Μέτρηση Επιφάνειας • Το Εμβαδόν & οι Μονάδες Μέτρησης",
    heroDesc: "Ανακαλύπτουμε τι εκφράζει η επιφάνεια και το εμβαδόν ενός σχήματος, γιατί οι μονάδες επιφάνειας αλλάζουν ανά 100 σε κάθε σκαλοπάτι, πώς μετράμε χωράφια και οικόπεδα σε στρέμματα και πώς μετακινούμαστε εύκολα ανάμεσα στις μονάδες μέτρησης!",
    heroSubbadge: "Θεωρία, Σκάλα Μονάδων ανά 100, Στρέμματα & Διαδραστικά Εργαστήρια",
    heroTryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Η Μέτρηση Επιφάνειας σε 4 Βήματα",
    stepsSectionSubtitle: "Από την έννοια της κάλυψης μέχρι τη σκάλα μετατροπών και τις αγροτικές μονάδες.",

    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Έννοια",
    step1Title: "Τι είναι Εμβαδόν;",
    step1P1: "Εμβαδόν ονομάζεται το μέτρο της επιφάνειας που καταλαμβάνει ένα κλειστό γεωμετρικό σχήμα στο επίπεδο:",
    step1Prop1Label: "Περίμετρος:",
    step1Prop1Text: "Το μήκος του εξωτερικού ορίου (γραμμή σε μέτρα m).",
    step1Prop2Label: "Εμβαδόν:",
    step1Prop2Text: "Ολόκληρος ο εσωτερικός χώρος που καλύπτει το σχήμα (επιφάνεια σε τετραγωνικά μέτρα m²).",
    step1BaseUnit: "Μονάδα βάσης: Το τετραγωνικό μέτρο (1 m²), δηλαδή ένα τετράγωνο με πλευρά μήκους 1 m.",
    step1Tip: "💡 Όταν υπολογίζουμε εμβαδόν, μετράμε ουσιαστικά «πόσα τετραγωνάκια» χωράνε μέσα στο σχήμα!",

    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Κανόνας",
    step2Title: "Γιατί Αλλάζουν ανά 100;",
    step2P1: "Στο μήκος έχουμε: 1 m ＝ 10 dm. Στην επιφάνεια όμως έχουμε δύο διαστάσεις (μήκος · πλάτος):",
    step2P2: "Κάθε σκαλοπάτι στην επιφάνεια δεν έχει σχέση 10, αλλά 10 · 10 ＝ 100!",
    step2Tip: "⚡ Όταν κατεβαίνουμε σκαλοπάτι πολλαπλασιάζουμε με το 100. Όταν ανεβαίνουμε διαιρούμε με το 100!",

    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Μεγάλες Μονάδες",
    step3Title: "Στρέμματα & km²",
    step3P1: "Για οικόπεδα, δάση και πόλεις χρησιμοποιούμε μεγαλύτερες μονάδες μέτρησης:",
    step3Unit1: "• 1 Στρέμμα ＝ 1.000 m²",
    step3Unit2: "• 1 km² ＝ 1.000.000 m² ＝ 1.000 Στρέμματα",
    step3Example: "Ένα χωράφι 5.000 m² είναι ακριβώς 5.000 : 1.000 ＝ 5 στρέμματα.",
    step3Tip: "🎯 Θυμήσου: 1 km ＝ 1.000 m, άρα 1 km² ＝ 1.000 · 1.000 ＝ 1.000.000 m²!",

    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Μετατροπές",
    step4Title: "Κανόνες Μετατροπής",
    step4P1: "Πώς μετακινούμαστε στη σκάλα των μονάδων μέτρησης επιφάνειας:",
    step4RuleDown: "• Από μεγαλύτερη σε μικρότερη (κατεβαίνω): Πολλαπλασιάζω · 100 για κάθε σκαλοπάτι.",
    step4RuleUp: "• Από μικρότερη σε μεγαλύτερη (ανεβαίνω): Διαιρώ : 100 για κάθε σκαλοπάτι.",
    step4Example: "Παράδειγμα: 3 m² ＝ 3 · 100 ＝ 300 dm² ＝ 30.000 cm².",
    step4Tip: "🚀 Για 2 σκαλοπάτια (π.χ. από m² σε cm²) πολλαπλασιάζουμε με το 100 · 100 ＝ 10.000!",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Διαδραστικός Μετατροπέας Μονάδων Επιφάνειας",
    lab1Subtitle: "Γράψε έναν αριθμό και επίλεξε την αρχική μονάδα για να δεις αυτόματα πώς μετατρέπεται σε όλες τις υπόλοιπες κλίμακες επιφάνειας:",
    lab1InputLabel: "1. ΕΙΣΑΓΩΓΗ ΤΙΜΗΣ:",
    lab1UnitSelectLabel: "2. ΑΡΧΙΚΗ ΜΟΝΑΔΑ ΜΕΤΡΗΣΗΣ:",
    lab1Tip: "💡 Παρατήρησε: Όταν μετακινούμαστε από τα m² προς τα dm² και cm², ο αριθμός μεγαλώνει κατά 100 φορές για κάθε βήμα!",
    lab1TableTitle: "ΙΣΟΔΥΝΑΜΙΑ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ",
    unitKm2: "Τετραγωνικά χιλιόμετρα (km²)",
    unitStremma: "Στρέμματα",
    unitM2: "Τετραγωνικά μέτρα (m²)",
    unitDm2: "Τετραγωνικά δεκατόμετρα (dm²)",
    unitCm2: "Τετραγωνικά εκατοστόμετρα (cm²)",
    unitMm2: "Τετραγωνικά χιλιοστόμετρα (mm²)",

    lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟ ΠΛΕΓΜΑ",
    lab2Title: "Γιατί 1 m² ＝ 100 dm²; (Οπτική Απόδειξη)",
    lab2Subtitle: "Φαντάσου το μεγάλο τετράγωνο ως 1 m² (πλευρά 1 m ＝ 10 dm). Χωρίζεται σε 10 · 10 ＝ 100 μικρά τετραγωνάκια των 1 dm²:",
    lab2ControlLabel: "ΧΡΩΜΑΤΙΣΜΕΝΑ ΤΕΤΡΑΓΩΝΑΚΙΑ (dm²):",
    lab2StepMin: "1 dm²",
    lab2StepMid: "50 dm² (0,5 m²)",
    lab2StepMax: "100 dm² (1 m²)",
    lab2AreaHeading: "Επιφάνεια Χρωματισμένου Μέρους:",
    lab2FractionTextPre: "Κάθε τετραγωνάκι είναι το",
    lab2FractionTextPost: "του μεγάλου τετραγώνου (0,01 m²).",
    lab2SvgCaption: "10 γραμμές · 10 στήλες ＝ 100 τετραγωνικά δεκατόμετρα (1 m²)",

    problemsTitle: "Λυμένα Προβλήματα με Μονάδες Επιφάνειας",
    problemsSubtitle: "Εφαρμογές των μετατροπών σε πραγματικά σενάρια πλακόστρωσης και αγοραπωλησίας γης.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΠΛΑΚΑΚΙΑ ΔΑΠΕΔΟΥ",
    prob1Category: "Από m² σε cm²",
    prob1Title: "Υπολογισμός Πλήθους Πλακιδίων για Δωμάτιο",
    prob1P1: "Το πάτωμα μιας κουζίνας έχει εμβαδόν 15 m². Θέλουμε να το καλύψουμε με τετράγωνα πλακάκια που έχουν εμβαδόν 600 cm² το καθένα. Πόσα πλακάκια θα χρειαστούν;",
    prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
    prob1DataKitchen: "Εμβαδόν κουζίνας",
    prob1DataTile: "Εμβαδόν πλακιδίου",
    prob1DataRelation: "Σχέση m²/cm²",
    prob1DataRelationVal: "1 m² ＝ 10.000 cm²",
    prob1StepsHeader: "Βήματα Επίλυσης:",
    prob1Step1Label: "Μετατροπή κουζίνας σε cm²:",
    prob1Step1Text: "15 · 10.000 ＝ 150.000 cm².",
    prob1Step2Label: "Υπολογισμός πλακιδίων:",
    prob1Step2Text: "150.000 : 600 ＝ 250 πλακάκια.",
    prob1Tip: "💡 Πάντα μετατρέπουμε όλα τα εμβαδά στην ίδια μονάδα μέτρησης πριν κάνουμε διαίρεση!",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΑΓΡΟΤΕΜΑΧΙΟ",
    prob2Category: "Στρέμματα & Αξία",
    prob2Title: "Υπολογισμός Αξίας Ελαιώνα σε Στρέμματα",
    prob2P1: "Ένας ελαιώνας έχει εμβαδόν 12.500 m². Ο ιδιοκτήτης πουλάει το κτήμα προς 4.000 € το στρέμμα. Πόσα χρήματα θα εισπράξει από την πώληση;",
    prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
    prob2DataArea: "Εμβαδόν σε m²",
    prob2DataStremma: "1 Στρέμμα",
    prob2DataStremmaVal: "1.000 m²",
    prob2DataPrice: "Τιμή/στρέμμα",
    prob2DataPriceVal: "4.000 €",
    prob2StepsHeader: "Βήματα Επίλυσης:",
    prob2Step1Label: "Μετατροπή σε στρέμματα:",
    prob2Step1Text: "12.500 : 1.000 ＝ 12,5 στρέμματα.",
    prob2Step2Label: "Συνολική αξία:",
    prob2Step2Text: "12,5 · 4.000 € ＝ 50.000 €.",
    prob2Tip: "⚡ Για να μετατρέψουμε από m² σε στρέμματα, διαιρούμε πάντοτε με το 1.000.",

    alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
    alertItem1Strong: "Μην μπερδεύετε το 10 με το 100:",
    alertItem1Text: "Στο μήκος 1 m ＝ 10 dm, αλλά στην επιφάνεια 1 m² ＝ 100 dm²! Για κάθε σκαλοπάτι που ανεβαίνουμε ή κατεβαίνουμε στην επιφάνεια, πολλαπλασιάζουμε ή διαιρούμε με το 100.",
    alertItem2Strong: "Δύο σκαλοπάτια σημαίνουν · 10.000 και όχι · 200:",
    alertItem2Text: "Από m² σε cm² κατεβαίνουμε 2 σκαλοπάτια (· 100 · 100 ＝ · 10.000).",
    alertItem3Strong: "Μην μπερδεύετε την περίμετρο με το εμβαδόν:",
    alertItem3Text: "Η περίμετρος μετριέται σε απλά μέτρα (m) και είναι το μήκος του φράχτη. Το εμβαδόν μετριέται σε τετραγωνικά μέτρα (m²) και είναι η επιφάνεια του οικοπέδου.",
    alertItem4Strong: "Το στρέμμα δεν είναι 100 m²:",
    alertItem4Text: "Το 1 στρέμμα ισούται με ακριβώς 1.000 m².",

    footerTitle: "Ώρα για Εξάσκηση στις Μονάδες Επιφάνειας!",
    footerDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με μετατροπές τετραγωνικών μέτρων, δεκατομέτρων, εκατοστομέτρων και στρεμμάτων για τη ΣΤ' Δημοτικού.",
    footerButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Surface Area Measurement & Area Units - 6th Grade Math | LearnMaths.gr",
    pageDesc: "Learn what area is, surface measurement units, the conversion scale by factor 100, and stremmata/ares with interactive SVG labs.",
    backText: "6th Grade",
    actionButtonText: "🎯 Exercises",
    chapterBadge: "CHAPTER 72 • 6TH GRADE",
    heroTitle: "Surface Measurement • Area & Units of Measure",
    heroDesc: "Discover what surface area represents, why area units scale by 100 at each step, how land parcels are measured in stremmata, and how to convert effortlessly across units!",
    heroSubbadge: "Theory, Area Scale by 100, Stremmata & Interactive Labs",
    heroTryExercises: "Try the Exercises",

    stepsSectionTitle: "Surface Measurement in 4 Steps",
    stepsSectionSubtitle: "From the physical concept of surface coverage to the conversion scale and agricultural units.",

    step1Badge: "STEP 1",
    step1Category: "Concept",
    step1Title: "What is Area?",
    step1P1: "Area is the measure of the two-dimensional surface enclosed within a closed geometric boundary on a plane:",
    step1Prop1Label: "Perimeter:",
    step1Prop1Text: "The length of the outer boundary (a 1D line measured in meters m).",
    step1Prop2Label: "Area:",
    step1Prop2Text: "The total interior surface enclosed by the shape (a 2D region measured in square meters m²).",
    step1BaseUnit: "Base unit: The square meter (1 m²), which is the area of a square with sides of length 1 m.",
    step1Tip: "💡 When we compute area, we are essentially counting how many unit squares fit inside the shape!",

    step2Badge: "STEP 2",
    step2Category: "Rule",
    step2Title: "Why Do Area Units Change by 100?",
    step2P1: "For linear length: 1 m ＝ 10 dm. However, area spans two dimensions (length · width):",
    step2P2: "Each step in area does not scale by 10, but by 10 · 10 ＝ 100!",
    step2Tip: "⚡ When going down a step we multiply by 100. When climbing up a step we divide by 100!",

    step3Badge: "STEP 3",
    step3Category: "Large Units",
    step3Title: "Stremmata & km²",
    step3P1: "For building lots, forests, and entire towns, we rely on larger units of surface area:",
    step3Unit1: "• 1 Stremma (decare) ＝ 1,000 m²",
    step3Unit2: "• 1 km² ＝ 1,000,000 m² ＝ 1,000 Stremmata",
    step3Example: "A field of 5,000 m² equals exactly 5,000 : 1,000 ＝ 5 stremmata.",
    step3Tip: "🎯 Remember: 1 km ＝ 1,000 m, therefore 1 km² ＝ 1,000 · 1,000 ＝ 1,000,000 m²!",

    step4Badge: "STEP 4",
    step4Category: "Conversions",
    step4Title: "Conversion Rules",
    step4P1: "How to navigate up and down the surface area conversion scale:",
    step4RuleDown: "• From larger to smaller unit (going down): Multiply by 100 for each step.",
    step4RuleUp: "• From smaller to larger unit (going up): Divide by 100 for each step.",
    step4Example: "Example: 3 m² ＝ 3 · 100 ＝ 300 dm² ＝ 30,000 cm².",
    step4Tip: "🚀 For 2 steps (e.g. from m² to cm²) we multiply by 100 · 100 ＝ 10,000!",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Interactive Surface Area Unit Converter",
    lab1Subtitle: "Type a value and select the source unit to automatically observe its equivalent representation across all surface area scales:",
    lab1InputLabel: "1. ENTER VALUE:",
    lab1UnitSelectLabel: "2. SOURCE UNIT OF MEASURE:",
    lab1Tip: "💡 Notice: Moving from m² down to dm² and cm² causes the numerical value to grow 100 times larger with each single step!",
    lab1TableTitle: "EQUIVALENCE ACROSS ALL UNITS",
    unitKm2: "Square kilometers (km²)",
    unitStremma: "Stremmata (decares)",
    unitM2: "Square meters (m²)",
    unitDm2: "Square decimeters (dm²)",
    unitCm2: "Square centimeters (cm²)",
    unitMm2: "Square millimeters (mm²)",

    lab2Badge: "📐 INTERACTIVE LAB 2: VISUAL GRID",
    lab2Title: "Why 1 m² ＝ 100 dm²; (Visual Proof)",
    lab2Subtitle: "Picture the large square as 1 m² (with side length 1 m ＝ 10 dm). It is partitioned into 10 · 10 ＝ 100 small squares of 1 dm² each:",
    lab2ControlLabel: "COLORED SQUARES (dm²):",
    lab2StepMin: "1 dm²",
    lab2StepMid: "50 dm² (0.5 m²)",
    lab2StepMax: "100 dm² (1 m²)",
    lab2AreaHeading: "Area of Highlighted Region:",
    lab2FractionTextPre: "Each small square constitutes",
    lab2FractionTextPost: "of the large unit square (0.01 m²).",
    lab2SvgCaption: "10 rows · 10 columns ＝ 100 square decimeters (1 m²)",

    problemsTitle: "Solved Area Measurement Problems",
    problemsSubtitle: "Practical applications of area conversions to real-world flooring and real estate scenarios.",

    prob1Badge: "PROBLEM 1: FLOOR TILES",
    prob1Category: "From m² to cm²",
    prob1Title: "Calculating Total Tiles Needed for a Room",
    prob1P1: "A kitchen floor has an area of 15 m². We wish to pave it with square tiles having an area of 600 cm² each. How many tiles are needed in total?",
    prob1DataHeader: "GIVEN DATA",
    prob1DataKitchen: "Kitchen area",
    prob1DataTile: "Tile area",
    prob1DataRelation: "m² to cm² ratio",
    prob1DataRelationVal: "1 m² ＝ 10,000 cm²",
    prob1StepsHeader: "Solution Steps:",
    prob1Step1Label: "Convert kitchen area to cm²:",
    prob1Step1Text: "15 · 10,000 ＝ 150,000 cm².",
    prob1Step2Label: "Compute number of tiles:",
    prob1Step2Text: "150,000 : 600 ＝ 250 tiles.",
    prob1Tip: "💡 Always convert all measurements into the same unit before performing division!",

    prob2Badge: "PROBLEM 2: LAND PARCEL",
    prob2Category: "Stremmata & Value",
    prob2Title: "Calculating Total Value of an Olive Grove",
    prob2P1: "An olive grove spans an area of 12,500 m². The owner sells the land at 4,000 € per stremma. How much money will the owner receive from the sale?",
    prob2DataHeader: "CALCULATION METRICS",
    prob2DataArea: "Area in m²",
    prob2DataStremma: "1 Stremma",
    prob2DataStremmaVal: "1,000 m²",
    prob2DataPrice: "Price/stremma",
    prob2DataPriceVal: "4,000 €",
    prob2StepsHeader: "Solution Steps:",
    prob2Step1Label: "Convert to stremmata:",
    prob2Step1Text: "12,500 : 1,000 ＝ 12.5 stremmata.",
    prob2Step2Label: "Total value:",
    prob2Step2Text: "12.5 · 4,000 € ＝ 50,000 €.",
    prob2Tip: "⚡ To convert from m² to stremmata, always divide by 1,000.",

    alertTitle: "Caution / Common Misconceptions to Avoid",
    alertItem1Strong: "Do not confuse factor 10 with factor 100:",
    alertItem1Text: "For length 1 m ＝ 10 dm, but for surface area 1 m² ＝ 100 dm²! For every single step up or down in area units, we multiply or divide by 100.",
    alertItem2Strong: "Two steps mean · 10,000, not · 200:",
    alertItem2Text: "From m² to cm² we step down twice (· 100 · 100 ＝ · 10,000).",
    alertItem3Strong: "Do not confuse perimeter with area:",
    alertItem3Text: "Perimeter is measured in linear meters (m) representing fence length. Area is measured in square meters (m²) representing the ground surface.",
    alertItem4Strong: "A stremma is not 100 m²:",
    alertItem4Text: "1 stremma (decare) equals exactly 1,000 m².",

    footerTitle: "Time to Practice Area Measurement!",
    footerDesc: "Test your skills with 12 dynamic interactive exercises featuring conversions between square meters, decimeters, centimeters, and stremmata for 6th Grade.",
    footerButton: "Start Exercises"
  }
};

export default function EmbadonTheoriaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστική Σκάλα Μετατροπής Μονάδων Επιφάνειας
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState('m2');

  // Ισοδυναμία σε m² για κάθε μονάδα
  const unitFactorsToM2 = {
    km2: 1000000,
    stremma: 1000,
    m2: 1,
    dm2: 0.01,
    cm2: 0.0001,
    mm2: 0.000001
  };

  const convertedValues = useMemo(() => {
    const val = Number(inputValue) || 0;
    const valInM2 = val * unitFactorsToM2[fromUnit];

    return {
      km2: valInM2 / 1000000,
      stremma: valInM2 / 1000,
      m2: valInM2,
      dm2: valInM2 / 0.01,
      cm2: valInM2 / 0.0001,
      mm2: valInM2 / 0.000001
    };
  }, [inputValue, fromUnit]);

  // Εργαστήριο 2: Οπτικοποίηση Πλέγματος 10x10 (1 m² = 100 dm²)
  const [highlightedBlocks, setHighlightedBlocks] = useState(25);

  const unitButtons = useMemo(() => [
    { id: 'km2', label: 'km²' },
    { id: 'stremma', label: t.unitStremma },
    { id: 'm2', label: 'm²' },
    { id: 'dm2', label: 'dm²' },
    { id: 'cm2', label: 'cm²' },
    { id: 'mm2', label: 'mm²' }
  ], [t.unitStremma]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/72-embadon-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionButtonText}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.chapterBadge}</span>
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
              <span>{t.heroSubbadge}</span>
            </div>
            <Link
              href="/st-dimotikou/72-embadon-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroTryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsSectionTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.stepsSectionSubtitle}
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>{t.step1Prop1Label}</strong> {t.step1Prop1Text}
                  </div>
                  <div>
                    • <strong>{t.step1Prop2Label}</strong> {t.step1Prop2Text}
                  </div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    {t.step1BaseUnit}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-amber-950 font-bold text-center">
                    1 m² ＝ 10 dm · 10 dm ＝ <strong>100 dm²</strong>!
                  </div>
                  <div className="text-amber-950 font-bold text-center">
                    1 dm² ＝ 10 cm · 10 cm ＝ <strong>100 cm²</strong>!
                  </div>
                  <div className="text-amber-950 font-bold text-center">
                    1 cm² ＝ 10 mm · 10 mm ＝ <strong>100 mm²</strong>!
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    {t.step2P2}
                  </p>
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200 text-indigo-950 font-black">
                    {t.step3Unit1}
                  </div>
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 text-purple-950 font-black">
                    {t.step3Unit2}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans">
                    {t.step3Example}
                  </p>
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>{t.step4RuleDown}</div>
                  <div>{t.step4RuleUp}</div>
                  <div className="text-emerald-950 font-mono text-[11px] pt-1 border-t border-slate-200">
                    {t.step4Example}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΙΑΔΡΑΣΤΙΚΗ ΣΚΑΛΑ ΜΟΝΑΔΩΝ ΕΠΙΦΑΝΕΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.lab1Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab1Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια Εισαγωγής (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  {toCleanUppercase(t.lab1InputLabel)}
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 font-mono text-lg font-black text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {toCleanUppercase(t.lab1UnitSelectLabel)}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {unitButtons.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setFromUnit(u.id)}
                      className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                        fromUnit === u.id
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs text-sky-950 font-medium">
                {t.lab1Tip}
              </div>
            </div>

            {/* Πίνακας Αποτελεσμάτων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {toCleanUppercase(t.lab1TableTitle)}
              </span>

              <div className="space-y-2 font-mono text-xs sm:text-sm">
                {[
                  { key: 'km2', label: t.unitKm2, val: convertedValues.km2, color: 'text-purple-400' },
                  { key: 'stremma', label: t.unitStremma, val: convertedValues.stremma, color: 'text-amber-400' },
                  { key: 'm2', label: t.unitM2, val: convertedValues.m2, color: 'text-sky-400' },
                  { key: 'dm2', label: t.unitDm2, val: convertedValues.dm2, color: 'text-indigo-400' },
                  { key: 'cm2', label: t.unitCm2, val: convertedValues.cm2, color: 'text-emerald-400' },
                  { key: 'mm2', label: t.unitMm2, val: convertedValues.mm2, color: 'text-rose-400' }
                ].map((item) => (
                  <div
                    key={item.key}
                    className={`flex items-center justify-between p-2.5 rounded-xl border ${
                      fromUnit === item.key
                        ? 'bg-slate-800 border-indigo-500 ring-1 ring-indigo-400'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <span className="text-slate-300 font-sans text-xs">{item.label}:</span>
                    <span className={`font-black text-sm sm:text-base ${item.color}`}>
                      {formatNum(item.val, locale)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΛΕΓΜΑΤΟΣ 10x10 */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Ρυθμίσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2ControlLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(highlightedBlocks, locale)} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  step={1}
                  value={highlightedBlocks}
                  onChange={(e) => setHighlightedBlocks(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.lab2StepMin}</span>
                  <span>{t.lab2StepMid}</span>
                  <span>{t.lab2StepMax}</span>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5 text-xs sm:text-sm font-medium">
                <div className="text-emerald-950 font-bold">
                  {t.lab2AreaHeading}
                </div>
                <div className="font-mono text-base font-black text-emerald-800 flex items-center flex-wrap gap-1">
                  <span>{formatNum(highlightedBlocks, locale)} dm² ＝</span>
                  <MathFraction num={formatNum(highlightedBlocks, locale)} den="100" />
                  <span>m² ＝ {formatNum(highlightedBlocks / 100, locale)} m²</span>
                </div>
                <p className="text-slate-600 text-[11px] pt-1 border-t border-emerald-200 flex items-center flex-wrap gap-1">
                  <span>{t.lab2FractionTextPre}</span>
                  <MathFraction num="1" den="100" />
                  <span>{t.lab2FractionTextPost}</span>
                </p>
              </div>
            </div>

            {/* SVG Πλέγμα 10x10 (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[340px] p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 260 260"
                className="w-full max-w-[260px] h-auto select-none"
              >
                {/* 100 τετραγωνάκια 24x24 px με κενό 2px */}
                {Array.from({ length: 100 }).map((_, idx) => {
                  const row = Math.floor(idx / 10);
                  const col = idx % 10;
                  const isHighlighted = idx < highlightedBlocks;

                  return (
                    <rect
                      key={idx}
                      x={col * 26}
                      y={row * 26}
                      width={24}
                      height={24}
                      rx={3}
                      fill={isHighlighted ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}
                      stroke={isHighlighted ? '#0284c7' : 'rgba(255, 255, 255, 0.15)'}
                      strokeWidth={1}
                      className="transition-colors duration-150"
                    />
                  );
                })}
              </svg>
              <div className="mt-3 text-center text-xs text-slate-400 font-mono">
                {t.lab2SvgCaption}
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  {toCleanUppercase(t.prob1Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Category}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1P1}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob1DataHeader)}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataKitchen}</span> 15 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataTile}</span> 600 cm²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataRelation}</span> {t.prob1DataRelationVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeader}</span>
                  <div>
                    <strong>{t.prob1Step1Label}</strong> {t.prob1Step1Text}
                  </div>
                  <div>
                    <strong>{t.prob1Step2Label}</strong> {t.prob1Step2Text}
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
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  {toCleanUppercase(t.prob2Badge)}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Category}</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2P1}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob2DataHeader)}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataArea}</span> {formatNum(12500, locale)} m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataStremma}</span> {t.prob2DataStremmaVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataPrice}</span> {t.prob2DataPriceVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeader}</span>
                  <div>
                    <strong>{t.prob2Step1Label}</strong> {t.prob2Step1Text}
                  </div>
                  <div>
                    <strong>{t.prob2Step2Label}</strong> {t.prob2Step2Text}
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
                  <strong>{t.alertItem1Strong}</strong> {t.alertItem1Text}
                </li>
                <li>
                  <strong>{t.alertItem2Strong}</strong> {t.alertItem2Text}
                </li>
                <li>
                  <strong>{t.alertItem3Strong}</strong> {t.alertItem3Text}
                </li>
                <li>
                  <strong>{t.alertItem4Strong}</strong> {t.alertItem4Text}
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.footerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.footerDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/72-embadon-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.footerButton)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
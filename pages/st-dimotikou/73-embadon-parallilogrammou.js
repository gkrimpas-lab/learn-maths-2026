// pages/st-dimotikou/73-embadon-parallilogrammou.js
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
    pageTitle: "Εμβαδόν Παραλληλογράμμου & Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν παραλληλογράμμου (Ε ＝ β · υ), τη μετατροπή του σε ορθογώνιο και τις μεταβάσεις ανάμεσα στις μονάδες επιφάνειας.",
    backText: "ΣΤ' Δημοτικού",
    actionButtonText: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 73 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Εμβαδόν Παραλληλογράμμου • Βάση, Ύψος & Μονάδες Επιφάνειας",
    heroDesc: "Ανακαλύπτουμε πώς υπολογίζεται το εμβαδόν οποιουδήποτε παραλληλογράμμου με τον τύπο Ε ＝ β · υ, βλέπουμε ζωντανά γιατί ένα πλάγιο παραλληλόγραμμο ισοδυναμεί ακριβώς με ένα ορθογώνιο, και εξασκούμαστε στις μετατροπές ανάμεσα στις μονάδες μέτρησης επιφάνειας (m², dm², cm², mm²).",
    heroSubbadge: "Θεωρία, Οπτική Απόδειξη Μετατροπής σε Ορθογώνιο, Μονάδες Επιφάνειας & SVG",
    heroTryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Το Εμβαδόν Παραλληλογράμμου σε 4 Βήματα",
    stepsSectionSubtitle: "Από τον θεμελιώδη τύπο μέχρι τη σωστή επιλογή ύψους και τις μεταβάσεις μονάδων.",

    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Ο Τύπος",
    step1Title: "Πώς Βρίσκουμε το Εμβαδόν;",
    step1P1: "Το εμβαδόν κάθε παραλληλογράμμου ισούται με το γινόμενο του μήκους μιας βάσης του επί το αντίστοιχο ύψος:",
    step1FormulaText: "Εμβαδόν ＝ Βάση · Ύψος",
    step1FormulaSym: "Ε ＝ β · υ",
    step1BaseDesc: "• Βάση (β): Οποιαδήποτε από τις πλευρές του παραλληλογράμμου.",
    step1HeightDesc: "• Ύψος (υ): Το κάθετο ευθύγραμμο τμήμα ανάμεσα στη βάση και την απέναντι παράλληλη πλευρά (όχι η πλάγια πλευρά!).",
    step1Tip: "💡 Προσοχή: Το ύψος σχηματίζει πάντοτε ορθή γωνία (90°) με τη βάση!",

    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Γεωμετρική Απόδειξη",
    step2Title: "Γιατί Ισχύει ο Τύπος Ε ＝ β · υ;",
    step2P1: "Αν φέρουμε το ύψος από την πάνω αριστερή κορυφή, σχηματίζεται ένα ορθογώνιο τρίγωνο:",
    step2Step1: "1. «Κόβουμε» νοερά αυτό το τρίγωνο που εξέχει στα αριστερά.",
    step2Step2: "2. Το μετακινούμε και το «κολλάμε» στο κενό της δεξιάς πλευράς.",
    step2Conclusion: "Το πλάγιο παραλληλόγραμμο μετατρέπεται ακριβώς σε ένα ορθογώνιο με μήκος ίσο με τη βάση (β) και πλάτος ίσο με το ύψος (υ)!",
    step2Tip: "⚡ Επειδή το εμβαδόν του ορθογωνίου είναι μήκος · πλάτος, στο παραλληλόγραμμο είναι β · υ!",

    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Μονάδες Μέτρησης",
    step3Title: "Μονάδες Επιφάνειας & Μεταβάσεις",
    step3P1: "Το εμβαδόν μετριέται πάντοτε σε τετραγωνικές μονάδες:",
    step3Unit1: "1 m² ＝ 100 dm² ＝ 10.000 cm²",
    step3Unit2: "1 dm² ＝ 100 cm² ＝ 10.000 mm²",
    step3Unit3: "1 cm² ＝ 100 mm²",
    step3Unit4: "1 Στρέμμα ＝ 1.000 m²",
    step3Rule: "Πριν πολλαπλασιάσουμε, η βάση και το ύψος πρέπει να είναι εκφρασμένα στην ίδια μονάδα μήκους!",
    step3Tip: "🎯 Αν η βάση είναι σε m και το ύψος σε cm, μετατρέπουμε πρώτα και τα δύο σε cm (ή σε m)!",

    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Δύο Ύψη",
    step4Title: "Κάθε Βάση Έχει το Ύψος της!",
    step4P1: "Κάθε παραλληλόγραμμο έχει 2 ζεύγη παράλληλων πλευρών, άρα και 2 διαφορετικά ύψη:",
    step4Height1: "• Ε ＝ β₁ · υ₁ (αν πάρουμε ως βάση την οριζόντια πλευρά).",
    step4Height2: "• Ε ＝ β₂ · υ₂ (αν πάρουμε ως βάση την πλάγια πλευρά).",
    step4Equality: "Το εμβαδόν είναι το ίδιο, άρα: β₁ · υ₁ ＝ β₂ · υ₂!",
    step4Tip: "🚀 Στη μεγαλύτερη πλευρά αντιστοιχεί πάντοτε το μικρότερο ύψος, και αντίστροφα!",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Πώς το Πλάγιο Παραλληλόγραμμο Μετατρέπεται σε Ορθογώνιο;",
    lab1Subtitle: "Άλλαξε την κλίση του παραλληλογράμμου και σύρε την μπάρα αναδίπλωσης για να δεις πώς το αριστερό ορθογώνιο τρίγωνο κουμπώνει τέλεια στα δεξιά:",
    lab1Slider1Label: "1. ΜΕΤΑΚΙΝΗΣΗ ΤΡΙΓΩΝΟΥ:",
    lab1StateOpen: "0% (Πλάγιο)",
    lab1StateMoving: "50% (Ολίσθηση)",
    lab1StateRect: "100% (Ορθογώνιο)",
    lab1Slider2Label: "2. ΚΛΙΣΗ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟΥ:",
    lab1SlantLow: "Μικρή κλίση",
    lab1SlantMid: "Μεσαία",
    lab1SlantHigh: "Έντονη κλίση",
    lab1ExpInitial: "🔷 Πλάγιο Παραλληλόγραμμο: Βάση (β) και κάθετο ύψος (υ).",
    lab1ExpMoving: "🔄 Το αριστερό τρίγωνο αποκόπτεται και ολισθαίνει κατά μήκος της βάσης...",
    lab1ExpFinal: "🟩 Τέλειο Ορθογώνιο: Μήκος ίσο με τη βάση (β) και πλάτος ίσο με το ύψος (υ)!",
    lab1HeightText: "Κάθετο Ύψος (υ):",
    lab1HeightDesc: "Σταθερό 90 px (ορθή γωνία 90°)",
    lab1SlantText: "Πλάγια Πλευρά:",
    lab1SlantDesc: "μεγαλύτερη από το ύψος!",
    lab1SlantSideLabel: "πλάγια πλευρά",
    lab1BaseLabel: "Βάση (β) ＝ 160 px",
    lab1SvgCaption: "Το τρίγωνο που περισσεύει αριστερά μεταφέρεται ακριβώς δεξιά και μετατρέπει το παραλληλόγραμμο σε ορθογώνιο με εμβαδόν β · υ.",

    lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ & ΜΟΝΑΔΕΣ",
    lab2Title: "Υπολογισμός Εμβαδού & Αυτόματη Μετατροπή Μονάδων",
    lab2Subtitle: "Άλλαξε τη βάση και το ύψος για να υπολογίσεις το εμβαδόν σε cm² και δες πώς μετατρέπεται αυτόματα σε mm², dm² και m²:",
    lab2BaseLabel: "ΜΗΚΟΣ ΒΑΣΗΣ (β):",
    lab2HeightLabel: "ΥΨΟΣ (υ):",
    lab2CalculationBox: "Ε ＝ β · υ ＝",
    lab2TableTitle: "ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΛΛΕΣ ΜΟΝΑΔΕΣ ΕΠΙΦΑΝΕΙΑΣ",
    lab2InCm2: "Σε cm² (Βάση υπολογισμού):",
    lab2InMm2: "Σε mm² (· 100):",
    lab2InDm2: "Σε dm² (: 100):",
    lab2InM2: "Σε m² (: 10.000):",
    lab2Tip: "💡 Κάθε σκαλοπάτι προς τα πάνω διαιρεί με το 100, κάθε σκαλοπάτι προς τα κάτω πολλαπλασιάζει με το 100.",

    problemsTitle: "Λυμένα Προβλήματα με Εμβαδόν Παραλληλογράμμου",
    problemsSubtitle: "Εφαρμογές του τύπου Ε ＝ β · υ και των μετατροπών μονάδων σε ρεαλιστικά σενάρια.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΠΑΡΚΕΤΟ ΟΙΚΟΠΕΔΟ",
    prob1Category: "Ε ＝ β · υ",
    prob1Title: "Υπολογισμός Εμβαδού Παραλληλόγραμμου Οικοπέδου",
    prob1P1: "Ένα οικόπεδο έχει σχήμα παραλληλογράμμου με μήκος βάσης 35 m. Η κάθετη απόσταση ανάμεσα στη βάση και την απέναντι πλευρά (το ύψος) είναι 18 m. Η πλάγια πλευρά του οικοπέδου είναι 22 m. Ποιο είναι το εμβαδόν του οικοπέδου;",
    prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
    prob1DataBase: "Βάση (β)",
    prob1DataHeight: "Ύψος (υ)",
    prob1DataSlant: "Πλάγια πλευρά",
    prob1DataSlantVal: "22 m (περιττή)",
    prob1StepsHeader: "Βήματα Επίλυσης:",
    prob1Step1: "Για το εμβαδόν χρειαζόμαστε μόνο τη βάση και το αντίστοιχο ύψος (η πλάγια πλευρά των 22 m δεν χρειάζεται στον υπολογισμό του εμβαδού).",
    prob1Step2Label: "Εμβαδόν:",
    prob1Step2Text: "Ε ＝ β · υ ＝ 35 · 18 ＝ 630 m².",
    prob1Tip: "💡 Μην παρασύρεστε από την πλάγια πλευρά! Στον τύπο του εμβαδού χρησιμοποιούμε πάντοτε το κάθετο ύψος.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΥΡΕΣΗ ΥΨΟΥΣ & ΜΕΤΑΤΡΟΠΗ",
    prob2Category: "υ ＝ Ε : β",
    prob2Title: "Εύρεση του Ύψους όταν Γνωρίζουμε το Εμβαδόν",
    prob2P1: "Μια μεταλλική πλάκα σε σχήμα παραλληλογράμμου έχει εμβαδόν 18 dm². Αν η βάση της είναι 60 cm, πόσα εκατοστόμετρα (cm) είναι το αντίστοιχο ύψος της πλάκας;",
    prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
    prob2DataArea: "Εμβαδόν (Ε)",
    prob2DataAreaVal: "18 dm²",
    prob2DataBase: "Βάση (β)",
    prob2DataBaseVal: "60 cm",
    prob2DataRelation: "Σχέση dm²/cm²",
    prob2DataRelationVal: "1 dm² ＝ 100 cm²",
    prob2StepsHeader: "Βήματα Επίλυσης:",
    prob2Step1Label: "Μετατροπή εμβαδού σε cm²:",
    prob2Step1Text: "18 · 100 ＝ 1.800 cm².",
    prob2Step2Label: "Υπολογισμός ύψους:",
    prob2Step2Text: "υ ＝ Ε : β ＝ 1.800 : 60 ＝ 30 cm.",
    prob2Tip: "⚡ Επαλήθευση: Ε ＝ β · υ ＝ 60 cm · 30 cm ＝ 1.800 cm² ＝ 18 dm²!",

    alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
    alertItem1Strong: "Μην μπερδεύετε την πλάγια πλευρά με το ύψος:",
    alertItem1Text: "Στο παραλληλόγραμμο η πλάγια πλευρά είναι πάντοτε μεγαλύτερη από το κάθετο ύψος! Αν πολλαπλασιάσετε τις δύο πλευρές (όπως στο ορθογώνιο), το αποτέλεσμα θα είναι λάθος.",
    alertItem2Strong: "Πάντα στην ίδια μονάδα μέτρησης:",
    alertItem2Text: "Αν η βάση σας δίνεται σε μέτρα (m) και το ύψος σε εκατοστά (cm), πρέπει οπωσδήποτε να τα μετατρέψετε στην ίδια μονάδα πριν κάνετε τον πολλαπλασιασμό.",
    alertItem3Strong: "Το ύψος μπορεί να «πέφτει» και έξω από το σχήμα:",
    alertItem3Text: "Σε ένα πολύ πλάγιο παραλληλόγραμμο, η κάθετη γραμμή του ύψους μπορεί να συναντήσει την προέκταση της βάσης έξω από το σχήμα. Αυτό είναι απολύτως φυσιολογικό!",
    alertItem4Strong: "Αν γνωρίζετε το εμβαδόν:",
    alertItem4Text: "Για να βρείτε τη βάση διαιρείτε: β ＝ Ε : υ. Για να βρείτε το ύψος διαιρείτε: υ ＝ Ε : β.",

    footerTitle: "Ώρα για Εξάσκηση στο Εμβαδόν Παραλληλογράμμου!",
    footerDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς βάσης, ύψους, εμβαδού και μετατροπές μονάδων επιφάνειας για τη ΣΤ' Δημοτικού.",
    footerButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Area of a Parallelogram & Units of Measure - 6th Grade Math | LearnMaths.gr",
    pageDesc: "Learn how to calculate the area of a parallelogram (A ＝ b · h), its decomposition into a rectangle, and conversions between area units.",
    backText: "6th Grade",
    actionButtonText: "🎯 Exercises",
    chapterBadge: "CHAPTER 73 • 6TH GRADE",
    heroTitle: "Area of a Parallelogram • Base, Height & Area Units",
    heroDesc: "Discover how to calculate the area of any parallelogram using the formula A ＝ b · h, watch how a slanted parallelogram transforms into a rectangle, and master area conversions across m², dm², cm², and mm².",
    heroSubbadge: "Theory, Visual Proof of Rectangular Transformation, Area Units & SVG",
    heroTryExercises: "Try the Exercises",

    stepsSectionTitle: "Area of a Parallelogram in 4 Steps",
    stepsSectionSubtitle: "From the fundamental formula to choosing the corresponding height and unit conversions.",

    step1Badge: "STEP 1",
    step1Category: "The Formula",
    step1Title: "How Do We Calculate Area?",
    step1P1: "The area of any parallelogram equals the product of the length of any base multiplied by its corresponding perpendicular height:",
    step1FormulaText: "Area ＝ Base · Height",
    step1FormulaSym: "A ＝ b · h",
    step1BaseDesc: "• Base (b): Any of the sides of the parallelogram.",
    step1HeightDesc: "• Height (h): The perpendicular segment between the base and the opposite parallel side (not the slanted side!).",
    step1Tip: "💡 Attention: The height always forms a right angle (90°) with the chosen base!",

    step2Badge: "STEP 2",
    step2Category: "Geometric Proof",
    step2Title: "Why Does the Formula A ＝ b · h Hold?",
    step2P1: "Dropping a perpendicular height from the top-left vertex creates a right-angled triangle:",
    step2Step1: "1. We cut this triangular piece off the left side.",
    step2Step2: "2. We translate and attach it to the open gap on the right side.",
    step2Conclusion: "The slanted parallelogram transforms into an equivalent rectangle with length equal to base (b) and width equal to height (h)!",
    step2Tip: "⚡ Since the area of a rectangle is length · width, for a parallelogram it is strictly b · h!",

    step3Badge: "STEP 3",
    step3Category: "Units of Measure",
    step3Title: "Area Units & Conversions",
    step3P1: "Surface area is always measured in square units:",
    step3Unit1: "1 m² ＝ 100 dm² ＝ 10,000 cm²",
    step3Unit2: "1 dm² ＝ 100 cm² ＝ 10,000 mm²",
    step3Unit3: "1 cm² ＝ 100 mm²",
    step3Unit4: "1 Stremma (decare) ＝ 1,000 m²",
    step3Rule: "Before multiplying, both base and height must be expressed in the exact same unit of length!",
    step3Tip: "🎯 If the base is in meters and the height in centimeters, convert both to centimeters (or both to meters) first!",

    step4Badge: "STEP 4",
    step4Category: "Two Heights",
    step4Title: "Each Base Has Its Corresponding Height!",
    step4P1: "Every parallelogram has 2 pairs of parallel sides, and therefore 2 distinct corresponding heights:",
    step4Height1: "• A ＝ b₁ · h₁ (using the horizontal side as base).",
    step4Height2: "• A ＝ b₂ · h₂ (using the slanted side as base).",
    step4Equality: "The area remains identical, so: b₁ · h₁ ＝ b₂ · h₂!",
    step4Tip: "🚀 The longer side always corresponds to the shorter perpendicular height, and vice versa!",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "How Does a Parallelogram Turn into a Rectangle?",
    lab1Subtitle: "Adjust the slant angle and drag the slider to watch the left right-angled triangle slide and fit into the right gap:",
    lab1Slider1Label: "1. TRIANGLE TRANSLATION:",
    lab1StateOpen: "0% (Slanted)",
    lab1StateMoving: "50% (Sliding)",
    lab1StateRect: "100% (Rectangle)",
    lab1Slider2Label: "2. PARALLELOGRAM SLANT:",
    lab1SlantLow: "Mild slant",
    lab1SlantMid: "Medium",
    lab1SlantHigh: "Steep slant",
    lab1ExpInitial: "🔷 Slanted Parallelogram: Base (b) and perpendicular height (h).",
    lab1ExpMoving: "🔄 The left triangle is cut and slides along the base...",
    lab1ExpFinal: "🟩 Perfect Rectangle: Length equals base (b) and width equals height (h)!",
    lab1HeightText: "Perpendicular Height (h):",
    lab1HeightDesc: "Constant 90 px (90° right angle)",
    lab1SlantText: "Slanted Side:",
    lab1SlantDesc: "always longer than the height!",
    lab1SlantSideLabel: "slanted side",
    lab1BaseLabel: "Base (b) ＝ 160 px",
    lab1SvgCaption: "The leftover triangle on the left slides to the right, turning the parallelogram into a rectangle with area b · h.",

    lab2Badge: "📐 INTERACTIVE LAB 2: CALCULATOR & UNITS",
    lab2Title: "Area Calculator & Instant Unit Conversion",
    lab2Subtitle: "Change base and height to compute area in cm² and observe automatic conversion into mm², dm², and m²:",
    lab2BaseLabel: "BASE LENGTH (b):",
    lab2HeightLabel: "HEIGHT (h):",
    lab2CalculationBox: "A ＝ b · h ＝",
    lab2TableTitle: "CONVERSION TO OTHER AREA UNITS",
    lab2InCm2: "In cm² (Calculation base):",
    lab2InMm2: "In mm² (· 100):",
    lab2InDm2: "In dm² (: 100):",
    lab2InM2: "In m² (: 10,000):",
    lab2Tip: "💡 Each level upward divides by 100, while each level downward multiplies by 100.",

    problemsTitle: "Solved Parallelogram Area Problems",
    problemsSubtitle: "Direct applications of formula A ＝ b · h and unit conversions to practical situations.",

    prob1Badge: "PROBLEM 1: LAND LOT",
    prob1Category: "A ＝ b · h",
    prob1Title: "Calculating the Area of a Parallelogram-Shaped Lot",
    prob1P1: "A land lot has the shape of a parallelogram with a base length of 35 m. The perpendicular distance between the base and the opposite side (height) is 18 m. The slanted side measures 22 m. What is the area of the lot?",
    prob1DataHeader: "GIVEN DATA",
    prob1DataBase: "Base (b)",
    prob1DataHeight: "Height (h)",
    prob1DataSlant: "Slanted side",
    prob1DataSlantVal: "22 m (unneeded)",
    prob1StepsHeader: "Solution Steps:",
    prob1Step1: "To calculate area we require only the base and its perpendicular height (the slanted side of 22 m is unneeded for area).",
    prob1Step2Label: "Area:",
    prob1Step2Text: "A ＝ b · h ＝ 35 · 18 ＝ 630 m².",
    prob1Tip: "💡 Do not be misled by the slanted side! The area formula strictly uses the perpendicular height.",

    prob2Badge: "PROBLEM 2: FINDING HEIGHT & CONVERSION",
    prob2Category: "h ＝ A : b",
    prob2Title: "Finding Height When Area Is Known",
    prob2P1: "A metal plate in the shape of a parallelogram has an area of 18 dm². If its base is 60 cm, what is the corresponding height in centimeters (cm)?",
    prob2DataHeader: "CALCULATION METRICS",
    prob2DataArea: "Area (A)",
    prob2DataAreaVal: "18 dm²",
    prob2DataBase: "Base (b)",
    prob2DataBaseVal: "60 cm",
    prob2DataRelation: "dm² to cm² ratio",
    prob2DataRelationVal: "1 dm² ＝ 100 cm²",
    prob2StepsHeader: "Solution Steps:",
    prob2Step1Label: "Convert area to cm²:",
    prob2Step1Text: "18 · 100 ＝ 1,800 cm².",
    prob2Step2Label: "Compute height:",
    prob2Step2Text: "h ＝ A : b ＝ 1,800 : 60 ＝ 30 cm.",
    prob2Tip: "⚡ Verification: A ＝ b · h ＝ 60 cm · 30 cm ＝ 1,800 cm² ＝ 18 dm²!",

    alertTitle: "Caution / Common Misconceptions to Avoid",
    alertItem1Strong: "Do not confuse the slanted side with the height:",
    alertItem1Text: "In a parallelogram the slanted side is strictly longer than the perpendicular height! Multiplying the two side lengths together (as in a rectangle) yields an incorrect result.",
    alertItem2Strong: "Always convert to identical measurement units:",
    alertItem2Text: "If base is given in meters (m) and height in centimeters (cm), convert both to the same unit before performing multiplication.",
    alertItem3Strong: "Height can fall outside the shape:",
    alertItem3Text: "In an obtuse or heavily slanted parallelogram, the perpendicular height may meet the extension of the base outside the figure. This is completely standard!",
    alertItem4Strong: "When the area is known:",
    alertItem4Text: "To find base divide: b ＝ A : h. To find height divide: h ＝ A : b.",

    footerTitle: "Time to Practice Parallelogram Area!",
    footerDesc: "Test your skills with 12 dynamic interactive exercises on base, height, area calculations, and unit conversions for 6th Grade.",
    footerButton: "Start Exercises"
  }
};

export default function EmbadonParallilogrammouTheoriaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστική Μετακίνηση Τριγώνου & Ρύθμιση Κλίσης
  const [cutProgress, setCutProgress] = useState(0); // 0% (πλάγιο) έως 100% (ορθογώνιο)
  const [slantWidth, setSlantWidth] = useState(55); // Κλίση σε pixels (20px έως 85px)

  // Σταθερές διαστάσεις εργαστηρίου 1 (SVG)
  const baseW = 160; // Βάση β = 160px
  const heightH = 90; // Κάθετο ύψος υ = 90px
  const originX = 65;
  const originY = 55;

  // Μήκος πλάγιας πλευράς (Πυθαγόρειο)
  const slantSideLen = useMemo(() => {
    return Math.sqrt(slantWidth * slantWidth + heightH * heightH);
  }, [slantWidth, heightH]);

  // Ολίσθηση του αποκομμένου τριγώνου κατά μήκος της βάσης baseW
  const shiftX = (cutProgress / 100) * baseW;

  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού & Μετατροπέας Μονάδων
  const [calcBase, setCalcBase] = useState(8); // σε cm
  const [calcHeight, setCalcHeight] = useState(5); // σε cm

  const areaCm2 = useMemo(() => calcBase * calcHeight, [calcBase, calcHeight]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/73-embadon-parallilogrammou-ask"
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
              href="/st-dimotikou/73-embadon-parallilogrammou-ask"
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-base sm:text-lg">
                    {t.step1FormulaText}
                  </div>
                  <div className="text-slate-700 font-bold">
                    {t.step1FormulaSym}
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans text-left pt-1 space-y-1">
                    <p>{t.step1BaseDesc}</p>
                    <p>{t.step1HeightDesc}</p>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>{t.step2Step1}</div>
                  <div>{t.step2Step2}</div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    {t.step2Conclusion}
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3P1}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-indigo-950 font-bold">{t.step3Unit1}</div>
                  <div>{t.step3Unit2}</div>
                  <div>{t.step3Unit3}</div>
                  <div className="text-purple-950 font-bold">{t.step3Unit4}</div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    {t.step3Rule}
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
                  <div>{t.step4Height1}</div>
                  <div>{t.step4Height2}</div>
                  <div className="text-emerald-900 font-bold text-xs pt-1 border-t border-slate-200">
                    {t.step4Equality}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΠΡΑΓΜΑΤΙΚΟ ΠΛΑΓΙΟ ΠΑΡΑΛΛΗΛΟΓΡΑΜΜΟ & ΚΛΙΣΗ (SVG) */}
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

            {/* Sliders: Μετακίνηση & Κλίση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Slider 1: Μετακίνηση Τριγώνου */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1Slider1Label)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(cutProgress, locale)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={cutProgress}
                  onChange={(e) => setCutProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.lab1StateOpen}</span>
                  <span>{t.lab1StateMoving}</span>
                  <span>{t.lab1StateRect}</span>
                </div>
              </div>

              {/* Slider 2: Κλίση Παραλληλογράμμου */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1Slider2Label)}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(slantWidth, locale)} px
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={85}
                  step={1}
                  value={slantWidth}
                  onChange={(e) => setSlantWidth(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.lab1SlantLow}</span>
                  <span>{t.lab1SlantMid}</span>
                  <span>{t.lab1SlantHigh}</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {cutProgress === 0 && t.lab1ExpInitial}
                  {cutProgress > 0 && cutProgress < 100 && t.lab1ExpMoving}
                  {cutProgress === 100 && t.lab1ExpFinal}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>
                    <strong>{t.lab1HeightText}</strong> {t.lab1HeightDesc}
                  </div>
                  <div>
                    <strong>{t.lab1SlantText}</strong> {formatNum(Math.round(slantSideLen), locale)} px ({t.lab1SlantDesc})
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[340px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 220"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* 1. Σταθερό τμήμα του παραλληλογράμμου (γαλάζιο τραπέζιο) */}
                <polygon
                  points={`
                    ${originX + slantWidth},${originY} 
                    ${originX + slantWidth + baseW},${originY} 
                    ${originX + baseW},${originY + heightH} 
                    ${originX + slantWidth},${originY + heightH}
                  `}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Κινούμενο ορθογώνιο τρίγωνο (μωβ) */}
                <polygon
                  points={`
                    ${originX + shiftX},${originY + heightH} 
                    ${originX + slantWidth + shiftX},${originY + heightH} 
                    ${originX + slantWidth + shiftX},${originY}
                  `}
                  fill={cutProgress === 100 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(168, 85, 247, 0.35)'}
                  stroke={cutProgress === 100 ? '#34d399' : '#c084fc'}
                  strokeWidth="2.5"
                  strokeDasharray={cutProgress > 0 && cutProgress < 100 ? '4 3' : 'none'}
                />

                {/* 3. Κατακόρυφο Ύψος (υ) - Κίτρινη διακεκομμένη γραμμή */}
                <line
                  x1={originX + slantWidth}
                  y1={originY}
                  x2={originX + slantWidth}
                  y2={originY + heightH}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* Σύμβολο ορθής γωνίας (90°) */}
                <rect
                  x={originX + slantWidth}
                  y={originY + heightH - 12}
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle
                  cx={originX + slantWidth + 6}
                  cy={originY + heightH - 6}
                  r="1.5"
                  fill="#f59e0b"
                />

                {/* Ετικέτα Ύψους (υ) */}
                <text
                  x={originX + slantWidth - 8}
                  y={originY + heightH / 2 + 4}
                  fill="#f59e0b"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="end"
                >
                  {locale === 'en' ? 'h' : 'υ'}
                </text>

                {/* Ετικέτα Πλάγιας Πλευράς */}
                {cutProgress === 0 && (
                  <text
                    x={originX + slantWidth / 2 - 14}
                    y={originY + heightH / 2}
                    fill="#a855f7"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {t.lab1SlantSideLabel}
                  </text>
                )}

                {/* Ετικέτα Βάσης (β) στο κάτω μέρος */}
                <line
                  x1={originX + (cutProgress === 100 ? slantWidth : 0)}
                  y1={originY + heightH + 20}
                  x2={originX + baseW + (cutProgress === 100 ? slantWidth : 0)}
                  y2={originY + heightH + 20}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                <text
                  x={originX + baseW / 2 + (cutProgress === 100 ? slantWidth : 0)}
                  y={originY + heightH + 36}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="middle"
                >
                  {locale === 'en' ? `Base (b) ＝ ${baseW} px` : `Βάση (β) ＝ ${baseW} px`}
                </text>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {t.lab1SvgCaption}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΟΥ & ΜΕΤΑΤΡΟΠΕΑΣ ΜΟΝΑΔΩΝ */}
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

            {/* Sliders Βάσης και Ύψους (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2BaseLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(calcBase, locale)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={calcBase}
                  onChange={(e) => setCalcBase(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2HeightLabel)}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(calcHeight, locale)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono">
                {t.lab2CalculationBox} {formatNum(calcBase, locale)} cm · {formatNum(calcHeight, locale)} cm ＝ <strong>{formatNum(areaCm2, locale)} cm²</strong>
              </div>
            </div>

            {/* Αποτελέσματα σε όλες τις Μονάδες (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {toCleanUppercase(t.lab2TableTitle)}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{t.lab2InCm2}</span>
                  <span className="text-emerald-400 font-black text-lg">{formatNum(areaCm2, locale)} cm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{t.lab2InMm2}</span>
                  <span className="text-sky-400 font-black text-lg">{formatNum(areaMm2, locale)} mm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{t.lab2InDm2}</span>
                  <div className="flex items-center flex-wrap gap-1 mt-1">
                    <span className="text-amber-400 font-black text-lg">{formatNum(areaDm2, locale)} dm²</span>
                    <span className="text-xs text-slate-400 font-sans">
                      (<MathFraction num={formatNum(areaCm2, locale)} den="100" /> dm²)
                    </span>
                  </div>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{t.lab2InM2}</span>
                  <div className="flex items-center flex-wrap gap-1 mt-1">
                    <span className="text-purple-400 font-black text-lg">{formatNum(areaM2, locale)} m²</span>
                    <span className="text-xs text-slate-400 font-sans">
                      (<MathFraction num={formatNum(areaCm2, locale)} den="10.000" /> m²)
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {t.lab2Tip}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataBase}</span> 35 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataHeight}</span> 18 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataSlant}</span> {t.prob1DataSlantVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeader}</span>
                  <div className="font-sans text-slate-700 text-xs">{t.prob1Step1}</div>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataArea}</span> {t.prob2DataAreaVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataBase}</span> {t.prob2DataBaseVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataRelation}</span> {t.prob2DataRelationVal}
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
            href="/st-dimotikou/73-embadon-parallilogrammou-ask"
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
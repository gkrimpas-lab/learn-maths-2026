// pages/st-dimotikou/74-embadon-trigonou.js
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
    pageTitle: "Εμβαδόν Τριγώνου & Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν τριγώνου με τον τύπο Ε ＝ (β · υ) : 2, γιατί διαιρούμε με το 2 και πώς εφαρμόζουμε τις μετατροπές μονάδων επιφάνειας.",
    backText: "ΣΤ' Δημοτικού",
    actionButtonText: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 74 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Εμβαδόν Τριγώνου • Βάση, Ύψος & η Σχέση με το Ορθογώνιο",
    heroDesc: "Ανακαλύπτουμε πώς υπολογίζεται το εμβαδόν κάθε τριγώνου με τον τύπο Ε ＝ (β · υ) : 2, βλέπουμε ζωντανά πώς δύο ίδια τρίγωνα σχηματίζουν ένα παραλληλόγραμμο και έπειτα μετατρέπονται σε ορθογώνιο, αποδεικνύοντας γιατί το τρίγωνο είναι ακριβώς το μισό του!",
    heroSubbadge: "Θεωρία, Απόδειξη 2 Σταδίων (Τρίγωνο ➔ Παραλληλόγραμμο ➔ Ορθογώνιο) & SVG",
    heroTryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Το Εμβαδόν Τριγώνου σε 4 Βήματα",
    stepsSectionSubtitle: "Από τον βασικό τύπο μέχρι τη θέση του ύψους και το αντίστροφο πρόβλημα.",

    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Ο Τύπος",
    step1Title: "Πώς Υπολογίζουμε το Εμβαδόν;",
    step1P1: "Το εμβαδόν κάθε τριγώνου ισούται με το μισό του γινομένου της βάσης του επί το αντίστοιχο ύψος:",
    step1FormulaText: "Εμβαδόν ＝ (Βάση · Ύψος) : 2",
    step1FormulaSym: "Ε ＝ (β · υ) : 2",
    step1FractionLabel: "ή σε κλασματική μορφή:",
    step1BaseDesc: "• Βάση (β): Οποιαδήποτε από τις 3 πλευρές του τριγώνου.",
    step1HeightDesc: "• Ύψος (υ): Το κάθετο ευθύγραμμο τμήμα (90°) από την απέναντι κορυφή προς τη βάση (ή την προέκτασή της).",
    step1Tip: "💡 Μην ξεχνάς ποτέ τη διαίρεση με το 2! Χωρίς το « : 2 », υπολογίζεις παραλληλόγραμμο και όχι τρίγωνο.",

    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Γεωμετρική Απόδειξη",
    step2Title: "Γιατί Διαιρούμε με το 2;",
    step2P1: "Αν πάρουμε δύο ολόιδια τρίγωνα και τα συνθέσουμε κατάλληλα:",
    step2Step1: "1. Παραλληλόγραμμο: Το 2ο αντεστραμμένο τρίγωνο κουμπώνει και σχηματίζει παραλληλόγραμμο με εμβαδόν β · υ.",
    step2Step2: "2. Ορθογώνιο: Μεταφέροντας το ακριανό τρίγωνο, το παραλληλόγραμμο γίνεται ορθογώνιο με διαστάσεις β και υ.",
    step2Conclusion: "Επομένως, το αρχικό μας τρίγωνο είναι ακριβώς το μισό αυτού του ορθογωνίου: (β · υ) : 2!",
    step2Tip: "⚡ Κάθε διαγώνιος χωρίζει ένα παραλληλόγραμμο σε 2 απολύτως ίσα τρίγωνα με το ίδιο εμβαδόν!",

    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Ειδικές Περιπτώσεις",
    step3Title: "Ορθογώνια & Αμβλυγώνια Τρίγωνα",
    step3P1: "Η θέση του ύψους εξαρτάται από τις γωνίες του τριγώνου:",
    step3Case1: "• Ορθογώνιο τρίγωνο: Οι δύο κάθετες πλευρές δρουν η μία ως βάση και η άλλη ως ύψος: Ε ＝ (α · β) : 2.",
    step3Case2: "• Οξυγώνιο τρίγωνο: Και τα 3 ύψη πέφτουν μέσα στο τρίγωνο.",
    step3Case3: "• Αμβλυγώνιο τρίγωνο: Τα 2 από τα 3 ύψη πέφτουν έξω, στην προέκταση της βάσης!",
    step3Tip: "🎯 Στο ορθογώνιο τρίγωνο δεν χρειάζεται να σχεδιάσουμε ύψος: πολλαπλασιάζουμε τις 2 κάθετες πλευρές και διαιρούμε με το 2!",

    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Αντίστροφο Πρόβλημα",
    step4Title: "Εύρεση Ύψους ή Βάσης",
    step4P1: "Αν γνωρίζουμε το εμβαδόν και ψάχνουμε τη βάση ή το ύψος, διπλασιάζουμε πρώτα το εμβαδόν:",
    step4HeightForm: "• Ύψος (υ) ＝ (2 · Ε) : β",
    step4BaseForm: "• Βάση (β) ＝ (2 · Ε) : υ",
    step4Example: "Παράδειγμα: Αν Ε ＝ 30 cm² και β ＝ 10 cm, τότε υ ＝ (2 · 30) : 10 ＝ 60 : 10 ＝ 6 cm.",
    step4Tip: "🚀 Θυμήσου: Πρώτα διπλασιάζουμε το εμβαδόν (2 · Ε) και μετά διαιρούμε με τη γνωστή διάσταση!",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Πώς το Τρίγωνο Γίνεται Παραλληλόγραμμο και Ορθογώνιο; (SVG)",
    lab1Subtitle: "Σύρε την μπάρα προόδου: Στο 50% ένα δεύτερο ανάποδο τρίγωνο κουμπώνει σχηματίζοντας παραλληλόγραμμο, και στο 100% το ακριανό τρίγωνο ολισθαίνει στα δεξιά σχηματίζοντας τέλειο ορθογώνιο!",
    lab1StageLabel: "ΣΤΑΔΙΟ ΑΝΑΔΙΑΤΑΞΗΣ:",
    lab1Stage0: "0% (1 Τρίγωνο)",
    lab1Stage50: "50% (Παραλληλόγραμμο)",
    lab1Stage100: "100% (Ορθογώνιο)",
    lab1Exp0: "🔷 Στάδιο 0: Ένα μόνο τρίγωνο με βάση β και ύψος υ.",
    lab1Exp1: "🔄 Στάδιο 1: Ένα δεύτερο πανομοιότυπο αντεστραμμένο τρίγωνο πλησιάζει...",
    lab1Exp2: "🟪 Στάδιο 2: Σχηματίστηκε παραλληλόγραμμο! Τώρα το αριστερό ορθογώνιο τρίγωνο αποκόπτεται και ολισθαίνει...",
    lab1Exp3: "🟩 Στάδιο 3: Τέλειο ορθογώνιο με μήκος β και πλάτος υ!",
    lab1RectAreaLabel: "Εμβαδόν Ορθογωνίου (2 Τρίγωνα): β · υ ＝",
    lab1TriAreaLabel: "Εμβαδόν 1 Τριγώνου: (β · υ) : 2",
    lab1BaseLabel: "Βάση (β)",
    lab1HeightSymbol: "υ",
    lab1SvgCaption: "Δύο τρίγωνα ενώνονται σε παραλληλόγραμμο και μετατρέπονται σε ορθογώνιο (β · υ). Άρα 1 τρίγωνο ＝ (β · υ) : 2.",

    lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ & ΜΟΝΑΔΕΣ",
    lab2Title: "Υπολογιστής Εμβαδού Τριγώνου & Αυτόματη Μετατροπή Μονάδων",
    lab2Subtitle: "Άλλαξε τη βάση και το ύψος σε cm για να υπολογίσεις το εμβαδόν του τριγώνου και δες πώς συγκρίνεται με το παραλληλόγραμμο:",
    lab2BaseLabel: "ΜΗΚΟΣ ΒΑΣΗΣ (β):",
    lab2HeightLabel: "ΑΝΤΙΣΤΟΙΧΟ ΥΨΟΣ (υ):",
    lab2ProductLabel: "Γινόμενο: β · υ ＝",
    lab2TriAreaHeading: "• Εμβαδόν Τριγώνου:",
    lab2TableTitle: "ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΛΛΕΣ ΜΟΝΑΔΕΣ ΕΠΙΦΑΝΕΙΑΣ",
    lab2InCm2: "Σε cm² (Βάση υπολογισμού):",
    lab2InMm2: "Σε mm² (· 100):",
    lab2InDm2: "Σε dm² (: 100):",
    lab2InM2: "Σε m² (: 10.000):",
    lab2TipPre: "💡 Το εμβαδόν του τριγώνου είναι πάντοτε ακριβώς το μισό του αντίστοιχου παραλληλογράμμου",

    problemsTitle: "Λυμένα Προβλήματα με Εμβαδόν Τριγώνου",
    problemsSubtitle: "Εφαρμογές του τύπου Ε ＝ (β · υ) : 2 σε ιστιοπλοϊκά πανιά και τριγωνικά οικόπεδα.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΙΣΤΙΟΦΟΡΟ ΠΑΝΙ",
    prob1Category: "Ορθογώνιο Τρίγωνο",
    prob1Title: "Υπολογισμός Επιφάνειας Τριγωνικού Πανιού",
    prob1P1: "Το τριγωνικό πανί ενός ιστιοπλοϊκού σκάφους έχει σχήμα ορθογωνίου τριγώνου. Οι δύο κάθετες πλευρές του είναι το κατάρτι με ύψος 12 m και η μάτσα με μήκος 5 m. Πόσα τετραγωνικά μέτρα (m²) πανιού χρειάστηκαν για την κατασκευή του;",
    prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
    prob1DataLeg1: "1η κάθετη (βάση)",
    prob1DataLeg2: "2η κάθετη (ύψος)",
    prob1DataFormula: "Τύπος",
    prob1StepsHeader: "Βήματα Επίλυσης:",
    prob1Step1: "Στο ορθογώνιο τρίγωνο οι δύο κάθετες πλευρές αποτελούν τη βάση και το αντίστοιχο ύψος.",
    prob1Step2Label: "Γινόμενο:",
    prob1Step2Text: "5 · 12 ＝ 60 m².",
    prob1Step3Label: "Εμβαδόν τριγώνου:",
    prob1Step3Text: "60 : 2 ＝ 30 m².",
    prob1Tip: "💡 Στο ορθογώνιο τρίγωνο δεν χρειάζεται να ψάχνουμε για ύψος: οι δύο κάθετες πλευρές είναι η βάση και το ύψος!",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΤΡΙΓΩΝΙΚΟ ΟΙΚΟΠΕΔΟ",
    prob2Category: "Εύρεση Ύψους",
    prob2Title: "Εύρεση Ύψους όταν Γνωρίζουμε το Εμβαδόν",
    prob2P1: "Ένα οικόπεδο έχει σχήμα τριγώνου με εμβαδόν 240 m². Αν η πρόσοψή του στο δρόμο (βάση) έχει μήκος 24 m, πόσο είναι το βάθος (το αντίστοιχο ύψος) του οικοπέδου;",
    prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
    prob2DataArea: "Εμβαδόν (Ε)",
    prob2DataBase: "Βάση (β)",
    prob2DataFormula: "Τύπος ύψους",
    prob2StepsHeader: "Βήματα Επίλυσης:",
    prob2Step1Label: "Διπλασιάζουμε το εμβαδόν:",
    prob2Step1Text: "2 · 240 ＝ 480 m² (το εμβαδόν του αντίστοιχου παραλληλογράμμου).",
    prob2Step2Label: "Υπολογισμός ύψους:",
    prob2Step2Text: "480 : 24 ＝ 20 m.",
    prob2Tip: "⚡ Επαλήθευση: Ε ＝ (β · υ) : 2 ＝ (24 · 20) : 2 ＝ 480 : 2 ＝ 240 m²!",

    alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
    alertItem1Strong: "Μην ξεχνάτε τη διαίρεση με το 2:",
    alertItem1Text: "Το πιο συχνό λάθος των μαθητών είναι να υπολογίζουν απλώς β · υ. Θυμηθείτε: το β · υ είναι το παραλληλόγραμμο. Το τρίγωνο είναι πάντα το μισό του: (β · υ) : 2.",
    alertItem2Strong: "Το ύψος δεν είναι η πλάγια πλευρά:",
    alertItem2Text: "Σε ένα σκαληνό ή ισοσκελές τρίγωνο, το ύψος είναι αυστηρά το κάθετο ευθύγραμμο τμήμα (90°) από την κορυφή προς τη βάση, όχι η πλάγια κεκλιμένη πλευρά.",
    alertItem3Strong: "Στο αμβλυγώνιο τρίγωνο το ύψος πέφτει έξω:",
    alertItem3Text: "Μην παραξενεύεστε αν το ύψος συναντά την προέκταση της βάσης έξω από το σχήμα. Μετράμε ως βάση μόνο το αρχικό τμήμα της πλευράς, όχι την προέκτασή της!",
    alertItem4Strong: "Ίδιες μονάδες μέτρησης:",
    alertItem4Text: "Αν η βάση δίνεται σε μέτρα (m) και το ύψος σε εκατοστά (cm), μετατρέπουμε απαραίτητα και τα δύο στην ίδια μονάδα πριν τις πράξεις.",

    footerTitle: "Ώρα για Εξάσκηση στο Εμβαδόν Τριγώνου!",
    footerDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς βάσης, ύψους, εμβαδού και ορθογώνια τρίγωνα για τη ΣΤ' Δημοτικού.",
    footerButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Area of a Triangle & Units of Measure - 6th Grade Math | LearnMaths.gr",
    pageDesc: "Learn how to calculate the area of a triangle with A ＝ (b · h) : 2, why we divide by 2, and how to apply surface area unit conversions.",
    backText: "6th Grade",
    actionButtonText: "🎯 Exercises",
    chapterBadge: "CHAPTER 74 • 6TH GRADE",
    heroTitle: "Area of a Triangle • Base, Height & Relation to Rectangle",
    heroDesc: "Discover how to calculate the area of any triangle using A ＝ (b · h) : 2, watch how two identical triangles form a parallelogram and then transform into a rectangle, proving why a triangle is strictly half of it!",
    heroSubbadge: "Theory, 2-Stage Proof (Triangle ➔ Parallelogram ➔ Rectangle) & SVG",
    heroTryExercises: "Try the Exercises",

    stepsSectionTitle: "Area of a Triangle in 4 Steps",
    stepsSectionSubtitle: "From the fundamental formula to height placement and solving inverse problems.",

    step1Badge: "STEP 1",
    step1Category: "The Formula",
    step1Title: "How Do We Calculate Area?",
    step1P1: "The area of any triangle equals half the product of its base multiplied by the corresponding height:",
    step1FormulaText: "Area ＝ (Base · Height) : 2",
    step1FormulaSym: "A ＝ (b · h) : 2",
    step1FractionLabel: "or in fractional form:",
    step1BaseDesc: "• Base (b): Any of the 3 sides of the triangle.",
    step1HeightDesc: "• Height (h): The perpendicular line segment (90°) dropped from the opposite vertex to the base (or its extension).",
    step1Tip: "💡 Never forget dividing by 2! Without « : 2 », you are computing the area of a parallelogram, not a triangle.",

    step2Badge: "STEP 2",
    step2Category: "Geometric Proof",
    step2Title: "Why Do We Divide by 2?",
    step2P1: "If we take two identical triangles and assemble them appropriately:",
    step2Step1: "1. Parallelogram: The 2nd inverted triangle fits and creates a parallelogram with area b · h.",
    step2Step2: "2. Rectangle: Translating the outer triangle transforms the parallelogram into a rectangle of dimensions b and h.",
    step2Conclusion: "Therefore, our initial triangle is exactly half of that rectangle: (b · h) : 2!",
    step2Tip: "⚡ Any diagonal divides a parallelogram into 2 congruent triangles of identical area!",

    step3Badge: "STEP 3",
    step3Category: "Special Cases",
    step3Title: "Right & Obtuse Triangles",
    step3P1: "The position of the height depends on the interior angles of the triangle:",
    step3Case1: "• Right triangle: The two perpendicular legs act directly as base and height: A ＝ (a · b) : 2.",
    step3Case2: "• Acute triangle: All 3 heights fall entirely inside the triangle.",
    step3Case3: "• Obtuse triangle: Two of the three heights fall outside, on the extension of the opposite base!",
    step3Tip: "🎯 In a right triangle there is no need to draw an extra height: multiply the two perpendicular legs and divide by 2!",

    step4Badge: "STEP 4",
    step4Category: "Inverse Problem",
    step4Title: "Finding Height or Base",
    step4P1: "If the area is known and we are solving for base or height, first double the area:",
    step4HeightForm: "• Height (h) ＝ (2 · A) : b",
    step4BaseForm: "• Base (b) ＝ (2 · A) : h",
    step4Example: "Example: If A ＝ 30 cm² and b ＝ 10 cm, then h ＝ (2 · 30) : 10 ＝ 60 : 10 ＝ 6 cm.",
    step4Tip: "🚀 Remember: First double the area (2 · A) and then divide by the known dimension!",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "How Does a Triangle Turn into a Parallelogram and Rectangle? (SVG)",
    lab1Subtitle: "Drag the progress slider: At 50% a second inverted triangle joins to form a parallelogram, and at 100% the end triangle translates right to form a perfect rectangle!",
    lab1StageLabel: "REARRANGEMENT PROGRESS:",
    lab1Stage0: "0% (1 Triangle)",
    lab1Stage50: "50% (Parallelogram)",
    lab1Stage100: "100% (Rectangle)",
    lab1Exp0: "🔷 Stage 0: A single triangle with base b and height h.",
    lab1Exp1: "🔄 Stage 1: A second identical inverted triangle approaches...",
    lab1Exp2: "🟪 Stage 2: Parallelogram formed! Now the left right-angled triangle is cut and translates...",
    lab1Exp3: "🟩 Stage 3: Perfect rectangle with length b and width h!",
    lab1RectAreaLabel: "Rectangle Area (2 Triangles): b · h ＝",
    lab1TriAreaLabel: "1 Triangle Area: (b · h) : 2",
    lab1BaseLabel: "Base (b)",
    lab1HeightSymbol: "h",
    lab1SvgCaption: "Two triangles unite into a parallelogram and transform into a rectangle (b · h). Thus 1 triangle ＝ (b · h) : 2.",

    lab2Badge: "📐 INTERACTIVE LAB 2: CALCULATOR & UNITS",
    lab2Title: "Triangle Area Calculator & Unit Conversion",
    lab2Subtitle: "Adjust base and height in cm to calculate triangle area and compare it with the enclosing parallelogram:",
    lab2BaseLabel: "BASE LENGTH (b):",
    lab2HeightLabel: "CORRESPONDING HEIGHT (h):",
    lab2ProductLabel: "Product: b · h ＝",
    lab2TriAreaHeading: "• Triangle Area:",
    lab2TableTitle: "CONVERSION TO OTHER AREA UNITS",
    lab2InCm2: "In cm² (Calculation base):",
    lab2InMm2: "In mm² (· 100):",
    lab2InDm2: "In dm² (: 100):",
    lab2InM2: "In m² (: 10,000):",
    lab2TipPre: "💡 The triangle area is always exactly half of the corresponding parallelogram",

    problemsTitle: "Solved Triangle Area Problems",
    problemsSubtitle: "Applications of formula A ＝ (b · h) : 2 to sailing sails and triangular land plots.",

    prob1Badge: "PROBLEM 1: SAILBOAT SAIL",
    prob1Category: "Right Triangle",
    prob1Title: "Calculating Surface Area of a Triangular Sail",
    prob1P1: "A sailboat sail has the shape of a right-angled triangle. Its two perpendicular sides are the mast with a height of 12 m and the boom with a length of 5 m. How many square meters (m²) of canvas were needed to make it?",
    prob1DataHeader: "GIVEN DATA",
    prob1DataLeg1: "1st leg (base)",
    prob1DataLeg2: "2nd leg (height)",
    prob1DataFormula: "Formula",
    prob1StepsHeader: "Solution Steps:",
    prob1Step1: "In a right triangle, the two perpendicular legs act directly as base and corresponding height.",
    prob1Step2Label: "Product:",
    prob1Step2Text: "5 · 12 ＝ 60 m².",
    prob1Step3Label: "Triangle area:",
    prob1Step3Text: "60 : 2 ＝ 30 m².",
    prob1Tip: "💡 In a right triangle, there is no need to search for a height: the two perpendicular legs are the base and height!",

    prob2Badge: "PROBLEM 2: TRIANGULAR PLOT",
    prob2Category: "Finding Height",
    prob2Title: "Finding Height When Area Is Known",
    prob2P1: "A land plot has a triangular shape with an area of 240 m². If its street frontage (base) measures 24 m, what is the depth (corresponding height) of the plot?",
    prob2DataHeader: "CALCULATION METRICS",
    prob2DataArea: "Area (A)",
    prob2DataBase: "Base (b)",
    prob2DataFormula: "Height formula",
    prob2StepsHeader: "Solution Steps:",
    prob2Step1Label: "Double the area:",
    prob2Step1Text: "2 · 240 ＝ 480 m² (the area of the corresponding parallelogram).",
    prob2Step2Label: "Compute height:",
    prob2Step2Text: "480 : 24 ＝ 20 m.",
    prob2Tip: "⚡ Verification: A ＝ (b · h) : 2 ＝ (24 · 20) : 2 ＝ 480 : 2 ＝ 240 m²!",

    alertTitle: "Caution / Common Misconceptions to Avoid",
    alertItem1Strong: "Never forget dividing by 2:",
    alertItem1Text: "The most frequent mistake is simply calculating b · h. Remember: b · h is the full parallelogram. The triangle is always half of it: (b · h) : 2.",
    alertItem2Strong: "Height is not the slanted side:",
    alertItem2Text: "In scalene or isosceles triangles, height is strictly the perpendicular segment (90°) from vertex to base, never the inclined lateral side.",
    alertItem3Strong: "In obtuse triangles the height falls outside:",
    alertItem3Text: "Do not be surprised if the height meets the extension of the base outside the shape. We measure base as only the original side length, excluding the extension!",
    alertItem4Strong: "Identical measurement units:",
    alertItem4Text: "If base is given in meters (m) and height in centimeters (cm), convert both to the same unit before performing operations.",

    footerTitle: "Time to Practice Triangle Area!",
    footerDesc: "Test your skills with 12 dynamic interactive exercises featuring base, height, area calculations, and right triangles for 6th Grade.",
    footerButton: "Start Exercises"
  }
};

export default function EmbadonTrigonouTheoriaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Απόδειξη σε 2 Στάδια (SVG)
  // -------------------------------------------------------------------------
  const [animProgress, setAnimProgress] = useState(0); // 0 έως 100

  // Γεωμετρικές διαστάσεις εργαστηρίου 1 (SVG)
  const baseW = 150;
  const heightH = 85;
  const slantX = 45;
  const originX = 65;
  const originY = 55;

  // Στάδιο 1: Προσέγγιση του 2ου αντεστραμμένου τριγώνου (0% -> 50%)
  const phase1T = Math.min(1, animProgress / 50);
  const secondTriangleOffset = (1 - phase1T) * 80;

  // Στάδιο 2: Ολίσθηση του αριστερού τριγώνου κατά μήκος της βάσης baseW (50% -> 100%)
  const phase2T = Math.max(0, (animProgress - 50) / 50);
  const triangleShiftX = phase2T * baseW;

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού & Μετατροπές Μονάδων
  // -------------------------------------------------------------------------
  const [calcBase, setCalcBase] = useState(10); // σε cm
  const [calcHeight, setCalcHeight] = useState(6); // σε cm

  const areaCm2 = useMemo(() => (calcBase * calcHeight) / 2, [calcBase, calcHeight]);
  const rectAreaCm2 = useMemo(() => calcBase * calcHeight, [calcBase, calcHeight]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/74-embadon-trigonou-ask"
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
              href="/st-dimotikou/74-embadon-trigonou-ask"
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
                  <div className="flex items-center justify-center gap-1 text-slate-700 font-bold pt-1">
                    <span className="text-xs font-sans text-slate-500">{t.step1FractionLabel}</span>
                    <span>{locale === 'en' ? 'A ＝' : 'Ε ＝'}</span>
                    <MathFraction num={locale === 'en' ? 'b · h' : 'β · υ'} den="2" />
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
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200 flex items-center flex-wrap gap-1">
                    <span>{t.step2Conclusion}</span>
                    <span>(</span>
                    <MathFraction num={locale === 'en' ? 'b · h' : 'β · υ'} den="2" />
                    <span>)</span>
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
                  <div>{t.step3Case1}</div>
                  <div>{t.step3Case2}</div>
                  <div>{t.step3Case3}</div>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-emerald-950 font-bold flex items-center flex-wrap gap-1">
                    <span>{t.step4HeightForm}</span>
                    <span className="text-xs font-sans text-slate-500">ή</span>
                    <span className="font-bold">{locale === 'en' ? 'h ＝' : 'υ ＝'}</span>
                    <MathFraction num={locale === 'en' ? '2 · A' : '2 · Ε'} den={locale === 'en' ? 'b' : 'β'} />
                  </div>
                  <div className="text-emerald-950 font-bold flex items-center flex-wrap gap-1">
                    <span>{t.step4BaseForm}</span>
                    <span className="text-xs font-sans text-slate-500">ή</span>
                    <span className="font-bold">{locale === 'en' ? 'b ＝' : 'β ＝'}</span>
                    <MathFraction num={locale === 'en' ? '2 · A' : '2 · Ε'} den={locale === 'en' ? 'h' : 'υ'} />
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    {t.step4Example}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΠΟΔΕΙΞΗ 2 ΣΤΑΔΙΩΝ (SVG) */}
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

            {/* Slider & Επεξήγηση (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1StageLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(animProgress, locale)}%
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
                  <span>{t.lab1Stage0}</span>
                  <span>{t.lab1Stage50}</span>
                  <span>{t.lab1Stage100}</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {animProgress === 0 && t.lab1Exp0}
                  {animProgress > 0 && animProgress < 50 && t.lab1Exp1}
                  {animProgress >= 50 && animProgress < 100 && t.lab1Exp2}
                  {animProgress === 100 && t.lab1Exp3}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div>
                    {t.lab1RectAreaLabel} {baseW} · {heightH} ＝ {formatNum(baseW * heightH, locale)} px
                  </div>
                  <div className="text-indigo-900 font-bold flex items-center flex-wrap gap-1">
                    <span>{t.lab1TriAreaLabel} ＝</span>
                    <MathFraction num={`${baseW} · ${heightH}`} den="2" />
                    <span>＝ {formatNum((baseW * heightH) / 2, locale)} px</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[320px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 210"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* 1. Σταθερό σώμα του 1ου τριγώνου */}
                <polygon
                  points={`
                    ${originX + slantX},${originY} 
                    ${originX + baseW},${originY + heightH} 
                    ${originX + slantX},${originY + heightH}
                  `}
                  fill="rgba(56, 189, 248, 0.3)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Κινούμενο αριστερό ορθογώνιο τρίγωνο */}
                <polygon
                  points={`
                    ${originX + triangleShiftX},${originY + heightH} 
                    ${originX + slantX + triangleShiftX},${originY + heightH} 
                    ${originX + slantX + triangleShiftX},${originY}
                  `}
                  fill={animProgress === 100 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(56, 189, 248, 0.35)'}
                  stroke={animProgress === 100 ? '#34d399' : '#38bdf8'}
                  strokeWidth="2.5"
                  strokeDasharray={animProgress > 50 && animProgress < 100 ? '4 3' : 'none'}
                />

                {/* 3. Δεύτερο αντεστραμμένο τρίγωνο (μωβ) */}
                <polygon
                  points={`
                    ${originX + slantX + secondTriangleOffset},${originY} 
                    ${originX + slantX + baseW + secondTriangleOffset},${originY} 
                    ${originX + baseW + secondTriangleOffset},${originY + heightH}
                  `}
                  fill="rgba(168, 85, 247, 0.3)"
                  stroke="#c084fc"
                  strokeWidth="2.5"
                  strokeDasharray={animProgress < 50 ? '4 3' : 'none'}
                />

                {/* 4. Κατακόρυφο Ύψος (υ) - Κίτρινη διακεκομμένη γραμμή */}
                <line
                  x1={originX + slantX}
                  y1={originY}
                  x2={originX + slantX}
                  y2={originY + heightH}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <rect
                  x={originX + slantX}
                  y={originY + heightH - 10}
                  width="10"
                  height="10"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <circle cx={originX + slantX + 5} cy={originY + heightH - 5} r="1.5" fill="#f59e0b" />
                <text
                  x={originX + slantX - 8}
                  y={originY + heightH / 2 + 4}
                  fill="#f59e0b"
                  fontSize="12"
                  fontWeight="black"
                  textAnchor="end"
                >
                  {locale === 'en' ? 'h' : 'υ'}
                </text>

                {/* Ετικέτα Βάσης (β) */}
                <line
                  x1={originX + (animProgress === 100 ? slantX : 0)}
                  y1={originY + heightH + 18}
                  x2={originX + baseW + (animProgress === 100 ? slantX : 0)}
                  y2={originY + heightH + 18}
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                <text
                  x={originX + baseW / 2 + (animProgress === 100 ? slantX : 0)}
                  y={originY + heightH + 34}
                  fill="#ffffff"
                  fontSize="13"
                  fontWeight="black"
                  textAnchor="middle"
                >
                  {t.lab1BaseLabel}
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
                  max={30}
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
                  max={25}
                  step={1}
                  value={calcHeight}
                  onChange={(e) => setCalcHeight(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1">
                <div>
                  {t.lab2ProductLabel} {formatNum(calcBase, locale)} · {formatNum(calcHeight, locale)} ＝ {formatNum(rectAreaCm2, locale)} cm²
                </div>
                <div className="text-emerald-800 font-black text-sm flex items-center flex-wrap gap-1">
                  <span>{t.lab2TriAreaHeading}</span>
                  <MathFraction num={`${formatNum(calcBase, locale)} · ${formatNum(calcHeight, locale)}`} den="2" />
                  <span>＝ <strong>{formatNum(areaCm2, locale)} cm²</strong></span>
                </div>
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
                {t.lab2TipPre} ({formatNum(rectAreaCm2, locale)} cm²).
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataLeg1}</span> 5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataLeg2}</span> 12 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataFormula}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <MathFraction num={locale === 'en' ? 'b · h' : 'β · υ'} den="2" />
                    </span>
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
                  <div>
                    <strong>{t.prob1Step3Label}</strong> {t.prob1Step3Text}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataArea}</span> 240 m²
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataBase}</span> 24 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataFormula}</span>
                    <span className="inline-flex items-center gap-0.5">
                      <span>{locale === 'en' ? 'h ＝' : 'υ ＝'}</span>
                      <MathFraction num={locale === 'en' ? '2 · A' : '2 · Ε'} den={locale === 'en' ? 'b' : 'β'} />
                    </span>
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
            href="/st-dimotikou/74-embadon-trigonou-ask"
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
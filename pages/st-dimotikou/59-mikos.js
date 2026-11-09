// pages/st-dimotikou/59-mikos.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Ατονα ελληνικα κεφαλαια με εξαιρεση το ΣΤ'
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

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono leading-none ${className}`}>
      <span className="border-b border-current px-1.5 pb-0.5 text-center text-[0.9em] font-bold">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center text-[0.9em] font-bold">
        {den}
      </span>
    </span>
  );
}

// Μορφοποιηση αριθμου αναλογα με το locale
function formatNum(val, locale = 'el', decimals = 3) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  const loc = locale === 'en' ? 'en-US' : 'el-GR';
  const num = Number(val);
  if (Number.isInteger(num)) {
    return num.toLocaleString(loc);
  }
  return num.toLocaleString(loc, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export default function MikosTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  const t = useMemo(() => {
    return {
      el: {
        pageTitle: "Μονάδες Μέτρησης Μήκους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr",
        metaDescription: "Πλήρης θεωρία για τις μονάδες μέτρησης μήκους, τη βασική μονάδα (μέτρο), τα πολλαπλάσια και τις υποδιαιρέσεις, κανόνες μετατροπών, διαδραστικό εργαστήριο και λυμένα προβλήματα για τη ΣΤ' Δημοτικού.",
        backText: "ΣΤ' Δημοτικού",
        actionBtn: "🎯 Ασκήσεις",
        chapterBadge: "ΚΕΦΑΛΑΙΟ 59 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
        headerTitle: "Μέτρηση Μήκους & Μετατροπές Μονάδων",
        headerDesc: "Κατανοούμε τη θεμελιώδη έννοια του μήκους: Γνωρίζουμε τη βασική μονάδα (μέτρο), τα υποπολλαπλάσιά του (δεκατόμετρο, εκατοστόμετρο, χιλιοστόμετρο) και το πολλαπλάσιο (χιλιόμετρο), και μαθαίνουμε τους απαράβατους κανόνες μετατροπής με πολλαπλασιασμό και διαίρεση των δυνάμεων του 10.",
        headerSub: "Θεωρία, Κλίμακα Δεκαδικών Μετατροπών & Δυναμικός Υπολογιστής",
        tryExercises: "Δοκίμασε τις Ασκήσεις",
        roadmapTitle: "Οι Μονάδες Μήκους σε 4 Βήματα",
        roadmapDesc: "Από τη βασική μονάδα αναφοράς μέχρι τη μέθοδο ασφαλών μετατροπών χωρίς αριθμητικά λάθη.",
        step1Badge: "ΒΗΜΑ 1",
        step1Tag: "Βασική Μονάδα",
        step1Title: "Το Μέτρο (m)",
        step1Text: "Βασική μονάδα μέτρησης του μήκους στο Διεθνές Σύστημα είναι το μέτρο (m).",
        step1Bullet1: "1 m: Περίπου το άνοιγμα του ενός χεριού ενός ενήλικα ή το ύψος ενός θρανίου.",
        step1Bullet2: "Μέτρηση: Μετράμε αποστάσεις, ύψη, πλάτη και περιμέτρους σχημάτων.",
        step1Tip: "💡 Το μέτρο είναι η «βάση» από την οποία παράγονται όλες οι υπόλοιπες μονάδες μήκους.",
        step2Badge: "ΒΗΜΑ 2",
        step2Tag: "Υποδιαιρέσεις",
        step2Title: "Μικρότερες Μονάδες (Υποδιαιρέσεις)",
        step2Text: "Όταν μετράμε μικρότερα αντικείμενα χωρίζουμε το μέτρο σε 10, 100 ή 1.000 ίσα μέρη:",
        step2Sub1: "1 dm (δεκατόμετρο) ＝ 0,1 m ＝ 10 cm",
        step2Sub2: "1 cm (εκατοστόμετρο) ＝ 0,01 m ＝ 10 mm",
        step2Sub3: "1 mm (χιλιοστόμετρο) ＝ 0,001 m",
        step2Tip: "⚡ Κάθε μονάδα είναι 10 φορές μικρότερη από την αμέσως προηγούμενή της!",
        step3Badge: "ΒΗΜΑ 3",
        step3Tag: "Πολλαπλάσιο",
        step3Title: "Το Χιλιόμετρο (km)",
        step3Text: "Για μεγάλες αποστάσεις μεταξύ πόλεων, οδικών δικτύων ή χωρών χρησιμοποιούμε το χιλιόμετρο (km):",
        step3KmEq: "1 km ＝ 1.000 m",
        step3InversePrefix: "Αντίστροφα: 1 m ＝ 0,001 km (ή",
        step3InverseSuffix: "του χιλιομέτρου).",
        step3Tip: "🎯 1 km ισοδυναμεί με περίπου 10 έως 12 λεπτά άνετου περπατήματος ενός ανθρώπου.",
        step4Badge: "ΒΗΜΑ 4",
        step4Tag: "Κανόνας Μετατροπών",
        step4Title: "Ο Χρυσός Κανόνας της Σκάλας",
        step4Text: "Πώς κινούμαστε στα σκαλοπάτια των μονάδων μέτρησης:",
        step4DownTitle: "Από μεγαλύτερη σε μικρότερη (κατεβαίνω):",
        step4DownText: "Πολλαπλασιάζω με 10, 100, 1.000 (π.χ. 3 m ＝ 3 · 100 ＝ 300 cm).",
        step4UpTitle: "Από μικρότερη σε μεγαλύτερη (ανεβαίνω):",
        step4UpText: "Διαιρώ με 10, 100, 1.000 (π.χ. 450 cm ＝ 450 : 100 ＝ 4,5 m).",
        step4Tip: "🚀 Όταν κατεβαίνουμε σκαλοπάτια πολλαπλασιάζουμε, όταν ανεβαίνουμε διαιρούμε!",
        lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
        lab1Title: "Δυναμικός Μετατροπέας Μήκους & Σκάλα Υποδιαιρέσεων",
        lab1Desc: "Ρυθμίστε το μήκος σε μέτρα (m) και παρακολουθήστε πώς μετατρέπεται ταυτόχρονα σε όλες τις μονάδες του μετρικού συστήματος.",
        lab1InputLabel: "ΑΡΧΙΚΟ ΜΗΚΟΣ ΣΕ ΜΕΤΡΑ (m):",
        lab1AllUnitsTitle: "ΤΑΥΤΟΧΡΟΝΗ ΑΠΕΙΚΟΝΙΣΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ",
        unitKm: "Χιλιόμετρα (km):",
        unitMBase: "Μέτρα (m) [Βάση]:",
        unitDm: "Δεκατόμετρα (dm):",
        unitCm: "Εκατοστόμετρα (cm):",
        unitMm: "Χιλιοστόμετρα (mm):",
        calcExamplePrefix: "Παράδειγμα υπολογισμού:",
        lab2Badge: "🔍 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΕΤΡΑΓΩΝΟΥ 1 m × 1 m",
        lab2Title: "Πώς Χωρίζεται το 1 Μέτρο (1 m) στις Υποδιαιρέσεις του",
        lab2Desc: "Επιλέξτε μονάδα μέτρησης για να δείτε πώς η πλευρά του 1 m χωρίζεται σε 10 δεκατόμετρα (10 × 10), 100 εκατοστά (100 × 100) και 1.000 χιλιοστά (1.000 × 1.000):",
        tabSingleM: "1 m (Ενιαίο)",
        tab10dm: "10 dm (10 × 10)",
        tab100cm: "100 cm (100 × 100)",
        tab1000mm: "1.000 mm (1.000 × 1.000)",
        squareDiagramTitle: "ΣΧΗΜΑ: ΤΕΤΡΑΓΩΝΟ 1 m × 1 m",
        singleSurface: "(Ενιαία επιφάνεια 1 m²)",
        zoomGrid100: "100 × 100 κουτάκια",
        zoomGlassMm: "🔍 1 cm ＝ 10 mm",
        sideLenM: "Μήκος πλευράς ＝ 1 m",
        sideLenDm: "Μήκος πλευράς ＝ 10 dm (10 ίσα τμήματα)",
        sideLenCm: "Μήκος πλευράς ＝ 100 cm (100 ίσα τμήματα)",
        sideLenMm: "Μήκος πλευράς ＝ 1.000 mm (1.000 ίσα τμήματα)",
        sideSummary: "Πλευρά: 1 m ＝ 10 dm ＝ 100 cm ＝ 1.000 mm",
        analysisHeading: "ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ ΤΟΥ ΣΧΗΜΑΤΟΣ",
        analysisM_Title: "Βασική Μονάδα:",
        analysisM_Text1: "Βλέπουμε το ενιαίο τετράγωνο πλευράς 1 m.",
        analysisM_Text2: "Κάθε πλευρά του έχει μήκος ακριβώς 1 μέτρο.",
        analysisM_Badge: "Μήκος πλευράς ＝ 1 m",
        analysisDm_Title: "Υποδιαίρεση σε Δεκατόμετρα (dm):",
        analysisDm_Text1: "Χωρίζουμε κάθε πλευρά του 1 m σε 10 ίσα τμήματα (1 m ＝ 10 dm).",
        analysisDm_Text2: "Το τετράγωνο χωρίζεται σε 10 × 10 ＝ 100 ίσα μικρότερα τετράγωνα (τετραγωνικά δεκατόμετρα).",
        analysisDm_Badge: "1 m ＝ 10 dm | Επιφάνεια: 10 · 10 ＝ 100 dm²",
        analysisCm_Title: "Υποδιαίρεση σε Εκατοστά (cm):",
        analysisCm_Text1: "Χωρίζουμε κάθε πλευρά του 1 m σε 100 ίσα τμήματα (1 m ＝ 100 cm).",
        analysisCm_Text2: "Το τετράγωνο χωρίζεται σε 100 × 100 ＝ 10.000 μικροσκοπικά τετραγωνάκια (τετραγωνικά εκατοστά).",
        analysisCm_Badge: "1 m ＝ 100 cm | Επιφάνεια: 100 · 100 ＝ 10.000 cm²",
        analysisMm_Title: "Υποδιαίρεση σε Χιλιοστά (mm):",
        analysisMm_Text1: "Χωρίζουμε κάθε πλευρά του 1 m σε 1.000 ίσα τμήματα (1 m ＝ 1.000 mm).",
        analysisMm_Text2: "Το τετράγωνο χωρίζεται σε 1.000 × 1.000 ＝ 1.000.000 τετραγωνικά χιλιοστά!",
        analysisMm_Badge: "1 m ＝ 1.000 mm | Επιφάνεια: 1.000 · 1.000 ＝ 1.000.000 mm²",
        analysisConcl: "💡 Συμπέρασμα: Όσο μικραίνει η μονάδα μέτρησης (από m σε dm, cm, mm), ο αριθμός των υποδιαιρέσεων στην πλευρά δεκαπλασιάζεται (1 ➔ 10 ➔ 100 ➔ 1.000)!",
        lab3Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 3: ΠΡΑΚΤΙΚΗ ΕΦΑΡΜΟΓΗ",
        lab3Title: "Περίμετρος Γηπέδου με Διαφορετικές Μονάδες (m και cm)",
        lab3Desc: "Σε ένα ορθογώνιο γήπεδο το μήκος δίνεται σε μέτρα (m) και το πλάτος σε εκατοστά (cm). Μετατρέπουμε σε κοινή μονάδα πριν υπολογίσουμε την περίμετρο:",
        fieldLengthLabel: "ΜΗΚΟΣ ΓΗΠΕΔΟΥ (m):",
        fieldWidthLabel: "ΠΛΑΤΟΣ ΓΗΠΕΔΟΥ (cm):",
        stepsFieldHeading: "ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΜΕ ΜΕΤΑΤΡΟΠΗ ΣΕ ΜΕΤΡΑ",
        stepField1: "1. Μετατροπή πλάτους σε μέτρα (διαίρεση με 100):",
        stepField2: "2. Υπολογισμός Περιμέτρου: 2 · (μήκος ＋ πλάτος)",
        stepField3: "3. Τελική Περίμετρος Γηπέδου:",
        fieldTip: "✅ Ποτέ δεν προσθέτουμε μέτρα με εκατοστά απευθείας! Πρώτα μετατρέπουμε στην ίδια μονάδα.",
        problemsHeading: "Λυμένα Προβλήματα Καθημερινής Ζωής",
        problemsDesc: "Δύο χαρακτηριστικά προβλήματα μετατροπών μήκους με αναλυτική παρουσίαση βήμα προς βήμα.",
        prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΥΦΑΣΜΑ & ΚΟΡΔΕΛΑ",
        prob1Tag: "Ραπτική",
        prob1Title: "Κοπή Κορδέλας σε Ίσα Κομμάτια",
        prob1Desc: "Μια μοδίστρα έχει μια κορδέλα μήκους 4,8 m. Θέλει να κόψει από αυτήν 12 ίσα κομμάτια για διακόσμηση. Πόσα εκατοστά (cm) θα έχει το κάθε κομμάτι;",
        prob1TableHeading: "ΔΕΔΟΜΕΝΑ & ΜΕΤΑΤΡΟΠΗ",
        prob1InitLen: "Αρχικό Μήκος",
        prob1Pieces: "Κομμάτια",
        prob1PiecesUnit: "τεμάχια",
        prob1StepsTitle: "Βήματα Επίλυσης:",
        prob1Step1: "Μετατροπή σε cm: 4,8 · 100 ＝ 480 cm.",
        prob1Step2: "Διαίρεση σε 12 κομμάτια: 480 : 12 ＝ 40 cm.",
        prob1Tip: "💡 Το κάθε κομμάτι κορδέλας θα έχει μήκος ακριβώς 40 cm (δηλαδή 4 dm ή 0,4 m).",
        prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΟΔΙΚΗ ΔΙΑΔΡΟΜΗ",
        prob2Tag: "Συγκοινωνίες",
        prob2Title: "Μήκος Διαδρομής Λεωφορείου",
        prob2Desc: "Ένα αστικό λεωφορείο εκτελεί μια διαδρομή που αποτελείται από τρία τμήματα: το 1ο τμήμα έχει μήκος 3,2 km, το 2ο τμήμα 4.500 m και το 3ο τμήμα 1.300 m. Πόσα χιλιόμετρα (km) είναι η συνολική διαδρομή;",
        prob2TableHeading: "ΑΝΑΓΩΓΗ ΟΛΩΝ ΤΩΝ ΤΜΗΜΑΤΩΝ ΣΕ km",
        part1: "1ο Τμήμα",
        part2: "2ο Τμήμα",
        part3: "3ο Τμήμα",
        prob2StepsTitle: "Βήματα Επίλυσης:",
        prob2Step1: "2ο τμήμα σε km: 4.500 : 1.000 ＝ 4,5 km.",
        prob2Step2: "3ο τμήμα σε km: 1.300 : 1.000 ＝ 1,3 km.",
        prob2Step3: "Συνολικό μήκος: 3,2 ＋ 4,5 ＋ 1,3 ＝ 9 km (ή 9.000 m).",
        prob2Tip: "💡 Μετατρέποντας όλα τα μέτρα σε χιλιόμετρα με διαίρεση διά 1.000, η πρόσθεση γίνεται άμεση και ασφαλής.",
        ctaTitle: "Ώρα για Εξάσκηση στις Μονάδες Μήκους!",
        ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπών μονάδων (km, m, dm, cm, mm), περιμέτρων σχημάτων και σύνθετων προβλημάτων καθημερινής ζωής για τη ΣΤ' Δημοτικού.",
        ctaBtn: "🎯 Έναρξη Ασκήσεων",
      },
      en: {
        pageTitle: "Length Units of Measurement & Conversions - 6th Grade | LearnMaths.gr",
        metaDescription: "Comprehensive theory on units of length, the base unit (meter), multiples and subdivisions, conversion rules, interactive labs, and solved problems for 6th Grade.",
        backText: "6th Grade",
        actionBtn: "🎯 Exercises",
        chapterBadge: "CHAPTER 59 • 6TH GRADE",
        headerTitle: "Length Measurement & Unit Conversions",
        headerDesc: "Understand the fundamental concept of length: Discover the base unit (meter), its subdivisions (decimeter, centimeter, millimeter), and its multiple (kilometer), and master the exact conversion rules using multiplication and division by powers of 10.",
        headerSub: "Theory, Metric Conversion Ladder & Dynamic Calculator",
        tryExercises: "Try the Exercises",
        roadmapTitle: "Units of Length in 4 Steps",
        roadmapDesc: "From the base reference unit to the reliable step-by-step conversion method.",
        step1Badge: "STEP 1",
        step1Tag: "Base Unit",
        step1Title: "The Meter (m)",
        step1Text: "The base unit of length in the International System of Units (SI) is the meter (m).",
        step1Bullet1: "1 m: Roughly an adult arm span or the height of a school desk.",
        step1Bullet2: "Measurement: We measure distances, heights, widths, and perimeter boundaries.",
        step1Tip: "💡 The meter is the foundation from which all other units of length are derived.",
        step2Badge: "STEP 2",
        step2Tag: "Subdivisions",
        step2Title: "Smaller Units (Subdivisions)",
        step2Text: "When measuring smaller dimensions we divide the meter into 10, 100, or 1,000 equal parts:",
        step2Sub1: "1 dm (decimeter) ＝ 0.1 m ＝ 10 cm",
        step2Sub2: "1 cm (centimeter) ＝ 0.01 m ＝ 10 mm",
        step2Sub3: "1 mm (millimeter) ＝ 0.001 m",
        step2Tip: "⚡ Each unit is 10 times smaller than the unit immediately preceding it!",
        step3Badge: "STEP 3",
        step3Tag: "Multiple",
        step3Title: "The Kilometer (km)",
        step3Text: "For large distances between cities, road networks, or geographic borders, we use the kilometer (km):",
        step3KmEq: "1 km ＝ 1,000 m",
        step3InversePrefix: "Inversely: 1 m ＝ 0.001 km (or",
        step3InverseSuffix: "of a kilometer).",
        step3Tip: "🎯 1 km is equivalent to approximately 10 to 12 minutes of comfortable walking.",
        step4Badge: "STEP 4",
        step4Tag: "Conversion Rules",
        step4Title: "The Golden Metric Ladder Rule",
        step4Text: "How we navigate the metric ladder:",
        step4DownTitle: "From larger to smaller unit (stepping down):",
        step4DownText: "Multiply by 10, 100, 1,000 (e.g. 3 m ＝ 3 · 100 ＝ 300 cm).",
        step4UpTitle: "From smaller to larger unit (stepping up):",
        step4UpText: "Divide by 10, 100, 1,000 (e.g. 450 cm ＝ 450 : 100 ＝ 4.5 m).",
        step4Tip: "🚀 Moving down the ladder means multiplying; moving up means dividing!",
        lab1Badge: "🔬 INTERACTIVE LAB 1",
        lab1Title: "Dynamic Length Converter & Metric Ladder",
        lab1Desc: "Set the length in meters (m) and observe its simultaneous conversion into all metric units.",
        lab1InputLabel: "BASE LENGTH IN METERS (m):",
        lab1AllUnitsTitle: "SIMULTANEOUS DISPLAY ACROSS ALL UNITS",
        unitKm: "Kilometers (km):",
        unitMBase: "Meters (m) [Base]:",
        unitDm: "Decimeters (dm):",
        unitCm: "Centimeters (cm):",
        unitMm: "Millimeters (mm):",
        calcExamplePrefix: "Calculation example:",
        lab2Badge: "🔍 INTERACTIVE LAB 2: VISUALIZING 1 m × 1 m SQUARE",
        lab2Title: "How 1 Meter (1 m) is Subdivided",
        lab2Desc: "Select a unit of measurement to see how the 1 m edge is divided into 10 decimeters (10 × 10), 100 centimeters (100 × 100), and 1,000 millimeters (1,000 × 1,000):",
        tabSingleM: "1 m (Whole)",
        tab10dm: "10 dm (10 × 10)",
        tab100cm: "100 cm (100 × 100)",
        tab1000mm: "1,000 mm (1,000 × 1,000)",
        squareDiagramTitle: "DIAGRAM: 1 m × 1 m SQUARE",
        singleSurface: "(Single surface 1 m²)",
        zoomGrid100: "100 × 100 squares",
        zoomGlassMm: "🔍 1 cm ＝ 10 mm",
        sideLenM: "Side length ＝ 1 m",
        sideLenDm: "Side length ＝ 10 dm (10 equal segments)",
        sideLenCm: "Side length ＝ 100 cm (100 equal segments)",
        sideLenMm: "Side length ＝ 1,000 mm (1,000 equal segments)",
        sideSummary: "Side: 1 m ＝ 10 dm ＝ 100 cm ＝ 1,000 mm",
        analysisHeading: "MATHEMATICAL BREAKDOWN",
        analysisM_Title: "Base Unit:",
        analysisM_Text1: "We observe a single unified square with side length 1 m.",
        analysisM_Text2: "Every side measures exactly 1 meter.",
        analysisM_Badge: "Side length ＝ 1 m",
        analysisDm_Title: "Subdivision into Decimeters (dm):",
        analysisDm_Text1: "We divide each 1 m side into 10 equal segments (1 m ＝ 10 dm).",
        analysisDm_Text2: "The square divides into 10 × 10 ＝ 100 equal small squares (square decimeters).",
        analysisDm_Badge: "1 m ＝ 10 dm | Area: 10 · 10 ＝ 100 dm²",
        analysisCm_Title: "Subdivision into Centimeters (cm):",
        analysisCm_Text1: "We divide each 1 m side into 100 equal segments (1 m ＝ 100 cm).",
        analysisCm_Text2: "The square divides into 100 × 100 ＝ 10,000 tiny squares (square centimeters).",
        analysisCm_Badge: "1 m ＝ 100 cm | Area: 100 · 100 ＝ 10,000 cm²",
        analysisMm_Title: "Subdivision into Millimeters (mm):",
        analysisMm_Text1: "We divide each 1 m side into 1,000 equal segments (1 m ＝ 1,000 mm).",
        analysisMm_Text2: "The square divides into 1,000 × 1,000 ＝ 1,000,000 square millimeters!",
        analysisMm_Badge: "1 m ＝ 1,000 mm | Area: 1,000 · 1,000 ＝ 1,000,000 mm²",
        analysisConcl: "💡 Takeaway: As unit size decreases (from m to dm, cm, mm), the number of edge subdivisions increases tenfold (1 ➔ 10 ➔ 100 ➔ 1,000)!",
        lab3Badge: "📐 INTERACTIVE LAB 3: PRACTICAL APPLICATION",
        lab3Title: "Field Perimeter with Mixed Units (m and cm)",
        lab3Desc: "In a rectangular field, length is given in meters (m) and width in centimeters (cm). Convert to a common unit before calculating perimeter:",
        fieldLengthLabel: "FIELD LENGTH (m):",
        fieldWidthLabel: "FIELD WIDTH (cm):",
        stepsFieldHeading: "SOLUTION STEPS CONVERTING TO METERS",
        stepField1: "1. Convert width to meters (divide by 100):",
        stepField2: "2. Calculate Perimeter: 2 · (length ＋ width)",
        stepField3: "3. Final Field Perimeter:",
        fieldTip: "✅ Never add meters directly to centimeters! Always convert to the same unit first.",
        problemsHeading: "Worked Everyday Problems",
        problemsDesc: "Two characteristic length conversion problems with step-by-step arithmetic.",
        prob1Badge: "PROBLEM 1: FABRIC & RIBBON",
        prob1Tag: "Tailoring",
        prob1Title: "Cutting a Ribbon into Equal Pieces",
        prob1Desc: "A seamstress has a 4.8 m ribbon. She wants to cut it into 12 equal decorative pieces. How many centimeters (cm) will each piece measure?",
        prob1TableHeading: "DATA & CONVERSION",
        prob1InitLen: "Initial Length",
        prob1Pieces: "Pieces",
        prob1PiecesUnit: "pieces",
        prob1StepsTitle: "Solution Steps:",
        prob1Step1: "Convert to cm: 4.8 · 100 ＝ 480 cm.",
        prob1Step2: "Divide into 12 pieces: 480 : 12 ＝ 40 cm.",
        prob1Tip: "💡 Each ribbon piece will measure exactly 40 cm (i.e. 4 dm or 0.4 m).",
        prob2Badge: "PROBLEM 2: BUS ROUTE",
        prob2Tag: "Transit",
        prob2Title: "Total Bus Route Length",
        prob2Desc: "A city bus route consists of three segments: segment 1 is 3.2 km, segment 2 is 4,500 m, and segment 3 is 1,300 m. How many kilometers (km) is the entire route?",
        prob2TableHeading: "CONVERTING ALL SEGMENTS TO km",
        part1: "Segment 1",
        part2: "Segment 2",
        part3: "Segment 3",
        prob2StepsTitle: "Solution Steps:",
        prob2Step1: "Segment 2 in km: 4,500 : 1,000 ＝ 4.5 km.",
        prob2Step2: "Segment 3 in km: 1,300 : 1,000 ＝ 1.3 km.",
        prob2Step3: "Total length: 3.2 ＋ 4.5 ＋ 1.3 ＝ 9 km (or 9,000 m).",
        prob2Tip: "💡 Converting all meter values to kilometers by dividing by 1,000 makes addition straightforward and error-free.",
        ctaTitle: "Time to Practice Units of Length!",
        ctaDesc: "Test your skills with 10 dynamic exercises on unit conversions (km, m, dm, cm, mm), geometric perimeters, and everyday word problems for 6th Grade.",
        ctaBtn: "🎯 Start Exercises",
      }
    }[locale];
  }, [locale]);

  // Εργαστηριο 1: Διαδραστικος Μετατροπεας Μηκους (Βαση το Μετρο)
  const [metersValue, setMetersValue] = useState(4.5);

  const conversions = useMemo(() => {
    return {
      km: Number((metersValue / 1000).toFixed(4)),
      m: metersValue,
      dm: Number((metersValue * 10).toFixed(1)),
      cm: Number((metersValue * 100).toFixed(1)),
      mm: Number((metersValue * 1000).toFixed(0))
    };
  }, [metersValue]);

  // Εργαστηριο 2: Οπτικη Υποδιαιρεση Τετραγωνου 1 m x 1 m σε dm (10x10), cm (100x100), mm (1000x1000)
  const [squareUnit, setSquareUnit] = useState('m'); // 'm', 'dm', 'cm', 'mm'

  // Εργαστηριο 3: Υπολογισμος Περιμετρου με Διαφορετικες Μοναδες (m και cm)
  const [fieldLengthM, setFieldLengthM] = useState(12); // σε m
  const [fieldWidthCm, setFieldWidthCm] = useState(850); // σε cm (8,5 m)

  const perimeterData = useMemo(() => {
    const widthInMeters = fieldWidthCm / 100;
    const perimMeters = 2 * (fieldLengthM + widthInMeters);
    const perimCm = perimMeters * 100;
    return {
      widthInM: widthInMeters,
      perimM: perimMeters,
      perimCm: perimCm
    };
  }, [fieldLengthM, fieldWidthCm]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.metaDescription}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/59-mikos-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.actionBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.headerTitle}
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              {t.headerDesc}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.headerSub}</span>
            </div>
            <Link
              href="/st-dimotikou/59-mikos-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.tryExercises}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.roadmapTitle}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.roadmapDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>{t.step1Bullet1}</strong></div>
                  <div>• <strong>{t.step1Bullet2}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Text}
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-slate-900 font-bold">• {t.step2Sub1}</div>
                  <div className="text-slate-900 font-bold">• {t.step2Sub2}</div>
                  <div className="text-slate-900 font-bold">• {t.step2Sub3}</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Text}
                </p>

                <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950 font-mono text-center">
                  <div className="font-bold text-sm sm:text-base">
                    {t.step3KmEq}
                  </div>
                  <div className="font-sans text-[11px] text-slate-600 leading-normal flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step3InversePrefix}</span>
                    <Fraction num="1" den="1.000" className="text-xs text-indigo-700" />
                    <span>{t.step3InverseSuffix}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Text}
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px] leading-normal">
                    <strong>{t.step4DownTitle}</strong> {t.step4DownText}
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] leading-normal">
                    <strong>{t.step4UpTitle}</strong> {t.step4UpText}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΚΑΙ ΣΚΑΛΑ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>{toCleanUppercase(t.lab1Badge)}</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab1Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab1Desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηριο Ρυθμισης Μηκους */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.lab1InputLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {formatNum(metersValue, locale, 2)} m
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease length"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMetersValue((prev) => Math.max(0.5, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={metersValue <= 0.5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={metersValue}
                    onChange={(e) => setMetersValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase length"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMetersValue((prev) => Math.min(20, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={metersValue >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2.5, 5, 10].map((quickVal) => (
                  <button
                    key={`btn-m-${quickVal}`}
                    type="button"
                    onClick={() => setMetersValue(quickVal)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {formatNum(quickVal, locale, 1)} m
                  </button>
                ))}
              </div>
            </div>

            {/* Πινακας Ισοδυναμων Μονάδων */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {toCleanUppercase(t.lab1AllUnitsTitle)}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.unitKm}</span>
                  <span className="font-bold text-purple-700">{formatNum(conversions.km, locale, 4)} km</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-blue-300 flex items-center justify-between bg-blue-50/30">
                  <span className="text-blue-900 font-sans font-bold">{t.unitMBase}</span>
                  <span className="font-black text-blue-700">{formatNum(conversions.m, locale, 2)} m</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.unitDm}</span>
                  <span className="font-bold text-emerald-700">{formatNum(conversions.dm, locale, 1)} dm</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">{t.unitCm}</span>
                  <span className="font-bold text-amber-700">{formatNum(conversions.cm, locale, 1)} cm</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-rose-200 flex items-center justify-between sm:col-span-2">
                  <span className="text-slate-600 font-sans">{t.unitMm}</span>
                  <span className="font-bold text-rose-700">{formatNum(conversions.mm, locale, 0)} mm</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center font-sans text-xs text-slate-600 space-y-1">
                <div>
                  💡 <strong>{t.calcExamplePrefix}</strong> {formatNum(metersValue, locale, 1)} m ＝ {formatNum(metersValue, locale, 1)} · 100 ＝ <strong>{formatNum(conversions.cm, locale, 1)} cm</strong>.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟ ΤΕΤΡΑΓΩΝΟ 1 m x 1 m ΚΑΙ ΠΡΑΓΜΑΤΙΚΕΣ ΥΠΟΔΙΑΙΡΕΣΕΙΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs 2xl:text-sm font-bold text-indigo-800 mb-1">
                <span>{toCleanUppercase(t.lab2Badge)}</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                {t.lab2Title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                {t.lab2Desc}
              </p>
            </div>

            {/* Επιλογεας Μοναδας */}
            <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSquareUnit('m')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  squareUnit === 'm'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t.tabSingleM}
              </button>
              <button
                type="button"
                onClick={() => setSquareUnit('dm')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  squareUnit === 'dm'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t.tab10dm}
              </button>
              <button
                type="button"
                onClick={() => setSquareUnit('cm')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  squareUnit === 'cm'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t.tab100cm}
              </button>
              <button
                type="button"
                onClick={() => setSquareUnit('mm')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  squareUnit === 'mm'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {t.tab1000mm}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Σχημα SVG Τετραγωνου */}
            <div className="lg:col-span-6 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {toCleanUppercase(t.squareDiagramTitle)}
              </span>

              <div className="w-full max-w-[320px] aspect-square bg-white rounded-2xl border-2 border-slate-300 p-3 shadow-inner flex items-center justify-center relative overflow-hidden">
                <svg viewBox="0 0 300 300" className="w-full h-full overflow-visible">
                  {/* 1. Ενιαίο Τετράγωνο 1 m */}
                  {squareUnit === 'm' && (
                    <g>
                      <rect x="20" y="20" width="260" height="260" fill="#eff6ff" stroke="#2563eb" strokeWidth="2.5" />
                      <text x="150" y="145" fontSize="22" fontWeight="900" fill="#1e40af" textAnchor="middle">
                        1 m × 1 m
                      </text>
                      <text x="150" y="172" fontSize="12" fontWeight="bold" fill="#3b82f6" textAnchor="middle">
                        {t.singleSurface}
                      </text>
                    </g>
                  )}

                  {/* 2. Υποδιαίρεση 10 x 10 (dm) */}
                  {squareUnit === 'dm' && (
                    <g>
                      <rect x="20" y="20" width="260" height="260" fill="#f0fdf4" />
                      <rect x="20" y="20" width="26" height="26" fill="#86efac" stroke="#16a34a" strokeWidth="1.5" />
                      <text x="33" y="37" fontSize="9" fontWeight="900" fill="#14532d" textAnchor="middle">
                        1 dm²
                      </text>
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line
                          key={`dm-v-${i}`}
                          x1={20 + (i + 1) * 26}
                          y1="20"
                          x2={20 + (i + 1) * 26}
                          y2="280"
                          stroke="#16a34a"
                          strokeWidth="1.2"
                        />
                      ))}
                      {Array.from({ length: 9 }).map((_, i) => (
                        <line
                          key={`dm-h-${i}`}
                          x1="20"
                          y1={20 + (i + 1) * 26}
                          x2="280"
                          y2={20 + (i + 1) * 26}
                          stroke="#16a34a"
                          strokeWidth="1.2"
                        />
                      ))}
                      <rect x="20" y="20" width="260" height="260" fill="none" stroke="#15803d" strokeWidth="2.5" />
                    </g>
                  )}

                  {/* 3. Υποδιαίρεση 100 x 100 (cm) */}
                  {squareUnit === 'cm' && (
                    <g>
                      <rect x="20" y="20" width="260" height="260" fill="#fffbeb" />
                      {Array.from({ length: 99 }).map((_, i) => (
                        <line
                          key={`cm-v-${i}`}
                          x1={20 + (i + 1) * 2.6}
                          y1="20"
                          x2={20 + (i + 1) * 2.6}
                          y2="280"
                          stroke={(i + 1) % 10 === 0 ? '#d97706' : '#fde68a'}
                          strokeWidth={(i + 1) % 10 === 0 ? 1 : 0.45}
                        />
                      ))}
                      {Array.from({ length: 99 }).map((_, i) => (
                        <line
                          key={`cm-h-${i}`}
                          x1="20"
                          y1={20 + (i + 1) * 2.6}
                          x2="280"
                          y2={20 + (i + 1) * 2.6}
                          stroke={(i + 1) % 10 === 0 ? '#d97706' : '#fde68a'}
                          strokeWidth={(i + 1) % 10 === 0 ? 1 : 0.45}
                        />
                      ))}
                      <rect x="20" y="20" width="2.6" height="2.6" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
                      
                      {/* Zoom circle */}
                      <circle cx="210" cy="85" r="48" fill="#ffffff" stroke="#b45309" strokeWidth="2.5" />
                      <rect x="195" y="70" width="30" height="30" fill="#fde68a" stroke="#b45309" strokeWidth="2" />
                      <text x="210" y="88" fontSize="10" fontWeight="900" fill="#78350f" textAnchor="middle">
                        1 cm²
                      </text>
                      <text x="210" y="122" fontSize="9.5" fontWeight="bold" fill="#b45309" textAnchor="middle">
                        {t.zoomGrid100}
                      </text>

                      <rect x="20" y="20" width="260" height="260" fill="none" stroke="#b45309" strokeWidth="2.5" />
                    </g>
                  )}

                  {/* 4. Υποδιαίρεση 1.000 x 1.000 (mm) */}
                  {squareUnit === 'mm' && (
                    <g>
                      <rect x="20" y="20" width="260" height="260" fill="#fff1f2" stroke="#e11d48" strokeWidth="2.5" />
                      {Array.from({ length: 49 }).map((_, i) => (
                        <g key={`mm-line-${i}`}>
                          <line x1={20 + (i + 1) * 5.2} y1="20" x2={20 + (i + 1) * 5.2} y2="280" stroke="#fecdd3" strokeWidth="0.5" />
                          <line x1="20" y1={20 + (i + 1) * 5.2} x2="280" y2={20 + (i + 1) * 5.2} stroke="#fecdd3" strokeWidth="0.5" />
                        </g>
                      ))}

                      {/* Zoom In */}
                      <circle cx="205" cy="95" r="54" fill="#ffffff" stroke="#be123c" strokeWidth="3" />
                      {Array.from({ length: 9 }).map((_, i) => (
                        <g key={`zoom-grid-${i}`}>
                          <line x1={165 + (i + 1) * 8} y1="55" x2={165 + (i + 1) * 8} y2="135" stroke="#fb7185" strokeWidth="1" />
                          <line x1="165" y1={55 + (i + 1) * 8} x2="245" y2={55 + (i + 1) * 8} stroke="#fb7185" strokeWidth="1" />
                        </g>
                      ))}
                      <rect x="165" y="55" width="8" height="8" fill="#fda4af" stroke="#9f1239" strokeWidth="1" />
                      <text x="205" y="160" fontSize="10.5" fontWeight="900" fill="#9f1239" textAnchor="middle">
                        {t.zoomGlassMm}
                      </text>
                    </g>
                  )}

                  <text x="150" y="13" fontSize="11" fontWeight="bold" fill="#334155" textAnchor="middle">
                    {squareUnit === 'm' && t.sideLenM}
                    {squareUnit === 'dm' && t.sideLenDm}
                    {squareUnit === 'cm' && t.sideLenCm}
                    {squareUnit === 'mm' && t.sideLenMm}
                  </text>
                </svg>
              </div>

              <div className="text-[11px] font-mono font-bold text-slate-700 text-center">
                {t.sideSummary}
              </div>
            </div>

            {/* Επεξηγησεις & Αναλυση Υποδιαιρεσεων */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {toCleanUppercase(t.analysisHeading)}
                </span>
                
                {squareUnit === 'm' && (
                  <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <p><strong>{t.analysisM_Title}</strong> {t.analysisM_Text1}</p>
                    <p>{t.analysisM_Text2}</p>
                    <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 font-mono text-blue-950 font-bold text-xs">
                      {t.analysisM_Badge}
                    </div>
                  </div>
                )}

                {squareUnit === 'dm' && (
                  <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <p><strong>{t.analysisDm_Title}</strong> {t.analysisDm_Text1}</p>
                    <p>{t.analysisDm_Text2}</p>
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 font-mono text-emerald-950 font-bold text-xs">
                      {t.analysisDm_Badge}
                    </div>
                  </div>
                )}

                {squareUnit === 'cm' && (
                  <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <p><strong>{t.analysisCm_Title}</strong> {t.analysisCm_Text1}</p>
                    <p>{t.analysisCm_Text2}</p>
                    <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 font-mono text-amber-950 font-bold text-xs">
                      {t.analysisCm_Badge}
                    </div>
                  </div>
                )}

                {squareUnit === 'mm' && (
                  <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <p><strong>{t.analysisMm_Title}</strong> {t.analysisMm_Text1}</p>
                    <p>{t.analysisMm_Text2}</p>
                    <div className="p-2 bg-rose-50 rounded-xl border border-rose-200 font-mono text-rose-950 font-bold text-xs">
                      {t.analysisMm_Badge}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950 font-medium">
                {t.analysisConcl}
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 3: ΠΕΡΙΜΕΤΡΟΣ ΜΕ ΜΕΤΑΤΡΟΠΗ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>{toCleanUppercase(t.lab3Badge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab3Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab3Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Ρυθμισεις Διαστασεων */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Μηκος σε m */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t.fieldLengthLabel}</span>
                  <span className="font-mono text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-black">
                    {fieldLengthM} m
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease field length"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldLengthM((prev) => Math.max(5, prev - 1)); }}
                    disabled={fieldLengthM <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={fieldLengthM}
                    onChange={(e) => setFieldLengthM(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase field length"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldLengthM((prev) => Math.min(30, prev + 1)); }}
                    disabled={fieldLengthM >= 30}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πλατος σε cm */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>{t.fieldWidthLabel}</span>
                  <span className="font-mono text-base sm:text-lg text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-black">
                    {fieldWidthCm} cm
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Decrease field width"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldWidthCm((prev) => Math.max(300, prev - 50)); }}
                    disabled={fieldWidthCm <= 300}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={300}
                    max={2000}
                    step={50}
                    value={fieldWidthCm}
                    onChange={(e) => setFieldWidthCm(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Increase field width"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldWidthCm((prev) => Math.min(2000, prev + 50)); }}
                    disabled={fieldWidthCm >= 2000}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Αναλυση & Υπολογισμος Περιμετρου */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                {toCleanUppercase(t.stepsFieldHeading)}
              </span>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">{t.stepField1}</span>
                  <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {fieldWidthCm} : 100 ＝ {formatNum(perimeterData.widthInM, locale, 2)} m
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">{t.stepField2}</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    2 · ({fieldLengthM} ＋ {formatNum(perimeterData.widthInM, locale, 2)})
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-300 flex items-center justify-between bg-emerald-50/40">
                  <span className="font-bold text-emerald-950">{t.stepField3}</span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-300">
                    {formatNum(perimeterData.perimM, locale, 2)} m ({formatNum(perimeterData.perimCm, locale, 0)} cm)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium text-center">
                {t.fieldTip}
              </div>
            </div>

          </div>
        </section>

        {/* 6. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
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

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob1TableHeading)}
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1InitLen}</span> 4,8 m ＝ 480 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1Pieces}</span> 12 {t.prob1PiecesUnit}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsTitle}</span>
                  <div>• {t.prob1Step1}</div>
                  <div>• <strong>{t.prob1Step2}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* Παραδειγμα 2 */}
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

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {toCleanUppercase(t.prob2TableHeading)}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.part1}</span> 3,2 km
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.part2}</span> 4,5 km
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.part3}</span> 1,3 km
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsTitle}</span>
                  <div>• {t.prob2Step1}</div>
                  <div>• {t.prob2Step2}</div>
                  <div>• <strong>{t.prob2Step3}</strong></div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                {t.prob2Tip}
              </div>
            </article>

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
            href="/st-dimotikou/59-mikos-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.ctaBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
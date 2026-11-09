// pages/st-dimotikou/76-embadon-kiklou.js
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

export default function EmbadonKiklouTheoriaPage() {
  const router = useRouter();
  const { locale = 'el' } = router;

  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Βιωματική Αναδιάταξη 16 Τομέων σε Ορθογώνιο
  // -------------------------------------------------------------------------
  const [unfoldProgress, setUnfoldProgress] = useState(0); // 0% (κύκλος) έως 100% (ορθογώνιο)

  const radiusR = 60; // Ακτίνα ρ = 60px
  const N = 16; // 16 πραγματικοί κυκλικοί τομείς
  const halfN = 8; // 8 πάνω, 8 κάτω
  const dTheta = (2 * Math.PI) / N; // Γωνία κάθε φέτας (22.5°)
  const arcLength = (2 * Math.PI * radiusR) / N; // Μήκος τόξου κάθε φέτας (~23.56px)

  const t = unfoldProgress / 100;

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Εμβαδού & Περιφέρειας
  // -------------------------------------------------------------------------
  const [radiusInput, setRadiusInput] = useState(5); // Ακτίνα σε cm
  const piVal = 3.14;

  const diameter = useMemo(() => radiusInput * 2, [radiusInput]);
  const perimeterCm = useMemo(() => 2 * piVal * radiusInput, [radiusInput]);
  const areaCm2 = useMemo(() => piVal * radiusInput * radiusInput, [radiusInput]);
  const areaMm2 = useMemo(() => areaCm2 * 100, [areaCm2]);
  const areaDm2 = useMemo(() => areaCm2 / 100, [areaCm2]);
  const areaM2 = useMemo(() => areaCm2 / 10000, [areaCm2]);

  // -------------------------------------------------------------------------
  // Λεξικό Μεταφράσεων (i18n Dictionary)
  // -------------------------------------------------------------------------
  const translations = {
    el: {
      metaTitle: "Εμβαδόν Κύκλου & Μονάδες Μέτρησης - ΣΤ' Δημοτικού | LearnMaths.gr",
      metaDesc: "Μαθαίνουμε πώς υπολογίζουμε το εμβαδόν κύκλου Ε ＝ π · ρ², την απόδειξη με αναδιάταξη τομέων σε ορθογώνιο και τις μετατροπές μονάδων επιφάνειας.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      chapterBadge: "ΚΕΦΑΛΑΙΟ 76 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Εμβαδόν Κύκλου • Ακτίνα ρ, ο Αριθμός π & Μονάδες Επιφάνειας",
      heroDesc: "Ανακαλύπτουμε πώς υπολογίζεται η επιφάνεια του κύκλου με τον τύπο Ε ＝ π · ρ², βλέπουμε ζωντανά πώς οι «φέτες» του κύκλου ανοίγουν και κουμπώνουν σε ένα ορθογώνιο με διαστάσεις (π · ρ) και ρ, και εξετάζουμε τη σχέση ανάμεσα στην περίμετρο και το εμβαδόν!",
      heroFeature: "Θεωρία, Οπτική Απόδειξη με Φέτες Κύκλου, Σύμπλεξη σε Ορθογώνιο & SVG",
      tryExercises: "Δοκίμασε τις Ασκήσεις",
      
      stepsHeading: "Το Εμβαδόν Κύκλου σε 4 Βήματα",
      stepsSubheading: "Από τον βασικό τύπο μέχρι τη γεωμετρική απόδειξη και τα σύνθετα κυκλικά σχήματα.",
      
      step1Badge: "ΒΗΜΑ 1",
      step1Subtitle: "Ο Τύπος",
      step1Title: "Πώς Υπολογίζουμε το Εμβαδόν;",
      step1P1: "Το εμβαδόν του κυκλικού δίσκου εξαρτάται αποκλειστικά από την ακτίνα (ρ) του κύκλου:",
      step1Formula1: "Εμβαδόν ＝ π · ρ²",
      step1Formula2: "Ε ＝ 3,14 · ρ · ρ",
      step1PiDef: "• π: Ο μαθηματικός αριθμός π ≈ 3,14.",
      step1R2Def: "• ρ²: Το τετράγωνο της ακτίνας (ρ · ρ, δηλαδή η ακτίνα πολλαπλασιασμένη με τον εαυτό της, όχι επί 2!).",
      step1Tip: "💡 Προσοχή: ρ² σημαίνει ρ · ρ. Για παράδειγμα, αν ρ ＝ 4 cm, τότε ρ² ＝ 4 · 4 ＝ 16 cm² (και όχι 8 cm²)!",

      step2Badge: "ΒΗΜΑ 2",
      step2Subtitle: "Γεωμετρική Απόδειξη",
      step2Title: "Γιατί Ισχύει ο Τύπος Ε ＝ π · ρ²;",
      step2P1: "Αν κόψουμε έναν κύκλο σε 16 φέτες και τις τοποθετήσουμε εναλλάξ:",
      step2L1: "1. Άπλωμα: Οι 8 πάνω φέτες (μπλε) και οι 8 κάτω φέτες (μωβ) κουμπώνουν σαν δόντια πριονιού.",
      step2L2: "2. Ύψος: Το ύψος του σχήματος είναι η ακτίνα ρ.",
      step2L3: "3. Βάση: Η καμπύλη βάση είναι η μισή περιφέρεια του κύκλου, δηλαδή π · ρ.",
      step2Formula: "Εμβαδόν ＝ Βάση · Ύψος ＝ (π · ρ) · ρ ＝ π · ρ²!",
      step2Tip: "⚡ Όσο περισσότερες φέτες κόβουμε, τόσο οι καμπύλες ισιώνουν και το σχήμα γίνεται ένα τέλειο ορθογώνιο!",

      step3Badge: "ΒΗΜΑ 3",
      step3Subtitle: "Ακτίνα vs Διάμετρος",
      step3Title: "Τι Γίνεται όταν Ξέρουμε τη Διάμετρο;",
      step3P1: "Στα προβλήματα συχνά δίνεται η διάμετρος (δ) αντί για την ακτίνα:",
      step3L1: "1. Βρίσκουμε πρώτα την ακτίνα: ρ ＝ δ : 2",
      step3L2: "2. Εφαρμόζουμε τον τύπο: Ε ＝ 3,14 · ρ · ρ",
      step3Ex: "Παράδειγμα: Αν η διάμετρος είναι 10 cm, τότε η ακτίνα είναι ρ ＝ 5 cm και Ε ＝ 3,14 · 5 · 5 ＝ 78,5 cm².",
      step3Tip: "🎯 Ποτέ μην βάζετε τη διάμετρο στον τύπο του εμβαδού! Πρώτα τη διαιρούμε διά 2 για να βρούμε την ακτίνα ρ.",

      step4Badge: "ΒΗΜΑ 4",
      step4Subtitle: "Ημικύκλιο & Δακτύλιος",
      step4Title: "Σύνθετα Κυκλικά Σχήματα",
      step4P1: "Ειδικές κυκλικές επιφάνειες που συναντάμε συχνά:",
      step4L1: "• Ημικύκλιο: Είναι ακριβώς το μισό του κύκλου: Εημικ ＝ (π · ρ²) : 2.",
      step4L2: "• Κυκλικός δακτύλιος (ροδέλα): Αφαιρούμε το εμβαδόν του μικρού εσωτερικού κύκλου από τον μεγάλο: Εδακτ ＝ Εμεγ － Εμικ.",
      step4Tip: "🚀 Μονάδες: 1 m² ＝ 100 dm² ＝ 10.000 cm². Όπως σε κάθε επιφάνεια, οι μετατροπές γίνονται ανά 100!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Πώς οι Φέτες του Κύκλου Σχηματίζουν Ορθογώνιο; (SVG)",
      lab1Desc: "Σύρε την μπάρα: Παρατήρησε πώς οι 8 πάνω μπλε φέτες και οι 8 κάτω μωβ φέτες ανοίγουν και κουμπώνουν μεταξύ τους σαν παζλ, σχηματίζοντας ένα ορθογώνιο με μήκος (π · ρ) και πλάτος (ρ)!",
      lab1SliderLabel: "ΑΝΑΔΙΑΤΑΞΗ ΦΕΤΩΝ:",
      lab1State0: "0% (Κύκλος)",
      lab1State50: "50% (Άπλωμα)",
      lab1State100: "100% (Κούμπωμα)",
      lab1Info0: "🔷 Αρχικός Κύκλος: 16 φέτες (8 μπλε στο πάνω ημικύκλιο και 8 μωβ στο κάτω).",
      lab1InfoProgress: "🔄 Οι φέτες απλώνονται και η καμπύλη περιφέρεια ισιώνει...",
      lab1InfoDone: "🟩 Ολοκληρώθηκε: Οι 16 φέτες κούμπωσαν σχηματίζοντας ορθογώνιο!",
      lab1BaseLen: "Μήκος βάσης (8 φέτες): Μισή Περιφέρεια ＝ π · ρ",
      lab1HeightLen: "Πλάτος (ύψος φέτας): Ακτίνα ＝ ρ",
      lab1AreaFormula: "Εμβαδόν: (π · ρ) · ρ ＝ π · ρ²",
      lab1RadiusSymbol: "ρ",
      lab1SvgBaseLabel: "Βάση (μισή περιφέρεια) ＝ π · ρ",
      lab1FooterText: "Οι καμπύλες φέτες ενώνονται σε ορθογώνιο με μήκος (π · ρ) και πλάτος ρ. Εμβαδόν: π · ρ².",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ & ΜΟΝΑΔΕΣ",
      lab2Title: "Υπολογιστής Εμβαδού Κύκλου & Αυτόματη Μετατροπή",
      lab2Desc: "Άλλαξε την ακτίνα (ρ) σε cm για να υπολογίσεις ταυτόχρονα το εμβαδόν (π · ρ²) και την περίμετρο (2 · π · ρ):",
      lab2RadiusLabel: "ΑΚΤΙΝΑ ΚΥΚΛΟΥ (ρ):",
      lab2DiameterText: "Διάμετρος:",
      lab2DiameterFormula: "Διάμετρος: δ ＝ 2 · ρ ＝ 2 ·",
      lab2PerimeterFormula: "Περίμετρος (Μήκος): 2 · π · ρ ＝ 2 · 3,14 ·",
      lab2AreaFormula: "• Εμβαδόν: π · ρ² ＝ 3,14 ·",
      lab2ConvTitle: "ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΛΛΕΣ ΜΟΝΑΔΕΣ ΕΠΙΦΑΝΕΙΑΣ",
      lab2InCm2: "Σε cm² (Βάση υπολογισμού):",
      lab2InMm2: "Σε mm² (· 100):",
      lab2InDm2: "Σε dm² (: 100):",
      lab2InM2: "Σε m² (: 10.000):",
      lab2Warning: "💡 Μην μπερδεύετε την περίμετρο με το εμβαδόν!",

      probHeading: "Λυμένα Προβλήματα με Εμβαδόν Κύκλου",
      probSubheading: "Εφαρμογές του τύπου Ε ＝ π · ρ² σε κυκλικά τραπέζια και πισίνες.",
      
      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΚΥΚΛΙΚΟ ΤΡΑΠΕΖΙ",
      prob1Subtitle: "Δίνεται η Διάμετρος",
      prob1Title: "Υπολογισμός Εμβαδού από τη Διάμετρο",
      prob1Text: "Ένα στρογγυλό τραπέζι έχει διάμετρο 1,6 m. Θέλουμε να φτιάξουμε ένα γυάλινο κάλυμμα για την επιφάνειά του. Πόσα τετραγωνικά μέτρα (m²) γυαλιού θα χρειαστούν; (Χρησιμοποιήστε π ＝ 3,14)",
      prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1DiameterLabel: "Διάμετρος (δ)",
      prob1RadiusLabel: "Ακτίνα (ρ)",
      prob1FormulaLabel: "Τύπος",
      prob1StepHeader: "Βήματα Επίλυσης:",
      prob1Step1: "Βρίσκουμε την ακτίνα ρ: ρ ＝ δ : 2 ＝ 1,6 : 2 ＝ 0,8 m.",
      prob1Step2: "Υπολογίζουμε το τετράγωνο της ακτίνας: 0,8 · 0,8 ＝ 0,64 m².",
      prob1Step3: "Εμβαδόν: 3,14 · 0,64 ＝ 2,0096 m² ≈ 2,01 m².",
      prob1Tip: "💡 Θυμήσου: Ποτέ δεν πολλαπλασιάζουμε απευθείας με τη διάμετρο! Πρώτα βρίσκουμε την ακτίνα ρ (0,8 m).",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΚΥΚΛΙΚΗ ΠΙΣΙΝΑ & ΔΙΑΔΡΟΜΟΣ",
      prob2Subtitle: "Κυκλικός Δακτύλιος",
      prob2Title: "Υπολογισμός Εμβαδού Κυκλικού Δακτυλίου",
      prob2Text: "Μια κυκλική πισίνα έχει ακτίνα 4 m. Γύρω από την πισίνα κατασκευάζεται διάδρομος πλάτους 1 m. Ποιο είναι το εμβαδόν μόνο του διαδρόμου; (Χρησιμοποιήστε π ＝ 3,14)",
      prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2R1Label: "Μικρή ακτίνα (ρ₁)",
      prob2R2Label: "Μεγάλη ακτίνα (ρ₂)",
      prob2RingLabel: "Εμβαδόν διαδρόμου",
      prob2StepHeader: "Βήματα Επίλυσης:",
      prob2Step1: "Εμβαδόν μεγάλου κύκλου: 3,14 · 5 · 5 ＝ 3,14 · 25 ＝ 78,5 m².",
      prob2Step2: "Εμβαδόν πισίνας (μικρού κύκλου): 3,14 · 4 · 4 ＝ 3,14 · 16 ＝ 50,24 m².",
      prob2Step3: "Εμβαδόν διαδρόμου: 78,5 － 50,24 ＝ 28,26 m².",
      prob2Tip: "⚡ Για να βρούμε το εμβαδόν του διαδρόμου (δακτυλίου), αφαιρούμε τον μικρό κύκλο από τον μεγάλο κύκλο!",

      alertTitle: "ΠΡΟΣΟΧΗ / ΣΥΝΗΘΗ ΛΑΘΗ ΠΟΥ ΠΡΕΠΕΙ ΝΑ ΑΠΟΦΕΥΓΕΤΕ",
      alertL1Bold: "Μην μπερδεύετε το ρ² με το 2 · ρ:",
      alertL1Text: " Το ρ² είναι ρ · ρ (η ακτίνα πολλαπλασιασμένη με τον εαυτό της). Αν η ακτίνα είναι 6 cm, τότε το τετράγωνό της είναι 36 cm² (και όχι 12 cm).",
      alertL2Bold: "Μην μπερδεύετε την περίμετρο με το εμβαδόν:",
      alertL2Text: " Η περίμετρος (το μήκος της γραμμής) είναι 2 · π · ρ. Το εμβαδόν (η επιφάνεια) είναι π · ρ².",
      alertL3Bold: "Αν γνωρίζετε τη διάμετρο:",
      alertL3Text: " Μην ξεχνάτε να τη διαιρέσετε πρώτα διά 2 για να βρείτε την ακτίνα ρ πριν υπολογίσετε το εμβαδόν.",
      alertL4Bold: "Στο ημικύκλιο διαιρούμε με το 2:",
      alertL4Text: " Το εμβαδόν του ημικυκλίου είναι ακριβώς το μισό του κύκλου: (π · ρ²) : 2.",

      ctaTitle: "Ώρα για Εξάσκηση στο Εμβαδόν Κύκλου!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς ακτίνας ρ, διαμέτρου, εμβαδού κύκλου και ημικυκλίου για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων"
    },
    en: {
      metaTitle: "Circle Area & Surface Units - 6th Grade | LearnMaths.gr",
      metaDesc: "Learn how to calculate circle area A ＝ π · r², explore the geometric rearrangement proof into a rectangle, and master area unit conversions.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      chapterBadge: "CHAPTER 76 • 6TH GRADE",
      heroTitle: "Area of a Circle • Radius r, the Number π & Surface Units",
      heroDesc: "Discover how to calculate the area of a circle using the formula A ＝ π · r², witness how circular sectors unfold and interlock into a rectangle of dimensions (π · r) by r, and explore the relationship between perimeter and area!",
      heroFeature: "Theory, Visual Proof with Circle Sectors, Rectangular Interlock & SVG",
      tryExercises: "Try Exercises",
      
      stepsHeading: "Circle Area in 4 Steps",
      stepsSubheading: "From the fundamental formula to geometric proofs and composite circular shapes.",
      
      step1Badge: "STEP 1",
      step1Subtitle: "The Formula",
      step1Title: "How Do We Calculate Area?",
      step1P1: "The area of a circular disk depends entirely on its radius (r):",
      step1Formula1: "Area ＝ π · r²",
      step1Formula2: "A ＝ 3.14 · r · r",
      step1PiDef: "• π: The mathematical constant π ≈ 3.14.",
      step1R2Def: "• r²: The square of the radius (r · r, meaning the radius multiplied by itself, not times 2!).",
      step1Tip: "💡 Note: r² means r · r. For example, if r ＝ 4 cm, then r² ＝ 4 · 4 ＝ 16 cm² (not 8 cm²)!",

      step2Badge: "STEP 2",
      step2Subtitle: "Geometric Proof",
      step2Title: "Why Does A ＝ π · r² Hold True?",
      step2P1: "If we slice a circle into 16 sectors and interlock them alternately:",
      step2L1: "1. Unfolding: 8 top sectors (blue) and 8 bottom sectors (purple) interlock like gear teeth.",
      step2L2: "2. Height: The height of the shape is the radius r.",
      step2L3: "3. Base: The curved base is half of the circle's circumference, which is π · r.",
      step2Formula: "Area ＝ Base · Height ＝ (π · r) · r ＝ π · r²!",
      step2Tip: "⚡ The more slices we make, the straighter the curves become and the figure approaches a perfect rectangle!",

      step3Badge: "STEP 3",
      step3Subtitle: "Radius vs Diameter",
      step3Title: "What if We Only Know the Diameter?",
      step3P1: "Problems frequently state the diameter (d) instead of the radius:",
      step3L1: "1. First find the radius: r ＝ d : 2",
      step3L2: "2. Apply the formula: A ＝ 3.14 · r · r",
      step3Ex: "Example: If diameter is 10 cm, then radius r ＝ 5 cm and A ＝ 3.14 · 5 · 5 ＝ 78.5 cm².",
      step3Tip: "🎯 Never plug the diameter directly into the area formula! Always divide it by 2 first to find the radius r.",

      step4Badge: "STEP 4",
      step4Subtitle: "Semicircles & Rings",
      step4Title: "Composite Circular Figures",
      step4P1: "Common composite circular shapes encountered in geometry:",
      step4L1: "• Semicircle: Exactly half a circle: Asemi ＝ (π · r²) : 2.",
      step4L2: "• Circular Ring (Annulus): Subtract the inner circle's area from the outer circle: Aring ＝ Aouter － Ainner.",
      step4Tip: "🚀 Units: 1 m² ＝ 100 dm² ＝ 10,000 cm². As with all area measurements, conversions step by 100!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "How Circle Sectors Form a Rectangle (SVG)",
      lab1Desc: "Drag the slider: Watch the 8 top blue sectors and 8 bottom purple sectors open up and interlock, forming a rectangle with length (π · r) and width (r)!",
      lab1SliderLabel: "SECTOR REARRANGEMENT:",
      lab1State0: "0% (Circle)",
      lab1State50: "50% (Unfolding)",
      lab1State100: "100% (Interlocked)",
      lab1Info0: "🔷 Initial Circle: 16 sectors (8 blue in top semicircle and 8 purple in bottom).",
      lab1InfoProgress: "🔄 The sectors unfold and the curved circumference flattens...",
      lab1InfoDone: "🟩 Complete: The 16 sectors have locked together into a rectangle!",
      lab1BaseLen: "Base length (8 sectors): Half Circumference ＝ π · r",
      lab1HeightLen: "Width (sector height): Radius ＝ r",
      lab1AreaFormula: "Area: (π · r) · r ＝ π · r²",
      lab1RadiusSymbol: "r",
      lab1SvgBaseLabel: "Base (half circumference) ＝ π · r",
      lab1FooterText: "The curved sectors merge into a rectangle with length (π · r) and height r. Area: π · r².",

      lab2Badge: "📐 INTERACTIVE LAB 2: CALCULATOR & UNITS",
      lab2Title: "Circle Area Calculator & Automatic Conversion",
      lab2Desc: "Adjust the radius (r) in cm to simultaneously calculate area (π · r²) and perimeter (2 · π · r):",
      lab2RadiusLabel: "CIRCLE RADIUS (r):",
      lab2DiameterText: "Diameter:",
      lab2DiameterFormula: "Diameter: d ＝ 2 · r ＝ 2 ·",
      lab2PerimeterFormula: "Perimeter (Length): 2 · π · r ＝ 2 · 3.14 ·",
      lab2AreaFormula: "• Area: π · r² ＝ 3.14 ·",
      lab2ConvTitle: "CONVERSION TO OTHER AREA UNITS",
      lab2InCm2: "In cm² (Base calculation):",
      lab2InMm2: "In mm² (· 100):",
      lab2InDm2: "In dm² (: 100):",
      lab2InM2: "In m² (: 10,000):",
      lab2Warning: "💡 Do not confuse perimeter with area!",

      probHeading: "Solved Real-World Problems",
      probSubheading: "Practical applications of A ＝ π · r² on circular tables and swimming pools.",
      
      prob1Badge: "PROBLEM 1: CIRCULAR TABLE",
      prob1Subtitle: "Given Diameter",
      prob1Title: "Calculating Area from Diameter",
      prob1Text: "A round table has a diameter of 1.6 m. We want to make a protective glass top for its surface. How many square meters (m²) of glass are needed? (Use π ＝ 3.14)",
      prob1DataHeader: "PROBLEM DATA",
      prob1DiameterLabel: "Diameter (d)",
      prob1RadiusLabel: "Radius (r)",
      prob1FormulaLabel: "Formula",
      prob1StepHeader: "Solution Steps:",
      prob1Step1: "Find the radius r: r ＝ d : 2 ＝ 1.6 : 2 ＝ 0.8 m.",
      prob1Step2: "Calculate radius squared: 0.8 · 0.8 ＝ 0.64 m².",
      prob1Step3: "Area: 3.14 · 0.64 ＝ 2.0096 m² ≈ 2.01 m².",
      prob1Tip: "💡 Remember: Never multiply directly with the diameter! Always find the radius r first (0.8 m).",

      prob2Badge: "PROBLEM 2: CIRCULAR POOL & PATH",
      prob2Subtitle: "Circular Ring (Annulus)",
      prob2Title: "Calculating Annulus Area",
      prob2Text: "A circular pool has a radius of 4 m. Around the pool, a walkway of width 1 m is paved. What is the area of just the walkway? (Use π ＝ 3.14)",
      prob2DataHeader: "CALCULATION ELEMENTS",
      prob2R1Label: "Inner radius (r₁)",
      prob2R2Label: "Outer radius (r₂)",
      prob2RingLabel: "Walkway Area",
      prob2StepHeader: "Solution Steps:",
      prob2Step1: "Outer circle area: 3.14 · 5 · 5 ＝ 3.14 · 25 ＝ 78.5 m².",
      prob2Step2: "Pool area (inner circle): 3.14 · 4 · 4 ＝ 3.14 · 16 ＝ 50.24 m².",
      prob2Step3: "Walkway area: 78.5 － 50.24 ＝ 28.26 m².",
      prob2Tip: "⚡ To find the walkway area, subtract the inner circle from the outer circle!",

      alertTitle: "CAUTION / COMMON PITFALLS TO AVOID",
      alertL1Bold: "Do not confuse r² with 2 · r:",
      alertL1Text: " r² is r · r (the radius multiplied by itself). If radius is 6 cm, its square is 36 cm² (not 12 cm).",
      alertL2Bold: "Do not confuse perimeter with area:",
      alertL2Text: " Perimeter (outline length) is 2 · π · r. Area (flat surface) is π · r².",
      alertL3Bold: "When diameter is provided:",
      alertL3Text: " Always divide it by 2 first to find radius r before computing the area.",
      alertL4Bold: "For semicircles, divide by 2:",
      alertL4Text: " The area of a semicircle is exactly half of a full circle: (π · r²) : 2.",

      ctaTitle: "Time to Practice Circle Area!",
      ctaDesc: "Test your skills on 12 interactive exercises covering radius r, diameter, circle area, and semicircles for 6th Grade.",
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
          href="/st-dimotikou/76-embadon-kiklou-ask"
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
              href="/st-dimotikou/76-embadon-kiklou-ask"
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
                    {tLoc.step1Formula1}
                  </div>
                  <div className="text-slate-700 font-bold">
                    {tLoc.step1Formula2}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    {tLoc.step1PiDef}<br />
                    {tLoc.step1R2Def}
                  </p>
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
                  <div>{tLoc.step2L2}</div>
                  <div>{tLoc.step2L3}</div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200 font-mono text-center">
                    {tLoc.step2Formula}
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
                  <div className="text-indigo-950 font-bold">
                    {tLoc.step3L1}
                  </div>
                  <div className="text-indigo-950 font-bold">
                    {tLoc.step3L2}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    {tLoc.step3Ex}
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
                  <div>{tLoc.step4L1}</div>
                  <div>{tLoc.step4L2}</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {tLoc.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΒΙΩΜΑΤΙΚΗ ΑΠΟΔΕΙΞΗ ΜΕ ΠΡΑΓΜΑΤΙΚΟΥΣ ΤΟΜΕΙΣ (SVG) */}
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
                    {unfoldProgress}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={unfoldProgress}
                  onChange={(e) => setUnfoldProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{tLoc.lab1State0}</span>
                  <span>{tLoc.lab1State50}</span>
                  <span>{tLoc.lab1State100}</span>
                </div>
              </div>

              {/* Κάρτα Επεξήγησης */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {unfoldProgress === 0 && tLoc.lab1Info0}
                  {unfoldProgress > 0 && unfoldProgress < 100 && tLoc.lab1InfoProgress}
                  {unfoldProgress === 100 && tLoc.lab1InfoDone}
                </div>
                <div className="text-slate-600 text-[11px] space-y-1 font-mono pt-1 border-t border-sky-200/60">
                  <div><strong>{tLoc.lab1BaseLen}</strong></div>
                  <div><strong>{tLoc.lab1HeightLen}</strong></div>
                  <div className="text-indigo-900 font-bold">
                    <strong>{tLoc.lab1AreaFormula}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[340px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 220"
                className="w-full max-w-[380px] sm:max-w-[460px] h-auto select-none overflow-visible"
              >
                {/* 1. Κατάσταση 0%: Ολοκληρωμένος κύκλος */}
                {unfoldProgress < 100 && (
                  <g opacity={1 - t}>
                    <circle cx="100" cy="110" r={radiusR} fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="2" />
                    
                    {/* Ακτίνα ρ / r */}
                    <line x1="100" y1="110" x2="160" y2="110" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="100" cy="110" r="3" fill="#ffffff" />
                    <text x="130" y="102" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                      {tLoc.lab1RadiusSymbol}
                    </text>

                    {/* Διαχωριστικές γραμμές 16 φετών */}
                    {Array.from({ length: N }).map((_, i) => {
                      const ang = i * dTheta;
                      return (
                        <line
                          key={i}
                          x1="100"
                          y1="110"
                          x2={100 + radiusR * Math.cos(ang)}
                          y2={110 + radiusR * Math.sin(ang)}
                          stroke="rgba(255, 255, 255, 0.25)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Επισήμανση 2 ημικυκλίων */}
                    <path
                      d={`M ${100 - radiusR} 110 A ${radiusR} ${radiusR} 0 0 1 ${100 + radiusR} 110`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                    />
                    <path
                      d={`M ${100 + radiusR} 110 A ${radiusR} ${radiusR} 0 0 1 ${100 - radiusR} 110`}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                    />
                  </g>
                )}

                {/* 2. Κίνηση Αναδιάταξης Φετών προς Ορθογώνιο */}
                <g opacity={t} transform={`translate(${135 - t * 65}, 65)`}>
                  {/* 8 Μπλε φέτες (πάνω) */}
                  {Array.from({ length: halfN }).map((_, i) => {
                    const startX = i * arcLength;
                    const endX = (i + 1) * arcLength;
                    const apexX = (i + 0.5) * arcLength;
                    return (
                      <path
                        key={`top-sector-${i}`}
                        d={`
                          M ${apexX} ${radiusR} 
                          L ${startX} 0 
                          A ${radiusR} ${radiusR} 0 0 1 ${endX} 0 
                          Z
                        `}
                        fill="rgba(56, 189, 248, 0.4)"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* 8 Μωβ φέτες (κάτω) */}
                  {Array.from({ length: halfN }).map((_, i) => {
                    const apexX = (i + 0.5) * arcLength;
                    const startX = (i + 0.5) * arcLength;
                    const endX = (i + 1.5) * arcLength;
                    return (
                      <path
                        key={`bot-sector-${i}`}
                        d={`
                          M ${apexX} 0 
                          L ${startX} ${radiusR} 
                          A ${radiusR} ${radiusR} 0 0 1 ${endX} ${radiusR} 
                          Z
                        `}
                        fill="rgba(168, 85, 247, 0.4)"
                        stroke="#c084fc"
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* Ετικέτες Ορθογωνίου στο 100% */}
                  {unfoldProgress > 65 && (
                    <>
                      {/* Κάθετο Ύψος = ρ / r */}
                      <line x1="-12" y1="0" x2="-12" y2={radiusR} stroke="#f59e0b" strokeWidth="2.5" />
                      <text x="-22" y={radiusR / 2 + 5} fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="end">
                        {tLoc.lab1RadiusSymbol}
                      </text>

                      {/* Οριζόντια Βάση = π · ρ */}
                      <line x1="0" y1={radiusR + 18} x2={halfN * arcLength} y2={radiusR + 18} stroke="#e2e8f0" strokeWidth="2" />
                      <text x={(halfN * arcLength) / 2} y={radiusR + 36} fill="#ffffff" fontSize="13" fontWeight="black" textAnchor="middle">
                        {tLoc.lab1SvgBaseLabel}
                      </text>
                    </>
                  )}
                </g>
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {tLoc.lab1FooterText}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΟΥ & ΣΥΓΚΡΙΣΗ ΜΕ ΠΕΡΙΜΕΤΡΟ */}
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

            {/* Slider Ακτίνας ρ / r (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{tLoc.lab2RadiusLabel}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {radiusInput} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={25}
                  step={1}
                  value={radiusInput}
                  onChange={(e) => setRadiusInput(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1 cm</span>
                  <span>{tLoc.lab2DiameterText} {diameter} cm</span>
                  <span>25 cm</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 font-mono space-y-1.5">
                <div>{tLoc.lab2DiameterFormula} {radiusInput} ＝ <strong>{diameter} cm</strong></div>
                <div>{tLoc.lab2PerimeterFormula} {radiusInput} ＝ <strong>{formatNum(perimeterCm, locale)} cm</strong></div>
                <div className="text-emerald-800 font-black text-sm pt-1 border-t border-slate-200">
                  {tLoc.lab2AreaFormula} {radiusInput} · {radiusInput} ＝ <strong>{formatNum(areaCm2, locale)} cm²</strong>
                </div>
              </div>
            </div>

            {/* Αποτελέσματα σε όλες τις Μονάδες (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                {tLoc.lab2ConvTitle}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InCm2}</span>
                  <span className="text-emerald-400 font-black text-lg">{formatNum(areaCm2, locale)} cm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InMm2}</span>
                  <span className="text-sky-400 font-black text-lg">{formatNum(areaMm2, locale)} mm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InDm2}</span>
                  <span className="text-amber-400 font-black text-lg">{formatNum(areaDm2, locale)} dm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">{tLoc.lab2InM2}</span>
                  <span className="text-purple-400 font-black text-lg">{formatNum(areaM2, locale)} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                {tLoc.lab2Warning} ({formatNum(perimeterCm, locale)} cm vs {formatNum(areaCm2, locale)} cm²)
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1DiameterLabel}</span> 1,6 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1RadiusLabel}</span> 1,6 : 2 ＝ 0,8 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob1FormulaLabel}</span> π · ρ²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{tLoc.prob1StepHeader}</span>
                  <div>{tLoc.prob1Step1}</div>
                  <div>{tLoc.prob1Step2}</div>
                  <div>{tLoc.prob1Step3}</div>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2R1Label}</span> 4 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2R2Label}</span> 4 ＋ 1 ＝ 5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{tLoc.prob2RingLabel}</span> Εμεγ － Εμικ
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{tLoc.prob2StepHeader}</span>
                  <div>{tLoc.prob2Step1}</div>
                  <div>{tLoc.prob2Step2}</div>
                  <div>{tLoc.prob2Step3}</div>
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
            href="/st-dimotikou/76-embadon-kiklou-ask"
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
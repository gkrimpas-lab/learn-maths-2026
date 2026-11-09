// pages/st-dimotikou/69-athroisma-gonion.js
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

export default function AthroismaGonionTheoriaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  // Συγκεντρωτικό Λεξικό Μεταφράσεων
  const translations = {
    el: {
      headTitle: "Κατασκευή & Άθροισμα Γωνιών (Τρίγωνα - Τετράπλευρα) - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Μαθαίνουμε πώς κατασκευάζουμε γωνίες, γιατί το άθροισμα γωνιών τριγώνου είναι 180° και τετραπλεύρου 360°, με διαδραστικά εργαστήρια SVG και λυμένα προβλήματα.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      heroBadge: "ΚΕΦΑΛΑΙΟ 69 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Κατασκευή Γωνιών & Άθροισμα Γωνιών Τριγώνου και Τετραπλεύρου",
      heroDesc: "Μαθαίνουμε πώς σχεδιάζουμε με ακρίβεια μια γωνία με χάρακα και μοιρογνωμόνιο, αποδεικνύουμε γιατί το άθροισμα των γωνιών κάθε τριγώνου είναι πάντοτε 180° και κάθε τετραπλεύρου 360°, και υπολογίζουμε άγνωστες γωνίες σε γεωμετρικά σχήματα!",
      heroFeature: "Θεωρία, Κατασκευή Γωνιών, Αθροίσματα 180°/360° & Διαδραστικά Εργαστήρια",
      heroCta: "Δοκίμασε τις Ασκήσεις",

      sec1Title: "Η Θεωρία των Γωνιών σε 4 Βήματα",
      sec1Subtitle: "Από την ακριβή σχεδίαση έως τους θεμελιώδεις κανόνες των πολυγώνων.",

      step1Badge: "ΒΗΜΑ 1",
      step1Tag: "Κατασκευή",
      step1Title: "Πώς Κατασκευάζουμε μια Γωνία;",
      step1Text: "Για να σχεδιάσουμε με ακρίβεια μια γωνία συγκεκριμένου μέτρου (π.χ. 50°):",
      step1Step1: "Χαράσσουμε με τον χάρακα μια αρχική ημιευθεία Οx (τη μία πλευρά).",
      step1Step2: "Τοποθετούμε το κέντρο του μοιρογνωμονίου στην κορυφή Ο και το 0° πάνω στην ημιευθεία.",
      step1Step3: "Σημειώνουμε μια κουκκίδα στην κλίμακα στον επιθυμητό αριθμό μοιρών (π.χ. 50°).",
      step1Step4: "Ενώνουμε με τον χάρακα την κορυφή Ο με την κουκκίδα, σχηματίζοντας τη δεύτερη πλευρά Oy.",
      step1Tip: "💡 Ξεκινάμε πάντα το μέτρημα από το 0° της πλευράς που χαράξαμε, όχι από το 180°!",

      step2Badge: "ΒΗΜΑ 2",
      step2Tag: "Κανόνας 180°",
      step2Title: "Άθροισμα Γωνιών Τριγώνου",
      step2Text: "Σε οποιοδήποτε τρίγωνο στον κόσμο (οξυγώνιο, ορθογώνιο, αμβλυγώνιο, ισόπλευρο, ισοσκελές ή σκαληνό):",
      step2Formula: "Â ＋ B̂ ＋ Γ̂ ＝ 180°",
      step2PaperProof: "Αν κόψουμε τις 3 γωνίες ενός χάρτινου τριγώνου και τις ενώσουμε δίπλα-δίπλα στην ίδια κορυφή, σχηματίζουν ακριβώς μια ευθεία γωνία (180°)!",
      step2Tip: "⚡ Για να βρούμε την 3η γωνία τριγώνου: Αφαιρούμε από το 180° το άθροισμα των άλλων δύο!",

      step3Badge: "ΒΗΜΑ 3",
      step3Tag: "Κανόνας 360°",
      step3Title: "Άθροισμα Γωνιών Τετραπλεύρου",
      step3Text: "Σε οποιοδήποτε τετράπλευρο (τετράγωνο, ορθογώνιο, ρόμβο, τραπέζιο ή τυχαίο):",
      step3Formula: "Â ＋ B̂ ＋ Γ̂ ＋ Δ̂ ＝ 360°",
      step3DiagProofPrefix: "Γιατί; Μια διαγώνιος χωρίζει το τετράπλευρο σε 2 τρίγωνα. Κάθε τρίγωνο έχει άθροισμα 180°, άρα: 2 · 180° ＝ ",
      step3DiagProofSuffix: "360°!",
      step3Tip: "🎯 Στο ορθογώνιο και στο τετράγωνο: 4 · 90° ＝ 360° (4 ορθές γωνίες).",

      step4Badge: "ΒΗΜΑ 4",
      step4Tag: "Ειδικές Περιπτώσεις",
      step4Title: "Ισόπλευρα & Ισοσκελή Τρίγωνα",
      step4Text: "Οι συμμετρίες των πλευρών καθορίζουν και τις γωνίες:",
      step4EquilateralPrefix: "• Ισόπλευρο τρίγωνο: 3 ίσες γωνίες. ",
      step4EquilateralSuffix: " καθεμία.",
      step4Isosceles: "• Ισοσκελές τρίγωνο: Οι 2 γωνίες της βάσης είναι πάντα ίσες μεταξύ τους.",
      step4RightTriangle: "• Ορθογώνιο τρίγωνο: Η μία γωνία είναι 90°. Οι άλλες δύο είναι οξείες και συμπληρωματικές (άθροισμα 90°).",
      step4Tip: "🚀 Ένα τρίγωνο δεν μπορεί να έχει ποτέ δύο ορθές ή δύο αμβλείες γωνίες, γιατί θα ξεπερνούσε τις 180°!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Διαδραστικό Τρίγωνο: Το Μαγικό Άθροισμα των 180° (SVG)",
      lab1Desc: "Άλλαξε τις γωνίες Â και B̂ και παρατήρησε πώς η τρίτη γωνία Γ̂ προσαρμόζεται αυτόματα ώστε το άθροισμα να μένει πάντα σταθερά 180°:",
      lab1SliderALabel: "ΓΩΝΙΑ Â:",
      lab1SliderBLabel: "ΓΩΝΙΑ B̂:",
      lab1AutoCLabel: "Αυτόματος Υπολογισμός Γ̂:",
      lab1TriangleTypeLabel: "Είδος Τριγώνου:",
      lab1SvgFormula: "180°",
      lab1SvgNote: "Όσο κι αν αλλάξουν οι γωνίες, το άθροισμα παραμένει πάντοτε αυστηρά 180°.",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΕΤΡΑΠΛΕΥΡΟ",
      lab2Title: "Εύρεση Άγνωστης Γωνίας Τετραπλεύρου (Άθροισμα 360°)",
      lab2Desc: "Ρύθμισε τις 3 γνωστές γωνίες ενός τετραπλεύρου για να υπολογίσεις αυτόματα την τέταρτη γωνία:",
      lab2AngleA: "Â:",
      lab2AngleB: "B̂:",
      lab2AngleC: "Γ̂:",
      lab2ProofTip: "💡 Απόδειξη: Κάθε τετράπλευρο χωρίζεται με 1 διαγώνιο σε 2 τρίγωνα. Άθροισμα ＝ 2 · 180° ＝ 360°.",
      lab2ResultBadge: "ΖΗΤΟΥΜΕΝΗ 4Η ΓΩΝΙΑ (Δ̂)",
      lab2CheckLabel: "Έλεγχος: ",

      probSecTitle: "Λυμένα Προβλήματα με Αθροίσματα Γωνιών",
      probSecSubtitle: "Εφαρμογές των κανόνων των 180° και 360° σε ρεαλιστικά σενάρια.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΣΤΕΓΗ ΣΠΙΤΙΟΥ",
      prob1Tag: "Ισοσκελές Τρίγωνο",
      prob1Title: "Υπολογισμός Γωνιών Βάσης σε Ισοσκελή Στέγη",
      prob1Desc: "Η ξύλινη σκεπή ενός σπιτιού έχει σχήμα ισοσκελούς τριγώνου. Η γωνία της κορυφής είναι 70°. Πόσες μοίρες είναι καθεμία από τις δύο γωνίες της βάσης της σκεπής;",
      prob1TableHeading: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1ThTop: "Γωνία κορυφής",
      prob1ThTotal: "Σύνολο γωνιών",
      prob1ThBase: "Γωνίες βάσης",
      prob1ThBaseVal: "2 ίσες γωνίες",
      prob1StepsHeading: "Βήματα Επίλυσης:",
      prob1Step1Prefix: "Άθροισμα 2 γωνιών βάσης: 180° － 70° ＝ ",
      prob1Step2Label: "Κάθε γωνία βάσης (ίσες):",
      prob1Tip: "💡 Στο ισοσκελές τρίγωνο, οι γωνίες που βρίσκονται απέναντι από τις ίσες πλευρές είναι πάντοτε ίσες μεταξύ τους!",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΤΡΑΠΕΖΙΟ ΟΙΚΟΠΕΔΟ",
      prob2Tag: "Τετράπλευρο",
      prob2Title: "Εύρεση Άγνωστης Γωνίας σε Οικόπεδο",
      prob2Desc: "Ένα οικόπεδο έχει σχήμα τετραπλεύρου. Ο τοπογράφος μέτρησε τις τρεις γωνίες του και βρήκε ότι είναι 90°, 115° και 80°. Πόσες μοίρες είναι η τέταρτη γωνία του οικοπέδου;",
      prob2TableHeading: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2ThTotal: "Σύνολο",
      prob2ThSum3: "Άθροισμα 3",
      prob2ThCalc: "Πράξη",
      prob2StepsHeading: "Βήματα Επίλυσης:",
      prob2Step1: "Προσθέτουμε τις 3 γνωστές γωνίες: 90° ＋ 115° ＋ 80° ＝ 285°.",
      prob2Step2: "Αφαιρούμε από το 360°: 360° － 285° ＝ 75°.",
      prob2Tip: "⚡ Επαλήθευση: 90° ＋ 115° ＋ 80° ＋ 75° ＝ 360°, άρα ο υπολογισμός είναι ακριβής.",

      alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
      alertItem1Title: "Μην μπερδεύετε το άθροισμα τριγώνου (180°) με του τετραπλεύρου (360°):",
      alertItem1Desc: " Σε κάθε τρίγωνο το άθροισμα είναι πάντα 180°. Σε κάθε τετράπλευρο είναι διπλάσιο, δηλαδή 360° (διότι αποτελείται από 2 τρίγωνα).",
      alertItem2Title: "Ένα τρίγωνο δεν μπορεί να έχει 2 ορθές γωνίες:",
      alertItem2Desc: " Αν είχε δύο ορθές (90° ＋ 90° ＝ 180°), η τρίτη γωνία θα έπρεπε να είναι 0°, πράγμα αδύνατο.",
      alertItem3Title: "Προσοχή στην ορθή γωνία:",
      alertItem3Desc: " Όταν ένα πρόβλημα αναφέρει «ορθογώνιο τρίγωνο» χωρίς να δίνει νούμερο για τη μία γωνία, θυμόμαστε ότι αυτή είναι ακριβώς 90°!",

      ctaTitle: "Ώρα για Εξάσκηση στα Αθροίσματα Γωνιών!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με κατασκευή γωνιών, τρίγωνα και τετράπλευρα για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων",

      triangleTypes: {
        right: 'Ορθογώνιο Τρίγωνο',
        obtuse: 'Αμβλυγώνιο Τρίγωνο',
        acute: 'Οξυγώνιο Τρίγωνο'
      }
    },
    en: {
      headTitle: "Angle Construction & Angle Sums (Triangles - Quadrilaterals) - 6th Grade | LearnMaths.gr",
      headDesc: "Learn how to construct angles, discover why triangles sum to 180° and quadrilaterals to 360°, with interactive SVG labs and solved problems.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      heroBadge: "CHAPTER 69 • 6TH GRADE",
      heroTitle: "Angle Construction & Sum of Angles in Triangles and Quadrilaterals",
      heroDesc: "Learn how to accurately draw an angle using a ruler and protractor, prove why the sum of angles in any triangle is always 180° and in any quadrilateral 360°, and calculate missing angles in geometric figures!",
      heroFeature: "Theory, Angle Construction, 180°/360° Sums & Interactive Labs",
      heroCta: "Try the Exercises",

      sec1Title: "Angle Theory in 4 Steps",
      sec1Subtitle: "From precise angle drawing to foundational polygon rules.",

      step1Badge: "STEP 1",
      step1Tag: "Construction",
      step1Title: "How to Construct an Angle?",
      step1Text: "To accurately draw an angle of a given measure (e.g. 50°):",
      step1Step1: "Draw an initial ray Ox using a straightedge (one arm of the angle).",
      step1Step2: "Align the center mark of the protractor with vertex O and the 0° mark along the ray.",
      step1Step3: "Mark a reference dot on the scale at the desired degree measure (e.g. 50°).",
      step1Step4: "Draw a straight line connecting vertex O to the dot, forming the second ray Oy.",
      step1Tip: "💡 Always begin counting from 0° on the aligned arm, never from 180°!",

      step2Badge: "STEP 2",
      step2Tag: "180° Rule",
      step2Title: "Angle Sum of a Triangle",
      step2Text: "In any triangle in the world (acute, right, obtuse, equilateral, isosceles, or scalene):",
      step2Formula: "Â ＋ B̂ ＋ Ĉ ＝ 180°",
      step2PaperProof: "If you tear off the 3 corners of a paper triangle and arrange them vertex-to-vertex, they form a straight angle (180°)!",
      step2Tip: "⚡ To find the 3rd angle of a triangle: Subtract the sum of the other two angles from 180°!",

      step3Badge: "STEP 3",
      step3Tag: "360° Rule",
      step3Title: "Angle Sum of a Quadrilateral",
      step3Text: "In any quadrilateral (square, rectangle, rhombus, trapezoid, or irregular):",
      step3Formula: "Â ＋ B̂ ＋ Ĉ ＋ D̂ ＝ 360°",
      step3DiagProofPrefix: "Why? A diagonal splits any quadrilateral into 2 triangles. Each triangle sums to 180°, so: 2 · 180° ＝ ",
      step3DiagProofSuffix: "360°!",
      step3Tip: "🎯 In a rectangle or square: 4 · 90° ＝ 360° (4 right angles).",

      step4Badge: "STEP 4",
      step4Tag: "Special Cases",
      step4Title: "Equilateral & Isosceles Triangles",
      step4Text: "Side symmetries dictate angle relationships:",
      step4EquilateralPrefix: "• Equilateral triangle: 3 equal angles. ",
      step4EquilateralSuffix: " each.",
      step4Isosceles: "• Isosceles triangle: The 2 base angles opposite the equal sides are always equal.",
      step4RightTriangle: "• Right triangle: One angle is 90°. The remaining two angles are acute and complementary (sum to 90°).",
      step4Tip: "🚀 A triangle can never have two right angles or two obtuse angles, because the sum would exceed 180°!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "Interactive Triangle: The Constant 180° Sum (SVG)",
      lab1Desc: "Adjust angles Â and B̂ and observe how angle Ĉ dynamically adapts so that their sum is strictly 180°:",
      lab1SliderALabel: "ANGLE Â:",
      lab1SliderBLabel: "ANGLE B̂:",
      lab1AutoCLabel: "Automatic Calculation of Ĉ:",
      lab1TriangleTypeLabel: "Triangle Classification:",
      lab1SvgFormula: "180°",
      lab1SvgNote: "No matter how you change the angles, the sum remains strictly 180°.",

      lab2Badge: "📐 INTERACTIVE LAB 2: QUADRILATERAL",
      lab2Title: "Finding the Missing 4th Angle (360° Sum)",
      lab2Desc: "Adjust 3 known angles of a quadrilateral to calculate the fourth angle automatically:",
      lab2AngleA: "Â:",
      lab2AngleB: "B̂:",
      lab2AngleC: "Ĉ:",
      lab2ProofTip: "💡 Proof: A diagonal divides every quadrilateral into 2 triangles. Sum ＝ 2 · 180° ＝ 360°.",
      lab2ResultBadge: "REQUIRED 4TH ANGLE (D̂)",
      lab2CheckLabel: "Check: ",

      probSecTitle: "Solved Problems with Angle Sums",
      probSecSubtitle: "Real-world applications of 180° and 360° angle theorems.",

      prob1Badge: "PROBLEM 1: ROOF STRUCTURE",
      prob1Tag: "Isosceles Triangle",
      prob1Title: "Calculating Base Angles of an Isosceles Roof",
      prob1Desc: "A wooden roof truss forms an isosceles triangle. The apex angle is 70°. What is the measure of each base angle?",
      prob1TableHeading: "PROBLEM DATA",
      prob1ThTop: "Apex angle",
      prob1ThTotal: "Total sum",
      prob1ThBase: "Base angles",
      prob1ThBaseVal: "2 equal angles",
      prob1StepsHeading: "Solution Steps:",
      prob1Step1Prefix: "Sum of 2 base angles: 180° － 70° ＝ ",
      prob1Step2Label: "Each base angle (equal):",
      prob1Tip: "💡 In an isosceles triangle, angles opposite the equal sides are always equal!",

      prob2Badge: "PROBLEM 2: TRAPEZOIDAL PLOT",
      prob2Tag: "Quadrilateral",
      prob2Title: "Finding Missing Angle in a Survey Plot",
      prob2Desc: "A land parcel is shaped as a quadrilateral. A surveyor measured three angles: 90°, 115°, and 80°. What is the fourth angle?",
      prob2TableHeading: "CALCULATION DATA",
      prob2ThTotal: "Total sum",
      prob2ThSum3: "Sum of 3 angles",
      prob2ThCalc: "Calculation",
      prob2StepsHeading: "Solution Steps:",
      prob2Step1: "Sum the 3 known angles: 90° ＋ 115° ＋ 80° ＝ 285°.",
      prob2Step2: "Subtract from 360°: 360° － 285° ＝ 75°.",
      prob2Tip: "⚡ Verification: 90° ＋ 115° ＋ 80° ＋ 75° ＝ 360°, confirming accuracy.",

      alertTitle: "Caution / Common Errors to Avoid",
      alertItem1Title: "Do not confuse triangle sum (180°) with quadrilateral sum (360°):",
      alertItem1Desc: " Every triangle sums to 180°. Every quadrilateral sums to double that, 360° (as it consists of 2 triangles).",
      alertItem2Title: "A triangle cannot have 2 right angles:",
      alertItem2Desc: " Two right angles (90° ＋ 90° ＝ 180°) leave 0° for the third vertex, which is geometrically impossible.",
      alertItem3Title: "Watch out for right angles in word problems:",
      alertItem3Desc: " When a problem mentions a 'right triangle' without stating a degree number, remember one angle is exactly 90°!",

      ctaTitle: "Time to Practice Angle Sums!",
      ctaDesc: "Test your skills with 10 interactive questions on angle construction, triangles, and quadrilaterals for 6th Grade.",
      ctaButton: "Start Exercises",

      triangleTypes: {
        right: 'Right-angled Triangle',
        obtuse: 'Obtuse-angled Triangle',
        acute: 'Acute-angled Triangle'
      }
    }
  };

  const t = translations[locale];

  // Εργαστήριο 1: Διαδραστικό Τρίγωνο (Άθροισμα 180°)
  const [angleA, setAngleA] = useState(42);
  const [angleB, setAngleB] = useState(59);

  // Η 3η γωνία υπολογίζεται δυναμικά ώστε το άθροισμα να είναι πάντα 180°
  const angleC = useMemo(() => {
    return Math.max(1, 180 - (angleA + angleB));
  }, [angleA, angleB]);

  // Ταξινόμηση τριγώνου ως προς τις γωνίες
  const triangleType = useMemo(() => {
    const maxAngle = Math.max(angleA, angleB, angleC);
    if (maxAngle === 90) return { name: t.triangleTypes.right, badge: 'bg-emerald-100 text-emerald-800' };
    if (maxAngle > 90) return { name: t.triangleTypes.obtuse, badge: 'bg-amber-100 text-amber-800' };
    return { name: t.triangleTypes.acute, badge: 'bg-sky-100 text-sky-800' };
  }, [angleA, angleB, angleC, t]);

  // Υπολογισμός συντεταγμένων κορυφών SVG με auto-scaling
  const { polyPoints, topX, topY, bX, bY, cX, cY } = useMemo(() => {
    const baseLen = 100;
    const radB = (angleB * Math.PI) / 180;
    const radC = (angleC * Math.PI) / 180;
    const radA = (angleA * Math.PI) / 180;

    const sideC = (baseLen * Math.sin(radC)) / Math.sin(radA);
    const rawAx = sideC * Math.cos(radB);
    const rawAy = -sideC * Math.sin(radB);
    const rawBx = 0;
    const rawBy = 0;
    const rawCx = baseLen;
    const rawCy = 0;

    const minX = Math.min(rawAx, rawBx, rawCx);
    const maxX = Math.max(rawAx, rawBx, rawCx);
    const minY = Math.min(rawAy, rawBy, rawCy);
    const maxY = Math.max(rawAy, rawBy, rawCy);

    const rawW = Math.max(1, maxX - minX);
    const rawH = Math.max(1, maxY - minY);

    const targetW = 270;
    const targetH = 175;
    const scale = Math.min(targetW / rawW, targetH / rawH);

    const svgCenterX = 190;
    const svgCenterY = 165;

    const midRawX = (minX + maxX) / 2;
    const midRawY = (minY + maxY) / 2;

    const toSvgX = (x) => svgCenterX + (x - midRawX) * scale;
    const toSvgY = (y) => svgCenterY + (y - midRawY) * scale;

    const ax = toSvgX(rawAx);
    const ay = toSvgY(rawAy);
    const bx = toSvgX(rawBx);
    const by = toSvgY(rawBy);
    const cx = toSvgX(rawCx);
    const cy = toSvgY(rawCy);

    return {
      polyPoints: `${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}`,
      topX: ax,
      topY: ay,
      bX: bx,
      bY: by,
      cX: cx,
      cY: cy
    };
  }, [angleA, angleB, angleC]);

  // Εργαστήριο 2: Τετράπλευρο & Εύρεση 4ης Γωνίας (Άθροισμα 360°)
  const [qA, setQA] = useState(105);
  const [qB, setQB] = useState(75);
  const [qC, setQC] = useState(110);

  const qD = useMemo(() => {
    return Math.max(1, 360 - (qA + qB + qC));
  }, [qA, qB, qC]);

  return (
    <Layout
      title={t.headTitle}
      description={t.headDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/69-athroisma-gonion-ask"
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
              href="/st-dimotikou/69-athroisma-gonion-ask"
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
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 text-[11px] sm:text-xs">
                    <li>{t.step1Step1}</li>
                    <li>{t.step1Step2}</li>
                    <li>{t.step1Step3}</li>
                    <li>{t.step1Step4}</li>
                  </ol>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-amber-900 font-black text-sm sm:text-base">
                    {t.step2Formula}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    {t.step2PaperProof}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-900 font-black text-sm sm:text-base">
                    {t.step3Formula}
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans text-left pt-1">
                    {t.step3DiagProofPrefix}<strong>{t.step3DiagProofSuffix}</strong>
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 4: ΜΕ ΚΑΝΟΝΙΚΗ ΚΛΑΣΜΑΤΙΚΗ ΜΟΡΦΗ */}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2.5">
                  <div className="flex items-center flex-wrap gap-1">
                    <span>{t.step4EquilateralPrefix}</span>
                    <Fraction n="180°" d="3" />
                    <span>＝ <strong>60°</strong>{t.step4EquilateralSuffix}</span>
                  </div>
                  <div>
                    {t.step4Isosceles}
                  </div>
                  <div>
                    {t.step4RightTriangle}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΤΡΙΓΩΝΟ & ΑΘΡΟΙΣΜΑ 180° */}
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

            {/* Χειριστήρια & Υπολογισμοί (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Slider Γωνίας A */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1SliderALabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(angleA, locale)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={1}
                  value={angleA}
                  onChange={(e) => {
                    const newA = Number(e.target.value);
                    if (newA + angleB < 179) setAngleA(newA);
                  }}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Slider Γωνίας B */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1SliderBLabel)}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(angleB, locale)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={1}
                  value={angleB}
                  onChange={(e) => {
                    const newB = Number(e.target.value);
                    if (angleA + newB < 179) setAngleB(newB);
                  }}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Αυτόματος Υπολογισμός Γωνίας Γ */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-950">{t.lab1AutoCLabel}</span>
                  <span className="font-mono text-lg font-black text-emerald-700">
                    {formatNum(angleC, locale)}°
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-[11px] sm:text-xs">
                  180° － ({formatNum(angleA, locale)}° ＋ {formatNum(angleB, locale)}°) ＝ 180° － {formatNum(angleA + angleB, locale)}° ＝ <strong>{formatNum(angleC, locale)}°</strong>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-slate-700 font-semibold">{t.lab1TriangleTypeLabel}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${triangleType.badge}`}>
                    {triangleType.name}
                  </span>
                </div>
              </div>
            </div>

            {/* SVG Visualizer Τριγώνου (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 320"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* Τρίγωνο */}
                <polygon
                  points={polyPoints}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#818cf8"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />

                {/* Κορυφή A (Πάνω) */}
                <circle cx={topX} cy={topY} r="5.5" fill="#f43f5e" stroke="#ffffff" strokeWidth="1.5" />
                <text x={topX} y={topY - 14} fill="#f1f5f9" fontSize="13" fontWeight="bold" textAnchor="middle">
                  Â ＝ {formatNum(angleA, locale)}°
                </text>

                {/* Κορυφή B (Κάτω Αριστερά) */}
                <circle cx={bX} cy={bY} r="5.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                <text x={bX} y={bY + 24} fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                  B̂ ＝ {formatNum(angleB, locale)}°
                </text>

                {/* Κορυφή C (Κάτω Δεξιά) */}
                <circle cx={cX} cy={cY} r="5.5" fill="#34d399" stroke="#ffffff" strokeWidth="1.5" />
                <text x={cX} y={cY + 24} fill="#34d399" fontSize="13" fontWeight="bold" textAnchor="middle">
                  {locale === 'el' ? 'Γ̂' : 'Ĉ'} ＝ {formatNum(angleC, locale)}°
                </text>

                {/* Ένδειξη Αθροίσματος στο κέντρο */}
                <text x="190" y="275" fill="#f59e0b" fontSize="14" fontWeight="900" textAnchor="middle">
                  {formatNum(angleA, locale)}° ＋ {formatNum(angleB, locale)}° ＋ {formatNum(angleC, locale)}° ＝ {t.lab1SvgFormula}
                </text>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {t.lab1SvgNote}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΕΤΡΑΠΛΕΥΡΟ & ΑΘΡΟΙΣΜΑ 360° */}
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

            {/* Ρυθμίσεις 3 Γωνιών (6 στήλες) */}
            <div className="lg:col-span-6 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="font-bold text-slate-500 block">{t.lab2AngleA} {formatNum(qA, locale)}°</span>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={qA}
                    onChange={(e) => setQA(Number(e.target.value))}
                    className="w-full mt-1 accent-indigo-600"
                  />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="font-bold text-slate-500 block">{t.lab2AngleB} {formatNum(qB, locale)}°</span>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={qB}
                    onChange={(e) => setQB(Number(e.target.value))}
                    className="w-full mt-1 accent-sky-600"
                  />
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                  <span className="font-bold text-slate-500 block">{t.lab2AngleC} {formatNum(qC, locale)}°</span>
                  <input
                    type="range"
                    min={40}
                    max={140}
                    value={qC}
                    onChange={(e) => setQC(Number(e.target.value))}
                    className="w-full mt-1 accent-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                {t.lab2ProofTip}
              </div>
            </div>

            {/* Αποτέλεσμα 4ης Γωνίας (6 στήλες) */}
            <div className="lg:col-span-6 bg-purple-50/70 p-5 rounded-3xl border border-purple-200 text-center space-y-2">
              <span className="text-xs text-purple-900 block font-bold tracking-wider">
                {toCleanUppercase(t.lab2ResultBadge)}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-purple-800 font-mono">
                {formatNum(qD, locale)}°
              </div>
              <div className="text-xs text-slate-700 font-mono">
                360° － ({formatNum(qA, locale)}° ＋ {formatNum(qB, locale)}° ＋ {formatNum(qC, locale)}°) ＝ 360° － {formatNum(qA + qB + qC, locale)}° ＝ <strong>{formatNum(qD, locale)}°</strong>
              </div>
              <div className="text-[11px] text-purple-950 font-sans pt-1">
                {t.lab2CheckLabel}{formatNum(qA, locale)}° ＋ {formatNum(qB, locale)}° ＋ {formatNum(qC, locale)}° ＋ {formatNum(qD, locale)}° ＝ <strong>360°</strong>!
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

            {/* ΠΡΟΒΛΗΜΑ 1: ΜΕ ΚΑΝΟΝΙΚΗ ΚΛΑΣΜΑΤΙΚΗ ΜΟΡΦΗ */}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThTop}</span> 70°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThTotal}</span> 180°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThBase}</span> {t.prob1ThBaseVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeading}</span>
                  <div>
                    <strong>{t.prob1Step1Prefix}</strong><strong>110°</strong>.
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    <strong>{t.prob1Step2Label}</strong>
                    <Fraction n="110°" d="2" />
                    <span>＝ <strong className="text-blue-700">55°</strong>.</span>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThTotal}</span> 360°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThSum3}</span> 90° ＋ 115° ＋ 80° ＝ 285°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThCalc}</span> 360° － 285°
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeading}</span>
                  <div>
                    <strong>{t.prob2Step1.split(':')[0]}:</strong>{t.prob2Step1.split(':')[1]}
                  </div>
                  <div>
                    <strong>{t.prob2Step2.split(':')[0]}:</strong> 360° － 285° ＝ <strong className="text-amber-700">75°</strong>.
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
            href="/st-dimotikou/69-athroisma-gonion-ask"
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
// pages/st-dimotikou/71-simmetria.js
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

// Συγκεντρωτικό λεξικό μεταφράσεων i18n
const TRANSLATIONS = {
  el: {
    pageTitle: "Αξονική Συμμετρία & Άξονας Συμμετρίας - ΣΤ' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε τι είναι η αξονική συμμετρία, πώς βρίσκουμε συμμετρικά σημεία και πόσους άξονες συμμετρίας έχουν τα γεωμετρικά σχήματα με διαδραστικά εργαστήρια αναδίπλωσης SVG.",
    backText: "ΣΤ' Δημοτικού",
    actionButtonText: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 71 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Αξονική Συμμετρία • Ο Άξονας Συμμετρίας",
    heroDesc: "Ανακαλύπτουμε τη μαγεία της αρμονίας και της ισορροπίας στη φύση και τη γεωμετρία! Μαθαίνουμε πότε δύο σχήματα είναι συμμετρικά ως προς άξονα, πώς λειτουργεί η κάθετη απόσταση από τον καθρέφτη της γεωμετρίας και βλέπουμε ζωντανά πώς διπλώνει κάθε σχήμα πάνω στον άξονά του.",
    heroSubbadge: "Θεωρία, Συμμετρικά Σημεία, Εργαστήριο Αναδίπλωσης (Folding) & SVG",
    heroTryExercises: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Η Αξονική Συμμετρία σε 4 Βήματα",
    stepsSectionSubtitle: "Από την έννοια της αναδίπλωσης μέχρι τις μαθηματικές ιδιότητες των συμμετρικών σχημάτων.",

    step1Badge: "ΒΗΜΑ 1",
    step1Category: "Έννοια",
    step1Title: "Τι είναι ο Άξονας Συμμετρίας;",
    step1P1: "Άξονας συμμετρίας ενός σχήματος ονομάζεται μια ευθεία γραμμή (ε) η οποία χωρίζει το σχήμα σε δύο ακριβώς ίσα μέρη, τέτοια ώστε αν διπλώσουμε το χαρτί κατά μήκος της:",
    step1Bullet: "• Τα δύο μέρη εφαρμόζουν απόλυτα το ένα πάνω στο άλλο!",
    step1P2: "Ένα σχήμα μπορεί να έχει έναν, περισσότερους ή και κανέναν άξονα συμμετρίας.",
    step1Tip: "💡 Σκεφτείτε τον άξονα συμμετρίας σαν έναν καθρέφτη: ό,τι υπάρχει στα αριστερά, αντικατοπτρίζεται ακριβώς στα δεξιά.",

    step2Badge: "ΒΗΜΑ 2",
    step2Category: "Κανόνας",
    step2Title: "Συμμετρικά Σημεία ως προς Ευθεία",
    step2P1: "Δύο σημεία Α και Α' είναι συμμετρικά ως προς ευθεία (ε) όταν ισχύουν ταυτόχρονα δύο κανόνες:",
    step2Rule1: "1. Το τμήμα ΑΑ' είναι ΚΑΘΕΤΟ στον άξονα (γωνία 90°).",
    step2Rule2: "2. Τα σημεία Α και Α' ισαπέχουν από τον άξονα (απόσταση d₁ ＝ d₂).",
    step2P2: "Δηλαδή, ο άξονας συμμετρίας είναι η μεσοκάθετος του ευθύγραμμου τμήματος ΑΑ'!",
    step2Tip: "⚡ Αν ένα σημείο βρίσκεται ακριβώς πάνω στον άξονα συμμετρίας, τότε το συμμετρικό του είναι το ίδιο το σημείο!",

    step3Badge: "ΒΗΜΑ 3",
    step3Category: "Πολύγωνα",
    step3Title: "Άξονες σε Γνωστά Σχήματα",
    step3P1: "Το πλήθος των αξόνων συμμετρίας εξαρτάται από τις συμμετρίες του σχήματος:",
    polyIsosceles: "Ισοσκελές τρίγωνο:",
    polyIsoscelesCount: "1 άξονας",
    polyEquilateral: "Ισόπλευρο τρίγωνο:",
    polyEquilateralCount: "3 άξονες",
    polyRectangle: "Ορθογώνιο:",
    polyRectangleCount: "2 άξονες (οι μεσοκάθετες)",
    polySquare: "Τετράγωνο:",
    polySquareCount: "4 άξονες",
    polyRhombus: "Ρόμβος:",
    polyRhombusCount: "2 άξονες (οι διαγώνιοι)",
    polyCircle: "Κύκλος:",
    polyCircleCount: "Άπειροι άξονες",
    step3Tip: "🎯 Κάθε κανονικό ν-γωνο έχει ακριβώς ν άξονες συμμετρίας!",

    step4Badge: "ΒΗΜΑ 4",
    step4Category: "Ιδιότητες",
    step4Title: "Διατήρηση Μηκών & Γωνιών",
    step4P1: "Η αξονική συμμετρία είναι μια γεωμετρική μετακίνηση που διατηρεί ακέραιες όλες τις μετρήσεις:",
    step4Prop1: "• Ίσα μήκη: Το συμμετρικό ενός ευθύγραμμου τμήματος είναι ίσο με το αρχικό.",
    step4Prop2: "• Ίσες γωνίες: Οι γωνίες δεν μεταβάλλονται καθόλου.",
    step4Prop3: "• Ίσα εμβαδά & περίμετροι: Δύο συμμετρικά σχήματα είναι απολύτως ίσα μεταξύ τους!",
    step4Tip: "🚀 Το συμμετρικό σχήμα αλλάζει μόνο προσανατολισμό (κατοπτρικό είδωλο), όχι μέγεθος!",

    lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Διαδραστικός Καθρεφτισμός Σημείου σε Άξονα Συμμετρίας (SVG)",
    lab1Subtitle: "Σύρε τους ρυθμιστές για να αλλάξεις τη θέση του σημείου Α. Παρατήρησε πώς το συμμετρικό σημείο Α' κινείται αυτόματα ώστε η απόσταση από τον άξονα να είναι πάντα ίση:",
    lab1ControlX: "ΟΡΙΖΟΝΤΙΑ ΘΕΣΗ ΣΗΜΕΙΟΥ Α (X):",
    lab1ControlY: "ΚΑΤΑΚΟΡΥΦΗ ΘΕΣΗ (Y):",
    lab1DistA: "Απόσταση Α από τον Άξονα:",
    lab1DistAPrime: "Απόσταση Α' από τον Άξονα:",
    lab1PerpNote: "✓ Το ευθύγραμμο τμήμα ΑΑ' τέμνει τον κατακόρυφο άξονα κάθετα και διχοτομείται από αυτόν.",
    lab1AxisLabel: "Άξονας (ε)",
    lab1Caption: "Το γαλάζιο σημείο Α και το μωβ σημείο Α' ισαπέχουν πάντα από τον κίτρινο διακεκομμένο άξονα.",

    lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΔΙΠΛΩΣΗ (FOLDING)",
    lab2Title: "Δίπλωσε το Σχήμα στον Άξονα και Δες αν Ταυτίζεται!",
    lab2Subtitle: "Επίλεξε γεωμετρικό σχήμα και άξονα αναδίπλωσης. Σύρε την μπάρα αναδίπλωσης για να διπλώσεις το χαρτί κατά μήκος του άξονα:",
    lab2SelectShape: "1. ΕΠΙΛΟΓΗ ΣΧΗΜΑΤΟΣ:",
    lab2SelectAxis: "2. ΕΠΙΛΟΓΗ ΑΞΟΝΑ ΑΝΑΔΙΠΛΩΣΗΣ:",
    lab2FoldLabel: "ΑΝΑΔΙΠΛΩΣΗ (ΔΙΠΛΩΜΑ):",
    lab2FoldOpen: "0% (Ανοιχτό)",
    lab2FoldMid: "50% (Δίπλωμα)",
    lab2FoldFull: "100% (Πλήρες Δίπλωμα)",
    lab2PromptDrag: "👉 Σύρε την μπάρα στο 100% για να ολοκληρωθεί το δίπλωμα και να ελέγξεις αν εφαρμόζουν τα δύο μέρη!",
    lab2SvgInitial: "Αρχικό Ανοιχτό Σχήμα (0%)",
    lab2SvgProgress: "Αναδίπλωση σε εξέλιξη",
    lab2SvgMatch: "✓ Τέλεια Εφαρμογή! Άξονας Συμμετρίας.",
    lab2SvgMismatch: "✗ Δεν εφαρμόζουν! Περισσεύουν γωνίες.",
    lab2Caption: "Το γαλάζιο μισό μένει σταθερό και το μωβ διπλώνει κατά μήκος του κίτρινου άξονα.",
    axisTagIs: "Άξονας",
    axisTagNot: "Όχι Άξονας",

    problemsTitle: "Λυμένα Προβλήματα με Αξονική Συμμετρία",
    problemsSubtitle: "Εφαρμογές των ιδιοτήτων της συμμετρίας σε γεωμετρικές κατασκευές.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΩΝ",
    prob1Category: "Ισαπέχοντα Σημεία",
    prob1Title: "Υπολογισμός Συνολικής Απόστασης Συμμετρικών Σημείων",
    prob1P1: "Ένα σημείο Α απέχει από έναν κατακόρυφο άξονα συμμετρίας (ε) απόσταση 4,5 cm. Πόσο απέχει το συμμετρικό του σημείο Α' από τον άξονα και πόση είναι η συνολική απόσταση μεταξύ των δύο σημείων (ΑΑ');",
    prob1DataHeader: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
    prob1DataA: "Απόσταση Α",
    prob1DataProp: "Ιδιότητα",
    prob1DataPropVal: "Ίση απόσταση",
    prob1DataTotal: "Τμήμα ΑΑ'",
    prob1StepsHeader: "Βήματα Επίλυσης:",
    prob1Step1Label: "Απόσταση Α' από τον άξονα:",
    prob1Step1Text: "Ίση με του Α, δηλαδή 4,5 cm.",
    prob1Step2Label: "Συνολική απόσταση ΑΑ':",
    prob1Step2Text: "4,5 cm ＋ 4,5 cm ＝ 9 cm (ή 2 · 4,5 cm ＝ 9 cm).",
    prob1Tip: "💡 Ο άξονας συμμετρίας περνάει ακριβώς από το μέσο του ευθύγραμμου τμήματος ΑΑ'.",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΣΥΜΜΕΤΡΙΑ ΤΡΙΓΩΝΟΥ",
    prob2Category: "Διατήρηση Μεγεθών",
    prob2Title: "Περίμετρος και Εμβαδόν Συμμετρικού Τριγώνου",
    prob2P1: "Ένα ορθογώνιο τρίγωνο έχει πλευρές 3 cm, 4 cm και 5 cm, και εμβαδόν 6 cm². Κατασκευάζουμε το συμμετρικό του τρίγωνο ως προς έναν άξονα (ε). Ποια θα είναι η περίμετρος και το εμβαδόν του νέου τριγώνου;",
    prob2DataHeader: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
    prob2DataSides: "Πλευρές",
    prob2DataSidesVal: "3, 4, 5 cm",
    prob2DataPerim: "Περίμετρος",
    prob2DataPerimVal: "3 ＋ 4 ＋ 5 ＝ 12 cm",
    prob2DataArea: "Εμβαδόν",
    prob2DataAreaVal: "6 cm²",
    prob2StepsHeader: "Βήματα Επίλυσης:",
    prob2Step1: "Η αξονική συμμετρία διατηρεί τα μήκη των πλευρών: οι νέες πλευρές είναι πάλι 3 cm, 4 cm και 5 cm.",
    prob2Step2Label: "Νέα περίμετρος:",
    prob2Step2Val: "3 ＋ 4 ＋ 5 ＝ 12 cm.",
    prob2Step3Label: "Νέο εμβαδόν:",
    prob2Step3Val: "Παραμένει απολύτως ίσο, δηλαδή 6 cm².",
    prob2Tip: "⚡ Δύο συμμετρικά σχήματα είναι απολύτως ίσα μεταξύ τους σε όλα τα μεγέθη (μήκη, γωνίες, περίμετρο και εμβαδόν)!",

    alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
    alertItem1Strong: "Οι διαγώνιοι του ορθογωνίου ΔΕΝ είναι άξονες συμμετρίας:",
    alertItem1Text: "Όπως αποδείξατε στο Εργαστήριο Αναδίπλωσης, αν διπλώσουμε το επίμηκες ορθογώνιο στη διαγώνιό του, τα δύο τρίγωνα εξέχουν έντονα και δεν ταυτίζονται! Οι μοναδικοί 2 άξονες συμμετρίας του ορθογωνίου είναι οι μεσοκάθετες των πλευρών του.",
    alertItem2Strong: "Το πλάγιο παραλληλόγραμμο δεν έχει κανέναν άξονα συμμετρίας:",
    alertItem2Text: "Έχει κεντρική συμμετρία, αλλά κανέναν άξονα αναδίπλωσης.",
    alertItem3Strong: "Η απόσταση μετριέται πάντα κάθετα:",
    alertItem3Text: "Το συμμετρικό σημείο βρίσκεται πάνω στην ευθεία που σχηματίζει αυστηρά γωνία 90° με τον άξονα.",

    footerTitle: "Ώρα για Εξάσκηση στην Αξονική Συμμετρία!",
    footerDesc: "Δοκίμασε τις δυνάμεις σου στις διαδραστικές ασκήσεις με άξονες συμμετρίας, καθρεφτισμούς σημείων και γεωμετρικά σχήματα για τη ΣΤ' Δημοτικού.",
    footerButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Axial Symmetry & Axis of Symmetry - 6th Grade Math | LearnMaths.gr",
    pageDesc: "Learn about axial symmetry, finding reflection points, and the axes of symmetry in geometric figures with interactive SVG folding labs.",
    backText: "6th Grade",
    actionButtonText: "🎯 Exercises",
    chapterBadge: "CHAPTER 71 • 6TH GRADE",
    heroTitle: "Axial Symmetry • The Axis of Symmetry",
    heroDesc: "Discover the harmony and balance of nature and geometry! Learn when two figures are symmetric with respect to an axis, how perpendicular distance works in geometric reflections, and watch real-time folding along any axis.",
    heroSubbadge: "Theory, Symmetric Points, Folding Lab & SVG Visualizer",
    heroTryExercises: "Try the Exercises",

    stepsSectionTitle: "Axial Symmetry in 4 Steps",
    stepsSectionSubtitle: "From the physical concept of folding to the rigorous geometric properties of symmetric shapes.",

    step1Badge: "STEP 1",
    step1Category: "Concept",
    step1Title: "What is an Axis of Symmetry?",
    step1P1: "An axis of symmetry of a shape is a straight line (d) that divides the shape into two identical halves, such that if we fold the sheet along this line:",
    step1Bullet: "• Both halves coincide and overlap perfectly!",
    step1P2: "A shape may have one, multiple, or no axes of symmetry at all.",
    step1Tip: "💡 Think of the axis of symmetry as a mirror: whatever lies on the left is faithfully reflected on the right.",

    step2Badge: "STEP 2",
    step2Category: "Rule",
    step2Title: "Symmetric Points with Respect to a Line",
    step2P1: "Two points A and A' are symmetric with respect to a line (d) when two conditions are simultaneously satisfied:",
    step2Rule1: "1. The segment AA' is PERPENDICULAR to the axis (forming a 90° angle).",
    step2Rule2: "2. Points A and A' are EQUIDISTANT from the axis (distance d₁ ＝ d₂).",
    step2P2: "In other words, the axis of symmetry is the perpendicular bisector of segment AA'!",
    step2Tip: "⚡ If a point lies directly on the axis of symmetry, its symmetric image is the point itself!",

    step3Badge: "STEP 3",
    step3Category: "Polygons",
    step3Title: "Axes of Symmetry in Common Shapes",
    step3P1: "The number of axes depends on the inherent geometric properties of each shape:",
    polyIsosceles: "Isosceles triangle:",
    polyIsoscelesCount: "1 axis",
    polyEquilateral: "Equilateral triangle:",
    polyEquilateralCount: "3 axes",
    polyRectangle: "Rectangle:",
    polyRectangleCount: "2 axes (perpendicular bisectors of sides)",
    polySquare: "Square:",
    polySquareCount: "4 axes",
    polyRhombus: "Rhombus:",
    polyRhombusCount: "2 axes (the diagonals)",
    polyCircle: "Circle:",
    polyCircleCount: "Infinitely many axes",
    step3Tip: "🎯 Every regular n-gon has exactly n axes of symmetry!",

    step4Badge: "STEP 4",
    step4Category: "Properties",
    step4Title: "Conservation of Lengths & Angles",
    step4P1: "Axial symmetry is a rigid geometric transformation (isometry) that preserves all geometric metrics:",
    step4Prop1: "• Equal lengths: The symmetric image of a segment has the exact same length.",
    step4Prop2: "• Equal angles: Angle measures do not change at all.",
    step4Prop3: "• Equal areas & perimeters: Two symmetric figures are strictly congruent!",
    step4Tip: "🚀 The reflected figure only changes its orientation (mirror image), not its size or proportions!",

    lab1Badge: "🔬 INTERACTIVE LAB 1",
    lab1Title: "Interactive Point Reflection Across an Axis (SVG)",
    lab1Subtitle: "Drag the sliders to change the position of point A. Notice how the symmetric point A' mirrors automatically so that its distance from the axis remains identical:",
    lab1ControlX: "HORIZONTAL POSITION OF POINT A (X):",
    lab1ControlY: "VERTICAL POSITION (Y):",
    lab1DistA: "Distance of A from Axis:",
    lab1DistAPrime: "Distance of A' from Axis:",
    lab1PerpNote: "✓ Segment AA' intersects the vertical axis perpendicularly and is bisected by it.",
    lab1AxisLabel: "Axis (d)",
    lab1Caption: "The cyan point A and the purple point A' are always equidistant from the yellow dashed axis.",

    lab2Badge: "📐 INTERACTIVE LAB 2: FOLDING SIMULATOR",
    lab2Title: "Fold the Shape Along the Axis and Check If It Matches!",
    lab2Subtitle: "Select a geometric shape and a folding line. Drag the folding slider to fold the paper along the selected line:",
    lab2SelectShape: "1. SELECT GEOMETRIC SHAPE:",
    lab2SelectAxis: "2. SELECT FOLDING LINE:",
    lab2FoldLabel: "FOLDING PROGRESS:",
    lab2FoldOpen: "0% (Flat)",
    lab2FoldMid: "50% (Folding)",
    lab2FoldFull: "100% (Fully Folded)",
    lab2PromptDrag: "👉 Drag the slider to 100% to complete folding and check if the two halves overlap perfectly!",
    lab2SvgInitial: "Initial Flat Shape (0%)",
    lab2SvgProgress: "Folding in progress",
    lab2SvgMatch: "✓ Perfect Overlap! True Axis of Symmetry.",
    lab2SvgMismatch: "✗ No match! Corners protrude.",
    lab2Caption: "The cyan half remains stationary while the purple half folds along the yellow axis.",
    axisTagIs: "Axis",
    axisTagNot: "Not an Axis",

    problemsTitle: "Solved Axial Symmetry Problems",
    problemsSubtitle: "Direct applications of symmetry properties in geometric reasoning.",

    prob1Badge: "PROBLEM 1: POINT DISTANCE",
    prob1Category: "Equidistant Points",
    prob1Title: "Calculating Total Distance Between Symmetric Points",
    prob1P1: "Point A is situated at a distance of 4.5 cm from a vertical axis of symmetry (d). What is the distance of its symmetric point A' from the axis, and what is the total distance between the two points (AA')?",
    prob1DataHeader: "GIVEN DATA",
    prob1DataA: "Distance of A",
    prob1DataProp: "Property",
    prob1DataPropVal: "Equal distance",
    prob1DataTotal: "Segment AA'",
    prob1StepsHeader: "Solution Steps:",
    prob1Step1Label: "Distance of A' from axis:",
    prob1Step1Text: "Equal to that of A, which is 4.5 cm.",
    prob1Step2Label: "Total distance AA':",
    prob1Step2Text: "4.5 cm ＋ 4.5 cm ＝ 9 cm (or 2 · 4.5 cm ＝ 9 cm).",
    prob1Tip: "💡 The axis of symmetry passes straight through the midpoint of line segment AA'.",

    prob2Badge: "PROBLEM 2: TRIANGLE SYMMETRY",
    prob2Category: "Preservation of Metrics",
    prob2Title: "Perimeter and Area of a Reflected Triangle",
    prob2P1: "A right-angled triangle has sides of 3 cm, 4 cm, and 5 cm, with an area of 6 cm². We construct its symmetric triangle across an axis (d). What are the perimeter and the area of the resulting triangle?",
    prob2DataHeader: "CALCULATION METRICS",
    prob2DataSides: "Sides",
    prob2DataSidesVal: "3, 4, 5 cm",
    prob2DataPerim: "Perimeter",
    prob2DataPerimVal: "3 ＋ 4 ＋ 5 ＝ 12 cm",
    prob2DataArea: "Area",
    prob2DataAreaVal: "6 cm²",
    prob2StepsHeader: "Solution Steps:",
    prob2Step1: "Axial symmetry preserves segment lengths: the reflected sides remain exactly 3 cm, 4 cm, and 5 cm.",
    prob2Step2Label: "New perimeter:",
    prob2Step2Val: "3 ＋ 4 ＋ 5 ＝ 12 cm.",
    prob2Step3Label: "New area:",
    prob2Step3Val: "Remains strictly identical, i.e., 6 cm².",
    prob2Tip: "⚡ Two symmetric shapes are congruent in all metrics (side lengths, angle measures, perimeter, and area)!",

    alertTitle: "Caution / Common Misconceptions to Avoid",
    alertItem1Strong: "The diagonals of a non-square rectangle are NOT axes of symmetry:",
    alertItem1Text: "As proven in the Folding Lab, folding a long rectangle along its diagonal causes the corners to poke out; the halves do not coincide! The only 2 axes of symmetry of a rectangle are the perpendicular bisectors of its opposite sides.",
    alertItem2Strong: "A general parallelogram has NO axis of symmetry:",
    alertItem2Text: "It possesses rotational (point) symmetry of order 2, but no reflection axis.",
    alertItem3Strong: "Distance is always measured perpendicularly:",
    alertItem3Text: "The symmetric point lies on the perpendicular ray forming a strict 90° angle with the axis.",

    footerTitle: "Time to Practice Axial Symmetry!",
    footerDesc: "Test your understanding with interactive exercises featuring reflection axes, coordinate reflections, and polygon symmetry for 6th Grade.",
    footerButton: "Start Exercises"
  }
};

export default function SimmetriaTheoriaPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Διαδραστικός Καθρεφτισμός Σημείου
  const [pointX, setPointX] = useState(60);
  const [pointY, setPointY] = useState(80);

  const axisX = 160;
  const mirroredX = useMemo(() => {
    const dist = axisX - pointX;
    return axisX + dist;
  }, [pointX]);

  const distanceFromAxis = Math.abs(axisX - pointX);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΔΙΠΛΩΣΗΣ (FOLDING LAB)
  // -------------------------------------------------------------------------
  const [foldingShape, setFoldingShape] = useState('triangle');
  const [selectedAxisKey, setSelectedAxisKey] = useState('wrong_line');
  const [foldProgress, setFoldProgress] = useState(0); // 0 (ανοιχτό) έως 100 (πλήρες δίπλωμα)

  // Παραγωγή τόξου ημικυκλίου
  const generateSemiCirclePoints = (cx, cy, r, startAngle, endAngle, steps = 24) => {
    const pts = [{ x: cx, y: cy }];
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (i / steps) * (endAngle - startAngle);
      pts.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle)
      });
    }
    return pts;
  };

  // Δεδομένα σχημάτων και αξόνων με πλήρη μετάφραση
  const foldingConfigs = useMemo(() => {
    const isEn = locale === 'en';
    return {
      rectangle: {
        name: isEn ? 'Oblong Rectangle' : 'Επίμηκες Ορθογώνιο Παραλληλόγραμμο',
        axes: [
          {
            key: 'diagonal',
            label: isEn ? 'Diagonal (Does Not Overlap!)' : 'Διαγώνιος (Δεν Συμπίπτει!)',
            isSymmetric: false,
            p1: { x: 75, y: 100 },
            p2: { x: 265, y: 180 },
            axisLine: { x1: 56, y1: 92, x2: 284, y2: 188 },
            fixedPoly: [
              { x: 75, y: 100 },
              { x: 265, y: 180 },
              { x: 75, y: 180 }
            ],
            movingPoly: [
              { x: 75, y: 100 },
              { x: 265, y: 100 },
              { x: 265, y: 180 }
            ],
            explanation: isEn
              ? '✗ CAUTION: The two triangles DO NOT match! The vertices clearly stick out. The diagonal of a rectangle is NOT an axis of symmetry.'
              : '✗ ΠΡΟΣΟΧΗ: Τα δύο τρίγωνα ΔΕΝ εφαρμόζουν! Οι γωνίες εξέχουν καθαρά. Η διαγώνιος του ορθογωνίου ΔΕΝ είναι άξονας συμμετρίας.'
          },
          {
            key: 'vertical',
            label: isEn ? 'Vertical Perpendicular Bisector' : 'Κατακόρυφη Μεσοκάθετος',
            isSymmetric: true,
            p1: { x: 170, y: 100 },
            p2: { x: 170, y: 180 },
            axisLine: { x1: 170, y1: 70, x2: 170, y2: 210 },
            fixedPoly: [
              { x: 170, y: 100 },
              { x: 265, y: 100 },
              { x: 265, y: 180 },
              { x: 170, y: 180 }
            ],
            movingPoly: [
              { x: 170, y: 100 },
              { x: 75, y: 100 },
              { x: 75, y: 180 },
              { x: 170, y: 180 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The two halves coincide perfectly! The vertical bisector is an axis of symmetry.'
              : '✓ ΣΩΣΤΟ: Τα δύο μέρη εφαρμόζουν απόλυτα! Η κατακόρυφη μεσοκάθετος είναι άξονας συμμετρίας.'
          },
          {
            key: 'horizontal',
            label: isEn ? 'Horizontal Perpendicular Bisector' : 'Οριζόντια Μεσοκάθετος',
            isSymmetric: true,
            p1: { x: 75, y: 140 },
            p2: { x: 265, y: 140 },
            axisLine: { x1: 55, y1: 140, x2: 285, y2: 140 },
            fixedPoly: [
              { x: 75, y: 140 },
              { x: 265, y: 140 },
              { x: 265, y: 180 },
              { x: 75, y: 180 }
            ],
            movingPoly: [
              { x: 75, y: 140 },
              { x: 265, y: 140 },
              { x: 265, y: 100 },
              { x: 75, y: 100 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The two halves match flawlessly! The horizontal bisector is an axis of symmetry.'
              : '✓ ΣΩΣΤΟ: Τα δύο μέρη εφαρμόζουν απόλυτα! Η οριζόντια μεσοκάθετος είναι άξονας συμμετρίας.'
          }
        ]
      },
      triangle: {
        name: isEn ? 'Equilateral Triangle (3 Axes)' : 'Ισόπλευρο Τρίγωνο (3 Άξονες)',
        axes: [
          {
            key: 'axis1',
            label: isEn ? '1st Bisector (from vertex A)' : '1η Μεσοκάθετος (από κορυφή Α)',
            isSymmetric: true,
            p1: { x: 170, y: 60 },
            p2: { x: 170, y: 200 },
            axisLine: { x1: 170, y1: 40, x2: 170, y2: 220 },
            fixedPoly: [
              { x: 170, y: 60 },
              { x: 250, y: 200 },
              { x: 170, y: 200 }
            ],
            movingPoly: [
              { x: 170, y: 60 },
              { x: 90, y: 200 },
              { x: 170, y: 200 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The perpendicular bisector through vertex A folds the triangle into two identical halves.'
              : '✓ ΣΩΣΤΟ: Η μεσοκάθετος από την κορυφή Α διπλώνει το τρίγωνο σε δύο απόλυτα ίσα μισά.'
          },
          {
            key: 'axis2',
            label: isEn ? '2nd Bisector (from vertex B)' : '2η Μεσοκάθετος (από κορυφή Β)',
            isSymmetric: true,
            p1: { x: 90, y: 200 },
            p2: { x: 210, y: 130 },
            axisLine: { x1: 66, y1: 221, x2: 234, y2: 109 },
            fixedPoly: [
              { x: 90, y: 200 },
              { x: 250, y: 200 },
              { x: 210, y: 130 }
            ],
            movingPoly: [
              { x: 90, y: 200 },
              { x: 170, y: 60 },
              { x: 210, y: 130 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The perpendicular bisector through vertex B is also an axis of symmetry.'
              : '✓ ΣΩΣΤΟ: Η μεσοκάθετος από την κορυφή Β είναι επίσης άξονας συμμετρίας.'
          },
          {
            key: 'axis3',
            label: isEn ? '3rd Bisector (from vertex C)' : '3η Μεσοκάθετος (από κορυφή C)',
            isSymmetric: true,
            p1: { x: 250, y: 200 },
            p2: { x: 130, y: 130 },
            axisLine: { x1: 274, y1: 221, x2: 106, y2: 109 },
            fixedPoly: [
              { x: 250, y: 200 },
              { x: 90, y: 200 },
              { x: 130, y: 130 }
            ],
            movingPoly: [
              { x: 250, y: 200 },
              { x: 170, y: 60 },
              { x: 130, y: 130 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The perpendicular bisector through vertex C is the 3rd axis of symmetry.'
              : '✓ ΣΩΣΤΟ: Η μεσοκάθετος από την κορυφή C είναι ο 3ος άξονας συμμετρίας.'
          },
          {
            key: 'wrong_line',
            label: isEn ? 'Random Slanted Line (Not an axis)' : 'Τυχαία Πλάγια Γραμμή (Μη-άξονας)',
            isSymmetric: false,
            p1: { x: 150, y: 95 },
            p2: { x: 190, y: 200 },
            axisLine: { x1: 138, y1: 63, x2: 202, y2: 231 },
            fixedPoly: [
              { x: 150, y: 95 },
              { x: 170, y: 60 },
              { x: 250, y: 200 },
              { x: 190, y: 200 }
            ],
            movingPoly: [
              { x: 150, y: 95 },
              { x: 90, y: 200 },
              { x: 190, y: 200 }
            ],
            explanation: isEn
              ? '✗ CAUTION: If we fold along an arbitrary slanted line, the two halves do NOT coincide!'
              : '✗ ΠΡΟΣΟΧΗ: Αν διπλώσουμε σε τυχαία πλάγια γραμμή, τα δύο μέρη ΔΕΝ ταυτίζονται!'
          }
        ]
      },
      rhombus: {
        name: isEn ? 'Rhombus (2 Diagonals)' : 'Ρόμβος (2 Διαγώνιοι)',
        axes: [
          {
            key: 'vertical',
            label: isEn ? 'Vertical Diagonal (Axis)' : 'Κατακόρυφη Διαγώνιος (Άξονας)',
            isSymmetric: true,
            p1: { x: 170, y: 60 },
            p2: { x: 170, y: 220 },
            axisLine: { x1: 170, y1: 40, x2: 170, y2: 240 },
            fixedPoly: [
              { x: 170, y: 60 },
              { x: 255, y: 140 },
              { x: 170, y: 220 }
            ],
            movingPoly: [
              { x: 170, y: 60 },
              { x: 85, y: 140 },
              { x: 170, y: 220 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The vertical diagonal folds the rhombus into two congruent triangles.'
              : '✓ ΣΩΣΤΟ: Η κατακόρυφη διαγώνιος διπλώνει τον ρόμβο σε 2 ίσα τρίγωνα.'
          },
          {
            key: 'horizontal',
            label: isEn ? 'Horizontal Diagonal (Axis)' : 'Οριζόντια Διαγώνιος (Άξονας)',
            isSymmetric: true,
            p1: { x: 85, y: 140 },
            p2: { x: 255, y: 140 },
            axisLine: { x1: 65, y1: 140, x2: 275, y2: 140 },
            fixedPoly: [
              { x: 85, y: 140 },
              { x: 255, y: 140 },
              { x: 170, y: 220 }
            ],
            movingPoly: [
              { x: 85, y: 140 },
              { x: 255, y: 140 },
              { x: 170, y: 60 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The horizontal diagonal is also a valid axis of symmetry for the rhombus!'
              : '✓ ΣΩΣΤΟ: Η οριζόντια διαγώνιος είναι επίσης άξονας συμμετρίας του ρόμβου!'
          },
          {
            key: 'side_mid',
            label: isEn ? 'Mid-segment of Sides (Not an axis)' : 'Μεσοκάθετος Πλευρών (Μη-άξονας)',
            isSymmetric: false,
            p1: { x: 127.5, y: 100 },
            p2: { x: 212.5, y: 180 },
            axisLine: { x1: 110, y1: 83.5, x2: 230, y2: 196.5 },
            fixedPoly: [
              { x: 127.5, y: 100 },
              { x: 170, y: 60 },
              { x: 255, y: 140 },
              { x: 212.5, y: 180 }
            ],
            movingPoly: [
              { x: 127.5, y: 100 },
              { x: 85, y: 140 },
              { x: 170, y: 220 },
              { x: 212.5, y: 180 }
            ],
            explanation: isEn
              ? '✗ CAUTION: The perpendicular bisectors of the sides in a rhombus are NOT axes of symmetry (only diagonals are)!'
              : '✗ ΠΡΟΣΟΧΗ: Οι μεσοκάθετες των πλευρών στον ρόμβο ΔΕΝ είναι άξονες συμμετρίας (μόνο οι διαγώνιοι είναι)!'
          }
        ]
      },
      square: {
        name: isEn ? 'Square (4 Axes)' : 'Τετράγωνο (4 Άξονες)',
        axes: [
          {
            key: 'diagonal',
            label: isEn ? 'Diagonal (Matches Perfectly!)' : 'Διαγώνιος (Εφαρμόζει Απόλυτα!)',
            isSymmetric: true,
            p1: { x: 100, y: 70 },
            p2: { x: 240, y: 210 },
            axisLine: { x1: 85, y1: 55, x2: 255, y2: 225 },
            fixedPoly: [
              { x: 100, y: 70 },
              { x: 240, y: 210 },
              { x: 100, y: 210 }
            ],
            movingPoly: [
              { x: 100, y: 70 },
              { x: 240, y: 70 },
              { x: 240, y: 210 }
            ],
            explanation: isEn
              ? '✓ CORRECT: Unlike an oblong rectangle, in a square the diagonal IS an axis of symmetry!'
              : '✓ ΣΩΣΤΟ: Σε αντίθεση με το ορθογώνιο, στο τετράγωνο η διαγώνιος ΕΙΝΑΙ άξονας συμμετρίας!'
          },
          {
            key: 'vertical',
            label: isEn ? 'Vertical Perpendicular Bisector' : 'Κατακόρυφη Μεσοκάθετος',
            isSymmetric: true,
            p1: { x: 170, y: 70 },
            p2: { x: 170, y: 210 },
            axisLine: { x1: 170, y1: 45, x2: 170, y2: 235 },
            fixedPoly: [
              { x: 170, y: 70 },
              { x: 240, y: 70 },
              { x: 240, y: 210 },
              { x: 170, y: 210 }
            ],
            movingPoly: [
              { x: 170, y: 70 },
              { x: 100, y: 70 },
              { x: 100, y: 210 },
              { x: 170, y: 210 }
            ],
            explanation: isEn
              ? '✓ CORRECT: The vertical bisector folds the square into two identical parts.'
              : '✓ ΣΩΣΤΟ: Η κατακόρυφη μεσοκάθετος διπλώνει το τετράγωνο σε δύο ίσα μέρη.'
          }
        ]
      },
      circle: {
        name: isEn ? 'Circle (Infinitely Many Axes)' : 'Κύκλος (Άπειροι Άξονες)',
        axes: [
          {
            key: 'vertical',
            label: isEn ? 'Vertical Diameter' : 'Κατακόρυφη Διάμετρος',
            isSymmetric: true,
            p1: { x: 170, y: 65 },
            p2: { x: 170, y: 215 },
            axisLine: { x1: 170, y1: 45, x2: 170, y2: 235 },
            fixedPoly: generateSemiCirclePoints(170, 140, 75, -Math.PI / 2, Math.PI / 2),
            movingPoly: generateSemiCirclePoints(170, 140, 75, Math.PI / 2, (3 * Math.PI) / 2),
            explanation: isEn
              ? '✓ CORRECT: The vertical diameter folds the circle into two identical semicircles.'
              : '✓ ΣΩΣΤΟ: Η κατακόρυφη διάμετρος διπλώνει τον κύκλο σε δύο απόλυτα ίσα ημικύκλια.'
          },
          {
            key: 'horizontal',
            label: isEn ? 'Horizontal Diameter' : 'Οριζόντια Διάμετρος',
            isSymmetric: true,
            p1: { x: 95, y: 140 },
            p2: { x: 245, y: 140 },
            axisLine: { x1: 75, y1: 140, x2: 265, y2: 140 },
            fixedPoly: generateSemiCirclePoints(170, 140, 75, 0, Math.PI),
            movingPoly: generateSemiCirclePoints(170, 140, 75, Math.PI, 2 * Math.PI),
            explanation: isEn
              ? '✓ CORRECT: The horizontal diameter is also a perfect axis of symmetry.'
              : '✓ ΣΩΣΤΟ: Η οριζόντια διάμετρος είναι επίσης τέλειος άξονας συμμετρίας.'
          },
          {
            key: 'diag45',
            label: isEn ? 'Slanted Diameter 45°' : 'Πλάγια Διάμετρος 45°',
            isSymmetric: true,
            p1: { x: 170 - 75 * Math.cos(Math.PI / 4), y: 140 + 75 * Math.sin(Math.PI / 4) },
            p2: { x: 170 + 75 * Math.cos(Math.PI / 4), y: 140 - 75 * Math.sin(Math.PI / 4) },
            axisLine: { x1: 105, y1: 205, x2: 235, y2: 75 },
            fixedPoly: generateSemiCirclePoints(170, 140, 75, -Math.PI / 4, (3 * Math.PI) / 4),
            movingPoly: generateSemiCirclePoints(170, 140, 75, (3 * Math.PI) / 4, (7 * Math.PI) / 4),
            explanation: isEn
              ? '✓ CORRECT: Any slanted diameter is an axis of symmetry.'
              : '✓ ΣΩΣΤΟ: Κάθε πλάγια διάμετρος είναι άξονας συμμετρίας.'
          },
          {
            key: 'diag135',
            label: isEn ? 'Slanted Diameter 135°' : 'Πλάγια Διάμετρος 135°',
            isSymmetric: true,
            p1: { x: 170 - 75 * Math.cos(Math.PI / 4), y: 140 - 75 * Math.sin(Math.PI / 4) },
            p2: { x: 170 + 75 * Math.cos(Math.PI / 4), y: 140 + 75 * Math.sin(Math.PI / 4) },
            axisLine: { x1: 105, y1: 75, x2: 235, y2: 205 },
            fixedPoly: generateSemiCirclePoints(170, 140, 75, Math.PI / 4, (5 * Math.PI) / 4),
            movingPoly: generateSemiCirclePoints(170, 140, 75, (5 * Math.PI) / 4, (9 * Math.PI) / 4),
            explanation: isEn
              ? '✓ CORRECT: The circle has infinitely many axes of symmetry (any line through its center)!'
              : '✓ ΣΩΣΤΟ: Ο κύκλος έχει άπειρους άξονες συμμετρίας (κάθε ευθεία που περνά από το κέντρο του)!'
          }
        ]
      }
    };
  }, [locale]);

  const currentConfig = foldingConfigs[foldingShape] || foldingConfigs.triangle;
  const currentAxis =
    currentConfig.axes.find((a) => a.key === selectedAxisKey) || currentConfig.axes[0];

  // Μετατροπή των σταθερών σημείων σε string πολυγώνου
  const fixedPointsStr = useMemo(() => {
    return currentAxis.fixedPoly.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }, [currentAxis]);

  // Υπολογισμός 2D αναδίπλωσης απευθείας στις συντεταγμένες
  const movingPointsStr = useMemo(() => {
    const { p1, p2, movingPoly } = currentAxis;
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return '';

    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy;
    const ny = ux;

    const theta = (foldProgress / 100) * Math.PI;
    const cosTheta = Math.cos(theta);

    return movingPoly
      .map((p) => {
        const vx = p.x - p1.x;
        const vy = p.y - p1.y;

        const projParallel = vx * ux + vy * uy;
        const distPerp = vx * nx + vy * ny;
        const currentDistPerp = distPerp * cosTheta;

        const newX = p1.x + projParallel * ux + currentDistPerp * nx;
        const newY = p1.y + projParallel * uy + currentDistPerp * ny;

        return `${newX.toFixed(1)},${newY.toFixed(1)}`;
      })
      .join(' ');
  }, [currentAxis, foldProgress]);

  const shapeButtons = useMemo(() => [
    { id: 'triangle', label: locale === 'en' ? 'Triangle' : 'Τρίγωνο' },
    { id: 'rectangle', label: locale === 'en' ? 'Rectangle' : 'Ορθογώνιο' },
    { id: 'rhombus', label: locale === 'en' ? 'Rhombus' : 'Ρόμβος' },
    { id: 'square', label: locale === 'en' ? 'Square' : 'Τετράγωνο' },
    { id: 'circle', label: locale === 'en' ? 'Circle' : 'Κύκλος' }
  ], [locale]);

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/71-simmetria-ask"
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
              href="/st-dimotikou/71-simmetria-ask"
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
                  <div className="font-bold text-slate-800">
                    {t.step1Bullet}
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {t.step1P2}
                  </p>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-amber-950 font-bold">
                    {t.step2Rule1}
                  </div>
                  <div className="text-amber-950 font-bold">
                    {t.step2Rule2}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div><strong>{t.polyIsosceles}</strong> {t.polyIsoscelesCount}</div>
                  <div className="text-indigo-900 font-bold"><strong>{t.polyEquilateral}</strong> {t.polyEquilateralCount}</div>
                  <div><strong>{t.polyRectangle}</strong> {t.polyRectangleCount}</div>
                  <div className="text-emerald-800 font-bold"><strong>{t.polySquare}</strong> {t.polySquareCount}</div>
                  <div><strong>{t.polyRhombus}</strong> {t.polyRhombusCount}</div>
                  <div className="text-purple-800 font-bold"><strong>{t.polyCircle}</strong> {t.polyCircleCount}</div>
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
                  <div>{t.step4Prop1}</div>
                  <div>{t.step4Prop2}</div>
                  <div>{t.step4Prop3}</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΚΑΘΡΕΦΤΙΣΜΟΣ ΣΗΜΕΙΟΥ */}
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

            {/* Χειριστήρια & Μετρήσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1ControlX)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(pointX, locale)} px
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={150}
                  step={2}
                  value={pointX}
                  onChange={(e) => setPointX(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab1ControlY)}</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(pointY, locale)} px
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={170}
                  step={2}
                  value={pointY}
                  onChange={(e) => setPointY(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Πίνακας Αποστάσεων */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-950">{t.lab1DistA}</span>
                  <span className="font-mono text-base text-emerald-700">{formatNum(distanceFromAxis, locale)} px</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-950">{t.lab1DistAPrime}</span>
                  <span className="font-mono text-base text-emerald-700">{formatNum(distanceFromAxis, locale)} px</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 text-[11px] text-slate-600">
                  {t.lab1PerpNote}
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[320px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 320 200"
                className="w-full max-w-[340px] sm:max-w-[400px] h-auto select-none overflow-visible"
              >
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="320" height="200" fill="url(#grid)" />

                {/* Κατακόρυφος Άξονας Συμμετρίας (x = 160) */}
                <line x1={axisX} y1="10" x2={axisX} y2="190" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 4" />
                <text x={axisX} y="198" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">
                  {t.lab1AxisLabel}
                </text>

                {/* Γραμμή σύνδεσης των δύο σημείων (κάθετη στον άξονα) */}
                <line
                  x1={pointX}
                  y1={pointY}
                  x2={mirroredX}
                  y2={pointY}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />

                {/* Σύμβολο ορθής γωνίας στον άξονα */}
                <rect x={axisX - 8} y={pointY - 8} width="8" height="8" fill="none" stroke="#94a3b8" strokeWidth="1" />

                {/* Σημείο Α (Αρχικό) */}
                <circle cx={pointX} cy={pointY} r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
                <text x={pointX} y={pointY - 12} fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Α
                </text>

                {/* Σημείο Α' (Συμμετρικό) */}
                <circle cx={mirroredX} cy={pointY} r="6" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
                <text x={mirroredX} y={pointY - 12} fill="#c084fc" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Α'
                </text>

                {/* Ενδείξεις αποστάσεων */}
                <text x={(pointX + axisX) / 2} y={pointY + 16} fill="#38bdf8" fontSize="10" textAnchor="middle">
                  d ＝ {formatNum(distanceFromAxis, locale)}
                </text>
                <text x={(mirroredX + axisX) / 2} y={pointY + 16} fill="#c084fc" fontSize="10" textAnchor="middle">
                  d ＝ {formatNum(distanceFromAxis, locale)}
                </text>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {t.lab1Caption}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΔΙΠΛΩΣΗ ΣΧΗΜΑΤΟΣ */}
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

            {/* Χειριστήρια Επιλογής & Slider Αναδίπλωσης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Επιλογή Σχήματος */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {toCleanUppercase(t.lab2SelectShape)}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {shapeButtons.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setFoldingShape(s.id);
                        setSelectedAxisKey(foldingConfigs[s.id].axes[0].key);
                        setFoldProgress(0);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                        foldingShape === s.id
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Επιλογή Άξονα για το επιλεγμένο σχήμα */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {toCleanUppercase(t.lab2SelectAxis)}
                </label>
                <div className="space-y-1.5">
                  {currentConfig.axes.map((ax) => (
                    <button
                      key={ax.key}
                      type="button"
                      onClick={() => {
                        setSelectedAxisKey(ax.key);
                        setFoldProgress(0);
                      }}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-left flex justify-between items-center ${
                        selectedAxisKey === ax.key
                          ? 'bg-sky-600 text-white shadow-md ring-2 ring-sky-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      <span>{ax.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${ax.isSymmetric ? 'bg-emerald-500/20 text-emerald-800' : 'bg-rose-500/20 text-rose-800'}`}>
                        {ax.isSymmetric ? t.axisTagIs : t.axisTagNot}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Αναδίπλωσης (0% έως 100%) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2FoldLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {formatNum(foldProgress, locale)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={foldProgress}
                  onChange={(e) => setFoldProgress(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>{t.lab2FoldOpen}</span>
                  <span>{t.lab2FoldMid}</span>
                  <span>{t.lab2FoldFull}</span>
                </div>
              </div>

              {/* Επεξήγηση & Feedback */}
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed border transition-all ${
                  foldProgress === 100
                    ? currentAxis.isSymmetric
                      ? 'bg-emerald-50 text-emerald-950 border-emerald-300 ring-1 ring-emerald-200'
                      : 'bg-amber-50 text-amber-950 border-amber-300 ring-1 ring-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {foldProgress < 100 ? (
                  <span>{t.lab2PromptDrag}</span>
                ) : (
                  <span>{currentAxis.explanation}</span>
                )}
              </div>
            </div>

            {/* SVG Visualizer Αναδίπλωσης (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 340 280"
                className="w-full max-w-[340px] sm:max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* 1. Σταθερό μέρος του σχήματος (γαλάζιο) */}
                <polygon
                  points={fixedPointsStr}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Αναδιπλούμενο μέρος του σχήματος (μωβ) */}
                <polygon
                  points={movingPointsStr}
                  fill={
                    foldProgress === 100 && !currentAxis.isSymmetric
                      ? 'rgba(245, 158, 11, 0.45)'
                      : 'rgba(168, 85, 247, 0.35)'
                  }
                  stroke={
                    foldProgress === 100 && !currentAxis.isSymmetric ? '#f59e0b' : '#c084fc'
                  }
                  strokeWidth="2.5"
                />

                {/* 3. Άξονας αναδίπλωσης (κίτρινος διακεκομμένος) */}
                <line
                  x1={currentAxis.axisLine.x1}
                  y1={currentAxis.axisLine.y1}
                  x2={currentAxis.axisLine.x2}
                  y2={currentAxis.axisLine.y2}
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                />

                {/* Ετικέτες κατάστασης */}
                {foldProgress === 0 && (
                  <text x="170" y="260" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {t.lab2SvgInitial}
                  </text>
                )}
                {foldProgress > 0 && foldProgress < 100 && (
                  <text x="170" y="260" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    {t.lab2SvgProgress} ({formatNum(foldProgress, locale)}%)...
                  </text>
                )}
                {foldProgress === 100 && currentAxis.isSymmetric && (
                  <text x="170" y="260" fill="#34d399" fontSize="13" fontWeight="black" textAnchor="middle">
                    {t.lab2SvgMatch}
                  </text>
                )}
                {foldProgress === 100 && !currentAxis.isSymmetric && (
                  <text x="170" y="260" fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="middle">
                    {t.lab2SvgMismatch}
                  </text>
                )}
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {t.lab2Caption}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataA}</span> {locale === 'el' ? '4,5 cm' : '4.5 cm'}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataProp}</span> {t.prob1DataPropVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1DataTotal}</span> 2 · {locale === 'el' ? '4,5 cm' : '4.5 cm'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeader}</span>
                  <div><strong>{t.prob1Step1Label}</strong> {t.prob1Step1Text}</div>
                  <div><strong>{t.prob1Step2Label}</strong> {t.prob1Step2Text}</div>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataSides}</span> {t.prob2DataSidesVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataPerim}</span> {t.prob2DataPerimVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2DataArea}</span> {t.prob2DataAreaVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeader}</span>
                  <div>{t.prob2Step1}</div>
                  <div><strong>{t.prob2Step2Label}</strong> {t.prob2Step2Val}</div>
                  <div><strong>{t.prob2Step3Label}</strong> {t.prob2Step3Val}</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
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
            href="/st-dimotikou/71-simmetria-ask"
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
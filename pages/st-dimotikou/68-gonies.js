// pages/st-dimotikou/68-gonies.js
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

export default function GoniesTheoriaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  // Συγκεντρωτικό Λεξικό Μεταφράσεων
  const translations = {
    el: {
      headTitle: "Μέτρηση & Σύγκριση Γωνιών - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Μαθαίνουμε πώς μετράμε και συγκρίνουμε γωνίες με το μοιρογνωμόνιο, τα είδη γωνιών και τις σχέσεις τους για τη ΣΤ' Δημοτικού.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      heroBadge: "ΚΕΦΑΛΑΙΟ 68 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Μέτρηση & Σύγκριση Γωνιών",
      heroDesc: "Ανακαλύπτουμε τι είναι η γωνία ως γεωμετρικό σχήμα και ως μέγεθος ανοίγματος. Μαθαίνουμε πώς να χρησιμοποιούμε σωστά το μοιρογνωμόνιο, πώς συγκρίνουμε γωνίες χωρίς να παρασυρόμαστε από το μήκος των πλευρών τους, και εξερευνούμε τις συμπληρωματικές και παραπληρωματικές γωνίες!",
      heroFeature: "Θεωρία, Είδη Γωνιών, Μοιρογνωμόνιο & Διαδραστικό Εργαστήριο Μοιρών",
      heroCta: "Δοκίμασε τις Ασκήσεις",

      sec1Title: "Οι Γωνίες σε 4 Βήματα",
      sec1Subtitle: "Από τον θεμελιώδη ορισμό έως τη σύγκριση και τους υπολογισμούς γωνιών.",

      step1Badge: "ΒΗΜΑ 1",
      step1Tag: "Έννοια",
      step1Title: "Τι είναι Γωνία;",
      step1Text: "Γωνία ονομάζεται το γεωμετρικό σχήμα που σχηματίζεται από δύο ημιευθείες που έχουν την ίδια αρχή.",
      step1SubHeading: "Στοιχεία γωνίας:",
      step1Item1: "Κορυφή: Το κοινό αρχικό σημείο των δύο ημιευθειών.",
      step1Item2: "Πλευρές: Οι δύο ημιευθείες που ορίζουν τη γωνία.",
      step1Item3: "Άνοιγμα: Το μέγεθος της γωνίας (η στροφή της μίας πλευράς προς την άλλη).",
      step1Notation: "Συμβολισμός: Μια γωνία με κορυφή Ο και πλευρές ΟΑ, ΟΒ συμβολίζεται ως Â ή ∠ΑΟΒ.",
      step1Tip: "💡 Οι πλευρές μιας γωνίας είναι ημιευθείες, άρα εκτείνονται επ' άπειρον! Το μέγεθος της γωνίας εξαρτάται αποκλειστικά από το άνοιγμα.",

      step2Badge: "ΒΗΜΑ 2",
      step2Tag: "Μέτρηση",
      step2Title: "Μέτρηση με Μοιρογνωμόνιο",
      step2Text: "Μονάδα μέτρησης του ανοίγματος των γωνιών είναι η μοίρα (1°). Το όργανο μέτρησης είναι το μοιρογνωμόνιο:",
      step2SubHeading: "Βήματα σωστής μέτρησης:",
      step2Rule1: "Τοποθετούμε το κέντρο του μοιρογνωμονίου ακριβώς στην κορυφή της γωνίας.",
      step2Rule2: "Ευθυγραμμίζουμε τη γραμμή του 0° με τη μία πλευρά της γωνίας.",
      step2Rule3: "Διαβάζουμε στην κλίμακα τον αριθμό πάνω από τον οποίο περνά η άλλη πλευρά.",
      step2CircleNote: "Ένας πλήρης κύκλος αντιστοιχεί σε 360 μοίρες (360°).",
      step2Tip: "⚡ Προσέχουμε ποια κλίμακα χρησιμοποιούμε (εσωτερική ή εξωτερική), ξεκινώντας πάντα από το μηδέν (0°)!",

      step3Badge: "ΒΗΜΑ 3",
      step3Tag: "Ταξινόμηση",
      step3Title: "Είδη Γωνιών",
      step3Text: "Ανάλογα με το μέτρο τους σε μοίρες, οι γωνίες κατατάσσονται σε βασικές κατηγορίες:",
      step3Zero: "Μηδενική: 0°",
      step3Acute: "Οξεία: 0° ＜ άνοιγμα ＜ 90°",
      step3Right: "Ορθή: ακριβώς 90°",
      step3Obtuse: "Αμβλεία: 90° ＜ άνοιγμα ＜ 180°",
      step3Straight: "Ευθεία: ακριβώς 180°",
      step3Full: "Πλήρης: ακριβώς 360°",
      step3Tip: "🎯 Η ορθή γωνία (90°) αποτελεί το βασικό μέτρο σύγκρισης για όλες τις υπόλοιπες γωνίες!",

      step4Badge: "ΒΗΜΑ 4",
      step4Tag: "Σχέσεις",
      step4Title: "Σύγκριση & Ειδικά Ζεύγη",
      step4Text: "Δύο γωνίες συγκρίνονται είτε με υπέρθεση είτε μετρώντας τις μοίρες τους:",
      step4CompTitle: "1. Συμπληρωματικές Γωνίες:",
      step4CompDesc: "Δύο γωνίες των οποίων το άθροισμα ισούται με 90° (σχηματίζουν ορθή γωνία).",
      step4SuppTitle: "2. Παραπληρωματικές Γωνίες:",
      step4SuppDesc: "Δύο γωνίες των οποίων το άθροισμα ισούται με 180° (σχηματίζουν ευθεία γωνία).",
      step4Tip: "🚀 Για να βρούμε τη συμπληρωματική μιας γωνίας α: 90° － α. Για την παραπληρωματική: 180° － α!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Διαδραστικό Μοιρογνωμόνιο & Αναγνώριση Γωνίας (SVG)",
      lab1Desc: "Σύρε τον ρυθμιστή μοιρών για να περιστρέψεις την πλευρά της γωνίας και παρατήρησε το άνοιγμα και το είδος της:",
      lab1SliderLabel: "ΑΝΟΙΓΜΑ ΓΩΝΙΑΣ:",
      lab1QuickLabel: "ΓΡΗΓΟΡΗ ΕΠΙΛΟΓΗ ΒΑΣΙΚΩΝ ΓΩΝΙΩΝ:",
      lab1KindLabel: "Είδος Γωνίας:",
      lab1DescRight: "📐 Οι δύο πλευρές είναι κάθετες μεταξύ τους.",
      lab1DescAcute: "🔍 Μικρότερο άνοιγμα από την ορθή γωνία.",
      lab1DescObtuse: "📏 Μεγαλύτερο άνοιγμα από την ορθή, μικρότερο από την ευθεία.",
      lab1DescStraight: "➖ Οι δύο πλευρές αποτελούν αντικείμενες ημιευθείες στην ίδια ευθεία.",
      lab1DescZero: "⭕ Οι δύο πλευρές ταυτίζονται πλήρως.",
      lab1SvgVertex: "Κορυφή (Ο)",
      lab1SvgNote: "Το γαλάζιο ευθύγραμμο τμήμα δείχνει την αρχική πλευρά (0°) και το μωβ την περιστρεφόμενη πλευρά.",

      lab2Badge: "📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΧΕΣΕΙΣ ΓΩΝΙΩΝ",
      lab2Title: "Υπολογιστής Συμπληρωματικής & Παραπληρωματικής Γωνίας",
      lab2Desc: "Επίλεξε μία αρχική γωνία και δες αυτόματα πόσες μοίρες χρειάζεται για να γίνει ορθή (90°) ή ευθεία (180°):",
      lab2SliderLabel: "ΑΡΧΙΚΗ ΓΩΝΙΑ (α):",
      lab2LabTip: "💡 Στο εργαστήριο αυτό εξετάζουμε οξείες γωνίες (έως 89°) ώστε να υπάρχει πάντοτε θετική συμπληρωματική γωνία.",
      lab2CompBadge: "ΣΥΜΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ",
      lab2CompSum: "Άθροισμα: ",
      lab2CompResult: "90° (Ορθή)",
      lab2SuppBadge: "ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΗ ΓΩΝΙΑ",
      lab2SuppSum: "Άθροισμα: ",
      lab2SuppResult: "180° (Ευθεία)",

      probSecTitle: "Λυμένα Προβλήματα με Γωνίες",
      probSecSubtitle: "Εφαρμογές μέτρησης και υπολογισμού γωνιών σε πρακτικά προβλήματα.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΔΙΑΧΩΡΙΣΜΟΣ ΟΡΘΗΣ ΓΩΝΙΑΣ",
      prob1Tag: "Συμπληρωματικές",
      prob1Title: "Υπολογισμός Άγνωστης Γωνίας σε Ορθή Γωνία",
      prob1Desc: "Μια ορθή γωνία 90° χωρίζεται από μια εσωτερική ημιευθεία σε δύο επιμέρους γωνίες. Αν η μία γωνία έχει μέτρο 34°, πόσο είναι το μέτρο της άλλης γωνίας;",
      prob1TableHeading: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1ThTotal: "Συνολική γωνία",
      prob1ThTotalVal: "90° (ορθή)",
      prob1ThKnown: "Γνωστή γωνία",
      prob1ThRel: "Σχέση",
      prob1ThRelVal: "Συμπληρωματικές",
      prob1StepsHeading: "Βήματα Επίλυσης:",
      prob1Step1: "Επειδή η αρχική γωνία είναι ορθή, οι δύο γωνίες έχουν άθροισμα 90°.",
      prob1Step2: "Αφαιρούμε τη γνωστή γωνία: 90° － 34° ＝ 56°.",
      prob1Tip: "💡 Επαλήθευση: 34° ＋ 56° ＝ 90°, άρα το αποτέλεσμα είναι απόλυτα σωστό.",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΔΕΙΚΤΕΣ ΡΟΛΟΓΙΟΥ",
      prob2Tag: "Κίνηση & Μοίρες",
      prob2Title: "Γωνία που Σχηματίζουν οι Δείκτες του Ρολογιού",
      prob2Desc: "Ένα αναλογικό ρολόι δείχνει ακριβώς 3:00. Πόσες μοίρες είναι η γωνία που σχηματίζει ο ωροδείκτης με τον λεπτοδείκτη και τι είδους γωνία είναι;",
      prob2TableHeading: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2ThCircle: "Πλήρης κύκλος",
      prob2ThSpan: "Διάστημα",
      prob2ThSpanVal: "3 ώρες (12 έως 3)",
      prob2ThCalc: "Πράξη",
      prob2ThCalcVal: "3 · 30° ＝ 90°",
      prob2StepsHeading: "Βήματα Επίλυσης:",
      prob2Step1Prefix: "Το καντράν του ρολογιού είναι κύκλος 360° χωρισμένος σε 12 ίσα μέρη:",
      prob2Step1Suffix: "ανά ώρα.",
      prob2Step2: "Στις 3:00 ο λεπτοδείκτης είναι στο 12 και ο ωροδείκτης στο 3 (απόσταση 3 ωρών): 3 · 30° ＝ 90°.",
      prob2Step3: "Η γωνία των 90° είναι ορθή γωνία.",
      prob2Tip: "⚡ Στις 6:00 οι δείκτες σχηματίζουν 180° (ευθεία γωνία), ενώ στις 9:00 σχηματίζουν ξανά ορθή γωνία (90°)!",

      alertTitle: "Προσοχή / Συνήθη Λάθη που πρέπει να Αποφεύγετε",
      alertItem1Title: "Μην μπερδεύετε το μήκος των πλευρών με το μέγεθος της γωνίας:",
      alertItem1Desc: " Αν σχεδιάσουμε μια γωνία 30° με μεγάλες γραμμές και μια γωνία 60° με μικρές γραμμές, η γωνία των 60° παραμένει μεγαλύτερη! Το μέγεθος εξαρτάται αποκλειστικά από το άνοιγμα.",
      alertItem2Title: "Προσοχή στην κλίμακα του μοιρογνωμονίου:",
      alertItem2Desc: " Τα περισσότερα μοιρογνωμόνια έχουν διπλή αρίθμηση (από 0° έως 180° και αντίστροφα). Ξεκινάμε πάντα να μετράμε από το 0° της πλευράς που ευθυγραμμίσαμε.",
      alertItem3Title: "Μηδενική vs Ευθεία γωνία:",
      alertItem3Desc: " Στη μηδενική γωνία (0°) οι πλευρές ταυτίζονται προς την ίδια κατεύθυνση, ενώ στην ευθεία (180°) οι πλευρές κινούνται προς αντίθετες κατευθύνσεις σχηματίζοντας ευθεία γραμμή.",

      ctaTitle: "Ώρα για Εξάσκηση στη Μέτρηση Γωνιών!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με είδη γωνιών, μοιρογνωμόνιο και συμπληρωματικές/παραπληρωματικές γωνίες για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων",

      angleNames: {
        zero: 'Μηδενική γωνία (0°)',
        acute: 'Οξεία γωνία (μικρότερη από 90°)',
        right: 'Ορθή γωνία (ακριβώς 90°)',
        obtuse: 'Αμβλεία γωνία (μεταξύ 90° και 180°)',
        straight: 'Ευθεία γωνία (ακριβώς 180°)'
      }
    },
    en: {
      headTitle: "Measuring & Comparing Angles - 6th Grade | LearnMaths.gr",
      headDesc: "Learn how to measure and compare angles using a protractor, discover angle types, and explore angle relationships for 6th Grade.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      heroBadge: "CHAPTER 68 • 6TH GRADE",
      heroTitle: "Measuring & Comparing Angles",
      heroDesc: "Discover what an angle is as a geometric shape and as a rotational opening. Learn how to accurately use a protractor, compare angles regardless of arm lengths, and explore complementary and supplementary angles!",
      heroFeature: "Theory, Angle Types, Protractor & Interactive Angle Lab",
      heroCta: "Try the Exercises",

      sec1Title: "Angles in 4 Steps",
      sec1Subtitle: "From the fundamental definition to comparing and calculating unknown angles.",

      step1Badge: "STEP 1",
      step1Tag: "Concept",
      step1Title: "What is an Angle?",
      step1Text: "An angle is the geometric figure formed by two rays sharing a common initial point.",
      step1SubHeading: "Angle components:",
      step1Item1: "Vertex: The shared initial point of the two rays.",
      step1Item2: "Arms / Sides: The two rays that define the angle.",
      step1Item3: "Opening: The magnitude of the angle (the rotation of one arm towards the other).",
      step1Notation: "Notation: An angle with vertex O and arms OA, OB is denoted as Â or ∠AOB.",
      step1Tip: "💡 The sides of an angle are rays extending infinitely! Angle magnitude depends strictly on the rotation, not arm length.",

      step2Badge: "STEP 2",
      step2Tag: "Measurement",
      step2Title: "Measuring with a Protractor",
      step2Text: "The standard unit for measuring angles is the degree (1°). The measuring tool is the protractor:",
      step2SubHeading: "Proper measurement steps:",
      step2Rule1: "Place the center mark of the protractor directly over the vertex of the angle.",
      step2Rule2: "Align the 0° baseline exactly with one arm of the angle.",
      step2Rule3: "Read the measurement on the scale where the other arm passes through.",
      step2CircleNote: "A full circular turn equals 360 degrees (360°).",
      step2Tip: "⚡ Pay attention to whether you read the inner or outer scale, always starting from zero (0°)!",

      step3Badge: "STEP 3",
      step3Tag: "Classification",
      step3Title: "Types of Angles",
      step3Text: "Based on their degree measure, angles are grouped into fundamental categories:",
      step3Zero: "Zero: 0°",
      step3Acute: "Acute: 0° ＜ opening ＜ 90°",
      step3Right: "Right: exactly 90°",
      step3Obtuse: "Obtuse: 90° ＜ opening ＜ 180°",
      step3Straight: "Straight: exactly 180°",
      step3Full: "Complete / Full: exactly 360°",
      step3Tip: "🎯 The right angle (90°) serves as the fundamental benchmark for comparing all other angles!",

      step4Badge: "STEP 4",
      step4Tag: "Relationships",
      step4Title: "Comparison & Special Pairs",
      step4Text: "Two angles can be compared either by superposition or by measuring their degree values:",
      step4CompTitle: "1. Complementary Angles:",
      step4CompDesc: "Two angles whose sum is equal to 90° (forming a right angle).",
      step4SuppTitle: "2. Supplementary Angles:",
      step4SuppDesc: "Two angles whose sum is equal to 180° (forming a straight angle).",
      step4Tip: "🚀 To find the complement of angle a: 90° － a. For the supplement: 180° － a!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "Interactive Protractor & Angle Identification (SVG)",
      lab1Desc: "Drag the degree slider to rotate the arm and observe its opening and classification in real time:",
      lab1SliderLabel: "ANGLE OPENING:",
      lab1QuickLabel: "QUICK SELECT KEY ANGLES:",
      lab1KindLabel: "Angle Type:",
      lab1DescRight: "📐 Both sides are perpendicular to each other.",
      lab1DescAcute: "🔍 Smaller opening than a right angle.",
      lab1DescObtuse: "📏 Larger than a right angle, smaller than a straight angle.",
      lab1DescStraight: "➖ Both sides are opposite rays forming a straight line.",
      lab1DescZero: "⭕ Both rays coincide completely.",
      lab1SvgVertex: "Vertex (O)",
      lab1SvgNote: "The cyan ray indicates the initial baseline (0°) and the purple ray indicates the rotating arm.",

      lab2Badge: "📐 INTERACTIVE LAB 2: ANGLE RELATIONSHIPS",
      lab2Title: "Complementary & Supplementary Angle Calculator",
      lab2Desc: "Select an initial angle to see how many degrees are required to make a right angle (90°) or straight angle (180°):",
      lab2SliderLabel: "INITIAL ANGLE (a):",
      lab2LabTip: "💡 In this lab we explore acute angles (up to 89°) to ensure a positive complementary angle exists.",
      lab2CompBadge: "COMPLEMENTARY ANGLE",
      lab2CompSum: "Sum: ",
      lab2CompResult: "90° (Right)",
      lab2SuppBadge: "SUPPLEMENTARY ANGLE",
      lab2SuppSum: "Sum: ",
      lab2SuppResult: "180° (Straight)",

      probSecTitle: "Solved Problems with Angles",
      probSecSubtitle: "Practical applications of angle measurement and angle pairs in real-world problems.",

      prob1Badge: "PROBLEM 1: DIVIDING A RIGHT ANGLE",
      prob1Tag: "Complementary",
      prob1Title: "Calculating an Unknown Angle in a Right Angle",
      prob1Desc: "A 90° right angle is divided by an internal ray into two adjacent angles. If one angle measures 34°, what is the measure of the other angle?",
      prob1TableHeading: "PROBLEM DATA",
      prob1ThTotal: "Total angle",
      prob1ThTotalVal: "90° (right)",
      prob1ThKnown: "Known angle",
      prob1ThRel: "Relationship",
      prob1ThRelVal: "Complementary",
      prob1StepsHeading: "Solution Steps:",
      prob1Step1: "Because the total angle is right, the two angles sum to 90°.",
      prob1Step2: "Subtract known angle: 90° － 34° ＝ 56°.",
      prob1Tip: "💡 Verification: 34° ＋ 56° ＝ 90°, so the calculation is confirmed.",

      prob2Badge: "PROBLEM 2: CLOCK HANDS",
      prob2Tag: "Motion & Degrees",
      prob2Title: "Angle Formed by Clock Hands",
      prob2Desc: "An analog clock shows exactly 3:00. How many degrees is the angle between the hour hand and minute hand, and what type of angle is it?",
      prob2TableHeading: "CALCULATION DATA",
      prob2ThCircle: "Full circle",
      prob2ThSpan: "Span",
      prob2ThSpanVal: "3 hours (12 to 3)",
      prob2ThCalc: "Calculation",
      prob2ThCalcVal: "3 · 30° ＝ 90°",
      prob2StepsHeading: "Solution Steps:",
      prob2Step1Prefix: "The clock face is a 360° circle divided into 12 equal hours:",
      prob2Step1Suffix: "per hour.",
      prob2Step2: "At 3:00 the minute hand is at 12 and the hour hand is at 3 (distance of 3 hours): 3 · 30° ＝ 90°.",
      prob2Step3: "An angle of 90° is a right angle.",
      prob2Tip: "⚡ At 6:00 the clock hands form 180° (straight angle), while at 9:00 they form a 90° right angle once more!",

      alertTitle: "Caution / Common Errors to Avoid",
      alertItem1Title: "Do not confuse arm length with angle magnitude:",
      alertItem1Desc: " Drawing a 30° angle with very long rays and a 60° angle with short lines does not change the fact that 60° is larger! Size depends solely on the opening.",
      alertItem2Title: "Watch the protractor scale:",
      alertItem2Desc: " Most protractors have dual scales (0° to 180° in both directions). Always read starting from 0° on the aligned arm to avoid misidentifying 50° as 130°.",
      alertItem3Title: "Zero vs Straight angle:",
      alertItem3Desc: " In a zero angle (0°) both rays point in the identical direction, whereas in a straight angle (180°) the rays point in opposite directions forming a straight line.",

      ctaTitle: "Time to Practice Angle Measurements!",
      ctaDesc: "Test your skills with 10 interactive questions covering angle types, protractors, and complementary/supplementary angles for 6th Grade.",
      ctaButton: "Start Exercises",

      angleNames: {
        zero: 'Zero angle (0°)',
        acute: 'Acute angle (less than 90°)',
        right: 'Right angle (exactly 90°)',
        obtuse: 'Obtuse angle (between 90° and 180°)',
        straight: 'Straight angle (exactly 180°)'
      }
    }
  };

  const t = translations[locale];

  // Εργαστήριο 1: Διαδραστικό Μοιρογνωμόνιο & Μέτρηση Γωνίας
  const [angleDeg, setAngleDeg] = useState(55);

  // Ταξινόμηση είδους γωνίας
  const angleClassification = useMemo(() => {
    if (angleDeg === 0) return { name: t.angleNames.zero, badge: 'bg-slate-100 text-slate-800' };
    if (angleDeg < 90) return { name: t.angleNames.acute, badge: 'bg-sky-100 text-sky-800' };
    if (angleDeg === 90) return { name: t.angleNames.right, badge: 'bg-emerald-100 text-emerald-800' };
    if (angleDeg < 180) return { name: t.angleNames.obtuse, badge: 'bg-amber-100 text-amber-800' };
    return { name: t.angleNames.straight, badge: 'bg-purple-100 text-purple-800' };
  }, [angleDeg, t]);

  // Υπολογισμός συντεταγμένων περιστρεφόμενης πλευράς για το SVG
  const { armX, armY, arcPath } = useMemo(() => {
    const cx = 180;
    const cy = 180;
    const r = 130;
    const rad = (angleDeg * Math.PI) / 180;

    const x = cx + r * Math.cos(-rad);
    const y = cy + r * Math.sin(-rad);

    const arcRadius = 45;
    const arcX = cx + arcRadius * Math.cos(-rad);
    const arcY = cy + arcRadius * Math.sin(-rad);
    const largeArcFlag = angleDeg > 180 ? 1 : 0;
    const path = `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} 0 ${arcX} ${arcY}`;

    return { armX: x, armY: y, arcPath: path };
  }, [angleDeg]);

  // Εργαστήριο 2: Συμπληρωματικές & Παραπληρωματικές Γωνίες
  const [givenAngle, setGivenAngle] = useState(40);

  const complementary = Math.max(0, 90 - givenAngle);
  const supplementary = Math.max(0, 180 - givenAngle);

  return (
    <Layout
      title={t.headTitle}
      description={t.headDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/68-gonies-ask"
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
              href="/st-dimotikou/68-gonies-ask"
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
                  <div className="font-semibold text-slate-800">
                    {t.step1SubHeading}
                  </div>
                  <div className="text-slate-600 text-[11px] sm:text-xs space-y-1">
                    <div>— <strong>{t.step1Item1.split(':')[0]}:</strong>{t.step1Item1.split(':')[1]}</div>
                    <div>— <strong>{t.step1Item2.split(':')[0]}:</strong>{t.step1Item2.split(':')[1]}</div>
                    <div>— <strong>{t.step1Item3.split(':')[0]}:</strong>{t.step1Item3.split(':')[1]}</div>
                  </div>
                  <div className="text-blue-900 font-bold text-xs pt-1 border-t border-slate-200">
                    {t.step1Notation}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="text-amber-950 font-bold">
                    {t.step2SubHeading}
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] sm:text-xs">
                    <li>{t.step2Rule1}</li>
                    <li>{t.step2Rule2}</li>
                    <li>{t.step2Rule3}</li>
                  </ol>
                  <div className="text-slate-800 font-semibold text-[11px] pt-1 border-t border-slate-200">
                    {t.step2CircleNote}
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
                  <div><strong>{t.step3Zero.split(':')[0]}:</strong> {t.step3Zero.split(':')[1]}</div>
                  <div><strong>{t.step3Acute.split(':')[0]}:</strong> {t.step3Acute.split(':')[1]}</div>
                  <div className="text-emerald-800 font-bold"><strong>{t.step3Right.split(':')[0]}:</strong> {t.step3Right.split(':')[1]}</div>
                  <div><strong>{t.step3Obtuse.split(':')[0]}:</strong> {t.step3Obtuse.split(':')[1]}</div>
                  <div className="text-purple-800 font-bold"><strong>{t.step3Straight.split(':')[0]}:</strong> {t.step3Straight.split(':')[1]}</div>
                  <div><strong>{t.step3Full.split(':')[0]}:</strong> {t.step3Full.split(':')[1]}</div>
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
                  <div className="font-bold text-emerald-900">
                    {t.step4CompTitle}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {t.step4CompDesc}
                  </p>
                  <div className="font-bold text-teal-900 pt-1 border-t border-slate-200">
                    {t.step4SuppTitle}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {t.step4SuppDesc}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΜΟΙΡΟΓΝΩΜΟΝΙΟ & ΜΕΤΡΗΣΗ ΓΩΝΙΑΣ */}
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
                  <span className="font-mono text-xl font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {formatNum(angleDeg, locale)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={180}
                  step={1}
                  value={angleDeg}
                  onChange={(e) => setAngleDeg(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>0°</span>
                  <span>45°</span>
                  <span>90°</span>
                  <span>135°</span>
                  <span>180°</span>
                </div>
              </div>

              {/* Γρήγορα κουμπιά επιλογής βασικών γωνιών */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">
                  {toCleanUppercase(t.lab1QuickLabel)}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[30, 45, 90, 120, 135, 150, 180].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setAngleDeg(deg)}
                      className={`py-2 px-1.5 rounded-xl text-xs font-black transition-all ${
                        angleDeg === deg
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταξινόμησης */}
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-indigo-950 font-semibold">{t.lab1KindLabel}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-black ${angleClassification.badge}`}>
                    {angleClassification.name}
                  </span>
                </div>
                <div className="text-xs text-slate-600 pt-1 border-t border-indigo-200/60 leading-relaxed">
                  {angleDeg === 90 && t.lab1DescRight}
                  {angleDeg < 90 && angleDeg > 0 && t.lab1DescAcute}
                  {angleDeg > 90 && angleDeg < 180 && t.lab1DescObtuse}
                  {angleDeg === 180 && t.lab1DescStraight}
                  {angleDeg === 0 && t.lab1DescZero}
                </div>
              </div>
            </div>

            {/* SVG Μοιρογνωμόνιο Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 220"
                className="w-full max-w-[340px] sm:max-w-[400px] h-auto select-none"
              >
                {/* Ημικύκλιο Μοιρογνωμονίου */}
                <path
                  d="M 40 180 A 140 140 0 0 1 320 180 Z"
                  fill="rgba(255, 255, 255, 0.04)"
                  stroke="#475569"
                  strokeWidth="1.5"
                />

                {/* Χαράξεις μοιρών (κάθε 10 μοίρες) */}
                {Array.from({ length: 19 }).map((_, i) => {
                  const deg = i * 10;
                  const rad = (deg * Math.PI) / 180;
                  const x1 = 180 + 140 * Math.cos(-rad);
                  const y1 = 180 + 140 * Math.sin(-rad);
                  const tickLen = deg % 30 === 0 ? 12 : 6;
                  const x2 = 180 + (140 - tickLen) * Math.cos(-rad);
                  const y2 = 180 + (140 - tickLen) * Math.sin(-rad);

                  return (
                    <g key={deg}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={deg % 30 === 0 ? "1.8" : "1"} />
                      {deg % 30 === 0 && (
                        <text
                          x={180 + 115 * Math.cos(-rad)}
                          y={180 + 115 * Math.sin(-rad) + 4}
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {deg}°
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Βάση Μοιρογνωμονίου */}
                <line x1="30" y1="180" x2="330" y2="180" stroke="#64748b" strokeWidth="2" />

                {/* Τόξο Ανοίγματος Γωνίας */}
                {angleDeg > 0 && (
                  <path
                    d={arcPath}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray={angleDeg === 90 ? "none" : "3 2"}
                  />
                )}

                {/* Σταθερή Πλευρά Γωνίας (Οριζόντια στο 0°) */}
                <line x1="180" y1="180" x2="310" y2="180" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

                {/* Κινούμενη Πλευρά Γωνίας */}
                <line x1="180" y1="180" x2={armX} y2={armY} stroke="#818cf8" strokeWidth="3.5" strokeLinecap="round" />

                {/* Κορυφή Ο */}
                <circle cx="180" cy="180" r="5" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                <text x="180" y="202" fill="#f1f5f9" fontSize="12" fontWeight="bold" textAnchor="middle">
                  {t.lab1SvgVertex}
                </text>

                {/* Ένδειξη Μοιρών στο κέντρο */}
                <text x="180" y="150" fill="#f59e0b" fontSize="16" fontWeight="900" textAnchor="middle">
                  {angleDeg}°
                </text>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {t.lab1SvgNote}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΣΥΜΠΛΗΡΩΜΑΤΙΚΕΣ & ΠΑΡΑΠΛΗΡΩΜΑΤΙΚΕΣ */}
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

            {/* Ρύθμιση Γωνίας (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2SliderLabel)}</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
                    {formatNum(givenAngle, locale)}°
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={89}
                  step={1}
                  value={givenAngle}
                  onChange={(e) => setGivenAngle(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>1°</span>
                  <span>45°</span>
                  <span>89°</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                {t.lab2LabTip}
              </div>
            </div>

            {/* Αποτελέσματα (7 στήλες) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Συμπληρωματική */}
              <div className="bg-teal-50/70 p-5 rounded-3xl border border-teal-200 space-y-3 text-center">
                <span className="text-[11px] text-teal-900 block font-bold tracking-wider">
                  {toCleanUppercase(t.lab2CompBadge)}
                </span>
                <div className="text-3xl font-black text-teal-800 font-mono">
                  {formatNum(complementary, locale)}°
                </div>
                <div className="text-xs text-slate-600 font-mono space-y-1">
                  <div>90° － {formatNum(givenAngle, locale)}° ＝ <strong>{formatNum(complementary, locale)}°</strong></div>
                  <div className="text-[11px] font-sans text-teal-900">
                    {t.lab2CompSum}{formatNum(givenAngle, locale)}° ＋ {formatNum(complementary, locale)}° ＝ <strong>{t.lab2CompResult}</strong>
                  </div>
                </div>
              </div>

              {/* Παραπληρωματική */}
              <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-200 space-y-3 text-center">
                <span className="text-[11px] text-purple-900 block font-bold tracking-wider">
                  {toCleanUppercase(t.lab2SuppBadge)}
                </span>
                <div className="text-3xl font-black text-purple-800 font-mono">
                  {formatNum(supplementary, locale)}°
                </div>
                <div className="text-xs text-slate-600 font-mono space-y-1">
                  <div>180° － {formatNum(givenAngle, locale)}° ＝ <strong>{formatNum(supplementary, locale)}°</strong></div>
                  <div className="text-[11px] font-sans text-purple-900">
                    {t.lab2SuppSum}{formatNum(givenAngle, locale)}° ＋ {formatNum(supplementary, locale)}° ＝ <strong>{t.lab2SuppResult}</strong>
                  </div>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThTotal}</span> {t.prob1ThTotalVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThKnown}</span> 34°
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThRel}</span> {t.prob1ThRelVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeading}</span>
                  <div>{t.prob1Step1}</div>
                  <div>{t.prob1Step2.split(':')[0]}: 90° － 34° ＝ <strong className="text-blue-700">56°</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                {t.prob1Tip}
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2: ΜΕ ΚΑΝΟΝΙΚΗ ΚΛΑΣΜΑΤΙΚΗ ΜΟΡΦΗ */}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThCircle}</span>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <Fraction n="360°" d="12" />
                      <span>＝ 30°</span>
                    </div>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThSpan}</span> {t.prob2ThSpanVal}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThCalc}</span> {t.prob2ThCalcVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeading}</span>
                  <div className="flex items-center flex-wrap gap-1">
                    <span>{t.prob2Step1Prefix}</span>
                    <Fraction n="360°" d="12" />
                    <span>＝ <strong>30°</strong> {t.prob2Step1Suffix}</span>
                  </div>
                  <div>
                    {t.prob2Step2.split(':')[0]}: 3 · 30° ＝ <strong className="text-amber-700">90°</strong>.
                  </div>
                  <div>
                    {t.prob2Step3}
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
            href="/st-dimotikou/68-gonies-ask"
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
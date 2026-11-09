// pages/st-dimotikou/63-geometrika-motiba.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Βοηθητικό component εμφάνισης κλάσματος με οριζόντια κλασματική γραμμή (καθαρό JSX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται αυστηρά το ΣΤ')
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

// Λεξικό διεθνοποίησης (i18n)
const TRANSLATIONS = {
  el: {
    metaTitle: "Γεωμετρικά Μοτίβα - ΣΤ' Δημοτικού | LearnMaths.gr",
    metaDesc: "Μαθαίνουμε για τα γεωμετρικά μοτίβα, τους κανόνες επανάληψης και αύξησης, τα μοτίβα στη φύση (κηρήθρες, σπείρες) και στην τέχνη (μαίανδρος, πλακοστρώσεις).",
    gradeBadge: "ΚΕΦΑΛΑΙΟ 63 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Γεωμετρικά Μοτίβα: Στη Φύση & στην Τέχνη",
    heroDesc: "Ανακαλύπτουμε την ομορφιά της γεωμετρικής επανάληψης: πώς ένας απλός κανόνας δημιουργεί αρμονία, πώς προβλέπουμε τα επόμενα στοιχεία μιας ακολουθίας, και πώς τα γεωμετρικά μοτίβα εμφανίζονται παντού γύρω μας — από τις κηρήθρες των μελισσών και τις νιφάδες χιονιού, μέχρι τον αρχαιοελληνικό μαίανδρο και τα περίτεχνα ψηφιδωτά.",
    heroSubbadge: "Θεωρία, Κανόνες Ακολουθιών, Διαδραστική Πλακόστρωση & Γεννήτρια Τελειών",
    heroBtn: "Δοκίμασε τις Ασκήσεις",
    btnExercises: "Ασκήσεις",
    backLinkText: "ΣΤ' Δημοτικού",

    stepsHeading: "Η Έννοια του Μοτίβου σε 4 Βήματα",
    stepsSubheading: "Από την απλή επανάληψη σχημάτων μέχρι τους μαθηματικούς κανόνες και τις εφαρμογές στον κόσμο.",

    step1Badge: "ΒΗΜΑ 1",
    step1Tag: "Βασικός Ορισμός",
    step1Title: "Τι είναι Γεωμετρικό Μοτίβο;",
    step1Desc: "Γεωμετρικό μοτίβο ονομάζεται μια διάταξη σχημάτων ή γραμμών που επαναλαμβάνεται ακολουθώντας έναν συγκεκριμένο και σταθερό κανόνα.",
    step1CoreTitle: "Πυρήνας Μοτίβου:",
    step1CoreText: "Το βασικό κομμάτι σχημάτων που επαναλαμβάνεται αυτούσιο.",
    step1CoreSub: "Εδώ ο πυρήνας έχει 3 σχήματα. Το 4ο σχήμα είναι πάλι 🔺, το 5ο 🟦 κ.ο.κ.",
    step1Tip: "Εντοπίζοντας τον πυρήνα του μοτίβου, μπορούμε να προβλέψουμε ποιο σχήμα θα βρίσκεται σε οποιαδήποτε μελλοντική θέση!",

    step2Badge: "ΒΗΜΑ 2",
    step2Tag: "Μαθηματικός Κανόνας",
    step2Title: "Αυξανόμενα Μοτίβα & Τύποι",
    step2Desc: "Σε πολλά μοτίβα τα σχήματα δεν επαναλαμβάνονται απλώς, αλλά μεγαλώνουν σε κάθε βήμα ακολουθώντας έναν μαθηματικό κανόνα:",
    step2Step1: "Βήμα 1: 1 τελίτσα (1 · 1 ＝ 1)",
    step2Step2: "Βήμα 2: 4 τελίτσες (2 · 2 ＝ 4)",
    step2Step3: "Βήμα 3: 9 τελίτσες (3 · 3 ＝ 9)",
    step2RuleTitle: "Κανόνας για το βήμα n:",
    step2RuleText: "Πλήθος ＝ n · n",
    step2Tip: "Με τη βοήθεια μιας μεταβλητής n, βρίσκουμε πόσες τελίτσες χρειάζονται ακόμα και για το 100ό βήμα χωρίς να τις σχεδιάσουμε!",

    step3Badge: "ΒΗΜΑ 3",
    step3Tag: "Φυσικός Κόσμος",
    step3Title: "Γεωμετρικά Μοτίβα στη Φύση",
    step3Desc: "Η φύση είναι γεμάτη από ιδιοφυή γεωμετρικά μοτίβα που εξυπηρετούν την οικονομία χώρου και υλικών:",
    step3Pt1Title: "Κηρήθρα Μελισσών:",
    step3Pt1Text: "Κανονικά εξάγωνα που καλύπτουν πλήρως τον χώρο χωρίς κενά, χρησιμοποιώντας το ελάχιστο κερί.",
    step3Pt2Title: "Ηλιοτρόπια & Κοχύλια:",
    step3Pt2Text: "Σπείρες που ακολουθούν την περίφημη μαθηματική ακολουθία Fibonacci.",
    step3Pt3Title: "Νιφάδες Χιονιού:",
    step3Pt3Text: "Εξαγωνική συμμετρία κρυστάλλων.",
    step3Tip: "Το κανονικό εξάγωνο είναι το ιδανικό σχήμα για πλακόστρωση χωρίς απώλεια χώρου!",

    step4Badge: "ΒΗΜΑ 4",
    step4Tag: "Πολιτισμός & Τέχνη",
    step4Title: "Μοτίβα στην Τέχνη & Πλακοστρώσεις",
    step4Desc: "Από την αρχαιότητα, οι άνθρωποι διακοσμούσαν ναούς, αγγεία και υφάσματα με γεωμετρικά μοτίβα:",
    step4Pt1Title: "Ελληνικός Μαίανδρος:",
    step4Pt1Text: "Συνεχής γραμμή που διπλώνει σε ορθές γωνίες, σύμβολο της αιωνιότητας και της ροής.",
    step4Pt2Title: "Πλακόστρωση (Tessellation):",
    step4Pt2Text: "Κάλυψη επιφάνειας με σχήματα χωρίς κενά και χωρίς επικαλύψεις (όπως τα πλακάκια του δαπέδου ή τα έργα του M.C. Escher).",
    step4Tip: "Μόνο τρία κανονικά πολύγωνα μπορούν μόνα τους να πλακοστρώσουν το επίπεδο: το ισόπλευρο τρίγωνο, το τετράγωνο και το κανονικό εξάγωνο!",

    lab1Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
    lab1Title: "Διαδραστική Γεννήτρια Αυξανόμενου Μοτίβου (Τελίτσες έως n ＝ 20)",
    lab1Desc: "Ρύθμισε το βήμα (n από 1 έως 20) και δες πώς οι τελίτσες διατάσσονται σε τετράγωνα ή τριγωνικά μοτίβα και πώς αυξάνεται ραγδαία το πλήθος τους.",
    dotsLayoutLabel: "ΔΙΑΤΑΞΗ ΤΕΛΙΤΣΩΝ:",
    squarePatternBtn: "🟦 Τετραγωνικό (n²)",
    trianglePatternBtn: "🔺 Τριγωνικό",
    stepLabel: "ΒΗΜΑ (n από 1 έως 20):",
    mathRuleTitle: "Μαθηματικός Κανόνας:",
    forNLabel: "Για n ＝",
    dotsUnit: "τελίτσες",
    visTitle: "ΟΠΤΙΚΟΠΟΙΗΣΗ ΤΕΛΕΙΩΝ (ΒΗΜΑ",
    totalLabel: "Σύνολο:",

    lab2Badge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΞΥΠΝΑ ΜΟΤΙΒΑ",
    lab2Title: "Πλακόστρωση του Επιπέδου: Φύση, Τέχνη & Αρχιτεκτονική",
    lab2Desc: "Επίλεξε έξυπνα στυλ πλακόστρωσης και άλλαξε χρωματική παλέτα για να δεις τη μαγεία της τέλειας γεωμετρικής επανάληψης χωρίς κενά:",
    patternFilterLabel: "ΜΟΤΙΒΟ:",
    honeycombBtn: "🐝 Κηρήθρα (Εξάγωνα)",
    herringboneBtn: "🧱 Ψαροκόκαλο (Παρκέ)",
    meanderBtn: "🏛️ Ελληνικός Μαίανδρος",
    checkerBtn: "🏁 Σκακιέρα",
    trianglesBtn: "🔺 Τριγωνικό Πλέγμα",
    paletteLabel: "ΠΑΛΕΤΑ:",
    goldPalette: "Χρυσή παλέτα",
    bluePalette: "Μπλε παλέτα",
    emeraldPalette: "Πράσινη παλέτα",
    rosePalette: "Κόκκινη παλέτα",
    geomPrincipleTitle: "Γεωμετρική Αρχή:",
    geomPrincipleText: "Σε μια πλακόστρωση (tessellation), το άθροισμα των γωνιών των σχημάτων γύρω από κάθε κοινή κορυφή πρέπει να είναι ακριβώς 360°. Στα κανονικά εξάγωνα της κηρήθρας: 120° · 3 ＝ 360°!",

    problemsHeading: "Λυμένα Προβλήματα με Γεωμετρικά Μοτίβα",
    problemsSubheading: "Αναλυτικοί υπολογισμοί για πρόβλεψη μελλοντικών στοιχείων και εύρεση μαθηματικών κανόνων.",

    prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΑΥΞΑΝΟΜΕΝΟ ΜΟΤΙΒΟ",
    prob1Tag: "Κατασκευή με Σπίρτα",
    prob1Title: "Πρόβλεψη Πλήθους για το 20ό Σχήμα",
    prob1Desc: "Σχηματίζουμε μια σειρά από ενωμένα τετράγωνα με σπίρτα: Το 1ο τετράγωνο χρειάζεται 4 σπίρτα. Κάθε επόμενο τετράγωνο που κολλάει δίπλα του χρειάζεται 3 επιπλέον σπίρτα (αφού μοιράζονται μία κοινή πλευρά). Πόσα σπίρτα θα χρειαστούν για να φτιάξουμε 20 ενωμένα τετράγωνα;",
    prob1TableTitle: "ΠΑΡΑΤΗΡΗΣΗ ΒΗΜΑΤΩΝ",
    sq1Label: "1ο τετράγωνο",
    sq1Val: "4 σπίρτα",
    sq2Label: "2 τετράγωνα",
    sq2Val: "4 ＋ 3 ＝ 7",
    sq3Label: "3 τετράγωνα",
    sq3Val: "4 ＋ 3 ＋ 3 ＝ 10",
    stepsTitle: "Βήματα Επίλυσης:",
    prob1RuleTitle: "Κανόνας για n τετράγωνα:",
    prob1RuleDesc: "1 ＋ (3 · n) ή ισοδύναμα 4 ＋ 3 · (n － 1).",
    prob1CalcTitle: "Για n ＝ 20 τετράγωνα:",
    prob1CalcVal: "61 σπίρτα",
    prob1Secret: "Βρίσκοντας τον μαθηματικό τύπο 3 · n ＋ 1, αποφεύγουμε τη μέτρηση ένα-ένα!",

    prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΕΠΑΝΑΛΑΜΒΑΝΟΜΕΝΟ ΜΟΤΙΒΟ",
    prob2Tag: "Ευκλείδεια Διαίρεση",
    prob2Title: "Εύρεση του 47ου Στοιχείου μιας Ακολουθίας",
    prob2Desc: "Σε μια διακοσμητική μπορντούρα τοποθετούνται σχήματα με την εξής σειρά που επαναλαμβάνεται συνεχώς: Τρίγωνο, Κύκλος, Τετράγωνο, Ρόμβος (πυρήνας 4 σχημάτων). Ποιο σχήμα θα βρίσκεται στην 47η θέση;",
    prob2TableTitle: "ΠΥΡΗΝΑΣ ΕΠΑΝΑΛΗΨΗΣ (ΜΗΚΟΣ 4)",
    pos1Label: "Θέση 1",
    pos1Val: "🔺 Τρίγωνο",
    pos2Label: "Θέση 2",
    pos2Val: "🟢 Κύκλος",
    pos3Label: "Θέση 3",
    pos3Val: "🟦 Τετράγωνο",
    pos4Label: "Θέση 4",
    pos4Val: "🔶 Ρόμβος",
    prob2DivTitle: "Διαίρεση θέσης με το μήκος του πυρήνα:",
    prob2DivText: "47 : 4 ＝ 11 με υπόλοιπο 3.",
    prob2RepeatText: "Ο πυρήνας των 4 σχημάτων θα επαναληφθεί 11 ολόκληρες φορές.",
    prob2RemainderText: "Το υπόλοιπο 3 σημαίνει ότι το 47ο στοιχείο είναι το 3ο του πυρήνα:",
    prob2Answer: "Τετράγωνο (🟦)",
    prob2Secret: "Αν το υπόλοιπο ήταν 0, το στοιχείο θα ήταν το τελευταίο του πυρήνα (δηλαδή ο Ρόμβος).",

    ctaHeading: "Ώρα για Εξάσκηση στα Γεωμετρικά Μοτίβα!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με πρόβλεψη σχημάτων, αυξανόμενα μοτίβα, πλακοστρώσεις και μοτίβα στη φύση για τη ΣΤ' Δημοτικού.",
    ctaBtn: "Έναρξη Ασκήσεων"
  },
  en: {
    metaTitle: "Geometric Patterns - 6th Grade | LearnMaths.gr",
    metaDesc: "Explore geometric patterns, rules of repeating and growing sequences, patterns in nature (honeycombs, spirals), and art (meander, tessellations).",
    gradeBadge: "CHAPTER 63 • 6TH GRADE",
    heroTitle: "Geometric Patterns: In Nature & Art",
    heroDesc: "Discover the elegance of geometric repetition: how a simple mathematical rule creates visual harmony, how we predict subsequent terms in a sequence, and how geometric patterns appear all around us — from honeycomb hexagonal grids and snowflakes, to the ancient Greek meander and intricate mosaics.",
    heroSubbadge: "Theory, Sequence Rules, Interactive Tessellation & Dot Generator",
    heroBtn: "Try the Exercises",
    btnExercises: "Exercises",
    backLinkText: "6th Grade",

    stepsHeading: "The Concept of Patterns in 4 Steps",
    stepsSubheading: "From simple shape repetition to mathematical formulas and real-world applications.",

    step1Badge: "STEP 1",
    step1Tag: "Fundamental Definition",
    step1Title: "What is a Geometric Pattern?",
    step1Desc: "A geometric pattern is an arrangement of shapes or lines repeated according to a specific and consistent mathematical rule.",
    step1CoreTitle: "Pattern Core:",
    step1CoreText: "The foundational repeating block of shapes.",
    step1CoreSub: "Here the core consists of 3 shapes. The 4th shape is again 🔺, the 5th 🟦, and so on.",
    step1Tip: "By identifying the pattern's repeating core, we can reliably predict the shape located at any future position!",

    step2Badge: "STEP 2",
    step2Tag: "Mathematical Rule",
    step2Title: "Growing Patterns & Formulas",
    step2Desc: "In many patterns, shapes do not merely repeat; they grow at each consecutive step according to an algebraic rule:",
    step2Step1: "Step 1: 1 dot (1 · 1 ＝ 1)",
    step2Step2: "Step 2: 4 dots (2 · 2 ＝ 4)",
    step2Step3: "Step 3: 9 dots (3 · 3 ＝ 9)",
    step2RuleTitle: "Rule for step n:",
    step2RuleText: "Quantity ＝ n · n",
    step2Tip: "Using a variable n, we can compute the exact dot count even for the 100th step without drawing each one!",

    step3Badge: "STEP 3",
    step3Tag: "Natural World",
    step3Title: "Geometric Patterns in Nature",
    step3Desc: "Nature is filled with ingenious geometric patterns optimized for spatial efficiency and minimal material use:",
    step3Pt1Title: "Bee Honeycomb:",
    step3Pt1Text: "Regular hexagons tiling the plane seamlessly with zero gaps, requiring the minimum amount of wax.",
    step3Pt2Title: "Sunflowers & Shells:",
    step3Pt2Text: "Spirals governed by the famed Fibonacci mathematical sequence.",
    step3Pt3Title: "Snowflakes:",
    step3Pt3Text: "Six-fold hexagonal crystal symmetry.",
    step3Tip: "The regular hexagon is the optimal geometric shape for gapless tiling with minimal perimeter!",

    step4Badge: "STEP 4",
    step4Tag: "Culture & Art",
    step4Title: "Patterns in Art & Tessellations",
    step4Desc: "Since antiquity, civilizations have adorned monuments, pottery, and fabrics with geometric patterns:",
    step4Pt1Title: "Greek Meander:",
    step4Pt1Text: "A continuous line folded at right angles, symbolizing infinity, unity, and perpetual flow.",
    step4Pt2Title: "Tessellation:",
    step4Pt2Text: "Covering a plane surface with contiguous shapes without gaps or overlaps (such as tile pavements or M.C. Escher artworks).",
    step4Tip: "Only three regular polygons can tile the Euclidean plane on their own: the equilateral triangle, the square, and the regular hexagon!",

    lab1Badge: "INTERACTIVE LAB 1",
    lab1Title: "Interactive Growing Pattern Generator (Dots up to n ＝ 20)",
    lab1Desc: "Select the step (n from 1 to 20) and observe how dots arrange into square or triangular patterns, illustrating rapid quadratic growth.",
    dotsLayoutLabel: "DOT ARRANGEMENT:",
    squarePatternBtn: "🟦 Square (n²)",
    trianglePatternBtn: "🔺 Triangular",
    stepLabel: "STEP (n from 1 to 20):",
    mathRuleTitle: "Mathematical Rule:",
    forNLabel: "For n ＝",
    dotsUnit: "dots",
    visTitle: "DOT VISUALIZATION (STEP",
    totalLabel: "Total:",

    lab2Badge: "INTERACTIVE LAB 2: SMART PATTERNS",
    lab2Title: "Tessellations: Nature, Art & Architecture",
    lab2Desc: "Select tessellation styles and swap color palettes to experience seamless geometric plane-tiling without gaps:",
    patternFilterLabel: "PATTERN:",
    honeycombBtn: "🐝 Honeycomb (Hexagons)",
    herringboneBtn: "🧱 Herringbone (Parquet)",
    meanderBtn: "🏛️ Greek Meander",
    checkerBtn: "🏁 Checkerboard",
    trianglesBtn: "🔺 Triangular Grid",
    paletteLabel: "PALETTE:",
    goldPalette: "Gold palette",
    bluePalette: "Blue palette",
    emeraldPalette: "Emerald palette",
    rosePalette: "Rose palette",
    geomPrincipleTitle: "Geometric Principle:",
    geomPrincipleText: "In any regular tessellation, the sum of internal angles meeting at every shared vertex must equal exactly 360°. For honeycomb regular hexagons: 120° · 3 ＝ 360°!",

    problemsHeading: "Worked Real-World Geometric Pattern Problems",
    problemsSubheading: "Step-by-step solutions for predicting terms in sequences and formulating algebraic rules.",

    prob1Badge: "PROBLEM 1: GROWING PATTERN",
    prob1Tag: "Matchstick Construction",
    prob1Title: "Predicting the Count for the 20th Figure",
    prob1Desc: "A sequence of contiguous matchstick squares is constructed: The 1st square requires 4 matchsticks. Each subsequent adjoining square requires 3 additional matchsticks (sharing one common side). How many matchsticks are needed to form 20 contiguous squares?",
    prob1TableTitle: "OBSERVING STEPS",
    sq1Label: "1st square",
    sq1Val: "4 matchsticks",
    sq2Label: "2 squares",
    sq2Val: "4 ＋ 3 ＝ 7",
    sq3Label: "3 squares",
    sq3Val: "4 ＋ 3 ＋ 3 ＝ 10",
    stepsTitle: "Solution Steps:",
    prob1RuleTitle: "Rule for n squares:",
    prob1RuleDesc: "1 ＋ (3 · n) or equivalently 4 ＋ 3 · (n － 1).",
    prob1CalcTitle: "For n ＝ 20 squares:",
    prob1CalcVal: "61 matchsticks",
    prob1Secret: "Formulating the algebraic expression 3 · n ＋ 1 eliminates tedious one-by-one counting!",

    prob2Badge: "PROBLEM 2: REPEATING PATTERN",
    prob2Tag: "Euclidean Division",
    prob2Title: "Finding the 47th Element in a Sequence",
    prob2Desc: "A decorative border features repeating shapes in the fixed sequence: Triangle, Circle, Square, Rhombus (core length 4). Which shape will appear at the 47th position?",
    prob2TableTitle: "REPEATING CORE (LENGTH 4)",
    pos1Label: "Position 1",
    pos1Val: "🔺 Triangle",
    pos2Label: "Position 2",
    pos2Val: "🟢 Circle",
    pos3Label: "Position 3",
    pos3Val: "🟦 Square",
    pos4Label: "Position 4",
    pos4Val: "🔶 Rhombus",
    prob2DivTitle: "Dividing position by core length:",
    prob2DivText: "47 : 4 ＝ 11 with remainder 3.",
    prob2RepeatText: "The 4-shape core completes 11 full cycles.",
    prob2RemainderText: "The remainder of 3 indicates that the 47th element matches the 3rd element of the core:",
    prob2Answer: "Square (🟦)",
    prob2Secret: "Had the remainder been 0, the element would be the final shape of the core (the Rhombus).",

    ctaHeading: "Ready to Practice Geometric Patterns?",
    ctaDesc: "Test your skills across 10 interactive questions covering shape predictions, growing patterns, tessellations, and natural symmetries for 6th Grade.",
    ctaBtn: "Start Exercises"
  }
};

export default function GeometrikaMotibaTheoryPage() {
  const router = useRouter();
  const locale = router?.locale === 'en' ? 'en' : 'el';
  const t = TRANSLATIONS[locale];

  // Εργαστήριο 1: Αυξανόμενο Μοτίβο με Τελίτσες (n έως 20)
  const [stepN, setStepN] = useState(4);
  const [patternType, setPatternType] = useState('squares'); // 'squares' | 'triangles'

  // Μορφοποίηση αριθμού ανάλογα με τη γλώσσα
  const formatNumberLocale = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '0';
    const numLocale = locale === 'en' ? 'en-US' : 'el-GR';
    return Number(val).toLocaleString(numLocale);
  };

  // Υπολογισμοί για το αυξανόμενο μοτίβο
  const patternData = useMemo(() => {
    if (patternType === 'squares') {
      const count = stepN * stepN;
      return { count, isFraction: false, formulaText: 'n · n ＝ n²', unitName: t.dotsUnit };
    }
    const count = (stepN * (stepN + 1)) / 2;
    return {
      count,
      isFraction: true,
      fractionProps: { num: 'n · (n ＋ 1)', den: '2' },
      unitName: t.dotsUnit
    };
  }, [stepN, patternType, t.dotsUnit]);

  // Εργαστήριο 2: Έξυπνες Πλακοστρώσεις (Tessellations)
  const [tessellationStyle, setTessellationStyle] = useState('honeycomb'); 
  const [activePalette, setActivePalette] = useState('gold'); 

  const paletteColors = useMemo(() => {
    switch (activePalette) {
      case 'blue':
        return { c1: '#1d4ed8', c2: '#3b82f6', c3: '#93c5fd', bg: '#eff6ff' };
      case 'emerald':
        return { c1: '#047857', c2: '#10b981', c3: '#6ee7b7', bg: '#f0fdf4' };
      case 'rose':
        return { c1: '#be185d', c2: '#f43f5e', c3: '#fecdd3', bg: '#fff1f2' };
      default: // gold
        return { c1: '#92400e', c2: '#f59e0b', c3: '#fde68a', bg: '#fefce8' };
    }
  }, [activePalette]);

  return (
    <Layout
      title={t.metaTitle}
      description={t.metaDesc}
      backUrl="/st-dimotikou"
      backText={t.backLinkText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/63-geometrika-motiba-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.btnExercises}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.gradeBadge}</span>
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
              href="/st-dimotikou/63-geometrika-motiba-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>{t.heroBtn}</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              {t.stepsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              {t.stepsSubheading}
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    <strong>{t.step1CoreTitle}</strong> {t.step1CoreText}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-mono text-center text-blue-900 font-bold">
                    🔺 🟦 🟢 ➔ 🔺 🟦 🟢 ➔ 🔺 🟦 🟢
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    {t.step1CoreSub}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>{t.step2Step1}</div>
                  <div>{t.step2Step2}</div>
                  <div>{t.step2Step3}</div>
                  <div className="text-amber-900 font-bold pt-1 font-sans text-xs">
                    {t.step2RuleTitle} <strong>{t.step2RuleText}</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    🐝 <strong>{t.step3Pt1Title}</strong> {t.step3Pt1Text}
                  </div>
                  <div>
                    🌻 <strong>{t.step3Pt2Title}</strong> {t.step3Pt2Text}
                  </div>
                  <div>
                    ❄ <strong>{t.step3Pt3Title}</strong> {t.step3Pt3Text}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Badge}
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Tag}</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    🏛 <strong>{t.step4Pt1Title}</strong> {t.step4Pt1Text}
                  </div>
                  <div>
                    🎨 <strong>{t.step4Pt2Title}</strong> {t.step4Pt2Text}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΑΥΞΑΝΟΜΕΝΟ ΜΟΤΙΒΟ ΜΕ ΤΕΛΙΤΣΕΣ (n έως 20) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.lab1Badge}</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab1Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab1Desc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια Ρύθμισης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Επιλογή Τύπου Μοτίβου */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  {t.dotsLayoutLabel}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPatternType('squares')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      patternType === 'squares'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.squarePatternBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPatternType('triangles')}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      patternType === 'triangles'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {t.trianglePatternBtn}
                  </button>
                </div>
              </div>

              {/* Slider για το Βήμα n (1 έως 20) */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    {t.stepLabel}
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    n ＝ {stepN}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση βήματος"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStepN((prev) => Math.max(1, prev - 1)); }}
                    disabled={stepN <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={1}
                    value={stepN}
                    onChange={(e) => setStepN(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer touch-manipulation"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση βήματος"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setStepN((prev) => Math.min(20, prev + 1)); }}
                    disabled={stepN >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρήγορες Επιλογές Βήματος */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 20].map((quickStep) => (
                  <button
                    key={`qstep-${quickStep}`}
                    type="button"
                    onClick={() => setStepN(quickStep)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-xs transition active:scale-95 touch-manipulation text-center"
                  >
                    n ＝ {quickStep}
                  </button>
                ))}
              </div>

              {/* Κάρτα Σύνοψης με καθαρό JSX Κλάσμα */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1 text-center font-mono">
                <span className="text-xs font-sans text-slate-500 block">{t.mathRuleTitle}</span>
                <div className="text-base sm:text-lg font-black text-blue-700 flex items-center justify-center">
                  {patternData.isFraction ? (
                    <Fraction num={patternData.fractionProps.num} den={patternData.fractionProps.den} />
                  ) : (
                    <span>{patternData.formulaText}</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-slate-700 pt-1">
                  {t.forNLabel} {stepN}: <strong className="text-blue-800 text-base">{formatNumberLocale(patternData.count)}</strong> {patternData.unitName}
                </div>
              </div>

            </div>

            {/* SVG Οπτικοποίηση Αυξανόμενου Μοτίβου Τελειών (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3 min-h-[320px]">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                {t.visTitle} {stepN})
              </span>

              <div className="w-full max-w-[340px] aspect-square bg-white rounded-2xl border border-slate-200 p-3 shadow-inner flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
                  {patternType === 'squares' ? (() => {
                    const spacing = 200 / (stepN + 1);
                    const dotRadius = Math.max(2.2, Math.min(6, spacing / 2.8));
                    const startX = 120 - ((stepN - 1) * spacing) / 2;
                    const startY = 120 - ((stepN - 1) * spacing) / 2;

                    const dots = [];
                    for (let r = 0; r < stepN; r++) {
                      for (let c = 0; c < stepN; c++) {
                        dots.push(
                          <circle
                            key={`sq-dot-${r}-${c}`}
                            cx={startX + c * spacing}
                            cy={startY + r * spacing}
                            r={dotRadius}
                            fill="#3b82f6"
                            stroke="#1d4ed8"
                            strokeWidth={dotRadius > 3 ? "1.5" : "0.8"}
                          />
                        );
                      }
                    }
                    return dots;
                  })() : (() => {
                    const spacing = 200 / (stepN + 1);
                    const dotRadius = Math.max(2.2, Math.min(6, spacing / 2.8));
                    const totalH = (stepN - 1) * spacing;
                    const topY = 120 - totalH / 2;

                    const dots = [];
                    for (let r = 0; r < stepN; r++) {
                      const countInRow = r + 1;
                      const rowY = topY + r * spacing;
                      const rowStartX = 120 - ((countInRow - 1) * spacing) / 2;
                      for (let c = 0; c < countInRow; c++) {
                        dots.push(
                          <circle
                            key={`tr-dot-${r}-${c}`}
                            cx={rowStartX + c * spacing}
                            cy={rowY}
                            r={dotRadius}
                            fill="#6366f1"
                            stroke="#4338ca"
                            strokeWidth={dotRadius > 3 ? "1.5" : "0.8"}
                          />
                        );
                      }
                    }
                    return dots;
                  })()}
                </svg>
              </div>

              <div className="text-xs sm:text-sm font-mono font-bold text-slate-700 text-center">
                {t.totalLabel} <strong className="text-blue-700">{formatNumberLocale(patternData.count)}</strong> {patternData.unitName}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΛΑΚΟΣΤΡΩΣΗ (TESSELLATION) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>🎨 {t.lab2Badge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.lab2Title}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.lab2Desc}
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Επιλογές Στυλ & Χρωμάτων */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center">
                <span className="text-xs font-bold text-slate-600 uppercase mr-1 hidden sm:block">{t.patternFilterLabel}</span>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('honeycomb')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'honeycomb'
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.honeycombBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('herringbone')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'herringbone'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.herringboneBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('meander')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'meander'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.meanderBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('checker')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'checker'
                      ? 'bg-slate-800 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.checkerBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setTessellationStyle('triangles')}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition touch-manipulation ${
                    tessellationStyle === 'triangles'
                      ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.trianglesBtn}
                </button>
              </div>

              <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-xl border border-slate-200 w-full lg:w-auto justify-center">
                <span className="text-xs font-bold text-slate-600 uppercase">{t.paletteLabel}</span>
                <button
                  type="button"
                  onClick={() => setActivePalette('gold')}
                  className={`w-7 h-7 rounded-full bg-amber-500 border-2 transition active:scale-95 ${activePalette === 'gold' ? 'border-slate-900 ring-2 ring-amber-300' : 'border-white shadow-xs'}`}
                  title={t.goldPalette}
                />
                <button
                  type="button"
                  onClick={() => setActivePalette('blue')}
                  className={`w-7 h-7 rounded-full bg-blue-600 border-2 transition active:scale-95 ${activePalette === 'blue' ? 'border-slate-900 ring-2 ring-blue-300' : 'border-white shadow-xs'}`}
                  title={t.bluePalette}
                />
                <button
                  type="button"
                  onClick={() => setActivePalette('emerald')}
                  className={`w-7 h-7 rounded-full bg-emerald-600 border-2 transition active:scale-95 ${activePalette === 'emerald' ? 'border-slate-900 ring-2 ring-emerald-300' : 'border-white shadow-xs'}`}
                  title={t.emeraldPalette}
                />
                <button
                  type="button"
                  onClick={() => setActivePalette('rose')}
                  className={`w-7 h-7 rounded-full bg-rose-600 border-2 transition active:scale-95 ${activePalette === 'rose' ? 'border-slate-900 ring-2 ring-rose-300' : 'border-white shadow-xs'}`}
                  title={t.rosePalette}
                />
              </div>
            </div>

            {/* Πλαίσιο SVG Πλακόστρωσης */}
            <div className="w-full h-56 sm:h-80 rounded-3xl border border-slate-300 shadow-inner overflow-hidden flex items-center justify-center relative transition-colors duration-500" style={{ backgroundColor: paletteColors.bg }}>
              <svg width="100%" height="100%" className="w-full h-full">
                <defs>
                  <pattern id="pat-honeycomb" width="60" height="34.641" patternUnits="userSpaceOnUse">
                    <rect width="60" height="34.641" fill={paletteColors.c3} fillOpacity="0.85" />
                    <path
                      d="M 10 0 L 20 17.32 L 10 34.64 M 20 17.32 L 40 17.32 M 50 0 L 40 17.32 L 50 34.64"
                      fill="none"
                      stroke={paletteColors.c1}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </pattern>

                  <pattern id="pat-herringbone" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="40" height="40" fill={paletteColors.bg} />
                    <path
                      d="M 0 0 L 20 20 L 0 40 M 20 0 L 40 20 L 20 40 M 40 0 L 60 20 L 40 40"
                      fill="none"
                      stroke={paletteColors.c1}
                      strokeWidth="3"
                      strokeLinecap="square"
                    />
                    <path
                      d="M 0 20 L 20 0 M 20 40 L 40 20 M 0 40 L 20 20"
                      fill="none"
                      stroke={paletteColors.c2}
                      strokeWidth="2"
                    />
                  </pattern>

                  <pattern id="pat-meander" width="60" height="60" patternUnits="userSpaceOnUse">
                    <rect width="60" height="60" fill={paletteColors.bg} />
                    <path
                      d="M 0 30 L 15 30 L 15 15 L 45 15 L 45 45 L 30 45 L 30 30 L 0 30 M 45 15 L 60 15 M 15 45 L 30 45"
                      fill="none"
                      stroke={paletteColors.c1}
                      strokeWidth="3.5"
                      strokeLinecap="square"
                    />
                  </pattern>

                  <pattern id="pat-checker" width="40" height="40" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill={paletteColors.c1} />
                    <rect x="20" width="20" height="20" fill={paletteColors.c3} />
                    <rect y="20" width="20" height="20" fill={paletteColors.c3} />
                    <rect x="20" y="20" width="20" height="20" fill={paletteColors.c1} />
                  </pattern>

                  <pattern id="pat-triangles" width="40" height="34.641" patternUnits="userSpaceOnUse">
                    <rect width="40" height="34.641" fill={paletteColors.c3} />
                    <polygon points="0,0 40,0 20,34.641" fill={paletteColors.c2} stroke={paletteColors.c1} strokeWidth="1.5" />
                    <polygon points="20,0 0,34.641 40,34.641" fill={paletteColors.bg} stroke={paletteColors.c1} strokeWidth="1.5" opacity="0.6" />
                  </pattern>
                </defs>

                <rect
                  width="100%"
                  height="100%"
                  fill={
                    tessellationStyle === 'honeycomb'
                      ? 'url(#pat-honeycomb)'
                      : tessellationStyle === 'herringbone'
                      ? 'url(#pat-herringbone)'
                      : tessellationStyle === 'meander'
                      ? 'url(#pat-meander)'
                      : tessellationStyle === 'checker'
                      ? 'url(#pat-checker)'
                      : 'url(#pat-triangles)'
                  }
                />
              </svg>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center font-sans text-xs sm:text-sm text-slate-700">
              💡 <strong>{t.geomPrincipleTitle}</strong> {t.geomPrincipleText}
            </div>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              {t.problemsHeading}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.problemsSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  {t.prob1Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob1Tag}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.prob1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob1Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob1TableTitle}
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.sq1Label}</span> {t.sq1Val}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.sq2Label}</span> {t.sq2Val}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.sq3Label}</span> {t.sq3Val}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.prob1RuleTitle}</strong> {t.prob1RuleDesc}</div>
                  <div><strong>{t.prob1CalcTitle}</strong> 1 ＋ (3 · 20) ＝ 1 ＋ 60 ＝ <strong className="text-blue-700">{t.prob1CalcVal}</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 {t.prob1Secret}
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  {t.prob2Badge}
                </span>
                <span className="text-xs font-bold text-slate-400">{t.prob2Tag}</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {t.prob2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.prob2Desc}
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  {t.prob2TableTitle}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.pos1Label}</span> {t.pos1Val}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.pos2Label}</span> {t.pos2Val}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.pos3Label}</span> {t.pos3Val}
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.pos4Label}</span> {t.pos4Val}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.stepsTitle}</span>
                  <div><strong>{t.prob2DivTitle}</strong> {t.prob2DivText}</div>
                  <div>{t.prob2RepeatText}</div>
                  <div>{t.prob2RemainderText} <strong className="text-amber-700">{t.prob2Answer}</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ {t.prob2Secret}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaHeading}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/st-dimotikou/63-geometrika-motiba-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase(t.ctaBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
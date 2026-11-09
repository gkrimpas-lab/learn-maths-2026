// pages/st-dimotikou/67-sximata.js
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

export default function SximataTheoriaPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';

  // Συγκεντρωτικό Λεξικό Μεταφράσεων
  const translations = {
    el: {
      headTitle: "Γεωμετρικά Σχήματα & Πολύγωνα - ΣΤ' Δημοτικού | LearnMaths.gr",
      headDesc: "Μαθαίνουμε για τα γεωμετρικά σχήματα, τα κανονικά πολύγωνα, τις διαγωνίους και τους μαθηματικούς τύπους υπολογισμού τους για τη ΣΤ' Δημοτικού.",
      backText: "ΣΤ' Δημοτικού",
      actionExercises: "🎯 Ασκήσεις",
      heroBadge: "ΚΕΦΑΛΑΙΟ 67 • ΣΤ' ΔΗΜΟΤΙΚΟΥ",
      heroTitle: "Γεωμετρικά Σχήματα, Πολύγωνα & Διαγώνιοι",
      heroDesc: "Εξερευνούμε τα επίπεδα γεωμετρικά σχήματα, ανακαλύπτουμε τι κάνει ένα πολύγωνο κανονικό, τι ονομάζουμε διαγώνιο και πώς υπολογίζουμε το πλήθος των διαγωνίων με έναν απλό και κομψό μαθηματικό τύπο!",
      heroFeature: "Θεωρία, Κανονικά Πολύγωνα, Διαγώνιοι & Διαδραστικό Εργαστήριο SVG",
      heroCta: "Δοκίμασε τις Ασκήσεις",

      sec1Title: "Τα Γεωμετρικά Σχήματα σε 4 Βήματα",
      sec1Subtitle: "Από τον θεμελιώδη ορισμό του πολυγώνου έως τον υπολογισμό όλων των διαγωνίων.",

      step1Badge: "ΒΗΜΑ 1",
      step1Tag: "Ορισμός",
      step1Title: "Τι είναι Πολύγωνο;",
      step1Text: "Πολύγωνο ονομάζεται κάθε κλειστό επίπεδο γεωμετρικό σχήμα που οριοθετείται αποκλειστικά από ευθύγραμμα τμήματα (πλευρές).",
      step1SubHeading: "Στοιχεία πολυγώνου:",
      step1Item1: "Κορυφές: Τα σημεία όπου ενώνονται οι πλευρές.",
      step1Item2: "Πλευρές: Τα ευθύγραμμα τμήματα που το οριοθετούν.",
      step1Item3: "Γωνίες: Οι εσωτερικές γωνίες που σχηματίζονται.",
      step1Equiv: "Πλήθος Πλευρών ＝ Πλήθος Κορυφών ＝ Πλήθος Γωνιών (ν)",
      step1Tip: "💡 Ο κύκλος δεν είναι πολύγωνο, γιατί αποτελείται από καμπύλη γραμμή και όχι από ευθύγραμμα τμήματα!",

      step2Badge: "ΒΗΜΑ 2",
      step2Tag: "Ιδιότητες",
      step2Title: "Κανονικά Πολύγωνα",
      step2Text: "Ένα πολύγωνο ονομάζεται κανονικό όταν πληροί ταυτόχρονα δύο απαραίτητες προϋποθέσεις:",
      step2Cond1: "1. Όλες οι πλευρές του είναι ίσες (ισόπλευρο).",
      step2Cond2: "2. Όλες οι γωνίες του είναι ίσες (ισογώνιο).",
      step2Ex1: "• Ισόπλευρο τρίγωνο: Κανονικό τρίγωνο.",
      step2Ex2: "• Τετράγωνο: Κανονικό τετράπλευρο.",
      step2Tip: "⚡ Ο ρόμβος έχει ίσες πλευρές αλλά όχι απαραίτητα ίσες γωνίες. Άρα, ο ρόμβος γενικά δεν είναι κανονικό πολύγωνο!",

      step3Badge: "ΒΗΜΑ 3",
      step3Tag: "Διαγώνιοι",
      step3Title: "Τι είναι η Διαγώνιος;",
      step3Text: "Διαγώνιος ονομάζεται το ευθύγραμμο τμήμα που ενώνει δύο μη διαδοχικές κορυφές ενός πολυγώνου.",
      step3FormulaOne: "Διαγώνιοι από 1 κορυφή: ν － 3",
      step3Explain: "Από μία κορυφή δεν φέρνουμε διαγώνιο προς την ίδια ούτε προς τις 2 γειτονικές της (αυτές αποτελούν πλευρές).",
      step3Triangle: "Στο τρίγωνο (ν ＝ 3): 3 － 3 ＝ 0 διαγώνιοι!",
      step3Tip: "🎯 Το τρίγωνο είναι το μοναδικό πολύγωνο που δεν έχει καμία απολύτως διαγώνιο!",

      step4Badge: "ΒΗΜΑ 4",
      step4Tag: "Μαθηματικός Τύπος",
      step4Title: "Σύνολο Διαγωνίων",
      step4Text: "Επειδή κάθε διαγώνιος ενώνει 2 κορυφές, αν πολλαπλασιάζαμε απλώς ν · (ν － 3) θα μετρούσαμε κάθε διαγώνιο 2 φορές. Έτσι διαιρούμε με το 2:",
      step4FormulaLabel: "Συνολικές Διαγώνιοι (Δ):",
      step4FormulaText: "Δ ＝ ",
      step4ExampleTitle: "Για κανονικό εξάγωνο (ν ＝ 6):",
      step4ExampleCalc: "Διαγώνιοι ＝ [6 · (6 － 3)] : 2 ＝ (6 · 3) : 2 ＝ 18 : 2 ＝ 9 διαγώνιοι.",
      step4Tip: "🚀 Στο πεντάγωνο (ν ＝ 5) οι διαγώνιοι είναι [5 · 2] : 2 ＝ 5 (ακριβώς όσες και οι πλευρές του)!",

      lab1Badge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1",
      lab1Title: "Διαδραστικό Εργαστήριο Πολυγώνων & Διαγωνίων (SVG)",
      lab1Desc: "Επίλεξε το πλήθος πλευρών για να παρατηρήσεις το κανονικό πολύγωνο, τις κορυφές του και τις διαγωνίους σε πραγματικό χρόνο:",
      lab1SelectLabel: "ΕΠΙΛΟΓΗ ΠΛΗΘΟΥΣ ΠΛΕΥΡΩΝ (ν):",
      lab1NameLabel: "Όνομα:",
      lab1VerticesLabel: "Πλευρές & Κορυφές (ν):",
      lab1DiagsOneLabel: "Διαγώνιοι από 1 κορυφή (ν － 3):",
      lab1TotalDiagsLabel: "Σύνολο Διαγωνίων:",
      lab1BtnHide: "Απόκρυψη Διαγωνίων",
      lab1BtnShow: "Εμφάνιση Διαγωνίων",
      lab1SvgTriangleNote: "Στο τρίγωνο δεν υπάρχουν μη διαδοχικές κορυφές (0 διαγώνιοι).",
      lab1SvgDiagsNote: "Με κίτρινο διακεκομμένο χρώμα: οι",
      lab1SvgDiagsSuffix: "διαγώνιοι.",

      lab2Badge: "📏 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΕΡΙΜΕΤΡΟΣ",
      lab2Title: "Υπολογιστής Περιμέτρου Κανονικών Πολυγώνων",
      lab2Desc: "Σε κάθε κανονικό πολύγωνο όλες οι πλευρές είναι ίσες. Διάλεξε το σχήμα και το μήκος πλευράς:",
      lab2SidesLabel: "ΠΛΗΘΟΣ ΠΛΕΥΡΩΝ (ν):",
      lab2SidesWord: "πλευρές",
      lab2SideLengthLabel: "ΜΗΚΟΣ ΠΛΕΥΡΑΣ (cm):",
      lab2ResultLabel: "ΑΠΟΤΕΛΕΣΜΑ ΠΕΡΙΜΕΤΡΟΥ",
      lab2CalcLabel: "Πράξη:",
      lab2Rule: "Κανόνας: Για κάθε κανονικό πολύγωνο με ν ίσες πλευρές μήκους α, η περίμετρος δίνεται από τον τύπο: Π ＝ ν · α.",

      probSecTitle: "Λυμένα Προβλήματα με Πολύγωνα & Διαγωνίους",
      probSecSubtitle: "Εφαρμογές των γεωμετρικών κανόνων και του τύπου διαγωνίων σε πραγματικά προβλήματα.",

      prob1Badge: "ΠΡΟΒΛΗΜΑ 1: ΠΕΡΙΜΕΤΡΟΣ ΠΑΡΤΕΡΙΟΥ",
      prob1Tag: "Κανονικό Οκτάγωνο",
      prob1Title: "Υπολογισμός Περιμέτρου & Κόστους Περίφραξης",
      prob1Desc: "Ένα παρτέρι σε πάρκο έχει σχήμα κανονικού οκταγώνου με πλευρά 3,5 m. Θέλουμε να το περιφράξουμε με ξύλινο φράχτη που κοστίζει 8 € το μέτρο. Πόσο θα κοστίσει συνολικά ο φράχτης;",
      prob1TableHeading: "ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ",
      prob1ThSides: "Πλευρές (ν)",
      prob1ThSideLength: "Μήκος πλευράς",
      prob1ThCost: "Κόστος/μέτρο",
      prob1StepsHeading: "Βήματα Επίλυσης:",
      prob1Step1: "Περίμετρος οκταγώνου: 8 · 3,5 m ＝ 28 m.",
      prob1Step2: "Συνολικό κόστος: 28 · 8 € ＝ 224 €.",
      prob1Tip: "💡 Επειδή το οκτάγωνο είναι κανονικό, πολλαπλασιάζουμε το μήκος της μίας πλευράς επί 8.",

      prob2Badge: "ΠΡΟΒΛΗΜΑ 2: ΔΙΑΓΩΝΙΟΙ ΣΕ ΠΟΛΥΓΩΝΟ",
      prob2Tag: "Δεκάγωνο",
      prob2Title: "Υπολογισμός Συνολικών Διαγωνίων Δεκαγώνου",
      prob2Desc: "Σε ένα σχέδιο αρχιτεκτονικής υπάρχει ένα διακοσμητικό πλακόστρωτο σχήματος δεκαγώνου (10 κορυφές). Πόσες διαγώνιες γραμμές μπορούν να ενωθούν ανάμεσα στις μη διαδοχικές κορυφές του;",
      prob2TableHeading: "ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ",
      prob2ThVerts: "Κορυφές (ν)",
      prob2ThFromOne: "Από 1 κορυφή",
      prob2ThDiv: "Διαίρεση",
      prob2ThDivVal: "με το 2",
      prob2StepsHeading: "Βήματα Επίλυσης:",
      prob2Step1: "Διαγώνιοι από 1 κορυφή: 10 － 3 ＝ 7.",
      prob2Step2Formula: "Εφαρμογή τύπου:",
      prob2Step2Result: "＝ 70 : 2 ＝ 35 διαγώνιοι.",
      prob2Tip: "⚡ Διαιρούμε πάντα με το 2 γιατί κάθε διαγώνιος ενώνει δύο κορυφές και υπολογίζεται δύο φορές!",

      ctaTitle: "Ώρα για Εξάσκηση στα Γεωμετρικά Σχήματα!",
      ctaDesc: "Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με πολύγωνα, κανονικά σχήματα και διαγωνίους για τη ΣΤ' Δημοτικού.",
      ctaButton: "Έναρξη Ασκήσεων",

      polygons: {
        3: 'Τρίγωνο',
        4: 'Τετράπλευρο',
        5: 'Πεντάγωνο',
        6: 'Εξάγωνο',
        7: 'Επτάγωνο',
        8: 'Οκτάγωνο',
        10: 'Δεκάγωνο',
        12: 'Δωδεκάγωνο'
      }
    },
    en: {
      headTitle: "Geometric Shapes & Polygons - 6th Grade | LearnMaths.gr",
      headDesc: "Learn about geometric shapes, regular polygons, diagonals, and their calculation formulas for 6th Grade.",
      backText: "6th Grade",
      actionExercises: "🎯 Exercises",
      heroBadge: "CHAPTER 67 • 6TH GRADE",
      heroTitle: "Geometric Shapes, Polygons & Diagonals",
      heroDesc: "Explore 2D geometric shapes, discover what makes a polygon regular, learn what a diagonal is, and calculate the total number of diagonals using an elegant mathematical formula!",
      heroFeature: "Theory, Regular Polygons, Diagonals & Interactive SVG Lab",
      heroCta: "Try the Exercises",

      sec1Title: "Geometric Shapes in 4 Steps",
      sec1Subtitle: "From the fundamental definition of a polygon to calculating all its diagonals.",

      step1Badge: "STEP 1",
      step1Tag: "Definition",
      step1Title: "What is a Polygon?",
      step1Text: "A polygon is any closed 2D geometric figure bounded strictly by straight line segments (sides).",
      step1SubHeading: "Polygon components:",
      step1Item1: "Vertices: The points where the sides meet.",
      step1Item2: "Sides: The straight line segments bounding it.",
      step1Item3: "Angles: The interior angles formed at each vertex.",
      step1Equiv: "Number of Sides ＝ Number of Vertices ＝ Number of Angles (n)",
      step1Tip: "💡 A circle is not a polygon, because it is formed by a curved line, not straight line segments!",

      step2Badge: "STEP 2",
      step2Tag: "Properties",
      step2Title: "Regular Polygons",
      step2Text: "A polygon is called regular when it satisfies two essential conditions simultaneously:",
      step2Cond1: "1. All its sides are equal (equilateral).",
      step2Cond2: "2. All its angles are equal (equiangular).",
      step2Ex1: "• Equilateral triangle: Regular triangle.",
      step2Ex2: "• Square: Regular quadrilateral.",
      step2Tip: "⚡ A rhombus has equal sides but not necessarily equal angles. Thus, a rhombus is generally not a regular polygon!",

      step3Badge: "STEP 3",
      step3Tag: "Diagonals",
      step3Title: "What is a Diagonal?",
      step3Text: "A diagonal is a straight line segment joining any two non-consecutive vertices of a polygon.",
      step3FormulaOne: "Diagonals from 1 vertex: n － 3",
      step3Explain: "From any vertex, no diagonal can be drawn to itself or to its 2 adjacent vertices (those form sides).",
      step3Triangle: "In a triangle (n ＝ 3): 3 － 3 ＝ 0 diagonals!",
      step3Tip: "🎯 The triangle is the only polygon with zero diagonals!",

      step4Badge: "STEP 4",
      step4Tag: "Math Formula",
      step4Title: "Total Diagonals",
      step4Text: "Since each diagonal joins 2 vertices, multiplying simply n · (n － 3) counts each diagonal twice. We therefore divide by 2:",
      step4FormulaLabel: "Total Diagonals (D):",
      step4FormulaText: "D ＝ ",
      step4ExampleTitle: "For a regular hexagon (n ＝ 6):",
      step4ExampleCalc: "Diagonals ＝ [6 · (6 － 3)] : 2 ＝ (6 · 3) : 2 ＝ 18 : 2 ＝ 9 diagonals.",
      step4Tip: "🚀 In a pentagon (n ＝ 5) the diagonals are [5 · 2] : 2 ＝ 5 (exactly equal to its number of sides)!",

      lab1Badge: "🔬 INTERACTIVE LAB 1",
      lab1Title: "Interactive Polygons & Diagonals Lab (SVG)",
      lab1Desc: "Select the number of sides to observe the regular polygon, its vertices, and diagonals in real-time:",
      lab1SelectLabel: "SELECT NUMBER OF SIDES (n):",
      lab1NameLabel: "Name:",
      lab1VerticesLabel: "Sides & Vertices (n):",
      lab1DiagsOneLabel: "Diagonals from 1 vertex (n － 3):",
      lab1TotalDiagsLabel: "Total Diagonals:",
      lab1BtnHide: "Hide Diagonals",
      lab1BtnShow: "Show Diagonals",
      lab1SvgTriangleNote: "A triangle has no non-consecutive vertices (0 diagonals).",
      lab1SvgDiagsNote: "In dashed yellow: all",
      lab1SvgDiagsSuffix: "diagonals.",

      lab2Badge: "📏 INTERACTIVE LAB 2: PERIMETER",
      lab2Title: "Regular Polygon Perimeter Calculator",
      lab2Desc: "In every regular polygon, all sides are equal. Select the shape and side length:",
      lab2SidesLabel: "NUMBER OF SIDES (n):",
      lab2SidesWord: "sides",
      lab2SideLengthLabel: "SIDE LENGTH (cm):",
      lab2ResultLabel: "PERIMETER RESULT",
      lab2CalcLabel: "Calculation:",
      lab2Rule: "Rule: For any regular polygon with n equal sides of length a, perimeter is given by: P ＝ n · a.",

      probSecTitle: "Solved Problems with Polygons & Diagonals",
      probSecSubtitle: "Practical applications of polygon rules and diagonal formulas in real-world problems.",

      prob1Badge: "PROBLEM 1: FLOWERBED PERIMETER",
      prob1Tag: "Regular Octagon",
      prob1Title: "Calculating Perimeter & Fencing Cost",
      prob1Desc: "A park flowerbed has the shape of a regular octagon with a side of 3.5 m. We want to enclose it with a wooden fence costing 8 € per meter. How much will the fence cost in total?",
      prob1TableHeading: "PROBLEM DATA",
      prob1ThSides: "Sides (n)",
      prob1ThSideLength: "Side length",
      prob1ThCost: "Cost/meter",
      prob1StepsHeading: "Solution Steps:",
      prob1Step1: "Octagon perimeter: 8 · 3.5 m ＝ 28 m.",
      prob1Step2: "Total cost: 28 · 8 € ＝ 224 €.",
      prob1Tip: "💡 Because the octagon is regular, we multiply the single side length by 8.",

      prob2Badge: "PROBLEM 2: DIAGONALS IN A POLYGON",
      prob2Tag: "Decagon",
      prob2Title: "Calculating Total Diagonals of a Decagon",
      prob2Desc: "An architectural blueprint features a decorative paving shaped as a decagon (10 vertices). How many diagonal lines can be drawn between its non-consecutive vertices?",
      prob2TableHeading: "CALCULATION DATA",
      prob2ThVerts: "Vertices (n)",
      prob2ThFromOne: "From 1 vertex",
      prob2ThDiv: "Division",
      prob2ThDivVal: "by 2",
      prob2StepsHeading: "Solution Steps:",
      prob2Step1: "Diagonals from 1 vertex: 10 － 3 ＝ 7.",
      prob2Step2Formula: "Formula calculation:",
      prob2Step2Result: "＝ 70 : 2 ＝ 35 diagonals.",
      prob2Tip: "⚡ We always divide by 2 because each diagonal connects two vertices and is counted twice!",

      ctaTitle: "Time to Practice Geometric Shapes!",
      ctaDesc: "Test your skills with 10 interactive questions on polygons, regular shapes, and diagonals for 6th Grade.",
      ctaButton: "Start Exercises",

      polygons: {
        3: 'Triangle',
        4: 'Quadrilateral',
        5: 'Pentagon',
        6: 'Hexagon',
        7: 'Heptagon',
        8: 'Octagon',
        10: 'Decagon',
        12: 'Dodecagon'
      }
    }
  };

  const t = translations[locale];

  // Εργαστήριο 1: Διαδραστική Εξερεύνηση Πολυγώνων & Διαγωνίων
  const [selectedSides, setSelectedSides] = useState(5);
  const [showDiagonals, setShowDiagonals] = useState(true);

  // Υπολογισμός κορυφών και διαγωνίων για το SVG
  const { pointsStr, vertices, diagonals, totalDiagonals } = useMemo(() => {
    const n = selectedSides;
    const r = 125;
    const cx = 180;
    const cy = 160;
    const verts = [];

    for (let i = 0; i < n; i++) {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      verts.push({ x, y, label: String.fromCharCode(65 + i) });
    }

    const pStr = verts.map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');

    const diags = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = Math.abs(i - j);
        if (diff > 1 && diff < n - 1) {
          diags.push({
            x1: verts[i].x,
            y1: verts[i].y,
            x2: verts[j].x,
            y2: verts[j].y,
            key: `${i}-${j}`
          });
        }
      }
    }

    const count = Math.floor((n * (n - 3)) / 2);
    return { pointsStr: pStr, vertices: verts, diagonals: diags, totalDiagonals: count };
  }, [selectedSides]);

  // Εργαστήριο 2: Υπολογιστής Περιμέτρου Κανονικού Πολυγώνου
  const [regularSides, setRegularSides] = useState(6);
  const [sideLength, setSideLength] = useState(4.5);

  const regularPerimeter = useMemo(() => {
    return regularSides * sideLength;
  }, [regularSides, sideLength]);

  return (
    <Layout
      title={t.headTitle}
      description={t.headDesc}
      backUrl="/st-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/67-sximata-ask"
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
              href="/st-dimotikou/67-sximata-ask"
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
                    {t.step1Equiv}
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
                    {t.step2Cond1}
                  </div>
                  <div className="text-amber-950 font-bold">
                    {t.step2Cond2}
                  </div>
                  <div className="text-slate-600 text-[11px] pt-1 border-t border-slate-200">
                    {t.step2Ex1}<br />
                    {t.step2Ex2}
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="font-bold text-indigo-900">
                    {t.step3FormulaOne}
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {t.step3Explain}
                  </p>
                  <div className="text-slate-800 font-semibold text-[11px] pt-1 border-t border-slate-200">
                    {t.step3Triangle}
                  </div>
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

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center">
                  <div className="text-emerald-900 font-black text-sm flex items-center justify-center flex-wrap gap-1">
                    <span>{t.step4FormulaText}</span>
                    <Fraction n={locale === 'el' ? "ν · (ν － 3)" : "n · (n － 3)"} d="2" className="text-base" />
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans text-left pt-2 border-t border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">{t.step4ExampleTitle}</span>
                    <div className="flex items-center flex-wrap gap-1">
                      <span>{locale === 'el' ? 'Διαγώνιοι ＝' : 'Diagonals ＝'}</span>
                      <Fraction n="6 · (6 － 3)" d="2" />
                      <span>＝</span>
                      <Fraction n="6 · 3" d="2" />
                      <span>＝</span>
                      <Fraction n="18" d="2" />
                      <span>＝ <strong>9</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step4Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΕΞΕΡΕΥΝΗΣΗ ΠΟΛΥΓΩΝΩΝ & ΔΙΑΓΩΝΙΩΝ */}
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

            {/* Χειριστήρια & Πληροφορίες (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-2">
                  {toCleanUppercase(t.lab1SelectLabel)}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 4, 5, 6, 7, 8, 10, 12].map((sides) => (
                    <button
                      key={sides}
                      onClick={() => setSelectedSides(sides)}
                      className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
                        selectedSides === sides
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {sides}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">{t.lab1NameLabel}</span>
                  <span className="font-black text-indigo-700">{t.polygons[selectedSides]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">{t.lab1VerticesLabel}</span>
                  <span className="font-bold text-slate-800">{selectedSides}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">{t.lab1DiagsOneLabel}</span>
                  <span className="font-bold text-sky-700">{Math.max(0, selectedSides - 3)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">{t.lab1TotalDiagsLabel}</span>
                  <span className="text-base sm:text-lg font-black text-emerald-600 font-mono">
                    {totalDiagonals}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDiagonals(!showDiagonals)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                  showDiagonals
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                {showDiagonals ? t.lab1BtnHide : t.lab1BtnShow}
              </button>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 320"
                className="w-full max-w-[340px] sm:max-w-[380px] h-auto select-none"
              >
                {/* Διαγώνιοι */}
                {showDiagonals &&
                  diagonals.map((d) => (
                    <line
                      key={d.key}
                      x1={d.x1}
                      y1={d.y1}
                      x2={d.x2}
                      y2={d.y2}
                      stroke="#f59e0b"
                      strokeWidth="1.8"
                      strokeDasharray="4 3"
                      className="opacity-80"
                    />
                  ))}

                {/* Περίμετρος πολυγώνου */}
                <polygon
                  points={pointsStr}
                  fill="rgba(99, 102, 241, 0.2)"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                />

                {/* Κορυφές */}
                {vertices.map((v, idx) => (
                  <g key={idx}>
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="6"
                      fill="#ffffff"
                      stroke="#4f46e5"
                      strokeWidth="2.5"
                    />
                    <text
                      x={v.x + (v.x - 180) * 0.16}
                      y={v.y + (v.y - 160) * 0.16 + 4}
                      fill="#e2e8f0"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {v.label}
                    </text>
                  </g>
                ))}
              </svg>
              <div className="mt-2 text-center text-xs text-slate-400">
                {selectedSides === 3 ? (
                  <span>{t.lab1SvgTriangleNote}</span>
                ) : (
                  <span>
                    {t.lab1SvgDiagsNote} <strong>{totalDiagonals}</strong> {t.lab1SvgDiagsSuffix}
                  </span>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΠΕΡΙΜΕΤΡΟΥ ΚΑΝΟΝΙΚΟΥ ΠΟΛΥΓΩΝΟΥ */}
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
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2SidesLabel)}</span>
                  <span className="font-mono text-xs sm:text-sm font-black text-indigo-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    {regularSides} {t.lab2SidesWord} ({t.polygons[regularSides] || ''})
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={1}
                  value={regularSides}
                  onChange={(e) => setRegularSides(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>{toCleanUppercase(t.lab2SideLengthLabel)}</span>
                  <span className="font-mono text-xs sm:text-sm font-black text-emerald-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    {formatNum(sideLength, locale)} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={0.5}
                  value={sideLength}
                  onChange={(e) => setSideLength(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer touch-manipulation"
                />
              </div>
            </div>

            {/* Αποτέλεσμα & Ανάλυση (7 στήλες) */}
            <div className="lg:col-span-7 bg-emerald-50/60 p-5 sm:p-7 rounded-3xl border border-emerald-200 space-y-3 text-center">
              <span className="text-xs text-emerald-900 block font-bold tracking-wider">
                {toCleanUppercase(t.lab2ResultLabel)}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono">
                {formatNum(regularPerimeter, locale)} cm
              </div>
              <p className="text-xs sm:text-sm text-slate-700 font-mono pt-1">
                {t.lab2CalcLabel} {regularSides} · {formatNum(sideLength, locale)} cm ＝ <strong>{formatNum(regularPerimeter, locale)} cm</strong>
              </p>
              <div className="p-3 bg-white rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-sans text-left">
                💡 <strong>{t.lab2Rule.split(':')[0]}:</strong>{t.lab2Rule.split(':')[1]}
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThSides}</span> 8
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThSideLength}</span> 3,5 m
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob1ThCost}</span> 8 €
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob1StepsHeading}</span>
                  <div>
                    <strong>{t.prob1Step1.split(':')[0]}:</strong>{t.prob1Step1.split(':')[1]}
                  </div>
                  <div>
                    <strong>{t.prob1Step2.split(':')[0]}:</strong>{t.prob1Step2.split(':')[1]}
                  </div>
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
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThVerts}</span> 10
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThFromOne}</span> 10 － 3 ＝ 7
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">{t.prob2ThDiv}</span> {t.prob2ThDivVal}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-slate-500 font-sans block text-xs font-bold">{t.prob2StepsHeading}</span>
                  <div>
                    <strong>{t.prob2Step1.split(':')[0]}:</strong>{t.prob2Step1.split(':')[1]}
                  </div>
                  <div className="flex items-center flex-wrap gap-1">
                    <strong>{t.prob2Step2Formula}</strong>
                    <Fraction n="10 · 7" d="2" />
                    <span>{t.prob2Step2Result}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                {t.prob2Tip}
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
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
            href="/st-dimotikou/67-sximata-ask"
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
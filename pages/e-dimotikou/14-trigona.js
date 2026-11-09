// pages/e-dimotikou/14-trigona.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

// Συνάρτηση για άτονα κεφαλαία με εξαίρεση το Ε'
function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Ε')/g);
  return parts
    .map((part) => {
      if (part === "Ε'") return "Ε'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

// Οπτική απόδοση κλάσματος (αριθμητής πάνω, κλασματική γραμμή, παρονομαστής κάτω)
function MathFraction({ numerator, denominator, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none ${className}`}>
      <span className="px-1 text-center border-b-[1.5px] border-current w-full pb-0.5">
        {numerator}
      </span>
      <span className="px-1 text-center pt-0.5 w-full">
        {denominator}
      </span>
    </span>
  );
}

// Ρυθμίσεις ορίων γωνίας
const ANGLE_MIN = 15;
const ANGLE_MAX = 150;

const I18N = {
  el: {
    pageTitle: "Τρίγωνα ως προς τις Γωνίες - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Πλήρης θεωρία με παραδείγματα για τα είδη τριγώνων (οξυγώνιο, ορθογώνιο, αμβλυγώνιο), το άθροισμα των 180° και διαδραστικό γεωμετρικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    actionButton: "Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 14 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Τρίγωνα ως προς τις Γωνίες",
    heroSubtitle: "Εξερευνούμε πώς κατατάσσονται τα τρίγωνα με κριτήριο τα είδη των γωνιών τους, γιατί το άθροισμα των γωνιών οποιουδήποτε τριγώνου ισούται πάντα με 180° και πώς αλλάζει το σχήμα όταν μεταβάλλεται μία γωνία.",
    heroStatus: "Θεωρία & Δυναμικό Γεωμετρικό Τρίγωνο",
    heroAction: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η γεωμετρική ταυτότητα και τα είδη των τριγώνων ανάλογα με τις μοίρες των γωνιών τους.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Ορισμός",
    step1Title: "Ανατομία του Τριγώνου",
    step1P1: "Τρίγωνο είναι το επίπεδο γεωμετρικό σχήμα που περικλείεται από 3 ευθύγραμμα τμήματα (πλευρές) και σχηματίζει 3 κορυφές και 3 εσωτερικές γωνίες.",
    step1VerticesTitle: "3 Κορυφές:",
    step1VerticesDesc: "Σημεία Α, Β, Γ.",
    step1SidesTitle: "3 Πλευρές:",
    step1SidesDesc: "Τμήματα ΑΒ, ΒΓ, ΑΓ.",
    step1AnglesTitle: "3 Εσωτερικές Γωνίες:",
    step1AnglesDesc: "Γωνίες Α, Β, Γ.",
    step1Tip: "Το τρίγωνο είναι το απλούστερο δυνατό πολύγωνο της γεωμετρίας!",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Κατάταξη",
    step2Title: "Τα 3 Είδη ως προς τις Γωνίες",
    step2Intro: "Ανάλογα με το μέτρο των γωνιών τους, όλα τα τρίγωνα του κόσμου ανήκουν σε μία από τις εξής 3 κατηγορίες:",
    step2AcuteTitle: "1. Οξυγώνιο:",
    step2AcuteDesc: "Έχει και τις 3 γωνίες του οξείες (όλες ＜ 90°).",
    step2RightTitle: "2. Ορθογώνιο:",
    step2RightDesc: "Έχει μία ορθή γωνία (ακριβώς 90°).",
    step2ObtuseTitle: "3. Αμβλυγώνιο:",
    step2ObtuseDesc: "Έχει μία αμβλεία γωνία ( ＞ 90° ).",
    step2Tip: "Ένα τρίγωνο είναι αδύνατον να έχει δύο ορθές ή δύο αμβλείες γωνίες!",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Θεώρημα",
    step3Title: "Το Άθροισμα των 180°",
    step3Intro: "Σε οποιοδήποτε τρίγωνο, ανεξαρτήτως σχήματος ή μεγέθους, το άθροισμα των τριών εσωτερικών γωνιών ισούται πάντα με 180°:",
    step3Formula: "Γωνία Α ＋ Γωνία Β ＋ Γωνία Γ ＝ 180°",
    step3Example: "Αν γνωρίζουμε δύο γωνίες (π.χ. 50° και 70°), η τρίτη υπολογίζεται αμέσως: 180° － (50° ＋ 70°) ＝ 60°.",
    step3Tip: "Στο ορθογώνιο τρίγωνο, οι δύο οξείες γωνίες είναι συμπληρωματικές (άθροισμα ＝ 90°).",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Συσχέτιση",
    step4Title: "Γωνίες & Απέναντι Πλευρές",
    step4Intro: "Υπάρχει μία απόλυτη αντιστοιχία ανάμεσα στο άνοιγμα μιας γωνίας και το μήκος της απέναντι πλευράς:",
    step4Rule1Title: "Απέναντι από τη μεγαλύτερη γωνία",
    step4Rule1Desc: "βρίσκεται πάντα η μεγαλύτερη πλευρά του τριγώνου.",
    step4Rule2Title: "Στο ορθογώνιο τρίγωνο:",
    step4Rule2Desc: "Η μεγαλύτερη πλευρά είναι η υποτείνουσα (απέναντι από την ορθή γωνία των 90°).",
    step4Tip: "Αν δύο γωνίες είναι ίσες (ισοσκελές), και οι απέναντι πλευρές τους είναι απολύτως ίσες.",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικό Γεωμετρικό Τρίγωνο",
    labSubtitle: "Άλλαξε το άνοιγμα της γωνίας Β. Παρατήρησε πώς κινείται η κορυφή Α, πώς αλλάζουν αυτόματα όλες οι γωνίες και πότε το τρίγωνο γίνεται ορθογώνιο ή αμβλυγώνιο.",
    ctrlTitle: "ΜΕΤΑΒΟΛΗ ΓΩΝΙΑΣ Β",
    angleBLabel: "Γωνία Β:",
    btnDecr1: "Μείωση γωνίας Β κατά 1",
    btnIncr1: "Αύξηση γωνίας Β κατά 1",
    charTitle: "ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΤΡΙΓΩΝΟΥ",
    chartTitle: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΒΑΣΗ ΒΓ)",
    triangleLabel: "Τρίγωνο ΑΒΓ",
    kindLabel: "Είδος:",
    sumLabel: "Άθροισμα:",

    triRightTitle: "Ορθογώνιο Τρίγωνο",
    triRightDesc: "Έχει ακριβώς μία ορθή γωνία (90°). Οι άλλες δύο γωνίες είναι οξείες.",
    triObtuseTitle: "Αμβλυγώνιο Τρίγωνο",
    triObtuseDesc: "Έχει μία αμβλεία γωνία ( ＞ 90° ). Οι άλλες δύο γωνίες είναι αναγκαστικά οξείες.",
    triAcuteTitle: "Οξυγώνιο Τρίγωνο",
    triAcuteDesc: "Όλες οι γωνίες του είναι οξείες (μικρότερες από 90°).",

    vertexALabel: "Α",
    vertexBLabel: "Β",
    vertexΓLabel: "Γ",

    ctaTitle: "Ώρα για Εξάσκηση στα Τρίγωνα!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις εύρεσης άγνωστης γωνίας, κατάταξης τριγώνων και γεωμετρικών υπολογισμών.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Triangles by Angles - 5th Grade | LearnMaths.gr",
    pageDescription: "Complete theory with examples on types of triangles (acute, right, obtuse), the 180° interior angle sum, and an interactive geometry lab.",
    backText: "5th Grade",
    actionButton: "Practice",
    badgeChapter: "CHAPTER 14 • 5TH GRADE",
    heroTitle: "Triangles by Angles",
    heroSubtitle: "Discover how triangles are classified based on their angles, why the sum of interior angles in any triangle always equals 180°, and how the triangle changes dynamically as an angle shifts.",
    heroStatus: "Theory & Dynamic Geometric Triangle",
    heroAction: "Try the Practice Problems",

    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The geometric identity and classification of triangles based on their angle measures.",

    step1Badge: "STEP 1",
    step1Type: "Definition",
    step1Title: "Anatomy of a Triangle",
    step1P1: "A triangle is a closed 2D geometric shape bounded by 3 line segments (sides), forming 3 vertices and 3 interior angles.",
    step1VerticesTitle: "3 Vertices:",
    step1VerticesDesc: "Points A, B, C.",
    step1SidesTitle: "3 Sides:",
    step1SidesDesc: "Segments AB, BC, AC.",
    step1AnglesTitle: "3 Interior Angles:",
    step1AnglesDesc: "Angles A, B, C.",
    step1Tip: "The triangle is the simplest possible polygon in geometry!",

    step2Badge: "STEP 2",
    step2Type: "Classification",
    step2Title: "The 3 Types by Angles",
    step2Intro: "Based on their angle measures, all triangles fall into one of the following 3 categories:",
    step2AcuteTitle: "1. Acute Triangle:",
    step2AcuteDesc: "Has all 3 angles acute (each ＜ 90°).",
    step2RightTitle: "2. Right Triangle:",
    step2RightDesc: "Has exactly one right angle (90°).",
    step2ObtuseTitle: "3. Obtuse Triangle:",
    step2ObtuseDesc: "Has exactly one obtuse angle ( ＞ 90° ).",
    step2Tip: "A triangle can never have two right angles or two obtuse angles!",

    step3Badge: "STEP 3",
    step3Type: "Theorem",
    step3Title: "The 180° Sum Theorem",
    step3Intro: "In any triangle, regardless of size or shape, the sum of the three interior angles is always exactly 180°:",
    step3Formula: "Angle A ＋ Angle B ＋ Angle C ＝ 180°",
    step3Example: "If two angles are known (e.g., 50° and 70°), the third is found immediately: 180° － (50° ＋ 70°) ＝ 60°.",
    step3Tip: "In a right triangle, the two acute angles are complementary (sum ＝ 90°).",

    step4Badge: "STEP 4",
    step4Type: "Relationship",
    step4Title: "Angles & Opposite Sides",
    step4Intro: "There is an exact correspondence between the size of an angle and the length of the opposite side:",
    step4Rule1Title: "Opposite the largest angle",
    step4Rule1Desc: "lies the longest side of the triangle.",
    step4Rule2Title: "In a right triangle:",
    step4Rule2Desc: "The longest side is the hypotenuse (opposite the 90° right angle).",
    step4Tip: "If two angles are equal (isosceles), their opposite sides are also strictly equal.",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Dynamic Geometric Triangle",
    labSubtitle: "Adjust angle B. Notice how vertex A moves, how all angles update in real time, and when the triangle turns right or obtuse.",
    ctrlTitle: "ADJUST ANGLE B",
    angleBLabel: "Angle B:",
    btnDecr1: "Decrease angle B by 1",
    btnIncr1: "Increase angle B by 1",
    charTitle: "TRIANGLE CLASSIFICATION",
    chartTitle: "GEOMETRIC DIAGRAM (BASE BC)",
    triangleLabel: "Triangle ABC",
    kindLabel: "Type:",
    sumLabel: "Sum:",

    triRightTitle: "Right Triangle",
    triRightDesc: "Has exactly one right angle (90°). The other two angles are acute.",
    triObtuseTitle: "Obtuse Triangle",
    triObtuseDesc: "Has one obtuse angle ( ＞ 90° ). The other two angles are strictly acute.",
    triAcuteTitle: "Acute Triangle",
    triAcuteDesc: "All three angles are acute (each less than 90°).",

    vertexALabel: "A",
    vertexBLabel: "B",
    vertexΓLabel: "C",

    ctaTitle: "Time to Practice Triangles!",
    ctaDesc: "Test your skills with unknown angle exercises, classifying triangles, and geometric calculations.",
    ctaButton: "Start Exercises"
  }
};

export default function TrigonaTheoryPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  // Αρχική τιμή γωνίας Β
  const [angleB, setAngleB] = useState(60);

  // Διασφάλιση ορίων
  const currentB = Math.max(ANGLE_MIN, Math.min(ANGLE_MAX, angleB));

  // Γεωμετρικός υπολογισμός θέσης κορυφών
  const baseSide = 220; // Μήκος βάσης ΒΓ
  const radius = 170;   // Μήκος πλευράς ΑΒ

  const bx = 260; // Συντεταγμένες κορυφής Β
  const by = 260;
  const gx = bx + baseSide; // Κορυφή Γ
  const gy = 260;

  // Μετατροπή γωνίας Β σε ακτίνια
  const radB = (currentB * Math.PI) / 180;

  // Υπολογισμός κορυφής Α
  const ax = Math.round(bx + radius * Math.cos(radB));
  const ay = Math.round(by - radius * Math.sin(radB));

  // Υπολογισμός μήκους πλευράς ΑΓ
  const sideb = Math.sqrt(
    radius * radius + baseSide * baseSide - 2 * radius * baseSide * Math.cos(radB)
  );

  // Υπολογισμός γωνιών Γ και Α
  const dy = by - ay;
  const angleΓ = Math.max(1, Math.round((Math.asin(Math.min(1, dy / sideb)) * 180) / Math.PI));
  const angleA = Math.max(1, 180 - currentB - angleΓ);

  // Κατηγοριοποίηση τριγώνου
  const getTriangleType = () => {
    if (angleA === 90 || currentB === 90 || angleΓ === 90) {
      return {
        title: t.triRightTitle,
        desc: t.triRightDesc,
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    if (angleA > 90 || currentB > 90 || angleΓ > 90) {
      return {
        title: t.triObtuseTitle,
        desc: t.triObtuseDesc,
        color: 'text-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
      };
    }
    return {
      title: t.triAcuteTitle,
      desc: t.triAcuteDesc,
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
    };
  };

  const triType = getTriangleType();

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/14-trigona-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.actionButton}</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους σύμφωνα με τις προδιαγραφές */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-10 2xl:space-y-14">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.badgeChapter)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.heroSubtitle}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.heroStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/14-trigona-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.heroAction}</span>
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
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step1Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1P1}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    <strong>{t.step1VerticesTitle}</strong> {t.step1VerticesDesc}
                  </div>
                  <div>
                    <strong>{t.step1SidesTitle}</strong> {t.step1SidesDesc}
                  </div>
                  <div>
                    <strong>{t.step1AnglesTitle}</strong> {t.step1AnglesDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step2Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Intro}
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-blue-700">{t.step2AcuteTitle}</strong> {t.step2AcuteDesc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700">{t.step2RightTitle}</strong> {t.step2RightDesc}
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-purple-700">{t.step2ObtuseTitle}</strong> {t.step2ObtuseDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step3Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Intro}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-indigo-950 shadow-inner">
                    {t.step3Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step3Example}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Badge)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">
                    {t.step4Type}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Intro}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>{t.step4Rule1Title}</strong> {t.step4Rule1Desc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{t.step4Rule2Title}</strong> {t.step4Rule2Desc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΤΡΙΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Ταυτότητα Τριγώνου */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.ctrlTitle)}
              </h4>

              {/* Stepper Γωνίας Β */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.angleBLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {currentB.toLocaleString(numberLocale)}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.btnDecr1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngleB((prev) => Math.max(ANGLE_MIN, prev - 1));
                    }}
                    disabled={currentB <= ANGLE_MIN}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min={ANGLE_MIN}
                    max={ANGLE_MAX}
                    step="1"
                    value={currentB}
                    onChange={(e) => setAngleB(Number(e.target.value))}
                    aria-label={t.angleBLabel}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.btnIncr1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngleB((prev) => Math.min(ANGLE_MAX, prev + 1));
                    }}
                    disabled={currentB >= ANGLE_MAX}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων γωνιών */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[30, 45, 60, 90, 110, 120].map((val) => (
                    <button
                      key={`btn-ang-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setAngleB(val);
                      }}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg font-semibold transition ${
                        currentB === val
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val.toLocaleString(numberLocale)}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Τριγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.charTitle)}
                </span>
                <div className={`text-2xl sm:text-3xl font-black ${triType.color}`}>
                  {triType.title}
                </div>
                <div className={`p-2.5 rounded-xl border text-xs font-medium ${triType.badgeBg}`}>
                  {triType.desc}
                </div>

                {/* Μέτρα και των 3 γωνιών */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    {t.vertexALabel} ＝ {angleA.toLocaleString(numberLocale)}°
                  </div>
                  <div className="p-1.5 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 font-black">
                    {t.vertexBLabel} ＝ {currentB.toLocaleString(numberLocale)}°
                  </div>
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    {t.vertexΓLabel} ＝ {angleΓ.toLocaleString(numberLocale)}°
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.chartTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {angleA.toLocaleString(numberLocale)}° ＋ {currentB.toLocaleString(numberLocale)}° ＋ {angleΓ.toLocaleString(numberLocale)}° ＝ 180°
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 320" className="w-full h-full drop-shadow-sm">
                  {/* Νοητό ημικύκλιο τροχιάς κορυφής Α */}
                  <path
                    d={`M ${bx + radius} ${by} A ${radius} ${radius} 0 0 0 ${bx - radius} ${by}`}
                    fill="none"
                    className="stroke-slate-200 stroke-1"
                    strokeDasharray="4 4"
                  />

                  {/* Τρίγωνο ΑΒΓ */}
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${gx},${gy}`}
                    className="fill-sky-500/10 stroke-sky-600 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Κορυφή Α */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 12} textAnchor="middle" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexALabel} ({angleA.toLocaleString(numberLocale)}°)
                  </text>

                  {/* Κορυφή Β */}
                  <circle cx={bx} cy={by} r="6" className="fill-blue-600" />
                  <text x={bx - 16} y={by + 6} textAnchor="end" className="font-sans text-sm font-black fill-blue-700">
                    {t.vertexBLabel} ({currentB.toLocaleString(numberLocale)}°)
                  </text>

                  {/* Κορυφή Γ */}
                  <circle cx={gx} cy={gy} r="6" className="fill-slate-900" />
                  <text x={gx + 16} y={gy + 6} textAnchor="start" className="font-sans text-sm font-black fill-slate-900">
                    {t.vertexΓLabel} ({angleΓ.toLocaleString(numberLocale)}°)
                  </text>

                  {/* Βάση ΒΓ */}
                  <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[3]" />
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-lg p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-center gap-2">
                <span>{t.triangleLabel}</span>
                <span>•</span>
                <span>
                  {t.kindLabel} <strong className={triType.color}>{triType.title}</strong>
                </span>
                <span>•</span>
                <span>
                  {t.sumLabel} <strong className="text-slate-900">180°</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.ctaTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.ctaDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/14-trigona-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.ctaButton}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
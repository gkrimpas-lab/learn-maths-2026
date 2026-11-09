// pages/e-dimotikou/13-gonies.js
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

const I18N = {
  el: {
    pageTitle: "Τα Είδη των Γωνιών - Ε' Δημοτικού | LearnMaths.gr",
    pageDescription: "Μάθετε τα είδη των γωνιών (οξεία, ορθή, αμβλεία, ευθεία, μηδενική), πώς μετράμε με το μοιρογνωμόνιο και πειραματιστείτε με το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    actionButton: "Ασκήσεις",
    badgeChapter: "ΚΕΦΑΛΑΙΟ 13 • Ε' ΔΗΜΟΤΙΚΟΥ",
    heroTitle: "Τα Είδη των Γωνιών",
    heroSubtitle: "Εξερευνούμε τη γεωμετρική έννοια της γωνίας, τα 5 βασικά είδη ανάλογα με το άνοιγμα των πλευρών τους, πώς χρησιμοποιούμε το μοιρογνωμόνιο και πώς συνδέονται οι συμπληρωματικές και παραπληρωματικές γωνίες.",
    heroStatus: "Θεωρία & Δυναμικός Γεωμετρικός Καμβάς",
    heroAction: "Δοκίμασε τις Ασκήσεις",

    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η ανατομία και η κατάταξη των γωνιών με βάση το μέτρο τους σε μοίρες.",

    step1Badge: "ΒΗΜΑ 1",
    step1Type: "Ορισμός",
    step1Title: "Ανατομία της Γωνίας",
    step1P1: "Γωνία είναι το γεωμετρικό σχήμα που σχηματίζεται από δύο ημιευθείες που έχουν την ίδια αρχή.",
    step1VertexTitle: "Κορυφή:",
    step1VertexDesc: "Το κοινό σημείο αφετηρίας των δύο ημιευθειών.",
    step1SidesTitle: "Πλευρές (Ακτίνες):",
    step1SidesDesc: "Οι δύο ημιευθείες που ορίζουν το άνοιγμα.",
    step1UnitTitle: "Μονάδα μέτρησης:",
    step1UnitDesc: "Η μοίρα ( ° ), που μετριέται με το μοιρογνωμόνιο.",
    step1Tip: "Το μέγεθος μιας γωνίας εξαρτάται μόνο από το άνοιγμα των πλευρών της και καθόλου από το μήκος με το οποίο τις σχεδιάζουμε!",

    step2Badge: "ΒΗΜΑ 2",
    step2Type: "Κατηγοριοποίηση",
    step2Title: "Τα 5 Είδη Γωνιών",
    step2Intro: "Ανάλογα με το μέγεθός τους σε μοίρες, οι γωνίες χωρίζονται σε 5 κατηγορίες:",
    angleZeroName: "Μηδενική:",
    angleAcuteName: "Οξεία:",
    angleRightName: "Ορθή:",
    angleObtuseName: "Αμβλεία:",
    angleStraightName: "Ευθεία:",
    angleTerm: "Γωνία",
    step2Tip: "Η ορθή γωνία (90°) είναι το σημείο αναφοράς: κάθε γωνία συγκρίνεται με το αν είναι μικρότερη ή μεγαλύτερη από αυτήν.",

    step3Badge: "ΒΗΜΑ 3",
    step3Type: "Μέτρηση",
    step3Title: "Χρήση Μοιρογνωμονίου",
    step3Intro: "Για να μετρήσουμε μια γωνία με ακρίβεια:",
    step3Rule1: "Τοποθετούμε το κέντρο του μοιρογνωμονίου ακριβώς πάνω στην κορυφή της γωνίας.",
    step3Rule2: "Ευθυγραμμίζουμε τη γραμμή του 0° με τη μία πλευρά βάσης.",
    step3Rule3: "Διαβάζουμε τον αριθμό των μοιρών από το σημείο που τέμνει η άλλη πλευρά.",
    step3TipTitle: "Προσοχή στην κλίμακα:",
    step3TipDesc: "Ξεκινάμε πάντα να μετράμε από το 0° της πλευράς βάσης και όχι από το 180°!",

    step4Badge: "ΒΗΜΑ 4",
    step4Type: "Συσχετίσεις",
    step4Title: "Συμπληρωματικές & Παραπληρωματικές",
    step4Intro: "Δύο γωνίες συνδέονται συχνά με ειδικές μαθηματικές σχέσεις αθροίσματος:",
    step4CompTitle: "Συμπληρωματικές:",
    step4CompDesc: "Έχουν άθροισμα ακριβώς 90° (σχηματίζουν μία ορθή γωνία, π.χ. 35° ＋ 55° ＝ 90°).",
    step4SuppTitle: "Παραπληρωματικές:",
    step4SuppDesc: "Έχουν άθροισμα ακριβώς 180° (σχηματίζουν μία ευθεία γωνία, π.χ. 110° ＋ 70° ＝ 180°).",
    step4Tip: "Αν μια γωνία είναι 40°, η συμπληρωματική της είναι 90° － 40° ＝ 50° και η παραπληρωματική της 180° － 40° ＝ 140°.",

    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Γεωμετρικός Καμβάς Γωνιών",
    labSubtitle: "Άλλαξε το άνοιγμα των ημιευθειών με τα κουμπιά, το range ή τα γρήγορα άλματα και δες το σχήμα, το είδος και το τόξο μοιρών σε πραγματικό χρόνο.",
    ctrlTitle: "ΡΥΘΜΙΣΗ ΑΝΟΙΓΜΑΤΟΣ",
    degreesLabel: "Μοίρες ( ° ):",
    btnDecr1: "Μείωση μοιρών κατά 1",
    btnIncr1: "Αύξηση μοιρών κατά 1",
    charTitle: "ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΓΩΝΙΑΣ",
    chartTitle: "ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΓΩΝΙΑΣ",
    measureText: "Μέτρο:",
    vertexLabel: "Κορυφή O",
    kindLabel: "Είδος:",

    angleZeroTitle: "Μηδενική Γωνία",
    angleZeroDesc: "Οι δύο ημιευθείες συμπίπτουν απόλυτα (0°).",
    angleAcuteTitle: "Οξεία Γωνία",
    angleAcuteDesc: "Μικρότερη από την ορθή γωνία (0° ＜ Γωνία ＜ 90°).",
    angleRightTitle: "Ορθή Γωνία",
    angleRightDesc: "Οι δύο πλευρές είναι ακριβώς κάθετες μεταξύ τους (90°).",
    angleObtuseTitle: "Αμβλεία Γωνία",
    angleObtuseDesc: "Μεγαλύτερη από την ορθή και μικρότερη από την ευθεία (90° ＜ Γωνία ＜ 180°).",
    angleStraightTitle: "Ευθεία Γωνία",
    angleStraightDesc: "Οι δύο πλευρές σχηματίζουν μία ευθεία γραμμή (180°).",

    ctaTitle: "Ώρα για Εξάσκηση στις Γωνίες!",
    ctaDesc: "Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις αναγνώρισης ειδών γωνιών, υπολογισμού συμπληρωματικών και παραπληρωματικών γωνιών, και γεωμετρικών προβλημάτων.",
    ctaButton: "Έναρξη Ασκήσεων"
  },
  en: {
    pageTitle: "Types of Angles - 5th Grade | LearnMaths.gr",
    pageDescription: "Learn the types of angles (acute, right, obtuse, straight, zero), how to measure using a protractor, and experiment with the interactive lab.",
    backText: "5th Grade",
    actionButton: "Practice",
    badgeChapter: "CHAPTER 13 • 5TH GRADE",
    heroTitle: "Types of Angles",
    heroSubtitle: "Explore the geometric definition of an angle, the 5 core angle categories by opening, how to use a protractor, and complementary and supplementary angles.",
    heroStatus: "Theory & Dynamic Geometry Canvas",
    heroAction: "Try the Practice Problems",

    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The anatomy and classification of angles based on their measure in degrees.",

    step1Badge: "STEP 1",
    step1Type: "Definition",
    step1Title: "Anatomy of an Angle",
    step1P1: "An angle is the geometric figure formed by two rays sharing a common endpoint.",
    step1VertexTitle: "Vertex:",
    step1VertexDesc: "The shared starting point of the two rays.",
    step1SidesTitle: "Sides (Rays):",
    step1SidesDesc: "The two rays that define the opening.",
    step1UnitTitle: "Unit of Measurement:",
    step1UnitDesc: "The degree ( ° ), measured using a protractor.",
    step1Tip: "The size of an angle depends only on the opening between its sides, not on their drawn length!",

    step2Badge: "STEP 2",
    step2Type: "Classification",
    step2Title: "The 5 Types of Angles",
    step2Intro: "Based on their measure in degrees, angles are classified into 5 categories:",
    angleZeroName: "Zero:",
    angleAcuteName: "Acute:",
    angleRightName: "Right:",
    angleObtuseName: "Obtuse:",
    angleStraightName: "Straight:",
    angleTerm: "Angle",
    step2Tip: "The right angle (90°) serves as the benchmark: every angle is compared to whether it is smaller or larger than it.",

    step3Badge: "STEP 3",
    step3Type: "Measurement",
    step3Title: "Using a Protractor",
    step3Intro: "To measure an angle accurately:",
    step3Rule1: "Place the center mark of the protractor precisely on the vertex of the angle.",
    step3Rule2: "Align the 0° baseline with one of the angle's rays.",
    step3Rule3: "Read the degree measure where the other ray intersects the scale.",
    step3TipTitle: "Scale Awareness:",
    step3TipDesc: "Always begin reading from the 0° mark aligned with the baseline, not from 180°!",

    step4Badge: "STEP 4",
    step4Type: "Relationships",
    step4Title: "Complementary & Supplementary",
    step4Intro: "Two angles often share special sum relationships:",
    step4CompTitle: "Complementary:",
    step4CompDesc: "Sum up to exactly 90° (forming a right angle, e.g. 35° ＋ 55° ＝ 90°).",
    step4SuppTitle: "Supplementary:",
    step4SuppDesc: "Sum up to exactly 180° (forming a straight angle, e.g. 110° ＋ 70° ＝ 180°).",
    step4Tip: "If an angle is 40°, its complement is 90° － 40° ＝ 50° and its supplement is 180° － 40° ＝ 140°.",

    labBadge: "INTERACTIVE LAB",
    labTitle: "Dynamic Geometry Angle Canvas",
    labSubtitle: "Change the opening of the rays using buttons, range slider, or quick presets to see angle shape, classification, and degree arc live.",
    ctrlTitle: "OPENING ADJUSTMENT",
    degreesLabel: "Degrees ( ° ):",
    btnDecr1: "Decrease degrees by 1",
    btnIncr1: "Increase degrees by 1",
    charTitle: "ANGLE CLASSIFICATION",
    chartTitle: "VISUAL ANGLE REPRESENTATION",
    measureText: "Measure:",
    vertexLabel: "Vertex O",
    kindLabel: "Type:",

    angleZeroTitle: "Zero Angle",
    angleZeroDesc: "Both rays coincide completely (0°).",
    angleAcuteTitle: "Acute Angle",
    angleAcuteDesc: "Smaller than a right angle (0° ＜ Angle ＜ 90°).",
    angleRightTitle: "Right Angle",
    angleRightDesc: "The two sides are perpendicular to each other (90°).",
    angleObtuseTitle: "Obtuse Angle",
    angleObtuseDesc: "Greater than a right angle and smaller than a straight angle (90° ＜ Angle ＜ 180°).",
    angleStraightTitle: "Straight Angle",
    angleStraightDesc: "The two rays form a straight line (180°).",

    ctaTitle: "Time to Practice Angles!",
    ctaDesc: "Test your skills with angle classification problems, calculating complementary and supplementary angles, and geometry exercises.",
    ctaButton: "Start Exercises"
  }
};

export default function GoniesTheoryPage() {
  const router = useRouter();
  const { locale } = router;
  const isEn = locale === 'en';
  const t = isEn ? I18N.en : I18N.el;
  const numberLocale = isEn ? 'en-US' : 'el-GR';

  // Μοίρες γωνίας (0° έως 180°)
  const [degrees, setDegrees] = useState(45);

  // Καθορισμός είδους γωνίας
  const getAngleType = (deg) => {
    if (deg === 0) {
      return {
        title: t.angleZeroTitle,
        color: 'text-slate-600',
        badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
        desc: t.angleZeroDesc
      };
    }
    if (deg < 90) {
      return {
        title: t.angleAcuteTitle,
        color: 'text-blue-600',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        desc: t.angleAcuteDesc
      };
    }
    if (deg === 90) {
      return {
        title: t.angleRightTitle,
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        desc: t.angleRightDesc
      };
    }
    if (deg < 180) {
      return {
        title: t.angleObtuseTitle,
        color: 'text-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        desc: t.angleObtuseDesc
      };
    }
    return {
      title: t.angleStraightTitle,
      color: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      desc: t.angleStraightDesc
    };
  };

  const angleInfo = getAngleType(degrees);

  // SVG Διαστάσεις & Υπολογισμοί
  const cx = 200;
  const cy = 150;
  const radius = 125;

  const angleInRad = (degrees * Math.PI) / 180;
  const x2 = cx + radius * Math.cos(angleInRad);
  const y2 = cy - radius * Math.sin(angleInRad);

  // Τόξο γωνίας
  const arcRadius = 40;
  const arcX = cx + arcRadius * Math.cos(angleInRad);
  const arcY = cy - arcRadius * Math.sin(angleInRad);

  const arcPath =
    degrees > 0
      ? `M ${cx + arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 0 ${arcX} ${arcY}`
      : '';

  // Σύμβολο ορθής γωνίας (τετραγωνάκι)
  const squareSize = 20;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDescription}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/13-gonies-ask"
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
              href="/e-dimotikou/13-gonies-ask"
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
                    • <strong>{t.step1VertexTitle}</strong> {t.step1VertexDesc}
                  </div>
                  <div>
                    • <strong>{t.step1SidesTitle}</strong> {t.step1SidesDesc}
                  </div>
                  <div>
                    • <strong>{t.step1UnitTitle}</strong> {t.step1UnitDesc}
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

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-slate-700 font-bold">{t.angleZeroName}</span>
                    <span className="text-slate-700">{t.angleTerm} ＝ 0°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-blue-700 font-bold">{t.angleAcuteName}</span>
                    <span className="text-slate-700">0° ＜ {t.angleTerm} ＜ 90°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-emerald-700 font-bold">{t.angleRightName}</span>
                    <span className="text-slate-900 font-bold">{t.angleTerm} ＝ 90°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-purple-700 font-bold">{t.angleObtuseName}</span>
                    <span className="text-slate-700">90° ＜ {t.angleTerm} ＜ 180°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-indigo-700 font-bold">{t.angleStraightName}</span>
                    <span className="text-slate-900 font-bold">{t.angleTerm} ＝ 180°</span>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">1.</span>
                    <span>{t.step3Rule1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">2.</span>
                    <span>{t.step3Rule2}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">3.</span>
                    <span>{t.step3Rule3}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>{t.step3TipTitle}</strong> {t.step3TipDesc}
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
                    <strong>{t.step4CompTitle}</strong> {t.step4CompDesc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>{t.step4SuppTitle}</strong> {t.step4SuppDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΓΩΝΙΩΝ */}
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
            {/* Αριστερή Στήλη: Χειριστήρια & Ταυτότητα Γωνίας */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.ctrlTitle)}
              </h4>

              {/* Stepper Μοιρών */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.degreesLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {degrees.toLocaleString(numberLocale)}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.btnDecr1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDegrees((prev) => Math.max(0, prev - 1));
                    }}
                    disabled={degrees <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="180"
                    step="1"
                    value={degrees}
                    onChange={(e) => setDegrees(Number(e.target.value))}
                    aria-label={t.degreesLabel}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.btnIncr1}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDegrees((prev) => Math.min(180, prev + 1));
                    }}
                    disabled={degrees >= 180}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά συνήθων γωνιών */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[0, 30, 45, 60, 90, 120, 135, 150, 180].map((val) => (
                    <button
                      key={`btn-deg-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDegrees(val);
                      }}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg font-semibold transition ${
                        degrees === val
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val.toLocaleString(numberLocale)}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Γωνίας */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.charTitle)}
                </span>
                <div className={`text-2xl sm:text-3xl font-black ${angleInfo.color}`}>
                  {angleInfo.title}
                </div>
                <div className={`p-2.5 rounded-xl border text-xs font-medium ${angleInfo.badgeBg}`}>
                  {angleInfo.desc}
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.chartTitle)}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {t.measureText} {degrees.toLocaleString(numberLocale)}°
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[440px] aspect-[400/220] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 400 220" className="w-full h-full drop-shadow-sm">
                  {/* Ημικυκλικός οδηγός μοιρογνωμονίου */}
                  <path
                    d="M 75 150 A 125 125 0 0 1 325 150"
                    fill="none"
                    className="stroke-slate-200 stroke-1 stroke-dasharray-4"
                    strokeDasharray="4 4"
                  />

                  {/* Σταθερή Ακτίνα Βάσης (Προς τα Δεξιά) */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx + radius}
                    y2={cy}
                    className="stroke-slate-800 stroke-[4] stroke-linecap-round"
                  />

                  {/* Κινούμενη Ακτίνα */}
                  {degrees > 0 && (
                    <line
                      x1={cx}
                      y1={cy}
                      x2={x2}
                      y2={y2}
                      className="stroke-blue-600 stroke-[4] stroke-linecap-round transition-all duration-75"
                    />
                  )}

                  {/* Τόξο ή Τετραγωνάκι Ορθής */}
                  {degrees === 90 ? (
                    <path
                      d={`M ${cx + squareSize} ${cy} L ${cx + squareSize} ${cy - squareSize} L ${cx} ${cy - squareSize}`}
                      fill="none"
                      className="stroke-emerald-600 stroke-2"
                    />
                  ) : (
                    degrees > 0 && (
                      <path
                        d={arcPath}
                        fill="none"
                        className="stroke-amber-500 stroke-[2.5]"
                      />
                    )
                  )}

                  {/* Κορυφή Γωνίας (Κέντρο) */}
                  <circle cx={cx} cy={cy} r="6" className="fill-slate-900" />

                  {/* Ετικέτες στα άκρα */}
                  <text x={cx + radius + 14} y={cy + 5} textAnchor="start" className="font-mono text-xs font-bold fill-slate-500">
                    0°
                  </text>
                  {degrees === 180 && (
                    <text x={cx - radius - 24} y={cy + 5} textAnchor="end" className="font-mono text-xs font-bold fill-slate-500">
                      180°
                    </text>
                  )}
                  {degrees === 90 && (
                    <text x={cx} y={cy - radius - 10} textAnchor="middle" className="font-mono text-xs font-bold fill-emerald-600">
                      90°
                    </text>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700 flex flex-wrap items-center justify-center gap-2">
                <span>{t.vertexLabel}</span>
                <span>•</span>
                <span>
                  {t.measureText} <strong className="text-slate-900">{degrees.toLocaleString(numberLocale)}°</strong>
                </span>
                <span>•</span>
                <span>
                  {t.kindLabel} <strong className={angleInfo.color}>{angleInfo.title}</strong>
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
            href="/e-dimotikou/13-gonies-ask"
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
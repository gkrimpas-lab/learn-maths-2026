// pages/e-dimotikou/24-perimetros.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

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

const dictionary = {
  el: {
    pageTitle: "Περίμετρος Σχημάτων - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τι είναι η περίμετρος, πώς υπολογίζεται σε τρίγωνα, τετράγωνα, ορθογώνια και σύνθετα σχήματα, και δοκιμάστε το διαδραστικό εργαστήριο απλώματος πλευρών.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    badge: "ΚΕΦΑΛΑΙΟ 24 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Η Περίμετρος των Σχημάτων",
    mainDesc: "Ανακαλύπτουμε τι σημαίνει περίμετρος ενός γεωμετρικού σχήματος, πώς απλώνονται οι πλευρές του σε μία ενιαία ευθεία γραμμή, τους βασικούς μαθηματικούς τύπους για γρήγορο υπολογισμό και πώς τη χρησιμοποιούμε στην περίφραξη χωραφιών και οικοπέδων.",
    statusTheory: "Θεωρία & Ζωντανός Προσομοιωτής Απλώματος Πλευρών",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",
    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η θεμελιώδης έννοια της περιμέτρου, οι κανόνες και οι πρακτικές εφαρμογές.",
    step1Tag: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Τι είναι η Περίμετρος;",
    step1Desc: "Περίμετρος (Π) ενός επίπεδου γεωμετρικού σχήματος είναι το συνολικό μήκος του περιγράμματός του.",
    step1Formula: "Περίμετρος ＝ α ＋ β ＋ γ ＋ δ ...",
    step1Note: "Για να τη βρούμε, προσθέτουμε τα μήκη όλων των εξωτερικών πλευρών του σχήματος, σαν να απλώνουμε ένα σχοινί γύρω-γύρω.",
    step1Tip: "Η περίμετρος είναι μήκος και μετριέται σε μονάδες μήκους: mm, cm, dm, m, km (όχι τετραγωνικά μέτρα!).",
    step2Tag: "ΒΗΜΑ 2",
    step2Category: "Τύποι",
    step2Title: "Τύποι Βασικών Σχημάτων",
    step2Desc: "Για σχήματα με ίσες πλευρές χρησιμοποιούμε συντομότερους τύπους:",
    step2Square: "Τετράγωνο:",
    step2Rectangle: "Ορθογώνιο:",
    step2Triangle: "Ισόπλευρο τρίγωνο:",
    step2Regular: "Κανονικό πολύγωνο (ν):",
    step2ReverseIntro: "Αντίστροφα, σε ένα τετράγωνο με περίμετρο Π, η πλευρά του είναι:",
    step3Tag: "ΒΗΜΑ 3",
    step3Category: "Προσοχή",
    step3Title: "Ομοιογένεια Μονάδων",
    step3Desc: "Πριν προσθέσουμε τις πλευρές, πρέπει όλες οι διαστάσεις να είναι στην ίδια μονάδα μέτρησης:",
    step3ExampleLine1: "π.χ. Μήκος 2 m και πλάτος 60 cm:",
    step3ExampleLine2: "Μετατρέπουμε: 60 cm ＝ 0,6 m",
    step3ExampleLine3: "Π ＝ 2 · ( 2 ＋ 0,6 ) ＝ 2 · 2,6 ＝ 5,2 m",
    step3WarningText: "Δεν προσθέτουμε ποτέ απευθείας μέτρα με εκατοστά ή χιλιοστά!",
    step3Tip: "Πάντα πρώτα η μετατροπή μονάδων και μετά η πρόσθεση!",
    step4Tag: "ΒΗΜΑ 4",
    step4Category: "Εφαρμογές",
    step4Title: "Περίφραξη & Κόστος",
    step4Desc: "Η περίμετρος είναι απαραίτητη σε καθημερινά προβλήματα κατασκευών:",
    step4FencingTitle: "Συρματόπλεγμα:",
    step4FencingFormula: "Μήκος σύρματος ＝ Περίμετρος · Σειρές σύρματος.",
    step4CostTitle: "Συνολικό Κόστος:",
    step4CostFormula: "Περίμετρος · Τιμή ανά μέτρο ( € ).",
    step4Tip: "Αν σε ένα οικόπεδο αφήσουμε πόρτα 3 m, αφαιρούμε τα 3 m από την περίμετρο πριν αγοράσουμε σύρμα!",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Προσομοίωση Απλώματος Πλευρών σε Ευθεία",
    labDesc: "Σύρε τον δρομέα για να δεις πώς οι 4 πλευρές του τετραπλεύρου ξεκολλούν, ευθυγραμμίζονται και προστίθενται μία-μία πάνω στον χάρακα.",
    controlsHeader: "ΠΡΟΟΔΟΣ ΑΠΛΩΜΑΤΟΣ ΠΛΕΥΡΩΝ",
    progressLabel: "Πρόοδος Απλώματος:",
    decreaseAria: "Μείωση προόδου κατά 5%",
    increaseAria: "Αύξηση προόδου κατά 5%",
    sliderAria: "Πρόοδος απλώματος πλευρών",
    closedShapeBtn: "Κλειστό Σχήμα (0%)",
    fullUnfoldBtn: "Πλήρες Άπλωμα (100%)",
    sumCardHeader: "ΑΘΡΟΙΣΜΑ ΜΗΚΩΝ ΠΛΕΥΡΩΝ",
    perimeterFull: "Περίμετρος ＝ 6 ＋ 5 ＋ 7 ＋ 4 ＝ 22 cm",
    currentLengthPrefix: "Τρέχον μήκος:",
    canvasHeader: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΧΑΡΑΚΑΣ)",
    perimeterLabel: "Περίμετρος:",
    unfoldingLabel: "Άπλωμα:",
    fullUnfoldCallout: "Ολοκληρωμένο άπλωμα: Όλες οι πλευρές μπήκαν στη σειρά. Περίμετρος ＝",
    partialUnfoldCallout: "Σύρε το ρυθμιστικό στο 100% για να δεις όλες τις πλευρές να σχηματίζουν μία ευθεία.",
    bottomBannerTitle: "Ώρα για Εξάσκηση στην Περίμετρο!",
    bottomBannerDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού περιμέτρου τριγώνων, ορθογωνίων, κανονικών πολυγώνων και προβλήματα περίφραξης.",
    startExercisesBtn: "Έναρξη Ασκήσεων",
    vertices: { A: 'Α', B: 'Β', C: 'Γ', D: 'Δ' }
  },
  en: {
    pageTitle: "Perimeter of Shapes - Grade 5 | LearnMaths.gr",
    pageDesc: "Learn what perimeter is, how to calculate it for triangles, squares, rectangles, and composite figures, and explore the interactive boundary unfolding lab.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    badge: "CHAPTER 24 • GRADE 5",
    mainTitle: "The Perimeter of Shapes",
    mainDesc: "We explore the concept of perimeter, how side segments unroll onto a straight measuring line, basic calculation formulas, and practical applications like land fencing.",
    statusTheory: "Theory & Live Perimeter Unfolding Simulator",
    tryExercisesBtn: "Try the Exercises",
    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "The fundamental concept of perimeter, rules, and everyday applications.",
    step1Tag: "STEP 1",
    step1Category: "Definition",
    step1Title: "What is Perimeter?",
    step1Desc: "The perimeter (P) of a 2D geometric shape is the total length of its boundary.",
    step1Formula: "Perimeter ＝ a ＋ b ＋ c ＋ d ...",
    step1Note: "To find it, we add the lengths of all outer boundary sides, like wrapping a measuring tape all the way around.",
    step1Tip: "Perimeter is length and is measured in length units: mm, cm, dm, m, km (not square units!).",
    step2Tag: "STEP 2",
    step2Category: "Formulas",
    step2Title: "Formulas for Common Shapes",
    step2Desc: "For figures with equal sides, we use quick multiplication formulas:",
    step2Square: "Square:",
    step2Rectangle: "Rectangle:",
    step2Triangle: "Equilateral triangle:",
    step2Regular: "Regular polygon (n):",
    step2ReverseIntro: "Conversely, in a square with perimeter P, each side length is:",
    step3Tag: "STEP 3",
    step3Category: "Caution",
    step3Title: "Unit Homogeneity",
    step3Desc: "Before adding side lengths, all dimensions must be expressed in the exact same unit:",
    step3ExampleLine1: "e.g. Length 2 m and width 60 cm:",
    step3ExampleLine2: "Convert: 60 cm ＝ 0.6 m",
    step3ExampleLine3: "P ＝ 2 · ( 2 ＋ 0.6 ) ＝ 2 · 2.6 ＝ 5.2 m",
    step3WarningText: "Never add meters directly with centimeters or millimeters!",
    step3Tip: "Always convert units first before performing addition!",
    step4Tag: "STEP 4",
    step4Category: "Applications",
    step4Title: "Fencing & Costs",
    step4Desc: "Perimeter is essential in real-world construction and boundary estimation:",
    step4FencingTitle: "Wire Fencing:",
    step4FencingFormula: "Total wire length ＝ Perimeter · Number of rows.",
    step4CostTitle: "Total Cost:",
    step4CostFormula: "Perimeter · Cost per meter ( € ).",
    step4Tip: "If a fenced plot includes a 3 m gate, subtract 3 m from the perimeter before purchasing fencing wire!",
    labBadge: "INTERACTIVE LABORATORY",
    labTitle: "Simulation of Unfolding Boundary Sides",
    labDesc: "Drag the slider to watch the 4 sides of the quadrilateral detach, align, and add up step-by-step along the ruler.",
    controlsHeader: "SIDE UNFOLDING PROGRESS",
    progressLabel: "Unfolding Progress:",
    decreaseAria: "Decrease progress by 5%",
    increaseAria: "Increase progress by 5%",
    sliderAria: "Side unfolding progress",
    closedShapeBtn: "Closed Shape (0%)",
    fullUnfoldBtn: "Fully Unfolded (100%)",
    sumCardHeader: "SUM OF SIDE LENGTHS",
    perimeterFull: "Perimeter ＝ 6 ＋ 5 ＋ 7 ＋ 4 ＝ 22 cm",
    currentLengthPrefix: "Current length:",
    canvasHeader: "GEOMETRIC VISUALIZATION (RULER)",
    perimeterLabel: "Perimeter:",
    unfoldingLabel: "Unfolding:",
    fullUnfoldCallout: "Fully unfolded: All boundary sides are now aligned. Perimeter ＝",
    partialUnfoldCallout: "Drag the slider to 100% to see all sides form a single straight line.",
    bottomBannerTitle: "Time to Practice Perimeter!",
    bottomBannerDesc: "Test your skills with challenging exercises on finding perimeter of triangles, rectangles, regular polygons, and real-life fencing problems.",
    startExercisesBtn: "Start Exercises",
    vertices: { A: 'A', B: 'B', C: 'C', D: 'D' }
  }
};

export default function PerimetrosTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];
  const numLoc = locale === 'el' ? 'el-GR' : 'en-US';

  const [progress, setProgress] = useState(0);

  const sidesData = [
    { id: 0, label: locale === 'el' ? 'α' : 'a', lengthCm: 6, px: 60, color: 'stroke-cyan-500', fill: 'bg-cyan-500' },
    { id: 1, label: locale === 'el' ? 'β' : 'b', lengthCm: 5, px: 50, color: 'stroke-indigo-500', fill: 'bg-indigo-500' },
    { id: 2, label: locale === 'el' ? 'γ' : 'c', lengthCm: 7, px: 70, color: 'stroke-purple-500', fill: 'bg-purple-500' },
    { id: 3, label: locale === 'el' ? 'δ' : 'd', lengthCm: 4, px: 40, color: 'stroke-amber-500', fill: 'bg-amber-500' }
  ];

  const totalPerimetrosCm = 22;
  const totalLengthPx = 220;
  const startX = 110;
  const groundY = 210;

  const pA = { x: 160, y: 60 };
  const pB = { x: 280, y: 60 };
  const pΓ = { x: 250, y: 130 };
  const pΔ = { x: 140, y: 120 };

  const getSideCoords = (id) => {
    let origX1, origY1, origX2, origY2;
    if (id === 0) { origX1 = pA.x; origY1 = pA.y; origX2 = pB.x; origY2 = pB.y; }
    if (id === 1) { origX1 = pB.x; origY1 = pB.y; origX2 = pΓ.x; origY2 = pΓ.y; }
    if (id === 2) { origX1 = pΓ.x; origY1 = pΓ.y; origX2 = pΔ.x; origY2 = pΔ.y; }
    if (id === 3) { origX1 = pΔ.x; origY1 = pΔ.y; origX2 = pA.x; origY2 = pA.y; }

    let targetX1 = startX;
    if (id > 0) targetX1 += sidesData[0].px;
    if (id > 1) targetX1 += sidesData[1].px;
    if (id > 2) targetX1 += sidesData[2].px;
    const targetX2 = targetX1 + sidesData[id].px;

    const stepMin = id * 25;
    const stepMax = stepMin + 25;

    let localFactor = 0;
    if (progress > stepMax) localFactor = 1;
    else if (progress > stepMin) localFactor = (progress - stepMin) / 25;

    return {
      x1: Math.round(origX1 + (targetX1 - origX1) * localFactor),
      y1: Math.round(origY1 + (groundY - origY1) * localFactor),
      x2: Math.round(origX2 + (targetX2 - origX2) * localFactor),
      y2: Math.round(origY2 + (groundY - origY2) * localFactor)
    };
  };

  const s0 = getSideCoords(0);
  const s1 = getSideCoords(1);
  const s2 = getSideCoords(2);
  const s3 = getSideCoords(3);

  const getCurrentUnfoldedLength = () => {
    if (progress === 0) return (0).toLocaleString(numLoc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (progress <= 25) return (6 * (progress / 25)).toLocaleString(numLoc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (progress <= 50) return (6 + 5 * ((progress - 25) / 25)).toLocaleString(numLoc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (progress <= 75) return (11 + 7 * ((progress - 50) / 25)).toLocaleString(numLoc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return (18 + 4 * ((progress - 75) / 25)).toLocaleString(numLoc, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/24-perimetros-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 {t.exercisesBtn}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{t.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              {t.mainTitle}
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              {t.mainDesc}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.statusTheory}</span>
            </div>
            <Link
              href="/e-dimotikou/24-perimetros-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
            >
              <span>{t.tryExercisesBtn}</span>
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
                    {t.step1Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-blue-950 shadow-inner">
                    {t.step1Formula}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step1Note}
                  </p>
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
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step2Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>{t.step2Square}</strong> {locale === 'el' ? 'Π ＝ 4 · α' : 'P ＝ 4 · a'}
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>{t.step2Rectangle}</strong> {locale === 'el' ? 'Π ＝ 2 · ( α ＋ β )' : 'P ＝ 2 · ( a ＋ b )'}
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>{t.step2Triangle}</strong> {locale === 'el' ? 'Π ＝ 3 · α' : 'P ＝ 3 · a'}
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>{t.step2Regular}</strong> {locale === 'el' ? 'Π ＝ ν · α' : 'P ＝ n · a'}
                  </div>
                </div>
              </div>

              {/* Κανονική μορφή κλάσματος για την αντίστροφη εύρεση πλευράς */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span>⚡ {t.step2ReverseIntro}</span>
                  <span className="inline-flex items-center gap-1 font-mono font-bold">
                    <span>{locale === 'el' ? 'α' : 'a'} ＝</span>
                    <span className="inline-flex flex-col items-center justify-center align-middle text-xs leading-tight px-1 font-mono">
                      <span className="border-b border-emerald-900 w-full text-center pb-0.5">{locale === 'el' ? 'Π' : 'P'}</span>
                      <span className="pt-0.5">4</span>
                    </span>
                  </span>
                </div>
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step3Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-mono">
                    {t.step3ExampleLine1}<br />
                    {t.step3ExampleLine2}<br />
                    {t.step3ExampleLine3}
                  </div>
                  <p className="text-slate-600 text-xs font-sans">
                    {t.step3WarningText}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {t.step4Tag}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{t.step4FencingTitle}</strong> {t.step4FencingFormula}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    • <strong>{t.step4CostTitle}</strong> {t.step4CostFormula}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΕΡΙΜΕΤΡΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {t.labBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.controlsHeader)}
              </h4>

              {/* Stepper Προόδου */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.progressLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {progress}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setProgress((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={progress <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    aria-label={t.sliderAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setProgress((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={progress >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά κατάστασης */}
                <div className="flex justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setProgress(0)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95"
                  >
                    🔄 {t.closedShapeBtn}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgress(100)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 ${
                      progress === 100
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    🎯 {t.fullUnfoldBtn}
                  </button>
                </div>
              </div>

              {/* Κάρτα Αθροίσματος Πλευρών */}
              <div
                className={`p-5 rounded-2xl border space-y-3 shadow-sm text-center transition duration-200 ${
                  progress === 100
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {t.sumCardHeader}
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono ${
                    progress === 100 ? 'text-emerald-700' : 'text-slate-800'
                  }`}
                >
                  {progress === 100
                    ? t.perimeterFull
                    : `${t.currentLengthPrefix} ${getCurrentUnfoldedLength()} cm`}
                </div>

                {/* Badges πλευρών */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {sidesData.map((s) => (
                    <span
                      key={s.id}
                      className={`text-xs p-1.5 px-3 rounded-xl font-black text-white font-mono shadow-xs ${s.fill}`}
                    >
                      {s.label} ＝ {s.lengthCm} cm
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς Unfolding */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{t.canvasHeader}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {progress === 100 ? `${t.perimeterLabel} ${totalPerimetrosCm} cm` : `${t.unfoldingLabel} ${progress}%`}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[500px] aspect-[440/260] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 440 260"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* 1. Ο Χάρακας / Έδαφος */}
                  <line
                    x1="30"
                    y1={groundY}
                    x2="410"
                    y2={groundY}
                    className="stroke-slate-300 stroke-[2]"
                    strokeDasharray="4 4"
                  />

                  {/* 2. Σταθερό αχνό περίγραμμα σχήματος */}
                  <polygon
                    points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pΓ.x},${pΓ.y} ${pΔ.x},${pΔ.y}`}
                    className="fill-none stroke-slate-200 stroke-[3]"
                    strokeDasharray="3 3"
                  />

                  {/* 3. Δυναμικές πλευρές που κινούνται */}
                  <line x1={s0.x1} y1={s0.y1} x2={s0.x2} y2={s0.y2} className={`${sidesData[0].color} stroke-[5] stroke-linecap-round`} />
                  <line x1={s1.x1} y1={s1.y1} x2={s1.x2} y2={s1.y2} className={`${sidesData[1].color} stroke-[5] stroke-linecap-round`} />
                  <line x1={s2.x1} y1={s2.y1} x2={s2.x2} y2={s2.y2} className={`${sidesData[2].color} stroke-[5] stroke-linecap-round`} />
                  <line x1={s3.x1} y1={s3.y1} x2={s3.x2} y2={s3.y2} className={`${sidesData[3].color} stroke-[5] stroke-linecap-round`} />

                  {/* 4. Γράμματα κορυφών και μήκη */}
                  <g className="text-xs font-black fill-slate-500 font-sans">
                    <text x={pA.x - 12} y={pA.y - 6}>{t.vertices.A}</text>
                    <text x={pB.x + 8} y={pB.y - 6}>{t.vertices.B}</text>
                    <text x={pΓ.x + 8} y={pΓ.y + 6}>{t.vertices.C}</text>
                    <text x={pΔ.x - 14} y={pΔ.y + 6}>{t.vertices.D}</text>

                    {/* Μήκη Πλευρών */}
                    <text x={(pA.x + pB.x) / 2} y={pA.y - 6} textAnchor="middle" className="fill-cyan-700 font-mono text-xs">
                      6 cm
                    </text>
                    <text x={(pB.x + pΓ.x) / 2 + 10} y={(pB.y + pΓ.y) / 2 + 2} className="fill-indigo-700 font-mono text-xs">
                      5 cm
                    </text>
                    <text x={(pΓ.x + pΔ.x) / 2} y={pΓ.y + 14} textAnchor="middle" className="fill-purple-700 font-mono text-xs">
                      7 cm
                    </text>
                    <text x={(pΔ.x + pA.x) / 2 - 32} y={(pΔ.y + pA.y) / 2 + 2} textAnchor="middle" className="fill-amber-700 font-mono text-xs">
                      4 cm
                    </text>
                  </g>

                  {/* 5. Διαγραμμίσεις χάρακα */}
                  <g className="fill-slate-500 text-[10px] font-black font-mono">
                    <line x1={startX} y1={groundY} x2={startX} y2={groundY + 6} className="stroke-slate-500 stroke-2" />
                    <text x={startX} y={groundY + 18} textAnchor="middle">0</text>

                    {progress >= 25 && (
                      <g>
                        <line x1={startX + 60} y1={groundY} x2={startX + 60} y2={groundY + 6} className="stroke-slate-400" />
                        <text x={startX + 60} y={groundY + 18} textAnchor="middle" className="fill-cyan-600">6</text>
                      </g>
                    )}

                    {progress >= 50 && (
                      <g>
                        <line x1={startX + 110} y1={groundY} x2={startX + 110} y2={groundY + 6} className="stroke-slate-400" />
                        <text x={startX + 110} y={groundY + 18} textAnchor="middle" className="fill-indigo-600">11</text>
                      </g>
                    )}

                    {progress >= 75 && (
                      <g>
                        <line x1={startX + 180} y1={groundY} x2={startX + 180} y2={groundY + 6} className="stroke-slate-400" />
                        <text x={startX + 180} y={groundY + 18} textAnchor="middle" className="fill-purple-600">18</text>
                      </g>
                    )}

                    {progress === 100 && (
                      <g>
                        <line x1={startX + totalLengthPx} y1={groundY} x2={startX + totalLengthPx} y2={groundY + 10} className="stroke-emerald-600 stroke-2" />
                        <text x={startX + totalLengthPx} y={groundY + 20} textAnchor="middle" className="fill-emerald-700 font-black text-xs">
                          {totalPerimetrosCm} cm
                        </text>
                      </g>
                    )}
                  </g>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {progress === 100 ? (
                  <span>
                    🟢 <strong>{t.fullUnfoldCallout}</strong> <strong className="text-emerald-700">{totalPerimetrosCm} cm</strong>!
                  </span>
                ) : (
                  <span>
                    📏 {t.partialUnfoldCallout}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              {t.bottomBannerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomBannerDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/24-perimetros-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {t.startExercisesBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
// pages/e-dimotikou/16-kathetes-eutheies.js
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

const translations = {
  el: {
    pageTitle: "Κάθετες Ευθείες - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε για τις τεμνόμενες και κάθετες ευθείες, το σύμβολο καθετότητας, τις 4 ορθές γωνίες, την απόσταση σημείου από ευθεία και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBadge: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 16 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Τεμνόμενες & Κάθετες Ευθείες",
    mainDesc: "Ανακαλύπτουμε πότε δύο ευθείες τέμνονται, ποια ειδική γεωμετρική σχέση τις καθιστά κάθετες ( ⊥ ), γιατί δημιουργούνται 4 ορθές γωνίες των 90° και πώς ορίζεται η απόσταση σημείου από ευθεία.",
    bannerStatus: "Θεωρία & Δυναμικός Καμβάς Ευθειών",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η σχετική θέση δύο ευθειών στο επίπεδο και η έννοια της καθετότητας.",
    step1Tag: "ΒΗΜΑ 1",
    step1Badge: "Έννοια",
    step1Title: "Τεμνόμενες Ευθείες",
    step1Desc: "Δύο ευθείες στο ίδιο επίπεδο που έχουν ένα μόνο κοινό σημείο ονομάζονται τεμνόμενες ευθείες.",
    step1Pt1: "Το κοινό τους σημείο ονομάζεται σημείο τομής.",
    step1Pt2: "Γύρω από το σημείο τομής σχηματίζονται 4 γωνίες ανά δύο παραπληρωματικές και κατά κορυφήν ίσες.",
    step1Tip: "💡 Αν δύο ευθείες δεν τέμνονται ποτέ όσο κι αν τις προεκτείνουμε, ονομάζονται παράλληλες.",
    step2Tag: "ΒΗΜΑ 2",
    step2Badge: "Ορισμός",
    step2Title: "Κάθετες Ευθείες ( ⊥ )",
    step2Desc: "Όταν δύο τεμνόμενες ευθείες τέμνονται σχηματίζοντας ορθή γωνία (90°), ονομάζονται κάθετες ευθείες.",
    step2Symbol: "Συμβολισμός: ε1 ⊥ ε2",
    step2Read: "Διαβάζεται: «Η ευθεία ε1 είναι κάθετη στην ευθεία ε2».",
    step2Tip: "⚡ Για να σχεδιάσουμε με ακρίβεια κάθετες ευθείες στο χαρτί, χρησιμοποιούμε τον γνώμονα (ορθογώνιο τρίγωνο).",
    step3Tag: "ΒΗΜΑ 3",
    step3Badge: "Ιδιότητα",
    step3Title: "Οι 4 Ορθές Γωνίες",
    step3Desc: "Αν δύο ευθείες σχηματίσουν μία μόνο ορθή γωνία στο σημείο τομής, τότε υποχρεωτικά και οι 4 γωνίες είναι ορθές (90°):",
    step3Sum: "90° ＋ 90° ＋ 90° ＋ 90° ＝ 360°",
    step3Explain: "Οι γειτονικές γωνίες είναι παραπληρωματικές (180° － 90° ＝ 90°), άρα καμία γωνία δεν μπορεί να είναι οξεία ή αμβλεία!",
    step3Tip: "🎯 Αρκεί να ελέγξουμε μόνο μία γωνία με τον γνώμονα: αν είναι 90°, όλες είναι 90°!",
    step4Tag: "ΒΗΜΑ 4",
    step4Badge: "Εφαρμογή",
    step4Title: "Απόσταση Σημείου από Ευθεία",
    step4Desc: "Η συντομότερη διαδρομή από ένα σημείο Α προς μια ευθεία ε είναι το κάθετο ευθύγραμμο τμήμα:",
    step4Pt1: "Απόσταση: Το μήκος του κάθετου τμήματος από το σημείο στην ευθεία.",
    step4Pt2: "Οποιοδήποτε άλλο πλάγιο τμήμα είναι πάντα μακρύτερο από το κάθετο.",
    step4Tip: "🔍 Σε αυτόν τον κανόνα βασίζεται και το ύψος των τριγώνων και των γεωμετρικών σχημάτων.",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Καμβάς Τομής Ευθειών",
    labDesc: "Περίστρεψε την ευθεία ε2 σύροντας τον δρομέα. Παρατήρησε πώς αλλάζει η γωνία τομής και πάτησε το κουμπί για να τις ευθυγραμμίσεις ακριβώς στις 90°.",
    labRotateTitle: "ΠΕΡΙΣΤΡΟΦΗ ΕΥΘΕΙΑΣ ε2",
    labAngleLabel: "Γωνία Τομής:",
    decreaseAria: "Μείωση γωνίας κατά 1°",
    increaseAria: "Αύξηση γωνίας κατά 1°",
    rangeAria: "Γωνία τομής ευθειών",
    alignBtn: "🎯 Ευθυγράμμιση στις 90° (Κάθετες)",
    statusHeading: "ΣΧΕΣΗ ΜΕΤΑΞΥ ΕΥΘΕΙΩΝ",
    statusPerpendicular: "ε1 ⊥ ε2 (ΚΑΘΕΤΕΣ)",
    statusIntersecting: "ΤΕΜΝΟΜΕΝΕΣ",
    statusPerpendicularDesc: "Σχηματίζουν ακριβώς 4 ορθές γωνίες των 90° γύρω από το σημείο τομής.",
    statusIntersectingDesc: (a) => `Σχηματίζουν δύο οξείες γωνίες ${a}° και δύο αμβλείες ${180 - a}°.`,
    canvasHeading: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ",
    canvasRightAngles: "Ορθές: 4 · 90° ＝ 360°",
    canvasAngles: (a) => `Γωνίες: ${a}° και ${180 - a}°`,
    line1Label: "ε1",
    line2Label: "ε2",
    pointLabel: "Ο",
    calloutPerpendicular: "🟢 Πλήρης καθετότητα: ε1 ⊥ ε2 (4 γωνίες των 90°)",
    calloutIntersecting: (a) => `✂️ Τεμνόμενες μη κάθετες ευθείες (γωνία τομής: ${a}°)`,
    ctaTitle: "Ώρα για Εξάσκηση στις Κάθετες Ευθείες!",
    ctaDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις αναγνώρισης καθετότητας, υπολογισμού γωνιών τομής και απόστασης σημείου από ευθεία.",
    startExercisesBtn: "🎯 Έναρξη Ασκήσεων",
    footerTopic: "Κάθετες Ευθείες & Απόσταση",
    footerNavBtn: "Μετάβαση στις Ασκήσεις",
  },
  en: {
    pageTitle: "Perpendicular Lines - 5th Grade | LearnMaths.gr",
    pageDesc: "Learn about intersecting and perpendicular lines, the perpendicular symbol, 4 right angles, distance from a point to a line, and try the interactive lab.",
    backText: "5th Grade",
    exercisesBadge: "🎯 Exercises",
    chapterBadge: "CHAPTER 16 • 5TH GRADE",
    mainTitle: "Intersecting & Perpendicular Lines",
    mainDesc: "Discover when two lines intersect, what specific geometric relationship makes them perpendicular ( ⊥ ), why 4 right angles of 90° are formed, and how the distance from a point to a line is defined.",
    bannerStatus: "Theory & Dynamic Line Canvas",
    tryExercises: "Try Exercises",
    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The relative position of two lines on a plane and the concept of perpendicularity.",
    step1Tag: "STEP 1",
    step1Badge: "Concept",
    step1Title: "Intersecting Lines",
    step1Desc: "Two lines on the same plane that share exactly one common point are called intersecting lines.",
    step1Pt1: "Their common point is called the point of intersection.",
    step1Pt2: "Around the intersection point, 4 angles are formed that are pairwise supplementary and vertically opposite (equal).",
    step1Tip: "💡 If two lines never intersect no matter how far they are extended, they are called parallel lines.",
    step2Tag: "STEP 2",
    step2Badge: "Definition",
    step2Title: "Perpendicular Lines ( ⊥ )",
    step2Desc: "When two intersecting lines cross forming a right angle (90°), they are called perpendicular lines.",
    step2Symbol: "Notation: L1 ⊥ L2",
    step2Read: "Read as: \"Line L1 is perpendicular to line L2\".",
    step2Tip: "⚡ To draw perpendicular lines accurately on paper, we use a set square (right triangle).",
    step3Tag: "STEP 3",
    step3Badge: "Property",
    step3Title: "The 4 Right Angles",
    step3Desc: "If two intersecting lines form just one right angle at their point of intersection, then necessarily all 4 angles are right angles (90°):",
    step3Sum: "90° ＋ 90° ＋ 90° ＋ 90° ＝ 360°",
    step3Explain: "Adjacent angles are supplementary (180° － 90° ＝ 90°), meaning no angle can be acute or obtuse!",
    step3Tip: "🎯 Checking just one angle with a set square is enough: if it's 90°, all of them are 90°!",
    step4Tag: "STEP 4",
    step4Badge: "Application",
    step4Title: "Distance from a Point to a Line",
    step4Desc: "The shortest path from a point A to a line L is the perpendicular line segment:",
    step4Pt1: "Distance: The length of the perpendicular segment from the point to the line.",
    step4Pt2: "Any other oblique line segment is always longer than the perpendicular one.",
    step4Tip: "🔍 The height (altitude) of triangles and geometric shapes is based directly on this rule.",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Dynamic Line Intersection Canvas",
    labDesc: "Rotate line L2 by dragging the slider. Observe how the intersection angle changes, and click the button to snap them to exactly 90°.",
    labRotateTitle: "ROTATE LINE L2",
    labAngleLabel: "Intersection Angle:",
    decreaseAria: "Decrease angle by 1°",
    increaseAria: "Increase angle by 1°",
    rangeAria: "Line intersection angle",
    alignBtn: "🎯 Snap to 90° (Perpendicular)",
    statusHeading: "RELATIONSHIP BETWEEN LINES",
    statusPerpendicular: "L1 ⊥ L2 (PERPENDICULAR)",
    statusIntersecting: "INTERSECTING",
    statusPerpendicularDesc: "They form exactly 4 right angles of 90° around the point of intersection.",
    statusIntersectingDesc: (a) => `They form two acute angles of ${a}° and two obtuse angles of ${180 - a}°.`,
    canvasHeading: "GEOMETRIC VISUALIZATION",
    canvasRightAngles: "Right: 4 · 90° ＝ 360°",
    canvasAngles: (a) => `Angles: ${a}° and ${180 - a}°`,
    line1Label: "L1",
    line2Label: "L2",
    pointLabel: "O",
    calloutPerpendicular: "🟢 Full perpendicularity: L1 ⊥ L2 (4 angles of 90°)",
    calloutIntersecting: (a) => `✂️ Intersecting non-perpendicular lines (angle: ${a}°)`,
    ctaTitle: "Time to Practice Perpendicular Lines!",
    ctaDesc: "Challenge yourself with interactive problems identifying perpendicularity, calculating intersection angles, and determining distances.",
    startExercisesBtn: "🎯 Start Exercises",
    footerTopic: "Perpendicular Lines & Distance",
    footerNavBtn: "Go to Exercises",
  },
};

export default function KathetesEutheiesTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Γωνία τομής των δύο ευθειών (από 15° έως 165°)
  const [angle, setAngle] = useState(45);
  const isKathetes = angle === 90;

  // Υπολογισμοί SVG
  const cx = 300;
  const cy = 160;
  const lineLength = 135;

  // Ευθεία 1 (Σταθερή Οριζόντια Ευθεία)
  const e1x1 = cx - lineLength;
  const e1y1 = cy;
  const e1x2 = cx + lineLength;
  const e1y2 = cy;

  // Ευθεία 2 (Κινούμενη Ευθεία βάσει της γωνίας)
  const rad = (angle * Math.PI) / 180;
  const e2x1 = Math.round(cx + lineLength * Math.cos(rad));
  const e2y1 = Math.round(cy - lineLength * Math.sin(rad));
  const e2x2 = Math.round(cx - lineLength * Math.cos(rad));
  const e2y2 = Math.round(cy + lineLength * Math.sin(rad));

  const formatNumber = (num) =>
    num.toLocaleString(locale === 'el' ? 'el-GR' : 'en-US');

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/16-kathetes-eutheies-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>{t.exercisesBadge}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-10 2xl:space-y-14 pb-28 sm:pb-36 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>{toCleanUppercase(t.chapterBadge)}</span>
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
              <span>{t.bannerStatus}</span>
            </div>
            <Link
              href="/e-dimotikou/16-kathetes-eutheies-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
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
              {t.stepsTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              {t.stepsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• {t.step1Pt1}</div>
                  <div>• {t.step1Pt2}</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                {t.step1Tip}
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step2Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step2Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step2Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-center text-emerald-950 shadow-inner">
                    {t.step2Symbol}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-center">
                    {t.step2Read}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                {t.step2Tip}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-black text-slate-900 shadow-inner">
                    {t.step3Sum}
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    {t.step3Explain}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Badge}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{locale === 'el' ? 'Απόσταση:' : 'Distance:'}</strong> {t.step4Pt1}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • {t.step4Pt2}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΑΘΕΤΩΝ ΕΥΘΕΙΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>{t.labBadge}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Κατάσταση */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.labRotateTitle)}
              </h4>

              {/* Stepper Γωνίας Τομής */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.labAngleLabel}</span>
                  <span
                    className={`min-w-[80px] text-center font-mono font-black text-2xl bg-white px-2.5 py-0.5 rounded-xl border shadow-sm transition ${
                      isKathetes
                        ? 'text-emerald-600 border-emerald-300 ring-2 ring-emerald-100'
                        : 'text-blue-600 border-blue-200'
                    }`}
                  >
                    {formatNumber(angle)}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngle((prev) => Math.max(15, prev - 1));
                    }}
                    disabled={angle <= 15}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="15"
                    max="165"
                    step="1"
                    value={angle}
                    onChange={(e) => setAngle(Number(e.target.value))}
                    aria-label={t.rangeAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAngle((prev) => Math.min(165, prev + 1));
                    }}
                    disabled={angle >= 165}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορο κουμπί snap στις 90° */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setAngle(90)}
                    className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 shadow-sm ${
                      isKathetes
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {t.alignBtn}
                  </button>
                </div>
              </div>

              {/* Κάρτα Κατάστασης Ευθειών */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  isKathetes
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.statusHeading)}
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-black ${
                    isKathetes ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isKathetes ? t.statusPerpendicular : t.statusIntersecting}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isKathetes
                    ? t.statusPerpendicularDesc
                    : t.statusIntersectingDesc(formatNumber(angle))}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasHeading)}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isKathetes
                    ? t.canvasRightAngles
                    : t.canvasAngles(formatNumber(angle))}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[520px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 320" className="w-full h-full drop-shadow-sm">
                  {/* Τετραγωνάκια 4 Ορθών Γωνιών */}
                  {isKathetes && (
                    <g className="stroke-emerald-600 stroke-[1.5] fill-emerald-500/20">
                      <rect x={cx} y={cy - 20} width="20" height="20" />
                      <rect x={cx - 20} y={cy - 20} width="20" height="20" />
                      <rect x={cx - 20} y={cy} width="20" height="20" />
                      <rect x={cx} y={cy} width="20" height="20" />
                    </g>
                  )}

                  {/* Ευθεία 1 - Σταθερή Οριζόντια */}
                  <line
                    x1={e1x1}
                    y1={e1y1}
                    x2={e1x2}
                    y2={e1y2}
                    className={`stroke-[4] stroke-linecap-round transition-colors duration-200 ${
                      isKathetes ? 'stroke-emerald-600' : 'stroke-slate-800'
                    }`}
                  />
                  <text
                    x={e1x2 + 12}
                    y={e1y2 + 5}
                    className={`font-sans text-xs font-black ${
                      isKathetes ? 'fill-emerald-700' : 'fill-slate-800'
                    }`}
                  >
                    {t.line1Label}
                  </text>

                  {/* Ευθεία 2 - Κινούμενη */}
                  <line
                    x1={e2x1}
                    y1={e2y1}
                    x2={e2x2}
                    y2={e2y2}
                    className={`stroke-[4] stroke-linecap-round transition-colors duration-200 ${
                      isKathetes ? 'stroke-emerald-600' : 'stroke-blue-600'
                    }`}
                  />
                  <text
                    x={e2x1 + 10}
                    y={e2y1 - 8}
                    className={`font-sans text-xs font-black ${
                      isKathetes ? 'fill-emerald-700' : 'fill-blue-700'
                    }`}
                  >
                    {t.line2Label}
                  </text>

                  {/* Σημείο Τομής */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="5"
                    className={isKathetes ? 'fill-emerald-800' : 'fill-slate-900'}
                  />
                  <text
                    x={cx + 8}
                    y={cy + 18}
                    className="font-mono text-[11px] font-bold fill-slate-500"
                  >
                    {t.pointLabel}
                  </text>

                  {/* Ετικέτες μοιρών όταν δεν είναι κάθετες */}
                  {!isKathetes && (
                    <g className="font-mono text-[11px] font-black">
                      <text x={cx + 30} y={cy - 12} className="fill-blue-700">
                        {formatNumber(angle)}°
                      </text>
                      <text x={cx - 65} y={cy - 12} className="fill-slate-500">
                        {formatNumber(180 - angle)}°
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isKathetes ? (
                  <span>{t.calloutPerpendicular}</span>
                ) : (
                  <span>{t.calloutIntersecting(formatNumber(angle))}</span>
                )}
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
            href="/e-dimotikou/16-kathetes-eutheies-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>{t.startExercisesBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>

      {/* 5. ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-8">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs sm:text-sm border border-emerald-500/30">
              {locale === 'el' ? "Ε' ΔΗΜΟΤΙΚΟΥ" : "GRADE 5"}
            </span>
            <span className="font-semibold text-xs sm:text-sm truncate text-slate-300">
              {t.footerTopic}
            </span>
          </div>

          <Link
            href="/e-dimotikou/16-kathetes-eutheies-ask"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shrink-0 shadow"
          >
            <span>{t.footerNavBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
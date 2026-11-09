// pages/e-dimotikou/17-apostasi-simeiou-eutheias.js
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
    pageTitle: "Απόσταση Σημείου από Ευθεία - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε για την απόσταση σημείου από ευθεία, το κάθετο ευθύγραμμο τμήμα, τη σύγκριση με τα πλάγια τμήματα, τη μέτρηση με γνώμονα και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBadge: "🎯 Ασκήσεις",
    chapterBadge: "ΚΕΦΑΛΑΙΟ 17 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Απόσταση Σημείου από Ευθεία",
    mainDesc: "Ανακαλύπτουμε τι ορίζεται ως απόσταση ενός σημείου από μια ευθεία, γιατί το κάθετο τμήμα είναι πάντοτε η συντομότερη δυνατή διαδρομή, πώς χρησιμοποιούμε τον γνώμονα και πώς συνδέεται με το ύψος των γεωμετρικών σχημάτων.",
    bannerStatus: "Θεωρία & Ζωντανός Καμβάς Σύγκρισης Μηκών",
    tryExercises: "Δοκίμασε τις Ασκήσεις",
    stepsTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsDesc: "Η αυστηρή γεωμετρική έννοια της απόστασης και οι εφαρμογές της.",
    step1Tag: "ΒΗΜΑ 1",
    step1Badge: "Ορισμός",
    step1Title: "Τι είναι η Απόσταση;",
    step1Desc: "Αν πάρουμε ένα σημείο Α εκτός μιας ευθείας ε, μπορούμε να φέρουμε άπειρα τμήματα προς αυτήν.",
    step1Pt1: "Απόσταση του σημείου Α από την ευθεία ονομάζουμε το μήκος του κάθετου ευθύγραμμου τμήματος ΑΗ (όπου ΑΗ ⊥ ε).",
    step1Pt2: "Το σημείο Η πάνω στην ευθεία ονομάζεται ίχνος της κάθετης.",
    step1Tip: "💡 Αν ένα σημείο ανήκει ήδη πάνω στην ευθεία, η απόστασή του από αυτήν είναι ακριβώς 0 cm.",
    step2Tag: "ΒΗΜΑ 2",
    step2Badge: "Θεμελιώδης Ιδιότητα",
    step2Title: "Το Συντομότερο Τμήμα",
    step2Desc: "Ανάμεσα σε όλα τα ευθύγραμμα τμήματα που ενώνουν το σημείο με την ευθεία:",
    step2Rule: "Κάθετο Τμήμα ＜ Οποιοδήποτε Πλάγιο Τμήμα",
    step2Explain: "Όσο πιο μακριά μετακινούμαστε από το ίχνος της κάθετης, τόσο μεγαλύτερο γίνεται το μήκος του πλάγιου τμήματος!",
    step2Tip: "⚡ Αυτό συμβαίνει γιατί σε κάθε ορθογώνιο τρίγωνο που σχηματίζεται, το πλάγιο τμήμα είναι η υποτείνουσα (η μεγαλύτερη πλευρά).",
    step3Tag: "ΒΗΜΑ 3",
    step3Badge: "Κατασκευή",
    step3Title: "Σχεδίαση με Γνώμονα",
    step3Desc: "Για να μετρήσουμε ή να σχεδιάσουμε την απόσταση με ακρίβεια:",
    step3Pt1: "Εφαρμόζουμε τη μία κάθετη πλευρά του γνώμονα πάνω στην ευθεία.",
    step3Pt2: "Ολισθαίνουμε τον γνώμονα μέχρι η άλλη κάθετη πλευρά να περάσει ακριβώς από το σημείο Α.",
    step3Pt3: "Χαράσσουμε το ευθύγραμμο τμήμα και μετράμε το μήκος του σε εκατοστά (cm).",
    step3Tip: "🎯 Κανόνας: Αν η γωνία δεν είναι ακριβώς 90°, δεν μετράμε απόσταση, αλλά ένα πλάγιο τμήμα.",
    step4Tag: "ΒΗΜΑ 4",
    step4Badge: "Εφαρμογές",
    step4Title: "Απόσταση Παραλλήλων & Ύψος",
    step4Desc: "Η έννοια της απόστασης επεκτείνεται σε όλα τα γεωμετρικά σχήματα:",
    step4Pt1Title: "Παράλληλες Ευθείες:",
    step4Pt1Desc: "Η απόστασή τους είναι σταθερή και ίση σε όλα τα σημεία τους.",
    step4Pt2Title: "Ύψος Τριγώνου:",
    step4Pt2Desc: "Είναι η απόσταση μιας κορυφής από την απέναντι πλευρά (τη βάση).",
    step4Tip: "🔍 Σε όλους τους τύπους εμβαδού, το μέγεθος «ύψος» είναι πάντοτε μία κάθετη απόσταση!",
    labBadge: "🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Ζωντανός Καμβάς Σύγκρισης Μηκών (Απόσταση vs Πλάγιο)",
    labDesc: "Σύρε το σημείο Μ κατά μήκος της ευθείας. Παρατήρησε πώς μεταβάλλεται το μήκος του τμήματος ΑΜ και πάτησε το κουμπί snap για να βρεις την ακριβή κάθετη απόσταση.",
    labControlTitle: "ΜΕΤΑΤΟΠΙΣΗ ΣΗΜΕΙΟΥ Μ",
    cardAmLength: "ΜΗΚΟΣ ΤΜΗΜΑΤΟΣ ΑΜ",
    cardAngle: "ΓΩΝΙΑ ΜΕ ΕΥΘΕΙΑ",
    mPositionLabel: "Θέση του Μ:",
    posPerpendicular: "Κάθετα (0)",
    posLeft: (px) => `${px} px αριστερά`,
    posRight: (px) => `${px} px δεξιά`,
    decreaseAria: "Μετακίνηση σημείου Μ αριστερά",
    increaseAria: "Μετακίνηση σημείου Μ δεξιά",
    rangeAria: "Θέση σημείου Μ",
    findDistBtn: "📐 Εύρεση Απόστασης (Κάθετο Τμήμα)",
    segmentStatusBadge: "ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΤΜΗΜΑΤΟΣ",
    statusDistanceTitle: "🏆 ΑΥΤΗ ΕΙΝΑΙ Η ΑΠΟΣΤΑΣΗ!",
    statusObliqueTitle: "🛤️ ΠΛΑΓΙΟ ΤΜΗΜΑ",
    statusDistanceDesc: (d) => `Είναι το συντομότερο δυνατό τμήμα (${d} cm) και σχηματίζει ορθή γωνία 90°.`,
    statusObliqueDesc: (c, d) => `Το μήκος του (${c} cm) είναι αυστηρά μεγαλύτερο από την κάθετη απόσταση (${d} cm).`,
    canvasHeading: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ",
    canvasDistanceValue: (d) => `Απόσταση: ${d} cm (Κάθετη)`,
    canvasObliqueValue: (c) => `Πλάγιο: ${c} cm`,
    footLabel: "Η (ίχνος)",
    lineLabel: "ευθεία (ε)",
    pointA: "Σημείο Α",
    pointM: "Μ",
    calloutDistance: (d) => `🟢 Κάθετο τμήμα: Απόσταση ＝ ${d} cm (ελάχιστο μήκος)`,
    calloutOblique: (c, d) => `📏 Πλάγιο τμήμα: ${c} cm ＞ ${d} cm`,
    ctaTitle: "Ώρα για Εξάσκηση στην Απόσταση Σημείου από Ευθεία!",
    ctaDesc: "Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις σύγκρισης μηκών, αναγνώρισης κάθετων τμημάτων και γεωμετρικών εφαρμογών.",
    startExercisesBtn: "🎯 Έναρξη Ασκήσεων",
    footerTopic: "Απόσταση Σημείου από Ευθεία",
    footerNavBtn: "Μετάβαση στις Ασκήσεις",
  },
  en: {
    pageTitle: "Distance from a Point to a Line - 5th Grade | LearnMaths.gr",
    pageDesc: "Learn about the distance from a point to a line, perpendicular segment, comparison with oblique segments, measurement with a set square, and try the interactive lab.",
    backText: "5th Grade",
    exercisesBadge: "🎯 Exercises",
    chapterBadge: "CHAPTER 17 • 5TH GRADE",
    mainTitle: "Distance from a Point to a Line",
    mainDesc: "Discover how the distance of a point from a line is defined, why the perpendicular segment is always the shortest path, how to use a set square, and how it relates to the height of geometric shapes.",
    bannerStatus: "Theory & Live Length Comparison Canvas",
    tryExercises: "Try Exercises",
    stepsTitle: "Core Concepts in 4 Steps",
    stepsDesc: "The rigorous geometric concept of distance and its applications.",
    step1Tag: "STEP 1",
    step1Badge: "Definition",
    step1Title: "What is Distance?",
    step1Desc: "Given a point A outside a line L, we can draw infinitely many segments to it.",
    step1Pt1: "Distance from point A to line L is defined as the length of the perpendicular segment AH (where AH ⊥ L).",
    step1Pt2: "The intersection point H on the line is called the foot of the perpendicular.",
    step1Tip: "💡 If a point already lies on the line, its distance from the line is exactly 0 cm.",
    step2Tag: "STEP 2",
    step2Badge: "Fundamental Property",
    step2Title: "The Shortest Segment",
    step2Desc: "Among all line segments connecting the point to the line:",
    step2Rule: "Perpendicular Segment ＜ Any Oblique Segment",
    step2Explain: "The further we move from the foot of the perpendicular, the greater the length of the oblique segment becomes!",
    step2Tip: "⚡ This occurs because in every right triangle formed, the oblique segment acts as the hypotenuse (the longest side).",
    step3Tag: "STEP 3",
    step3Badge: "Construction",
    step3Title: "Drawing with a Set Square",
    step3Desc: "To accurately measure or construct the distance:",
    step3Pt1: "Align one perpendicular side of the set square along the line.",
    step3Pt2: "Slide the set square until its other perpendicular side passes directly through point A.",
    step3Pt3: "Draw the line segment and measure its length in centimeters (cm).",
    step3Tip: "🎯 Rule: If the angle is not exactly 90°, we are not measuring the distance, but an oblique segment.",
    step4Tag: "STEP 4",
    step4Badge: "Applications",
    step4Title: "Distance Between Parallels & Altitude",
    step4Desc: "The concept of distance extends across all geometric shapes:",
    step4Pt1Title: "Parallel Lines:",
    step4Pt1Desc: "Their distance is constant and equal at every point along them.",
    step4Pt2Title: "Triangle Altitude (Height):",
    step4Pt2Desc: "It is the distance from a vertex to the opposite side (the base).",
    step4Tip: "🔍 In all area formulas, the dimension \"height\" is always a perpendicular distance!",
    labBadge: "🔬 INTERACTIVE LAB",
    labTitle: "Live Length Comparison Canvas (Distance vs Oblique)",
    labDesc: "Drag point M along the line. Observe how the length of segment AM changes, and click the snap button to find the exact perpendicular distance.",
    labControlTitle: "MOVE POINT M",
    cardAmLength: "SEGMENT AM LENGTH",
    cardAngle: "ANGLE WITH LINE",
    mPositionLabel: "Position of M:",
    posPerpendicular: "Perpendicular (0)",
    posLeft: (px) => `${px} px left`,
    posRight: (px) => `${px} px right`,
    decreaseAria: "Move point M left",
    increaseAria: "Move point M right",
    rangeAria: "Position of point M",
    findDistBtn: "📐 Snap to Distance (Perpendicular)",
    segmentStatusBadge: "SEGMENT CLASSIFICATION",
    statusDistanceTitle: "🏆 THIS IS THE DISTANCE!",
    statusObliqueTitle: "🛤️ OBLIQUE SEGMENT",
    statusDistanceDesc: (d) => `It is the shortest possible segment (${d} cm) and forms a right angle of 90°.`,
    statusObliqueDesc: (c, d) => `Its length (${c} cm) is strictly greater than the perpendicular distance (${d} cm).`,
    canvasHeading: "GEOMETRIC VISUALIZATION",
    canvasDistanceValue: (d) => `Distance: ${d} cm (Perpendicular)`,
    canvasObliqueValue: (c) => `Oblique: ${c} cm`,
    footLabel: "H (foot)",
    lineLabel: "line (L)",
    pointA: "Point A",
    pointM: "M",
    calloutDistance: (d) => `🟢 Perpendicular segment: Distance ＝ ${d} cm (minimum length)`,
    calloutOblique: (c, d) => `📏 Oblique segment: ${c} cm ＞ ${d} cm`,
    ctaTitle: "Time to Practice Distance from a Point to a Line!",
    ctaDesc: "Test your skills with challenging exercises comparing lengths, identifying perpendicular segments, and geometric applications.",
    startExercisesBtn: "🎯 Start Exercises",
    footerTopic: "Distance from Point to Line",
    footerNavBtn: "Go to Exercises",
  },
};

export default function ApostasiSimeiouEutheiasTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = translations[locale];

  // Οριζόντια μετατόπιση του σημείου Μ πάνω στην ευθεία (-150 έως +150 px)
  const [offsetX, setOffsetX] = useState(-70);

  // Σταθερές συντεταγμένες σημείου Α
  const ax = 300;
  const ay = 80;

  // Σταθερό y για την οριζόντια ευθεία ε
  const ey = 240;

  // Θέση σημείου Μ πάνω στην ευθεία
  const mx = 300 + offsetX;
  const my = ey;

  // Σταθερή κάθετη απόσταση (160 px -> 8.0 cm)
  const verticalDistancePx = ey - ay;
  const numLocale = locale === 'en' ? 'en-US' : 'el-GR';

  const realDistanceCm = (verticalDistancePx / 20).toLocaleString(numLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  // Τρέχον μήκος τμήματος ΑΜ (Ευκλείδεια απόσταση)
  const currentLengthPx = Math.sqrt((mx - ax) * (mx - ax) + (my - ay) * (my - ay));
  const currentLengthCm = (currentLengthPx / 20).toLocaleString(numLocale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  // Γωνία τομής του ΑΜ με την ευθεία (σε μοίρες)
  const angleRad = Math.atan2(verticalDistancePx, Math.abs(mx - ax) || 0.001);
  const angleDeg = Math.round((angleRad * 180) / Math.PI);
  const angleDegFormatted = angleDeg.toLocaleString(numLocale);

  // Η ελάχιστη απόσταση επιτυγχάνεται ακριβώς όταν το offsetX είναι 0
  const isApostasi = offsetX === 0;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
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
              href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
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
                  <p className="text-slate-700">
                    {t.step1Pt1}
                  </p>
                  <p className="text-slate-500 text-xs">
                    {t.step1Pt2}
                  </p>
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-emerald-900 text-center shadow-inner">
                    {t.step2Rule}
                  </div>
                  <p className="text-slate-600 text-xs pt-1">
                    {t.step2Explain}
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

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">1.</span>
                    <span>{t.step3Pt1}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">2.</span>
                    <span>{t.step3Pt2}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">3.</span>
                    <span>{t.step3Pt3}</span>
                  </div>
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
                    • <strong>{t.step4Pt1Title}</strong> {t.step4Pt1Desc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • <strong>{t.step4Pt2Title}</strong> {t.step4Pt2Desc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΠΟΣΤΑΣΗΣ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ */}
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
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.labControlTitle)}
              </h4>

              {/* Πίνακας Μετρήσεων */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    {toCleanUppercase(t.cardAmLength)}
                  </span>
                  <span
                    className={`font-mono text-xl sm:text-2xl font-black ${
                      isApostasi ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {currentLengthCm} cm
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    {toCleanUppercase(t.cardAngle)}
                  </span>
                  <span
                    className={`font-mono text-xl sm:text-2xl font-black ${
                      isApostasi ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {angleDegFormatted}°
                  </span>
                </div>
              </div>

              {/* Stepper Μετατόπισης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.mPositionLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-bold text-xs bg-white px-2 py-1 rounded-xl border border-slate-200">
                    {offsetX === 0
                      ? t.posPerpendicular
                      : offsetX < 0
                      ? t.posLeft(Math.abs(offsetX).toLocaleString(numLocale))
                      : t.posRight(offsetX.toLocaleString(numLocale))}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOffsetX((prev) => Math.max(-150, prev - 10));
                    }}
                    disabled={offsetX <= -150}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    ←
                  </button>

                  <input
                    type="range"
                    min="-150"
                    max="150"
                    step="5"
                    value={offsetX}
                    onChange={(e) => setOffsetX(Number(e.target.value))}
                    aria-label={t.rangeAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOffsetX((prev) => Math.min(150, prev + 10));
                    }}
                    disabled={offsetX >= 150}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base cursor-pointer"
                  >
                    →
                  </button>
                </div>

                {/* Γρήγορο κουμπί Snap στην κάθετη θέση */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setOffsetX(0)}
                    className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 shadow-sm cursor-pointer ${
                      isApostasi
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {t.findDistBtn}
                  </button>
                </div>
              </div>

              {/* Κάρτα Κατάστασης Τμήματος */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  isApostasi
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.segmentStatusBadge)}
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-black ${
                    isApostasi ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isApostasi ? t.statusDistanceTitle : t.statusObliqueTitle}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isApostasi
                    ? t.statusDistanceDesc(realDistanceCm)
                    : t.statusObliqueDesc(currentLengthCm, realDistanceCm)}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasHeading)}</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isApostasi
                    ? t.canvasDistanceValue(realDistanceCm)
                    : t.canvasObliqueValue(currentLengthCm)}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[520px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 300" className="w-full h-full drop-shadow-sm">
                  {/* Σύμβολο ορθής γωνίας όταν είναι κάθετο */}
                  {isApostasi && (
                    <g className="stroke-emerald-600 stroke-[1.5] fill-emerald-500/20">
                      <rect x={ax} y={ey - 20} width="20" height="20" />
                    </g>
                  )}

                  {/* Διακεκομμένη γραμμή πραγματικής απόστασης (όταν είναι πλάγιο) */}
                  {!isApostasi && (
                    <g>
                      <line
                        x1={ax}
                        y1={ay}
                        x2={ax}
                        y2={ey}
                        className="stroke-slate-300 stroke-[2]"
                        strokeDasharray="4 4"
                      />
                      <circle cx={ax} cy={ey} r="3" className="fill-slate-400" />
                      <text x={ax + 6} y={ey - 6} className="font-mono text-[10px] font-bold fill-slate-400">
                        {t.footLabel}
                      </text>
                    </g>
                  )}

                  {/* Ευθεία (ε) */}
                  <line
                    x1="70"
                    y1={ey}
                    x2="490"
                    y2={ey}
                    className="stroke-slate-800 stroke-[4] stroke-linecap-round"
                  />
                  <text x="500" y={ey + 5} className="font-sans text-xs font-black fill-slate-700">
                    {t.lineLabel}
                  </text>

                  {/* Ευθύγραμμο Τμήμα ΑΜ */}
                  <line
                    x1={ax}
                    y1={ay}
                    x2={mx}
                    y2={my}
                    className={`stroke-[4] stroke-linecap-round transition-colors duration-150 ${
                      isApostasi ? 'stroke-emerald-600' : 'stroke-blue-600'
                    }`}
                  />

                  {/* Σημείο Α */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 14} textAnchor="middle" className="font-sans text-xs font-black fill-slate-900">
                    {t.pointA}
                  </text>

                  {/* Σημείο Μ */}
                  <circle cx={mx} cy={my} r="6" className={isApostasi ? 'fill-emerald-700' : 'fill-blue-600'} />
                  <text
                    x={mx}
                    y={my + 22}
                    textAnchor="middle"
                    className={`font-sans text-xs font-black ${
                      isApostasi ? 'fill-emerald-800' : 'fill-blue-700'
                    }`}
                  >
                    {t.pointM}
                  </text>

                  {/* Badge ένδειξης μήκους στο μέσο του τμήματος */}
                  <g transform={`translate(${(ax + mx) / 2}, ${(ay + my) / 2 - 12})`}>
                    <rect
                      x="-34"
                      y="-11"
                      width="68"
                      height="22"
                      rx="6"
                      className={`stroke shadow-xs ${
                        isApostasi
                          ? 'fill-emerald-600 stroke-emerald-700'
                          : 'fill-white stroke-slate-200'
                      }`}
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      className={`font-mono text-[11px] font-black ${
                        isApostasi ? 'fill-white' : 'fill-blue-700'
                      }`}
                    >
                      {currentLengthCm} cm
                    </text>
                  </g>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isApostasi ? (
                  <span>{t.calloutDistance(realDistanceCm)}</span>
                ) : (
                  <span>{t.calloutOblique(currentLengthCm, realDistanceCm)}</span>
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
            href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
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
            href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition active:scale-95 shrink-0 shadow cursor-pointer"
          >
            <span>{t.footerNavBtn}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}
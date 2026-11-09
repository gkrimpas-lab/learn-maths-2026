// pages/e-dimotikou/22-poligona.js
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

// Επαναχρησιμοποιήσιμο component για κανονική κατακόρυφη μορφή κλάσματος
function Fraction({ num, den, className = '', size = 'md' }) {
  const sizeClasses = {
    xs: 'text-[11px] 2xl:text-xs',
    sm: 'text-xs 2xl:text-sm',
    md: 'text-sm sm:text-base 2xl:text-lg',
    lg: 'text-base sm:text-xl 2xl:text-2xl',
    xl: 'text-xl sm:text-2xl 2xl:text-3xl'
  };

  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono font-bold leading-none select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <span className="px-1 text-center leading-tight">{num}</span>
      <span className="w-full min-w-[0.9em] h-[1.5px] bg-current my-[1px] rounded-full"></span>
      <span className="px-1 text-center leading-tight">{den}</span>
    </span>
  );
}

const dictionary = {
  el: {
    pageTitle: "Πολύγωνα - Ε' Δημοτικού | LearnMaths.gr",
    pageDesc: "Μάθετε τι είναι τα πολύγωνα, την ονοματολογία τους (τρίγωνα, τετράπλευρα, πεντάγωνα κ.ά.), τη διαφορά κανονικών και ανώμαλων πολυγώνων και δοκιμάστε το διαδραστικό εργαστήριο.",
    backText: "Ε' Δημοτικού",
    exercisesBtn: "Ασκήσεις",
    badge: "ΚΕΦΑΛΑΙΟ 22 • Ε' ΔΗΜΟΤΙΚΟΥ",
    mainTitle: "Τι είναι τα Πολύγωνα",
    mainDesc: "Εξερευνούμε τα κλειστά γεωμετρικά σχήματα που οριοθετούνται από ευθύγραμμα τμήματα, τη θεμελιώδη ισότητα πλευρών, γωνιών και κορυφών, τη διαφορά κανονικών και ανώμαλων πολυγώνων, καθώς και τις διαγωνίους τους.",
    statusTheory: "Θεωρία & Δυναμικός Καμβάς Πολυγώνων",
    tryExercisesBtn: "Δοκίμασε τις Ασκήσεις",
    stepsSectionTitle: "Βασικές Έννοιες σε 4 Βήματα",
    stepsSectionSubtitle: "Η ανατομία, η ταξινόμηση και οι ιδιότητες των πολυγώνων σχημάτων.",
    step1Tag: "ΒΗΜΑ 1",
    step1Category: "Ορισμός",
    step1Title: "Ανατομία του Πολυγώνου",
    step1Desc: "Πολύγωνο είναι κάθε επίπεδο, κλειστό γεωμετρικό σχήμα που περικλείεται αποκλειστικά από ευθύγραμμα τμήματα:",
    step1SidesLabel: "Πλευρές:",
    step1SidesDesc: "Τα ευθύγραμμα τμήματα που αποτελούν το περίγραμμά του.",
    step1VerticesLabel: "Κορυφές:",
    step1VerticesDesc: "Τα σημεία όπου συναντιούνται δύο διαδοχικές πλευρές.",
    step1AnglesLabel: "Εσωτερικές Γωνίες:",
    step1AnglesDesc: "Οι γωνίες που σχηματίζονται ανάμεσα στις πλευρές.",
    step1GoldenRule: "Χρυσός κανόνας: Σε κάθε πολύγωνο: Πλήθος Πλευρών ＝ Πλήθος Γωνιών ＝ Πλήθος Κορυφών!",
    step2Tag: "ΒΗΜΑ 2",
    step2Category: "Ονοματολογία",
    step2Title: "Ονομασία ανάλογα με τις Πλευρές",
    step2Desc: "Τα πολύγωνα παίρνουν το όνομά τους από τον αριθμό των γωνιών ή των πλευρών τους:",
    step2Triangle: "Τρίγωνο",
    step2TriangleNote: "(απλούστερο)",
    step2Quadrilateral: "Τετράπλευρο",
    step2Pentagon: "Πεντάγωνο",
    step2Hexagon: "Εξάγωνο",
    step2Heptagon: "Επτάγωνο",
    step2Octagon: "Οκτάγωνο",
    step2SidesCount: "πλευρές",
    step2Warning: "Δεν υπάρχει πολύγωνο με 2 πλευρές, γιατί 2 ευθύγραμμα τμήματα δεν μπορούν να κλείσουν μια περιοχή!",
    step3Tag: "ΒΗΜΑ 3",
    step3Category: "Κατηγοριοποίηση",
    step3Title: "Κανονικά & Μη Κανονικά",
    step3Desc: "Ανάλογα με το αν οι πλευρές και οι γωνίες τους είναι ίσες μεταξύ τους:",
    step3RegularTitle: "Κανονικό πολύγωνο:",
    step3RegularDesc: "Έχει όλες τις πλευρές ίσες ΚΑΙ όλες τις γωνίες ίσες (π.χ. ισόπλευρο τρίγωνο, τετράγωνο, κανονικό εξάγωνο).",
    step3IrregularTitle: "Μη κανονικό (ανώμαλο):",
    step3IrregularDesc: "Έχει πλευρές ή γωνίες με διαφορετικά μεγέθη.",
    step3Tip: "Ένα ορθογώνιο παραλληλόγραμμο δεν είναι κανονικό, παρότι έχει όλες τις γωνίες 90°, γιατί δεν έχει όλες τις πλευρές ίσες!",
    step4Tag: "ΒΗΜΑ 4",
    step4Category: "Στοιχεία",
    step4Title: "Διαγώνιοι & Περίμετρος",
    step4Desc: "Δύο θεμελιώδη γεωμετρικά στοιχεία των πολυγώνων:",
    step4DiagonalTitle: "Διαγώνιος:",
    step4DiagonalDesc: "Το ευθύγραμμο τμήμα που ενώνει δύο μη διαδοχικές κορυφές (το τρίγωνο έχει 0 διαγωνίους).",
    step4PerimeterTitle: "Περίμετρος (Π):",
    step4PerimeterDesc: "Το άθροισμα των μηκών όλων των πλευρών του πολυγώνου.",
    step4FormulaIntro: "Τύπος διαγωνίων πολυγώνου με ν κορυφές:",
    step4Tip: "Σε κανονικό πολύγωνο με ν πλευρές μήκους α: Περίμετρος ＝ ν · α.",
    labBadge: "ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ",
    labTitle: "Δυναμικός Γεωμετρικός Καμβάς Πολυγώνων",
    labDesc: "Άλλαξε τον αριθμό των πλευρών από 3 έως 8. Παρατήρησε πώς μεταβάλλεται το σχήμα, οι κορυφές, η ονομασία και ο αριθμός των διαγωνίων του.",
    controlsHeader: "ΜΕΤΑΒΟΛΗ ΑΡΙΘΜΟΥ ΠΛΕΥΡΩΝ",
    sidesLabel: "Αριθμός Πλευρών:",
    decreaseAria: "Μείωση πλευρών κατά 1",
    increaseAria: "Αύξηση πλευρών κατά 1",
    sliderAria: "Αριθμός πλευρών πολυγώνου",
    shapeCardHeader: "ΑΥΤΟ ΤΟ ΣΧΗΜΑ ΕΙΝΑΙ:",
    anglesCountLabel: "Γωνίες",
    sidesCountLabel: "Πλευρές",
    verticesCountLabel: "Κορυφές",
    diagonalsLabel: "Διαγώνιοι:",
    diagonalsFormulaLabel: "Τύπος:",
    diagonalsDefinition: "τμήματα που ενώνουν μη διαδοχικές κορυφές",
    canvasHeader: "ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ",
    canvasSelected: "πλευρές",
    conclusionCalloutPrefix: "Κλειστό σχήμα με",
    conclusionSides: "πλευρές",
    conclusionAngles: "γωνίες",
    conclusionVertices: "κορυφές",
    bottomBannerTitle: "Ώρα για Εξάσκηση στα Πολύγωνα!",
    bottomBannerDesc: "Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις αναγνώρισης πολυγώνων, υπολογισμού περιμέτρου, κανονικών πολυγώνων και διαγωνίων.",
    startExercisesBtn: "Έναρξη Ασκήσεων",
    polygonNames: {
      3: { title: 'Τρίγωνο', desc: 'Το απλούστερο πολύγωνο με 3 πλευρές, 3 γωνίες και 3 κορυφές.' },
      4: { title: 'Τετράπλευρο', desc: 'Πολύγωνο με 4 πλευρές, 4 γωνίες και 4 κορυφές.' },
      5: { title: 'Πεντάγωνο', desc: 'Πολύγωνο με 5 πλευρές, 5 γωνίες και 5 κορυφές.' },
      6: { title: 'Εξάγωνο', desc: 'Πολύγωνο με 6 πλευρές, 6 γωνίες και 6 κορυφές.' },
      7: { title: 'Επτάγωνο', desc: 'Πολύγωνο με 7 πλευρές, 7 γωνίες και 7 κορυφές.' },
      8: { title: 'Οκτάγωνο', desc: 'Πολύγωνο με 8 πλευρές, 8 γωνίες και 8 κορυφές.' }
    },
    letters: ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ']
  },
  en: {
    pageTitle: "Polygons - Grade 5 | LearnMaths.gr",
    pageDesc: "Learn what polygons are, their nomenclature (triangles, quadrilaterals, pentagons, etc.), the difference between regular and irregular polygons, and try the interactive lab.",
    backText: "Grade 5",
    exercisesBtn: "Exercises",
    badge: "CHAPTER 22 • GRADE 5",
    mainTitle: "What Polygons Are",
    mainDesc: "We explore closed geometric shapes bounded exclusively by straight line segments, the fundamental equality of sides, angles, and vertices, the difference between regular and irregular polygons, and their diagonals.",
    statusTheory: "Theory & Dynamic Polygon Canvas",
    tryExercisesBtn: "Try the Exercises",
    stepsSectionTitle: "Core Concepts in 4 Steps",
    stepsSectionSubtitle: "Anatomy, classification, and geometric properties of polygon figures.",
    step1Tag: "STEP 1",
    step1Category: "Definition",
    step1Title: "Anatomy of a Polygon",
    step1Desc: "A polygon is any flat, closed geometric figure enclosed exclusively by straight line segments:",
    step1SidesLabel: "Sides:",
    step1SidesDesc: "The line segments forming its boundary.",
    step1VerticesLabel: "Vertices:",
    step1VerticesDesc: "The points where two consecutive sides meet.",
    step1AnglesLabel: "Interior Angles:",
    step1AnglesDesc: "The angles formed between adjacent sides.",
    step1GoldenRule: "Golden Rule: In every polygon: Number of Sides ＝ Number of Angles ＝ Number of Vertices!",
    step2Tag: "STEP 2",
    step2Category: "Nomenclature",
    step2Title: "Naming Based on Sides",
    step2Desc: "Polygons are named according to their number of angles or sides:",
    step2Triangle: "Triangle",
    step2TriangleNote: "(simplest)",
    step2Quadrilateral: "Quadrilateral",
    step2Pentagon: "Pentagon",
    step2Hexagon: "Hexagon",
    step2Heptagon: "Heptagon",
    step2Octagon: "Octagon",
    step2SidesCount: "sides",
    step2Warning: "There is no polygon with 2 sides, because 2 line segments cannot enclose an area!",
    step3Tag: "STEP 3",
    step3Category: "Classification",
    step3Title: "Regular & Irregular",
    step3Desc: "Depending on whether all sides and angles are congruent to each other:",
    step3RegularTitle: "Regular polygon:",
    step3RegularDesc: "Has all sides equal AND all angles equal (e.g. equilateral triangle, square, regular hexagon).",
    step3IrregularTitle: "Irregular polygon:",
    step3IrregularDesc: "Has sides or angles with different measurements.",
    step3Tip: "A rectangle is NOT regular, even though all its angles are 90°, because its sides are not all equal!",
    step4Tag: "STEP 4",
    step4Category: "Elements",
    step4Title: "Diagonals & Perimeter",
    step4Desc: "Two fundamental geometric components of polygons:",
    step4DiagonalTitle: "Diagonal:",
    step4DiagonalDesc: "The line segment connecting two non-consecutive vertices (triangles have 0 diagonals).",
    step4PerimeterTitle: "Perimeter (P):",
    step4PerimeterDesc: "The sum of the lengths of all sides of the polygon.",
    step4FormulaIntro: "Formula for diagonals of an n-sided polygon:",
    step4Tip: "For a regular polygon with n sides of length a: Perimeter ＝ n · a.",
    labBadge: "INTERACTIVE LABORATORY",
    labTitle: "Dynamic Geometric Polygon Canvas",
    labDesc: "Change the number of sides from 3 to 8. Observe how the shape, vertices, name, and number of diagonals change.",
    controlsHeader: "MODIFY NUMBER OF SIDES",
    sidesLabel: "Number of Sides:",
    decreaseAria: "Decrease sides by 1",
    increaseAria: "Increase sides by 1",
    sliderAria: "Polygon number of sides",
    shapeCardHeader: "THIS SHAPE IS:",
    anglesCountLabel: "Angles",
    sidesCountLabel: "Sides",
    verticesCountLabel: "Vertices",
    diagonalsLabel: "Diagonals:",
    diagonalsFormulaLabel: "Formula:",
    diagonalsDefinition: "segments connecting non-consecutive vertices",
    canvasHeader: "GEOMETRIC VISUALIZATION",
    canvasSelected: "sides",
    conclusionCalloutPrefix: "Closed shape with",
    conclusionSides: "sides",
    conclusionAngles: "angles",
    conclusionVertices: "vertices",
    bottomBannerTitle: "Time to Practice Polygons!",
    bottomBannerDesc: "Test your skills with challenging exercises on polygon identification, perimeter calculations, regular polygons, and diagonals.",
    startExercisesBtn: "Start Exercises",
    polygonNames: {
      3: { title: 'Triangle', desc: 'The simplest polygon with 3 sides, 3 angles, and 3 vertices.' },
      4: { title: 'Quadrilateral', desc: 'Polygon with 4 sides, 4 angles, and 4 vertices.' },
      5: { title: 'Pentagon', desc: 'Polygon with 5 sides, 5 angles, and 5 vertices.' },
      6: { title: 'Hexagon', desc: 'Polygon with 6 sides, 6 angles, and 6 vertices.' },
      7: { title: 'Heptagon', desc: 'Polygon with 7 sides, 7 angles, and 7 vertices.' },
      8: { title: 'Octagon', desc: 'Polygon with 8 sides, 8 angles, and 8 vertices.' }
    },
    letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  }
};

export default function PoligonaTheoryPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = dictionary[locale];

  const [sides, setSides] = useState(5);

  const cx = 240;
  const cy = 135;
  const radiusVariations = [1.1, 0.78, 1.18, 0.85, 1.12, 0.72, 1.05, 0.88];
  const baseRadius = 80;

  const pointsArray = [];
  for (let i = 0; i < sides; i++) {
    const angleRad = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const currentRadius = baseRadius * radiusVariations[i];
    const x = Math.round(cx + currentRadius * Math.cos(angleRad));
    const y = Math.round(cy + currentRadius * Math.sin(angleRad));
    pointsArray.push({ x, y });
  }

  const pointsString = pointsArray.map((p) => `${p.x},${p.y}`).join(' ');
  const currentPolygon = t.polygonNames[sides];

  // Υπολογισμός διαγωνίων: d = [n · (n - 3)] / 2
  const diagonalsCount = (sides * (sides - 3)) / 2;

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/e-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/22-poligona-ask"
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
              <span>{toCleanUppercase(t.badge)}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight break-words [overflow-wrap:anywhere]">
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
              href="/e-dimotikou/22-poligona-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base whitespace-nowrap"
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
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step1Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step1Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step1Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step1Desc}
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <div>
                    <strong>{t.step1SidesLabel}</strong> {t.step1SidesDesc}
                  </div>
                  <div>
                    <strong>{t.step1VerticesLabel}</strong> {t.step1VerticesDesc}
                  </div>
                  <div>
                    <strong>{t.step1AnglesLabel}</strong> {t.step1AnglesDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium leading-relaxed">
                💡 <strong>{t.step1GoldenRule}</strong>
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step2Tag)}
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
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>3 {t.step2SidesCount} ➔ <strong>{t.step2Triangle}</strong></span>
                    <span className="text-slate-500">{t.step2TriangleNote}</span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>4 {t.step2SidesCount} ➔ <strong>{t.step2Quadrilateral}</strong></span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>5 {t.step2SidesCount} ➔ <strong>{t.step2Pentagon}</strong></span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>6 {t.step2SidesCount} ➔ <strong>{t.step2Hexagon}</strong></span>
                  </div>
                  <div className="flex justify-between p-1 bg-white rounded-md border border-slate-200">
                    <span>8 {t.step2SidesCount} ➔ <strong>{t.step2Octagon}</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium leading-relaxed">
                ⚡ {t.step2Warning}
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step3Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step3Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step3Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step3Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
                    • <strong>{t.step3RegularTitle}</strong> {t.step3RegularDesc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • <strong>{t.step3IrregularTitle}</strong> {t.step3IrregularDesc}
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium leading-relaxed">
                🎯 {t.step3Tip}
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6 min-w-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    {toCleanUppercase(t.step4Tag)}
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">{t.step4Category}</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  {t.step4Title}
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  {t.step4Desc}
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>{t.step4DiagonalTitle}</strong> {t.step4DiagonalDesc}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    • <strong>{t.step4PerimeterTitle}</strong> {t.step4PerimeterDesc}
                  </div>
                </div>

                {/* Κανονική μορφή κλάσματος για τον τύπο των διαγωνίων */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold text-slate-800 text-center">
                  <span>{t.step4FormulaIntro}</span>
                  <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono">
                    <span>δ ＝</span>
                    <Fraction num="ν · (ν － 3)" den="2" size="xs" />
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium leading-relaxed">
                🔍 {t.step4Tip}
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΥΓΩΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8 min-w-0">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 {toCleanUppercase(t.labBadge)}</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 break-words [overflow-wrap:anywhere]">
              {t.labTitle}
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              {t.labDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-w-0">
            {/* Αριστερή Στήλη: Χειριστήρια & Ταυτότητα Πολυγώνου */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 min-w-0">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                {toCleanUppercase(t.controlsHeader)}
              </h4>

              {/* Stepper Πλευρών */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">{t.sidesLabel}</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {sides}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label={t.decreaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.max(3, prev - 1));
                    }}
                    disabled={sides <= 3}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="3"
                    max="8"
                    step="1"
                    value={sides}
                    onChange={(e) => setSides(Number(e.target.value))}
                    aria-label={t.sliderAria}
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label={t.increaseAria}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSides((prev) => Math.min(8, prev + 1));
                    }}
                    disabled={sides >= 8}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά επιλογής */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  {[3, 4, 5, 6, 7, 8].map((val) => (
                    <button
                      key={`btn-side-${val}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSides(val);
                      }}
                      className={`text-xs font-mono px-2.5 py-1 rounded-lg font-semibold transition ${
                        sides === val
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Πολυγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  {toCleanUppercase(t.shapeCardHeader)}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-blue-700">
                  {currentPolygon.title}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
                  {currentPolygon.desc}
                </p>

                {/* Πίνακας Στοιχείων */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    📐 {sides} {t.anglesCountLabel}
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    📏 {sides} {t.sidesCountLabel}
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                    📍 {sides} {t.verticesCountLabel}
                  </div>
                </div>

                {/* Πλήθος Διαγωνίων με κανονικό κλάσμα */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-700 space-y-1">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="whitespace-nowrap">{t.diagonalsLabel} <strong className="text-blue-700 text-sm font-black">{diagonalsCount}</strong></span>
                    <span className="text-slate-400">|</span>
                    <span className="whitespace-nowrap inline-flex items-center gap-1 font-mono">
                      <span>{t.diagonalsFormulaLabel}</span>
                      <Fraction num={`${sides} · (${sides} － 3)`} den="2" size="xs" />
                      <span>＝ {diagonalsCount}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-sans">
                    ({t.diagonalsDefinition})
                  </p>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6 min-w-0">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>{toCleanUppercase(t.canvasHeader)}</span>
                <span className="font-mono text-blue-600 font-bold">{currentPolygon.title} ({sides} {t.canvasSelected})</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[500px] aspect-[480/270] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 480 270"
                  className="w-full h-full drop-shadow-sm select-none"
                  shapeRendering="geometricPrecision"
                >
                  {/* Πολύγωνο */}
                  <polygon
                    points={pointsString}
                    className="fill-blue-500/10 stroke-blue-600 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Κορυφές & Ετικέτες */}
                  {pointsArray.map((point, idx) => {
                    const label = t.letters[idx] || String.fromCharCode(65 + idx);

                    const dx = point.x - cx;
                    const dy = point.y - cy;
                    const len = Math.sqrt(dx * dx + dy * dy) || 1;
                    const textX = point.x + (dx / len) * 18;
                    const textY = point.y + (dy / len) * 18 + 4;

                    return (
                      <g key={idx}>
                        <circle cx={point.x} cy={point.y} r={5.5} className="fill-slate-900" />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          className="font-sans text-xs font-black fill-slate-900"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.conclusionCalloutPrefix} <strong>{sides} {t.conclusionSides}</strong>, <strong>{sides} {t.conclusionAngles}</strong> {locale === 'el' ? 'και' : 'and'} <strong>{sides} {t.conclusionVertices}</strong>.
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left min-w-0">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight break-words [overflow-wrap:anywhere]">
              {t.bottomBannerTitle}
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              {t.bottomBannerDesc}
            </p>
          </div>

          <Link
            href="/e-dimotikou/22-poligona-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto whitespace-nowrap"
          >
            <span>🎯 {toCleanUppercase(t.startExercisesBtn)}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}
// pages/st-dimotikou/71-simmetria.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμού με ελληνική υποδιαστολή
function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

export default function SimmetriaTheoriaPage() {
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
  const [selectedAxisKey, setSelectedAxisKey] = useState('axis1');
  const [foldProgress, setFoldProgress] = useState(0); // 0 (ανοιχτό) έως 100 (πλήρες δίπλωμα)

  // Βοηθητική συνάρτηση παραγωγής ημικυκλίου
  const generateSemiCirclePath = (cx, cy, r, startAngle, endAngle, steps = 24) => {
    let d = `M ${cx} ${cy}`;
    for (let i = 0; i <= steps; i++) {
      const angle = startAngle + (i / steps) * (endAngle - startAngle);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += ' Z';
    return d;
  };

  // Δεδομένα σχημάτων και αξόνων με αυστηρό διαχωρισμό (κέντρο 170, 140)
  const foldingConfigs = {
    rectangle: {
      name: 'Επίμηκες Ορθογώνιο Παραλληλόγραμμο',
      // Ορθογώνιο: (75, 100) έως (265, 180) - 190 x 80 px
      axes: [
        {
          key: 'diagonal',
          label: 'Διαγώνιος (Δεν Συμπίπτει!)',
          isSymmetric: false,
          axisLine: { x1: 56, y1: 92, x2: 284, y2: 188 },
          origin: { x: 75, y: 100 },
          angleDeg: 22.83, // Math.atan2(80, 190) * 180 / Math.PI
          fixedPath: 'M 75 100 L 265 180 L 75 180 Z',
          movingPath: 'M 75 100 L 265 100 L 265 180 Z',
          explanation: '✗ ΠΡΟΣΟΧΗ: Τα δύο τρίγωνα ΔΕΝ εφαρμόζουν! Οι γωνίες εξέχουν καθαρά. Η διαγώνιος του ορθογωνίου ΔΕΝ είναι άξονας συμμετρίας.'
        },
        {
          key: 'vertical',
          label: 'Κατακόρυφη Μεσοκάθετος',
          isSymmetric: true,
          axisLine: { x1: 170, y1: 70, x2: 170, y2: 210 },
          origin: { x: 170, y: 140 },
          angleDeg: 90,
          fixedPath: 'M 170 100 L 265 100 L 265 180 L 170 180 Z',
          movingPath: 'M 170 100 L 75 100 L 75 180 L 170 180 Z',
          explanation: '✓ ΣΩΣΤΟ: Τα δύο μέρη εφαρμόζουν απόλυτα! Η κατακόρυφη μεσοκάθετος είναι άξονας συμμετρίας.'
        },
        {
          key: 'horizontal',
          label: 'Οριζόντια Μεσοκάθετος',
          isSymmetric: true,
          axisLine: { x1: 55, y1: 140, x2: 285, y2: 140 },
          origin: { x: 170, y: 140 },
          angleDeg: 0,
          fixedPath: 'M 75 140 L 265 140 L 265 180 L 75 180 Z',
          movingPath: 'M 75 140 L 265 140 L 265 100 L 75 100 Z',
          explanation: '✓ ΣΩΣΤΟ: Τα δύο μέρη εφαρμόζουν απόλυτα! Η οριζόντια μεσοκάθετος είναι άξονας συμμετρίας.'
        }
      ]
    },
    triangle: {
      name: 'Ισόπλευρο Τρίγωνο (3 Άξονες)',
      // A(170, 60), B(90, 200), C(250, 200)
      axes: [
        {
          key: 'axis1',
          label: '1η Μεσοκάθετος (από κορυφή Α)',
          isSymmetric: true,
          axisLine: { x1: 170, y1: 40, x2: 170, y2: 220 },
          origin: { x: 170, y: 60 },
          angleDeg: 90,
          fixedPath: 'M 170 60 L 250 200 L 170 200 Z',
          movingPath: 'M 170 60 L 90 200 L 170 200 Z',
          explanation: '✓ ΣΩΣΤΟ: Η μεσοκάθετος από την κορυφή Α διπλώνει το τρίγωνο σε δύο απόλυτα ίσα μισά.'
        },
        {
          key: 'axis2',
          label: '2η Μεσοκάθετος (από κορυφή Β)',
          isSymmetric: true,
          axisLine: { x1: 66, y1: 221, x2: 234, y2: 109 },
          origin: { x: 90, y: 200 },
          angleDeg: -33.69,
          fixedPath: 'M 90 200 L 250 200 L 210 130 Z',
          movingPath: 'M 90 200 L 170 60 L 210 130 Z',
          explanation: '✓ ΣΩΣΤΟ: Η μεσοκάθετος από την κορυφή Β είναι επίσης άξονας συμμετρίας.'
        },
        {
          key: 'axis3',
          label: '3η Μεσοκάθετος (από κορυφή C)',
          isSymmetric: true,
          axisLine: { x1: 274, y1: 221, x2: 106, y2: 109 },
          origin: { x: 250, y: 200 },
          angleDeg: -146.31,
          fixedPath: 'M 250 200 L 90 200 L 130 130 Z',
          movingPath: 'M 250 200 L 170 60 L 130 130 Z',
          explanation: '✓ ΣΩΣΤΟ: Η μεσοκάθετος από την κορυφή C είναι ο 3ος άξονας συμμετρίας.'
        },
        {
          key: 'wrong_line',
          label: 'Τυχαία Πλάγια Γραμμή (Μη-άξονας)',
          isSymmetric: false,
          axisLine: { x1: 130, y1: 45, x2: 190, y2: 215 },
          origin: { x: 150, y: 100 },
          angleDeg: 70.56,
          fixedPath: 'M 170 60 L 250 200 L 185 200 Z',
          movingPath: 'M 170 60 L 90 200 L 185 200 Z',
          explanation: '✗ ΠΡΟΣΟΧΗ: Αν διπλώσουμε σε τυχαία πλάγια γραμμή, τα δύο μέρη ΔΕΝ ταυτίζονται!'
        }
      ]
    },
    rhombus: {
      name: 'Ρόμβος (2 Διαγώνιοι)',
      // A(170, 60), B(255, 140), C(170, 220), D(85, 140)
      axes: [
        {
          key: 'vertical',
          label: 'Κατακόρυφη Διαγώνιος (Άξονας)',
          isSymmetric: true,
          axisLine: { x1: 170, y1: 40, x2: 170, y2: 240 },
          origin: { x: 170, y: 140 },
          angleDeg: 90,
          fixedPath: 'M 170 60 L 255 140 L 170 220 Z',
          movingPath: 'M 170 60 L 85 140 L 170 220 Z',
          explanation: '✓ ΣΩΣΤΟ: Η κατακόρυφη διαγώνιος διπλώνει τον ρόμβο σε 2 ίσα τρίγωνα.'
        },
        {
          key: 'horizontal',
          label: 'Οριζόντια Διαγώνιος (Άξονας)',
          isSymmetric: true,
          axisLine: { x1: 65, y1: 140, x2: 275, y2: 140 },
          origin: { x: 170, y: 140 },
          angleDeg: 0,
          fixedPath: 'M 85 140 L 255 140 L 170 220 Z',
          movingPath: 'M 85 140 L 255 140 L 170 60 Z',
          explanation: '✓ ΣΩΣΤΟ: Η οριζόντια διαγώνιος είναι επίσης άξονας συμμετρίας του ρόμβου!'
        },
        {
          key: 'side_mid',
          label: 'Μεσοκάθετος Πλευρών (Μη-άξονας)',
          isSymmetric: false,
          axisLine: { x1: 120, y1: 50, x2: 220, y2: 230 },
          origin: { x: 170, y: 140 },
          angleDeg: 60.9,
          fixedPath: 'M 170 60 L 255 140 L 170 220 Z',
          movingPath: 'M 170 60 L 85 140 L 170 220 Z',
          explanation: '✗ ΠΡΟΣΟΧΗ: Οι μεσοκάθετες των πλευρών στον ρόμβο ΔΕΝ είναι άξονες συμμετρίας (μόνο οι διαγώνιοι είναι)!'
        }
      ]
    },
    square: {
      name: 'Τετράγωνο (4 Άξονες)',
      // (100, 70) έως (240, 210) - 140 x 140 px
      axes: [
        {
          key: 'diagonal',
          label: 'Διαγώνιος (Εφαρμόζει Απόλυτα!)',
          isSymmetric: true,
          axisLine: { x1: 85, y1: 55, x2: 255, y2: 225 },
          origin: { x: 100, y: 70 },
          angleDeg: 45,
          fixedPath: 'M 100 70 L 240 210 L 100 210 Z',
          movingPath: 'M 100 70 L 240 70 L 240 210 Z',
          explanation: '✓ ΣΩΣΤΟ: Σε αντίθεση με το ορθογώνιο, στο τετράγωνο η διαγώνιος ΕΙΝΑΙ άξονας συμμετρίας!'
        },
        {
          key: 'vertical',
          label: 'Κατακόρυφη Μεσοκάθετος',
          isSymmetric: true,
          axisLine: { x1: 170, y1: 45, x2: 170, y2: 235 },
          origin: { x: 170, y: 140 },
          angleDeg: 90,
          fixedPath: 'M 170 70 L 240 70 L 240 210 L 170 210 Z',
          movingPath: 'M 170 70 L 100 70 L 100 210 L 170 210 Z',
          explanation: '✓ ΣΩΣΤΟ: Η κατακόρυφη μεσοκάθετος διπλώνει το τετράγωνο σε δύο ίσα μέρη.'
        }
      ]
    },
    circle: {
      name: 'Κύκλος (Άπειροι Άξονες)',
      // Κέντρο (170, 140), R = 75
      axes: [
        {
          key: 'vertical',
          label: 'Κατακόρυφη Διάμετρος',
          isSymmetric: true,
          axisLine: { x1: 170, y1: 45, x2: 170, y2: 235 },
          origin: { x: 170, y: 140 },
          angleDeg: 90,
          fixedPath: generateSemiCirclePath(170, 140, 75, -Math.PI / 2, Math.PI / 2),
          movingPath: generateSemiCirclePath(170, 140, 75, Math.PI / 2, (3 * Math.PI) / 2),
          explanation: '✓ ΣΩΣΤΟ: Η κατακόρυφη διάμετρος διπλώνει τον κύκλο σε δύο απόλυτα ίσα ημικύκλια.'
        },
        {
          key: 'horizontal',
          label: 'Οριζόντια Διάμετρος',
          isSymmetric: true,
          axisLine: { x1: 75, y1: 140, x2: 265, y2: 140 },
          origin: { x: 170, y: 140 },
          angleDeg: 0,
          fixedPath: generateSemiCirclePath(170, 140, 75, 0, Math.PI),
          movingPath: generateSemiCirclePath(170, 140, 75, Math.PI, 2 * Math.PI),
          explanation: '✓ ΣΩΣΤΟ: Η οριζόντια διάμετρος είναι επίσης τέλειος άξονας συμμετρίας.'
        },
        {
          key: 'diag45',
          label: 'Πλάγια Διάμετρος 45°',
          isSymmetric: true,
          axisLine: { x1: 117, y1: 193, x2: 223, y2: 87 },
          origin: { x: 170, y: 140 },
          angleDeg: -45,
          fixedPath: generateSemiCirclePath(170, 140, 75, -Math.PI / 4, (3 * Math.PI) / 4),
          movingPath: generateSemiCirclePath(170, 140, 75, (3 * Math.PI) / 4, (7 * Math.PI) / 4),
          explanation: '✓ ΣΩΣΤΟ: Κάθε πλάγια διάμετρος είναι άξονας συμμετρίας.'
        },
        {
          key: 'diag135',
          label: 'Πλάγια Διάμετρος 135°',
          isSymmetric: true,
          axisLine: { x1: 117, y1: 87, x2: 223, y2: 193 },
          origin: { x: 170, y: 140 },
          angleDeg: 45,
          fixedPath: generateSemiCirclePath(170, 140, 75, Math.PI / 4, (5 * Math.PI) / 4),
          movingPath: generateSemiCirclePath(170, 140, 75, (5 * Math.PI) / 4, (9 * Math.PI) / 4),
          explanation: '✓ ΣΩΣΤΟ: Ο κύκλος έχει άπειρους άξονες συμμετρίας (κάθε ευθεία που περνά από το κέντρο του)!'
        }
      ]
    }
  };

  const currentConfig = foldingConfigs[foldingShape] || foldingConfigs.rectangle;
  const currentAxis =
    currentConfig.axes.find((a) => a.key === selectedAxisKey) || currentConfig.axes[0];

  // Υπολογισμός γωνίας αναδίπλωσης: 0° έως 180°
  const foldAngleDeg = (foldProgress / 100) * 180;

  return (
    <Layout
      title="Αξονική Συμμετρία &amp; Άξονας Συμμετρίας - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι η αξονική συμμετρία, πώς βρίσκουμε συμμετρικά σημεία και πόσους άξονες συμμετρίας έχουν τα γεωμετρικά σχήματα με διαδραστικά εργαστήρια αναδίπλωσης SVG."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/71-simmetria-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 71 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Αξονική Συμμετρία • Ο Άξονας Συμμετρίας
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τη μαγεία της αρμονίας και της ισορροπίας στη φύση και τη γεωμετρία! 
              Μαθαίνουμε πότε δύο σχήματα είναι <strong>συμμετρικά ως προς άξονα</strong>, πώς λειτουργεί η 
              <strong> κάθετη απόσταση</strong> από τον καθρέφτη της γεωμετρίας και βλέπουμε ζωντανά πώς <strong>διπλώνει</strong> κάθε σχήμα πάνω στον άξονά του.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Συμμετρικά Σημεία, Εργαστήριο Αναδίπλωσης (Folding) &amp; SVG</span>
            </div>
            <Link
              href="/st-dimotikou/71-simmetria-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Η Αξονική Συμμετρία σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την έννοια της αναδίπλωσης μέχρι τις μαθηματικές ιδιότητες των συμμετρικών σχημάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Έννοια</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι ο Άξονας Συμμετρίας;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Άξονας συμμετρίας</strong> ενός σχήματος ονομάζεται μια ευθεία γραμμή (ε) η οποία χωρίζει το σχήμα 
                  σε δύο ακριβώς ίσα μέρη, τέτοια ώστε αν <strong>διπλώσουμε</strong> το χαρτί κατά μήκος της:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="font-bold text-slate-800">
                    • Τα δύο μέρη εφαρμόζουν απόλυτα το ένα πάνω στο άλλο!
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Ένα σχήμα μπορεί να έχει <strong>έναν</strong>, <strong>περισσότερους</strong> ή και <strong>κανέναν</strong> άξονα συμμετρίας.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Σκεφτείτε τον άξονα συμμετρίας σαν έναν καθρέφτη: ό,τι υπάρχει στα αριστερά, αντικατοπτρίζεται ακριβώς στα δεξιά.
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συμμετρικά Σημεία ως προς Ευθεία
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Δύο σημεία Α και Α' είναι <strong>συμμετρικά ως προς ευθεία (ε)</strong> όταν ισχύουν ταυτόχρονα δύο κανόνες:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-amber-950 font-bold">
                    1. Το τμήμα ΑΑ' είναι ΚΑΘΕΤΟ στον άξονα (γωνία 90°).
                  </div>
                  <div className="text-amber-950 font-bold">
                    2. Τα σημεία Α και Α' ισαπέχουν από τον άξονα (απόσταση d₁ ＝ d₂).
                  </div>
                  <p className="text-[11px] text-slate-600 font-sans pt-1">
                    Δηλαδή, ο άξονας συμμετρίας είναι η <strong>μεσοκάθετος</strong> του ευθύγραμμου τμήματος ΑΑ'!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν ένα σημείο βρίσκεται ακριβώς πάνω στον άξονα συμμετρίας, τότε το συμμετρικό του είναι το ίδιο το σημείο!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πολύγωνα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Άξονες σε Γνωστά Σχήματα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το πλήθος των αξόνων συμμετρίας εξαρτάται από τις συμμετρίες του σχήματος:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>• <strong>Ισοσκελές τρίγωνο:</strong> 1 άξονας</div>
                  <div className="text-indigo-900 font-bold">• <strong>Ισόπλευρο τρίγωνο:</strong> 3 άξονες</div>
                  <div>• <strong>Ορθογώνιο:</strong> 2 άξονες (οι μεσοκάθετες)</div>
                  <div className="text-emerald-800 font-bold">• <strong>Τετράγωνο:</strong> 4 άξονες</div>
                  <div>• <strong>Ρόμβος:</strong> 2 άξονες (οι διαγώνιοι)</div>
                  <div className="text-purple-800 font-bold">• <strong>Κύκλος:</strong> Άπειροι άξονες</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Κάθε <strong>κανονικό ν-γωνο</strong> έχει ακριβώς <strong>ν άξονες συμμετρίας</strong>!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διατήρηση Μηκών &amp; Γωνιών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η αξονική συμμετρία είναι μια γεωμετρική μετακίνηση που διατηρεί ακέραιες όλες τις μετρήσεις:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    • <strong>Ίσα μήκη:</strong> Το συμμετρικό ενός ευθύγραμμου τμήματος είναι ίσο με το αρχικό.
                  </div>
                  <div>
                    • <strong>Ίσες γωνίες:</strong> Οι γωνίες δεν μεταβάλλονται καθόλου.
                  </div>
                  <div>
                    • <strong>Ίσα εμβαδά &amp; περίμετροι:</strong> Δύο συμμετρικά σχήματα είναι απολύτως <strong>ίσα μεταξύ τους</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Το συμμετρικό σχήμα αλλάζει μόνο προσανατολισμό (κατοπτρικό είδωλο), όχι μέγεθος!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: SVG ΚΑΘΡΕΦΤΙΣΜΟΣ ΣΗΜΕΙΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικός Καθρεφτισμός Σημείου σε Άξονα Συμμετρίας (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τους ρυθμιστές για να αλλάξεις τη θέση του σημείου Α. Παρατήρησε πώς το συμμετρικό σημείο Α' κινείται αυτόματα ώστε η απόσταση από τον άξονα να είναι πάντα ίση:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια & Μετρήσεις (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΟΡΙΖΟΝΤΙΑ ΘΕΣΗ ΣΗΜΕΙΟΥ Α (X):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {pointX} px
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
                  <span>ΚΑΤΑΚΟΡΥΦΗ ΘΕΣΗ (Y):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {pointY} px
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
                  <span className="text-emerald-950">Απόσταση Α από τον Άξονα:</span>
                  <span className="font-mono text-base text-emerald-700">{distanceFromAxis} px</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-emerald-950">Απόσταση Α' από τον Άξονα:</span>
                  <span className="font-mono text-base text-emerald-700">{distanceFromAxis} px</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 text-[11px] text-slate-600">
                  ✓ Το ευθύγραμμο τμήμα ΑΑ' τέμνει τον κατακόρυφο άξονα κάθετα και διχοτομείται από αυτόν.
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
                  Άξονας (ε)
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
                  d ＝ {distanceFromAxis}
                </text>
                <text x={(mirroredX + axisX) / 2} y={pointY + 16} fill="#c084fc" fontSize="10" textAnchor="middle">
                  d ＝ {distanceFromAxis}
                </text>
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                Το γαλάζιο σημείο Α και το μωβ σημείο Α' ισαπέχουν πάντα από τον κίτρινο διακεκομμένο άξονα.
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΔΙΠΛΩΣΗ ΣΧΗΜΑΤΟΣ (FOLDING LAB ME 3D ROTATION) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΔΙΠΛΩΣΗ (FOLDING)</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δίπλωσε το Σχήμα στον Άξονα και Δες αν Ταυτίζεται!
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε γεωμετρικό σχήμα και άξονα αναδίπλωσης. Σύρε την μπάρα αναδίπλωσης για να διπλώσεις το χαρτί κατά μήκος του άξονα:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Χειριστήρια Επιλογής & Slider Αναδίπλωσης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Επιλογή Σχήματος */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  1. ΕΠΙΛΟΓΗ ΣΧΗΜΑΤΟΣ:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'rectangle', label: 'Ορθογώνιο' },
                    { id: 'triangle', label: 'Τρίγωνο' },
                    { id: 'rhombus', label: 'Ρόμβος' },
                    { id: 'square', label: 'Τετράγωνο' },
                    { id: 'circle', label: 'Κύκλος' }
                  ].map((s) => (
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
                  2. ΕΠΙΛΟΓΗ ΑΞΟΝΑ ΑΝΑΔΙΠΛΩΣΗΣ:
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
                        {ax.isSymmetric ? 'Άξονας' : 'Όχι Άξονας'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Αναδίπλωσης (0% έως 100%) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΝΑΔΙΠΛΩΣΗ (ΔΙΠΛΩΜΑ):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {foldProgress}%
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
                  <span>0% (Ανοιχτό)</span>
                  <span>50% (Δίπλωμα)</span>
                  <span>100% (Πλήρες Δίπλωμα)</span>
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
                  <span>
                    👉 Σύρε την μπάρα στο <strong>100%</strong> για να ολοκληρωθεί το δίπλωμα και να ελέγξεις αν εφαρμόζουν τα δύο μέρη!
                  </span>
                ) : (
                  <span>{currentAxis.explanation}</span>
                )}
              </div>
            </div>

            {/* SVG Visualizer Αναδίπλωσης (7 στήλες) με καθαρή περιστροφή γύρω από τον άξονα */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[380px] p-4 sm:p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 340 280"
                className="w-full max-w-[340px] sm:max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* 1. Σταθερό μέρος του σχήματος (γαλάζιο) */}
                <path
                  d={currentAxis.fixedPath}
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. Αναδιπλούμενο μέρος του σχήματος (μωβ):
                    Περιστρέφεται ακριβώς γύρω από τη γραμμή τσάκισης (άξονας) */}
                <g
                  style={{
                    transformOrigin: `${currentAxis.origin.x}px ${currentAxis.origin.y}px`,
                    transform: `
                      rotate(${currentAxis.angleDeg}deg)
                      rotateY(${foldAngleDeg}deg)
                      rotate(-${currentAxis.angleDeg}deg)
                    `,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.05s ease-out'
                  }}
                >
                  <path
                    d={currentAxis.movingPath}
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
                </g>

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
                    Αρχικό Ανοιχτό Σχήμα (0%)
                  </text>
                )}
                {foldProgress > 0 && foldProgress < 100 && (
                  <text x="170" y="260" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Αναδίπλωση σε εξέλιξη ({foldProgress}%)...
                  </text>
                )}
                {foldProgress === 100 && currentAxis.isSymmetric && (
                  <text x="170" y="260" fill="#34d399" fontSize="13" fontWeight="black" textAnchor="middle">
                    ✓ Τέλεια Εφαρμογή! Άξονας Συμμετρίας.
                  </text>
                )}
                {foldProgress === 100 && !currentAxis.isSymmetric && (
                  <text x="170" y="260" fill="#f59e0b" fontSize="13" fontWeight="black" textAnchor="middle">
                    ✗ Δεν εφαρμόζουν! Περισσεύουν γωνίες.
                  </text>
                )}
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                Το γαλάζιο μισό μένει σταθερό και το μωβ διπλώνει κατά μήκος του κίτρινου άξονα.
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Αξονική Συμμετρία
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των ιδιοτήτων της συμμετρίας σε γεωμετρικές κατασκευές.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΑΠΟΣΤΑΣΗ ΣΗΜΕΙΩΝ
                </span>
                <span className="text-xs font-bold text-slate-400">Ισαπέχοντα Σημεία</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Συνολικής Απόστασης Συμμετρικών Σημείων
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα σημείο Α απέχει από έναν κατακόρυφο άξονα συμμετρίας (ε) απόσταση <strong>4,5 cm</strong>. 
                Πόσο απέχει το συμμετρικό του σημείο Α' από τον άξονα και πόση είναι η συνολική απόσταση μεταξύ των δύο σημείων (ΑΑ');
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Απόσταση Α</span> 4,5 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ιδιότητα</span> Ίση απόσταση
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τμήμα ΑΑ'</span> 2 · 4,5 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Απόσταση Α' από τον άξονα:</strong> Ίση με του Α, δηλαδή <strong>4,5 cm</strong>.</div>
                  <div>• <strong>Συνολική απόσταση ΑΑ':</strong> 4,5 cm ＋ 4,5 cm ＝ <strong>9 cm</strong> (ή 2 · 4,5 cm ＝ <strong className="text-blue-700">9 cm</strong>).</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Ο άξονας συμμετρίας περνάει ακριβώς από το μέσο του ευθύγραμμου τμήματος ΑΑ'.
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΣΥΜΜΕΤΡΙΑ ΤΡΙΓΩΝΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Διατήρηση Μεγεθών</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Περίμετρος και Εμβαδόν Συμμετρικού Τριγώνου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα ορθογώνιο τρίγωνο έχει πλευρές <strong>3 cm</strong>, <strong>4 cm</strong> και <strong>5 cm</strong>, και εμβαδόν <strong>6 cm²</strong>. 
                Κατασκευάζουμε το συμμετρικό του τρίγωνο ως προς έναν άξονα (ε). Ποια θα είναι η περίμετρος και το εμβαδόν του νέου τριγώνου;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλευρές</span> 3, 4, 5 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Περίμετρος</span> 3 ＋ 4 ＋ 5 ＝ 12 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εμβαδόν</span> 6 cm²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Η αξονική συμμετρία διατηρεί τα μήκη των πλευρών: οι νέες πλευρές είναι πάλι 3 cm, 4 cm και 5 cm.</div>
                  <div>• <strong>Νέα περίμετρος:</strong> 3 ＋ 4 ＋ 5 ＝ <strong className="text-amber-700">12 cm</strong>.</div>
                  <div>• <strong>Νέο εμβαδόν:</strong> Παραμένει απολύτως ίσο, δηλαδή <strong className="text-amber-700">6 cm²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                ⚡ Δύο συμμετρικά σχήματα είναι απολύτως ίσα μεταξύ τους σε όλα τα μεγέθη (μήκη, γωνίες, περίμετρο και εμβαδόν)!
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
                {toCleanUppercase('Προσοχη / Συνηθη Λαθη που πρεπει να Αποφευγετε')}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed list-disc list-inside">
                <li>
                  <strong>Οι διαγώνιοι του ορθογωνίου ΔΕΝ είναι άξονες συμμετρίας:</strong> Όπως αποδείξατε στο Εργαστήριο Αναδίπλωσης, αν διπλώσουμε το επίμηκες ορθογώνιο στη διαγώνιό του, τα δύο τρίγωνα εξέχουν έντονα και δεν ταυτίζονται! Οι μοναδικοί 2 άξονες συμμετρίας του ορθογωνίου είναι οι μεσοκάθετες των πλευρών του.
                </li>
                <li>
                  <strong>Το πλάγιο παραλληλόγραμμο δεν έχει κανέναν άξονα συμμετρίας:</strong> Έχει κεντρική συμμετρία, αλλά κανέναν άξονα αναδίπλωσης.
                </li>
                <li>
                  <strong>Η απόσταση μετριέται πάντα κάθετα:</strong> Το συμμετρικό σημείο βρίσκεται πάνω στην ευθεία που σχηματίζει αυστηρά γωνία <strong>90°</strong> με τον άξονα.
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Αξονική Συμμετρία!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με άξονες συμμετρίας, καθρεφτισμούς σημείων και γεωμετρικά σχήματα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/71-simmetria-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

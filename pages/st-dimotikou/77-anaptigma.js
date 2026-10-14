// pages/st-dimotikou/77-anaptigma.js
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

export default function AnaptigmaTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Ισομετρική Αναδίπλωση Αναπτύγματος (3D Forward Kinematics)
  // -------------------------------------------------------------------------
  const [selectedShape, setSelectedShape] = useState('cube'); // 'cube' ή 'cuboid'
  const [foldProgress, setFoldProgress] = useState(0); // 0 (επίπεδο) έως 100 (κλειστό 3D)

  // Διαστάσεις 3D για το animation
  const shapeDims = useMemo(() => {
    if (selectedShape === 'cube') {
      return { L: 55, W: 55, H: 55 };
    }
    return { L: 70, W: 45, H: 55 };
  }, [selectedShape]);

  // Μετατροπή 3D συντεταγμένων σε 2D ισομετρική προβολή SVG
  const project3Dto2D = (x, y, z) => {
    const originX = 180;
    const originY = 135;
    const cos30 = 0.866;
    const sin30 = 0.5;

    const screenX = originX + (x - y) * cos30;
    const screenY = originY + (x + y) * sin30 - z;
    return `${screenX.toFixed(1)},${screenY.toFixed(1)}`;
  };

  // Γωνία διπλώματος θ: από 0 rad (0°) έως π/2 rad (90°)
  const theta = (foldProgress / 100) * (Math.PI / 2);
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  // Δημιουργία των 6 εδρών με απόλυτη γεωμετρική ακρίβεια
  const faces = useMemo(() => {
    const { L, W, H } = shapeDims;

    // 1. ΒΑΣΗ (Μπλε - σταθερή στο Z = 0, x από 0 έως L, y από 0 έως W)
    const basePts = [
      project3Dto2D(0, 0, 0),
      project3Dto2D(L, 0, 0),
      project3Dto2D(L, W, 0),
      project3Dto2D(0, W, 0)
    ].join(' ');

    // 2. ΕΜΠΡΟΣΘΙΑ ΕΔΡΑ (Πορτοκαλί - συνδεδεμένη στην ακμή y = W)
    // Στο θ = 0: y από W έως W + H, z = 0.
    // Καθώς σηκώνεται: y = W + H*cosT, z = H*sinT.
    const frontEdgeP1 = { x: 0, y: W + H * cosT, z: H * sinT };
    const frontEdgeP2 = { x: L, y: W + H * cosT, z: H * sinT };

    const frontPts = [
      project3Dto2D(0, W, 0),
      project3Dto2D(L, W, 0),
      project3Dto2D(frontEdgeP2.x, frontEdgeP2.y, frontEdgeP2.z),
      project3Dto2D(frontEdgeP1.x, frontEdgeP1.y, frontEdgeP1.z)
    ].join(' ');

    // 3. ΟΠΙΣΘΙΑ ΕΔΡΑ (Πράσινη - συνδεδεμένη στην ακμή y = 0)
    // Στο θ = 0: y από 0 έως -H, z = 0.
    // Καθώς σηκώνεται: y = -H*cosT, z = H*sinT.
    const backPts = [
      project3Dto2D(0, 0, 0),
      project3Dto2D(L, 0, 0),
      project3Dto2D(L, -H * cosT, H * sinT),
      project3Dto2D(0, -H * cosT, H * sinT)
    ].join(' ');

    // 4. ΔΕΞΙΑ ΕΔΡΑ (Μωβ - συνδεδεμένη στην ακμή x = L)
    // Στο θ = 0: x από L έως L + H, z = 0.
    // Καθώς σηκώνεται: x = L + H*cosT, z = H*sinT.
    const rightPts = [
      project3Dto2D(L, 0, 0),
      project3Dto2D(L + H * cosT, 0, H * sinT),
      project3Dto2D(L + H * cosT, W, H * sinT),
      project3Dto2D(L, W, 0)
    ].join(' ');

    // 5. ΑΡΙΣΤΕΡΗ ΕΔΡΑ (Indigo - συνδεδεμένη στην ακμή x = 0)
    // Στο θ = 0: x από 0 έως -H, z = 0.
    // Καθώς σηκώνεται: x = -H*cosT, z = H*sinT.
    const leftPts = [
      project3Dto2D(0, 0, 0),
      project3Dto2D(-H * cosT, 0, H * sinT),
      project3Dto2D(-H * cosT, W, H * sinT),
      project3Dto2D(0, W, 0)
    ].join(' ');

    // 6. ΚΑΠΑΚΙ (Κόκκινο - συνδεδεμένο στην άκρη της εμπρόσθιας έδρας)
    // Πλάτος καπακιού = W.
    // Συνολική γωνία ως προς το οριζόντιο επίπεδο = 2*θ (περιστρέφεται κατά θ ως προς την πορτοκαλί έδρα).
    // Στο θ = 0 (0%): cos(0) = 1, sin(0) = 0 => y = W + H + W, z = 0 (ΠΛΗΡΩΣ ΕΠΙΠΕΔΟ ΑΝΑΠΤΥΓΜΑ!)
    // Στο θ = π/2 (100%): cos(π) = -1, sin(π) = 0 => y = W - W = 0, z = H + 0 = H (ΚΛΕΙΝΕΙ ΤΕΛΕΙΑ ΑΠΟ ΠΑΝΩ!)
    const lidEndP1 = {
      x: 0,
      y: W + H * cosT + W * Math.cos(2 * theta),
      z: H * sinT + W * Math.sin(2 * theta)
    };
    const lidEndP2 = {
      x: L,
      y: W + H * cosT + W * Math.cos(2 * theta),
      z: H * sinT + W * Math.sin(2 * theta)
    };

    const lidPts = [
      project3Dto2D(frontEdgeP1.x, frontEdgeP1.y, frontEdgeP1.z),
      project3Dto2D(frontEdgeP2.x, frontEdgeP2.y, frontEdgeP2.z),
      project3Dto2D(lidEndP2.x, lidEndP2.y, lidEndP2.z),
      project3Dto2D(lidEndP1.x, lidEndP1.y, lidEndP1.z)
    ].join(' ');

    return { basePts, frontPts, backPts, rightPts, leftPts, lidPts };
  }, [shapeDims, theta, cosT, sinT]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Ολικής Επιφάνειας Αναπτύγματος
  // -------------------------------------------------------------------------
  const [dimA, setDimA] = useState(6); // Μήκος (cm)
  const [dimB, setDimB] = useState(4); // Πλάτος (cm)
  const [dimC, setDimC] = useState(5); // Ύψος (cm)

  const faceArea1 = useMemo(() => dimA * dimB, [dimA, dimB]);
  const faceArea2 = useMemo(() => dimB * dimC, [dimB, dimC]);
  const faceArea3 = useMemo(() => dimA * dimC, [dimA, dimC]);

  const totalSurfaceAreaCm2 = useMemo(() => {
    return 2 * (faceArea1 + faceArea2 + faceArea3);
  }, [faceArea1, faceArea2, faceArea3]);

  const totalSurfaceAreaDm2 = useMemo(() => totalSurfaceAreaCm2 / 100, [totalSurfaceAreaCm2]);
  const totalSurfaceAreaM2 = useMemo(() => totalSurfaceAreaCm2 / 10000, [totalSurfaceAreaCm2]);

  return (
    <Layout
      title="Αναπτύγματα Κύβου &amp; Ορθογωνίου Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι οι έδρες, οι ακμές και τα αναπτύγματα του κύβου και του ορθογωνίου παραλληλεπιπέδου, πώς διπλώνουν σε 3D και πώς υπολογίζουμε την ολική επιφάνεια."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/77-anaptigma-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 77 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Γεωμετρικά Στερεά &amp; Αναπτύγματα • Κύβος &amp; Ορθογώνιο Παραλληλεπίπεδο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς ένα τρισδιάστατο κουτί ξεδιπλώνεται σε μία επίπεδη επιφάνεια από χαρτόνι, 
              γνωρίζουμε τα βασικά στοιχεία των στερεών (<strong>έδρες, ακμές, κορυφές</strong>), 
              εξερευνούμε τα <strong>αναπτύγματα</strong> του κύβου και υπολογίζουμε το <strong>ολικό εμβαδόν</strong> της επιφάνειάς τους!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Έδρες, Ακμές, Κορυφές, Διαδραστικό Δίπλωμα (Folding) &amp; SVG</span>
            </div>
            <Link
              href="/st-dimotikou/77-anaptigma-ask"
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
              Τα Αναπτύγματα Στερεών σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τη δομή των γεωμετρικών στερεών μέχρι το ξεδίπλωμα και τον υπολογισμό επιφάνειας.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Στοιχεία Στερεών</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Έδρες, Ακμές &amp; Κορυφές
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν ακριβώς:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-bold">
                    • 6 Έδρες (οι επιφάνειες που το περιβάλλουν)
                  </div>
                  <div className="text-indigo-950 font-bold">
                    • 12 Ακμές (τα ευθύγραμμα τμήματα όπου ενώνονται οι έδρες)
                  </div>
                  <div className="text-indigo-950 font-bold">
                    • 8 Κορυφές (τα γωνιακά σημεία όπου συναντώνται 3 ακμές)
                  </div>
                  <div className="text-[11px] text-slate-600 font-sans pt-1 border-t border-slate-200">
                    <strong>Κύβος:</strong> Και οι 6 έδρες είναι ίσα τετράγωνα.<br />
                    <strong>Ορθογώνιο Παραλληλεπίπεδο:</strong> Οι έδρες είναι ορθογώνια παραλληλόγραμμα (ανά 2 απέναντι είναι ίσες).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο κύβος είναι μια ειδική περίπτωση ορθογωνίου παραλληλεπιπέδου με όλες τις ακμές του ίσες!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι το Ανάπτυγμα;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Ανάπτυγμα</strong> ενός στερεού είναι το επίπεδο γεωμετρικό σχήμα που προκύπτει αν:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div>
                    1. «Κόψουμε» κατάλληλα κάποιες ακμές του στερεού.
                  </div>
                  <div>
                    2. «Ανοίξουμε» όλες τις έδρες του ώστε να ακουμπούν επίπεδα πάνω σε ένα τραπέζι.
                  </div>
                  <div className="text-amber-950 font-bold pt-1 border-t border-slate-200">
                    Αν διπλώσουμε το ανάπτυγμα στις κοινές ακμές των εδρών, επανασυναρμολογούμε ακριβώς το αρχικό κουτί!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Όλες οι 6 έδρες του αναπτύγματος πρέπει να παραμένουν συνδεδεμένες, χωρίς να επικαλύπτονται όταν διπλώνουν!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνες Ελέγχου</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πότε ένα Σχήμα Είναι Ανάπτυγμα;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για τον κύβο υπάρχουν ακριβώς <strong>11 διαφορετικά δυνατά αναπτύγματα</strong> (π.χ. σχήμα σταυρού ή Τ):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-rose-900 font-bold">
                    ✗ ΔΕΝ είναι ανάπτυγμα αν:
                  </div>
                  <div>• Έχει 5 ή 6 τετράγωνα στην ίδια ευθεία γραμμή.</div>
                  <div>• Περιέχει 4 τετράγωνα σε μπλοκ 2 × 2 (τετράγωνο από τετράγωνα).</div>
                  <div>• Οι απέναντι βάσεις βρίσκονται στην ίδια πλευρά της κεντρικής λωρίδας.</div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ένας πρακτικός τρόπος: Φανταστείτε ποια έδρα είναι η βάση (κάτω) και «σηκώστε» νοερά τις πλαϊνές έδρες γύρω της!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ολική Επιφάνεια</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εμβαδόν Αναπτύγματος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το εμβαδόν του αναπτύγματος ισούται με την <strong>ολική επιφάνεια</strong> του στερεού (άθροισμα των 6 εδρών):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Κύβος με ακμή α:</strong><br />
                    Κάθε έδρα έχει εμβαδόν α². Άρα:<br />
                    <strong>Εολ ＝ 6 · α²</strong>
                  </div>
                  <div>
                    • <strong>Ορθογώνιο με ακμές α, β, γ:</strong><br />
                    Έχει 3 ζεύγη ίσων εδρών. Άρα:<br />
                    <strong>Εολ ＝ 2 · (α · β ＋ β · γ ＋ α · γ)</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Το εμβαδόν του χαρτονιού που απαιτείται για να φτιάξουμε ένα κουτί ισούται ακριβώς με το εμβαδόν του αναπτύγματός του!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΙΣΟΜΕΤΡΙΚΟ ΔΙΠΛΩΜΑ ΑΝΑΠΤΥΓΜΑΤΟΣ ΣΕ 3D ΣΤΕΡΕΟ (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Δίπλωμα Αναπτύγματος σε 3D Κουτί (SVG)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε γεωμετρικό στερεό (Κύβος ή Ορθογώνιο Παραλληλεπίπεδο) και σύρε την μπάρα για να δεις πώς το επίπεδο ανάπτυγμα διπλώνει τις 6 έδρες του σχηματίζοντας το κλειστό τρισδιάστατο κουτί:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Επιλογή & Slider (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  1. ΕΠΙΛΟΓΗ ΣΤΕΡΕΟΥ:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedShape('cube');
                      setFoldProgress(0);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      selectedShape === 'cube'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    🎲 Κύβος (6 ίσα τετράγωνα)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedShape('cuboid');
                      setFoldProgress(0);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      selectedShape === 'cuboid'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    📦 Ορθογώνιο Παραλληλεπίπεδο
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΑΝΑΔΙΠΛΩΣΗ ΕΔΡΩΝ (ΔΙΠΛΩΜΑ):</span>
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
                  <span>0% (Επίπεδο Ανάπτυγμα)</span>
                  <span>50% (Δίπλωμα)</span>
                  <span>100% (Κλειστό 3D Στερεό)</span>
                </div>
              </div>

              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2 text-xs sm:text-sm">
                <div className="font-bold text-sky-950">
                  {foldProgress === 0 && '🔷 Στάδιο 0: Επίπεδο ανάπτυγμα σταυρού με και τις 6 έδρες εντελώς απλωμένες.'}
                  {foldProgress > 0 && foldProgress < 100 && '🔄 Οι 4 πλαϊνές έδρες σηκώνονται κάθετα γύρω από τη βάση και το καπάκι διπλώνει...'}
                  {foldProgress === 100 && '🟩 Στάδιο 100%: Όλες οι ακμές συναντήθηκαν απόλυτα! Το 3D κουτί έκλεισε.'}
                </div>
                <div className="text-slate-600 text-[11px] font-mono pt-1 border-t border-sky-200/60">
                  6 Έδρες • 12 Ακμές • 8 Κορυφές
                </div>
              </div>
            </div>

            {/* SVG Visualizer Ισομετρικής Προβολής (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[350px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 380 270"
                className="w-full max-w-[380px] sm:max-w-[440px] h-auto select-none overflow-visible"
              >
                {/* 1. ΒΑΣΗ (Μπλε - σταθερή) */}
                <polygon
                  points={faces.basePts}
                  fill="rgba(56, 189, 248, 0.45)"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* 2. ΠΙΣΩ ΕΔΡΑ (Πράσινη) */}
                <polygon
                  points={faces.backPts}
                  fill="rgba(52, 211, 153, 0.4)"
                  stroke="#34d399"
                  strokeWidth="2"
                />

                {/* 3. ΑΡΙΣΤΕΡΗ ΕΔΡΑ (Indigo) */}
                <polygon
                  points={faces.leftPts}
                  fill="rgba(129, 140, 248, 0.4)"
                  stroke="#818cf8"
                  strokeWidth="2"
                />

                {/* 4. ΔΕΞΙΑ ΕΔΡΑ (Μωβ) */}
                <polygon
                  points={faces.rightPts}
                  fill="rgba(168, 85, 247, 0.4)"
                  stroke="#c084fc"
                  strokeWidth="2"
                />

                {/* 5. ΕΜΠΡΟΣΘΙΑ ΕΔΡΑ (Πορτοκαλί) */}
                <polygon
                  points={faces.frontPts}
                  fill="rgba(245, 158, 11, 0.45)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />

                {/* 6. ΚΑΠΑΚΙ (Κόκκινο - απλώνει επίπεδα στο 0% και κλείνει οριζόντια στο 100%) */}
                <polygon
                  points={faces.lidPts}
                  fill="rgba(244, 63, 94, 0.45)"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
              </svg>

              <div className="mt-3 text-center text-xs text-slate-400">
                {foldProgress === 100
                  ? '✓ Το τρισδιάστατο κουτί έκλεισε με 6 έδρες, 12 ακμές και 8 κορυφές!'
                  : 'Όλες οι έδρες παραμένουν απόλυτα ενωμένες κατά το δίπλωμα.'}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΟΛΙΚΗΣ ΕΠΙΦΑΝΕΙΑΣ ΑΝΑΠΤΥΓΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΜΒΑΔΟΥ ΑΝΑΠΤΥΓΜΑΤΟΣ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Υπολογισμός Εμβαδού Χαρτονιού (Ολική Επιφάνεια)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε τις διαστάσεις του κουτιού (μήκος α, πλάτος β, ύψος γ) για να υπολογίσεις το εμβαδόν των 6 εδρών του και το συνολικό χαρτόνι που απαιτείται:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

            {/* Sliders Διαστάσεων (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΜΗΚΟΣ (α):</span>
                  <span className="font-mono text-base font-black text-indigo-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimA} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={dimA}
                  onChange={(e) => setDimA(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΠΛΑΤΟΣ (β):</span>
                  <span className="font-mono text-base font-black text-sky-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimB} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={dimB}
                  onChange={(e) => setDimB(Number(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-800">
                  <span>ΥΨΟΣ (γ):</span>
                  <span className="font-mono text-base font-black text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {dimC} cm
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={20}
                  step={1}
                  value={dimC}
                  onChange={(e) => setDimC(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 font-mono space-y-1">
                <div>• 2 έδρες (α · β): 2 · ({dimA} · {dimB}) ＝ {2 * faceArea1} cm²</div>
                <div>• 2 έδρες (β · γ): 2 · ({dimB} · {dimC}) ＝ {2 * faceArea2} cm²</div>
                <div>• 2 έδρες (α · γ): 2 · ({dimA} · {dimC}) ＝ {2 * faceArea3} cm²</div>
              </div>
            </div>

            {/* Αποτελέσματα Ολικής Επιφάνειας (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-3">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΟΛΙΚΟ ΕΜΒΑΔΟΝ ΑΝΑΠΤΥΓΜΑΤΟΣ (6 ΕΔΡΕΣ)
              </span>

              <div className="text-center py-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {formatNum(totalSurfaceAreaCm2)} cm²
                </span>
                <span className="text-xs text-slate-400 block mt-1 font-sans">
                  Συνολικό εμβαδόν χαρτονιού για την κατασκευή του κουτιού
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs sm:text-sm pt-2 border-t border-slate-800">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε dm² (: 100):</span>
                  <span className="text-amber-400 font-black text-base">{formatNum(totalSurfaceAreaDm2)} dm²</span>
                </div>
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                  <span className="text-slate-400 font-sans text-xs block">Σε m² (: 10.000):</span>
                  <span className="text-purple-400 font-black text-base">{formatNum(totalSurfaceAreaM2)} m²</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 Αν όλες οι ακμές ήταν ίσες ({dimA} cm), θα είχαμε κύβο με Εολ ＝ 6 · {dimA}² ＝ {6 * dimA * dimA} cm²!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Αναπτύγματα &amp; Επιφάνειες
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές του εμβαδού αναπτύγματος σε κουτιά δώρων και κατασκευές.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΚΟΥΤΙ ΔΩΡΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Ορθογώνιο Παραλληλεπίπεδο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Χαρτιού Περιτυλίγματος για Κουτί
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα κουτί δώρου σε σχήμα ορθογωνίου παραλληλεπιπέδου έχει μήκος <strong>20 cm</strong>, πλάτος <strong>15 cm</strong> και ύψος <strong>10 cm</strong>. 
                Πόσα τετραγωνικά εκατοστόμετρα (cm²) χαρτιού περιτυλίγματος χρειάζονται κατ' ελάχιστο για να καλυφθούν και οι 6 έδρες του;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μήκος (α)</span> 20 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλάτος (β)</span> 15 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ύψος (γ)</span> 10 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>2 έδρες βάσεων (20 · 15):</strong> 2 · 300 ＝ <strong>600 cm²</strong>.</div>
                  <div>• <strong>2 πλαϊνές έδρες (15 · 10):</strong> 2 · 150 ＝ <strong>300 cm²</strong>.</div>
                  <div>• <strong>2 εμπρός/πίσω έδρες (20 · 10):</strong> 2 · 200 ＝ <strong>400 cm²</strong>.</div>
                  <div>• <strong>Ολικό εμβαδόν αναπτύγματος:</strong> 600 ＋ 300 ＋ 400 ＝ <strong className="text-blue-700">1.300 cm²</strong> (ή 13 dm²).</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Το ορθογώνιο παραλληλεπίπεδο έχει 3 ζεύγη ίσων εδρών, άρα υπολογίζουμε τα 3 επιμέρους εμβαδά και τα διπλασιάζουμε!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΚΑΤΑΣΚΕΥΗ ΚΥΒΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Ε ＝ 6 · α²</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Χαρτονιού για Κύβο
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας μαθητής θέλει να φτιάξει ένα ζάρι σε σχήμα κύβου με μήκος ακμής <strong>8 cm</strong>. 
                Πόσο χαρτόνι σε cm² θα καταλαμβάνει το ανάπτυγμα του κύβου;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ακμή κύβου (α)</span> 8 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλήθος εδρών</span> 6 ίσα τετράγωνα
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τύπος</span> Εολ ＝ 6 · α²
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Εμβαδόν 1 έδρας (τετράγωνο):</strong> α² ＝ 8 · 8 ＝ <strong>64 cm²</strong>.</div>
                  <div>• <strong>Ολική επιφάνεια 6 εδρών:</strong> 6 · 64 ＝ <strong className="text-amber-700">384 cm²</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Στον κύβο και οι 6 έδρες είναι απολύτως ίσες μεταξύ τους, άρα πολλαπλασιάζουμε το εμβαδόν της μίας έδρας επί 6!
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
                  <strong>Δεν είναι κάθε διάταξη 6 τετραγώνων ανάπτυγμα κύβου:</strong> Αν 4 τετράγωνα σχηματίζουν ένα μεγάλο τετράγωνο (μπλοκ 2 × 2) ή αν 5 τετράγωνα είναι στη σειρά, το σχήμα δεν διπλώνει σε κύβο γιατί κάποιες έδρες θα επικαλυφθούν.
                </li>
                <li>
                  <strong>Μην μπερδεύετε τις ακμές με τις κορυφές:</strong> Τόσο ο κύβος όσο και το ορθογώνιο παραλληλεπίπεδο έχουν <strong>12 ακμές</strong> (γραμμές) και <strong>8 κορυφές</strong> (σημεία/γωνίες).
                </li>
                <li>
                  <strong>Στο ορθογώνιο παραλληλεπίπεδο οι απέναντι έδρες είναι ίσες:</strong> Δεν έχουν και οι 6 έδρες το ίδιο μέγεθος (εκτός αν είναι κύβος). Υπάρχουν 3 ζεύγη ίσων εδρών (βάσεις, πλαϊνές, εμπρός/πίσω).
                </li>
                <li>
                  <strong>Προσοχή στις μονάδες επιφάνειας:</strong> Όπως σε κάθε εμβαδόν, το εμβαδόν του αναπτύγματος μετριέται σε τετραγωνικές μονάδες (cm², dm², m²), ενώ τα μήκη των ακμών σε απλές μονάδες μήκους (cm, m).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Αναπτύγματα Στερεών!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με έδρες, ακμές, κορυφές, αναπτύγματα κύβου και ολική επιφάνεια για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/77-anaptigma-ask"
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

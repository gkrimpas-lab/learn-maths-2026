// pages/st-dimotikou/78-akmes-korifes.js
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

export default function AkmesKorifesTheoriaPage() {
  // -------------------------------------------------------------------------
  // Εργαστήριο 1: Διαδραστική Εξερεύνηση Στοιχείων (Έδρες, Ακμές, Κορυφές)
  // -------------------------------------------------------------------------
  const [selectedShape, setSelectedShape] = useState('cube'); // 'cube' ή 'cuboid'
  const [highlightMode, setHighlightMode] = useState('edges'); // 'faces', 'edges', 'vertices', 'all'

  // Ισομετρικές συντεταγμένες κορυφών
  // 8 κορυφές: 4 κάτω βάσης (0..3) και 4 πάνω βάσης (4..7)
  const cubeCoords = useMemo(() => {
    if (selectedShape === 'cube') {
      return {
        // Κάτω βάση
        v0: { x: 120, y: 150 }, // εμπρός-αριστερά
        v1: { x: 190, y: 185 }, // εμπρός-δεξιά
        v2: { x: 260, y: 150 }, // πίσω-δεξιά
        v3: { x: 190, y: 115 }, // πίσω-αριστερά (κρυφή)
        // Πάνω βάση (z offset: -80px)
        v4: { x: 120, y: 70 },
        v5: { x: 190, y: 105 },
        v6: { x: 260, y: 70 },
        v7: { x: 190, y: 35 }
      };
    }
    // Ορθογώνιο Παραλληλεπίπεδο
    return {
      v0: { x: 95, y: 155 },
      v1: { x: 195, y: 190 },
      v2: { x: 285, y: 145 },
      v3: { x: 185, y: 110 },
      v4: { x: 95, y: 85 },
      v5: { x: 195, y: 120 },
      v6: { x: 285, y: 75 },
      v7: { x: 185, y: 40 }
    };
  }, [selectedShape]);

  // -------------------------------------------------------------------------
  // Εργαστήριο 2: Δυναμικός Υπολογιστής Συνολικού Μήκους Ακμών (Σκελετός)
  // -------------------------------------------------------------------------
  const [dimA, setDimA] = useState(10); // Μήκος σε cm
  const [dimB, setDimB] = useState(6); // Πλάτος σε cm
  const [dimC, setDimC] = useState(5); // Ύψος σε cm

  const totalEdgesCube = useMemo(() => 12 * dimA, [dimA]);
  const totalEdgesCuboid = useMemo(() => 4 * dimA + 4 * dimB + 4 * dimC, [dimA, dimB, dimC]);

  return (
    <Layout
      title="Ακμές &amp; Κορυφές Κύβου &amp; Ορθογωνίου Παραλληλεπιπέδου - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι οι ακμές και οι κορυφές του κύβου και του ορθογωνίου παραλληλεπιπέδου, τον τύπο του Euler και πώς υπολογίζουμε το συνολικό μήκος ακμών."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/78-akmes-korifes-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 78 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ακμές &amp; Κορυφές • Κύβος &amp; Ορθογώνιο Παραλληλεπίπεδο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξερευνούμε τη στερεομετρική δομή των βασικών πολυέδρων! 
              Μαθαίνουμε τι είναι οι <strong>12 ακμές</strong> και οι <strong>8 κορυφές</strong>, 
              ανακαλύπτουμε τη μαγική σχέση του Euler (<strong>Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2</strong>) 
              και υπολογίζουμε με ακρίβεια το <strong>συνολικό μήκος του σκελετού</strong> ενός κουτιού.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, 12 Ακμές, 8 Κορυφές, Τύπος του Euler &amp; Διαδραστικά Εργαστήρια</span>
            </div>
            <Link
              href="/st-dimotikou/78-akmes-korifes-ask"
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
              Ακμές &amp; Κορυφές σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την αναγνώριση των στοιχείων μέχρι τους υπολογισμούς συρμάτινων σκελετών.
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
                  Τι είναι οι Ακμές;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Ακμή</strong> ονομάζεται το <strong>ευθύγραμμο τμήμα</strong> όπου ενώνονται δύο γειτονικές έδρες ενός στερεού:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-indigo-950 font-bold">
                    • Πλήθος: Πάντοτε 12 Ακμές
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    • <strong>Στον κύβο:</strong> Και οι 12 ακμές είναι απολύτως <strong>ίσες</strong> μεταξύ τους (μήκος α).<br />
                    • <strong>Στο ορθογώνιο:</strong> Οι 12 ακμές χωρίζονται σε <strong>3 ομάδες των τεσσάρων</strong> (4 μήκη, 4 πλάτη, 4 ύψη).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Σκεφτείτε τις ακμές σαν τα ξυλάκια ή τα καλαμάκια που σχηματίζουν το σκελετό ενός κουτιού!
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Έννοια</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι οι Κορυφές;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Κορυφή</strong> ονομάζεται το <strong>γωνιακό σημείο</strong> όπου συναντώνται τρεις ακμές του στερεού:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div className="text-amber-950 font-bold">
                    • Πλήθος: Πάντοτε 8 Κορυφές
                  </div>
                  <div className="text-slate-700 text-xs font-sans">
                    • 4 κορυφές βρίσκονται στην <strong>πάνω βάση</strong>.<br />
                    • 4 κορυφές βρίσκονται στην <strong>κάτω βάση</strong>.<br />
                    • Σε κάθε κορυφή σχηματίζεται μια τρισδιάστατη στερεά γωνία.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Σκεφτείτε τις κορυφές σαν τα μπαλάκια πλαστελίνης που ενώνουν τα καλαμάκια στις γωνίες!
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ο Νόμος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Μαγικός Τύπος του Euler
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε όλα τα κυρτά πολύεδρα (κύβους, πρίσματα, πυραμίδες), ισχύει πάντοτε η εξής μαθηματική σχέση:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 text-center font-mono">
                  <div className="text-indigo-950 font-black text-sm sm:text-base">
                    Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2
                  </div>
                  <div className="text-slate-700 text-xs font-sans text-left pt-1">
                    <strong>Επαλήθευση στον Κύβο &amp; στο Παραλληλεπίπεδο:</strong><br />
                    Έδρες ＝ 6, Κορυφές ＝ 8, Ακμές ＝ 12<br />
                    6 ＋ 8 ＝ 14 &nbsp;και&nbsp; 12 ＋ 2 ＝ <strong>14</strong> (Ισχύει απόλυτα!).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ο τύπος του Euler είναι ένα από τα πιο διάσημα θεωρήματα στην ιστορία της γεωμετρίας!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Υπολογισμοί</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συνολικό Μήκος Ακμών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πώς υπολογίζουμε το σύρμα ή το πηχάκι που χρειάζεται για να φτιάξουμε τον σκελετό ενός κουτιού:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Κύβος με ακμή α:</strong><br />
                    Έχει 12 ίσες ακμές:<br />
                    <strong>Μήκος ＝ 12 · α</strong>
                  </div>
                  <div>
                    • <strong>Ορθογώνιο με ακμές α, β, γ:</strong><br />
                    Έχει 4 μήκη, 4 πλάτη, 4 ύψη:<br />
                    <strong>Μήκος ＝ 4 · α ＋ 4 · β ＋ 4 · γ</strong><br />
                    ή <strong>4 · (α ＋ β ＋ γ)</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Προσοχή: Το μήκος των ακμών μετριέται σε <strong>απλά μέτρα ή cm</strong> (είναι μήκος, όχι επιφάνεια)!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΟΣ ΕΞΕΡΕΥΝΗΤΗΣ ΣΤΟΙΧΕΙΩΝ ΣΕ 3D (SVG) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Εξερευνητής Στοιχείων σε 3D: Έδρες, Ακμές &amp; Κορυφές
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε γεωμετρικό στερεό και πάτησε στα κουμπιά για να φωτίσεις και να μετρήσεις τις 6 Έδρες, τις 12 Ακμές ή τις 8 Κορυφές:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Κουμπιά Επιλογής (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  1. ΕΠΙΛΟΓΗ ΣΤΕΡΕΟΥ:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedShape('cube')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      selectedShape === 'cube'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    🎲 Κύβος
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedShape('cuboid')}
                    className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      selectedShape === 'cuboid'
                        ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    📦 Παραλληλεπίπεδο
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  2. ΕΠΙΛΟΓΗ ΣΤΟΙΧΕΙΟΥ ΠΡΟΣ ΕΜΦΑΝΙΣΗ:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setHighlightMode('edges')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                      highlightMode === 'edges'
                        ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    12 Ακμές
                  </button>
                  <button
                    type="button"
                    onClick={() => setHighlightMode('vertices')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                      highlightMode === 'vertices'
                        ? 'bg-rose-500 text-white shadow-md ring-2 ring-rose-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    8 Κορυφές
                  </button>
                  <button
                    type="button"
                    onClick={() => setHighlightMode('faces')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all ${
                      highlightMode === 'faces'
                        ? 'bg-sky-500 text-white shadow-md ring-2 ring-sky-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    6 Έδρες
                  </button>
                </div>
              </div>

              {/* Κάρτα Σύνοψης */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-600">Έδρες (Ε):</span>
                  <span className={`font-mono text-base font-black ${highlightMode === 'faces' ? 'text-sky-600' : 'text-slate-800'}`}>
                    6
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-600">Κορυφές (Κ):</span>
                  <span className={`font-mono text-base font-black ${highlightMode === 'vertices' ? 'text-rose-600' : 'text-slate-800'}`}>
                    8
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-600">Ακμές (Α):</span>
                  <span className={`font-mono text-base font-black ${highlightMode === 'edges' ? 'text-amber-600' : 'text-slate-800'}`}>
                    12
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-xs font-mono text-center text-indigo-900 font-bold">
                  Έλεγχος Euler: 6 ＋ 8 ＝ 12 ＋ 2 ＝ 14 ✓
                </div>
              </div>
            </div>

            {/* SVG Visualizer (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 min-h-[320px] p-6 rounded-3xl border border-slate-800 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 360 220"
                className="w-full max-w-[360px] sm:max-w-[420px] h-auto select-none overflow-visible"
              >
                {/* 1. ΕΔΡΕΣ (Φωτίζονται όταν highlightMode === 'faces') */}
                {/* Πίσω/Κρυφές Έδρες (διαφανείς) */}
                <polygon
                  points={`${cubeCoords.v0.x},${cubeCoords.v0.y} ${cubeCoords.v1.x},${cubeCoords.v1.y} ${cubeCoords.v2.x},${cubeCoords.v2.y} ${cubeCoords.v3.x},${cubeCoords.v3.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(56, 189, 248, 0.15)'}
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <polygon
                  points={`${cubeCoords.v4.x},${cubeCoords.v4.y} ${cubeCoords.v5.x},${cubeCoords.v5.y} ${cubeCoords.v6.x},${cubeCoords.v6.y} ${cubeCoords.v7.x},${cubeCoords.v7.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(52, 211, 153, 0.5)' : 'rgba(52, 211, 153, 0.2)'}
                  stroke="#34d399"
                  strokeWidth="1.5"
                />
                {/* Εμπρόσθια Έδρα */}
                <polygon
                  points={`${cubeCoords.v0.x},${cubeCoords.v0.y} ${cubeCoords.v1.x},${cubeCoords.v1.y} ${cubeCoords.v5.x},${cubeCoords.v5.y} ${cubeCoords.v4.x},${cubeCoords.v4.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(129, 140, 248, 0.55)' : 'rgba(129, 140, 248, 0.2)'}
                  stroke="#818cf8"
                  strokeWidth="1.5"
                />
                {/* Δεξιά Έδρα */}
                <polygon
                  points={`${cubeCoords.v1.x},${cubeCoords.v1.y} ${cubeCoords.v2.x},${cubeCoords.v2.y} ${cubeCoords.v6.x},${cubeCoords.v6.y} ${cubeCoords.v5.x},${cubeCoords.v5.y}`}
                  fill={highlightMode === 'faces' ? 'rgba(168, 85, 247, 0.55)' : 'rgba(168, 85, 247, 0.2)'}
                  stroke="#c084fc"
                  strokeWidth="1.5"
                />

                {/* 2. ΑΚΜΕΣ (12 Ακμές) */}
                {/* 3 Κρυφές Ακμές (πίσω) - Διακεκομμένες */}
                <line
                  x1={cubeCoords.v3.x}
                  y1={cubeCoords.v3.y}
                  x2={cubeCoords.v0.x}
                  y2={cubeCoords.v0.y}
                  stroke={highlightMode === 'edges' ? '#f59e0b' : '#64748b'}
                  strokeWidth={highlightMode === 'edges' ? 3 : 1.5}
                  strokeDasharray="4 3"
                />
                <line
                  x1={cubeCoords.v3.x}
                  y1={cubeCoords.v3.y}
                  x2={cubeCoords.v2.x}
                  y2={cubeCoords.v2.y}
                  stroke={highlightMode === 'edges' ? '#f59e0b' : '#64748b'}
                  strokeWidth={highlightMode === 'edges' ? 3 : 1.5}
                  strokeDasharray="4 3"
                />
                <line
                  x1={cubeCoords.v3.x}
                  y1={cubeCoords.v3.y}
                  x2={cubeCoords.v7.x}
                  y2={cubeCoords.v7.y}
                  stroke={highlightMode === 'edges' ? '#f59e0b' : '#64748b'}
                  strokeWidth={highlightMode === 'edges' ? 3 : 1.5}
                  strokeDasharray="4 3"
                />

                {/* 9 Ορατές Ακμές */}
                {/* Κάτω βάση */}
                <line x1={cubeCoords.v0.x} y1={cubeCoords.v0.y} x2={cubeCoords.v1.x} y2={cubeCoords.v1.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v1.x} y1={cubeCoords.v1.y} x2={cubeCoords.v2.x} y2={cubeCoords.v2.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />

                {/* Πάνω βάση */}
                <line x1={cubeCoords.v4.x} y1={cubeCoords.v4.y} x2={cubeCoords.v5.x} y2={cubeCoords.v5.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v5.x} y1={cubeCoords.v5.y} x2={cubeCoords.v6.x} y2={cubeCoords.v6.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v6.x} y1={cubeCoords.v6.y} x2={cubeCoords.v7.x} y2={cubeCoords.v7.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v7.x} y1={cubeCoords.v7.y} x2={cubeCoords.v4.x} y2={cubeCoords.v4.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />

                {/* Κατακόρυφες ακμές ύψους */}
                <line x1={cubeCoords.v0.x} y1={cubeCoords.v0.y} x2={cubeCoords.v4.x} y2={cubeCoords.v4.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v1.x} y1={cubeCoords.v1.y} x2={cubeCoords.v5.x} y2={cubeCoords.v5.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />
                <line x1={cubeCoords.v2.x} y1={cubeCoords.v2.y} x2={cubeCoords.v6.x} y2={cubeCoords.v6.y} stroke={highlightMode === 'edges' ? '#f59e0b' : '#e2e8f0'} strokeWidth={highlightMode === 'edges' ? 3.5 : 2} />

                {/* 3. ΚΟΡΥΦΕΣ (8 Σημεία) */}
                {Object.keys(cubeCoords).map((vKey, idx) => {
                  const pt = cubeCoords[vKey];
                  const isHidden = vKey === 'v3';
                  const isSelected = highlightMode === 'vertices';

                  return (
                    <g key={vKey}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isSelected ? 6 : 4}
                        fill={isSelected ? '#f43f5e' : isHidden ? '#64748b' : '#ffffff'}
                        stroke={isSelected ? '#ffffff' : '#0f172a'}
                        strokeWidth={1.5}
                      />
                      {isSelected && (
                        <text
                          x={pt.x + (pt.x < 190 ? -10 : 10)}
                          y={pt.y + (pt.y < 100 ? -8 : 12)}
                          fill="#f43f5e"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          Κ{idx + 1}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="mt-2 text-center text-xs text-slate-400">
                {highlightMode === 'edges' && '🟡 Φωτισμένες οι 12 Ακμές (9 ορατές και 3 κρυφές διακεκομμένες πίσω).'}
                {highlightMode === 'vertices' && '🔴 Φωτισμένες οι 8 Κορυφές (4 στην κάτω βάση και 4 στην πάνω).'}
                {highlightMode === 'faces' && '🔵 Φωτισμένες οι 6 Έδρες που περικλείουν το στερεό.'}
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΣΚΕΛΕΤΟΥ (ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΑΚΜΩΝ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΣΚΕΛΕΤΟΥ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πόσο Σύρμα Χρειάζεται για τις 12 Ακμές;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε τις διαστάσεις για να υπολογίσεις το συνολικό μήκος σύρματος που απαιτείται για να κατασκευαστεί ο σκελετός του κουτιού:
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
                  max={25}
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
                  max={25}
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
                  max={25}
                  step={1}
                  value={dimC}
                  onChange={(e) => setDimC(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer touch-manipulation"
                />
              </div>
            </div>

            {/* Αποτελέσματα Σκελετού (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-900 p-5 sm:p-7 rounded-3xl border border-slate-800 text-white space-y-4">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider text-center">
                ΣΥΝΟΛΙΚΟ ΜΗΚΟΣ ΣΥΡΜΑΤΟΣ ΓΙΑ ΤΙΣ 12 ΑΚΜΕΣ
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs sm:text-sm">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-sans text-xs block">Αν ήταν Κύβος (ακμή {dimA} cm):</span>
                  <span className="text-2xl font-black text-indigo-400 block">
                    {formatNum(totalEdgesCube)} cm
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    12 ακμές · {dimA} cm ＝ {totalEdgesCube} cm
                  </span>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center space-y-1">
                  <span className="text-slate-400 font-sans text-xs block">Στο Ορθογώνιο Παραλληλεπίπεδο:</span>
                  <span className="text-2xl font-black text-emerald-400 block">
                    {formatNum(totalEdgesCuboid)} cm
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans block">
                    4 · ({dimA} ＋ {dimB} ＋ {dimC}) ＝ {totalEdgesCuboid} cm
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-center pt-1 font-sans">
                💡 Το ορθογώνιο παραλληλεπίπεδο περιλαμβάνει 4 ίσα μήκη, 4 ίσα πλάτη και 4 ίσα ύψη!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Ακμές &amp; Κορυφές
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Εφαρμογές των ιδιοτήτων των στερεών σε κατασκευές σκελετών.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΞΥΛΙΝΟΣ ΣΚΕΛΕΤΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Ορθογώνιο Παραλληλεπίπεδο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Πηχών για Σκελετό Κλουβιού
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας ξυλουργός θέλει να φτιάξει τον σκελετό ενός κλουβιού σε σχήμα ορθογωνίου παραλληλεπιπέδου. 
                Οι διαστάσεις του είναι μήκος <strong>80 cm</strong>, πλάτος <strong>50 cm</strong> και ύψος <strong>60 cm</strong>. 
                Πόσα μέτρα (m) ξύλινου πηχακίου θα χρειαστεί συνολικά για να κατασκευάσει όλες τις ακμές του;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΠΡΟΒΛΗΜΑΤΟΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">4 μήκη (α)</span> 4 · 80 cm ＝ 320 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">4 πλάτη (β)</span> 4 · 50 cm ＝ 200 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">4 ύψη (γ)</span> 4 · 60 cm ＝ 240 cm
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Άθροισμα 3 διαστάσεων:</strong> 80 ＋ 50 ＋ 60 ＝ <strong>190 cm</strong>.</div>
                  <div>• <strong>Συνολικό μήκος 12 ακμών:</strong> 4 · 190 ＝ <strong>760 cm</strong>.</div>
                  <div>• <strong>Μετατροπή σε μέτρα (: 100):</strong> 760 : 100 ＝ <strong className="text-blue-700">7,6 m</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Θυμήσου: Το ορθογώνιο παραλληλεπίπεδο έχει 12 ακμές, δηλαδή 4 ίσα μήκη, 4 ίσα πλάτη και 4 ίσα ύψη!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΣΥΡΜΑ ΚΥΒΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Κύβος (12 ίσες ακμές)</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Εύρεση Ακμής από το Συνολικό Σύρμα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας μαθητής χρησιμοποίησε ένα σύρμα συνολικού μήκους <strong>108 cm</strong> για να φτιάξει τον σκελετό ενός κύβου, χωρίς να περισσέψει καθόλου σύρμα. 
                Πόσα εκατοστόμετρα (cm) είναι το μήκος κάθε ακμής του κύβου;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΥΠΟΛΟΓΙΣΜΟΥ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold text-[11px]">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Συνολικό σύρμα</span> 108 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πλήθος ακμών κύβου</span> 12 ίσες ακμές
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Πράξη</span> 108 : 12
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Ο κύβος έχει 12 απολύτως ίσες ακμές.</div>
                  <div>• <strong>Μήκος 1 ακμής:</strong> 108 : 12 ＝ <strong className="text-amber-700">9 cm</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ Επαλήθευση: 12 ακμές · 9 cm ＝ 108 cm σύρματος!
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
                  <strong>Μην μπερδεύετε τις ακμές με τις κορυφές:</strong> Οι <strong>ακμές είναι 12</strong> (γραμμές/πλευρές), ενώ οι <strong>κορυφές είναι 8</strong> (γωνίες/σημεία).
                </li>
                <li>
                  <strong>Στο ορθογώνιο παραλληλεπίπεδο πολλαπλασιάζουμε κάθε διάσταση με το 4:</strong> Μην προσθέτετε απλώς μήκος ＋ πλάτος ＋ ύψος! Κάθε διάσταση επαναλαμβάνεται 4 φορές: <strong>4 · α ＋ 4 · β ＋ 4 · γ</strong>.
                </li>
                <li>
                  <strong>Μήκος ακμών vs Εμβαδόν επιφάνειας:</strong> Το συνολικό μήκος των ακμών μετριέται σε <strong>απλά μέτρα (m) ή cm</strong>, ενώ το εμβαδόν των εδρών σε <strong>τετραγωνικά μέτρα (m²) ή cm²</strong>.
                </li>
                <li>
                  <strong>Ο τύπος του Euler:</strong> Να θυμάστε πάντοτε ότι <strong>Έδρες ＋ Κορυφές ＝ Ακμές ＋ 2</strong> (για κύβο: 6 ＋ 8 ＝ 12 ＋ 2 ＝ 14).
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 7. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Ακμές &amp; τις Κορυφές!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 12 διαδραστικές ασκήσεις με υπολογισμούς ακμών, κορυφών, σκελετών και τον τύπο του Euler για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/78-akmes-korifes-ask"
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

// pages/e-dimotikou/26-embado-sximaton.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function EmbadoSximatonTheoryPage() {
  const [shape, setShape] = useState('square');
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);

  const unitSize = 32;
  const maxUnits = 10;

  const w = parseInt(width, 10);
  const h = shape === 'square' ? w : parseInt(height, 10);

  // Μέγεθος καμβά: 1 κελί περιθώριο αριστερά/πάνω + maxUnits + 1 κελί περιθώριο δεξιά/κάτω
  const canvasGridSize = (maxUnits + 2) * unitSize;

  const getShapeStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.25s ease',
      zIndex: 10
    };

    if (shape === 'square') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(79, 70, 229, 0.22)',
        border: '3px solid rgb(79, 70, 229)',
        clipPath: 'none'
      };
    } else if (shape === 'rectangle') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(249, 115, 22, 0.22)',
        border: '3px solid rgb(249, 115, 22)',
        clipPath: 'none'
      };
    } else if (shape === 'triangle') {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(14, 165, 233, 0.32)',
        border: '3px solid rgb(14, 165, 233)',
        clipPath: 'polygon(0 100%, 100% 100%, 0 0)'
      };
    }
    return baseStyle;
  };

  const getGhostRectangleStyle = () => {
    return {
      position: 'absolute',
      left: `${unitSize}px`,
      top: `${unitSize}px`,
      width: `${w * unitSize}px`,
      height: `${h * unitSize}px`,
      transition: 'all 0.25s ease',
      backgroundColor: 'rgba(148, 163, 184, 0.08)',
      border: '2px dashed rgb(148, 163, 184)',
      zIndex: 5
    };
  };

  return (
    <Layout
      title="Εμβαδόν Σχημάτων - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε πώς υπολογίζουμε το εμβαδόν τετραγώνου, ορθογωνίου και ορθογώνιου τριγώνου, δείτε γιατί το τρίγωνο είναι το μισό του ορθογωνίου και πειραματιστείτε με τον διαδραστικό καμβά."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/26-embado-sximaton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πλήρους εύρους για 2K & 4K και responsive για κινητά */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 26 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Εμβαδόν Βασικών Σχημάτων
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Συγκρίνουμε το εμβαδόν του τετραγώνου, του ορθογωνίου και του ορθογώνιου τριγώνου. Ανακαλύπτουμε οπτικά γιατί το τρίγωνο είναι ακριβώς το μισό του αντίστοιχου ορθογωνίου και μαθαίνουμε τους τύπους υπολογισμού.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικό Πλέγμα Σχημάτων</span>
            </div>
            <Link
              href="/e-dimotikou/26-embado-sximaton-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 2xl:px-7 2xl:py-3.5 rounded-xl shadow-md transition active:scale-95 text-sm 2xl:text-base"
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
              Βασικές Έννοιες σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Οι μαθηματικοί τύποι υπολογισμού επιφάνειας και η σύνδεση μεταξύ των σχημάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Τετράγωνο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εμβαδόν Τετραγώνου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στο τετράγωνο όλες οι πλευρές είναι ίσες (α). Πολλαπλασιάζουμε την πλευρά με τον εαυτό της:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-indigo-950 shadow-inner">
                    Εμβαδόν ＝ Πλευρά · Πλευρά &nbsp; ( Ε ＝ α · α )
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    π.χ. Για πλευρά α ＝ 5 cm: Ε ＝ 5 · 5 ＝ <strong>25 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                💡 Το τετράγωνο είναι ένα ειδικό ορθογώνιο όπου το μήκος ισούται με το πλάτος!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορθογώνιο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εμβαδόν Ορθογωνίου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Το ορθογώνιο έχει μήκος (α) και πλάτος (β). Πολλαπλασιάζουμε τις δύο διαστάσεις:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-amber-950 shadow-inner">
                    Εμβαδόν ＝ Μήκος · Πλάτος &nbsp; ( Ε ＝ α · β )
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    π.χ. Για μήκος 7 cm και πλάτος 4 cm: Ε ＝ 7 · 4 ＝ <strong>28 cm²</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν γνωρίζουμε το εμβαδόν και το μήκος, βρίσκουμε το πλάτος διαιρώντας: <strong>β ＝ Ε ： α</strong>.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορθογώνιο Τρίγωνο</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Τρίγωνο είναι το Μισό!
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν φέρουμε τη διαγώνιο σε ένα ορθογώνιο, το χωρίζουμε σε <strong>δύο ίσα ορθογώνια τρίγωνα</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-sky-950 shadow-inner">
                    Εμβαδόν Τριγώνου ＝ ( Βάση · Ύψος ) ： 2
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Γι' αυτό ακριβώς τον λόγο στον τύπο του τριγώνου διαιρούμε πάντοτε <strong>διά 2</strong>!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                🎯 Στο ορθογώνιο τρίγωνο, οι δύο κάθετες πλευρές παίζουν τον ρόλο της βάσης και του ύψους.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Σύνθετα Σχήματα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μέθοδος Τεμαχισμού
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν έχουμε ένα σύνθετο πολύγωνο (π.χ. σχήμα L, σπιτάκι):
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                    1. Το <strong>χωρίζουμε</strong> σε απλά σχήματα (ορθογώνια, τετράγωνα, τρίγωνα).
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                    2. Βρίσκουμε το εμβαδόν κάθε επιμέρους σχήματος.
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                    3. <strong>Προσθέτουμε</strong> τα επιμέρους εμβαδά για το συνολικό αποτέλεσμα.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Πάντα ελέγχουμε τις μονάδες μέτρησης (cm² ή m²) ώστε να είναι ομοιογενείς!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΜΒΑΔΟΥ ΣΧΗΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Καμβάς &amp; Πλέγμα Σχημάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε γεωμετρικό σχήμα και άλλαξε τις διαστάσεις του. Παρατήρησε πώς το εμβαδόν ξεκινάει από την κόκκινη τελεία και κουμπώνει τέλεια πάνω στα τετραγωνάκια του πλέγματος.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Υπολογισμοί */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Επιλογή Σχήματος */}
                <div>
                  <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase mb-3">
                    1. ΕΠΙΛΟΓΗ ΓΕΩΜΕΤΡΙΚΟΥ ΣΧΗΜΑΤΟΣ
                  </h4>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShape('square')}
                      className={`p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs text-center ${
                        shape === 'square'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      🟩 Τετράγωνο
                    </button>
                    <button
                      type="button"
                      onClick={() => setShape('rectangle')}
                      className={`p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs text-center ${
                        shape === 'rectangle'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      🟧 Ορθογώνιο
                    </button>
                    <button
                      type="button"
                      onClick={() => setShape('triangle')}
                      className={`p-3 rounded-2xl font-bold text-xs sm:text-sm transition active:scale-95 shadow-xs text-center ${
                        shape === 'triangle'
                          ? 'bg-sky-600 text-white shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      📐 Ορθ. Τρίγωνο
                    </button>
                  </div>
                </div>

                {/* Steppers Διαστάσεων */}
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase">
                    2. ΔΙΑΣΤΑΣΕΙΣ ( ΣΕ cm )
                  </h4>

                  {/* Μήκος / Βάση / Πλευρά */}
                  <div className="space-y-1.5">
                    <div className="h-7 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
                      <span>{shape === 'square' ? 'Πλευρά ( α ):' : 'Μήκος / Βάση ( α ):'}</span>
                      <span className="font-mono font-black text-base text-blue-600">{w} cm</span>
                    </div>

                    <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                      <button
                        type="button"
                        aria-label="Μείωση μήκους κατά 1 cm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setWidth((prev) => Math.max(2, prev - 1));
                        }}
                        disabled={width <= 2}
                        className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                      >
                        －
                      </button>

                      <input
                        type="range"
                        min="2"
                        max={maxUnits}
                        step="1"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        aria-label="Μήκος σχήματος"
                        className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                      />

                      <button
                        type="button"
                        aria-label="Αύξηση μήκους κατά 1 cm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setWidth((prev) => Math.min(maxUnits, prev + 1));
                        }}
                        disabled={width >= maxUnits}
                        className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                      >
                        ＋
                      </button>
                    </div>
                  </div>

                  {/* Πλάτος / Ύψος (μόνο για ορθογώνιο και τρίγωνο) */}
                  {shape !== 'square' && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="h-7 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
                        <span>Πλάτος / Ύψος ( β ):</span>
                        <span className="font-mono font-black text-base text-blue-600">{h} cm</span>
                      </div>

                      <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                        <button
                          type="button"
                          aria-label="Μείωση πλάτους κατά 1 cm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setHeight((prev) => Math.max(2, prev - 1));
                          }}
                          disabled={height <= 2}
                          className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                        >
                          －
                        </button>

                        <input
                          type="range"
                          min="2"
                          max={maxUnits}
                          step="1"
                          value={height}
                          onChange={(e) => setHeight(Number(e.target.value))}
                          aria-label="Πλάτος σχήματος"
                          className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                        />

                        <button
                          type="button"
                          aria-label="Αύξηση πλάτους κατά 1 cm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setHeight((prev) => Math.min(maxUnits, prev + 1));
                          }}
                          disabled={height >= maxUnits}
                          className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Κάρτα Υπολογισμού Εμβαδού */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-200 space-y-2.5 shadow-xs text-center">
                {shape === 'square' && (
                  <>
                    <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                      ΕΜΒΑΔΟΝ ΤΕΤΡΑΓΩΝΟΥ
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
                      Ε ＝ {w} · {w} ＝ {w * w} cm²
                    </div>
                    <p className="text-xs text-slate-600">
                      Πολλαπλασιάζουμε την πλευρά επί τον εαυτό της: <strong>Ε ＝ α · α</strong>.
                    </p>
                  </>
                )}

                {shape === 'rectangle' && (
                  <>
                    <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider block">
                      ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-amber-700">
                      Ε ＝ {w} · {h} ＝ {w * h} cm²
                    </div>
                    <p className="text-xs text-slate-600">
                      Πολλαπλασιάζουμε το μήκος με το πλάτος: <strong>Ε ＝ α · β</strong>.
                    </p>
                  </>
                )}

                {shape === 'triangle' && (
                  <>
                    <span className="text-[11px] font-black text-sky-800 uppercase tracking-wider block">
                      ΕΜΒΑΔΟΝ ΟΡΘΟΓΩΝΙΟΥ ΤΡΙΓΩΝΟΥ
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-sky-700">
                      Ε ＝ ( {w} · {h} ) ： 2 ＝ {((w * h) / 2).toLocaleString('el-GR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} cm²
                    </div>
                    <p className="text-xs text-slate-600">
                      Το τρίγωνο είναι ακριβώς το μισό του ορθογωνίου: <strong>Ε ＝ ( α · β ) ： 2</strong>.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive Οπτικοποίηση Πλέγματος με Κόκκινη Τελεία Αφετηρίας */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΟΠΤΙΚΟ ΠΛΕΓΜΑ</span>
                <span className="font-mono text-blue-600 font-bold">1 κουτάκι ＝ 1 cm²</span>
              </div>

              {/* Πλέγμα Canvas με Κόκκινη Τελεία Αφετηρίας */}
              <div className="w-full flex items-center justify-center overflow-x-auto py-2">
                <div
                  className="border-2 border-slate-300 relative bg-white rounded-2xl shadow-inner"
                  style={{
                    width: `${canvasGridSize}px`,
                    height: `${canvasGridSize}px`,
                    backgroundImage:
                      'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                    backgroundSize: `${unitSize}px ${unitSize}px`
                  }}
                >
                  {/* Περίγραμμα του αντίστοιχου ορθογωνίου για το τρίγωνο */}
                  {shape === 'triangle' && <div style={getGhostRectangleStyle()} />}

                  {/* Το επιλεγμένο γεωμετρικό σχήμα */}
                  <div style={getShapeStyle()} />

                  {/* 🔴 Κόκκινη Τελεία Αφετηρίας στο 1ο Τετράγωνο (top-left) */}
                  <div
                    style={{
                      position: 'absolute',
                      left: `${unitSize + 8}px`,
                      top: `${unitSize + 8}px`,
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#ef4444',
                      borderRadius: '50%',
                      zIndex: 20,
                      boxShadow: '0 0 4px rgba(239, 68, 68, 0.6)'
                    }}
                    title="Αφετηρία μέτρησης τετραγώνων (1ο κουτάκι)"
                  />
                </div>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                🔴 Η <strong>κόκκινη τελεία</strong> δείχνει το πρώτο κουτάκι (1 cm²) από όπου ξεκινά η καταμέτρηση των τετραγώνων!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Εμβαδόν Σχημάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού εμβαδού τετραγώνου, ορθογωνίου, τριγώνων και σύνθετων πολυγώνων.
            </p>
          </div>

          <Link
            href="/e-dimotikou/26-embado-sximaton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

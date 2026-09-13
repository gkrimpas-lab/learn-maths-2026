// pages/e-dimotikou/24-perimetros.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function PerimetrosTheoryPage() {
  // Πρόοδος απλώματος πλευρών από 0 έως 100
  const [progress, setProgress] = useState(0);

  // Γεωμετρικές σταθερές πλευρών
  const sidesData = [
    { id: 0, label: 'α', lengthCm: 6, px: 60, color: 'stroke-cyan-500', fill: 'bg-cyan-500' },
    { id: 1, label: 'β', lengthCm: 5, px: 50, color: 'stroke-indigo-500', fill: 'bg-indigo-500' },
    { id: 2, label: 'γ', lengthCm: 7, px: 70, color: 'stroke-purple-500', fill: 'bg-purple-500' },
    { id: 3, label: 'δ', lengthCm: 4, px: 40, color: 'stroke-amber-500', fill: 'bg-amber-500' }
  ];

  const totalPerimetrosCm = 22;
  const totalLengthPx = 220;
  const startX = 110; // Αφετηρία χάρακα
  const groundY = 210; // Ύψος χάρακα

  // Συντεταγμένες κλειστού τετραπλεύρου
  const pA = { x: 160, y: 60 };
  const pB = { x: 280, y: 60 };
  const pΓ = { x: 250, y: 130 };
  const pΔ = { x: 140, y: 120 };

  // Υπολογισμός θέσης κάθε πλευράς κατά το άπλωμα
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

  // Τρέχον απλωμένο μήκος
  const getCurrentUnfoldedLength = () => {
    if (progress === 0) return '0,0';
    if (progress <= 25) return (6 * (progress / 25)).toLocaleString('el-GR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (progress <= 50) return (6 + 5 * ((progress - 25) / 25)).toLocaleString('el-GR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    if (progress <= 75) return (11 + 7 * ((progress - 50) / 25)).toLocaleString('el-GR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return (18 + 4 * ((progress - 75) / 25)).toLocaleString('el-GR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <Layout
      title="Περίμετρος Σχημάτων - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι η περίμετρος, πώς υπολογίζεται σε τρίγωνα, τετράγωνα, ορθογώνια και σύνθετα σχήματα, και δοκιμάστε το διαδραστικό εργαστήριο απλώματος πλευρών."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/24-perimetros-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 24 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Περίμετρος των Σχημάτων
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι σημαίνει περίμετρος ενός γεωμετρικού σχήματος, πώς απλώνονται οι πλευρές του σε μία ενιαία ευθεία γραμμή, τους βασικούς μαθηματικούς τύπους για γρήγορο υπολογισμό και πώς τη χρησιμοποιούμε στην περίφραξη χωραφιών και οικοπέδων.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανός Προσομοιωτής Απλώματος Πλευρών</span>
            </div>
            <Link
              href="/e-dimotikou/24-perimetros-ask"
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
              Η θεμελιώδης έννοια της περιμέτρου, οι κανόνες και οι πρακτικές εφαρμογές.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Περίμετρος;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Περίμετρος (Π)</strong> ενός επίπεδου γεωμετρικού σχήματος είναι το συνολικό μήκος του περιγράμματός του.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-blue-950 shadow-inner">
                    Περίμετρος ＝ α ＋ β ＋ γ ＋ δ ...
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Για να τη βρούμε, προσθέτουμε τα μήκη όλων των εξωτερικών πλευρών του σχήματος, σαν να απλώνουμε ένα σχοινί γύρω-γύρω.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η περίμετρος είναι <strong>μήκος</strong> και μετριέται σε μονάδες μήκους: mm, cm, dm, m, km (όχι τετραγωνικά μέτρα!).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Τύποι</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τύποι Βασικών Σχημάτων
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για σχήματα με ίσες πλευρές χρησιμοποιούμε συντομότερους τύπους:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>Τετράγωνο:</strong> Π ＝ 4 · α
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>Ορθογώνιο:</strong> Π ＝ 2 · ( α ＋ β )
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>Ισόπλευρο τρίγωνο:</strong> Π ＝ 3 · α
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    • <strong>Κανονικό πολύγωνο (ν):</strong> Π ＝ ν · α
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Αντίστροφα, σε ένα τετράγωνο με περίμετρο Π, η πλευρά του είναι: <strong>α ＝ Π ： 4</strong>.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Προσοχή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ομοιογένεια Μονάδων
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Πριν προσθέσουμε τις πλευρές, πρέπει <strong>όλες οι διαστάσεις να είναι στην ίδια μονάδα μέτρησης</strong>:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-mono">
                    π.χ. Μήκος 2 m και πλάτος 60 cm:<br />
                    Μετατρέπουμε: 60 cm ＝ 0,6 m<br />
                    Π ＝ 2 · ( 2 ＋ 0,6 ) ＝ 2 · 2,6 ＝ <strong>5,2 m</strong>
                  </div>
                  <p className="text-slate-600 text-xs font-sans">
                    Δεν προσθέτουμε ποτέ απευθείας μέτρα με εκατοστά ή χιλιοστά!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Πάντα πρώτα η <strong>μετατροπή μονάδων</strong> και μετά η πρόσθεση!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογές</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Περίφραξη &amp; Κόστος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η περίμετρος είναι απαραίτητη σε καθημερινά προβλήματα κατασκευών:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Συρματόπλεγμα:</strong> Μήκος σύρματος ＝ Περίμετρος · Σειρές σύρματος.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    • <strong>Συνολικό Κόστος:</strong> Περίμετρος · Τιμή ανά μέτρο ( € ).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Αν σε ένα οικόπεδο αφήσουμε πόρτα 3 m, αφαιρούμε τα 3 m από την περίμετρο πριν αγοράσουμε σύρμα!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΕΡΙΜΕΤΡΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Προσομοίωση Απλώματος Πλευρών σε Ευθεία
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον δρομέα για να δεις πώς οι 4 πλευρές του τετραπλεύρου ξεκολλούν, ευθυγραμμίζονται και προστίθενται μία-μία πάνω στον χάρακα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΠΡΟΟΔΟΣ ΑΠΛΩΜΑΤΟΣ ΠΛΕΥΡΩΝ
              </h4>

              {/* Stepper Προόδου */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Πρόοδος Απλώματος:</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {progress}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση προόδου κατά 5%"
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
                    aria-label="Πρόοδος απλώματος πλευρών"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση προόδου κατά 5%"
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
                    🔄 Κλειστό Σχήμα (0%)
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
                    🎯 Πλήρες Άπλωμα (100%)
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
                  ΑΘΡΟΙΣΜΑ ΜΗΚΩΝ ΠΛΕΥΡΩΝ
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black font-mono ${
                    progress === 100 ? 'text-emerald-700' : 'text-slate-800'
                  }`}
                >
                  {progress === 100
                    ? `Περίμετρος ＝ 6 ＋ 5 ＋ 7 ＋ 4 ＝ ${totalPerimetrosCm} cm`
                    : `Τρέχον μήκος: ${getCurrentUnfoldedLength()} cm`}
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
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΧΑΡΑΚΑΣ)</span>
                <span className="font-mono text-blue-600 font-bold">
                  {progress === 100 ? `Περίμετρος: ${totalPerimetrosCm} cm` : `Άπλωμα: ${progress}%`}
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
                    className="stroke-slate-300 stroke-[2] stroke-dasharray-3"
                    strokeDasharray="4 4"
                  />

                  {/* 2. Σταθερό αχνό περίγραμμα σχήματος */}
                  <polygon
                    points={`${pA.x},${pA.y} ${pB.x},${pB.y} ${pΓ.x},${pΓ.y} ${pΔ.x},${pΔ.y}`}
                    className="fill-none stroke-slate-200 stroke-[3] stroke-dasharray-2"
                    strokeDasharray="3 3"
                  />

                  {/* 3. Δυναμικές πλευρές που κινούνται */}
                  <line x1={s0.x1} y1={s0.y1} x2={s0.x2} y2={s0.y2} className={`${sidesData[0].color} stroke-[5] stroke-linecap-round`} />
                  <line x1={s1.x1} y1={s1.y1} x2={s1.x2} y2={s1.y2} className={`${sidesData[1].color} stroke-[5] stroke-linecap-round`} />
                  <line x1={s2.x1} y1={s2.y1} x2={s2.x2} y2={s2.y2} className={`${sidesData[2].color} stroke-[5] stroke-linecap-round`} />
                  <line x1={s3.x1} y1={s3.y1} x2={s3.x2} y2={s3.y2} className={`${sidesData[3].color} stroke-[5] stroke-linecap-round`} />

                  {/* 4. Γράμματα κορυφών και μήκη */}
                  <g className="text-xs font-black fill-slate-500 font-sans">
                    <text x={pA.x - 12} y={pA.y - 6}>Α</text>
                    <text x={pB.x + 8} y={pB.y - 6}>Β</text>
                    <text x={pΓ.x + 8} y={pΓ.y + 6}>Γ</text>
                    <text x={pΔ.x - 14} y={pΔ.y + 6}>Δ</text>

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
                    🟢 <strong>Ολοκληρωμένο άπλωμα:</strong> Όλες οι πλευρές μπήκαν στη σειρά. Περίμετρος ＝ <strong className="text-emerald-700">{totalPerimetrosCm} cm</strong>!
                  </span>
                ) : (
                  <span>
                    📏 Σύρε το ρυθμιστικό στο <strong>100%</strong> για να δεις όλες τις πλευρές να σχηματίζουν μία ευθεία.
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
              Ώρα για Εξάσκηση στην Περίμετρο!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού περιμέτρου τριγώνων, ορθογωνίων, κανονικών πολυγώνων και προβλήματα περίφραξης.
            </p>
          </div>

          <Link
            href="/e-dimotikou/24-perimetros-ask"
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

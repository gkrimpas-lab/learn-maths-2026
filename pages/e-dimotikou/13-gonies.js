// pages/e-dimotikou/13-gonies.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function GoniesTheoryPage() {
  // Μοίρες γωνίας (0° έως 180°)
  const [degrees, setDegrees] = useState(45);

  // Καθορισμός είδους γωνίας
  const getAngleType = (deg) => {
    if (deg === 0) {
      return {
        title: 'Μηδενική Γωνία',
        color: 'text-slate-600',
        badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
        desc: 'Οι δύο ημιευθείες συμπίπτουν απόλυτα (0°).'
      };
    }
    if (deg < 90) {
      return {
        title: 'Οξεία Γωνία',
        color: 'text-blue-600',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
        desc: 'Μικρότερη από την ορθή γωνία (0° ＜ Γωνία ＜ 90°).'
      };
    }
    if (deg === 90) {
      return {
        title: 'Ορθή Γωνία',
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        desc: 'Οι δύο πλευρές είναι ακριβώς κάθετες μεταξύ τους (90°).'
      };
    }
    if (deg < 180) {
      return {
        title: 'Αμβλεία Γωνία',
        color: 'text-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
        desc: 'Μεγαλύτερη από την ορθή και μικρότερη από την ευθεία (90° ＜ Γωνία ＜ 180°).'
      };
    }
    return {
      title: 'Ευθεία Γωνία',
      color: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      desc: 'Οι δύο πλευρές σχηματίζουν μία ευθεία γραμμή (180°).'
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
      title="Τα Είδη των Γωνιών - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τα είδη των γωνιών (οξεία, ορθή, αμβλεία, ευθεία, μηδενική), πώς μετράμε με το μοιρογνωμόνιο και πειραματιστείτε με το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/13-gonies-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 13 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τα Είδη των Γωνιών
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε τη γεωμετρική έννοια της γωνίας, τα 5 βασικά είδη ανάλογα με το άνοιγμα των πλευρών τους, πώς χρησιμοποιούμε το μοιρογνωμόνιο και πώς συνδέονται οι συμπληρωματικές και παραπληρωματικές γωνίες.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Γεωμετρικός Καμβάς</span>
            </div>
            <Link
              href="/e-dimotikou/13-gonies-ask"
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
              Η ανατομία και η κατάταξη των γωνιών με βάση το μέτρο τους σε μοίρες.
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
                  Ανατομία της Γωνίας
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Γωνία</strong> είναι το γεωμετρικό σχήμα που σχηματίζεται από δύο ημιευθείες που έχουν την ίδια αρχή.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    • <strong>Κορυφή:</strong> Το κοινό σημείο αφετηρίας των δύο ημιευθειών.
                  </div>
                  <div>
                    • <strong>Πλευρές (Ακτίνες):</strong> Οι δύο ημιευθείες που ορίζουν το άνοιγμα.
                  </div>
                  <div>
                    • <strong>Μονάδα μέτρησης:</strong> Η <strong>μοίρα ( ° )</strong>, που μετριέται με το μοιρογνωμόνιο.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το μέγεθος μιας γωνίας εξαρτάται <strong>μόνο από το άνοιγμα</strong> των πλευρών της και καθόλου από το μήκος με το οποίο τις σχεδιάζουμε!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατηγοριοποίηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα 5 Είδη Γωνιών
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το μέγεθός τους σε μοίρες, οι γωνίες χωρίζονται σε 5 κατηγορίες:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-blue-700 font-bold">Οξεία:</span>
                    <span className="text-slate-700">0° ＜ Γωνία ＜ 90°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-emerald-700 font-bold">Ορθή:</span>
                    <span className="text-slate-900 font-bold">Γωνία ＝ 90°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-purple-700 font-bold">Αμβλεία:</span>
                    <span className="text-slate-700">90° ＜ Γωνία ＜ 180°</span>
                  </div>
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 flex justify-between items-center">
                    <span className="text-indigo-700 font-bold">Ευθεία:</span>
                    <span className="text-slate-900 font-bold">Γωνία ＝ 180°</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Η <strong>ορθή γωνία (90°)</strong> είναι το σημείο αναφοράς: κάθε γωνία συγκρίνεται με το αν είναι μικρότερη ή μεγαλύτερη από αυτήν.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μέτρηση</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Χρήση Μοιρογνωμονίου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να μετρήσουμε μια γωνία με ακρίβεια:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">1.</span>
                    <span>Τοποθετούμε το κέντρο του μοιρογνωμονίου ακριβώς πάνω στην <strong>κορυφή</strong> της γωνίας.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">2.</span>
                    <span>Ευθυγραμμίζουμε τη γραμμή του 0° με τη μία <strong>πλευρά βάσης</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-indigo-600">3.</span>
                    <span>Διαβάζουμε τον αριθμό των μοιρών από το σημείο που τέμνει η <strong>άλλη πλευρά</strong>.</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 <strong>Προσοχή στην κλίμακα:</strong> Ξεκινάμε πάντα να μετράμε από το 0° της πλευράς βάσης και όχι από το 180°!
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Συσχετίσεις</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συμπληρωματικές &amp; Παραπληρωματικές
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δύο γωνίες συνδέονται συχνά με ειδικές μαθηματικές σχέσεις αθροίσματος:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    <strong>Συμπληρωματικές:</strong> Έχουν άθροισμα ακριβώς <strong>90°</strong> (σχηματίζουν μία ορθή γωνία, π.χ. 35° ＋ 55° ＝ 90°).
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    <strong>Παραπληρωματικές:</strong> Έχουν άθροισμα ακριβώς <strong>180°</strong> (σχηματίζουν μία ευθεία γωνία, π.χ. 110° ＋ 70° ＝ 180°).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Αν μια γωνία είναι 40°, η συμπληρωματική της είναι 90° － 40° ＝ 50° και η παραπληρωματική της 180° － 40° ＝ 140°.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΓΩΝΙΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Γεωμετρικός Καμβάς Γωνιών
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε το άνοιγμα των ημιευθειών με τα κουμπιά, το range ή τα γρήγορα άλματα και δες το σχήμα, το είδος και το τόξο μοιρών σε πραγματικό χρόνο.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Ταυτότητα Γωνίας */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΡΥΘΜΙΣΗ ΑΝΟΙΓΜΑΤΟΣ
              </h4>

              {/* Stepper Μοιρών */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Μοίρες ( ° ):</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                    {degrees}°
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση μοιρών κατά 1"
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
                    aria-label="Μοίρες γωνίας"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση μοιρών κατά 1"
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
                      {val}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Κάρτα Ταυτότητας Γωνίας */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΓΩΝΙΑΣ
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
                <span>ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΓΩΝΙΑΣ</span>
                <span className="font-mono text-blue-600 font-bold">Μέτρο: {degrees}°</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[440px] aspect-[400/220] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center">
                <svg viewBox="0 0 400 220" className="w-full h-full drop-shadow-sm">
                  {/* Ημικυκλικός οδηγός μοιρογνωμονίου (background guide) */}
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
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                Κορυφή O • Μέτρο: <strong className="text-slate-900">{degrees}°</strong> • Είδος: <strong className={angleInfo.color}>{angleInfo.title}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Γωνίες!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις αναγνώρισης ειδών γωνιών, υπολογισμού συμπληρωματικών και παραπληρωματικών γωνιών, και γεωμετρικών προβλημάτων.
            </p>
          </div>

          <Link
            href="/e-dimotikou/13-gonies-ask"
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

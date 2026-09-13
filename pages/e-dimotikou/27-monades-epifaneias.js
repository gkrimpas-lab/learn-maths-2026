// pages/e-dimotikou/27-monades-epifaneias.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatGreekNumber(num) {
  return new Intl.NumberFormat('el-GR').format(num);
}

export default function MonadesEpifaneiasTheoryPage() {
  // Επιλογή dm² από 1 έως 100
  const [squareDecimeters, setSquareDecimeters] = useState(25);

  // Υπολογισμός ισοδύναμων μονάδων
  const currentM2 = squareDecimeters / 100;
  const currentCm2 = squareDecimeters * 100;
  const currentMm2 = squareDecimeters * 10000;

  return (
    <Layout
      title="Μονάδες Επιφάνειας - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε πώς μετατρέπουμε μονάδες μέτρησης επιφάνειας (m², dm², cm², mm²), γιατί κάθε σκαλοπάτι αξίζει 100, και εξερευνήστε το διαδραστικό πλέγμα του 1 m²."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/27-monades-epifaneias-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 27 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μονάδες Μέτρησης Επιφάνειας
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε το τετραγωνικό μέτρο (m²), τις υποδιαιρέσεις του (dm², cm², mm²) και τα πολλαπλάσιά του. Βλέπουμε οπτικά γιατί κάθε σκαλοπάτι στην επιφάνεια αξίζει 100 και μαθαίνουμε να κάνουμε αλάνθαστες μετατροπές.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανός Αναλυτής Υποδιαιρέσεων 1 m²</span>
            </div>
            <Link
              href="/e-dimotikou/27-monades-epifaneias-ask"
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
              Η γεωμετρική κλίμακα των μονάδων επιφάνειας και ο κανόνας του 100.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            {/* Βήμα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-teal-100 text-teal-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βασική Μονάδα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Τετραγωνικό Μέτρο (m²)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Βασική μονάδα μέτρησης επιφανειών είναι το <strong>τετραγωνικό μέτρο (m²)</strong>, δηλαδή η επιφάνεια ενός τετραγώνου με πλευρά 1 m:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-teal-950 shadow-inner">
                    1 m² ＝ 1 m · 1 m
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Χρησιμοποιείται για να μετρήσουμε το μέγεθος ενός δωματίου, ενός διαμερίσματος ή μιας αυλής.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-200 text-xs 2xl:text-sm text-teal-950 font-medium">
                💡 Το τετραγωνικό μέτρο γράφεται <strong>m²</strong> (με εκθέτη 2, επειδή μετράμε 2 διαστάσεις: μήκος και πλάτος).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ο Κανόνας του 100</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γιατί κάθε βήμα είναι 100;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στο μήκος 1 m ＝ 10 dm. Στην επιφάνεια όμως έχουμε τετράγωνο:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-blue-950 shadow-inner">
                    1 m² ＝ 10 dm · 10 dm ＝ 100 dm²
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Επειδή πολλαπλασιάζουμε 10 σειρές επί 10 στήλες, κάθε σκαλοπάτι στην επιφάνεια είναι <strong>100 φορές</strong> μεγαλύτερο ή μικρότερο (10 · 10 ＝ 100)!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs 2xl:text-sm text-blue-950 font-medium">
                ⚡ <strong>Κανόνας μνήμης:</strong> Στο μήκος πάμε ανά 10, στην επιφάνεια πάμε ανά <strong>100</strong>!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Υποδιαιρέσεις</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οι Υποδιαιρέσεις του m²
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για μικρότερες επιφάνειες χρησιμοποιούμε τις υποδιαιρέσεις:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span>1 m² ＝ <strong>100 dm²</strong></span>
                    <span className="text-slate-500">( · 100 )</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span>1 dm² ＝ <strong>100 cm²</strong></span>
                    <span className="text-slate-500">( · 100 )</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-white rounded-lg border border-slate-200">
                    <span>1 cm² ＝ <strong>100 mm²</strong></span>
                    <span className="text-slate-500">( · 100 )</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-amber-50 rounded-lg border border-amber-200 font-bold text-amber-950">
                    <span>1 m² ＝ <strong>10.000 cm²</strong></span>
                    <span>( · 10.000 )</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Όταν κατεβαίνουμε 1 σκαλοπάτι πολλαπλασιάζουμε με 100. Όταν ανεβαίνουμε 1 σκαλοπάτι διαιρούμε με 100.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Μεγάλες Εκτάσεις</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Στρέμμα &amp; το km²
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για αγροτεμάχια, χωράφια και πόλεις χρησιμοποιούμε μεγαλύτερες μονάδες:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>1 Στρέμμα ＝ 1.000 m²</strong><br />
                    (Η πιο συνηθισμένη αγροτική μονάδα στην Ελλάδα).
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                    • <strong>1 km² ＝ 1.000.000 m² ＝ 1.000 στρέμματα</strong><br />
                    (Για εκτάσεις δήμων, νησιών και κρατών).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Ένα χωράφι 5 στρεμμάτων έχει εμβαδόν: 5 · 1.000 ＝ <strong>5.000 m²</strong>!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΜΟΝΑΔΩΝ ΕΠΙΦΑΝΕΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Προσομοίωση του 1 m² &amp; Υποδιαιρέσεις
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον δρομέα για να φωτίσεις από 1 έως 100 τετραγωνικά δεκατόμετρα (dm²). Παρατήρησε πώς μετατρέπονται αυτόματα σε m², cm² και mm², και δες τις 10.000 μικροσκοπικές υποδιαιρέσεις cm²!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Αριστερή Στήλη: Χειριστήρια & Πίνακας Μετατροπών */}
            <div className="lg:col-span-6 2xl:col-span-6 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Stepper dm² */}
                <div className="space-y-2">
                  <div className="h-8 flex items-center justify-between text-left">
                    <span className="text-sm 2xl:text-base font-bold text-slate-800">
                      Τετραγωνικά δεκατόμετρα ( dm² ):
                    </span>
                    <span className="min-w-[90px] text-center font-mono font-black text-2xl text-blue-600 bg-white px-2.5 py-0.5 rounded-xl border border-blue-200 shadow-sm">
                      {squareDecimeters} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      type="button"
                      aria-label="Μείωση κατά 5 dm²"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSquareDecimeters((prev) => Math.max(1, prev - 5));
                      }}
                      disabled={squareDecimeters <= 1}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={squareDecimeters}
                      onChange={(e) => setSquareDecimeters(Number(e.target.value))}
                      aria-label="Επιλογή τετραγωνικών δεκατομέτρων"
                      className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                    />

                    <button
                      type="button"
                      aria-label="Αύξηση κατά 5 dm²"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSquareDecimeters((prev) => Math.min(100, prev + 5));
                      }}
                      disabled={squareDecimeters >= 100}
                      className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-xs text-base"
                    >
                      ＋
                    </button>
                  </div>

                  {/* Γρήγορα κουμπιά επιλογής */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                    {[1, 25, 50, 75, 100].map((val) => (
                      <button
                        key={`btn-dm-${val}`}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSquareDecimeters(val);
                        }}
                        className={`text-xs font-mono px-3 py-1 rounded-lg font-semibold transition ${
                          squareDecimeters === val
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {val} dm²
                      </button>
                    ))}
                  </div>
                </div>

                {/* Πλέγμα Καρτών Μετατροπών */}
                <div>
                  <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500 uppercase mb-3">
                    ΙΣΟΔΥΝΑΜΕΣ ΕΠΙΦΑΝΕΙΕΣ
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white border-2 border-teal-500/30 rounded-2xl p-4 shadow-xs">
                      <span className="text-xs font-black text-teal-700 uppercase block">🏠 m²</span>
                      <div className="text-xl font-mono font-black text-slate-900 mt-1">
                        {currentM2.toLocaleString('el-GR')}
                      </div>
                    </div>
                    <div className="bg-white border-2 border-blue-500/30 rounded-2xl p-4 shadow-xs">
                      <span className="text-xs font-black text-blue-700 uppercase block">🟩 dm²</span>
                      <div className="text-xl font-mono font-black text-slate-900 mt-1">
                        {squareDecimeters}
                      </div>
                    </div>
                    <div className="bg-white border-2 border-amber-500/30 rounded-2xl p-4 shadow-xs">
                      <span className="text-xs font-black text-amber-700 uppercase block">📏 cm²</span>
                      <div className="text-xl font-mono font-black text-slate-900 mt-1">
                        {formatGreekNumber(currentCm2)}
                      </div>
                    </div>
                    <div className="bg-white border-2 border-rose-500/30 rounded-2xl p-4 shadow-xs">
                      <span className="text-xs font-black text-rose-700 uppercase block">🔍 mm²</span>
                      <div className="text-xl font-mono font-black text-slate-900 mt-1">
                        {formatGreekNumber(currentMm2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Βήμα-βήμα ανάλυση υπολογισμών */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-200 space-y-2.5 shadow-xs">
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wider block">
                  ΜΑΘΗΜΑΤΙΚΗ ΑΝΑΛΥΣΗ ΜΕΤΑΤΡΟΠΩΝ
                </span>
                <div className="space-y-1.5 font-mono text-xs sm:text-sm text-emerald-950">
                  <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                    <span>{squareDecimeters} dm² ： 100 ＝</span>
                    <strong className="font-bold text-teal-800">{currentM2.toLocaleString('el-GR')} m²</strong>
                  </div>
                  <div className="flex justify-between border-b border-emerald-200/60 pb-1">
                    <span>{squareDecimeters} dm² · 100 ＝</span>
                    <strong className="font-bold text-amber-800">{formatGreekNumber(currentCm2)} cm²</strong>
                  </div>
                  <div className="flex justify-between pb-0.5">
                    <span>{formatGreekNumber(currentCm2)} cm² · 100 ＝</span>
                    <strong className="font-bold text-rose-800">{formatGreekNumber(currentMm2)} mm²</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Πλέγμα 1 m² */}
            <div className="lg:col-span-6 2xl:col-span-6 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ: ΟΛΟΚΛΗΡΟ ΤΟ ΠΛΑΙΣΙΟ ＝ 1 m²</span>
                <span className="font-mono text-blue-600 font-bold">{squareDecimeters} dm²</span>
              </div>

              {/* SVG Canvas 1 m² (10x10 dm² πλέγμα) */}
              <div className="w-full max-w-[400px] aspect-square bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-inner flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    {/* Εσωτερικό πλέγμα cm² (10x10 γραμμές σε κάθε dm²) */}
                    <pattern id="cmGrid" width="4" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4" height="4" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
                    </pattern>
                  </defs>

                  {/* 100 τετράγωνα dm² */}
                  {[...Array(100)].map((_, i) => {
                    const row = Math.floor(i / 10);
                    const col = i % 10;
                    const x = col * 40;
                    const y = row * 40;
                    const isActive = i < squareDecimeters;

                    return (
                      <g key={i}>
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="40"
                          fill={isActive ? 'rgba(37, 99, 235, 0.2)' : 'none'}
                          stroke={isActive ? '#2563eb' : '#cbd5e1'}
                          strokeWidth={isActive ? '2' : '1'}
                          className="transition-colors duration-150"
                        />
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="40"
                          fill="url(#cmGrid)"
                          pointerEvents="none"
                        />
                        {i === 0 && (
                          <text
                            x="5"
                            y="14"
                            fill="#1e40af"
                            fontSize="8"
                            fontWeight="bold"
                            pointerEvents="none"
                          >
                            1 dm²
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                🟦 Το 1 m² αποτελείται από <strong>100 dm²</strong>, και καθένα από αυτά περιέχει <strong>100 cm²</strong> (συνολικά 10.000 cm²)!
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μονάδες Επιφάνειας!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις μετατροπών, δεκαδικών υπολογισμών, στρεμμάτων και προβλημάτων καθημερινής ζωής με εκτάσεις.
            </p>
          </div>

          <Link
            href="/e-dimotikou/27-monades-epifaneias-ask"
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

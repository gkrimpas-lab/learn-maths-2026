// pages/e-dimotikou/17-apostasi-simeiou-eutheias.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ApostasiSimeiouEutheiasTheoryPage() {
  // Οριζόντια μετατόπιση του σημείου Μ πάνω στην ευθεία (-150 έως +150 px)
  const [offsetX, setOffsetX] = useState(-70);

  // Σταθερές συντεταγμένες σημείου Α (κεντραρισμένο ψηλά στο viewBox 600x320)
  const ax = 300;
  const ay = 80;

  // Σταθερό y για την οριζόντια ευθεία ε
  const ey = 240;

  // Θέση σημείου Μ πάνω στην ευθεία
  const mx = 300 + offsetX;
  const my = ey;

  // Σταθερή κάθετη απόσταση (160 px ➔ 8.0 cm)
  const verticalDistancePx = ey - ay;
  const realDistanceCm = (verticalDistancePx / 20).toLocaleString('el-GR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  // Τρέχον μήκος τμήματος ΑΜ (Ευκλείδεια απόσταση)
  const currentLengthPx = Math.sqrt((mx - ax) * (mx - ax) + (my - ay) * (my - ay));
  const currentLengthCm = (currentLengthPx / 20).toLocaleString('el-GR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  // Γωνία τομής του ΑΜ με την ευθεία (σε μοίρες)
  const angleRad = Math.atan2(verticalDistancePx, Math.abs(mx - ax) || 0.001);
  const angleDeg = Math.round((angleRad * 180) / Math.PI);

  // Η ελάχιστη απόσταση επιτυγχάνεται ακριβώς όταν το offsetX είναι 0
  const isApostasi = offsetX === 0;

  return (
    <Layout
      title="Απόσταση Σημείου από Ευθεία - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε για την απόσταση σημείου από ευθεία, το κάθετο ευθύγραμμο τμήμα, τη σύγκριση με τα πλάγια τμήματα, τη μέτρηση με γνώμονα και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 17 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Απόσταση Σημείου από Ευθεία
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι ορίζεται ως απόσταση ενός σημείου από μια ευθεία, γιατί το κάθετο τμήμα είναι πάντοτε η συντομότερη δυνατή διαδρομή, πώς χρησιμοποιούμε τον γνώμονα και πώς συνδέεται με το ύψος των γεωμετρικών σχημάτων.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανός Καμβάς Σύγκρισης Μηκών</span>
            </div>
            <Link
              href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
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
              Η αυστηρή γεωμετρική έννοια της απόστασης και οι εφαρμογές της.
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
                  Τι είναι η Απόσταση;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν πάρουμε ένα σημείο <strong>Α</strong> εκτός μιας ευθείας <strong>ε</strong>, μπορούμε να φέρουμε άπειρα τμήματα προς αυτήν.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <p className="text-slate-700">
                    <strong>Απόσταση</strong> του σημείου Α από την ευθεία ονομάζουμε το μήκος του <strong>κάθετου ευθύγραμμου τμήματος ΑΗ</strong> (όπου ΑΗ ⊥ ε).
                  </p>
                  <p className="text-slate-500 text-xs">
                    Το σημείο Η πάνω στην ευθεία ονομάζεται <strong>ίχνος της κάθετης</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν ένα σημείο ανήκει ήδη πάνω στην ευθεία, η απόστασή του από αυτήν είναι ακριβώς <strong>0 cm</strong>.
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Θεμελιώδης Ιδιότητα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Συντομότερο Τμήμα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ανάμεσα σε όλα τα ευθύγραμμα τμήματα που ενώνουν το σημείο με την ευθεία:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-emerald-900 text-center shadow-inner">
                    Κάθετο Τμήμα ＜ Οποιοδήποτε Πλάγιο Τμήμα
                  </div>
                  <p className="text-slate-600 text-xs pt-1">
                    Όσο πιο μακριά μετακινούμαστε από το ίχνος της κάθετης, τόσο <strong>μεγαλύτερο</strong> γίνεται το μήκος του πλάγιου τμήματος!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                ⚡ Αυτό συμβαίνει γιατί σε κάθε ορθογώνιο τρίγωνο που σχηματίζεται, το πλάγιο τμήμα είναι η <strong>υποτείνουσα</strong> (η μεγαλύτερη πλευρά).
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατασκευή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σχεδίαση με Γνώμονα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να μετρήσουμε ή να σχεδιάσουμε την απόσταση με ακρίβεια:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">1.</span>
                    <span>Εφαρμόζουμε τη μία κάθετη πλευρά του γνώμονα <strong>πάνω στην ευθεία</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">2.</span>
                    <span>Ολισθαίνουμε τον γνώμονα μέχρι η άλλη κάθετη πλευρά να περάσει ακριβώς από το <strong>σημείο Α</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-amber-600">3.</span>
                    <span>Χαράσσουμε το ευθύγραμμο τμήμα και μετράμε το μήκος του σε εκατοστά (cm).</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 <strong>Κανόνας:</strong> Αν η γωνία δεν είναι ακριβώς 90°, δεν μετράμε απόσταση, αλλά ένα πλάγιο τμήμα.
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
                  Απόσταση Παραλλήλων &amp; Ύψος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η έννοια της απόστασης επεκτείνεται σε όλα τα γεωμετρικά σχήματα:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Παράλληλες Ευθείες:</strong> Η απόστασή τους είναι <strong>σταθερή και ίση</strong> σε όλα τα σημεία τους.
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    • <strong>Ύψος Τριγώνου:</strong> Είναι η απόσταση μιας κορυφής από την απέναντι πλευρά (τη βάση).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs 2xl:text-sm text-purple-950 font-medium">
                🔍 Σε όλους τους τύπους εμβαδού, το μέγεθος «ύψος» είναι πάντοτε μία κάθετη απόσταση!
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΠΟΣΤΑΣΗΣ ΣΗΜΕΙΟΥ ΑΠΟ ΕΥΘΕΙΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Ζωντανός Καμβάς Σύγκρισης Μηκών (Απόσταση vs Πλάγιο)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε το σημείο Μ κατά μήκος της ευθείας. Παρατήρησε πώς μεταβάλλεται το μήκος του τμήματος ΑΜ και πάτησε το κουμπί snap για να βρεις την ακριβή κάθετη απόσταση.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΜΕΤΑΤΟΠΙΣΗ ΣΗΜΕΙΟΥ Μ
              </h4>

              {/* Πίνακας Μετρήσεων */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    ΜΗΚΟΣ ΤΜΗΜΑΤΟΣ ΑΜ
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
                    ΓΩΝΙΑ ΜΕ ΕΥΘΕΙΑ
                  </span>
                  <span
                    className={`font-mono text-xl sm:text-2xl font-black ${
                      isApostasi ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {angleDeg}°
                  </span>
                </div>
              </div>

              {/* Stepper Μετατόπισης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Θέση του Μ:</span>
                  <span className="min-w-[80px] text-center font-mono font-bold text-xs bg-white px-2 py-1 rounded-xl border border-slate-200">
                    {offsetX === 0 ? 'Κάθετα (0)' : offsetX < 0 ? `${Math.abs(offsetX)} px αριστερά` : `${offsetX} px δεξιά`}
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μετακίνηση σημείου Μ αριστερά"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOffsetX((prev) => Math.max(-150, prev - 10));
                    }}
                    disabled={offsetX <= -150}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
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
                    aria-label="Θέση σημείου Μ"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Μετακίνηση σημείου Μ δεξιά"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOffsetX((prev) => Math.min(150, prev + 10));
                    }}
                    disabled={offsetX >= 150}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    →
                  </button>
                </div>

                {/* Γρήγορο κουμπί Snap στην κάθετη θέση */}
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setOffsetX(0)}
                    className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition active:scale-95 shadow-sm ${
                      isApostasi
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    📐 Εύρεση Απόστασης (Κάθετο Τμήμα)
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
                  ΧΑΡΑΚΤΗΡΙΣΜΟΣ ΤΜΗΜΑΤΟΣ
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-black ${
                    isApostasi ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isApostasi ? '🏆 ΑΥΤΗ ΕΙΝΑΙ Η ΑΠΟΣΤΑΣΗ!' : '🛤️ ΠΛΑΓΙΟ ΤΜΗΜΑ'}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isApostasi
                    ? `Είναι το συντομότερο δυνατό τμήμα (${realDistanceCm} cm) και σχηματίζει ορθή γωνία 90°.`
                    : `Το μήκος του (${currentLengthCm} cm) είναι αυστηρά μεγαλύτερο από την κάθετη απόσταση (${realDistanceCm} cm).`}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isApostasi ? `Απόσταση: ${realDistanceCm} cm (Κάθετη)` : `Πλάγιο: ${currentLengthCm} cm`}
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
                        className="stroke-slate-300 stroke-[2] stroke-dasharray-4"
                        strokeDasharray="4 4"
                      />
                      <circle cx={ax} cy={ey} r="3" className="fill-slate-400" />
                      <text x={ax + 6} y={ey - 6} className="font-mono text-[10px] font-bold fill-slate-400">
                        Η (ίχνος)
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
                    ευθεία (ε)
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
                    Σημείο Α
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
                    Μ
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
                  <span>
                    🟢 Κάθετο τμήμα: <strong className="text-emerald-700">Απόσταση ＝ {realDistanceCm} cm</strong> (ελάχιστο μήκος)
                  </span>
                ) : (
                  <span>
                    📏 Πλάγιο τμήμα: <strong>{currentLengthCm} cm</strong> ＞ <strong>{realDistanceCm} cm</strong>
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
              Ώρα για Εξάσκηση στην Απόσταση Σημείου από Ευθεία!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις σύγκρισης μηκών, αναγνώρισης κάθετων τμημάτων και γεωμετρικών εφαρμογών.
            </p>
          </div>

          <Link
            href="/e-dimotikou/17-apostasi-simeiou-eutheias-ask"
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

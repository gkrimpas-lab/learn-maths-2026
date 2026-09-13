// pages/e-dimotikou/20-mikos-kiklou.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function MikosKiklouTheoryPage() {
  const [rollProgress, setRollProgress] = useState(0);

  // Γεωμετρικές σταθερές (προσαρμοσμένες σε viewBox 560x280)
  const radius = 35;
  const diametros = radius * 2; // 70 px
  const pi = 3.14159;
  const totalLength = Math.round(2 * pi * radius); // ~220 px

  const startCx = 65;
  const startCy = 110;
  const groundY = startCy + radius; // 145 px (επίπεδο εδάφους)

  const currentCx = Math.round(startCx + (rollProgress / 100) * totalLength);
  const rotationDeg = (rollProgress / 100) * 360;
  const unfoldedLength = Math.round((rollProgress / 100) * totalLength);

  // Εκπαιδευτικές μετρήσεις σε cm (κλίμακα 1:10)
  const displayDiametrosCm = (diametros / 10).toLocaleString('el-GR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }); // 7,0 cm
  const displayMikosCm = (totalLength / 10).toLocaleString('el-GR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }); // 22,0 cm
  const displayCurrentCm = (unfoldedLength / 10).toLocaleString('el-GR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const isComplete = rollProgress === 100;

  return (
    <Layout
      title="Μήκος Κύκλου - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε πώς υπολογίζουμε το μήκος του κύκλου (περιφέρεια), τη σημασία του αριθμού π = 3,14, τη σχέση με τη διάμετρο και δοκιμάστε το διαδραστικό εργαστήριο κύλισης τροχού."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/20-mikos-kiklou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 20 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Το Μήκος του Κύκλου
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε την περιφέρεια του κύκλου, ανακαλύπτουμε γιατί η διάμετρος χωράει ακριβώς π (3,14) φορές στο μήκος του, πώς ξετυλίγεται ένας τροχός σε μία πλήρη περιστροφή και πώς επιλύουμε προβλήματα με στροφές τροχών.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Ζωντανός Προσομοιωτής Κύλισης Τροχού</span>
            </div>
            <Link
              href="/e-dimotikou/20-mikos-kiklou-ask"
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
              Η γεωμετρία της περιφέρειας, ο αριθμός π και οι τύποι υπολογισμού.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ανατομία</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ακτίνα και Διάμετρος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε κύκλος καθορίζεται πλήρως από το κέντρο του <strong>Ο</strong> και τη διάστασή του:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>
                    • <strong>Ακτίνα (α ή r):</strong> Το ευθύγραμμο τμήμα από το κέντρο μέχρι οποιοδήποτε σημείο της περιφέρειας.
                  </div>
                  <div>
                    • <strong>Διάμετρος (δ ή d):</strong> Το τμήμα που ενώνει δύο σημεία του κύκλου περνώντας από το κέντρο.
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-mono font-bold text-center text-slate-900 shadow-inner">
                    Διάμετρος ＝ 2 · Ακτίνα &nbsp; ( δ ＝ 2 · α )
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η διάμετρος είναι η μεγαλύτερη δυνατή χορδή που μπορεί να σχεδιαστεί μέσα σε έναν κύκλο!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Η Σταθερά π</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Μαγικός Αριθμός π (3,14)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν πάρουμε <strong>οποιονδήποτε κύκλο</strong> (από ένα καπάκι μέχρι ολόκληρη τη Γη) και διαιρέσουμε το μήκος του με τη διάμετρό του:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-black text-indigo-950 shadow-inner">
                    Μήκος Κύκλου ： Διάμετρος ＝ π ≈ 3,14
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Αυτό σημαίνει ότι η διάμετρος χωράει στο μήκος της περιφέρειας <strong>πάντα περίπου 3,14 φορές</strong> (τρεις ολόκληρες φορές και ένα μικρό κομματάκι)!
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Στα μαθηματικά του Δημοτικού χρησιμοποιούμε πάντα την τιμή <strong>π ＝ 3,14</strong>.
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ο Μαθηματικός Τύπος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πώς Υπολογίζουμε το Μήκος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Ανάλογα με το αν γνωρίζουμε τη διάμετρο ή την ακτίνα, χρησιμοποιούμε τον αντίστοιχο τύπο:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-center text-blue-950 shadow-inner">
                    Μ ＝ π · δ &nbsp; ( 3,14 · Διάμετρος )
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-center text-indigo-950 shadow-inner">
                    Μ ＝ 2 · π · α &nbsp; ( 2 · 3,14 · Ακτίνα )
                  </div>
                  <p className="text-slate-500 text-xs font-sans text-center">
                    π.χ. Για ακτίνα α ＝ 10 cm: Μ ＝ 2 · 3,14 · 10 ＝ <strong>62,8 cm</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Το μήκος του κύκλου είναι η «περίμετρος» του κυκλικού σχήματος.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογές</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Στροφές Τροχού &amp; Αντίστροφοι Τύποι
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν ένας τροχός κάνει μία πλήρη περιστροφή (360°), διανύει απόσταση ακριβώς ίση με το μήκος του:
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-mono">
                    <strong>Συνολική Απόσταση ＝ Στροφές · Μήκος Κύκλου</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-mono">
                    <strong>Αντίστροφος Τύπος: Διάμετρος ＝ Μήκος ： 3,14</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Αν ένας τροχός με μήκος 2 m κάνει 50 πλήρεις στροφές, διανύει: 50 · 2 ＝ 100 μέτρα.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΚΥΛΙΣΗΣ ΤΡΟΧΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Προσομοιωτής Κύλισης &amp; Ξετυλίγματος Κύκλου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε τον δρομέα για να κυλήσεις τον κύκλο κατά 1 πλήρη στροφή. Δες πώς η περιφέρειά του απλώνεται στο έδαφος και πώς συγκρίνεται με το μήκος της διαμέτρου.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΚΥΛΙΣΗ ΤΡΟΧΟΥ
              </h4>

              {/* Πίνακας Μετρήσεων */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    ΔΙΑΜΕΤΡΟΣ ( δ )
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-slate-900">
                    {displayDiametrosCm} cm
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    ΞΕΤΥΛΙΓΜΕΝΟ ΜΗΚΟΣ
                  </span>
                  <span
                    className={`font-mono text-xl sm:text-2xl font-black ${
                      isComplete ? 'text-emerald-600' : 'text-blue-600'
                    }`}
                  >
                    {displayCurrentCm} cm
                  </span>
                </div>
              </div>

              {/* Stepper Προόδου Κύλισης */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Πρόοδος Κύλισης:</span>
                  <span
                    className={`min-w-[80px] text-center font-mono font-black text-2xl bg-white px-2.5 py-0.5 rounded-xl border shadow-sm transition ${
                      isComplete
                        ? 'text-emerald-600 border-emerald-300 ring-2 ring-emerald-100'
                        : 'text-blue-600 border-blue-200'
                    }`}
                  >
                    {rollProgress}%
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση κύλισης κατά 5%"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRollProgress((prev) => Math.max(0, prev - 5));
                    }}
                    disabled={rollProgress <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={rollProgress}
                    onChange={(e) => setRollProgress(Number(e.target.value))}
                    aria-label="Πρόοδος κύλισης κύκλου"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση κύλισης κατά 5%"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setRollProgress((prev) => Math.min(100, prev + 5));
                    }}
                    disabled={rollProgress >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>

                {/* Γρήγορα κουμπιά κατάστασης */}
                <div className="flex justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setRollProgress(0)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95"
                  >
                    🔄 Επαναφορά (0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRollProgress(100)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-xs active:scale-95 ${
                      isComplete
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    🎯 Πλήρες Ξετύλιγμα (100%)
                  </button>
                </div>
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${
                  isComplete
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ
                </span>
                <div
                  className={`text-xl sm:text-2xl font-black ${
                    isComplete ? 'text-emerald-700 animate-pulse' : 'text-slate-800'
                  }`}
                >
                  {isComplete ? `Μήκος Κύκλου ＝ ${displayMikosCm} cm` : 'Ο τροχός κυλάει...'}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {isComplete
                    ? `Μ ＝ π · δ ＝ 3,14 · ${displayDiametrosCm} ＝ ${displayMikosCm} cm (σε 1 περιστροφή).`
                    : 'Σε κάθε κλάσμα της στροφής, ο τροχός διανύει το αντίστοιχο μέρος της περιφέρειάς του.'}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: Responsive SVG Γεωμετρικός Καμβάς Unrolling */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΕΔΑΦΟΣ)</span>
                <span className="font-mono text-blue-600 font-bold">
                  {isComplete ? `Συνολικό: ${displayMikosCm} cm` : `Τρέχον: ${displayCurrentCm} cm`}
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/280] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg
                  viewBox="0 0 460 220"
                  className="w-full h-full drop-shadow-sm"
                  shapeRendering="geometricPrecision"
                >
                  {/* Οριζόντια γραμμή εδάφους */}
                  <line x1="20" y1={groundY} x2="440" y2={groundY} className="stroke-slate-300 stroke-[3]" />

                  {/* Σημάδι Αφετηρίας (0) */}
                  <line x1={startCx} y1={groundY - 5} x2={startCx} y2={groundY + 8} className="stroke-slate-500 stroke-2" />
                  <text x={startCx} y={groundY + 22} className="fill-slate-500 font-mono text-xs font-black" textAnchor="middle">
                    0
                  </text>

                  {/* Σημαδούρα Τερματισμού (Μήκος Κύκλου) */}
                  <line
                    x1={startCx + totalLength}
                    y1={groundY - 8}
                    x2={startCx + totalLength}
                    y2={groundY + 8}
                    className="stroke-rose-500 stroke-[2.5]"
                  />
                  <text
                    x={startCx + totalLength}
                    y={groundY + 22}
                    className="fill-rose-600 font-mono text-[11px] font-black"
                    textAnchor="middle"
                  >
                    Μ (3,14 · δ)
                  </text>

                  {/* Γραμμή Ξετυλίγματος πάνω στο έδαφος */}
                  {rollProgress > 0 && (
                    <line
                      x1={startCx}
                      y1={groundY}
                      x2={startCx + unfoldedLength}
                      y2={groundY}
                      className={`stroke-[5] stroke-linecap-round ${
                        isComplete ? 'stroke-emerald-500' : 'stroke-blue-600'
                      }`}
                    />
                  )}

                  {/* Ο Κυλιόμενος Κύκλος */}
                  <g transform={`translate(${currentCx - startCx}, 0)`}>
                    <circle
                      cx={startCx}
                      cy={startCy}
                      r={radius}
                      className={`stroke-[3.5] transition-colors duration-150 ${
                        isComplete ? 'stroke-emerald-600 fill-emerald-50/20' : 'stroke-slate-800 fill-white'
                      }`}
                    />

                    {/* Περιστρεφόμενη ακτίνα */}
                    <g transform={`rotate(${rotationDeg}, ${startCx}, ${startCy})`}>
                      <line
                        x1={startCx}
                        y1={startCy}
                        x2={startCx}
                        y2={startCy + radius}
                        className="stroke-indigo-600 stroke-[3] stroke-linecap-round"
                      />
                      <circle cx={startCx} cy={startCy + radius} r={4.5} className="fill-indigo-600" />
                    </g>

                    {/* Κέντρο Κύκλου */}
                    <circle cx={startCx} cy={startCy} r={4} className="fill-slate-900" />

                    {/* Ένδειξη διαμέτρου μέσα στον κύκλο */}
                    <line
                      x1={startCx - radius + 4}
                      y1={startCy}
                      x2={startCx + radius - 4}
                      y2={startCy}
                      className="stroke-slate-400 stroke-[1] stroke-dasharray-2"
                      strokeDasharray="3 3"
                    />
                    <text
                      x={startCx}
                      y={startCy - 6}
                      className="text-[10px] font-mono font-black fill-slate-800"
                      textAnchor="middle"
                    >
                      δ ＝ {displayDiametrosCm} cm
                    </text>
                  </g>

                  {/* Οπτικός οδηγός σύγκρισης διαμέτρου κάτω από το έδαφος */}
                  {isComplete && (
                    <g transform="translate(0, 30)">
                      <line
                        x1={startCx}
                        y1={groundY + 16}
                        x2={startCx + diametros}
                        y2={groundY + 16}
                        className="stroke-amber-500 stroke-[3.5] stroke-linecap-round"
                      />
                      <text
                        x={startCx + diametros / 2}
                        y={groundY + 30}
                        className="fill-amber-700 font-mono text-[10px] font-black"
                        textAnchor="middle"
                      >
                        1 Διάμετρος (δ)
                      </text>
                      <text
                        x={startCx + totalLength}
                        y={groundY + 30}
                        textAnchor="end"
                        className="fill-slate-500 font-sans text-[10px] font-bold"
                      >
                        χωράει ~3,14 φορές στο συνολικό μήκος
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                {isComplete ? (
                  <span>
                    🟢 <strong>Πλήρης στροφή:</strong> Το μήκος της γραμμής ισούται ακριβώς με <strong className="text-emerald-700">3,14 · δ ＝ {displayMikosCm} cm</strong>!
                  </span>
                ) : (
                  <span>
                    🚴 Κύλισε τον τροχό μέχρι το <strong>100%</strong> για να ολοκληρωθεί το πλήρες ξετύλιγμα της περιφέρειας.
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
              Ώρα για Εξάσκηση στο Μήκος Κύκλου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις υπολογισμού μήκους κύκλου, ανάστροφης εύρεσης ακτίνας και διαμέτρου, και προβλήματα στροφών τροχών.
            </p>
          </div>

          <Link
            href="/e-dimotikou/20-mikos-kiklou-ask"
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

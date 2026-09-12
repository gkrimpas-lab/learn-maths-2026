// pages/e-dimotikou/18-ipsos-trigonou.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function IpsosTrigonouTheoryPage() {
  // Οριζόντια θέση της κορυφής Α (100 έως 500 px στον άξονα X)
  // Αρχική τιμή 300 (στο κέντρο, οξυγώνιο τρίγωνο)
  const [posX, setPosX] = useState(300);

  // Σταθερές συντεταγμένες βάσης ΒΓ (viewBox 600x320)
  const bx = 220; // Σημείο Β
  const by = 240;
  const gx = 380; // Σημείο Γ
  const gy = 240;

  // Σταθερό ύψος (140 px -> 7.0 cm)
  const ay = 100;
  const ipsosHeightPx = by - ay;
  const ipsosHeightCm = (ipsosHeightPx / 20).toLocaleString('el-GR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const ax = posX;

  // Θέση του ύψους σε σχέση με τη βάση ΒΓ
  const getIpsosPosition = () => {
    if (ax < bx) return 'Εξωτερικό (Πέφτει στην προέκταση της βάσης, αριστερά από το Β)';
    if (ax === bx) return 'Συμπίπτει με την κάθετη πλευρά ΑΒ (Ορθή γωνία στην κορυφή Β)';
    if (ax > bx && ax < gx) return 'Εσωτερικό (Πέφτει ανάμεσα στα σημεία Β και Γ)';
    if (ax === gx) return 'Συμπίπτει με την κάθετη πλευρά ΑΓ (Ορθή γωνία στην κορυφή Γ)';
    return 'Εξωτερικό (Πέφτει στην προέκταση της βάσης, δεξιά από το Γ)';
  };

  // Κατηγοριοποίηση τριγώνου
  const getTriangleCategory = () => {
    if (ax === bx || ax === gx) {
      return {
        title: 'Ορθογώνιο Τρίγωνο',
        desc: 'Το ύψος συμπίπτει με μία από τις δύο κάθετες πλευρές του τριγώνου.',
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    if (ax < bx || ax > gx) {
      return {
        title: 'Αμβλυγώνιο Τρίγωνο',
        desc: 'Το ύψος πέφτει έξω από το τρίγωνο, πάνω στην προέκταση της βάσης.',
        color: 'text-purple-600',
        badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
      };
    }
    return {
      title: 'Οξυγώνιο Τρίγωνο',
      desc: 'Το ύψος πέφτει μέσα στο τρίγωνο (εσωτερικό ευθύγραμμο τμήμα).',
      color: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
    };
  };

  const triCategory = getTriangleCategory();

  return (
    <Layout
      title="Ύψος Τριγώνου - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τι είναι το ύψος του τριγώνου, πού πέφτει σε οξυγώνια, ορθογώνια και αμβλυγώνια τρίγωνα, πώς σχεδιάζεται και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/18-ipsos-trigonou-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 18 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Το Ύψος του Τριγώνου
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τι ονομάζουμε ύψος τριγώνου, γιατί κάθε τρίγωνο έχει τρία διαφορετικά ύψη, πότε το ύψος πέφτει μέσα, πότε συμπίπτει με πλευρά και πότε χρειάζεται να προεκτείνουμε τη βάση.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Καμβάς Ύψους Τριγώνου</span>
            </div>
            <Link
              href="/e-dimotikou/18-ipsos-trigonou-ask"
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
              Η γεωμετρική φύση του ύψους και οι θέσεις που καταλαμβάνει σε κάθε είδος τριγώνου.
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
                  Τι είναι το Ύψος;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Ύψος τριγώνου</strong> ονομάζουμε το κάθετο ευθύγραμμο τμήμα που ξεκινά από μία κορυφή και καταλήγει στην ευθεία της απέναντι πλευράς (τη βάση).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div>• Σχηματίζει πάντα <strong>ορθή γωνία (90°)</strong> με τη βάση.</div>
                  <div>• Η πλευρά στην οποία καταλήγει το ύψος ονομάζεται <strong>αντίστοιχη βάση</strong>.</div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το ύψος είναι στην πραγματικότητα η <strong>απόσταση της κορυφής από την απέναντι πλευρά</strong>!
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πλήθος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα 3 Ύψη του Τριγώνου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Επειδή κάθε τρίγωνο έχει 3 κορυφές, διαθέτει <strong>ακριβώς 3 ύψη</strong> (ένα για κάθε κορυφή και αντίστοιχη πλευρά):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 shadow-inner">
                    υ<sub>α</sub> (από το Α) • υ<sub>β</sub> (από το Β) • υ<sub>γ</sub> (από το Γ)
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Τα τρία αυτά ύψη (ή οι προεκτάσεις τους) συναντιούνται <strong>πάντα στο ίδιο κοινό σημείο</strong>, το οποίο ονομάζεται <strong>ορθόκεντρο</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Στο ισόπλευρο τρίγωνο και τα 3 ύψη είναι απολύτως ίσα σε μήκος!
              </div>
            </article>

            {/* Βήμα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Θέση Ύψους</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πού Πέφτει το Ύψος;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η θέση του ύψους εξαρτάται απόλυτα από το είδος του τριγώνου:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-blue-700">Οξυγώνιο:</strong> Πέφτει <strong>μέσα</strong> στο τρίγωνο (εσωτερικό).
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700">Ορθογώνιο:</strong> <strong>Συμπίπτει</strong> με μία από τις δύο κάθετες πλευρές!
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-purple-700">Αμβλυγώνιο:</strong> Πέφτει <strong>έξω</strong> από το τρίγωνο (στην προέκταση της βάσης).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στο αμβλυγώνιο, σχεδιάζουμε πρώτα τη βάση με <strong>διακεκομμένη γραμμή</strong> για να μπορέσει να προσγειωθεί το ύψος κάθετα.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εφαρμογή</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύνδεση με το Εμβαδόν
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Το ύψος είναι το κλειδί για τον υπολογισμό της επιφάνειας (εμβαδού) κάθε τριγώνου:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-bold text-emerald-950 shadow-inner">
                    Εμβαδόν ＝ ( Βάση · Ύψος ) ： 2
                  </div>
                  <p className="text-slate-600 text-xs font-sans text-left pt-1">
                    Όποια πλευρά κι αν διαλέξουμε ως βάση, πολλαπλασιάζουμε με το αντίστοιχο ύψος της και διαιρούμε διά 2.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Στο ορθογώνιο τρίγωνο: Εμβαδόν ＝ (Κάθετη Πλευρά 1 · Κάθετη Πλευρά 2) ： 2.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΥΨΟΥΣ ΤΡΙΓΩΝΟΥ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Καμβάς Ύψους Τριγώνου
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρε την κορυφή Α οριζόντια. Παρατήρησε πώς το ύψος παραμένει σταθερό σε μήκος, αλλά μετακινείται από το εσωτερικό του τριγώνου στην πλευρά (ορθογώνιο) ή στην εξωτερική προέκταση (αμβλυγώνιο).
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια & Μετρήσεις */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΟΡΙΖΟΝΤΙΑ ΜΕΤΑΤΟΠΙΣΗ ΚΟΡΥΦΗΣ Α
              </h4>

              {/* Πίνακας Μετρήσεων */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    ΜΗΚΟΣ ΥΨΟΥΣ ( υ )
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-rose-600">
                    {ipsosHeightCm} cm
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wider">
                    ΕΙΔΟΣ ΤΡΙΓΩΝΟΥ
                  </span>
                  <span className={`text-xs sm:text-sm font-black block mt-1 ${triCategory.color}`}>
                    {triCategory.title}
                  </span>
                </div>
              </div>

              {/* Stepper Θέσης Κορυφής Α */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Θέση Άξονα X:</span>
                  <span className="min-w-[80px] text-center font-mono font-bold text-xs bg-white px-2 py-1 rounded-xl border border-slate-200">
                    X ＝ {posX} px
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μετακίνηση κορυφής Α αριστερά"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPosX((prev) => Math.max(100, prev - 10));
                    }}
                    disabled={posX <= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ←
                  </button>

                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="5"
                    value={posX}
                    onChange={(e) => setPosX(Number(e.target.value))}
                    aria-label="Οριζόντια θέση κορυφής Α"
                    className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Μετακίνηση κορυφής Α δεξιά"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setPosX((prev) => Math.min(500, prev + 10));
                    }}
                    disabled={posX >= 500}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    →
                  </button>
                </div>

                {/* Γρήγορα κουμπιά θέσεων */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setPosX(150)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition"
                  >
                    ◀ Αμβλυγώνιο (Έξω)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosX(bx)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition"
                  >
                    📐 Ορθογώνιο στο Β
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosX(300)}
                    className="text-xs px-2.5 py-1 rounded-lg font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition"
                  >
                    ▲ Οξυγώνιο (Μέσα)
                  </button>
                </div>
              </div>

              {/* Κάρτα Περιγραφής Θέσης Ύψους */}
              <div
                className={`p-5 rounded-2xl border space-y-2 shadow-sm text-center transition duration-200 ${triCategory.bg}`}
              >
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΠΟΥ ΠΕΦΤΕΙ ΤΟ ΥΨΟΣ;
                </span>
                <div className={`text-base sm:text-lg font-black ${triCategory.color}`}>
                  {getIpsosPosition()}
                </div>
                <p className="text-xs font-medium text-slate-600">
                  {triCategory.desc}
                </p>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικός Καμβάς */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ (ΒΑΣΗ ΒΓ)</span>
                <span className="font-mono text-rose-600 font-bold">
                  Ύψος υ ＝ {ipsosHeightCm} cm (Κάθετο)
                </span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[560/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 560 300" className="w-full h-full drop-shadow-sm">
                  {/* Προεκτάσεις βάσης αν το Α βγει έξω */}
                  {ax < bx && (
                    <line
                      x1={ax - 20}
                      y1={by}
                      x2={bx}
                      y2={by}
                      className="stroke-slate-300 stroke-[2] stroke-dasharray-4"
                      strokeDasharray="4 4"
                    />
                  )}
                  {ax > gx && (
                    <line
                      x1={gx}
                      y1={by}
                      x2={ax + 20}
                      y2={by}
                      className="stroke-slate-300 stroke-[2] stroke-dasharray-4"
                      strokeDasharray="4 4"
                    />
                  )}

                  {/* Τετραγωνάκι ορθής γωνίας στη βάση του ύψους */}
                  <g className="stroke-rose-500 stroke-[1.5] fill-rose-500/15">
                    {ax >= bx ? (
                      <rect x={ax - 16} y={by - 16} width="16" height="16" />
                    ) : (
                      <rect x={ax} y={by - 16} width="16" height="16" />
                    )}
                  </g>

                  {/* Τρίγωνο ΑΒΓ */}
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${gx},${gy}`}
                    className="fill-sky-500/10 stroke-sky-600 stroke-[3.5] stroke-linejoin-round"
                  />

                  {/* Βάση ΒΓ */}
                  <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />

                  {/* Ύψος (Κάθετο ευθύγραμμο τμήμα) */}
                  <line
                    x1={ax}
                    y1={ay}
                    x2={ax}
                    y2={by}
                    className="stroke-rose-500 stroke-[3.5] stroke-linecap-round"
                  />

                  {/* Κορυφή Α */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 12} textAnchor="middle" className="font-sans text-sm font-black fill-slate-900">
                    Α
                  </text>

                  {/* Κορυφή Β */}
                  <circle cx={bx} cy={by} r="6" className="fill-slate-900" />
                  <text x={bx - 16} y={by + 6} textAnchor="end" className="font-sans text-sm font-black fill-slate-900">
                    Β
                  </text>

                  {/* Κορυφή Γ */}
                  <circle cx={gx} cy={gy} r="6" className="fill-slate-900" />
                  <text x={gx + 16} y={gy + 6} textAnchor="start" className="font-sans text-sm font-black fill-slate-900">
                    Γ
                  </text>

                  {/* Ετικέτα ύψους */}
                  <text
                    x={ax >= 300 ? ax - 12 : ax + 14}
                    y={(ay + by) / 2}
                    textAnchor={ax >= 300 ? 'end' : 'start'}
                    className="font-mono text-xs font-black fill-rose-600"
                  >
                    υ ＝ {ipsosHeightCm} cm
                  </text>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-md p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                Το ύψος παραμένει σταθερό: <strong className="text-rose-600 font-black">{ipsosHeightCm} cm</strong> (σχηματίζει πάντοτε 90° με τη βάση ή την προέκτασή της).
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στο Ύψος του Τριγώνου!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε απαιτητικές ασκήσεις εντοπισμού ύψους, γεωμετρικών υπολογισμών εμβαδού και αναγνώρισης θέσης σε οξυγώνια, ορθογώνια και αμβλυγώνια τρίγωνα.
            </p>
          </div>

          <Link
            href="/e-dimotikou/18-ipsos-trigonou-ask"
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

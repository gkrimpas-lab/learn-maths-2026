// pages/e-dimotikou/15-trigona-pleures.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function TrigonaPleuresTheoryPage() {
  // Σταθερό μήκος βάσης ΒΓ
  const baseSide = 200;

  // Μήκη πλευρών ΑΒ (c) και ΑΓ (b) - Αρχικά 200 για ισόπλευρο
  const [sidec, setSidec] = useState(200);
  const [sideb, setSideb] = useState(200);

  // Διασφάλιση ελάχιστων ορίων ώστε να ικανοποιείται η τριγωνική ανισότητα
  const c = Math.max(110, Math.min(280, sidec));
  const b = Math.max(110, Math.min(280, sideb));

  // Συντεταγμένες βάσης ΒΓ (κεντραρισμένες στο viewBox 600x320)
  const bx = 300 - baseSide / 2; // 200
  const by = 250;
  const gx = 300 + baseSide / 2; // 400
  const gy = 250;

  // Νόμος Συνημιτόνων για τη γωνία Β: b² = c² + a² - 2·c·a·cos(B)
  const cosB = (c * c + baseSide * baseSide - b * b) / (2 * c * baseSide);
  const safeCosB = Math.max(-0.99, Math.min(0.99, cosB));
  const radB = Math.acos(safeCosB);

  // Συντεταγμένες κορυφής Α
  const ax = Math.round(bx + c * Math.cos(radB));
  const ay = Math.round(by - c * Math.sin(radB));

  // Περίμετρος
  const perimeter = c + baseSide + b;

  // Κατηγοριοποίηση ως προς τις πλευρές
  const getTriangleType = () => {
    if (c === baseSide && baseSide === b) {
      return {
        title: 'Ισόπλευρο Τρίγωνο',
        desc: 'Έχει και τις 3 πλευρές του απόλυτα ίσες (ΑΒ ＝ ΒΓ ＝ ΑΓ). Όλες οι γωνίες του είναι ίσες με 60°.',
        color: 'text-blue-600',
        badgeBg: 'bg-blue-50 text-blue-800 border-blue-200'
      };
    }
    if (c === b || c === baseSide || b === baseSide) {
      return {
        title: 'Ισοσκελές Τρίγωνο',
        desc: 'Έχει ακριβώς 2 πλευρές ίσες μεταξύ τους. Οι δύο προσκείμενες στη βάση γωνίες είναι επίσης ίσες.',
        color: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-300'
      };
    }
    return {
      title: 'Σκαληνό Τρίγωνο',
      desc: 'Και οι 3 πλευρές του έχουν διαφορετικά μήκη. Όλες οι γωνίες του είναι επίσης άνισες.',
      color: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200'
    };
  };

  const triType = getTriangleType();

  return (
    <Layout
      title="Τρίγωνα ως προς τις Πλευρές - Ε' Δημοτικού | LearnMaths.gr"
      description="Μάθετε τα είδη τριγώνων ως προς τις πλευρές (ισόπλευρο, ισοσκελές, σκαληνό), την τριγωνική ανισότητα, τον υπολογισμό περιμέτρου και δοκιμάστε το διαδραστικό εργαστήριο."
      backUrl="/e-dimotikou"
      backText="Ε' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/e-dimotikou/15-trigona-pleures-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 15 • Ε' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Τρίγωνα ως προς τις Πλευρές
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Εξερευνούμε την κατάταξη των τριγώνων ανάλογα με τα μήκη των πλευρών τους, την τριγωνική ανισότητα που καθορίζει πότε μπορεί να κατασκευαστεί ένα τρίγωνο, και πώς υπολογίζουμε την περίμετρό του.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Γεωμετρικός Καμβάς Πλευρών</span>
            </div>
            <Link
              href="/e-dimotikou/15-trigona-pleures-ask"
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
              Η κατηγοριοποίηση των τριγώνων με βάση τα μήκη των πλευρών και η περίμετρος.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κατάταξη</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τα 3 Είδη ως προς τις Πλευρές
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Με κριτήριο τη σχέση ανάμεσα στα μήκη των πλευρών τους, τα τρίγωνα διακρίνονται σε:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-blue-700">1. Ισόπλευρο:</strong> Και οι <strong>3 πλευρές ίσες</strong> μεταξύ τους.
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-emerald-700">2. Ισοσκελές:</strong> Ακριβώς <strong>2 πλευρές ίσες</strong> (και 1 διαφορετική).
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200">
                    <strong className="text-purple-700">3. Σκαληνό:</strong> Και οι <strong>3 πλευρές άνισες</strong> (διαφορετικές).
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Στο ισόπλευρο τρίγωνο, εκτός από τις 3 πλευρές, είναι απολύτως ίσες και οι 3 γωνίες (καθεμία είναι 60°).
              </div>
            </article>

            {/* Βήμα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας Ύπαρξης</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Η Τριγωνική Ανισότητα
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δεν μπορούν τρία οποιαδήποτε ευθύγραμμα τμήματα να φτιάξουν τρίγωνο! Πρέπει να ισχύει:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base text-center">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-300 font-mono font-bold text-amber-900 shadow-inner">
                    Κάθε πλευρά ＜ Άθροισμα των άλλων δύο
                  </div>
                  <p className="text-slate-600 text-xs text-left pt-1">
                    Αν έχουμε πλευρές 3 cm, 4 cm και 8 cm, τρίγωνο <strong>δεν σχηματίζεται</strong>, γιατί 3 ＋ 4 ＝ 7 cm ＜ 8 cm (οι πλευρές δεν συναντιούνται ποτέ).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Για γρήγορο έλεγχο: Το άθροισμα των δύο μικρότερων πλευρών πρέπει να είναι <strong>αυστηρά μεγαλύτερο</strong> από τη μεγαλύτερη πλευρά.
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
                  Περίμετρος Τριγώνου
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Περίμετρος (Π)</strong> είναι το συνολικό μήκος του περιγράμματος του τριγώνου (το άθροισμα και των 3 πλευρών του):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 text-center shadow-inner">
                    Περίμετρος ＝ α ＋ β ＋ γ
                  </div>
                  <div className="space-y-1 text-xs text-slate-700 font-sans pt-1">
                    <div>• <strong>Ισόπλευρο:</strong> Π ＝ 3 · πλευρά</div>
                    <div>• <strong>Ισοσκελές:</strong> Π ＝ (2 · ίση πλευρά) ＋ βάση</div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν γνωρίζουμε την περίμετρο ενός ισόπλευρου τριγώνου (π.χ. 27 cm), η πλευρά του είναι: 27 ： 3 ＝ 9 cm.
              </div>
            </article>

            {/* Βήμα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Διπλή Ταυτότητα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συνδυαστική Ονοματολογία
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε τρίγωνο χαρακτηρίζεται <strong>ταυτόχρονα</strong> από δύο ονόματα: ένα ως προς τις πλευρές και ένα ως προς τις γωνίες του!
                </p>

                <div className="space-y-2 text-xs sm:text-sm 2xl:text-base">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Ορθογώνιο και Ισοσκελές:</strong> Έχει 1 ορθή γωνία (90°) και 2 ίσες κάθετες πλευρές (γωνίες: 90°, 45°, 45°).
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950">
                    • <strong>Αμβλυγώνιο και Σκαληνό:</strong> Έχει 1 αμβλεία γωνία ( ＞ 90° ) και όλες τις πλευρές του διαφορετικές.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🔍 Ένα <strong>ισόπλευρο τρίγωνο είναι ΠΑΝΤΑ οξυγώνιο</strong>, αφού και οι τρεις γωνίες του είναι υποχρεωτικά 60°.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΛΕΥΡΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Δυναμικός Γεωμετρικός Καμβάς Πλευρών
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Άλλαξε τα μήκη των πλευρών ΑΒ και ΑΓ. Παρατήρησε πώς μεταβάλλεται το σχήμα, η περίμετρος και η κατηγορία του τριγώνου.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Αριστερή Στήλη: Χειριστήρια Πλευρών & Ταυτότητα */}
            <div className="lg:col-span-5 2xl:col-span-5 space-y-6 bg-slate-50 p-6 sm:p-7 2xl:p-9 rounded-3xl border border-slate-200">
              <h4 className="text-xs 2xl:text-sm font-black tracking-wider text-slate-500">
                ΡΥΘΜΙΣΗ ΜΗΚΟΥΣ ΠΛΕΥΡΩΝ
              </h4>

              {/* Stepper Πλευράς ΑΒ (c) */}
              <div className="space-y-2">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Πλευρά ΑΒ (αριστερή):</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-xl text-sky-600 bg-white px-2 py-0.5 rounded-xl border border-sky-200 shadow-sm">
                    {c} cm
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση πλευράς ΑΒ κατά 5 cm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSidec((prev) => Math.max(110, prev - 5));
                    }}
                    disabled={c <= 110}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －5
                  </button>

                  <input
                    type="range"
                    min="110"
                    max="280"
                    step="5"
                    value={c}
                    onChange={(e) => setSidec(Number(e.target.value))}
                    aria-label="Μήκος πλευράς ΑΒ"
                    className="w-full min-w-0 max-w-full accent-sky-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση πλευράς ΑΒ κατά 5 cm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSidec((prev) => Math.min(280, prev + 5));
                    }}
                    disabled={c >= 280}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋5
                  </button>
                </div>
              </div>

              {/* Stepper Πλευράς ΑΓ (b) */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="h-8 flex items-center justify-between text-left">
                  <span className="text-sm 2xl:text-base font-bold text-slate-800">Πλευρά ΑΓ (δεξιά):</span>
                  <span className="min-w-[80px] text-center font-mono font-black text-xl text-indigo-600 bg-white px-2 py-0.5 rounded-lg border border-indigo-200 shadow-sm">
                    {b} cm
                  </span>
                </div>

                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση πλευράς ΑΓ κατά 5 cm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSideb((prev) => Math.max(110, prev - 5));
                    }}
                    disabled={b <= 110}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    －5
                  </button>

                  <input
                    type="range"
                    min="110"
                    max="280"
                    step="5"
                    value={b}
                    onChange={(e) => setSideb(Number(e.target.value))}
                    aria-label="Μήκος πλευράς ΑΓ"
                    className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                  />

                  <button
                    type="button"
                    aria-label="Αύξηση πλευράς ΑΓ κατά 5 cm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSideb((prev) => Math.min(280, prev + 5));
                    }}
                    disabled={b >= 280}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-sm"
                  >
                    ＋5
                  </button>
                </div>
              </div>

              {/* Ένδειξη σταθερής βάσης */}
              <div className="text-center text-xs font-bold text-slate-500 py-1 bg-white rounded-xl border border-slate-200">
                📍 Σταθερή βάση ΒΓ ＝ <span className="text-slate-900 font-black font-mono">{baseSide} cm</span>
              </div>

              {/* Κάρτα Ταυτότητας Τριγώνου */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-sm text-center">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
                  ΚΑΤΗΓΟΡΙΑ ΩΣ ΠΡΟΣ ΤΙΣ ΠΛΕΥΡΕΣ
                </span>
                <div className={`text-2xl sm:text-3xl font-black ${triType.color}`}>
                  {triType.title}
                </div>
                <div className={`p-2.5 rounded-xl border text-xs font-medium ${triType.badgeBg}`}>
                  {triType.desc}
                </div>

                {/* Περίμετρος */}
                <div className="pt-2 border-t border-slate-100 font-mono text-xs sm:text-sm font-bold text-slate-800">
                  Περίμετρος: {c} ＋ {baseSide} ＋ {b} ＝{' '}
                  <span className="text-blue-700 font-black">{perimeter} cm</span>
                </div>
              </div>
            </div>

            {/* Δεξιά Στήλη: SVG Γεωμετρικό Σχήμα */}
            <div className="lg:col-span-7 2xl:col-span-7 bg-slate-50 p-6 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-6">
              <div className="w-full flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 px-1">
                <span>ΓΕΩΜΕΤΡΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΠΛΕΥΡΩΝ</span>
                <span className="font-mono text-blue-600 font-bold">Π ＝ {perimeter} cm</span>
              </div>

              {/* SVG Canvas */}
              <div className="w-full max-w-[540px] aspect-[600/320] bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 600 320" className="w-full h-full drop-shadow-sm">
                  {/* Τρίγωνο ΑΒΓ (γέμισμα) */}
                  <polygon
                    points={`${ax},${ay} ${bx},${by} ${gx},${gy}`}
                    className="fill-sky-500/10 stroke-slate-700 stroke-[3] stroke-linejoin-round"
                  />

                  {/* Πλευρά ΑΒ (Cyan) */}
                  <line x1={bx} y1={by} x2={ax} y2={ay} className="stroke-sky-500 stroke-[4] stroke-linecap-round" />

                  {/* Πλευρά ΑΓ (Indigo) */}
                  <line x1={gx} y1={gy} x2={ax} y2={ay} className="stroke-indigo-500 stroke-[4] stroke-linecap-round" />

                  {/* Βάση ΒΓ (Slate) */}
                  <line x1={bx} y1={by} x2={gx} y2={gy} className="stroke-slate-800 stroke-[4] stroke-linecap-round" />

                  {/* Ετικέτες μηκών πλευρών */}
                  <text
                    x={(bx + ax) / 2 - 25}
                    y={(by + ay) / 2 - 10}
                    className="font-mono text-xs font-black fill-sky-700"
                  >
                    {c} cm
                  </text>
                  <text
                    x={(gx + ax) / 2 + 10}
                    y={(by + ay) / 2 - 10}
                    className="font-mono text-xs font-black fill-indigo-700"
                  >
                    {b} cm
                  </text>
                  <text
                    x="300"
                    y={by + 22}
                    textAnchor="middle"
                    className="font-mono text-xs font-black fill-slate-800"
                  >
                    {baseSide} cm
                  </text>

                  {/* Κορυφές */}
                  <circle cx={ax} cy={ay} r="6" className="fill-slate-900" />
                  <text x={ax} y={ay - 12} textAnchor="middle" className="font-sans text-sm font-black fill-slate-900">
                    Α
                  </text>

                  <circle cx={bx} cy={by} r="6" className="fill-slate-900" />
                  <text x={bx - 16} y={by + 6} textAnchor="end" className="font-sans text-sm font-black fill-slate-900">
                    Β
                  </text>

                  <circle cx={gx} cy={gy} r="6" className="fill-slate-900" />
                  <text x={gx + 16} y={gy + 6} textAnchor="start" className="font-sans text-sm font-black fill-slate-900">
                    Γ
                  </text>
                </svg>
              </div>

              {/* Callout Συμπεράσματος */}
              <div className="w-full max-w-lg p-3.5 bg-slate-100 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm text-slate-700">
                Μήκη: ΑΒ ＝ <strong>{c} cm</strong> • ΒΓ ＝ <strong>{baseSide} cm</strong> • ΑΓ ＝ <strong>{b} cm</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Τρίγωνα ως προς τις Πλευρές!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις γνώσεις σου σε απαιτητικές ασκήσεις κατάταξης τριγώνων, τριγωνικής ανισότητας και υπολογισμού περιμέτρου.
            </p>
          </div>

          <Link
            href="/e-dimotikou/15-trigona-pleures-ask"
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

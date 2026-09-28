// pages/st-dimotikou/59-mikos.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1.5 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1.5 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

// Μορφοποιηση αριθμου (ακεραιος η δεκαδικος με κομμα)
function formatNum(val, decimals = 3) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function MikosTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Μετατροπεας Μηκους (Βαση το Μετρο)
  const [metersValue, setMetersValue] = useState(4.5);

  const conversions = useMemo(() => {
    return {
      km: Number((metersValue / 1000).toFixed(4)),
      m: metersValue,
      dm: Number((metersValue * 10).toFixed(1)),
      cm: Number((metersValue * 100).toFixed(1)),
      mm: Number((metersValue * 1000).toFixed(0))
    };
  }, [metersValue]);

  // Εργαστηριο 2: Υπολογισμος Περιμετρου με Διαφορετικες Μοναδες (m και cm)
  const [fieldLengthM, setFieldLengthM] = useState(12); // σε m
  const [fieldWidthCm, setFieldWidthCm] = useState(850); // σε cm (8,5 m)

  const perimeterData = useMemo(() => {
    const widthInMeters = fieldWidthCm / 100;
    const perimMeters = 2 * (fieldLengthM + widthInMeters);
    const perimCm = perimMeters * 100;
    return {
      widthInM: widthInMeters,
      perimM: perimMeters,
      perimCm: perimCm
    };
  }, [fieldLengthM, fieldWidthCm]);

  return (
    <Layout
      title="Μονάδες Μέτρησης Μήκους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία για τις μονάδες μέτρησης μήκους, τη βασική μονάδα (μέτρο), τα πολλαπλάσια και τις υποδιαιρέσεις, κανόνες μετατροπών, διαδραστικό εργαστήριο και λυμένα προβλήματα για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/59-mikos-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για κινητα εως 2K, 4K & 8K χωρις οριζοντιο scroll */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 59 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μέτρηση Μήκους &amp; Μετατροπές Μονάδων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Κατανοούμε τη θεμελιώδη έννοια του <strong>μήκους</strong>: Γνωρίζουμε τη βασική μονάδα (μέτρο), τα υποπολλαπλάσιά του (δεκατόμετρο, εκατοστόμετρο, χιλιοστόμετρο) και το πολλαπλάσιο (χιλιόμετρο), και μαθαίνουμε τους απαράβατους κανόνες μετατροπής με πολλαπλασιασμό και διαίρεση των δυνάμεων του 10.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κλίμακα Δεκαδικών Μετατροπών &amp; Δυναμικός Υπολογιστής</span>
            </div>
            <Link
              href="/st-dimotikou/59-mikos-ask"
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
              Οι Μονάδες Μήκους σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τη βασική μονάδα αναφοράς μέχρι τη μέθοδο ασφαλών μετατροπών χωρίς αριθμητικά λάθη.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Βασική Μονάδα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Μέτρο (m)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βασική μονάδα μέτρησης του μήκους στο Διεθνές Σύστημα είναι το <strong>μέτρο (m)</strong>.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>1 m:</strong> Περίπου το άνοιγμα του ενός χεριού ενός ενήλικα ή το ύψος ενός θρανίου.</div>
                  <div>• <strong>Μέτρηση:</strong> Μετράμε αποστάσεις, ύψη, πλάτη και περιμέτρους σχημάτων.</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το μέτρο είναι η «βάση» από την οποία παράγονται όλες οι υπόλοιπες μονάδες μήκους.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Υποδιαιρέσεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μικρότερες Μονάδες (Υποδιαιρέσεις)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν μετράμε μικρότερα αντικείμενα χωρίζουμε το μέτρο σε 10, 100 ή 1.000 ίσα μέρη:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-slate-900 font-bold">• 1 dm (δεκατόμετρο) ＝ 0,1 m ＝ 10 cm</div>
                  <div className="text-slate-900 font-bold">• 1 cm (εκατοστόμετρο) ＝ 0,01 m ＝ 10 mm</div>
                  <div className="text-slate-900 font-bold">• 1 mm (χιλιοστόμετρο) ＝ 0,001 m</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Κάθε μονάδα είναι <strong>10 φορές μικρότερη</strong> από την αμέσως προηγούμενή της!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πολλαπλάσιο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Χιλιόμετρο (km)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για μεγάλες αποστάσεις μεταξύ πόλεων, οδικών δικτύων ή χωρών χρησιμοποιούμε το <strong>χιλιόμετρο (km)</strong>:
                </p>

                <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950 font-mono text-center">
                  <div className="font-bold text-sm sm:text-base">
                    1 km ＝ 1.000 m
                  </div>
                  <p className="font-sans text-[11px] text-slate-600 leading-normal text-left">
                    Αντίστροφα: 1 m ＝ 0,001 km (ή 1/1.000 του χιλιομέτρου).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 1 km ισοδυναμεί με περίπου 10 έως 12 λεπτά άνετου περπατήματος ενός ανθρώπου.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Κανόνας Μετατροπών</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Χρυσός Κανόνας της Σκάλας
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πώς κινούμαστε στα σκαλοπάτια των μονάδων μέτρησης:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px] leading-normal">
                    <strong>Από μεγαλύτερη σε μικρότερη (κατεβαίνω):</strong> <em>Πολλαπλασιάζω</em> με 10, 100, 1.000 (π.χ. 3 m ＝ 3 · 100 ＝ 300 cm).
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] leading-normal">
                    <strong>Από μικρότερη σε μεγαλύτερη (ανεβαίνω):</strong> <em>Διαιρώ</em> με 10, 100, 1.000 (π.χ. 450 cm ＝ 450 : 100 ＝ 4,5 m).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Όταν κατεβαίνουμε σκαλοπάτια πολλαπλασιάζουμε, όταν ανεβαίνουμε διαιρούμε!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΚΑΙ ΣΚΑΛΑ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Μετατροπέας Μήκους &amp; Σκάλα Υποδιαιρέσεων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε το μήκος σε μέτρα (m) και παρακολουθήστε πώς μετατρέπεται ταυτόχρονα σε όλες τις μονάδες του μετρικού συστήματος.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηριο Ρυθμισης Μηκους (5 στηλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΑΡΧΙΚΟ ΜΗΚΟΣ ΣΕ ΜΕΤΡΑ (m):
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {formatNum(metersValue, 2)} m
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση μήκους"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMetersValue((prev) => Math.max(0.5, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={metersValue <= 0.5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={metersValue}
                    onChange={(e) => setMetersValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση μήκους"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMetersValue((prev) => Math.min(20, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={metersValue >= 20}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2.5, 5, 10].map((quickVal) => (
                  <button
                    key={`btn-m-${quickVal}`}
                    type="button"
                    onClick={() => setMetersValue(quickVal)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {formatNum(quickVal)} m
                  </button>
                ))}
              </div>
            </div>

            {/* Πινακας Ισοδυναμων Μονάδων (7 στηλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΤΑΥΤΟΧΡΟΝΗ ΑΠΕΙΚΟΝΙΣΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Χιλιόμετρα (km):</span>
                  <span className="font-bold text-purple-700">{formatNum(conversions.km, 4)} km</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-blue-300 flex items-center justify-between bg-blue-50/30">
                  <span className="text-blue-900 font-sans font-bold">Μέτρα (m) [Βάση]:</span>
                  <span className="font-black text-blue-700">{formatNum(conversions.m, 2)} m</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Δεκατόμετρα (dm):</span>
                  <span className="font-bold text-emerald-700">{formatNum(conversions.dm, 1)} dm</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-amber-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Εκατοστόμετρα (cm):</span>
                  <span className="font-bold text-amber-700">{formatNum(conversions.cm, 1)} cm</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-rose-200 flex items-center justify-between sm:col-span-2">
                  <span className="text-slate-600 font-sans">Χιλιοστόμετρα (mm):</span>
                  <span className="font-bold text-rose-700">{formatNum(conversions.mm, 0)} mm</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center font-sans text-xs text-slate-600 space-y-1">
                <div>
                  💡 <strong>Παράδειγμα υπολογισμού:</strong> {formatNum(metersValue)} m ＝ {formatNum(metersValue)} · 100 ＝ <strong>{formatNum(conversions.cm, 1)} cm</strong>.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΕΡΙΜΕΤΡΟΣ ΜΕ ΜΕΤΑΤΡΟΠΗ ΜΟΝΑΔΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΠΡΑΚΤΙΚΗ ΕΦΑΡΜΟΓΗ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Περίμετρος Γηπέδου με Διαφορετικές Μονάδες (m και cm)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σε ένα ορθογώνιο γήπεδο το μήκος δίνεται σε μέτρα (m) και το πλάτος σε εκατοστά (cm). Μετατρέπουμε σε κοινή μονάδα πριν υπολογίσουμε την περίμετρο:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Ρυθμισεις Διαστασεων (5 στηλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Μηκος σε m */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>ΜΗΚΟΣ ΓΗΠΕΔΟΥ (m):</span>
                  <span className="font-mono text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-black">
                    {fieldLengthM} m
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση μήκους γηπέδου"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldLengthM((prev) => Math.max(5, prev - 1)); }}
                    disabled={fieldLengthM <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={30}
                    step={1}
                    value={fieldLengthM}
                    onChange={(e) => setFieldLengthM(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση μήκους γηπέδου"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldLengthM((prev) => Math.min(30, prev + 1)); }}
                    disabled={fieldLengthM >= 30}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Πλατος σε cm */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>ΠΛΑΤΟΣ ΓΗΠΕΔΟΥ (cm):</span>
                  <span className="font-mono text-base sm:text-lg text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-black">
                    {fieldWidthCm} cm
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση πλάτους γηπέδου"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldWidthCm((prev) => Math.max(300, prev - 50)); }}
                    disabled={fieldWidthCm <= 300}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={300}
                    max={2000}
                    step={50}
                    value={fieldWidthCm}
                    onChange={(e) => setFieldWidthCm(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση πλάτους γηπέδου"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFieldWidthCm((prev) => Math.min(2000, prev + 50)); }}
                    disabled={fieldWidthCm >= 2000}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Αναλυση & Υπολογισμος Περιμετρου (7 στηλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ ΜΕ ΜΕΤΑΤΡΟΠΗ ΣΕ ΜΕΤΡΑ
              </span>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">1. Μετατροπή πλάτους σε μέτρα (διαίρεση με 100):</span>
                  <span className="font-mono font-bold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {fieldWidthCm} : 100 ＝ {formatNum(perimeterData.widthInM, 2)} m
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700">2. Υπολογισμός Περιμέτρου: 2 · (μήκος ＋ πλάτος)</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                    2 · ({fieldLengthM} ＋ {formatNum(perimeterData.widthInM, 2)})
                  </span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-300 flex items-center justify-between bg-emerald-50/40">
                  <span className="font-bold text-emerald-950">3. Τελική Περίμετρος Γηπέδου:</span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-300">
                    {formatNum(perimeterData.perimM, 2)} m ({formatNum(perimeterData.perimCm, 0)} cm)
                  </span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium text-center">
                ✅ Ποτέ δεν προσθέτουμε μέτρα με εκατοστά απευθείας! Πρώτα μετατρέπουμε στην ίδια μονάδα.
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα Καθημερινής Ζωής
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο χαρακτηριστικά προβλήματα μετατροπών μήκους με αναλυτική παρουσίαση βήμα προς βήμα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΥΦΑΣΜΑ &amp; ΚΟΡΔΕΛΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Ραπτική</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Κοπή Κορδέλας σε Ίσα Κομμάτια
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Μια μοδίστρα έχει μια κορδέλα μήκους <strong>4,8 m</strong>. Θέλει να κόψει από αυτήν <strong>12</strong> ίσα κομμάτια για διακόσμηση. Πόσα εκατοστά (cm) θα έχει το κάθε κομμάτι;
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ &amp; ΜΕΤΑΤΡΟΠΗ
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Αρχικό Μήκος</span> 4,8 m ＝ 480 cm
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Κομμάτια</span> 12 τεμάχια
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Μετατροπή σε cm:</strong> 4,8 · 100 ＝ <strong>480 cm</strong>.</div>
                  <div>• <strong>Διαίρεση σε 12 κομμάτια:</strong> 480 : 12 ＝ <strong className="text-blue-700">40 cm</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Το κάθε κομμάτι κορδέλας θα έχει μήκος ακριβώς 40 cm (δηλαδή 4 dm ή 0,4 m).
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΟΔΙΚΗ ΔΙΑΔΡΟΜΗ
                </span>
                <span className="text-xs font-bold text-slate-400">Συγκοινωνίες</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Μήκος Διαδρομής Λεωφορείου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα αστικό λεωφορείο εκτελεί μια διαδρομή που αποτελείται από τρία τμήματα: το 1ο τμήμα έχει μήκος <strong>3,2 km</strong>, το 2ο τμήμα <strong>4.500 m</strong> και το 3ο τμήμα <strong>1.300 m</strong>. Πόσα χιλιόμετρα (km) είναι η συνολική διαδρομή;
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΑΝΑΓΩΓΗ ΟΛΩΝ ΤΩΝ ΤΜΗΜΑΤΩΝ ΣΕ km
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1ο Τμήμα</span> 3,2 km
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">2ο Τμήμα</span> 4,5 km
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">3ο Τμήμα</span> 1,3 km
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>2ο τμήμα σε km:</strong> 4.500 : 1.000 ＝ <strong>4,5 km</strong>.</div>
                  <div>• <strong>3ο τμήμα σε km:</strong> 1.300 : 1.000 ＝ <strong>1,3 km</strong>.</div>
                  <div>• <strong>Συνολικό μήκος:</strong> 3,2 ＋ 4,5 ＋ 1,3 ＝ <strong className="text-amber-700">9 km</strong> (ή 9.000 m).</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Μετατρέποντας όλα τα μέτρα σε χιλιόμετρα με διαίρεση διά 1.000, η πρόσθεση γίνεται άμεση και ασφαλής.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μονάδες Μήκους!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπών μονάδων (km, m, dm, cm, mm), περιμέτρων σχημάτων και σύνθετων προβλημάτων καθημερινής ζωής για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/59-mikos-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

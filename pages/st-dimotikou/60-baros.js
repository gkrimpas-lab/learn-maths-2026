// pages/st-dimotikou/60-baros.js
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

export default function BarosTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Μετατροπεας Βαρους (Βαση το Κιλο - kg)
  const [kgValue, setKgValue] = useState(3.5);

  const conversions = useMemo(() => {
    return {
      t: Number((kgValue / 1000).toFixed(4)),
      kg: kgValue,
      g: Number((kgValue * 1000).toFixed(1)),
      mg: Number((kgValue * 1000000).toFixed(0))
    };
  }, [kgValue]);

  // Εργαστηριο 2: Διαδραστικη Ζυγαρια Ισορροπιας (1 kg = 1000 g)
  const [currentGrams, setCurrentGrams] = useState(600);

  const balanceState = useMemo(() => {
    const diff = currentGrams - 1000;
    if (diff === 0) return { status: 'balanced', text: 'Ισορροπία (1 kg ＝ 1.000 g)', tilt: 0 };
    if (diff < 0) return { status: 'under', text: `Υπολείπονται ${1000 - currentGrams} g για ισορροπία`, tilt: -8 };
    return { status: 'over', text: `Περίσσευμα ${currentGrams - 1000} g (υπέρβαρο)`, tilt: 8 };
  }, [currentGrams]);

  return (
    <Layout
      title="Μονάδες Μέτρησης Βάρους & Μετατροπές - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε για τη βασική μονάδα βάρους (χιλιόγραμμο/κιλό), τον τόνο, το γραμμάριο, το χιλιοστόγραμμο, τους κανόνες μετατροπής και τη σχέση καθαρού, μικτού βάρους και αποβάρου."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/60-baros-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 60 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Μονάδες Μέτρησης Βάρους (Μάζας)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς ζυγίζουμε τα σώματα: Γνωρίζουμε τη βασική μονάδα μέτρησης (χιλιόγραμμο ή κιλό), το πολλαπλάσιο (τόνος) και τις υποδιαιρέσεις (γραμμάριο, χιλιοστόγραμμο), μαθαίνουμε τους ασφαλείς κανόνες μετατροπών και εξασκούμαστε στο καθαρό, το μικτό βάρος και το απόβαρο.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κλίμακα Μετατροπών &amp; Διαδραστική Ζυγαριά Ισορροπίας</span>
            </div>
            <Link
              href="/st-dimotikou/60-baros-ask"
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
              Οι Μονάδες Βάρους σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τη βασική μονάδα της καθημερινότητας μέχρι τα μεγάλα φορτία και τα ευαίσθητα φάρμακα.
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
                  Το Χιλιόγραμμο (kg)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βασική μονάδα μέτρησης του βάρους (μάζας) στην καθημερινή μας ζωή είναι το <strong>χιλιόγραμμο</strong>, που συνήθως το λέμε απλά <strong>κιλό (kg)</strong>.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>1 kg:</strong> Ζυγίζει περίπου όσο 1 λίτρο καθαρού νερού.</div>
                  <div>• <strong>Χρήση:</strong> Μετράμε το βάρος των ανθρώπων, των φρούτων, των τροφίμων.</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το κιλό είναι η σταθερή βάση αναφοράς για όλες τις υπόλοιπες μονάδες βάρους.
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
                  Γραμμάριο (g) &amp; Χιλιοστόγραμμο (mg)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για αντικείμενα μικρού βάρους χρησιμοποιούμε τις υποδιαιρέσεις του κιλού:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="text-slate-900 font-bold">• 1 kg ＝ 1.000 g (γραμμάρια)</div>
                  <div className="text-slate-900 font-bold">• 1 g ＝ 1.000 mg (χιλιοστόγραμμα)</div>
                  <div className="text-slate-700 font-sans text-[11px] pt-1 leading-normal">
                    Το γραμμάριο χρησιμοποιείται στη ζαχαροπλαστική και τα μπαχαρικά, ενώ το χιλιοστόγραμμο στα φάρμακα και τα κοσμήματα.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ 1 γραμμάριο είναι 1.000 φορές μικρότερο από το κιλό (1 g ＝ 0,001 kg).
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
                  Ο Τόνος (t)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για τη μέτρηση πολύ μεγάλων φορτίων (οχήματα, πλοία, παραγωγή σιτηρών) χρησιμοποιούμε τον <strong>τόνο (t)</strong>:
                </p>

                <div className="bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-200 text-xs sm:text-sm space-y-2 text-indigo-950 font-mono text-center">
                  <div className="font-bold text-sm sm:text-base">
                    1 t ＝ 1.000 kg ＝ 1.000.000 g
                  </div>
                  <p className="font-sans text-[11px] text-slate-600 leading-normal text-left">
                    Αντίστροφα: 1 kg ＝ 0,001 t (ή 1/1.000 του τόνου).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Ένα μικρό επιβατικό αυτοκίνητο ζυγίζει περίπου 1 έως 1,5 τόνο (1.000 - 1.500 kg).
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εμπορική Ορολογία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μικτό, Καθαρό &amp; Απόβαρο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στο εμπόριο το περιεχόμενο βρίσκεται πάντα μέσα σε συσκευασία:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm font-mono">
                  <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-[11px]">
                    <strong>Μικτό Βάρος:</strong> Βάρος εμπορεύματος ＋ Βάρος συσκευασίας
                  </div>
                  <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px]">
                    <strong>Απόβαρο (τάρα):</strong> Το βάρος μόνο της συσκευασίας (κουτί, τελάρο)
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px]">
                    <strong>Καθαρό Βάρος ＝ Μικτό Βάρος － Απόβαρο</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Πληρώνουμε πάντοτε μόνο το <strong>καθαρό βάρος</strong> του προϊόντος!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΒΑΡΟΥΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Μετατροπέας Βάρους (t, kg, g, mg)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε το βάρος σε κιλά (kg) και παρακολουθήστε πώς μετατρέπεται ταυτόχρονα σε τόνους, γραμμάρια και χιλιοστόγραμμα.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηριο Ρυθμισης Βαρους (5 στηλες) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΑΡΧΙΚΟ ΒΑΡΟΣ ΣΕ ΚΙΛΑ (kg):
                  </span>
                  <span className="font-mono font-black text-base sm:text-xl text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {formatNum(kgValue, 2)} kg
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση βάρους"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setKgValue((prev) => Math.max(0.5, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={kgValue <= 0.5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={kgValue}
                    onChange={(e) => setKgValue(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση βάρους"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setKgValue((prev) => Math.min(20, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={kgValue >= 20}
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
                    key={`btn-kg-${quickVal}`}
                    type="button"
                    onClick={() => setKgValue(quickVal)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {formatNum(quickVal)} kg
                  </button>
                ))}
              </div>
            </div>

            {/* Πινακας Ισοδυναμων Μονάδων (7 στηλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΤΑΥΤΟΧΡΟΝΗ ΑΠΕΙΚΟΝΙΣΗ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ ΒΑΡΟΥΣ
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-mono">
                <div className="p-3 bg-white rounded-2xl border border-purple-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Τόνοι (t):</span>
                  <span className="font-bold text-purple-700">{formatNum(conversions.t, 4)} t</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-blue-300 flex items-center justify-between bg-blue-50/30">
                  <span className="text-blue-900 font-sans font-bold">Κιλά (kg) [Βάση]:</span>
                  <span className="font-black text-blue-700">{formatNum(conversions.kg, 2)} kg</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Γραμμάρια (g):</span>
                  <span className="font-bold text-emerald-700">{formatNum(conversions.g, 1)} g</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-rose-200 flex items-center justify-between">
                  <span className="text-slate-600 font-sans">Χιλιοστόγραμμα (mg):</span>
                  <span className="font-bold text-rose-700">{formatNum(conversions.mg, 0)} mg</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center font-sans text-xs text-slate-600 space-y-1">
                <div>
                  💡 <strong>Κανόνας:</strong> Για να πάμε από kg σε g πολλαπλασιάζουμε επί 1.000 ({formatNum(kgValue)} · 1.000 ＝ <strong>{formatNum(conversions.g, 0)} g</strong>). Για να πάμε σε τόνους (t) διαιρούμε με το 1.000.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΖΥΓΑΡΙΑ ΙΣΟΡΡΟΠΙΑΣ (1 kg = 1.000 g) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>⚖️ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΗ ΙΣΟΡΡΟΠΙΑ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Ζυγαριά Ισορροπίας: Εξισορροπούμε το Αντίβαρο του 1 kg
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Στον αριστερό δίσκο υπάρχει ένα σταθερό αντίβαρο <strong>1 kg</strong>. Προσθέστε ή αφαιρέστε γραμμάρια στον δεξιό δίσκο μέχρι η ζυγαριά να έρθει σε απόλυτη ισορροπία (1.000 g):
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Κουμπιά Προσθήκης Σταθμών (5 στήλες) */}
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  ΒΑΡΟΣ ΣΤΟΝ ΔΕΞΙΟ ΔΙΣΚΟ (ΣΕ ΓΡΑΜΜΑΡΙΑ):
                </span>
                
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs font-semibold text-slate-600">Τρέχοντα Γραμμάρια:</span>
                  <span className="font-mono font-black text-lg sm:text-xl text-amber-700">
                    {currentGrams} g ({formatNum(currentGrams / 1000, 3)} kg)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.max(0, prev - 100))}
                    disabled={currentGrams <= 0}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    － 100 g
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentGrams(1000)}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-black text-emerald-800 shadow-sm transition active:scale-95"
                  >
                    🎯 1.000 g
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.min(2000, prev + 100))}
                    disabled={currentGrams >= 2000}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    ＋ 100 g
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.min(2000, prev + 250))}
                    disabled={currentGrams >= 2000}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    ＋ Σταθμό 250 g
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentGrams((prev) => Math.min(2000, prev + 500))}
                    disabled={currentGrams >= 2000}
                    className="p-2 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-sm transition active:scale-95"
                  >
                    ＋ Σταθμό 500 g
                  </button>
                </div>
              </div>

              <div className={`p-3 rounded-2xl border text-xs font-bold text-center ${
                balanceState.status === 'balanced'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  : balanceState.status === 'under'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                {balanceState.text}
              </div>
            </div>

            {/* Σχημα SVG Ζυγαριας (7 στηλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΣΧΗΜΑ: ΖΥΓΑΡΙΑ ΔΥΟ ΔΙΣΚΩΝ
              </span>

              <div className="w-full max-w-[420px] aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 shadow-inner flex items-center justify-center">
                <svg viewBox="0 0 360 210" className="w-full h-full overflow-visible">
                  {/* Βαση και Κατακορυφος στυλος ζυγαριας */}
                  <rect x="165" y="60" width="10" height="110" fill="#475569" rx="2" />
                  <path d="M 130 185 L 210 185 L 195 170 L 145 170 Z" fill="#334155" />
                  <circle cx="170" cy="60" r="7" fill="#1e293b" />

                  {/* Ζυγος (Κινητη οριζοντια ραβδος με περιστροφη) */}
                  <g transform={`rotate(${balanceState.tilt}, 170, 60)`}>
                    <line x1="50" y1="60" x2="290" y2="60" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* Αριστερος Δισκος (1 kg) */}
                    <line x1="60" y1="60" x2="45" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="60" y1="60" x2="75" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="60" cy="120" rx="30" ry="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                    {/* Αντιβαρο 1 kg */}
                    <rect x="47" y="93" width="26" height="25" fill="#2563eb" rx="3" stroke="#1d4ed8" strokeWidth="1.5" />
                    <text x="60" y="110" fontSize="10" fontWeight="900" fill="#ffffff" textAnchor="middle">
                      1 kg
                    </text>

                    {/* Δεξιος Δισκος (Γραμμαρια) */}
                    <line x1="280" y1="60" x2="265" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <line x1="280" y1="60" x2="295" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                    <ellipse cx="280" cy="120" rx="30" ry="7" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
                    {/* Σταθμα γραμμαριων */}
                    <rect x="264" y="96" width="32" height="22" fill="#d97706" rx="3" stroke="#b45309" strokeWidth="1.5" />
                    <text x="280" y="111" fontSize="9.5" fontWeight="900" fill="#ffffff" textAnchor="middle">
                      {currentGrams}g
                    </text>
                  </g>
                </svg>
              </div>

              <div className="text-[11px] font-mono font-bold text-slate-600 text-center">
                Αριστερός Δίσκος: <strong className="text-blue-700">1 kg</strong> ＝ Δεξιός Δίσκος: <strong className="text-amber-700">1.000 g</strong>
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
              Δύο ολοκληρωμένα προβλήματα με υπολογισμούς καθαρού βάρους και μετατροπές σε τόνους.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΜΙΚΤΟ &amp; ΚΑΘΑΡΟ ΒΑΡΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Εμπόριο Φρούτων</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Καθαρού Βάρους σε Τελάρα Μήλων
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας μανάβης παρέλαβε <strong>20</strong> τελάρα με μήλα. Το μικτό βάρος κάθε τελάρου (μήλα μαζί με το ξύλινο κιβώτιο) ήταν <strong>18,5 kg</strong>. Αν το κάθε άδειο τελάρο (απόβαρο) ζυγίζει <strong>1.500 g</strong>, ποιο είναι το συνολικό καθαρό βάρος των μήλων σε κιλά (kg);
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΑΝΑ ΤΕΛΑΡΟ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Μικτό Βάρος</span> 18,5 kg
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Απόβαρο</span> 1.500 g ＝ 1,5 kg
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τελάρα</span> 20 τεμάχια
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Απόβαρο σε κιλά:</strong> 1.500 : 1.000 ＝ <strong>1,5 kg</strong>.</div>
                  <div>• <strong>Καθαρό βάρος ανά τελάρο:</strong> 18,5 － 1,5 ＝ <strong>17 kg</strong>.</div>
                  <div>• <strong>Συνολικό καθαρό βάρος (20 τελάρα):</strong> 20 · 17 ＝ <strong className="text-blue-700">340 kg</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Το απόβαρο αφαιρείται πάντα στην ίδια μονάδα μέτρησης (kg) πριν πολλαπλασιάσουμε με το πλήθος των κιβωτίων.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΜΕΤΑΦΟΡΕΣ &amp; ΤΟΝΟΙ
                </span>
                <span className="text-xs font-bold text-slate-400">Φορτηγό</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Μέγιστο Φορτίο &amp; Υπέρβαρο σε Τόνους
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα φορτηγό έχει επιτρεπόμενο μέγιστο βάρος φορτίου <strong>3,5 t</strong>. Φορτώθηκαν σε αυτό <strong>80</strong> τσουβάλια τσιμέντου των <strong>40 kg</strong> το καθένα. Πόσους τόνους (t) ζυγίζει το φορτίο και πόσα επιπλέον κιλά (kg) μπορούν να φορτωθούν;
              </p>

              {/* Οπτικος Πινακας Δεδομενων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΦΟΡΤΙΟΥ
                </span>
                <div className="grid grid-cols-2 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Όριο Φορτίου</span> 3,5 t ＝ 3.500 kg
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Τσουβάλια</span> 80 · 40 kg
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Βάρος τσουβαλιών:</strong> 80 · 40 ＝ <strong>3.200 kg</strong>.</div>
                  <div>• <strong>Βάρος σε τόνους:</strong> 3.200 : 1.000 ＝ <strong className="text-amber-700">3,2 t</strong>.</div>
                  <div>• <strong>Υπόλοιπο χωρητικότητας:</strong> 3.500 － 3.200 ＝ <strong className="text-emerald-700">300 kg</strong> (ή 0,3 t).</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Το φορτηγό δεν έχει υπέρβαρο, καθώς τα 3,2 t είναι λιγότερα από το όριο των 3,5 t.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Μονάδες Βάρους!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις μετατροπών μονάδων (t, kg, g, mg), προβλημάτων καθαρού βάρους και ζυγίσεων για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/60-baros-ask"
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

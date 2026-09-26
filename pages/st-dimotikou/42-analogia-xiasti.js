// pages/st-dimotikou/42-analogia-xiasti.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος
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

// Μορφοποιηση αριθμου (ακεραιος ή δεκαδικος με κομμα)
function formatNum(val, decimals = 2) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function XiastiTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Πινακας Ποσων & Τιμων με σχηματισμο «Χ»
  const [valA, setValA] = useState(3);  // π.χ. Εργατες
  const [valB, setValB] = useState(75); // π.χ. Μετρα εργου
  const [valC, setValC] = useState(8);  // Νεοι εργατες

  // Υπολογισμος αγνωστου χ: (valB * valC) / valA
  const calculatedX = useMemo(() => {
    const raw = (valB * valC) / valA;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(2));
  }, [valA, valB, valC]);

  // Εργαστηριο 2: Προβλημα με Δεκαδικους & Μετατροπες Μοναδων
  const [massKg] = useState(2.5); // kg
  const [costEur] = useState(4.5); // €
  const [targetMassG] = useState(1500); // g

  // Υπολογισμος για Εργαστηριο 2 (Μετατροπη targetMassG σε kg -> targetMassG / 1000)
  const targetMassKg = targetMassG / 1000;
  const calculatedCost = useMemo(() => {
    const res = (costEur * targetMassKg) / massKg;
    return Number.isInteger(res) ? res : Number(res.toFixed(2));
  }, [massKg, costEur, targetMassKg]);

  return (
    <Layout
      title="Αναλογία Χιαστί & Πίνακες Ποσών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς οργανώνουμε τα δεδομένα σε πίνακα ποσών και τιμών, πώς εφαρμόζουμε την τεχνική του χιαστί πολλαπλασιασμού και πώς λύνουμε σύνθετα προβλήματα αναλογιών."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/42-analogia-xiasti-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για 2K & 4K και responsive για κινητα */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-24 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 42 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Η Τεχνική της Αναλογίας Χιαστί
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Οργανώνουμε τα δεδομένα κάθε προβλήματος σε πίνακα ποσών και τιμών, εφαρμόζουμε τη σταυρωτή διαγώνια μέθοδο (χιαστί) και επιλύουμε απαιτητικά προβλήματα με άγνωστο όρο χωρίς κόπο.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Πίνακες Ποσών &amp; Σταυρωτός Πολλαπλασιασμός</span>
            </div>
            <Link
              href="/st-dimotikou/42-analogia-xiasti-ask"
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
              Η Μέθοδος Επίλυσης σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς μετατρέπουμε την εκφώνηση ενός προβλήματος σε μαθηματικό πίνακα και πώς βρίσκουμε το αποτέλεσμα.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Οργάνωση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας Ποσών και Τιμών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Το πρώτο και σημαντικότερο βήμα είναι να τοποθετήσουμε τα μεγέθη σε έναν τακτοποιημένο πίνακα δύο στηλών ή δύο γραμμών:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm">
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-blue-100/70 p-2 rounded-xl text-blue-950 font-bold text-[11px] sm:text-xs truncate">Ποσό Α (π.χ. kg)</div>
                    <div className="bg-emerald-100/70 p-2 rounded-xl text-emerald-950 font-bold text-[11px] sm:text-xs truncate">Ποσό Β (π.χ. €)</div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">α</div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">β</div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 font-bold">γ</div>
                    <div className="bg-amber-100 p-2 rounded-xl border border-amber-300 font-bold text-amber-900">χ</div>
                  </div>
                  <p className="text-slate-500 text-[11px] text-center pt-1">
                    Προσέχουμε οι τιμές του ίδιου ποσού να είναι στην ίδια στήλη και στην ίδια μονάδα μέτρησης!
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο πίνακας μας προστατεύει από λάθη τοποθέτησης και δείχνει καθαρά τη διαγώνια σχέση.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Σταυρωτό Σχήμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Σχήμα «Χ» (Χιαστί)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Συνδέουμε διαγώνια τους όρους του πίνακα σχηματίζοντας ένα νοητό «Χ». Οι δύο αριθμοί που συνδέονται μεταξύ τους είναι το γνωστό γινόμενο:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm 2xl:text-base font-mono">
                  <div className="flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-indigo-900">
                    <Fraction num="α" den="γ" />
                    <span>＝</span>
                    <Fraction num="β" den="χ" />
                  </div>
                  <div className="pt-1.5 border-t border-slate-200 text-slate-700 font-sans text-[11px] text-center">
                    Διαγώνιοι: <strong className="text-blue-900">α με χ</strong> και <strong className="text-amber-900">β με γ</strong>.<br />
                    Άρα: <span className="font-mono font-bold text-slate-900">α · χ ＝ β · γ</span>.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ «Χιαστί» σημαίνει σταυρωτά: πολλαπλασιάζουμε διαγώνια τα απέναντι στοιχεία!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ο Χρυσός Κανόνας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Υπολογισμός με 1 Κίνηση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να βρούμε τον άγνωστο όρο <strong>χ</strong> χωρίς να γράφουμε ολόκληρη την εξίσωση, εφαρμόζουμε τον κανόνα:
                </p>

                <div className="bg-indigo-50/80 p-3 sm:p-4 rounded-2xl border border-indigo-200 space-y-1.5 text-xs sm:text-sm">
                  <div className="font-mono font-black text-center text-indigo-950 text-sm sm:text-base">
                    χ ＝ (β · γ) : α
                  </div>
                  <div className="text-slate-700 text-[11px] leading-relaxed text-center pt-0.5 font-sans">
                    <strong>Πολλαπλασιάζουμε</strong> τους δύο αριθμούς της πλήρους διαγωνίου και <strong>διαιρούμε</strong> με τον αριθμό που βρίσκεται διαγώνια απέναντι από το χ.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αυτός ο τύπος λύνει άμεσα το 95% των πρακτικών προβλημάτων του Δημοτικού!
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Παγίδες &amp; Μονάδες</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Προσοχή στις Μονάδες!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στα απαιτητικά προβλήματα οι μονάδες συχνά διαφέρουν. Πριν τοποθετήσουμε τους αριθμούς στον πίνακα:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-[11px]">
                    <strong>Χρόνος:</strong> Αν έχουμε ώρες και λεπτά, μετατρέπουμε τα πάντα σε <em>λεπτά</em> (π.χ. 1 h 30 min ＝ 90 min).
                  </div>
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-[11px]">
                    <strong>Μάζα/Μήκος:</strong> Μετατρέπουμε τα kg σε g ή τα m σε cm (π.χ. 2,5 kg ＝ 2.500 g).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Δεν βάζουμε ποτέ διαφορετικές μονάδες μέτρησης στην ίδια στήλη του πίνακα!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΙΝΑΚΑ ΚΑΙ ΧΙΑΣΤΙ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Πίνακας Ποσών &amp; Χιαστί Επίλυση
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Μεταβάλλετε τις τιμές του προβλήματος και παρακολουθήστε πώς διαμορφώνεται ο πίνακας, τα σταυρωτά βέλη και η τελική τιμή του χ.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Τιμων (3 Steppers) */}
            <div className="lg:col-span-5 space-y-3.5 sm:space-y-4">
              
              {/* Τιμη Α */}
              <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΑΡΧΙΚΗ ΠΟΣΟΤΗΤΑ (α)
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-600 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {valA}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA((prev) => Math.max(1, prev - 1)); }}
                    disabled={valA <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={valA}
                    onChange={(e) => setValA(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValA((prev) => Math.min(15, prev + 1)); }}
                    disabled={valA >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη Β */}
              <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-900 tracking-wider">
                    ΑΝΤΙΣΤΟΙΧΟ ΑΠΟΤΕΛΕΣΜΑ (β)
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-emerald-600 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {valB}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB((prev) => Math.max(10, prev - 5)); }}
                    disabled={valB <= 10}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={10}
                    max={150}
                    step={5}
                    value={valB}
                    onChange={(e) => setValB(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValB((prev) => Math.min(150, prev + 5)); }}
                    disabled={valB >= 150}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Τιμη C */}
              <div className="bg-indigo-50/70 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-indigo-900 tracking-wider">
                    ΝΕΑ ΠΟΣΟΤΗΤΑ (γ)
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-indigo-600 bg-white px-2.5 py-0.5 rounded-lg border border-indigo-200">
                    {valC}
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValC((prev) => Math.max(1, prev - 1)); }}
                    disabled={valC <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={valC}
                    onChange={(e) => setValC(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setValC((prev) => Math.min(20, prev + 1)); }}
                    disabled={valC >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Οπτικος Πινακας με διαγωνια σχεση */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΟΡΓΑΝΩΣΗ ΣΕ ΠΙΝΑΚΑ ΠΟΣΩΝ &amp; ΤΙΜΩΝ
              </div>

              {/* Πινακας 2x2 Responsive Χωρις Scroll */}
              <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-md p-3 sm:p-4 space-y-2.5">
                <div className="grid grid-cols-2 gap-2 text-center border-b pb-1.5 border-slate-200 font-bold text-xs sm:text-sm text-slate-600">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">ΠΟΣΟ 1</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900 truncate">ΠΟΣΟ 2</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-center font-mono font-black text-lg sm:text-2xl text-slate-800 py-1">
                  {/* Γραμμη 1 */}
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-blue-800">
                    {valA}
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-emerald-800">
                    {valB}
                  </div>

                  {/* Γραμμη 2 */}
                  <div className="bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-indigo-800">
                    {valC}
                  </div>
                  <div className="bg-amber-100 p-2.5 rounded-xl border-2 border-amber-400 text-amber-950 animate-pulse">
                    χ
                  </div>
                </div>

                <div className="text-center text-xs font-bold text-indigo-900 pt-0.5">
                  Σταυρωτό γινόμενο: <span className="font-mono">{valA} · χ ＝ {valB} · {valC}</span>
                </div>
              </div>

              {/* Αναλυση του τυπου */}
              <div className="bg-white p-4 rounded-2xl border border-indigo-100 text-center space-y-1.5">
                <span className="text-[11px] sm:text-xs text-slate-500 uppercase font-bold block">
                  ΥΠΟΛΟΓΙΣΜΟΣ ΤΟΥ ΑΓΝΩΣΤΟΥ Χ
                </span>
                <div className="text-base sm:text-xl font-black font-mono text-slate-900">
                  χ ＝ ({valB} · {valC}) : {valA} ＝ {valB * valC} : {valA} ＝{' '}
                  <span className="text-emerald-600 underline decoration-emerald-400 decoration-4">
                    {formatNum(calculatedX)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 pt-0.5">
                  Πολλαπλασιάσαμε τη γνωστή διαγώνιο ({valB} · {valC} ＝ {valB * valC}) και διαιρέσαμε με το {valA}.
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΠΑΙΤΗΤΙΚΟ ΠΡΟΒΛΗΜΑ ΜΕ ΔΕΚΑΔΙΚΟΥΣ & ΜΕΤΑΤΡΟΠΕΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
                <span>🥤 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Σύνθετο Πρόβλημα: Δεκαδικοί &amp; Μετατροπές Μονάδων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Παράδειγμα: Αν τα {formatNum(massKg)} kg τυριού κοστίζουν {formatNum(costEur)} €, πόσο κοστίζουν τα {targetMassG} g από το ίδιο τυρί;
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Καρτα 1: Μετατροπη */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                ΒΗΜΑ 1: ΜΕΤΑΤΡΟΠΗ
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Ίδιες Μονάδες Μέτρησης
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Το ένα ποσό δίνεται σε <strong className="text-blue-900">kg</strong> και το άλλο σε <strong className="text-amber-900">g</strong>. Πρέπει να είναι ίδια:
              </p>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-800 text-xs sm:text-sm text-center">
                {targetMassG} g ＝ {formatNum(targetMassKg)} kg
              </div>
              <p className="text-[11px] text-slate-500">
                Διαιρούμε τα γραμμάρια με το 1.000 για να γίνουν κιλά.
              </p>
            </div>

            {/* Καρτα 2: Στησιμο Πινακα */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-sky-100 text-sky-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                ΒΗΜΑ 2: ΠΙΝΑΚΑΣ
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Τοποθέτηση σε Πίνακα
              </h4>
              <div className="bg-white rounded-xl border border-slate-200 p-2 font-mono text-xs sm:text-sm text-center">
                <div className="grid grid-cols-2 gap-1 font-bold border-b border-slate-200 pb-1 text-slate-500">
                  <span>Βάρος (kg)</span>
                  <span>Κόστος (€)</span>
                </div>
                <div className="grid grid-cols-2 gap-1 pt-1.5 font-bold text-slate-800">
                  <span>{formatNum(massKg)}</span>
                  <span>{formatNum(costEur)}</span>
                  <span>{formatNum(targetMassKg)}</span>
                  <span className="text-amber-600 font-black">χ</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Και τα δύο βάρη είναι πλέον σε κιλά (kg).
              </p>
            </div>

            {/* Καρτα 3: Υπολογισμος Χιαστι */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs font-black rounded-lg inline-block">
                ΒΗΜΑ 3: ΧΙΑΣΤΙ
              </span>
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Υπολογισμός Κόστους
              </h4>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-emerald-800 text-xs sm:text-sm text-center space-y-0.5">
                <div>χ ＝ ({formatNum(costEur)} · {formatNum(targetMassKg)}) : {formatNum(massKg)}</div>
                <div className="text-base sm:text-lg text-emerald-600 font-black pt-0.5">
                  χ ＝ {formatNum(calculatedCost)} €
                </div>
              </div>
              <p className="text-[11px] text-slate-500 text-center">
                Βρήκαμε το τελικό κόστος με μία απλή πράξη.
              </p>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στην Αναλογία Χιαστί!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με πίνακες ποσών και τιμών, σταυρωτό πολλαπλασιασμό και σύνθετα προβλήματα με δεκαδικούς αριθμούς.
            </p>
          </div>

          <Link
            href="/st-dimotikou/42-analogia-xiasti-ask"
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

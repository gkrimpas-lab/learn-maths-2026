// pages/st-dimotikou/49-antistrofos-analoga-posa.js
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

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function AntistrofosAnalogaPosaTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Εξομοιωτης Εργατων & Ημερων (Σταθερο Γινομενο)
  const totalWorkUnits = 24; // Σταθερό έργο: 24 εργατοημέρες
  const [workers, setWorkers] = useState(4); // Αριθμός εργατών

  const daysNeeded = useMemo(() => {
    return Number((totalWorkUnits / workers).toFixed(1));
  }, [workers]);

  // Εργαστηριο 2: Ταχυτητα & Χρονος Ταξιδιου (Αποσταση 120 km)
  const [speed, setSpeed] = useState(60); // km/h
  const travelTime = useMemo(() => {
    return Number((120 / speed).toFixed(1));
  }, [speed]);

  return (
    <Layout
      title="Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πότε δύο ποσά είναι αντιστρόφως ανάλογα, ποια είναι η ιδιότητα του σταθερού γινομένου και πώς λύνουμε προβλήματα με διαδραστικά εργαστήρια."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/49-antistrofos-analoga-posa-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-24 overflow-x-hidden">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 49 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε τα ποσά που συμπεριφέρονται αντίστροφα: Όταν το ένα πολλαπλασιάζεται με έναν αριθμό, το άλλο <strong>διαιρείται</strong> με τον ίδιο αριθμό. Το μυστικό τους κλειδί είναι το <strong>σταθερό γινόμενο</strong> ($x \cdot y = \sigma\tau\alpha\theta.$).
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Λυμένα Προβλήματα &amp; Διαδραστικοί Εξομοιωτές</span>
            </div>
            <Link
              href="/st-dimotikou/49-antistrofos-analoga-posa-ask"
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
              Βασικές Αρχές των Αντιστρόφως Αναλόγων Ποσών
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς τα αναγνωρίζουμε και πώς ξεχωρίζουν από τα ανάλογα ποσά.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πότε είναι Αντιστρόφως Ανάλογα;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Δύο ποσά λέγονται <strong>αντιστρόφως ανάλογα</strong> όταν, καθώς οι τιμές του ενός πολλαπλασιάζονται με έναν αριθμό, οι αντίστοιχες τιμές του άλλου <strong>διαιρούνται</strong> με τον ίδιο αριθμό:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
                  <div>• Διπλάσιοι εργάτες ➔ <strong>Μισός</strong> χρόνος</div>
                  <div>• Τριπλάσια ταχύτητα ➔ <strong>Υποτριπλάσιος</strong> χρόνος</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το ένα ποσό αυξάνεται και το άλλο μειώνεται στον ίδιο ακριβώς ρυθμό.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Η Βασική Ιδιότητα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Σταθερό Γινόμενο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στα αντιστρόφως ανάλογα ποσά, το γινόμενο των αντίστοιχων τιμών τους παραμένει <strong>ΠΑΝΤΟΤΕ ΣΤΑΘΕΡΟ</strong>:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 text-center font-mono text-xs sm:text-sm">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 font-bold text-amber-950">
                    x · y ＝ Σταθερό Γινόμενο
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν πολλαπλασιάσουμε οποιοδήποτε ζευγάρι αντίστοιχων τιμών, βρίσκουμε πάντα το ίδιο αποτέλεσμα!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Επίλυση με Εξίσωση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Όχι Χιαστί Πολλαπλασιασμός!
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στα αντιστρόφως ανάλογα ποσά <strong>ΔΕΝ</strong> κάνουμε χιαστί γινόμενα. Εξισώνουμε τα οριζόντια γινόμενα:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 font-mono text-xs space-y-1 text-center">
                  <div className="text-slate-800 font-bold">
                    x₁ · y₁ ＝ x₂ · y₂
                  </div>
                  <div className="text-indigo-700 font-black">
                    χ ＝ (x₁ · y₁) : x₂
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Πολλαπλασιάζουμε το γνωστό ζευγάρι και διαιρούμε με τον τρίτο αριθμό.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αναγωγή στη Μονάδα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αναγωγή στη Μονάδα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Βρίσκουμε πρώτα τι θα έκανε η <strong>1 μονάδα</strong> (π.χ. ο 1 εργάτης) πολλαπλασιάζοντας:
                </p>

                <div className="bg-slate-50 p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs font-mono text-center">
                  <div className="p-1.5 bg-white rounded-xl border border-slate-200 text-slate-800 font-bold text-[11px] sm:text-xs">
                    4 εργάτες ➔ 6 ημέρες (4 · 6 ＝ 24)
                  </div>
                  <p className="text-slate-600 text-[10.5px] font-sans">
                    Ο 1 εργάτης θα χρειαζόταν 24 ημέρες. Οι 8 εργάτες θα χρειαστούν: 24 : 8 ＝ <strong>3 ημέρες</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Απλή λογική χωρίς αποστήθιση τύπων.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΕΡΓΑΤΩΝ ΚΑΙ ΗΜΕΡΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής Εργατών &amp; Ημερών (Έργο 24 Εργατοημερών)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Αλλάξτε τον αριθμό των εργατών και παρατηρήστε πώς μειώνονται οι ημέρες ώστε το γινόμενο να μένει πάντα ίσο με 24.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηριο Slider Εργατων */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-left">
                  <span className="text-[11px] sm:text-xs font-black uppercase text-slate-800 tracking-wider">
                    ΑΡΙΘΜΟΣ ΕΡΓΑΤΩΝ:
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {workers} εργάτες
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers((prev) => Math.max(1, prev - 1)); }}
                    disabled={workers <= 1}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    step={1}
                    value={workers}
                    onChange={(e) => setWorkers(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers((prev) => Math.min(12, prev + 1)); }}
                    disabled={workers >= 12}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 4, 8].map((w) => (
                  <button
                    key={`w-btn-${w}`}
                    type="button"
                    onClick={() => setWorkers(w)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1.5 rounded-xl font-bold text-xs text-slate-700 shadow-sm transition active:scale-95 text-center"
                  >
                    {w} {w === 1 ? 'εργάτης' : 'εργάτες'}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 leading-relaxed text-center">
                Σταθερό έργο: {workers} · {formatNum(daysNeeded)} ＝ <strong>24 εργατοημέρες</strong>.
              </div>
            </div>

            {/* Πινακας & Αποτέλεσμα */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4 w-full">
              <div className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΑΝΤΙΣΤΡΟΦΩΣ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ
              </div>

              {/* Πινακας - Χωρις Scroll */}
              <div className="w-full max-w-sm mx-auto bg-white rounded-2xl border-2 border-slate-300 shadow-sm p-3 sm:p-4 space-y-2.5 font-mono text-center">
                <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-2 font-bold text-slate-600 text-xs sm:text-sm">
                  <span className="bg-blue-50 py-1 rounded-lg text-blue-900 truncate">Εργάτες (x)</span>
                  <span className="bg-emerald-50 py-1 rounded-lg text-emerald-900 truncate">Ημέρες (y)</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1 text-base sm:text-xl font-black text-slate-800">
                  <div className="bg-slate-100 p-2 rounded-xl">{workers}</div>
                  <div className="bg-emerald-100 p-2 rounded-xl text-emerald-800 border border-emerald-300">
                    {formatNum(daysNeeded)}
                  </div>
                </div>
                <div className="text-[11px] sm:text-xs font-sans text-slate-500 pt-1">
                  Γινόμενο: {workers} · {formatNum(daysNeeded)} ＝ <strong>24</strong> (Σταθερό)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-slate-500 uppercase block">
                    ΕΡΓΑΤΕΣ
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-blue-700">
                    {workers}
                  </div>
                </div>

                <div className="p-3 bg-white rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
                  <span className="text-[10.5px] sm:text-xs font-bold text-emerald-900 uppercase block">
                    ΗΜΕΡΕΣ ΠΟΥ ΑΠΑΙΤΟΥΝΤΑΙ
                  </span>
                  <div className="font-mono font-black text-lg sm:text-2xl text-emerald-700">
                    {formatNum(daysNeeded)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΧΥΤΗΤΑ & ΧΡΟΝΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΤΑΧΥΤΗΤΑ &amp; ΧΡΟΝΟΣ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Ταξίδι Απόστασης 120 km
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Όσο αυξάνεται η μέση ταχύτητα του οχήματος, τόσο λιγότερος χρόνος απαιτείται για να καλυφθεί η ίδια απόσταση (120 km):
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
            <div className="space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>ΤΑΧΥΤΗΤΑ ΟΧΗΜΑΤΟΣ (km/h):</span>
                  <span className="font-mono text-sm sm:text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-black">
                    {speed} km/h
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={120}
                  step={10}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[40, 60, 80, 120].map((s) => (
                  <button
                    key={`sp-${s}`}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-1 rounded-xl font-bold text-xs text-slate-700 shadow-sm transition active:scale-95 text-center"
                  >
                    {s} km/h
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 sm:p-6 rounded-3xl border border-emerald-200 text-center space-y-2">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-950 uppercase tracking-wider block">
                ΧΡΟΝΟΣ ΤΑΞΙΔΙΟΥ
              </span>
              <div className="font-mono font-black text-2xl sm:text-4xl text-emerald-700">
                {formatNum(travelTime)} {travelTime === 1 ? 'ώρα' : 'ώρες'}
              </div>
              <p className="text-xs text-slate-600 font-mono">
                Γινόμενο: {speed} km/h · {formatNum(travelTime)} h ＝ <strong>120 km</strong> (Σταθερή Απόσταση)
              </p>
            </div>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Αντιστρόφως Ανάλογα Ποσά
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο ολοκληρωμένα παραδείγματα καθημερινής ζωής με αναλυτική παρουσίαση της μεθοδολογίας.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΕΡΓΑΤΕΣ ΚΑΙ ΧΡΟΝΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Κατασκευή</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Ελαιοχρωματισμός Κτιρίου
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένα συνεργείο <strong>6 ελαιοχρωματιστών</strong> βάφει ένα σχολείο σε <strong>8 ημέρες</strong>. Πόσες ημέρες θα χρειάζονταν <strong>12 ελαιοχρωματιστές</strong> με τον ίδιο ρυθμό εργασίας;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">1ο Βήμα: Έλεγχος των ποσών</span>
                  <div className="font-sans text-xs">Διπλάσιοι εργάτες ➔ Μισές ημέρες. Τα ποσά είναι αντιστρόφως ανάλογα (σταθερό γινόμενο).</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">2ο Βήμα: Υπολογισμός με σταθερό γινόμενο</span>
                  <div>6 · 8 ＝ 12 · χ ➔ 48 ＝ 12 · χ ➔ χ ＝ 48 : 12 ＝ <strong className="text-emerald-700 text-sm sm:text-base">4 ημέρες</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                ✓ Οι 12 εργάτες θα χρειαστούν ακριβώς 4 ημέρες.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΒΡΥΣΕΣ ΚΑΙ ΧΡΟΝΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Δεξαμενή</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Γέμισμα Δεξαμενής με Βρύσες
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <strong>3 ίδιες βρύσες</strong> γεμίζουν μια δεξαμενή σε <strong>6 ώρες</strong>. Αν ανοίξουμε <strong>9 ίδιες βρύσες</strong>, σε πόσες ώρες θα γεμίσει η δεξαμενή;
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">1ο Βήμα: Σταθερό γινόμενο βρυσών και ωρών</span>
                  <div>3 · 6 ＝ <strong>18</strong> (σταθερό γινόμενο)</div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">2ο Βήμα: Υπολογισμός για 9 βρύσες</span>
                  <div>χ ＝ 18 : 9 ＝ <strong className="text-amber-800 text-sm sm:text-base">2 ώρες</strong></div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                ✓ Οι 9 βρύσες (τριπλάσιες) γεμίζουν τη δεξαμενή στον ένα τρίτο του χρόνου (2 ώρες).
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Αντιστρόφως Ανάλογα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με σταθερά γινόμενα, εργάτες, βρύσες, ταχύτητες και αναγωγή στη μονάδα για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/49-antistrofos-analoga-posa-ask"
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

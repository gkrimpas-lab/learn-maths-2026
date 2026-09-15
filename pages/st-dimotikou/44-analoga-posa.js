// pages/st-dimotikou/44-analoga-posa.js
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

export default function AnalogaPosaTheoryPage() {
  // Εργαστηριο 1: Συντελεστης Αναλογιας λ (π.χ. τιμη ανα κιλο)
  const [lambda, setLambda] = useState(3.5); // λ = 3,5 €/kg
  const [selectedKg, setSelectedKg] = useState(4); // χ

  // Υπολογισμος κοστους για επιλεγμενο χ
  const currentCost = useMemo(() => {
    return Number((lambda * selectedKg).toFixed(2));
  }, [lambda, selectedKg]);

  // Τιμες πινακα αναλογιας για x = 1, 2, 3, 4, 5
  const tableValues = useMemo(() => {
    return [1, 2, 3, 4, 5].map((x) => ({
      x,
      y: Number((lambda * x).toFixed(2)),
      ratio: formatNum(Number((lambda * x).toFixed(2)) / x)
    }));
  }, [lambda]);

  // Εργαστηριο 2: Ταχυτητα σε σχεση με χρονο & γραφικη παρασταση (ευθεια)
  const [speed, setSpeed] = useState(60); // 60 km/h (σταθερος λογος)
  const [activeHour, setActiveHour] = useState(3);

  const points = useMemo(() => {
    return [0, 1, 2, 3, 4].map((t) => ({
      t,
      d: speed * t
    }));
  }, [speed]);

  return (
    <Layout
      title="Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για τα ανάλογα ποσά, τον συντελεστή αναλογίας, τον πίνακα τιμών, τη γραφική παράσταση και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/44-analoga-posa-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Container πληρους ευρους για 2K & 4K και responsive για κινητα */}
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 44 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πότε δύο ποσά λέγονται ανάλογα, πώς ο σταθερός λόγος τους ορίζει τον συντελεστή αναλογίας, πώς διαβάζουμε τον πίνακα τιμών και γιατί η γραφική τους παράσταση είναι πάντοτε μια ευθεία γραμμή.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Πίνακας Συντελεστή Αναλογίας</span>
            </div>
            <Link
              href="/st-dimotikou/44-analoga-posa-ask"
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
              Η μαθηματική σχέση των ανάλογων ποσών και τα κριτήρια αναγνώρισής τους.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-6 2xl:gap-8">
            
            {/* Βημα 1ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πότε δύο Ποσά είναι Ανάλογα;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δύο ποσά ονομάζονται <strong>ανάλογα</strong> όταν, καθώς πολλαπλασιάζεται ή διαιρείται η τιμή του ενός με έναν αριθμό, <strong>πολλαπλασιάζεται ή διαιρείται και η τιμή του άλλου με τον ίδιο ακριβώς αριθμό</strong>.
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">Παραδείγματα στην πράξη:</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Διπλάσια κιλά πορτοκαλιών ➔ <strong>Διπλάσιο κόστος</strong>.</li>
                    <li>• Τριπλάσιος χρόνος εργασίας ➔ <strong>Τριπλάσια αμοιβή</strong>.</li>
                    <li>• Μισή ποσότητα αλευριού ➔ <strong>Μισά ψωμιά</strong>.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν το ένα ποσό αυξάνεται αλλά το άλλο δεν αυξάνεται με τον ίδιο ρυθμό, τότε τα ποσά <strong>δεν</strong> είναι ανάλογα!
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Σταθερός Λόγος</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συντελεστής Αναλογίας (λ)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε δύο ανάλογα ποσά, <strong>ο λόγος (το πηλίκο) των αντίστοιχων τιμών τους παραμένει πάντα σταθερός</strong>. Ο σταθερός αυτός αριθμός ονομάζεται <strong>συντελεστής αναλογίας</strong> (<span className="font-mono font-bold">λ</span>):
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="flex items-center justify-center text-base sm:text-lg font-bold text-amber-900">
                    <Fraction num="ψ" den="χ" />
                    <span className="mx-2">＝</span>
                    <span className="font-mono font-black text-xl text-amber-800">λ</span>
                    <span className="mx-2">ή</span>
                    <span className="font-mono font-black text-xl text-amber-800">ψ ＝ λ · χ</span>
                  </div>
                  <p className="text-slate-500 text-xs pt-1">
                    Όπου <span className="font-bold">χ</span> το πρώτο ποσό, <span className="font-bold">ψ</span> το δεύτερο ποσό και <span className="font-bold">λ</span> ο σταθερός συντελεστής (π.χ. τιμή μονάδας).
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Ο συντελεστής αναλογίας φανερώνει πόσες φορές είναι μεγαλύτερο το ένα μέγεθος από το άλλο.
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πίνακας Τιμών</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Πίνακας Ανάλογων Ποσών
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στον πίνακα τιμών δύο ανάλογων ποσών, κάθε τιμή της δεύτερης γραμμής προκύπτει πολλαπλασιάζοντας την αντίστοιχη τιμή της πρώτης με το <span className="font-bold">λ</span>:
                </p>

                <div className="bg-slate-50 p-3 2xl:p-4 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm space-y-2">
                  <div className="grid grid-cols-4 gap-1 text-center border-b pb-1 font-bold text-slate-600">
                    <span>Ποσό χ</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-bold text-indigo-900">
                    <span>Ποσό ψ</span>
                    <span>3</span>
                    <span>6</span>
                    <span>9</span>
                  </div>
                  <div className="text-[11px] text-slate-500 text-center pt-1 font-sans">
                    Πηλίκα: 3 : 1 ＝ 6 : 2 ＝ 9 : 3 ＝ <strong>3 (σταθερό λ)</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Για να ελέγξουμε αν ένας πίνακας περιέχει ανάλογα ποσά, διαιρούμε τα ζεύγη τιμών. Αν τα πηλίκα είναι ίσα, είναι ανάλογα!
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Διάγραμμα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γραφική Παράσταση
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν τοποθετήσουμε τα ζεύγη τιμών δύο ανάλογων ποσών σε σύστημα αξόνων, όλα τα σημεία βρίσκονται πάνω στην ίδια γραμμή:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-center">
                    Η γραφική παράσταση ανάλογων ποσών είναι πάντοτε ΕΥΘΕΙΑ ΓΡΑΜΜΗ που περνά από το σημείο (0, 0).
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Αν η γραμμή είναι καμπύλη ή δεν ξεκινά από το μηδέν (0, 0), τότε τα ποσά <strong>δεν</strong> είναι ανάλογα.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Το σημείο (0, 0) σημαίνει ότι όταν η μία ποσότητα είναι μηδέν, και η άλλη είναι υποχρεωτικά μηδέν.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΣΥΝΤΕΛΕΣΤΗΣ ΑΝΑΛΟΓΙΑΣ & ΠΙΝΑΚΑΣ ΤΙΜΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Πίνακας Τιμών &amp; Συντελεστής Αναλογίας (λ)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε τον συντελεστή αναλογίας λ (π.χ. τιμή ανά κιλό) και δείτε πώς διαμορφώνεται αυτόματα ο πίνακας τιμών και τα σταθερά πηλίκα.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηριο Συντελεστη λ */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                    ΣΥΝΤΕΛΕΣΤΗΣ ΑΝΑΛΟΓΙΑΣ (λ)
                  </span>
                  <span className="font-mono font-black text-xl text-amber-800 bg-white px-3 py-0.5 rounded-lg border border-amber-200">
                    λ ＝ {formatNum(lambda)}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLambda((prev) => Math.max(1, Number((prev - 0.5).toFixed(1)))); }}
                    disabled={lambda <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    step={0.5}
                    value={lambda}
                    onChange={(e) => setLambda(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLambda((prev) => Math.min(8, Number((prev + 0.5).toFixed(1)))); }}
                    disabled={lambda >= 8}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ερμηνεία: Για κάθε 1 μονάδα του πρώτου ποσού, αντιστοιχούν <strong>{formatNum(lambda)}</strong> μονάδες του δεύτερου ποσού (τύπος: <span className="font-mono font-bold">ψ ＝ {formatNum(lambda)} · χ</span>).
                </p>
              </div>

              {/* Δοκιμη συγκεκριμενης τιμης */}
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΕΠΙΛΕΞΤΕ ΠΟΣΟΤΗΤΑ (χ)
                  </span>
                  <span className="font-mono font-black text-lg text-blue-800 bg-white px-2.5 py-0.5 rounded-lg border border-blue-200">
                    χ ＝ {selectedKg}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedKg((prev) => Math.max(1, prev - 1)); }}
                    disabled={selectedKg <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={selectedKg}
                    onChange={(e) => setSelectedKg(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedKg((prev) => Math.min(10, prev + 1)); }}
                    disabled={selectedKg >= 10}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
                <div className="pt-2 text-center font-bold text-slate-800 text-xs sm:text-sm">
                  Υπολογισμός: ψ ＝ {formatNum(lambda)} · {selectedKg} ＝ <span className="font-mono text-emerald-700 text-base">{formatNum(currentCost)}</span>
                </div>
              </div>

            </div>

            {/* Πινακας Τιμων & Πηλικων */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΜΕ ΣΤΑΘΕΡΑ ΠΗΛΙΚΑ (ψ : χ ＝ λ)
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm text-center text-xs sm:text-sm font-mono overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3">Ποσό χ (π.χ. kg)</th>
                      {tableValues.map((item) => (
                        <th key={`head-x-${item.x}`} className="p-3">{item.x}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 text-indigo-900 font-bold">
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50">Ποσό ψ (π.χ. €)</td>
                      {tableValues.map((item) => (
                        <td key={`body-y-${item.x}`} className="p-3 font-black text-indigo-700">
                          {formatNum(item.y)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-amber-50/50 text-amber-950 font-bold">
                      <td className="p-3 font-semibold text-slate-600">Λόγος (ψ : χ)</td>
                      {tableValues.map((item) => (
                        <td key={`body-ratio-${item.x}`} className="p-3 text-amber-800">
                          {item.ratio}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase block">
                  ΒΑΣΙΚΗ ΙΔΙΟΤΗΤΑ
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Όλα τα πηλίκα των αντίστοιχων τιμών είναι ίσα μεταξύ τους και ισούνται ακριβώς με τον συντελεστή αναλογίας: <strong className="font-mono text-emerald-700">λ ＝ {formatNum(lambda)}</strong>.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ ΑΝΑΛΟΓΩΝ ΠΟΣΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>📈 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Η Γραφική Παράσταση είναι Ευθεία Γραμμή
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Σταθερή ταχύτητα σε σχέση με τον χρόνο: Παρατηρήστε πώς τα σημεία σχηματίζουν μια ευθεία γραμμή που ξεκινά πάντοτε από την αρχή των αξόνων (0, 0).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Ρυθμισεις Ταχυτητας & Ωρας */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    ΣΤΑΘΕΡΗ ΤΑΧΥΤΗΤΑ (λ σε km/h)
                  </span>
                  <span className="font-mono font-black text-lg text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {speed} km/h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeed((prev) => Math.max(40, prev - 10)); }}
                    disabled={speed <= 40}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    step={10}
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeed((prev) => Math.min(100, prev + 10)); }}
                    disabled={speed >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    ΧΡΟΝΟΣ (ΩΡΕΣ t)
                  </span>
                  <span className="font-mono font-black text-lg text-blue-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {activeHour} h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveHour((prev) => Math.max(1, prev - 1)); }}
                    disabled={activeHour <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={activeHour}
                    onChange={(e) => setActiveHour(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveHour((prev) => Math.min(4, prev + 1)); }}
                    disabled={activeHour >= 4}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm text-emerald-950">
                📍 <strong>Σημείο στο διάγραμμα:</strong> Σε <span className="font-bold font-mono">{activeHour} h</span>, η απόσταση είναι <span className="font-bold font-mono">{speed * activeHour} km</span> ➔ Συντεταγμένες: <strong className="font-mono">({activeHour}, {speed * activeHour})</strong>.
              </div>

            </div>

            {/* SVG Διαγραμμα Αξονων */}
            <div className="lg:col-span-7 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                ΓΡΑΦΗΜΑ ΣΥΣΤΗΜΑΤΟΣ ΑΞΟΝΩΝ
              </span>

              <div className="w-full max-w-[420px] aspect-square bg-white rounded-2xl border border-slate-200 p-4 relative shadow-inner">
                <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                  {/* Πλεγμα */}
                  {[1, 2, 3, 4].map((i) => (
                    <line
                      key={`grid-x-${i}`}
                      x1={50 + i * 75}
                      y1={50}
                      x2={50 + i * 75}
                      y2={350}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}
                  {[1, 2, 3, 4].map((i) => (
                    <line
                      key={`grid-y-${i}`}
                      x1={50}
                      y1={350 - i * 70}
                      x2={350}
                      y2={350 - i * 70}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Αξονες */}
                  <line x1="50" y1="350" x2="370" y2="350" stroke="#334155" strokeWidth="2.5" />
                  <line x1="50" y1="350" x2="50" y2="30" stroke="#334155" strokeWidth="2.5" />

                  {/* Βελη αξονων */}
                  <polygon points="370,346 378,350 370,354" fill="#334155" />
                  <polygon points="46,30 50,22 54,30" fill="#334155" />

                  {/* Ετικετες αξονων */}
                  <text x="365" y="375" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="end">Χρόνος t (h)</text>
                  <text x="25" y="25" fontSize="11" fontWeight="bold" fill="#64748b">Απόσταση d (km)</text>

                  {/* Αριθμοι αξονα X */}
                  {[1, 2, 3, 4].map((h) => (
                    <text key={`tx-${h}`} x={50 + h * 75} y="368" fontSize="12" fontWeight="bold" fill="#475569" textAnchor="middle">
                      {h}
                    </text>
                  ))}

                  {/* Αριθμοι αξονα Y (αναλογικα) */}
                  {[1, 2, 3, 4].map((step) => (
                    <text key={`ty-${step}`} x="42" y={355 - step * 70} fontSize="11" fontWeight="bold" fill="#475569" textAnchor="end">
                      {step * 100}
                    </text>
                  ))}

                  {/* Ευθεια Γραμμη Αναλογιας (απο το (0,0) μεχρι t=4) */}
                  {/* Υπολογισμος y pixel: 350 - (d / 400) * 280 */}
                  <line
                    x1="50"
                    y1="350"
                    x2={50 + 4 * 75}
                    y2={350 - ((speed * 4) / 400) * 280}
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Σημειο (0,0) */}
                  <circle cx="50" cy="350" r="5" fill="#0f172a" />
                  <text x="40" y="365" fontSize="11" fontWeight="bold" fill="#0f172a">0</text>

                  {/* Ενεργο σημειο */}
                  <circle
                    cx={50 + activeHour * 75}
                    cy={350 - ((speed * activeHour) / 400) * 280}
                    r="7"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                </svg>
              </div>

              <span className="text-xs text-slate-500 font-semibold mt-3 text-center">
                Η ευθεία περνά από το (0, 0) επειδή σε χρόνο 0 h διανύουμε ακριβώς 0 km.
              </span>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ανάλογα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις εύρεσης συντελεστή αναλογίας, συμπλήρωσης πινάκων τιμών και ανάλυσης γραφικών παραστάσεων.
            </p>
          </div>

          <Link
            href="/st-dimotikou/44-analoga-posa-ask"
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

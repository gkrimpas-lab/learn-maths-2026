// pages/st-dimotikou/46-antistrofos-analoga-posa.js
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

export default function AntistrofosAnalogaTheoryPage() {
  // Εργαστηριο 1: Εργατες & Ημερες (Σταθερο Γινομενο = Συνολικα Μεροκαματα)
  const totalWorkDays = 48; // Σταθερο γινομενο α = x * y = 48
  const [workers, setWorkers] = useState(4); // x

  const daysNeeded = useMemo(() => {
    const raw = totalWorkDays / workers;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [workers]);

  // Τιμες πινακα για x = 1, 2, 3, 4, 6, 8, 12 εργατες
  const tableValues = useMemo(() => {
    return [1, 2, 3, 4, 6, 8, 12].map((w) => ({
      w,
      d: Number((totalWorkDays / w).toFixed(1)),
      product: w * Number((totalWorkDays / w).toFixed(1))
    }));
  }, [totalWorkDays]);

  // Εργαστηριο 2: Ταχυτητα vs Χρονος για Σταθερη Αποσταση 240 km
  const fixedDistance = 240; // km (σταθερο γινομενο)
  const [speedVal, setSpeedVal] = useState(60); // km/h

  const tripTime = useMemo(() => {
    const raw = fixedDistance / speedVal;
    return Number.isInteger(raw) ? raw : Number(raw.toFixed(1));
  }, [speedVal]);

  return (
    <Layout
      title="Αντιστρόφως Ανάλογα Ποσά - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Πλήρης θεωρία με παραδείγματα για τα αντιστρόφως ανάλογα ποσά, το σταθερό γινόμενο, τον πίνακα τιμών, τη γραφική παράσταση (υπερβολή) και διαδραστικό εργαστήριο για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/46-antistrofos-analoga-posa-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 46 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Αντιστρόφως Ανάλογα Ποσά
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πότε δύο ποσά μεταβάλλονται αντίστροφα, γιατί το γινόμενο των αντίστοιχων τιμών τους παραμένει σταθερό, πώς διαβάζουμε τον πίνακα τιμών και γιατί η γραφική τους παράσταση είναι καμπύλη γραμμή (υπερβολή).
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία &amp; Δυναμικός Έλεγχος Σταθερού Γινομένου</span>
            </div>
            <Link
              href="/st-dimotikou/46-antistrofos-analoga-posa-ask"
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
              Η μαθηματική ουσία των αντιστρόφως ανάλογων ποσών και η σύγκριση με τα ανάλογα.
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
                  Τι είναι Αντιστρόφως Ανάλογα;
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Δύο ποσά ονομάζονται <strong>αντιστρόφως ανάλογα</strong> όταν, καθώς πολλαπλασιάζεται η τιμή του ενός με έναν αριθμό, <strong>η αντίστοιχη τιμή του άλλου διαιρείται με τον ίδιο ακριβώς αριθμό</strong> (και αντίστροφα).
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm">
                  <p className="text-slate-700 font-semibold">Παραδείγματα στην καθημερινότητα:</p>
                  <ul className="space-y-1 text-slate-600">
                    <li>• <strong>Διπλάσιοι εργάτες</strong> ➔ <strong>Μισός χρόνος</strong> για το έργο.</li>
                    <li>• <strong>Τριπλάσια ταχύτητα</strong> ➔ <strong>Στο ένα τρίτο</strong> ο χρόνος ταξιδιού.</li>
                    <li>• <strong>Περισσότερες βρύσες</strong> ➔ <strong>Λιγότερα λεπτά</strong> για να γεμίσει η πισίνα.</li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Προσοχή: Δεν αρκεί απλώς το ένα ποσό να ανεβαίνει και το άλλο να πέφτει. Πρέπει η μεταβολή να γίνεται με τον ίδιο ακριβώς συντελεστή!
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Βασική Ιδιότητα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σταθερό Γινόμενο (α)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε δύο αντιστρόφως ανάλογα ποσά, <strong>το γινόμενο των αντίστοιχων τιμών τους παραμένει πάντοτε σταθερό</strong>:
                </p>

                <div className="bg-slate-50 p-4 2xl:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="font-mono font-black text-xl text-amber-950">
                    χ · ψ ＝ α &nbsp;(σταθερό)
                  </div>
                  <p className="text-slate-600 text-xs pt-1">
                    Όπου <span className="font-bold">χ</span> η τιμή του πρώτου ποσού, <span className="font-bold">ψ</span> η τιμή του δεύτερου ποσού και <span className="font-bold font-mono">α</span> το σταθερό γινόμενο.
                  </p>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800">
                    ψ ＝ α : χ
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Μεγάλη διαφορά: Στα ανάλογα ποσά είναι σταθερό το <em>πηλίκο</em> (ψ : χ ＝ λ), ενώ στα αντιστρόφως ανάλογα είναι σταθερό το <em>γινόμενο</em> (χ · ψ ＝ α)!
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
                  Έλεγχος Πίνακα Τιμών
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να ελέγξουμε αν ένας πίνακας περιέχει αντιστρόφως ανάλογα ποσά, <strong>πολλαπλασιάζουμε</strong> τα ζεύγη των αντίστοιχων τιμών:
                </p>

                <div className="bg-slate-50 p-3 2xl:p-4 rounded-2xl border border-slate-200 font-mono text-xs sm:text-sm space-y-2">
                  <div className="grid grid-cols-4 gap-1 text-center border-b pb-1 font-bold text-slate-600">
                    <span>Εργάτες (χ)</span>
                    <span>1</span>
                    <span>2</span>
                    <span>4</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-center font-bold text-indigo-900">
                    <span>Ημέρες (ψ)</span>
                    <span>24</span>
                    <span>12</span>
                    <span>6</span>
                  </div>
                  <div className="text-[11px] text-slate-600 text-center pt-1 font-sans font-bold">
                    Γινόμενα: 1 · 24 ＝ 2 · 12 ＝ 4 · 6 ＝ <strong>24 (σταθερό α)</strong>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Αν ένα μόνο ζευγάρι δώσει διαφορετικό γινόμενο, τότε τα ποσά <strong>δεν</strong> είναι αντιστρόφως ανάλογα!
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
                  Γραφική Παράσταση (Υπερβολή)
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Σε σύστημα αξόνων, τα σημεία των αντιστρόφως ανάλογων ποσών <strong>δεν</strong> σχηματίζουν ευθεία γραμμή:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 font-bold text-center">
                    Η γραφική παράσταση είναι ΚΑΜΠΥΛΗ ΓΡΑΜΜΗ που ονομάζεται ΥΠΕΡΒΟΛΗ.
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Η καμπύλη κατεβαίνει συνεχώς πλησιάζοντας τους άξονες, αλλά <strong>δεν περνά ποτέ από το (0, 0)</strong> και δεν ακουμπά ποτέ τους άξονες.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Το μηδέν αποκλείεται, επειδή κανένας αριθμός διαιρούμενος με το 0 δεν έχει νόημα στα Μαθηματικά!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΡΓΑΤΕΣ ΚΑΙ ΧΡΟΝΟΣ (ΣΤΑΘΕΡΟ ΓΙΝΟΜΕΝΟ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Πίνακας: Εργάτες &amp; Ημέρες (Σταθερό Έργο ＝ 48 Μεροκάματα)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ένα έργο απαιτεί συνολικά 48 μεροκάματα. Αλλάξτε το πλήθος των εργατών και παρατηρήστε πώς μειώνονται οι ημέρες διατηρώντας το γινόμενο σταθερό.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηριο Εργατων */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-blue-50/70 p-5 rounded-2xl border border-blue-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                    ΑΡΙΘΜΟΣ ΕΡΓΑΤΩΝ (χ)
                  </span>
                  <span className="font-mono font-black text-xl text-blue-800 bg-white px-3 py-0.5 rounded-lg border border-blue-200">
                    {workers} {workers === 1 ? 'εργάτης' : 'εργάτες'}
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers((prev) => Math.max(1, prev - 1)); }}
                    disabled={workers <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={12}
                    value={workers}
                    onChange={(e) => setWorkers(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWorkers((prev) => Math.min(12, prev + 1)); }}
                    disabled={workers >= 12}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Υπολογισμός ημερών: <span className="font-mono font-bold">ψ ＝ 48 : {workers} ＝ {formatNum(daysNeeded)} ημέρες</span>.
                </p>
              </div>

              {/* Καρτα Σταθερου Γινομενου */}
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-center space-y-1">
                <span className="text-xs font-bold text-amber-900 uppercase block">
                  ΣΤΑΘΕΡΟ ΓΙΝΟΜΕΝΟ (α)
                </span>
                <div className="font-mono font-black text-2xl text-amber-800">
                  {workers} · {formatNum(daysNeeded)} ＝ 48
                </div>
                <p className="text-xs text-slate-600 pt-1">
                  Ο συνολικός όγκος εργασίας είναι 48 ανθρωποημέρες και δεν αλλάζει ποτέ.
                </p>
              </div>

            </div>

            {/* Πινακας Τιμων με Σταθερο Γινομενο */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                ΠΙΝΑΚΑΣ ΤΙΜΩΝ ΜΕ ΣΤΑΘΕΡΑ ΓΙΝΟΜΕΝΑ (χ · ψ ＝ 48)
              </div>

              <div className="overflow-x-auto">
                <table className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm text-center text-xs sm:text-sm font-mono overflow-hidden">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3">Εργάτες (χ)</th>
                      {tableValues.map((item) => (
                        <th key={`head-w-${item.w}`} className={`p-3 ${item.w === workers ? 'bg-blue-100 text-blue-950 font-black' : ''}`}>
                          {item.w}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200 text-indigo-900 font-bold">
                      <td className="p-3 font-semibold text-slate-600 bg-slate-50">Ημέρες (ψ)</td>
                      {tableValues.map((item) => (
                        <td key={`body-d-${item.w}`} className={`p-3 font-black ${item.w === workers ? 'bg-blue-50 text-blue-900' : 'text-indigo-700'}`}>
                          {formatNum(item.d)}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-amber-50/50 text-amber-950 font-bold">
                      <td className="p-3 font-semibold text-slate-600">Γινόμενο (χ · ψ)</td>
                      {tableValues.map((item) => (
                        <td key={`body-p-${item.w}`} className="p-3 text-amber-800 font-black">
                          {formatNum(item.product)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-emerald-100 text-center space-y-1">
                <span className="text-xs font-bold text-emerald-900 uppercase block">
                  ΒΑΣΙΚΟ ΣΥΜΠΕΡΑΣΜΑ
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Όταν οι εργάτες <strong>διπλασιάζονται</strong> (π.χ. από 2 σε 4), οι ημέρες <strong>υποδιπλασιάζονται</strong> (από 24 σε 12). Το γινόμενο παραμένει αμετάβλητο: <strong className="font-mono text-emerald-700">48</strong>.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ (ΥΠΕΡΒΟΛΗ) */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>📉 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Η Γραφική Παράσταση είναι Υπερβολή (Καμπύλη)
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ταξίδι σταθερής απόστασης 240 km: Αλλάξτε την ταχύτητα και δείτε πώς η καμπύλη γραμμή αποτυπώνει τη μείωση του χρόνου ταξιδιού.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Ρυθμισεις Ταχυτητας */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    ΤΑΧΥΤΗΤΑ (km/h)
                  </span>
                  <span className="font-mono font-black text-lg text-emerald-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                    {speedVal} km/h
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedVal((prev) => Math.max(30, prev - 10)); }}
                    disabled={speedVal <= 30}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={30}
                    max={120}
                    step={10}
                    value={speedVal}
                    onChange={(e) => setSpeedVal(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSpeedVal((prev) => Math.min(120, prev + 10)); }}
                    disabled={speedVal >= 120}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 space-y-1 text-center">
                <span className="text-xs font-bold text-blue-900 uppercase block">
                  ΧΡΟΝΟΣ ΤΑΞΙΔΙΟΥ (ΩΡΕΣ t)
                </span>
                <div className="font-mono font-black text-2xl text-blue-800">
                  {formatNum(tripTime)} {tripTime === 1 ? 'ώρα' : 'ώρες'}
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Σταθερή απόσταση: <span className="font-bold">240 km</span> ➔ Τύπος: <span className="font-mono font-bold">t ＝ 240 : {speedVal}</span>.
                </p>
              </div>

              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-950 leading-relaxed">
                📌 <strong>Σημείο καμπύλης:</strong> Συντεταγμένες: <strong className="font-mono">({speedVal} km/h, {formatNum(tripTime)} h)</strong>. Όσο μεγαλώνει η ταχύτητα, τόσο πλησιάζει ο χρόνος το 0 χωρίς να φτάνει ποτέ εκεί.
              </div>

            </div>

            {/* SVG Διαγραμμα Υπερβολης */}
<div className="lg:col-span-7 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center">
  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
    ΓΡΑΦΙΚΗ ΠΑΡΑΣΤΑΣΗ: ΚΑΜΠΥΛΗ ΥΠΕΡΒΟΛΗ
  </span>

  <div className="w-full max-w-[420px] aspect-square bg-white rounded-2xl border border-slate-200 p-4 relative shadow-inner">
    <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
      {/* Πλεγμα */}
      {[1, 2, 3, 4].map((i) => (
        <line
          key={`grid-x-${i}`}
          x1={50 + i * 75}
          y1={70}
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
      <line x1="50" y1="350" x2="375" y2="350" stroke="#334155" strokeWidth="2.5" />
      <line x1="50" y1="350" x2="50" y2="35" stroke="#334155" strokeWidth="2.5" />

      {/* Βελη αξονων */}
      <polygon points="375,346 383,350 375,354" fill="#334155" />
      <polygon points="46,35 50,27 54,35" fill="#334155" />

      {/* Ετικετες αξονων */}
      <text x="375" y="375" fontSize="11" fontWeight="bold" fill="#64748b" textAnchor="end">Ταχύτητα υ (km/h)</text>
      <text x="25" y="25" fontSize="11" fontWeight="bold" fill="#64748b">Χρόνος t (h)</text>

      {/* Αριθμοι αξονα X (30, 60, 90, 120) */}
      {[30, 60, 90, 120].map((spd, idx) => (
        <text key={`tx-${spd}`} x={50 + (idx + 1) * 75} y="368" fontSize="11" fontWeight="bold" fill="#475569" textAnchor="middle">
          {spd}
        </text>
      ))}

      {/* Αριθμοι αξονα Y (2, 4, 6, 8 ωρες) */}
      {[2, 4, 6, 8].map((hrs, idx) => (
        <text key={`ty-${hrs}`} x="42" y={355 - (idx + 1) * 70} fontSize="11" fontWeight="bold" fill="#475569" textAnchor="end">
          {hrs}
        </text>
      ))}

      {/* Σημειο (0,0) */}
      <circle cx="50" cy="350" r="4" fill="#0f172a" />
      <text x="38" y="365" fontSize="11" fontWeight="bold" fill="#0f172a">0</text>

      {/* Πραγματικη Καμπυλη Υπερβολης: t = 240 / v (απο v=30 εως v=120) */}
      {(() => {
        const points = [];
        for (let v = 30; v <= 120; v += 2) {
          const t = 240 / v;
          const px = 50 + (v / 120) * 300;
          const py = 350 - (t / 8) * 280;
          points.push(`${px},${py}`);
        }
        return (
          <polyline
            points={points.join(' ')}
            fill="none"
            stroke="#e11d48"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })()}

      {/* Γραμμες οδηγοι προς τους αξονες για το ενεργο σημειο */}
      {(() => {
        const cx = 50 + (speedVal / 120) * 300;
        const cy = 350 - ((240 / speedVal) / 8) * 280;
        return (
          <>
            <line x1={cx} y1={350} x2={cx} y2={cy} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
            <line x1={50} y1={cy} x2={cx} y2={cy} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle
              cx={cx}
              cy={cy}
              r="7"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2.5"
              className="animate-pulse"
            />
          </>
        );
      })()}
    </svg>
  </div>

  <span className="text-xs text-rose-700 font-bold mt-3 text-center">
    Η καμπύλη ΔΕΝ περνά ποτέ από το (0, 0) και δεν ακουμπά τους άξονες!
  </span>
</div>
              <span className="text-xs text-rose-700 font-bold mt-3 text-center">
                Η καμπύλη ΔΕΝ περνά ποτέ από το (0, 0) και δεν ακουμπά τους άξονες!
              </span>
            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Αντιστρόφως Ανάλογα Ποσά!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις ελέγχου σταθερού γινομένου, συμπλήρωσης πινάκων τιμών και σύνθετων προβλημάτων χρόνου και εργασίας.
            </p>
          </div>

          <Link
            href="/st-dimotikou/46-antistrofos-analoga-posa-ask"
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

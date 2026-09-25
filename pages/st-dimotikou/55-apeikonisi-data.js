// pages/st-dimotikou/55-apeikonisi-data.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function ApeikonisiDataTheoryPage() {
  // Εργαστηριο 1: Διαδραστικη Απεικονιση (Ραβδογραμμα vs Εικονογραμμα)
  const [viewType, setViewType] = useState('bar');
  const [catA, setCatA] = useState(12); // Ποδόσφαιρο
  const [catB, setCatB] = useState(8);  // Μπάσκετ
  const [catC, setCatC] = useState(6);  // Βόλεϊ
  const [catD, setCatD] = useState(10); // Κολύμβηση

  const categories = useMemo(() => [
    { name: 'Ποδόσφαιρο', value: catA, color: '#3b82f6', icon: '⚽' },
    { name: 'Μπάσκετ', value: catB, color: '#f59e0b', icon: '🏀' },
    { name: 'Βόλεϊ', value: catC, color: '#ec4899', icon: '🏐' },
    { name: 'Κολύμβηση', value: catD, color: '#06b6d4', icon: '🏊' }
  ], [catA, catB, catC, catD]);

  const totalVotes = catA + catB + catC + catD;

  // Εργαστηριο 2: Επιλογη Κλιμακας Υπομνηματος & Οπτικη Αναπαρασταση
  const [booksCount, setBooksCount] = useState(30);
  const [symbolScale, setSymbolScale] = useState(5);

  const fullSymbols = Math.floor(booksCount / symbolScale);
  const remainder = booksCount % symbolScale;
  const hasHalfSymbol = remainder >= symbolScale / 2;

  return (
    <Layout
      title="Απεικόνιση Δεδομένων: Ραβδόγραμμα & Εικονόγραμμα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς οργανώνουμε και απεικονίζουμε δεδομένα με ραβδογράμματα και εικονογράμματα, πώς επιλέγουμε κλίμακα και διαβάζουμε υπομνήματα με διαδραστικά εργαστήρια."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/55-apeikonisi-data-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 55 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Απεικόνιση Δεδομένων: Ραβδόγραμμα &amp; Εικονόγραμμα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς μετατρέπουμε πίνακες συχνοτήτων και μετρήσεων σε ευανάγνωστα γραφήματα. Ανακαλύπτουμε πώς σχεδιάζουμε σωστά ράβδους με κλίμακα αξόνων και πώς αξιοποιούμε σύμβολα με υπόμνημα στα εικονογράμματα.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτικά Παραδείγματα &amp; Διαδραστική Σχεδίαση Γραφημάτων</span>
            </div>
            <Link
              href="/st-dimotikou/55-apeikonisi-data-ask"
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
              Βασικές Αρχές Στατιστικής Απεικόνισης σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από τη συλλογή πληροφοριών στον πίνακα συχνοτήτων και από εκεί στην οπτική παρουσίαση.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πίνακας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οργάνωση Δεδομένων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Πριν σχεδιάσουμε οποιοδήποτε γράφημα, καταγράφουμε τις παρατηρήσεις μας σε <strong>πίνακα συχνοτήτων</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
                  <div className="grid grid-cols-2 gap-2 border-b border-slate-200 pb-1 font-bold text-slate-600 text-center">
                    <span>Κατηγορία</span>
                    <span>Συχνότητα (ν)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-center font-bold text-slate-800">
                    <span>Μπάσκετ</span>
                    <span className="text-blue-700">8 μαθητές</span>
                    <span>Ποδόσφαιρο</span>
                    <span className="text-blue-700">12 μαθητές</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Συχνότητα</strong> ονομάζεται ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια τιμή ή κατηγορία.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ραβδόγραμμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κανόνες Ραβδογράμματος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στο ραβδόγραμμα χρησιμοποιούμε ορθογώνιες στήλες (ράβδους) με συγκεκριμένους κανόνες:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>Ίσο πλάτος:</strong> Όλες οι ράβδοι έχουν αυστηρά το ίδιο πλάτος.
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>Ίσες αποστάσεις:</strong> Τα κενά ανάμεσα στις ράβδους είναι ίσα.
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>Ύψος:</strong> Το ύψος κάθε ράβδου είναι ανάλογο της συχνότητας.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Η κλίμακα στον κατακόρυφο άξονα πρέπει να έχει σταθερά διαστήματα (π.χ. ανά 2, 5 ή 10).
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εικονόγραμμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Υπόμνημα του Εικονογράμματος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στο εικονόγραμμα αντικαθιστούμε τους αριθμούς με <strong>εικόνες ή σύμβολα</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-bold text-indigo-950">
                    Υπόμνημα: 📖 ＝ 5 βιβλία
                  </div>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-relaxed">
                    Αν μια τάξη διάβασε 20 βιβλία, σχεδιάζουμε <strong>4 σύμβολα</strong> (20 : 5 ＝ 4). Αν διάβασε 25, σχεδιάζουμε <strong>5 σύμβολα</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Χωρίς υπόμνημα, κανείς δεν μπορεί να καταλάβει πόσες μονάδες αντιπροσωπεύει κάθε εικόνα!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ανάγνωση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ερμηνεία Γραφημάτων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Τα γραφήματα μας επιτρέπουν να βγάζουμε άμεσα συμπεράσματα με μια ματιά:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Επικρατούσα κατηγορία:</strong> Η ψηλότερη ράβδος.
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Σύνολο:</strong> Το άθροισμα όλων των ράβδων.
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Διαφορές:</strong> Αφαίρεση υψών μεταξύ δύο κατηγοριών.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ένα γράφημα αξίζει όσο χίλιοι αριθμοί γιατί κάνει τη σύγκριση ορατή σε όλους.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ ΚΑΙ ΕΙΚΟΝΟΓΡΑΜΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής: Ραβδόγραμμα &amp; Εικονόγραμμα
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε τις προτιμήσεις των μαθητών σε 4 αθλήματα ανά 1 μαθητή και κάντε εναλλαγή ανάμεσα σε Ραβδόγραμμα και Εικονόγραμμα.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  viewType === 'bar'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Ραβδόγραμμα
              </button>
              <button
                type="button"
                onClick={() => setViewType('pictogram')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  viewType === 'pictogram'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🖼️ Εικονόγραμμα
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>⚽</span> Ποδόσφαιρο
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catA} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatA((prev) => Math.max(0, prev - 1)); }}
                    disabled={catA <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catA}
                    onChange={(e) => setCatA(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatA((prev) => Math.min(20, prev + 1)); }}
                    disabled={catA >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏀</span> Μπάσκετ
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catB} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatB((prev) => Math.max(0, prev - 1)); }}
                    disabled={catB <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catB}
                    onChange={(e) => setCatB(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatB((prev) => Math.min(20, prev + 1)); }}
                    disabled={catB >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏐</span> Βόλεϊ
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-pink-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catC} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatC((prev) => Math.max(0, prev - 1)); }}
                    disabled={catC <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catC}
                    onChange={(e) => setCatC(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatC((prev) => Math.min(20, prev + 1)); }}
                    disabled={catC >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏊</span> Κολύμβηση
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-cyan-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {catD} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatD((prev) => Math.max(0, prev - 1)); }}
                    disabled={catD <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={catD}
                    onChange={(e) => setCatD(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatD((prev) => Math.min(20, prev + 1)); }}
                    disabled={catD >= 20}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 text-center font-bold text-xs sm:text-sm text-blue-950">
                Σύνολο μαθητών που ρωτήθηκαν: <strong className="font-mono text-sm sm:text-base">{totalVotes}</strong>
              </div>
            </div>

            <div className="lg:col-span-7 bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center w-full min-h-[340px]">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 text-center">
                {viewType === 'bar' ? 'ΡΑΒΔΟΓΡΑΜΜΑ ΠΡΟΤΙΜΗΣΕΩΝ ΑΘΛΗΜΑΤΩΝ' : 'ΕΙΚΟΝΟΓΡΑΜΜΑ (1 ΣΥΜΒΟΛΟ ＝ 2 ΜΑΘΗΤΕΣ)'}
              </span>

              {viewType === 'bar' ? (
                <div className="w-full max-w-[420px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm relative flex items-center justify-center">
                  <svg viewBox="0 0 380 250" className="w-full h-auto max-h-[260px] overflow-visible">
                    {[0, 5, 10, 15, 20].map((v) => {
                      const y = 205 - (v / 20) * 165;
                      return (
                        <g key={`grid-val-${v}`}>
                          <line x1="42" y1={y} x2="365" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x="35" y={y + 4} fontSize="10" fill="#64748b" textAnchor="end" fontWeight="bold">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    <line x1="42" y1="205" x2="370" y2="205" stroke="#334155" strokeWidth="2" />
                    <line x1="42" y1="205" x2="42" y2="25" stroke="#334155" strokeWidth="2" />

                    {categories.map((cat, i) => {
                      const barWidth = 42;
                      const gap = 38;
                      const x = 65 + i * (barWidth + gap);
                      const barHeight = (cat.value / 20) * 165;
                      const y = 205 - barHeight;

                      return (
                        <g key={`bar-${cat.name}`}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(barHeight, 0)}
                            fill={cat.color}
                            rx="5"
                            className="transition-all duration-300"
                          />
                          <text
                            x={x + barWidth / 2}
                            y={Math.max(y - 5, 22)}
                            fontSize="11"
                            fontWeight="bold"
                            fill="#0f172a"
                            textAnchor="middle"
                          >
                            {cat.value}
                          </text>
                          <text
                            x={x + barWidth / 2}
                            y="225"
                            fontSize="11"
                            fontWeight="bold"
                            fill="#475569"
                            textAnchor="middle"
                          >
                            {cat.icon}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="w-full max-w-[420px] bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm space-y-3">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 text-center">
                    📌 Υπόμνημα: Κάθε σύμβολο αντιστοιχεί σε <strong>2 μαθητές</strong>.
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    {categories.map((cat) => {
                      const fullSyms = Math.floor(cat.value / 2);
                      const hasHalf = cat.value % 2 !== 0;

                      return (
                        <div key={`picto-${cat.name}`} className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-1.5">
                          <span className="font-sans font-bold text-slate-700 w-20 sm:w-24 shrink-0 break-words">
                            {cat.name}:
                          </span>
                          <div className="flex flex-wrap items-center gap-1 grow">
                            {Array.from({ length: fullSyms }).map((_, idx) => (
                              <span key={`sym-${idx}`} className="text-base sm:text-lg select-none">
                                {cat.icon}
                              </span>
                            ))}
                            {hasHalf && (
                              <span className="text-[10.5px] font-bold bg-amber-200 px-1 py-0.2 rounded text-amber-950 font-sans">
                                ½
                              </span>
                            )}
                            {cat.value === 0 && (
                              <span className="text-[11px] text-slate-400 font-sans">0</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 w-8 text-right shrink-0">
                            {cat.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2.5 text-center">
                Η επικρατούσα προτίμηση ξεχωρίζει άμεσα από το ύψος ή το πλήθος των εικόνων!
              </span>
            </div>
          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΠΙΛΟΓΗ ΚΛΙΜΑΚΑΣ ΚΑΙ ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΣΥΜΒΟΛΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-100 pb-3 sm:pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΟΠΤΙΚΟΠΟΙΗΣΗ ΥΠΟΜΝΗΜΑΤΟΣ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς Αλλάζει το Εικονόγραμμα με την Κλίμακα του Υπομνήματος;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επιλέξτε πόσα βιβλία δανείστηκαν και αλλάξτε την κλίμακα για να δείτε πώς σχεδιάζονται τα σύμβολα σε πραγματικό χρόνο:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-5 space-y-3.5">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>ΑΡΙΘΜΟΣ ΒΙΒΛΙΩΝ:</span>
                  <span className="font-mono text-sm sm:text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 font-black">
                    {booksCount} βιβλία
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBooksCount((prev) => Math.max(5, prev - 5)); }}
                    disabled={booksCount <= 5}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={booksCount}
                    onChange={(e) => setBooksCount(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBooksCount((prev) => Math.min(60, prev + 5)); }}
                    disabled={booksCount >= 60}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  ΕΠΙΛΕΞΤΕ ΑΞΙΑ ΥΠΟΜΝΗΜΑΤΟΣ (1 ΣΥΜΒΟΛΟ ΙΣΟΥΤΑΙ ΜΕ):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 5, 10].map((s) => (
                    <button
                      key={`sc-${s}`}
                      type="button"
                      onClick={() => setSymbolScale(s)}
                      className={`p-2 rounded-xl font-bold text-xs sm:text-sm transition flex flex-col items-center justify-center gap-0.5 ${
                        symbolScale === s
                          ? 'bg-emerald-600 text-white shadow-sm scale-102'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-sm sm:text-base">📖</span>
                      <span className="text-[11px] sm:text-xs">＝ {s}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-emerald-50/50 p-4 sm:p-6 rounded-3xl border border-emerald-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2 mb-2">
                  <span className="text-[11px] sm:text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    ΟΠΤΙΚΗ ΑΠΟΔΟΣΗ ΣΤΟ ΕΙΚΟΝΟΓΡΑΜΜΑ
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-mono">
                    📖 ＝ {symbolScale}
                  </span>
                </div>

                <div className="p-3 sm:p-4 bg-white rounded-2xl border border-emerald-100 min-h-[75px] flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: fullSymbols }).map((_, idx) => (
                    <span key={`dyn-sym-${idx}`} className="text-2xl sm:text-3xl select-none" title={`Σύμβολο ${idx + 1}: ${symbolScale} βιβλία`}>
                      📖
                    </span>
                  ))}
                  {hasHalfSymbol && (
                    <span className="inline-flex items-center justify-center bg-amber-100 border border-amber-300 text-amber-950 font-bold px-1.5 py-0.5 rounded-lg text-xs" title={`Μισό σύμβολο: ${remainder} βιβλία`}>
                      ½ 📖
                    </span>
                  )}
                  {fullSymbols === 0 && !hasHalfSymbol && (
                    <span className="text-xs text-slate-400">Δεν απαιτούνται σύμβολα</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-500 font-sans block text-[10.5px]">Σύμβολα</span>
                  <strong className="text-emerald-800 text-sm sm:text-base font-black">{fullSymbols}</strong>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-slate-500 font-sans block text-[10.5px]">Υπολογισμός</span>
                  <strong className="text-slate-800 text-[11px] sm:text-xs">{booksCount} : {symbolScale} ＝ {formatNum(booksCount / symbolScale)}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Παραδείγματα Προβλημάτων με Σχήματα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο ολοκληρωμένα προβλήματα σχεδίασης και ερμηνείας ραβδογραμμάτων και εικονογραμμάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΡΑΒΔΟΓΡΑΜΜΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Σχολείο</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Δανεισμοί Βιβλίων Σχολικής Βιβλιοθήκης
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα ραβδόγραμμα καταγράφηκαν οι δανεισμοί βιβλίων ανά τάξη: Γ' τάξη <strong>15 βιβλία</strong>, Δ' τάξη <strong>20 βιβλία</strong>, Ε' τάξη <strong>25 βιβλία</strong> και ΣΤ' τάξη <strong>30 βιβλία</strong>.
              </p>

              {/* ΣΧΗΜΑ 1: SVG Ραβδογραμμα Responsive */}
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΧΗΜΑ: ΡΑΒΔΟΓΡΑΜΜΑ ΔΑΝΕΙΣΜΩΝ ΑΝΑ ΤΑΞΗ
                </span>
                <div className="w-full max-w-[340px] mx-auto aspect-[4/3] bg-white rounded-xl border border-slate-200 p-2 shadow-inner flex items-center justify-center">
                  <svg viewBox="0 0 340 220" className="w-full h-auto overflow-visible">
                    {[0, 10, 20, 30].map((val) => {
                      const y = 180 - (val / 30) * 140;
                      return (
                        <g key={`p1-grid-${val}`}>
                          <line x1="38" y1={y} x2="320" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="32" y={y + 3.5} fontSize="9.5" fill="#64748b" textAnchor="end" fontWeight="bold">
                            {val}
                          </text>
                        </g>
                      );
                    })}
                    <line x1="38" y1="180" x2="325" y2="180" stroke="#334155" strokeWidth="2" />
                    <line x1="38" y1="180" x2="38" y2="20" stroke="#334155" strokeWidth="2" />

                    {[
                      { label: "Γ'", val: 15, col: '#38bdf8' },
                      { label: "Δ'", val: 20, col: '#3b82f6' },
                      { label: "Ε'", val: 25, col: '#2563eb' },
                      { label: "ΣΤ'", val: 30, col: '#1d4ed8' }
                    ].map((item, idx) => {
                      const bw = 32;
                      const bx = 60 + idx * 65;
                      const bh = (item.val / 30) * 140;
                      const by = 180 - bh;

                      return (
                        <g key={`p1-bar-${item.label}`}>
                          <rect x={bx} y={by} width={bw} height={bh} fill={item.col} rx="4" />
                          <text x={bx + bw / 2} y={by - 3} fontSize="10.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                            {item.val}
                          </text>
                          <text x={bx + bw / 2} y="196" fontSize="10" fontWeight="bold" fill="#475569" textAnchor="middle">
                            {item.label}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Ερωτήματα &amp; Απαντήσεις:</span>
                  <div>• Σύνολο δανεισμών: 15 ＋ 20 ＋ 25 ＋ 30 ＝ <strong className="text-blue-700">90 βιβλία</strong></div>
                  <div>• Διαφορά ΣΤ' από Γ': 30 － 15 ＝ <strong className="text-emerald-700">15 βιβλία</strong></div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                💡 Στο σχήμα φαίνεται καθαρά: η ράβδος της ΣΤ' τάξης έχει ακριβώς διπλάσιο ύψος από τη ράβδο της Γ' τάξης (30 έναντι 15).
              </div>
            </article>

            {/* Παραδειγμα 2: Πλήρως αναγνώσιμο χωρίς truncate / αποσιωπητικά */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΕΙΚΟΝΟΓΡΑΜΜΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Ανακύκλωση</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Συλλογή Μπαταριών για Ανακύκλωση
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Οι μαθητές συγκέντρωσαν: Δευτέρα <strong>40 μπαταρίες</strong>, Τρίτη <strong>60 μπαταρίες</strong>, Τετάρτη <strong>50 μπαταρίες</strong> (Υπόμνημα: <strong>🔋 ＝ 10 μπαταρίες</strong>).
              </p>

              {/* ΣΧΗΜΑ 2: Οπτικο Εικονογραμμα Χωρίς Truncate / Αποσιωπητικά */}
              <div className="p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 px-1">
                  <span className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ΣΧΗΜΑ: ΕΙΚΟΝΟΓΡΑΜΜΑ
                  </span>
                  <span className="text-[11px] font-bold bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900 font-mono">
                    🔋 ＝ 10 μπαταρίες
                  </span>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-2 sm:p-2.5 space-y-2 text-xs font-mono">
                  {/* Δευτέρα */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg">
                    <span className="font-sans font-bold text-slate-700 break-words">Δευτέρα:</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg select-none">
                      <span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span>
                    </div>
                    <span className="font-bold text-amber-900 text-right sm:text-right shrink-0">
                      40 μπαταρίες (4 σύμβολα)
                    </span>
                  </div>

                  {/* Τρίτη */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg">
                    <span className="font-sans font-bold text-slate-700 break-words">Τρίτη:</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg select-none">
                      <span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span>
                    </div>
                    <span className="font-bold text-amber-900 text-right sm:text-right shrink-0">
                      60 μπαταρίες (6 σύμβολα)
                    </span>
                  </div>

                  {/* Τετάρτη */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 bg-slate-50 rounded-lg">
                    <span className="font-sans font-bold text-slate-700 break-words">Τετάρτη:</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-base sm:text-lg select-none">
                      <span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span><span>🔋</span>
                    </div>
                    <span className="font-bold text-amber-900 text-right sm:text-right shrink-0">
                      50 μπαταρίες (5 σύμβολα)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Υπολογισμός συμβόλων:</span>
                  <div>• Δευτέρα: 40 : 10 ＝ <strong className="text-amber-700">4 σύμβολα</strong></div>
                  <div>• Τρίτη: 60 : 10 ＝ <strong className="text-amber-700">6 σύμβολα</strong></div>
                  <div>• Τετάρτη: 50 : 10 ＝ <strong className="text-amber-700">5 σύμβολα</strong></div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                💡 Συνολικά: 4 ＋ 6 ＋ 5 ＝ 15 σύμβολα, που αντιπροσωπεύουν 15 · 10 ＝ 150 μπαταρίες.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Ραβδογράμματα &amp; Εικονογράμματα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις ανάγνωσης γραφημάτων, υπολογισμού συχνοτήτων και επίλυσης προβλημάτων στατιστικής για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/55-apeikonisi-data-ask"
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

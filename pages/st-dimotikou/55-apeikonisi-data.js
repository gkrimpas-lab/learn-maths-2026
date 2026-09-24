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
  const [viewType, setViewType] = useState('bar'); // 'bar' η 'pictogram'
  const [catA, setCatA] = useState(12); // π.χ. Ποδόσφαιρο
  const [catB, setCatB] = useState(8);  // π.χ. Μπάσκετ
  const [catC, setCatC] = useState(6);  // π.χ. Βόλεϊ
  const [catD, setCatD] = useState(10); // π.χ. Κολύμβηση

  const categories = useMemo(() => [
    { name: 'Ποδόσφαιρο', value: catA, color: '#3b82f6', icon: '⚽' },
    { name: 'Μπάσκετ', value: catB, color: '#f59e0b', icon: '🏀' },
    { name: 'Βόλεϊ', value: catC, color: '#ec4899', icon: '🏐' },
    { name: 'Κολύμβηση', value: catD, color: '#06b6d4', icon: '🏊' }
  ], [catA, catB, catC, catD]);

  const totalVotes = catA + catB + catC + catD;
  const maxVal = Math.max(catA, catB, catC, catD, 15);

  // Εργαστηριο 2: Επιλογη Κλιμακας Υπομνηματος σε Εικονογραμμα
  const [booksCount, setBooksCount] = useState(30);
  const [symbolScale, setSymbolScale] = useState(5); // 1 συμβολο = 5 βιβλια

  const symbolsNeeded = useMemo(() => {
    return booksCount / symbolScale;
  }, [booksCount, symbolScale]);

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
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-3 sm:px-6 lg:px-12 py-6 space-y-10 2xl:space-y-14 pb-24">
        
        {/* 1. HEADER BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-6 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 55 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Απεικόνιση Δεδομένων: Ραβδόγραμμα &amp; Εικονόγραμμα
            </h1>
            <p className="text-sky-100 text-sm sm:text-lg 2xl:text-2xl leading-relaxed max-w-4xl">
              Μαθαίνουμε πώς μετατρέπουμε πίνακες συχνοτήτων και μετρήσεων σε ευανάγνωστα γραφήματα. Ανακαλύπτουμε πώς σχεδιάζουμε σωστά ράβδους με κλίμακα αξόνων και πώς αξιοποιούμε σύμβολα με υπόμνημα στα εικονογράμματα.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Λυμένα Παραδείγματα &amp; Διαδραστική Σχεδίαση Γραφημάτων</span>
            </div>
            <Link
              href="/st-dimotikou/55-apeikonisi-data-ask"
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
              Βασικές Αρχές Στατιστικής Απεικόνισης σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-sm sm:text-base 2xl:text-xl mt-1">
              Από τη συλλογή πληροφοριών στον πίνακα συχνοτήτων και από εκεί στην οπτική παρουσίαση.
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
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Πίνακας Συχνοτήτων</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οργάνωση Δεδομένων
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Πριν σχεδιάσουμε οποιοδήποτε γράφημα, καταγράφουμε τις παρατηρήσεις μας σε <strong>πίνακα συχνοτήτων</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div className="grid grid-cols-2 gap-2 border-b pb-1 font-bold text-slate-600 text-center">
                    <span>Κατηγορία</span>
                    <span>Συχνότητα (Πλήθος)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-center font-bold text-slate-800">
                    <span>Μπάσκετ</span>
                    <span className="text-blue-700">8 μαθητές</span>
                    <span>Ποδόσφαιρο</span>
                    <span className="text-blue-700">12 μαθητές</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Συχνότητα</strong> ονομάζεται ο αριθμός που δείχνει πόσες φορές εμφανίζεται μια τιμή ή κατηγορία.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ραβδόγραμμα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κανόνες Ραβδογράμματος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στο ραβδόγραμμα χρησιμοποιούμε ορθογώνιες στήλες (ράβδους) με συγκεκριμένους κανόνες:
                </p>

                <div className="space-y-2 text-xs sm:text-sm">
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

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Η κλίμακα στον κατακόρυφο άξονα πρέπει να έχει σταθερά διαστήματα (π.χ. ανά 2, 5 ή 10).
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Εικονόγραμμα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Το Υπόμνημα του Εικονογράμματος
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Στο εικονόγραμμα αντικαθιστούμε τους αριθμούς με <strong>εικόνες ή σύμβολα</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 2xl:p-4 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 font-bold text-indigo-950">
                    Υπόμνημα: 📖 ＝ 5 βιβλία
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Αν μια τάξη διάβασε 20 βιβλία, θα σχεδιάσουμε <strong>4 σύμβολα</strong> (20 : 5 ＝ 4). Αν διάβασε 25, θα σχεδιάσουμε <strong>5 σύμβολα</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Χωρίς υπόμνημα, κανείς δεν μπορεί να καταλάβει πόσες μονάδες αντιπροσωπεύει κάθε εικόνα!
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-6 sm:p-8 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-xs 2xl:text-sm font-semibold text-slate-500">Ανάγνωση &amp; Συμπεράσματα</span>
                </div>
                <h3 className="text-lg sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ερμηνεία Γραφημάτων
                </h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Τα γραφήματα μας επιτρέπουν να βγάζουμε άμεσα συμπεράσματα με μια ματιά:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Επικρατούσα κατηγορία:</strong> Η ψηλότερη ράβδος (μεγαλύτερη συχνότητα).
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Σύνολο δεδομένων:</strong> Το άθροισμα όλων των ράβδων.
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Διαφορές / Συγκρίσεις:</strong> Αφαίρεση υψών μεταξύ δύο κατηγοριών.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ένα γράφημα αξίζει όσο χίλιοι αριθμοί γιατί κάνει τη σύγκριση ορατή σε όλους.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΕΞΟΜΟΙΩΤΗΣ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ ΚΑΙ ΕΙΚΟΝΟΓΡΑΜΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Εξομοιωτής: Ραβδόγραμμα &amp; Εικονόγραμμα
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε τις προτιμήσεις των μαθητών σε 4 αθλήματα ανά 1 μαθητή και κάντε εναλλαγή ανάμεσα σε Ραβδόγραμμα και Εικονόγραμμα.
              </p>
            </div>

            {/* Διακοπτης Προβολης */}
            <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setViewType('bar')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
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
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  viewType === 'pictogram'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🖼️ Εικονόγραμμα (1 σύμβολο = 2 μαθητές)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Χειριστηρια 4 Κατηγοριων (Step 1) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Κατηγορια A: Ποδοσφαιρο */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>⚽</span> Ποδόσφαιρο
                  </span>
                  <span className="font-mono font-black text-sm text-blue-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {catA} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatA((prev) => Math.max(0, prev - 1)); }}
                    disabled={catA <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
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
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Κατηγορια B: Μπασκετ */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏀</span> Μπάσκετ
                  </span>
                  <span className="font-mono font-black text-sm text-amber-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {catB} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatB((prev) => Math.max(0, prev - 1)); }}
                    disabled={catB <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
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
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Κατηγορια C: Βολεϊ */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏐</span> Βόλεϊ
                  </span>
                  <span className="font-mono font-black text-sm text-pink-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {catC} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatC((prev) => Math.max(0, prev - 1)); }}
                    disabled={catC <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
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
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Κατηγορια D: Κολυμβηση */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🏊</span> Κολύμβηση
                  </span>
                  <span className="font-mono font-black text-sm text-cyan-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {catD} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-10 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatD((prev) => Math.max(0, prev - 1)); }}
                    disabled={catD <= 0}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
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
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-xl border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Συνολο */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center font-bold text-xs sm:text-sm text-blue-950">
                Σύνολο μαθητών που ρωτήθηκαν: <strong className="font-mono text-base">{totalVotes}</strong>
              </div>

            </div>

            {/* Οπτικο Γραφημα (Ραβδογραμμα η Εικονογραμμα) */}
            <div className="lg:col-span-7 bg-slate-50 p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                {viewType === 'bar' ? 'ΡΑΒΔΟΓΡΑΜΜΑ ΠΡΟΤΙΜΗΣΕΩΝ ΑΘΛΗΜΑΤΩΝ' : 'ΕΙΚΟΝΟΓΡΑΜΜΑ (ΥΠΟΜΝΗΜΑ: 1 ΣΥΜΒΟΛΟ ＝ 2 ΜΑΘΗΤΕΣ)'}
              </span>

              {viewType === 'bar' ? (
                /* SVG Ραβδογραμμα */
                <div className="w-full max-w-[440px] aspect-[4/3] bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative">
                  <svg viewBox="0 0 400 300" className="w-full h-full overflow-visible">
                    {/* Οριζοντιες γραμμες πλεγματος ανα 5 μοναδες */}
                    {[0, 5, 10, 15, 20].map((v) => {
                      const y = 250 - (v / 20) * 200;
                      return (
                        <g key={`grid-val-${v}`}>
                          <line x1="45" y1={y} x2="380" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x="38" y={y + 4} fontSize="11" fill="#64748b" textAnchor="end" fontWeight="bold">
                            {v}
                          </text>
                        </g>
                      );
                    })}

                    {/* Αξονες */}
                    <line x1="45" y1="250" x2="385" y2="250" stroke="#334155" strokeWidth="2.5" />
                    <line x1="45" y1="250" x2="45" y2="35" stroke="#334155" strokeWidth="2.5" />

                    {/* Ραβδοι */}
                    {categories.map((cat, i) => {
                      const barWidth = 45;
                      const gap = 38;
                      const x = 70 + i * (barWidth + gap);
                      const barHeight = (cat.value / 20) * 200;
                      const y = 250 - barHeight;

                      return (
                        <g key={`bar-${cat.name}`}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={Math.max(barHeight, 0)}
                            fill={cat.color}
                            rx="6"
                            className="transition-all duration-300"
                          />
                          <text
                            x={x + barWidth / 2}
                            y={Math.max(y - 6, 25)}
                            fontSize="12"
                            fontWeight="bold"
                            fill="#0f172a"
                            textAnchor="middle"
                          >
                            {cat.value}
                          </text>
                          <text
                            x={x + barWidth / 2}
                            y="272"
                            fontSize="10"
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
                /* Εικονογραμμα */
                <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 text-center">
                    📌 Υπόμνημα: Κάθε σύμβολο αντιστοιχεί σε <strong>2 μαθητές</strong>.
                  </div>

                  <div className="space-y-3 font-mono text-xs sm:text-sm">
                    {categories.map((cat) => {
                      const fullSymbols = Math.floor(cat.value / 2);
                      const hasHalf = cat.value % 2 !== 0;

                      return (
                        <div key={`picto-${cat.name}`} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                          <span className="font-sans font-bold text-slate-700 w-28 shrink-0">
                            {cat.name}:
                          </span>
                          <div className="flex flex-wrap items-center gap-1.5 grow">
                            {Array.from({ length: fullSymbols }).map((_, idx) => (
                              <span key={`sym-${idx}`} className="text-lg" title="2 μαθητές">
                                {cat.icon}
                              </span>
                            ))}
                            {hasHalf && (
                              <span className="text-xs font-bold bg-amber-200 px-1 py-0.5 rounded text-amber-950 font-sans" title="1 μαθητής (μισό)">
                                ½
                              </span>
                            )}
                            {cat.value === 0 && (
                              <span className="text-xs text-slate-400 font-sans">Κανένας</span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900 w-12 text-right">
                            {cat.value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className="text-xs text-slate-500 font-semibold mt-3 text-center">
                Η επικρατούσα προτίμηση ξεχωρίζει άμεσα από το ύψος ή το πλήθος των εικόνων!
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΕΠΙΛΟΓΗ ΚΛΙΜΑΚΑΣ ΥΠΟΜΝΗΜΑΤΟΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
              <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς Επιλέγουμε την Κλίμακα του Υπομνήματος;
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Όταν έχουμε μεγάλους αριθμούς, δεν μπορούμε να σχεδιάσουμε δεκάδες εικόνες. Αλλάζουμε την αξία του κάθε συμβόλου:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Ρυθμισεις */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>ΑΡΙΘΜΟΣ ΒΙΒΛΙΩΝ:</span>
                  <span className="font-mono text-base text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {booksCount} βιβλία
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={booksCount}
                  onChange={(e) => setBooksCount(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  ΕΠΙΛΟΓΗ ΥΠΟΜΝΗΜΑΤΟΣ (ΚΛΙΜΑΚΑ):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 5, 10].map((s) => (
                    <button
                      key={`sc-${s}`}
                      type="button"
                      onClick={() => setSymbolScale(s)}
                      className={`p-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                        symbolScale === s
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      📖 ＝ {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Αποτελεσμα */}
            <div className="bg-emerald-50/60 p-6 rounded-3xl border border-emerald-200 space-y-3 text-center">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                ΑΠΑΙΤΟΥΜΕΝΑ ΣΥΜΒΟΛΑ ΣΤΟ ΕΙΚΟΝΟΓΡΑΜΜΑ
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 font-mono">
                {formatNum(symbolsNeeded)} {symbolsNeeded === 1 ? 'σύμβολο' : 'σύμβολα'}
              </div>
              <div className="p-3 bg-white rounded-2xl border border-emerald-100 text-xs sm:text-sm text-slate-700 font-mono">
                Υπολογισμός: {booksCount} βιβλία : {symbolScale} βιβλία/σύμβολο ＝ <strong>{formatNum(symbolsNeeded)}</strong>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Όσο μεγαλύτερη η κλίμακα (π.χ. ανά 10), τόσο πιο οικονομικό και ευανάγνωστο γίνεται το εικονόγραμμα.
              </p>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Παραδείγματα Προβλημάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο ολοκληρωμένα προβλήματα σχεδίασης και ερμηνείας ραβδογραμμάτων και εικονογραμμάτων.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΑΝΑΓΝΩΣΗ ΡΑΒΔΟΓΡΑΜΜΑΤΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Σχολείο</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Δανεισμοί Βιβλίων Σχολικής Βιβλιοθήκης
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα ραβδόγραμμα καταγράφηκαν οι δανεισμοί βιβλίων ανά τάξη: Γ' τάξη <strong>15 βιβλία</strong>, Δ' τάξη <strong>20 βιβλία</strong>, Ε' τάξη <strong>25 βιβλία</strong> και ΣΤ' τάξη <strong>30 βιβλία</strong>.
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Ερώτημα 1: Ποιο είναι το σύνολο των δανεισμών;</span>
                  <div>Σύνολο ＝ 15 ＋ 20 ＋ 25 ＋ 30 ＝ <strong className="text-blue-700 text-base">90 βιβλία</strong></div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Ερώτημα 2: Πόσα περισσότερα βιβλία δανείστηκε η ΣΤ' από τη Γ';</span>
                  <div>Διαφορά ＝ 30 － 15 ＝ <strong className="text-emerald-700 text-base">15 βιβλία</strong></div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Στο ραβδόγραμμα, η ράβδος της ΣΤ' τάξης έχει ακριβώς διπλάσιο ύψος από τη ράβδο της Γ' τάξης (30 έναντι 15).
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΚΑΤΑΣΚΕΥΗ ΕΙΚΟΝΟΓΡΑΜΜΑΤΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Ανακύκλωση</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Συλλογή Μπαταριών για Ανακύκλωση
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Οι μαθητές συγκέντρωσαν: Δευτέρα <strong>40 μπαταρίες</strong>, Τρίτη <strong>60 μπαταρίες</strong>, Τετάρτη <strong>50 μπαταρίες</strong>. Θέλουμε να φτιάξουμε εικονόγραμμα με υπόμνημα <strong>🔋 ＝ 10 μπαταρίες</strong>.
              </p>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Υπολογισμός συμβόλων ανά ημέρα:</span>
                  <div>• Δευτέρα: 40 : 10 ＝ <strong className="text-amber-700">4 σύμβολα</strong> (🔋🔋🔋🔋)</div>
                  <div>• Τρίτη: 60 : 10 ＝ <strong className="text-amber-700">6 σύμβολα</strong> (🔋🔋🔋🔋🔋🔋)</div>
                  <div>• Τετάρτη: 50 : 10 ＝ <strong className="text-amber-700">5 σύμβολα</strong> (🔋🔋🔋🔋🔋)</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Συνολικά σχεδιάστηκαν 4 ＋ 6 ＋ 5 ＝ 15 σύμβολα, τα οποία αντιπροσωπεύουν 15 · 10 ＝ 150 μπαταρίες.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
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

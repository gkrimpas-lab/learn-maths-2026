// pages/st-dimotikou/57-alla-grafimata.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

export default function AllaGrafimataTheoryPage() {
  // Εργαστηριο 1: Διαδραστικη Απεικονιση Δεδομενων σε 3 ειδη γραφηματων
  const [chartType, setChartType] = useState('line'); // 'line', 'hbar', 'pie'
  const [val1, setVal1] = useState(15);
  const [val2, setVal2] = useState(25);
  const [val3, setVal3] = useState(35);
  const [val4, setVal4] = useState(20);

  const total = val1 + val2 + val3 + val4;

  const dataset = useMemo(() => [
    { label: 'Σημείο Α', value: val1, color: '#3b82f6', angle: total > 0 ? (val1 / total) * 360 : 0 },
    { label: 'Σημείο Β', value: val2, color: '#10b981', angle: total > 0 ? (val2 / total) * 360 : 0 },
    { label: 'Σημείο Γ', value: val3, color: '#f59e0b', angle: total > 0 ? (val3 / total) * 360 : 0 },
    { label: 'Σημείο Δ', value: val4, color: '#ec4899', angle: total > 0 ? (val4 / total) * 360 : 0 }
  ], [val1, val2, val3, val4, total]);

  // Εργαστηριο 2: Υπολογιστης Επικεντρης Γωνιας
  const [percentInput, setPercentInput] = useState(25); // 25%

  const degreesCalculated = useMemo(() => {
    return Number(((percentInput * 360) / 100).toFixed(1));
  }, [percentInput]);

  return (
    <Layout
      title="Άλλα Γραφήματα: Γραμμής, Οριζόντιο, Κυκλικό - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πότε χρησιμοποιούμε γράφημα γραμμής, οριζόντιο ραβδόγραμμα και κυκλικό διάγραμμα (πίτα), πώς υπολογίζουμε επίκεντρες γωνίες και ερμηνεύουμε στατιστικά στοιχεία."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/57-alla-grafimata-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 57 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Άλλα Είδη Γραφημάτων: Γραμμής, Οριζόντιο &amp; Κυκλικό
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Επεκτείνουμε τις γνώσεις μας στη στατιστική απεικόνιση: Μαθαίνουμε να αποτυπώνουμε τη διαχρονική εξέλιξη με <strong>γραφήματα γραμμής</strong>, να συγκρίνουμε ονόματα με <strong>οριζόντια ραβδογράμματα</strong> και να διαιρούμε το όλο σε ποσοστά και μοίρες με <strong>κυκλικά διαγράμματα</strong>.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτικά Παραδείγματα &amp; Διαδραστική Εναλλαγή Γραφημάτων</span>
            </div>
            <Link
              href="/st-dimotikou/57-alla-grafimata-ask"
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
              Επιλογή του Κατάλληλου Γραφήματος σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Κάθε είδος γραφήματος έχει έναν συγκεκριμένο ρόλο ανάλογα με τα δεδομένα που θέλουμε να προβάλουμε.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εξέλιξη Χρόνου</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Γράφημα Γραμμής
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Χρησιμοποιείται όταν θέλουμε να δείξουμε <strong>πώς μεταβάλλεται ένα μέγεθος με την πάροδο του χρόνου</strong> (χρονοσειρά):
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>Οριζόντιος άξονας (χ):</strong> Ο χρόνος (ώρες, ημέρες, μήνες, έτη).</div>
                  <div>• <strong>Κατακόρυφος άξονας (ψ):</strong> Το μέγεθος (θερμοκρασία, ύψος, πωλήσεις).</div>
                  <div>• <strong>Σημεία &amp; Ευθύγραμμα τμήματα:</strong> Ενώνουμε τα σημεία για να δούμε αν η τάση είναι ανοδική, καθοδική ή σταθερή.</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ιδανικό για: ημερήσιες θερμοκρασίες, ανάπτυξη φυτού, μηνιαία έξοδα.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Σύγκριση Ονομάτων</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Οριζόντιο Ραβδόγραμμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι ένα κλασικό ραβδόγραμμα «ξαπλωμένο» οριζόντια. Προτιμάται όταν <strong>οι κατηγορίες έχουν μεγάλα ονόματα</strong>:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 text-slate-700">
                  <div>• <strong>Κατακόρυφος άξονας:</strong> Οι κατηγορίες / ονόματα.</div>
                  <div>• <strong>Οριζόντιος άξονας:</strong> Η κλίμακα των αριθμητικών τιμών.</div>
                  <div>• <strong>Μήκος ράβδου:</strong> Δείχνει τη συχνότητα της κάθε κατηγορίας.</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Διευκολύνει την ανάγνωση χωρίς να χρειάζεται να γέρνουμε το κεφάλι για να διαβάσουμε μεγάλες λέξεις!
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μέρος προς Όλο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Κυκλικό Διάγραμμα (Πίτα)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αναπαριστά τη <strong>σχέση των επιμέρους τμημάτων με το σύνολο</strong>. Ολόκληρος ο κύκλος αντιπροσωπεύει το 100%:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm text-center font-mono">
                  <div className="text-indigo-950 font-bold">
                    Ολόκληρος Κύκλος ＝ 100 % ＝ 360°
                  </div>
                  <div className="text-slate-600 font-sans text-[11px] leading-normal">
                    Μισός Κύκλος ＝ 50 % ＝ 180° | Τέταρτο ＝ 25 % ＝ 90°
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Κάθε τομέας του κύκλου έχει επίκεντρη γωνία ανάλογη με το ποσοστό της κατηγορίας.
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Μαθηματικός Τύπος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Υπολογισμός Επίκεντρης Γωνίας
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να σχεδιάσουμε έναν κυκλικό τομέα με μοιρογνωμόνιο, βρίσκουμε τις μοίρες με αναλογία:
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-emerald-900 font-bold">
                    Μοίρες (α°) ＝ (Ποσοστό % · 360°) : 100
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans">
                    Παράδειγμα: Το 20% αντιστοιχεί σε (20 · 360) : 100 ＝ <strong>72°</strong>.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Το άθροισμα των γωνιών όλων των κυκλικών τομέων ισούται αυστηρά με 360°.
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΜΕΤΑΤΡΟΠΕΑΣ ΓΡΑΦΗΜΑΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Μετατροπέας: Ίδια Δεδομένα σε 3 Διαφορετικά Γραφήματα
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Ρυθμίστε τις τιμές ανά 1 μονάδα και αλλάξτε την προβολή για να δείτε πώς τα ίδια δεδομένα παρουσιάζονται σε Γράφημα Γραμμής, Οριζόντιο Ραβδόγραμμα ή Κυκλικό Διάγραμμα.
              </p>
            </div>

            {/* Διακοπτης 3 Τυπων Γραφηματος */}
            <div className="grid grid-cols-3 sm:flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setChartType('line')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  chartType === 'line'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📈 Γραμμής
              </button>
              <button
                type="button"
                onClick={() => setChartType('hbar')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  chartType === 'hbar'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Οριζόντιο
              </button>
              <button
                type="button"
                onClick={() => setChartType('pie')}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition text-center ${
                  chartType === 'pie'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🥧 Κυκλικό
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Τιμων (4 Steppers με grid 36px_1fr_36px και κουμπια 36px) */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-3.5">
              
              {/* Σημειο Α */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Σημείο Α
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val1} μονάδες
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Σημείου Α"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.max(5, prev - 1)); }}
                    disabled={val1 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val1}
                    onChange={(e) => setVal1(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Σημείου Α"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal1((prev) => Math.min(50, prev + 1)); }}
                    disabled={val1 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σημειο Β */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Σημείο Β
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val2} μονάδες
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Σημείου Β"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.max(5, prev - 1)); }}
                    disabled={val2 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val2}
                    onChange={(e) => setVal2(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Σημείου Β"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal2((prev) => Math.min(50, prev + 1)); }}
                    disabled={val2 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σημειο Γ */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Σημείο Γ
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val3} μονάδες
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Σημείου Γ"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.max(5, prev - 1)); }}
                    disabled={val3 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val3}
                    onChange={(e) => setVal3(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Σημείου Γ"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal3((prev) => Math.min(50, prev + 1)); }}
                    disabled={val3 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Σημειο Δ */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Σημείο Δ
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-pink-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {val4} μονάδες
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση Σημείου Δ"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.max(5, prev - 1)); }}
                    disabled={val4 <= 5}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={1}
                    value={val4}
                    onChange={(e) => setVal4(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση Σημείου Δ"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setVal4((prev) => Math.min(50, prev + 1)); }}
                    disabled={val4 >= 50}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Συνολο Μοναδων */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-center font-bold text-xs sm:text-sm text-blue-950">
                Σύνολο μονάδων: <strong className="font-mono text-sm sm:text-base">{total}</strong>
              </div>

            </div>

            {/* Οπτικη Προβολη Γραφηματος (SVG) Χωρις Scroll στα Κινητα */}
            <div className="lg:col-span-7 bg-slate-50 p-3.5 sm:p-6 rounded-3xl border border-slate-200 flex flex-col items-center justify-center w-full min-h-[340px]">
              
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3 text-center">
                {chartType === 'line' && 'ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ (ΧΡΟΝΟΣΕΙΡΑ)'}
                {chartType === 'hbar' && 'ΟΡΙΖΟΝΤΙΟ ΡΑΒΔΟΓΡΑΜΜΑ (ΣΥΓΚΡΙΣΗ)'}
                {chartType === 'pie' && 'ΚΥΚΛΙΚΟ ΔΙΑΓΡΑΜΜΑ (ΜΕΡΟΣ ΠΡΟΣ ΟΛΟ)'}
              </span>

              {/* 1. Γραφημα Γραμμης (Line Chart) */}
              {chartType === 'line' && (
                <div className="w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 380 240" className="w-full h-auto max-h-[260px] overflow-visible">
                    {[0, 15, 30, 45, 60].map((t) => {
                      const y = 195 - (t / 60) * 150;
                      return (
                        <g key={`l-tick-${t}`}>
                          <line x1="42" y1={y} x2="365" y2={y} stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x="35" y={y + 4} fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="end">
                            {t}
                          </text>
                        </g>
                      );
                    })}

                    <line x1="42" y1="195" x2="370" y2="195" stroke="#334155" strokeWidth="2" />
                    <line x1="42" y1="195" x2="42" y2="25" stroke="#334155" strokeWidth="2" />

                    {(() => {
                      const pts = dataset.map((d, i) => {
                        const px = 80 + i * 85;
                        const py = 195 - (d.value / 60) * 150;
                        return { px, py, ...d };
                      });
                      const polyStr = pts.map(p => `${p.px},${p.py}`).join(' ');

                      return (
                        <g>
                          <polyline points={polyStr} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          {pts.map((p, idx) => (
                            <g key={`pt-${idx}`}>
                              <circle cx={p.px} cy={p.py} r="5.5" fill={p.color} stroke="#ffffff" strokeWidth="2" />
                              <text x={p.px} y={p.py - 9} fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">
                                {p.value}
                              </text>
                              <text x={p.px} y="215" fontSize="10.5" fontWeight="bold" fill="#475569" textAnchor="middle">
                                {p.label}
                              </text>
                            </g>
                          ))}
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              )}

              {/* 2. Οριζοντιο Ραβδογραμμα (Horizontal Bar Chart) */}
              {chartType === 'hbar' && (
                <div className="w-full max-w-[460px] aspect-[4/3] sm:aspect-[16/10] bg-white rounded-2xl border border-slate-200 p-2 sm:p-4 shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 380 240" className="w-full h-auto max-h-[260px] overflow-visible">
                    {[0, 15, 30, 45, 60].map((t) => {
                      const x = 75 + (t / 60) * 260;
                      return (
                        <g key={`h-tick-${t}`}>
                          <line x1={x} y1="25" x2={x} y2="195" stroke="#f1f5f9" strokeWidth="1.5" />
                          <text x={x} y="210" fontSize="10" fontWeight="bold" fill="#64748b" textAnchor="middle">
                            {t}
                          </text>
                        </g>
                      );
                    })}

                    <line x1="75" y1="195" x2="350" y2="195" stroke="#334155" strokeWidth="2" />
                    <line x1="75" y1="195" x2="75" y2="25" stroke="#334155" strokeWidth="2" />

                    {dataset.map((d, i) => {
                      const bh = 24;
                      const by = 38 + i * 38;
                      const bw = (d.value / 60) * 260;

                      return (
                        <g key={`hbar-${i}`}>
                          <text x="68" y={by + 16} fontSize="10.5" fontWeight="bold" fill="#334155" textAnchor="end">
                            {d.label}
                          </text>
                          <rect x="75" y={by} width={Math.max(bw, 3)} height={bh} fill={d.color} rx="4" />
                          <text x={75 + bw + 6} y={by + 17} fontSize="10.5" fontWeight="bold" fill="#0f172a">
                            {d.value}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              )}

              {/* 3. Κυκλικο Διαγραμμα (Pie Chart - Πληρως Responsive για κινητα χωρις overflow) */}
              {chartType === 'pie' && (
                <div className="w-full max-w-[460px] bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm flex flex-col items-center justify-center gap-3">
                  
                  {/* SVG Κυκλος με fluid aspect ratio */}
                  <div className="w-full max-w-[190px] sm:max-w-[210px] aspect-square flex items-center justify-center">
                    <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                      {(() => {
                        let cumulativeAngle = 0;
                        return dataset.map((d, i) => {
                          const startAngle = cumulativeAngle;
                          const sliceAngle = d.angle;
                          cumulativeAngle += sliceAngle;

                          if (sliceAngle <= 0) return null;

                          const x1 = 110 + 85 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                          const y1 = 110 + 85 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                          const x2 = 110 + 85 * Math.cos((Math.PI * (startAngle + sliceAngle - 90)) / 180);
                          const y2 = 110 + 85 * Math.sin((Math.PI * (startAngle + sliceAngle - 90)) / 180);
                          const largeArc = sliceAngle > 180 ? 1 : 0;

                          const pathData = `M 110 110 L ${x1} ${y1} A 85 85 0 ${largeArc} 1 ${x2} ${y2} Z`;

                          return (
                            <path
                              key={`slice-${i}`}
                              d={pathData}
                              fill={d.color}
                              stroke="#ffffff"
                              strokeWidth="2"
                              className="transition-all duration-300"
                            />
                          );
                        });
                      })()}
                    </svg>
                  </div>

                  {/* Υπομνημα Κυκλικου σε Responsive Grid */}
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full text-[11px] sm:text-xs font-mono pt-1">
                    {dataset.map((d, i) => {
                      const pct = total > 0 ? ((d.value / total) * 100).toFixed(0) : 0;
                      return (
                        <div
                          key={`pie-leg-${i}`}
                          className="flex items-center justify-between gap-1 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }}></span>
                            <span className="font-sans font-bold text-slate-700 truncate">{d.label}</span>
                          </div>
                          <span className="font-bold text-slate-900 shrink-0">
                            {pct}% ({formatNum(d.angle, 0)}°)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              )}

              <span className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2.5 text-center leading-normal">
                Η επιλογή του γραφήματος εξαρτάται από τον στόχο: εξέλιξη (γραμμή), σύγκριση (ραβδόγραμμα) ή ποσοστά (κυκλικό)!
              </span>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΥΠΟΛΟΓΙΣΤΗΣ ΕΠΙΚΕΝΤΡΗΣ ΓΩΝΙΑΣ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>📐 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΛΟΓΙΑ ΜΟΙΡΩΝ ΚΑΙ ΠΟΣΟΣΤΩΝ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Πώς Υπολογίζουμε την Επίκεντρη Γωνία (360° ＝ 100%)
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Σύρετε το ποσοστό (%) για να δείτε ακριβώς πόσες μοίρες επίκεντρης γωνίας πρέπει να σχεδιάσουμε με το μοιρογνωμόνιο:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Ρυθμισεις Ποσοστου με stepper 36px */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>ΠΟΣΟΣΤΟ ΚΑΤΗΓΟΡΙΑΣ (%):</span>
                  <span className="font-mono text-base sm:text-lg text-amber-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 font-black">
                    {percentInput} %
                  </span>
                </div>
                <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                  <button
                    type="button"
                    aria-label="Μείωση ποσοστού"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentInput((prev) => Math.max(1, prev - 1)); }}
                    disabled={percentInput <= 1}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    step={1}
                    value={percentInput}
                    onChange={(e) => setPercentInput(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    aria-label="Αύξηση ποσοστού"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPercentInput((prev) => Math.min(100, prev + 1)); }}
                    disabled={percentInput >= 100}
                    className="w-9 h-9 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-base"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Γρηγορες Επιλογες */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 75].map((presetPct) => (
                  <button
                    key={`pre-${presetPct}`}
                    type="button"
                    onClick={() => setPercentInput(presetPct)}
                    className="bg-white border border-slate-200 hover:bg-slate-100 py-2 rounded-xl font-bold text-xs sm:text-sm text-slate-700 shadow-sm transition active:scale-95 text-center touch-manipulation"
                  >
                    {presetPct} %
                  </button>
                ))}
              </div>
            </div>

            {/* Αποτελεσμα & Τυπος */}
            <div className="bg-amber-50/60 p-5 sm:p-6 rounded-3xl border border-amber-200 space-y-3 text-center">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                ΕΠΙΚΕΝΤΡΗ ΓΩΝΙΑ ΣΕ ΜΟΙΡΕΣ (α°)
              </span>
              <div className="text-3xl sm:text-5xl font-black text-amber-700 font-mono">
                {degreesCalculated}°
              </div>
              <div className="p-2.5 sm:p-3 bg-white rounded-2xl border border-amber-100 text-xs sm:text-sm text-slate-700 font-mono">
                Αναλογία: ({percentInput} · 360°) : 100 ＝ <strong>{degreesCalculated}°</strong>
              </div>
              <p className="text-xs text-slate-500 font-sans">
                Στο 100% αντιστοιχούν 360°. Στο {percentInput}% αντιστοιχούν ακριβώς {degreesCalculated}°.
              </p>
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
              Δύο ολοκληρωμένα προβλήματα με γράφημα γραμμής και κυκλικό διάγραμμα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΓΡΑΦΗΜΑ ΓΡΑΜΜΗΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Μετεωρολογία</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Διακύμανση Θερμοκρασίας στη Διάρκεια της Ημέρας
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε έναν μετεωρολογικό σταθμό καταγράφηκε η θερμοκρασία: 08:00 (<strong>12°C</strong>), 12:00 (<strong>20°C</strong>), 16:00 (<strong>18°C</strong>), 20:00 (<strong>14°C</strong>).
              </p>

              {/* ΣΧΗΜΑ 1: SVG Γραφημα Γραμμης Responsive */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
                  ΣΧΗΜΑ: ΧΡΟΝΟΣΕΙΡΑ ΘΕΡΜΟΚΡΑΣΙΑΣ (°C)
                </span>
                <div className="w-full max-w-[340px] mx-auto aspect-[16/9] bg-white rounded-xl border border-slate-200 p-2 shadow-inner">
                  <svg viewBox="0 0 320 150" className="w-full h-full overflow-visible">
                    {[0, 10, 20].map((deg) => {
                      const y = 120 - (deg / 20) * 95;
                      return (
                        <g key={`deg-${deg}`}>
                          <line x1="35" y1={y} x2="310" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="28" y={y + 3.5} fontSize="9" fontWeight="bold" fill="#64748b" textAnchor="end">{deg}°</text>
                        </g>
                      );
                    })}
                    <line x1="35" y1="120" x2="315" y2="120" stroke="#334155" strokeWidth="1.5" />
                    <line x1="35" y1="120" x2="35" y2="15" stroke="#334155" strokeWidth="1.5" />

                    <polyline points="60,63 130,25 200,34 270,53" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                    {[
                      { x: 60, y: 63, label: '08:00', val: '12°' },
                      { x: 130, y: 25, label: '12:00', val: '20°' },
                      { x: 200, y: 34, label: '16:00', val: '18°' },
                      { x: 270, y: 53, label: '20:00', val: '14°' }
                    ].map((pt, idx) => (
                      <g key={`pt-temp-${idx}`}>
                        <circle cx={pt.x} cy={pt.y} r="4" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                        <text x={pt.x} y={pt.y - 6} fontSize="9.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">{pt.val}</text>
                        <text x={pt.x} y="134" fontSize="8.5" fontWeight="bold" fill="#475569" textAnchor="middle">{pt.label}</text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Ερωτήματα &amp; Απαντήσεις:</span>
                  <div>• <strong>Μέγιστη θερμοκρασία:</strong> 20°C (στις 12:00 το μεσημέρι).</div>
                  <div>• <strong>Εύρος διακύμανσης:</strong> 20°C － 12°C ＝ <strong className="text-blue-700">8°C</strong>.</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Το γράφημα γραμμής δείχνει καθαρά την άνοδο της θερμοκρασίας μέχρι το μεσημέρι και τη βαθμιαία πτώση της προς το απόγευμα.
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΚΥΚΛΙΚΟ ΔΙΑΓΡΑΜΜΑ
                </span>
                <span className="text-xs font-bold text-slate-400">Δραστηριότητες</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Κατανομή Ελεύθερου Χρόνου Μαθητή
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ένας μαθητής αφιερώνει τον ελεύθερο χρόνο του ως εξής: Αθλητισμός <strong>50 %</strong>, Διάβασμα εξωσχολικών βιβλίων <strong>25 %</strong>, Μουσική <strong>25 %</strong>.
              </p>

              {/* ΣΧΗΜΑ 2: SVG Κυκλικο Διαγραμμα Responsive */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1">
                  ΣΧΗΜΑ: ΚΥΚΛΙΚΟΣ ΤΟΜΕΑΣ ΑΝΑΛΟΓΙΑΣ
                </span>
                <div className="w-full max-w-[280px] mx-auto aspect-square bg-white rounded-xl border border-slate-200 p-2 shadow-inner flex flex-col items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-32 h-32 sm:w-36 sm:h-36">
                    <path d="M 80 80 L 80 10 A 70 70 0 0 1 80 150 Z" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                    <path d="M 80 80 L 80 150 A 70 70 0 0 1 10 80 Z" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                    <path d="M 80 80 L 10 80 A 70 70 0 0 1 80 10 Z" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                  </svg>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 pt-2 text-[10px] font-mono">
                    <span className="text-blue-700 font-bold">● Αθλητισμός (50%/180°)</span>
                    <span className="text-emerald-700 font-bold">● Διάβασμα (25%/90°)</span>
                    <span className="text-amber-700 font-bold">● Μουσική (25%/90°)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Υπολογισμός Επίκεντρων Γωνιών:</span>
                  <div>• Αθλητισμός (50%): (50 · 360) : 100 ＝ <strong className="text-blue-700">180°</strong></div>
                  <div>• Διάβασμα (25%): (25 · 360) : 100 ＝ <strong className="text-emerald-700">90°</strong></div>
                  <div>• Μουσική (25%): (25 · 360) : 100 ＝ <strong className="text-amber-700">90°</strong></div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                💡 Το άθροισμα των γωνιών είναι: 180° ＋ 90° ＋ 90° ＝ 360° (ένας πλήρης κύκλος).
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Άλλα Είδη Γραφημάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις με γραφήματα γραμμής, οριζόντια ραβδογράμματα, κυκλικά διαγράμματα και υπολογισμούς επίκεντρων γωνιών για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/57-alla-grafimata-ask"
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

// pages/st-dimotikou/56-pinakas-sixnotiton.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μορφοποιηση αριθμου
function formatNum(val, decimals = 1) {
  if (Number.isInteger(val)) return String(val);
  const rounded = Number(val.toFixed(decimals));
  return String(rounded).replace('.', ',');
}

// Τυχαιος ακεραιος
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PinakasSixnotitonTheoryPage() {
  // Εργαστηριο 1: Διαδραστικος Πινακας Κατανομης Συχνοτητων (Step 1)
  const [freqA, setFreqA] = useState(6);  // Βαθμός 10
  const [freqB, setFreqB] = useState(10); // Βαθμός 9
  const [freqC, setFreqC] = useState(5);  // Βαθμός 8
  const [freqD, setFreqD] = useState(4);  // Βαθμός 7

  const totalN = freqA + freqB + freqC + freqD;

  const tableRows = useMemo(() => {
    const rawData = [
      { label: 'Βαθμός 10', shortLabel: '10', freq: freqA, color: '#10b981' },
      { label: 'Βαθμός 9', shortLabel: '9', freq: freqB, color: '#3b82f6' },
      { label: 'Βαθμός 8', shortLabel: '8', freq: freqC, color: '#f59e0b' },
      { label: 'Βαθμός 7', shortLabel: '7', freq: freqD, color: '#ec4899' }
    ];

    return rawData.map((row) => {
      const relFreq = totalN > 0 ? row.freq / totalN : 0;
      const pct = totalN > 0 ? (row.freq / totalN) * 100 : 0;
      return {
        ...row,
        relFreq: Number(relFreq.toFixed(2)),
        pct: Number(pct.toFixed(1))
      };
    });
  }, [freqA, freqB, freqC, freqD, totalN]);

  // Επικρατουσα κατηγορια (μεγαλυτερη συχνοτητα)
  const maxFreqRow = useMemo(() => {
    return [...tableRows].sort((a, b) => b.freq - a.freq)[0];
  }, [tableRows]);

  // Εργαστηριο 2: Ταξινομηση & Καταμετρηση Πρωτογενων Δεδομενων
  const [rawSample, setRawSample] = useState([2, 3, 1, 2, 4, 3, 2, 1, 3, 2, 4, 2]);

  const tallyCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    rawSample.forEach((val) => {
      if (counts[val] !== undefined) counts[val]++;
    });
    return counts;
  }, [rawSample]);

  const generateNewRawData = () => {
    const newArr = [];
    for (let i = 0; i < 12; i++) {
      newArr.push(randInt(1, 4));
    }
    setRawSample(newArr);
  };

  return (
    <Layout
      title="Πίνακας Συχνοτήτων & Ταξινόμηση Δεδομένων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μαθαίνουμε πώς ταξινομούμε πρωτογενή δεδομένα, πώς κατασκευάζουμε πίνακα κατανομής συχνοτήτων και σχετικών συχνοτήτων και πώς εξάγουμε ασφαλή συμπεράσματα."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/56-pinakas-sixnotiton-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 56 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Ταξινόμηση Δεδομένων &amp; Πίνακας Συχνοτήτων
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-2xl leading-relaxed max-w-4xl">
              Ανακαλύπτουμε πώς μετατρέπουμε μια άτακτη συλλογή πληροφοριών σε έναν οργανωμένο πίνακα κατανομής συχνοτήτων. Υπολογίζουμε συχνότητες, σχετικές συχνότητες και ποσοστά (%), και μαθαίνουμε να εξάγουμε έγκυρα στατιστικά συμπεράσματα.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Οπτικοί Πίνακες &amp; Διαδραστικός Υπολογιστής Συχνοτήτων</span>
            </div>
            <Link
              href="/st-dimotikou/56-pinakas-sixnotiton-ask"
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
              Η Διαδρομή της Στατιστικής Έρευνας σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την πρωτογενή καταγραφή των αριθμών στην ερμηνεία και τα συμπεράσματα.
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
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Διαλογή</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Συλλογή &amp; Ταξινόμηση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν συγκεντρώνουμε μετρήσεις (π.χ. βαθμούς διαγωνίσματος), τα δεδομένα είναι άτακτα. Κάνουμε <strong>διαλογή</strong> μετρώντας πόσες φορές εμφανίζεται κάθε τιμή:
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1 font-mono">
                  <div className="text-slate-500 font-sans text-[11px]">Άτακτα δεδομένα:</div>
                  <div className="font-bold text-slate-800 text-xs sm:text-sm">10, 9, 8, 9, 10, 9, 7, 8, 9</div>
                  <div className="text-slate-500 font-sans text-[11px] pt-1">Ταξινόμηση σε αύξουσα σειρά:</div>
                  <div className="font-bold text-blue-700 text-xs sm:text-sm">7, 8, 8, 9, 9, 9, 9, 10, 10</div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η ταξινόμηση από το μικρότερο στο μεγαλύτερο αποτρέπει τα λάθη καταμέτρησης.
              </div>
            </article>

            {/* Βημα 2ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πίνακας</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πίνακας Συχνοτήτων
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Ο <strong>πίνακας κατανομής συχνοτήτων</strong> καταγράφει σε στήλες τις τιμές της μεταβλητής και το πλήθος των εμφανίσεών τους:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>Συχνότητα (ν):</strong> Πόσες φορές εμφανίζεται η τιμή.
                  </div>
                  <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                    • <strong>Μέγεθος Δείγματος (Ν):</strong> Το άθροισμα όλων των συχνοτήτων (σύνολο παρατηρήσεων).
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Αν αθροίσουμε όλες τις συχνότητες, βρίσκουμε υποχρεωτικά το συνολικό μέγεθος του δείγματος.
              </div>
            </article>

            {/* Βημα 3ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αναλογία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σχετική Συχνότητα &amp; %
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η <strong>σχετική συχνότητα</strong> εκφράζει το μέρος του συνόλου που αντιστοιχεί σε κάθε τιμή:
                </p>

                <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs sm:text-sm font-mono text-center">
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-indigo-950 font-bold">
                    Σχετική Συχνότητα ＝ ν : Ν
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-600 font-sans">
                    Ποσοστό (%) ＝ Σχετική Συχνότητα · 100
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Το άθροισμα των σχετικών συχνοτήτων ισούται πάντα με <strong>1</strong> (ή το <strong>100%</strong>).
              </div>
            </article>

            {/* Βημα 4ο */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Συμπεράσματα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Επικρατούσα Τιμή &amp; Εύρος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Από τον πίνακα διαβάζουμε άμεσα τα βασικά στατιστικά χαρακτηριστικά:
                </p>

                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Επικρατούσα Τιμή (Mode):</strong> Η τιμή με τη <em>μεγαλύτερη συχνότητα</em>.
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                    • <strong>Εύρος:</strong> Μέγιστη τιμή － Ελάχιστη τιμή.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Έτσι απαντάμε σε ερωτήματα όπως: «Ποιος βαθμός σημειώθηκε τις περισσότερες φορές;»
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΟΣ ΠΙΝΑΚΑΣ ΚΑΤΑΝΟΜΗΣ ΣΥΧΝΟΤΗΤΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 sm:pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Δυναμικός Πίνακας Κατανομής &amp; Σχετικών Συχνοτήτων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Μεταβάλλετε τις συχνότητες των 4 βαθμολογιών ανά 1 μαθητή. Ο πίνακας υπολογίζει αυτόματα το σύνολο, τις σχετικές συχνότητες, τα ποσοστά και την επικρατούσα τιμή.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Χειριστηρια Συχνοτητων (Step 1) */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* Βαθμος 10 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Βαθμός 10
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqA} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqA((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqA <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqA}
                    onChange={(e) => setFreqA(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqA((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqA >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Βαθμος 9 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Βαθμός 9
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqB} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqB((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqB <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqB}
                    onChange={(e) => setFreqB(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqB((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqB >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Βαθμος 8 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Βαθμός 8
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-amber-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqC} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqC((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqC <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqC}
                    onChange={(e) => setFreqC(Number(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqC((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqC >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

              {/* Βαθμος 7 */}
              <div className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Βαθμός 7
                  </span>
                  <span className="font-mono font-black text-xs sm:text-sm text-pink-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {freqD} μαθητές
                  </span>
                </div>
                <div className="grid grid-cols-[34px_1fr_34px] items-center h-9 w-full gap-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqD((prev) => Math.max(0, prev - 1)); }}
                    disabled={freqD <= 0}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    －
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    step={1}
                    value={freqD}
                    onChange={(e) => setFreqD(Number(e.target.value))}
                    className="w-full accent-pink-600 cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFreqD((prev) => Math.min(15, prev + 1)); }}
                    disabled={freqD >= 15}
                    className="w-8 h-8 shrink-0 flex items-center justify-center select-none touch-manipulation active:scale-95 transition bg-white hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none text-slate-800 font-black rounded-lg border border-slate-300 shadow-sm text-sm"
                  >
                    ＋
                  </button>
                </div>
              </div>

            </div>

            {/* Πινακας Κατανομης Συχνοτητων - Πληρως Responsive Χωρις Scroll στα Κινητα */}
            <div className="lg:col-span-7 bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 space-y-3 sm:space-y-4 w-full">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                  ΠΙΝΑΚΑΣ ΚΑΤΑΝΟΜΗΣ ΣΥΧΝΟΤΗΤΩΝ
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Σύνολο: <strong className="font-mono text-blue-700">{totalN}</strong>
                </span>
              </div>

              {/* Πινακας με δυναμικο sizing στηλων ωστε να χωραει παντα σε 320px-360px */}
              <div className="w-full">
                <table className="w-full table-fixed bg-white rounded-2xl border border-slate-200 text-center text-[11px] sm:text-xs md:text-sm font-mono overflow-hidden shadow-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold font-sans">
                      <th className="w-[30%] p-1.5 sm:p-2.5 text-left pl-2 sm:pl-3 truncate">Τιμή</th>
                      <th className="w-[20%] p-1.5 sm:p-2.5 truncate" title="Συχνότητα (ν)">ν</th>
                      <th className="w-[25%] p-1.5 sm:p-2.5 truncate" title="Σχετική Συχνότητα">Σχ. ν</th>
                      <th className="w-[25%] p-1.5 sm:p-2.5 truncate" title="Ποσοστό (%)">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((r, idx) => (
                      <tr key={`tr-${idx}`} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="p-1.5 sm:p-2.5 text-left pl-2 sm:pl-3 font-bold font-sans flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }}></span>
                          <span className="hidden sm:inline truncate">{r.label}</span>
                          <span className="sm:hidden font-mono font-bold">{r.shortLabel}</span>
                        </td>
                        <td className="p-1.5 sm:p-2.5 font-black text-slate-900">{r.freq}</td>
                        <td className="p-1.5 sm:p-2.5 text-slate-600">{formatNum(r.relFreq, 2)}</td>
                        <td className="p-1.5 sm:p-2.5 font-bold text-emerald-700">{formatNum(r.pct)}%</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100/70 font-black text-slate-900 font-sans border-t border-slate-200">
                      <td className="p-1.5 sm:p-2.5 text-left pl-2 sm:pl-3 truncate">ΣΥΝΟΛΟ</td>
                      <td className="p-1.5 sm:p-2.5 font-mono">{totalN}</td>
                      <td className="p-1.5 sm:p-2.5 font-mono">1,00</td>
                      <td className="p-1.5 sm:p-2.5 font-mono text-emerald-800">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Ενημερωτικη Καρτα Επικρατουσας Τιμης */}
              <div className="p-2.5 sm:p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs sm:text-sm text-blue-950 flex items-center justify-between gap-2">
                <span className="truncate">
                  🌟 <strong>Επικρατούσα τιμή:</strong> {maxFreqRow ? maxFreqRow.label : '-'} (ν ＝ {maxFreqRow ? maxFreqRow.freq : 0})
                </span>
                <span className="font-bold text-blue-800 text-[11px] sm:text-xs shrink-0">
                  {maxFreqRow ? `${formatNum(maxFreqRow.pct)}%` : ''}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΛΟΓΗ & ΚΑΤΑΜΕΤΡΗΣΗ ΠΡΩΤΟΓΕΝΩΝ ΔΕΔΟΜΕΝΩΝ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs 2xl:text-sm font-bold text-emerald-800 mb-1">
                <span>⚡ ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΔΙΑΛΟΓΗ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Πώς Κάνουμε Διαλογή με Γραμμές Καταμέτρησης
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πατήστε «Νέα Τυχαία Δεδομένα» και δείτε πώς ταξινομούνται αυτόματα τα πρωτογενή νούμερα με γραμμές καταμέτρησης (|) στον πίνακα:
              </p>
            </div>

            <button
              type="button"
              onClick={generateNewRawData}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 shrink-0 self-start sm:self-center"
            >
              🔄 Νέα Τυχαία Δεδομένα
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
            
            {/* Πρωτογενη Ατακτα Δεδομενα */}
            <div className="lg:col-span-5 bg-slate-50 p-4 sm:p-5 rounded-3xl border border-slate-200 space-y-2.5">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">
                ΠΡΩΤΟΓΕΝΗ ΔΕΔΟΜΕΝΑ (12 ΠΑΡΑΤΗΡΗΣΕΙΣ)
              </span>
              <div className="grid grid-cols-6 sm:grid-cols-4 gap-1.5 sm:gap-2">
                {rawSample.map((num, i) => (
                  <span
                    key={`raw-${i}`}
                    className="aspect-square rounded-xl bg-white border border-slate-200 font-mono font-black text-sm sm:text-base text-slate-800 flex items-center justify-center shadow-sm"
                  >
                    {num}
                  </span>
                ))}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed pt-1">
                Όταν τα δεδομένα είναι διάσπαρτα, είναι δύσκολο να καταλάβουμε ποιος αριθμός εμφανίζεται συχνότερα.
              </p>
            </div>

            {/* Πινακας Διαλογης με Tally Marks - Χωρις Scroll */}
            <div className="lg:col-span-7 bg-white p-3.5 sm:p-5 rounded-3xl border-2 border-slate-200 shadow-sm space-y-2.5 w-full">
              <span className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider block text-center">
                ΠΙΝΑΚΑΣ ΔΙΑΛΟΓΗΣ ΚΑΙ ΣΥΧΝΟΤΗΤΩΝ
              </span>

              <div className="w-full">
                <table className="w-full table-fixed text-center text-xs sm:text-sm font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold font-sans">
                      <th className="w-[30%] p-1.5 text-left pl-2">Τιμή</th>
                      <th className="w-[45%] p-1.5">Καταμέτρηση</th>
                      <th className="w-[25%] p-1.5">Συχνότητα (ν)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((val) => {
                      const count = tallyCounts[val];
                      return (
                        <tr key={`tally-${val}`} className="border-b border-slate-100">
                          <td className="p-1.5 text-left pl-2 font-bold text-slate-900 font-sans truncate">
                            Τιμή {val}
                          </td>
                          <td className="p-1.5 text-xs sm:text-base tracking-widest text-blue-600 font-black truncate">
                            {count > 0 ? '| '.repeat(count) : '-'}
                          </td>
                          <td className="p-1.5 font-black text-slate-900">{count}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 text-center font-sans pt-1">
                Με τις γραμμές καταμέτρησης η μετατροπή σε συχνότητες γίνεται γρήγορα και αλάνθαστα!
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΑΡΑΔΕΙΓΜΑΤΑ ΠΡΟΒΛΗΜΑΤΩΝ ΜΕ ΣΧΗΜΑΤΑ & ΠΙΝΑΚΕΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Πίνακες &amp; Σχήματα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Δύο ολοκληρωμένα παραδείγματα στατιστικής ανάλυσης με πίνακες συχνοτήτων και γραφικά.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Παραδειγμα 1 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 1: ΒΑΘΜΟΛΟΓΙΕΣ ΔΙΑΓΩΝΙΣΜΑΤΟΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Σχολείο</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Κατανομή Βαθμών σε Τμήμα 25 Μαθητών
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα διαγώνισμα Μαθηματικών 25 μαθητών καταγράφηκαν οι βαθμοί: 5 μαθητές πήραν «10», 10 μαθητές πήραν «9», 7 μαθητές πήραν «8» και 3 μαθητές πήραν «7».
              </p>

              {/* ΠΙΝΑΚΑΣ ΠΑΡΑΔΕΙΓΜΑΤΟΣ 1 - Χωρις Scroll */}
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 w-full">
                <table className="w-full table-fixed text-center text-[10.5px] sm:text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold font-sans">
                      <th className="w-[30%] p-1 text-left pl-1.5 truncate">Βαθμός</th>
                      <th className="w-[20%] p-1 truncate" title="Συχνότητα">ν</th>
                      <th className="w-[25%] p-1 truncate">Σχ. ν</th>
                      <th className="w-[25%] p-1 truncate">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">Βαθμός 10</td>
                      <td className="p-1 font-bold">5</td>
                      <td className="p-1">0,20</td>
                      <td className="p-1 font-bold text-emerald-700">20%</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-blue-50/50">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold text-blue-900 truncate">Βαθμός 9 (Mode)</td>
                      <td className="p-1 font-black text-blue-900">10</td>
                      <td className="p-1 text-blue-900 font-bold">0,40</td>
                      <td className="p-1 font-black text-blue-900">40%</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">Βαθμός 8</td>
                      <td className="p-1 font-bold">7</td>
                      <td className="p-1">0,28</td>
                      <td className="p-1 font-bold text-emerald-700">28%</td>
                    </tr>
                    <tr>
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">Βαθμός 7</td>
                      <td className="p-1 font-bold">3</td>
                      <td className="p-1">0,12</td>
                      <td className="p-1 font-bold text-emerald-700">12%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Συμπεράσματα από τον Πίνακα:</span>
                  <div>• <strong>Επικρατούσα τιμή:</strong> Βαθμός 9 (10 μαθητές, 40%).</div>
                  <div>• <strong>Βαθμός τουλάχιστον 9:</strong> 5 ＋ 10 ＝ <strong>15 μαθητές (60%)</strong>.</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-blue-50 rounded-xl border border-blue-200 text-[11px] sm:text-xs text-blue-950 font-medium">
                💡 Ο πίνακας μας δείχνει αμέσως ότι η πλειοψηφία των μαθητών (60%) έγραψε πολύ καλά (9 ή 10).
              </div>
            </article>

            {/* Παραδειγμα 2 */}
            <article className="bg-white p-4 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs font-black rounded-lg">
                  ΠΡΟΒΛΗΜΑ 2: ΚΑΘΗΜΕΡΙΝΕΣ ΣΥΝΗΘΕΙΕΣ
                </span>
                <span className="text-xs font-bold text-slate-400">Έρευνα</span>
              </div>
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Ώρες Ενασχόλησης με το Διάβασμα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε έρευνα 20 μαθητών για τις ώρες που διαβάζουν καθημερινά στο σπίτι καταγράφηκαν: 1 ώρα (4 μαθητές), 2 ώρες (10 μαθητές), 3 ώρες (6 μαθητές).
              </p>

              {/* ΠΙΝΑΚΑΣ ΠΑΡΑΔΕΙΓΜΑΤΟΣ 2 - Χωρις Scroll */}
              <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 w-full">
                <table className="w-full table-fixed text-center text-[10.5px] sm:text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 font-bold font-sans">
                      <th className="w-[30%] p-1 text-left pl-1.5 truncate">Ώρες</th>
                      <th className="w-[20%] p-1 truncate" title="Συχνότητα">ν</th>
                      <th className="w-[25%] p-1 truncate">Σχ. ν</th>
                      <th className="w-[25%] p-1 truncate">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">1 ώρα</td>
                      <td className="p-1 font-bold">4</td>
                      <td className="p-1">0,20</td>
                      <td className="p-1 font-bold text-amber-800">20%</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-amber-50/50">
                      <td className="p-1 text-left pl-1.5 font-sans font-bold text-amber-950 truncate">2 ώρες (Mode)</td>
                      <td className="p-1 font-black text-amber-900">10</td>
                      <td className="p-1 text-amber-900 font-bold">0,50</td>
                      <td className="p-1 font-black text-amber-900">50%</td>
                    </tr>
                    <tr>
                      <td className="p-1 text-left pl-1.5 font-sans font-bold truncate">3 ώρες</td>
                      <td className="p-1 font-bold">6</td>
                      <td className="p-1">0,30</td>
                      <td className="p-1 font-bold text-amber-800">30%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm font-mono pt-1">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-[11px] font-bold">Συμπεράσματα από τον Πίνακα:</span>
                  <div>• <strong>Επικρατούσα τιμή:</strong> 2 ώρες (50% των μαθητών).</div>
                  <div>• <strong>Πάνω από 1 ώρα:</strong> 10 ＋ 6 ＝ <strong>16 μαθητές (80%)</strong>.</div>
                </div>
              </div>

              <div className="p-2.5 sm:p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] sm:text-xs text-amber-950 font-medium">
                💡 Το 80% των παιδιών διαβάζει από 2 ώρες και πάνω, γεγονός που αποτυπώνεται καθαρά στον πίνακα.
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στον Πίνακα Συχνοτήτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 απαιτητικές ασκήσεις ταξινόμησης δεδομένων, συμπλήρωσης πινάκων κατανομής συχνοτήτων και εξαγωγής στατιστικών συμπερασμάτων για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/56-pinakas-sixnotiton-ask"
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

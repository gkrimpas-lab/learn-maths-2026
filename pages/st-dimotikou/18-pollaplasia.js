// pages/st-dimotikou/18-pollaplasia.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = [4, 6, 12, 15, 25, 50];
const MAX_LIMIT = 1000;

// Υπολογισμος των πρωτων Ν πολλαπλασιων
function getMultiples(num, count = 12) {
  if (!num || num < 1) return [];
  const multiples = [];
  for (let i = 0; i <= count; i++) {
    multiples.push({
      multiplier: i,
      result: num * i
    });
  }
  return multiples;
}

export default function PollaplasiaPage() {
  const [number, setNumber] = useState(6);
  const [count, setCount] = useState(12); // Πληθος πολλαπλασιων προς εμφανιση
  const [activeView, setActiveView] = useState('grid'); // 'grid' (πλεγμα 1-100) η 'list' (πινακας)

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumber('');
      return;
    }
    const parsed = parseInt(clean, 10);
    if (parsed <= MAX_LIMIT) {
      setNumber(parsed);
    }
  };

  const multiplesList = getMultiples(number, count);

  return (
    <Layout
      title="Πολλαπλάσια ενός Φυσικού Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Ανακάλυψε τι είναι τα πολλαπλάσια ενός αριθμού, πώς τα υπολογίζουμε και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/18-pollaplasia-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 18 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Πολλαπλάσια ενός Φυσικού Αριθμού
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Ανακάλυψε τι είναι τα <strong>πολλαπλάσια</strong> ενός αριθμού, πώς τα υπολογίζουμε με τη βοήθεια του πολλαπλασιασμού και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Πλέγμα 1-100 &amp; Αναλυτικός Πίνακας Πολλαπλασιασμού</span>
            </div>
            <Link
              href="/st-dimotikou/18-pollaplasia-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες &amp; Ιδιότητες Πολλαπλασίων
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Όλα όσα πρέπει να γνωρίζεις για τα πολλαπλάσια ενός φυσικού αριθμού.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΡΙΣΜΟΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πολλαπλασιασμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι τα Πολλαπλάσια;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Πολλαπλάσια</strong> ενός φυσικού αριθμού λέγονται οι αριθμοί που προκύπτουν όταν τον πολλαπλασιάσουμε με τους φυσικούς αριθμούς (0, 1, 2, 3, 4...).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>Π(5) ＝ {'{'} 0, 5, 10, 15, 20, 25... {'}'}</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Κάθε πολλαπλάσιο διαιρείται ακριβώς (χωρίς υπόλοιπο) από τον αριθμό.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΙΔΙΟΤΗΤΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Χωρίς Τέλος</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Άπειρο Πλήθος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Κάθε φυσικός αριθμός (εκτός από το 0) έχει <strong>άπειρα πολλαπλάσια</strong>, επειδή οι φυσικοί αριθμοί με τους οποίους πολλαπλασιάζουμε δεν τελειώνουν ποτέ!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>6 · 1.000 ＝ 6.000 (και συνεχίζει... ∞)</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Σε αντίθεση με τους διαιρέτες που είναι πεπερασμένοι, τα πολλαπλάσια είναι άπειρα.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΙΔΙΚΟΙ ΚΑΝΟΝΕΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">0 &amp; Εαυτός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Βασικές Ιδιότητες SOS
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  • Το <strong>0</strong> είναι πολλαπλάσιο κάθε φυσικού αριθμού (α · 0 ＝ 0).<br />
                  • Κάθε φυσικός αριθμός είναι πολλαπλάσιο του <strong>εαυτού του</strong> (α · 1 ＝ α).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>7 · 0 ＝ <strong className="text-cyan-700">0</strong>&nbsp;&nbsp;&nbsp;&nbsp;🎯&nbsp;&nbsp;&nbsp;&nbsp;7 · 1 ＝ <strong className="text-cyan-700">7</strong></p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Το μικρότερο θετικό πολλαπλάσιο ενός αριθμού είναι πάντοτε ο ίδιος ο αριθμός.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΠΟΛΛΑΠΛΑΣΙΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Πολλαπλασίων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε έναν αριθμό και δες τα πολλαπλάσιά του στον αναλυτικό πίνακα πράξεων ή στο πλέγμα 1-100!
              </p>
            </div>

            {/* DISPLAY TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveView('grid')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeView === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔟 Πλέγμα 1-100
              </button>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`flex-1 md:flex-none px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm 2xl:text-base font-black transition-all text-center touch-manipulation active:scale-95 ${
                  activeView === 'list'
                    ? 'bg-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧮 Πίνακας Πράξεων
              </button>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό (1 - 1.000):
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                    placeholder="π.χ. 6"
                  />
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Ή επίλεξε έτοιμο αριθμό:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all text-center touch-manipulation active:scale-95 ${
                          number === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p.toLocaleString('el-GR')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MULTIPLES COUNT SELECTOR */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Πλήθος Πολλαπλασίων:
                  </span>
                  <div className="flex gap-2">
                    {[10, 15, 20].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCount(c)}
                        className={`flex-1 py-1.5 rounded-lg border font-mono font-bold text-xs sm:text-sm transition-all touch-manipulation active:scale-95 ${
                          count === c
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Τα πολλαπλάσια ενός αριθμού αυξάνονται <strong>ρυθμικά</strong> με το ίδιο βήμα!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] space-y-6">
              
              {/* HEADER STATUS */}
              <div className="w-full text-center">
                <span className="text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-wider block">
                  ΠΟΛΛΑΠΛΑΣΙΑ ΤΟΥ ΑΡΙΘΜΟΥ:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-sm">
                  {number ? number.toLocaleString('el-GR') : '—'}
                </div>
              </div>

              {/* VISUAL METHOD DISPLAY */}
              <div className="w-full my-auto py-2 flex justify-center items-center">
                {number && number >= 1 ? (
                  activeView === 'grid' ? (
                    /* HUNDRED GRID VISUALIZATION */
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-1">
                        🔟 ΕΝΤΟΠΙΣΜΟΣ ΠΟΛΛΑΠΛΑΣΙΩΝ ΣΤΟ ΠΛΕΓΜΑ 1-100:
                      </span>
                      
                      <div className="bg-slate-50 p-3 sm:p-6 rounded-3xl border border-slate-200 w-full flex flex-col items-center shadow-inner max-w-lg">
                        <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-full">
                          {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => {
                            const isMultiple = val % number === 0;
                            return (
                              <div
                                key={val}
                                className={`aspect-square flex items-center justify-center rounded-lg font-mono text-[10px] sm:text-xs md:text-sm font-bold transition-all ${
                                  isMultiple
                                    ? 'bg-blue-600 text-white font-black shadow-md scale-105 ring-2 ring-blue-300'
                                    : 'bg-white text-slate-400 border border-slate-200/60'
                                }`}
                              >
                                {val}
                              </div>
                            );
                          })}
                        </div>
                        {number > 100 && (
                          <p className="text-xs sm:text-sm text-amber-600 font-bold mt-3 text-center">
                            * Ο αριθμός {number} είναι μεγαλύτερος του 100, επομένως τα θετικά του πολλαπλάσια βρίσκονται πέρα από το πλέγμα 1-100!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* MULTIPLICATION LIST DISPLAY - ΑΠΕΡΙΟΡΙΣΤΟ ΥΨΟΣ ΧΩΡΙΣ SCROLLBAR ΓΙΑ ΝΑ ΦΑΙΝΟΝΤΑΙ ΟΛΑ */
                    <div className="flex flex-col items-center justify-center space-y-3 w-full">
                      <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider mb-2">
                        🧮 ΑΝΑΛΥΤΙΚΟΣ ΠΙΝΑΚΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΥ:
                      </span>
                      
                      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm md:text-base w-full max-w-2xl shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {multiplesList.map((m) => (
                            <div
                              key={m.multiplier}
                              className="bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-slate-700 flex justify-between items-center px-3 sm:px-4"
                            >
                              <span className="text-slate-400">
                                {number} · {m.multiplier} ＝
                              </span>
                              <span className="font-black text-amber-300 text-base sm:text-lg">
                                {m.result.toLocaleString('el-GR')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 w-full p-4">
                    Πληκτρολόγησε έναν φυσικό αριθμό μεγαλύτερο ή ίσο του 1.
                  </div>
                )}
              </div>

              {/* MULTIPLES SET BADGE */}
              {number && number >= 1 && (
                <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black space-y-1">
                  <span className="text-xs md:text-sm font-sans uppercase tracking-wider block text-blue-200">
                    ΣΥΝΟΛΟ ΠΟΛΛΑΠΛΑΣΙΩΝ Π({number.toLocaleString('el-GR')}):
                  </span>
                  <div className="text-sm sm:text-base md:text-lg tracking-wide pt-1 flex flex-wrap justify-center gap-1.5 sm:gap-2 items-center">
                    <span>Π({number}) ＝ {'{'}</span>
                    {multiplesList.slice(0, 8).map((m, idx) => (
                      <span key={m.multiplier} className="text-amber-300 font-black">
                        {m.result.toLocaleString('el-GR')}{idx < 7 ? ',' : ''}
                      </span>
                    ))}
                    <span className="text-blue-200">... {'}'}</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Πολλαπλάσια!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατάλαβες πώς σχηματίζονται τα πολλαπλάσια ενός αριθμού; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/18-pollaplasia-ask"
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

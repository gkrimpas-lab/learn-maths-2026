// pages/st-dimotikou/18-pollaplasia.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = [4, 6, 12, 15, 25, 50];

// Υπολογισμος των πρωτων πολλαπλασιων
function getMultiples(num, count = 10) {
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
  const [activeView, setActiveView] = useState('grid'); // 'grid' (πλεγμα 1-100) η 'list' (πινακας)

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumber('');
      return;
    }
    const parsed = parseInt(clean, 10);
    if (parsed <= 1000) {
      setNumber(parsed);
    }
  };

  const multiplesList = getMultiples(number, 9);

  return (
    <Layout
      title="Πολλαπλάσια ενός Φυσικού Αριθμού - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Ανακάλυψε τι είναι τα πολλαπλάσια ενός αριθμού, πώς τα υπολογίζουμε και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={false}
      hideFooter={true}
      actionButton={
        <Link
          href="/st-dimotikou/18-pollaplasia-ask"
          className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition active:scale-95 text-xs sm:text-sm"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      {/* Κεντρικο Container που κλειδωνει ακριβως στο υψος της οθονης χωρις κανενα scroll */}
      <div className="w-full h-[calc(100dvh-4.25rem)] max-w-[1920px] 2xl:max-w-[2560px] mx-auto px-2 sm:px-4 py-2 flex flex-col justify-between overflow-hidden select-none">
        
        {/* 1. COMPACT HERO HEADER */}
        <section className="bg-gradient-to-r from-indigo-950 via-blue-900 to-sky-900 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-md shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="bg-white/15 px-2 py-0.5 rounded-lg text-[10px] sm:text-xs font-black tracking-wider text-sky-200 uppercase shrink-0">
              ΚΕΦΑΛΑΙΟ 18 • ΣΤ' ΔΗΜΟΤΙΚΟΥ
            </span>
            <h1 className="text-xs sm:text-base md:text-lg font-black tracking-tight truncate">
              Πολλαπλάσια ενός Φυσικού Αριθμού
            </h1>
          </div>

          <Link
            href="/st-dimotikou/18-pollaplasia-ask"
            className="hidden xs:inline-flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1 rounded-xl shadow-xs transition active:scale-95 text-[11px] sm:text-xs shrink-0"
          >
            <span>Εξάσκηση</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COMPACT COLS) */}
        <section className="grid grid-cols-3 gap-1.5 sm:gap-3 shrink-0">
          <article className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                  ΟΡΙΣΜΟΣ
                </span>
                <span className="text-xs sm:text-sm">✖️</span>
              </div>
              <h2 className="text-[11px] sm:text-xs font-black text-slate-900 mt-1 leading-tight">
                Τι είναι τα Πολλαπλάσια;
              </h2>
              <p className="text-[9px] sm:text-[11px] text-slate-600 leading-tight mt-0.5 hidden xs:block">
                Προκύπτουν πολλαπλασιάζοντας τον αριθμό με 0, 1, 2, 3, 4...
              </p>
            </div>
            <div className="bg-slate-50 py-1 px-1.5 rounded-lg border border-slate-200 text-[9px] sm:text-[11px] font-mono text-center font-bold text-blue-900 mt-1 truncate">
              Π(5) ＝ {'{'} 0, 5, 10, 15... {'}'}
            </div>
          </article>

          <article className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                  ΙΔΙΟΤΗΤΑ
                </span>
                <span className="text-xs sm:text-sm">♾️</span>
              </div>
              <h2 className="text-[11px] sm:text-xs font-black text-slate-900 mt-1 leading-tight">
                Άπειρο Πλήθος
              </h2>
              <p className="text-[9px] sm:text-[11px] text-slate-600 leading-tight mt-0.5 hidden xs:block">
                Δεν τελειώνουν ποτέ, επειδή οι φυσικοί αριθμοί είναι άπειροι!
              </p>
            </div>
            <div className="bg-slate-50 py-1 px-1.5 rounded-lg border border-slate-200 text-[9px] sm:text-[11px] font-mono text-center font-bold text-indigo-900 mt-1 truncate">
              6 · 1.000 ＝ 6.000 (και συνεχίζει...)
            </div>
          </article>

          <article className="bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  ΚΑΝΟΝΕΣ SOS
                </span>
                <span className="text-xs sm:text-sm">🎯</span>
              </div>
              <h2 className="text-[11px] sm:text-xs font-black text-slate-900 mt-1 leading-tight">
                Το 0 και ο Εαυτός του
              </h2>
              <p className="text-[9px] sm:text-[11px] text-slate-600 leading-tight mt-0.5 hidden xs:block">
                Το 0 είναι πολλαπλάσιο όλων, και κάθε αριθμός του εαυτού του.
              </p>
            </div>
            <div className="bg-slate-50 py-1 px-1.5 rounded-lg border border-slate-200 text-[9px] sm:text-[11px] font-mono text-center font-bold text-emerald-900 mt-1 truncate">
              α · 0 ＝ 0 &nbsp;|&nbsp; α · 1 ＝ α
            </div>
          </article>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ (FIT TO FLEX-1 ΧΩΡΙΣ SCROLL) */}
        <section className="bg-white p-2.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col justify-between min-h-0 overflow-hidden my-1">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-900">
                Αριθμός:
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={number}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-16 sm:w-20 text-center font-mono font-black text-xs sm:text-base text-blue-700 bg-blue-50 border border-blue-200 rounded-xl py-0.5 outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="6"
              />
              <div className="hidden sm:flex items-center gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNumber(p)}
                    className={`px-2 py-0.5 rounded-lg font-mono text-xs font-bold transition active:scale-95 ${
                      number === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Display Toggle Tabs */}
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[11px] sm:text-xs font-black">
              <button
                type="button"
                onClick={() => setActiveView('grid')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeView === 'grid' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔟 Πλέγμα 1-100
              </button>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeView === 'list' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧮 Πίνακας Πράξεων
              </button>
            </div>
          </div>

          {/* Visualization Area */}
          <div className="flex-1 flex items-center justify-center min-h-0 py-1 overflow-hidden">
            {number && number >= 1 ? (
              activeView === 'grid' ? (
                /* HUNDRED GRID (Auto-sized aspect-square boxes to fit container perfectly) */
                <div className="w-full max-w-sm sm:max-w-md h-full flex flex-col justify-center items-center">
                  <div className="grid grid-cols-10 gap-0.5 sm:gap-1 w-full max-h-full aspect-square p-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                    {Array.from({ length: 100 }, (_, i) => i + 1).map((val) => {
                      const isMultiple = val % number === 0;
                      return (
                        <div
                          key={val}
                          className={`flex items-center justify-center rounded text-[9px] sm:text-[11px] font-mono transition-all ${
                            isMultiple
                              ? 'bg-blue-600 text-white font-black shadow-xs scale-105 z-10 ring-1 ring-blue-300'
                              : 'bg-white/80 text-slate-400 border border-slate-100'
                          }`}
                        >
                          {val}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* MULTIPLICATION LIST (2-Column Grid Fit) */
                <div className="w-full max-w-md grid grid-cols-2 gap-1.5 sm:gap-2">
                  {multiplesList.map((m) => (
                    <div
                      key={m.multiplier}
                      className="bg-slate-900 text-white px-2.5 py-1 sm:py-1.5 rounded-xl border border-slate-800 flex justify-between items-center text-[10px] sm:text-xs font-mono"
                    >
                      <span className="text-slate-400">
                        {number} · {m.multiplier} ＝
                      </span>
                      <span className="font-black text-amber-300 text-xs sm:text-sm">
                        {m.result.toLocaleString('el-GR')}
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-xs text-slate-400 font-medium">
                Πληκτρολόγησε έναν φυσικό αριθμό (≥ 1).
              </div>
            )}
          </div>

          {/* Bottom Results Bar */}
          <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl flex items-center justify-between text-xs font-mono shrink-0 gap-2">
            <span className="text-slate-400 text-[10px] sm:text-xs uppercase font-sans font-bold truncate">
              Π({number || '—'}):
            </span>
            <div className="text-amber-300 font-bold truncate text-[11px] sm:text-xs">
              {multiplesList.slice(0, 6).map((m) => m.result).join(', ')} ...
            </div>
          </div>
        </section>

        {/* 4. COMPACT FOOTER ACTION */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-3 sm:px-5 py-2 rounded-2xl shadow-md shrink-0 flex items-center justify-between gap-3">
          <div className="truncate">
            <h3 className="text-xs sm:text-sm font-black truncate">
              Έτοιμος για εξάσκηση;
            </h3>
            <p className="text-[10px] sm:text-xs text-emerald-100 truncate hidden xs:block">
              Δοκίμασε τις 10 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση.
            </p>
          </div>

          <Link
            href="/st-dimotikou/18-pollaplasia-ask"
            className="inline-flex items-center gap-1.5 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-3.5 py-1 rounded-xl shadow-xs transition active:scale-95 text-xs shrink-0"
          >
            <span>🎯 Έναρξη Ασκήσεων</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

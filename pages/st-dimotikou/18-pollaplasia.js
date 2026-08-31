import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

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
      title="🔢 18. Πολλαπλάσια ενός Φυσικού Αριθμού - LearnMaths.gr"
      description="Ανακάλυψε τι είναι τα πολλαπλάσια ενός αριθμού, πώς τα υπολογίζουμε και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/18-pollaplasia-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-8 md:space-y-10 py-6 md:py-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 18
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                18. Πολλαπλάσια ενός Φυσικού Αριθμού
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Ανακάλυψε τι είναι τα <strong>πολλαπλάσια</strong> ενός αριθμού, πώς τα υπολογίζουμε με τη βοήθεια του πολλαπλασιασμού και πώς σχηματίζουν άπειρα μοτίβα στο πλέγμα των αριθμών!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/18-pollaplasia-ask"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* THEORY CARDS (3 COLS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Τι είναι τα Πολλαπλάσια;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Πολλαπλάσια</strong> ενός φυσικού αριθμού λέγονται οι αριθμοί που προκύπτουν όταν τον πολλαπλασιάσουμε με τους φυσικούς αριθμούς (0, 1, 2, 3, 4...).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>Π(5) ＝ {'{'} 0, 5, 10, 15, 20, 25... {'}'}</p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Άπειρο Πλήθος</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Κάθε φυσικός αριθμός (εκτός από το 0) έχει <strong>άπειρα πολλαπλάσια</strong>, επειδή οι φυσικοί αριθμοί με τους οποίους πολλαπλασιάζουμε δεν τελειώνουν ποτέ!
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>6 × 1.000 ＝ 6.000 (και συνεχίζει... ∞)</p>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Βασικές Ιδιότητες SOS</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                • Το <strong>0</strong> είναι πολλαπλάσιο κάθε αριθμού (α × 0 ＝ 0).<br/>
                • Κάθε αριθμός είναι πολλαπλάσιο του <strong>εαυτού του</strong> (α × 1 ＝ α).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>7 × 0 ＝ <strong className="text-cyan-700">0</strong>&nbsp;&nbsp;&nbsp;&nbsp;🎯&nbsp;&nbsp;&nbsp;&nbsp;7 × 1 ＝ <strong className="text-cyan-700">7</strong></p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Πολλαπλασίων
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Πληκτρολόγησε έναν αριθμό και δες τα πολλαπλάσιά του στον πίνακα πολλαπλασιασμού ή στο πλέγμα 1-100!
              </p>
            </div>

            {/* DISPLAY TOGGLE */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveView('grid')}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeView === 'grid'
                    ? 'bg-blue-600 text-white shadow-xs scale-105'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔟 Πλέγμα 1-100
              </button>
              <button
                type="button"
                onClick={() => setActiveView('list')}
                className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                  activeView === 'list'
                    ? 'bg-indigo-600 text-white shadow-xs scale-105'
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
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολογησε Αριθμο (1 - 1.000):
                  </span>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                    placeholder="π.χ. 6"
                  />
                </div>

                {/* PRESET BUTTONS (2 COLS x 3 ROWS) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Η επιλεξε ετοιμο αριθμο:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
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

                {/* MULTIPLES COUNT SLIDER / SELECTOR */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Πληθος Πολλαπλασιων:
                  </span>
                  <div className="flex gap-2">
                    {[10, 15, 20].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCount(c)}
                        className={`flex-1 py-1.5 rounded-lg border font-mono font-bold text-xs transition-all ${
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

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Τα πολλαπλάσια ενός αριθμού αυξάνονται <strong>ρυθμικά</strong> με το ίδιο βήμα!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[500px] space-y-6">
              
              {/* HEADER STATUS */}
              <div className="w-full text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Πολλαπλασια του Αριθμου:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-wider shadow-xs">
                  {number ? number.toLocaleString('el-GR') : "—"}
                </div>
              </div>

              {/* VISUAL METHOD DISPLAY */}
              <div className="w-full my-auto py-2 flex justify-center items-center">
                {number && number >= 1 ? (
                  activeView === 'grid' ? (
                    /* HUNDRED GRID VISUALIZATION */
                    <div className="flex flex-col items-center justify-center space-y-4 w-full">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                        🔟 Εντοπισμος Πολλαπλασιων στο Πλεγμα 1-100:
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
                          <p className="text-xs text-amber-600 font-bold mt-3 text-center">
                            * Ο αριθμός {number} είναι μεγαλύτερος του 100, οπότε τα πολλαπλάσιά του βρίσκονται πέρα από το πλέγμα 1-100!
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* MULTIPLICATION LIST DISPLAY */
                    <div className="flex flex-col items-center justify-center space-y-3 w-full">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                        🧮 Αναλυτικος Πινακας Πολλαπλασιασμου:
                      </span>
                      
                      <div className="bg-slate-900 text-white p-4 sm:p-6 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm md:text-base w-full max-w-lg max-h-[360px] sm:max-h-[380px] overflow-y-auto shadow-md">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {multiplesList.map((m) => (
                            <div
                              key={m.multiplier}
                              className="bg-slate-800/80 p-2 sm:p-2.5 rounded-xl border border-slate-700 flex justify-between items-center px-3 sm:px-4"
                            >
                              <span className="text-slate-400">
                                {number} × {m.multiplier} ＝
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
                  <span className="text-xs font-sans uppercase tracking-wider block text-blue-200">
                    Συνολο Πολλαπλασιων Π({number.toLocaleString('el-GR')}):
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
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Κατάλαβες πώς σχηματίζονται τα πολλαπλάσια ενός αριθμού; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/18-pollaplasia-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}

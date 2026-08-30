import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS = [12, 18, 24, 30, 36, 48];

export default function DiairetesPage() {
  const [number, setNumber] = useState(12);

  const handleInputChange = (val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setNumber('');
    } else if (parsed > 100) {
      setNumber(100);
    } else {
      setNumber(parsed);
    }
  };

  // Συνάρτηση εύρεσης των διαιρετών
  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        divs.push(i);
      }
    }
    return divs;
  };

  const divisors = getDivisors(number);

  // Ζεύγη πολλαπλασιασμού (π.χ. 12 = 1 × 12, 2 × 6, 3 × 4)
  const getDivisorPairs = (num, divs) => {
    if (!num || divs.length === 0) return [];
    const pairs = [];
    const seen = new Set();
    divs.forEach(d => {
      const pair = num / d;
      if (!seen.has(d) && !seen.has(pair)) {
        pairs.push([d, pair]);
        seen.add(d);
        seen.add(pair);
      }
    });
    return pairs;
  };

  const divisorPairs = getDivisorPairs(number, divisors);

  return (
    <Layout
      title="🔢 13. Οι Διαιρέτες ενός Φυσικού Αριθμού - LearnMaths.gr"
      description="Ανακάλυψε ποιους αριθμούς ονομάζουμε διαιρέτες, πώς τους βρίσκουμε σχηματίζοντας ζεύγη γινομένων και πώς χωρίζουν έναν αριθμό σε απόλυτα ισόποσες ομάδες για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/13-diairetes-ask"
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
                  Ενοτητα 13
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                13. Οι Διαιρέτες ενός Φυσικού Αριθμού
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Ανακάλυψε ποιους αριθμούς ονομάζουμε <strong>διαιρέτες</strong>, πώς τους βρίσκουμε σχηματίζοντας ζεύγη γινομένων και πώς χωρίζουν έναν αριθμό σε απόλυτα ισόποσες ομάδες!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/13-diairetes-ask"
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
              <h3 className="text-lg font-black text-slate-900">Τι είναι οι Διαιρέτες;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Διαιρέτες</strong> ενός αριθμού είναι όλοι οι φυσικοί αριθμοί που τον <strong>διαιρούν ακριβώς</strong> (με υπόλοιπο 0).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>12 : <strong className="text-blue-700">3</strong> ＝ 4 (υπόλοιπο 0)</p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Το 1 και ο Εαυτός του</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Κάθε φυσικός αριθμός (εκτός από το 0) έχει πάντοτε ως διαιρέτες τον αριθμό <strong>1</strong> (μικρότερος διαιρέτης) και τον <strong>εαυτό του</strong> (μεγαλύτερος διαιρέτης).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>Δ(18) ＝ {'{'} <strong className="text-indigo-700">1</strong>, 2, 3, 6, 9, <strong className="text-indigo-700">18</strong> {'}'}</p>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Ζεύγη Πολλαπλασιασμού</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Βρίσκουμε εύκολα τους διαιρέτες γράφοντας τον αριθμό ως γινόμενο δύο παραγόντων: <code className="text-cyan-800 font-bold">α × β ＝ Αριθμός</code>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>24 ＝ 1×24 ＝ 2×12 ＝ 3×8 ＝ 4×6</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Διαιρετών
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Πληκτρολόγησε έναν αριθμό από το 1 έως το 100 ή επίλεξε παράδειγμα για να δεις όλους τους διαιρέτες και την οπτική κατανομή τους!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολογησε Αριθμο (1 - 100):
                  </span>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 12"
                  />
                </div>

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Η επιλεξε ετοιμο αριθμο:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNumber(p)}
                        className={`py-2 rounded-xl border font-mono font-black text-xs sm:text-sm transition-all ${
                          number === p
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FACTOR PAIRS BOX */}
                {divisorPairs.length > 0 && (
                  <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      🔗 Ζευγη Γινομενων:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 font-mono text-xs font-bold text-slate-700">
                      {divisorPairs.map(([a, b], idx) => (
                        <div key={idx} className="bg-slate-50 p-1.5 rounded-lg text-center border border-slate-100">
                          {a} × {b} ＝ {number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Ένας αριθμός έχει <strong>πεπερασμένο</strong> πλήθος διαιρετών!
              </div>
            </div>

            {/* RIGHT: DIVISORS PILLS & GROUP VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px] space-y-6">
              
              {/* DIVISORS SET HEADER */}
              <div className="w-full text-center">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Συνολο Διαιρετων Δ({number || "—"}):
                </span>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {divisors.length > 0 ? (
                    divisors.map((div) => (
                      <span
                        key={div}
                        className="text-sm sm:text-base md:text-lg font-mono font-black text-emerald-700 bg-emerald-50 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-emerald-300 shadow-xs"
                      >
                        {div}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-slate-400">Πληκτρολόγησε έναν έγκυρο αριθμό...</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium block mt-2">
                  Πλήθος διαιρετών: <strong className="text-slate-700">{divisors.length}</strong>
                </span>
              </div>

              {/* GROUP VISUALIZATION */}
              <div className="w-full space-y-4 my-auto">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block text-center">
                  📊 Οπτικη Αναπαρασταση: Πως μοιραζεται το {number} σε ισες ομαδες
                </span>

                {number && divisors.length > 0 ? (
                  <div className="max-h-[260px] sm:max-h-[280px] overflow-y-auto space-y-3 pr-1 sm:pr-2">
                    {divisors.map((div) => {
                      const groups = number / div;
                      return (
                        <div key={div} className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
                          <div className="text-xs font-bold text-slate-600 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                            <span>
                              Διαιρέτης: <strong className="text-blue-700 font-mono text-xs sm:text-sm">{div}</strong>
                            </span>
                            <span className="font-mono text-slate-500">
                              {number} : {div} ＝ <strong className="text-emerald-700">{groups}</strong> {groups === 1 ? 'ομάδα' : 'ομάδες'}
                            </span>
                          </div>

                          {/* DRAW BOXES */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {Array.from({ length: groups }).map((_, gIdx) => (
                              <div key={gIdx} className="flex gap-0.5 bg-blue-100/70 p-1 rounded-lg border border-blue-200">
                                {Array.from({ length: div }).map((_, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className="w-2.5 h-2.5 bg-blue-600 rounded-xs shadow-xs"
                                    title={`Ομάδα ${gIdx + 1}, στοιχείο ${bIdx + 1}`}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    Επίλεξε έναν αριθμό για να εμφανιστεί η γραφική ανάλυση.
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 text-center">
                <span>🔍 Παρατήρησε ότι σε κάθε γραμμή το σύνολο των τετραγώνων είναι ακριβώς {number}!</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες πώς βρίσκουμε όλους τους διαιρέτες ενός αριθμού; Δοκίμασε τις διαδραστικές ασκήσεις για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/13-diairetes-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}

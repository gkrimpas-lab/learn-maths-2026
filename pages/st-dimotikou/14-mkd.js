import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const PRESETS_2 = [
  { n1: 12, n2: 18, label: "Μ.Κ.Δ.(12, 18)" },
  { n1: 20, n2: 30, label: "Μ.Κ.Δ.(20, 30)" },
  { n1: 24, n2: 36, label: "Μ.Κ.Δ.(24, 36)" }
];
const PRESETS_3 = [
  { n1: 12, n2: 18, n3: 24, label: "Μ.Κ.Δ.(12, 18, 24)" },
  { n1: 15, n2: 30, n3: 45, label: "Μ.Κ.Δ.(15, 30, 45)" },
  { n1: 16, n2: 24, n3: 32, label: "Μ.Κ.Δ.(16, 24, 32)" }
];
const PRESETS_4 = [
  { n1: 12, n2: 16, n3: 20, n4: 24, label: "Μ.Κ.Δ.(12, 16, 20, 24)" },
  { n1: 20, n2: 40, n3: 60, n4: 80, label: "Μ.Κ.Δ.(20, 40, 60, 80)" }
];

export default function MkdPage() {
  const [activeTab, setActiveTab] = useState(2); // 2, 3 ή 4 αριθμοί
  
  const [num1, setNum1] = useState(12);
  const [num2, setNum2] = useState(18);
  const [num3, setNum3] = useState(24);
  const [num4, setNum4] = useState(36);

  const handleInputChange = (setter, val) => {
    const parsed = parseInt(val.replace(/[^0-9]/g, ''), 10);
    if (!parsed) {
      setter('');
    } else if (parsed > 100) {
      setter(100);
    } else {
      setter(parsed);
    }
  };

  // Εύρεση διαιρετών
  const getDivisors = (num) => {
    if (!num || num < 1) return [];
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const divisors1 = getDivisors(num1);
  const divisors2 = getDivisors(num2);
  const divisors3 = getDivisors(num3);
  const divisors4 = getDivisors(num4);

  // Υπολογισμός Κοινών Διαιρετών και ΜΚΔ ανάλογα με το Tab
  let commonDivisors = [];
  let numbersList = [];

  if (activeTab === 2) {
    commonDivisors = divisors1.filter(d => divisors2.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' }
    ];
  } else if (activeTab === 3) {
    commonDivisors = divisors1.filter(d => divisors2.includes(d) && divisors3.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: '3ος Αριθμός' }
    ];
  } else if (activeTab === 4) {
    commonDivisors = divisors1.filter(d => divisors2.includes(d) && divisors3.includes(d) && divisors4.includes(d));
    numbersList = [
      { val: num1, div: divisors1, color: 'text-blue-600', bg: 'bg-blue-600/80', label: '1ος Αριθμός' },
      { val: num2, div: divisors2, color: 'text-indigo-600', bg: 'bg-indigo-600/80', label: '2ος Αριθμός' },
      { val: num3, div: divisors3, color: 'text-purple-600', bg: 'bg-purple-600/80', label: '3ος Αριθμός' },
      { val: num4, div: divisors4, color: 'text-pink-600', bg: 'bg-pink-600/80', label: '4ος Αριθμός' }
    ];
  }

  const mkd = commonDivisors.length > 0 ? Math.max(...commonDivisors) : 1;
  const currentNumbersString = numbersList.map(n => n.val || "?").join(", ");

  return (
    <Layout
      title="🏆 14. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.) - LearnMaths.gr"
      description="Μάθε πώς να βρίσκεις τους κοινούς διαιρέτες δύο ή περισσότερων αριθμών και να ξεχωρίζεις τον Μέγιστο Κοινό Διαιρέτη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/14-mkd-ask"
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
                  Ενοτητα 14
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                14. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς να βρίσκεις τους <strong>κοινούς διαιρέτες</strong> δύο ή περισσότερων αριθμών και να ξεχωρίζεις τον <strong>Μέγιστο Κοινό Διαιρέτη</strong> για τέλειο ισόποσο μοίρασμα χωρίς υπόλοιπο!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/14-mkd-ask"
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
              <h3 className="text-lg font-black text-slate-900">Τι είναι ο Μ.Κ.Δ.;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Μέγιστος Κοινός Διαιρέτης</strong> δύο ή περισσότερων φυσικών αριθμών ονομάζεται ο <strong>μεγαλύτερος</strong> από τους κοινούς τους διαιρέτες.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>Μ.Κ.Δ.(12, 18) ＝ <strong className="text-blue-700">6</strong></p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Πώς τον βρίσκουμε;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                1. Γράφουμε όλους τους διαιρέτες κάθε αριθμού.<br/>
                2. Εντοπίζουμε τους <strong>κοινούς διαιρέτες</strong>.<br/>
                3. Επιλέγουμε τον <strong>μεγαλύτερο</strong>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>Κοινοί(12, 18) ＝ {'{'} 1, 2, 3, <strong className="text-indigo-700">6</strong> {'}'}</p>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Πρώτοι μεταξύ τους</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Αν δύο αριθμοί δεν έχουν κανέναν άλλο κοινό διαιρέτη εκτός από το <strong>1</strong>, τότε ονομάζονται <strong>πρώτοι μεταξύ τους</strong> (Μ.Κ.Δ. = 1).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>Μ.Κ.Δ.(8, 15) ＝ 1</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Υπολογισμού Μ.Κ.Δ.
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Διάλεξε πόσους αριθμούς θέλεις να συγκρίνεις (2, 3 ή 4) και δες αυτόματα όλους τους κοινούς διαιρέτες και τον Μ.Κ.Δ.!
              </p>
            </div>

            {/* TABS SELECTOR (2, 3, 4 NUMBERS) */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner gap-1 w-full md:w-auto">
              {[2, 3, 4].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 md:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all text-center ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-xs scale-105'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab} Αριθμοί
                </button>
              ))}
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUTS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολογησε τους Αριθμους (1 - 100):
                  </span>
                  <p className="text-xs text-slate-400">Συμπλήρωσε τους αριθμούς στα αντίστοιχα πεδία.</p>
                </div>

                {/* DYNAMIC INPUTS GRID */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">1ος Αριθμός</span>
                    <input
                      type="text"
                      value={num1}
                      onChange={(e) => handleInputChange(setNum1, e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-blue-300 rounded-xl text-blue-600 outline-none focus:border-blue-500 shadow-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">2ος Αριθμός</span>
                    <input
                      type="text"
                      value={num2}
                      onChange={(e) => handleInputChange(setNum2, e.target.value)}
                      className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-300 rounded-xl text-indigo-600 outline-none focus:border-indigo-500 shadow-xs"
                    />
                  </div>
                  {activeTab >= 3 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">3ος Αριθμός</span>
                      <input
                        type="text"
                        value={num3}
                        onChange={(e) => handleInputChange(setNum3, e.target.value)}
                        className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-purple-300 rounded-xl text-purple-600 outline-none focus:border-purple-500 shadow-xs"
                      />
                    </div>
                  )}
                  {activeTab === 4 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">4ος Αριθμός</span>
                      <input
                        type="text"
                        value={num4}
                        onChange={(e) => handleInputChange(setNum4, e.target.value)}
                        className="w-full text-lg sm:text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-pink-300 rounded-xl text-pink-600 outline-none focus:border-pink-500 shadow-xs"
                      />
                    </div>
                  )}
                </div>

                {/* PRESETS LIST */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Η επιλεξε ετοιμο παραδειγμα:
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {activeTab === 2 && PRESETS_2.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 transition shadow-xs"
                      >
                        {p.label}
                      </button>
                    ))}
                    {activeTab === 3 && PRESETS_3.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 transition shadow-xs"
                      >
                        {p.label}
                      </button>
                    ))}
                    {activeTab === 4 && PRESETS_4.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => { setNum1(p.n1); setNum2(p.n2); setNum3(p.n3); setNum4(p.n4); }}
                        className="text-left px-3 py-2 rounded-xl border font-mono font-bold text-xs bg-white hover:bg-slate-100 text-slate-700 transition shadow-xs"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Οι κοινοί διαιρέτες επισημαίνονται με κίτρινο πλαίσιο και ο <strong>Μ.Κ.Δ.</strong> με χρυσό τρόπαιο 🏆!
              </div>
            </div>

            {/* RIGHT: LIVE DIVISORS & SEGMENT VISUALIZATION (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[420px] sm:min-h-[460px] space-y-6">
              
              {/* DIVISORS LISTS FOR EACH NUMBER */}
              <div className="w-full space-y-3">
                {numbersList.map((numObj, index) => (
                  <div key={index} className="bg-slate-50 p-3 sm:p-3.5 rounded-2xl border border-slate-200 space-y-1.5 shadow-xs">
                    <div className="text-xs font-bold text-slate-700 flex justify-between items-center flex-wrap gap-1">
                      <span>
                        🔍 Διαιρέτες του <strong className={`${numObj.color} text-sm font-black`}>{numObj.val || "—"}</strong> ({numObj.label}):
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {numObj.div.length} διαιρέτες
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {numObj.div.map(d => {
                        const isCommon = commonDivisors.includes(d);
                        const isMkd = d === mkd;
                        return (
                          <span
                            key={d}
                            className={`font-mono font-black px-2.5 sm:px-3 py-1 text-xs rounded-xl border transition-all ${
                              isMkd
                                ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-sm scale-105 ring-2 ring-amber-300'
                                : isCommon
                                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            {d} {isMkd && '🏆'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* VISUAL SEGMENT BARS */}
              <div className="w-full bg-slate-900 text-white p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-md">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                  📊 Οπτικη Κατατμηση: Πως ο Μ.Κ.Δ. ({mkd}) μετραει ακριβως τους αριθμους
                </span>

                <div className="space-y-3 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
                  {numbersList.map((numObj, idx) => {
                    if (!numObj.val || mkd <= 0) return null;
                    const segments = numObj.val / mkd;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="text-slate-300 flex justify-between text-[11px] flex-wrap gap-1">
                          <span>{numObj.label} ({numObj.val}):</span>
                          <span className={`${numObj.color} font-bold brightness-125`}>
                            {segments} κομμάτια των {mkd}
                          </span>
                        </div>
                        <div className="flex w-full bg-slate-800 h-6 rounded-lg overflow-hidden border border-slate-700">
                          {Array.from({ length: segments }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-full border-r border-slate-900 ${numObj.bg} flex items-center justify-center font-black text-white text-[10px]`}
                              style={{ width: `${100 / segments}%` }}
                            >
                              {mkd}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FINAL RESULT BADGE */}
              <div className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="text-2xl">🏆</span>
                <span className="text-xs md:text-sm font-sans uppercase tracking-wider">Μεγιστος Κοινος Διαιρετης:</span>
                <span className="text-lg sm:text-xl md:text-2xl bg-white/20 px-3 sm:px-4 py-1 rounded-xl shadow-inner">
                  Μ.Κ.Δ.({currentNumbersString}) ＝ {mkd}
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες πώς υπολογίζεται ο Μέγιστος Κοινός Διαιρέτης; Δοκίμασε τις διαδραστικές ασκήσεις για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/14-mkd-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}

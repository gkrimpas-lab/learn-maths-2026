import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Μέγιστος επιτρεπόμενος αριθμός
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [24, 135, 450, 1236, 7525, 10450];

export default function KritiriaDiairetotitasPage() {
  const [numberStr, setNumberStr] = useState("7525");

  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    
    if (clean === '') {
      setNumberStr('');
    } else {
      const sliced = clean.slice(0, 10);
      if (BigInt(sliced) > BigInt(MAX_ALLOWED_NUMBER)) {
        setNumberStr(MAX_ALLOWED_NUMBER.toString());
      } else {
        setNumberStr(sliced);
      }
    }
  };
  
  const currentBigInt = numberStr ? BigInt(numberStr) : 0n;
  const digits = numberStr.split('').map(Number);
  const lastDigit = digits.length > 0 ? digits[digits.length - 1] : null;
  const lastTwoDigitsStr = digits.length > 1 ? numberStr.slice(-2) : numberStr;
  const lastTwoDigits = parseInt(lastTwoDigitsStr, 10) || 0;
  const sumOfDigits = digits.reduce((a, b) => a + b, 0);

  const criteria = [
    {
      check: 2,
      title: "Διαιρείται με το 2;",
      rule: "Πρέπει το τελευταίο ψηφίο να είναι ζυγό (0, 2, 4, 6, 8).",
      isTrue: currentBigInt > 0n && currentBigInt % 2n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : "—"} 
          {currentBigInt > 0n && currentBigInt % 2n === 0n ? " (Είναι ζυγό! ✅)" : " (Δεν είναι ζυγό! ❌)"}
        </div>
      )
    },
    {
      check: 3,
      title: "Διαιρείται με το 3;",
      rule: "Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 3.",
      isTrue: digits.length > 0 && sumOfDigits % 3 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800">
          Άθροισμα: {digits.join(' ＋ ')} ＝ <span className="text-amber-400 font-black text-sm">{sumOfDigits}</span>
          {digits.length > 0 && sumOfDigits % 3 === 0 ? ` (Το ${sumOfDigits} διαιρείται με το 3! ✅)` : ` (Το ${sumOfDigits} δεν διαιρείται με το 3! ❌)`}
        </div>
      )
    },
    {
      check: 4,
      title: "Διαιρείται με το 4;",
      rule: "Πρέπει τα δύο τελευταία ψηφία να διαιρούνται με το 4 (ή να είναι 00).",
      isTrue: digits.length > 0 && lastTwoDigits % 4 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Δύο τελευταία ψηφία: {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-amber-400 font-black underline text-sm">{numberStr}</span>}
          {digits.length > 0 && lastTwoDigits % 4 === 0 ? ` (Το ${lastTwoDigits} διαιρείται με το 4! ✅)` : ` (Το ${lastTwoDigits} δεν διαιρείται με το 4! ❌)`}
        </div>
      )
    },
    {
      check: 5,
      title: "Διαιρείται με το 5;",
      rule: "Πρέπει το τελευταίο ψηφίο να είναι 0 ή 5.",
      isTrue: currentBigInt > 0n && currentBigInt % 5n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : "—"} 
          {currentBigInt > 0n && currentBigInt % 5n === 0n ? " (Είναι 0 ή 5! ✅)" : " (Δεν είναι 0 ή 5! ❌)"}
        </div>
      )
    },
    {
      check: 9,
      title: "Διαιρείται με το 9;",
      rule: "Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 9.",
      isTrue: digits.length > 0 && sumOfDigits % 9 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800">
          Άθροισμα: {digits.join(' ＋ ')} ＝ <span className="text-amber-400 font-black text-sm">{sumOfDigits}</span>
          {digits.length > 0 && sumOfDigits % 9 === 0 ? ` (Το ${sumOfDigits} διαιρείται με το 9! ✅)` : ` (Το ${sumOfDigits} δεν διαιρείται με το 9! ❌)`}
        </div>
      )
    },
    {
      check: 10,
      title: "Διαιρείται με το 10;",
      rule: "Πρέπει το τελευταίο ψηφίο να είναι 0.",
      isTrue: currentBigInt > 0n && currentBigInt % 10n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : "—"} 
          {currentBigInt > 0n && currentBigInt % 10n === 0n ? " (Είναι 0! ✅)" : " (Δεν είναι 0! ❌)"}
        </div>
      )
    },
    {
      check: 25,
      title: "Διαιρείται με το 25;",
      rule: "Πρέπει τα δύο τελευταία ψηφία να είναι 00, 25, 50 ή 75.",
      isTrue: digits.length > 0 && lastTwoDigits % 25 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Δύο τελευταία ψηφία: {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-amber-400 font-black underline text-sm">{numberStr}</span>}
          {digits.length > 0 && lastTwoDigits % 25 === 0 ? " (Είναι στις επιλογές 00, 25, 50, 75! ✅)" : " (Δεν είναι 00, 25, 50, 75! ❌)"}
        </div>
      )
    }
  ];

  return (
    <Layout
      title="⚡ 15. Κριτήρια Διαιρετότητας (2, 3, 4, 5, 9, 10, 25) - LearnMaths.gr"
      description="Μάθε τα κριτήρια διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25 για να γνωρίζεις άμεσα αν ένας αριθμός διαιρείται ακριβώς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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
                  🎓 ΣΤ' Δημοτικού
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενότητα 15
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                15. Κριτήρια Διαιρετότητας (2, 3, 4, 5, 9, 10, 25)
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε τα έξυπνα μαθηματικά κόλπα για να γνωρίζεις αμέσως αν ένας αριθμός διαιρείται ακριβώς, <strong>χωρίς να κάνεις την πράξη της διαίρεσης</strong>!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις με αυτόματη βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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
              <h3 className="text-lg font-black text-slate-900">Τελευταίο Ψηφίο (2, 5, 10)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                • <strong>με το 2:</strong> λήγει σε 0, 2, 4, 6, 8.<br/>
                • <strong>με το 5:</strong> λήγει σε 0 ή 5.<br/>
                • <strong>με το 10:</strong> λήγει σε 0.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>35<strong className="text-blue-700">0</strong> διαιρείται με το 2, 5 και 10!</p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Άθροισμα Ψηφίων (3 και 9)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Προσθέτουμε όλα τα ψηφία του αριθμού μεταξύ τους:<br/>
                • <strong>με το 3:</strong> το άθροισμα διαιρείται με το 3.<br/>
                • <strong>με το 9:</strong> το άθροισμα διαιρείται με το 9.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>738 ➔ 7＋3＋8 ＝ <strong className="text-indigo-700">18</strong> (με το 3 και 9)</p>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Δύο Τελευταία Ψηφία (4 και 25)</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                • <strong>με το 4:</strong> τα δύο τελευταία ψηφία διαιρούνται με το 4 (ή είναι 00).<br/>
                • <strong>με το 25:</strong> τελειώνει σε 00, 25, 50 ή 75.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 font-mono text-center font-bold">
              <p>1.2<strong className="text-cyan-700">75</strong> (με το 25) • 3<strong className="text-cyan-700">24</strong> (με το 4)</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικός Έλεγχος Κριτηρίων
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
                Πληκτρολόγησε οποιονδήποτε αριθμό (έως 10 ψηφία) και δες αυτόματα την ανάλυση για όλα τα κριτήρια!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό:
                  </span>
                  <input
                    type="text"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-widest break-all"
                    placeholder="π.χ. 7525"
                  />
                </div>

                {/* PRESETS BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Ή διάλεξε έτοιμο παράδειγμα:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNumberStr(preset.toString())}
                        className={`px-3 py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                          numberStr === preset.toString()
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {preset.toLocaleString('el-GR')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Ένας αριθμός μπορεί να διαιρείται ταυτόχρονα με πολλούς διαφορετικούς αριθμούς!
              </div>
            </div>

            {/* RIGHT: LIVE CRITERIA CHECKS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              <div className="w-full text-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Έλεγχος Διαιρετότητας για τον Αριθμό:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-widest max-w-full break-all shadow-xs">
                  {numberStr || "—"}
                </div>
              </div>

              {/* CRITERIA CARDS LIST */}
              <div className="w-full space-y-3 sm:space-y-3.5 my-auto">
                {numberStr ? (
                  criteria.map((c) => (
                    <div
                      key={c.check}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 transition-all hover:border-slate-300 shadow-xs"
                    >
                      <div className="space-y-1 md:max-w-[45%] w-full">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-lg text-white shrink-0 ${
                              c.isTrue ? 'bg-emerald-600' : 'bg-rose-500'
                            }`}
                          >
                            {c.isTrue ? '✓ Ναι' : '✕ Όχι'}
                          </span>
                          <h4 className="text-sm font-black text-slate-800">{c.title}</h4>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-tight font-medium">{c.rule}</p>
                      </div>

                      <div className="flex-1 md:max-w-[52%] w-full">
                        {c.visual()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs sm:text-sm text-slate-400 font-medium bg-slate-50 rounded-2xl border border-slate-200 p-4">
                    Πληκτρολόγησε έναν αριθμό στα αριστερά για να ξεκινήσει ο αυτόματος έλεγχος.
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 text-center">
                <span>🔍 Αν ένας αριθμός τελειώνει σε 0, διαιρείται σίγουρα με το 2, το 5 και το 10!</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες όλα τα κριτήρια διαιρετότητας; Δοκίμασε τις διαδραστικές ασκήσεις για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/15-kritiria-diairetotitas-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [
  { base: 2, exp: 3, label: "2³ (2 στον κύβο)" },
  { base: 3, exp: 2, label: "3² (3 στο τετράγωνο)" },
  { base: 5, exp: 2, label: "5² (5 στο τετράγωνο)" },
  { base: 2, exp: 4, label: "2⁴ (2 στην 4η)" },
  { base: 10, exp: 3, label: "10³ (10 στον κύβο)" },
  { base: 4, exp: 3, label: "4³ (4 στον κύβο)" }
];

const MAX_BASE = 50;
const MAX_EXP = 10;

const exponentsUnicode = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

export default function DinameisPage() {
  const [base, setBase] = useState(2);
  const [exponent, setExponent] = useState(3);

  const handleBaseChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setBase('');
      return;
    }
    const n = Number(clean);
    if (n <= MAX_BASE) {
      setBase(n);
    }
  };

  const handleExpChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setExponent('');
      return;
    }
    const n = Number(clean);
    if (n <= MAX_EXP) {
      setExponent(n);
    }
  };

  const b = typeof base === 'number' ? base : 0;
  const e = typeof exponent === 'number' ? exponent : 0;

  // Υπολογισμός αποτελέσματος
  const result = Math.pow(b, e);

  // Δημιουργία λίστας παραγόντων
  const factorsList = e > 0 ? Array(e).fill(b) : [];
  const multiplicationString = e === 0 ? "1 (εξ ορισμού)" : e === 1 ? `${b}` : factorsList.join(" × ");

  // Ανάγνωση δύναμης στα ελληνικά
  const getPowerPronunciation = (baseVal, expVal) => {
    if (expVal === 0) return `${baseVal} στη μηδενική`;
    if (expVal === 1) return `${baseVal} στην πρώτη (ή απλά ${baseVal})`;
    if (expVal === 2) return `${baseVal} στο τετράγωνο (ή ${baseVal} στη δευτέρα)`;
    if (expVal === 3) return `${baseVal} στον κύβο (ή ${baseVal} στην τρίτη)`;
    return `${baseVal} στην ${expVal}η δύναμη`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Δυνάμεις Φυσικών Αριθμών - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} 2xl:max-w-7xl py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl 2xl:text-3xl font-black text-blue-600 tracking-tight flex items-center">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/21-dinameis-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm 2xl:text-base font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm 2xl:text-base font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} 2xl:max-w-7xl py-8 md:py-12 space-y-10 2xl:space-y-14`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 2xl:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 21
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  21. Δυνάμεις Φυσικών Αριθμών
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Ανακάλυψε τη δύναμη του σύντομου πολλαπλασιασμού! Μάθε τι είναι η <strong>Βάση</strong>, τι δείχνει ο <strong>Εκθέτης</strong> και πώς υπολογίζουμε το <strong>Τετράγωνο</strong> και τον <strong>Κύβο</strong> ενός αριθμού!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στις δυνάμεις με αυτόματη βαθμολόγηση!</p>
                <Link
                  href="/st-dimotikou/21-dinameis-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm 2xl:text-base"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
            <div className="bg-blue-50/80 border border-blue-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  1
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Τι είναι η Δύναμη;</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Δύναμη</strong> είναι η σύντομη γραφή ενός γινομένου όπου <strong>όλοι οι παράγοντες είναι ίσοι</strong>.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center">
                <p>2 × 2 × 2 × 2 ＝ <strong className="text-blue-700 font-bold">2⁴</strong></p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Βάση & Εκθέτης</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  • <strong>Βάση (α):</strong> Ο παράγοντας που πολλαπλασιάζεται.<br/>
                  • <strong>Εκθέτης (ν):</strong> Δείχνει πόσες φορές πολλαπλασιάζεται η βάση με τον εαυτό της.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>α<sup>ν</sup> ＝ α × α × ... × α (ν φορές)</p>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Ειδικές Περιπτώσεις SOS</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  • <strong>α¹ ＝ α:</strong> Κάθε αριθμός στον εκθέτη 1 μένει ίδιος.<br/>
                  • <strong>α⁰ ＝ 1:</strong> Κάθε αριθμός (εκτός του 0) στη μηδενική ισούται με 1.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>5¹ ＝ 5  •  7⁰ ＝ 1  •  10³ ＝ 1.000</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Δυνάμεων
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Όρισε τη βάση και τον εκθέτη και δες άμεσα την ανάλυση σε γινόμενο, τη γεωμετρική απεικόνιση και τον υπολογισμό!
                </p>
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* LEFT: INPUTS & PRESETS (3 COLS) */}
              <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* INPUTS */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Ρύθμιση Δύναμης:
                    </span>

                    {/* ΒΑΣΗ */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase flex justify-between">
                        <span>Βάση (α):</span>
                        <span className="text-blue-600 font-mono font-bold">1 - {MAX_BASE}</span>
                      </label>
                      <input
                        type="text"
                        value={base}
                        onChange={(e) => handleBaseChange(e.target.value)}
                        className="w-full text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-blue-200 rounded-xl shadow-xs text-blue-600 outline-none focus:border-blue-500 tracking-wider"
                        placeholder="π.χ. 2"
                      />
                    </div>

                    {/* ΕΚΘΕΤΗΣ */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase flex justify-between">
                        <span>Εκθέτης (ν):</span>
                        <span className="text-indigo-600 font-mono font-bold">0 - {MAX_EXP}</span>
                      </label>
                      <input
                        type="text"
                        value={exponent}
                        onChange={(e) => handleExpChange(e.target.value)}
                        className="w-full text-xl font-mono font-black text-center p-2.5 bg-white border-2 border-indigo-200 rounded-xl shadow-xs text-indigo-600 outline-none focus:border-indigo-500 tracking-wider"
                        placeholder="π.χ. 3"
                      />
                    </div>
                  </div>

                  {/* PRESET EXAMPLES (2 COLS x 3 ROWS) */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Έτοιμα Παραδείγματα:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setBase(p.base);
                            setExponent(p.exp);
                          }}
                          className={`py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center ${
                            b === p.base && e === p.exp
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                          }`}
                        >
                          {p.base}{exponentsUnicode[p.exp] || `^${p.exp}`}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 <strong>Προσοχή:</strong> Το 2³ ΔΕΝ είναι 2 × 3 ＝ 6, αλλά 2 × 2 × 2 ＝ <strong>8</strong>!
                </div>
              </div>

              {/* RIGHT: VISUALIZATION (9 COLS) */}
              <div className="lg:col-span-9 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
                
                {/* 1. HEADER STATUS */}
                <div className="w-full text-center space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                    Ανάλυση της Δύναμης:
                  </span>
                  <div className="text-2xl md:text-3xl font-mono font-black text-indigo-600 bg-indigo-50 px-8 py-2 rounded-2xl border border-indigo-100 inline-block tracking-wider shadow-sm">
                    {base !== '' ? base : 'α'}
                    <sup className="text-rose-600 text-xl md:text-2xl">{exponent !== '' ? (exponentsUnicode[e] || exponent) : 'ν'}</sup>
                    {' ＝ '}
                    <span className="text-amber-500">{base !== '' && exponent !== '' ? result.toLocaleString('el-GR') : '—'}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium italic pt-1">
                    📖 Διαβάζεται: «{getPowerPronunciation(b, e)}»
                  </p>
                </div>

                {/* 2. ΑΝΑΛΥΣΗ ΣΕ ΓΙΝΟΜΕΝΟ & ΟΠΤΙΚΟΠΟΙΗΣΗ */}
                <div className="w-full space-y-4">
                  
                  {/* ΚΑΡΤΑ ΑΝΑΛΥΣΗΣ ΓΙΝΟΜΕΝΟΥ */}
                  <div className="bg-slate-50 p-5 md:p-6 rounded-3xl border border-slate-200 shadow-inner space-y-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                      🔍 1. Ανάλυση σε Γινόμενο Ίσων Παραγόντων:
                    </span>

                    <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-base md:text-lg">
                      <span className="font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl border border-blue-200">
                        {b}{exponentsUnicode[e] || `^${e}`}
                      </span>
                      <span className="text-slate-400 font-black">＝</span>
                      
                      {e === 0 ? (
                        <span className="text-slate-600 font-bold bg-white px-4 py-1.5 rounded-xl border border-slate-200">
                          1 (Κάθε μη μηδενικός αριθμός με εκθέτη 0 ισούται με 1)
                        </span>
                      ) : e === 1 ? (
                        <span className="text-slate-800 font-bold bg-white px-4 py-1.5 rounded-xl border border-slate-200">
                          {b} (1 παράγοντας)
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
                          {factorsList.map((factor, idx) => (
                            <span key={idx} className="flex items-center gap-1.5">
                              <span className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 font-black flex items-center justify-center text-sm shadow-xs">
                                {factor}
                              </span>
                              {idx < factorsList.length - 1 && (
                                <span className="text-slate-400 font-black">×</span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}

                      <span className="text-slate-400 font-black">＝</span>
                      <span className="font-black text-emerald-700 bg-emerald-100 px-4 py-1 rounded-xl border border-emerald-300">
                        {result.toLocaleString('el-GR')}
                      </span>
                    </div>

                    <p className="text-center text-xs text-slate-500 font-medium">
                      {e > 1 && `Πολλαπλασιάζουμε τη βάση (${b}) με τον εαυτό της ${e} φορές.`}
                    </p>
                  </div>

                  {/* ΓΕΩΜΕΤΡΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΓΙΑ ΤΕΤΡΑΓΩΝΟ (e=2) ΚΑΙ ΚΥΒΟ (e=3) */}
                  {(e === 2 || e === 3) && b <= 12 && b >= 1 && (
                    <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block text-center">
                        📐 Γεωμετρική Ερμηνεία ({e === 2 ? 'Τετράγωνο' : 'Κύβος'}):
                      </span>

                      {e === 2 ? (
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className="grid gap-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800 shadow-inner"
                            style={{
                              gridTemplateColumns: `repeat(${b}, minmax(0, 1fr))`,
                              width: 'fit-content'
                            }}
                          >
                            {Array.from({ length: b * b }).map((_, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-blue-500/80 border border-blue-400/40 shadow-xs"
                              />
                            ))}
                          </div>
                          <span className="text-xs font-mono text-slate-300">
                            Εμβαδόν Τετραγώνου με πλευρά {b}: <strong className="text-amber-300">{b} × {b} ＝ {result}</strong> τετραγωνάκια
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1.5 py-1">
                          <div className="text-3xl">🧊</div>
                          <p className="text-xs sm:text-sm font-mono text-slate-200">
                            Όγκος Κύβου με ακμή {b}: <strong className="text-amber-300">{b} × {b} × {b} ＝ {result}</strong> κυβάκια
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* 3. FINAL RESULT SUMMARY BANNER */}
                <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                  <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                    Τελικό Αποτέλεσμα:
                  </span>
                  <div className="text-xl md:text-2xl font-black tracking-wide">
                    {b}
                    <sup className="text-rose-300">{exponentsUnicode[e] || `^${e}`}</sup>
                    {' ＝ '}
                    <span className="text-blue-100 text-lg md:text-xl font-medium">({multiplicationString})</span>
                    {' ＝ '}
                    <span className="text-amber-300 text-2xl md:text-3xl font-black bg-white/10 px-3 py-0.5 rounded-xl shadow-xs inline-block">
                      {result.toLocaleString('el-GR')}
                    </span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Έμαθες να υπολογίζεις δυνάμεις, τετράγωνα και κύβους; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/st-dimotikou/21-dinameis-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base 2xl:text-lg whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER (OUTSIDE MAIN) */}
      <footer className="bg-gray-800 text-gray-400 py-6 2xl:py-8 text-center text-sm 2xl:text-base w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

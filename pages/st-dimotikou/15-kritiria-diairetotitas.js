// pages/st-dimotikou/15-kritiria-diairetotitas.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Μέγιστος επιτρεπόμενος αριθμός
const MAX_ALLOWED_NUMBER = 9999999999; 

const PRESETS = [24, 135, 450, 1236, 7525, 10450];

export default function KritiriaDiairetotitasPage() {
  const [numberStr, setNumberStr] = useState('7525');

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
      title: 'Διαιρείται με το 2;',
      rule: 'Πρέπει το τελευταίο ψηφίο να είναι ζυγό (0, 2, 4, 6, 8).',
      isTrue: currentBigInt > 0n && currentBigInt % 2n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : '—'} 
          {currentBigInt > 0n && currentBigInt % 2n === 0n ? ' (Είναι ζυγό! ✅)' : ' (Δεν είναι ζυγό! ❌)'}
        </div>
      )
    },
    {
      check: 3,
      title: 'Διαιρείται με το 3;',
      rule: 'Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 3.',
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
      title: 'Διαιρείται με το 4;',
      rule: 'Πρέπει τα δύο τελευταία ψηφία να διαιρούνται με το 4 (ή να είναι 00).',
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
      title: 'Διαιρείται με το 5;',
      rule: 'Πρέπει το τελευταίο ψηφίο να είναι 0 ή 5.',
      isTrue: currentBigInt > 0n && currentBigInt % 5n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : '—'} 
          {currentBigInt > 0n && currentBigInt % 5n === 0n ? ' (Είναι 0 ή 5! ✅)' : ' (Δεν είναι 0 ή 5! ❌)'}
        </div>
      )
    },
    {
      check: 9,
      title: 'Διαιρείται με το 9;',
      rule: 'Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 9.',
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
      title: 'Διαιρείται με το 10;',
      rule: 'Πρέπει το τελευταίο ψηφίο να είναι 0.',
      isTrue: currentBigInt > 0n && currentBigInt % 10n === 0n,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastDigit}</span>
            </span>
          ) : '—'} 
          {currentBigInt > 0n && currentBigInt % 10n === 0n ? ' (Είναι 0! ✅)' : ' (Δεν είναι 0! ❌)'}
        </div>
      )
    },
    {
      check: 25,
      title: 'Διαιρείται με το 25;',
      rule: 'Πρέπει τα δύο τελευταία ψηφία να είναι 00, 25, 50 ή 75.',
      isTrue: digits.length > 0 && lastTwoDigits % 25 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 break-all">
          Δύο τελευταία ψηφία: {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-amber-400 font-black underline text-sm ml-0.5">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-amber-400 font-black underline text-sm">{numberStr}</span>}
          {digits.length > 0 && lastTwoDigits % 25 === 0 ? ' (Είναι στις επιλογές 00, 25, 50, 75! ✅)' : ' (Δεν είναι 00, 25, 50, 75! ❌)'}
        </div>
      )
    }
  ];

  return (
    <Layout
      title="Κριτήρια Διαιρετότητας (2, 3, 4, 5, 9, 10, 25) - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε τα κριτήρια διαιρετότητας με το 2, 3, 4, 5, 9, 10 και 25 για να γνωρίζεις άμεσα αν ένας αριθμός διαιρείται ακριβώς για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 15 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Κριτήρια Διαιρετότητας (2, 3, 4, 5, 9, 10, 25)
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τα έξυπνα μαθηματικά κόλπα για να γνωρίζεις αμέσως αν ένας αριθμός διαιρείται ακριβώς, <strong>χωρίς να κάνεις την πράξη της διαίρεσης</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Έλεγχος Τελευταίων Ψηφίων &amp; Αθροίσματος Ψηφίων</span>
            </div>
            <Link
              href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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
              Οι 3 Κατηγορίες Κριτηρίων Διαιρετότητας
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Ομαδοποίηση των κανόνων με βάση το τι εξετάζουμε σε κάθε αριθμό.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΜΑΔΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Τελευταίο Ψηφίο</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαιρετότητα με 2, 5 και 10
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Εξετάζουμε μόνο το τελευταίο ψηφίο (μονάδες):<br />
                  • <strong>με το 2:</strong> λήγει σε 0, 2, 4, 6, 8 (άρτιος).<br />
                  • <strong>με το 5:</strong> λήγει σε 0 ή 5.<br />
                  • <strong>με το 10:</strong> λήγει σε 0.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>35<strong className="text-blue-700">0</strong> διαιρείται με το 2, 5 και 10!</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Αν ένας αριθμός λήγει σε 0, πληροί αυτόματα και τα 3 αυτά κριτήρια.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΜΑΔΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Άθροισμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαιρετότητα με 3 και 9
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Προσθέτουμε όλα τα ψηφία του αριθμού μεταξύ τους:<br />
                  • <strong>με το 3:</strong> το άθροισμα ψηφίων διαιρείται με το 3.<br />
                  • <strong>με το 9:</strong> το άθροισμα ψηφίων διαιρείται με το 9.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>738 ➔ 7＋3＋8 ＝ <strong className="text-indigo-700">18</strong> (με το 3 και 9)</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Κάθε αριθμός που διαιρείται με το 9 διαιρείται οπωσδήποτε και με το 3!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΟΜΑΔΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">2 Τελευταία Ψηφία</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαιρετότητα με 4 και 25
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Εξετάζουμε τα δύο τελευταία ψηφία μαζί (δεκάδες και μονάδες):<br />
                  • <strong>με το 4:</strong> τα 2 τελευταία ψηφία διαιρούνται με το 4 (ή είναι 00).<br />
                  • <strong>με το 25:</strong> τελειώνει σε 00, 25, 50 ή 75.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>1.2<strong className="text-cyan-700">75</strong> (με το 25) • 3<strong className="text-cyan-700">24</strong> (με το 4)</p>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Τα προηγούμενα ψηφία (εκατοντάδες, χιλιάδες κ.λπ.) δεν επηρεάζουν τη διαίρεση με το 4 ή το 25.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΛΕΓΧΟΥ ΚΡΙΤΗΡΙΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικός Έλεγχος Κριτηρίων Διαιρετότητας
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε οποιονδήποτε αριθμό (έως 10 ψηφία) και δες αυτόματα την ανάλυση για όλα τα κριτήρια!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: INPUT & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό:
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-widest break-all"
                    placeholder="π.χ. 7525"
                  />
                </div>

                {/* PRESETS BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Ή διάλεξε έτοιμο παράδειγμα:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setNumberStr(preset.toString())}
                        className={`px-3 py-2 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all touch-manipulation active:scale-95 ${
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

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Ένας αριθμός μπορεί να διαιρείται ταυτόχρονα με πολλούς διαφορετικούς αριθμούς!
              </div>
            </div>

            {/* RIGHT: LIVE CRITERIA CHECKS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              <div className="w-full text-center mb-2">
                <span className="text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider block">
                  ΕΛΕΓΧΟΣ ΔΙΑΙΡΕΤΟΤΗΤΑΣ ΓΙΑ ΤΟΝ ΑΡΙΘΜΟ:
                </span>
                <div className="text-lg sm:text-xl md:text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-4 sm:px-6 py-1.5 rounded-2xl border border-indigo-100 inline-block mt-2 tracking-widest max-w-full break-all shadow-sm">
                  {numberStr || '—'}
                </div>
              </div>

              {/* CRITERIA CARDS LIST */}
              <div className="w-full space-y-3 sm:space-y-3.5 my-auto">
                {numberStr ? (
                  criteria.map((c) => (
                    <div
                      key={c.check}
                      className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 transition-all hover:border-slate-300 shadow-sm"
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
                          <h4 className="text-sm sm:text-base font-black text-slate-800">{c.title}</h4>
                        </div>
                        <p className="text-slate-600 text-[11px] sm:text-xs leading-tight font-medium">{c.rule}</p>
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
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Κριτήρια Διαιρετότητας!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες όλα τα κριτήρια διαιρετότητας; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να τελειοποιήσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/15-kritiria-diairetotitas-ask"
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

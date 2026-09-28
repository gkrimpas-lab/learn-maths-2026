// pages/st-dimotikou/02-dekadikoi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητικο component εμφανισης κλασματος με οριζοντια γραμμη (καθαρο JSX, οχι LaTeX)
function Fraction({ num, den, className = '' }) {
  return (
    <span className={`inline-flex flex-col items-center justify-center align-middle mx-1 font-mono ${className}`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center leading-none">
        {num}
      </span>
      <span className="px-1 pt-0.5 text-center leading-none">
        {den}
      </span>
    </span>
  );
}

export default function DekadikoiArithmoiPage() {
  const [number, setNumber] = useState('345,672');
  const [activeDigitKey, setActiveDigitKey] = useState('dec-0');

  const presets = [
    { label: '🌡️ Θερμοκρασία', val: '36,6' },
    { label: '💶 Τιμή Προϊόντος', val: '12,50' },
    { label: '⚖️ Βάρος σε κιλά', val: '74,250' },
    { label: '📏 Μήκος ακριβείας', val: '108,405' }
  ];

  // Καθαρισμός και προετοιμασία ακέραιου & δεκαδικού μέρους
  const sanitized = number.replace(/\./g, ',').replace(/[^0-9,]/g, '');
  const parts = sanitized.split(',');
  const intRaw = parts[0] || '0';
  const decRaw = parts[1] || '';

  const intDigits = intRaw.padStart(3, '0').slice(-3).split('');
  const decDigits = decRaw.padEnd(3, '0').slice(0, 3).split('');
  const intFirstNonZero = intDigits.findIndex((d) => d !== '0');

  const intClasses = [
    { name: 'Εκατοντάδες', short: 'Ε', weight: 100, color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#059669' },
    { name: 'Δεκάδες', short: 'Δ', weight: 10, color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#10b981' },
    { name: 'Μονάδες', short: 'Μ', weight: 1, color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#34d399' }
  ];

  const decClasses = [
    { name: 'Δέκατα', short: 'δ', weight: 10, num: 1, den: 10, val: 0.1, color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#2563eb' },
    { name: 'Εκατοστά', short: 'ε', weight: 100, num: 1, den: 100, val: 0.01, color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#3b82f6' },
    { name: 'Χιλιοστά', short: 'χ', weight: 1000, num: 1, den: 1000, val: 0.001, color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#60a5fa' }
  ];

  // Λεκτική ανάγνωση δεκαδικού
  const getDecimalReading = () => {
    const intVal = parseInt(intRaw, 10) || 0;
    const intPartText = `${intVal.toLocaleString('el-GR')} ${intVal === 1 ? 'μονάδα' : 'μονάδες'}`;
    
    if (!decRaw || parseInt(decRaw, 10) === 0) {
      return `${intPartText} (ακριβώς)`;
    }

    const decLength = Math.min(decRaw.length, 3);
    const decVal = parseInt(decRaw.slice(0, 3), 10);
    const decNames = {
      1: decVal === 1 ? 'δέκατο' : 'δέκατα',
      2: decVal === 1 ? 'εκατοστό' : 'εκατοστά',
      3: decVal === 1 ? 'χιλιοστό' : 'χιλιοστά'
    };

    return `${intPartText} και ${decVal.toLocaleString('el-GR')} ${decNames[decLength] || 'χιλιοστά'}`;
  };

  // Υπολογισμός ύψους στήλης (12% έως 100%)
  const calculateBarHeight = (digit, isLeading) => {
    const val = parseInt(digit, 10);
    if (val === 0 || isLeading) return 0;
    return 12 + (val - 1) * 11;
  };

  const chartItems = [
    ...intDigits.map((d, i) => {
      const val = parseInt(d, 10);
      const isLeading = intFirstNonZero !== -1 && i < intFirstNonZero;
      const displayTooltip = (val * intClasses[i].weight).toLocaleString('el-GR');

      return {
        key: `int-${i}`,
        digit: d,
        name: intClasses[i].name,
        short: intClasses[i].short,
        weightLabel: intClasses[i].weight.toString(),
        valStr: displayTooltip,
        hex: intClasses[i].hex,
        isLeading: isLeading || val === 0,
        heightPercent: calculateBarHeight(d, isLeading)
      };
    }),
    ...decDigits.map((d, i) => {
      const val = parseInt(d, 10);
      const isTrailing = (i >= decRaw.length && decRaw.length > 0) || val === 0;
      const decTooltips = [`0,${d}`, `0,0${d}`, `0,00${d}`];

      return {
        key: `dec-${i}`,
        digit: d,
        name: decClasses[i].name,
        short: decClasses[i].short,
        weightLabel: `${decClasses[i].num}/${decClasses[i].den}`,
        valStr: decTooltips[i],
        hex: decClasses[i].hex,
        isLeading: isTrailing,
        heightPercent: calculateBarHeight(d, isTrailing)
      };
    })
  ];

  return (
    <Layout
      title="Δεκαδικοί Αριθμοί και Δεκαδικά Κλάσματα - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς η υποδιαστολή διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/02-dekadikoi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 2 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Δεκαδικοί Αριθμοί &amp; Δεκαδικά Κλάσματα
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς η <strong>υποδιαστολή</strong> διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη, και ανακάλυψε την αξία των <strong>δεκάτων</strong>, <strong>εκατοστών</strong> και <strong>χιλιοστών</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ακέραιο &amp; Δεκαδικό Μέρος, Τάξεις και Ισοδύναμοι Δεκαδικοί</span>
            </div>
            <Link
              href="/st-dimotikou/02-dekadikoi-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες σε 3 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Η ανατομία, οι υποδιαιρέσεις και οι ιδιότητες των δεκαδικών αριθμών.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Διαχωρισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ακέραιο και Δεκαδικό Μέρος
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η <strong>υποδιαστολή ( , )</strong> χωρίζει τον αριθμό σε δύο μέρη: το <strong>ακέραιο μέρος</strong> (αριστερά) και το <strong>δεκαδικό μέρος</strong> (δεξιά).
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-center font-mono font-bold">
                  <span className="text-emerald-700 text-base sm:text-lg">345</span>
                  <span className="text-amber-500 text-lg sm:text-xl"> , </span>
                  <span className="text-blue-600 text-base sm:text-lg">672</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                💡 Το ακέραιο μέρος εκφράζει πλήρεις μονάδες, ενώ το δεκαδικό εκφράζει τμήματα της μονάδας.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Υποδιαιρέσεις</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τάξεις Δεκαδικού Μέρους
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Κάθε θέση δεξιά από την υποδιαστολή αντιστοιχεί σε δεκαδικό κλάσμα με παρονομαστή δύναμη του 10.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <span>• <strong>δ (Δέκατα):</strong></span>
                    <Fraction num="1" den="10" />
                    <span>＝ 0,1</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <span>• <strong>ε (Εκατοστά):</strong></span>
                    <Fraction num="1" den="100" />
                    <span>＝ 0,01</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold">
                    <span>• <strong>χ (Χιλιοστά):</strong></span>
                    <Fraction num="1" den="1.000" />
                    <span>＝ 0,001</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200 text-xs 2xl:text-sm text-blue-950 font-medium">
                ⚡ Κάθε δεκαδική τάξη είναι 10 φορές μικρότερη από την τάξη που βρίσκεται αμέσως αριστερά της!
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ιδιότητα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ισοδύναμοι Δεκαδικοί
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Όταν προσθέτουμε ή αφαιρούμε <strong>μηδενικά στο τέλος</strong> του δεκαδικού μέρους, η αξία του αριθμού δεν μεταβάλλεται!
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono text-center font-bold">
                  3,5 ＝ 3,50 ＝ 3,500
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Τα τελικά μηδενικά στο δεκαδικό μέρος δεν αλλάζουν την ποσότητα, απλώς δηλώνουν μεγαλύτερη ακρίβεια μέτρησης.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΔΕΚΑΔΙΚΩΝ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικός Αναλυτής Δεκαδικών &amp; Θέσης Υποδιαστολής
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε έναν δεκαδικό αριθμό ή επίλεξε ένα παράδειγμα για να δεις την πλήρη ανάλυσή του!
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setNumber(preset.val);
                    setActiveDigitKey('dec-0');
                  }}
                  className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* ROW 1: INPUT & READING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-stretch">
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner flex flex-col justify-center">
                <label className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  Πληκτρολόγησε Δεκαδικό Αριθμό (π.χ. 345,672):
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={number}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
                    const commaCount = (val.match(/,/g) || []).length;
                    if (commaCount <= 1) {
                      const p = val.split(',');
                      if ((p[0] || '').length <= 3 && (p[1] || '').length <= 3) {
                        setNumber(val);
                      }
                    }
                  }}
                  className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                  placeholder="π.χ. 345,672"
                />
                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  💡 Πάτησε σε ένα ψηφίο του πίνακα για να εστιάσεις στην αξία του!
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                <span className="text-[11px] sm:text-xs font-black text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <span>🗣️</span> Πως διαβαζεται:
                </span>
                <p className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-100 leading-snug break-words">
                  {getDecimalReading()}
                </p>
              </div>
            </div>

            {/* ROW 2: ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ ΔΕΚΑΔΙΚΩΝ */}
            <div className="bg-slate-50 border border-slate-200 p-3 sm:p-5 md:p-6 rounded-2xl space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-600 uppercase tracking-wider">
                    🗂️ Πίνακας Αξίας Θέσης Δεκαδικών
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-bold md:hidden flex items-center gap-1">
                    <span>👈 Σύρετε οριζόντια 👉</span>
                  </span>
                </div>

                <div className="w-full overflow-x-auto pb-2 pt-1 touch-pan-x border border-slate-200/80 rounded-2xl bg-white shadow-sm">
                  <div className="min-w-[560px] sm:min-w-[620px] rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-7 text-white text-center font-black text-xs sm:text-sm uppercase tracking-wider">
                      <div className="col-span-3 bg-emerald-600 py-2.5 sm:py-3 border-r border-white/20">Ακέραιο Μέρος</div>
                      <div className="bg-amber-500 py-2.5 sm:py-3 border-r border-white/20">,</div>
                      <div className="col-span-3 bg-blue-600 py-2.5 sm:py-3">Δεκαδικό Μέρος</div>
                    </div>

                    <div className="grid grid-cols-7 text-[10px] sm:text-xs font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
                      {intClasses.map((c, i) => (
                        <div key={`hc1-${i}`} className="border-r border-slate-200">
                          {c.short} <span className="hidden sm:inline font-normal lowercase">({c.name})</span>
                        </div>
                      ))}
                      <div className="text-amber-600 font-bold border-r border-slate-200 bg-amber-50/50">Υποδ.</div>
                      {decClasses.map((c, i) => (
                        <div key={`hc2-${i}`} className="border-r border-slate-200 last:border-0">
                          {c.short} <span className="hidden sm:inline font-normal lowercase">({c.name})</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 text-center items-center p-2 bg-white gap-1">
                      {intDigits.map((digit, i) => {
                        const key = `int-${i}`;
                        const isLeading = intFirstNonZero !== -1 && i < intFirstNonZero;
                        const isSelected = activeDigitKey === key;

                        return (
                          <div key={key} className="px-0.5">
                            <button
                              type="button"
                              onClick={() => setActiveDigitKey(key)}
                              onMouseEnter={() => setActiveDigitKey(key)}
                              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border touch-manipulation
                                ${intClasses[i].light}
                                ${isSelected 
                                  ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' 
                                  : 'border-transparent hover:bg-amber-100/70 hover:border-amber-300'}
                                ${isLeading && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                            >
                              {digit}
                            </button>
                          </div>
                        );
                      })}

                      <div className="px-0.5">
                        <div className="w-full py-3 sm:py-4 text-xl sm:text-3xl font-black text-amber-500 bg-amber-50/50 rounded-xl flex items-center justify-center font-mono border-2 border-transparent">
                          ,
                        </div>
                      </div>

                      {decDigits.map((digit, i) => {
                        const key = `dec-${i}`;
                        const isTrailing = i >= decRaw.length && decRaw.length > 0;
                        const isSelected = activeDigitKey === key;

                        return (
                          <div key={key} className="px-0.5">
                            <button
                              type="button"
                              onClick={() => setActiveDigitKey(key)}
                              onMouseEnter={() => setActiveDigitKey(key)}
                              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border touch-manipulation
                                ${decClasses[i].light}
                                ${isSelected 
                                  ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' 
                                  : 'border-transparent hover:bg-amber-100/70 hover:border-amber-300'}
                                ${isTrailing && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                            >
                              {digit}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* ΠΛΗΡΗΣ ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ */}
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl font-mono text-xs sm:text-sm space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block font-sans">
                    🧬 Πλήρης Αναλυτική Μορφή (Ακέραιες Μονάδες &amp; Δεκαδικά Κλάσματα)
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Πλήρης Εμφάνιση
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {/* Ακέραια ψηφία */}
                  {intDigits.map((digit, i) => {
                    if (digit === '0' && intFirstNonZero !== -1 && i < intFirstNonZero) return null;
                    const weight = intClasses[i].weight;
                    const totalVal = (Number(digit) * weight).toLocaleString('el-GR');
                    const key = `int-${i}`;
                    const isSelected = activeDigitKey === key;

                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setActiveDigitKey(key)}
                        onClick={() => setActiveDigitKey(key)}
                        className={`grid grid-cols-[auto_1fr_auto] items-center p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-2 touch-manipulation ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-sm' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                          <span className="text-emerald-700 font-black">{digit}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-800">{weight}</span>
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block truncate max-w-[90px] sm:max-w-none">
                            {intClasses[i].name}
                          </span>
                        </div>
                        <div className="text-right whitespace-nowrap font-black text-xs sm:text-sm text-slate-700">
                          ＝ {totalVal}
                        </div>
                      </div>
                    );
                  })}

                  {/* Δεκαδικά ψηφία */}
                  {decDigits.map((digit, i) => {
                    if (digit === '0' && i >= decRaw.length && decRaw.length > 0) return null;
                    const decCls = decClasses[i];
                    const valCalc = (Number(digit) / decCls.weight).toFixed(i + 1).replace('.', ',');
                    const key = `dec-${i}`;
                    const isSelected = activeDigitKey === key;

                    return (
                      <div
                        key={key}
                        onMouseEnter={() => setActiveDigitKey(key)}
                        onClick={() => setActiveDigitKey(key)}
                        className={`grid grid-cols-[auto_1fr_auto] items-center p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-2 touch-manipulation ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-sm' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                          <span className="text-blue-700 font-black">{digit}</span>
                          <span className="text-slate-400">·</span>
                          <Fraction num={decCls.num} den={decCls.den} className="text-xs" />
                        </div>
                        <div>
                          <span className="text-[10px] sm:text-xs font-sans text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold inline-block truncate max-w-[90px] sm:max-w-none">
                            {decCls.name}
                          </span>
                        </div>
                        <div className="text-right whitespace-nowrap font-black text-xs sm:text-sm text-blue-700">
                          ＝ {valCalc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs 2xl:text-sm font-bold text-slate-400 pt-1">
                <span>✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) , Δέκατα (δ) • Εκατοστά (ε) • Χιλιοστά (χ)</span>
              </div>
            </div>

            {/* ROW 3: ΟΠΤΙΚΟ ΓΡΑΦΗΜΑ ΡΑΒΔΩΝ */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  📊 Ύψος Ψηφίου (Οπτική Σύγκριση Μεγεθών)
                </span>
                <span className="text-[10px] sm:text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
                  Ακέραια &amp; Δεκαδικά
                </span>
              </div>

              <div className="w-full bg-slate-50 rounded-xl border border-slate-100 pt-10 pb-3 px-2 sm:px-4">
                <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-40 border-b-2 border-slate-200 pb-0">
                  {chartItems.map((item) => {
                    const isSelected = activeDigitKey === item.key;
                    const hasValue = !item.isLeading;

                    return (
                      <div
                        key={item.key}
                        onMouseEnter={() => { if (hasValue) setActiveDigitKey(item.key); }}
                        onClick={() => { if (hasValue) setActiveDigitKey(item.key); }}
                        className={`flex-1 flex flex-col items-center justify-end h-full relative touch-manipulation ${hasValue ? 'cursor-pointer group' : 'cursor-default'}`}
                      >
                        {/* TOOLTIP ON HOVER */}
                        {isSelected && hasValue && (
                          <div className="absolute -top-9 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 animate-bounce">
                            {item.valStr}
                          </div>
                        )}

                        {/* VALUE LABEL */}
                        {hasValue ? (
                          <span className="text-[11px] sm:text-xs font-black text-slate-700 mb-1">
                            {item.digit}
                          </span>
                        ) : (
                          <div className="h-4 mb-1"></div>
                        )}

                        {/* THE BAR CONTAINER */}
                        <div className="w-full h-28 flex items-end justify-center">
                          {hasValue && (
                            <div
                              style={{ 
                                height: `${item.heightPercent}%`,
                                backgroundColor: item.hex 
                              }}
                              className={`w-full max-w-[38px] rounded-t-lg transition-all duration-200 ${isSelected ? 'ring-4 ring-amber-400 brightness-110 shadow-md' : 'opacity-90 hover:opacity-100'}`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X-AXIS LABELS */}
                <div className="flex justify-between gap-1.5 sm:gap-3 pt-2">
                  {chartItems.map((item) => (
                    <div key={`lbl-${item.key}`} className="flex-1 text-center">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 block leading-tight">
                        {item.short}
                      </span>
                      <span className="text-[8px] text-slate-400 font-mono block leading-tight">
                        ({item.weightLabel})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 font-semibold px-2 pt-1">
                <span>⬅️ Ακέραιες Εκατοντάδες</span>
                <span>Δεκαδικά Χιλιοστά ➡️</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στους Δεκαδικούς!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες τη θέση της υποδιαστολής και τα δεκαδικά μέρη; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/02-dekadikoi-ask"
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

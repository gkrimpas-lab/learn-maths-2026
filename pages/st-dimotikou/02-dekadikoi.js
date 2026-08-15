import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DekadikoiArithmoiPage() {
  const [number, setNumber] = useState("345,672");
  const [activeDigitKey, setActiveDigitKey] = useState("dec-0");

  const presets = [
    { label: '🌡️ Θερμοκρασία', val: '36,6' },
    { label: '💶 Τιμή Προϊόντος', val: '12,50' },
    { label: '⚖️ Βάρος σε κιλά', val: '74,250' },
    { label: '📏 Μήκος ακριβείας', val: '108,405' }
  ];

  // Καθαρισμός και προετοιμασία ακέραιου & δεκαδικού μέρους
  const sanitized = number.replace(/\./g, ',').replace(/[^0-9,]/g, '');
  const parts = sanitized.split(',');
  const intRaw = parts[0] || "0";
  const decRaw = parts[1] || "";

  const intDigits = intRaw.padStart(3, '0').slice(-3).split('');
  const decDigits = decRaw.padEnd(3, '0').slice(0, 3).split('');
  const intFirstNonZero = intDigits.findIndex(d => d !== '0');

  const intClasses = [
    { name: "Εκατοντάδες", short: "Ε", weight: 100, color: "bg-emerald-600", light: "bg-emerald-50/70", hex: "#059669" },
    { name: "Δεκάδες", short: "Δ", weight: 10, color: "bg-emerald-600", light: "bg-emerald-50/70", hex: "#10b981" },
    { name: "Μονάδες", short: "Μ", weight: 1, color: "bg-emerald-600", light: "bg-emerald-50/70", hex: "#34d399" }
  ];

  const decClasses = [
    { name: "Δέκατα", short: "δ", weight: 10, fraction: "1/10", val: 0.1, color: "bg-blue-600", light: "bg-blue-50/70", hex: "#2563eb" },
    { name: "Εκατοστά", short: "ε", weight: 100, fraction: "1/100", val: 0.01, color: "bg-blue-600", light: "bg-blue-50/70", hex: "#3b82f6" },
    { name: "Χιλιοστά", short: "χ", weight: 1000, fraction: "1/1000", val: 0.001, color: "bg-blue-600", light: "bg-blue-50/70", hex: "#60a5fa" }
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

  // Όλα τα στοιχεία για το Bar Chart
  const chartItems = [
    ...intDigits.map((d, i) => ({
      key: `int-${i}`,
      digit: d,
      name: intClasses[i].name,
      short: intClasses[i].short,
      weightLabel: intClasses[i].weight.toString(),
      val: Number(d) * intClasses[i].weight,
      hex: intClasses[i].hex,
      isLeading: intFirstNonZero !== -1 && i < intFirstNonZero,
      isDecimal: false,
      heightPercent: (intFirstNonZero !== -1 && i < intFirstNonZero) || d === '0' 
        ? 6 
        : Math.round(55 + (2 - i) * 15 + (Number(d) / 9) * 15)
    })),
    ...decDigits.map((d, i) => ({
      key: `dec-${i}`,
      digit: d,
      name: decClasses[i].name,
      short: decClasses[i].short,
      weightLabel: decClasses[i].fraction,
      val: Number(d) * decClasses[i].val,
      hex: decClasses[i].hex,
      isLeading: i >= decRaw.length && decRaw.length > 0,
      isDecimal: true,
      heightPercent: (i >= decRaw.length && decRaw.length > 0) || d === '0' 
        ? 6 
        : Math.round(35 - i * 10 + (Number(d) / 9) * 10)
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Δεκαδικοί Αριθμοί & Αξία Θέσης - LearnMaths.gr</title>
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
                href="/st-dimotikou/02-dekadikoi-ask"
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
          <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-6 md:p-10 2xl:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs 2xl:text-sm px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 2
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  2. Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα
                </h1>
                <p className="text-teal-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε πώς η <strong>υποδιαστολή</strong> διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη, και ανακάλυψε την αξία των <strong>δεκάτων</strong>, <strong>εκατοστών</strong> και <strong>χιλιοστών</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs 2xl:text-sm text-teal-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/02-dekadikoi-ask"
                  className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm 2xl:text-base"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8">
            <div className="bg-emerald-50/80 border border-emerald-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  1
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Ακέραιο & Δεκαδικό Μέρος</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η <strong>υποδιαστολή ( , )</strong> χωρίζει τον αριθμό σε δύο μέρη: το <strong>ακέραιο μέρος</strong> (αριστερά) και το <strong>δεκαδικό μέρος</strong> (δεξιά).
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs 2xl:text-sm text-slate-700 text-center font-mono">
                <span className="text-emerald-700 font-black text-base">345</span>
                <span className="text-amber-500 font-black text-lg"> , </span>
                <span className="text-blue-600 font-black text-base">672</span>
              </div>
            </div>

            <div className="bg-blue-50/80 border border-blue-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Τάξεις Δεκαδικού Μέρους</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Κάθε θέση δεξιά από την υποδιαστολή αντιστοιχεί σε δεκαδικό κλάσμα με παρονομαστή δύναμη του 10.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 space-y-1">
                <ul className="grid grid-cols-1 gap-1 text-[11px] 2xl:text-xs font-semibold">
                  <li className="text-blue-700">• <strong>δ (Δέκατα):</strong> 1/10 = 0,1</li>
                  <li className="text-blue-700">• <strong>ε (Εκατοστά):</strong> 1/100 = 0,01</li>
                  <li className="text-blue-700">• <strong>χ (Χιλιοστά):</strong> 1/1000 = 0,001</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50/80 border border-amber-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Ισοδύναμοι Δεκαδικοί</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Όταν προσθέτουμε ή αφαιρούμε <strong>μηδενικά στο τέλος</strong> του δεκαδικού μέρους, η αξία του αριθμού δεν μεταβάλλεται!
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-amber-100 text-xs 2xl:text-sm text-slate-800 font-mono text-center font-bold">
                💡 3,5 = 3,50 = 3,500
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Δεκαδικών
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Πληκτρολόγησε έναν δεκαδικό αριθμό ή επίλεξε ένα παράδειγμα για να δεις την πλήρη ανάλυσή του!
                </p>
              </div>

              {/* PRESET BUTTONS */}
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNumber(preset.val);
                      setActiveDigitKey("dec-0");
                    }}
                    className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs 2xl:text-sm font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN VERTICAL STACK STRUCTURE */}
            <div className="space-y-6">

              {/* ROW 1: (1) INPUT & (2) READING */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                <div className="bg-slate-50 border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-3 shadow-inner flex flex-col justify-center">
                  <label className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                    Πληκτρολόγησε Δεκαδικό Αριθμό (π.χ. 345,672):
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\./g, ',').replace(/[^0-9,]/g, '');
                      const commaCount = (val.match(/,/g) || []).length;
                      if (commaCount <= 1) {
                        const p = val.split(',');
                        if ((p[0] || "").length <= 3 && (p[1] || "").length <= 3) {
                          setNumber(val);
                        }
                      }
                    }}
                    className="text-2xl md:text-3xl 2xl:text-4xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                    placeholder="π.χ. 345,672"
                  />
                  <p className="text-[11px] 2xl:text-xs text-slate-400 text-center font-medium">
                    💡 Πέρασε τον κέρσορα ή κάνε κλικ στα ψηφία του πίνακα για εστίαση!
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-5 2xl:p-6 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                  <span className="text-[10px] 2xl:text-xs font-black text-amber-400 uppercase tracking-widest block flex items-center gap-1.5">
                    <span>🗣️</span> Πώς διαβάζεται:
                  </span>
                  <p className="text-base md:text-lg 2xl:text-xl font-bold text-slate-100 leading-snug">
                    {getDecimalReading()}
                  </p>
                </div>
              </div>

              {/* ROW 2: (3) PLACE VALUE TABLE & FULL MATHEMATICAL EXPANSION */}
              <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 2xl:p-8 rounded-2xl space-y-6">
                
                {/* PLACE VALUE TABLE */}
                <div className="w-full overflow-x-auto pb-4 pt-1">
                  <div className="min-w-[620px] bg-white rounded-2xl shadow-sm border border-gray-200 mx-auto">
                    
                    {/* PERIODS / SECTIONS HEADER */}
                    <div className="grid grid-cols-7 text-white text-center font-black text-xs 2xl:text-sm uppercase tracking-wider rounded-t-2xl overflow-hidden">
                      <div className="col-span-3 bg-emerald-600 py-3 border-r border-white/20">Ακέραιο Μέρος</div>
                      <div className="bg-amber-500 py-3 border-r border-white/20">,</div>
                      <div className="col-span-3 bg-blue-600 py-3">Δεκαδικό Μέρος</div>
                    </div>

                    {/* CLASSES HEADER */}
                    <div className="grid grid-cols-7 text-[10px] 2xl:text-xs font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
                      {intClasses.map((c, i) => (
                        <div key={`hc1-${i}`} className="border-r border-slate-200">
                          {c.short} <span className="hidden md:inline font-normal lowercase">({c.name})</span>
                        </div>
                      ))}
                      <div className="text-amber-600 font-bold border-r border-slate-200 bg-amber-50/50">Υποδ.</div>
                      {decClasses.map((c, i) => (
                        <div key={`hc2-${i}`} className="border-r border-slate-200 last:border-0">
                          {c.short} <span className="hidden md:inline font-normal lowercase">({c.name})</span>
                        </div>
                      ))}
                    </div>

                    {/* DIGITS ROW */}
                    <div className="grid grid-cols-7 text-center items-center p-1.5 bg-white rounded-b-2xl">
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
                              className={`w-full py-4 md:py-5 2xl:py-6 text-xl md:text-2xl 2xl:text-3xl font-black rounded-xl transition-all duration-200 focus:outline-none font-mono flex items-center justify-center
                                ${intClasses[i].light}
                                ${isSelected 
                                  ? 'bg-amber-400 text-slate-900 border-2 border-amber-500 shadow-md transform -translate-y-0.5' 
                                  : 'border border-transparent hover:bg-amber-100/70'}
                                ${isLeading && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                            >
                              {digit}
                            </button>
                          </div>
                        );
                      })}

                      {/* COMMA */}
                      <div className="px-0.5">
                        <div className="w-full py-4 md:py-5 2xl:py-6 text-2xl md:text-3xl 2xl:text-4xl font-black text-amber-500 bg-amber-50/50 rounded-xl flex items-center justify-center font-mono">
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
                              className={`w-full py-4 md:py-5 2xl:py-6 text-xl md:text-2xl 2xl:text-3xl font-black rounded-xl transition-all duration-200 focus:outline-none font-mono flex items-center justify-center
                                ${decClasses[i].light}
                                ${isSelected 
                                  ? 'bg-amber-400 text-slate-900 border-2 border-amber-500 shadow-md transform -translate-y-0.5' 
                                  : 'border border-transparent hover:bg-amber-100/70'}
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

                {/* FULL MATHEMATICAL BREAKDOWN (2 COLS GRID - NO SCROLL) */}
                <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl font-mono text-xs 2xl:text-sm space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] 2xl:text-xs font-black text-slate-500 uppercase tracking-wider block font-sans">
                      🧬 Πλήρης Αναλυτική Μορφή (Ακέραιες Μονάδες & Δεκαδικά Κλάσματα)
                    </span>
                    <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Πλήρης Εμφάνιση
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 2xl:gap-3">
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
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-300' 
                              : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-700 font-black text-sm 2xl:text-base">{digit}</span>
                            <span className="text-slate-400">×</span>
                            <span className="font-bold text-slate-700">{weight}</span>
                            <span className="text-[10px] font-sans text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {intClasses[i].name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-600 font-black text-xs 2xl:text-sm block">
                              = {totalVal}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Δεκαδικά ψηφία */}
                    {decDigits.map((digit, i) => {
                      if (digit === '0' && i >= decRaw.length && decRaw.length > 0) return null;
                      const decCls = decClasses[i];
                      const valCalc = (Number(digit) / decCls.weight).toString().replace('.', ',');
                      const key = `dec-${i}`;
                      const isSelected = activeDigitKey === key;

                      return (
                        <div
                          key={key}
                          onMouseEnter={() => setActiveDigitKey(key)}
                          onClick={() => setActiveDigitKey(key)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-300' 
                              : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-blue-700 font-black text-sm 2xl:text-base">{digit}</span>
                            <span className="text-slate-400">×</span>
                            <span className="font-bold text-slate-700">{decCls.fraction}</span>
                            <span className="text-[10px] font-sans text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                              {decCls.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-blue-700 font-black text-xs 2xl:text-sm block">
                              = {valCalc}
                            </span>
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

              {/* ROW 3: (4) DYNAMIC EXCEL-STYLE BAR CHART */}
              <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5">
                    📊 Σχετική Αξία Θέσης (Ακέραια vs Δεκαδικά)
                  </span>
                  <span className="text-[10px] 2xl:text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
                    Οπτική Σύγκριση Μεγεθών
                  </span>
                </div>

                <div className="w-full h-48 2xl:h-56 flex items-end justify-between gap-2 md:gap-4 pt-6 px-2 md:px-4 bg-slate-50 rounded-xl border border-slate-100">
                  {chartItems.map((item) => {
                    const isSelected = activeDigitKey === item.key;

                    return (
                      <div
                        key={item.key}
                        onMouseEnter={() => setActiveDigitKey(item.key)}
                        onClick={() => setActiveDigitKey(item.key)}
                        className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                      >
                        {/* TOOLTIP */}
                        {isSelected && !item.isLeading && Number(item.digit) > 0 && (
                          <div className="absolute -top-10 bg-slate-900 text-white text-[10px] 2xl:text-xs font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 animate-bounce">
                            {item.val.toString().replace('.', ',')}
                          </div>
                        )}

                        {/* VALUE LABEL */}
                        {!item.isLeading && Number(item.digit) > 0 && (
                          <span className="text-[9px] 2xl:text-[11px] font-black text-slate-600 mb-1">
                            {item.digit}
                          </span>
                        )}

                        {/* THE BAR */}
                        <div
                          style={{ 
                            height: `${item.heightPercent}%`,
                            backgroundColor: item.isLeading || Number(item.digit) === 0 ? '#e2e8f0' : item.hex 
                          }}
                          className={`w-full rounded-t-md transition-all duration-300 ${isSelected ? 'ring-2 ring-amber-400 brightness-110' : 'opacity-90 hover:opacity-100'}`}
                        />

                        {/* X-AXIS LABEL */}
                        <span className="text-[8px] 2xl:text-[10px] font-bold text-slate-400 mt-1">
                          {item.short} ({item.weightLabel})
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-[10px] 2xl:text-xs text-slate-400 font-semibold px-2 pt-1">
                  <span>⬅️ Μεγαλύτερη Αξία (Ακέραιες Εκατοντάδες)</span>
                  <span>Μικρότερη Αξία (Δεκαδικά Χιλιοστά) ➡️</span>
                </div>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Κατανόησες τη θέση της υποδιαστολής και τα δεκαδικά μέρη; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/02-dekadikoi-ask"
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

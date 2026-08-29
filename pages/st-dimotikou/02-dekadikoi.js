import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

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
        weightLabel: decClasses[i].fraction,
        valStr: decTooltips[i],
        hex: decClasses[i].hex,
        isLeading: isTrailing,
        heightPercent: calculateBarHeight(d, isTrailing)
      };
    })
  ];

  return (
    <Layout
      title="🔢 2. Δεκαδικοί Αριθμοί και Αξία Θέσης - LearnMaths.gr"
      description="Μάθε πώς η υποδιαστολή διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/02-dekadikoi-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-8 md:space-y-10 py-6 md:py-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 2
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                2. Δεκαδικοί Αριθμοί και Δεκαδικά Κλάσματα
              </h1>
              <p className="text-teal-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς η <strong>υποδιαστολή</strong> διαχωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη, και ανακάλυψε την αξία των <strong>δεκάτων</strong>, <strong>εκατοστών</strong> και <strong>χιλιοστών</strong>!
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-teal-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
              <Link
                href="/st-dimotikou/02-dekadikoi-ask"
                className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-2.5 px-4 rounded-xl shadow-md transition transform hover:scale-105 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* THEORY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                1
              </div>
              <h3 className="text-lg font-black text-slate-900">Ακέραιο και Δεκαδικό Μέρος</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Η <strong>υποδιαστολή ( , )</strong> χωρίζει τον αριθμό σε δύο μέρη: το <strong>ακέραιο μέρος</strong> (αριστερά) και το <strong>δεκαδικό μέρος</strong> (δεξιά).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs text-slate-700 text-center font-mono font-bold">
              <span className="text-emerald-700 text-base">345</span>
              <span className="text-amber-500 text-lg"> , </span>
              <span className="text-blue-600 text-base">672</span>
            </div>
          </div>

          <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Τάξεις Δεκαδικού Μέρους</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Κάθε θέση δεξιά από την υποδιαστολή αντιστοιχεί σε δεκαδικό κλάσμα με παρονομαστή δύναμη του 10.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1 font-semibold">
              <ul className="grid grid-cols-1 gap-1 text-[11px]">
                <li className="text-blue-700">• <strong>δ (Δέκατα):</strong> 1/10 = 0,1</li>
                <li className="text-blue-700">• <strong>ε (Εκατοστά):</strong> 1/100 = 0,01</li>
                <li className="text-blue-700">• <strong>χ (Χιλιοστά):</strong> 1/1000 = 0,001</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Ισοδύναμοι Δεκαδικοί</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Όταν προσθέτουμε ή αφαιρούμε <strong>μηδενικά στο τέλος</strong> του δεκαδικού μέρους, η αξία του αριθμού δεν μεταβάλλεται!
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-100 text-xs text-slate-800 font-mono text-center font-bold">
              💡 3,5 = 3,50 = 3,500
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Δεκαδικών
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
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
                    setActiveDigitKey("dec-0");
                  }}
                  className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">

            {/* ROW 1: INPUT & READING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-inner flex flex-col justify-center">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Πληκτρολογησε Δεκαδικο Αριθμο (π.χ. 345,672):
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
                  className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-2xl shadow-sm focus:border-emerald-500 outline-none transition-all w-full tracking-wider text-emerald-700 font-mono"
                  placeholder="π.χ. 345,672"
                />
                <p className="text-[11px] text-slate-400 text-center font-medium">
                  💡 Πέρασε τον κέρσορα ή πάτα στα ψηφία του πίνακα για εστίαση!
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block flex items-center gap-1.5">
                  <span>🗣️</span> Πως διαβαζεται:
                </span>
                <p className="text-sm sm:text-base md:text-lg font-bold text-slate-100 leading-snug break-words">
                  {getDecimalReading()}
                </p>
              </div>
            </div>

            {/* ROW 2: PLACE VALUE TABLE & FULL MATHEMATICAL EXPANSION */}
            <div className="bg-slate-50 border border-slate-200 p-3 sm:p-5 md:p-6 rounded-2xl space-y-6">
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                    🗂️ Πινακας Αξιας Θεσης Δεκαδικων
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold md:hidden flex items-center gap-1">
                    <span>👈 Σύρετε για προβολή 👉</span>
                  </span>
                </div>

                <div className="w-full overflow-x-auto pb-2 pt-1 touch-pan-x border border-slate-200/80 rounded-2xl bg-white shadow-xs">
                  <div className="min-w-[560px] sm:min-w-[620px] rounded-2xl overflow-hidden">
                    
                    <div className="grid grid-cols-7 text-white text-center font-black text-xs uppercase tracking-wider">
                      <div className="col-span-3 bg-emerald-600 py-2.5 sm:py-3 border-r border-white/20">Ακεραιο Μερος</div>
                      <div className="bg-amber-500 py-2.5 sm:py-3 border-r border-white/20">,</div>
                      <div className="col-span-3 bg-blue-600 py-2.5 sm:py-3">Δεκαδικο Μερος</div>
                    </div>

                    <div className="grid grid-cols-7 text-[10px] font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
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
                              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border
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
                              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border
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

              {/* FULL MATHEMATICAL BREAKDOWN (3-COLUMN FIXED ALIGNMENT) */}
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block font-sans">
                    🧬 Πληρης Αναλυτικη Μορφη (Ακεραιες Μοναδες και Δεκαδικα Κλασματα)
                  </span>
                  <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
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
                        className={`grid grid-cols-[auto_1fr_auto] items-center p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-2 ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-xs' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                          <span className="text-emerald-700 font-black">{digit}</span>
                          <span className="text-slate-400">×</span>
                          <span className="font-bold text-slate-800">{weight}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-sans text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold inline-block truncate max-w-[90px] sm:max-w-none">
                            {intClasses[i].name}
                          </span>
                        </div>
                        <div className="text-right whitespace-nowrap font-black text-xs text-slate-700">
                          = {totalVal}
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
                        className={`grid grid-cols-[auto_1fr_auto] items-center p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-2 ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-xs' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                          <span className="text-blue-700 font-black">{digit}</span>
                          <span className="text-slate-400">×</span>
                          <span className="font-bold text-slate-800">{decCls.fraction}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-sans text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-bold inline-block truncate max-w-[90px] sm:max-w-none">
                            {decCls.name}
                          </span>
                        </div>
                        <div className="text-right whitespace-nowrap font-black text-xs text-blue-700">
                          = {valCalc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs font-bold text-slate-400 pt-1">
                <span>✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) , Δέκατα (δ) • Εκατοστά (ε) • Χιλιοστά (χ)</span>
              </div>

            </div>

            {/* ROW 3: DYNAMIC EXCEL-STYLE BAR CHART (STRICT BASELINE ALIGNMENT) */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  📊 Ύψος Ψηφίου (Excel Bar Chart)
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
                  Οπτική Σύγκριση Μεγεθών
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
                        className={`flex-1 flex flex-col items-center justify-end h-full relative ${hasValue ? 'cursor-pointer group' : 'cursor-default'}`}
                      >
                        {/* TOOLTIP ON HOVER */}
                        {isSelected && hasValue && (
                          <div className="absolute -top-9 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30 animate-bounce">
                            {item.valStr}
                          </div>
                        )}

                        {/* VALUE LABEL */}
                        {hasValue ? (
                          <span className="text-[11px] font-black text-slate-700 mb-1">
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

                {/* X-AXIS LABELS (ΕΥΘΥΓΡΑΜΜΙΣΜΕΝΕΣ ΚΑΤΩ ΑΠΟ ΤΙΣ ΜΠΑΡΕΣ) */}
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
              
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2 pt-1">
                <span>⬅️ Ακέραιες Εκατοντάδες</span>
                <span>Δεκαδικά Χιλιοστά ➡️</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Κατανόησες τη θέση της υποδιαστολής και τα δεκαδικά μέρη; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/02-dekadikoi-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState("478456514574");
  const [activeDigitIndex, setActiveDigitIndex] = useState(1);

  // Καθαρισμός και προετοιμασία 12ψηφίου αριθμού
  const cleanNumber = number.replace(/\D/g, '').slice(0, 12);
  const padded = cleanNumber.padStart(12, '0');
  const digits = padded.split('');

  // Ορισμός Περιόδων με πλήρη χρωματική ταυτότητα & hex για το γράφημα
  const periods = [
    { name: "Δισεκατομμύρια", short: "Δισ.", color: "bg-purple-600", light: "bg-purple-50/70", hex: "#9333ea", border: "border-purple-200", text: "text-purple-700" },
    { name: "Εκατομμύρια", short: "Εκατ.", color: "bg-rose-600", light: "bg-rose-50/70", hex: "#e11d48", border: "border-rose-200", text: "text-rose-700" },
    { name: "Χιλιάδες", short: "Χιλ.", color: "bg-blue-600", light: "bg-blue-50/70", hex: "#2563eb", border: "border-blue-200", text: "text-blue-700" },
    { name: "Μονάδες", short: "Μον.", color: "bg-emerald-600", light: "bg-emerald-50/70", hex: "#059669", border: "border-emerald-200", text: "text-emerald-700" },
  ];

  // Έτοιμα παραδείγματα από τον πραγματικό κόσμο
  const presets = [
    { label: "🇬🇷 Πληθυσμός Ελλάδας", value: "10482487" },
    { label: "🌕 Απόσταση Γης-Σελήνης (km)", value: "384400" },
    { label: "🌍 Ηλικία της Γης (έτη)", value: "4540000000" },
    { label: "⚡ Ταχύτητα Φωτός (m/s)", value: "299792458" },
  ];

  // Υπολογισμός λεκτικής διάσπασης σε περιόδους
  const getPeriodBreakdown = () => {
    if (!cleanNumber || cleanNumber === '0') return "Μηδέν";
    const dis = parseInt(padded.slice(0, 3), 10);
    const ekat = parseInt(padded.slice(3, 6), 10);
    const xil = parseInt(padded.slice(6, 9), 10);
    const mon = parseInt(padded.slice(9, 12), 10);

    const parts = [];
    if (dis > 0) parts.push(`${dis.toLocaleString('el-GR')} Δισεκατομμύρια`);
    if (ekat > 0) parts.push(`${ekat.toLocaleString('el-GR')} Εκατομμύρια`);
    if (xil > 0) parts.push(`${xil.toLocaleString('el-GR')} Χιλιάδες`);
    if (mon > 0) parts.push(`${mon.toLocaleString('el-GR')} Μονάδες`);

    return parts.length > 0 ? parts.join(" • ") : "0";
  };

  const activeDigitsCount = digits.filter(d => d !== '0').length;
  const firstNonZero = digits.findIndex(d => d !== '0');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Φυσικοί Αριθμοί & Αξία Θέσης - LearnMaths.gr</title>
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
                href="/st-dimotikou/01-fysikoi-ask"
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
                    Ενότητα 1
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  1. Φυσικοί Αριθμοί & Αξία Θέσης Ψηφίου
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε <strong>Περιόδους</strong> (τριάδες) και <strong>Τάξεις</strong>, και ανακάλυψε πώς η θέση κάθε ψηφίου καθορίζει τη συνολική του αξία!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
                <Link
                  href="/st-dimotikou/01-fysikoi-ask"
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
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Τι είναι οι Φυσικοί;</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  <strong>Φυσικοί αριθμοί</strong> είναι οι αριθμοί <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-bold">0, 1, 2, 3...</code> που χρησιμοποιούμε για να μετράμε. Δεν έχουν τέλος (είναι άπειροι).
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 space-y-1">
                <span className="font-bold text-blue-800">📌 Βασικός Κανόνας:</span>
                <p>Κάθε φυσικός αριθμός έχει έναν επόμενο (<span className="text-blue-600 font-bold">+1</span>) και έναν προηγούμενο (<span className="text-blue-600 font-bold">-1</span>) εκτός από το 0.</p>
              </div>
            </div>

            <div className="bg-indigo-50/80 border border-indigo-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Περίοδοι & Τάξεις</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε από δεξιά προς τα αριστερά σε <strong>τριάδες (Περιόδους)</strong>.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs 2xl:text-sm text-slate-700 space-y-1">
                <span className="font-bold text-indigo-800">🗂️ Οι 4 Βασικές Περίοδοι:</span>
                <ul className="grid grid-cols-2 gap-1 font-semibold text-[11px] 2xl:text-xs pt-1">
                  <li className="text-purple-700">• Δισεκατομμύρια</li>
                  <li className="text-rose-700">• Εκατομμύρια</li>
                  <li className="text-blue-700">• Χιλιάδες</li>
                  <li className="text-emerald-700">• Μονάδες</li>
                </ul>
              </div>
            </div>

            <div className="bg-cyan-50/80 border border-cyan-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Αξία Θέσης Ψηφίου</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Η αξία ενός ψηφίου <strong>εξαρτάται από τη θέση</strong> του. Κάθε θέση προς τα αριστερά έχει <strong>10 φορές μεγαλύτερη αξία</strong> από την προηγούμενη!
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs 2xl:text-sm text-slate-700 space-y-1">
                <span className="font-bold text-cyan-800">💡 Παράδειγμα:</span>
                <p>Στο <strong className="text-cyan-700">5.500</strong>, το 1ο πέντε αξίζει <strong className="text-slate-900">5.000</strong> (Χιλιάδες), ενώ το 2ο αξίζει <strong className="text-slate-900">500</strong> (Εκατοντάδες).</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Αξίας Θέσης
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Πληκτρολόγησε έναν αριθμό ή επίλεξε ένα παράδειγμα για να δεις την αυτόματη ανάλυσή του!
                </p>
              </div>

              {/* PRESET BUTTONS */}
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNumber(preset.value);
                      setActiveDigitIndex(null);
                    }}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs 2xl:text-sm font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-sm"
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
                    Πληκτρολόγησε Αριθμό (έως 12 ψηφία):
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value.slice(0, 12));
                      setActiveDigitIndex(null);
                    }}
                    className="text-2xl md:text-3xl 2xl:text-4xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-600 font-mono"
                    placeholder="Γράψε έναν αριθμό..."
                  />
                  <p className="text-[11px] 2xl:text-xs text-slate-400 text-center font-medium">
                    💡 Πέρασε τον κέρσορα ή κάνε κλικ στα ψηφία για σύγκριση!
                  </p>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 2xl:p-6 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                  <span className="text-[10px] 2xl:text-xs font-black text-amber-400 uppercase tracking-widest block flex items-center gap-1.5">
                    <span>🗣️</span> Πώς διαβάζεται ανά περίοδο:
                  </span>
                  <p className="text-base md:text-lg 2xl:text-xl font-bold text-slate-100 leading-snug">
                    {getPeriodBreakdown()}
                  </p>
                </div>
              </div>

              {/* ROW 2: (3) PLACE VALUE TABLE & FULL MATHEMATICAL EXPANSION */}
              <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 2xl:p-8 rounded-2xl space-y-6">
                
                {/* 12-DIGIT PLACE VALUE TABLE */}
                <div className="w-full overflow-x-auto pb-4 pt-1">
                  <div className="min-w-[620px] bg-white rounded-2xl shadow-sm border border-gray-200 mx-auto">
                    
                    {/* PERIODS HEADER */}
                    <div className="grid grid-cols-4 text-white text-center font-black text-xs 2xl:text-sm uppercase tracking-wider rounded-t-2xl overflow-hidden">
                      {periods.map((p, i) => (
                        <div key={i} className={`${p.color} py-3 border-r border-white/20 last:border-0`}>
                          <span className="hidden md:inline">{p.name}</span>
                          <span className="md:hidden">{p.short}</span>
                        </div>
                      ))}
                    </div>

                    {/* CLASSES HEADER */}
                    <div className="grid grid-cols-12 text-[10px] 2xl:text-xs font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="contents">
                          <div className="border-r border-slate-200">Ε</div>
                          <div className="border-r border-slate-200">Δ</div>
                          <div className="border-r border-slate-200">Μ</div>
                        </span>
                      ))}
                    </div>

                    {/* DIGITS ROW WITH UNIFORM PADDING & FULL-SURROUND HIGHLIGHT */}
                    <div className="grid grid-cols-12 text-center items-center p-1.5 bg-white rounded-b-2xl">
                      {digits.map((digit, i) => {
                        const periodIdx = Math.floor(i / 3);
                        const isLeadingZero = digit === '0' && i < firstNonZero;
                        const isSelected = activeDigitIndex === i;

                        return (
                          <div key={i} className="px-0.5">
                            <button
                              type="button"
                              onClick={() => setActiveDigitIndex(i)}
                              onMouseEnter={() => setActiveDigitIndex(i)}
                              className={`w-full py-4 md:py-5 2xl:py-6 text-xl md:text-2xl 2xl:text-3xl font-black rounded-xl transition-all duration-200 focus:outline-none font-mono flex items-center justify-center
                                ${periods[periodIdx].light}
                                ${isSelected 
                                  ? 'bg-amber-400 text-slate-900 border-2 border-amber-500 shadow-md transform -translate-y-0.5' 
                                  : 'border border-transparent hover:bg-amber-100/70'}
                                ${isLeadingZero && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                            >
                              {digit}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* FULL MATHEMATICAL BREAKDOWN */}
                <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl font-mono text-xs 2xl:text-sm space-y-3 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-[11px] 2xl:text-xs font-black text-slate-500 uppercase tracking-wider block font-sans">
                      🧬 Πλήρης Αναλυτική Μορφή (Δυνάμεις του 10)
                    </span>
                    <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Πλήρης Εμφάνιση
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 2xl:gap-3">
                    {digits.map((digit, i) => {
                      if (digit === '0') return null;
                      const power = 11 - i;
                      const multiplier = Math.pow(10, power).toLocaleString('el-GR');
                      const totalVal = (parseInt(digit, 10) * Math.pow(10, power)).toLocaleString('el-GR');
                      const isSelected = activeDigitIndex === i;

                      return (
                        <div
                          key={i}
                          onMouseEnter={() => setActiveDigitIndex(i)}
                          onClick={() => setActiveDigitIndex(i)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-50 border-amber-400 shadow-sm ring-1 ring-amber-300' 
                              : 'bg-slate-50/70 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-600 font-black text-sm 2xl:text-base">{digit}</span>
                            <span className="text-slate-400">×</span>
                            <span className="font-bold text-slate-700">{multiplier}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-slate-400 text-[10px] 2xl:text-xs block">
                              = {totalVal}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center text-xs 2xl:text-sm font-bold text-slate-400 pt-1">
                  <span>✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) σε κάθε Περίοδο</span>
                </div>

              </div>

              {/* ROW 3: (4) DYNAMIC EXCEL-STYLE BAR CHART */}
              <div className="bg-white border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5">
                    📊 Σχετική Αξία Θέσης (Excel Bar Chart)
                  </span>
                  <span className="text-[10px] 2xl:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                    {activeDigitsCount} ενεργά ψηφία
                  </span>
                </div>

                <div className="w-full h-48 2xl:h-56 flex items-end justify-between gap-1.5 md:gap-3 pt-6 px-2 md:px-4 bg-slate-50 rounded-xl border border-slate-100">
                  {digits.map((digit, i) => {
                    const periodIdx = Math.floor(i / 3);
                    const power = 11 - i;
                    const isLeadingZero = digit === '0' && i < firstNonZero;
                    const val = parseInt(digit, 10);
                    
                    const barHeightPercent = isLeadingZero || val === 0 
                      ? 4 
                      : Math.max(12, Math.round(((power + 1) / 12) * 75 + (val / 9) * 20));

                    const isSelected = activeDigitIndex === i;

                    return (
                      <div
                        key={i}
                        onMouseEnter={() => setActiveDigitIndex(i)}
                        onClick={() => setActiveDigitIndex(i)}
                        className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                      >
                        {isSelected && !isLeadingZero && val > 0 && (
                          <div className="absolute -top-10 bg-slate-900 text-white text-[10px] 2xl:text-xs font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 animate-bounce">
                            {(val * Math.pow(10, power)).toLocaleString('el-GR')}
                          </div>
                        )}

                        {!isLeadingZero && val > 0 && (
                          <span className="text-[9px] 2xl:text-[11px] font-black text-slate-600 mb-1">
                            {digit}
                          </span>
                        )}

                        <div
                          style={{ 
                            height: `${barHeightPercent}%`,
                            backgroundColor: isLeadingZero || val === 0 ? '#e2e8f0' : periods[periodIdx].hex 
                          }}
                          className={`w-full rounded-t-md transition-all duration-300 ${isSelected ? 'ring-2 ring-amber-400 brightness-110' : 'opacity-90 hover:opacity-100'}`}
                        />

                        <span className="text-[8px] 2xl:text-[10px] font-bold text-slate-400 mt-1">
                          10^{power}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-[10px] 2xl:text-xs text-slate-400 font-semibold px-2 pt-1">
                  <span>⬅️ Μεγαλύτερη Αξία (Δισεκατομμύρια)</span>
                  <span>Μικρότερη Αξία (Μονάδες) ➡️</span>
                </div>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Κατανόησες την αξία θέσης των φυσικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/01-fysikoi-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base 2xl:text-lg whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 2xl:py-8 text-center text-sm 2xl:text-base w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>

      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

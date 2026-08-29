import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState("478456014574");
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

  // Υπολογισμός ύψους στήλης αποκλειστικά από την τιμή του ψηφίου (1-9)
  const calculateBarHeight = (digit, index) => {
    const val = parseInt(digit, 10);
    const isLeadingZero = digit === '0' && index < firstNonZero;
    if (val === 0 || isLeadingZero) return 0;

    return 12 + (val - 1) * 11;
  };

  return (
    <Layout
      title="🔢 1. Φυσικοί Αριθμοί και Αξία Θέσης - LearnMaths.gr"
      description="Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε Περιόδους και Τάξεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/01-fysikoi-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-10 py-2 sm:py-4">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικού
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενότητα 1
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                1. Φυσικοί Αριθμοί και Αξία Θέσης Ψηφίου
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε <strong>Περιόδους</strong> (τριάδες) και <strong>Τάξεις</strong>, και ανακάλυψε πώς η θέση κάθε ψηφίου καθορίζει τη συνολική του αξία!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με 8 δυναμικά προβλήματα!</p>
              <Link
                href="/st-dimotikou/01-fysikoi-ask"
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
              <h3 className="text-lg font-black text-slate-900">Τι είναι οι Φυσικοί;</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                <strong>Φυσικοί αριθμοί</strong> είναι οι αριθμοί <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-bold">0, 1, 2, 3...</code> που χρησιμοποιούμε για να μετράμε. Δεν έχουν τέλος (είναι άπειροι).
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-blue-800">📌 Βασικός Κανόνας:</span>
              <p>Κάθε φυσικός αριθμός έχει έναν επόμενο (<span className="text-blue-600 font-bold">+1</span>) και έναν προηγούμενο (<span className="text-blue-600 font-bold">-1</span>) εκτός από το 0.</p>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Περίοδοι & Τάξεις</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε από δεξιά προς τα αριστερά σε <strong>τριάδες (Περιόδους)</strong>.
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-indigo-800">🗂️ Οι 4 Βασικές Περίοδοι:</span>
              <ul className="grid grid-cols-2 gap-1 font-semibold text-[11px] pt-1">
                <li className="text-purple-700">• Δισεκατομμύρια</li>
                <li className="text-rose-700">• Εκατομμύρια</li>
                <li className="text-blue-700">• Χιλιάδες</li>
                <li className="text-emerald-700">• Μονάδες</li>
              </ul>
            </div>
          </div>

          <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Αξία Θέσης Ψηφίου</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Η αξία ενός ψηφίου <strong>εξαρτάται από τη θέση</strong> του. Κάθε θέση προς τα αριστερά έχει <strong>10 φορές μεγαλύτερη αξία</strong> από την προηγούμενη!
              </p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-cyan-100 text-xs text-slate-700 space-y-1">
              <span className="font-bold text-cyan-800">💡 Παράδειγμα:</span>
              <p>Στο <strong className="text-cyan-700">5.500</strong>, το 1ο πέντε αξίζει <strong className="text-slate-900">5.000</strong> (Χιλιάδες), ενώ το 2ο αξίζει <strong className="text-slate-900">500</strong> (Εκατοντάδες).</p>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Αξίας Θέσης
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
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
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-xs"
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
                <label className="text-xs font-black text-slate-500 tracking-wider block">
                  Πληκτρολόγησε Αριθμό (έως 12 ψηφία):
                </label>
                <input
                  type="text"
                  value={number}
                  onChange={(e) => {
                    const cleanInput = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                    setNumber(cleanInput);
                    setActiveDigitIndex(null);
                  }}
                  className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-600 font-mono"
                  placeholder="Γράψε έναν αριθμό..."
                />
                <p className="text-[11px] text-slate-400 text-center font-medium">
                  💡 Πέρασε τον κέρσορα ή πάτα σε ένα ψηφίο για ανάλυση!
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                <span className="text-[10px] font-black text-amber-400 tracking-widest block flex items-center gap-1.5 uppercase">
                  <span>🗣️</span> Πώς διαβάζεται ανά περίοδο:
                </span>
                <p className="text-sm sm:text-base md:text-lg font-bold text-slate-100 leading-snug break-words">
                  {getPeriodBreakdown()}
                </p>
              </div>
            </div>

            {/* ROW 2: PLACE VALUE TABLE & FULL MATHEMATICAL EXPANSION */}
            <div className="bg-slate-50 border border-slate-200 p-3 sm:p-5 md:p-6 rounded-2xl space-y-6">

              {/* 12-DIGIT PLACE VALUE TABLE */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                    🗂️ Πίνακας Αξίας Θέσης (12 Ψηφία)
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold md:hidden flex items-center gap-1">
                    <span>👈 Σύρετε για περισσότερα 👉</span>
                  </span>
                </div>

                <div className="w-full overflow-x-auto pb-2 pt-1 touch-pan-x border border-slate-200/80 rounded-2xl bg-white shadow-xs">
                  <div className="min-w-[580px] sm:min-w-[620px] rounded-2xl overflow-hidden">

                    {/* PERIODS HEADER */}
                    <div className="grid grid-cols-4 text-white text-center font-black text-xs tracking-wider">
                      {periods.map((p, i) => (
                        <div key={i} className={`${p.color} py-2.5 sm:py-3 border-r border-white/20 last:border-0`}>
                          <span className="hidden sm:inline">{p.name}</span>
                          <span className="sm:hidden">{p.short}</span>
                        </div>
                      ))}
                    </div>

                    {/* CLASSES HEADER */}
                    <div className="grid grid-cols-12 text-[10px] font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="contents">
                          <div className="border-r border-slate-200">Ε</div>
                          <div className="border-r border-slate-200">Δ</div>
                          <div className="border-r border-slate-200">Μ</div>
                        </span>
                      ))}
                    </div>

                    {/* DIGITS ROW */}
                    <div className="grid grid-cols-12 text-center items-center p-2 bg-white gap-1">
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
                              className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border
                                ${periods[periodIdx].light}
                                ${isSelected 
                                  ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm' 
                                  : 'border-transparent hover:bg-amber-100/70 hover:border-amber-300'}
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
              </div>

              {/* FULL MATHEMATICAL BREAKDOWN (RESPONSIVE WRAPPING) */}
              <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl font-mono text-xs space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block font-sans">
                    🧬 Πληρης Αναλυτικη Μορφη (Δυναμεις του 10)
                  </span>
                  <span className="text-[10px] font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Πλήρης Εμφάνιση
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
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
                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-1 sm:gap-2 ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-xs' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap text-xs sm:text-sm">
                          <span className="text-emerald-600 font-black">{digit}</span>
                          <span className="text-slate-400">×</span>
                          <span className="font-bold text-slate-800 break-all">{multiplier}</span>
                        </div>
                        <div className="sm:text-right text-left">
                          <span className="text-slate-500 font-bold text-[11px] sm:text-[10px] block break-all">
                            = {totalVal}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center text-xs font-bold text-slate-400 pt-1">
                <span>✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) σε κάθε Περίοδο</span>
              </div>

            </div>

            {/* ROW 3: DYNAMIC EXCEL-STYLE BAR CHART (WITH RESPONSIVE SWIPE CONTAINER) */}
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                  📊 Ύψος Ψηφίου (Excel Bar Chart)
                </span>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  {activeDigitsCount} ενεργά ψηφία
                </span>
              </div>

              <div className="w-full overflow-x-auto pb-2 touch-pan-x">
                <div className="min-w-[540px] h-56 flex items-end justify-between gap-2 pt-12 pb-2 px-3 bg-slate-50 rounded-xl border border-slate-100 relative">
                  {digits.map((digit, i) => {
                    const periodIdx = Math.floor(i / 3);
                    const power = 11 - i;
                    const val = parseInt(digit, 10);
                    const isLeadingZero = digit === '0' && i < firstNonZero;
                    const hasValue = val > 0 && !isLeadingZero;
                    const barHeightPercent = calculateBarHeight(digit, i);
                    const isSelected = activeDigitIndex === i;

                    return (
                      <div
                        key={i}
                        onMouseEnter={() => { if (hasValue) setActiveDigitIndex(i); }}
                        onClick={() => { if (hasValue) setActiveDigitIndex(i); }}
                        className={`flex-1 flex flex-col items-center justify-end h-full relative ${hasValue ? 'cursor-pointer group' : 'cursor-default'}`}
                      >
                        {/* TOOLTIP ON HOVER / SELECTION */}
                        {isSelected && hasValue && (
                          <div className="absolute -top-11 bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg whitespace-nowrap z-30 animate-bounce">
                            {(val * Math.pow(10, power)).toLocaleString('el-GR')}
                          </div>
                        )}

                        {/* VALUE LABEL */}
                        {hasValue ? (
                          <span className="text-[10px] font-black text-slate-700 mb-1">
                            {digit}
                          </span>
                        ) : (
                          <div className="h-4 mb-1"></div>
                        )}

                        {/* THE BAR */}
                        <div className="w-full h-full flex items-end">
                          {hasValue && (
                            <div
                              style={{ 
                                height: `${barHeightPercent}%`,
                                backgroundColor: periods[periodIdx].hex 
                              }}
                              className={`w-full rounded-t-lg transition-all duration-200 ${isSelected ? 'ring-4 ring-amber-400 brightness-110 shadow-md' : 'opacity-90 hover:opacity-100'}`}
                            />
                          )}
                        </div>

                        {/* X-AXIS LABEL */}
                        <span className="text-[8px] font-bold text-slate-400 mt-1.5">
                          10^{power}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-2 pt-1">
                <span>⬅️ Μεγαλύτερη Αξία (Δισεκατομμύρια)</span>
                <span>Μικρότερη Αξία (Μονάδες) ➡️</span>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Κατανόησες την αξία θέσης των φυσικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>
          <Link
            href="/st-dimotikou/01-fysikoi-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>

      {/* CSS Hack */}
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </Layout>
  );
}

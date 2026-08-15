import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState("10482487");
  const [activeDigitIndex, setActiveDigitIndex] = useState(null);

  // Καθαρισμός και προετοιμασία 12ψηφίου αριθμού
  const cleanNumber = number.replace(/\D/g, '').slice(0, 12);
  const padded = cleanNumber.padStart(12, '0');
  const digits = padded.split('');

  // Ορισμός Περιόδων με πλήρη χρωματική ταυτότητα
  const periods = [
    { name: "Δισεκατομμύρια", short: "Δισ.", color: "bg-purple-600", light: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
    { name: "Εκατομμύρια", short: "Εκατ.", color: "bg-rose-600", light: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
    { name: "Χιλιάδες", short: "Χιλ.", color: "bg-blue-600", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    { name: "Μονάδες", short: "Μον.", color: "bg-emerald-600", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  ];

  // Έτοιμα παραδείγματα από τον πραγματικό κόσμο
  const presets = [
    { label: "🇬🇷 Πληθυσμός Ελλάδας", value: "10482487" },
    { label: "🌕 Απόσταση Γης-Σελήνης", value: "384400" },
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

  // Ονομασία τάξης για το επιλεγμένο ψηφίο
  const getDigitPositionName = (idx) => {
    const periodIdx = Math.floor(idx / 3);
    const subIdx = idx % 3; // 0: Εκατοντάδες, 1: Δεκάδες, 2: Μονάδες
    const subNames = ["Εκατοντάδες", "Δεκάδες", "Μονάδες"];
    return `${subNames[subIdx]} ${periods[periodIdx].name}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Φυσικοί Αριθμοί & Αξία Θέσης - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 w-full">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
              <span>LearnMaths</span><span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/st-dimotikou/01-fysikoi-ask"
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition shadow-sm flex items-center gap-1.5"
              >
                <span>🎯</span> Ασκήσεις
              </Link>
              <Link
                href="/st-dimotikou"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition"
              >
                🔙 ΣΤ' Δημοτικού
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. MAIN LESSON CONTAINER */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-8 space-y-10`}>

          {/* HERO BANNER WITH PROMO CALLOUT CARD */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    🎓 ΣΤ' Δημοτικού
                  </span>
                  <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Ενότητα 1
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                  1. Φυσικοί Αριθμοί & Αξία Θέσης Ψηφίου
                </h1>
                <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-2xl">
                  Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε <strong>Περιόδους</strong> (τριάδες) και <strong>Τάξεις</strong>, και ανακάλυψε πώς η θέση κάθε ψηφίου καθορίζει τη συνολική του αξία!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
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

          {/* 3. THEORY CARDS (3 COLS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1 */}
            <div className="bg-blue-50/80 border border-blue-100 p-6 rounded-3xl space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center gap-2 justify-center font-black text-lg shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900">Τι είναι οι Φυσικοί;</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  <strong>Φυσικοί αριθμοί</strong> είναι οι αριθμοί <code className="bg-white px-1.5 py-0.5 rounded text-blue-700 font-bold">0, 1, 2, 3...</code> που χρησιμοποιούμε για να μετράμε. Δεν έχουν τέλος (είναι άπειροι).
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-blue-800">📌 Βασικός Κανόνας:</span>
                <p>Κάθε φυσικός αριθμός έχει έναν αμέσως επόμενο (<span className="text-blue-600 font-bold">+1</span>) και έναν αμέσως προηγούμενο (<span className="text-blue-600 font-bold">-1</span>) εκτός από το 0.</p>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900">Περίοδοι & Τάξεις</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε από δεξιά προς τα αριστερά σε <strong>τριάδες (Περιόδους)</strong>.
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-indigo-800">🗂️ Οι 4 Βασικές Περίοδοι:</span>
                <ul className="grid grid-cols-2 gap-1 font-semibold text-[11px] pt-1">
                  <li className="text-purple-700">• Δισεκατομμύρια</li>
                  <li className="text-rose-700">• Εκατομμύρια</li>
                  <li className="text-blue-700">• Χιλιάδες</li>
                  <li className="text-emerald-700">• Μονάδες</li>
                </ul>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="bg-cyan-50/80 border border-cyan-100 p-6 rounded-3xl space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-cyan-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900">Αξία Θέσης Ψηφίου</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Η αξία ενός ψηφίου <strong>εξαρτάται από τη θέση</strong> του. Κάθε θέση προς τα αριστερά έχει <strong>10 φορές μεγαλύτερη αξία</strong> από την προηγούμενη!
                </p>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-cyan-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-cyan-800">💡 Παράδειγμα Σύγκρισης:</span>
                <p>Στο <strong className="text-cyan-700">5.500</strong>, το πρώτο 5 αξίζει <strong className="text-slate-900">5.000</strong> (Χιλιάδες), ενώ το δεύτερο 5 αξίζει <strong className="text-slate-900">500</strong> (Εκατοντάδες).</p>
              </div>
            </div>

          </div>

          {/* 4. INTERACTIVE PLAYGROUND (ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Αξίας Θέσης
                </h2>
                <p className="text-gray-500 text-sm">
                  Πληκτρολόγησε έναν αριθμό ή επίλεξε ένα παράδειγμα για να δεις την αυτόματη ανάλυσή του!
                </p>
              </div>

              {/* PRESET BUTTONS */}
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNumber(preset.value);
                      setActiveDigitIndex(null);
                    }}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN PLAYGROUND GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT SIDE: CONTROLS & ANALYSIS (5 COLS) */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* NUMBER INPUT CARD */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 shadow-inner">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό (έως 12 ψηφία):
                  </label>
                  <input
                    type="number"
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value.slice(0, 12));
                      setActiveDigitIndex(null);
                    }}
                    className="text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-600"
                    placeholder="Γράψε έναν αριθμό..."
                  />
                  <p className="text-[11px] text-slate-400 text-center font-medium">
                    💡 Κάνε κλικ πάνω σε οποιοδήποτε ψηφίο στον πίνακα για λεπτομέρειες!
                  </p>
                </div>

                {/* DYNAMIC READOUT CARD */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl space-y-2 shadow-md min-h-[110px] flex flex-col justify-center">
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                    🗣️ Πώς διαβάζεται ανά περίοδο:
                  </span>
                  <p className="text-sm md:text-base font-bold text-slate-100 leading-snug">
                    {getPeriodBreakdown()}
                  </p>
                </div>

                {/* DIGIT VALUE EXPLORE CARD (FIXED HEIGHT CONTAINER) */}
                <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-2xl min-h-[170px] space-y-2 shadow-sm flex flex-col justify-center">
                  {activeDigitIndex !== null ? (
                    <div className="space-y-1.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
                          🔍 Αναλύθηκε το ψηφίο:
                        </span>
                        <span className="bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded-lg text-sm">
                          {digits[activeDigitIndex]}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        Θέση: <span className="text-blue-700">{getDigitPositionName(activeDigitIndex)}</span>
                      </p>
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-amber-200 font-mono">
                        Αξία = {digits[activeDigitIndex]} × 10<sup>{11 - activeDigitIndex}</sup> ={" "}
                        <strong className="text-emerald-700 font-black">
                          {(parseInt(digits[activeDigitIndex], 10) * Math.pow(10, 11 - activeDigitIndex)).toLocaleString('el-GR')}
                        </strong>
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-4 space-y-1">
                      <span className="text-2xl">👆</span>
                      <p className="text-xs font-bold">Κάνε κλικ σε ένα ψηφίο του δεξιού πίνακα για να δεις τη συγκεκριμένη αξία του!</p>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT SIDE: PLACE VALUE TABLE VISUALIZATION (7 COLS) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-200 p-4 md:p-6 rounded-2xl flex flex-col justify-between space-y-4 min-h-[460px]">
                
                <div className="w-full overflow-x-auto pb-2">
                  <div className="min-w-[540px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mx-auto">
                    
                    {/* PERIODS HEADER */}
                    <div className="grid grid-cols-4 text-white text-center font-black text-xs uppercase tracking-wider">
                      {periods.map((p, i) => (
                        <div key={i} className={`${p.color} py-3 border-r border-white/20 last:border-0`}>
                          <span className="hidden md:inline">{p.name}</span>
                          <span className="md:hidden">{p.short}</span>
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

                    {/* DIGITS ROW WITH INTERACTIVE HOVER & CLICK */}
                    <div className="grid grid-cols-12 text-center items-center">
                      {digits.map((digit, i) => {
                        const periodIdx = Math.floor(i / 3);
                        const isLeadingZero = digit === '0' && i < digits.findIndex(d => d !== '0');
                        const isSelected = activeDigitIndex === i;

                        return (
                          <button
                            key={i}
                            onClick={() => setActiveDigitIndex(i)}
                            className={`py-6 text-xl md:text-2xl font-black border-r border-slate-200 last:border-0 transition-all duration-200 hover:scale-105 hover:bg-amber-100 focus:outline-none
                              ${periods[periodIdx].light}
                              ${isSelected ? 'bg-amber-300 text-slate-900 ring-4 ring-amber-400 z-10 scale-110 shadow-md' : ''}
                              ${isLeadingZero ? 'text-slate-300' : 'text-slate-800'}`}
                          >
                            {digit}
                          </button>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* EXPANDED POWERS OF 10 BREAKDOWN LIST */}
                <div className="bg-white border border-slate-200 p-4 rounded-xl font-mono text-xs text-left space-y-1.5 shadow-inner max-h-[160px] overflow-y-auto">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block font-sans mb-1">
                    🧬 Πλήρης Μαθηματική Ανάλυση (Δυνάμεις 10):
                  </span>
                  {digits.map((digit, i) => {
                    if (digit === '0') return null;
                    const power = 11 - i;
                    const multiplier = Math.pow(10, power).toLocaleString('el-GR');
                    const isSelected = activeDigitIndex === i;

                    return (
                      <div
                        key={i}
                        onClick={() => setActiveDigitIndex(i)}
                        className={`flex items-center justify-between p-1 px-2 rounded cursor-pointer transition ${isSelected ? 'bg-amber-100 font-bold' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-emerald-600 font-black text-sm">{digit}</span>
                          <span className="text-slate-400">×</span>
                          <span className="font-bold text-slate-700">{multiplier}</span>
                        </div>
                        <span className="text-slate-400 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">
                          (10^{power})
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-xs font-bold text-slate-400 pt-2 border-t border-slate-100">
                  <span>✨ Εκατοντάδες (Ε) • Δεκάδες (Δ) • Μονάδες (Μ) σε κάθε Περίοδο</span>
                </div>

              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Κατανόησες την αξία θέσης των φυσικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/01-fysikoi-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* 6. GLOBAL FOOTER (OUTSIDE MAIN) */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη ΣΤ' Δημοτικού.</p>
      </footer>

      {/* CSS Hack για αφαίρεση των arrows στο input number */}
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
```eof

Ο νέος κώδικας περιλαμβάνει όλες τις προδιαγραφές του LearnMaths.gr και παρέχει μια πλήρως διαδραστική εμπειρία μάθησης για τους μαθητές της ΣΤ' Δημοτικού. Μπορείς να μου ζητήσεις να φτιάξουμε τώρα τη σελίδα των Ασκήσεων (`01-fysikoi-ask.js`) ή κάποια άλλη ενότητα!

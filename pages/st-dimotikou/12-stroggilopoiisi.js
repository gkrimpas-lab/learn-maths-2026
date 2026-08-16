import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function StroggilopoiisiPage() {
  const [inputValue, setInputValue] = useState("432,658");
  const [roundPlace, setRoundPlace] = useState("units"); // hundreds, tens, units, tenths, hundredths, thousandths

  const presets = [
    { label: '💶 19,85 € (Τιμή)', val: '19,85', place: 'units' },
    { label: '📏 145,28 μ. (Μήκος)', val: '145,28', place: 'tenths' },
    { label: '⚖️ 74,625 κιλά (Βάρος)', val: '74,625', place: 'hundredths' },
    { label: '👥 1.482 κάτοικοι', val: '1482', place: 'hundreds' }
  ];

  const handleInputChange = (val) => {
    let clean = val.replace(/\./g, ',').replace(/[^0-9,]/g, '');
    const parts = clean.split(',');
    let intPart = (parts[0] || '').slice(0, 6);
    if (parts.length > 1) {
      let decPart = parts.slice(1).join('').slice(0, 4);
      setInputValue(`${intPart},${decPart}`);
      return;
    }
    setInputValue(intPart);
  };

  const parseVal = (str) => {
    if (!str) return 0;
    const clean = str.replace(/\s+/g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  };

  const num = parseVal(inputValue);

  // Μεταβλητές υπολογισμού
  let lowerBound = 0;
  let upperBound = 0;
  let roundedValue = 0;
  let placeName = "";
  let keyDigit = 0;
  let precisionDigits = 0;

  switch (roundPlace) {
    case "hundreds":
      placeName = "Εκατοντάδες";
      lowerBound = Math.floor(num / 100) * 100;
      upperBound = lowerBound + 100;
      roundedValue = Math.round(num / 100) * 100;
      keyDigit = Math.floor((num % 100) / 10);
      precisionDigits = 0;
      break;
    case "tens":
      placeName = "Δεκάδες";
      lowerBound = Math.floor(num / 10) * 10;
      upperBound = lowerBound + 10;
      roundedValue = Math.round(num / 10) * 10;
      keyDigit = Math.floor(num % 10);
      precisionDigits = 0;
      break;
    case "units":
      placeName = "Μονάδες";
      lowerBound = Math.floor(num);
      upperBound = lowerBound + 1;
      roundedValue = Math.round(num);
      keyDigit = Math.floor((num * 10) % 10);
      precisionDigits = 0;
      break;
    case "tenths":
      placeName = "Δέκατα (0,1)";
      lowerBound = Math.floor(num * 10) / 10;
      upperBound = parseFloat((lowerBound + 0.1).toFixed(1));
      roundedValue = parseFloat((Math.round(num * 10) / 10).toFixed(1));
      keyDigit = Math.floor((num * 100) % 10);
      precisionDigits = 1;
      break;
    case "hundredths":
      placeName = "Εκατοστά (0,01)";
      lowerBound = Math.floor(num * 100) / 100;
      upperBound = parseFloat((lowerBound + 0.01).toFixed(2));
      roundedValue = parseFloat((Math.round(num * 100) / 100).toFixed(2));
      keyDigit = Math.floor((num * 1000) % 10);
      precisionDigits = 2;
      break;
    case "thousandths":
      placeName = "Χιλιοστά (0,001)";
      lowerBound = Math.floor(num * 1000) / 1000;
      upperBound = parseFloat((lowerBound + 0.001).toFixed(3));
      roundedValue = parseFloat((Math.round(num * 1000) / 1000).toFixed(3));
      keyDigit = Math.floor((num * 10000) % 10);
      precisionDigits = 3;
      break;
    default:
      break;
  }

  keyDigit = Math.abs(keyDigit);

  const range = upperBound - lowerBound;
  let percentage = range > 0 ? ((num - lowerBound) / range) * 100 : 0;
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  const isUp = keyDigit >= 5;

  const formatWithComma = (val, prec) => {
    return val.toFixed(prec).replace('.', ',');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Στρογγυλοποίηση Αριθμών - LearnMaths.gr</title>
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
                href="/st-dimotikou/12-stroggilopoiisi-ask"
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
                    Ενότητα 12
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl 2xl:text-5xl font-black tracking-tight leading-tight">
                  12. Στρογγυλοποίηση Φυσικών & Δεκαδικών Αριθμών
                </h1>
                <p className="text-blue-100 text-sm md:text-base 2xl:text-lg leading-relaxed max-w-3xl">
                  Μάθε τον «κανόνα του ψηφίου-κλειδιού» για να στρογγυλοποιείς με ακρίβεια σε οποιαδήποτε τάξη: <strong>Μονάδες</strong>, <strong>Δεκάδες</strong>, <strong>Εκατοντάδες</strong> ή <strong>Δέκατα</strong>, <strong>Εκατοστά</strong> και <strong>Χιλιοστά</strong>!
                </p>
              </div>

              {/* CALLOUT PROMO CARD */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
                <span className="text-3xl 2xl:text-4xl">🚀</span>
                <h3 className="font-black text-lg 2xl:text-xl text-amber-300">Ώρα για Εξάσκηση!</h3>
                <p className="text-xs 2xl:text-sm text-blue-50">Δοκίμασε τις διαδραστικές ασκήσεις με άμεσο έλεγχο και βαθμολόγηση!</p>
                <Link
                  href="/st-dimotikou/12-stroggilopoiisi-ask"
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
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Τι είναι η Στρογγυλοποίηση;</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αντικαθιστούμε έναν αριθμό με έναν κοντινό του πιο «στρογγυλό», ώστε να κάνουμε γρήγορους υπολογισμούς και εκτιμήσεις.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-blue-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center">
                <p>19,85 € ≈ <strong className="text-blue-700">20 €</strong></p>
              </div>
            </div>

            <div className="bg-rose-50/80 border border-rose-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  2
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Στρογγυλοποίηση Κάτω</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν το αμέσως επόμενο ψηφίο είναι <strong>0, 1, 2, 3 ή 4</strong>, το ψηφίο της τάξης παραμένει <strong>ίδιο</strong>.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-rose-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center">
                <p>43<strong className="text-rose-600">2</strong> ≈ <strong className="text-rose-700">430</strong> (δεκάδες)</p>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-100 p-6 2xl:p-8 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="w-10 h-10 2xl:w-12 2xl:h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg 2xl:text-xl shadow-sm">
                  3
                </div>
                <h3 className="text-lg 2xl:text-xl font-black text-slate-900">Στρογγυλοποίηση Πάνω</h3>
                <p className="text-slate-600 text-sm 2xl:text-base leading-relaxed">
                  Αν το αμέσως επόμενο ψηφίο είναι <strong>5, 6, 7, 8 ή 9</strong>, το ψηφίο της τάξης <strong>αυξάνεται κατά 1</strong>.
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs 2xl:text-sm text-slate-700 font-mono text-center font-bold">
                <p>43<strong className="text-emerald-600">7</strong> ≈ <strong className="text-emerald-700">440</strong> (δεκάδες)</p>
              </div>
            </div>
          </div>

          {/* 4. INTERACTIVE PLAYGROUND */}
          <div className="bg-white p-6 md:p-8 2xl:p-10 rounded-3xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-2xl 2xl:text-3xl font-black text-slate-900 flex items-center gap-2">
                  <span>🕹️</span> Διαδραστικό Εργαστήριο Στρογγυλοποίησης
                </h2>
                <p className="text-gray-500 text-sm 2xl:text-base">
                  Πληκτρολόγησε έναν αριθμό, επίλεξε την τάξη στρογγυλοποίησης και παρατήρησε την κίνηση πάνω στην αριθμογραμμή!
                </p>
              </div>

              {/* PRESETS */}
              <div className="flex flex-wrap gap-2">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputValue(preset.val);
                      setRoundPlace(preset.place);
                    }}
                    className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs 2xl:text-sm font-bold px-3.5 py-2 rounded-xl border border-slate-200 transition shadow-sm"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MAIN INTERACTIVE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* LEFT: CONTROLS & PLACE SELECTOR (4 COLS) */}
              <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-5 2xl:p-6 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Πληκτρολόγησε Αριθμό:
                    </span>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                      placeholder="π.χ. 432,658"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      Επίλεξε Τάξη Στρογγυλοποίησης:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRoundPlace("hundreds")}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${
                          roundPlace === "hundreds" ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        💯 Εκατοντάδες
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoundPlace("tens")}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${
                          roundPlace === "tens" ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        📦 Δεκάδες
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoundPlace("units")}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${
                          roundPlace === "units" ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🎯 Μονάδες
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoundPlace("tenths")}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${
                          roundPlace === "tenths" ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🧪 Δέκατα (0,1)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoundPlace("hundredths")}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${
                          roundPlace === "hundredths" ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        🔍 Εκατοστά (0,01)
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoundPlace("thousandths")}
                        className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${
                          roundPlace === "thousandths" ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        📐 Χιλιοστά (0,001)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                  💡 Στρογγυλοποιούμε πάντα με βάση το <strong>αμέσως επόμενο ψηφίο στα δεξιά</strong>!
                </div>
              </div>

              {/* RIGHT: NUMBER LINE & VISUAL ANALYSIS (8 COLS) */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[460px]">
                
                <div className="w-full text-center mb-4">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    Οπτική Αριθμογραμμή Στρογγυλοποίησης:
                  </span>
                  <div className="text-lg md:text-xl font-bold text-slate-700 mt-1">
                    Πού βρίσκεται ο αριθμός <span className="font-mono font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">{inputValue || "0"}</span>;
                  </div>
                </div>

                {/* NUMBER LINE */}
                <div className="w-full max-w-xl mx-auto my-auto py-12 px-6">
                  <div className="h-3 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200 rounded-full relative shadow-inner">
                    
                    {/* Lower Bound */}
                    <div className="absolute left-0 -top-8 text-center -translate-x-1/2">
                      <span className="block font-mono font-black text-slate-700 text-xs md:text-sm">
                        {formatWithComma(lowerBound, precisionDigits)}
                      </span>
                    </div>
                    <div className="absolute left-0 top-4 text-center -translate-x-1/2 mt-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Κάτω Όριο</span>
                    </div>

                    {/* Upper Bound */}
                    <div className="absolute right-0 -top-8 text-center translate-x-1/2">
                      <span className="block font-mono font-black text-slate-700 text-xs md:text-sm">
                        {formatWithComma(upperBound, precisionDigits)}
                      </span>
                    </div>
                    <div className="absolute right-0 top-4 text-center translate-x-1/2 mt-1">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Πάνω Όριο</span>
                    </div>

                    {/* Midpoint (5 threshold) */}
                    <div className="absolute left-1/2 top-0 h-5 w-0.5 bg-slate-400 -translate-y-1">
                      <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">
                        {formatWithComma((lowerBound + upperBound) / 2, precisionDigits + 1)}
                      </span>
                    </div>

                    {/* Current Number Needle */}
                    <div 
                      className="absolute -top-5 -translate-x-1/2 transition-all duration-300 ease-out flex flex-col items-center z-10"
                      style={{ left: `${percentage}%` }}
                    >
                      <span className="bg-blue-600 text-white text-xs font-mono font-black px-2.5 py-1 rounded-lg shadow-md animate-bounce whitespace-nowrap">
                        {inputValue || "0"}
                      </span>
                      <div className="w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow mt-1"></div>
                    </div>

                  </div>

                  {/* Info Breakdown Banner */}
                  <div className="mt-16 flex justify-between items-center w-full bg-slate-50 rounded-2xl p-4 border border-slate-200 font-medium">
                    <div className="text-left space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-black block">Ψηφίο-Κλειδί:</span>
                      <span className={`text-base font-black font-mono ${isUp ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg' : 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg'}`}>
                        {isNaN(keyDigit) ? 0 : keyDigit}
                      </span>
                    </div>
                    
                    <div className="flex-1 flex flex-col items-center mx-4">
                      <span className={`text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {isUp ? "Στρογγυλοποίηση Πάνω ➔" : "⮨ Στρογγυλοποίηση Κάτω"}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 text-center">
                        Επειδή το αμέσως επόμενο ψηφίο είναι {isUp ? "≥ 5" : "< 5"}
                      </span>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[10px] uppercase text-slate-400 font-black block">Στρογγυλοποίηση στα/στις:</span>
                      <span className="text-xs font-black text-slate-700">
                        {placeName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FINAL RESULT BADGE */}
                <div className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-2xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                  <span className="text-xl">🎯</span>
                  <span className="text-xs md:text-sm font-sans uppercase tracking-wider">Τελική Τιμή:</span>
                  <span className="text-2xl bg-white/20 px-4 py-1 rounded-xl shadow-inner">
                    {formatWithComma(roundedValue, precisionDigits)}
                  </span>
                </div>

                <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 mt-6 text-center">
                  <span>🔍 Όταν στρογγυλοποιούμε, όλα τα ψηφία δεξιά από τη θέση στρογγυλοποίησης μηδενίζονται (ή διαγράφονται στα δεκαδικά)!</span>
                </div>
              </div>

            </div>
          </div>

          {/* 5. BOTTOM CALLOUT BANNER (INSIDE MAIN) */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 2xl:p-10 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-2xl 2xl:text-3xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base 2xl:text-lg">
                Κατανόησες τον κανόνα του ψηφίου-κλειδιού; Δοκίμασε τις διαδραστικές ασκήσεις για να εμπεδώσεις τις γνώσεις σου!
              </p>
            </div>
            <Link
              href="/st-dimotikou/12-stroggilopoiisi-ask"
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

// pages/st-dimotikou/12-stroggilopoiisi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function StroggilopoiisiPage() {
  const [inputValue, setInputValue] = useState('432,658');
  const [roundPlace, setRoundPlace] = useState('units'); // hundreds, tens, units, tenths, hundredths, thousandths

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
  let placeName = '';
  let keyDigit = 0;
  let precisionDigits = 0;

  switch (roundPlace) {
    case 'hundreds':
      placeName = 'Εκατοντάδες';
      lowerBound = Math.floor(num / 100) * 100;
      upperBound = lowerBound + 100;
      roundedValue = Math.round(num / 100) * 100;
      keyDigit = Math.floor((num % 100) / 10);
      precisionDigits = 0;
      break;
    case 'tens':
      placeName = 'Δεκάδες';
      lowerBound = Math.floor(num / 10) * 10;
      upperBound = lowerBound + 10;
      roundedValue = Math.round(num / 10) * 10;
      keyDigit = Math.floor(num % 10);
      precisionDigits = 0;
      break;
    case 'units':
      placeName = 'Μονάδες';
      lowerBound = Math.floor(num);
      upperBound = lowerBound + 1;
      roundedValue = Math.round(num);
      keyDigit = Math.floor((num * 10) % 10);
      precisionDigits = 0;
      break;
    case 'tenths':
      placeName = 'Δέκατα (0,1)';
      lowerBound = Math.floor(num * 10) / 10;
      upperBound = parseFloat((lowerBound + 0.1).toFixed(1));
      roundedValue = parseFloat((Math.round(num * 10) / 10).toFixed(1));
      keyDigit = Math.floor((num * 100) % 10);
      precisionDigits = 1;
      break;
    case 'hundredths':
      placeName = 'Εκατοστά (0,01)';
      lowerBound = Math.floor(num * 100) / 100;
      upperBound = parseFloat((lowerBound + 0.01).toFixed(2));
      roundedValue = parseFloat((Math.round(num * 100) / 100).toFixed(2));
      keyDigit = Math.floor((num * 1000) % 10);
      precisionDigits = 2;
      break;
    case 'thousandths':
      placeName = 'Χιλιοστά (0,001)';
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
    <Layout
      title="Στρογγυλοποίηση Φυσικών και Δεκαδικών Αριθμών - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε τον κανόνα του ψηφίου-κλειδιού για να στρογγυλοποιείς με ακρίβεια σε μονάδες, δεκάδες, εκατοντάδες, δέκατα, εκατοστά και χιλιοστά για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/12-stroggilopoiisi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 12 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Στρογγυλοποίηση Φυσικών &amp; Δεκαδικών Αριθμών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τον «κανόνα του ψηφίου-κλειδιού» για να στρογγυλοποιείς με ακρίβεια σε οποιαδήποτε τάξη: <strong>Μονάδες</strong>, <strong>Δεκάδες</strong>, <strong>Εκατοντάδες</strong> ή <strong>Δέκατα</strong>, <strong>Εκατοστά</strong> και <strong>Χιλιοστά</strong>!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Κανόνας Ψηφίου-Κλειδιού &amp; Διαδραστική Αριθμογραμμή</span>
            </div>
            <Link
              href="/st-dimotikou/12-stroggilopoiisi-ask"
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
              Οι Βασικοί Κανόνες Στρογγυλοποίησης
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς αποφασίζουμε αν θα στρογγυλοποιήσουμε προς τα πάνω ή προς τα κάτω.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΒΑΣΙΚΗ ΕΝΝΟΙΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Εκτίμηση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι η Στρογγυλοποίηση;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αντικαθιστούμε έναν αριθμό με έναν κοντινό του πιο «στρογγυλό», ώστε να κάνουμε γρήγορους υπολογισμούς και εκτιμήσεις στην καθημερινή ζωή.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>19,85 € ≈ <strong className="text-blue-700">20 €</strong></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Η στρογγυλοποίηση μας δίνει μια προσεγγιστική αλλά εύχρηστη τιμή.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΚΑΝΟΝΑΣ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-rose-600">0, 1, 2, 3, 4</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Στρογγυλοποίηση Κάτω
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν το αμέσως επόμενο ψηφίο (δεξιά από τη θέση στρογγυλοποίησης) είναι <strong>0, 1, 2, 3 ή 4</strong>, το ψηφίο της τάξης παραμένει <strong>ίδιο</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>43<strong className="text-rose-600">2</strong> ≈ <strong className="text-rose-700">430</strong> (δεκάδες)</p>
                </div>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-xs 2xl:text-sm text-rose-950 font-medium">
                📉 Ο αριθμός είναι πιο κοντά στο κάτω όριο της αριθμογραμμής.
              </div>
            </article>

            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΚΑΝΟΝΑΣ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">5, 6, 7, 8, 9</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Στρογγυλοποίηση Πάνω
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αν το αμέσως επόμενο ψηφίο (δεξιά από τη θέση στρογγυλοποίησης) είναι <strong>5, 6, 7, 8 ή 9</strong>, το ψηφίο της τάξης <strong>αυξάνεται κατά 1</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>43<strong className="text-emerald-600">7</strong> ≈ <strong className="text-emerald-700">440</strong> (δεκάδες)</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                📈 Ο αριθμός έχει φτάσει ή ξεπεράσει τη μέση, άρα πλησιάζει το πάνω όριο.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Στρογγυλοποίησης
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Πληκτρολόγησε έναν αριθμό, επίλεξε την τάξη στρογγυλοποίησης και παρατήρησε την κίνηση πάνω στην αριθμογραμμή!
              </p>
            </div>

            {/* PRESETS */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setInputValue(preset.val);
                    setRoundPlace(preset.place);
                  }}
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs sm:text-sm font-bold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID - 100% FLUID ΧΩΡΙΣ SCROLL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PLACE SELECTOR (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    Πληκτρολόγησε Αριθμό:
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-xl sm:text-2xl font-mono font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 432,658"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    Επίλεξε Τάξη Στρογγυλοποίησης:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRoundPlace('hundreds')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 ${
                        roundPlace === 'hundreds' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      💯 Εκατοντάδες
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('tens')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 ${
                        roundPlace === 'tens' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      📦 Δεκάδες
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('units')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 ${
                        roundPlace === 'units' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      🎯 Μονάδες
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('tenths')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 ${
                        roundPlace === 'tenths' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      🧪 Δέκατα (0,1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('hundredths')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 ${
                        roundPlace === 'hundredths' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      🔍 Εκατοστά (0,01)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoundPlace('thousandths')}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all text-left truncate touch-manipulation active:scale-95 ${
                        roundPlace === 'thousandths' ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105' : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      📐 Χιλιοστά (0,001)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Στρογγυλοποιούμε πάντα με βάση το <strong>αμέσως επόμενο ψηφίο στα δεξιά</strong>!
              </div>
            </div>

            {/* RIGHT: NUMBER LINE & VISUAL ANALYSIS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block">
                  Οπτική Αριθμογραμμή Στρογγυλοποίησης:
                </span>
                <div className="text-base sm:text-lg md:text-xl font-bold text-slate-700 mt-1">
                  Πού βρίσκεται ο αριθμός <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-xl border border-blue-200">{inputValue || '0'}</span>;
                </div>
              </div>

              {/* NUMBER LINE CONTAINER */}
              <div className="w-full max-w-xl mx-auto my-auto py-10 sm:py-12 px-4 sm:px-6">
                <div className="h-3 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200 rounded-full relative shadow-inner">
                  
                  {/* Lower Bound */}
                  <div className="absolute left-0 -top-8 text-center -translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-xs md:text-sm whitespace-nowrap">
                      {formatWithComma(lowerBound, precisionDigits)}
                    </span>
                  </div>
                  <div className="absolute left-0 top-4 text-center -translate-x-1/2 mt-1">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tight whitespace-nowrap">ΚΑΤΩ ΟΡΙΟ</span>
                  </div>

                  {/* Upper Bound */}
                  <div className="absolute right-0 -top-8 text-center translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-xs md:text-sm whitespace-nowrap">
                      {formatWithComma(upperBound, precisionDigits)}
                    </span>
                  </div>
                  <div className="absolute right-0 top-4 text-center translate-x-1/2 mt-1">
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-tight whitespace-nowrap">ΠΑΝΩ ΟΡΙΟ</span>
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
                    <span className="bg-blue-600 text-white text-[11px] sm:text-xs font-mono font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg shadow-md whitespace-nowrap">
                      {inputValue || '0'}
                    </span>
                    <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-blue-600 rounded-full border-2 border-white shadow mt-1"></div>
                  </div>

                </div>

                {/* Info Breakdown Banner */}
                <div className="mt-14 sm:mt-16 flex flex-col sm:flex-row justify-between items-center w-full bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200 font-medium gap-3 sm:gap-2">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-[10px] sm:text-xs uppercase text-slate-400 font-black block">ΨΗΦΙΟ-ΚΛΕΙΔΙ:</span>
                    <span className={`text-sm sm:text-base font-black font-mono ${isUp ? 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg' : 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg'}`}>
                      {isNaN(keyDigit) ? 0 : keyDigit}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center text-center">
                    <span className={`text-xs sm:text-sm font-black px-3 py-1 rounded-full uppercase tracking-wider ${isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {isUp ? 'ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΠΑΝΩ ➔' : '⮨ ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΚΑΤΩ'}
                    </span>
                    <span className="text-[10px] sm:text-xs text-slate-500 mt-1">
                      Επειδή το αμέσως επόμενο ψηφίο είναι {isUp ? '≥ 5' : '＜ 5'}
                    </span>
                  </div>

                  <div className="text-center sm:text-right space-y-1">
                    <span className="text-[10px] sm:text-xs uppercase text-slate-400 font-black block">ΣΤΡΟΓΓΥΛΟΠΟΙΗΣΗ ΣΤΑ/ΣΤΙΣ:</span>
                    <span className="text-xs sm:text-sm font-black text-slate-700">
                      {placeName}
                    </span>
                  </div>
                </div>
              </div>

              {/* FINAL RESULT BADGE */}
              <div className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 sm:p-4 rounded-2xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-2 sm:gap-3">
                <span className="text-xl">🎯</span>
                <span className="text-xs md:text-sm font-sans uppercase tracking-wider">ΤΕΛΙΚΗ ΤΙΜΗ:</span>
                <span className="text-xl sm:text-2xl bg-white/20 px-3 sm:px-4 py-1 rounded-xl shadow-inner">
                  {formatWithComma(roundedValue, precisionDigits)}
                </span>
              </div>

              <div className="w-full flex justify-center text-[11px] sm:text-xs font-bold text-slate-400 pt-4 border-t border-slate-100 mt-6 text-center">
                <span>🔍 Όταν στρογγυλοποιούμε, όλα τα ψηφία δεξιά από τη θέση στρογγυλοποίησης μηδενίζονται (ή παραλείπονται στα δεκαδικά)!</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Στρογγυλοποίηση!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες τον κανόνα του ψηφίου-κλειδιού; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/12-stroggilopoiisi-ask"
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

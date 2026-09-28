// pages/st-dimotikou/01-fysikoi.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState('478456014574');
  const [activeDigitIndex, setActiveDigitIndex] = useState(1);

  // Καθαρισμός και προετοιμασία 12ψηφίου αριθμού
  const cleanNumber = number.replace(/\D/g, '').slice(0, 12);
  const padded = cleanNumber.padStart(12, '0');
  const digits = padded.split('');

  // Ορισμός Περιόδων με πλήρη χρωματική ταυτότητα & hex για το γράφημα
  const periods = [
    { name: 'Δισεκατομμύρια', short: 'Δισ.', color: 'bg-purple-600', light: 'bg-purple-50/70', hex: '#9333ea', border: 'border-purple-200', text: 'text-purple-700' },
    { name: 'Εκατομμύρια', short: 'Εκατ.', color: 'bg-rose-600', light: 'bg-rose-50/70', hex: '#e11d48', border: 'border-rose-200', text: 'text-rose-700' },
    { name: 'Χιλιάδες', short: 'Χιλ.', color: 'bg-blue-600', light: 'bg-blue-50/70', hex: '#2563eb', border: 'border-blue-200', text: 'text-blue-700' },
    { name: 'Μονάδες', short: 'Μον.', color: 'bg-emerald-600', light: 'bg-emerald-50/70', hex: '#059669', border: 'border-emerald-200', text: 'text-emerald-700' },
  ];

  // Έτοιμα παραδείγματα από τον πραγματικό κόσμο
  const presets = [
    { label: '🇬🇷 Πληθυσμός Ελλάδας', value: '10482487' },
    { label: '🌕 Απόσταση Γης-Σελήνης (km)', value: '384400' },
    { label: '🌍 Ηλικία της Γης (έτη)', value: '4540000000' },
    { label: '⚡ Ταχύτητα Φωτός (m/s)', value: '299792458' },
  ];

  // Υπολογισμός λεκτικής διάσπασης σε περιόδους
  const getPeriodBreakdown = () => {
    if (!cleanNumber || cleanNumber === '0') return 'Μηδέν';
    const dis = parseInt(padded.slice(0, 3), 10);
    const ekat = parseInt(padded.slice(3, 6), 10);
    const xil = parseInt(padded.slice(6, 9), 10);
    const mon = parseInt(padded.slice(9, 12), 10);

    const parts = [];
    if (dis > 0) parts.push(`${dis.toLocaleString('el-GR')} Δισεκατομμύρια`);
    if (ekat > 0) parts.push(`${ekat.toLocaleString('el-GR')} Εκατομμύρια`);
    if (xil > 0) parts.push(`${xil.toLocaleString('el-GR')} Χιλιάδες`);
    if (mon > 0) parts.push(`${mon.toLocaleString('el-GR')} Μονάδες`);

    return parts.length > 0 ? parts.join(' • ') : '0';
  };

  const activeDigitsCount = digits.filter((d) => d !== '0').length;
  const firstNonZero = digits.findIndex((d) => d !== '0');

  // Υπολογισμός ύψους στήλης αποκλειστικά από την τιμή του ψηφίου (1-9)
  const calculateBarHeight = (digit, index) => {
    const val = parseInt(digit, 10);
    const isLeadingZero = digit === '0' && index < firstNonZero;
    if (val === 0 || isLeadingZero) return 0;
    return 12 + (val - 1) * 11;
  };

  return (
    <Layout
      title="Φυσικοί Αριθμοί και Αξία Θέσης - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε Περιόδους και Τάξεις για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/01-fysikoi-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 1 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Φυσικοί Αριθμοί &amp; Αξία Θέσης Ψηφίου
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε <strong>Περιόδους</strong> (τριάδες) και <strong>Τάξεις</strong>, και ανακάλυψε πώς η θέση κάθε ψηφίου καθορίζει τη συνολική του αξία!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Περίοδοι, Τάξεις &amp; Αναλυτική Μορφή Δυνάμεων του 10</span>
            </div>
            <Link
              href="/st-dimotikou/01-fysikoi-ask"
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
              Η δομή, η οργάνωση και η αξία θέσης των φυσικών αριθμών.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            {/* Βήμα 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Τι είναι οι Φυσικοί;
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Φυσικοί αριθμοί</strong> είναι οι αριθμοί <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-bold font-mono">0, 1, 2, 3...</code> που χρησιμοποιούμε για να μετράμε. Δεν έχουν τέλος (είναι άπειροι).
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-blue-900 block">📌 Βασικός Κανόνας:</span>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-normal">
                    Κάθε φυσικός αριθμός έχει έναν επόμενο (<span className="text-blue-600 font-bold">＋1</span>) και έναν προηγούμενο (<span className="text-blue-600 font-bold">－1</span>) εκτός από το 0.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Το σύνολο των φυσικών αριθμών συμβολίζεται με το γράμμα <strong>Ν</strong>.
              </div>
            </article>

            {/* Βήμα 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Οργάνωση</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Περίοδοι &amp; Τάξεις
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε από δεξιά προς τα αριστερά σε <strong>τριάδες (Περιόδους)</strong>.
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5">
                  <span className="font-bold text-indigo-900 block">🗂️ Οι 4 Βασικές Περίοδοι:</span>
                  <ul className="grid grid-cols-2 gap-1 font-semibold text-[11px] pt-1">
                    <li className="text-purple-700">• Δισεκατομμύρια</li>
                    <li className="text-rose-700">• Εκατομμύρια</li>
                    <li className="text-blue-700">• Χιλιάδες</li>
                    <li className="text-emerald-700">• Μονάδες</li>
                  </ul>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Κάθε περίοδος αποτελείται πάντα από 3 τάξεις: Μονάδες, Δεκάδες, Εκατοντάδες.
              </div>
            </article>

            {/* Βήμα 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αξία Θέσης</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Αξία Θέσης Ψηφίου
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Η αξία ενός ψηφίου <strong>εξαρτάται από τη θέση</strong> του. Κάθε θέση προς τα αριστερά έχει <strong>10 φορές μεγαλύτερη αξία</strong> από την προηγούμενη!
                </p>

                <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1">
                  <span className="font-bold text-amber-900 block">💡 Παράδειγμα:</span>
                  <p className="text-slate-600 text-[11px] sm:text-xs leading-normal">
                    Στο <strong className="text-amber-800">5.500</strong>, το 1ο πέντε αξίζει <strong className="text-slate-900 font-mono">5.000</strong> (Χιλιάδες), ενώ το 2ο αξίζει <strong className="text-slate-900 font-mono">500</strong> (Εκατοντάδες).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                🎯 Το δεκαδικό μας σύστημα αρίθμησης είναι <strong>θεσιακό</strong> σύστημα.
              </div>
            </article>
          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΞΙΑΣ ΘΕΣΗΣ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικός Αναλυτής Αξίας Θέσης &amp; Περιόδων
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
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
                  className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs 2xl:text-sm font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 transition shadow-sm touch-manipulation active:scale-95"
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
                  Πληκτρολόγησε Αριθμό (έως 12 ψηφία):
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={number}
                  onChange={(e) => {
                    const cleanInput = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                    setNumber(cleanInput);
                    setActiveDigitIndex(null);
                  }}
                  className="text-xl sm:text-2xl md:text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wider text-blue-600 font-mono"
                  placeholder="Γράψε έναν αριθμό..."
                />
                <p className="text-[11px] sm:text-xs text-slate-400 text-center font-medium">
                  💡 Πάτησε σε ένα ψηφίο του πίνακα για να δεις την αξία του!
                </p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl space-y-2 shadow-md flex flex-col justify-center">
                <span className="text-[11px] sm:text-xs font-black text-amber-400 tracking-wider block flex items-center gap-1.5 uppercase">
                  <span>🗣️</span> Πως διαβαζεται ανα περιοδο:
                </span>
                <p className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-100 leading-snug break-words">
                  {getPeriodBreakdown()}
                </p>
              </div>
            </div>

            {/* ROW 2: ΠΙΝΑΚΑΣ ΑΞΙΑΣ ΘΕΣΗΣ - 100% FLUID ΧΩΡΙΣ ΟΡΙΖΟΝΤΙΟ SCROLL ΣΤΑ ΚΙΝΗΤΑ */}
            <div className="bg-slate-50 border border-slate-200 p-2 sm:p-5 md:p-6 rounded-2xl space-y-4 sm:space-y-6">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs 2xl:text-sm font-black text-slate-600 uppercase tracking-wider">
                    🗂️ Πίνακας Αξίας Θέσης (12 Ψηφία)
                  </span>
                </div>

                {/* ΠΡΟΒΟΛΗ ΚΙΝΗΤΟΥ (<640px): 4 Compact Κάρτες Περιόδων (2x2) ώστε να μην υπάρχει ποτέ scroll */}
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:hidden">
                  {periods.map((p, pIdx) => {
                    const pDigits = [digits[pIdx * 3], digits[pIdx * 3 + 1], digits[pIdx * 3 + 2]];
                    return (
                      <div key={`m-period-${pIdx}`} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                        <div className={`${p.color} text-white text-center font-black text-[11px] py-1`}>
                          {p.name}
                        </div>
                        <div className="grid grid-cols-3 text-[9px] font-black text-slate-400 text-center bg-slate-50 border-b py-0.5">
                          <div>Ε</div>
                          <div>Δ</div>
                          <div>Μ</div>
                        </div>
                        <div className="grid grid-cols-3 p-1 gap-1 text-center">
                          {pDigits.map((d, dIdx) => {
                            const globalIdx = pIdx * 3 + dIdx;
                            const isLeadingZero = d === '0' && globalIdx < firstNonZero;
                            const isSelected = activeDigitIndex === globalIdx;

                            return (
                              <button
                                key={`m-d-${globalIdx}`}
                                type="button"
                                onClick={() => setActiveDigitIndex(globalIdx)}
                                className={`py-2 text-base font-black rounded-lg font-mono transition-colors border ${
                                  isSelected
                                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-sm'
                                    : 'bg-slate-50 border-transparent hover:bg-amber-50'
                                } ${isLeadingZero && !isSelected ? 'text-slate-300' : isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ΠΡΟΒΟΛΗ DESKTOP/TABLET (>=640px): Ο κλασικός ενιαίος πίνακας 12 στηλών */}
                <div className="hidden sm:block w-full border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
                  {/* PERIODS HEADER */}
                  <div className="grid grid-cols-4 text-white text-center font-black text-xs sm:text-sm tracking-wider">
                    {periods.map((p, i) => (
                      <div key={i} className={`${p.color} py-2.5 sm:py-3 border-r border-white/20 last:border-0`}>
                        <span>{p.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* CLASSES HEADER */}
                  <div className="grid grid-cols-12 text-[10px] sm:text-xs font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
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
                            className={`w-full py-3 sm:py-4 text-lg sm:text-2xl font-black rounded-xl transition-colors duration-150 focus:outline-none font-mono flex items-center justify-center border-2 box-border touch-manipulation
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

              {/* ΠΛΗΡΗΣ ΑΝΑΛΥΤΙΚΗ ΜΟΡΦΗ */}
              <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl font-mono text-xs sm:text-sm space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-wider block font-sans">
                    🧬 Πλήρης Αναλυτική Μορφή (Δυνάμεις του 10)
                  </span>
                  <span className="text-[10px] sm:text-xs font-sans font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Πλήρης Εμφάνιση
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
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
                        className={`flex flex-wrap sm:flex-nowrap items-center justify-between p-2 sm:p-2.5 rounded-xl border-2 box-border transition-colors cursor-pointer gap-1 sm:gap-2 touch-manipulation ${
                          isSelected 
                            ? 'bg-amber-50 border-amber-400 shadow-sm' 
                            : 'bg-slate-50/70 border-transparent hover:bg-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap text-xs sm:text-sm">
                          <span className="text-emerald-600 font-black">{digit}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-bold text-slate-800 break-all">{multiplier}</span>
                        </div>
                        <div className="sm:text-right text-left">
                          <span className="text-slate-500 font-bold text-[11px] sm:text-xs block break-all">
                            ＝ {totalVal}
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

            {/* ROW 3: ΟΠΤΙΚΟ ΓΡΑΦΗΜΑ ΡΑΒΔΩΝ - 100% FLUID ΧΩΡΙΣ ΟΡΙΖΟΝΤΙΟ SCROLL */}
            <div className="bg-white border border-slate-200 p-3 sm:p-5 rounded-2xl space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs 2xl:text-sm font-black text-slate-700 flex items-center gap-1.5 uppercase">
                  📊 Ύψος Ψηφίου (Στατιστική Κατανομή)
                </span>
                <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                  {activeDigitsCount} ενεργά ψηφία
                </span>
              </div>

              <div className="w-full bg-slate-50 rounded-xl border border-slate-100 pt-8 sm:pt-10 pb-3 px-1 sm:px-3">
                <div className="flex items-end justify-between gap-0.5 sm:gap-1.5 h-44 sm:h-52 border-b-2 border-slate-200 pb-0">
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
                        className={`flex-1 flex flex-col items-center justify-end h-full relative touch-manipulation ${hasValue ? 'cursor-pointer group' : 'cursor-default'}`}
                      >
                        {/* TOOLTIP ON HOVER / SELECTION */}
                        {isSelected && hasValue && (
                          <div className="absolute -top-10 bg-slate-900 text-white text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-30 animate-bounce">
                            {(val * Math.pow(10, power)).toLocaleString('el-GR')}
                          </div>
                        )}

                        {/* VALUE LABEL */}
                        {hasValue ? (
                          <span className="text-[10px] sm:text-xs font-black text-slate-700 mb-1">
                            {digit}
                          </span>
                        ) : (
                          <div className="h-4 mb-1"></div>
                        )}

                        {/* THE BAR */}
                        <div className="w-full h-28 sm:h-36 flex items-end justify-center">
                          {hasValue && (
                            <div
                              style={{ 
                                height: `${barHeightPercent}%`,
                                backgroundColor: periods[periodIdx].hex 
                              }}
                              className={`w-full max-w-[28px] rounded-t-lg transition-all duration-200 ${isSelected ? 'ring-2 sm:ring-4 ring-amber-400 brightness-110 shadow-md' : 'opacity-90 hover:opacity-100'}`}
                            />
                          )}
                        </div>

                        {/* X-AXIS LABEL */}
                        <span className="text-[7.5px] sm:text-[9px] font-mono font-bold text-slate-400 mt-1 leading-none">
                          10^{power}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 font-semibold px-1 pt-1">
                <span>⬅️ Μεγαλύτερη Αξία (Δισ.)</span>
                <span>Μικρότερη Αξία (Μον.) ➡️</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στους Φυσικούς Αριθμούς!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Κατανόησες την αξία θέσης των φυσικών αριθμών; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/01-fysikoi-ask"
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

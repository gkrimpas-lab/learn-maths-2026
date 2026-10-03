// pages/st-dimotikou/22-dinameis-deka.js
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const EXPONENTS_UNICODE = {
  0: '⁰',
  1: '¹',
  2: '²',
  3: '³',
  4: '⁴',
  5: '⁵',
  6: '⁶',
  7: '⁷',
  8: '⁸',
  9: '⁹',
  10: '¹⁰'
};

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNumber(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

export default function DinameisDekaPage() {
  const [exponent, setExponent] = useState(2);
  const canvasRef = useRef(null);

  const activeExponent = exponent === '' ? 0 : Number(exponent);
  const result = Math.pow(10, activeExponent);

  // Σχεδιαση των κουκιδων στο Canvas αναλογα με τον εκθετη (εως 10^10)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    // Σκουρο background (διαστημα)
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Χρωμα τελιτσας (neon sky blue)
    ctx.fillStyle = '#38bdf8';

    let lcgSeed = 42;
    const pseudoRandom = () => {
      lcgSeed = (lcgSeed * 1664525 + 1013904223) % 4294967296;
      return lcgSeed / 4294967296;
    };

    if (activeExponent === 0) {
      // 10^0 = 1 τελιτσα στο κεντρο
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (activeExponent === 1) {
      // 10^1 = 10 τελιτσες σε σειρα
      const dotCount = 10;
      const spacing = 20;
      const startX = (width - (dotCount - 1) * spacing) / 2;
      for (let i = 0; i < dotCount; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * spacing, height / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (activeExponent === 2) {
      // 10^2 = 100 τελιτσες σε πλεγμα 10x10
      const rows = 10;
      const cols = 10;
      const spacingX = 16;
      const spacingY = 16;
      const startX = (width - (cols - 1) * spacingX) / 2;
      const startY = (height - (rows - 1) * spacingY) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(startX + c * spacingX, startY + r * spacingY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (activeExponent === 3) {
      // 10^3 = 1.000 τελιτσες σε πλεγμα 50x20
      const cols = 50;
      const rows = 20;
      const spacingX = 6;
      const spacingY = 8;
      const startX = (width - (cols - 1) * spacingX) / 2;
      const startY = (height - (rows - 1) * spacingY) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(startX + c * spacingX, startY + r * spacingY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (activeExponent === 4) {
      // 10^4 = 10.000 τελιτσες
      const margin = 15;
      for (let i = 0; i < 10000; i++) {
        const x = margin + pseudoRandom() * (width - margin * 2);
        const y = margin + pseudoRandom() * (height - margin * 2);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Για εκθετες 5 εως 10
      let dotLimit = 25000; // 10^5
      if (activeExponent === 6) dotLimit = 45000; // 10^6
      if (activeExponent === 7) dotLimit = 65000; // 10^7
      if (activeExponent === 8) dotLimit = 85000; // 10^8
      if (activeExponent === 9) dotLimit = 105000; // 10^9
      if (activeExponent === 10) dotLimit = 125000; // 10^10

      ctx.fillStyle =
        activeExponent >= 8 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(56, 189, 248, 0.9)';

      const margin = 8;
      for (let i = 0; i < dotLimit; i++) {
        const x = margin + pseudoRandom() * (width - margin * 2);
        const y = margin + pseudoRandom() * (height - margin * 2);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [activeExponent]);

  const getMultiplicationSteps = () => {
    if (activeExponent === 0) return '1 (εξ ορισμού)';
    if (activeExponent === 1) return '10';
    return Array(activeExponent).fill(10).join(' · ');
  };

  const getFriendlyName = () => {
    if (result === 1) return 'Μία Μονάδα';
    if (result === 10) return 'Δέκα';
    if (result === 100) return 'Εκατό';
    if (result === 1000) return 'Χίλια';
    if (result === 10000) return 'Δέκα Χιλιάδες';
    if (result === 100000) return 'Εκατό Χιλιάδες';
    if (result === 1000000) return 'Ένα Εκατομμύριο';
    if (result === 10000000) return 'Δέκα Εκατομμύρια';
    if (result === 100000000) return 'Εκατό Εκατομμύρια';
    if (result === 1000000000) return 'Ένα Δισεκατομμύριο';
    if (result === 10000000000) return 'Δέκα Δισεκατομμύρια';
    return '';
  };

  return (
    <Layout
      title="Οι Δυνάμεις του 10 και Μεγάλοι Αριθμοί - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε τον χρυσό κανόνα των μηδενικών! Γράψε και υπολόγισε πολύ μεγάλους αριθμούς στο δευτερόλεπτο χρησιμοποιώντας δυνάμεις με βάση το 10 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/22-dinameis-deka-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 22 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Οι Δυνάμεις του 10 και Σύντομη Γραφή Μεγάλων Αριθμών
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τον χρυσό κανόνα των μηδενικών! Γράψε και υπολόγισε <strong>πολύ μεγάλους αριθμούς</strong> στο δευτερόλεπτο χρησιμοποιώντας δυνάμεις με βάση το 10!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Οπτικοποίηση Κουκκίδων &amp; Σύντομη Γραφή Εκατομμυρίων</span>
            </div>
            <Link
              href="/st-dimotikou/22-dinameis-deka-ask"
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
              Βασικές Έννοιες &amp; Κανόνας των Δυνάμεων του 10
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς οι δυνάμεις του 10 απλοποιούν τη γραφή και την ανάγνωση των μεγάλων αριθμών.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    Ο ΧΡΥΣΟΣ ΚΑΝΟΝΑΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πλήθος Μηδενικών</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Κανόνας των Μηδενικών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Κάθε δύναμη του 10 ισούται με το <strong>1</strong> ακολουθούμενο από <strong>τόσα μηδενικά όσα δείχνει ο εκθέτης</strong>!
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>10³ ＝ <strong className="text-sky-700">1.000</strong>&nbsp;&nbsp;<span className="text-slate-500 font-sans font-normal text-xs">(3 μηδενικά)</span></p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Δεν χρειάζεται να κάνεις πολλαπλασιασμό! Απλώς κοιτάς τον εκθέτη και γράφεις τα ανάλογα μηδενικά.
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">Τάξεις Μεγέθους</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Εκατομμύρια &amp; Δισεκατομμύρια
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  • <strong>10⁶:</strong> 1.000.000 (Ένα Εκατομμύριο － 6 μηδενικά).<br />
                  • <strong>10⁹:</strong> 1.000.000.000 (Ένα Δισεκατομμύριο － 9 μηδενικά).
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold space-y-1">
                  <p>10⁶ ＝ <strong className="text-indigo-700">1.000.000</strong></p>
                  <p>10⁹ ＝ <strong className="text-indigo-700">1.000.000.000</strong></p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Κάθε 3 μηδενικά αλλάζουμε τάξη μεγέθους: 10³ (χιλιάδες), 10⁶ (εκατομμύρια), 10⁹ (δισεκατομμύρια).
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    ΕΙΔΙΚΟΙ ΚΑΝΟΝΕΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-cyan-700">Εκθέτες 0 &amp; 1</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ειδικές Περιπτώσεις SOS
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  • <strong>10⁰ ＝ 1:</strong> Το 1 με 0 μηδενικά (1 ακέραιη μονάδα).<br />
                  • <strong>10¹ ＝ 10:</strong> Το 1 με 1 μηδενικό (1 δεκάδα).
                </p>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center flex flex-wrap justify-center gap-2 font-bold">
                  <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-slate-800">10⁰ ＝ 1</span>
                  <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-cyan-700">10¹ ＝ 10</span>
                </div>
              </div>

              <div className="p-3 bg-cyan-50 rounded-2xl border border-cyan-200 text-xs 2xl:text-sm text-cyan-950 font-medium">
                🎯 Ο εκθέτης 0 δίνει πάντα αποτέλεσμα 1, γιατί δεν προσθέτουμε κανένα μηδενικό μετά το 1!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
                <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
              </div>
              <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
                Διαδραστικό Εργαστήριο Δυνάμεων του 10
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
                Σύρε τον κέρσορα ή πάτησε τα κουμπιά για να δεις τη δύναμη, την ανάλυση σε γινόμενο και το οπτικό γέμισμα του χώρου!
              </p>
            </div>
          </div>

          {/* MAIN INTERACTIVE GRID (3 COLS LEFT / 9 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (3 COLS) */}
            <div className="lg:col-span-3 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* SLIDER ΓΙΑ ΤΟΝ ΕΚΘΕΤΗ */}
                <div className="space-y-2">
                  <span className="text-xs 2xl:text-sm font-black text-slate-700 uppercase tracking-wider block">
                    ΕΠΙΛΕΞΕ ΕΚΘΕΤΗ (0 － 10):
                  </span>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase">Εκθετης:</label>
                      <span className="text-lg font-black text-blue-600 font-mono">
                        10<sup>{activeExponent}</sup>
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={activeExponent}
                      onChange={(e) => setExponent(e.target.value)}
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none touch-manipulation"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                      <span>10⁰</span>
                      <span>10²</span>
                      <span>10⁴</span>
                      <span>10⁶</span>
                      <span>10⁸</span>
                      <span>10¹⁰</span>
                    </div>
                  </div>
                </div>

                {/* PRESET BUTTONS (GRID) */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] sm:text-xs font-black uppercase text-slate-400 tracking-wider block">
                    ΓΡΗΓΟΡΗ ΕΠΙΛΟΓΗ:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setExponent(num)}
                        className={`py-2 rounded-xl border font-mono font-bold text-xs transition-all text-center touch-manipulation active:scale-95 ${
                          activeExponent === num
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs'
                        }`}
                      >
                        10<sup>{num}</sup>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Ο εκθέτης δείχνει ακριβώς <strong>πόσα μηδενικά</strong> θα γράψεις μετά το 1!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. HEADER STATUS */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-3 shadow-xs">
                <div className="text-left font-mono">
                  <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase">Δυναμη:</span>
                  <div className="inline-flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-blue-600">10</span>
                    <sup className="text-lg sm:text-xl font-black text-indigo-600 ml-0.5">
                      {EXPONENTS_UNICODE[activeExponent] || `^${activeExponent}`}
                    </sup>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Λεκτικη Ονομασια:</span>
                  <span className="text-base sm:text-lg font-black text-slate-800">{getFriendlyName()}</span>
                </div>
              </div>

              {/* 2. CANVAS & ΟΠΤΙΚΟΠΟΙΗΣΗ ΧΩΡΟΥ */}
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center w-full px-1">
                  <span className="text-xs 2xl:text-sm font-bold text-slate-500 uppercase tracking-wider">
                    🌌 ΟΠΤΙΚΟ ΓΕΜΙΣΜΑ ΧΩΡΟΥ:
                  </span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-mono border border-blue-200 shadow-xs">
                    {formatNumber(result)} {result === 1 ? 'κουκκίδα' : 'κουκκίδες'}
                  </span>
                </div>

                <div className="w-full bg-slate-950 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-2xl p-1">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-[220px] sm:h-[260px] block rounded-xl"
                  />
                </div>

                {/* Μπάρα Πυκνότητας */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>ΠΟΣΟΣΤΟ ΚΑΛΥΨΗΣ ΧΩΡΟΥ</span>
                    <span className="font-mono">{activeExponent * 10}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-400 to-blue-600 h-full transition-all duration-300"
                      style={{ width: `${activeExponent * 10}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-400 italic text-center pt-1">
                  {activeExponent === 0 && 'Μόλις 1 κουκκίδα. Ο χώρος είναι σχεδόν άδειος!'}
                  {activeExponent === 1 && '10 κουκκίδες. Μια απλή γραμμή.'}
                  {activeExponent === 2 && '100 κουκκίδες. Το πλέγμα αρχίζει να σχηματίζεται.'}
                  {activeExponent === 3 && '1.000 κουκκίδες. Ο χώρος πυκνώνει!'}
                  {activeExponent === 4 && '10.000 κουκκίδες. Σαν ένα φωτεινό σύννεφο.'}
                  {activeExponent === 5 && '100.000 κουκκίδες. Η κοσμική σκόνη καταλαμβάνει τον χώρο.'}
                  {activeExponent === 6 && '1.000.000 (1 εκατομμύριο) κουκκίδες! Ο χώρος γεμίζει εντυπωσιακά.'}
                  {activeExponent >= 7 &&
                    activeExponent <= 9 &&
                    `Απίστευτη πυκνότητα! ${formatNumber(result)} κουκκίδες γεμίζουν σχεδόν όλο το πλαίσιο.`}
                  {activeExponent === 10 &&
                    'Φανταστικό! 10.000.000.000 (10 δισεκατομμύρια) κουκκίδες καλύπτουν πλήρως ολόκληρο το σύμπαν του πλαισίου!'}
                </p>
              </div>

              {/* 3. ΑΝΑΛΥΣΗ ΩΣ ΓΙΝΟΜΕΝΟ */}
              <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-1.5 font-mono shadow-md">
                <div className="text-xs font-sans text-slate-400 font-bold uppercase tracking-wider">
                  📝 ΑΝΑΛΥΣΗ ΩΣ ΓΙΝΟΜΕΝΟ:
                </div>
                <div className="text-xs sm:text-base font-black text-slate-100 flex items-center gap-2 flex-wrap max-h-[100px] overflow-y-auto pr-1">
                  <span>10<sup>{activeExponent}</sup> ＝</span>
                  <span>{getMultiplicationSteps()}</span>
                  <span>＝</span>
                  <span className="text-amber-400 font-black">{formatNumber(result)}</span>
                </div>
              </div>

              {/* 4. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  ΤΕΛΙΚΗ ΤΙΜΗ ΚΑΙ ΜΗΔΕΝΙΚΑ:
                </span>
                <div className="text-base sm:text-xl md:text-2xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>10<sup>{activeExponent}</sup> ＝</span>
                  <span className="text-amber-300 text-xl sm:text-2xl md:text-3xl font-black bg-white/10 px-3 py-0.5 rounded-xl shadow-xs inline-block">
                    {formatNumber(result)}
                  </span>
                  <span className="text-xs sm:text-sm font-sans font-normal text-blue-100 block sm:inline sm:ml-2">
                    ({activeExponent} {activeExponent === 1 ? 'μηδενικό' : 'μηδενικά'})
                  </span>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 4. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στις Δυνάμεις του 10!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες πώς λειτουργεί ο κανόνας των μηδενικών; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/22-dinameis-deka-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

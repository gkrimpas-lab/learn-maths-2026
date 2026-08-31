import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const exponentsUnicode = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', 10: '¹⁰' };

export default function DinameisDekaPage() {
  const [exponent, setExponent] = useState(2);
  const canvasRef = useRef(null);

  const activeExponent = exponent === '' ? 0 : Number(exponent);
  const result = Math.pow(10, activeExponent);

  // Σχεδιαση των κουκιδων (τελιτσες) στο Canvas αναλογα με τον εκθετη (εως 10^10)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Καθαρισμος και ρυθμιση διαστασεων με βαση το DPI για καθαρη εικονα
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

    // Ψευδοτυχαια γεννητρια με σταθερο seed για να μην τρεμοπαιζουν οι κουκκιδες
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
    } 
    else if (activeExponent === 1) {
      // 10^1 = 10 τελιτσες σε σειρα
      const dotCount = 10;
      const spacing = 20;
      const startX = (width - (dotCount - 1) * spacing) / 2;
      for (let i = 0; i < dotCount; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * spacing, height / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } 
    else if (activeExponent === 2) {
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
    } 
    else if (activeExponent === 3) {
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
    } 
    else if (activeExponent === 4) {
      // 10^4 = 10.000 τελιτσες
      const margin = 15;
      for (let i = 0; i < 10000; i++) {
        const x = margin + pseudoRandom() * (width - margin * 2);
        const y = margin + pseudoRandom() * (height - margin * 2);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } 
    else {
      // Για εκθετες 5 εως 10
      let dotLimit = 25000; // 10^5
      if (activeExponent === 6) dotLimit = 45000;   // 10^6
      if (activeExponent === 7) dotLimit = 65000;   // 10^7
      if (activeExponent === 8) dotLimit = 85000;   // 10^8
      if (activeExponent === 9) dotLimit = 105000;  // 10^9
      if (activeExponent === 10) dotLimit = 125000; // 10^10

      ctx.fillStyle = activeExponent >= 8 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(56, 189, 248, 0.9)';
      
      const margin = 8;
      for (let i = 0; i < dotLimit; i++) {
        const x = margin + pseudoRandom() * (width - margin * 2);
        const y = margin + pseudoRandom() * (height - margin * 2);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [activeExponent]);

  const getMultiplicationSteps = () => {
    if (activeExponent === 0) return "1 (εξ ορισμού)";
    if (activeExponent === 1) return "10";
    return Array(activeExponent).fill(10).join(" × ");
  };

  const getFriendlyName = () => {
    if (result === 1) return "Μία Μονάδα";
    if (result === 10) return "Δέκα";
    if (result === 100) return "Εκατό";
    if (result === 1000) return "Χίλια";
    if (result === 10000) return "Δέκα Χιλιάδες";
    if (result === 100000) return "Εκατό Χιλιάδες";
    if (result === 1000000) return "Ένα Εκατομμύριο";
    if (result === 10000000) return "Δέκα Εκατομμύρια";
    if (result === 100000000) return "Εκατό Εκατομμύρια";
    if (result === 1000000000) return "Ένα Δισεκατομμύριο";
    if (result === 10000000000) return "Δέκα Δισεκατομμύρια";
    return "";
  };

  return (
    <Layout
      title="🔟 22. Οι Δυνάμεις του 10 και Σύντομη Γραφή Μεγάλων Αριθμών - LearnMaths.gr"
      description="Μάθε τον χρυσό κανόνα των μηδενικών! Γράψε και υπολόγισε πολύ μεγάλους αριθμούς στο δευτερόλεπτο χρησιμοποιώντας δυνάμεις με βάση το 10 για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/22-dinameis-deka-ask"
          className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>🎯</span>
          <span>Ασκήσεις</span>
        </Link>
      }
    >
      <div className="space-y-8 md:space-y-10 py-6 md:py-10">

        {/* HERO BANNER WITH PROMO CALLOUT CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/20 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                  🎓 ΣΤ' Δημοτικου
                </span>
                <span className="bg-amber-400 text-slate-900 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Ενοτητα 22
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                22. Οι Δυνάμεις του 10 και Σύντομη Γραφή Μεγάλων Αριθμών
              </h1>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed max-w-3xl">
                Μάθε τον χρυσό κανόνα των μηδενικών! Γράψε και υπολόγισε <strong>πολύ μεγάλους αριθμούς</strong> στο δευτερόλεπτο χρησιμοποιώντας δυνάμεις με βάση το 10!
              </p>
            </div>

            {/* CALLOUT PROMO CARD */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex flex-col items-center text-center space-y-3 shadow-inner">
              <span className="text-3xl">🚀</span>
              <h3 className="font-black text-lg text-amber-300">Ώρα για Εξάσκηση!</h3>
              <p className="text-xs text-blue-50">Δοκίμασε τις 8 διαδραστικές ασκήσεις στις δυνάμεις του 10 με αυτόματη βαθμολόγηση!</p>
              <Link
                href="/st-dimotikou/22-dinameis-deka-ask"
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
              <h3 className="text-lg font-black text-slate-900">Ο Χρυσός Κανόνας</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Κάθε δύναμη του 10 ισούται με το <strong>1</strong> ακολουθούμενο από <strong>τόσα μηδενικά όσα δείχνει ο εκθέτης</strong>!
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-blue-100 text-xs text-slate-700 font-mono text-center flex flex-wrap items-center justify-center gap-2 font-bold">
              <span className="bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                10³ ＝ <strong className="text-blue-700 font-black">1.000</strong> (3 μηδενικά)
              </span>
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                2
              </div>
              <h3 className="text-lg font-black text-slate-900">Εκατομμύρια & Δισεκατομμύρια</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                • <strong>10⁶:</strong> 1.000.000 (Ένα Εκατομμύριο - 6 μηδενικά)<br/>
                • <strong>10⁹:</strong> 1.000.000.000 (Ένα Δισεκατομμύριο - 9 μηδενικά)
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-100 text-xs text-slate-700 font-mono text-center flex flex-wrap items-center justify-center gap-2 font-bold">
              <span className="bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-xl text-indigo-900">
                10⁶ ＝ <strong className="text-indigo-700 font-black">1.000.000</strong>
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-100 p-6 rounded-3xl space-y-4 flex flex-col justify-between shadow-sm">
            <div className="space-y-2.5">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-sm">
                3
              </div>
              <h3 className="text-lg font-black text-slate-900">Ειδικές Περιπτώσεις SOS</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                • <strong>10⁰ ＝ 1:</strong> Το 1 χωρίς κανένα μηδενικό (1 μονάδα).<br/>
                • <strong>10¹ ＝ 10:</strong> Το 1 με 1 μηδενικό (1 δεκάδα).
              </p>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-emerald-100 text-xs text-slate-700 font-mono text-center flex flex-wrap justify-center gap-2 font-bold">
              <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">10⁰ ＝ 1</span>
              <span className="bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">10¹ ＝ 10</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE PLAYGROUND */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🕹️</span> Διαδραστικό Εργαστήριο Δυνάμεων του 10
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm">
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
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                    Επιλεξε Εκθετη (0 - 10):
                  </span>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase">Εκθετης:</span>
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
                      className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
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
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Γρηγορη Επιλογη:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button 
                        key={num}
                        type="button"
                        onClick={() => setExponent(num)}
                        className={`py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                          activeExponent === num 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
                        }`}
                      >
                        10<sup>{num}</sup>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <div className="text-[11px] text-slate-500 bg-white p-3 rounded-xl border border-slate-200">
                💡 Ο εκθέτης δείχνει ακριβώς <strong>πόσα μηδενικά</strong> θα γράψεις μετά το 1!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION (9 COLS) */}
            <div className="lg:col-span-9 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[460px] sm:min-h-[520px] space-y-6">
              
              {/* 1. HEADER STATUS */}
              <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-200 gap-3 shadow-2xs">
                <div className="text-left font-mono">
                  <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase">Δυναμη:</span>
                  <div className="inline-flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-blue-600">10</span>
                    <sup className="text-lg sm:text-xl font-black text-indigo-600 ml-0.5">{exponentsUnicode[activeExponent] || `^${activeExponent}`}</sup>
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
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">🌌 Οπτικο Γεμισμα Χωρου:</span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-mono border border-blue-200 shadow-2xs">
                    {result.toLocaleString('el-GR')} {result === 1 ? 'κουκκίδα' : 'κουκκίδες'}
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
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
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

                <p className="text-[11px] text-slate-400 italic text-center pt-1">
                  {activeExponent === 0 && "Μόλις 1 κουκκίδα. Ο χώρος είναι άδειος!"}
                  {activeExponent === 1 && "10 κουκκίδες. Μια απλή γραμμή."}
                  {activeExponent === 2 && "100 κουκκίδες. Το πλέγμα αρχίζει να σχηματίζεται."}
                  {activeExponent === 3 && "1.000 κουκκίδες. Ο χώρος πυκνώνει!"}
                  {activeExponent === 4 && "10.000 κουκκίδες. Σαν ένα όμορφο σύννεφο."}
                  {activeExponent === 5 && "100.000 κουκκίδες. Η κοσμική σκόνη αρχίζει να καταλαμβάνει τον χώρο."}
                  {activeExponent === 6 && "1.000.000 (1 εκατομμύριο) κουκκίδες! Ο χώρος γεμίζει εντυπωσιακά."}
                  {activeExponent >= 7 && activeExponent <= 9 && `Απίστευτη πυκνότητα! ${result.toLocaleString('el-GR')} κουκκίδες γεμίζουν σχεδόν όλο το πλαίσιο.`}
                  {activeExponent === 10 && "Φανταστικό! 10.000.000.000 (10 δισεκατομμύρια) κουκκίδες καλύπτουν πλήρως ολόκληρο το σύμπαν του πλαισίου!"}
                </p>
              </div>

              {/* 3. ΑΝΑΛΥΣΗ ΩΣ ΓΙΝΟΜΕΝΟ */}
              <div className="bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 space-y-1.5 font-mono">
                <div className="text-xs font-sans text-slate-400 font-bold uppercase tracking-wider">
                  📝 Αναλυση ως Γινομενο:
                </div>
                <div className="text-xs sm:text-base font-black text-slate-100 flex items-center gap-2 flex-wrap max-h-[100px] overflow-y-auto pr-1">
                  10<sup>{activeExponent}</sup> ＝ {getMultiplicationSteps()} ＝ <span className="text-amber-400 font-black">{result.toLocaleString('el-GR')}</span>
                </div>
              </div>

              {/* 4. FINAL RESULT SUMMARY BANNER */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 text-white p-4 sm:p-5 rounded-2xl text-center shadow-lg font-mono space-y-1">
                <span className="text-xs font-sans uppercase tracking-wider block text-blue-200 font-bold">
                  Τελικη Τιμη και Μηδενικα:
                </span>
                <div className="text-base sm:text-xl md:text-2xl font-black tracking-wide flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                  <span>10<sup>{activeExponent}</sup> ＝</span>
                  <span className="text-amber-300 text-xl sm:text-2xl md:text-3xl font-black bg-white/10 px-3 py-0.5 rounded-xl shadow-xs inline-block">
                    {result.toLocaleString('el-GR')}
                  </span>
                  <span className="text-xs font-sans font-normal text-blue-100 block sm:inline sm:ml-2">
                    ({activeExponent} {activeExponent === 1 ? 'μηδενικό' : 'μηδενικά'})
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* BOTTOM CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-lg text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-gray-800 text-sm md:text-base">
              Έμαθες πώς λειτουργούν οι δυνάμεις του 10; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/st-dimotikou/22-dinameis-deka-ask"
            className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-xl transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>

      </div>
    </Layout>
  );
}

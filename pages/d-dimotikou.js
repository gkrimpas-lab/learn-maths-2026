import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ============================================================================
// ΚΕΝΤΡΙΚΕΣ ΡΥΘΜΙΣΕΙΣ ΕΦΑΡΜΟΓΗΣ (CONFIG)
// ============================================================================
const CONFIG = {
  largeNumbers: {
    maxDisksPerColumn: 9, 
    initialValues: {
      EX: 1, DX: 3, X: 5, E: 4, D: 2, M: 7  
    }
  }
};

// ΣΥΝΑΡΤΗΣΗ ΜΕΤΑΤΡΟΠΗΣ ΑΡΙΘΜΟΥ ΣΕ ΕΛΛΗΝΙΚΑ ΛΕΚΤΙΚΑ
function numberToGreekWords(num) {
  if (num === 0) return 'Μηδέν';
  const units = ['', 'ένα', 'δύο', 'τρία', 'τέσσερα', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const tens = ['', 'δέκα', 'είκοσι', 'τριάντα', 'σαράντα', 'πενήντα', 'εξήντα', 'εβδομήντα', 'ογδόντα', 'εννενήντα'];
  const hundreds = ['', 'εκατό', 'διακόσια', 'τρακόσια', 'τετρακόσια', 'πεντακόσια', 'εξακόσια', 'επτακόσια', 'οκτακόσια', 'εννιακόσια'];
  const unitsFem = ['', 'μία', 'δύο', 'τρεις', 'τέσσερις', 'πέντε', 'έξι', 'επτά', 'οκτώ', 'εννέα'];
  const hundredsFem = ['', 'εκατό', 'διακόσιες', 'τριακόσιες', 'τετρακόσιες', 'πεντακόσιες', 'εξακόσιες', 'επτακόσιες', 'οκτακόσιες', 'εννιακόσιες'];

  const getUnderTwenty = (t, u, isFem) => {
    if (t === 1 && u === 1) return 'έντεκα';
    if (t === 1 && u === 2) return 'δώδεκα';
    return tens[t] + (u > 0 ? ' ' + (isFem ? unitsFem[u] : units[u]) : '');
  };

  const convertTrio = (h, t, u, isThousands) => {
    let res = '';
    if (h > 0) {
      if (h === 1 && (t > 0 || u > 0)) res += 'εκατόν ';
      else res += (isThousands ? hundredsFem[h] : hundreds[h]) + ' ';
    }
    if (t > 0) res += getUnderTwenty(t, u, isThousands);
    else if (u > 0) res += isThousands ? unitsFem[u] : units[u];
    return res.trim();
  };

  const ex = Math.floor(num / 100000) % 10;
  const dx = Math.floor(num / 10000) % 10;
  const x = Math.floor(num / 1000) % 10;
  const e = Math.floor(num / 100) % 10;
  const d = Math.floor(num / 10) % 10;
  const m = num % 10;

  const thousandsPart = ex * 100 + dx * 10 + x;
  const unitsPart = e * 100 + d * 10 + m;

  let finalWords = '';
  if (thousandsPart > 0) {
    if (thousandsPart === 1) finalWords += 'χίλια ';
    else finalWords += convertTrio(ex, dx, x, true) + ' χιλιάδες ';
  }
  if (unitsPart > 0) finalWords += convertTrio(e, d, m, false);
  return finalWords.trim();
}

export default function DDimotikou() {
  const [activeTab, setActiveTab] = useState('large_numbers');

  // 1η Καρτέλα: Μεγάλοι Αριθμοί
  const [disks, setDisks] = useState(CONFIG.largeNumbers.initialValues);

  // 2η Καρτέλα: Δυναμική Κάθετη Διαίρεση
  const [inputDividend, setInputDividend] = useState('135');
  const [inputDivisor, setInputDivisor] = useState('3');
  
  // Ενεργές τιμές που χρησιμοποιούνται στην εκτέλεση
  const [dividend, setDividend] = useState(135);
  const [divisor, setDivisor] = useState(3);
  
  const [divTimeline, setDivTimeline] = useState(0);
  const [isDivPlaying, setIsDivPlaying] = useState(false);
  const divIntervalRef = useRef(null);

  // --------------------------------------------------------------------------
  // ΑΛΓΟΡΙΘΜΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΒΗΜΑΤΩΝ ΔΙΑΙΡΕΣΗΣ (Για οποιοδήποτε νούμερο)
  // --------------------------------------------------------------------------
  const e_init = Math.floor(dividend / 100) % 10;
  const d_init = Math.floor(dividend / 10) % 10;
  const m_init = dividend % 10;

  // Βήμα 1: Έλεγχος Εκατοντάδων
  const e_holds = e_init >= divisor;
  
  // Πρώτο τμήμα προς διαίρεση
  const first_work_num = e_holds ? e_init : (e_init * 10 + d_init);
  const first_quotient = Math.floor(first_work_num / divisor);
  const first_product = first_quotient * divisor;
  const first_remainder = first_work_num - first_product;

  // Δεύτερο τμήμα προς διαίρεση (Κατέβασμα επόμενου ψηφίου)
  const second_work_num = e_holds ? (first_remainder * 10 + d_init) : (first_remainder * 10 + m_init);
  const second_quotient = Math.floor(second_work_num / divisor);
  const second_product = second_quotient * divisor;
  const second_remainder = second_work_num - second_product;

  // Τρίτο τμήμα προς διαίρεση (αν ξεκινήσαμε από τις εκατοντάδες)
  const third_work_num = first_remainder * 100 + d_init * 10 + m_init - first_product * 10; // απλοποιημένο για το UI
  const has_three_steps = e_holds && (dividend >= 100);

  // Τελικό πηλίκο και υπόλοιπο
  const final_q = Math.floor(dividend / divisor);
  const final_r = dividend % divisor;

  // --------------------------------------------------------------------------
  // ΔΙΑΧΕΙΡΙΣΗ ANIMATION (Πιο αργό & σταθερό)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (isDivPlaying) {
      divIntervalRef.current = setInterval(() => {
        setDivTimeline((prev) => {
          if (prev >= 100) {
            setIsDivPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 150); // Αυξήθηκε ο χρόνος στα 150ms για πιο ομαλή και αργή ροή
    } else {
      if (divIntervalRef.current) clearInterval(divIntervalRef.current);
    }
    return () => { if (divIntervalRef.current) clearInterval(divIntervalRef.current); };
  }, [isDivPlaying]);

  const handleApplyDivision = (e) => {
    e.preventDefault();
    const n1 = Math.max(1, Math.min(999, parseInt(inputDividend) || 135));
    const n2 = Math.max(1, Math.min(9, parseInt(inputDivisor) || 3));
    setDividend(n1);
    setDivisor(n2);
    setInputDividend(n1.toString());
    setInputDivisor(n2.toString());
    setDivTimeline(0);
    setIsDivPlaying(false);
  };

  const updateDigits = (column, increment) => {
    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (newValue > CONFIG.largeNumbers.maxDisksPerColumn) newValue = CONFIG.largeNumbers.maxDisksPerColumn;
      return { ...prev, [column]: newValue };
    });
  };

  const totalNumber = 
    disks.EX * 100000 + disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M * 1;

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans scroll-smooth">
      <Head>
        <title>Δ' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🏠 Αρχική</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">🎒 Μαθηματικά Δ' Δημοτικού</h1>
        <p className="text-teal-100 opacity-90 font-medium">Εξερεύνηση των Αριθμών & των Σχημάτων</p>
      </header>

      {/* ΚΑΡΤΕΛΕΣ */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max border">
          <button onClick={() => setActiveTab('large_numbers')} className={`px-5 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'large_numbers' ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            💎 1. Μεγάλοι Αριθμοί
          </button>
          <button onClick={() => setActiveTab('long_division')} className={`px-5 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'long_division' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🧮 2. Κάθετη Διαίρεση (Διαδραστική)
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ΚΑΡΤΕΛΑ 1: ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ */}
        {activeTab === 'large_numbers' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">💎 Η Αξία Θέσης στους Μεγάλους Αριθμούς</h2>
                <p className="text-gray-600 leading-relaxed text-sm">Στο δεκαδικό μας σύστημα, η αξία κάθε ψηφίου εξαρτάται από τη θέση του στον αριθμό. Κάθε φορά που πηγαίνουμε μια θέση αριστερά, η αξία δεκαπλασιάζεται!</p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-8">
              <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-2xl mx-auto text-center space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Ο Αριθμός σου</span>
                <div className="text-4xl md:text-5xl font-mono font-black text-teal-600 tracking-tight">{formatNumber(totalNumber)}</div>
                <div className="text-sm text-teal-800 font-bold bg-teal-50/60 px-4 py-2.5 rounded-xl border border-teal-100/70 inline-block mt-2 capitalize">
                  Διαβάζεται: <span className="text-indigo-600 font-extrabold">{numberToGreekWords(totalNumber)}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border shadow-sm overflow-x-auto">
                <div className="min-w-[600px]">
                  <div className="grid grid-cols-6 gap-2 text-center font-bold text-[11px] mb-2">
                    <div className="col-span-3 bg-emerald-100 text-emerald-800 py-1 rounded-t-lg border-b-2 border-emerald-400">ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ</div>
                    <div className="col-span-3 bg-teal-100 text-teal-800 py-1 rounded-t-lg border-b-2 border-teal-400">ΚΛΑΣΗ ΜΟΝΑΔΩΝ</div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-black text-gray-500 font-mono mb-4">
                    <div className="bg-slate-50 p-2 rounded border">ΕΧ<br/><span className="font-normal text-[8px] text-gray-400">100.000</span></div>
                    <div className="bg-slate-50 p-2 rounded border">ΔΧ<br/><span className="font-normal text-[8px] text-gray-400">10.000</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Χ<br/><span className="font-normal text-[8px] text-gray-400">1.000</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Ε<br/><span className="font-normal text-[8px] text-gray-400">100</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Δ<br/><span className="font-normal text-[8px] text-gray-400">10</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Μ<br/><span className="font-normal text-[8px] text-gray-400">1</span></div>
                  </div>
                  <div className="grid grid-cols-6 gap-4 h-48 bg-slate-50/50 rounded-2xl border p-4 items-end relative">
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.EX }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-emerald-500 rounded-full border border-emerald-600 shadow-sm animate-fade-in"></div>)}
                    </div>
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.DX }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-emerald-400 rounded-full border border-emerald-500 shadow-sm animate-fade-in"></div>)}
                    </div>
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r-2 border-slate-300">
                      {Array.from({ length: disks.X }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-lime-400 rounded-full border border-lime-500 shadow-sm animate-fade-in"></div>)}
                    </div>
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.E }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-teal-500 rounded-full border border-teal-600 shadow-sm animate-fade-in"></div>)}
                    </div>
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.D }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-teal-400 rounded-full border border-teal-500 shadow-sm animate-fade-in"></div>)}
                    </div>
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative">
                      {Array.from({ length: disks.M }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-cyan-400 rounded-full border border-cyan-500 shadow-sm animate-fade-in"></div>)}
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-4 text-center mt-4">
                    {['EX', 'DX', 'X', 'E', 'D', 'M'].map((col) => (
                      <div key={col} className="flex flex-col items-center gap-1 bg-white p-2 rounded-xl border shadow-sm">
                        <div className="text-sm font-black font-mono text-slate-700">{disks[col]}</div>
                        <div className="flex gap-1">
                          <button onClick={() => updateDigits(col, -1)} className="bg-slate-100 font-bold px-2 py-0.5 rounded text-xs text-gray-600 transition shadow-sm">-</button>
                          <button onClick={() => updateDigits(col, 1)} className="bg-slate-100 font-bold px-2 py-0.5 rounded text-xs text-gray-600 transition shadow-sm">+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ΚΑΡΤΕΛΑ 2: ΔΥΝΑΜΙΚΗ ΚΑΘΕΤΗ ΔΙΑΙΡΕΣΗ */}
        {activeTab === 'long_division' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            
            {/* ΦΟΡΜΑ ΕΙΣΑΓΩΓΗΣ ΔΕΔΟΜΕΝΩΝ ΑΠΟ ΤΟ ΠΑΙΔΙ */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
              <form onSubmit={handleApplyDivision} className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-emerald-900">✏️ Δοκίμασε τη δική σου Διαίρεση!</h3>
                  <p className="text-xs text-emerald-700">Βάλε έναν τριψήφιο αριθμό και έναν μονοψήφιο διαιρέτη για να δεις τη λύση βήμα-βήμα.</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Διαιρετέος (έως 999)</label>
                    <input 
                      type="number" min="1" max="999" value={inputDividend}
                      onChange={(e) => setInputDividend(e.target.value)}
                      className="w-28 px-3 py-2 border rounded-xl font-mono text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <div className="text-xl font-black text-emerald-600 mt-4">÷</div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Διαιρέτης (1-9)</label>
                    <input 
                      type="number" min="1" max="9" value={inputDivisor}
                      onChange={(e) => setInputDivisor(e.target.value)}
                      className="w-20 px-3 py-2 border rounded-xl font-mono text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                  <button type="submit" className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition shadow-sm">
                    🔄 Αλλαγή
                  </button>
                </div>
              </form>
            </div>

            {/* ΧΕΙΡΙΣΤΗΡΙΑ TIMELINE SLIDER CONTROL */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => { if(divTimeline >= 100) setDivTimeline(0); setIsDivPlaying(!isDivPlaying); }}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs text-white transition-all shadow-sm ${isDivPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {isDivPlaying ? '⏸ Παύση' : '▶ Έναρξη Μοιράσματος'}
              </button>
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[9px] font-bold text-gray-400 px-1 uppercase tracking-wider">
                  <span className={divTimeline < 35 ? 'text-emerald-600 font-black' : ''}>1. Εκατοντάδες</span>
                  <span className={divTimeline >= 35 && divTimeline < 70 ? 'text-indigo-600 font-black' : ''}>2. Δεκάδες</span>
                  <span className={divTimeline >= 70 ? 'text-teal-600 font-black' : ''}>3. Μονάδες</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={divTimeline} 
                  onChange={(e) => { setIsDivPlaying(false); setDivTimeline(parseInt(e.target.value)); }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* ΚΥΡΙΩΣ ΠΛΕΓΜΑ ΕΠΙΔΕΙΞΗΣ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
              
              {/* ΑΡΙΣΤΕΡΑ: ΟΠΤΙΚΟ ΜΟΙΡΑΣΜΑ (ΑΒΑΚΑΣ ΜΑΡΚΩΝ) */}
              <div className="lg:col-span-6 bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">📦 Αξία Θέσης Ψηφίων</h3>
                
                {/* Μάρκες ανάλογα με το τρέχον βήμα */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black bg-white p-4 rounded-xl border shadow-inner">
                  <div className="border-r border-dashed">
                    <span className="text-red-500">Εκατοντάδες ({e_init})</span>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 h-10 items-center">
                      {divTimeline < 25 && Array.from({ length: e_init }).map((_, i) => <div key={i} className="w-3.5 h-3.5 rounded-full bg-red-500 border border-red-600 shadow-sm"></div>)}
                    </div>
                  </div>
                  <div className="border-r border-dashed">
                    <span className="text-amber-500">Δεκάδες ({d_init})</span>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 h-10 items-center overflow-hidden">
                      {divTimeline < 60 && Array.from({ length: d_init + (divTimeline >= 25 && !e_holds ? e_init * 10 : 0) }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shadow-sm"></div>)}
                    </div>
                  </div>
                  <div>
                    <span className="text-cyan-500">Μονάδες ({m_init})</span>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 h-10 items-center">
                      {divTimeline < 90 && Array.from({ length: m_init + (divTimeline >= 60 ? first_remainder * 10 : 0) }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-cyan-500 shadow-sm"></div>)}
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 text-center font-medium">
                  🎯 Στόχος: Μοιράζουμε το <span className="font-bold text-sm text-indigo-600">{dividend}</span> ισόποσα σε <span className="font-bold text-sm text-emerald-600">{divisor}</span> ομάδες!
                </div>
              </div>

              {/* ΔΕΞΙΑ: ΤΕΛΕΙΑ ΣΤΟΙΧΙΣΜΕΝΟΣ ΠΙΝΑΚΑΣ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
              <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center min-h-[340px]">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">✏️ Ο Αλγόριθμος στο τετράδιο</h3>
                
                {/* ΠΙΝΑΚΑΣ ΔΙΑΙΡΕΣΗΣ ΜΕ CSS BORDERS ΓΙΑ ΑΠΟΛΥΤΗ ΣΤΟΙΧΙΣΗ */}
                <table className="font-mono text-xl text-slate-800 font-bold border-collapse">
                  <tbody>
                    {/* 1η Γραμμή: Διαιρετέος | Διαιρέτης */}
                    <tr>
                      <td className="px-2 text-right tracking-widest min-w-[80px]">
                        <span className={divTimeline >= 15 && divTimeline < 65 ? 'text-indigo-600 underline decoration-2' : ''}>{e_init}</span>
                        <span className={divTimeline >= 15 && divTimeline < 65 ? 'text-indigo-600 underline decoration-2' : ''}>{d_init}</span>
                        <span className={divTimeline >= 65 ? 'text-teal-600 underline decoration-2' : ''}>{m_init}</span>
                      </td>
                      <td className="border-l-4 border-slate-700 border-b-4 px-4 text-emerald-600 font-black text-2xl min-w-[60px] text-center bg-emerald-50/50">
                        {divisor}
                      </td>
                    </tr>
                    
                    {/* 2η Γραμμή: 1ο Γινόμενο Αφαίρεσης | Πηλίκου */}
                    <tr>
                      <td className="px-2 text-right text-slate-400 text-sm py-1">
                        <span className={`transition-opacity ${divTimeline >= 40 ? 'opacity-100' : 'opacity-0'}`}>-{first_product}</span>
                      </td>
                      <td className="border-l-4 border-slate-700 px-4 text-left font-black tracking-wider py-1">
                        {/* Εμφάνιση ψηφίων πηλίκου δυναμικά */}
                        <span className={`text-indigo-600 text-2xl ${divTimeline >= 30 ? 'opacity-100' : 'opacity-0'}`}>{first_quotient}</span>
                        <span className={`text-teal-600 text-2xl ${divTimeline >= 80 ? 'opacity-100' : 'opacity-0'}`}>{second_quotient}</span>
                      </td>
                    </tr>

                    {/* 3η Γραμμή: 1ο Υπόλοιπο & Κατέβασμα */}
                    <tr>
                      <td className="px-2 text-right border-t border-slate-400 pt-1 tracking-widest">
                        <span className={`text-slate-500 ${divTimeline >= 50 ? 'opacity-100' : 'opacity-0'}`}>{first_remainder}</span>
                        <span className={`text-cyan-600 font-black ${divTimeline >= 65 ? 'opacity-100' : 'opacity-0'}`}>{m_init}</span>
                      </td>
                      <td className="border-l-4 border-slate-700"></td>
                    </tr>

                    {/* 4η Γραμμή: 2ο Γινόμενο Αφαίρεσης */}
                    <tr>
                      <td className="px-2 text-right text-slate-400 text-sm py-1">
                        <span className={`transition-opacity ${divTimeline >= 85 ? 'opacity-100' : 'opacity-0'}`}>-{second_product}</span>
                      </td>
                      <td className="border-l-4 border-slate-700"></td>
                    </tr>

                    {/* 5η Γραμμή: Τελικό Υπόλοιπο */}
                    <tr>
                      <td className="px-2 text-right border-t border-slate-400 pt-1 text-emerald-600 font-black text-2xl">
                        <span className={`transition-all ${divTimeline >= 95 ? 'opacity-100 scale-110' : 'opacity-0'}`}>({final_r})</span>
                      </td>
                      <td className="border-l-4 border-slate-700"></td>
                    </tr>
                  </tbody>
                </table>

                {/* ΔΥΝΑΜΙΚΗ ΕΠΕΞΗΓΗΣΗ ΑΝΑ ΣΤΑΔΙΟ (Παιδαγωγικά Κείμενα) */}
                <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-dashed text-xs text-slate-600 text-center leading-relaxed w-full min-h-[64px] flex items-center justify-center">
                  {divTimeline < 15 && `👋 Ας ξεκινήσουμε! Θέλουμε να διαιρέσουμε το ${dividend} με το ${divisor}.`}
                  {divTimeline >= 15 && divTimeline < 30 && (
                    e_holds 
                      ? `1. Κοιτάζουμε την Εκατοντάδα (${e_init}). Το ${divisor} χωράει στο ${e_init}; Ναι!` 
                      : `1. Κοιτάζουμε την Εκατοντάδα (${e_init}). Το ${divisor} δεν χωράει στο ${e_init}, οπότε παίρνουμε μαζί και τις Δεκάδες. Εξετάζουμε το ${first_work_num}.`
                  )}
                  {divTimeline >= 30 && divTimeline < 50 && `2. Διαιρούμε: Το ${divisor} στο ${first_work_num} χωράει ${first_quotient} φορές. Γράφουμε το ${first_quotient} στο Πηλίκο.`}
                  {divTimeline >= 50 && divTimeline < 65 && `3. Πολλαπλασιάζουμε: ${first_quotient} × ${divisor} = ${first_product}. Αφαιρούμε και βρίσκουμε υπόλοιπο ${first_remainder}.`}
                  {divTimeline >= 65 && divTimeline < 80 && `4. Κατεβάζουμε το επόμενο ψηφίο, το ${m_init}. Σχηματίζεται ο αριθμός ${second_work_num}.`}
                  {divTimeline >= 80 && divTimeline < 90 && `5. Διαιρούμε ξανά: Το ${divisor} στο ${second_work_num} χωράει ${second_quotient} φορές. Το γράφουμε στο Πηλίκο.`}
                  {divTimeline >= 90 && divTimeline < 100 && `6. Πολλαπλασιάζουμε: ${second_quotient} × ${divisor} = ${second_product}. Κάνουμε την τελική αφαίρεση.`}
                  {divTimeline === 100 && (
                    final_r === 0 
                      ? `🎉 Τέλεια! Η διαίρεση είναι Τέλεια (Υπόλοιπο 0). Το αποτέλεσμα είναι ακριβώς ${final_q}!`
                      : `🎉 Η διαίρεση ολοκληρώθηκε! Είναι Ατελής με Πηλίκο ${final_q} και Υπόλοιπο ${final_r}.`
                  )}
                </div>

              </div>

            </div>

          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}

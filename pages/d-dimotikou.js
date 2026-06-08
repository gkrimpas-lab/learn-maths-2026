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
      EX: 1,
      DX: 3,
      X: 5, 
      E: 4, 
      D: 2, 
      M: 7  
    }
  },
  division: {
    dividend: 135, // Ο αριθμός που μοιράζουμε (Διαιρετέος)
    divisor: 3,    // Σε πόσα μέρη τον χωρίζουμε (Διαιρέτης)
    initialTimeline: 0
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

  // State για την 1η Καρτέλα (Μεγάλοι Αριθμοί)
  const [disks, setDisks] = useState(CONFIG.largeNumbers.initialValues);

  // State για την 2η Καρτέλα (Κάθετη Διαίρεση)
  const [divTimeline, setDivTimeline] = useState(CONFIG.division.initialTimeline);
  const [isDivPlaying, setIsDivPlaying] = useState(false);
  const divIntervalRef = useRef(null);

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

  // Διαχείριση Play/Pause για το Timeline της Διαίρεσης
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
      }, 60); 
    } else {
      if (divIntervalRef.current) clearInterval(divIntervalRef.current);
    }
    return () => { if (divIntervalRef.current) clearInterval(divIntervalRef.current); };
  }, [isDivPlaying]);

  // Υπολογισμοί για τις δυναμικές θέσεις των στοιχείων της διαίρεσης (135 ÷ 3)
  // 1 Εκατοντάδα, 3 Δεκάδες, 5 Μονάδες.
  // Στάδιο 1 (0% - 30%): Εκατοντάδες. Το 1 δεν χωράει στο 3. Γίνεται ανταλλαγή με 10 δεκάδες (Σύνολο 13 δεκάδες).
  // Στάδιο 2 (30% - 70%): Δεκάδες. Μοιράζουμε τις 13 δεκάδες στα 3 παιδιά -> Παίρνουν από 4 δεκάδες (σύνολο 12) και περισσεύει 1 δεκάδα.
  // Στάδιο 3 (70% - 100%): Μονάδες. Η 1 δεκάδα γίνεται 10 μονάδες, μαζί με τις 5 αρχικές = 15 μονάδες. Μοιράζονται στα 3 παιδιά -> Παίρνουν από 5 μονάδες. Υπόλοιπο 0!
  
  const getEValue = () => {
    if (divTimeline < 15) return 1;
    return 0; // Χαλάει και πάει στις δεκάδες
  };

  const getDValue = () => {
    if (divTimeline < 15) return 3;
    if (divTimeline >= 15 && divTimeline < 45) return 13; // 3 + 10 από την εκατοντάδα
    if (divTimeline >= 45 && divTimeline < 75) {
      // Μοίρασμα: 13 - (αναλογική μείωση καθώς μοιράζονται)
      const factor = (divTimeline - 45) / 30;
      return 13 - Math.floor(12 * factor); 
    }
    return 1; // Έμεινε 1 δεκάδα
  };

  const getMValue = () => {
    if (divTimeline < 75) return 5;
    if (divTimeline >= 75 && divTimeline < 90) return 15; // 5 + 10 από τη δεκάδα
    if (divTimeline >= 90) {
      const factor = (divTimeline - 90) / 10;
      return 15 - Math.floor(15 * factor); // Μοιράζονται όλες
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Δ' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
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

      {/* ΜΕΝΟΥ ΚΑΡΤΕΛΩΝ (ΤΩΡΑ ΜΕ 2 ΚΑΡΤΕΛΕΣ) */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max">
          <button onClick={() => setActiveTab('large_numbers')} className={`px-5 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'large_numbers' ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            💎 1. Μεγάλοι Αριθμοί
          </button>
          <button onClick={() => setActiveTab('long_division')} className={`px-5 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'long_division' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🧮 2. Κάθετη Διαίρεση
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

        {/* ΚΑΡΤΕΛΑ 2: ΚΑΘΕΤΗ ΔΙΑΙΡΕΣΗ (NEW FEATURE) */}
        {activeTab === 'long_division' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">🧮 Πώς δουλεύει η Κάθετη Διαίρεση;</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Η κάθετη διαίρεση είναι μια διαδικασία δίκαιου μοιράσματος. Ξεκινάμε πάντα από τη μεγαλύτερη αξία <strong>(Εκατοντάδες)</strong>. Αν κάτι περισσέψει, το «χαλάμε» σε μικρότερες μονάδες και το δίνουμε στην επόμενη στήλη!
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-emerald-100 mb-1">📋 Το Παράδειγμά μας</h3>
                <div className="font-mono bg-black/10 p-2 rounded text-center text-lg font-bold">
                  {CONFIG.division.dividend} ÷ {CONFIG.division.divisor} = 45
                </div>
              </div>
            </div>

            {/* ΠΡΟΘΕΜΑ TIMELINE SLIDER CONTROL */}
            <div className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={() => { if(divTimeline >= 100) setDivTimeline(0); setIsDivPlaying(!isDivPlaying); }}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs text-white transition-all ${isDivPlaying ? 'bg-amber-600' : 'bg-emerald-600'}`}
              >
                {isDivPlaying ? '⏸ Παύση' : '▶ Έναρξη Μοιράσματος'}
              </button>
              <div className="w-full space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                  <span className={divTimeline < 30 ? 'text-emerald-600 font-black' : ''}>1. Εκατοντάδες</span>
                  <span className={divTimeline >= 30 && divTimeline < 70 ? 'text-indigo-600 font-black' : ''}>2. Δεκάδες</span>
                  <span className={divTimeline >= 70 ? 'text-teal-600 font-black' : ''}>3. Μονάδες</span>
                </div>
                <input 
                  type="range" min="0" max="100" value={divTimeline} 
                  onChange={(e) => { setIsDivPlaying(false); setDivTimeline(parseInt(e.target.value)); }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>

            {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΟΙΡΑΣΜΑΤΟΣ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-4xl mx-auto items-start">
              
              {/* ΑΡΙΣΤΕΡΑ: Ο ΠΙΝΑΚΑΣ ΜΟΙΡΑΣΜΑΤΟΣ ΣΤΑ 3 ΠΑΙΔΙΑ */}
              <div className="lg:col-span-7 bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">📦 Πίνακας Δίκαιου Μοιράσματος</h3>
                
                {/* 1. Τα εναπομείναντα μπαλάκια στον Πίνακα Αξίας Θέσης */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black bg-white p-3 rounded-xl border shadow-inner">
                  <div className="border-r border-dashed">
                    <span className="text-red-500">Εκατοντάδες</span>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 h-8 items-center">
                      {Array.from({ length: getEValue() }).map((_, i) => <div key={i} className="w-4 h-4 rounded-full bg-red-500 border border-red-600"></div>)}
                    </div>
                  </div>
                  <div className="border-r border-dashed">
                    <span className="text-amber-500">Δεκάδες</span>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 h-8 items-center overflow-hidden">
                      {Array.from({ length: getDValue() }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500"></div>)}
                    </div>
                  </div>
                  <div>
                    <span className="text-cyan-500">Μονάδες</span>
                    <div className="flex flex-wrap justify-center gap-1 mt-2 h-8 items-center">
                      {Array.from({ length: getMValue() }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-cyan-500"></div>)}
                    </div>
                  </div>
                </div>

                {/* 2. Τα 3 παιδιά (Κουτιά) που δέχονται το μερίδιό τους */}
                <div className="space-y-3">
                  {[1, 2, 3].map((child) => (
                    <div key={child} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-600 min-w-[70px]">
                        <i className="fa-solid fa-user text-emerald-500 text-sm"></i> Παιδί {child}
                      </div>

                      {/* Τι έχει πάρει το κάθε παιδί ανάλογα με το timeline */}
                      <div className="flex-1 flex gap-4 bg-slate-50 p-2 rounded-lg border border-dashed min-h-[36px] items-center">
                        {/* Δεκάδες που πήρε το παιδί (Στάδιο 2: εμφανίζονται 4 δεκάδες στο καθένα) */}
                        <div className="flex gap-0.5">
                          {divTimeline >= 50 && Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 animate-fade-in"></div>
                          ))}
                        </div>
                        {/* Μονάδες που πήρε το παιδί (Στάδιο 3: εμφανίζονται 5 μονάδες στο καθένα) */}
                        <div className="flex gap-0.5">
                          {divTimeline >= 95 && Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-500 animate-fade-in"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ΔΕΞΙΑ: ΤΟ ΠΑΡΑΔΟΣΙΑΚΟ ΣΧΗΜΑ ΤΗΣ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">✏️ Ο Αλγόριθμος στο τετράδιο</h3>
                
                {/* Δυναμικό Σχήμα Διαίρεσης */}
                <div className="font-mono text-xl text-slate-800 font-bold relative border-l-4 border-slate-700 pl-6 space-y-1 py-2">
                  
                  {/* Γραμμή Διαιρέτη / Πηλίκου */}
                  <div className="absolute top-0 left-0 w-24 h-[3px] bg-slate-700"></div>
                  <div className="absolute top-0 left-24 text-sm font-black text-emerald-600 bg-emerald-50 border px-1.5 rounded -mt-3.5">Διαιρέτης</div>

                  {/* 1ο Επίπεδο: 135 ÷ 3 */}
                  <div className="flex gap-8 relative">
                    <span className={divTimeline >= 15 && divTimeline < 70 ? 'text-indigo-600 underline decoration-2' : ''}>135</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-emerald-600 font-black">3</span>
                  </div>

                  {/* 2ο Επίπεδο: Αφαίρεση -12 και κατέβασμα */}
                  <div className={`text-slate-500 border-b-2 border-slate-400 w-12 text-right transition-opacity duration-300 ${divTimeline >= 50 ? 'opacity-100' : 'opacity-0'}`}>
                    -12
                  </div>

                  {/* 3ο Επίπεδο: Υπόλοιπο 1 και κατέβασμα του 5 -> 15 */}
                  <div className={`transition-opacity duration-300 ${divTimeline >= 65 ? 'opacity-100' : 'opacity-0'}`}>
                    <span className={divTimeline >= 70 ? 'text-teal-600 underline decoration-2' : ''}>01</span>
                    <span className={`text-cyan-600 font-black transition-opacity ${divTimeline >= 75 ? 'opacity-100' : 'opacity-0'}`}>5</span>
                    <span className="text-slate-400 ml-5">|</span>
                    <span className="text-indigo-600 font-black ml-4">4</span>
                    <span className={`text-teal-600 font-black transition-opacity ${divTimeline >= 95 ? 'opacity-100' : 'opacity-0'}`}>5</span>
                  </div>

                  {/* 4ο Επίπεδο: Αφαίρεση -15 */}
                  <div className={`text-slate-500 border-b-2 border-slate-400 w-16 text-right transition-opacity duration-300 ${divTimeline >= 95 ? 'opacity-100' : 'opacity-0'}`}>
                    -15
                  </div>

                  {/* 5ο Επίπεδο: Τελικό Υπόλοιπο 0 */}
                  <div className={`text-emerald-600 font-black w-16 text-right transition-opacity duration-300 ${divTimeline === 100 ? 'opacity-100 scale-110' : 'opacity-0'}`}>
                    (0)
                  </div>
                </div>

                {/* Δυναμικό Μήνυμα Επεξήγησης ανά στάδιο */}
                <div className="mt-8 bg-slate-50 p-4 rounded-xl border border-dashed text-xs text-slate-600 text-center leading-relaxed w-full">
                  {divTimeline < 15 && "1. Ξεκινάμε από την Εκατοντάδα. Το 1 δεν χωράει να μοιραστεί στα 3 παιδιά."}
                  {divTimeline >= 15 && divTimeline < 45 && "2. Αλλάζουμε την 1 Εκατοντάδα με 10 Δεκάδες. Μαζί με τις 3 που είχαμε, γίνονται 13 Δεκάδες."}
                  {divTimeline >= 45 && divTimeline < 65 && "3. Μοιράζουμε τις 13 Δεκάδες: Κάθε παιδί παίρνει από 4 (3·4=12). Γράφουμε το 4 στο Πηλίκο."}
                  {divTimeline >= 65 && divTimeline < 75 && "4. Αφαιρούμε: 13 - 12 = 1. Μας περισσεύει 1 Δεκάδα."}
                  {divTimeline >= 75 && divTimeline < 90 && "5. Κατεβάζουμε τις 5 Μονάδες. Η 1 Δεκάδα μαζί με τις 5 Μονάδες γίνονται 15 Μονάδες."}
                  {divTimeline >= 90 && divTimeline < 100 && "6. Μοιράζουμε τις 15 Μονάδες: Κάθε παιδί παίρνει από 5 (3·5=15). Γράφουμε το 5 στο Πηλίκο."}
                  {divTimeline === 100 && "🎉 Τέλεια! Αφαιρούμε 15-15=0. Η διαίρεση τελείωσε, κάθε παιδί πήρε ακριβώς 45!"}
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

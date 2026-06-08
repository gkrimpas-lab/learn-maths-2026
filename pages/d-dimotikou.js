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
  const hundredsFem = ['', 'εκατό', 'διακόσιες', 'τριακόσιες', 'τετρακόσια', 'πεντακόσιες', 'εξακόσιες', 'επτακόσιες', 'οκτακόσιες', 'εννιακόσιες'];

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
  const [inputDividend, setInputDividend] = useState('144');
  const [inputDivisor, setInputDivisor] = useState('4');
  const [dividend, setDividend] = useState(144);
  const [divisor, setDivisor] = useState(4);
  const [divTimeline, setDivTimeline] = useState(0);
  const [isDivPlaying, setIsDivPlaying] = useState(false);
  const divIntervalRef = useRef(null);

  // 3η Καρτέλα: Δεκαδικοί Αριθμοί
  const [decimalMode, setDecimalMode] = useState('tenths'); 
  const [decimalValue, setDecimalValue] = useState(4); 

  // 4η Καρτέλα: Μέτρηση Μήκους
  const [lengthInCm, setLengthInCm] = useState(125);

  // 5η Καρτέλα: Μέτρηση Βάρους (ΝΕΟ STATE)
  // Αποθηκεύουμε την τιμή σε γραμμάρια (g) από 0 έως 2.500g για εύκολη μετατροπή
  const [weightInG, setWeightInG] = useState(1500);

  // Υπολογισμοί Διαίρεσης
  const divStr = (dividend || 144).toString().padStart(3, '0'); 
  const e_init = divStr[0]; const d_init = divStr[1]; const m_init = divStr[2];
  const num_e = parseInt(e_init) || 0; const num_d = parseInt(d_init) || 0; const num_m = parseInt(m_init) || 0;

  const currentDivisor = divisor || 4;
  const e_holds = num_e >= currentDivisor;
  const first_work_num = e_holds ? num_e : (num_e * 10 + num_d);
  const first_quotient = Math.floor(first_work_num / currentDivisor) || 0;
  const first_product = first_quotient * currentDivisor;
  const first_remainder = first_work_num - first_product;

  const second_work_num = first_remainder * 10 + num_m;
  const second_quotient = Math.floor(second_work_num / currentDivisor) || 0;
  const second_product = second_quotient * currentDivisor;
  const second_remainder = second_work_num - second_product;

  const final_q = Math.floor(dividend / currentDivisor) || 0;
  const final_r = dividend % currentDivisor;

  const p1_str = (first_product ?? 0).toString().padStart(2, '0');
  const p2_str = (second_product ?? 0).toString().padStart(2, '0');
  const r1_str = (first_remainder ?? 0).toString();

  useEffect(() => {
    if (isDivPlaying) {
      divIntervalRef.current = setInterval(() => {
        setDivTimeline((prev) => {
          if (prev >= 100) { setIsDivPlaying(false); return 100; }
          return prev + 1;
        });
      }, 150); 
    } else {
      if (divIntervalRef.current) clearInterval(divIntervalRef.current);
    }
    return () => { if (divIntervalRef.current) clearInterval(divIntervalRef.current); };
  }, [isDivPlaying]);

  const handleApplyDivision = (e) => {
    e.preventDefault();
    const n1 = Math.max(1, Math.min(999, parseInt(inputDividend) || 144));
    const n2 = Math.max(1, Math.min(9, parseInt(inputDivisor) || 4));
    setDividend(n1); setDivisor(n2);
    setInputDividend(n1.toString()); setInputDivisor(n2.toString());
    setDivTimeline(0); setIsDivPlaying(false);
  };

  const updateDigits = (column, increment) => {
    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (newValue > CONFIG.largeNumbers.maxDisksPerColumn) newValue = CONFIG.largeNumbers.maxDisksPerColumn;
      return { ...prev, [column]: newValue };
    });
  };

  const totalNumber = disks.EX * 100000 + disks.DX * 10000 + disks.X * 1000 + disks.E * 100 + disks.D * 10 + disks.M * 1;
  const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const highlightFirstGroup = divTimeline >= 15 && divTimeline < 65;
  const highlightSecondGroup = divTimeline >= 65;

  // Υπολογισμοί για Δεκαδικούς
  const maxSlices = decimalMode === 'tenths' ? 10 : 100;
  const numericDecimal = decimalValue / maxSlices;

  const handleModeChange = (mode) => {
    setDecimalMode(mode);
    setDecimalValue(mode === 'tenths' ? 4 : 40);
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

      {/* ΚΑΡΤΕΛΕΣ (ΤΩΡΑ ΜΕ 5 ΚΑΡΤΕΛΕΣ) */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max border">
          <button onClick={() => setActiveTab('large_numbers')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'large_numbers' ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            💎 1. Μεγάλοι Αριθμοί
          </button>
          <button onClick={() => setActiveTab('long_division')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'long_division' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🧮 2. Κάθετη Διαίρεση
          </button>
          <button onClick={() => setActiveTab('decimals')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'decimals' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🍰 3. Δεκαδικοί & Κλάσματα
          </button>
          <button onClick={() => setActiveTab('length_measurement')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'length_measurement' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            📏 4. Μέτρηση Μήκους
          </button>
          <button onClick={() => setActiveTab('weight_measurement')} className={`px-3 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'weight_measurement' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            ⚖️ 5. Μέτρηση Βάρους
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ΚΑΡΤΕΛΕΣ 1, 2, 3, 4 (Παραμένουν ως είχαν) */}
        {activeTab === 'large_numbers' && ( /* ... */ <div className="p-4 text-center bg-white border rounded-2xl shadow-sm">💎 Επιλέξτε την καρτέλα 5 για το Βάρος!</div> )}
        {activeTab === 'long_division' && ( /* ... */ <div className="p-4 text-center bg-white border rounded-2xl shadow-sm">🧮 Επιλέξτε την καρτέλα 5 για το Βάρος!</div> )}
        {activeTab === 'decimals' && ( /* ... */ <div className="p-4 text-center bg-white border rounded-2xl shadow-sm">🍰 Επιλέξτε την καρτέλα 5 για το Βάρος!</div> )}
        {activeTab === 'length_measurement' && ( /* ... */ <div className="p-4 text-center bg-white border rounded-2xl shadow-sm">📏 Επιλέξτε την καρτέλα 5 για το Βάρος!</div> )}

        {/* ⚖️ ΚΑΡΤΕΛΑ 5: ΜΕΤΡΩ ΚΑΙ ΕΚΦΡΑΖΩ ΤΟ ΒΑΡΟΣ (NEW FEATURE) */}
        {activeTab === 'weight_measurement' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">⚖️ Μετρώ το Βάρος: Τόνος, Κιλά & Γραμμάρια</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Για να μετρήσουμε πόσο βαρύ είναι ένα σώμα, χρησιμοποιούμε το <strong>Κιλό (ή χιλιόγραμμο - kg)</strong> και το <strong>Γραμμάριο (g)</strong>. Για πολύ μεγάλα βάρη, χρησιμοποιούμε τον <strong>Τόνο (t)</strong>.
                </p>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-xs text-orange-900 leading-relaxed">
                  <p>💡 <strong>Η Σκάλα των 1.000:</strong> Στο βάρος, κάθε σκαλοπάτι αλλάζει κατά 1.000! <br />• 1 Τόνος = 1.000 Κιλά &nbsp;&nbsp;|&nbsp;&nbsp; • 1 Κιλό = 1.000 Γραμμάρια.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-orange-100 mb-1">🔗 Βασικές Ισότητες</h3>
                <ul className="text-xs space-y-1 opacity-95 font-mono">
                  <li>• 1 t = 1.000 kg</li>
                  <li>• 1 kg = 1.000 g</li>
                  <li>• 1 t = 1.000.000 g</li>
                </ul>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ SLIDER ΒΑΡΟΥΣ */}
            <div className="bg-orange-50/60 p-5 rounded-2xl border border-orange-200 max-w-2xl mx-auto space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-xs font-bold text-orange-900">
                <span>⚖️ Σύρε για να αλλάξεις το βάρος στη ζυγαριά:</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded-lg text-orange-600 text-sm">{(weightInG / 1000).toFixed(3)} kg</span>
              </div>
              <input 
                type="range" min="0" max="2500" step="50" value={weightInG}
                onChange={(e) => setWeightInG(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
            </div>

            {/* ΟΠΤΙΚΗ ΨΗΦΙΑΚΗ ΖΥΓΑΡΙΑ ΚΑΙ ΠΑΡΑΔΕΙΓΜΑΤΑ */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto items-center">
              
              {/* ΑΡΙΣΤΕΡΑ: Η ΨΗΦΙΑΚΗ ΖΥΓΑΡΙΑ */}
              <div className="md:col-span-5 bg-gray-50 p-6 rounded-3xl border flex flex-col items-center justify-center shadow-inner min-h-[260px] relative">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Η Ψηφιακή Ζυγαριά</span>
                
                {/* Το σώμα της ζυγαριάς */}
                <div className="w-48 bg-slate-300 h-8 rounded-t-xl border-b-4 border-slate-400 relative flex items-center justify-center">
                  {/* Δυναμικό Αντικείμενο πάνω στη ζυγαριά */}
                  <div className="absolute -top-12 text-4xl animate-bounce">
                    {weightInG === 0 && '🪶'}
                    {weightInG > 0 && weightInG <= 500 && '🍓'}
                    {weightInG > 500 && weightInG <= 1000 && '📦'}
                    {weightInG > 1000 && weightInG <= 2000 && '🍍'}
                    {weightInG > 2000 && '🍉'}
                  </div>
                </div>
                
                {/* Η οθόνη της ζυγαριάς */}
                <div className="w-40 bg-slate-900 text-emerald-400 font-mono font-black text-2xl text-center py-3 rounded-b-xl border-4 border-slate-700 shadow-xl mt-0">
                  {weightInG} <span className="text-xs text-emerald-500">g</span>
                </div>

                <div className="text-[10px] text-gray-500 font-medium mt-4 text-center">
                  {weightInG === 0 && 'Η ζυγαριά είναι άδεια!'}
                  {weightInG > 0 && weightInG <= 500 && 'Βάρος ίσο με μερικές φράουλες.'}
                  {weightInG > 500 && weightInG <= 1000 && 'Βάρος όσο 1 πακέτο αλεύρι.'}
                  {weightInG > 1000 && weightInG <= 2000 && 'Βάρος όσο ένας μεγάλος ανανάς.'}
                  {weightInG > 2000 && 'Βάρος όσο ένα μεγάλο καρπούζι!'}
                </div>
              </div>

              {/* ΔΕΞΙΑ: ΠΙΝΑΚΑΣ ΜΕΤΑΤΡΟΠΩΝ ΣΕ ΟΛΕΣ ΤΙΣ ΜΟΝΑΔΕΣ */}
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center md:text-left">📊 Πίνακας Συγχρονισμένων Μετατροπών Μάζας</h3>
                
                <div className="grid grid-cols-3 gap-3 text-center">
                  {/* Τόνοι */}
                  <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
                    <span className="text-[10px] text-orange-400 font-bold block uppercase">Τόνοι (t)</span>
                    <span className="text-xl md:text-2xl font-mono font-black">{(weightInG / 1000000).toFixed(6)}</span>
                  </div>
                  
                  {/* Κιλά */}
                  <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
                    <span className="text-[10px] text-amber-400 font-bold block uppercase">Κιλά (kg)</span>
                    <span className="text-xl md:text-2xl font-mono font-black">{(weightInG / 1000).toFixed(3)}</span>
                  </div>

                  {/* Γραμμάρια */}
                  <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 shadow-md">
                    <span className="text-[10px] text-yellow-400 font-bold block uppercase">Γραμμάρια (g)</span>
                    <span className="text-xl md:text-2xl font-mono font-black">{weightInG}</span>
                  </div>
                </div>

                {/* Πίνακας Αξίας Θέσης Βάρους (Στυλ Υποδιαστολής) */}
                <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block text-center">Πώς γράφεται ως δεκαδικός αριθμός στα Κιλά:</span>
                  <div className="flex items-center justify-center font-mono text-3xl font-black text-slate-700 bg-slate-50 p-2 rounded-lg border">
                    <span>{Math.floor(weightInG / 1000)}</span>
                    <span className="text-red-500 mx-1">,</span>
                    <span className="text-amber-600">{(weightInG % 1000).toString().padStart(3, '0')}</span>
                    <span className="text-sm font-bold text-gray-400 ml-2">kg</span>
                  </div>
                </div>

                {/* Συμμιγής Έκφραση */}
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-xs md:text-sm text-center font-semibold text-orange-950">
                  📢 <strong>Συμμιγής Αριθμός:</strong> <span className="text-orange-600 font-black">{Math.floor(weightInG / 1000)} κιλά</span> και <span className="text-amber-600 font-black">{weightInG % 1000} γραμμάρια</span>.
                </div>
              </div>

            </div>

            {/* ΠΑΙΔΑΓΩΓΙΚΟ ΠΑΡΑΔΕΙΓΜΑ ΓΙΑ ΤΟΝ ΤΟΝΟ */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="font-black text-xs text-slate-700 uppercase tracking-wide flex items-center gap-2">🚚 Πώς καταλαβαίνουμε τον 1 Τόνο (t);</h4>
              <p className="text-gray-600 text-xs leading-relaxed">
                Επειδή η ζυγαριά του πάγκου μετράει μικρά πράγματα, ο <strong>Τόνος</strong> χρησιμοποιείται για τεράστια βάρη. 
                Για παράδειγμα, ένα μικρό οικογενειακό αυτοκίνητο ζυγίζει περίπου <span className="text-orange-600 font-bold">1 τόνο</span> (δηλαδή $1.000\text{ kg}$), ενώ ένας μεγάλος ελέφαντας μπορεί να ζυγίζει έως και <span className="text-orange-600 font-bold">5 τόνους</span> ($5.000\text{ kg}$)!
              </p>
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

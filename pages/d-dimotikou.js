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

  // 4η Καρτέλα: Μέτρηση Μήκους (ΝΕΟ STATE)
  // Αποθηκεύουμε την τιμή σε εκατοστά (cm) για ευκολία στους υπολογισμούς (π.χ. από 0 έως 200 cm)
  const [lengthInCm, setLengthInCm] = useState(120);

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

      {/* ΚΑΡΤΕΛΕΣ (ΤΩΡΑ ΜΕ 4 ΚΑΡΤΕΛΕΣ) */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max border">
          <button onClick={() => setActiveTab('large_numbers')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'large_numbers' ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            💎 1. Μεγάλοι Αριθμοί
          </button>
          <button onClick={() => setActiveTab('long_division')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'long_division' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🧮 2. Κάθετη Διαίρεση
          </button>
          <button onClick={() => setActiveTab('decimals')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'decimals' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            🍰 3. Δεκαδικοί & Κλάσματα
          </button>
          <button onClick={() => setActiveTab('length_measurement')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'length_measurement' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            📏 4. Μέτρηση Μήκους
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
                <p className="text-gray-600 leading-relaxed text-sm">Στο δεκαδικό μας σύστημα, η αξία κάθε ψηφίου εξαρτάται από τη θέση του στον αριθμό.</p>
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
                    {['EX','DX','X','E','D','M'].map((h) => <div key={h} className="bg-slate-50 p-2 rounded border">{h}</div>)}
                  </div>
                  <div className="grid grid-cols-6 gap-4 h-48 bg-slate-50/50 rounded-2xl border p-4 items-end">
                    {['EX', 'DX', 'X', 'E', 'D', 'M'].map((col) => (
                      <div key={col} className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed last:border-0">
                        {Array.from({ length: disks[col] }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-teal-500 rounded-full border shadow-sm"></div>)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ΚΑΡΤΕΛΑ 2: ΚΑΘΕΤΗ ΔΙΑΙΡΕΣΗ */}
        {activeTab === 'long_division' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
              <form onSubmit={handleApplyDivision} className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-emerald-900">✏️ Δοκίμασε τη δική σου Διαίρεση!</h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input type="number" min="1" max="999" value={inputDividend} onChange={(e) => setInputDividend(e.target.value)} className="w-28 px-3 py-2 border rounded-xl font-mono text-center font-bold text-slate-800" />
                  <div className="text-xl font-black text-emerald-600">÷</div>
                  <input type="number" min="1" max="9" value={inputDivisor} onChange={(e) => setInputDivisor(e.target.value)} className="w-20 px-3 py-2 border rounded-xl font-mono text-center font-bold text-slate-800" />
                  <button type="submit" className="bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-sm shadow-sm">🔄 Αλλαγή</button>
                </div>
              </form>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
              <button onClick={() => { if(divTimeline >= 100) setDivTimeline(0); setIsDivPlaying(!isDivPlaying); }} className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-xs text-white transition-all ${isDivPlaying ? 'bg-amber-500' : 'bg-emerald-600'}`}>{isDivPlaying ? '⏸ Παύση' : '▶ Play'}</button>
              <div className="w-full space-y-1">
                <input type="range" min="0" max="100" value={divTimeline} onChange={(e) => { setIsDivPlaying(false); setDivTimeline(parseInt(e.target.value)); }} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
              <div className="lg:col-span-5 bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-6">
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black bg-white p-4 rounded-xl border shadow-inner">
                  <div className="border-r border-dashed"><span className="text-red-500">Εκατοντάδες ({num_e})</span><div className="flex flex-wrap justify-center gap-1 mt-2 h-10 items-center">{divTimeline < 25 && Array.from({ length: num_e }).map((_, i) => <div key={i} className="w-3 h-3 rounded-full bg-red-500"></div>)}</div></div>
                  <div className="border-r border-dashed"><span className="text-amber-500">Δεκάδες ({num_d})</span><div className="flex flex-wrap justify-center gap-1 mt-2 h-10 items-center">{divTimeline < 60 && Array.from({ length: num_d }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>)}</div></div>
                  <div><span className="text-cyan-500">Μονάδες ({num_m})</span><div className="flex flex-wrap justify-center gap-1 mt-2 h-10 items-center">{divTimeline < 90 && Array.from({ length: num_m }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>)}</div></div>
                </div>
              </div>
              <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200 flex flex-col items-center min-h-[340px]">
                <table className="font-mono text-2xl text-slate-800 font-bold border-collapse">
                  <tbody>
                    <tr>
                      <td className="w-6 text-center text-slate-300"></td> 
                      <td className={`w-8 text-center px-1 ${highlightFirstGroup ? 'text-indigo-600 underline decoration-4 font-black bg-indigo-50 py-0.5 rounded-l' : ''}`}>{num_e > 0 ? num_e : ''}</td>
                      <td className={`w-8 text-center px-1 ${highlightFirstGroup && !e_holds ? 'text-indigo-600 underline decoration-4 font-black bg-indigo-50 py-0.5 rounded-r' : (highlightFirstGroup && e_holds ? 'text-indigo-600' : '')} ${highlightSecondGroup ? 'text-teal-600' : ''}`}>{num_d}</td>
                      <td className={`w-8 text-center px-1 ${highlightSecondGroup ? 'text-teal-600 underline decoration-4 font-black bg-teal-50 py-0.5 rounded' : ''}`}>{num_m}</td>
                      <td className="border-l-4 border-slate-700 border-b-4 px-6 text-emerald-600 font-black text-3xl min-w-[80px] text-center bg-emerald-50/50">{divisor}</td>
                    </tr>
                    <tr className={divTimeline >= 40 ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
                      <td className="text-center text-slate-400 text-xl font-light px-1">-</td>
                      <td className="text-center text-slate-400 px-1">{e_holds ? p1_str[0] : p1_str[0]}</td>
                      <td className="text-center text-slate-400 px-1">{p1_str[1]}</td>
                      <td className="w-8"></td> 
                      <td className="border-l-4 border-slate-700 px-6 text-left font-black tracking-wider">
                        <span className={`text-indigo-600 text-3xl ${divTimeline >= 30 ? 'opacity-100' : 'opacity-0'}`}>{first_quotient}</span>
                        <span className={`text-teal-600 text-3xl ${divTimeline >= 80 ? 'opacity-100' : 'opacity-0'}`}>{second_quotient}</span>
                      </td>
                    </tr>
                    <tr className={divTimeline >= 50 ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
                      <td></td><td className="border-t-2 border-slate-400"></td><td className="border-t-2 border-slate-400 text-center text-slate-600 px-1">{r1_str}</td><td className={`border-t-2 border-slate-400 text-center text-cyan-600 font-black px-1 transition-opacity ${divTimeline >= 65 ? 'opacity-100' : 'opacity-0'}`}>{num_m}</td><td className="border-l-4 border-slate-700"></td>
                    </tr>
                    <tr className={divTimeline >= 85 ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
                      <td className="text-center text-slate-400 text-xl font-light px-1">-</td><td className="w-8"></td><td className="text-center text-slate-400 px-1">{p2_str[0]}</td><td className="text-center text-slate-400 px-1">{p2_str[1]}</td><td className="border-l-4 border-slate-700"></td>
                    </tr>
                    <tr className={divTimeline >= 95 ? 'opacity-100' : 'opacity-0 pointer-events-none'}>
                      <td></td><td></td><td className="border-t-2 border-slate-400"></td><td className={`border-t-2 border-slate-400 text-center font-black text-2xl border-b-4 border-double px-1 ${final_r === 0 ? 'text-emerald-600 border-emerald-500' : 'text-amber-600 border-amber-500'}`}>{final_r}</td><td className="border-l-4 border-slate-700"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ΚΑΡΤΕΛΑ 3: ΔΕΚΑΔΙΚΟΙ ΑΡΙΘΜΟΙ & ΔΕΚΑΔΙΚΑ ΚΛΑΣΜΑΤΑ */}
        {activeTab === 'decimals' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">🍰 Από τα Κλάσματα στους Δεκαδικούς</h2>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border flex flex-col justify-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">Διάλεξε Μορφή</span>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => handleModeChange('tenths')} className={`py-2 text-xs font-black rounded-xl transition ${decimalMode === 'tenths' ? 'bg-amber-500 text-white shadow' : 'bg-white border text-gray-600'}`}>10 Ίσα Μέρη (Δέκατα)</button>
                  <button onClick={() => handleModeChange('hundredths')} className={`py-2 text-xs font-black rounded-xl transition ${decimalMode === 'hundredths' ? 'bg-amber-500 text-white shadow' : 'bg-white border text-gray-600'}`}>100 Ίσα Μέρη (Εκατοστά)</button>
                </div>
              </div>
            </div>
            <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 max-w-2xl mx-auto space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-xs font-bold text-amber-900">
                <span>🤏 Σύρε για να επιλέξεις κομμάτια:</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded-lg text-amber-600 text-sm">{decimalValue} / {maxSlices}</span>
              </div>
              <input type="range" min="0" max={maxSlices} value={decimalValue} onChange={(e) => setDecimalValue(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto items-center">
              <div className="md:col-span-4 bg-gray-50 p-6 rounded-3xl border flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Η Δεκαδική Μονάδα</span>
                {decimalMode === 'tenths' ? (
                  <div className="w-full max-w-[180px] aspect-square bg-white border-2 border-slate-300 flex flex-col rounded-lg overflow-hidden shadow">
                    {Array.from({ length: 10 }).map((_, i) => <div key={i} className={`flex-1 border-b last:border-0 border-slate-200 transition-colors duration-150 ${i < decimalValue ? 'bg-amber-400' : 'bg-white'}`} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-10 w-full max-w-[180px] aspect-square bg-white border-2 border-slate-300 rounded-lg overflow-hidden shadow">
                    {Array.from({ length: 100 }).map((_, i) => <div key={i} className={`border border-slate-100 transition-colors duration-70 ${i < decimalValue ? 'bg-amber-400' : 'bg-white'}`} />)}
                  </div>
                )}
              </div>
              <div className="md:col-span-8 space-y-6">
                <div className="flex items-center justify-center gap-12 bg-white p-6 rounded-2xl border shadow-sm">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Δεκαδικό Κλάσμα</span>
                    <div className="flex flex-col items-center font-mono font-black text-3xl text-slate-700">
                      <span>{decimalValue}</span>
                      <div className="w-12 h-1 bg-slate-700 my-1 rounded"></div>
                      <span>{maxSlices}</span>
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-500">=</div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Δεκαδικός Αριθμός</span>
                    <div className="text-5xl font-mono font-black text-amber-500 tracking-tight">
                      {numericDecimal.toLocaleString('el-GR', { minimumFractionDigits: decimalMode === 'tenths' ? 1 : 2 })}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-900 text-white p-5 rounded-2xl border shadow-lg space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">Πίνακας Αξίας Θέσης</span>
                  <div className="grid grid-cols-4 gap-1 text-center font-mono">
                    <div className="text-[9px] font-bold text-slate-400 bg-slate-800 py-1 rounded">Μονάδες (Μ)</div>
                    <div className="text-[10px] font-bold text-red-400 flex items-center justify-center">,</div>
                    <div className="text-[9px] font-bold text-amber-400 bg-slate-800 py-1 rounded">Δέκατα (δ)</div>
                    <div className="text-[9px] font-bold text-yellow-400 bg-slate-800 py-1 rounded">Εκατοστά (ε)</div>
                    <div className="text-2xl font-black text-white p-2">{decimalValue === maxSlices ? '1' : '0'}</div>
                    <div className="text-3xl font-black text-red-500 flex items-center justify-center">,</div>
                    <div className="text-2xl font-black text-amber-400 p-2">{decimalValue === maxSlices ? '0' : (decimalMode === 'tenths' ? decimalValue : Math.floor(decimalValue / 10))}</div>
                    <div className="text-2xl font-black text-yellow-400 p-2">{decimalValue === maxSlices ? '0' : (decimalMode === 'tenths' ? '0' : decimalValue % 10)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📏 ΚΑΡΤΕΛΑ 4: ΜΕΤΡΩ ΚΑΙ ΕΚΦΡΑΖΩ ΤΟ ΜΗΚΟΣ (NEW FEATURE) */}
        {activeTab === 'length_measurement' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">📏 Μετρώ και Εκφράζω το Μήκος</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Βασική μονάδα μέτρησης του μήκους είναι το <strong>Μέτρο (μ. ή m)</strong>. Για να μετρήσουμε μικρότερα μήκη, χωρίζουμε το μέτρο σε 10, 100 ή 1.000 ίσα μέρη (Δεκάμετρα, Εκατοστά, Χιλιοστά).
                </p>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  <p>💡 <strong>Θυμήσου τον κανόνα:</strong> Όταν αλλάζουμε μονάδα μέτρησης και πάμε σε <strong>μικρότερη</strong> (δεξιά), πολλαπλασιάζουμε. Όταν πάμε σε <strong>μεγαλύτερη</strong> (αριστερά), διαιρούμε!</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-blue-100 mb-1">🔗 Σχέσεις Μονάδων</h3>
                <ul className="text-xs space-y-1 opacity-95 font-mono">
                  <li>• 1 m = 10 dm (δεκάμετρα)</li>
                  <li>• 1 m = 100 cm (εκατοστά)</li>
                  <li>• 1 m = 1.000 am (χιλιοστά)</li>
                </ul>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ SLIDER ΜΗΚΟΥΣ */}
            <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 max-w-2xl mx-auto space-y-2 shadow-inner">
              <div className="flex justify-between items-center text-xs font-bold text-blue-900">
                <span>📏 Άλλαξε το μήκος για να δεις τις μετατροπές:</span>
                <span className="font-mono bg-white px-2 py-0.5 border rounded-lg text-blue-600 text-sm">{lengthInCm} cm</span>
              </div>
              <input 
                type="range" min="0" max="200" step="10" value={lengthInCm}
                onChange={(e) => setLengthInCm(parseInt(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΧΑΡΑΚΑΣ (SVG) */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Ο Ψηφιακός σου Χάρακας (έως 2 Μέτρα)</span>
              
              <div className="w-full max-w-3xl bg-white p-6 rounded-xl border border-amber-200 shadow relative overflow-visible">
                {/* Η κορδέλα/αντικείμενο που μετράμε */}
                <div 
                  style={{ width: `${(lengthInCm / 200) * 100}%` }}
                  className="h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-sm transition-all duration-150 border-b-2 border-orange-500 opacity-90 relative mb-1"
                >
                  {lengthInCm > 0 && (
                    <span className="absolute right-2 top-0.5 text-[10px] font-black text-orange-950 font-mono">
                      {(lengthInCm / 100).toFixed(1)} m
                    </span>
                  )}
                </div>

                {/* Ο Χάρακας */}
                <svg viewBox="0 0 220 30" className="w-full overflow-visible font-mono">
                  {/* Βάση Χάρακα */}
                  <rect x="0" y="0" width="220" height="20" className="fill-yellow-50 stroke-amber-200 stroke-[0.5] rounded-b-sm" />
                  
                  {/* Χαραγές ανά 10cm (Δεκάμετρα) */}
                  {Array.from({ length: 21 }).map((_, i) => {
                    const xPos = 10 + i * 10;
                    const isMeter = i % 10 === 0;
                    const isHalfMeter = i % 5 === 0 && !isMeter;
                    
                    return (
                      <g key={i}>
                        <line 
                          x1={xPos} y1="0" 
                          x2={xPos} y2={isMeter ? "12" : (isHalfMeter ? "9" : "6")} 
                          className={isMeter ? "stroke-slate-800 stroke-[0.8]" : "stroke-slate-400 stroke-[0.4]"} 
                        />
                        {isMeter && (
                          <text x={xPos - 3} y="19" className="text-[5px] font-black fill-slate-800">
                            {i / 10}m
                          </text>
                        )}
                        {!isMeter && i % 2 === 0 && (
                          <text x={xPos - 4} y="18" className="text-[3.5px] font-bold fill-slate-400">
                            {i * 10}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* ΠΙΝΑΚΑΣ ΜΕΤΑΤΡΟΠΩΝ ΚΑΙ ΕΚΦΡΑΣΗΣ */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border shadow-xl space-y-4 max-w-4xl mx-auto">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">📊 Πίνακας Συγχρονισμένων Μετατροπών</h3>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Επικεφαλίδες Μονάδων */}
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-blue-400 font-bold block">Μέτρα (m)</span>
                  <span className="text-2xl font-mono font-black text-white">{(lengthInCm / 100).toFixed(2)}</span>
                </div>
                
                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-emerald-400 font-bold block">Δεκάμετρα (dm)</span>
                  <span className="text-2xl font-mono font-black text-white">{(lengthInCm / 10).toFixed(1)}</span>
                </div>

                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-amber-400 font-bold block">Εκατοστά (cm)</span>
                  <span className="text-2xl font-mono font-black text-white">{lengthInCm}</span>
                </div>

                <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
                  <span className="text-[10px] text-red-400 font-bold block">Χιλιοστά (mm)</span>
                  <span className="text-2xl font-mono font-black text-white">{lengthInCm * 10}</span>
                </div>
              </div>

              {/* Φυσική Έκφραση (Συμμιγής Αριθμός) */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center text-xs md:text-sm">
                📢 Εκφράζουμε το μήκος: <span className="text-amber-400 font-black">{Math.floor(lengthInCm / 100)} Μέτρο</span> και <span className="text-cyan-400 font-black">{lengthInCm % 100} Εκατοστά</span>.
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

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
  },
  weight: {
    min: 0,
    max: 2500,
    step: 1
  }
};

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

  const [disks, setDisks] = useState(CONFIG.largeNumbers.initialValues);
  const [inputDividend, setInputDividend] = useState('144');
  const [inputDivisor, setInputDivisor] = useState('4');
  const [dividend, setDividend] = useState(144);
  const [divisor, setDivisor] = useState(4);
  const [divTimeline, setDivTimeline] = useState(0);
  const [isDivPlaying, setIsDivPlaying] = useState(false);
  const divIntervalRef = useRef(null);

  const [decimalMode, setDecimalMode] = useState('tenths'); 
  const [decimalValue, setDecimalValue] = useState(4); 
  const [lengthInCm, setLengthInCm] = useState(125);
  const [weightInG, setWeightInG] = useState(1500);

  const divStr = (dividend || 144).toString().padStart(3, '0'); 
  const num_e = parseInt(divStr[0]) || 0; const num_d = parseInt(divStr[1]) || 0; const num_m = parseInt(divStr[2]) || 0;

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

  const maxSlices = decimalMode === 'tenths' ? 10 : 100;
  const numericDecimal = decimalValue / maxSlices;

  const handleModeChange = (mode) => {
    setDecimalMode(mode);
    setDecimalValue(mode === 'tenths' ? 4 : 40);
  };

  const adjustWeight = (amount) => {
    setWeightInG((prev) => Math.max(CONFIG.weight.min, Math.min(CONFIG.weight.max, prev + amount)));
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
        <div className="flex flex-wrap bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max border">
          <button onClick={() => setActiveTab('large_numbers')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'large_numbers' ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>💎 1. Μεγάλοι Αριθμοί</button>
          <button onClick={() => setActiveTab('long_division')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'long_division' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>🧮 2. Κάθετη Διαίρεση</button>
          <button onClick={() => setActiveTab('decimals')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'decimals' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>🍰 3. Δεκαδικοί & Κλάσματα</button>
          <button onClick={() => setActiveTab('length_measurement')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'length_measurement' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>📏 4. Μέτρηση Μήκους</button>
          <button onClick={() => setActiveTab('weight_measurement')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'weight_measurement' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>⚖️ 5. Μέτρηση Βάρους</button>
          <button onClick={() => setActiveTab('shortcut_division')} className={`px-4 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'shortcut_division' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>⚡ 6. Διαίρεση με 10, 100, 1000</button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ΚΑΡΤΕΛΑ 1 */}
        {activeTab === 'large_numbers' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900">💎 Η Αξία Θέσης στους Μεγάλους Αριθμούς</h2>
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

        {/* ΚΑΡΤΕΛΑ 2 */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              <div className={`p-4 rounded-2xl border transition-all duration-300 ${divTimeline === 100 && final_r === 0 ? 'bg-emerald-50 border-emerald-400 shadow-sm scale-102' : 'bg-white border-gray-200 opacity-60'}`}>
                <h4 className="font-black text-xs text-emerald-800 flex items-center gap-2">🟢 Τέλεια Διαίρεση</h4>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">Είναι η διαίρεση στην οποία το Υπόλοιπο είναι 0.</p>
              </div>
              <div className={`p-4 rounded-2xl border transition-all duration-300 ${divTimeline === 100 && final_r > 0 ? 'bg-amber-50 border-amber-400 shadow-sm scale-102' : 'bg-white border-gray-200 opacity-60'}`}>
                <h4 className="font-black text-xs text-amber-800 flex items-center gap-2">🟡 Ατελής Διαίρεση</h4>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">Είναι η διαίρεση στην οποία το Υπόλοιπο είναι μεγαλύτερο από το 0.</p>
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

        {/* ΚΑΡΤΕΛΑ 3 */}
        {activeTab === 'decimals' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900">🍰 Από τα Κλάσματα στους Δεκαδικούς</h2>
            <div className="bg-amber-50/60 p-5 rounded-2xl border max-w-2xl mx-auto">
              <input type="range" min="0" max={maxSlices} value={decimalValue} onChange={(e) => setDecimalValue(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-200 accent-amber-500 rounded-lg appearance-none" />
            </div>
            <div className="text-center text-3xl font-mono font-black text-amber-500 bg-slate-50 p-4 rounded-xl max-w-xs mx-auto border shadow-sm">
              {numericDecimal.toLocaleString('el-GR', { minimumFractionDigits: decimalMode === 'tenths' ? 1 : 2 })}
            </div>
          </div>
        )}

        {/* ΚΑΡΤΕΛΑ 4 */}
        {activeTab === 'length_measurement' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900">📏 Μετρώ και Εκφράζω το Μήκος</h2>
            <div className="bg-blue-50/60 p-5 rounded-2xl border max-w-2xl mx-auto">
              <input type="range" min="0" max="200" step="1" value={lengthInCm} onChange={(e) => setLengthInCm(parseInt(e.target.value))} className="w-full h-2.5 bg-slate-200 accent-blue-500 rounded-lg appearance-none" />
            </div>
            <div className="text-center text-2xl font-mono font-black text-blue-600 bg-slate-50 p-4 rounded-xl max-w-xs mx-auto border shadow-sm">
              {lengthInCm} cm = {(lengthInCm/100).toFixed(2)} m
            </div>
          </div>
        )}

        {/* ΚΑΡΤΕΛΑ 5 */}
        {activeTab === 'weight_measurement' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-black text-gray-900">⚖️ Μετρώ το Βάρος: Τόνος, Κιλά & Γραμμάρια</h2>
            <div className="bg-orange-50/60 p-5 rounded-2xl border max-w-2xl mx-auto flex items-center gap-3">
              <button type="button" onClick={() => adjustWeight(-1)} className="bg-white border px-3 py-1 rounded-lg text-xs font-bold shadow-sm">-1g</button>
              <input type="range" min="0" max="2500" step="1" value={weightInG} onChange={(e) => setWeightInG(parseInt(e.target.value))} className="flex-1 h-2.5 bg-slate-200 accent-orange-500 rounded-lg appearance-none" />
              <button type="button" onClick={() => adjustWeight(1)} className="bg-white border px-3 py-1 rounded-lg text-xs font-bold shadow-sm">+1g</button>
            </div>
            <div className="w-40 bg-slate-900 text-emerald-400 font-mono font-black text-2xl text-center py-3 rounded-xl mx-auto shadow-xl">
              {weightInG} g
            </div>
          </div>
        )}

        {/* ⚡ ΚΑΡΤΕΛΑ 6: ΔΙΑΙΡΕΣΗ ΜΕ 10, 100, 1000 */}
        {activeTab === 'shortcut_division' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black text-indigo-900 mb-1">⚡ Διαίρεση με 10, 100, 1000</h2>
                <p className="text-xs text-indigo-700 font-medium">Μαθαίνω το πιο γρήγορο και έξυπνο κόλπο των Μαθηματικών!</p>
              </div>
              <Link href="/d-dimotikou-exercises" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-xl transition shadow-md flex items-center gap-2 active:scale-95">
                📝 Εξάσκηση - Ασκήσεις
              </Link>
            </div>

            {/* ΠΕΡΙΠΤΩΣΗ 1 */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg inline-block">👍 Περίπτωση 1: Όταν ο αριθμός τελειώνει σε Μηδενικά</h3>
              <p className="text-slate-600 text-sm">Σβήνουμε από το τέλος του αριθμού τόσα μηδενικά, όσα έχει ο διαιρέτης.</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl border">
                <svg viewBox="0 0 540 100" className="w-full h-auto overflow-visible font-sans">
                  <g transform="translate(5, 5)">
                    <rect x="0" y="0" width="165" height="85" rx="10" className="fill-green-50/50 stroke-green-500 stroke-[1]" />
                    <text x="82" y="20" className="text-[9px] font-black fill-green-900" textAnchor="middle">÷ 10 (1 μηδενικό)</text>
                    <text x="40" y="60" className="text-2xl font-black fill-slate-800 font-mono">54</text>
                    <text x="68" y="60" className="text-2xl font-black fill-slate-300 font-mono">0</text>
                    <line x1="65" y1="65" x2="78" y2="40" className="stroke-red-500 stroke-[3]" />
                    <text x="90" y="58" className="text-lg fill-slate-400">&rarr;</text>
                    <text x="115" y="60" className="text-2xl font-black fill-emerald-600 font-mono">54</text>
                  </g>
                  <g transform="translate(187, 5)">
                    <rect x="0" y="0" width="165" height="85" rx="10" className="fill-blue-50/50 stroke-blue-500 stroke-[1]" />
                    <text x="82" y="20" className="text-[9px] font-black fill-blue-900" textAnchor="middle">÷ 100 (2 μηδενικά)</text>
                    <text x="35" y="60" className="text-2xl font-black fill-slate-800 font-mono">37</text>
                    <text x="63" y="60" className="text-2xl font-black fill-slate-300 font-mono">00</text>
                    <line x1="60" y1="65" x2="90" y2="40" className="stroke-red-500 stroke-[3]" />
                    <text x="100" y="58" className="text-lg fill-slate-400">&rarr;</text>
                    <text x="122" y="60" className="text-2xl font-black fill-emerald-600 font-mono">37</text>
                  </g>
                  <g transform="translate(370, 5)">
                    <rect x="0" y="0" width="165" height="85" rx="10" className="fill-orange-50/50 stroke-orange-500 stroke-[1]" />
                    <text x="82" y="20" className="text-[9px] font-black fill-orange-900" textAnchor="middle">÷ 1000 (3 μηδενικά)</text>
                    <text x="30" y="60" className="text-2xl font-black fill-slate-800 font-mono">8</text>
                    <text x="45" y="60" className="text-2xl font-black fill-slate-300 font-mono">000</text>
                    <line x1="42" y1="65" x2="85" y2="40" className="stroke-red-500 stroke-[3]" />
                    <text x="100" y="58" className="text-lg fill-slate-400">&rarr;</text>
                    <text x="125" y="60" className="text-2xl font-black fill-emerald-600 font-mono">8</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* 🔴 ΠΕΡΙΠΤΩΣΗ 2: ΥΠΟΔΙΑΣΤΟΛΗ (ΚΛΕΙΔΩΜΕΝΟΙ ΣΤΑΘΕΡΟΙ ΧΩΡΟΙ ΓΙΑ ΤΟ ΚΟΜΜΑ) */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">⚠️ Περίπτωση 2: Όταν ο αριθμός ΔΕΝ έχει μηδενικά</h3>
              <p className="text-slate-600 text-sm">Φανταζόμαστε την υποδιαστολή στο τέλος και τη μετακινούμε προς τα <strong>αριστερά</strong> τόσες θέσεις όσα τα μηδενικά.</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl border overflow-x-auto">
                <svg viewBox="0 0 540 110" className="min-w-[540px] h-auto overflow-visible font-sans select-none">
                  
                  {/* Πλαίσιο 1: ÷ 10 */}
                  <g transform="translate(5, 5)">
                    <rect x="0" y="0" width="170" height="95" rx="10" className="fill-amber-50/20 stroke-amber-400 stroke-[1]" />
                    <text x="85" y="18" className="text-[8px] font-black fill-amber-900 shadow-sm" textAnchor="middle">245 ÷ 10 (1 θέση αριστερά)</text>
                    
                    <text x="25" y="55" className="text-xl font-bold fill-slate-800 font-mono">2</text>
                    <text x="40" y="55" className="text-xl font-bold fill-slate-800 font-mono">4</text>
                    <text x="55" y="55" className="text-xl font-bold fill-slate-800 font-mono">5</text>
                    
                    <path d="M 62 58 Q 55 68 48 58" className="fill-none stroke-blue-500 stroke-[1.2] stroke-dasharray-[2]" />
                    <text x="45" y="57" className="text-xl font-black fill-red-500 font-mono animate-pulse">,</text>
                    
                    <text x="80" y="52" className="text-base fill-slate-400">&rarr;</text>
                    <text x="105" y="55" className="text-xl font-black fill-indigo-600 font-mono">24,5</text>
                  </g>

                  {/* Πλαίσιο 2: ÷ 100 (ΔΙΟΡΘΩΘΗΚΕ ΤΟ ΚΟΜΜΑ) */}
                  <g transform="translate(185, 5)">
                    <rect x="0" y="0" width="170" height="95" rx="10" className="fill-amber-50/20 stroke-amber-400 stroke-[1]" />
                    <text x="85" y="18" className="text-[8px] font-black fill-amber-900 shadow-sm" textAnchor="middle">245 ÷ 100 (2 θέσεις αριστερά)</text>
                    
                    <text x="25" y="55" className="text-xl font-bold fill-slate-800 font-mono">2</text>
                    <text x="40" y="55" className="text-xl font-bold fill-slate-800 font-mono">4</text>
                    <text x="55" y="55" className="text-xl font-bold fill-slate-800 font-mono">5</text>
                    
                    <path d="M 62 58 Q 55 68 48 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <path d="M 48 58 Q 40 68 32 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <text x="29" y="57" className="text-xl font-black fill-red-500 font-mono animate-pulse">,</text>
                    
                    <text x="80" y="52" className="text-base fill-slate-400">&rarr;</text>
                    <text x="105" y="55" className="text-xl font-black fill-indigo-600 font-mono">2,45</text>
                  </g>

                  {/* Πλαίσιο 3: ÷ 1000 */}
                  <g transform="translate(365, 5)">
                    <rect x="0" y="0" width="170" height="95" rx="10" className="fill-amber-50/20 stroke-amber-400 stroke-[1]" />
                    <text x="85" y="18" className="text-[8px] font-black fill-amber-900 shadow-sm" textAnchor="middle">245 ÷ 1000 (3 θέσεις αριστερά)</text>
                    
                    <text x="25" y="55" className="text-xl font-bold fill-slate-800 font-mono">2</text>
                    <text x="40" y="55" className="text-xl font-bold fill-slate-800 font-mono">4</text>
                    <text x="55" y="55" className="text-xl font-bold fill-slate-800 font-mono">5</text>
                    
                    <path d="M 62 58 Q 55 68 48 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <path d="M 48 58 Q 40 68 32 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <path d="M 32 58 Q 23 68 15 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <text x="12" y="57" className="text-xl font-black fill-red-500 font-mono animate-pulse">,</text>
                    
                    <text x="75" y="52" className="text-base fill-slate-400">&rarr;</text>
                    <text x="100" y="55" className="text-xl font-black fill-indigo-600 font-mono">0,245</text>
                  </g>
                </svg>
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

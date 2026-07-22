// pages/d-dimotikou/2-katheti-diairesi.js
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function KathetiDiairesiPage() {
  const [inputDividend, setInputDividend] = useState('144');
  const [inputDivisor, setInputDivisor] = useState('4');
  const [dividend, setDividend] = useState(144);
  const [divisor, setDivisor] = useState(4);
  const [divTimeline, setDivTimeline] = useState(0);
  const [isDivPlaying, setIsDivPlaying] = useState(false);
  const divIntervalRef = useRef(null);

  // Υπολογισμοί βημάτων διαίρεσης
  const divStr = (dividend || 144).toString().padStart(3, '0');
  const num_e = parseInt(divStr[0]) || 0;
  const num_d = parseInt(divStr[1]) || 0;
  const num_m = parseInt(divStr[2]) || 0;

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

  const final_r = dividend % currentDivisor;

  const p1_str = (first_product ?? 0).toString().padStart(2, '0');
  const p2_str = (second_product ?? 0).toString().padStart(2, '0');
  const r1_str = (first_remainder ?? 0).toString();

  // Animation timer control
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
      }, 150);
    } else {
      if (divIntervalRef.current) clearInterval(divIntervalRef.current);
    }
    return () => {
      if (divIntervalRef.current) clearInterval(divIntervalRef.current);
    };
  }, [isDivPlaying]);

  const handleApplyDivision = (e) => {
    e.preventDefault();
    const n1 = Math.max(1, Math.min(999, parseInt(inputDividend) || 144));
    const n2 = Math.max(1, Math.min(9, parseInt(inputDivisor) || 4));
    setDividend(n1);
    setDivisor(n2);
    setInputDividend(n1.toString());
    setInputDivisor(n2.toString());
    setDivTimeline(0);
    setIsDivPlaying(false);
  };

  const highlightFirstGroup = divTimeline >= 15 && divTimeline < 65;
  const highlightSecondGroup = divTimeline >= 65;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🧮 Κάθετη Διαίρεση - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-emerald-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ & ΦΟΡΜΑ ΕΙΣΑΓΩΓΗΣ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🧮 Κάθετη Διαίρεση</h2>
                <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                  Η κάθετη διαίρεση μας βοηθάει να μοιράσουμε έναν μεγάλο αριθμό σε <strong>ίσα μέρη</strong>, βήμα-βήμα ξεκινώντας από τα μεγαλύτερα ψηφία.
                </p>
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 text-sm xl:text-base text-emerald-900 space-y-2 shadow-inner">
                  <p>📦 <strong>Διαιρετέος:</strong> Ο αριθμός που θέλουμε να μοιράσουμε.</p>
                  <p>🤝 <strong>Διαιρέτης:</strong> Σε πόσα ίσα μέρη μοιράζουμε.</p>
                  <p>🎯 <strong>Πηλίκο:</strong> Πόσα παίρνει το κάθε μέρος.</p>
                  <p>🔍 <strong>Υπόλοιπο:</strong> Όσα περισσεύουν (μικρότερο από τον διαιρέτη).</p>
                </div>
              </div>

              {/* ΦΟΡΜΑ ΑΛΛΑΓΗΣ ΑΡΙΘΜΩΝ */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-8 rounded-2xl shadow-md text-center py-10 space-y-4">
                <h3 className="text-lg font-black text-emerald-100">✏️ Δοκίμασε τη δική σου Διαίρεση!</h3>
                <form onSubmit={handleApplyDivision} className="flex flex-wrap items-center justify-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={inputDividend}
                    onChange={(e) => setInputDividend(e.target.value)}
                    className="w-28 px-3 py-2.5 rounded-xl font-mono text-center font-bold text-slate-800 text-xl shadow-inner outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <div className="text-3xl font-black text-amber-300">÷</div>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={inputDivisor}
                    onChange={(e) => setInputDivisor(e.target.value)}
                    className="w-20 px-3 py-2.5 rounded-xl font-mono text-center font-bold text-slate-800 text-xl shadow-inner outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-900 font-black px-6 py-2.5 rounded-xl text-sm transition shadow-md active:scale-95 mt-2 sm:mt-0"
                  >
                    🔄 Υπολογισμός
                  </button>
                </form>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ & TIMELINE */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-6">
              
              {/* ΧΕΙΡΙΣΤΗΡΙΑ ANIMATION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={() => {
                    if (divTimeline >= 100) setDivTimeline(0);
                    setIsDivPlaying(!isDivPlaying);
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-sm text-white transition-all shadow-sm ${
                    isDivPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isDivPlaying ? '⏸ Παύση' : '▶ Αναπαραγωγή Βήμα-Βήμα'}
                </button>
                <div className="w-full space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={divTimeline}
                    onChange={(e) => {
                      setIsDivPlaying(false);
                      setDivTimeline(parseInt(e.target.value));
                    }}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>

              {/* ΠΙΝΑΚΑΣ & ΑΛΓΟΡΙΘΜΟΣ ΔΙΑΙΡΕΣΗΣ */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
                
                {/* ΟΠΤΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΨΗΦΙΩΝ */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-gray-700 text-center uppercase tracking-wider">Οπτικοποίηση Ψηφίων</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-black bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner">
                    <div className="border-r border-dashed border-slate-300">
                      <span className="text-red-500">Εκατοντάδες ({num_e})</span>
                      <div className="flex flex-wrap justify-center gap-1 mt-2 h-12 items-center">
                        {divTimeline < 25 && Array.from({ length: num_e }).map((_, i) => (
                          <div key={i} className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-sm"></div>
                        ))}
                      </div>
                    </div>
                    <div className="border-r border-dashed border-slate-300">
                      <span className="text-amber-500">Δεκάδες ({num_d})</span>
                      <div className="flex flex-wrap justify-center gap-1 mt-2 h-12 items-center">
                        {divTimeline < 60 && Array.from({ length: num_d }).map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-amber-400 shadow-sm"></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-cyan-500">Μονάδες ({num_m})</span>
                      <div className="flex flex-wrap justify-center gap-1 mt-2 h-12 items-center">
                        {divTimeline < 90 && Array.from({ length: num_m }).map((_, i) => (
                          <div key={i} className="w-3 h-3 rounded-full bg-cyan-400 shadow-sm"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΑΛΓΟΡΙΘΜΟΣ ΚΑΘΕΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center min-h-[340px] overflow-x-auto">
                  <table className="font-mono text-2xl text-slate-800 font-bold border-collapse">
                    <tbody>
                      {/* ΣΕΙΡΑ 1: Διαιρετέος & Διαιρέτης */}
                      <tr>
                        <td className="w-6 text-center text-slate-300"></td>
                        <td className={`w-8 text-center px-1 ${highlightFirstGroup ? 'text-indigo-600 underline decoration-4 font-black bg-indigo-50 py-0.5 rounded-l' : ''}`}>
                          {num_e > 0 ? num_e : ''}
                        </td>
                        <td className={`w-8 text-center px-1 ${highlightFirstGroup && !e_holds ? 'text-indigo-600 underline decoration-4 font-black bg-indigo-50 py-0.5 rounded-r' : (highlightFirstGroup && e_holds ? 'text-indigo-600' : '')} ${highlightSecondGroup ? 'text-teal-600' : ''}`}>
                          {num_d}
                        </td>
                        <td className={`w-8 text-center px-1 ${highlightSecondGroup ? 'text-teal-600 underline decoration-4 font-black bg-teal-50 py-0.5 rounded' : ''}`}>
                          {num_m}
                        </td>
                        <td className="border-l-4 border-slate-700 border-b-4 px-6 text-emerald-600 font-black text-3xl min-w-[80px] text-center bg-emerald-50/50">
                          {divisor}
                        </td>
                      </tr>

                      {/* ΣΕΙΡΑ 2: Πρώτο Γινόμενο & Πρώτο ψηφίο Πηλίκου */}
                      <tr className={divTimeline >= 40 ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 pointer-events-none'}>
                        <td className="text-center text-slate-400 text-xl font-light px-1">-</td>
                        <td className="text-center text-slate-400 px-1">{e_holds ? p1_str[0] : p1_str[0]}</td>
                        <td className="text-center text-slate-400 px-1">{p1_str[1]}</td>
                        <td className="w-8"></td>
                        <td className="border-l-4 border-slate-700 px-6 text-left font-black tracking-wider">
                          <span className={`text-indigo-600 text-3xl transition-opacity duration-300 ${divTimeline >= 30 ? 'opacity-100' : 'opacity-0'}`}>{first_quotient}</span>
                          <span className={`text-teal-600 text-3xl transition-opacity duration-300 ${divTimeline >= 80 ? 'opacity-100' : 'opacity-0'}`}>{second_quotient}</span>
                        </td>
                      </tr>

                      {/* ΣΕΙΡΑ 3: Πρώτο Υπόλοιπο & Κατέβασμα επόμενου ψηφίου */}
                      <tr className={divTimeline >= 50 ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 pointer-events-none'}>
                        <td></td>
                        <td className="border-t-2 border-slate-400"></td>
                        <td className="border-t-2 border-slate-400 text-center text-slate-600 px-1">{r1_str}</td>
                        <td className={`border-t-2 border-slate-400 text-center text-cyan-600 font-black px-1 transition-opacity duration-300 ${divTimeline >= 65 ? 'opacity-100' : 'opacity-0'}`}>{num_m}</td>
                        <td className="border-l-4 border-slate-700"></td>
                      </tr>

                      {/* ΣΕΙΡΑ 4: Δεύτερο Γινόμενο */}
                      <tr className={divTimeline >= 85 ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 pointer-events-none'}>
                        <td className="text-center text-slate-400 text-xl font-light px-1">-</td>
                        <td className="w-8"></td>
                        <td className="text-center text-slate-400 px-1">{p2_str[0]}</td>
                        <td className="text-center text-slate-400 px-1">{p2_str[1]}</td>
                        <td className="border-l-4 border-slate-700"></td>
                      </tr>

                      {/* ΣΕΙΡΑ 5: Τελικό Υπόλοιπο */}
                      <tr className={divTimeline >= 95 ? 'opacity-100 transition-opacity duration-300' : 'opacity-0 pointer-events-none'}>
                        <td></td>
                        <td></td>
                        <td className="border-t-2 border-slate-400"></td>
                        <td className={`border-t-2 border-slate-400 text-center font-black text-2xl border-b-4 border-double px-1 ${final_r === 0 ? 'text-emerald-600 border-emerald-500' : 'text-amber-600 border-amber-500'}`}>
                          {final_r}
                        </td>
                        <td className="border-l-4 border-slate-700"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

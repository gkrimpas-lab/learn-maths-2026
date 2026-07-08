// pages/st-dimotikou/2-dekadikoi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DekadikoiArithmoiPage() {
  const [number, setNumber] = useState("345.672");

  // Διαχωρισμός σε ακέραιο και δεκαδικό μέρος
  const parts = number.split('.');
  const integerPart = parts[0] || "";
  const decimalPart = parts[1] || "";

  // Γέμισμα με μηδενικά για σταθερό πλέγμα (3 ψηφία ακέραιο, 3 δεκαδικό)
  const intDigits = integerPart.padStart(3, '0').slice(-3).split('');
  const decDigits = decimalPart.padEnd(3, '0').slice(0, 3).split('');

  // Ορισμός κατηγοριών για το Ακέραιο Μέρος
  const intClasses = [
    { name: "Εκατοντάδες", label: "Ε" },
    { name: "Δεκάδες", label: "Δ" },
    { name: "Μονάδες", label: "Μ" }
  ];

  // Ορισμός κατηγοριών για το Δεκαδικό Μέρος
  const decClasses = [
    { name: "Δέκατα", label: "δ" },
    { name: "Εκατοστά", label: "ε" },
    { name: "Χιλιοστά", label: "χ" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Δεκαδικοί Αριθμοί - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/st-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  📖 Θεωρία: Οι Δεκαδικοί Αριθμοί
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  <strong>Δεκαδικοί αριθμοί</strong> είναι οι αριθμοί που χρησιμοποιούμε όταν θέλουμε να εκφράσουμε ποσότητες μικρότερες από τη μία ακέραιη μονάδα ή ανάμεσά τους.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🏛️ <strong className="text-emerald-900">Ακέραιο Μέρος:</strong> Βρίσκεται αριστερά από την υποδιαστολή και δείχνει τις ολόκληρες μονάδες (Ε, Δ, Μ).</p>
                  <p>🍰 <strong className="text-blue-900">Δεκαδικό Μέρος:</strong> Βρίσκεται δεξιά από την υποδιαστολή και δείχνει κομμάτια μικρότερα της μονάδας (δέκατα, εκατοστά, χιλιοστά).</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-3xl md:text-4xl tracking-wide">
                  <div className="text-amber-300 pb-1">Η Υποδιαστολή ( , )</div>
                  <div className="w-48 md:w-56 h-1 bg-white rounded-full my-2"></div>
                  <div className="text-white pt-1 text-xl font-bold flex gap-4">
                    <span>Ακέραιο</span>
                    <span className="text-amber-300">•</span>
                    <span>Δεκαδικό</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & INPUT (Μεγαλώσαμε σε h-[480px]) */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-[480px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Πίνακας Δεκαδικών
                </h3>
                <p className="text-gray-500 text-sm">
                  Γράψε έως 3 ακέραια και 3 δεκαδικά ψηφία με τελεία (π.χ. 123.45).
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col items-center justify-center shadow-inner my-auto">
                <input 
                  type="text" 
                  value={number}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9.]/g, '');
                    
                    // Έλεγχος για ύπαρξη μίας μόνο τελείας
                    const dotCount = (val.match(/\./g) || []).length;
                    if (dotCount <= 1) {
                      const inputParts = val.split('.');
                      const inputInt = inputParts[0] || "";
                      const inputDec = inputParts[1] || "";
                      
                      // Επιβολή ορίου: max 3 ψηφία στο ακέραιο και max 3 στο δεκαδικό
                      if (inputInt.length <= 3 && inputDec.length <= 3) {
                        setNumber(val);
                      }
                    }
                  }}
                  className="text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full max-w-sm tracking-wider text-blue-600"
                  placeholder="π.χ. 345.672"
                />
              </div>

              {/* Μαθηματική Καταγραφή / Ανάλυση (Μεγαλώσαμε σε h-[210px] με pb-6 για τέλειο αέρα) */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl h-[210px] pb-6 font-mono text-xs md:text-sm text-left space-y-1 shadow-inner overflow-hidden flex flex-col justify-start">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block font-sans mb-2">
                  🧬 Ανάλυση σε Δεκαδικά Κλάσματα:
                </span>
                
                {/* Ανάλυση Ακέραιου μέρους */}
                {intDigits.map((digit, i) => {
                  if (digit === '0' && i < intDigits.findIndex(d => d !== '0')) return null;
                  const value = Math.pow(10, 2 - i);
                  if (digit === '0' && value !== 1) return null;
                  return (
                    <div key={`int-${i}`} className="flex items-center gap-1.5 text-slate-600 border-b border-gray-100/70 py-0.5 last:border-0">
                      <span className="text-emerald-600 font-black text-sm">{digit}</span>
                      <span className="text-slate-400">×</span>
                      <span className="font-bold text-slate-700">{value}</span>
                    </div>
                  );
                })}

                {/* Ανάλυση Δεκαδικού μέρους */}
                {decDigits.map((digit, i) => {
                  if (digit === '0') return null;
                  const den = Math.pow(10, i + 1);
                  return (
                    <div key={`dec-${i}`} className="flex items-center gap-1.5 text-slate-600 border-b border-gray-100/70 py-0.5 last:border-0">
                      <span className="text-blue-600 font-black text-sm">{digit}</span>
                      <span className="text-slate-400">×</span>
                      <div className="inline-flex flex-col items-center text-[10px] font-bold text-slate-700 leading-none">
                        <span>1</span>
                        <div className="w-3 h-[1px] bg-slate-700 my-0.5"></div>
                        <span>{den}</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">({digit / den})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΙΝΑΚΑ (Μεγαλώσαμε σε h-[480px]) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="w-full overflow-x-auto pb-2 my-auto">
                <div className="min-w-[500px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mx-auto">
                  
                  {/* Header Μεγάλων Κατηγοριών */}
                  <div className="grid grid-cols-7 text-white text-center font-black text-[11px] uppercase tracking-wide">
                    <div className="col-span-3 bg-emerald-600 py-2.5">Ακέραιο Μέρος</div>
                    <div className="bg-amber-500 py-2.5">,</div>
                    <div className="col-span-3 bg-blue-600 py-2.5">Δεκαδικό Μέρος</div>
                  </div>

                  {/* Header Τάξεων */}
                  <div className="grid grid-cols-7 text-[10px] font-black text-slate-400 text-center border-b bg-slate-50 uppercase py-2">
                    {intClasses.map((c, i) => <div key={`hc1-${i}`} className="border-r" title={c.name}>{c.label}</div>)}
                    <div className="text-amber-500 font-bold border-r">Υποδ.</div>
                    {decClasses.map((c, i) => <div key={`hc2-${i}`} className="border-r last:border-0" title={c.name}>{c.label}</div>)}
                  </div>

                  {/* Τα Ψηφία του Αριθμού */}
                  <div className="grid grid-cols-7 text-center items-center font-black text-2xl">
                    
                    {/* Ακέραια Ψηφία */}
                    {intDigits.map((digit, i) => {
                      const isLeadingZero = digit === '0' && i < intDigits.findIndex(d => d !== '0');
                      return (
                        <div key={`id-${i}`} className={`py-6 border-r bg-emerald-50/40 transition-colors duration-200 ${isLeadingZero ? 'text-slate-200' : 'text-slate-800'}`}>
                          {digit}
                        </div>
                      );
                    })}

                    {/* Υποδιαστολή */}
                    <div className="py-6 border-r bg-amber-50 text-amber-500">
                      ,
                    </div>

                    {/* Δεκαδικά Ψηφία */}
                    {decDigits.map((digit, i) => {
                      const isTrailingZero = digit === '0' && i > decimalPart.length - 1;
                      return (
                        <div key={`dd-${i}`} className={`py-6 border-r last:border-0 bg-blue-50/40 transition-colors duration-200 ${isTrailingZero ? 'text-slate-200' : 'text-slate-800'}`}>
                          {digit}
                        </div>
                      );
                    })}

                  </div>

                </div>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 <span className="text-emerald-600">Ε, Δ, Μ</span> = Ακέραια | <span className="text-blue-600">δ, ε, χ</span> = Δέκατα, Εκατοστά, Χιλιοστά.</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικοί Δεκαδικοί Αριθμοί ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

// pages/st-dimotikou/1-fysikoi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState("1234567890");

  // Συνάρτηση που χωρίζει τον αριθμό σε ψηφία και τα τοποθετεί σε τάξεις (μέχρι 12 ψηφία)
  const getDigits = () => {
    const padded = number.padStart(12, '0').slice(-12);
    return padded.split('');
  };

  const digits = getDigits();

  // Ορισμός Περιόδων με τα κατάλληλα χρώματα
  const periods = [
    { name: "Δισεκατομμύρια", color: "bg-purple-600", light: "bg-purple-50" },
    { name: "Εκατομμύρια", color: "bg-rose-600", light: "bg-rose-50" },
    { name: "Χιλιάδες", color: "bg-blue-600", light: "bg-blue-50" },
    { name: "Μονάδες", color: "bg-emerald-600", light: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Φυσικοί Αριθμοί - LearnMaths.gr</title>
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
                  📖 Θεωρία: Οι Φυσικοί Αριθμοί
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  <strong>Φυσικοί αριθμοί</strong> είναι οι αριθμοί 0, 1, 2, 3... και συνεχίζουν χωρίς τέλος. Τους χρησιμοποιούμε για να μετράμε πλήθος αντικειμένων.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>💡 <strong className="text-emerald-900">Αξία Θέσης:</strong> Η αξία κάθε ψηφίου εξαρτάται από τη <strong>θέση</strong> του στον αριθμό. Όσο πιο αριστερά πάμε, τόσο μεγαλύτερη είναι η αξία.</p>
                  <p>🗂️ <strong className="text-blue-900">Περίοδοι:</strong> Χωρίζουμε τους μεγάλους αριθμούς σε τριάδες ψηφίων (Μονάδες, Χιλιάδες, Εκατομμύρια, Δισεκατομμύρια).</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-3xl md:text-4xl tracking-wide">
                  <div className="text-amber-300 pb-2">Κάθε Περίοδος έχει:</div>
                  <div className="w-48 md:w-56 h-1.5 bg-white rounded-full my-2"></div>
                  <div className="text-white pt-2 text-2xl font-bold">Εκατοντάδες • Δεκάδες • Μονάδες</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & INPUT */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[420px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Πίνακας Αξίας Θέσης
                </h3>
                <p className="text-gray-500 text-sm">
                  Πληκτρολόγησε έναν μεγάλο αριθμό για να δεις πώς αναλύεται στις περιόδους του.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full flex flex-col items-center justify-center shadow-inner my-auto">
                <input 
                  type="number" 
                  value={number}
                  onChange={(e) => setNumber(e.target.value.slice(0, 12))}
                  className="text-3xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full max-w-sm tracking-wider text-blue-600"
                  placeholder="Γράψε έναν αριθμό..."
                />
              </div>

              {/* Μαθηματική Καταγραφή / Ανάλυση */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl max-h-[140px] overflow-y-auto font-mono text-xs md:text-sm text-left space-y-1">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block font-sans mb-1">Ανάλυση σε δυνάμεις του 10:</span>
                {digits.map((digit, i) => {
                  if (digit === '0') return null;
                  const power = 11 - i;
                  const multiplier = Math.pow(10, power).toLocaleString('el-GR');
                  return (
                    <div key={i} className="flex items-center gap-1.5 text-slate-600">
                      <span className="text-emerald-600 font-bold">{digit}</span>
                      <span className="text-slate-400">×</span>
                      <span>{multiplier}</span>
                      <span className="text-slate-400 text-[11px]">(10^{power})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΠΙΝΑΚΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[420px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              <div className="w-full overflow-x-auto pb-2 my-auto">
                <div className="min-w-[500px] bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mx-auto">
                  
                  {/* Header Περιόδων */}
                  <div className="grid grid-cols-4 text-white text-center font-black text-[11px] uppercase tracking-wide">
                    {periods.map((p, i) => (
                      <div key={i} className={`${p.color} py-2.5 border-r border-white/20 last:border-0`}>
                        {p.name}
                      </div>
                    ))}
                  </div>

                  {/* Header Τάξεων */}
                  <div className="grid grid-cols-12 text-[9px] font-black text-slate-400 text-center border-b bg-slate-50 uppercase py-1.5">
                    {[...Array(4)].map((_, i) => (
                      <span key={i} className="contents">
                        <div className="border-r">Ε</div>
                        <div className="border-r">Δ</div>
                        <div className="border-r">Μ</div>
                      </span>
                    ))}
                  </div>

                  {/* Τα Ψηφία του Αριθμού */}
                  <div className="grid grid-cols-12 text-center items-center">
                    {digits.map((digit, i) => {
                      const periodIdx = Math.floor(i / 3);
                      // Σβήνουμε οπτικά τα μηδενικά που βρίσκονται στην αρχή του αριθμού
                      const isLeadingZero = digit === '0' && i < digits.findIndex(d => d !== '0');
                      
                      return (
                        <div 
                          key={i} 
                          className={`py-6 text-2xl font-black border-r last:border-0 transition-all duration-300 
                            ${periods[periodIdx].light} 
                            ${isLeadingZero ? 'text-slate-200' : 'text-slate-800'}`}
                        >
                          {digit}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Τα ψηφία οργανώνονται αυτόματα σε Περιόδους (τριάδες) και Τάξεις.</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικοί Φυσικοί Αριθμοί ΣΤ' Δημοτικού.</p>
      </footer>

      {/* CSS Hack για αφαίρεση των arrows στο input number */}
      <style jsx global>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

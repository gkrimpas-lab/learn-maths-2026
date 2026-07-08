// pages/st-dimotikou/1-fisikoi-arithmoi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState("1234567890");

  // Συνάρτηση που χωρίζει τον αριθμό σε ψηφία και τα τοποθετεί σε τάξεις
  const getDigits = () => {
    // Παίρνουμε τα τελευταία 12 ψηφία (μέχρι δισεκατομμύρια)
    const padded = number.padStart(12, '0').slice(-12);
    return padded.split('');
  };

  const digits = getDigits();

  // Ορισμός Περιόδων και Τάξεων
  const periods = [
    { name: "Δισεκατομμύρια", color: "bg-purple-600", light: "bg-purple-50" },
    { name: "Εκατομμύρια", color: "bg-rose-600", light: "bg-rose-50" },
    { name: "Χιλιάδες", color: "bg-blue-600", light: "bg-blue-50" },
    { name: "Μονάδες", color: "bg-emerald-600", light: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans">
      <Head>
        <title>🔢 Φυσικοί Αριθμοί - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </Link>
          {/* Πιστό Κουμπί Επιστροφής (Απαλό γκρι οβάλ με BACK εικονίδιο) */}
            <Link href="/e-dimotikou" className="bg-[#f1f1f4] hover:bg-[#e4e4e8] text-[#4a4a52] px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 tracking-wide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 stroke-[3] stroke-current">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Επιστροφή
            </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        
        {/* ΘΕΩΡΙΑ */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-xl">📖</span>
            Οι Φυσικοί Αριθμοί
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                <strong>Φυσικοί αριθμοί</strong> είναι οι αριθμοί 0, 1, 2, 3, 4, ... και συνεχίζουν χωρίς τέλος. Τους χρησιμοποιούμε για να μετράμε πλήθος αντικειμένων.
              </p>
              <div className="bg-blue-50 p-4 rounded-2xl border-l-4 border-blue-500">
                <p className="text-sm">
                  💡 <strong>Αξία Θέσης:</strong> Σε έναν φυσικό αριθμό, η αξία κάθε ψηφίου εξαρτάται από τη <strong>θέση</strong> του. Όσο πιο αριστερά είναι ένα ψηφίο, τόσο μεγαλύτερη αξία έχει.
                </p>
              </div>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h4 className="font-bold text-amber-900 mb-2">Οι Περίοδοι των Αριθμών:</h4>
              <ul className="text-sm space-y-2 text-amber-800">
                <li>• Κάθε 3 ψηφία σχηματίζουν μια <strong>Περίοδο</strong>.</li>
                <li>• Κάθε περίοδος έχει 3 τάξεις: <strong>Μονάδες, Δεκάδες, Εκατοντάδες</strong>.</li>
                <li>• Διαβάζουμε έναν μεγάλο αριθμό ξεκινώντας από αριστερά, λέγοντας το όνομα της περιόδου στο τέλος κάθε τριάδας.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΠΙΝΑΚΑΣ ΑΞΙΩΝ */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-slate-800">Πίνακας Αξίας Θέσης Ψηφίου</h3>
            <p className="text-slate-500">Πληκτρολόγησε έναν αριθμό για να δεις την ανάλυσή του</p>
          </div>

          <div className="flex justify-center mb-8">
            <input 
              type="number" 
              value={number}
              onChange={(e) => setNumber(e.target.value.slice(0, 12))}
              className="text-4xl font-black text-center p-4 bg-white border-4 border-blue-200 rounded-3xl shadow-xl focus:border-blue-500 outline-none transition-all w-full max-w-md tracking-widest text-blue-600"
              placeholder="Γράψε έναν αριθμό..."
            />
          </div>

          {/* ΠΙΝΑΚΑΣ */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[800px] bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
              {/* Header Περιόδων */}
              <div className="grid grid-cols-4 text-white text-center font-bold">
                {periods.map((p, i) => (
                  <div key={i} className={`${p.color} py-3 border-r border-white/20 last:border-0 uppercase tracking-wider text-xs`}>
                    Περίοδος {p.name}
                  </div>
                ))}
              </div>

              {/* Header Τάξεων */}
              <div className="grid grid-cols-12 text-[10px] md:text-xs font-black text-slate-400 text-center border-b uppercase">
                {[...Array(4)].map((_, i) => (
                  <>
                    <div key={`E-${i}`} className="py-2 border-r">Εκατ.</div>
                    <div key={`D-${i}`} className="py-2 border-r">Δεκ.</div>
                    <div key={`M-${i}`} className="py-2 border-r">Μον.</div>
                  </>
                ))}
              </div>

              {/* Τα Ψηφία */}
              <div className="grid grid-cols-12 text-center items-center">
                {digits.map((digit, i) => {
                  const periodIdx = Math.floor(i / 3);
                  const isZero = digit === '0' && i < digits.findIndex(d => d !== '0');
                  return (
                    <div 
                      key={i} 
                      className={`py-8 text-4xl font-black border-r last:border-0 transition-all duration-500 
                        ${periods[periodIdx].light} 
                        ${isZero ? 'text-slate-200' : 'text-slate-800'}`}
                    >
                      {digit}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ΑΝΑΛΥΣΗ ΣΕ ΔΥΝΑΜΕΙΣ ΤΟΥ 10 */}
          <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-2xl">
            <h4 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🧬</span> Ανάλυση Αριθμού:
            </h4>
            <div className="font-mono text-sm md:text-base leading-loose overflow-x-auto">
              {digits.map((digit, i) => {
                if (digit === '0') return null;
                const power = 11 - i;
                const multiplier = Math.pow(10, power).toLocaleString('el-GR');
                return (
                  <div key={i} className="flex items-center gap-2 py-1 border-b border-white/5 last:border-0">
                    <span className="text-emerald-500 font-black">{digit}</span>
                    <span className="text-slate-400">×</span>
                    <span>{multiplier}</span>
                    <span className="text-slate-500 text-xs">(10^{power})</span>
                    {i !== digits.findLastIndex(d => d !== '0') && <span className="text-emerald-500">+</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-white border-t py-10 text-center mt-20">
        <p className="text-slate-400 text-sm">© 2026 LearnMaths.gr - Η μάθηση γίνεται παιχνίδι!</p>
      </footer>

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

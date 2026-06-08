import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ============================================================================
// ΚΕΝΤΡΙΚΕΣ ΡΥΘΜΙΣΕΙΣ ΕΦΑΡΜΟΓΗΣ (CONFIG)
// ============================================================================
const CONFIG = {
  largeNumbers: {
    maxDisksPerColumn: 9, // Το όριο πριν το 10ο που προκαλεί την αλλαγή θέσης
    initialValues: {
      EX: 1, // Εκατοντάδες Χιλιάδες
      DX: 3, // Δεκάδες Χιλιάδες
      X: 5,  // Μονάδες Χιλιάδες
      E: 4,  // Εκατοντάδες
      D: 2,  // Δεκάδες
      M: 7   // Μονάδες
    }
  }
};

export default function DDimotikou() {
  const [activeTab, setActiveTab] = useState('large_numbers');

  // States για τις μάρκες του κάθε ψηφίου
  const [disks, setDisks] = useState(CONFIG.largeNumbers.initialValues);

  // Συνάρτηση αλλαγής πλήθους μαρκών
  const updateDigits = (column, increment) => {
    setDisks((prev) => {
      let newValue = prev[column] + increment;
      if (newValue < 0) newValue = 0;
      if (newValue > 9) newValue = 9; // Κλειδώνουμε στο 9 για να κάνουμε χειροκίνητη/οπτική συζήτηση στην τάξη για το 10
      return { ...prev, [column]: newValue };
    });
  };

  // Υπολογισμός του συνολικού αριθμού
  const totalNumber = 
    disks.EX * 100000 + 
    disks.DX * 10000 + 
    disks.X * 1000 + 
    disks.E * 100 + 
    disks.D * 10 + 
    disks.M * 1;

  // Συνάρτηση για μορφοποίηση με τελεία (π.χ. 135.427)
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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

      {/* ΜΕΝΟΥ ΚΑΡΤΕΛΩΝ */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex bg-white p-2 rounded-xl shadow-sm gap-2 w-full lg:w-max">
          <button onClick={() => setActiveTab('large_numbers')} className={`px-5 py-2 text-center rounded-lg font-bold transition duration-200 text-xs sm:text-sm ${activeTab === 'large_numbers' ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
            💎 1. Μεγάλοι Αριθμοί
          </button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* ΚΑΡΤΕΛΑ 1: ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ */}
        {activeTab === 'large_numbers' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-fade-in">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">💎 Η Αξία Θέσης στους Μεγάλους Αριθμούς</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Στο δεκαδικό μας σύστημα, η αξία κάθε ψηφίου εξαρτάται από τη <strong>θέση</strong> του στον αριθμό. Κάθε φορά που πηγαίνουμε μια θέση αριστερά, η αξία <strong>δεκαπλασιάζεται</strong>!
                </p>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 text-xs text-teal-900 leading-relaxed">
                  <p>💡 <strong>Το μυστικό των 10:</strong> 10 Μονάδες γίνονται 1 Δεκάδα. 10 Δεκάδες γίνονται 1 Εκατοντάδα. 10 Εκατοντάδες γίνονται 1 Μονάδα Χιλιάδας, και ούτω καθεξής!</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center">
                <h3 className="font-bold text-sm text-teal-100 mb-1">📊 Κλάσεις Αριθμών</h3>
                <p className="text-xs opacity-95 leading-relaxed">
                  Για να διαβάζουμε εύκολα τους μεγάλους αριθμούς, τους χωρίζουμε σε τριάδες ψηφίων (από δεξιά προς τα αριστερά) βάζοντας τελεία. Οι τριάδες αυτές λέγονται <strong>κλάσεις</strong>.
                </p>
              </div>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟΣ ΑΒΑΚΑΣ / ΠΙΝΑΚΑΣ */}
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 space-y-8">
              
              {/* Πίνακας Εμφάνισης Αποτελέσματος */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-xl mx-auto text-center space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Ο Αριθμός σου</span>
                <div className="text-4xl md:text-5xl font-mono font-black text-teal-600 tracking-tight">
                  {formatNumber(totalNumber)}
                </div>
                <div className="text-xs text-gray-500 font-medium italic pt-2 border-t border-dashed">
                  Διαβάζεται: <span className="text-teal-700 font-bold">
                    {totalNumber === 0 ? 'Μηδέν' : 'Εκατόν τριάντα πέντε χιλιάδες τετρακόσια είκοσι επτά (παράδειγμα)'}
                  </span>
                </div>
              </div>

              {/* ΟΠΤΙΚΟΣ ΨΗΦΙΑΚΟΣ ΑΒΑΚΑΣ (SVG) */}
              <div className="bg-white p-6 rounded-2xl border shadow-sm overflow-x-auto">
                <div className="min-w-[600px]">
                  
                  {/* Επικεφαλίδες Κλάσεων */}
                  <div className="grid grid-cols-6 gap-2 text-center font-bold text-[11px] mb-2">
                    <div className="col-span-3 bg-emerald-100 text-emerald-800 py-1 rounded-t-lg border-b-2 border-emerald-400">ΚΛΑΣΗ ΧΙΛΙΑΔΩΝ</div>
                    <div className="col-span-3 bg-teal-100 text-teal-800 py-1 rounded-t-lg border-b-2 border-teal-400">ΚΛΑΣΗ ΜΟΝΑΔΩΝ</div>
                  </div>

                  {/* Επικεφαλίδες Ψηφίων */}
                  <div className="grid grid-cols-6 gap-2 text-center text-[10px] font-black text-gray-500 font-mono mb-4">
                    <div className="bg-slate-50 p-2 rounded border">ΕΧ<br/><span className="font-normal text-[8px] text-gray-400">100.000</span></div>
                    <div className="bg-slate-50 p-2 rounded border">ΔΧ<br/><span className="font-normal text-[8px] text-gray-400">10.000</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Χ<br/><span className="font-normal text-[8px] text-gray-400">1.000</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Ε<br/><span className="font-normal text-[8px] text-gray-400">100</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Δ<br/><span className="font-normal text-[8px] text-gray-400">10</span></div>
                    <div className="bg-slate-50 p-2 rounded border">Μ<br/><span className="font-normal text-[8px] text-gray-400">1</span></div>
                  </div>

                  {/* Στήλες Άβακα με Μάρκες */}
                  <div className="grid grid-cols-6 gap-4 h-48 bg-slate-50/50 rounded-2xl border p-4 items-end relative">
                    
                    {/* Στήλη ΕΧ */}
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.EX }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-emerald-500 rounded-full border border-emerald-600 shadow-sm animate-fade-in"></div>)}
                    </div>

                    {/* Στήλη ΔΧ */}
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.DX }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-emerald-400 rounded-full border border-emerald-500 shadow-sm animate-fade-in"></div>)}
                    </div>

                    {/* Στήλη Χ */}
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r-2 border-slate-300">
                      {Array.from({ length: disks.X }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-lime-400 rounded-full border border-lime-500 shadow-sm animate-fade-in"></div>)}
                    </div>

                    {/* Στήλη Ε */}
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.E }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-teal-500 rounded-full border border-teal-600 shadow-sm animate-fade-in"></div>)}
                    </div>

                    {/* Στήλη Δ */}
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative border-r border-dashed">
                      {Array.from({ length: disks.D }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-teal-400 rounded-full border border-teal-500 shadow-sm animate-fade-in"></div>)}
                    </div>

                    {/* Στήλη Μ */}
                    <div className="flex flex-col-reverse items-center h-full justify-start gap-1 relative">
                      {Array.from({ length: disks.M }).map((_, i) => <div key={i} className="w-10 h-3.5 bg-cyan-400 rounded-full border border-cyan-500 shadow-sm animate-fade-in"></div>)}
                    </div>

                  </div>

                  {/* Χειριστήρια + / - κάτω από κάθε στήλη */}
                  <div className="grid grid-cols-6 gap-4 text-center mt-4">
                    {['EX', 'DX', 'X', 'E', 'D', 'M'].map((col) => (
                      <div key={col} className="flex flex-col items-center gap-1 bg-white p-2 rounded-xl border shadow-sm">
                        <div className="text-sm font-black font-mono text-slate-700">{disks[col]}</div>
                        <div className="flex gap-1">
                          <button onClick={() => updateDigits(col, -1)} className="bg-slate-100 hover:bg-slate-200 font-bold px-2 py-0.5 rounded text-xs text-gray-600 transition shadow-sm">-</button>
                          <button onClick={() => updateDigits(col, 1)} className="bg-slate-100 hover:bg-slate-200 font-bold px-2 py-0.5 rounded text-xs text-gray-600 transition shadow-sm">+</button>
                        </div>
                      </div>
                    ))}
                  </div>

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
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}

// pages/st-dimotikou/6-pollaplasiasmos.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function PollaplasiasmosPage() {
  const [activeTab, setActiveTab] = useState('antimetathetiki'); // 'antimetathetiki', 'prosetairistiki', 'epimeristiki'
  
  // Κατάσταση για Αντιμεταθετική
  const [rotated, setRotated] = useState(false);
  const rows = rotated ? 3 : 5;
  const cols = rotated ? 5 : 3;

  // Κατάσταση για Επιμεριστική
  const [distA, setPropA] = useState("4");
  const [distB, setPropB] = useState("3");
  const [distC, setPropC] = useState("2");

  const valA = parseFloat(distA) || 0;
  const valB = parseFloat(distB) || 0;
  const valC = parseFloat(distC) || 0;

  // Βοηθητική συνάρτηση ελέγχου ορίων (Max 2 ψηφία για καθαρό UI στα σχήματα)
  const handleInputChange = (val, setter) => {
    const cleanVal = val.replace(/[^0-9.]/g, '');
    if (cleanVal.length <= 2) {
      setter(cleanVal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>✖️ Ιδιότητες Πολλαπλασιασμού - LearnMaths.gr</title>
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
                  <span>📖</span> Θεωρία: Ιδιότητες Πολλαπλασιασμού
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Ο πολλαπλασιασμός είναι μια σύντομη πρόσθεση ίσων προσθετέων. Για να κάνουμε πιο γρήγορα τις πράξεις, χρησιμοποιούμε τρεις βασικές ιδιότητες.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🔄 <strong>Αντιμεταθετική:</strong> Μπορούμε να αλλάξουμε τη σειρά των παραγόντων ($α \cdot β = β \cdot α$).</p>
                  <p>🧠 <strong>Προσεταιριστική:</strong> Σε έναν πολλαπλασιασμό τριών αριθμών, μπορούμε να επιλέξουμε ποια ζευγάρια θα πολλαπλασιάσουμε πρώτα.</p>
                  <p>📐 <strong>Επιμεριστική:</strong> Μπορούμε να πολλαπλασιάσουμε έναν αριθμό με ένα άθροισμα, πολλαπλασιάζοντάς τον ξεχωριστά με κάθε προσθετέο ($α \cdot (β + γ) = α \cdot β + α \cdot γ$).</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md text-center py-10 flex flex-col justify-center items-center gap-3">
                <span className="text-amber-300 font-black text-lg">✨ Το «Ένα» και το «Μηδέν»</span>
                <p className="text-xs md:text-sm text-indigo-50 leading-relaxed font-medium max-w-sm">
                  • Το <strong>1</strong> είναι το ουδέτερο στοιχείο: Κάθε αριθμός που πολλαπλασιάζεται με το 1 παραμένει ο ίδιος ($5 \cdot 1 = 5$).<br/>
                  • Το <strong>0</strong> είναι το απορροφητικό στοιχείο: Κάθε αριθμός που πολλαπλασιάζεται με το 0 γίνεται μηδέν ($5 \cdot 0 = 0$).
                </p>
              </div>
            </div>
          </div>

          {/* TABS ΕΝΑΛΛΑΓΗΣ */}
          <div className="flex flex-wrap justify-center bg-gray-200/60 p-1.5 rounded-2xl max-w-xl mx-auto shadow-inner gap-1">
            <button  
              onClick={() => setActiveTab('antimetathetiki')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'antimetathetiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              🔄 Αντιμεταθετική
            </button>
            <button  
              onClick={() => setActiveTab('prosetairistiki')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'prosetairistiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📦 Προσεταιριστική
            </button>
            <button  
              onClick={() => setActiveTab('epimeristiki')}
              className={`flex-1 min-w-[140px] py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all duration-200 ${activeTab === 'epimeristiki' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              📐 Επιμεριστική
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              
              {activeTab === 'antimetathetiki' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Αντιμεταθετική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Πάτα το κουμπί για να στρίψεις το πλέγμα των αντικειμένων δεξιά. Θα δεις ότι η πράξη αλλάζει, αλλά το σύνολο μένει ίδιο.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full flex flex-col items-center justify-center gap-4 shadow-inner my-auto">
                    <div className="font-mono font-black text-xl md:text-2xl bg-white p-4 rounded-xl border shadow-sm text-center w-full max-w-xs text-slate-700">
                      {rotated ? "3 × 5 = 15" : "5 × 3 = 15"}
                    </div>
                    <button
                      onClick={() => setRotated(!rotated)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition-all flex items-center gap-2"
                    >
                      🔄 Περιστροφή Πλέγματος
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs md:text-sm font-bold text-emerald-900 text-center shadow-inner">
                    🎯 Είτε μετρήσουμε {rotated ? "3 σειρές από 5 κουκκίδες" : "5 σειρές από 3 κουκκίδες"}, το αποτέλεσμα είναι πάντα 15!
                  </div>
                </>
              )}

              {activeTab === 'prosetairistiki' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Προσεταιριστική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Όταν πολλαπλασιάζουμε 3 αριθμούς, μπορούμε να κάνουμε πρώτα όποιο ζευγάρι μάς βολεύει στο μυαλό.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col gap-3 shadow-inner my-auto font-mono text-sm md:text-base">
                    <span className="text-center font-sans text-xs font-bold text-slate-400 block mb-1 uppercase tracking-wide">Υπολογισμός του 2 × 4 × 3:</span>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
                      <span className="font-bold text-slate-500 font-sans">Τρόπος 1ος:</span>
                      <span>(2 × 4) × 3 = 8 × 3 = <strong className="text-purple-600">24</strong></span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border shadow-sm flex items-center justify-between">
                      <span className="font-bold text-slate-500 font-sans">Τρόπος 2ος:</span>
                      <span>2 × (4 × 3) = 2 × 12 = <strong className="text-purple-600">24</strong></span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-xs md:text-sm font-medium text-blue-900 shadow-inner">
                    💡 <strong>Συμβουλή:</strong> Στο σχολείο επιλέγουμε να προσεταιριστούμε πρώτα τους αριθμούς που φτιάχνουν «στρογγυλά» γινόμενα (π.χ. $2 \cdot 5 = 10$ ή $4 \cdot 25 = 100$) για ευκολία!
                  </div>
                </>
              )}

              {activeTab === 'epimeristiki' && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Επιμεριστική Ιδιότητα</h3>
                    <p className="text-gray-500 text-sm">Άλλαξε τις διαστάσεις του σχήματος για να δεις πώς ο πολλαπλασιασμός «επιμερίζεται» (μοιράζεται) στο άθροισμα.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl w-full flex flex-col gap-4 shadow-inner my-auto">
                    <div className="flex justify-center gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Ύψος (α)</span>
                        <input type="text" value={distA} onChange={(e) => handleInputChange(e.target.value, setPropA)} className="w-16 p-1.5 border border-gray-300 rounded-xl text-center font-black text-blue-600" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Πράσινο (β)</span>
                        <input type="text" value={distB} onChange={(e) => handleInputChange(e.target.value, setPropB)} className="w-16 p-1.5 border border-gray-300 rounded-xl text-center font-black text-emerald-600" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Μπλε (γ)</span>
                        <input type="text" value={distC} onChange={(e) => handleInputChange(e.target.value, setPropC)} className="w-16 p-1.5 border border-gray-300 rounded-xl text-center font-black text-cyan-600" />
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border shadow-sm font-mono text-xs md:text-sm text-center space-y-1 text-slate-700">
                      <div>Oλόκληρο: {valA} × ({valB} + {valC}) = {valA} × {valB + valC} = <strong>{valA * (valB + valC)}</strong></div>
                      <div className="text-slate-300">───────────────</div>
                      <div>Επιμερισμένα: ({valA} × {valB}) + ({valA} × {valC}) = {valA * valB} + {valA * valC} = <strong>{valA * valB + valA * valC}</strong></div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {activeTab === 'antimetathetiki' && (
                <div className="my-auto flex flex-col items-center gap-4 transition-all duration-300">
                  <div className="grid gap-2 p-4 bg-slate-50 rounded-2xl border" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                    {[...Array(rows * cols)].map((_, i) => (
                      <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm animate-fade-in" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-400">Διάταξη: {rows} γραμμές × {cols} στήλες</span>
                </div>
              )}

              {activeTab === 'prosetairistiki' && (
                <div className="my-auto flex flex-col items-center gap-4 w-full max-w-[280px]">
                  {/* Σχεδίαση 3D αναπαράστασης με SVG κύβου (2 στρώματα των 4x3) */}
                  <svg viewBox="0 0 200 180" className="w-full h-auto overflow-visible drop-shadow-md">
                    {/* Πίσω Στρώμα (12 Blocks) */}
                    <g transform="translate(15, -15)" className="opacity-70 fill-indigo-500 stroke-indigo-700 stroke-[0.5]">
                      <rect x="20" y="40" width="120" height="90" rx="4" />
                      <path d="M 20 40 L 140 130 M 50 40 L 50 130 M 80 40 L 80 130 M 110 40 L 110 130 M 20 70 L 140 70 M 20 100 L 140 100" className="stroke-indigo-600/30" />
                    </g>
                    {/* Μπροστά Στρώμα (12 Blocks) */}
                    <g className="fill-blue-500 stroke-blue-700 stroke-[0.5]">
                      <rect x="20" y="40" width="120" height="90" rx="4" />
                      <path d="M 20 40 L 140 130 M 50 40 L 50 130 M 80 40 L 80 130 M 110 40 L 110 130 M 20 70 L 140 70 M 20 100 L 140 100" className="stroke-blue-600/30" />
                    </g>
                    <text x="80" y="155" textAnchor="middle" className="text-[10px] font-bold fill-slate-400 font-sans uppercase">2 στρώματα × 4 πλάτος × 3 βάθος = 24</text>
                  </svg>
                </div>
              )}

              {activeTab === 'epimeristiki' && (
                <div className="my-auto flex flex-col items-center gap-4 w-full px-4">
                  {/* Δυναμικό Ορθογώνιο Εμβαδού */}
                  <div className="border-2 border-slate-700 rounded-xl overflow-hidden flex w-full h-32 text-white font-mono font-black text-base md:text-lg shadow-md">
                    {/* Ζώνη Β (Πράσινη) */}
                    <div className="bg-emerald-500 flex flex-col justify-center items-center transition-all duration-300" style={{ flexGrow: Math.max(valB, 1) }}>
                      <span>{valA} × {valB}</span>
                      <span className="text-xs font-normal opacity-85">({valA * valB})</span>
                    </div>
                    {/* Ζώνη C (Μπλε) */}
                    <div className="bg-cyan-500 flex flex-col justify-center items-center transition-all duration-300 border-l-2 border-dashed border-white/50" style={{ flexGrow: Math.max(valC, 1) }}>
                      <span>{valA} × {valC}</span>
                      <span className="text-xs font-normal opacity-85">({valA * valC})</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Συνολικό Εμβαδόν Επιφάνειας = {valA * valB + valA * valC}</span>
                </div>
              )}

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Οι ιδιότητες μάς βοηθούν να σπάμε μεγάλους αριθμούς σε πιο απλά γινόμενα με το μυαλό!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικός Πολλαπλασιασμός ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

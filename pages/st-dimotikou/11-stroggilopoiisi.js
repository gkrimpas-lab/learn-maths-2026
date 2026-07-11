// pages/st-dimotikou/11-stroggilopoiisi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function StroggilopoiisiPage() {
  // Αρχικός αριθμός για το διαδραστικό παράδειγμα
  const [inputValue, setInputValue] = useState("43.6");
  const [roundPlace, setRoundPlace] = useState("units"); // units, tens, tenths

  // Καθαρισμός εισαγωγής ώστε να δέχεται μόνο έγκυρους δεκαδικούς/φυσικούς
  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9.]/g, '');
    setInputValue(clean);
  };

  const num = parseFloat(inputValue) || 0;

  // Υπολογισμός ορίων και αποτελέσματος στρογγυλοποίησης για την οπτική αναπαράσταση
  let lowerBound = 0;
  let upperBound = 0;
  let roundedValue = 0;
  let placeName = "";
  let keyDigit = 0;

  if (roundPlace === "units") {
    placeName = "Μονάδες";
    lowerBound = Math.floor(num);
    upperBound = lowerBound + 1;
    roundedValue = Math.round(num);
    // Το κλειδί είναι το πρώτο δεκαδικό ψηφίο (δέκατα)
    keyDigit = Math.floor((num % 1) * 10);
  } else if (roundPlace === "tenths") {
    placeName = "Δέκατα";
    lowerBound = Math.floor(num * 10) / 10;
    upperBound = parseFloat((lowerBound + 0.1).toFixed(1));
    roundedValue = parseFloat(Math.round(num * 10) / 10);
    // Το κλειδί είναι το δεύτερο δεκαδικό ψηφίο (εκατοστά)
    keyDigit = Math.floor(((num * 10) % 1) * 10);
  } else {
    placeName = "Δεκάδες";
    lowerBound = Math.floor(num / 10) * 10;
    upperBound = lowerBound + 10;
    roundedValue = Math.round(num / 10) * 10;
    // Το κλειδί είναι το ψηφίο των μονάδων
    keyDigit = Math.floor(num % 10);
  }

  // Υπολογισμός ποσοστού θέσης πάνω στην αριθμογραμμή (0% έως 100%)
  const range = upperBound - lowerBound;
  let percentage = range > 0 ? ((num - lowerBound) / range) * 100 : 0;
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  const isUp = keyDigit >= 5;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🎯 Στρογγυλοποίηση Αριθμών - LearnMaths.gr</title>
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ & ΕΝΝΟΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                    <span>📖</span> Τι είναι η Στρογγυλοποίηση;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    <strong>Στρογγυλοποίηση</strong> είναι η μαθηματική διαδικασία στην οποία αντικαθιστούμε έναν αριθμό με έναν άλλον, λίγο μικρότερο ή λίγο μεγαλύτερο, που είναι όμως <strong>πιο «στρογγυλός»</strong> και μας βολεύει καλύτερα στους υπολογισμούς.
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Τη χρησιμοποιούμε καθημερινά όταν θέλουμε να κάνουμε γρήγορες εκτιμήσεις (π.χ. <em>«το παιχνίδι κοστίζει περίπου 20€»</em> αντί για 19.85€).
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-4 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-base md:text-lg block border-b border-white/20 pb-1">⚡ Ο Κανόνας του «Ψηφίου-Κλειδιού»</span>
                <p className="text-xs md:text-sm text-indigo-50 leading-relaxed">
                  Κοιτάζουμε πάντα το <strong>αμέσως επόμενο ψηφίο</strong> στα δεξιά από αυτό που θέλουμε να στρογγυλοποιήσουμε:
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="block text-amber-300 font-bold">🔴 Αν είναι 0, 1, 2, 3, 4</span>
                    Ο αριθμός στρογγυλοποιείται <strong>προς τα κάτω</strong> (το ψηφίο μένει ίδιο).
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                    <span className="block text-emerald-300 font-bold">🟢 Αν είναι 5, 6, 7, 8, 9</span>
                    Ο αριθμός στρογγυλοποιείται <strong>προς τα πάνω</strong> (το ψηφίο αυξάνεται κατά 1).
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ & ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUT & ΕΠΙΛΟΓΗ ΨΗΦΙΟΥ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δοκίμασε έναν Αριθμό!</h3>
                  <p className="text-gray-500 text-xs">Γράψε έναν φυσικό ή δεκαδικό αριθμό για να δεις τη στρογγυλοποίηση στην πράξη.</p>
                </div>

                <div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-2xl font-mono font-black text-center p-3 bg-slate-50 border-2 border-blue-200 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 43.6"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Στρογγυλοποίηση στα / στις:</span>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setRoundPlace("units")}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${roundPlace === "units" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      🎯 Μονάδες (πλησιέστερος ακέραιος)
                    </button>
                    <button
                      onClick={() => setRoundPlace("tenths")}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${roundPlace === "tenths" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      🧪 Δέκατα (1ο δεκαδικό ψηφίο)
                    </button>
                    <button
                      onClick={() => setRoundPlace("tens")}
                      className={`w-full text-left px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${roundPlace === "tens" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      📦 Δεκάδες (πλησιέστερη 10άδα)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200 flex items-start gap-1.5 leading-snug">
                <span>💻</span>
                <span><strong>Σημείωση Πληκτρολογίου:</strong> Για τους δεκαδικούς αριθμούς, χρησιμοποιήστε την τελεία <strong>`.`</strong> αντί για κόμμα.</span>
              </div>

            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΖΩΝΤΑΝΗ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ (ΑΡΙΘΜΟΓΡΑΜΜΗ) */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[460px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οπτική Αναπαράσταση:</span>
                <div className="text-lg md:text-xl font-bold text-slate-700 mt-1">
                  Πού βρίσκεται ο αριθμός <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">{num}</span>;
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ - "Η ΤΡΑΜΠΑΛΑ / Ο ΛΟΦΟΣ" */}
              <div className="w-full max-w-xl mx-auto my-auto py-10 px-4">
                
                {/* Η Γραμμή */}
                <div className="h-2 bg-gradient-to-r from-red-200 via-amber-200 to-emerald-200 rounded-full relative shadow-inner">
                  
                  {/* Αριστερό Όριο (Κάτω) */}
                  <div className="absolute left-0 -top-8 text-center -translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-sm md:text-base">{lowerBound}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Κάτω Όριο</span>
                  </div>

                  {/* Δεξί Όριο (Πάνω) */}
                  <div className="absolute right-0 -top-8 text-center translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-sm md:text-base">{upperBound}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Πάνω Όριο</span>
                  </div>

                  {/* Μέση (Το όριο του 5) */}
                  <div className="absolute left-1/2 top-0 h-4 w-0.5 bg-slate-300 -translate-y-1">
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-1 rounded">
                      {parseFloat(((lowerBound + upperBound) / 2).toFixed(2))}
                    </span>
                  </div>

                  {/* Ο Δείκτης του αριθμού μας */}
                  <div 
                    className="absolute -top-4 -translate-x-1/2 transition-all duration-300 ease-out flex flex-col items-center"
                    style={{ left: `${percentage}%` }}
                  >
                    {/* Μπαλόνι με τον αριθμό */}
                    <span className="bg-blue-600 text-white text-xs font-mono font-black px-2 py-1 rounded-lg shadow-md animate-bounce">
                      {num}
                    </span>
                    {/* Καρφίτσα/Δείκτης */}
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow mt-1"></div>
                  </div>

                </div>

                {/* Κατεύθυνση Στρογγυλοποίησης (Βέλος) */}
                <div className="mt-14 flex justify-between items-center w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 font-medium">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-black block">Ψηφίο-Κλειδί:</span>
                    <span className={`text-base font-black font-mono ${isUp ? 'text-slate-400' : 'text-red-500 bg-red-50 px-2 py-0.5 rounded-lg'}`}>
                      {keyDigit}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center mx-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {isUp ? "Στρογγυλοποίηση Πάνω ➔" : "⮨ Στρογγυλοποίηση Κάτω"}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 text-center">
                      Επειδή το επόμενο ψηφίο είναι {isUp ? "≥ 5" : "< 5"}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-black block">Στα / στις {placeName}:</span>
                    <span className="text-base font-black font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {roundedValue}
                    </span>
                  </div>
                </div>

              </div>

              {/* Τελικό Αποτέλεσμα / Κάρτα */}
              <div className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                <span className="text-xl">🎯</span>
                <span className="text-sm font-sans uppercase tracking-wider">Τελικό Αποτέλεσμα:</span>
                <span className="text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">{roundedValue}</span>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>🔍 Μικρό μυστικό: Όταν στρογγυλοποιούμε, όλα τα ψηφία δεξιά από τη θέση στρογγυλοποίησης γίνονται μηδέν!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Στρογγυλοποίηση Αριθμών - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

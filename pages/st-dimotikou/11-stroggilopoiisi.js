// pages/st-dimotikou/11-stroggilopoiisi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function StroggilopoiisiPage() {
  // Αρχικός αριθμός για το διαδραστικό παράδειγμα
  const [inputValue, setInputValue] = useState("432.6583");
  const [roundPlace, setRoundPlace] = useState("units"); // hundreds, tens, units, tenths, hundredths, thousandths

  // Ασφαλής έλεγχος εισαγωγής αριθμού (Μάξ 6 ακέραια και μάξ 4 δεκαδικά ψηφία)
  const handleInputChange = (val) => {
    const clean = val.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    const intPart = parts[0] || "";
    const decPart = parts[1] || "";

    if ((clean.match(/\./g) || []).length <= 1) {
      // Αυστηρός περιορισμός: έως 6 ψηφία στο ακέραιο μέρος και έως 4 στο δεκαδικό
      if (intPart.length <= 6 && (!parts.hasOwnProperty(1) || decPart.length <= 4)) {
        setInputValue(clean);
      }
    }
  };

  const num = parseFloat(inputValue) || 0;

  // Μεταβλητές υπολογισμού
  let lowerBound = 0;
  let upperBound = 0;
  let roundedValue = 0;
  let placeName = "";
  let keyDigit = 0;
  let precisionDigits = 0; // Για το σωστό formatting στο .toFixed()

  // Υπολογισμός ορίων, αποτελέσματος και ψηφίου-κλειδιού ανάλογα με τη θέση στρογγυλοποίησης
  switch (roundPlace) {
    case "hundreds":
      placeName = "Εκατοντάδες";
      lowerBound = Math.floor(num / 100) * 100;
      upperBound = lowerBound + 100;
      roundedValue = Math.round(num / 100) * 100;
      keyDigit = Math.floor((num % 100) / 10); // Δεκάδες
      precisionDigits = 0;
      break;
    case "tens":
      placeName = "Δεκάδες";
      lowerBound = Math.floor(num / 10) * 10;
      upperBound = lowerBound + 10;
      roundedValue = Math.round(num / 10) * 10;
      keyDigit = Math.floor(num % 10); // Μονάδες
      precisionDigits = 0;
      break;
    case "units":
      placeName = "Μονάδες";
      lowerBound = Math.floor(num);
      upperBound = lowerBound + 1;
      roundedValue = Math.round(num);
      keyDigit = Math.floor((num * 10) % 10); // Δέκατα
      precisionDigits = 0;
      break;
    case "tenths":
      placeName = "Δέκατα";
      lowerBound = Math.floor(num * 10) / 10;
      upperBound = parseFloat((lowerBound + 0.1).toFixed(1));
      roundedValue = parseFloat((Math.round(num * 10) / 10).toFixed(1));
      keyDigit = Math.floor((num * 100) % 10); // Εκατοστά
      precisionDigits = 1;
      break;
    case "hundredths":
      placeName = "Εκατοστά";
      lowerBound = Math.floor(num * 100) / 100;
      upperBound = parseFloat((lowerBound + 0.01).toFixed(2));
      roundedValue = parseFloat((Math.round(num * 100) / 100).toFixed(2));
      keyDigit = Math.floor((num * 1000) % 10); // Χιλιοστά
      precisionDigits = 2;
      break;
    case "thousandths":
      placeName = "Χιλιοστά";
      lowerBound = Math.floor(num * 1000) / 1000;
      upperBound = parseFloat((lowerBound + 0.001).toFixed(3));
      roundedValue = parseFloat((Math.round(num * 1000) / 1000).toFixed(3));
      keyDigit = Math.floor((num * 10000) % 10); // 4ο δεκαδικό ψηφίο
      precisionDigits = 3;
      break;
    default:
      break;
  }

  // Διασφάλιση θετικού/σωστού ψηφίου-κλειδιού
  keyDigit = Math.abs(keyDigit);

  // Υπολογισμός θέσης πάνω στην αριθμογραμμή (0% έως 100%)
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
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
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

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΕΠΙΛΟΓΗ ΘΕΣΗΣ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-5 justify-between">
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δοκίμασε έναν Αριθμό!</h3>
                  <p className="text-gray-500 text-xs">Γράψε έως 6 ακέραια και 4 δεκαδικά ψηφία για να δεις τη στρογγυλοποίηση.</p>
                </div>

                <div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-2xl font-mono font-black text-center p-3 bg-slate-50 border-2 border-blue-200 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-wide"
                    placeholder="π.χ. 432.6583"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Επιλεξε Θεση Στρογγυλοποιησης:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRoundPlace("hundreds")}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${roundPlace === "hundreds" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      💯 Εκατοντάδες
                    </button>
                    <button
                      onClick={() => setRoundPlace("tens")}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${roundPlace === "tens" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      📦 Δεκάδες
                    </button>
                    <button
                      onClick={() => setRoundPlace("units")}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${roundPlace === "units" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      🎯 Μονάδες
                    </button>
                    <button
                      onClick={() => setRoundPlace("tenths")}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${roundPlace === "tenths" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      🧪 Δέκατα (0,1)
                    </button>
                    <button
                      onClick={() => setRoundPlace("hundredths")}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${roundPlace === "hundredths" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      🔍 Εκατοστά (0,01)
                    </button>
                    <button
                      onClick={() => setRoundPlace("thousandths")}
                      className={`px-3 py-2 rounded-xl border font-bold text-xs transition-all text-left ${roundPlace === "thousandths" ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                    >
                      📐 Χιλιοστά (0,001)
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200 flex items-start gap-1.5 leading-snug">
                <span>💻</span>
                <span><strong>Σημείωση Πληκτρολογίου:</strong> Χρησιμοποιήστε την τελεία <strong>`.`</strong> για να χωρίσετε το δεκαδικό μέρος.</span>
              </div>

            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕ ΔΙΟΡΘΩΜΕΝΗ ΑΡΙΘΜΟΓΡΑΜΜΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[460px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οπτικη Αριθμογραμμη:</span>
                <div className="text-lg md:text-xl font-bold text-slate-700 mt-1">
                  Πού βρίσκεται ο αριθμός <span className="font-mono font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">{num}</span>;
                </div>
              </div>

              {/* ΓΡΑΦΙΚΗ ΑΡΙΘΜΟΓΡΑΜΜΗ */}
              <div className="w-full max-w-xl mx-auto my-auto py-12 px-6">
                <div className="h-2 bg-gradient-to-r from-red-200 via-amber-200 to-emerald-200 rounded-full relative shadow-inner">
                  
                  {/* Αριστερό Όριο (Πάνω από τη γραμμή) */}
                  <div className="absolute left-0 -top-8 text-center -translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-xs md:text-sm">{lowerBound.toFixed(precisionDigits)}</span>
                  </div>
                  {/* Ετικέτα Κάτω Ορίου (Μετακινήθηκε καθαρά κάτω από τη γραμμή) */}
                  <div className="absolute left-0 top-4 text-center -translate-x-1/2 mt-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Κατω Οριο</span>
                  </div>

                  {/* Δεξί Όριο (Πάνω από τη γραμμή) */}
                  <div className="absolute right-0 -top-8 text-center translate-x-1/2">
                    <span className="block font-mono font-black text-slate-700 text-xs md:text-sm">{upperBound.toFixed(precisionDigits)}</span>
                  </div>
                  {/* Ετικέτα Πάνω Ορίου (Μετακινήθηκε καθαρά κάτω από τη γραμμή) */}
                  <div className="absolute right-0 top-4 text-center translate-x-1/2 mt-1">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Πανω Οριο</span>
                  </div>

                  {/* Μέσος Όρος (Το όριο του 5) */}
                  <div className="absolute left-1/2 top-0 h-4 w-0.5 bg-slate-300 -translate-y-1">
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-1 rounded">
                      {parseFloat(((lowerBound + upperBound) / 2).toFixed(4))}
                    </span>
                  </div>

                  {/* Δείκτης τρέχοντος αριθμού */}
                  <div 
                    className="absolute -top-4 -translate-x-1/2 transition-all duration-300 ease-out flex flex-col items-center"
                    style={{ left: `${percentage}%` }}
                  >
                    <span className="bg-blue-600 text-white text-xs font-mono font-black px-2 py-1 rounded-lg shadow-md animate-bounce">
                      {num}
                    </span>
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow mt-1"></div>
                  </div>

                </div>

                {/* Μπάρα Πληροφοριών Στρογγυλοποίησης */}
                <div className="mt-16 flex justify-between items-center w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 font-medium">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-black block">Ψηφιο-Κλειδι:</span>
                    <span className={`text-base font-black font-mono ${isUp ? 'text-slate-400' : 'text-red-500 bg-red-50 px-2 py-0.5 rounded-lg'}`}>
                      {isNaN(keyDigit) ? 0 : keyDigit}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center mx-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {isUp ? "Στρογγυλοποιηση Πανω ➔" : "⮨ Στρογγυλοποιηση Κατω"}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 text-center">
                      Επειδή το αμέσως επόμενο ψηφίο είναι {isUp ? "≥ 5" : "< 5"}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] uppercase text-slate-400 font-black block">Στα / στις {placeName}:</span>
                    <span className="text-base font-black font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                      {roundedValue.toFixed(precisionDigits)}
                    </span>
                  </div>
                </div>

              </div>

              {/* Τελική Κάρτα Αποτελέσματος */}
              <div className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl text-center shadow-lg font-mono font-black flex items-center justify-center gap-3">
                <span className="text-xl">🎯</span>
                <span className="text-sm font-sans uppercase tracking-wider">Τελικη Τιμη:</span>
                <span className="text-2xl bg-white/20 px-4 py-1 rounded-lg shadow-inner">
                  {roundedValue.toFixed(precisionDigits)}
                </span>
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

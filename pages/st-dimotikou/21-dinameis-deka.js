import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DinameisDekaPage() {
  const [exponent, setExponent] = useState(2);
  const canvasRef = useRef(null);

  const activeExponent = exponent === '' ? 0 : Number(exponent);
  const result = Math.pow(10, activeExponent);

  // Σχεδίαση των κουκίδων (τελίτσες) στο Canvas ανάλογα με τον εκθέτη (έως 10^10)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Καθαρισμός και ρύθμιση διαστάσεων με βάση το DPI για καθαρή εικόνα
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    const width = rect.width;
    const height = rect.height;

    // Σκούρο background (διάστημα)
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, 0, width, height);

    // Χρώμα τελίτσας (neon sky blue)
    ctx.fillStyle = '#38bdf8'; 

    // Ψευδοτυχαία γεννήτρια με σταθερό seed για να μην τρεμοπαίζουν οι κουκκίδες
    let lcgSeed = 42;
    const pseudoRandom = () => {
      lcgSeed = (lcgSeed * 1664525 + 1013904223) % 4294967296;
      return lcgSeed / 4294967296;
    };

    if (activeExponent === 0) {
      // 10^0 = 1 τελίτσα στο κέντρο
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 6, 0, Math.PI * 2);
      ctx.fill();
    } 
    else if (activeExponent === 1) {
      // 10^1 = 10 τελίτσες σε σειρά
      const dotCount = 10;
      const spacing = 20;
      const startX = (width - (dotCount - 1) * spacing) / 2;
      for (let i = 0; i < dotCount; i++) {
        ctx.beginPath();
        ctx.arc(startX + i * spacing, height / 2, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } 
    else if (activeExponent === 2) {
      // 10^2 = 100 τελίτσες σε πλέγμα 10x10
      const rows = 10;
      const cols = 10;
      const spacingX = 16;
      const spacingY = 16;
      const startX = (width - (cols - 1) * spacingX) / 2;
      const startY = (height - (rows - 1) * spacingY) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(startX + c * spacingX, startY + r * spacingY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } 
    else if (activeExponent === 3) {
      // 10^3 = 1.000 τελίτσες σε πλέγμα 50x20
      const cols = 50;
      const rows = 20;
      const spacingX = 6;
      const spacingY = 8;
      const startX = (width - (cols - 1) * spacingX) / 2;
      const startY = (height - (rows - 1) * spacingY) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.beginPath();
          ctx.arc(startX + c * spacingX, startY + r * spacingY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } 
    else if (activeExponent === 4) {
      // 10^4 = 10.000 τελίτσες
      const margin = 15;
      for (let i = 0; i < 10000; i++) {
        const x = margin + pseudoRandom() * (width - margin * 2);
        const y = margin + pseudoRandom() * (height - margin * 2);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } 
    else {
      // Για εκθέτες 5 έως 10, αυξάνουμε σταδιακά τον πληθυσμό της «σκόνης»
      let dotLimit = 25000; // 10^5
      if (activeExponent === 6) dotLimit = 45000;   // 10^6
      if (activeExponent === 7) dotLimit = 65000;   // 10^7
      if (activeExponent === 8) dotLimit = 85000;   // 10^8
      if (activeExponent === 9) dotLimit = 105000;  // 10^9
      if (activeExponent === 10) dotLimit = 125000; // 10^10 (σχεδόν πλήρες γέμισμα)

      ctx.fillStyle = activeExponent >= 8 ? 'rgba(56, 189, 248, 0.7)' : 'rgba(56, 189, 248, 0.9)';
      
      const margin = 8;
      for (let i = 0; i < dotLimit; i++) {
        const x = margin + pseudoRandom() * (width - margin * 2);
        const y = margin + pseudoRandom() * (height - margin * 2);
        ctx.fillRect(x, y, 1, 1);
      }
    }

  }, [activeExponent]);

  // Διορθώθηκε: Εμφανίζει ΠΑΝΤΑ αναλυτικά όλο τον πολλαπλασιοιασμό (π.χ. 10 · 10 · 10...) χωρίς συντομεύσεις
  const getMultiplicationSteps = () => {
    if (activeExponent === 0) return "1 (Κάθε αριθμός με εκθέτη 0 ισούται με 1)";
    if (activeExponent === 1) return "10";
    return Array(activeExponent).fill(10).join(" · ");
  };

  const getFriendlyName = () => {
    if (result === 1) return "Μία Μονάδα";
    if (result === 10) return "Δέκα";
    if (result === 100) return "Εκατό";
    if (result === 1000) return "Χίλια";
    if (result === 10000) return "Δέκα Χιλιάδες";
    if (result === 100000) return "Εκατό Χιλιάδες";
    if (result === 1000000) return "Ένα Εκατομμύριο";
    if (result === 10000000) return "Δέκα Εκατομμύρια";
    if (result === 100000000) return "Εκατό Εκατομμύρια";
    if (result === 1000000000) return "Ένα Δισεκατομμύριο";
    if (result === 10000000000) return "Δέκα Δισεκατομμύρια";
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔟 Οι Δυνάμεις του 10 - LearnMaths.gr</title>
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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Οι Δυνάμεις με βάση το 10
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-4 text-gray-500 text-sm md:text-base leading-relaxed">
                <p>
                  Οι δυνάμεις με βάση το 10 είναι εξαιρετικά χρήσιμες στα Μαθηματικά και την Επιστήμη, γιατί μας βοηθούν να γράφουμε **πολύ μεγάλους αριθμούς** εύκολα και γρήγορα!
                </p>
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 space-y-2">
                  <span className="text-xs font-black text-blue-800 block uppercase">💡 Ο Χρυσός Κανόνας:</span>
                  <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
                    Κάθε δύναμη του 10 ισούται με το <strong>1</strong> ακολουθούμενο από <strong>τόσα μηδενικά όσα δείχνει ο εκθέτης</strong>!
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex flex-col justify-center space-y-3">
                <span className="text-amber-300 font-black text-base block border-b border-white/20 pb-1">⚡ Παραδείγματα:</span>
                <div className="text-xs md:text-sm font-mono space-y-2">
                  <p>🔹 10<sup>1</sup> = 10 <span className="text-slate-300 text-[11px]">(1 μηδενικό)</span></p>
                  <p>🔹 10<sup>2</sup> = 100 <span className="text-slate-300 text-[11px]">(2 μηδενικά - Εκατό)</span></p>
                  <p>🔹 10<sup>3</sup> = 1.000 <span className="text-slate-300 text-[11px]">(3 μηδενικά - Χίλια)</span></p>
                  <p>🔹 10<sup>6</sup> = 1.000.000 <span className="text-slate-300 text-[11px]">(6 μηδενικά - Ένα εκατομμύριο)</span></p>
                  <p>🔹 10<sup>9</sup> = 1.000.000.000 <span className="text-slate-300 text-[11px]">(9 μηδενικά - Ένα δισεκατομμύριο)</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: SLIDER ΕΩΣ 10^10 */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δες τις Δυνάμεις</h3>
                  <p className="text-gray-500 text-xs">Σύρε τον κέρσορα από το 0 έως το 10 για να δεις το εκθετικό γέμισμα του χώρου!</p>
                </div>

                {/* SLIDER ΓΙΑ ΤΟΝ ΕΚΘΕΤΗ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-500 uppercase">Εκθέτης</span>
                    <span className="text-lg font-black text-blue-600 font-mono">10<sup>{activeExponent}</sup></span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={activeExponent}
                    onChange={(e) => setExponent(e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-bold font-mono">
                    <span>10⁰</span>
                    <span>10²</span>
                    <span>10⁴</span>
                    <span>10⁶</span>
                    <span>10⁸</span>
                    <span>10¹⁰</span>
                  </div>
                </div>

                {/* ΓΡΗΓΟΡΑ ΚΟΥΜΠΙΑ (Προστέθηκαν το 7 και το 8 που έλειπαν) */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Γρήγορη Μετάβαση:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button 
                        key={num}
                        onClick={() => setExponent(num)}
                        className={`py-2 rounded-xl border font-mono font-bold text-xs transition-all ${
                          activeExponent === num 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        10<sup>{num}</sup>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: CANVAS & ΟΠΤΙΚΟΠΟΙΗΣΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-6">
              
              {/* ΟΝΟΜΑΣΙΑ ΚΑΙ ΜΑΘΗΜΑΤΙΚΗ ΣΥΜΒΟΛΗ */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center px-6">
                <div className="text-left font-mono">
                  <span className="text-[10px] font-sans text-slate-400 block font-bold uppercase">Σύμβολο:</span>
                  <div className="inline-flex items-baseline">
                    <span className="text-4xl font-black text-blue-600">10</span>
                    <span className="text-2xl font-black text-indigo-600 self-start -mt-2">{activeExponent}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Λεκτική Ονομασία:</span>
                  <span className="text-base font-black text-slate-800">{getFriendlyName()}</span>
                </div>
              </div>

              {/* ΜΕΓΑΛΟ ΣΤΑΘΕΡΟ ΠΛΑΙΣΙΟ ΜΕ ΤΕΛΙΤΣΕΣ */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center w-full px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">🌌 Οπτικό Γέμισμα Χώρου:</span>
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-mono">
                    {result.toLocaleString('el-GR')} {result === 1 ? 'τελίτσα' : 'τελίτσες'}
                  </span>
                </div>
                
                <div className="w-full bg-slate-950 rounded-2xl border-4 border-slate-900 overflow-hidden shadow-2xl p-1">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-[280px] block rounded-xl"
                  />
                </div>

                {/* Μπάρα Πυκνότητας */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>ΠΟΣΟΣΤΟ ΚΑΛΥΨΗΣ ΧΩΡΟΥ</span>
                    <span className="font-mono">{activeExponent * 10}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-sky-400 to-blue-600 h-full transition-all duration-300"
                      style={{ width: `${activeExponent * 10}%` }}
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 italic text-center pt-1">
                  {activeExponent === 0 && "Μόλις 1 κουκκίδα. Ο χώρος είναι άδειος!"}
                  {activeExponent === 1 && "10 κουκκίδες. Μια απλή γραμμή."}
                  {activeExponent === 2 && "100 κουκκίδες. Το πλέγμα αρχίζει να σχηματίζεται."}
                  {activeExponent === 3 && "1.000 κουκκίδες. Ο χώρος πυκνώνει!"}
                  {activeExponent === 4 && "10.000 κουκκίδες. Σαν ένα όμορφο σύννεφο."}
                  {activeExponent === 5 && "100.000 κουκκίδες. Η κοσμική σκόνη αρχίζει να καταλαμβάνει τον χώρο."}
                  {activeExponent === 6 && "1.000.000 (1 εκατομμύριο) κουκκίδες! Ο χώρος γεμίζει εντυπωσιακά."}
                  {activeExponent >= 7 && activeExponent <= 9 && `Απίστευτη πυκνότητα! ${result.toLocaleString('el-GR')} κουκκίδες γεμίζουν σχεδόν όλο το πλαίσιο.`}
                  {activeExponent === 10 && "Φανταστικό! 10.000.000.000 (10 δισεκατομμύρια) κουκκίδες καλύπτουν πλήρως ολόκληρο το σύμπαν του πλαισίου!"}
                </p>
              </div>

              {/* ΑΝΑΛΥΣΗ ΠΡΑΞΗΣ (Πλέον εμφανίζεται 100% αναλυτικά) */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-2 font-mono">
                <div className="text-xs font-sans text-slate-400 font-bold uppercase tracking-wider">
                  📝 Ανάλυση ως Γινόμενο:
                </div>
                <div className="text-base md:text-lg font-black text-slate-100 flex items-center gap-2 flex-wrap max-h-[120px] overflow-y-auto pr-1">
                  10<sup>{activeExponent}</sup> = {getMultiplicationSteps()} = <span className="text-amber-400 font-black">{result.toLocaleString('el-GR')}</span>
                </div>
              </div>

              {/* ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg font-mono flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs font-sans uppercase tracking-wider text-blue-100 block">Τελική Αξία:</span>
                  <span className="text-xl md:text-2xl font-black">
                    10<sup>{activeExponent}</sup> = {result.toLocaleString('el-GR')}
                  </span>
                </div>
                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-amber-300 block">💡 Πλήθος Μηδενικών:</span>
                  <span className="text-xs font-sans text-slate-200">
                    Το 1 ακολουθείται από <strong className="text-white">{activeExponent}</strong> {activeExponent === 1 ? 'μηδενικό' : 'μηδενικά'}.
                  </span>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Δυνάμεις του 10 - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

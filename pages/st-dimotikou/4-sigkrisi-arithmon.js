// pages/st-dimotikou/4-sigkrisi-arithmon.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function SigkrisiArithmonPage() {
  const [numA, setNumA] = useState("45.5");
  const [numB, setNumB] = useState("45.12");

  // Μετατροπή σε float για τη σύγκριση
  const valA = parseFloat(numA) || 0;
  const valB = parseFloat(numB) || 0;

  // Καθορισμός του συμβόλου και της κλίσης της ζυγαριάς
  let symbol = "＝";
  let tiltClass = "rotate-0"; // Ισορροπία
  let textResult = "Οι δύο αριθμοί είναι ίσοι.";
  let colorA = "text-slate-700";
  let colorB = "text-slate-700";

  if (valA > valB) {
    symbol = "＞";
    tiltClass = "-rotate-6"; // Γέρνει αριστερά (το Α πάει κάτω, άρα αρνητική περιστροφή)
    textResult = "Ο πρώτος αριθμός είναι μεγαλύτερος!";
    colorA = "text-emerald-600";
    colorB = "text-rose-600";
  } else if (valA < valB) {
    symbol = "＜";
    tiltClass = "rotate-6"; // Γέρνει δεξιά (το Β πάει κάτω)
    textResult = "Ο δεύτερος αριθμός είναι μεγαλύτερος!";
    colorA = "text-rose-600";
    colorB = "text-emerald-600";
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Σύγκριση Αριθμών - LearnMaths.gr</title>
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
                  <span>📖</span> Θεωρία: Σύγκριση Φυσικών & Δεκαδικών
                </h2>
                <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                  Για να συγκρίνουμε δύο αριθμούς, τους κοιτάζουμε πάντα **από αριστερά προς τα δεξιά**, συγκρίνοντας τα ψηφία που βρίσκονται στην ίδια θέση.
                </p>
                <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🔹 <strong>Στους Φυσικούς:</strong> Μεγαλύτερος είναι εκείνος που έχει τα περισσότερα ψηφία. Αν έχουν ίδια ψηφία, συγκρίνουμε ένα-ένα τα ψηφία από αριστερά.</p>
                  <p>🔸 <strong>Στους Δεκαδικούς:</strong> Συγκρίνουμε πρώτα το **ακέραιο μέρος**. Αν είναι ίδιο, συγκρίνουμε το δεκαδικό μέρος ξεκινώντας από τα **δέκατα**, μετά τα εκατοστά κ.ο.κ.</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-6 rounded-2xl shadow-md space-y-3">
                <p className="font-bold text-amber-300 text-sm md:text-base text-center">💡 Προσοχή στην παγίδα των Δεκαδικών!</p>
                <div className="bg-white/10 p-4 rounded-xl space-y-1 text-xs md:text-sm font-medium">
                  <p>Ας συγκρίνουμε τον <span className="font-bold text-amber-200">45,5</span> και τον <span className="font-bold text-amber-200">45,12</span>:</p>
                  <p>• Το ακέραιο μέρος είναι ίδιο (45 = 45).</p>
                  <p>• Συγκρίνουμε τα δέκατα: Το 5 είναι μεγαλύτερο από το 1 ($5 &gt; 1$).</p>
                  <p className="font-black text-center pt-2 text-sm text-amber-200">Άρα: 45,5 ＞ 45,12</p>
                </div>
                <p className="text-[11px] text-center text-teal-100">Tip: Αν συμπληρώσεις ένα μηδενικό στο τέλος, το βλέπεις ως 45,50 ＞ 45,12!</p>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & INPUTS */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full gap-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Η Ψηφιακή Ζυγαριά
                </h3>
                <p className="text-gray-500 text-sm">
                  Γράψε δύο αριθμούς (χρησιμοποίησε τελεία για δεκαδικούς) για να δεις ποιος κερδίζει.
                </p>
              </div>

              {/* Πλαίσιο Εισαγωγής Αριθμών */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full flex flex-col sm:flex-row items-center justify-center gap-6 shadow-inner my-auto">
                {/* Αριθμός Α */}
                <div className="flex flex-col items-center gap-2 w-full max-w-[160px]">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Αριθμός Α</span>
                  <input 
                    type="text" 
                    value={numA}
                    onChange={(e) => setNumA(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="text-2xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wide text-blue-600"
                    placeholder="π.χ. 45.5"
                  />
                </div>

                {/* Σύμβολο Σύγκρισης */}
                <div className="text-4xl font-black text-slate-400 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm min-w-[64px] text-center animate-pulse">
                  {symbol}
                </div>

                {/* Αριθμός Β */}
                <div className="flex flex-col items-center gap-2 w-full max-w-[160px]">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Αριθμός Β</span>
                  <input 
                    type="text" 
                    value={numB}
                    onChange={(e) => setNumB(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="text-2xl font-black text-center p-3 bg-white border-2 border-blue-200 rounded-2xl shadow-sm focus:border-blue-500 outline-none transition-all w-full tracking-wide text-blue-600"
                    placeholder="π.χ. 45.12"
                  />
                </div>
              </div>

              {/* Μαθηματικό Συμπέρασμα */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl text-center flex flex-col justify-center items-center gap-2 shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Αποτέλεσμα Σύγκρισης:</span>
                <div className="text-xl font-black text-slate-700">
                  <span className={colorA}>{numA || "0"}</span> 
                  <span className="text-blue-600 mx-3">{symbol}</span> 
                  <span className={colorB}>{numB || "0"}</span>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  {textResult}
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕ ΖΥΓΑΡΙΑ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full"></div>

              {/* Οπτικοποίηση με SVG Ζυγαριάς */}
              <div className="my-auto flex flex-col items-center gap-6 w-full max-w-[340px]">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Οπτική Αναπαράσταση Βάρους:</span>
                
                <svg 
                  viewBox="0 0 300 200" 
                  className="w-full h-auto drop-shadow-sm overflow-visible"
                >
                  {/* Σταθερή Βάση Ζυγαριάς */}
                  <path d="M 130 140 L 170 140 L 160 85 L 140 85 Z" className="fill-slate-400 stroke-slate-500 stroke-1" />
                  <rect x="110" y="140" width="80" height="12" rx="4" className="fill-slate-500" />
                  <circle cx="150" cy="85" r="5" className="fill-slate-600" />

                  {/* Κινούμενο Μέρος Ζυγαριάς */}
                  <g className={`transition-transform duration-500 origin-[150px_85px] ${tiltClass}`}>
                    {/* Οριζόντιος Δοκός */}
                    <line x1="50" y1="85" x2="250" y2="85" className="stroke-slate-600 stroke-[4] stroke-linecap-round" />
                    
                    {/* Αριστερός Δίσκος (Αριθμός Α) */}
                    <line x1="50" y1="85" x2="30" y2="125" className="stroke-slate-400 stroke-1" />
                    <line x1="50" y1="85" x2="70" y2="125" className="stroke-slate-400 stroke-1" />
                    <ellipse cx="50" cy="125" rx="28" ry="6" className={`${valA > valB ? 'fill-emerald-500/80 stroke-emerald-600' : 'fill-slate-300 stroke-slate-400'} stroke-[1.5] transition-colors`} />
                    <text x="50" y="145" textAnchor="middle" className="text-[12px] font-black fill-slate-500 font-mono tracking-tight">{numA || "0"}</text>

                    {/* Δεξίος Δίσκος (Αριθμός Β) */}
                    <line x1="250" y1="85" x2="230" y2="125" className="stroke-slate-400 stroke-1" />
                    <line x1="250" y1="85" x2="270" y2="125" className="stroke-slate-400 stroke-1" />
                    <ellipse cx="250" cy="125" rx="28" ry="6" className={`${valB > valA ? 'fill-emerald-500/80 stroke-emerald-600' : 'fill-slate-300 stroke-slate-400'} stroke-[1.5] transition-colors`} />
                    <text x="250" y="145" textAnchor="middle" className="text-[12px] font-black fill-slate-500 font-mono tracking-tight">{numB || "0"}</text>
                  </g>
                </svg>
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Ο βαρύτερος αριθμός (ο μεγαλύτερος) γέρνει τη ζυγαριά προς το μέρος του!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Σύγκριση Αριθμών ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

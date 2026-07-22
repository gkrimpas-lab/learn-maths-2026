// pages/st-dimotikou/33-gnostos-meion-agnostos.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function GnostosMeionAgnostosPage() {
  // Ο μειωτέος (a) - π.χ. 12
  const [a, setA] = useState(12);
  // Το υπόλοιπο/διαφορά (b) - π.χ. 7
  const [b, setB] = useState(7);
  // Το βήμα της οπτικοποίησης (1: Αρχικό α - x = β, 2: Σύγκριση & Αφαίρεση, 3: Αποκάλυψη x = α - β)
  const [step, setStep] = useState(1);

  // Διασφάλιση ότι το α είναι πάντα μεγαλύτερο ή ίσο του β
  const validA = Math.max(a, b);
  // Ο άγνωστος x (αφαιρετέος) υπολογίζεται αυτόματα: x = a - b
  const x = validA - b;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🧩 Μοντέλο Ισοδύναμων Μπαρών: α - x = β - LearnMaths.gr</title>
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
                  📖 Θεωρία: Η Εξίσωση $α - x = β$
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Όταν ξέρουμε την αρχική ποσότητα <strong>$α$</strong> και το υπόλοιπο <strong>$β$</strong>, ψάχνουμε να βρούμε πόσο είναι το <strong>$x$</strong> (δηλαδή πόσο αφαιρέθηκε).
                </p>
                <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl border border-amber-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🧩 <strong className="text-amber-900">Οπτική Σύγκριση:</strong> Η διαφορά ανάμεσα στην αρχική ποσότητα $α$ και στο υπόλοιπο $β$ είναι ακριβώς ο άγνωστος $x$!</p>
                  <p>📐 <strong className="text-blue-900">Τύπος:</strong> <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900">x = α - β</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-2xl md:text-3xl tracking-wide space-y-3">
                  <div className="bg-white/20 px-5 py-2 rounded-xl backdrop-blur-sm">
                    α - x = β
                  </div>
                  <div className="text-amber-200 text-xl font-bold">⬇️ Υπολογισμός Αφαιρετέου ⬇️</div>
                  <div className="bg-white text-indigo-600 px-6 py-2.5 rounded-2xl shadow-lg font-black text-2xl md:text-3xl font-mono">
                    x = α - β
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ ΜΟΝΤΕΛΟΥ ΜΠΑΡΑΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΒΗΜΑΤΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Ρύθμισε την Εξίσωση
                </h3>
                <p className="text-gray-500 text-sm">
                  Επίλεξε την αρχική ποσότητα (α) και το υπόλοιπο (β) για να βρεις το x.
                </p>
              </div>

              {/* Χειριστήρια αλλαγής α και β */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col space-y-4 shadow-inner my-3">
                
                {/* Χειριστήριο για τον Μειωτέο (α) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Αρχική Ποσότητα (α): <strong className="text-indigo-600 text-sm">{validA}</strong></span>
                    <span>Όριο: {b} - 15</span>
                  </div>
                  <input 
                    type="range" 
                    min={b} 
                    max="15" 
                    value={validA}
                    onChange={(e) => {
                      setA(Number(e.target.value));
                      setStep(1);
                    }}
                    className="w-full h-2.5 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>

                {/* Χειριστήριο για το Υπόλοιπο (β) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Υπόλοιπο (β): <strong className="text-purple-600 text-sm">{b}</strong></span>
                    <span>Όριο: 1 - 10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={b}
                    onChange={(e) => {
                      setB(Number(e.target.value));
                      setStep(1);
                    }}
                    className="w-full h-2.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

              </div>

              {/* Κουμπιά Επιλογής Βήματος */}
              <div className="space-y-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  🎬 Βήματα Επίλυσης στο Μοντέλο:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setStep(1)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                      step === 1 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    1. Αρχική ({validA} - x = {b})
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                      step === 2 
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    2. Σύγκριση ({validA} - {b})
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                      step === 3 
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    3. Αποκάλυψη (x = {x})
                  </button>
                </div>
              </div>

              {/* Εξηγήσεις ανά Βήμα */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl min-h-[110px] flex flex-col justify-center font-sans space-y-1.5 shadow-inner mt-3">
                {step === 1 && (
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">📌 Βήμα 1: Αρχική Εξίσωση</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Η πάνω λωρίδα έχει συνολικά <strong className="text-indigo-600">{validA}</strong> μονάδες. Αφαιρέθηκε ένα κρυφό κομμάτι <strong className="text-amber-700 font-bold">x</strong> και έμειναν <strong className="text-purple-600">{b}</strong>.
                    </p>
                    <div className="font-mono font-black text-sm text-amber-900 mt-1">{validA} - x = {b}</div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <span className="text-xs font-bold text-indigo-900 block">🔍 Βήμα 2: Σύγκριση των δύο Λωρίδων</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Συγκρίνουμε την αρχική λωρίδα (<strong className="text-indigo-600">{validA}</strong>) με το υπόλοιπο (<strong className="text-purple-600">{b}</strong>). Η διαφορά τους είναι το κενό κομμάτι <strong className="text-amber-700 font-bold">x</strong>!
                    </p>
                    <div className="font-mono font-black text-sm text-indigo-900 mt-1">x = {validA} - {b}</div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">🎉 Βήμα 3: Υπολογισμός του x</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Το κρυφό κομμάτι ξεκλειδώνει και αποκαλύπτει ότι περιέχει ακριβώς <strong className="text-emerald-700">{x}</strong> μονάδες!
                    </p>
                    <div className="font-mono font-black text-base text-emerald-700 mt-1">x = {validA} - {b} ➔ x = {x}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΔΙΑΔΡΑΣΤΙΚΕΣ ΠΑΡΑΛΛΗΛΕΣ ΛΩΡΙΔΕΣ (BAR MODEL) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] w-full relative overflow-hidden">
              <div className="w-full text-left">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  🧩 Οπτικό Μοντέλο Ισότητας
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Οι δύο λωρίδες αντιπροσωπεύουν τα δύο μέλη της εξίσωσης.
                </p>
              </div>

              {/* ΠΕΡΙΟΧΗ ΜΟΝΤΕΛΟΥ ΜΠΑΡΑΣ */}
              <div className="w-full bg-slate-50 rounded-2xl border border-gray-200 p-6 shadow-inner my-auto flex flex-col items-center justify-center space-y-8 min-h-[340px]">
                
                {/* 1. ΠΑΝΩ ΛΩΡΙΔΑ: ΑΡΧΙΚΗ ΠΟΣΟΤΗΤΑ (α) */}
                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold text-indigo-700">
                    <span>1ο Μέλος (Αρχικό Σύνολο α = {validA})</span>
                  </div>
                  
                  {/* Η Μπάρα του α */}
                  <div className="w-full h-16 bg-white rounded-2xl border-2 border-indigo-400 p-1.5 shadow-md flex items-center gap-1.5 overflow-hidden">
                    
                    {/* Τμήμα β (Γνωστό Υπόλοιπο) */}
                    <div 
                      style={{ width: `${(b / validA) * 100}%` }}
                      className="h-full bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow transition-all duration-500"
                    >
                      <span>{b}</span>
                    </div>

                    {/* Τμήμα x (Αφαιρετέος) */}
                    <div 
                      style={{ width: `${(x / validA) * 100}%` }}
                      className={`h-full rounded-xl flex items-center justify-center font-black text-xs transition-all duration-500 ${
                        step === 1 
                          ? 'bg-amber-100 border-2 border-dashed border-amber-500 text-amber-800' 
                          : step === 2 
                          ? 'bg-amber-400 text-white shadow-md animate-pulse' 
                          : 'bg-emerald-500 text-white shadow-lg animate-bounce'
                      }`}
                    >
                      {step === 3 ? `x = ${x}` : 'x'}
                    </div>

                  </div>
                </div>

                {/* Σύμβολο Ισότητας = */}
                <div className="flex items-center justify-center">
                  <span className="text-2xl font-black text-gray-400 bg-white px-4 py-1 rounded-full border border-gray-200 shadow-sm font-mono">
                    =
                  </span>
                </div>

                {/* 2. ΚΑΤΩ ΛΩΡΙΔΑ: ΥΠΟΛΟΙΠΟ (β) */}
                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold text-purple-700">
                    <span>2ο Μέλος (Υπόλοιπο β = {b})</span>
                  </div>

                  {/* Η Μπάρα του β */}
                  <div className="w-full h-16 bg-white rounded-2xl border-2 border-purple-300 p-1.5 shadow-md flex items-center gap-1.5 overflow-hidden">
                    <div 
                      style={{ width: `${(b / validA) * 100}%` }}
                      className="h-full bg-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow transition-all duration-500"
                    >
                      <span>{b}</span>
                    </div>
                    
                    {/* Κενό τμήμα που λείπει για να εξισωθεί με το α */}
                    <div 
                      style={{ width: `${(x / validA) * 100}%` }}
                      className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl text-gray-300 font-mono text-[10px]"
                    >
                      {step !== 1 ? `Διαφορά (${x})` : ''}
                    </div>
                  </div>
                </div>

              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>💡 Η διαφορά των δύο μπαρών αποκαλύπτει ότι x = {x}!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικές Εξισώσεις Αφαιρετέου ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

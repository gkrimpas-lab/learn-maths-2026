// pages/st-dimotikou/32-agnostos_kai_afairesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function AgnostosAfairesiPage() {
  // Ο αφαιρετέος (a)
  const [a, setA] = useState(4);
  // Το υπόλοιπο/διαφορά (b)
  const [b, setB] = useState(7);
  // Το βήμα της οπτικοποίησης (1: Αρχικό, 2: Προσθήκη a, 3: Αποτέλεσμα x = b + a)
  const [step, setStep] = useState(1);

  // Ο άγνωστος x (μειωτέος) υπολογίζεται αυτόματα: x = b + a
  const x = b + a;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Η Ζυγαριά των Εξισώσεων: x - α = β - LearnMaths.gr</title>
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
                  📖 Θεωρία: Η Εξίσωση $x - α = β$
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Όταν ο άγνωστος $x$ είναι ο <strong>μειωτέος</strong> (δηλαδή η αρχική ποσότητα από την οποία αφαιρούμε), για να τον βρούμε κάνουμε την αντίθετη πράξη: <strong>προσθέτουμε</strong> τον αφαιρετέο ($α$) στο υπόλοιπο ($β$).
                </p>
                <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl border border-amber-100 space-y-2 text-sm md:text-base font-medium">
                  <p>⚖️ <strong className="text-amber-900">Κανόνας Ισορροπίας:</strong> Για να συμπληρώσουμε το $x$, προσθέτουμε το $α$ και στους δύο δίσκους της ζυγαριάς ώστε να διατηρηθεί η ισορροπία!</p>
                  <p>📐 <strong className="text-blue-900">Τύπος:</strong> <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900">x = β + α</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-rose-500 to-amber-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-2xl md:text-3xl tracking-wide space-y-3">
                  <div className="bg-white/20 px-5 py-2 rounded-xl backdrop-blur-sm">
                    x - α = β
                  </div>
                  <div className="text-amber-200 text-xl font-bold">⬇️ Προσθέτουμε το α και στα δύο μέλη ⬇️</div>
                  <div className="bg-white text-rose-600 px-6 py-2.5 rounded-2xl shadow-lg font-black text-2xl md:text-3xl font-mono">
                    x = β + α
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ ΖΥΓΑΡΙΑΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΒΗΜΑΤΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Ρύθμισε τη Ζυγαριά
                </h3>
                <p className="text-gray-500 text-sm">
                  Επίλεξε τις τιμές των αριθμών και πάτα τα βήματα για να δεις πώς λύνεται η εξίσωση αφαίρεσης!
                </p>
              </div>

              {/* Χειριστήρια αλλαγής α και β */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col space-y-4 shadow-inner my-3">
                
                {/* Χειριστήριο για τον Αφαιρετέο (α) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Αφαιρετέος (α): <strong className="text-rose-600 text-sm">{a}</strong></span>
                    <span>Όριο: 1 - 8</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="8" 
                    value={a}
                    onChange={(e) => {
                      setA(Number(e.target.value));
                      setStep(1);
                    }}
                    className="w-full h-2.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                  />
                </div>

                {/* Χειριστήριο για το Υπόλοιπο (β) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Υπόλοιπο / Διαφορά (β): <strong className="text-purple-600 text-sm">{b}</strong></span>
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
                  🎬 Βήματα Επίλυσης στη Ζυγαριά:
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
                    1. Αρχική Εξίσωση
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                      step === 2 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    2. Προσθήκη +{a}
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                      step === 3 
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    3. Αποτέλεσμα (x)
                  </button>
                </div>
              </div>

              {/* Εξηγήσεις ανά Βήμα */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl min-h-[110px] flex flex-col justify-center font-sans space-y-1.5 shadow-inner mt-3">
                {step === 1 && (
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">📌 Βήμα 1: Αρχική Εξίσωση</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Από το κουτί <strong className="text-amber-700">x</strong> λείπουν <strong className="text-rose-600">{a}</strong> μπάλες. Αυτή η ποσότητα ζυγίζει όσο <strong className="text-purple-600">{b}</strong> μπάλες στον δεξιό δίσκο.
                    </p>
                    <div className="font-mono font-black text-sm text-amber-900 mt-1">x - {a} = {b}</div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">🔍 Βήμα 2: Προσθήκη {a} Μπαλών και στις δύο πλευρές</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Για να συμπληρώσουμε το κουτί $x$, προσθέτουμε <strong className="text-emerald-600">{a}</strong> μπάλες αριστερά και άλλες <strong className="text-emerald-600">{a}</strong> μπάλες δεξιά για να κρατήσουμε την ισορροπία!
                    </p>
                    <div className="font-mono font-black text-sm text-amber-900 mt-1">(x - {a}) + {a} = {b} + {a}</div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">🎉 Βήμα 3: Υπολογισμός του x</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Το κουτί $x$ είναι τώρα ολόκληρο στον αριστερό δίσκο και ζυγίζει όσο όλες οι μπάλες μαζί στο δεξιό δίσκο (<strong className="text-purple-600">{b}</strong> + <strong className="text-emerald-600">{a}</strong>)!
                    </p>
                    <div className="font-mono font-black text-base text-emerald-700 mt-1">x = {b} + {a} ➔ x = {x}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΖΥΓΑΡΙΑ ΑΦΑΙΡΕΣΗΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[500px] w-full relative overflow-hidden">
              <div className="w-full text-left">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  ⚖️ Η Διαδραστική Ζυγαριά
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Δες πώς η προσθήκη των μπαλών αποκαλύπτει την αρχική τιμή του x.
                </p>
              </div>

              {/* ΠΕΡΙΟΧΗ ΓΡΑΦΗΜΑΤΟΣ ΖΥΓΑΡΙΑΣ */}
              <div className="w-full bg-gradient-to-b from-slate-100 to-slate-200/80 rounded-2xl border border-gray-200 p-6 shadow-inner my-auto flex flex-col items-center justify-end min-h-[340px] relative overflow-hidden">
                
                {/* Δείκτης Ισορροπίας (Gauge Meter) */}
                <div className="absolute top-4 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5 z-10">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-black text-slate-600 tracking-wider uppercase">Ισορροπία 100%</span>
                </div>

                {/* ΣΧΕΔΙΑΣΜΟΣ ΖΥΓΑΡΙΑΣ */}
                <div className="relative w-full max-w-md flex flex-col items-center pt-16">
                  
                  {/* ΔΙΣΚΟΙ ΠΑΝΩ ΑΠΟ ΤΟΝ ΒΡΑΧΙΟΝΑ */}
                  <div className="w-full flex justify-between items-end px-2 z-10 mb-[-2px]">
                    
                    {/* 1. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ (1ο Μέλος) */}
                    <div className="flex flex-col items-center w-40">
                      {/* Χώρος Αντικειμένων (Πάνω στον δίσκο) */}
                      <div className="w-full min-h-[100px] flex flex-wrap items-end justify-center gap-1.5 p-2 transition-all">
                        
                        {/* 3D Κουτί x */}
                        <div className="relative bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 text-amber-100 font-black text-xl w-12 h-12 rounded-xl shadow-lg border-2 border-amber-300 flex items-center justify-center transform hover:scale-105 transition">
                          <span className="drop-shadow-md">x</span>
                          
                          {/* Αν είμαστε στο Βήμα 1, δείχνει ότι λείπουν 'a' κομμάτια */}
                          {step === 1 && (
                            <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow">
                              -{a}
                            </div>
                          )}
                        </div>

                        {/* ΒΗΜΑ 2 & 3: Προσθήκη των 'a' μπαλών που συμπληρώνουν το x */}
                        {step !== 1 && Array.from({ length: a }).map((_, i) => (
                          <div 
                            key={`add-left-${i}`} 
                            className="w-7 h-7 rounded-full shadow-lg bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-300 via-emerald-500 to-emerald-800 ring-2 ring-emerald-300 border border-emerald-200 transition-all transform scale-105 animate-pulse"
                            title="Προσθήκη α"
                          >
                          </div>
                        ))}
                      </div>

                      {/* Ο Δίσκος (Πιάτο) */}
                      <div className="w-full h-4 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-t-sm rounded-b-xl border border-slate-400 shadow-md"></div>
                      {/* Κάθετος Στύλος Στήριξης Δίσκου */}
                      <div className="w-2.5 h-6 bg-gradient-to-b from-slate-400 to-slate-600 shadow-inner"></div>
                    </div>

                    {/* 2. ΔΕΞΙΟΣ ΔΙΣΚΟΣ (2ο Μέλος) */}
                    <div className="flex flex-col items-center w-44">
                      {/* Χώρος Αντικειμένων (Πάνω στον δίσκο) */}
                      <div className="w-full min-h-[100px] flex flex-wrap items-end justify-center gap-1.5 p-2 transition-all">
                        
                        {/* Οι αρχικές 'b' μωβ μπάλες */}
                        {Array.from({ length: b }).map((_, i) => (
                          <div 
                            key={`b-${i}`} 
                            className="w-7 h-7 rounded-full shadow-md bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-300 via-purple-500 to-purple-800 border border-purple-300/40"
                          >
                          </div>
                        ))}

                        {/* ΒΗΜΑ 2 & 3: Προσθήκη 'a' πράσινων μπαλών και δεξιά */}
                        {step !== 1 && Array.from({ length: a }).map((_, i) => (
                          <div 
                            key={`add-right-${i}`} 
                            className={`w-7 h-7 rounded-full shadow-lg bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-300 via-emerald-500 to-emerald-800 ring-2 ring-amber-400 border border-emerald-200 transition-all transform ${step === 3 ? 'animate-bounce' : 'animate-pulse'}`}
                            title="Προσθήκη α"
                          >
                          </div>
                        ))}

                      </div>

                      {/* Ο Δίσκος (Πιάτο) */}
                      <div className="w-full h-4 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 rounded-t-sm rounded-b-xl border border-slate-400 shadow-md"></div>
                      {/* Κάθετος Στύλος Στήριξης Δίσκου */}
                      <div className="w-2.5 h-6 bg-gradient-to-b from-slate-400 to-slate-600 shadow-inner"></div>
                    </div>

                  </div>

                  {/* ΟΡΙΖΟΝΤΙΟΣ ΒΡΑΧΙΟΝΑ (Κάτω από τους δίσκους) */}
                  <div className="w-full h-3 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-full shadow-md relative flex justify-between items-center px-4 border border-slate-500">
                    <div className="w-2 h-2 rounded-full bg-slate-800 shadow-inner"></div>
                    <div className="w-2 h-2 rounded-full bg-slate-800 shadow-inner"></div>
                  </div>

                  {/* ΚΕΝΤΡΙΚΟΣ ΣΤΥΛΟΣ & ΒΑΣΗ */}
                  <div className="w-5 h-20 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 shadow-lg border-x border-slate-600"></div>
                  <div className="w-36 h-5 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 rounded-t-2xl shadow-2xl border-t border-slate-500"></div>

                </div>

                {/* Ταμπέλες κάτω από τη ζυγαριά */}
                <div className="w-full flex justify-between px-6 pt-3 text-center border-t border-slate-200/60 mt-2">
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                    1ο Μέλος {step === 1 ? `(x - ${a})` : `(x)`}
                  </span>
                  <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                    2ο Μέλος {step === 1 ? `(${b})` : `(${b} + ${a} = ${x})`}
                  </span>
                </div>

              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>💡 Προσθέτοντας τις {a} μπάλες και στις δύο πλευρές, βρίσκουμε το αρχικό x = {x}!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικές Εξισώσεις Αφαίρεσης ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

// pages/st-dimotikou/31-agnostos_kai_prosthesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function AgnostosProsthesiPage() {
  // Ο γνωστός προσθετέος (a)
  const [a, setA] = useState(5);
  // Το συνολικό άθροισμα (b)
  const [b, setB] = useState(12);
  // Το βήμα της οπτικοποίησης (1: Αρχικό, 2: Διαχωρισμός, 3: Αφαίρεση/Αποτέλεσμα)
  const [step, setStep] = useState(1);

  // Διασφάλιση ότι το b είναι πάντα μεγαλύτερο ή ίσο του a
  const validB = Math.max(b, a);
  // Ο άγνωστος x υπολογίζεται αυτόματα: x = b - a
  const x = validB - a;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Η Ζυγαριά των Εξισώσεων: x + α = β - LearnMaths.gr</title>
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
                  📖 Θεωρία: Η Εξίσωση ως Ζυγαριά
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Μια <strong>εξίσωση</strong> μοιάζει με μια <strong>ζυγαριά που ισορροπεί</strong>. Για να βρούμε πόσο ζυγίζει ο άγνωστος ($x$), πρέπει να βγάλουμε από τους δύο δίσκους το ίδιο βάρος (τον γνωστό αριθμό $α$).
                </p>
                <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl border border-amber-100 space-y-2 text-sm md:text-base font-medium">
                  <p>⚖️ <strong className="text-amber-900">Κανόνας Ισορροπίας:</strong> Ό,τι αφαιρούμε από τον έναν δίσκο της ζυγαριάς, πρέπει να το αφαιρούμε και από τον άλλο για να μη χάσει την ισορροπία της!</p>
                  <p>📐 <strong className="text-blue-900">Τύπος:</strong> <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900">x = β - α</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-2xl md:text-3xl tracking-wide space-y-3">
                  <div className="bg-white/20 px-5 py-2 rounded-xl backdrop-blur-sm">
                    x + α = β
                  </div>
                  <div className="text-amber-200 text-xl font-bold">⬇️ Αφαιρούμε το α και από τα δύο μέλη ⬇️</div>
                  <div className="bg-white text-orange-600 px-6 py-2.5 rounded-2xl shadow-lg font-black text-2xl md:text-3xl font-mono">
                    x = β - α
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ ΖΥΓΑΡΙΑΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΒΗΜΑΤΑ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Ρύθμισε τη Ζυγαριά
                </h3>
                <p className="text-gray-500 text-sm">
                  Επίλεξε τις τιμές των αριθμών και πάτα τα βήματα για να δεις πώς λύνεται η εξίσωση στη ζυγαριά!
                </p>
              </div>

              {/* Χειριστήρια αλλαγής α και β */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col space-y-4 shadow-inner my-3">
                
                {/* Χειριστήριο για τον Προσθετέο (α) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Μπάλες στο 1ο μέλος (α): <strong className="text-emerald-600 text-sm">{a}</strong></span>
                    <span>Όριο: 1 - 10</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={a}
                    onChange={(e) => {
                      setA(Number(e.target.value));
                      setStep(1); // Επαναφορά στο βήμα 1
                    }}
                    className="w-full h-2.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Χειριστήριο για το Άθροισμα (β) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Μπάλες στο 2ο μέλος (β): <strong className="text-purple-600 text-sm">{validB}</strong></span>
                    <span>Όριο: {a} - 15</span>
                  </div>
                  <input 
                    type="range" 
                    min={a} 
                    max="15" 
                    value={validB}
                    onChange={(e) => {
                      setB(Number(e.target.value));
                      setStep(1); // Επαναφορά στο βήμα 1
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
                    1. Αρχική Ισορροπία
                  </button>
                  <button 
                    onClick={() => setStep(2)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition-all ${
                      step === 2 
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105' 
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    2. Διαχωρισμός
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
                      Στον αριστερό δίσκο έχουμε το κουτί <strong className="text-indigo-600">x</strong> και <strong className="text-emerald-600">{a}</strong> μπάλες. Στον δεξιό έχουμε <strong className="text-purple-600">{validB}</strong> μπάλες.
                    </p>
                    <div className="font-mono font-black text-sm text-amber-900 mt-1">x + {a} = {validB}</div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">🔍 Βήμα 2: Διαχωρισμός των {validB} Μπαλών</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Χωρίζουμε τις {validB} μπάλες του δεξιού δίσκου σε <strong className="text-emerald-600">{a}</strong> (όσες δηλαδή υπάρχουν και αριστερά) και στις υπόλοιπες <strong className="text-indigo-600">{x}</strong>!
                    </p>
                    <div className="font-mono font-black text-sm text-amber-900 mt-1">x + {a} = {x} + {a}</div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">🎉 Βήμα 3: Αφαίρεση & Υπολογισμός</span>
                    <p className="text-xs text-slate-700 mt-1">
                      Αφαιρούμε τις <strong className="text-emerald-600">{a}</strong> μπάλες και από τους δύο δίσκους. Η ζυγαριά παραμένει σε ισορροπία!
                    </p>
                    <div className="font-mono font-black text-base text-emerald-700 mt-1">x = {validB} - {a} ➔ x = {x}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΖΥΓΑΡΙΑΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[480px] w-full relative overflow-hidden">
              <div className="w-full text-left">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  ⚖️ Η Ζυγαριά σε Ισορροπία
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Παρατήρησε πώς αλλάζουν οι μπάλες στους δύο δίσκους σε κάθε βήμα.
                </p>
              </div>

              {/* Περιοχή Γραφήματος Ζυγαριάς */}
              <div className="w-full bg-slate-50 rounded-2xl border border-gray-100 p-6 shadow-inner my-auto flex flex-col items-center justify-center min-h-[300px]">
                
                {/* ΚΟΡΜΟΣ ΖΥΓΑΡΙΑΣ */}
                <div className="relative w-full max-w-md flex flex-col items-center">
                  
                  {/* Οριζόντιος Βραχίονας */}
                  <div className="w-full h-3 bg-slate-700 rounded-full shadow-md relative flex justify-between items-center px-4">
                    
                    {/* Αριστερή Αλυσίδα */}
                    <div className="absolute left-6 top-3 w-1 h-20 bg-slate-400"></div>
                    {/* Δεξιά Αλυσίδα */}
                    <div className="absolute right-6 top-3 w-1 h-20 bg-slate-400"></div>
                  </div>

                  {/* Κεντρικός Στύλος & Βάση */}
                  <div className="w-4 h-32 bg-slate-800 -mt-1 shadow-inner"></div>
                  <div className="w-32 h-4 bg-slate-700 rounded-t-xl shadow-lg -mt-1"></div>

                  {/* ΔΙΣΚΟΙ ΖΥΓΑΡΙΑΣ */}
                  <div className="absolute top-20 w-full flex justify-between px-1">
                    
                    {/* 1. ΑΡΙΣΤΕΡΟΣ ΔΙΣΚΟΣ (1ο Μέλος) */}
                    <div className="flex flex-col items-center w-36">
                      <div className="w-full min-h-[110px] bg-indigo-50/80 border-b-4 border-indigo-400 rounded-b-2xl p-2 flex flex-wrap items-end justify-center gap-1.5 shadow-sm">
                        
                        {/* Κουτί x */}
                        <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-black text-lg px-3 py-2 rounded-xl shadow-md border border-indigo-300 flex items-center justify-center min-w-[40px]">
                          x
                        </div>

                        {/* Μπάλες α (εμφανίζονται στο Βήμα 1 και 2) */}
                        {step !== 3 && Array.from({ length: a }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 bg-emerald-500 rounded-full shadow border border-emerald-300 flex items-center justify-center text-[10px] font-bold text-white transition-all animate-fade-in"
                          >
                            ●
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-2">1ο Μέλος</span>
                    </div>

                    {/* 2. ΔΕΞΙΟΣ ΔΙΣΚΟΣ (2ο Μέλος) */}
                    <div className="flex flex-col items-center w-40">
                      <div className="w-full min-h-[110px] bg-purple-50/80 border-b-4 border-purple-400 rounded-b-2xl p-2 flex flex-wrap items-end justify-center gap-1.5 shadow-sm">
                        
                        {/* ΒΗΜΑ 1: Όλες οι β μπάλες μωβ */}
                        {step === 1 && Array.from({ length: validB }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-6 bg-purple-500 rounded-full shadow border border-purple-300 flex items-center justify-center text-[10px] font-bold text-white"
                          >
                            ●
                          </div>
                        ))}

                        {/* ΒΗΜΑ 2: Χωρισμός σε α πράσινες μπάλες & x μωβ μπάλες */}
                        {step === 2 && (
                          <>
                            {/* Οι α μπάλες (που θα αφαιρεθούν) - Πράσινες με περίγραμμα */}
                            {Array.from({ length: a }).map((_, i) => (
                              <div 
                                key={`a-${i}`} 
                                className="w-6 h-6 bg-emerald-500 rounded-full shadow-lg border-2 border-amber-300 ring-2 ring-emerald-300 flex items-center justify-center text-[10px] font-bold text-white animate-pulse"
                                title="Αντιστοιχεί στο α"
                              >
                                ●
                              </div>
                            ))}
                            {/* Οι x υπόλοιπες μπάλες - Μωβ */}
                            {Array.from({ length: x }).map((_, i) => (
                              <div 
                                key={`x-${i}`} 
                                className="w-6 h-6 bg-purple-500 rounded-full shadow border border-purple-300 flex items-center justify-center text-[10px] font-bold text-white"
                              >
                                ●
                              </div>
                            ))}
                          </>
                        )}

                        {/* ΒΗΜΑ 3: Μένουν μόνο οι x μωβ μπάλες */}
                        {step === 3 && Array.from({ length: x }).map((_, i) => (
                          <div 
                            key={`x-final-${i}`} 
                            className="w-6 h-6 bg-purple-500 rounded-full shadow border border-purple-300 flex items-center justify-center text-[10px] font-bold text-white animate-bounce"
                          >
                            ●
                          </div>
                        ))}

                      </div>
                      <span className="text-xs font-bold text-slate-500 mt-2">2ο Μέλος</span>
                    </div>

                  </div>

                </div>

              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>💡 Πατώντας τα κουμπιά των βημάτων βλέπεις τη ζυγαριά να απλοποιείται!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικές Εξισώσεις με Ζυγαριά ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

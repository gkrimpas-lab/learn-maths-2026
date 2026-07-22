// pages/st-dimotikou/31-agnostos_kai_prosthesi.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function AgnostosProsthesiPage() {
  // Ο γνωστός προσθετέος (a)
  const [a, setA] = useState(7);
  // Το συνολικό άθροισμα (b)
  const [b, setB] = useState(15);

  // Διασφάλιση ότι το b είναι πάντα μεγαλύτερο ή ίσο του a
  const validB = Math.max(b, a);
  // Ο άγνωστος x υπολογίζεται αυτόματα: x = b - a
  const x = validB - a;

  // Συντελεστής κλίμακας για το ύψος των μπαρών ώστε να χωράνε πάντα
  const maxVal = Math.max(validB, 1);
  const scale = Math.min(140 / maxVal, 8); 

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Εξισώσεις: x + α = β - LearnMaths.gr</title>
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
                  📖 Θεωρία: Η Εξίσωση $x + α = β$
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  <strong>Εξίσωση</strong> είναι μια μαθηματική ισότητα που περιέχει έναν άγνωστο αριθμό (συμβολίζεται με <strong>x</strong>).
                </p>
                <div className="bg-amber-50 text-slate-900 p-5 rounded-2xl border border-amber-100 space-y-2 text-sm md:text-base font-medium">
                  <p>🔑 <strong className="text-amber-900">Πώς λύνουμε την εξίσωση;</strong> Για να βρούμε τον άγνωστο προσθετέο $x$, μεταφέρουμε τον γνωστό προσθετέο στο άλλο μέλος κάνοντας την αντίθετη πράξη (αφαίρεση):</p>
                  <p>📐 <strong className="text-blue-900">Τύπος:</strong> <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900">x = β - α</span></p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-2xl md:text-3xl tracking-wide space-y-3">
                  <div className="bg-white/20 px-5 py-2 rounded-xl backdrop-blur-sm">
                    x + α = β
                  </div>
                  <div className="text-amber-200 text-xl font-bold">⬇️ Βήμα Επίλυσης ⬇️</div>
                  <div className="bg-white text-orange-600 px-6 py-2.5 rounded-2xl shadow-lg font-black text-2xl md:text-3xl font-mono">
                    x = β - α
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΒΗΜΑΤΑ ΕΠΙΛΥΣΗΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[460px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Φτιάξε τη δική σου Εξίσωση
                </h3>
                <p className="text-gray-500 text-sm">
                  Άλλαξε τις τιμές των σταθερών αριθμών για να δεις πώς λύνεται η εξίσωση.
                </p>
              </div>

              {/* Χειριστήρια αλλαγής α και β */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl w-full flex flex-col space-y-5 shadow-inner my-4">
                
                {/* Χειριστήριο για τον Προσθετέο (α) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Γνωστός Προσθετέος (α): <strong className="text-emerald-600 text-sm">{a}</strong></span>
                    <span>Όριο: 1 - 20</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="20" 
                    value={a}
                    onChange={(e) => setA(Number(e.target.value))}
                    className="w-full h-2.5 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                </div>

                {/* Χειριστήριο για το Άθροισμα (β) */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-600">
                    <span>Άθροισμα (β): <strong className="text-purple-600 text-sm">{validB}</strong></span>
                    <span>Όριο: {a} - 30</span>
                  </div>
                  <input 
                    type="range" 
                    min={a} 
                    max="30" 
                    value={validB}
                    onChange={(e) => setB(Number(e.target.value))}
                    className="w-full h-2.5 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                </div>

              </div>

              {/* Βήμα-Βήμα Επίλυση της Εξίσωσης */}
              <div className="p-5 bg-amber-50/60 border border-amber-200/80 rounded-2xl min-h-[150px] flex flex-col justify-center font-sans space-y-3 shadow-inner">
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                  📝 Βήματα Επίλυσης Εξίσωσης:
                </span>
                
                <div className="space-y-2 text-sm md:text-base font-mono">
                  {/* 1o Βήμα: Η Αρχική Εξίσωση */}
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-xs text-gray-400 font-sans font-bold">1. Εξίσωση:</span>
                    <span className="text-indigo-600 font-black">x</span>
                    <span className="text-gray-400">+</span>
                    <span className="text-emerald-600 font-black">{a}</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-purple-600 font-black">{validB}</span>
                  </div>

                  {/* 2o Βήμα: Η Αφαίρεση */}
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-xs text-gray-400 font-sans font-bold">2. Λύση:</span>
                    <span className="text-indigo-600 font-black">x</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-purple-600 font-black">{validB}</span>
                    <span className="text-gray-400">-</span>
                    <span className="text-emerald-600 font-black">{a}</span>
                  </div>

                  {/* 3o Βήμα: Το Αποτέλεσμα */}
                  <div className="flex items-center gap-2 bg-indigo-600 text-white p-2.5 rounded-xl shadow-md font-sans">
                    <span className="text-xs text-indigo-200 font-bold">3. Αποτέλεσμα:</span>
                    <span className="font-mono font-black text-amber-300 text-lg">x = {x}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[460px] w-full relative overflow-hidden">
              <div className="w-full text-left">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  📊 Γραφική Αναπαράσταση Εξίσωσης
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Η μπάρα του άγνωστου $x$ συμπληρώνει τη μπάρα του $a$ ώστε μαζί να ισούνται με το $b$.
                </p>
              </div>

              {/* Περιοχή Γραφήματος */}
              <div className="w-full bg-slate-50 rounded-2xl border border-gray-100 p-6 shadow-inner my-auto flex flex-col justify-end h-72">
                
                {/* 1. Οι ορθογώνιες μπάρες */}
                <div className="flex items-end justify-center gap-4 md:gap-6 w-full border-b border-gray-200 pb-2">
                  
                  {/* Μπάρα Άγνωστου x */}
                  <div className="flex flex-col items-center w-20">
                    <span className="text-sm font-black text-indigo-600 font-mono mb-1">{x}</span>
                    <div 
                      style={{ height: `${x * scale}px` }} 
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 transition-all duration-300 shadow-md"
                    ></div>
                  </div>

                  {/* Κενό για το σύμβολο + */}
                  <div className="w-8"></div>

                  {/* Μπάρα Γνωστού Προσθετέου (a) */}
                  <div className="flex flex-col items-center w-20">
                    <span className="text-sm font-black text-emerald-600 font-mono mb-1">{a}</span>
                    <div 
                      style={{ height: `${a * scale}px` }} 
                      className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-300 shadow-md"
                    ></div>
                  </div>

                  {/* Κενό για το σύμβολο = */}
                  <div className="w-8"></div>

                  {/* Μπάρα Αθροίσματος (b) */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-sm font-black text-purple-600 font-mono mb-1">{validB}</span>
                    <div 
                      style={{ height: `${validB * scale}px` }} 
                      className="w-full bg-gradient-to-t from-purple-500 to-purple-400 transition-all duration-300 shadow-lg border border-purple-300 border-b-0"
                    ></div>
                  </div>

                </div>

                {/* 2. Κάτω Πλαίσιο: Ταμπέλες, Μεταβλητές & Σύμβολα */}
                <div className="flex items-start justify-center gap-4 md:gap-6 pt-3 text-center w-full">
                  
                  {/* Άγνωστος x */}
                  <div className="flex flex-col items-center w-20">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Άγνωστος</span>
                    <span className="text-3xl font-black text-indigo-600 font-sans mt-1">x</span>
                  </div>

                  {/* Σύμβολο + */}
                  <div className="w-8 text-center pt-3">
                    <span className="text-4xl font-black text-red-500 font-sans">+</span>
                  </div>

                  {/* Γνωστός a */}
                  <div className="flex flex-col items-center w-20">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Προσθετέος</span>
                    <span className="text-3xl font-black text-emerald-600 font-sans mt-1">{a}</span>
                  </div>

                  {/* Σύμβολο = */}
                  <div className="w-8 text-center pt-3">
                    <span className="text-4xl font-black text-red-500 font-sans">=</span>
                  </div>

                  {/* Άθροισμα b */}
                  <div className="flex flex-col items-center w-24">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Άθροισμα</span>
                    <span className="text-3xl font-black text-purple-600 font-sans mt-1">{validB}</span>
                  </div>

                </div>

              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>💡 Παρατήρησε: Το άθροισμα των υψών της 1ης και 2ης μπάρας ισούται πάντα με την 3η μπάρα!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικές Εξισώσεις Πρόσθεσης ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

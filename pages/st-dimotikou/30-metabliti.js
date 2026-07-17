// pages/st-dimotikou/30-metabliti.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function MetablitiPage() {
  // Αρχική τιμή της μεταβλητής x
  const [x, setX] = useState(5);

  // Μια απλή μαθηματική έκφραση που εξαρτάται από το x
  const ekfrasiResult = x + 5;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📦 Ήρθε η Μεταβλητή! - LearnMaths.gr</title>
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
                  📖 Θεωρία: Τι είναι η Μεταβλητή;
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                  Φαντάσου μια <strong>μεταβλητή</strong> σαν ένα μαγικό, άδειο <strong>κουτί</strong>. Μέσα σε αυτό το κουτί μπορούμε να βάλουμε όποιον αριθμό θέλουμε! Επειδή ο αριθμός μπορεί να αλλάζει (να <em>μεταβάλλεται</em>), ονομάζουμε το κουτί μεταβλητή και του δίνουμε το όνομα ενός γράμματος, συνήθως το <strong>x</strong>.
                </p>
                <div className="bg-indigo-50 text-slate-900 p-5 rounded-2xl border border-indigo-100 space-y-2 text-sm md:text-base font-medium">
                  <p>💡 <strong className="text-indigo-900">Γιατί τη χρειαζόμαστε;</strong> Μας βοηθάει να γράφουμε κανόνες και μαθηματικές εκφράσεις για προβλήματα που δεν ξέρουμε ακόμα την ακριβή τους τιμή.</p>
                  <p>📊 <strong className="text-blue-900">Γραφική Αναπαράσταση:</strong> Στα γραφήματα, όταν αλλάζει η τιμή της μεταβλητής, αλλάζει μαζί και το μέγεθος (π.χ. το ύψος) της μπάρας που την αντιπροσωπεύει!</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-2xl shadow-md text-center py-10">
                <div className="inline-flex flex-col items-center font-black text-3xl md:text-4xl tracking-wide">
                  <div className="text-amber-300 pb-2">Μεταβλητή (x) =</div>
                  <div className="text-5xl my-2">📦 🔀 🔢</div>
                  <div className="text-white pt-2 text-2xl font-bold">Ένα γράμμα που κρύβει έναν αριθμό!</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΜΑΘΗΜΑΤΙΚΗ ΕΚΦΡΑΣΗ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[440px] w-full">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  🕹️ Άλλαξε την τιμή του x!
                </h3>
                <p className="text-gray-500 text-sm">
                  Σύρε τον κέρσορα (slider) για να δώσεις διαφορετικές τιμές στο κουτί <span className="font-bold text-indigo-600">x</span> και δες πώς αλλάζει το αποτέλεσμα της έκφρασης.
                </p>
              </div>

              {/* Slider για την αλλαγή της μεταβλητής */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl w-full flex flex-col items-center justify-center shadow-inner my-6 space-y-4">
                <div className="flex justify-between w-full max-w-sm text-sm font-bold text-gray-500">
                  <span>Ελάχιστο: 0</span>
                  <span>Μέγιστο: 20</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  value={x}
                  onChange={(e) => setX(Number(e.target.value))}
                  className="w-full max-w-sm h-3 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="text-xl font-extrabold text-indigo-600 bg-white px-4 py-2 rounded-xl shadow-sm border border-indigo-100">
                  Το κουτί x αυτή τη στιγμή κρύβει το: <span className="text-2xl font-black text-amber-500">{x}</span>
                </div>
              </div>

              {/* Μαθηματική Καταγραφή / Ανάλυση */}
              <div className="p-5 bg-gray-50 border border-gray-200 rounded-2xl min-h-[140px] flex flex-col justify-center font-sans space-y-3 shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                  🧬 Μαθηματική Έκφραση: x + 5
                </span>
                <div className="text-lg md:text-xl text-slate-700 font-medium space-y-1">
                  <div>Αντικαθιστούμε το <span className="text-indigo-600 font-bold">x</span> με το <span className="text-amber-500 font-bold">{x}</span>:</div>
                  <div className="flex items-center gap-2 mt-2 font-mono bg-white p-3 rounded-xl border border-gray-100 w-fit text-2xl shadow-sm">
                    <span className="text-indigo-600 font-black">{x}</span>
                    <span className="text-gray-400">+</span>
                    <span className="text-emerald-600 font-black">5</span>
                    <span className="text-gray-400">=</span>
                    <span className="text-purple-600 font-black">{ekfrasiResult}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ - ΝΕΟ ΣΤΥΛ ΕΞΙΣΩΣΗΣ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-between min-h-[440px] w-full relative overflow-hidden">
              <div className="w-full text-left">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  📊 Γραφική Αναπαράσταση
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  Δες πώς το ύψος της μπάρας του x μεταβάλλεται, ενώ η μπάρα του σταθερού αριθμού 5 μένει ίδια!
                </p>
              </div>

              {/* Περιοχή Γραφήματος και Μαθηματικών Συμβόλων */}
              <div className="w-full flex items-end justify-center gap-4 md:gap-6 h-64 bg-slate-50 rounded-2xl border border-gray-100 p-6 shadow-inner my-auto">
                
                {/* 1. Μπάρα Μεταβλητής x */}
                <div className="flex flex-col items-center w-20">
                  {/* Αριθμός πάνω από τη μπάρα */}
                  <span className="text-sm font-black text-indigo-600 font-mono mb-1">{x}</span>
                  <div 
                    style={{ height: `${x * 6}px` }} 
                    className="w-full bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-xl transition-all duration-300 shadow-md min-h-[14px]"
                  ></div>
                  {/* Ταμπέλα και Σύμβολο x από κάτω */}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-2">Μεταβλητή</span>
                  <span className="text-3xl font-black text-indigo-600 font-sans mt-1">x</span>
                </div>

                {/* Σύμβολο ΣΥΝ (+) ανάμεσα στις μπάρες */}
                <div className="h-full flex items-end pb-1.5 justify-center">
                  <span className="text-4xl font-black text-red-500 font-sans">+</span>
                </div>

                {/* 2. Μπάρα Σταθεράς 5 */}
                <div className="flex flex-col items-center w-20">
                  {/* Αριθμός πάνω από τη μπάρα */}
                  <span className="text-sm font-black text-emerald-600 font-mono mb-1">5</span>
                  <div 
                    style={{ height: '30px' }} 
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-xl shadow-md"
                  ></div>
                  {/* Ταμπέλα και Σύμβολο 5 από κάτω */}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-2">Σταθερά</span>
                  <span className="text-3xl font-black text-emerald-600 font-sans mt-1">5</span>
                </div>

                {/* Σύμβολο ΙΣΟΝ (=) ανάμεσα στις μπάρες */}
                <div className="h-full flex items-end pb-1.5 justify-center">
                  <span className="text-4xl font-black text-red-500 font-sans">=</span>
                </div>

                {/* 3. Μπάρα Αποτελέσματος (x + 5) */}
                <div className="flex flex-col items-center w-24">
                  {/* Αριθμός πάνω από τη μπάρα */}
                  <span className="text-sm font-black text-purple-600 font-mono mb-1">{ekfrasiResult}</span>
                  <div 
                    style={{ height: `${ekfrasiResult * 6}px` }} 
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-xl transition-all duration-300 shadow-lg border border-purple-300 border-b-0"
                  ></div>
                  {/* Ταμπέλα και Έκφραση από κάτω */}
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mt-2">Σύνολο</span>
                  <span className="text-2xl font-black text-purple-600 font-mono mt-1 whitespace-nowrap">x + 5</span>
                </div>

              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-auto text-center">
                <span>🔍 Παρατήρησε: Μόνο η μπάρα και η τιμή του <span className="text-indigo-600">x</span> αλλάζουν!</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστικές Μεταβλητές ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

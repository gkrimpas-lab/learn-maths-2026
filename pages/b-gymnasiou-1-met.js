import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ============================================================================
// ΡΥΘΜΙΣΕΙΣ ΜΗΧΑΝΗΜΑΤΟΣ ΜΑΘΗΜΑΤΙΚΩΝ (ΚΑΡΤΕΛΑ 1)
// ============================================================================
const VAR_MACHINE_CONFIG = {
  minX: -20,
  maxX: 20,
  a: 3,    // Ο συντελεστής (πολλαπλασιαστής)
  b: 5     // Η σταθερά (πρόσθεση)
};

export default function BGymnasiouMetabliti() {
  const [inputX, setInputX] = useState(5);

  // Βοηθητική συνάρτηση για εμφάνιση του x με παρενθέσεις αν είναι αρνητικός
  const formatX = (val) => val < 0 ? `(${val})` : val;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 md:p-8">
      <Head>
        <title>1. Η Μεταβλητή - Β' Γυμνασίου</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ΣΥΝΔΕΣΜΟΣ ΕΠΙΣΤΡΟΦΗΣ ΣΤΟ ΚΕΝΤΡΙΚΟ DASHBOARD */}
        <Link href="/b-gymnasiou" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
          &larr; Επιστροφή στον Πίνακα Μαθημάτων
        </Link>

        {/* ΚΥΡΙΩΣ ΠΛΑΙΣΙΟ ΜΑΘΗΜΑΤΟΣ */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                📦 1. Τι είναι η Μεταβλητή;
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Στα Μαθηματικά, <strong>μεταβλητή</strong> είναι ένα γράμμα (συνήθως το <span className="text-amber-600 font-bold">x</span>) που χρησιμοποιούμε για να παραστήσουμε έναν αριθμό που <strong>δεν είναι σταθερός</strong>, αλλά μπορεί να αλλάζει τιμές.
              </p>
              <div className="bg-amber-50 text-amber-900 p-3 rounded-xl border border-amber-200 text-xs font-semibold">
                💡 Σκέψου το σαν ένα κουτί: Το όνομα του κουτιού είναι το &quot;x&quot;, αλλά το περιεχόμενο μέσα μπορεί να αλλάξει!
              </div>
            </div>

            {/* Πλαίσιο Δεξιά */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-5 rounded-2xl shadow w-full md:w-80">
              <h3 className="font-bold text-sm mb-2">🔍 Μεταβλητή vs Σταθερά</h3>
              <p className="text-xs opacity-90 leading-relaxed">
                Στην έκφραση <span className="font-mono font-bold bg-black/20 px-1 rounded">{VAR_MACHINE_CONFIG.a} · x + {VAR_MACHINE_CONFIG.b}</span>, το <span className="font-bold text-yellow-300">x</span> είναι η μεταβλητή, ενώ το <span className="font-bold">{VAR_MACHINE_CONFIG.a}</span> iκαι το <span className="font-bold">{VAR_MACHINE_CONFIG.b}</span> είναι σταθερές.
              </p>
            </div>
          </div>

          {/* ΤΟ ΜΗΧΑΝΗΜΑ ΤΩΝ ΜΑΘΗΜΑΤΙΚΩΝ */}
          <div className="bg-slate-50 p-6 rounded-2xl border text-center space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">⚙️ Το Μηχάνημα των Μαθηματικών</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* 1. Είσοδος */}
              <div className="bg-white p-4 rounded-xl border shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">1. ΕΙΣΟΔΟΣ (X)</span>
                <div className="text-3xl font-mono font-black text-amber-500">{inputX}</div>
                <input 
                  type="range" 
                  min={VAR_MACHINE_CONFIG.minX} 
                  max={VAR_MACHINE_CONFIG.maxX} 
                  value={inputX} 
                  onChange={(e) => setInputX(parseInt(e.target.value))} 
                  className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                />
                <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1 font-mono">
                  <span>{VAR_MACHINE_CONFIG.minX}</span>
                  <span>{VAR_MACHINE_CONFIG.maxX}</span>
                </div>
              </div>
              
              {/* 2. Επεξεργασία */}
              <div className="bg-white p-4 rounded-xl border-2 border-indigo-600 shadow-md">
                <span className="text-[10px] font-bold text-indigo-600 uppercase block mb-2">2. ΕΠΕΞΕΡΓΑΣΙΑ (ΑΝΤΙΚΑΤΑΣΤΑΣΗ)</span>
                <div className="text-xl font-mono font-bold text-slate-700">
                  {VAR_MACHINE_CONFIG.a} &middot; <span className="bg-amber-100 px-2 py-0.5 rounded text-amber-700 font-black">{formatX(inputX)}</span> + {VAR_MACHINE_CONFIG.b} = <span className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-700 font-black">{VAR_MACHINE_CONFIG.a * inputX + VAR_MACHINE_CONFIG.b}</span>
                </div>
              </div>

              {/* 3. Έξοδος */}
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">3. ΕΞΟΔΟΣ (Y)</span>
                <div className="text-3xl font-mono font-black text-emerald-500">{VAR_MACHINE_CONFIG.a * inputX + VAR_MACHINE_CONFIG.b}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        input[type="range"]::-webkit-slider-runnable-track { background: #e2e8f0; height: 8px; border-radius: 8px; }
        input[type="range"]::-moz-range-track { background: #e2e8f0; height: 8px; border-radius: 8px; }
      `}</style>
    </div>
  );
}

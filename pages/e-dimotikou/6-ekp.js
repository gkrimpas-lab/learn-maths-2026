{/* ΔΥΝΑΜΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΕΙΣΑΓΩΓΗΣ ΑΡΙΘΜΩΝ - Ξεκάθαρος διαχωρισμός με Cards */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
  
  {/* Αριθμός 1 */}
  <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200 flex flex-col items-center space-y-2 shadow-sm text-center">
    <span className="font-black text-blue-700 text-xs uppercase tracking-wide">1ος Αριθμός</span>
    <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-blue-100 gap-3">
      <button onClick={() => setN1(Math.max(LIMITS.NUM_MIN, n1 - 1))} className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full font-black hover:bg-blue-200 transition shadow-sm">-</button>
      <span className="w-6 text-center font-black text-xl text-blue-600">{n1}</span>
      <button onClick={() => setN1(Math.min(LIMITS.NUM_MAX, n1 + 1))} className="bg-blue-600 text-white w-8 h-8 rounded-full font-black hover:bg-blue-700 transition shadow-sm">+</button>
    </div>
  </div>

  {/* Αριθμός 2 */}
  <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 flex flex-col items-center space-y-2 shadow-sm text-center">
    <span className="font-black text-indigo-700 text-xs uppercase tracking-wide">2ος Αριθμός</span>
    <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-indigo-100 gap-3">
      <button onClick={() => setN2(Math.max(LIMITS.NUM_MIN, n2 - 1))} className="bg-indigo-100 text-indigo-700 w-8 h-8 rounded-full font-black hover:bg-indigo-200 transition shadow-sm">-</button>
      <span className="w-6 text-center font-black text-xl text-indigo-600">{n2}</span>
      <button onClick={() => setN2(Math.min(LIMITS.NUM_MAX, n2 + 1))} className="bg-indigo-600 text-white w-8 h-8 rounded-full font-black hover:bg-indigo-700 transition shadow-sm">+</button>
    </div>
  </div>

  {/* Αριθμός 3 (Δυναμικός) */}
  {numCount >= 3 ? (
    <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 flex flex-col items-center space-y-2 shadow-sm text-center animate-fade-in">
      <span className="font-black text-purple-700 text-xs uppercase tracking-wide">3ος Αριθμός</span>
      <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-purple-100 gap-3">
        <button onClick={() => setN3(Math.max(LIMITS.NUM_MIN, n3 - 1))} className="bg-purple-100 text-purple-700 w-8 h-8 rounded-full font-black hover:bg-purple-200 transition shadow-sm">-</button>
        <span className="w-6 text-center font-black text-xl text-purple-600">{n3}</span>
        <button onClick={() => setN3(Math.min(LIMITS.NUM_MAX, n3 + 1))} className="bg-purple-600 text-white w-8 h-8 rounded-full font-black hover:bg-purple-700 transition shadow-sm">+</button>
      </div>
    </div>
  ) : (
    <div className="hidden md:flex bg-gray-50/40 p-4 rounded-2xl border border-dashed border-gray-200 flex-col items-center justify-center opacity-40 text-center">
      <span className="text-xs font-bold text-gray-400">Ανενεργό</span>
    </div>
  )}

  {/* Αριθμός 4 (Δυναμικός) */}
  {numCount === 4 ? (
    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 flex flex-col items-center space-y-2 shadow-sm text-center animate-fade-in">
      <span className="font-black text-emerald-700 text-xs uppercase tracking-wide">4ος Αριθμός</span>
      <div className="flex items-center bg-white p-1.5 px-3 rounded-xl border border-emerald-100 gap-3">
        <button onClick={() => setN4(Math.max(LIMITS.NUM_MIN, n4 - 1))} className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full font-black hover:bg-emerald-200 transition shadow-sm">-</button>
        <span className="w-6 text-center font-black text-xl text-emerald-600">{n4}</span>
        <button onClick={() => setN4(Math.min(LIMITS.NUM_MAX, n4 + 1))} className="bg-emerald-600 text-white w-8 h-8 rounded-full font-black hover:bg-emerald-700 transition shadow-sm">+</button>
      </div>
    </div>
  ) : (
    <div className="hidden md:flex bg-gray-50/40 p-4 rounded-2xl border border-dashed border-gray-200 flex-col items-center justify-center opacity-40 text-center">
      <span className="text-xs font-bold text-gray-400">Ανενεργό</span>
    </div>
  )}

</div>

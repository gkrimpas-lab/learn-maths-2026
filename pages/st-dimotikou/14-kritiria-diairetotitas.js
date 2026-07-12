import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const PRESETS = [24, 135, 450, 1236, 7525];

export default function KritiriaDiairetotitasPage() {
  const [numberStr, setNumberStr] = useState("135");

  const handleInputChange = (val) => {
    // Μόνο θετικοί ακέραιοι αριθμοί έως το 10000 για να είναι ευανάγνωστη η οπτικοποίηση
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setNumberStr('');
    } else if (parseInt(clean, 10) > 10000) {
      setNumberStr("10000");
    } else {
      setNumberStr(clean);
    }
  };

  const num = parseInt(numberStr, 10) || 0;
  const digits = numberStr.split('').map(Number);
  const lastDigit = digits.length > 0 ? digits[digits.length - 1] : null;
  const lastTwoDigitsStr = digits.length > 1 ? numberStr.slice(-2) : numberStr;
  const lastTwoDigits = parseInt(lastTwoDigitsStr, 10) || 0;
  const sumOfDigits = digits.reduce((a, b) => a + b, 0);

  // Ορισμός των κανόνων και των ελέγχων
  const criteria = [
    {
      check: 2,
      title: "Διαιρείται με το 2;",
      rule: "Πρέπει το τελευταίο ψηφίο να είναι ζυγό (0, 2, 4, 6, 8).",
      isTrue: num % 2 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-yellow-400 font-black underline text-sm">{lastDigit}</span>
            </span>
          ) : "—"} 
          {num % 2 === 0 ? " (Είναι ζυγό! ✅)" : " (Δεν είναι ζυγό! ❌)"}
        </div>
      )
    },
    {
      check: 3,
      title: "Διαιρείται με το 3;",
      rule: "Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 3.",
      isTrue: num % 3 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Άθροισμα: {digits.join(' + ')} = <span className="text-yellow-400 font-black text-sm">{sumOfDigits}</span>
          {num % 3 === 0 ? ` (Το ${sumOfDigits} διαιρείται με το 3! ✅)` : ` (Το ${sumOfDigits} δεν διαιρείται με το 3! ❌)`}
        </div>
      )
    },
    {
      check: 4,
      title: "Διαιρείται με το 4;",
      rule: "Πρέπει τα δύο τελευταία ψηφία να σχηματίζουν αριθμό που διαιρείται με το 4 (ή να είναι 00).",
      isTrue: num % 4 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Δύο τελευταία ψηφία: {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-yellow-400 font-black underline text-sm">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-yellow-400 font-black underline text-sm">{numberStr}</span>}
          {num % 4 === 0 ? ` (Το ${lastTwoDigits} διαιρείται με το 4! ✅)` : ` (Το ${lastTwoDigits} δεν διαιρείται με το 4! ❌)`}
        </div>
      )
    },
    {
      check: 5,
      title: "Διαιρείται με το 5;",
      rule: "Πρέπει το τελευταίο ψηφίο να είναι 0 ή 5.",
      isTrue: num % 5 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-yellow-400 font-black underline text-sm">{lastDigit}</span>
            </span>
          ) : "—"} 
          {num % 5 === 0 ? " (Είναι 0 ή 5! ✅)" : " (Δεν είναι 0 ή 5! ❌)"}
        </div>
      )
    },
    {
      check: 9,
      title: "Διαιρείται με το 9;",
      rule: "Πρέπει το άθροισμα των ψηφίων του να διαιρείται με το 9.",
      isTrue: num % 9 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Άθροισμα: {digits.join(' + ')} = <span className="text-yellow-400 font-black text-sm">{sumOfDigits}</span>
          {num % 9 === 0 ? ` (Το ${sumOfDigits} διαιρείται με το 9! ✅)` : ` (Το ${sumOfDigits} δεν διαιρείται με το 9! ❌)`}
        </div>
      )
    },
    {
      check: 10,
      title: "Διαιρείται με το 10;",
      rule: "Πρέπει το τελευταίο ψηφίο να είναι 0.",
      isTrue: num % 10 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Τελευταίο ψηφίο: {digits.length > 0 ? (
            <span>
              {numberStr.slice(0, -1)}
              <span className="text-yellow-400 font-black underline text-sm">{lastDigit}</span>
            </span>
          ) : "—"} 
          {num % 10 === 0 ? " (Είναι 0! ✅)" : " (Δεν είναι 0! ❌)"}
        </div>
      )
    },
    {
      check: 25,
      title: "Διαιρείται με το 25;",
      rule: "Πρέπει τα δύο τελευταία ψηφία να είναι 00, 25, 50, ή 75.",
      isTrue: num % 25 === 0,
      visual: () => (
        <div className="text-xs font-mono bg-slate-800 text-slate-300 p-2.5 rounded-lg border border-slate-700">
          Δύο τελευταία ψηφία: {digits.length > 1 ? (
            <span>
              {numberStr.slice(0, -2)}
              <span className="text-yellow-400 font-black underline text-sm">{lastTwoDigitsStr}</span>
            </span>
          ) : <span className="text-yellow-400 font-black underline text-sm">{numberStr}</span>}
          {num % 25 === 0 ? " (Είναι στις επιλογές 00, 25, 50, 75! ✅)" : " (Δεν είναι 00, 25, 50, 75! ❌)"}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Κριτήρια Διαιρετότητας - LearnMaths.gr</title>
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
                    <span>📖</span> Τι είναι τα Κριτήρια Διαιρετότητας;
                  </h2>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Τα <strong>κριτήρια διαιρετότητας</strong> είναι «έξυπνα μαθηματικά κόλπα» που μας βοηθούν να καταλάβουμε αμέσως αν ένας αριθμός διαιρείται ακριβώς με έναν άλλον, <strong>χωρίς να κάνουμε τη χρονοβόρα πράξη της διαίρεσης</strong>!
                  </p>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    Κοιτάζοντας απλά τα τελευταία ψηφία ή προσθέτοντας τα ψηφία ενός αριθμού, έχουμε την απάντηση στο δευτερόλεπτο.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-md space-y-3 flex flex-col justify-center">
                <span className="text-amber-300 font-black text-base block border-b border-white/20 pb-1">💡 Τα 2 Μεγάλα Μυστικά:</span>
                <ul className="space-y-2 text-xs md:text-sm text-indigo-50 font-normal list-disc pl-4">
                  <li>Για τα <strong>2, 4, 5, 10, 25</strong> κοιτάμε μόνο το <strong>τέλος</strong> του αριθμού (τα τελευταία ψηφία).</li>
                  <li>Για τα <strong>3 και 9</strong> κάνουμε <strong>άθροισμα</strong> (προσθέτουμε όλα τα ψηφία του αριθμού μεταξύ τους).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: INPUT & PRESETS */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 justify-between">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-gray-900">Δοκίμασε έναν Αριθμό!</h3>
                  <p className="text-gray-500 text-xs">Γράψε έναν αριθμό έως το 10.000 για να ελέγξεις τα κριτήρια.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={numberStr}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full text-3xl font-mono font-black text-center p-3 bg-slate-50 border-2 border-blue-200 rounded-xl shadow-inner text-blue-600 outline-none focus:border-blue-500 tracking-widest"
                    placeholder="π.χ. 135"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Ή διάλεξε έτοιμο παράδειγμα:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setNumberStr(preset.toString())}
                        className={`px-4 py-2 rounded-xl border font-mono font-bold text-sm transition-all ${numberStr === preset.toString() ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΖΩΝΤΑΝΟΣ ΕΛΕΓΧΟΣ ΚΡΙΤΗΡΙΩΝ ΚΑΙ ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[460px]">
              
              <div className="w-full text-center mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Έλεγχος Ψηφίων για τον Αριθμό:</span>
                <div className="text-2xl font-mono font-black text-indigo-600 bg-indigo-50 px-6 py-1.5 rounded-xl border border-indigo-100 inline-block mt-2 tracking-widest">
                  {numberStr || "—"}
                </div>
              </div>

              {/* ΛΙΣΤΑ ΚΡΙΤΗΡΙΩΝ & ΟΠΤΙΚΟΠΟΙΗΣΗΣ */}
              <div className="w-full space-y-4 my-auto max-h-[400px] overflow-y-auto pr-2">
                {numberStr ? (
                  criteria.map((c) => (
                    <div key={c.check} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      {/* Κείμενο Κανόνα */}
                      <div className="space-y-1 md:max-w-[45%]">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-md text-white ${c.isTrue ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {c.isTrue ? '✓ Ναι' : '✕ Όχι'}
                          </span>
                          <h4 className="text-sm font-black text-slate-800">{c.title}</h4>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-tight font-medium">{c.rule}</p>
                      </div>

                      {/* Γραφική / Μαθηματική Αναπαράσταση (Visual Tool) */}
                      <div className="flex-1 md:max-w-[50%]">
                        {c.visual()}
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-slate-400 font-medium">
                    Πληκτρολόγησε έναν αριθμό στα αριστερά για να ξεκινήσει η οπτική ανάλυση.
                  </div>
                )}
              </div>

              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>🔍 Μπορείς να βρεις έναν αριθμό που να διαιρείται ταυτόχρονα με το 2, το 5 και το 10; (Σκέψου σε τι πρέπει να τελειώνει!)</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Κριτήρια Διαιρετότητας - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

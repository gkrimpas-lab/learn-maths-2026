// pages/e-dimotikou/8-mkd.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const LIMITS = {
  NUM_MIN: 4,
  NUM_MAX: 48
};

export default function MkdPage() {
  // Πλήθος αριθμών προς εξέταση (2, 3 ή 4)
  const [numCount, setNumCount] = useState(2);

  // Οι τιμές για έως και 4 αριθμούς
  const [n1, setN1] = useState(12);
  const [n2, setN2] = useState(18);
  const [n3, setN3] = useState(24);
  const [n4, setN4] = useState(30);

  // Συναρτήσεις εύρεσης ΜΚΔ για δύο αριθμούς
  const findGCDOfTwo = (a, b) => {
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Υπολογισμός του τελικού ΜΚΔ δυναμικά βάσει του πλήθους των αριθμών
  let mkdResult = findGCDOfTwo(n1, n2);
  if (numCount >= 3) mkdResult = findGCDOfTwo(mkdResult, n3);
  if (numCount === 4) mkdResult = findGCDOfTwo(mkdResult, n4);

  // Παραγωγή λιστών με τους πραγματικούς διαιρέτες του κάθε αριθμού
  const getDivisors = (num) => {
    const divs = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divs.push(i);
    }
    return divs;
  };

  const list1 = getDivisors(n1);
  const list2 = getDivisors(n2);
  const list3 = getDivisors(n3);
  const list4 = getDivisors(n4);

  // Συνάρτηση ελέγχου αν ένας αριθμός είναι κοινός διαιρέτης όλων των επιλεγμένων
  const isCommonDivisor = (val) => {
    if (numCount === 2) return n1 % val === 0 && n2 % val === 0;
    if (numCount === 3) return n1 % val === 0 && n2 % val === 0 && n3 % val === 0;
    return n1 % val === 0 && n2 % val === 0 && n3 % val === 0 && n4 % val === 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🏆 Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/e-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* ΘΕΩΡΙΑ */}
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-gray-900 2xl:text-4xl">🏆 Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</h2>
              <p className="text-gray-600 leading-relaxed text-base xl:text-lg">
                Μέγιστος Κοινός Διαιρέτης (ΜΚΔ) δύο ή περισσότερων φυσικών αριθμών ονομάζεται ο <strong>μεγαλύτερος από τους κοινούς διαιρέτες τους</strong>. Μας βοηθάει να κάνουμε γρήγορες απλοποιήσεις κλασμάτων!
              </p>
            </div>

            {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-8">
              
              {/* ΕΠΙΛΟΓΗ ΠΛΗΘΟΥΣ ΑΡΙΘΜΩΝ */}
              <div className="flex flex-col items-center justify-center space-y-3">
                <span className="text-xs uppercase font-black text-gray-400 tracking-wider">Πόσους αριθμούς θέλεις να εξετάσεις;</span>
                <div className="inline-flex p-1.5 bg-slate-200 rounded-2xl shadow-inner gap-1">
                  {[2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => setNumCount(count)}
                      className={`px-5 py-2 rounded-xl font-black text-sm transition shadow-sm ${numCount === count ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-300'}`}
                    >
                      {count} Αριθμούς
                    </button>
                  ))}
                </div>
              </div>

              {/* ΔΥΝΑΜΙΚΑ ΧΕΙΡΙΣΤΗΡΙΑ ΜΕ ΑΥΤΟΝΟΜΑ CARDS */}
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

                {/* Αριθμός 3 */}
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
                    <span className="text-xs font-bold text-gray-400">Διαθέσιμο</span>
                  </div>
                )}

                {/* Αριθμός 4 */}
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
                    <span className="text-xs font-bold text-gray-400">Διαθέσιμο</span>
                  </div>
                )}
              </div>

              {/* ΠΑΡΑΘΕΣΗ ΔΙΑΙΡΕΤΩΝ */}
              <div className="space-y-4 max-w-5xl mx-auto">
                {/* Λίστα 1 */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Διαιρέτες του {n1}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                    {list1.map((v) => (
                      <span key={v} className={`p-1.5 px-3 rounded-lg border ${v === mkdResult ? 'bg-emerald-500 text-white border-emerald-400 font-black scale-105 shadow ring-2 ring-emerald-300' : isCommonDivisor(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                    ))}
                  </div>
                </div>

                {/* Λίστα 2 */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1">
                  <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Διαιρέτες του {n2}</span>
                  <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                    {list2.map((v) => (
                      <span key={v} className={`p-1.5 px-3 rounded-lg border ${v === mkdResult ? 'bg-emerald-500 text-white border-emerald-400 font-black scale-105 shadow ring-2 ring-emerald-300' : isCommonDivisor(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                    ))}
                  </div>
                </div>

                {/* Λίστα 3 */}
                {numCount >= 3 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1 animate-fade-in">
                    <span className="text-[11px] font-black text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Διαιρέτες του {n3}</span>
                    <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                      {list3.map((v) => (
                        <span key={v} className={`p-1.5 px-3 rounded-lg border ${v === mkdResult ? 'bg-emerald-500 text-white border-emerald-400 font-black scale-105 shadow ring-2 ring-emerald-300' : isCommonDivisor(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Λίστα 4 */}
                {numCount === 4 && (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-1 animate-fade-in">
                    <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Διαιρέτες του {n4}</span>
                    <div className="flex flex-wrap gap-1.5 pt-1.5 text-sm font-bold">
                      {list4.map((v) => (
                        <span key={v} className={`p-1.5 px-3 rounded-lg border ${v === mkdResult ? 'bg-emerald-500 text-white border-emerald-400 font-black scale-105 shadow ring-2 ring-emerald-300' : isCommonDivisor(v) ? 'bg-cyan-500 text-white border-cyan-400' : 'bg-slate-50 text-slate-700 border-slate-100'}`}>{v}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ΕΠΕΞΗΓΗΣΗ ΧΡΩΜΑΤΩΝ */}
              <div className="flex flex-wrap gap-4 justify-center text-[11px] font-bold text-gray-500 pt-1">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-cyan-500 rounded-sm"></span> Κοινοί Διαιρέτες</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Ο Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</span>
              </div>

              {/* ΑΠΟΤΕΛΕΣΜΑ */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-2xl text-center shadow-lg max-w-xl mx-auto space-y-2">
                <span className="text-xs uppercase font-black text-emerald-200 tracking-wider block">Το Αποτέλεσμα</span>
                <div className="text-xl sm:text-2xl font-black">
                  ΜΚΔ = <span className="text-yellow-300 text-3xl sm:text-4xl ml-1 inline-block animate-bounce">{mkdResult}</span>
                </div>
                <p className="text-xs text-emerald-100 opacity-90">
                  Το {mkdResult} είναι ο μεγαλύτερος δυνατός αριθμός που μπορεί να διαιρέσει ταυτόχρονα και ακριβώς όλους τους επιλεγμένους αριθμούς!
                </p>
              </div>

            </div>

          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Υπολογισμός ΜΚΔ Φυσικών Αριθμών.</p>
      </footer>
    </div>
  );
}

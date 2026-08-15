import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function FysikoiArithmoiPage() {
  const [number, setNumber] = useState("10432400");

  const periods = [
    { name: "Δισεκατομμύρια", color: "bg-purple-600", light: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
    { name: "Εκατομμύρια", color: "bg-rose-600", light: "bg-rose-50", border: "border-rose-200", text: "text-rose-700" },
    { name: "Χιλιάδες", color: "bg-blue-600", light: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    { name: "Μονάδες", color: "bg-emerald-600", light: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  ];

  const presets = [
    { label: '🇬🇷 Πληθυσμός Ελλάδας', val: '10432400' },
    { label: '🌍 Περίμετρος Ισημερινού', val: '40075' },
    { label: '☀️ Απόσταση Γης-Ήλιου (km)', val: '149600000' },
    { label: '👥 Πληθυσμός Γης', val: '8000000000' }
  ];

  const cleanNumber = (number || "0").replace(/\D/g, '').slice(0, 12) || "0";
  const padded = cleanNumber.padStart(12, '0').slice(-12);
  const digits = padded.split('');
  const firstNonZero = digits.findIndex(d => d !== '0');
  const formattedReadable = Number(cleanNumber).toLocaleString('el-GR');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Φυσικοί Αριθμοί & Αξία Θέσης - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία και εργαστήριο για τους φυσικούς αριθμούς και τον πίνακα αξίας θέσης για τη ΣΤ' Δημοτικού." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
              <span className="text-3xl">📐</span> LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/st-dimotikou/01-fysikoi-ask" 
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition hover:shadow"
              >
                🎯 <span>Ασκήσεις</span>
              </Link>
              <Link 
                href="/st-dimotikou" 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                🔙 <span>Πίσω</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* 2. HEADER HERO BANNER ΜΕ PROMO CARD */}
        <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-12 px-4 shadow-inner">
          <div className={`${LAYOUT.CONTAINER} grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}>
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs md:text-sm font-bold uppercase tracking-wider text-cyan-100 border border-white/20">
                <span>🎒 ΣΤ' Δημοτικού</span>
                <span>•</span>
                <span>Ενότητα 1: Αριθμοί & Πράξεις</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Φυσικοί Αριθμοί & Αξία Θέσης Ψηφίου
              </h1>
              <p className="text-blue-100 text-base md:text-lg max-w-2xl leading-relaxed">
                Μάθε πώς οργανώνουμε τους μεγάλους αριθμούς σε <strong>Περιόδους</strong> και <strong>Τάξεις</strong>, και ανακάλυψε πώς η θέση κάθε ψηφίου καθορίζει την πραγματική του αξία!
              </p>
            </div>

            {/* Promo Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-3xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 bg-amber-400 text-gray-900 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                🎯
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Έτοιμος για εξάσκηση;</h2>
                <p className="text-xs text-blue-100 mt-1">8 δυναμικές ερωτήσεις με άμεση βαθμολόγηση!</p>
              </div>
              <Link 
                href="/st-dimotikou/01-fysikoi-ask" 
                className="block w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-gray-900 font-extrabold rounded-2xl transition duration-200 shadow-lg text-center"
              >
                🚀 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </section>

        {/* 3. ΑΝΑΛΥΤΙΚΗ ΘΕΩΡΙΑ ΣΕ 3 ΚΑΡΤΕΣ */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                1
              </div>
              <h2 className="text-lg font-black text-gray-900">Τι είναι οι Φυσικοί Αριθμοί;</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Είναι οι αριθμοί <strong>0, 1, 2, 3, 4, ...</strong> που χρησιμοποιούμε για να μετράμε και να διατάσσουμε αντικείμενα. Το σύνολο των φυσικών αριθμών είναι <strong>άπειρο</strong>.
              </p>
              <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs font-mono text-blue-700">
                ℕ = &#123; 0, 1, 2, 3, 4, ... &#125;
              </div>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                2
              </div>
              <h2 className="text-lg font-black text-gray-900">Περίοδοι & Τάξεις</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Χωρίζουμε τους μεγάλους αριθμούς σε <strong>τριάδες</strong> από τα δεξιά προς τα αριστερά. Κάθε περίοδος περιλαμβάνει:
              </p>
              <ul className="text-xs text-gray-700 space-y-1 font-medium bg-white p-3 rounded-xl border border-indigo-100">
                <li>• <strong>Ε</strong>: Εκατοντάδες (100)</li>
                <li>• <strong>Δ</strong>: Δεκάδες (10)</li>
                <li>• <strong>Μ</strong>: Μονάδες (1)</li>
              </ul>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                3
              </div>
              <h2 className="text-lg font-black text-gray-900">Αξία Θέσης Ψηφίου</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Το ίδιο ψηφίο έχει διαφορετική αξία ανάλογα με τη θέση του. Κάθε θέση προς τα αριστερά αξίζει <strong>10 φορές περισσότερο</strong>.
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-gray-700">
                💡 Στον αριθμό <strong>5.500</strong>: το πρώτο 5 αξίζει <strong>5.000</strong> ενώ το δεύτερο <strong>500</strong>.
              </div>
            </div>

          </div>

          {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ (INTERACTIVE PLAYGROUND) */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  🔬 Διαδραστικό Εργαστήριο
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  Ο Πίνακας Αξίας Θέσης σε Δράση
                </h2>
              </div>
              <div className="text-xs text-gray-500 max-w-xs">
                Δοκίμασε οποιονδήποτε αριθμό έως 12 ψηφία και δες την ανάλυσή του σε πραγματικό χρόνο!
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* ΑΡΙΣΤΕΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Αριθμός σε ανάγνωση:</span>
                    <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-wider">
                      {formattedReadable}
                    </div>
                  </div>
                  <div className="text-xs bg-slate-800 text-slate-300 px-3 py-2 rounded-xl border border-slate-700">
                    Ψηφία: <span className="font-bold text-white">{cleanNumber.length}</span> / 12
                  </div>
                </div>

                {/* Πίνακας Περιόδων */}
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[540px] bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
                    <div className="grid grid-cols-4 text-white text-center font-black text-xs uppercase tracking-wide">
                      {periods.map((p, i) => (
                        <div key={i} className={`${p.color} py-2.5 border-r border-white/20 last:border-0`}>
                          {p.name}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-12 text-[10px] font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-1.5">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="contents">
                          <div className="border-r border-gray-200">E</div>
                          <div className="border-r border-gray-200">Δ</div>
                          <div className="border-r border-gray-200 last:border-0">M</div>
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-12 text-center items-center">
                      {digits.map((digit, i) => {
                        const periodIdx = Math.floor(i / 3);
                        const isLeading = firstNonZero !== -1 && i < firstNonZero;
                        return (
                          <div 
                            key={i} 
                            className={`py-5 text-xl md:text-2xl font-black border-r border-gray-200 last:border-0 transition-all duration-200 
                              ${periods[periodIdx].light} 
                              ${isLeading ? 'text-slate-300 font-normal' : 'text-slate-900 font-black'}`}
                          >
                            {digit}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* SVG Οπτικοποίηση Κατανομής */}
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex-1 flex flex-col justify-between shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      📊 Οπτική Κατανομή Μεγέθους Ψηφίων:
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Κλίμακα βαρύτητας ανά θέση</span>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-3 flex-1 flex items-center justify-center min-h-[160px]">
                    <svg viewBox="0 0 600 130" className="w-full h-36 md:h-44">
                      <line x1="10" y1="105" x2="590" y2="105" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                      {digits.map((digit, i) => {
                        const val = Number(digit);
                        const isLeading = firstNonZero !== -1 && i < firstNonZero;
                        const height = isLeading || val === 0 ? 6 : (val / 9) * 80 + 10;
                        const x = i * 49 + 8;
                        const colors = ["#9333ea", "#e11d48", "#2563eb", "#059669"];
                        const fillColor = isLeading ? "#f1f5f9" : colors[Math.floor(i / 3)];

                        return (
                          <g key={i}>
                            <rect 
                              x={x} 
                              y={105 - height} 
                              width="34" 
                              height={height} 
                              rx="6" 
                              fill={fillColor}
                              stroke={isLeading ? "#cbd5e1" : "none"}
                              className="transition-all duration-300"
                            />
                            <text 
                              x={x + 17} 
                              y="122" 
                              fontSize="11" 
                              fontWeight="bold" 
                              textAnchor="middle" 
                              fill={isLeading ? "#94a3b8" : "#1e293b"}
                            >
                              {digit}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

              </div>

              {/* ΔΕΞΙΑ: ΧΕΙΡΙΣΤΗΡΙΑ & ΑΝΑΛΥΣΗ */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                      ✏️ Πληκτρολόγησε Αριθμό:
                    </label>
                    <input 
                      type="text" 
                      value={number}
                      onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 12))}
                      className="text-2xl font-black text-center p-3 bg-white border-2 border-blue-300 rounded-xl shadow-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all w-full text-blue-700 tracking-wider"
                      placeholder="π.χ. 1234567"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      ⚡ Γρήγορα Παραδείγματα:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNumber(item.val)}
                          className="text-left px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-xs font-bold text-slate-700 transition shadow-sm"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Αναπτυγμένη Μορφή */}
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex-1 flex flex-col justify-between shadow-inner">
                  <div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">
                      🧬 Αναπτυγμένη Μορφή (Ανάλυση):
                    </span>
                    
                    <div className="space-y-2 font-mono text-xs md:text-sm">
                      {digits.filter(d => d !== '0').length === 0 ? (
                        <p className="text-slate-400 italic py-4">Ο αριθμός είναι μηδέν (0).</p>
                      ) : (
                        digits.map((digit, i) => {
                          if (digit === '0') return null;
                          const power = 11 - i;
                          const multiplier = Math.pow(10, power).toLocaleString('el-GR');
                          const periodIdx = Math.floor(i / 3);
                          return (
                            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-200/70 last:border-0">
                              <span className="flex items-center gap-1.5">
                                <strong className={`${periods[periodIdx].text} font-black text-sm`}>{digit}</strong>
                                <span className="text-slate-400">×</span>
                                <span className="text-slate-700 font-semibold">{multiplier}</span>
                              </span>
                              <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-md border border-gray-200 font-sans font-bold shadow-2xs">
                                10<sup>{power}</sup>
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Τελικό Σύνολο:</span>
                    <strong className="text-base text-gray-900 font-black">{formattedReadable}</strong>
                  </div>
                </div>

              </div>

            </div>
          </section>
        </main>
      </div>

      {/* 5. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm w-full border-t border-slate-800 mt-16">
        <div className={LAYOUT.CONTAINER}>
          <p>© 2026 LearnMaths.gr. Διαδραστικοί Φυσικοί Αριθμοί ΣΤ' Δημοτικού.</p>
        </div>
      </footer>
    </div>
  );
}

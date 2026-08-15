import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DekadikoiArithmoiPage() {
  const [number, setNumber] = useState("345.672");

  const presets = [
    { label: '🌡️ Θερμοκρασία', val: '36.6' },
    { label: '💶 Τιμή Προϊόντος', val: '12.50' },
    { label: '⚖️ Βάρος σε κιλά', val: '74.250' },
    { label: '📏 Μήκος ακριβείας', val: '108.405' }
  ];

  const sanitized = number.replace(',', '.').replace(/[^0-9.]/g, '');
  const parts = sanitized.split('.');
  const intRaw = parts[0] || "0";
  const decRaw = parts[1] || "";

  const intDigits = intRaw.padStart(3, '0').slice(-3).split('');
  const decDigits = decRaw.padEnd(3, '0').slice(0, 3).split('');

  const intFirstNonZero = intDigits.findIndex(d => d !== '0');

  const intClasses = [
    { name: "Εκατοντάδες", label: "Ε", weight: 100 },
    { name: "Δεκάδες", label: "Δ", weight: 10 },
    { name: "Μονάδες", label: "Μ", weight: 1 }
  ];

  const decClasses = [
    { name: "Δέκατα", label: "δ", weight: 10, fraction: "1/10", val: 0.1 },
    { name: "Εκατοστά", label: "ε", weight: 100, fraction: "1/100", val: 0.01 },
    { name: "Χιλιοστά", label: "χ", weight: 1000, fraction: "1/1000", val: 0.001 }
  ];

  const displayFormatted = `${Number(intRaw).toLocaleString('el-GR')}${decRaw ? ',' + decRaw : ''}`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🔢 Δεκαδικοί Αριθμοί & Αξία Θέσης - ΣΤ' Δημοτικού | LearnMaths.gr</title>
        <meta name="description" content="Διαδραστική θεωρία και εργαστήριο για τους δεκαδικούς αριθμούς, τα δεκαδικά κλάσματα και την υποδιαστολή." />
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* 1. STICKY NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className={`${LAYOUT.CONTAINER} py-3.5 flex justify-between items-center`}>
            <Link href="/st-dimotikou" className="text-2xl font-black text-emerald-600 tracking-tight flex items-center gap-2">
              <span className="text-3xl">📐</span> LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link 
                href="/st-dimotikou/02-dekadikoi-ask" 
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
        <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12 px-4 shadow-inner">
          <div className={`${LAYOUT.CONTAINER} grid grid-cols-1 lg:grid-cols-12 gap-8 items-center`}>
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs md:text-sm font-bold uppercase tracking-wider text-emerald-100 border border-white/20">
                <span>🎒 ΣΤ' Δημοτικού</span>
                <span>•</span>
                <span>Ενότητα 1: Αριθμοί & Πράξεις</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                Δεκαδικοί Αριθμοί & Δεκαδικά Κλάσματα
              </h1>
              <p className="text-emerald-100 text-base md:text-lg max-w-2xl leading-relaxed">
                Μάθε πώς η <strong>υποδιαστολή</strong> χωρίζει τις ακέραιες μονάδες από τα δεκαδικά μέρη, και κατάκτησε τα <strong>δέκατα</strong>, <strong>εκατοστά</strong> και <strong>χιλιοστά</strong>!
              </p>
            </div>

            {/* Promo Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/25 rounded-3xl p-6 text-center space-y-4 shadow-xl">
              <div className="w-14 h-14 bg-amber-400 text-gray-900 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto shadow-md">
                🎯
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Έτοιμος για εξάσκηση;</h2>
                <p className="text-xs text-emerald-100 mt-1">8 δυναμικές ερωτήσεις με άμεση βαθμολόγηση!</p>
              </div>
              <Link 
                href="/st-dimotikou/02-dekadikoi-ask" 
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
            
            <div className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                1
              </div>
              <h2 className="text-lg font-black text-gray-900">Ακέραιο & Δεκαδικό Μέρος</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Η <strong>υποδιαστολή ( , )</strong> διαχωρίζει το <strong>ακέραιο μέρος</strong> (αριστερά) από το <strong>δεκαδικό μέρος</strong> (δεξιά).
              </p>
              <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs font-mono text-center text-gray-700">
                <span className="text-emerald-600 font-bold">12</span>
                <span className="text-amber-500 font-black text-sm"> , </span>
                <span className="text-blue-600 font-bold">45</span>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-black">
                2
              </div>
              <h2 className="text-lg font-black text-gray-900">Τάξεις Δεκαδικού Μέρους</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Κάθε θέση δεξιά από την υποδιαστολή υποδηλώνει ένα δεκαδικό κλάσμα:
              </p>
              <ul className="text-xs text-gray-700 space-y-1 font-medium bg-white p-3 rounded-xl border border-blue-100">
                <li>• <strong>δ</strong>: Δέκατα = 1/10 = 0,1</li>
                <li>• <strong>ε</strong>: Εκατοστά = 1/100 = 0,01</li>
                <li>• <strong>χ</strong>: Χιλιοστά = 1/1000 = 0,001</li>
              </ul>
            </div>

            <div className="bg-amber-50/70 border border-amber-100 p-6 rounded-3xl space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center text-xl font-black">
                3
              </div>
              <h2 className="text-lg font-black text-gray-900">Ισοδύναμοι Δεκαδικοί</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Αν προσθέσουμε ή αφαιρέσουμε <strong>μηδενικά στο τέλος</strong> του δεκαδικού μέρους, η αξία του αριθμού δεν αλλάζει!
              </p>
              <div className="bg-white p-3 rounded-xl border border-amber-100 text-xs text-gray-700 font-bold text-center">
                3,5 = 3,50 = 3,500
              </div>
            </div>

          </div>

          {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  🔬 Διαδραστικό Εργαστήριο
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2">
                  Ο Πίνακας Δεκαδικών Αριθμών σε Δράση
                </h2>
              </div>
              <div className="text-xs text-gray-500 max-w-xs">
                Πληκτρολόγησε έναν δεκαδικό αριθμό και δες την ανάλυσή του σε ακέραιες μονάδες και δεκαδικά κλάσματα!
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* ΑΡΙΣΤΕΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                
                <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase">Αριθμός σε ανάγνωση:</span>
                    <div className="text-2xl md:text-3xl font-black text-amber-400 tracking-wider">
                      {displayFormatted || "0"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-emerald-800/80 text-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-700">
                      Ακέραιο: <strong>{intRaw || "0"}</strong>
                    </span>
                    <span className="bg-blue-800/80 text-blue-200 px-3 py-1.5 rounded-xl border border-blue-700">
                      Δεκαδικό: <strong>,{decRaw || "0"}</strong>
                    </span>
                  </div>
                </div>

                {/* Πίνακας Θέσεων */}
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[500px] bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
                    
                    <div className="grid grid-cols-7 text-white text-center font-black text-xs uppercase tracking-wide">
                      <div className="col-span-3 bg-emerald-600 py-2.5">Ακέραιο Μέρος</div>
                      <div className="bg-amber-500 py-2.5">,</div>
                      <div className="col-span-3 bg-blue-600 py-2.5">Δεκαδικό Μέρος</div>
                    </div>

                    <div className="grid grid-cols-7 text-[10px] font-black text-slate-500 text-center border-b bg-slate-100 uppercase py-2">
                      {intClasses.map((c, i) => (
                        <div key={`hc1-${i}`} className="border-r border-gray-200" title={c.name}>
                          {c.label}
                        </div>
                      ))}
                      <div className="text-amber-600 font-bold border-r border-gray-200 bg-amber-50/50">Υποδ.</div>
                      {decClasses.map((c, i) => (
                        <div key={`hc2-${i}`} className="border-r border-gray-200 last:border-0" title={c.name}>
                          {c.label}
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 text-center items-center font-black text-2xl">
                      {intDigits.map((digit, i) => {
                        const isLeading = intFirstNonZero !== -1 && i < intFirstNonZero;
                        return (
                          <div 
                            key={`id-${i}`} 
                            className={`py-5 border-r border-gray-200 bg-emerald-50/40 transition-colors duration-200 ${
                              isLeading ? 'text-slate-300 font-normal' : 'text-slate-900 font-black'
                            }`}
                          >
                            {digit}
                          </div>
                        );
                      })}

                      <div className="py-5 border-r border-gray-200 bg-amber-50 text-amber-500 font-black">
                        ,
                      </div>

                      {decDigits.map((digit, i) => {
                        const isTrailing = i >= decRaw.length && decRaw.length > 0;
                        return (
                          <div 
                            key={`dd-${i}`} 
                            className={`py-5 border-r border-gray-200 last:border-0 bg-blue-50/40 transition-colors duration-200 ${
                              isTrailing ? 'text-slate-300 font-normal' : 'text-slate-900 font-black'
                            }`}
                          >
                            {digit}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* SVG Οπτικοποίηση */}
                <div className="bg-gray-50 border border-gray-200 p-5 rounded-2xl flex-1 flex flex-col justify-between shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      📊 Οπτική Κατανομή Αξίας (Ακέραια vs Δεκαδικά):
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Σχετική βαρύτητα τάξης</span>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-3 flex-1 flex items-center justify-center min-h-[160px]">
                    <svg viewBox="0 0 460 130" className="w-full h-36 md:h-44">
                      <line x1="10" y1="105" x2="450" y2="105" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                      
                      {intDigits.map((digit, i) => {
                        const val = Number(digit);
                        const isLeading = intFirstNonZero !== -1 && i < intFirstNonZero;
                        const height = isLeading || val === 0 ? 6 : (val / 9) * 80 + 10;
                        const x = 20 + i * 55;
                        return (
                          <g key={`svg-int-${i}`}>
                            <rect 
                              x={x} 
                              y={105 - height} 
                              width="36" 
                              height={height} 
                              rx="6" 
                              fill={isLeading ? "#f1f5f9" : "#059669"}
                              stroke={isLeading ? "#cbd5e1" : "none"}
                              className="transition-all duration-300"
                            />
                            <text x={x + 18} y="122" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#334155">
                              {intClasses[i].label} ({digit})
                            </text>
                          </g>
                        );
                      })}

                      <g>
                        <circle cx="210" cy="105" r="5" fill="#f59e0b" />
                        <text x="210" y="122" fontSize="11" fontWeight="black" textAnchor="middle" fill="#d97706">
                          ,
                        </text>
                      </g>

                      {decDigits.map((digit, i) => {
                        const val = Number(digit);
                        const isTrailing = i >= decRaw.length && decRaw.length > 0;
                        const height = isTrailing || val === 0 ? 6 : (val / 9) * 80 + 10;
                        const x = 245 + i * 55;
                        return (
                          <g key={`svg-dec-${i}`}>
                            <rect 
                              x={x} 
                              y={105 - height} 
                              width="36" 
                              height={height} 
                              rx="6" 
                              fill={isTrailing ? "#f1f5f9" : "#2563eb"}
                              stroke={isTrailing ? "#cbd5e1" : "none"}
                              className="transition-all duration-300"
                            />
                            <text x={x + 18} y="122" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#334155">
                              {decClasses[i].label} ({digit})
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
                      ✏️ Πληκτρολόγησε Δεκαδικό Αριθμό:
                    </label>
                    <input 
                      type="text" 
                      value={number}
                      onChange={(e) => {
                        let val = e.target.value.replace(/[^0-9.,]/g, '');
                        const dotCount = (val.match(/[.,]/g) || []).length;
                        if (dotCount <= 1) {
                          const p = val.replace(',', '.').split('.');
                          if ((p[0] || "").length <= 3 && (p[1] || "").length <= 3) {
                            setNumber(val);
                          }
                        }
                      }}
                      className="text-2xl font-black text-center p-3 bg-white border-2 border-emerald-300 rounded-xl shadow-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 outline-none transition-all w-full text-emerald-700 tracking-wider"
                      placeholder="π.χ. 345.672"
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
                          className="text-left px-3 py-2 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-xs font-bold text-slate-700 transition shadow-sm"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Αναλυτική Μορφή */}
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl flex-1 flex flex-col justify-between shadow-inner">
                  <div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3">
                      🧬 Ανάλυση σε Δεκαδικά Κλάσματα & Αξίες:
                    </span>

                    <div className="space-y-2.5 font-mono text-xs md:text-sm">
                      {intDigits.map((digit, i) => {
                        if (digit === '0' && intFirstNonZero !== -1 && i < intFirstNonZero) return null;
                        const weight = intClasses[i].weight;
                        return (
                          <div key={`int-row-${i}`} className="flex items-center justify-between py-1.5 border-b border-gray-200/70">
                            <span className="flex items-center gap-1.5">
                              <strong className="text-emerald-700 font-black text-sm">{digit}</strong>
                              <span className="text-slate-400">×</span>
                              <span className="text-slate-700 font-semibold">{weight}</span>
                            </span>
                            <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-md border border-gray-200 font-sans font-bold">
                              = {Number(digit) * weight}
                            </span>
                          </div>
                        );
                      })}

                      {decDigits.map((digit, i) => {
                        if (digit === '0' && i >= decRaw.length) return null;
                        const decCls = decClasses[i];
                        return (
                          <div key={`dec-row-${i}`} className="flex items-center justify-between py-1.5 border-b border-gray-200/70 last:border-0">
                            <span className="flex items-center gap-1.5">
                              <strong className="text-blue-700 font-black text-sm">{digit}</strong>
                              <span className="text-slate-400">×</span>
                              <div className="inline-flex flex-col items-center text-[10px] font-bold text-slate-700 leading-none">
                                <span>1</span>
                                <div className="w-4 h-[1px] bg-slate-600 my-0.5"></div>
                                <span>{decCls.weight}</span>
                              </div>
                            </span>
                            <span className="text-xs text-blue-600 bg-white px-2 py-0.5 rounded-md border border-blue-200 font-sans font-bold">
                              = {(Number(digit) / decCls.weight).toString().replace('.', ',')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-bold uppercase">Τελικός Αριθμός:</span>
                    <strong className="text-base text-gray-900 font-black">{displayFormatted || "0"}</strong>
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
          <p>© 2026 LearnMaths.gr. Διαδραστικοί Δεκαδικοί Αριθμοί ΣΤ' Δημοτικού.</p>
        </div>
      </footer>
    </div>
  );
}

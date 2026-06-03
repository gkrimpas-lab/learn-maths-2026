import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function EDimotikou() {
  // Κατάσταση για το ποιο Tab είναι ενεργό ('intro' or 'equivalent')
  const [activeTab, setActiveTab] = useState('intro');

  // Κατάσταση για τον 1ο προσομοιωτή (Τι είναι κλάσμα)
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);

  // Κατάσταση για τον 2ο προσομοιωτή (Ισοδύναμα κλάσματα)
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(3);
  const [multiplier, setMultiplier] = useState(2);

  // Σχεδίαση πίτας (SVG Paths)
  const renderPieSlices = (pieIndex, totalSlicesToColor, currentDen) => {
    const slices = [];
    const radius = 45;
    const cx = 55;
    const cy = 55;

    for (let i = 0; i < currentDen; i++) {
      const startAngle = (i * 360) / currentDen - 90;
      const endAngle = ((i + 1) * 360) / currentDen - 90;

      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);

      const currentSliceNumber = pieIndex * currentDen + i;
      const isColored = currentSliceNumber < totalSlicesToColor;

      if (currentDen === 1) {
        slices.push(
          <circle key={i} cx={cx} cy={cy} r={radius} className={`${isColored ? 'fill-orange-500' : 'fill-gray-200'} stroke-white stroke-2`} />
        );
        continue;
      }

      const largeArcFlag = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      slices.push(
        <path key={i} d={pathData} className={`${isColored ? 'fill-orange-500' : 'fill-gray-100'} stroke-cyan-600 stroke-[1.5] transition-colors duration-150`} />
      );
    }
    return slices;
  };

  const totalPies1 = Math.max(1, Math.ceil(num1 / den1));
  const totalPies2Initial = Math.max(1, Math.ceil(num2 / den2));
  const totalPies2Equivalent = Math.max(1, Math.ceil((num2 * multiplier) / (den2 * multiplier)));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Ε' Δημοτικού: Κλάσματα - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
            LearnMaths<span className="text-indigo-600">.gr</span>
          </Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">
            🏠 Αρχική Σελίδα
          </Link>
        </div>
      </nav>

      {/* HEADER ΤΑΞΗΣ */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">🎒 Μαθηματικά Ε' Δημοτικού</h1>
        <p className="text-cyan-100 opacity-90">Κεφάλαιο: Κλάσματα</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ (TABS) */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex border-b border-gray-200 gap-2 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setActiveTab('intro')}
            className={`flex-1 py-3 text-center rounded-lg font-bold transition duration-200 text-sm md:text-base ${activeTab === 'intro' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            🍕 1. Τι είναι κλάσμα;
          </button>
          <button
            onClick={() => setActiveTab('equivalent')}
            className={`flex-1 py-3 text-center rounded-lg font-bold transition duration-200 text-sm md:text-base ${activeTab === 'equivalent' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            🔄 2. Ισοδύναμα Κλάσματα
          </button>
        </div>
      </div>

      {/* ΠΕΡΙΕΧΟΜΕΝΟ ΣΕΛΙΔΑΣ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* TAB 1: ΤΙ ΕΙΝΑΙ ΚΛΑΣΜΑ */}
        {activeTab === 'intro' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900">Τι είναι το Κλάσμα;</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Κλάσμα είναι ένας αριθμός που μας δείχνει <strong>σε πόσα ίσα μέρη</strong> έχουμε χωρίσει μια μονάδα και <strong>πόσα από αυτά τα μέρη</strong> έχουμε πάρει.
                </p>
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 space-y-2 text-xs text-cyan-900">
                  <p>☝️ <strong>Αριθμητής (πάνω):</strong> Πόσα κομμάτια πήραμε.</p>
                  <p>👇 <strong>Παρονομαστής (κάτω):</strong> Σε πόσα συνολικά κομμάτια κόψαμε τη μονάδα.</p>
                </div>
              </div>

              {/* ΨΗΦΙΑΚΗ ΚΑΡΤΑ */}
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
                <span className="text-xs uppercase font-bold tracking-wider opacity-75 block mb-1">Συνοπτική Εικόνα</span>
                <div className="inline-flex flex-col items-center font-black text-4xl">
                  <div className="text-amber-300 pb-1">Αριθμητής</div>
                  <div className="w-36 h-1 bg-white rounded-full my-1"></div>
                  <div className="text-white pt-1">Παρονομαστής</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΣΟΜΟΙΩΤΗΣ 1 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-center text-gray-800">🍕 Διαδραστική Πίτα Κλασμάτων</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Χειριστήρια */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-24 text-right">Αριθμητής:</span>
                    <button onClick={() => setNum1(Math.max(1, num1 - 1))} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition">-</button>
                    <span className="w-8 text-center text-xl font-black text-red-600">{num1}</span>
                    <button onClick={() => setNum1(Math.min(20, num1 + 1))} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition">+</button>
                  </div>
                  <div className="w-40 h-[2px] bg-gray-200"></div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-24 text-right">Παρονομαστής:</span>
                    <button onClick={() => setDen1(Math.max(1, den1 - 1))} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition">-</button>
                    <span className="w-8 text-center text-xl font-black text-blue-600">{den1}</span>
                    <button onClick={() => setDen1(Math.min(12, den1 + 1))} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition">+</button>
                  </div>
                </div>

                {/* Σχεδίαση */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-center gap-4 min-h-[140px] items-center">
                  {Array.from({ length: totalPies1 }).map((_, i) => (
                    <svg key={i} width="100" height="100" className="drop-shadow-sm">
                      {renderPieSlices(i, num1, den1)}
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ */}
        {activeTab === 'equivalent' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">Τι είναι τα Ισοδύναμα Κλάσματα;</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Ισοδύναμα λέγονται τα κλάσματα που <strong>εκφράζουν το ίδιο μέρος μιας επιφάνειας</strong> ή ενός ποσού, παρόλο που έχουν διαφορετικούς αριθμητές και παρονομαστές. 
                <br />💡 Για να φτιάξουμε ένα ισοδύναμο κλάσμα, <strong>πολλαπλασιάζουμε</strong> τον αριθμητή και τον παρονομαστή με τον <strong>ίδιο ακριβώς αριθμό</strong>!
              </p>
            </div>

            {/* ΠΡΟΣΟΜΟΙΩΤΗΣ 2 */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-center text-gray-800">🔄 Προσομοιωτής Ισοδύναμων Κλασμάτων</h3>
              
              {/* ΕΠΙΛΟΓΕΑΣ ΠΟΛΛΑΠΛΑΣΙΑΣΤΗ */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
                <span className="font-bold text-amber-900 text-sm">Διάλεξε Πολλαπλασιαστή (Φουσκώνω το κλάσμα):</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setMultiplier(Math.max(2, multiplier - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition">-</button>
                  <span className="text-xl font-black text-amber-600 w-6 text-center">{multiplier}</span>
                  <button onClick={() => setMultiplier(Math.min(5, multiplier + 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition">+</button>
                </div>
              </div>

              {/* ΒΕΛΤΙΩΜΕΝΟ: ΚΑΙ ΤΑ ΔΥΟ ΚΛΑΣΜΑΤΑ ΣΤΟ ΙΔΙΟ ΛΕΥΚΟ ΠΛΑΙΣΙΟ */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-8">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΑ ΡΥΘΜΙΣΗΣ ΑΡΧΙΚΟΥ ΚΛΑΣΜΑΤΟΣ ΜΕ ΣΩΣΤΕΣ ΛΕΞΕΙΣ */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap justify-center items-center gap-6 text-sm max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Αριθμητής:</span>
                    <button onClick={() => setNum2(Math.max(1, num2 - 1))} className="bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">-</button>
                    <span className="font-black text-slate-800 text-base w-4 text-center">{num2}</span>
                    <button onClick={() => { if(num2 < den2) setNum2(num2 + 1) }} className="bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">+</button>
                  </div>
                  
                  <div className="w-[1px] h-6 bg-slate-300 hidden md:block"></div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Παρονομαστής:</span>
                    <button onClick={() => { const d=Math.max(2, den2-1); setDen2(d); if(num2>d)setNum2(d); }} className="bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">-</button>
                    <span className="font-black text-slate-800 text-base w-4 text-center">{den2}</span>
                    <button onClick={() => setDen2(Math.min(6, den2 + 1))} className="bg-slate-200 hover:bg-slate-300 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">+</button>
                  </div>
                </div>

                {/* ΔΙΠΛΑ-ΔΙΠΛΑ Η ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 pt-2">
                  
                  {/* ΑΡΧΙΚΟ ΚΛΑΣΜΑ */}
                  <div className="flex flex-col items-center space-y-4 pb-6 md:pb-0">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">Αρχικό Κλάσμα</span>
                    
                    {/* Σύμβολο Κλάσματος */}
                    <div className="flex flex-col items-center font-black text-3xl text-blue-600 bg-slate-50 p-3 px-6 rounded-xl border border-slate-100 min-w-[70px]">
                      <div>{num2}</div>
                      <div className="w-10 h-[3px] bg-blue-600 rounded-full my-0.5"></div>
                      <div>{den2}</div>
                    </div>

                    {/* Πίτα Αρχικού */}
                    <div className="flex flex-wrap justify-center gap-2 min-h-[110px] items-center">
                      {Array.from({ length: totalPies2Initial }).map((_, i) => (
                        <svg key={i} width="95" height="95" className="drop-shadow-sm">
                          {renderPieSlices(i, num2, den2)}
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* ΙΣΟΔΥΝΑΜΟ ΚΛΑΣΜΑ */}
                  <div className="flex flex-col items-center space-y-4 pt-6 md:pt-0 md:pl-8">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Ισοδύναμο Κλάσμα</span>
                    
                    {/* Μαθηματική Πράξη */}
                    <div className="text-[11px] text-slate-400 font-mono tracking-wide">
                      ({num2} × {multiplier}) / ({den2} × {multiplier})
                    </div>

                    {/* Σύμβολο Νέου Κλάσματος */}
                    <div className="flex flex-col items-center font-black text-3xl text-emerald-600 bg-slate-50 p-3 px-6 rounded-xl border border-slate-100 min-w-[70px]">
                      <div>{num2 * multiplier}</div>
                      <div className="w-12 h-[3px] bg-emerald-600 rounded-full my-0.5"></div>
                      <div>{den2 * multiplier}</div>
                    </div>

                    {/* Πίτα Ισοδύναμου */}
                    <div className="flex flex-wrap justify-center gap-2 min-h-[110px] items-center">
                      {Array.from({ length: totalPies2Equivalent }).map((_, i) => (
                        <svg key={i} width="95" height="95" className="drop-shadow-sm">
                          {renderPieSlices(i, num2 * multiplier, den2 * multiplier)}
                        </svg>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              <p className="text-center text-xs text-gray-500 font-medium">
                👀 Παρατήρησε ότι <strong>το συνολικό πορτοκαλί βάψιμο των δύο πίτων παραμένει ακριβώς το ίδιο</strong>, παρόλο που το δεύτερο κλάσμα κόπηκε σε περισσότερα και μικρότερα κομμάτια!
              </p>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές μας.</p>
      </footer>
    </div>
  );
}

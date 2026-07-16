import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

// ΜΕΓΙΣΤΕΣ ΤΙΜΕΣ (Όλα κλειδωμένα αυστηρά στο 10)
const MAX_VALUE = 100;
const MAX_MULTIPLIER = 10;

export default function IsodinamaKlasmataPage() {
  const [activeTab, setActiveTab] = useState('create'); // 'create' ή 'reduce'
  
  // Κατάσταση για τη Λειτουργία 1 (Δημιουργία Ισοδυνάμου)
  const [num1, setNum1] = useState(1);
  const [den1, setDenominator1] = useState(2);
  const [multiplier, setMultiplier] = useState(3);

  // Κατάσταση για τη Λειτουργία 2 (Μετατροπή σε Ανάγωγο)
  const [num2, setNum2] = useState(6);
  const [den2, setDenominator2] = useState(8);

  // Συναρτήσεις ασφαλούς εισαγωγής (Κλείδωμα στο 10 και έλεγχος αριθμητή <= παρονομαστή)
  const handleInputChange = (setter, val, currentPair, isDenominator = false) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') {
      setter('');
      return;
    }
    const n = Number(clean);
    
    if (isDenominator) {
      if (n === 0 || n > MAX_VALUE) return; // Κλείδωμα στο 10
      setter(n);
      if (currentPair.num > n) {
        currentPair.setNum(n);
      }
    } else {
      if (n > (currentPair.den || MAX_VALUE) || n > MAX_VALUE) return; // Κλείδωμα στο 10 και έλεγχος παρονομαστή
      setter(n);
    }
  };

  // Αυξομείωση με κουμπιά για τη Λειτουργία 1
  const adjustValue1 = (type, amount) => {
    if (type === 'num') {
      setNum1(prev => Math.max(0, Math.min(Number(den1) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenominator1(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (num1 > nextDen) setNum1(nextDen);
        return nextDen;
      });
    }
  };

  // Αυξομείωση με κουμπιά για τη Λειτουργία 2
  const adjustValue2 = (type, amount) => {
    if (type === 'num') {
      setNum2(prev => Math.max(0, Math.min(Number(den2) || MAX_VALUE, (Number(prev) || 0) + amount)));
    } else {
      setDenominator2(prev => {
        const nextDen = Math.max(1, Math.min(MAX_VALUE, (Number(prev) || 1) + amount));
        if (num2 > nextDen) setNum2(nextDen);
        return nextDen;
      });
    }
  };

  // Αλγόριθμος Ευκλείδη για εύρεση ΜΚΔ
  const findGcd = (a, b) => {
    while (b) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  // Υπολογισμοί για τη Λειτουργία 1 (Δημιουργία)
  const activeNum1 = num1 === '' ? 0 : Number(num1);
  const activeDen1 = den1 === '' || den1 === 0 ? 1 : Number(den1);
  
  // Δυναμικός περιορισμός multiplier ώστε οι νέοι όροι να μην ξεπερνούν τους κανόνες αν χρειαστεί
  const safeMultiplier = Math.min(multiplier, MAX_MULTIPLIER);

  const isoNum = activeNum1 * safeMultiplier;
  const isoDen = activeDen1 * safeMultiplier;

  // Υπολογισμοί για τη Λειτουργία 2 (Ανάγωγο)
  const activeNum2 = num2 === '' ? 0 : Number(num2);
  const activeDen2 = den2 === '' || den2 === 0 ? 1 : Number(den2);
  const gcd = findGcd(activeNum2, activeDen2);
  
  const reducedNum = activeNum2 / gcd;
  const reducedDen = activeDen2 / gcd;

  // Συναρτήση σχεδίασης της πίτσας (Κυκλικό Σχήμα SVG)
  const renderPizzaDiagram = (num, den, fillColor = 'fill-blue-500', strokeColor = 'stroke-blue-700') => {
    const slices = [];
    const radius = 65;
    const cx = 80;
    const cy = 80;
    const activeSlices = Math.max(0, Math.min(den, num));

    for (let i = 0; i < den; i++) {
      const angleStep = 360 / den;
      const startAngle = i * angleStep - 90;
      const endAngle = (i + 1) * angleStep - 90;

      const rad1 = (startAngle * Math.PI) / 180;
      const rad2 = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(rad1);
      const y1 = cy + radius * Math.sin(rad1);
      const x2 = cx + radius * Math.cos(rad2);
      const y2 = cy + radius * Math.sin(rad2);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const d = den === 1
        ? `M ${cx} ${cy} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`
        : `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

      const isFilled = i < activeSlices;

      slices.push(
        <path
          key={i}
          d={d}
          className={`${
            isFilled 
              ? `${fillColor} ${strokeColor}` 
              : 'fill-slate-100 stroke-slate-300'
          } transition-colors duration-200 stroke-[1.2]`}
        />
      );
    }

    return (
      <svg width="160" height="160" className="drop-shadow-md overflow-visible">
        {slices}
        <circle cx={cx} cy={cy} r="2.5" className="fill-slate-800" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚖️ Ισοδύναμα & Ανάγωγα Κλάσματα - LearnMaths.gr</title>
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
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-8`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span>📖</span> Ισοδύναμα κλάσματα και Απλοποίηση
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
                <p>
                  • <strong>Ισοδύναμα</strong> λέγονται τα κλάσματα που αν και έχουν διαφορετικούς αριθμούς, εκφράζουν την <strong>ίδια ακριβώς αξία</strong> ή ποσότητα.
                </p>
                <p>
                  • Για να φτιάξουμε ισοδύναμα κλάσματα, <strong>πολλαπλασιάζουμε</strong> ή <strong>διαιρούμε</strong> και τους δύο όρους του κλάσματος με τον ίδιο αριθμό.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-md flex flex-col justify-center space-y-2">
                <h3 className="text-amber-300 font-black text-sm uppercase tracking-wider">💡 Τι ειναι το Αναγωγο Κλασμα;</h3>
                <p className="text-xs text-indigo-50 leading-relaxed">
                  Όταν διαιρούμε συνεχώς τους όρους ενός κλάσματος με τον Μ.Κ.Δ. τους, το κλάσμα μικραίνει (απλοποιείται). Όταν φτάσει σε σημείο που <strong>δεν μπορεί να απλοποιηθεί άλλο</strong>, ονομάζεται <strong>Ανάγωγο</strong>!
                </p>
              </div>
            </div>
          </div>

          {/* TABS SELECTOR */}
          <div className="flex justify-center bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${activeTab === 'create' ? 'bg-blue-600 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-800'}`}
            >
              🛠️ Φτιάχνω Ισοδύναμο
            </button>
            <button
              onClick={() => setActiveTab('reduce')}
              className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all ${activeTab === 'reduce' ? 'bg-emerald-600 text-white shadow-md scale-105' : 'text-gray-500 hover:text-gray-800'}`}
            >
              🎯 Μετατροπή σε Ανάγωγο
            </button>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΧΕΙΡΙΣΤΗΡΙΑ */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between gap-6">
              
              {activeTab === 'create' ? (
                /* TAB 1: ΔΗΜΙΟΥΡΓΙΑ ΙΣΟΔΥΝΑΜΟΥ */
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">1. Δώσε Αρχικό Κλάσμα</h3>
                    <p className="text-gray-500 text-xs">  (Μέγιστη Τιμή Παρονομαστή: {MAX_VALUE}).</p>
                  </div>

                  {/* Διορθωμένα Inputs: Αριθμητής Αριστερά, Παρονομαστής Δεξιά με κουμπιά αυξομείωσης */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {/* ΑΡΙΘΜΗΤΗΣ (ΑΡΙΣΤΕΡΑ) */}
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue1('num', -1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={num1}
                          onChange={(e) => handleInputChange(setNum1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                        />
                        <button onClick={() => adjustValue1('num', 1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                    
                    {/* ΠΑΡΟΝΟΜΑΣΤΗΣ (ΔΕΞΙΑ) */}
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue1('den', -1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={den1}
                          onChange={(e) => handleInputChange(setDenominator1, e.target.value, { num: num1, setNum: setNum1, den: den1 }, true)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-blue-600"
                        />
                        <button onClick={() => adjustValue1('den', 1)} className="px-1.5 font-bold text-blue-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900">2. Επίλεξε Πολλαπλασιαστή</h3>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
                      <div className="flex justify-between font-mono text-xs font-bold text-blue-800">
                        <span>Πολλαπλασιασμός επί:</span>
                        <span>×{safeMultiplier}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max={MAX_MULTIPLIER}
                        value={safeMultiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* TAB 2: ΜΕΤΑΤΡΟΠΗ ΣΕ ΑΝΑΓΩΓΟ */
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Δώσε Κλάσμα για Απλοποίηση</h3>
                    <p className="text-gray-500 text-xs">(Μέγιστη Τιμή Παρονομαστή: {MAX_VALUE}).</p>
                  </div>

                  {/* Διορθωμένα Inputs: Αριθμητής Αριστερά, Παρονομαστής Δεξιά με κουμπιά αυξομείωσης */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {/* ΑΡΙΘΜΗΤΗΣ (ΑΡΙΣΤΕΡΑ) */}
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Αριθμητής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue2('num', -1)} className="px-1.5 font-bold text-emerald-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={num2}
                          onChange={(e) => handleInputChange(setNum2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, false)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-emerald-600"
                        />
                        <button onClick={() => adjustValue2('num', 1)} className="px-1.5 font-bold text-emerald-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>

                    {/* ΠΑΡΟΝΟΜΑΣΤΗΣ (ΔΕΞΙΑ) */}
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Παρονομαστής</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                        <button onClick={() => adjustValue2('den', -1)} className="px-1.5 font-bold text-emerald-600 hover:bg-slate-50 rounded">-</button>
                        <input
                          type="text"
                          value={den2}
                          onChange={(e) => handleInputChange(setDenominator2, e.target.value, { num: num2, setNum: setNum2, den: den2 }, true)}
                          className="w-full text-center font-mono font-black text-sm outline-none text-emerald-600"
                        />
                        <button onClick={() => adjustValue2('den', 1)} className="px-1.5 font-bold text-emerald-600 hover:bg-slate-50 rounded">+</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-800 space-y-1">
                    <span className="font-black uppercase tracking-wider block">🔍 Ευρεση Διαιρετη:</span>
                    <p>Ο Μέγιστος Κοινός Διαιρέτης του {activeNum2} και του {activeDen2} είναι το <strong>{gcd}</strong>.</p>
                  </div>
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-500 leading-relaxed">
                ℹ️ <strong>Θυμήσου:</strong> Τα ισοδύναμα κλάσματα καταλαμβάνουν την ίδια ακριβώς επιφάνεια πάνω στο κυκλικό σχήμα!
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΟΠΤΙΚΟΠΟΙΗΣΗ ΜΕ ΚΥΚΛΙΚΟ ΣΧΗΜΑ (ΠΙΤΣΑ) */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[550px] space-y-8">
              
              {activeTab === 'create' ? (
                /* ΠΑΡΟΥΣΙΑΣΗ TAB 1: ΔΗΜΙΟΥΡΓΙΑ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη */}
                  <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4 font-mono text-xl md:text-2xl font-black">
                      <div className="flex flex-col items-center">
                        <span className="text-blue-600">{activeNum1}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-blue-600">{activeDen1}</span>
                      </div>

                      <div className="text-slate-400 text-sm font-sans font-normal text-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <div>× {safeMultiplier}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>× {safeMultiplier}</div>
                      </div>

                      <span className="text-slate-400 font-light">=</span>

                      <div className="flex flex-col items-center">
                        <span className="text-indigo-600">{isoNum}</span>
                        <div className="w-12 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-indigo-600">{isoDen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση (Κυκλικά Σχήματα) */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Αρχικο Κλασμα ({activeNum1}/{activeDen1})</span>
                      {renderPizzaDiagram(activeNum1, activeDen1, 'fill-blue-500', 'stroke-blue-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ισοδυναμο Κλασμα ({isoNum}/{isoDen})</span>
                      {renderPizzaDiagram(isoNum, isoDen, 'fill-indigo-500', 'stroke-indigo-700')}
                    </div>
                  </div>
                </div>
              ) : (
                /* ΠΑΡΟΥΣΙΑΣΗ TAB 2: ΑΝΑΓΩΓΟ */
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  {/* Μαθηματική Πράξη */}
                  <div className="flex items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4 font-mono text-xl md:text-2xl font-black">
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-600">{activeNum2}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-emerald-600">{activeDen2}</span>
                      </div>

                      <div className="text-slate-400 text-sm font-sans font-normal text-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                        <div>÷ {gcd}</div>
                        <div className="border-t border-slate-200 my-0.5" />
                        <div>÷ {gcd}</div>
                      </div>

                      <span className="text-slate-400 font-light">=</span>

                      <div className="flex flex-col items-center">
                        <span className="text-teal-600">{reducedNum}</span>
                        <div className="w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-teal-600">{reducedDen}</span>
                      </div>
                    </div>
                  </div>

                  {/* Γραφική Αναπαράσταση (Κυκλικά Σχήματα) */}
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Αρχικο Κλασμα ({activeNum2}/{activeDen2})</span>
                      {renderPizzaDiagram(activeNum2, activeDen2, 'fill-emerald-500', 'stroke-emerald-700')}
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Αναγωγο Κλασμα ({reducedNum}/{reducedDen})</span>
                      {renderPizzaDiagram(reducedNum, reducedDen, 'fill-teal-500', 'stroke-teal-700')}
                    </div>
                  </div>
                </div>
              )}

              {/* Τελική Επιβεβαίωση Αξίας */}
              <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 rounded-xl text-center font-mono font-black text-xs md:text-sm">
                ⚖️ Οπτική Επιβεβαίωση: Παρατήρησε ότι οι χρωματισμένες επιφάνειες στους δύο κύκλους είναι ακριβώς ίδιες σε μέγεθος!
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Ισοδύναμα Κλάσματα - ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

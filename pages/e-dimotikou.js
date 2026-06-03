import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ ΟΡΙΩΝ (ΜΕΤΑΒΛΗΤΕΣ CONFIGURATION)
// ==========================================
const LIMITS = {
  INTRO_NUM_MIN: 0, INTRO_NUM_MAX: 20, LIMITS_INTRO_DEN_MIN: 1, INTRO_DEN_MAX: 12,
  EQUIV_NUM_MIN: 0, EQUIV_DEN_MIN: 2, EQUIV_DEN_MAX: 6, MULTIPLIER_MIN: 2, MULTIPLIER_MAX: 5,
  SIMPL_NUM_MIN: 0, SIMPL_NUM_MAX: 30, SIMPL_DEN_MIN: 2, SIMPL_DEN_MAX: 30,
  MULT_NUMBER_MIN: 2, MULT_NUMBER_MAX: 15, MULT_COUNT_TO_SHOW: 30,
  EKP_NUMBERS_COUNT_MIN: 2, EKP_NUMBERS_COUNT_MAX: 4, EKP_VAL_MIN: 2, EKP_VAL_MAX: 12,
  DIV_NUMBER_MIN: 2, DIV_NUMBER_MAX: 100,
  MKD_NUMBERS_COUNT_MIN: 2, MKD_NUMBERS_COUNT_MAX: 4, MKD_VAL_MIN: 4, MKD_VAL_MAX: 60,
  CRITERIA_NUM_MIN: 1, CRITERIA_NUM_MAX: 1000,
  UNIT_NUM_MIN: 1, UNIT_NUM_MAX: 10, UNIT_DEN_MIN: 2, UNIT_DEN_MAX: 12, UNIT_VAL_MIN: 10, UNIT_VAL_MAX: 500,
  // Όρια για τη Μέση Τιμή
  MEAN_VAL_MIN: 1, MEAN_VAL_MAX: 10
};

export default function EDimotikou() {
  const [activeTab, setActiveTab] = useState('intro');

  // States για όλες τις ενότητες
  const [num1, setNum1] = useState(3); const [den1, setDen1] = useState(4);
  const [num2, setNum2] = useState(2); const [den2, setDen2] = useState(3); const [multiplier, setMultiplier] = useState(2);
  const [num3, setNum3] = useState(12); const [den3, setDen3] = useState(18);
  const [singleNumber, setSingleNumber] = useState(4);
  const [ekpCount, setEkpCount] = useState(2); const [ekpValues, setEkpValues] = useState([3, 4, 6, 8]);
  const [divSingleNumber, setDivSingleNumber] = useState(24);
  const [mkdCount, setMkdCount] = useState(2); const [mkdValues, setMkdValues] = useState([12, 18, 24, 36]);
  const [criteriaNumber, setCriteriaNumber] = useState(123);
  
  // State για Αναγωγή στη Μονάδα
  const [unitNum, setUnitNum] = useState(3);
  const [unitDen, setUnitDen] = useState(5);
  const [unitValue, setUnitValue] = useState(150);

  // State για Μέση Τιμή (4 στήλες/ποσότητες)
  const [meanItems, setMeanItems] = useState([8, 4, 9, 3]);

  // Math Core Functions
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const autoMkd3 = gcd(num3, den3);
  const isIrreducible3 = autoMkd3 === 1;

  // ΕΚΠ / ΜΚΔ Helpers
  const updateEkpValue = (index, increment) => {
    const newValues = [...ekpValues];
    newValues[index] = increment ? Math.min(LIMITS.EKP_VAL_MAX, newValues[index] + 1) : Math.max(LIMITS.EKP_VAL_MIN, newValues[index] - 1);
    setEkpValues(newValues);
  };
  const finalEkp = (() => {
    let currentLcm = ekpValues[0];
    for (let i = 1; i < ekpCount; i++) currentLcm = lcm(currentLcm, ekpValues[i]);
    return currentLcm;
  })();
  const getDynamicCountForNumber = (num) => Math.floor((finalEkp * 3) / num) + 1;

  const updateMkdValue = (index, increment) => {
    const newValues = [...mkdValues];
    newValues[index] = increment ? Math.min(LIMITS.MKD_VAL_MAX, newValues[index] + 1) : Math.max(LIMITS.MKD_VAL_MIN, newValues[index] - 1);
    setMkdValues(newValues);
  };
  const getDivisors = (num) => {
    const divisors = [];
    for (let i = 1; i <= num; i++) if (num % i === 0) divisors.push(i);
    return divisors;
  };
  const finalMkd = (() => {
    let currentGcd = mkdValues[0];
    for (let i = 1; i < mkdCount; i++) currentGcd = gcd(currentGcd, mkdValues[i]);
    return currentGcd;
  })();
  const getDigitsSum = (num) => String(num).split('').reduce((sum, digit) => sum + parseInt(digit || '0', 10), 0);

  // Μέση Τιμή Helpers
  const sumMean = meanItems.reduce((a, b) => a + b, 0);
  const averageMean = (sumMean / meanItems.length).toFixed(1);

  const updateMeanItem = (index, increment) => {
    const newItems = [...meanItems];
    newItems[index] = increment ? Math.min(LIMITS.MEAN_VAL_MAX, newItems[index] + 1) : Math.max(LIMITS.MEAN_VAL_MIN, newItems[index] - 1);
    setMeanItems(newItems);
  };

  // Σχεδίαση Πίτας (SVG)
  const renderPieSlices = (pieIndex, totalSlicesToColor, currentDen) => {
    const slices = []; const radius = 45; const cx = 55; const cy = 55;
    for (let i = 0; i < currentDen; i++) {
      const startAngle = (i * 360) / currentDen - 90; const endAngle = ((i + 1) * 360) / currentDen - 90;
      const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180); const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180); const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);
      const currentSliceNumber = pieIndex * currentDen + i; const isColored = currentSliceNumber < totalSlicesToColor;
      if (currentDen === 1) {
        slices.push(<circle key={i} cx={cx} cy={cy} r={radius} className={`${isColored ? 'fill-orange-500' : 'fill-gray-200'} stroke-white stroke-2`} />);
        continue;
      }
      const largeArcFlag = 360 / currentDen > 180 ? 1 : 0;
      const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      slices.push(<path key={i} d={pathData} className={`${isColored ? 'fill-orange-500' : 'fill-gray-100'} stroke-cyan-600 stroke-[1.5]`} />);
    }
    return slices;
  };

  const totalPies1 = Math.max(1, Math.ceil(num1 / den1));
  const totalPies2Initial = Math.max(1, Math.ceil(num2 / den2));
  const totalPies2Equivalent = Math.max(1, Math.ceil((num2 * multiplier) / (den2 * multiplier)));
  const totalPies3Initial = Math.max(1, Math.ceil(num3 / den3));
  const totalPies3Simplified = Math.max(1, Math.ceil((num3 / autoMkd3) / (den3 / autoMkd3)));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Ε' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🏠 Αρχική</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-10 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">🎒 Μαθηματικά Ε' Δημοτικού</h1>
        <p className="text-cyan-100 opacity-90 font-medium">Διαδραστικά Εργαλεία Μάθησης</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ (10 ΠΛΗΡΗ TABS) */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2 bg-white p-2 rounded-xl shadow-sm">
          {[
            { id: 'intro', label: '🍕 Κλάσμα' },
            { id: 'equivalent', label: '🔄 Ισοδύναμα' },
            { id: 'simplification', label: '✂️ Απλοποίηση' },
            { id: 'reduction', label: '🔍 Αναγωγή' },
            { id: 'multiples', label: '🔢 Πολλαπλ.' },
            { id: 'ekp', label: '🎯 ΕΚΠ' },
            { id: 'divisors', label: '🛡️ Διαιρέτες' },
            { id: 'mkd', label: '🏆 ΜΚΔ' },
            { id: 'criteria', label: '🔍 Κριτήρια' },
            { id: 'mean', label: '📊 Μέση Τιμή' },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 text-center rounded-lg font-bold transition duration-200 text-[11px] ${activeTab === tab.id ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* TAB 1: ΤΙ ΕΙΝΑΙ ΚΛΑΣΜΑ */}
        {activeTab === 'intro' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-gray-900">Τι είναι το Κλάσμα;</h2>
                <p className="text-gray-600 leading-relaxed text-sm">Κλάσμα είναι ένας αριθμός που μας δείχνει <strong>σε πόσα ίσα μέρη</strong> έχουμε χωρίσει μια μονάδα και <strong>πόσα από αυτά τα μέρη</strong> έχουμε πάρει.</p>
                <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100 text-xs text-cyan-900">
                  <p>☝️ <strong>Αριθμητής (πάνω):</strong> Πόσα κομμάτια πήραμε.</p>
                  <p className="mt-1">👇 <strong>Παρονομαστής (κάτω):</strong> Σε πόσα συνολικά κομμάτια κόψαμε τη μονάδα.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
                <div className="inline-flex flex-col items-center font-black text-4xl">
                  <div className="text-amber-300 pb-1">Αριθμητής</div>
                  <div className="w-36 h-1 bg-white rounded-full my-1"></div>
                  <div className="text-white pt-1">Παρονομαστής</div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-center text-gray-800">🍕 Διαδραστική Πίτα Κλασμάτων</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-24 text-right">Αριθμητής:</span>
                    <button onClick={() => setNum1(Math.max(LIMITS.INTRO_NUM_MIN, num1 - 1))} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition">-</button>
                    <span className="w-8 text-center text-xl font-black text-red-600">{num1}</span>
                    <button onClick={() => setNum1(Math.min(LIMITS.INTRO_NUM_MAX, num1 + 1))} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition">+</button>
                  </div>
                  <div className="w-40 h-[2px] bg-gray-200"></div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-500 w-24 text-right">Παρονομαστής:</span>
                    <button onClick={() => setDen1(Math.max(LIMITS.LIMITS_INTRO_DEN_MIN, den1 - 1))} className="bg-red-500 text-white w-8 h-8 rounded-full font-bold hover:bg-red-600 transition">-</button>
                    <span className="w-8 text-center text-xl font-black text-blue-600">{den1}</span>
                    <button onClick={() => setDen1(Math.min(LIMITS.INTRO_DEN_MAX, den1 + 1))} className="bg-green-500 text-white w-8 h-8 rounded-full font-bold hover:bg-green-600 transition">+</button>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-center gap-4 min-h-[160px] items-center">
                  {Array.from({ length: totalPies1 }).map((_, i) => (
                    <svg key={i} width="110" height="110" className="drop-shadow-sm">{renderPieSlices(i, num1, den1)}</svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ΙΣΟΔΥΝΑΜΑ ΚΛΑΣΜΑΤΑ */}
        {activeTab === 'equivalent' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">🔄 Ισοδύναμα Κλάσματα</h2>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
                <span className="font-bold text-amber-900 text-sm">Διάλεξε Πολλαπλασιαστή:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setMultiplier(Math.max(LIMITS.MULTIPLIER_MIN, multiplier - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition">-</button>
                  <span className="text-xl font-black text-amber-600 w-6 text-center">{multiplier}</span>
                  <button onClick={() => setMultiplier(Math.min(LIMITS.MULTIPLIER_MAX, multiplier + 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition">+</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap justify-center items-center gap-6 text-sm max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Αριθμητής:</span>
                    <button onClick={() => setNum2(Math.max(LIMITS.EQUIV_NUM_MIN, num2 - 1))} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">-</button>
                    <span className="font-black text-base w-4 text-center">{num2}</span>
                    <button onClick={() => { if(num2 < den2) setNum2(num2 + 1) }} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">+</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Παρονομαστής:</span>
                    <button onClick={() => { const d = Math.max(LIMITS.EQUIV_DEN_MIN, den2 - 1); setDen2(d); if(num2 > d) setNum2(d); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">-</button>
                    <span className="font-black text-base w-4 text-center">{den2}</span>
                    <button onClick={() => setDen2(Math.min(LIMITS.EQUIV_DEN_MAX, den2 + 1))} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">+</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="flex flex-col items-center justify-start space-y-4">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">Αρχικό Κλάσμα</span>
                    <div className="flex flex-col items-center font-black text-3xl text-blue-600">
                      <div>{num2}</div><div className="w-10 h-[3px] bg-blue-600 my-1"></div><div>{den2}</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 bg-slate-50 rounded-xl w-full max-w-[240px] items-center">
                      {Array.from({ length: totalPies2Initial }).map((_, i) => (<svg key={i} width="110" height="110">{renderPieSlices(i, num2, den2)}</svg>))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start space-y-4">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Ισοδύναμο Κλάσμα</span>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 px-4 rounded-xl border">
                      <div className="flex flex-col items-center font-bold text-sm text-amber-600">
                        <div>{num2} × {multiplier}</div><div className="w-14 h-[2px] bg-amber-500 my-0.5"></div><div>{den2} × {multiplier}</div>
                      </div>
                      <span className="font-black text-2xl text-emerald-600">=</span>
                      <div className="flex flex-col items-center font-black text-3xl text-emerald-600">
                        <div>{num2 * multiplier}</div><div className="w-12 h-[3px] bg-emerald-600 my-1"></div><div>{den2 * multiplier}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 bg-slate-50 rounded-xl w-full max-w-[240px] items-center">
                      {Array.from({ length: totalPies2Equivalent }).map((_, i) => (<svg key={i} width="110" height="110">{renderPieSlices(i, num2 * multiplier, den2 * multiplier)}</svg>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ΑΠΛΟΠΟΙΗΣΗ ΚΛΑΣΜΑΤΩΝ */}
        {activeTab === 'simplification' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">✂️ Απλοποίηση Κλασμάτων</h2>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-wrap justify-center items-center gap-6 text-sm max-w-2xl mx-auto">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Αριθμητής:</span>
                  <button onClick={() => setNum3(Math.max(LIMITS.SIMPL_NUM_MIN, num3 - 1))} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">-</button>
                  <span className="font-black text-base w-4 text-center">{num3}</span>
                  <button onClick={() => { if(num3 < den3) setNum3(num3 + 1) }} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">+</button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Παρονομαστής:</span>
                  <button onClick={() => { const d = Math.max(LIMITS.SIMPL_DEN_MIN, den3 - 1); setDen3(d); if(num3 > d) setNum3(d); }} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">-</button>
                  <span className="font-black text-base w-4 text-center">{den3}</span>
                  <button onClick={() => setDen3(Math.min(LIMITS.SIMPL_DEN_MAX, den3 + 1))} className="bg-slate-200 px-2 py-0.5 rounded font-bold text-xs shadow-sm">+</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                {isIrreducible3 && (
                  <div className="text-center"><span className="inline-block bg-emerald-100 text-emerald-800 font-black px-4 py-2 rounded-xl text-xs border border-emerald-200">🏆 Το κλάσμα είναι ήδη ΑΝΑΓΩΓΟ!</span></div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="flex flex-col items-center justify-start space-y-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">Αρχικό Κλάσμα</span>
                    <div className="flex flex-col items-center font-black text-3xl text-slate-700">
                      <div>{num3}</div><div className="w-10 h-[3px] bg-slate-600 my-1"></div><div>{den3}</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 bg-slate-50 rounded-xl w-full max-w-[240px] items-center">
                      {Array.from({ length: totalPies3Initial }).map((_, i) => (<svg key={i} width="110" height="110">{renderPieSlices(i, num3, den3)}</svg>))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start space-y-4">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Ανάγωγο Κλάσμα</span>
                    <div className="flex items-center gap-3 bg-slate-50 p-2 px-4 rounded-xl border">
                      {!isIrreducible3 ? (
                        <>
                          <div className="flex flex-col items-center font-bold text-sm text-rose-600">
                            <div>{num3} ÷ {autoMkd3}</div><div className="w-14 h-[2px] bg-rose-400 my-0.5"></div><div>{den3} ÷ {autoMkd3}</div>
                          </div>
                          <span className="font-black text-2xl text-emerald-600">=</span>
                          <div className="flex flex-col items-center font-black text-3xl text-emerald-600">
                            <div>{num3 / autoMkd3}</div><div className="w-12 h-[3px] bg-emerald-600 my-1"></div><div>{den3 / autoMkd3}</div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center font-black text-3xl text-emerald-600">
                          <div>{num3}</div><div className="w-12 h-[3px] bg-emerald-600 my-1"></div><div>{den3}</div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 bg-slate-50 rounded-xl w-full max-w-[240px] items-center">
                      {Array.from({ length: totalPies3Simplified }).map((_, i) => (<svg key={i} width="110" height="110">{renderPieSlices(i, num3 / autoMkd3, den3 / autoMkd3)}</svg>))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ΑΝΑΓΩΓΗ ΣΤΗ ΜΟΝΑΔΑ */}
        {activeTab === 'reduction' && (
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">🔍 Αναγωγή στην Κλασματική Μονάδα</h2>
              <p className="text-gray-600 text-sm">Αν γνωρίζουμε την τιμή ενός μέρους, βρίσκουμε πρώτα το <strong>ένα κομμάτι</strong> (διαίρεση) και μετά το <strong>όλο σύνολο</strong> (πολλαπλασιασμός).</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-xl border shadow-sm text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">1. Το Μέρος (Κλάσμα)</span>
                <div className="flex justify-center items-center gap-2 font-black text-lg">
                  <input type="number" min="1" max={unitDen - 1} value={unitNum} onChange={(e) => setUnitNum(Math.max(1, Math.min(unitDen - 1, parseInt(e.target.value, 10) || 1)))} className="w-12 text-center text-blue-600 bg-slate-50 rounded"/>
                  <span>/</span>
                  <input type="number" min="2" max={LIMITS.UNIT_DEN_MAX} value={unitDen} onChange={(e) => { const d = Math.max(2, parseInt(e.target.value, 10) || 2); setUnitDen(d); if(unitNum >= d) setUnitNum(d-1); }} className="w-12 text-center text-blue-800 bg-slate-50 rounded"/>
                </div>
              </div>
              <div className="bg-white p-3 rounded-xl border shadow-sm text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">2. Η Τιμή του Μέρους</span>
                <div className="flex justify-center items-center gap-2">
                  <button onClick={() => setUnitValue(Math.max(LIMITS.UNIT_VAL_MIN, unitValue - 10))} className="bg-gray-100 px-2 rounded font-bold">-10</button>
                  <span className="font-black text-lg text-orange-600 w-16 text-center">{unitValue}</span>
                  <button onClick={() => setUnitValue(Math.min(LIMITS.UNIT_VAL_MAX, unitValue + 10))} className="bg-gray-100 px-2 rounded font-bold">+10</button>
                </div>
              </div>
              <div className="bg-blue-600 text-white p-3 rounded-xl flex items-center justify-center font-bold text-xs shadow-md">
                📝 Πρόβλημα: Τα {unitNum}/{unitDen} ενός ποσού είναι {unitValue}. Πόσο είναι το όλο;
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="bg-blue-50 text-blue-800 border border-blue-200 rounded-xl p-2 px-4 text-center font-bold text-xs max-w-md mx-auto">
                ℹ️ Ξέρουμε ότι τα <span className="text-blue-600 font-black">{unitNum} μπλε κουτάκια</span> αντιστοιχούν συνολικά στην τιμή <span className="text-blue-600 font-black">{unitValue}</span>.
              </div>
              <div className="flex w-full h-14 bg-gray-100 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm">
                {Array.from({ length: unitDen }).map((_, i) => (
                  <div key={i} className={`flex-1 border-r last:border-0 border-white/40 flex flex-col items-center justify-center font-black text-xs transition-all duration-300 ${i < unitNum ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-inner' : 'bg-slate-200 text-slate-400'}`}>
                    <span>1/{unitDen}</span>
                    <span className="text-[10px] font-normal opacity-80">({unitValue / unitNum})</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">1</div>
                  <div>
                    <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wide">Βήμα 1: Βρίσκω το 1 κομμάαι (1/{unitDen})</p>
                    <p className="font-black text-base text-gray-800 mt-0.5">{unitValue} ÷ {unitNum} = <span className="text-orange-600 text-lg">{unitValue / unitNum}</span></p>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">2</div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Βήμα 2: Βρίσκω το όλο σύνολο ({unitDen}/{unitDen})</p>
                    <p className="font-black text-base text-gray-800 mt-0.5">{unitValue / unitNum} × {unitDen} = <span className="text-emerald-600 text-lg">{(unitValue / unitNum) * unitDen}</span></p>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-600 text-white p-4 rounded-xl text-center font-black text-sm shadow-md max-w-sm mx-auto">
                🎉 Το συνολικό ποσό είναι: {(unitValue / unitNum) * unitDen}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ΠΟΛΛΑΠΛΑΣΙΑ */}
        {activeTab === 'multiples' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">🔢 Πολλαπλάσια Αριθμού</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6 text-center">
              <div className="flex justify-center items-center gap-4 bg-white p-4 rounded-xl border shadow-sm max-w-xs mx-auto">
                <button onClick={() => setSingleNumber(Math.max(LIMITS.MULT_NUMBER_MIN, singleNumber - 1))} className="bg-blue-600 text-white w-8 h-8 rounded-full font-bold">-</button>
                <span className="text-3xl font-black text-blue-600 w-10">{singleNumber}</span>
                <button onClick={() => setSingleNumber(Math.min(LIMITS.MULT_NUMBER_MAX, singleNumber + 1))} className="bg-blue-600 text-white w-8 h-8 rounded-full font-bold">+</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-10 gap-2">
                {Array.from({ length: LIMITS.MULT_COUNT_TO_SHOW }).map((_, i) => (
                  <div key={i} className="bg-white p-3 rounded-lg border font-bold text-sm text-blue-800 shadow-sm flex flex-col">
                    <span className="text-[9px] text-gray-400 font-normal">{singleNumber}×{i}</span>
                    <span>{singleNumber * i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ΕΚΠ */}
        {activeTab === 'ekp' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</h2>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
                <span className="font-bold text-gray-700 text-sm">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                  {[2, 3, 4].map((n) => (
                    <button key={n} onClick={() => setEkpCount(n)} className={`px-4 py-1.5 rounded-md font-bold text-xs transition ${ekpCount === n ? 'bg-cyan-500 text-white' : 'text-gray-600'}`}>{n} Αριθμούς</button>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center gap-6">
                {Array.from({ length: ekpCount }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border min-w-[110px]">
                    <span className="text-[10px] font-bold text-gray-400">Αριθμός {idx + 1}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateEkpValue(idx, false)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs">-</button>
                      <span className="font-black text-cyan-600 text-lg w-4 text-center">{ekpValues[idx]}</span>
                      <button onClick={() => updateEkpValue(idx, true)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm overflow-x-auto">
                <div className="space-y-3 min-w-[700px]">
                  {Array.from({ length: ekpCount }).map((_, arrIdx) => {
                    const currentNum = ekpValues[arrIdx]; const dynamicCount = getDynamicCountForNumber(currentNum);
                    return (
                      <div key={arrIdx} className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl">
                        <div className="w-14 font-black text-slate-700 text-xs border-r pr-2">Π_{currentNum}:</div>
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: dynamicCount }).map((_, mIdx) => {
                            const val = currentNum * mIdx; const isCommon = val > 0 && (val % finalEkp === 0); const isLcm = val === finalEkp;
                            return (
                              <div key={mIdx} className={`p-1.5 text-[11px] rounded-md font-bold border text-center min-w-[36px] ${isLcm ? 'bg-amber-400 text-white border-amber-600 ring-2 ring-amber-200 relative scale-105' : isCommon ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-gray-600'}`}>
                                {isLcm && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px]">👑</span>}
                                {val}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white p-4 rounded-2xl text-center shadow-md max-w-sm mx-auto">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-90 block">🎯 Ελάχιστο Κοινό Πολλαπλάσιο</span>
                <div className="text-xl font-black mt-1">ΕΚΠ({ekpValues.slice(0, ekpCount).join(', ')}) = <span className="bg-white text-amber-600 px-3 py-0.5 rounded-lg text-2xl shadow-inner inline-block ml-1">{finalEkp}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ΔΙΑΙΡΕΤΕΣ */}
        {activeTab === 'divisors' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">🛡️ Διαιρέτες ενός Αριθμού</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm max-w-xs mx-auto">
                <span className="font-bold text-gray-700 text-sm">Αριθμός:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDivSingleNumber(Math.max(LIMITS.DIV_NUMBER_MIN, divSingleNumber - 1))} className="bg-indigo-500 text-white w-8 h-8 rounded-full font-bold">-</button>
                  <span className="text-2xl font-black text-indigo-600 w-10 text-center">{divSingleNumber}</span>
                  <button onClick={() => setDivSingleNumber(Math.min(LIMITS.DIV_NUMBER_MAX, divSingleNumber + 1))} className="bg-indigo-500 text-white w-8 h-8 rounded-full font-bold">+</button>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Οι διαιρέτες του {divSingleNumber}:</span>
                <div className="flex flex-wrap justify-center gap-2">
                  {getDivisors(divSingleNumber).map((d) => (
                    <div key={d} className="bg-indigo-50 text-indigo-900 border border-indigo-200 font-black text-lg p-3 px-5 rounded-xl shadow-sm">{d}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ΜΚΔ */}
        {activeTab === 'mkd' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">🏆 Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</h2>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
                <span className="font-bold text-gray-700 text-sm">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                  {[2, 3, 4].map((n) => (
                    <button key={n} onClick={() => setMkdCount(n)} className={`px-4 py-1.5 rounded-md font-bold text-xs transition ${mkdCount === n ? 'bg-cyan-500 text-white' : 'text-gray-600'}`}>{n} Αριθμούς</button>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-wrap justify-center gap-6">
                {Array.from({ length: mkdCount }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border min-w-[110px]">
                    <span className="text-[10px] font-bold text-gray-400">Αριθμός {idx + 1}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateMkdValue(idx, false)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs">-</button>
                      <span className="font-black text-indigo-600 text-lg w-5 text-center">{mkdValues[idx]}</span>
                      <button onClick={() => updateMkdValue(idx, true)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-4 rounded-xl border shadow-sm overflow-x-auto">
                <div className="space-y-3 min-w-[700px]">
                  {Array.from({ length: mkdCount }).map((_, arrIdx) => {
                    const currentNum = mkdValues[arrIdx]; const divisorsList = getDivisors(currentNum);
                    return (
                      <div key={arrIdx} className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl">
                        <div className="w-14 font-black text-slate-700 text-xs border-r pr-2">Δ_{currentNum}:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {divisorsList.map((divValue) => {
                            const isCommon = mkdValues.slice(0, mkdCount).every(v => v % divValue === 0); const isMkd = divValue === finalMkd;
                            return (
                              <div key={divValue} className={`p-1.5 px-3 text-[11px] rounded-md font-bold border text-center min-w-[36px] ${isMkd ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200 relative scale-105' : isCommon ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-white text-gray-600'}`}>
                                {isMkd && <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[8px]">👑</span>}
                                {divValue}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-2xl text-center shadow-md max-w-sm mx-auto">
                <span className="text-[10px] uppercase font-black tracking-widest opacity-90 block">🏆 Μέγιστος Κοινός Διαιρέτης</span>
                <div className="text-xl font-black mt-1">ΜΚΔ({mkdValues.slice(0, mkdCount).join(', ')}) = <span className="bg-white text-emerald-600 px-3 py-0.5 rounded-lg text-2xl shadow-inner inline-block ml-1">{finalMkd}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: ΚΡΙΤΗΡΙΑ */}
        {activeTab === 'criteria' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900">🔍 Κριτήρια Διαιρετότητας</h2>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border shadow-sm gap-4">
                <span className="font-bold text-gray-700 text-sm">Διάλεξε ή γράψε αριθμό:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCriteriaNumber(Math.max(LIMITS.CRITERIA_NUM_MIN, criteriaNumber - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold">-</button>
                  <input type="number" value={criteriaNumber} onChange={(e) => setCriteriaNumber(Math.max(LIMITS.CRITERIA_NUM_MIN, Math.min(LIMITS.CRITERIA_NUM_MAX, parseInt(e.target.value, 10) || 1)))} className="w-20 text-center text-xl font-black text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-1"/>
                  <button onClick={() => setCriteriaNumber(Math.min(LIMITS.CRITERIA_NUM_MAX, criteriaNumber + 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold">+</button>
                </div>
              </div>
              <div className="px-2 pt-2">
                <input type="range" min={LIMITS.CRITERIA_NUM_MIN} max={LIMITS.CRITERIA_NUM_MAX} value={criteriaNumber} onChange={(e) => setCriteriaNumber(parseInt(e.target.value, 10))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { div: 2, label: 'Διαιρείται με το 2;', rule: 'Είναι άρτιος (λήγει σε 0, 2, 4, 6, 8).', text: `Λήγει σε ${criteriaNumber % 10}.` },
                { div: 5, label: 'Διαιρείται με το 5;', rule: 'Λήγει σε 0 ή 5.', text: `Λήγει σε ${criteriaNumber % 10}.` },
                { div: 10, label: 'Διαιρείται με το 10;', rule: 'Λήγει σε 0.', text: `Λήγει σε ${criteriaNumber % 10}.` },
                { div: 3, label: 'Διαιρείται με το 3;', rule: 'Το άθροισμα των ψηφίων του διαιρείται με το 3.', text: `Άθροισμα: ${String(criteriaNumber).split('').join(' + ')} = ${getDigitsSum(criteriaNumber)}.` }
              ].map((c) => {
                const ok = criteriaNumber % c.div === 0;
                return (
                  <div key={c.div} className={`p-4 rounded-2xl border ${ok ? 'bg-emerald-50/60 border-emerald-200' : 'bg-rose-50/70 border-rose-200'}`}>
                    <div className="flex justify-between font-black text-sm text-slate-800"><span>{c.label}</span><span>{ok ? '✅ Ναι' : '❌ Όχι'}</span></div>
                    <p className="text-[11px] text-gray-500 mt-1"><strong>Κανόνας:</strong> {c.rule}</p>
                    <div className="mt-3 p-2 bg-white/90 rounded-lg border text-[11px] font-semibold">🔍 {c.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ΝΕΟ TAB 10: ΜΕΣΗ ΤΙΜΗ (ΜΕΣΟΣ ΟΡΟΣ) */}
        {activeTab === 'mean' && (
          <div className="space-y-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-gray-900">📊 Μέση Τιμή (Μέσος Όρος)</h2>
              <p className="text-gray-600 text-sm">Μέση τιμή είναι ο αριθμός που προκύπτει αν προσθέσουμε όλες τις ποσότητες και **μοιράσουμε το άθροισμα εξίσου** (δίκαια) στον ίδιο αριθμό ομάδων.</p>
            </div>

            {/* Πάνελ Ελέγχου 4 Ποσοτήτων */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider text-center sm:text-left">Άλλαξε το ύψος των 4 ομάδων:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {meanItems.map((val, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border shadow-sm flex flex-col items-center justify-center space-y-1">
                    <span className="text-xs font-bold text-gray-500">Ομάδα {String.fromCharCode(65 + idx)}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateMeanItem(idx, false)} className="bg-slate-100 font-bold px-2 rounded hover:bg-slate-200 text-sm">-</button>
                      <span className="font-black text-lg text-indigo-600 w-6 text-center">{val}</span>
                      <button onClick={() => updateMeanItem(idx, true)} className="bg-slate-100 font-bold px-2 rounded hover:bg-slate-200 text-sm">+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕ ΣΤΗΛΕΣ ΚΑΙ ΕΥΘΕΙΑ ΜΕΣΟΥ ΟΡΟΥ */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center">📈 Γραφική Ισορροπία Στηλών (Η Δίκαιη Μοιρασιά)</h3>
              
              {/* Το Διάγραμμα */}
              <div className="relative border-b-2 border-gray-300 h-48 flex items-end justify-around px-2 sm:px-12 bg-slate-50/50 rounded-xl pt-4">
                
                {/* Οριζόντια Διακεκομμένη Γραμμή Μέσου Όρου */}
                <div 
                  className="absolute left-0 right-0 border-t-2 border-dashed border-rose-500 z-10 transition-all duration-300"
                  style={{ bottom: `${(parseFloat(averageMean) / LIMITS.MEAN_VAL_MAX) * 100}%` }}
                >
                  <span className="absolute right-2 -top-5 bg-rose-500 text-white text-[9px] font-black p-0.5 px-2 rounded shadow-sm">
                    Μέση Τιμή: {averageMean}
                  </span>
                </div>

                {/* Οι 4 Στήλες */}
                {meanItems.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center w-12 sm:w-16 z-0">
                    <span className="text-xs font-black text-slate-700 mb-1">{val}</span>
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-md shadow-sm transition-all duration-300 relative flex flex-col justify-end"
                      style={{ height: `${(val / LIMITS.MEAN_VAL_MAX) * 150}px` }}
                    >
                      {/* Εσωτερικά διαχωριστικά "τουβλάκια" */}
                      {Array.from({ length: val }).map((_, bIdx) => (
                        <div key={bIdx} className="border-b border-white/20 h-full w-full"></div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 mt-2">Ομ. {String.fromCharCode(65 + idx)}</span>
                  </div>
                ))}
              </div>

              {/* ΜΑΘΗΜΑΤΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ ΒΗΜΑ-ΒΗΜΑ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">1</div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide">Βήμα 1: Βρίσκω το Συνολικό Άθροισμα</p>
                    <p className="font-black text-sm text-gray-800 mt-0.5">
                      {meanItems.join(' + ')} = <span className="text-blue-600 text-base">{sumMean}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black shrink-0 shadow-sm">2</div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">Βήμα 2: Διαιρώ με το πλήθος των ομάδων ({meanItems.length})</p>
                    <p className="font-black text-sm text-gray-800 mt-0.5">
                      {sumMean} ÷ {meanItems.length} = <span className="text-emerald-600 text-base">{averageMean}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Τελικό Συμπέρασμα */}
              <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white p-4 rounded-xl text-center font-black text-sm shadow-md max-w-sm mx-auto">
                📢 Αν μοιράζαμε δίκαια τα τουβλάκια, κάθε ομάδα θα είχε ακριβώς: {averageMean}
              </div>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για την Ε' Δημοτικού.</p>
      </footer>
    </div>
  );
}

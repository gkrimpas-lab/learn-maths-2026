import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// ==========================================
// ΡΥΘΜΙΣΕΙΣ ΟΡΙΩΝ (ΜΕΤΑΒΛΗΤΕΣ CONFIGURATION)
// ==========================================
const LIMITS = {
  // 1ος Προσομοιωτής (Τι είναι κλάσμα)
  INTRO_NUM_MIN: 0,
  INTRO_NUM_MAX: 20,
  LIMITS_INTRO_DEN_MIN: 1,
  INTRO_DEN_MAX: 12,

  // 2ος Προσομοιωτής (Ισοδύναμα κλάσματα)
  EQUIV_NUM_MIN: 0,
  EQUIV_DEN_MIN: 2,
  EQUIV_DEN_MAX: 6,
  MULTIPLIER_MIN: 2,
  MULTIPLIER_MAX: 5,

  // 3ος Προσομοιωτής (Πολλαπλάσια Αριθμού)
  MULT_NUMBER_MIN: 2,
  MULT_NUMBER_MAX: 15,
  MULT_COUNT_TO_SHOW: 30,

  // 4ος Προσομοιωτής (ΕΚΠ)
  EKP_NUMBERS_COUNT_MIN: 2,
  EKP_NUMBERS_COUNT_MAX: 4,
  EKP_VAL_MIN: 2,
  EKP_VAL_MAX: 12,

  // 5ος & 6ος Προσομοιωτής (Διαιρέτες & ΜΚΔ)
  DIV_NUMBER_MIN: 2,
  DIV_NUMBER_MAX: 100, // Επιτρέπουμε μεγαλύτερους αριθμούς για διαιρέτες
  MKD_NUMBERS_COUNT_MIN: 2,
  MKD_NUMBERS_COUNT_MAX: 4,
  MKD_VAL_MIN: 4,
  MKD_VAL_MAX: 60
};

export default function EDimotikou() {
  const [activeTab, setActiveTab] = useState('intro');

  // Κατάσταση για τον 1ο προσομοιωτή (Κλάσματα)
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);

  // Κατάσταση για τον 2ο προσομοιωτή (Ισοδύναμα)
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(3);
  const [multiplier, setMultiplier] = useState(2);

  // Κατάσταση για τον 3ο προσομοιωτή (Πολλαπλάσια)
  const [singleNumber, setSingleNumber] = useState(4);

  // Κατάσταση για τον 4ο προσομοιωτή (ΕΚΠ)
  const [ekpCount, setEkpCount] = useState(2);
  const [ekpValues, setEkpValues] = useState([3, 4, 6, 8]);

  // Κατάσταση για τον 5ο προσομοιωτή (Διαιρέτες)
  const [divSingleNumber, setDivSingleNumber] = useState(24);

  // Κατάσταση για τον 6ο προσομοιωτή (ΜΚΔ)
  const [mkdCount, setMkdCount] = useState(2);
  const [mkdValues, setMkdValues] = useState([12, 18, 24, 36]);

// Συναρτήσεις Διαχείρισης ΜΚΔ & Διαιρετών
  const updateMkdValue = (index, increment) => {
    const newValues = [...mkdValues];
    if (increment) {
      newValues[index] = Math.min(LIMITS.MKD_VAL_MAX, newValues[index] + 1); // Διορθώθηκε σε +1
    } else {
      newValues[index] = Math.max(LIMITS.MKD_VAL_MIN, newValues[index] - 1); // Διορθώθηκε σε -1
    }
    setMkdValues(newValues);
  };
  
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);
  
  const calculateFinalEKP = () => {
    let currentLcm = ekpValues[0];
    for (let i = 1; i < ekpCount; i++) {
      currentLcm = lcm(currentLcm, ekpValues[i]);
    }
    return currentLcm;
  };

  const finalEkp = calculateFinalEKP();

  const getDynamicCountForNumber = (num) => {
    const targetValue = finalEkp * 3; 
    return Math.floor(targetValue / num) + 1;
  };

  // Συναρτήσεις Διαχείρισης ΜΚΔ & Διαιρετών
  const updateMkdValue = (index, increment) => {
    const newValues = [...mkdValues];
    if (increment) {
      newValues[index] = Math.min(LIMITS.MKD_VAL_MAX, newValues[index] + 2); // Βήμα 2 ή 1, ας βάλουμε +1 για ακρίβεια
    } else {
      newValues[index] = Math.max(LIMITS.MKD_VAL_MIN, newValues[index] - 1);
    }
    setMkdValues(newValues);
  };

  const getDivisors = (num) => {
    const divisors = [];
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) divisors.push(i);
    }
    return divisors;
  };

  const calculateFinalMKD = () => {
    let currentGcd = mkdValues[0];
    for (let i = 1; i < mkdCount; i++) {
      currentGcd = gcd(currentGcd, mkdValues[i]);
    }
    return currentGcd;
  };

  const finalMkd = calculateFinalMKD();

  // Σχεδίαση Πίτας
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
        <title>Ε' Δημοτικού: Φυσικοί Αριθμοί & Κλάσματα - LearnMaths.gr</title>
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
        <p className="text-cyan-100 opacity-90 font-medium">Ενότητες: Κλάσματα, Πολλαπλάσια, Διαιρέτες, ΕΚΠ & ΜΚΔ</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ (6 TABS) */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-white p-2 rounded-xl shadow-sm">
          <button onClick={() => setActiveTab('intro')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs ${activeTab === 'intro' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🍕 1. Τι είναι κλάσμα;
          </button>
          <button onClick={() => setActiveTab('equivalent')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs ${activeTab === 'equivalent' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🔄 2. Ισοδύναμα
          </button>
          <button onClick={() => setActiveTab('multiples')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs ${activeTab === 'multiples' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🔢 3. Πολλαπλάσια
          </button>
          <button onClick={() => setActiveTab('ekp')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs ${activeTab === 'ekp' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🎯 4. ΕΚΠ
          </button>
          <button onClick={() => setActiveTab('divisors')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs ${activeTab === 'divisors' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🛡️ 5. Διαιρέτες
          </button>
          <button onClick={() => setActiveTab('mkd')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs ${activeTab === 'mkd' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🏆 6. ΜΚΔ
          </button>
        </div>
      </div>

      {/* ΠΕΡΙΕΧΟΜΕΝΟ ΣΕΛΙΔΑΣ */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
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
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white p-6 rounded-2xl shadow-md text-center">
                <span className="text-xs uppercase font-bold tracking-wider opacity-75 block mb-1">Συνοπτική Εικόνα</span>
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
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-wrap justify-center gap-4 min-h-[160px] p-4 items-center">
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
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">Τι είναι τα Ισοδύναμα Κλάσματα;</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Ισοδύναμα λέγονται τα κλάσματα που <strong>εκφράζουν το ίδιο μέρος μιας επιφάνειας</strong>, παρόλο που έχουν διαφορετικούς αριθμητές και παρονομαστές.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <h3 className="text-lg font-bold text-center text-gray-800">🔄 Προσομοιωτής Ισοδύναμων Κλασμάτων</h3>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto">
                <span className="font-bold text-amber-900 text-sm">Διάλεξε Πολλαπλασιαστή (Φουσκώνω το κλάσμα):</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setMultiplier(Math.max(LIMITS.MULTIPLIER_MIN, multiplier - 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition">-</button>
                  <span className="text-xl font-black text-amber-600 w-6 text-center">{multiplier}</span>
                  <button onClick={() => setMultiplier(Math.min(LIMITS.MULTIPLIER_MAX, multiplier + 1))} className="bg-amber-500 text-white w-8 h-8 rounded-full font-bold hover:bg-amber-600 transition">+</button>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap justify-center items-center gap-6 text-sm max-w-2xl mx-auto">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Αριθμητής:</span>
                    <button onClick={() => setNum2(Math.max(LIMITS.EQUIV_NUM_MIN, num2 - 1))} className="bg-slate-200 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">-</button>
                    <span className="font-black text-slate-800 text-base w-4 text-center">{num2}</span>
                    <button onClick={() => { if(num2 < den2) setNum2(num2 + 1) }} className="bg-slate-200 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">+</button>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-300 hidden md:block"></div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-600">Παρονομαστής:</span>
                    <button onClick={() => { const d = Math.max(LIMITS.EQUIV_DEN_MIN, den2 - 1); setDen2(d); if(num2 > d) setNum2(d); }} className="bg-slate-200 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">-</button>
                    <span className="font-black text-slate-800 text-base w-4 text-center">{den2}</span>
                    <button onClick={() => setDen2(Math.min(LIMITS.EQUIV_DEN_MAX, den2 + 1))} className="bg-slate-200 px-2.5 py-1 rounded font-bold text-xs shadow-sm transition">+</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 pt-4">
                  <div className="flex flex-col items-center justify-start space-y-6 pb-6 md:pb-0 h-full">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full">Αρχικό Κλάσμα</span>
                    <div className="flex flex-col items-center font-black text-3xl text-blue-600 bg-slate-50 p-3 px-6 rounded-xl border border-slate-100 min-w-[75px]">
                      <div>{num2}</div>
                      <div className="w-10 h-[3px] bg-blue-600 rounded-full my-1"></div>
                      <div>{den2}</div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 items-center bg-slate-50/50 rounded-xl w-full max-w-[240px]">
                      {Array.from({ length: totalPies2Initial }).map((_, i) => (
                        <svg key={i} width="110" height="110" className="drop-shadow-sm">{renderPieSlices(i, num2, den2)}</svg>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-start space-y-6 pt-6 md:pt-0 md:pl-8 h-full">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Ισοδύναμο Κλάσμα</span>
                    <div className="flex items-center gap-3 bg-slate-50 p-3 px-6 rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex flex-col items-center font-bold text-xl text-amber-600 px-2">
                        <div>{num2} × {multiplier}</div>
                        <div className="w-16 h-[2px] bg-amber-500 my-1"></div>
                        <div>{den2} × {multiplier}</div>
                      </div>
                      <span className="font-black text-3xl text-emerald-600 mx-1">=</span>
                      <div className="flex flex-col items-center font-black text-3xl text-emerald-600 min-w-[75px]">
                        <div>{num2 * multiplier}</div>
                        <div className="w-12 h-[3px] bg-emerald-600 rounded-full my-1"></div>
                        <div>{den2 * multiplier}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 min-h-[140px] p-2 items-center bg-slate-50/50 rounded-xl w-full max-w-[240px]">
                      {Array.from({ length: totalPies2Equivalent }).map((_, i) => (
                        <svg key={i} width="110" height="110" className="drop-shadow-sm">{renderPieSlices(i, num2 * multiplier, den2 * multiplier)}</svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ΠΟΛΛΑΠΛΑΣΙΑ ΑΡΙΘΜΟΥ */}
        {activeTab === 'multiples' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">Πολλαπλάσια ενός Αριθμού</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Πολλαπλάσια ενός φυσικού αριθμού είναι οι αριθμοί που προκύπτουν όταν <strong>πολλαπλασιάσουμε τον αριθμό αυτόν με όλους τους φυσικούς αριθμούς</strong> (0, 1, 2, 3, 4...).
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4 max-w-xl mx-auto">
                <span className="font-bold text-gray-700 text-sm">Διάλεξε έναν αριθμό:</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSingleNumber(Math.max(LIMITS.MULT_NUMBER_MIN, singleNumber - 1))} className="bg-blue-500 text-white w-8 h-8 rounded-full font-bold hover:bg-blue-600 transition">-</button>
                  <span className="text-2xl font-black text-blue-600 w-8 text-center">{singleNumber}</span>
                  <button onClick={() => setSingleNumber(Math.min(LIMITS.MULT_NUMBER_MAX, singleNumber + 1))} className="bg-blue-500 text-white w-8 h-8 rounded-full font-bold hover:bg-blue-600 transition">+</button>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Τα πρώτα {LIMITS.MULT_COUNT_TO_SHOW} Πολλαπλάσια του {singleNumber}:</span>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {Array.from({ length: LIMITS.MULT_COUNT_TO_SHOW }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm text-center flex flex-col justify-center transform hover:scale-105 transition duration-150">
                      <span className="text-[10px] text-gray-400 font-medium block">{singleNumber} × {i}</span>
                      <span className="text-lg font-black text-blue-600 mt-0.5">{singleNumber * i}</span>
                    </div>
                  ))}
                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 border-dashed text-center flex items-center justify-center font-black text-blue-400 text-xl">...</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ΕΛΑΧΙΣΤΟ ΚΟΙΝΟ ΠΟΛΛΑΠΛΑΣΙΟ (ΕΚΠ) */}
        {activeTab === 'ekp' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">🎯 Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                <strong>Κοινά Πολλαπλάσια</strong> είναι οι αριθμοί που είναι ίδιοι στις λίστες των αριθμών. Το <strong>ΕΚΠ</strong> είναι το μικρότερο από αυτά, εκτός του 0!
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                <span className="font-bold text-gray-700 text-sm">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setEkpCount(num)}
                      className={`px-4 py-1.5 rounded-md font-bold text-xs transition ${ekpCount === num ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {num} Αριθμούς
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Ρύθμιση Αριθμών</span>
                <div className="flex flex-wrap justify-center gap-6">
                  {Array.from({ length: ekpCount }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[120px]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Αριθμός {index + 1}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateEkpValue(index, false)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300">-</button>
                        <span className="font-black text-lg text-cyan-600 w-6 text-center">{ekpValues[index]}</span>
                        <button onClick={() => updateEkpValue(index, true)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 overflow-x-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Πίνακας Αναζήτησης (Δυναμική παραγωγή για εμφάνιση 3 Κοινών Πολλαπλασίων)</span>
                
                <div className="space-y-4 min-w-[750px]">
                  {Array.from({ length: ekpCount }).map((_, arrIdx) => {
                    const currentNum = ekpValues[arrIdx];
                    const dynamicCount = getDynamicCountForNumber(currentNum);

                    return (
                      <div key={arrIdx} className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                        <div className="w-16 font-black text-slate-700 text-sm border-r border-slate-200 pr-2">
                          Π_{currentNum}:
                        </div>
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {Array.from({ length: dynamicCount }).map((_, mIdx) => {
                            const multipleValue = currentNum * mIdx;
                            const isCommon = multipleValue > 0 && (multipleValue % finalEkp === 0);
                            const isLcm = multipleValue === finalEkp;

                            return (
                              <div
                                key={mIdx}
                                className={`p-2 px-2 text-[11px] rounded-lg font-bold border transition duration-150 text-center min-w-[38px]
                                  ${isLcm 
                                    ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 scale-110 relative' 
                                    : isCommon 
                                      ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm' 
                                      : 'bg-white text-gray-600 border-gray-200'
                                  }`}
                              >
                                {isLcm && <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 text-[10px]">👑</span>}
                                {multipleValue}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white p-5 rounded-2xl text-center shadow-md max-w-md mx-auto border-b-4 border-amber-600">
                <span className="text-xs uppercase font-black tracking-widest opacity-90 block mb-1">🎯 Το Ελάχιστο Κοινό Πολλαπλάσιο</span>
                <div className="text-3xl font-black tracking-tight mt-1 flex items-center justify-center gap-2">
                  <span>ΕΚΠ({ekpValues.slice(0, ekpCount).join(', ')}) =</span>
                  <span className="bg-white text-amber-600 p-1 px-4 rounded-xl shadow-inner text-4xl transform scale-105 border border-amber-200">
                    {finalEkp}
                  </span>
                </div>
                <p className="text-[11px] opacity-90 mt-3 font-medium">
                  🌟 Το <strong>{finalEkp}</strong> είναι το μικρότερο κοινό πολλαπλάσιο (εκτός του 0) που διαιρείται ακριβώς από όλους τους επιλεγμένους αριθμούς!
                </p>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: ΔΙΑΙΡΕΤΕΣ ΑΡΙΘΜΟΥ */}
        {activeTab === 'divisors' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">🛡️ Διαιρέτες ενός Αριθμού</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                <strong>Διαιρέτες</strong> ενός φυσικού αριθμού είναι όλοι οι αριθμοί που τον <strong>διαιρούν ακριβώς</strong> (δηλαδή η διαίρεση αφήνει υπόλοιπο 0). Κάθε αριθμός έχει συγκεκριμένο (πεπερασμένο) πλήθος διαιρετών.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4 max-w-xl mx-auto">
                <span className="font-bold text-gray-700 text-sm">Διάλεξε αριθμό (2 έως 100):</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDivSingleNumber(Math.max(LIMITS.DIV_NUMBER_MIN, divSingleNumber - 1))} className="bg-indigo-500 text-white w-8 h-8 rounded-full font-bold hover:bg-indigo-600 transition">-</button>
                  <span className="text-2xl font-black text-indigo-600 w-12 text-center">{divSingleNumber}</span>
                  <button onClick={() => setDivSingleNumber(Math.min(LIMITS.DIV_NUMBER_MAX, divSingleNumber + 1))} className="bg-indigo-500 text-white w-8 h-8 rounded-full font-bold hover:bg-indigo-600 transition">+</button>
                </div>
              </div>

              <div className="space-y-3 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Όλοι οι Διαιρέτες του {divSingleNumber}:</span>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {getDivisors(divSingleNumber).map((divisor) => (
                    <div key={divisor} className="bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-900 rounded-xl p-4 px-5 border border-indigo-200 shadow-sm text-center font-black text-xl transform hover:scale-110 transition duration-150">
                      {divisor}
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-400 mt-4 font-medium">
                  💡 Το <strong>1</strong> και ο <strong>ίδιος ο αριθμός ({divSingleNumber})</strong> είναι πάντα μέσα στους διαιρέτες!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ΜΕΓΙΣΤΟΣ ΚΟΙΝΟΣ ΔΙΑΙΡΕΤΗΣ (ΜΚΔ) */}
        {activeTab === 'mkd' && (
          <div className="space-y-8 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900">🏆 Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Όταν βρίσκουμε τους διαιρέτες πολλών αριθμών, οι αριθμοί που είναι κοινοί (ίδιοι) ονομάζονται <strong>Κοινοί Διαιρέτες</strong>. Ο μεγαλύτερος από αυτούς είναι ο <strong>ΜΚΔ</strong>!
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm gap-4">
                <span className="font-bold text-gray-700 text-sm">Πόσους αριθμούς θέλεις να συγκρίνεις;</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      onClick={() => setMkdCount(num)}
                      className={`px-4 py-1.5 rounded-md font-bold text-xs transition ${mkdCount === num ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {num} Αριθμούς
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Ρύθμιση Αριθμών</span>
                <div className="flex flex-wrap justify-center gap-6">
                  {Array.from({ length: mkdCount }).map((_, index) => (
                    <div key={index} className="flex flex-col items-center bg-slate-50 p-3 rounded-xl border border-slate-200 min-w-[120px]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Αριθμός {index + 1}</span>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateMkdValue(index, false)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300">-</button>
                        <span className="font-black text-lg text-indigo-600 w-8 text-center">{mkdValues[index]}</span>
                        <button onClick={() => updateMkdValue(index, true)} className="bg-slate-200 w-6 h-6 rounded-full font-bold text-xs hover:bg-slate-300">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ΠΙΝΑΚΑΣ ΔΙΑΙΡΕΤΩΝ ΜΚΔ */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6 overflow-x-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block text-center">Πίνακας Διαιρετών (Αναζήτηση Κοινών & ΜΚΔ)</span>
                
                <div className="space-y-4 min-w-[750px]">
                  {Array.from({ length: mkdCount }).map((_, arrIdx) => {
                    const currentNum = mkdValues[arrIdx];
                    const divisorsList = getDivisors(currentNum);

                    return (
                      <div key={arrIdx} className="flex items-center gap-4 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                        <div className="w-16 font-black text-slate-700 text-sm border-r border-slate-200 pr-2">
                          Δ_{currentNum}:
                        </div>
                        <div className="flex flex-wrap gap-2 flex-1">
                          {divisorsList.map((divValue) => {
                            // Έλεγχος αν ο διαιρέτης είναι κοινός σε όλους τους επιλεγμένους αριθμούς
                            const isCommon = mkdValues.slice(0, mkdCount).every(v => v % divValue === 0);
                            const isMkd = divValue === finalMkd;

                            return (
                              <div
                                key={divValue}
                                className={`p-2 px-3 text-xs rounded-lg font-bold border transition duration-150 text-center min-w-[38px]
                                  ${isMkd 
                                    ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300 scale-110 relative' 
                                    : isCommon 
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-sm' 
                                      : 'bg-white text-gray-600 border-gray-200'
                                  }`}
                              >
                                {isMkd && <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 text-[10px]">👑</span>}
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

              {/* ΤΕΛΙΚΟ ΠΛΑΙΣΙΟ ΜΚΔ */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-5 rounded-2xl text-center shadow-md max-w-md mx-auto border-b-4 border-emerald-700">
                <span className="text-xs uppercase font-black tracking-widest opacity-90 block mb-1">🏆 Ο Μέγιστος Κοινός Διαιρέτης</span>
                <div className="text-3xl font-black tracking-tight mt-1 flex items-center justify-center gap-2">
                  <span>ΜΚΔ({mkdValues.slice(0, mkdCount).join(', ')}) =</span>
                  <span className="bg-white text-emerald-600 p-1 px-4 rounded-xl shadow-inner text-4xl transform scale-105 border border-emerald-100">
                    {finalMkd}
                  </span>
                </div>
                <p className="text-[11px] opacity-90 mt-3 font-medium">
                  🌟 Το <strong>{finalMkd}</strong> είναι ο μεγαλύτερος αριθμός που μπορεί να διαιρέσει ακριβώς όλους τους επιλεγμένους αριθμούς!
                </p>
              </div>

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

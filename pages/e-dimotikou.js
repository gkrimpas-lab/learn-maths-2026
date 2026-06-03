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
  MULT_COUNT_TO_SHOW: 30, // 30 πολλαπλάσια (3 γραμμές των 10)

  // 4ος Προσομοιωτής (ΕΚΠ)
  EKP_NUMBERS_COUNT_MIN: 2,
  EKP_NUMBERS_COUNT_MAX: 4,
  EKP_VAL_MIN: 2,
  EKP_VAL_MAX: 12
};

export default function EDimotikou() {
  const [activeTab, setActiveTab] = useState('intro');

  // Κατάσταση για τον 1ο προσομοιωτή
  const [num1, setNum1] = useState(3);
  const [den1, setDen1] = useState(4);

  // Κατάσταση για τον 2ο προσομοιωτή
  const [num2, setNum2] = useState(2);
  const [den2, setDen2] = useState(3);
  const [multiplier, setMultiplier] = useState(2);

  // Κατάσταση για τον 3ο προσομοιωτή (Πολλαπλάσια)
  const [singleNumber, setSingleNumber] = useState(4);

  // Κατάσταση για τον 4ο προσομοιωτή (ΕΚΠ)
  const [ekpCount, setEkpCount] = useState(2);
  const [ekpValues, setEkpValues] = useState([3, 4, 6, 8]);

  const updateEkpValue = (index, increment) => {
    const newValues = [...ekpValues];
    if (increment) {
      newValues[index] = Math.min(LIMITS.EKP_VAL_MAX, newValues[index] + 1);
    } else {
      newValues[index] = Math.max(LIMITS.EKP_VAL_MIN, newValues[index] - 1);
    }
    setEkpValues(newValues);
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

  // ΔΥΝΑΜΙΚΟΣ ΥΠΟΛΟΓΙΣΜΟΣ: Πόσα στοιχεία πρέπει να παραχθούν για τον συγκεκριμένο αριθμό
  const getDynamicCountForNumber = (num) => {
    const targetValue = finalEkp * 3; 
    return Math.floor(targetValue / num) + 1;
  };

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
        <title>Ε' Δημοτικού: Κλάσματα & Πολλαπλάσια - LearnMaths.gr</title>
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
        <p className="text-cyan-100 opacity-90 font-medium">Ενότητες: Κλάσματα, Πολλαπλάσια & ΕΚΠ</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΜΕΝΟΥ (TABS) */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white p-2 rounded-xl shadow-sm">
          <button onClick={() => setActiveTab('intro')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs md:text-sm ${activeTab === 'intro' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🍕 1. Τι είναι κλάσμα;
          </button>
          <button onClick={() => setActiveTab('equivalent')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs md:text-sm ${activeTab === 'equivalent' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🔄 2. Ισοδύναμα
          </button>
          <button onClick={() => setActiveTab('multiples')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs md:text-sm ${activeTab === 'multiples' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🔢 3. Πολλαπλάσια
          </button>
          <button onClick={() => setActiveTab('ekp')} className={`py-3 text-center rounded-lg font-bold transition duration-200 text-xs md:text-sm ${activeTab === 'ekp' ? 'bg-cyan-500 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}>
            🎯 4. ΕΚΠ
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
                Ισοδύναμα λέγονται τα κλάσματα που <strong>εκφ

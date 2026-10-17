import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για άτονα κεφαλαία (διατηρεί μόνο το Γ')
function toCleanUppercase(str) {
  if (!str) return '';
  const map = {
    'Ά': 'Α', 'Έ': 'Ε', 'Ή': 'Η', 'Ί': 'Ι', 'Ό': 'Ο', 'Ύ': 'Υ', 'Ώ': 'Ω',
    'Ϊ': 'Ι', 'Ϋ': 'Υ',
    'ά': 'Α', 'έ': 'Ε', 'ή': 'Η', 'ί': 'Ι', 'ό': 'Ο', 'ύ': 'Υ', 'ώ': 'Ω',
    'ϊ': 'Ι', 'ϋ': 'Υ', 'ΐ': 'Ι', 'ΰ': 'Υ'
  };
  return str.split('').map(char => map[char] || char.toUpperCase()).join('');
}

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum) - Responsive
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono shrink-0 ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.52em] h-[1.12em] shrink-0 text-current overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M1 13 L3.5 13 L6.5 21 L12 2" />
      </svg>
      <span className="border-t-[1.8px] border-current pl-0.5 pr-1 py-0 leading-none text-[0.95em]">
        {children}
      </span>
    </span>
  );
}

// Επαναχρησιμοποιήσιμο Component Κλάσματος (Fraction) - Responsive
function Frac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex flex-col items-center align-middle font-mono px-0.5 shrink-0 leading-none ${className}`}>
      <span className="border-b-[1.5px] border-current px-0.5 pb-0.5 text-center text-[0.88em] w-full block">
        {num}
      </span>
      <span className="px-0.5 pt-0.5 text-center text-[0.88em] w-full block">
        {den}
      </span>
    </span>
  );
}

// Δεδομένα για το διαδραστικό εργαστήριο
const LAB_NUMBERS = [
  { id: 'sqrt2', label: '√2', value: 1.4142, display: <Radical>2</Radical>, approx: '≈ 1,414', minSet: 'Άρρητος', sets: ['Άρρητοι', 'ℝ'] },
  { id: 'frac', label: '-3/2', value: -1.5, display: <><Frac num="－3" den="2" /></>, approx: '＝ －1,5', minSet: 'ℚ (Ρητός)', sets: ['ℚ', 'ℝ'] },
  { id: 'pi', label: 'π', value: 3.1415, display: 'π', approx: '≈ 3,1415', minSet: 'Άρρητος', sets: ['Άρρητοι', 'ℝ'] },
  { id: 'sqrt5', label: '√5', value: 2.236, display: <Radical>5</Radical>, approx: '≈ 2,236', minSet: 'Άρρητος', sets: ['Άρρητοι', 'ℝ'] },
  { id: 'int_neg', label: '-3', value: -3, display: '－3', approx: '＝ －3', minSet: 'ℤ (Ακέραιος)', sets: ['ℤ', 'ℚ', 'ℝ'] },
  { id: 'dec', label: '2,75', value: 2.75, display: '2,75', approx: '＝ 11/4', minSet: 'ℚ (Ρητός)', sets: ['ℚ', 'ℝ'] },
  { id: 'nat', label: '4', value: 4, display: '4', approx: '＝ 4', minSet: 'ℕ (Φυσικός)', sets: ['ℕ', 'ℤ', 'ℚ', 'ℝ'] }
];

export default function PragmatikoiTheory() {
  const [selectedNumId, setSelectedNumId] = useState('sqrt2');

  const activeNum = LAB_NUMBERS.find(n => n.id === selectedNumId) || LAB_NUMBERS[0];

  // Υπολογισμός θέσης x στον άξονα (κλίμακα από -4 έως +5, πλάτος SVG 0-600)
  // Άξονας: κέντρο x=0 στο x=270, κλίμακα 60px ανά μονάδα
  const originX = 270;
  const unitPx = 60;
  const pinX = originX + activeNum.value * unitPx;

  return (
    <Layout
      title="Πραγματικοί Αριθμοί | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τους πραγματικούς αριθμούς, τη διάταξη, τις σχέσεις συνόλων, την τοποθέτηση στον άξονα και διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/03-pragmatikoi-ask"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase("ΑΣΚΗΣΕΙΣ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 4k:px-24 py-4 sm:py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10 shadow-xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 3 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Πραγματικοί Αριθμοί
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Η ένωση όλων των αριθμών σε ένα ολοκληρωμένο σύνολο: από τους φυσικούς και τους ακεραίους, έως τα ρητά κλάσματα και τις άρρητες ρίζες. Μάθετε πώς διατάσσονται στην ευθεία των πραγματικών αριθμών χωρίς να μένει κανένα απολύτως κενό.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/03-pragmatikoi-ask"
                className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase("ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  1
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Η Έννοια των Πραγματικών Αριθμών (ℝ)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                <strong>Πραγματικοί αριθμοί (ℝ)</strong> ονομάζονται όλοι οι αριθμοί που είναι είτε <strong>ρητοί</strong> είτε <strong>άρρητοι</strong>.
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-center">
                <div className="font-mono text-base sm:text-xl font-black text-indigo-900">
                  ℝ ＝ ℚ ∪ (Άρρητοι Αριθμοί)
                </div>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">
                  Κάθε πραγματικός αριθμός έχει δεκαδική μορφή (πεπερασμένη, περιοδική ή άπειρη μη περιοδική).
                </p>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1">
                  <span><strong>Ρητοί (ℚ):</strong> Κλάσματα ακεραίων <Frac num="μ" den="ν" /></span>
                  <span className="font-mono font-bold text-indigo-900">0,75 &nbsp;|&nbsp; －3 &nbsp;|&nbsp; 2/3</span>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex flex-wrap items-center justify-between gap-1">
                  <span><strong>Άρρητοι:</strong> Μη περιοδικά άπειρα ψηφία</span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex items-center gap-2">
                    <Radical>2</Radical> &nbsp;|&nbsp; <Radical>5</Radical> &nbsp;|&nbsp; π
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  2
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Ιεραρχία & Σχέσεις Συνόλων
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Τα αριθμητικά σύνολα συνδέονται μεταξύ τους με σχέσεις διαδοχικού εγκλεισμού (υποσύνολα):
              </p>
              
              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner">
                <div className="font-mono text-sm sm:text-lg font-black tracking-wide">
                  ℕ ⊆ ℤ ⊆ ℚ ⊆ ℝ
                </div>
                <div className="text-[11px] sm:text-xs text-indigo-200 mt-1">
                  Φυσικοί ⊆ Ακέραιοι ⊆ Ρητοί ⊆ Πραγματικοί
                </div>
              </div>

              <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  • <strong>Φυσικοί (ℕ):</strong> 0, 1, 2, 3, 4, ...
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  • <strong>Ακέραιοι (ℤ):</strong> ..., －3, －2, －1, 0, 1, 2, 3, ...
                </div>
                <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                  • <strong>Ρητοί (ℚ) και Άρρητοι</strong> είναι <strong>ξένα σύνολα</strong> (δεν έχουν κανένα κοινό στοιχείο: ℚ ∩ Άρρητοι ＝ ∅).
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  3
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Διάταξη Πραγματικών Αριθμών
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για οποιουσδήποτε δύο πραγματικούς αριθμούς α και β, ισχύει ακριβώς μία από τις τρεις σχέσεις: <strong>α ＜ β</strong>, <strong>α ＝ β</strong> ή <strong>α ＞ β</strong>.
              </p>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">Σύγκριση Άρρητου με Ρητό:</span>
                  Χρησιμοποιούμε τη μέθοδο των τετραγώνων (για θετικούς αριθμούς) ή ρητές προσεγγίσεις:
                  <div className="font-mono text-xs mt-1 text-slate-700">
                    <Radical>7</Radical> και 2,5 ⇒ (<Radical>7</Radical>)² ＝ 7 και 2,5² ＝ 6,25. Επειδή 7 ＞ 6,25, ισχύει <Radical>7</Radical> ＞ 2,5.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">Σύγκριση Αρνητικών:</span>
                  Μεταξύ δύο αρνητικών αριθμών, μεγαλύτερος είναι εκείνος που έχει τη <em>μικρότερη απόλυτη τιμή</em>:
                  <div className="font-mono text-xs mt-1 text-slate-700">
                    －3 ＜ －1,5 ＜ 0
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Ο Άξονας των Πραγματικών Αριθμών
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Υπάρχει μια αμφιμονοσήμαντη (1-προς-1) αντιστοιχία ανάμεσα στους πραγματικούς αριθμούς και τα σημεία μιας ευθείας:
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 text-xs sm:text-sm text-emerald-950 space-y-1.5">
                <div className="font-bold">Η Αρχή της Πληρότητας:</div>
                <p>
                  • Κάθε πραγματικός αριθμός παριστάνεται από ένα <strong>μοναδικό σημείο</strong> της ευθείας. <br />
                  • Κάθε σημείο της ευθείας αντιστοιχεί σε έναν <strong>μοναδικό πραγματικό αριθμό</strong> (την τετμημένη του).
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700">
                <strong>Γεωμετρική Ερμηνεία Διάταξης:</strong> <br />
                Αν α ＜ β, τότε το σημείο Α(α) βρίσκεται <strong>αριστερότερα</strong> από το σημείο Β(β) στον προσανατολισμένο άξονα.
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - ΑΞΟΝΑΣ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΑΞΟΝΑ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Διαδραστική Τοποθέτηση Πραγματικού Αριθμού στον Άξονα
              </h2>
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              Επιλέξτε έναν αριθμό για να δείτε την ακριβή του θέση στον άξονα και την ταξινόμησή του στα σύνολα.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-700 block mb-2">
                  Επιλέξτε Αριθμό προς Τοποθέτηση:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LAB_NUMBERS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedNumId(item.id)}
                      className={`p-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center justify-center gap-1 min-h-[46px] ${
                        selectedNumId === item.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{item.display}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Box */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500">Προσέγγιση:</span>
                  <span className="font-mono font-bold text-indigo-900">{activeNum.approx}</span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-slate-500">Ελάχιστο Σύνολο:</span>
                  <span className="font-bold text-emerald-700">{activeNum.minSet}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Ανήκει στα Σύνολα:</span>
                  <span className="font-mono font-bold text-indigo-900">{activeNum.sets.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive SVG Axis */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              <div className="p-4 sm:p-6 bg-slate-900 text-white rounded-2xl shadow-inner w-full overflow-x-auto">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-4">
                  {toCleanUppercase("ΟΠΤΙΚΟΣ ΑΞΟΝΑΣ ΠΡΑΓΜΑΤΙΚΩΝ ΑΡΙΘΜΩΝ x'Ox")}
                </span>

                <div className="min-w-[540px] py-6 relative">
                  <svg viewBox="0 0 540 100" className="w-full h-auto overflow-visible select-none">
                    {/* Main Axis Line */}
                    <line x1="20" y1="50" x2="520" y2="50" stroke="#94a3b8" strokeWidth="2.5" markerEnd="url(#arrow)" />
                    
                    {/* Arrow Marker */}
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
                      </marker>
                    </defs>

                    {/* Axis Ticks & Labels from -4 to +4 */}
                    {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((tick) => {
                      const tx = originX + tick * unitPx;
                      const isZero = tick === 0;
                      return (
                        <g key={tick}>
                          <line x1={tx} y1="42" x2={tx} y2="58" stroke={isZero ? "#38bdf8" : "#64748b"} strokeWidth={isZero ? "2.5" : "1.5"} />
                          <text x={tx} y="75" textAnchor="middle" fill={isZero ? "#38bdf8" : "#94a3b8"} fontSize="12" fontFamily="monospace" fontWeight={isZero ? "bold" : "normal"}>
                            {tick}
                          </text>
                        </g>
                      );
                    })}

                    {/* Active Selected Number Pin */}
                    <g transform={`translate(${pinX}, 50)`} className="transition-all duration-300 ease-out">
                      {/* Pulse Circle */}
                      <circle cx="0" cy="0" r="7" fill="#10b981" />
                      <circle cx="0" cy="0" r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
                      
                      {/* Vertical Pointer Line */}
                      <line x1="0" y1="0" x2="0" y2="-28" stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
                      
                      {/* Floating Badge */}
                      <rect x="-30" y="-46" width="60" height="22" rx="6" fill="#10b981" />
                      <text x="0" y="-31" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="monospace">
                        {activeNum.label}
                      </text>
                    </g>
                  </svg>
                </div>

                <div className="text-[11px] sm:text-xs text-slate-400 mt-2 text-center">
                  Ο αριθμός <strong>{activeNum.label}</strong> {activeNum.value >= 0 ? 'βρίσκεται δεξιά' : 'βρίσκεται αριστερά'} από το μηδέν (O), με τετμημένη x ≈ {activeNum.value}.
                </div>
              </div>

              {/* Interpretation note */}
              <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Συμπέρασμα Τοποθέτησης:</strong> Κάθε πραγματικός αριθμός αντιστοιχεί σε ακριβώς <strong>ένα γεωμετρικό σημείο</strong> του άξονα. Όλοι οι αριθμοί αριστερά του {activeNum.label} είναι μικρότεροι από αυτόν, ενώ όλοι οι αριθμοί δεξιά είναι μεγαλύτεροι.
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2.5 sm:w-3 h-6 sm:h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-xl sm:text-3xl font-black text-slate-900">
              Λυμένα Προβλήματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΔΙΑΤΑΞΗ & ΣΥΓΚΡΙΣΗ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Σύγκριση πραγματικών αριθμών
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να διαταχθούν από τον μικρότερο προς τον μεγαλύτερο (σε αύξουσα σειρά) οι πραγματικοί αριθμοί: <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-2 mt-1">
                    <span>－2,</span>
                    <span><Radical>3</Radical>,</span>
                    <span>1,5,</span>
                    <span><Frac num="7" den="4" />,</span>
                    <span>0</span>
                  </span>
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Αριθμός</th>
                        <th className="p-2 sm:p-2.5 border-b">Δεκαδική Μορφή / Προσέγγιση</th>
                        <th className="p-2 sm:p-2.5 border-b">Θέση στη Σειρά</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold">－2</td>
                        <td className="p-2 sm:p-2.5 font-mono">－2,0 (αρνητικός)</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">1ος (μικρότερος)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold">0</td>
                        <td className="p-2 sm:p-2.5 font-mono">0,0 (ουδέτερος)</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">2ος</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold">1,5</td>
                        <td className="p-2 sm:p-2.5 font-mono">1,50</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">3ος</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold"><Radical>3</Radical></td>
                        <td className="p-2 sm:p-2.5 font-mono">≈ 1,732...</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">4ος</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-mono font-bold"><Frac num="7" den="4" /></td>
                        <td className="p-2 sm:p-2.5 font-mono">＝ 1,75</td>
                        <td className="p-2 sm:p-2.5 font-semibold text-indigo-700">5ος (μεγαλύτερος)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Τελική Αύξουσα Διάταξη:</strong></div>
                  <div className="font-mono font-bold text-emerald-900 inline-flex flex-wrap items-center gap-1.5 mt-1">
                    <span>－2 ＜ 0 ＜ 1,5 ＜</span>
                    <Radical>3</Radical>
                    <span>＜ <Frac num="7" den="4" /></span>
                  </div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΤΑΞΙΝΟΜΗΣΗ ΣΕ ΣΥΝΟΛΑ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Αναγνώριση συνόλων ανήκειν
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να προσδιοριστεί σε ποια από τα αριθμητικά σύνολα <strong>ℕ, ℤ, ℚ, ℝ</strong> ανήκει καθένας από τους παρακάτω αριθμούς:
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[290px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Αριθμός</th>
                        <th className="p-2 sm:p-2.5 border-b">Μορφή</th>
                        <th className="p-2 sm:p-2.5 border-b">Ανήκει στα Σύνολα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold"><Radical>16</Radical></td>
                        <td className="p-2 sm:p-2.5 font-sans">Τέλειο τετράγωνο (＝ 4)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">ℕ, ℤ, ℚ, ℝ</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold">－6/2</td>
                        <td className="p-2 sm:p-2.5 font-sans">Ακέραιο πηλίκο (＝ －3)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">ℤ, ℚ, ℝ (όχι ℕ)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold">0,333...</td>
                        <td className="p-2 sm:p-2.5 font-sans">Περιοδικός (＝ 1/3)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-emerald-700">ℚ, ℝ</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-bold"><Radical>7</Radical></td>
                        <td className="p-2 sm:p-2.5 font-sans">Μη τέλειο τετράγωνο</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">Μόνο ℝ (Άρρητος)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Βασικός Κανόνας:</strong> Αν ένας αριθμός ανήκει στο ℕ, ανήκει αυτόματα και στα ℤ, ℚ, ℝ. Αν είναι άρρητος, ανήκει <em>αποκλειστικά</em> στο ℝ.</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-2xl sm:rounded-3xl p-4 sm:p-7 mb-8 sm:mb-12 shadow-sm">
          <div className="flex items-start gap-3 sm:gap-4">
            <span className="text-2xl sm:text-3xl shrink-0">⚠️</span>
            <div className="space-y-2.5">
              <h3 className="text-base sm:text-xl font-black text-amber-950 leading-tight">
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΟΥΣ ΠΡΑΓΜΑΤΙΚΟΥΣ ΑΡΙΘΜΟΥΣ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Αρνητικοί αριθμοί κάτω από ρίζα:</strong> Παραστάσεις όπως <Radical>－4</Radical> ή <Radical>－9</Radical> <strong>ΔΕΝ</strong> είναι πραγματικοί αριθμοί. Στο σύνολο ℝ δεν ορίζεται τετραγωνική ρίζα αρνητικού αριθμού.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Ρητός και Άρρητος δεν συμπίπτουν ποτέ:</strong> Κανένας αριθμός δεν μπορεί να είναι <em>ταυτόχρονα</em> ρητός και άρρητος. Είναι δύο απολύτως ξένα σύνολα.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Σύγκριση αρνητικών ριζών:</strong> Όπως －3 ＜ －2, έτσι και <strong>－<Radical>5</Radical> ＜ －<Radical>2</Radical></strong> (διότι <Radical>5</Radical> ＞ <Radical>2</Radical>). Με το μείον η φορά της ανισότητας αντιστρέφεται!</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εμπεδώστε τους Πραγματικούς Αριθμούς στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις γνώσεις σας σε 12 διαδραστικές ερωτήσεις και προβλήματα διάταξης με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/03-pragmatikoi-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

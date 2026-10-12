import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Βοηθητική συνάρτηση για κεφαλαία χωρίς τόνους (διατηρώντας το Γ')
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

export default function MononimaPolionimaTheory() {
  // State για το Interactive Lab (Πολυώνυμο P(x) = a*x^2 + b*x + c)
  const [coefA, setCoefA] = useState(2);
  const [coefB, setCoefB] = useState(-3);
  const [coefC, setCoefC] = useState(5);
  const [valX, setValX] = useState(2);

  // Υπολογισμοί εργαστηρίου
  const nonZeroTerms = [coefA !== 0, coefB !== 0, coefC !== 0].filter(Boolean).length;
  
  let polyType = 'Μηδενικό Πολυώνυμο';
  if (nonZeroTerms === 1) polyType = 'Μονώνυμο';
  else if (nonZeroTerms === 2) polyType = 'Διώνυμο';
  else if (nonZeroTerms === 3) polyType = 'Τριώνυμο';

  let polyDegree = 'Χωρίς βαθμό (0)';
  if (coefA !== 0) polyDegree = '2ος βαθμός';
  else if (coefB !== 0) polyDegree = '1ος βαθμός';
  else if (coefC !== 0) polyDegree = '0ός βαθμός (σταθερό)';

  const termAVal = coefA * Math.pow(valX, 2);
  const termBVal = coefB * valX;
  const termCVal = coefC;
  const totalVal = termAVal + termBVal + termCVal;

  return (
    <Layout
      title="Μονώνυμα & Πολυώνυμα | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τα μονώνυμα, τα πολυώνυμα, τον βαθμό, τα διώνυμα και τριώνυμα με διαδραστικό εργαστήριο και λυμένα παραδείγματα."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/10-mononima-polionima-ask"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 1 • Γ' ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Μονώνυμα & Πολυώνυμα
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed mb-6">
              Ανακαλύψτε τα θεμέλια της σχολικής Άλγεβρας: πώς οι αριθμοί ενώνονται με μεταβλητές για να δημιουργήσουν μονώνυμα, πώς ορίζεται ο βαθμός τους και πώς συντίθενται σε διώνυμα, τριώνυμα και πολυώνυμα.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/g-gymnasiou/10-mononima-polionima-ask"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 Μετάβαση στις Ασκήσεις</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* STEP-BY-STEP THEORY CARDS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Τι είναι Μονώνυμο;
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>Μονώνυμο</strong> ονομάζεται η ακέραια αλγεβρική παράσταση στην οποία μεταξύ των μεταβλητών σημειώνεται <em>μόνο η πράξη του πολλαπλασιασμού</em> και οι εκθέτες των μεταβλητών είναι <strong>φυσικοί αριθμοί</strong> (0, 1, 2, 3, ...).
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4">
                <h3 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wider">
                  Ανατομία Μονωνύμου: －5 · x² · y³
                </h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>Συντελεστής:</strong> Ο αριθμητικός παράγοντας (εδώ: <strong>－5</strong>).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><strong>Κύριο μέρος:</strong> Το γινόμενο των μεταβλητών με τους εκθέτες τους (εδώ: <strong>x² · y³</strong>).</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-800 block mb-1">✓ ΕΙΝΑΙ ΜΟΝΩΝΥΜΑ:</span>
                  <span className="text-slate-700 font-mono">7, &nbsp; －3 · x, &nbsp; ½ · x² · y, &nbsp; x³</span>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="font-bold text-rose-800 block mb-1">✗ ΔΕΝ ΕΙΝΑΙ ΜΟΝΩΝΥΜΑ:</span>
                  <span className="text-slate-700 font-mono">3 : x, &nbsp; x ＋ y, &nbsp; 4 · x⁻², &nbsp; √x</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  2
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Βαθμός Μονωνύμου & Σχέσεις
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Ο βαθμός καθορίζει την «ισχύ» του μονωνύμου και εξαρτάται αποκλειστικά από τους εκθέτες των μεταβλητών του:
              </p>
              
              <div className="space-y-3 mb-4 text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Βαθμός ως προς μία μεταβλητή:</span> Ο εκθέτης της συγκεκριμένης μεταβλητής.
                  <div className="text-slate-600 mt-1">Στο <strong>4 · x³ · y²</strong> είναι 3ου βαθμού ως προς x και 2ου ως προς y.</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900">Βαθμός ως προς όλες τις μεταβλητές:</span> Το <strong>άθροισμα</strong> όλων των εκθετών.
                  <div className="text-slate-600 mt-1">Στο <strong>4 · x³ · y²</strong> είναι 3 ＋ 2 ＝ <strong>5ου βαθμού</strong>.</div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 space-y-2">
                <div><strong>Όμοια Μονώνυμα:</strong> Έχουν ακριβώς το ίδιο κύριο μέρος (π.χ. 3 · x² · y και －7 · x² · y).</div>
                <div><strong>Αντίθετα Μονώνυμα:</strong> Είναι όμοια με αντίθετους συντελεστές (π.χ. 5 · x³ και －5 · x³).</div>
                <div><strong>Σταθερό Μονώνυμο:</strong> Κάθε μη μηδενικός αριθμός θεωρείται μονώνυμο μηδενικού (0ού) βαθμού (π.χ. 8 ＝ 8 · x⁰).</div>
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  3
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Πολυώνυμα, Διώνυμα & Τριώνυμα
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>Πολυώνυμο</strong> ονομάζεται κάθε παράσταση που είναι άθροισμα μονωνύμων. Κάθε μονώνυμο που συμμετέχει λέγεται <strong>όρος</strong> του πολυωνύμου.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <div className="font-bold text-indigo-900 mb-1">Διώνυμο</div>
                  <p className="text-xs text-slate-600">Άθροισμα δύο μη ομοίων μονωνύμων.</p>
                  <div className="font-mono font-bold text-indigo-700 mt-2 text-xs">2 · x ＋ 5</div>
                </div>
                <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
                  <div className="font-bold text-indigo-900 mb-1">Τριώνυμο</div>
                  <p className="text-xs text-slate-600">Άθροισμα τριών μη ομοίων μονωνύμων.</p>
                  <div className="font-mono font-bold text-indigo-700 mt-2 text-xs">3 · x² － 4 · x ＋ 7</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Ανηγμένη μορφή:</strong> Όταν σε ένα πολυώνυμο εκτελούμε όλες τις προσθέσεις και αφαιρέσεις μεταξύ των ομοίων όρων (αναγωγή ομοίων όρων), φτάνουμε στην πιο απλή του μορφή όπου δεν υπάρχουν πλέον όμοιοι όροι.
              </div>
            </div>
          </div>

          {/* ΒΗΜΑ 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  4
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Βαθμός Πολυωνύμου & Διάταξη
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Για να βρούμε τον βαθμό ενός πολυωνύμου, πρώτα το φέρνουμε στην <strong>ανηγμένη μορφή</strong> του.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 text-sm text-amber-900">
                <strong>Κανόνας Βαθμού:</strong> Ο βαθμός του ανηγμένου πολυωνύμου ισούται με τον <strong>μεγαλύτερο</strong> από τους βαθμούς των όρων του.
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Φθίνουσα Διάταξη:</strong> Γράφουμε τους όρους από τον μεγαλύτερο εκθέτη προς τον μικρότερο:
                  <div className="font-mono font-bold text-indigo-700 mt-1">P(x) ＝ 5 · x³ － 2 · x² ＋ 7 · x － 9</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Σταθερός Όρος:</strong> Ο όρος που δεν περιέχει μεταβλητή (εδώ το <strong>－9</strong>).
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                🔬 ΕΡΓΑΣΤΗΡΙΟ ΑΛΓΕΒΡΑΣ
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Εξερεύνηση Πολυωνύμου P(x) ＝ a · x² ＋ b · x ＋ c
              </h2>
            </div>
            <div className="text-xs sm:text-sm text-slate-500 max-w-xs">
              Ρυθμίστε τους συντελεστές και δείτε αυτόματα την ταξινόμηση, τον βαθμό και την αριθμητική τιμή.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-slate-700">Συντελεστής δευτεροβάθμιου (a):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">{coefA}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefA}
                  onChange={(e) => setCoefA(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-slate-700">Συντελεστής πρωτοβάθμιου (b):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">{coefB}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefB}
                  onChange={(e) => setCoefB(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-slate-700">Σταθερός όρος (c):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">{coefC}</span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={coefC}
                  onChange={(e) => setCoefC(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-bold text-emerald-700">Τιμή μεταβλητής (x):</label>
                  <span className="font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">{valX}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="1"
                  value={valX}
                  onChange={(e) => setValX(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Visualization & Output */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Formula Card */}
              <div className="p-6 bg-indigo-900 text-white rounded-2xl shadow-inner text-center">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">Μορφή Πολυωνύμου</span>
                <div className="text-2xl sm:text-3xl font-mono font-black tracking-wide">
                  P(x) ＝ {coefA !== 0 ? `${coefA} · x²` : ''} 
                  {coefB > 0 ? (coefA !== 0 ? ` ＋ ${coefB} · x` : `${coefB} · x`) : coefB < 0 ? ` － ${Math.abs(coefB)} · x` : ''} 
                  {coefC > 0 ? (coefA !== 0 || coefB !== 0 ? ` ＋ ${coefC}` : `${coefC}`) : coefC < 0 ? ` － ${Math.abs(coefC)}` : (coefA === 0 && coefB === 0 ? '0' : '')}
                </div>
              </div>

              {/* Status Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Τύπος</span>
                  <span className="text-sm sm:text-base font-bold text-indigo-900">{polyType}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-xs text-slate-500 font-semibold block mb-1">Βαθμός</span>
                  <span className="text-sm sm:text-base font-bold text-indigo-900">{polyDegree}</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-xs text-emerald-700 font-semibold block mb-1">Τιμή P({valX})</span>
                  <span className="text-sm sm:text-base font-black text-emerald-800">{totalVal}</span>
                </div>
              </div>

              {/* Graphical Term Breakdown (SVG) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600 block mb-2 uppercase">Ανάλυση Όρων για x ＝ {valX}:</span>
                <svg viewBox="0 0 500 70" className="w-full h-auto text-xs font-mono">
                  {/* Term 1 */}
                  <rect x="10" y="10" width="145" height="50" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="82" y="32" textAnchor="middle" fill="#312e81" fontWeight="bold">a · x²</text>
                  <text x="82" y="50" textAnchor="middle" fill="#4338ca">{coefA} · ({valX})² ＝ {termAVal}</text>

                  <text x="170" y="40" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">＋</text>

                  {/* Term 2 */}
                  <rect x="185" y="10" width="145" height="50" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="257" y="32" textAnchor="middle" fill="#312e81" fontWeight="bold">b · x</text>
                  <text x="257" y="50" textAnchor="middle" fill="#4338ca">{coefB} · ({valX}) ＝ {termBVal}</text>

                  <text x="345" y="40" textAnchor="middle" fill="#64748b" fontSize="18" fontWeight="bold">＋</text>

                  {/* Term 3 */}
                  <rect x="360" y="10" width="130" height="50" rx="8" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="425" y="32" textAnchor="middle" fill="#312e81" fontWeight="bold">c (σταθερός)</text>
                  <text x="425" y="50" textAnchor="middle" fill="#4338ca">{termCVal}</text>
                </svg>
              </div>

            </div>

          </div>
        </section>

        {/* ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-3 h-8 bg-indigo-600 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Λυμένα Προβλήματα Εφαρμογής
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase">
                    Πρόβλημα 1: Αναγωγή & Βαθμός
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Απλοποίηση και εύρεση βαθμού πολυωνύμου
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Δίνεται το πολυώνυμο: <br />
                  <span className="font-mono font-bold text-slate-800">
                    A(x) ＝ 4 · x³ － 2 · x² ＋ 5 · x － x³ ＋ 6 · x² － 8
                  </span>. <br />
                  Να γραφεί στην ανηγμένη του μορφή, να διαταχθεί κατά τις φθίνουσες δυνάμεις του x και να βρεθεί ο βαθμός και ο σταθερός του όρος.
                </p>

                {/* Πίνακας Οργάνωσης Δεδομένων */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Δύναμη του x</th>
                        <th className="p-2 border-b">Όμοιοι Όροι</th>
                        <th className="p-2 border-b">Αποτέλεσμα Πρόσθεσης</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-mono font-semibold">x³</td>
                        <td className="p-2 font-mono">4 · x³ － 1 · x³</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">3 · x³</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-semibold">x²</td>
                        <td className="p-2 font-mono">－2 · x² ＋ 6 · x²</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">4 · x²</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-semibold">x¹</td>
                        <td className="p-2 font-mono">5 · x</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">5 · x</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Αριθμός (x⁰)</td>
                        <td className="p-2 font-mono">－8</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">－8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Ανηγμένη Μορφή:</strong> <span className="font-mono font-bold text-emerald-900">A(x) ＝ 3 · x³ ＋ 4 · x² ＋ 5 · x － 8</span></div>
                  <div><strong>Βαθμός Πολυωνύμου:</strong> 3ος βαθμός (από τον όρο 3 · x³).</div>
                  <div><strong>Σταθερός Όρος:</strong> －8.</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase">
                    Πρόβλημα 2: Γεωμετρική Εφαρμογή
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Εμβαδόν και Περίμετρος Ορθογωνίου ως Πολυώνυμα
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Ένα ορθογώνιο οικόπεδο έχει μήκος <strong>L ＝ 2 · x ＋ 5</strong> και πλάτος <strong>W ＝ x</strong> (όπου x σε μέτρα, x ＞ 0). <br />
                  α) Να εκφραστεί η περίμετρος Π(x) ως πολυώνυμο. <br />
                  β) Να εκφραστεί το εμβαδόν E(x) ως πολυώνυμο και να βρεθεί ο βαθμός του.
                </p>

                {/* Πίνακας Οργάνωσης Μεγεθών */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Γεωμετρικό Μέγεθος</th>
                        <th className="p-2 border-b">Μαθηματικός Τύπος</th>
                        <th className="p-2 border-b">Υπολογισμός Πολυωνύμου</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-semibold">Περίμετρος Π(x)</td>
                        <td className="p-2 font-mono">2 · (L ＋ W)</td>
                        <td className="p-2 font-mono">2 · (2 · x ＋ 5 ＋ x) ＝ 2 · (3 · x ＋ 5) ＝ <strong>6 · x ＋ 10</strong></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">Εμβαδόν E(x)</td>
                        <td className="p-2 font-mono">L · W</td>
                        <td className="p-2 font-mono">(2 · x ＋ 5) · x ＝ <strong>2 · x² ＋ 5 · x</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Περίμετρος Π(x):</strong> 6 · x ＋ 10 (Διώνυμο 1ου βαθμού).</div>
                  <div><strong>Εμβαδόν E(x):</strong> 2 · x² ＋ 5 · x (Διώνυμο 2ου βαθμού).</div>
                  <div><strong>Ερμηνεία:</strong> Το εμβαδόν εξαρτάται από το τετράγωνο της διάστασης, άρα έχει πάντοτε μεγαλύτερο βαθμό από την περίμετρο!</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* YELLOW ALERT BOX - ΣΥΝΗΘΗ ΛΑΘΗ */}
        <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 mb-12 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-black text-amber-950">
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΕΞΕΤΑΣΕΙΣ")}
              </h3>
              <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Αρνητικοί εκθέτες & ρίζες:</strong> Εκφράσεις όπως <em>3 · x⁻¹</em> ή <em>2 · √x</em> <strong>ΔΕΝ</strong> είναι μονώνυμα. Στα μονώνυμα οι εκθέτες είναι αποκλειστικά μη αρνητικοί ακέραιοι (φυσικοί αριθμοί).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Μεταβλητή στον παρονομαστή:</strong> Η παράσταση <em>4 : x</em> δεν είναι μονώνυμο διότι περιέχει διαίρεση με μεταβλητή. Αντίθετα, η παράσταση <em>x : 4</em> (δηλ. ¼ · x) <strong>είναι</strong> κανονικό μονώνυμο με συντελεστή ¼.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Μηδενικό Μονώνυμο:</strong> Ο αριθμός 0 είναι το μηδενικό μονώνυμο και <strong>δεν έχει βαθμό</strong> (δεν ορίζεται βαθμός).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Βαθμός χωρίς αναγωγή:</strong> Μην υπολογίζετε τον βαθμό πριν κάνετε αναγωγή ομοίων όρων! Στο <em>P(x) ＝ 2 · x³ － 2 · x³ ＋ x ＋ 1</em>, ο όρος x³ εξαφανίζεται (2 － 2 ＝ 0), άρα το πολυώνυμο είναι <strong>1ου βαθμού</strong> και όχι 3ου.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Εμπεδώστε τη Θεωρία στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-sm sm:text-base mb-6">
            Δοκιμάστε τις γνώσεις σας σε 12 δυναμικές διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/10-mononima-polionima-ask"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 font-black rounded-2xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 active:scale-100 text-base"
          >
            <span>🎯 Ξεκινήστε τις Ασκήσεις</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

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

// Επαναχρησιμοποιήσιμο Component Τετραγωνικής Ρίζας (Inline SVG + Vinculum)
function Radical({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle font-mono ${className}`}>
      <svg
        viewBox="0 0 12 24"
        className="w-[0.55em] h-[1.15em] shrink-0 text-current overflow-visible"
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

export default function ProsthesiAfairesiPolionimonTheory() {
  // State για το Interactive Lab
  // P(x) = a1*x^2 + b1*x + c1
  // Q(x) = a2*x^2 + b2*x + c2
  const [op, setOp] = useState('add'); // 'add' ή 'sub'
  const [a1, setA1] = useState(3);
  const [b1, setB1] = useState(-2);
  const [c1, setC1] = useState(5);

  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(4);
  const [c2, setC2] = useState(-3);

  // Υπολογισμοί πράξης
  const signFactor = op === 'add' ? 1 : -1;
  const resA = a1 + signFactor * a2;
  const resB = b1 + signFactor * b2;
  const resC = c1 + signFactor * c2;

  // Βαθμός αποτελέσματος
  let resDegree = '0ός βαθμός (σταθερό)';
  if (resA !== 0) resDegree = '2ος βαθμός';
  else if (resB !== 0) resDegree = '1ος βαθμός';
  else if (resC === 0) resDegree = 'Χωρίς βαθμό (Μηδενικό)';

  const formatSignedTerm = (val, variable = '') => {
    if (val === 0) return '';
    const sign = val > 0 ? '＋' : '－';
    const abs = Math.abs(val);
    const coefStr = variable ? (abs === 1 ? '' : `${abs} · `) : `${abs}`;
    return `${sign} ${coefStr}${variable}`;
  };

  return (
    <Layout
      title="Πρόσθεση & Αφαίρεση Πολυωνύμων | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για την πρόσθεση και αφαίρεση μονωνύμων και πολυωνύμων, αναγωγή ομοίων όρων, απαλοιφή παρενθέσεων και διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all duration-200"
        >
          <span>🎯 {toCleanUppercase("ΑΣΚΗΣΕΙΣ")}</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-32 overflow-x-hidden text-slate-800">
        
        {/* HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-6 sm:p-10 lg:p-12 mb-10 shadow-2xl">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-white/20">
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 11 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white">
              Πρόσθεση & Αφαίρεση Πολυωνύμων
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 font-medium leading-relaxed mb-6">
              Μάθετε πώς εκτελούμε προσθέσεις και αφαιρέσεις μεταξύ μονωνύμων και πολυωνύμων. Κατακτήστε την απαλοιφή παρενθέσεων, τον κανόνα των προσήμων και την αναγωγή ομοίων όρων.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎯 {toCleanUppercase("ΜΕΤΑΒΑΣΗ ΣΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
              </Link>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* 4 MODULAR CARDS ΘΕΩΡΙΑΣ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          
          {/* ΒΗΜΑ 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-lg">
                  1
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Πρόσθεση & Αφαίρεση Μονωνύμων
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Για να προσθέσουμε ή να αφαιρέσουμε μονώνυμα, αυτά πρέπει υποχρεωτικά να είναι <strong>όμοια</strong> (να έχουν δηλαδή ακριβώς το ίδιο κύριο μέρος).
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 text-sm">
                <h3 className="font-bold text-indigo-900 mb-2 uppercase tracking-wider">
                  {toCleanUppercase("ΚΑΝΟΝΑΣ ΟΜΟΙΩΝ ΜΟΝΩΝΥΜΩΝ")}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Προσθέτουμε ή αφαιρούμε τους <strong>συντελεστές</strong> τους και κρατάμε το <strong>ίδιο κύριο μέρος</strong>:
                </p>
                <div className="p-3 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-700 mt-2 text-center text-base">
                  α · xⁿ ＋ β · xⁿ ＝ (α ＋ β) · xⁿ
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <strong>Παράδειγμα 1:</strong> 5 · x² ＋ 3 · x² ＝ (5 ＋ 3) · x² ＝ <strong>8 · x²</strong>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <strong>Παράδειγμα 2:</strong> 4 · x · y － 9 · x · y ＝ (4 － 9) · x · y ＝ <strong>－5 · x · y</strong>
                </div>
                <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200 text-rose-900">
                  <strong>Προσοχή:</strong> 3 · x² ＋ 2 · x <strong>ΔΕΝ</strong> προστίθενται σε ένα μονώνυμο! Παραμένουν ως διώνυμο.
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
                  Αντίθετα Πολυώνυμα
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Δύο πολυώνυμα ονομάζονται <strong>αντίθετα</strong> όταν έχουν άθροισμα ίσο με το μηδενικό πολυώνυμο (0).
              </p>
              
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 text-sm">
                <p className="text-slate-700 leading-relaxed">
                  Το αντίθετο ενός πολυωνύμου <strong>P(x)</strong> συμβολίζεται ως <strong>－P(x)</strong> και προκύπτει αλλάζοντας τα πρόσημα <em>όλων των όρων του</em>.
                </p>
                <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-mono">
                  Αν P(x) ＝ 3 · x² － 5 · x ＋ 2, <br />
                  τότε <strong>－P(x) ＝ －3 · x² ＋ 5 · x － 2</strong>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-emerald-950">
                <strong>Βασική Ιδιότητα:</strong> P(x) ＋ [－P(x)] ＝ <strong>0</strong>. <br />
                Κάθε όρος του P(x) αλληλοεξουδετερώνεται με τον αντίστοιχο αντίθετο όρο του －P(x).
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
                  Κανόνες Απαλοιφής Παρενθέσεων
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Για να προσθέσουμε ή να αφαιρέσουμε δύο πολυώνυμα, τα τοποθετούμε σε παρενθέσεις και εφαρμόζουμε τους θεμελιώδεις κανόνες:
              </p>

              <div className="space-y-3 mb-4 text-sm">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="font-bold text-slate-900 mb-1">1. Πρόσημο « ＋ » μπροστά από παρένθεση:</div>
                  <p className="text-xs text-slate-600 mb-2">
                    Διαγράφουμε την παρένθεση και το « ＋ » και διατηρούμε τα πρόσημα όλων των όρων όπως είναι.
                  </p>
                  <div className="font-mono text-xs font-bold text-indigo-700 bg-white p-2 rounded border border-slate-200">
                    ＋ (2 · x² － 3 · x ＋ 4) ＝ 2 · x² － 3 · x ＋ 4
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="font-bold text-amber-950 mb-1">2. Πρόσημο « － » μπροστά από παρένθεση:</div>
                  <p className="text-xs text-amber-800 mb-2">
                    Διαγράφουμε την παρένθεση και το « － » και <strong>αντιστρέφουμε τα πρόσημα όλων των όρων</strong> μέσα σε αυτήν!
                  </p>
                  <div className="font-mono text-xs font-bold text-amber-900 bg-white p-2 rounded border border-amber-200">
                    － (2 · x² － 3 · x ＋ 4) ＝ －2 · x² ＋ 3 · x － 4
                  </div>
                </div>
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
                  Μεθοδολογία Επίλυσης σε 3 Βήματα
                </h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                Η ολοκληρωμένη διαδικασία πρόσθεσης ή αφαίρεσης πολυωνύμων ακολουθεί πάντοτε τη σειρά:
              </p>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="font-black text-indigo-600">Α.</span>
                  <div>
                    <strong>Τοποθέτηση σε παρενθέσεις:</strong> Γράφουμε την παράσταση <em>P(x) ＋ Q(x)</em> ή <em>P(x) － Q(x)</em> προστατεύοντας κάθε πολυώνυμο.
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="font-black text-indigo-600">Β.</span>
                  <div>
                    <strong>Απαλοιφή παρενθέσεων:</strong> Εφαρμόζουμε προσεκτικά τον κανόνα προσήμων (ειδικά για το πλην).
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <span className="font-black text-indigo-600">Γ.</span>
                  <div>
                    <strong>Αναγωγή ομοίων όρων & διάταξη:</strong> Ομαδοποιούμε τους όρους ανά δύναμη και γράφουμε σε φθίνουσα διάταξη.
                  </div>
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
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΑΛΓΕΒΡΑΣ")}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Εργαστήριο Πράξεων: P(x) {op === 'add' ? '＋' : '－'} Q(x)
              </h2>
            </div>
            {/* Operation Toggle Buttons */}
            <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                onClick={() => setOp('add')}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  op === 'add' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {toCleanUppercase("ΠΡΟΣΘΕΣΗ (＋)")}
              </button>
              <button
                onClick={() => setOp('sub')}
                className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                  op === 'sub' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {toCleanUppercase("ΑΦΑΙΡΕΣΗ (－)")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-3">
                  {toCleanUppercase("ΣΥΝΤΕΛΕΣΤΕΣ ΠΟΛΥΩΝΥΜΟΥ P(x)")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x² (a₁):</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border">{a1}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={a1} onChange={(e) => setA1(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x (b₁):</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border">{b1}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={b1} onChange={(e) => setB1(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Σταθερός c₁:</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border">{c1}</span>
                    </div>
                    <input type="range" min="-5" max="5" step="1" value={c1} onChange={(e) => setC1(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-3">
                  {toCleanUppercase("ΣΥΝΤΕΛΕΣΤΕΣ ΠΟΛΥΩΝΥΜΟΥ Q(x)")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x² (a₂):</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border">{a2}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={a2} onChange={(e) => setA2(parseInt(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x (b₂):</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border">{b2}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={b2} onChange={(e) => setB2(parseInt(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Σταθερός c₂:</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border">{c2}</span>
                    </div>
                    <input type="range" min="-5" max="5" step="1" value={c2} onChange={(e) => setC2(parseInt(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Visualization & Step-by-Step Breakdown */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              
              {/* Formula Expressions */}
              <div className="p-5 bg-indigo-950 text-white rounded-2xl shadow-inner space-y-2">
                <div className="text-xs text-indigo-300 font-mono">
                  P(x) ＝ {a1} · x² {formatSignedTerm(b1, 'x')} {formatSignedTerm(c1)}
                </div>
                <div className="text-xs text-indigo-300 font-mono">
                  Q(x) ＝ {a2} · x² {formatSignedTerm(b2, 'x')} {formatSignedTerm(c2)}
                </div>
                <div className="pt-2 border-t border-indigo-800 text-sm sm:text-base font-black font-mono text-emerald-400">
                  {op === 'add' ? 'P(x) ＋ Q(x)' : 'P(x) － Q(x)'} ＝ ( {a1} · x² {formatSignedTerm(b1, 'x')} {formatSignedTerm(c1)} ) {op === 'add' ? '＋' : '－'} ( {a2} · x² {formatSignedTerm(b2, 'x')} {formatSignedTerm(c2)} )
                </div>
              </div>

              {/* Graphic Grouping & Reduction */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  {toCleanUppercase("ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ ΑΝΑ ΒΑΘΜΟ")}:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  {/* x^2 */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1">Όροι x²</span>
                    <span className="text-slate-800">
                      ({a1} {op === 'add' ? '＋' : '－'} {a2 >= 0 ? a2 : `(${a2})`}) · x²
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-sm">
                      ＝ {resA} · x²
                    </div>
                  </div>

                  {/* x */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1">Όροι x</span>
                    <span className="text-slate-800">
                      ({b1} {op === 'add' ? '＋' : '－'} {b2 >= 0 ? b2 : `(${b2})`}) · x
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-sm">
                      ＝ {resB} · x
                    </div>
                  </div>

                  {/* Constant */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1">Σταθεροί</span>
                    <span className="text-slate-800">
                      {c1} {op === 'add' ? '＋' : '－'} {c2 >= 0 ? c2 : `(${c2})`}
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-sm">
                      ＝ {resC}
                    </div>
                  </div>
                </div>

                {/* Final Result Display */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase block mb-0.5">
                      {toCleanUppercase("ΤΕΛΙΚΟ ΑΝΗΓΜΕΝΟ ΠΟΛΥΩΝΥΜΟ")}:
                    </span>
                    <div className="text-base sm:text-lg font-mono font-black text-emerald-950">
                      {resA !== 0 ? `${resA} · x² ` : ''}
                      {resB !== 0 ? (resA !== 0 ? formatSignedTerm(resB, 'x') : `${resB} · x `) : ''}
                      {resC !== 0 ? (resA !== 0 || resB !== 0 ? ` ${formatSignedTerm(resC)}` : `${resC}`) : (resA === 0 && resB === 0 ? '0' : '')}
                    </div>
                  </div>
                  <div className="shrink-0 px-3 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-emerald-800 font-mono">
                    {resDegree}
                  </div>
                </div>

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
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΑΦΑΙΡΕΣΗ ΜΕ ΠΑΡΕΝΘΕΣΕΙΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Εκτέλεση αφαίρεσης και εύρεση βαθμού
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Δίνονται τα πολυώνυμα: <br />
                  <span className="font-mono font-bold text-slate-800">
                    A(x) ＝ 5 · x³ － 3 · x² ＋ 4 · x － 7
                  </span> και <br />
                  <span className="font-mono font-bold text-slate-800">
                    B(x) ＝ 2 · x³ － 3 · x² － 6 · x ＋ 1
                  </span>. <br />
                  Να υπολογιστεί η διαφορά <strong>A(x) － B(x)</strong>.
                </p>

                {/* Πίνακας Οργάνωσης Δεδομένων */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Όροι ανά βαθμό</th>
                        <th className="p-2 border-b">Αφαίρεση Όρων (A － B)</th>
                        <th className="p-2 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-mono font-semibold">x³</td>
                        <td className="p-2 font-mono">5 · x³ － 2 · x³</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">3 · x³</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-semibold">x²</td>
                        <td className="p-2 font-mono">－3 · x² － (－3 · x²) ＝ －3 · x² ＋ 3 · x²</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">0 · x² (διαγράφεται)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono font-semibold">x¹</td>
                        <td className="p-2 font-mono">4 · x － (－6 · x) ＝ 4 · x ＋ 6 · x</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">10 · x</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">x⁰ (σταθερός)</td>
                        <td className="p-2 font-mono">－7 － (＋1) ＝ －7 － 1</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">－8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Ανηγμένη Μορφή:</strong> <span className="font-mono font-bold text-emerald-900">A(x) － B(x) ＝ 3 · x³ ＋ 10 · x － 8</span></div>
                  <div><strong>Βαθμός Διαφοράς:</strong> 3ος βαθμός.</div>
                  <div><strong>Παρατήρηση:</strong> Οι όροι δευτέρου βαθμού ήταν ίσοι και με την αφαίρεση εξουδετερώθηκαν πλήρως!</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΓΕΩΜΕΤΡΙΚΗ ΠΕΡΙΜΕΤΡΟΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">
                  Περίμετρος τριγώνου και εύρεση άγνωστης πλευράς
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Ένα τρίγωνο έχει συνολική περίμετρο <strong>Π(x) ＝ 7 · x ＋ 12</strong>. Οι δύο πλευρές του έχουν μήκη: <br />
                  <span className="font-mono font-bold text-slate-800">α ＝ 2 · x ＋ 5</span> και <span className="font-mono font-bold text-slate-800">β ＝ 3 · x ＋ 4</span>. <br />
                  Να εκφραστεί το μήκος της τρίτης πλευράς <strong>γ</strong> ως πολυώνυμο του x.
                </p>

                {/* Πίνακας Οργάνωσης Μεγεθών */}
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-b">Στάδιο</th>
                        <th className="p-2 border-b">Αλγεβρική Έκφραση</th>
                        <th className="p-2 border-b">Υπολογισμός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-2 font-semibold">1. Άθροισμα α ＋ β</td>
                        <td className="p-2 font-mono">(2 · x ＋ 5) ＋ (3 · x ＋ 4)</td>
                        <td className="p-2 font-mono"><strong>5 · x ＋ 9</strong></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">2. Τρίτη πλευρά γ</td>
                        <td className="p-2 font-mono">Π(x) － (α ＋ β)</td>
                        <td className="p-2 font-mono">(7 · x ＋ 12) － (5 · x ＋ 9)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-semibold">3. Απαλοιφή & Αναγωγή</td>
                        <td className="p-2 font-mono">7 · x ＋ 12 － 5 · x － 9</td>
                        <td className="p-2 font-mono font-bold text-indigo-700">2 · x ＋ 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <div><strong>Μήκος πλευράς γ:</strong> <span className="font-mono font-bold text-emerald-900">γ ＝ 2 · x ＋ 3</span></div>
                  <div><strong>Έλεγχος:</strong> α ＋ β ＋ γ ＝ (2 · x ＋ 5) ＋ (3 · x ＋ 4) ＋ (2 · x ＋ 3) ＝ 7 · x ＋ 12 (επαληθεύεται!).</div>
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
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΤΟ ΚΛΑΣΙΚΟ ΛΑΘΟΣ ΣΤΗΝ ΑΦΑΙΡΕΣΗ")}
              </h3>
              <ul className="space-y-2 text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Αλλαγή προσήμου σε ΟΛΟΥΣ τους όρους:</strong> Όταν έχουμε <em>－ (3 · x － 5)</em>, το πλην επηρεάζει και το 3 · x και το －5! Το σωστό είναι <strong>－3 · x ＋ 5</strong>. Πολλοί μαθητές αλλάζουν μόνο το πρώτο πρόσημο και γράφουν λανθασμένα <em>－3 · x － 5</em>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Πρόσθεση εκθετών στην πρόσθεση:</strong> Στην πρόσθεση <em>x² ＋ x²</em> το αποτέλεσμα είναι <strong>2 · x²</strong> και <strong>ΟΧΙ</strong> <em>x⁴</em>. Οι εκθέτες προστίθενται μόνο στον πολλαπλασιασμό!</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Μη όμοιοι όροι:</strong> Δεν εκτελούμε πράξεις μεταξύ όρων διαφορετικού βαθμού (π.χ. <em>5 · x² － 2 · x</em> δεν γίνεται <em>3 · x</em>). Παραμένουν ως έχουν.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Ρίζες και μεταβλητές:</strong> Μονώνυμα όπως <em>3 · <Radical>x</Radical></em> δεν είναι πολυωνυμικοί όροι και δεν αναγάγονται με πολυώνυμα.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            Εμπεδώστε την Πρόσθεση & Αφαίρεση στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-sm sm:text-base mb-6">
            Δοκιμάστε τις ικανότητές σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση και πλήρη βήματα επίλυσης.
          </p>
          <Link
            href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 font-black rounded-2xl shadow-lg hover:bg-emerald-50 transition-all hover:scale-105 active:scale-100 text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

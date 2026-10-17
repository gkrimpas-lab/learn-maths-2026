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
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 11 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Πρόσθεση & Αφαίρεση Πολυωνύμων
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Μάθετε πώς εκτελούμε προσθέσεις και αφαιρέσεις μεταξύ μονωνύμων και πολυωνύμων. Κατακτήστε την απαλοιφή παρενθέσεων, τον κανόνα των προσήμων και την αναγωγή ομοίων όρων.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
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
                  Πρόσθεση & Αφαίρεση Μονωνύμων
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για να προσθέσουμε ή να αφαιρέσουμε μονώνυμα, αυτά πρέπει υποχρεωτικά να είναι <strong>όμοια</strong> (να έχουν δηλαδή ακριβώς το ίδιο κύριο μέρος).
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-xs sm:text-sm">
                <h3 className="font-bold text-indigo-900 mb-1.5 uppercase tracking-wider">
                  {toCleanUppercase("ΚΑΝΟΝΑΣ ΟΜΟΙΩΝ ΜΟΝΩΝΥΜΩΝ")}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Προσθέτουμε ή αφαιρούμε τους <strong>συντελεστές</strong> τους και κρατάμε το <strong>ίδιο κύριο μέρος</strong>:
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-indigo-700 mt-2 text-center text-sm sm:text-base">
                  α · xⁿ ＋ β · xⁿ ＝ (α ＋ β) · xⁿ
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <strong>Παράδειγμα 1:</strong> 5 · x² ＋ 3 · x² ＝ (5 ＋ 3) · x² ＝ <strong>8 · x²</strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                  <strong>Παράδειγμα 2:</strong> 4 · x · y － 9 · x · y ＝ (4 － 9) · x · y ＝ <strong>－5 · x · y</strong>
                </div>
                <div className="p-2.5 sm:p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                  <strong>Προσοχή:</strong> 3 · x² ＋ 2 · x <strong>ΔΕΝ</strong> προστίθενται σε ένα ενιαίο μονώνυμο! Παραμένουν ως διώνυμο.
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
                  Αντίθετα Πολυώνυμα
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Δύο πολυώνυμα ονομάζονται <strong>αντίθετα</strong> όταν έχουν άθροισμα ίσο με το μηδενικό πολυώνυμο (0).
              </p>
              
              <div className="bg-slate-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 mb-3 text-xs sm:text-sm">
                <p className="text-slate-700 leading-relaxed">
                  Το αντίθετο ενός πολυωνύμου <strong>P(x)</strong> συμβολίζεται ως <strong>－P(x)</strong> και προκύπτει αλλάζοντας τα πρόσημα <em>όλων των όρων του</em>.
                </p>
                <div className="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-mono">
                  Αν P(x) ＝ 3 · x² － 5 · x ＋ 2, <br />
                  τότε <strong>－P(x) ＝ －3 · x² ＋ 5 · x － 2</strong>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950">
                <strong>Βασική Ιδιότητα:</strong> P(x) ＋ [－P(x)] ＝ <strong>0</strong>. <br />
                Κάθε όρος του P(x) αλληλοεξουδετερώνεται με τον αντίστοιχο αντίθετο όρο του －P(x).
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
                  Κανόνες Απαλοιφής Παρενθέσεων
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Για να προσθέσουμε ή να αφαιρέσουμε δύο πολυώνυμα, τα τοποθετούμε σε παρενθέσεις και εφαρμόζουμε τους θεμελιώδεις κανόνες:
              </p>

              <div className="space-y-2.5 mb-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl">
                  <div className="font-bold text-slate-900 mb-1">1. Πρόσημο « ＋ » μπροστά από παρένθεση:</div>
                  <p className="text-xs text-slate-600 mb-1.5">
                    Διαγράφουμε την παρένθεση και το « ＋ » και διατηρούμε τα πρόσημα όλων των όρων όπως είναι.
                  </p>
                  <div className="font-mono text-xs font-bold text-indigo-700 bg-white p-2 rounded border border-slate-200">
                    ＋ (2 · x² － 3 · x ＋ 4) ＝ 2 · x² － 3 · x ＋ 4
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-2xl">
                  <div className="font-bold text-amber-950 mb-1">2. Πρόσημο « － » μπροστά από παρένθεση:</div>
                  <p className="text-xs text-amber-800 mb-1.5">
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
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm sm:text-lg shrink-0">
                  4
                </span>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">
                  Μεθοδολογία Επίλυσης σε 3 Βήματα
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Η ολοκληρωμένη διαδικασία πρόσθεσης ή αφαίρεσης πολυωνύμων ακολουθεί πάντοτε τη σειρά:
              </p>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="font-black text-indigo-600">Α.</span>
                  <div>
                    <strong>Τοποθέτηση σε παρενθέσεις:</strong> Γράφουμε την παράσταση <em>P(x) ＋ Q(x)</em> ή <em>P(x) － Q(x)</em> προστατεύοντας κάθε πολυώνυμο.
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="font-black text-indigo-600">Β.</span>
                  <div>
                    <strong>Απαλοιφή παρενθέσεων:</strong> Εφαρμόζουμε προσεκτικά τον κανόνα προσήμων (ειδικά για το μείον).
                  </div>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
                  <span className="font-black text-indigo-600">Γ.</span>
                  <div>
                    <strong>Αναγωγή ομοίων όρων & διάταξη:</strong> Ομαδοποιούμε τους όρους ανά δύναμη και γράφουμε σε φθίνουσα κανονική μορφή.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - 100% RESPONSIVE NO-SCROLL */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΑΛΓΕΒΡΑΣ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Εργαστήριο Πράξεων: P(x) {op === 'add' ? '＋' : '－'} Q(x)
              </h2>
            </div>
            {/* Operation Toggle Buttons */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
              <button
                onClick={() => setOp('add')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  op === 'add' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {toCleanUppercase("ΠΡΟΣΘΕΣΗ (＋)")}
              </button>
              <button
                onClick={() => setOp('sub')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  op === 'sub' ? 'bg-indigo-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {toCleanUppercase("ΑΦΑΙΡΕΣΗ (－)")}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2.5">
                  {toCleanUppercase("ΣΥΝΤΕΛΕΣΤΕΣ ΠΟΛΥΩΝΥΜΟΥ P(x)")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x² (a₁):</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border text-xs sm:text-sm">{a1}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={a1} onChange={(e) => setA1(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x (b₁):</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border text-xs sm:text-sm">{b1}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={b1} onChange={(e) => setB1(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Σταθερός c₁:</span>
                      <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border text-xs sm:text-sm">{c1}</span>
                    </div>
                    <input type="range" min="-5" max="5" step="1" value={c1} onChange={(e) => setC1(parseInt(e.target.value))} className="w-full accent-indigo-600 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2.5">
                  {toCleanUppercase("ΣΥΝΤΕΛΕΣΤΕΣ ΠΟΛΥΩΝΥΜΟΥ Q(x)")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x² (a₂):</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border text-xs sm:text-sm">{a2}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={a2} onChange={(e) => setA2(parseInt(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Όρος x (b₂):</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border text-xs sm:text-sm">{b2}</span>
                    </div>
                    <input type="range" min="-4" max="4" step="1" value={b2} onChange={(e) => setB2(parseInt(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Σταθερός c₂:</span>
                      <span className="font-mono font-bold text-blue-600 bg-white px-2 py-0.5 rounded border text-xs sm:text-sm">{c2}</span>
                    </div>
                    <input type="range" min="-5" max="5" step="1" value={c2} onChange={(e) => setC2(parseInt(e.target.value))} className="w-full accent-blue-600 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner space-y-2 w-full">
                <div className="text-xs text-indigo-300 font-mono break-words">
                  P(x) ＝ {a1} · x² {formatSignedTerm(b1, 'x')} {formatSignedTerm(c1)}
                </div>
                <div className="text-xs text-indigo-300 font-mono break-words">
                  Q(x) ＝ {a2} · x² {formatSignedTerm(b2, 'x')} {formatSignedTerm(c2)}
                </div>
                <div className="pt-2 border-t border-indigo-800 text-xs sm:text-sm lg:text-base font-black font-mono text-emerald-400 break-words leading-relaxed">
                  {op === 'add' ? 'P(x) ＋ Q(x)' : 'P(x) － Q(x)'} ＝ ( {a1} · x² {formatSignedTerm(b1, 'x')} {formatSignedTerm(c1)} ) {op === 'add' ? '＋' : '－'} ( {a2} · x² {formatSignedTerm(b2, 'x')} {formatSignedTerm(c2)} )
                </div>
              </div>

              {/* Graphic Grouping & Reduction */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5 w-full">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  {toCleanUppercase("ΑΝΑΓΩΓΗ ΟΜΟΙΩΝ ΟΡΩΝ ΑΝΑ ΒΑΘΜΟ")}:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs font-mono">
                  {/* x^2 */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1 text-[11px]">Όροι x²</span>
                    <span className="text-slate-800 break-words">
                      ({a1} {op === 'add' ? '＋' : '－'} {a2 >= 0 ? a2 : `(${a2})`}) · x²
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-xs sm:text-sm">
                      ＝ {resA} · x²
                    </div>
                  </div>

                  {/* x */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1 text-[11px]">Όροι x</span>
                    <span className="text-slate-800 break-words">
                      ({b1} {op === 'add' ? '＋' : '－'} {b2 >= 0 ? b2 : `(${b2})`}) · x
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-xs sm:text-sm">
                      ＝ {resB} · x
                    </div>
                  </div>

                  {/* Constant */}
                  <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200">
                    <span className="font-bold text-slate-500 block mb-1 text-[11px]">Σταθεροί</span>
                    <span className="text-slate-800 break-words">
                      {c1} {op === 'add' ? '＋' : '－'} {c2 >= 0 ? c2 : `(${c2})`}
                    </span>
                    <div className="mt-1 font-bold text-indigo-700 text-xs sm:text-sm">
                      ＝ {resC}
                    </div>
                  </div>
                </div>

                {/* Final Result Display */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase block mb-0.5">
                      {toCleanUppercase("ΤΕΛΙΚΟ ΑΝΗΓΜΕΝΟ ΠΟΛΥΩΝΥΜΟ")}:
                    </span>
                    <div className="text-sm sm:text-base lg:text-lg font-mono font-black text-emerald-950 break-words">
                      {resA !== 0 ? `${resA} · x² ` : ''}
                      {resB !== 0 ? (resA !== 0 ? formatSignedTerm(resB, 'x') : `${resB} · x `) : ''}
                      {resC !== 0 ? (resA !== 0 || resB !== 0 ? ` ${formatSignedTerm(resC)}` : `${resC}`) : (resA === 0 && resB === 0 ? '0' : '')}
                    </div>
                  </div>
                  <div className="shrink-0 px-2.5 py-1 bg-white rounded-lg border border-emerald-300 text-xs font-bold text-emerald-800 font-mono">
                    {resDegree}
                  </div>
                </div>

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
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΑΦΑΙΡΕΣΗ ΜΕ ΠΑΡΕΝΘΕΣΕΙΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Εκτέλεση αφαίρεσης και εύρεση βαθμού
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Δίνονται τα πολυώνυμα: <br />
                  <span className="font-mono font-bold text-slate-800 break-words">
                    A(x) ＝ 5 · x³ － 3 · x² ＋ 4 · x － 7
                  </span> και <br />
                  <span className="font-mono font-bold text-slate-800 break-words">
                    B(x) ＝ 2 · x³ － 3 · x² － 6 · x ＋ 1
                  </span>. <br />
                  Να υπολογιστεί η διαφορά <strong>A(x) － B(x)</strong>.
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Όροι</th>
                        <th className="p-2 sm:p-2.5 border-b">Αφαίρεση (A － B)</th>
                        <th className="p-2 sm:p-2.5 border-b">Αποτέλεσμα</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x³</td>
                        <td className="p-2 sm:p-2.5">5 · x³ － 2 · x³</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">3 · x³</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x²</td>
                        <td className="p-2 sm:p-2.5">－3 · x² － (－3 · x²) ＝ －3 · x² ＋ 3 · x²</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">0 · x² (διαγράφεται)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x¹</td>
                        <td className="p-2 sm:p-2.5">4 · x － (－6 · x) ＝ 4 · x ＋ 6 · x</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">10 · x</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">x⁰</td>
                        <td className="p-2 sm:p-2.5">－7 － (＋1) ＝ －7 － 1</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">－8</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Ανηγμένη Μορφή:</strong> <span className="font-mono font-bold text-emerald-900">A(x) － B(x) ＝ 3 · x³ ＋ 10 · x － 8</span></div>
                  <div><strong>Βαθμός Διαφοράς:</strong> 3ος βαθμός.</div>
                  <div><strong>Παρατήρηση:</strong> Οι όροι δευτέρου βαθμού ήταν ίσοι και εξουδετερώθηκαν πλήρως!</div>
                </div>
              </div>
            </div>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] sm:text-xs rounded-full uppercase">
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 2: ΓΕΩΜΕΤΡΙΚΗ ΠΕΡΙΜΕΤΡΟΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Περίμετρος τριγώνου και εύρεση άγνωστης πλευράς
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Ένα τρίγωνο έχει συνολική περίμετρο <strong>Π(x) ＝ 7 · x ＋ 12</strong>. Οι δύο πλευρές του έχουν μήκη: <br />
                  <span className="font-mono font-bold text-slate-800">α ＝ 2 · x ＋ 5</span> και <span className="font-mono font-bold text-slate-800">β ＝ 3 · x ＋ 4</span>. <br />
                  Να εκφραστεί το μήκος της τρίτης πλευράς <strong>γ</strong> ως πολυώνυμο του x.
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Στάδιο</th>
                        <th className="p-2 sm:p-2.5 border-b">Αλγεβρική Έκφραση</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1. Άθροισμα α ＋ β</td>
                        <td className="p-2 sm:p-2.5">(2 · x ＋ 5) ＋ (3 · x ＋ 4)</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">5 · x ＋ 9</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2. Τρίτη πλευρά γ</td>
                        <td className="p-2 sm:p-2.5">Π(x) － (α ＋ β)</td>
                        <td className="p-2 sm:p-2.5">(7 · x ＋ 12) － (5 · x ＋ 9)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3. Απαλοιφή & Αναγωγή</td>
                        <td className="p-2 sm:p-2.5">7 · x ＋ 12 － 5 · x － 9</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2 · x ＋ 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div><strong>Μήκος πλευράς γ:</strong> <span className="font-mono font-bold text-emerald-900">γ ＝ 2 · x ＋ 3</span>.</div>
                  <div><strong>Έλεγχος:</strong> α ＋ β ＋ γ ＝ (2 · x ＋ 5) ＋ (3 · x ＋ 4) ＋ (2 · x ＋ 3) ＝ 7 · x ＋ 12 (επαληθεύεται!).</div>
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
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΤΟ ΚΛΑΣΙΚΟ ΛΑΘΟΣ ΣΤΗΝ ΑΦΑΙΡΕΣΗ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
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
                  <span className="inline-flex flex-wrap items-center gap-1">
                    <strong>Ρίζες και μεταβλητές:</strong> Μονώνυμα όπως 3 · <Radical>x</Radical> δεν είναι πολυωνυμικοί όροι και δεν αναγάγονται με πολυώνυμα.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εμπεδώστε την Πρόσθεση & Αφαίρεση στην Πράξη!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις ικανότητές σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση και πλήρη βήματα επίλυσης.
          </p>
          <Link
            href="/g-gymnasiou/11-prosthesi-afairesi-polionimon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

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

export default function PrakseisPragmatikonTheory() {
  // State για το διαδραστικό εργαστήριο: Υπολογισμός k * (a*√2 + b)
  const [factorK, setFactorK] = useState(2);
  const [coefA, setCoefA] = useState(3);
  const [termB, setTermB] = useState(-4);

  // Επιμεριστική ιδιότητα: k*(a√2 + b) = (k*a)√2 + (k*b)
  const resA = factorK * coefA;
  const resB = factorK * termB;

  return (
    <Layout
      title="Πράξεις Πραγματικών Αριθμών | Θεωρία Γ' Γυμνασίου"
      description="Αναλυτική θεωρία για τις πράξεις των πραγματικών αριθμών, τις ιδιότητες (επιμεριστική, αντιμεταθετική), τους κανόνες προσήμων και διαδραστικό εργαστήριο."
      backUrl="/g-gymnasiou"
      backText="Γ' Γυμνασίου"
      showAds={true}
      actionButton={
        <Link
          href="/g-gymnasiou/04-prakseis-pragmatikon-ask"
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
              {toCleanUppercase("ΚΕΦΑΛΑΙΟ 4 •")} Γ' {toCleanUppercase("ΓΥΜΝΑΣΙΟΥ")}
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3 text-white leading-tight">
              Πράξεις & Ιδιότητες Πραγματικών Αριθμών
            </h1>
            <p className="text-xs sm:text-base lg:text-lg text-indigo-100 font-medium leading-relaxed mb-5 max-w-3xl">
              Οι τέσσερις θεμελιώδεις πράξεις επεκτείνονται σε ολόκληρο το σύνολο των πραγματικών αριθμών. Κατακτήστε την επιμεριστική ιδιότητα, τον χειρισμό ριζών και κλασμάτων και τους ακριβείς κανόνες απαλοιφής παρενθέσεων.
            </p>
            <div>
              <Link
                href="/g-gymnasiou/04-prakseis-pragmatikon-ask"
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
                  Πρόσθεση & Αφαίρεση στο ℝ
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Η πρόσθεση και η αφαίρεση ισχύουν για όλους τους πραγματικούς αριθμούς (ρητούς και άρρητους) με τις ίδιες βασικές ιδιότητες:
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Αντιμεταθετική:</strong> α ＋ β ＝ β ＋ α
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Ουδέτερο Στοιχείο:</strong> α ＋ 0 ＝ α
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Αντίθετος Αριθμός:</strong> α ＋ (－α) ＝ 0
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs sm:text-sm text-indigo-950">
                <span className="font-bold block mb-1">Πράξεις με Ρίζες:</span>
                Προσθέτουμε ή αφαιρούμε μόνο <strong>όμοιες ρίζες</strong>:
                <div className="font-mono font-bold text-indigo-800 mt-1 inline-flex flex-wrap items-center gap-1.5">
                  <span>3 · <Radical>2</Radical> ＋ 5 · <Radical>2</Radical> ＝ (3 ＋ 5) · <Radical>2</Radical> ＝ 8 · <Radical>2</Radical></span>
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
                  Πολλαπλασιασμός & Διαίρεση στο ℝ
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Στον πολλαπλασιασμό των πραγματικών αριθμών ισχύουν θεμελιώδεις κανόνες και ιδιότητες:
              </p>
              
              <div className="space-y-2 mb-3 text-xs sm:text-sm text-slate-700">
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Ουδέτερο Στοιχείο:</strong> α · 1 ＝ α
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-1.5">
                  <span><strong>Αντίστροφος (α ≠ 0):</strong></span>
                  <span className="font-mono font-bold text-indigo-900 inline-flex items-center gap-1">
                    α · <Frac num="1" den="α" /> ＝ 1
                  </span>
                </div>
                <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>Ιδιότητα Μηδενισμού:</strong> α · β ＝ 0 &nbsp;⇔&nbsp; α ＝ 0 ή β ＝ 0
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-emerald-950">
                <strong>Διαίρεση με Κλάσμα:</strong> <br />
                Η διαίρεση με αριθμό β ≠ 0 ισοδυναμεί με πολλαπλασιασμό επί τον αντίστροφό του: <br />
                <span className="font-mono font-bold mt-1 inline-flex items-center gap-1">
                  α : β ＝ α · <Frac num="1" den="β" /> ＝ <Frac num="α" den="β" />
                </span>
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
                  Η Επιμεριστική Ιδιότητα
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Η <strong>επιμεριστική ιδιότητα</strong> συνδέει τον πολλαπλασιασμό με την πρόσθεση και την αφαίρεση:
              </p>

              <div className="bg-indigo-900 text-white rounded-xl sm:rounded-2xl p-4 mb-3 text-center shadow-inner">
                <div className="font-mono text-sm sm:text-lg font-black tracking-wide">
                  α · (β ＋ γ) ＝ α · β ＋ α · γ
                </div>
                <div className="font-mono text-sm sm:text-lg font-black tracking-wide mt-1 text-indigo-200">
                  α · (β － γ) ＝ α · β － α · γ
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Ανάπτυγμα (από αριστερά προς δεξιά):</strong>
                  <div className="font-mono text-xs mt-1 text-indigo-800">
                    2 · (x ＋ 5) ＝ 2 · x ＋ 2 · 5 ＝ 2 · x ＋ 10
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <strong>Κοινός Παράγοντας (από δεξιά προς αριστερά):</strong>
                  <div className="font-mono text-xs mt-1 text-indigo-800 inline-flex flex-wrap items-center gap-1">
                    <span>4 · <Radical>3</Radical> ＋ 6 · <Radical>3</Radical> ＝ (4 ＋ 6) · <Radical>3</Radical> ＝ 10 · <Radical>3</Radical></span>
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
                  Κανόνες Προσήμων & Παρενθέσεις
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                Οι απαράβατοι κανόνες για πρόσημα σε γινόμενα, πηλίκα και παρενθέσεις:
              </p>

              <div className="space-y-2 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">Γινόμενο & Πηλίκο:</span>
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px] sm:text-xs text-slate-700">
                    <div>(＋) · (＋) ＝ ＋</div>
                    <div>(－) · (－) ＝ ＋</div>
                    <div>(＋) · (－) ＝ －</div>
                    <div>(－) · (＋) ＝ －</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-indigo-900 block mb-1">Απαλοιφή Παρενθέσεων:</span>
                  <ul className="space-y-1 text-slate-700 text-xs">
                    <li>• <strong>＋(α － β) ＝ α － β:</strong> Τα πρόσημα διατηρούνται.</li>
                    <li>• <strong>－(α － β) ＝ －α ＋ β:</strong> Τα πρόσημα <em>όλων των όρων</em> αντιστρέφονται!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* INTERACTIVE LAB - 100% RESPONSIVE XΩΡΙΣ SCROLL */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200 shadow-md mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-5 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
                🔬 {toCleanUppercase("ΕΡΓΑΣΤΗΡΙΟ ΠΡΑΞΕΩΝ")}
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900">
                Εφαρμογή Επιμεριστικής Ιδιότητας: k · (a · <Radical>2</Radical> ＋ b)
              </h2>
            </div>
            <div className="text-xs text-slate-500 max-w-xs">
              Ρυθμίστε τους συντελεστές και δείτε βήμα-προς-βήμα την ανάπτυξη και τους κανόνες προσήμων.
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Sliders & Controls */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 w-full">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Εξωτερικός Πολλαπλασιαστής (k):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{factorK}</span>
                </div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="1"
                  value={factorK}
                  onChange={(e) => setFactorK(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Συντελεστής ρίζας (a):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{coefA}</span>
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
                  <label className="text-xs sm:text-sm font-bold text-slate-700">Σταθερός όρος (b):</label>
                  <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs sm:text-sm">{termB}</span>
                </div>
                <input
                  type="range"
                  min="-6"
                  max="6"
                  step="1"
                  value={termB}
                  onChange={(e) => setTermB(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Dynamic Output Card */}
            <div className="lg:col-span-7 flex flex-col gap-4 w-full">
              
              <div className="p-4 sm:p-6 bg-indigo-950 text-white rounded-2xl shadow-inner text-center w-full">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-indigo-300 font-bold block mb-2">
                  {toCleanUppercase("ΑΡΧΙΚΗ ΜΟΡΦΗ ΠΑΡΑΣΤΑΣΗΣ")}
                </span>
                <div className="text-lg sm:text-2xl lg:text-3xl font-mono font-black flex flex-wrap items-center justify-center gap-2 py-1">
                  <span>{factorK} · ( {coefA} · <Radical>2</Radical> {termB >= 0 ? `＋ ${termB}` : `－ ${Math.abs(termB)}`} )</span>
                </div>
              </div>

              {/* Βήμα Επιμερισμού */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 w-full space-y-3">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  {toCleanUppercase("ΑΝΑΛΥΤΙΚΑ ΒΗΜΑΤΑ ΕΠΙΜΕΡΙΣΜΟΥ")}:
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-1">1ο Γινόμενο (Ριζικός όρος):</span>
                    <span className="font-bold text-indigo-900 inline-flex items-center gap-1">
                      {factorK} · ({coefA} · <Radical>2</Radical>) ＝ {resA} · <Radical>2</Radical>
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] mb-1">2ο Γινόμενο (Σταθερός όρος):</span>
                    <span className="font-bold text-indigo-900">
                      {factorK} · ({termB >= 0 ? `＋${termB}` : termB}) ＝ {resB >= 0 ? `＋${resB}` : resB}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-emerald-900 uppercase text-xs">
                    {toCleanUppercase("ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ")}:
                  </span>
                  <span className="font-mono font-black text-emerald-950 text-base sm:text-lg inline-flex items-center gap-1">
                    {resA !== 0 ? (
                      <>
                        <span>{resA} · <Radical>2</Radical></span>
                        {resB > 0 ? ` ＋ ${resB}` : resB < 0 ? ` － ${Math.abs(resB)}` : ''}
                      </>
                    ) : (
                      resB
                    )}
                  </span>
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
                    {toCleanUppercase("ΠΡΟΒΛΗΜΑ 1: ΑΠΛΟΠΟΙΗΣΗ ΠΑΡΑΣΤΑΣΗΣ")}
                  </span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 mb-2 leading-snug">
                  Αναγωγή ομοίων ριζών και απαλοιφή
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Να υπολογιστεί η αριθμητική τιμή της παράστασης: <br />
                  <span className="font-mono font-bold text-slate-900 inline-flex flex-wrap items-center gap-1 mt-1">
                    Α ＝ 3 · (2 · <Radical>3</Radical> － 1) － 4 · (<Radical>3</Radical> ＋ 2) ＋ 11
                  </span>
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[280px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Βήμα</th>
                        <th className="p-2 sm:p-2.5 border-b">Πράξη</th>
                        <th className="p-2 sm:p-2.5 border-b">Έκφραση</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs font-mono">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">1. Επιμεριστική</td>
                        <td className="p-2 sm:p-2.5 font-sans">Πολλαπλασιασμός όρων</td>
                        <td className="p-2 sm:p-2.5">6·√3 － 3 － 4·√3 － 8 ＋ 11</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">2. Ομαδοποίηση</td>
                        <td className="p-2 sm:p-2.5 font-sans">Ρίζες και αριθμοί</td>
                        <td className="p-2 sm:p-2.5">(6 － 4)·√3 ＋ (－3 － 8 ＋ 11)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-sans font-semibold">3. Τελικό</td>
                        <td className="p-2 sm:p-2.5 font-sans">Αναγωγή</td>
                        <td className="p-2 sm:p-2.5 font-bold text-indigo-700">2 · √3 ＋ 0 ＝ 2·√3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>Τελική Τιμή:</strong> <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1">Α ＝ 2 · <Radical>3</Radical></span> (άρρητος).
                  </div>
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
                  Περίμετρος ορθογωνίου με πλευρές άρρητους
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                  Ένα ορθογώνιο οικόπεδο έχει μήκος <strong>L ＝ 4 · <Radical>2</Radical> ＋ 3</strong> μέτρα και πλάτος <strong>W ＝ <Radical>2</Radical> ＋ 1</strong> μέτρα. <br />
                  Να υπολογιστεί η περίμετρος Π του οικοπέδου σε απλοποιημένη μορφή.
                </p>

                {/* Πίνακας με ασφαλές scroll */}
                <div className="overflow-x-auto -mx-1 sm:mx-0 mb-4 rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left min-w-[290px]">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 sm:p-2.5 border-b">Μέγεθος</th>
                        <th className="p-2 sm:p-2.5 border-b">Τύπος</th>
                        <th className="p-2 sm:p-2.5 border-b">Υπολογισμός</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px] sm:text-xs">
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">Ημιπερίμετρος (L ＋ W)</td>
                        <td className="p-2 sm:p-2.5 font-mono">L ＋ W</td>
                        <td className="p-2 sm:p-2.5 font-mono">(4·√2 ＋ 3) ＋ (√2 ＋ 1) ＝ 5·√2 ＋ 4</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">Περίμετρος Π</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · (L ＋ W)</td>
                        <td className="p-2 sm:p-2.5 font-mono">2 · (5·√2 ＋ 4)</td>
                      </tr>
                      <tr>
                        <td className="p-2 sm:p-2.5 font-semibold">Επιμεριστική</td>
                        <td className="p-2 sm:p-2.5 font-mono">2·(5·√2) ＋ 2·4</td>
                        <td className="p-2 sm:p-2.5 font-mono font-bold text-indigo-700">10·√2 ＋ 8 m</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 space-y-1">
                  <div className="flex flex-wrap items-center gap-1">
                    <strong>Περίμετρος:</strong> <span className="font-mono font-bold text-emerald-900 inline-flex items-center gap-1">Π ＝ 10 · <Radical>2</Radical> ＋ 8 m</span>.
                  </div>
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
                {toCleanUppercase("ΠΡΟΣΟΧΗ: ΣΥΝΗΘΗ ΛΑΘΗ ΣΤΙΣ ΠΡΑΞΕΙΣ")}
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-900 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Δεν προσθέτουμε διαφορετικές ρίζες:</strong> Η έκφραση <Radical>2</Radical> ＋ <Radical>3</Radical> <strong>ΔΕΝ</strong> ισούται με <Radical>5</Radical>. Παραμένει ως έχει, ακριβώς όπως το x ＋ y.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Διαίρεση με το μηδέν:</strong> Το κλάσμα <Frac num="α" den="0" /> δεν ορίζεται ποτέ, για κανέναν πραγματικό αριθμό α.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span><strong>Απαλοιφή παρένθεσης με μείον:</strong> Στην έκφραση 5 － (x － 2), το μείον αλλάζει και το πρόσημο του 2: 5 － x ＋ 2 ＝ 7 － x.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* BOTTOM CALLOUT BANNER */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white text-center shadow-xl flex flex-col items-center justify-center">
          <h2 className="text-xl sm:text-3xl font-black mb-2 sm:mb-3 leading-snug">
            Εξασκηθείτε στις Πράξεις των Πραγματικών!
          </h2>
          <p className="text-emerald-100 max-w-2xl text-xs sm:text-base mb-5 sm:mb-6">
            Δοκιμάστε τις δυνάμεις σας σε 12 διαδραστικές ερωτήσεις και αυτούσια προβλήματα με άμεση ανατροφοδότηση.
          </p>
          <Link
            href="/g-gymnasiou/04-prakseis-pragmatikon-ask"
            className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 bg-white text-emerald-800 font-black rounded-xl sm:rounded-2xl shadow-lg hover:bg-emerald-50 transition-all text-xs sm:text-base"
          >
            <span>🎯 {toCleanUppercase("ΞΕΚΙΝΗΣΤΕ ΤΙΣ ΑΣΚΗΣΕΙΣ")}</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

// pages/st-dimotikou/30-diairesi-klasmaton.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Κεντρικη μεταβλητη ρυθμισης μεγιστων τιμων
const MAX_LIMIT = 100;

// Συναρτηση αφαιρεσης τονων για κεφαλαια (εξαιρειται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποιηση αριθμων με ελληνικο locale και defensive checks
function formatNum(num) {
  if (num === null || num === undefined || isNaN(Number(num))) return '0';
  return Number(num).toLocaleString('el-GR');
}

const PRESETS_FF = [
  { nA: 3, dA: 4, nB: 1, dB: 4, label: '3/4 : 1/4 ➔ 3 (Χωράει 3 φορές)' },
  { nA: 1, dA: 2, nB: 1, dB: 6, label: '1/2 : 1/6 ➔ 3' },
  { nA: 2, dA: 3, nB: 3, dB: 4, label: '2/3 : 3/4 ➔ 8/9' },
  { nA: 4, dA: 5, nB: 2, dB: 5, label: '4/5 : 2/5 ➔ 2' }
];

const PRESETS_FN = [
  { nA: 3, dA: 4, nB: 2, label: '3/4 : 2 ➔ 3/8 (Μοιρασιά)' },
  { nA: 4, dA: 5, nB: 2, label: '4/5 : 2 ➔ 2/5' },
  { nA: 1, dA: 2, nB: 3, label: '1/2 : 3 ➔ 1/6' },
  { nA: 5, dA: 6, nB: 5, label: '5/6 : 5 ➔ 1/6' }
];

// Βοηθητικη συναρτηση για ευρεση Μεγιστου Κοινου Διαιρετη (ΜΚΔ)
function findGCD(a, b) {
  let x = Math.abs(a || 0);
  let y = Math.abs(b || 0);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export default function DiairesiKlasmatonPage() {
  // Mode: 'fraction-fraction' (κλασμα με κλασμα) η 'fraction-number' (κλασμα με ακεραιο)
  const [mode, setMode] = useState('fraction-fraction');

  // Κατασταση για Κλασμα Α (Διαιρετεος)
  const [numA, setNumA] = useState(3);
  const [denA, setDenA] = useState(4);

  // Κατασταση για Κλασμα Β (Διαιρετης) - Η Ακεραιο Β
  const [numB, setNumB] = useState(1);
  const [denB, setDenB] = useState(4);

  // Ελεγχος εισαγωγης κειμενου
  const handleNumAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumA(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumA(n);
  };

  const handleDenAChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenA(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenA(n);
  };

  const handleNumBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setNumB(''); return; }
    const n = Number(clean);
    if (n <= MAX_LIMIT) setNumB(n);
  };

  const handleDenBChange = (val) => {
    const clean = val.replace(/[^0-9]/g, '');
    if (clean === '') { setDenB(''); return; }
    const n = Number(clean);
    if (n > 0 && n <= MAX_LIMIT) setDenB(n);
  };

  // Αυξομειωση με κουμπια για Κλασμα Α
  const adjustNumA = (amount) => {
    setNumA(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenA = (amount) => {
    setDenA(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Αυξομειωση με κουμπια για Κλασμα Β
  const adjustNumB = (amount) => {
    setNumB(prev => Math.max(0, Math.min(MAX_LIMIT, (Number(prev) || 0) + amount)));
  };
  const adjustDenB = (amount) => {
    setDenB(prev => Math.max(1, Math.min(MAX_LIMIT, (Number(prev) || 1) + amount)));
  };

  // Ενεργες τιμες για τους υπολογισμους
  const activeNumA = numA === '' ? 0 : Number(numA);
  const activeDenA = denA === '' || Number(denA) === 0 ? 1 : Number(denA);
  const activeNumB = numB === '' ? 0 : Number(numB);
  const activeDenB = mode === 'fraction-fraction' ? (denB === '' || Number(denB) === 0 ? 1 : Number(denB)) : 1;

  // Υπολογισμος Αντιστροφου Κλασματος Διαιρετη
  const inverseNum = activeDenB;
  const inverseDen = activeNumB;

  // Υπολογισμος Διαιρεσης
  const resultNum = activeNumA * inverseNum;
  const resultDen = activeDenA * inverseDen;

  const gcd = findGCD(resultNum, resultDen);
  const simplifiedNum = resultNum / gcd;
  const simplifiedDen = resultDen / gcd;
  const isSimplified = gcd > 1 && resultNum !== 0;

  const decimalResult = activeNumB > 0 ? (activeNumA / activeDenA) / (activeNumB / activeDenB) : 0;

  // Γραφικη Απεικονιση Μετρησης & Μπαρων
  const renderBarVisual = () => {
    const valA = activeNumA / activeDenA;
    const valB = activeNumB / activeDenB;
    const maxVal = Math.max(valA, valB, 1);

    const widthA = maxVal > 0 ? (valA / maxVal) * 100 : 0;
    const widthB = maxVal > 0 ? (valB / maxVal) * 100 : 0;

    const countFits = valB > 0 ? Math.floor(valA / valB) : 0;
    const hasRemainder = valB > 0 && valA % valB > 0.0001;

    return (
      <div className="w-full bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-6 shadow-inner">
        <div className="text-center text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          💡 <strong>Τι σημαίνει η διαίρεση;</strong> Σημαίνει να μετρήσουμε <strong>πόσες φορές χωράει ο διαιρέτης (Κλάσμα 2)</strong> μέσα στον <strong>διαιρετέο (Κλάσμα 1)</strong>!
        </div>

        <div className="space-y-6 max-w-xl mx-auto">
          {/* Μπαρα 1: Διαιρετεος */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-blue-700 uppercase tracking-wider">
              <span>📏 ΚΛΑΣΜΑ 1 (ΔΙΑΙΡΕΤΕΟΣ)</span>
              <span className="font-mono">{activeNumA}/{activeDenA} ≈ {Number(valA.toFixed(3)).toLocaleString('el-GR')}</span>
            </div>
            <div className="w-full bg-slate-200/80 h-10 rounded-2xl p-1 border border-slate-300 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${Math.min(100, Math.max(8, widthA))}%` }}
              >
                <span>{activeNumA}/{activeDenA}</span>
                {widthA > 20 && <span className="text-[10px] opacity-80 font-normal">Μέγεθος προς διαίρεση</span>}
              </div>
            </div>
          </div>

          {/* Μπαρα 2: Διαιρετης */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-black text-orange-700 uppercase tracking-wider">
              <span>📐 ΚΛΑΣΜΑ 2 (ΔΙΑΙΡΕΤΗΣ)</span>
              <span className="font-mono">
                {mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB} ≈ {Number(valB.toFixed(3)).toLocaleString('el-GR')}
              </span>
            </div>
            <div className="w-full bg-slate-200/80 h-10 rounded-2xl p-1 border border-slate-300 shadow-inner flex">
              <div 
                className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white font-mono font-black text-xs shadow-md truncate"
                style={{ width: `${Math.min(100, Math.max(8, widthB))}%` }}
              >
                <span>{mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB}</span>
                {widthB > 20 && <span className="text-[10px] opacity-80 font-normal">Μέγεθος μερίδας</span>}
              </div>
            </div>
          </div>

          {/* Οπτικη Καταμετρηση Μεριδιων */}
          {valB > 0 && valA >= valB && countFits <= 12 && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider text-center">
                ΠΩΣ ΧΩΡΑΕΙ Ο ΔΙΑΙΡΕΤΗΣ ΜΕΣΑ ΣΤΟΝ ΔΙΑΙΡΕΤΕΟ:
              </span>
              <div className="flex gap-1 justify-center flex-wrap">
                {Array.from({ length: countFits }).map((_, idx) => (
                  <div key={idx} className="bg-amber-100 border-2 border-amber-400 text-amber-900 font-mono font-bold text-xs px-2.5 py-1 rounded-xl shadow-xs">
                    {idx + 1}η φορά ({mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB})
                  </div>
                ))}
                {hasRemainder && (
                  <div className="bg-slate-100 border-2 border-dashed border-slate-400 text-slate-600 font-mono font-bold text-xs px-2 py-1 rounded-xl">
                    ＋ υπόλοιπο μέρος
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Αποτελεσμα Συγκρισης / Πηλικο */}
        <div className="text-center font-mono text-slate-800 bg-white border border-slate-200 p-4 rounded-2xl max-w-sm mx-auto shadow-sm space-y-1">
          <div className="text-slate-400 font-sans text-[11px] font-bold uppercase tracking-wider">
            ΑΚΡΙΒΕΣ ΠΗΛΙΚΟ (ΠΟΣΕΣ ΦΟΡΕΣ ΧΩΡΑΕΙ):
          </div>
          <div className="text-emerald-600 text-xl md:text-2xl font-black">
            {Number.isInteger(decimalResult) ? decimalResult : Number(decimalResult.toFixed(4)).toLocaleString('el-GR')} φορές!
          </div>
          <div className="text-slate-500 text-xs font-mono font-bold">
            (Κλασματικά: {isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`})
          </div>
        </div>
      </div>
    );
  };

  // Επεξηγηματικο μηνυμα βημα-βημα
  const getStepByStepExplanation = () => {
    let typeHeader = activeDenA === activeDenB 
      ? `🔵 ΟΜΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (ΙΔΙΟΣ ΠΑΡΟΝΟΜΑΣΤΗΣ: ${activeDenA})`
      : `🟣 ΕΤΕΡΩΝΥΜΑ ΚΛΑΣΜΑΤΑ (${activeDenA} ≠ ${activeDenB})`;

    return (
      <div className="space-y-3 flex flex-col justify-between h-full">
        <div className="space-y-2.5">
          <span className={`font-black uppercase block text-[11px] ${activeDenA === activeDenB ? 'text-blue-800' : 'text-indigo-800'}`}>
            {typeHeader}
          </span>
          <div className="text-slate-600 space-y-1 text-xs md:text-sm">
            <p>1. Κρατάμε το 1ο κλάσμα (διαιρετέο) όπως είναι: <strong className="text-blue-700">{activeNumA}/{activeDenA}</strong></p>
            <p>2. Αντιστρέφουμε τους όρους του 2ου κλάσματος (διαιρέτη):</p>
            <p className="font-mono text-orange-700 pl-2">
              ➔ Το <strong>{mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB}</strong> γίνεται <strong className="bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{inverseNum}/{inverseDen}</strong>
            </p>
            <p>3. Μετατρέπουμε τη διαίρεση σε πολλαπλασιασμό:</p>
          </div>
          
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 font-mono text-xs md:text-sm">
            {activeNumA}/{activeDenA} : {mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB} ＝ {activeNumA}/{activeDenA} · {inverseNum}/{inverseDen} ＝ <strong className="text-emerald-700">{resultNum}/{resultDen}</strong>
          </div>
        </div>

        <div className="min-h-[28px] flex items-center pt-1 border-t border-slate-100">
          {isSimplified ? (
            <p className="text-emerald-700 text-xs font-bold">
              ✨ Απλοποιώντας με το {gcd}, το τελικό ανάγωγο κλάσμα γίνεται: <strong>{simplifiedNum}/{simplifiedDen}</strong>
            </p>
          ) : (
            <p className="text-slate-400 text-xs italic">
              Το κλάσμα είναι ήδη στην ανάγωγη μορφή του.
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Layout
      title="Διαίρεση Κλασμάτων - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Μάθε πώς διαιρούμε κλάσμα με κλάσμα και κλάσμα με ακέραιο, αντιστρέφοντας το 2ο κλάσμα και κάνοντας πολλαπλασιασμό για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/30-diairesi-klasmaton-ask"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 2xl:px-6 2xl:py-2.5 rounded-xl shadow-sm transition active:scale-95 text-sm sm:text-base 2xl:text-lg"
        >
          <span>🎯 Ασκήσεις</span>
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 space-y-8 sm:space-y-10 2xl:space-y-14 pb-28 sm:pb-32 overflow-x-hidden">

        {/* 1. HERO BANNER */}
        <section className="bg-gradient-to-br from-indigo-950 via-blue-900 to-sky-900 text-white p-5 sm:p-10 2xl:p-16 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-5xl space-y-3 sm:space-y-4 2xl:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm 2xl:text-base font-semibold text-sky-200">
              <span>ΚΕΦΑΛΑΙΟ 30 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Διαίρεση Κλασμάτων και Διαίρεση με Ακέραιο
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Μάθε τον <strong>Χρυσό Κανόνα</strong> της διαίρεσης κλασμάτων: <strong>αντιστρέφουμε τους όρους του δεύτερου κλάσματος</strong> και εκτελούμε πολλαπλασιασμό!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Οπτική Καταμέτρηση Μεριδίων &amp; Αντιστροφή Κλασμάτων</span>
            </div>
            <Link
              href="/st-dimotikou/30-diairesi-klasmaton-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΘΕΩΡΙΑΣ (3 COLS) */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Βασικές Έννοιες &amp; Κανόνες Διαίρεσης Κλασμάτων
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Πώς μετατρέπουμε οποιαδήποτε διαίρεση σε πολλαπλασιασμό με τη βοήθεια του αντίστροφου κλάσματος.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 2xl:gap-8">
            
            {/* ΚΑΡΤΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    1. Ο ΧΡΥΣΟΣ ΚΑΝΟΝΑΣ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Αντιστροφή 2ου</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Χρυσός Κανόνας
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αφήνουμε το 1ο κλάσμα όπως είναι, <strong>αντιστρέφουμε το 2ο κλάσμα</strong> και κάνουμε <strong>πολλαπλασιασμό</strong>.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>(α/β) : (γ/δ) ＝ (α/β) · (δ/γ)</p>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 <strong>Μυστικό:</strong> «Κρατάω το πρώτο, αλλάζω το σύμβολο σε πολλαπλασιασμό, τουμπάρω το δεύτερο!»
              </div>
            </article>

            {/* ΚΑΡΤΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    2. ΜΕ ΑΚΕΡΑΙΟ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-indigo-600">γ ＝ γ/1</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Διαίρεση με Ακέραιο
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Γράφουμε τον ακέραιο ως κλάσμα με <strong>παρονομαστή το 1</strong> (γ ＝ γ/1), αντιστρέφουμε σε 1/γ και πολλαπλασιάζουμε.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>(α/β) : γ ＝ (α/β) · (1/γ)</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                ⚡ Όταν διαιρούμε με ακέραιο αριθμό μεγαλύτερο του 1, το κλάσμα μικραίνει γιατί μοιράζεται σε περισσότερα ίσα μέρη!
              </div>
            </article>

            {/* ΚΑΡΤΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider uppercase">
                    3. ΣΥΝΘΕΤΟ ΚΛΑΣΜΑ
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-emerald-600">Άκρα &amp; Μέσα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Σύνθετο Κλάσμα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Στη μορφή σύνθετου κλάσματος: γινόμενο <strong>άκρων όρων</strong> στον αριθμητή, γινόμενο <strong>μέσων όρων</strong> στον παρονομαστή.
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono text-center font-bold">
                  <p>(α/β) / (γ/δ) ＝ (α · δ) / (β · γ)</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🎯 Το σύνθετο κλάσμα είναι απλώς ένας άλλος τρόπος γραφής της διαίρεσης κλασμάτων.
              </div>
            </article>

          </div>
        </section>

        {/* 3. MODE SELECTOR TABS */}
        <div className="flex justify-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner max-w-md mx-auto gap-1">
          <button
            type="button"
            onClick={() => { setMode('fraction-fraction'); setNumA(3); setDenA(4); setNumB(1); setDenB(4); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'fraction-fraction' ? 'bg-blue-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ➗ {toCleanUppercase('Κλάσμα με Κλάσμα')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('fraction-number'); setNumA(3); setDenA(4); setNumB(2); }}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs md:text-sm font-black transition-all touch-manipulation active:scale-95 ${
              mode === 'fraction-number' ? 'bg-indigo-600 text-white shadow-sm scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔢 {toCleanUppercase('Κλάσμα με Ακέραιο')}
          </button>
        </div>

        {/* 4. INTERACTIVE PLAYGROUND */}
        <section className="bg-white p-4 sm:p-8 2xl:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστικό Εργαστήριο Διαίρεσης Κλασμάτων
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-1">
              Ρύθμισε τον διαιρετέο και τον διαιρέτη και δες την αντιστροφή, τη μαθηματική πράξη και την οπτική καταμέτρηση μερίδων!
            </p>
          </div>

          {/* MAIN INTERACTIVE GRID (4 COLS LEFT / 8 COLS RIGHT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT: CONTROLS & PRESETS (4 COLS) */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-inner flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* ΧΕΙΡΙΣΤΗΡΙΟ Α (ΔΙΑΙΡΕΤΕΟΣ) */}
                <div className="bg-blue-50/60 p-3.5 sm:p-4 rounded-2xl border border-blue-200 space-y-3">
                  <span className="text-xs font-black text-blue-800 uppercase block tracking-wider">
                    🔵 ΚΛΑΣΜΑ 1 (ΔΙΑΙΡΕΤΕΟΣ)
                  </span>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`div-num-a-${numA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numA === '' ? '' : String(numA)}
                          onChange={(e) => handleNumAChange(e.target.value)}
                          placeholder="3"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                      <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(-1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`div-den-a-${denA}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={denA === '' ? '' : String(denA)}
                          onChange={(e) => handleDenAChange(e.target.value)}
                          placeholder="4"
                          className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-blue-600 px-0.5"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenA(1); }} 
                          className="w-7 sm:w-8 h-8 shrink-0 font-black text-blue-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ΧΕΙΡΙΣΤΗΡΙΟ Β (ΔΙΑΙΡΕΤΗΣ) */}
                {mode === 'fraction-fraction' ? (
                  <div className="bg-orange-50/60 p-3.5 sm:p-4 rounded-2xl border border-orange-200 space-y-3">
                    <span className="text-xs font-black text-orange-800 uppercase block tracking-wider">
                      🟠 ΚΛΑΣΜΑ 2 (ΔΙΑΙΡΕΤΗΣ)
                    </span>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-center">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΑΡΙΘΜΗΤΗΣ</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`div-num-b-${numB}`}
                            autoComplete="off"
                            spellCheck="false"
                            type="text"
                            inputMode="numeric"
                            value={numB === '' ? '' : String(numB)}
                            onChange={(e) => handleNumBChange(e.target.value)}
                            placeholder="1"
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">ΠΑΡΟΝΟΜΑΣΤΗΣ</span>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(-1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            －
                          </button>
                          <input
                            key={`div-den-b-${denB}`}
                            autoComplete="off"
                            spellCheck="false"
                            type="text"
                            inputMode="numeric"
                            value={denB === '' ? '' : String(denB)}
                            onChange={(e) => handleDenBChange(e.target.value)}
                            placeholder="4"
                            className="w-full min-w-0 text-center font-mono font-black text-base outline-none text-orange-600 px-0.5"
                          />
                          <button 
                            type="button" 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustDenB(1); }} 
                            className="w-7 sm:w-8 h-8 shrink-0 font-black text-orange-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                          >
                            ＋
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50/60 p-3.5 sm:p-4 rounded-2xl border border-indigo-200 space-y-3">
                    <span className="text-xs font-black text-indigo-800 uppercase block tracking-wider">
                      🔢 ΑΚΕΡΑΙΟΣ ΔΙΑΙΡΕΤΗΣ
                    </span>
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">ΤΙΜΗ</span>
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 max-w-[160px] mx-auto">
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(-1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          －
                        </button>
                        <input
                          key={`div-whole-b-${numB}`}
                          autoComplete="off"
                          spellCheck="false"
                          type="text"
                          inputMode="numeric"
                          value={numB === '' ? '' : String(numB)}
                          onChange={(e) => handleNumBChange(e.target.value)}
                          placeholder="2"
                          className="w-full min-w-0 text-center font-mono font-black text-lg outline-none text-indigo-600"
                        />
                        <button 
                          type="button" 
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); adjustNumB(1); }} 
                          className="w-8 h-8 font-black text-indigo-600 hover:bg-slate-50 rounded-lg flex items-center justify-center touch-manipulation active:scale-95"
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* PRESET BUTTONS */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    ΕΤΟΙΜΑ ΠΑΡΑΔΕΙΓΜΑΤΑ:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(mode === 'fraction-fraction' ? PRESETS_FF : PRESETS_FN).map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          if (mode === 'fraction-fraction') {
                            setNumA(p.nA);
                            setDenA(p.dA);
                            setNumB(p.nB);
                            setDenB(p.dB);
                          } else {
                            setNumA(p.nA);
                            setDenA(p.dA);
                            setNumB(p.nB);
                          }
                        }}
                        className="py-2 px-1 rounded-xl border font-mono font-black text-xs transition-all text-center bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-xs touch-manipulation active:scale-95"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ΒΗΜΑ-ΒΗΜΑ ΕΠΕΞΗΓΗΣΗ */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium shadow-xs min-h-[220px]">
                  {getStepByStepExplanation()}
                </div>

              </div>

              <div className="text-[11px] sm:text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 mt-3">
                💡 <strong>Θυμήσου:</strong> Στη διαίρεση κλασμάτων <strong>αντιστρέφουμε πάντα το 2ο κλάσμα</strong> και κάνουμε πολλαπλασιασμό!
              </div>
            </div>

            {/* RIGHT: VISUALIZATION & DYNAMIC BARS (8 COLS) */}
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[520px] space-y-6">
              
              {/* 1. ΜΑΘΗΜΑΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ ΤΗΣ ΔΙΑΙΡΕΣΗΣ */}
              <div className="flex items-center justify-center p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                {activeNumB === 0 ? (
                  <div className="text-rose-600 font-bold font-mono text-base">⚠️ Αδύνατη Πράξη (Διαίρεση με το 0)</div>
                ) : (
                  <div className="flex items-center gap-2.5 sm:gap-4 font-mono font-black text-lg sm:text-xl md:text-3xl select-none flex-wrap justify-center">
                    
                    {/* Κλάσμα Α */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο : */}
                    <div className="text-slate-400 font-light text-2xl">：</div>

                    {/* Κλάσμα Β */}
                    {mode === 'fraction-fraction' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-orange-600">{activeNumB}</span>
                        <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                        <span className="text-orange-600">{activeDenB}</span>
                      </div>
                    ) : (
                      <span className="text-orange-600 text-2xl sm:text-3xl md:text-4xl">{activeNumB}</span>
                    )}

                    {/* Βέλος μετατροπής */}
                    <div className="text-indigo-600 font-bold px-1">➔</div>

                    {/* Κλάσμα Α σταθερό */}
                    <div className="flex flex-col items-center">
                      <span className="text-blue-600">{activeNumA}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-blue-600">{activeDenA}</span>
                    </div>

                    {/* Σύμβολο · */}
                    <div className="text-indigo-600 font-bold">·</div>

                    {/* Αντίστροφο Κλάσμα Β */}
                    <div className="flex flex-col items-center bg-orange-50 px-2 sm:px-2.5 py-1 rounded-xl border-2 border-dashed border-orange-300">
                      <span className="text-orange-700 font-bold">{inverseNum}</span>
                      <div className="w-8 sm:w-10 h-0.5 bg-orange-800 my-1 rounded-full" />
                      <span className="text-orange-700 font-bold">{inverseDen}</span>
                    </div>

                    <div className="text-slate-500 font-bold">＝</div>

                    {/* Αποτέλεσμα */}
                    <div className="flex flex-col items-center bg-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-200">
                      <span className="text-emerald-700">{resultNum}</span>
                      <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                      <span className="text-emerald-700">{resultDen}</span>
                    </div>

                    {/* Ανάγωγο Αποτέλεσμα */}
                    {isSimplified && (
                      <>
                        <div className="text-emerald-600 font-bold">＝</div>
                        <div className="flex flex-col items-center bg-emerald-100 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300">
                          <span className="text-emerald-800">{simplifiedNum}</span>
                          <div className="w-8 sm:w-10 h-1 bg-slate-800 my-1 rounded-full" />
                          <span className="text-emerald-800">{simplifiedDen}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 2. ΓΡΑΦΙΚΗ ΑΠΕΙΚΟΝΙΣΗ ΜΕ ΜΠΑΡΕΣ & ΜΕΤΡΗΣΕΙΣ */}
              <div className="space-y-2 flex-1 flex flex-col justify-center">
                <span className="text-xs 2xl:text-sm font-black text-slate-500 uppercase tracking-wider block text-center">
                  📏 ΓΡΑΦΙΚΗ ΑΝΑΠΑΡΑΣΤΑΣΗ ΜΕΓΕΘΩΝ ΚΑΙ ΚΑΤΑΜΕΤΡΗΣΗ ΜΕΡΙΔΙΩΝ
                </span>
                {activeNumB > 0 ? (
                  renderBarVisual()
                ) : (
                  <div className="text-center text-xs text-slate-400 italic py-6">
                    Επίλεξε έναν διαιρέτη μεγαλύτερο του 0 για να εμφανιστεί η οπτικοποίηση.
                  </div>
                )}
              </div>

              {/* 3. ΤΕΛΙΚΟ ΣΥΜΠΕΡΑΣΜΑ */}
              <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white p-3.5 sm:p-4 rounded-2xl text-center font-mono font-black text-xs sm:text-sm shadow-md">
                💡 ΤΕΛΙΚΟ ΑΠΟΤΕΛΕΣΜΑ: ({activeNumA}/{activeDenA}) : ({mode === 'fraction-fraction' ? `${activeNumB}/${activeDenB}` : activeNumB}) ＝ {isSimplified ? `${simplifiedNum}/${simplifiedDen}` : `${resultNum}/${resultDen}`} (Όταν διαιρούμε με κλάσμα ＜ 1, το πηλίκο μεγαλώνει γιατί το μικρό κομμάτι χωράει πολλές φορές!)
              </div>

            </div>

          </div>
        </section>

        {/* 5. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στη Διαίρεση Κλασμάτων!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Έμαθες τον κανόνα της διαίρεσης κλασμάτων και ακεραίων; Δοκίμασε τις διαδραστικές ασκήσεις με 10 απαιτητικά θέματα για να εμπεδώσεις τις γνώσεις σου!
            </p>
          </div>

          <Link
            href="/st-dimotikou/30-diairesi-klasmaton-ask"
            className="inline-flex items-center justify-center gap-2 bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base 2xl:text-lg shrink-0 w-full sm:w-auto"
          >
            <span>🎯 {toCleanUppercase('Έναρξη Ασκήσεων')}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </section>

      </div>
    </Layout>
  );
}

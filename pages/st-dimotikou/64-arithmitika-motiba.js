// pages/st-dimotikou/64-arithmitika-motiba.js
import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Αφαίρεση τόνων για κεφαλαία (εξαιρείται το ΣΤ')
function toCleanUppercase(str) {
  if (!str) return '';
  const cleaned = str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  return cleaned.replace(/\bΣΤ\b/g, "ΣΤ'");
}

// Μορφοποίηση αριθμού
function formatNum(val) {
  if (val === null || val === undefined || isNaN(Number(val))) return '0';
  return Number(val).toLocaleString('el-GR');
}

export default function ArithmitikaMotibaTheoryPage() {
  // Εργαστήριο 1: Δυναμική Ακολουθία
  const [startVal, setStartVal] = useState(3);
  const [stepVal, setStepVal] = useState(4);
  const [currentN, setCurrentN] = useState(6);
  const [seqMode, setSeqMode] = useState('add'); // 'add' | 'mult'

  // Υπολογισμός των πρώτων όρων
  const sequenceTerms = useMemo(() => {
    const terms = [];
    let cur = startVal;
    for (let i = 1; i <= Math.max(currentN, 8); i++) {
      if (i === 1) {
        terms.push({ n: 1, val: startVal });
      } else {
        if (seqMode === 'add') {
          cur += stepVal;
        } else {
          cur *= stepVal;
        }
        terms.push({ n: i, val: cur });
      }
    }
    return terms;
  }, [startVal, stepVal, currentN, seqMode]);

  // Υπολογισμός του n-οστού όρου
  const targetTermVal = useMemo(() => {
    if (seqMode === 'add') {
      // an = a1 + (n - 1) * d
      return startVal + (currentN - 1) * stepVal;
    }
    // an = a1 * d^(n - 1)
    return startVal * Math.pow(stepVal, currentN - 1);
  }, [startVal, stepVal, currentN, seqMode]);

  // Εργαστήριο 2: Επιλογή προκαθορισμένου μοτίβου (Pattern Detective)
  const [selectedPresetId, setSelectedPresetId] = useState('p1');

  const PRESET_PATTERNS = [
    {
      id: 'p1',
      title: 'Αριθμητική (+5)',
      terms: [3, 8, 13, 18, 23, 28],
      rule: 'Προσθέτουμε 5 στον προηγούμενο όρο',
      formula: '5 · n － 2',
      badge: 'Σταθερό Βήμα'
    },
    {
      id: 'p2',
      title: 'Διπλασιασμός (· 2)',
      terms: [2, 4, 8, 16, 32, 64],
      rule: 'Πολλαπλασιάζουμε επί 2 τον προηγούμενο όρο',
      formula: '2ⁿ',
      badge: 'Γεωμετρική'
    },
    {
      id: 'p3',
      title: 'Περιττοί Αριθμοί (+2)',
      terms: [1, 3, 5, 7, 9, 11],
      rule: 'Ξεκινάμε από το 1 και προσθέτουμε 2',
      formula: '2 · n － 1',
      badge: 'Κλασικό Μοτίβο'
    },
    {
      id: 'p4',
      title: 'Ακολουθία Fibonacci',
      terms: [1, 1, 2, 3, 5, 8],
      rule: 'Κάθε όρος είναι το άθροισμα των δύο προηγούμενων',
      formula: 'α(n) ＝ α(n-1) ＋ α(n-2)',
      badge: 'Φυσικό Μοτίβο'
    }
  ];

  const activePreset = useMemo(() => {
    return PRESET_PATTERNS.find(p => p.id === selectedPresetId) || PRESET_PATTERNS[0];
  }, [selectedPresetId]);

  return (
    <Layout
      title="Αριθμητικά Μοτίβα & Ακολουθίες - ΣΤ' Δημοτικού | LearnMaths.gr"
      description="Θεωρία για τα αριθμητικά μοτίβα, τις ακολουθίες, τους όρους (1ος, 2ος, ν-οστός), τους κανόνες σχηματισμού και την εύρεση γενικού τύπου για τη ΣΤ' Δημοτικού."
      backUrl="/st-dimotikou"
      backText="ΣΤ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/st-dimotikou/64-arithmitika-motiba-ask"
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
              <span>ΚΕΦΑΛΑΙΟ 64 • ΣΤ' ΔΗΜΟΤΙΚΟΥ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl font-black tracking-tight leading-tight">
              Αριθμητικά Μοτίβα &amp; Ακολουθίες
            </h1>
            <p className="text-sky-100 text-xs sm:text-base 2xl:text-xl leading-relaxed max-w-4xl">
              Εξερευνούμε τη γλώσσα των αριθμών: μαθαίνουμε τι είναι <strong>ακολουθία</strong> και <strong>όρος ακολουθίας</strong>, πώς εντοπίζουμε τον <strong>κανόνα σχηματισμού</strong> (με πρόσθεση, αφαίρεση ή πολλαπλασιασμό) και πώς χρησιμοποιούμε τη μεταβλητή <strong>ν</strong> για να υπολογίζουμε απευθείας οποιονδήποτε μελλοντικό όρο!
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm 2xl:text-base text-sky-200">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Θεωρία, Κανόνες Βήματος, Γενικός Τύπος &amp; Διαδραστική Γεννήτρια Όρων</span>
            </div>
            <Link
              href="/st-dimotikou/64-arithmitika-motiba-ask"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-md transition active:scale-95 text-xs sm:text-sm 2xl:text-base"
            >
              <span>Δοκίμασε τις Ασκήσεις</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        {/* 2. ΚΑΡΤΕΣ ΑΝΑΛΥΣΗΣ ΘΕΩΡΙΑΣ ΣΕ 4 ΒΗΜΑΤΑ */}
        <section className="space-y-6 2xl:space-y-8">
          <div>
            <h2 className="text-xl sm:text-3xl 2xl:text-4xl font-black text-slate-900 tracking-tight">
              Τα Αριθμητικά Μοτίβα σε 4 Βήματα
            </h2>
            <p className="text-slate-600 text-xs sm:text-base 2xl:text-xl mt-1">
              Από την αναγνώριση του κανόνα μέχρι την άλγεβρα του ν-οστού όρου.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 3xl:grid-cols-4 gap-5 sm:gap-6 2xl:gap-8">

            {/* ΒΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-sky-100 text-sky-800 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 1
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Βασικός Ορισμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ακολουθία &amp; Όροι
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  <strong>Ακολουθία αριθμών</strong> ονομάζεται μια σειρά από αριθμούς τοποθετημένους με συγκεκριμένη διάταξη. Κάθε αριθμός της ακολουθίας ονομάζεται <strong>όρος</strong>:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-1.5 font-mono">
                  <div>• <strong>1ος όρος (αρχικός):</strong> Ο πρώτος αριθμός της σειράς.</div>
                  <div>• <strong>2ος, 3ος, ... ν-οστός όρος:</strong> Οι επόμενοι αριθμοί ανάλογα με τη θέση τους.</div>
                  <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-bold text-blue-900 mt-2">
                    4, 7, 10, 13, 16, 19, ...
                  </div>
                  <div className="text-[11px] text-slate-500 font-sans text-center">
                    (1ος: 4, 2ος: 7, 3ος: 10 κ.ο.κ.)
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-xs 2xl:text-sm text-sky-950 font-medium">
                💡 Ο αριθμός της θέσης συμβολίζεται συνήθως με το γράμμα <strong>ν</strong> (ή n).
              </div>
            </article>

            {/* ΒΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 2
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Σταθερό Βήμα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Μοτίβα με Πρόσθεση ή Αφαίρεση
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Είναι τα πιο συνηθισμένα μοτίβα όπου σε κάθε βήμα προσθέτουμε ή αφαιρούμε έναν <strong>σταθερό αριθμό</strong> (βήμα):
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Αύξουσα (προσθήκη +3):</strong><br />
                    2, 5, 8, 11, 14 ➔ Κανόνας: <strong>＋ 3</strong>
                  </div>
                  <div>
                    • <strong>Φθίνουσα (αφαίρεση -4):</strong><br />
                    50, 46, 42, 38, 34 ➔ Κανόνας: <strong>－ 4</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs 2xl:text-sm text-amber-950 font-medium">
                ⚡ Για να βρούμε το σταθερό βήμα, αφαιρούμε δύο διαδοχικούς όρους: <strong>βήμα ＝ (2ος όρος) － (1ος όρος)</strong>.
              </div>
            </article>

            {/* ΒΗΜΑ 3 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 3
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Πολλαπλασιασμός</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Πολλαπλασιαστικά &amp; Σύνθετα Μοτίβα
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Σε ορισμένα μοτίβα οι αριθμοί αυξάνονται πολύ γρήγορα με πολλαπλασιασμό ή συνδυασμό πράξεων:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono">
                  <div>
                    • <strong>Διπλασιασμός (· 2):</strong><br />
                    3, 6, 12, 24, 48 ➔ Κανόνας: <strong>· 2</strong>
                  </div>
                  <div>
                    • <strong>Σύνθετος Κανόνας (· 2 ＋ 1):</strong><br />
                    1, 3, 7, 15, 31 ➔ Διπλασιάζουμε και προσθέτουμε 1!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs 2xl:text-sm text-indigo-950 font-medium">
                🎯 Στον διπλασιασμό η διαφορά ανάμεσα στους όρους δεν είναι σταθερή, αλλά διπλασιάζεται σε κάθε βήμα!
              </div>
            </article>

            {/* ΒΗΜΑ 4 */}
            <article className="bg-white p-5 sm:p-7 2xl:p-10 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 text-[11px] sm:text-xs 2xl:text-sm font-black rounded-lg tracking-wider">
                    ΒΗΜΑ 4
                  </span>
                  <span className="text-[11px] sm:text-xs 2xl:text-sm font-semibold text-slate-500">Άλγεβρα</span>
                </div>
                <h3 className="text-base sm:text-xl 2xl:text-2xl font-black text-slate-900">
                  Ο Γενικός Κανόνας (Τύπος του ν)
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base leading-relaxed">
                  Αντί να γράφουμε δεκάδες αριθμούς, εκφράζουμε τη σχέση της θέσης (ν) με την τιμή του όρου:
                </p>

                <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm space-y-2 font-mono text-center">
                  <div className="text-emerald-900 font-bold">
                    Ακολουθία: 3, 7, 11, 15, 19, ...
                  </div>
                  <div className="text-blue-700 font-black text-sm">
                    Κανόνας: 4 · ν － 1
                  </div>
                  <div className="text-slate-600 text-[11px] font-sans text-left pt-1">
                    Για τον 100ό όρο (ν ＝ 100):<br />
                    4 · 100 － 1 ＝ 400 － 1 ＝ <strong>399</strong>!
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs 2xl:text-sm text-emerald-950 font-medium">
                🚀 Ο τύπος του ν μας γλιτώνει χρόνο και μας επιτρέπει να βρίσκουμε αμέσως οποιονδήποτε μελλοντικό όρο!
              </div>
            </article>

          </div>
        </section>

        {/* 3. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1: ΔΥΝΑΜΙΚΗ ΑΚΟΛΟΥΘΙΑ */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs 2xl:text-sm font-bold text-sky-800 mb-1">
              <span>🔬 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 1</span>
            </div>
            <h3 className="text-lg sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              Διαδραστική Γεννήτρια Όρων Ακολουθίας
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Ρύθμισε τον <strong>αρχικό όρο</strong>, το <strong>βήμα</strong> και διάλεξε ποιον όρο (θέση ν) θέλεις να υπολογίσεις:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">

            {/* Χειριστήρια Ρύθμισης (5 στήλες) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Επιλογή Τρόπου Αύξησης */}
              <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block uppercase">
                  ΚΑΝΟΝΑΣ ΒΗΜΑΤΟΣ:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSeqMode('add'); setStepVal(4); }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      seqMode === 'add'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ➕ Πρόσθεση (+ σταθερό)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSeqMode('mult'); setStepVal(2); }}
                    className={`py-2 px-3 rounded-xl font-bold text-xs sm:text-sm border transition touch-manipulation ${
                      seqMode === 'mult'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ✖️ Πολλαπλασιασμός (· 2, · 3)
                  </button>
                </div>
              </div>

              {/* Ρύθμιση Αρχικού Όρου & Βήματος */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/70 p-3.5 rounded-2xl border border-blue-200 space-y-1.5 text-center">
                  <span className="text-[11px] font-bold text-blue-900 block uppercase">1ος Όρος (α₁):</span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStartVal(prev => Math.max(1, prev - 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      －
                    </button>
                    <span className="font-mono text-lg font-black text-blue-700">{startVal}</span>
                    <button
                      type="button"
                      onClick={() => setStartVal(prev => Math.min(10, prev + 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      ＋
                    </button>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-1.5 text-center">
                  <span className="text-[11px] font-bold text-amber-900 block uppercase">
                    {seqMode === 'add' ? 'Βήμα (+)' : 'Βήμα (·)'}:
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStepVal(prev => Math.max(seqMode === 'mult' ? 2 : 1, prev - 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      －
                    </button>
                    <span className="font-mono text-lg font-black text-amber-700">{stepVal}</span>
                    <button
                      type="button"
                      onClick={() => setStepVal(prev => Math.min(seqMode === 'mult' ? 3 : 10, prev + 1))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-300 font-bold text-slate-800 active:scale-95 transition"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              </div>

              {/* Επιλογή Θέσης ν */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                    ΖΗΤΟΥΜΕΝΟΣ ΟΡΟΣ (ΘΕΣΗ ν):
                  </span>
                  <span className="font-mono font-black text-base sm:text-lg text-indigo-700 bg-white px-3 py-1 rounded-xl border border-indigo-200 shadow-sm">
                    ν ＝ {currentN}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={seqMode === 'mult' ? 10 : 25}
                  step={1}
                  value={currentN}
                  onChange={(e) => setCurrentN(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer touch-manipulation"
                />
              </div>

              {/* Κάρτα Αποτελέσματος */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-1 font-mono">
                <span className="text-xs font-sans text-emerald-800 block font-bold">
                  Τιμή του {currentN}ου Όρου (α_{currentN}):
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {formatNum(targetTermVal)}
                </div>
              </div>

            </div>

            {/* Οπτική Απεικόνιση των Πρώτων Όρων (7 στήλες) */}
            <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-6 rounded-3xl border border-slate-200 space-y-4">
              <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block text-center">
                ΟΙ ΠΡΩΤΟΙ ΟΡΟΙ ΤΗΣ ΑΚΟΛΟΥΘΙΑΣ
              </span>

              {/* Πλέγμα όρων */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {sequenceTerms.slice(0, 8).map((term) => {
                  const isCurrent = term.n === currentN;
                  return (
                    <div
                      key={`term-${term.n}`}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 scale-105'
                          : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                      }`}
                    >
                      <span className={`text-[10px] block font-sans uppercase font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {term.n}ος Όρος
                      </span>
                      <span className="font-mono text-base sm:text-lg font-black block mt-0.5">
                        {formatNum(term.val)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Ανάλυση υπολογισμού */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 font-sans text-xs sm:text-sm text-slate-700 space-y-1.5 leading-relaxed">
                <div>
                  💡 <strong>Μαθηματική Ερμηνεία:</strong>{' '}
                  {seqMode === 'add' ? (
                    <>
                      Για να φτάσουμε στον {currentN}ο όρο, ξεκινάμε από το {startVal} και προσθέτουμε {currentN - 1} φορές το βήμα {stepVal}:<br />
                      <span className="font-mono font-bold text-blue-700">
                        {startVal} ＋ ({currentN - 1} · {stepVal}) ＝ {startVal} ＋ {(currentN - 1) * stepVal} ＝ {targetTermVal}
                      </span>
                    </>
                  ) : (
                    <>
                      Για να φτάσουμε στον {currentN}ο όρο, πολλαπλασιάζουμε {currentN - 1} φορές επί {stepVal}:<br />
                      <span className="font-mono font-bold text-indigo-700">
                        {startVal} · {stepVal}^{currentN - 1} ＝ {formatNum(targetTermVal)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: PATTERN DETECTIVE */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-md p-4 sm:p-8 2xl:p-12 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs 2xl:text-sm font-bold text-amber-800 mb-1">
              <span>🔍 ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ 2: ΑΝΑΓΝΩΡΙΣΗ ΚΑΝΟΝΑ</span>
            </div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900">
              «Ντετέκτιβ Μοτίβων»: Βρες τον Κρυμμένο Κανόνα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Επίλεξε ένα από τα 4 κλασικά μοτίβα και δες πώς οι μαθηματικοί ανακαλύπτουν τον κανόνα και τη γενική έκφραση:
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Επιλογές Μοτίβων */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_PATTERNS.map((p) => {
                const isSelected = p.id === selectedPresetId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPresetId(p.id)}
                    className={`p-3 rounded-2xl border text-left transition touch-manipulation ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold block ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                      {p.badge}
                    </span>
                    <span className="font-black text-xs sm:text-sm block mt-0.5">
                      {p.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Παρουσίαση Ακολουθίας & Κανόνα */}
            <div className="bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
                {activePreset.terms.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="bg-white border border-slate-300 text-slate-900 font-black text-lg sm:text-2xl px-4 py-2 rounded-2xl shadow-xs">
                      {t}
                    </span>
                    {idx < activePreset.terms.length - 1 && (
                      <span className="text-slate-400 font-bold text-lg">,</span>
                    )}
                  </div>
                ))}
                <span className="text-slate-400 font-bold text-xl">...</span>
              </div>

              {/* Ανάλυση Κανόνα */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 text-center">
                  <span className="text-xs text-slate-500 font-sans block font-semibold">Λεκτικός Κανόνας:</span>
                  <p className="text-sm sm:text-base font-black text-slate-800">{activePreset.rule}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1 text-center">
                  <span className="text-xs text-slate-500 font-sans block font-semibold">Γενικός Τύπος (του ν):</span>
                  <p className="text-sm sm:text-base font-mono font-black text-indigo-700">{activePreset.formula}</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. ΛΥΜΕΝΑ ΠΡΟΒΛΗΜΑΤΑ ΚΑΘΗΜΕΡΙΝΗΣ ΖΩΗΣ */}
        <section className="space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl 2xl:text-3xl font-black text-slate-900 tracking-tight">
              Λυμένα Προβλήματα με Αριθμητικά Μοτίβα
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm 2xl:text-base mt-0.5">
              Πώς εφαρμόζουμε τους κανόνες των ακολουθιών σε πρακτικά προβλήματα.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ΠΡΟΒΛΗΜΑ 1 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 1: ΑΠΟΤΑΜΙΕΥΣΗ
                </span>
                <span className="text-xs font-bold text-slate-400">Σταθερό Βήμα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Υπολογισμός Κουμπαρά την 25η Εβδομάδα
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ο Νίκος ξεκίνησε να αποταμιεύει έχοντας στον κουμπαρά του <strong>15 €</strong>. Κάθε εβδομάδα βάζει σταθερά <strong>4 €</strong>. Πόσα χρήματα θα έχει συγκεντρώσει στο τέλος της <strong>25ης εβδομάδας</strong>;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΔΕΔΟΜΕΝΑ ΑΚΟΛΟΥΘΙΑΣ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Αρχικό Ποσό</span> 15 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εβδομαδιαίο Βήμα</span> ＋ 4 €
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Εβδομάδες (ν)</span> 25
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• <strong>Χρήματα που προστέθηκαν σε 25 εβδομάδες:</strong> 25 · 4 € ＝ <strong>100 €</strong>.</div>
                  <div>• <strong>Συνολικό ποσό:</strong> Αρχικό ＋ Προσθήκες ＝ 15 ＋ 100 ＝ <strong className="text-blue-700">115 €</strong>.</div>
                  <div>• <strong>Μαθηματικός τύπος:</strong> 15 ＋ (4 · ν).</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 font-medium">
                💡 Αντί να προσθέτουμε 25 φορές το 4, χρησιμοποιούμε τον πολλαπλασιασμό: 25 · 4 ＝ 100!
              </div>
            </article>

            {/* ΠΡΟΒΛΗΜΑ 2 */}
            <article className="bg-white p-5 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black rounded-lg uppercase">
                  ΠΡΟΒΛΗΜΑ 2: ΚΑΘΙΣΜΑΤΑ ΘΕΑΤΡΟΥ
                </span>
                <span className="text-xs font-bold text-slate-400">Κερκίδα</span>
              </div>
              <h4 className="text-lg font-black text-slate-900">
                Πόσα Καθίσματα έχει η 12η Σειρά;
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Σε ένα υπαίθριο αμφιθέατρο, η 1η σειρά έχει <strong>18 καθίσματα</strong>. Κάθε επόμενη σειρά έχει <strong>3 περισσότερα καθίσματα</strong> από την προηγούμενη (2η σειρά: 21, 3η σειρά: 24, κ.ο.κ.). Πόσα καθίσματα έχει η <strong>12η σειρά</strong>;
              </p>

              {/* Πίνακας Δεδομένων */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-1.5">
                  ΣΤΟΙΧΕΙΑ ΣΕΙΡΩΝ
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono font-bold">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">1η σειρά (α₁)</span> 18 καθίσματα
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Αύξηση ανά σειρά</span> ＋ 3
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 text-[10px] block font-sans">Ζητούμενη σειρά</span> 12η
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-mono pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-sans block text-xs font-bold">Βήματα Επίλυσης:</span>
                  <div>• Από την 1η έως τη 12η σειρά μεσολαβούν <strong>11 αυξήσεις</strong> (12 － 1 ＝ 11).</div>
                  <div>• <strong>Συνολική αύξηση:</strong> 11 · 3 ＝ <strong>33 καθίσματα</strong>.</div>
                  <div>• <strong>Καθίσματα 12ης σειράς:</strong> 18 ＋ 33 ＝ <strong className="text-amber-700">51 καθίσματα</strong>.</div>
                  <div>• <strong>Τύπος:</strong> 18 ＋ 3 · (ν － 1).</div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium">
                ⚡ <strong>Προσοχή:</strong> Για τον ν-οστό όρο προσθέτουμε το βήμα <strong>ν － 1 φορές</strong> (και όχι ν φορές), επειδή ο 1ος όρος περιέχει ήδη την αρχική τιμή!
              </div>
            </article>

          </div>
        </section>

        {/* 6. BOTTOM CALLOUT BANNER ΓΙΑ ΑΣΚΗΣΕΙΣ */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 sm:p-8 2xl:p-12 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-2 max-w-2xl 2xl:max-w-4xl">
            <h3 className="text-xl sm:text-2xl 2xl:text-4xl font-black tracking-tight">
              Ώρα για Εξάσκηση στα Αριθμητικά Μοτίβα!
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm 2xl:text-lg">
              Δοκίμασε τις δυνάμεις σου σε 10 διαδραστικές ασκήσεις με εύρεση επόμενων όρων, υπολογισμό του ν-οστού όρου και προβλήματα ακολουθιών για τη ΣΤ' Δημοτικού.
            </p>
          </div>

          <Link
            href="/st-dimotikou/64-arithmitika-motiba-ask"
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

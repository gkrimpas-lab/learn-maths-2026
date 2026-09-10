import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function ProsthesiAfairesiTheoryPage() {
  const [numA, setNumA] = useState(12450);
  const [numB, setNumB] = useState(3200);

  const sum = numA + numB;

  const handleRandomize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const a = getRandomInt(1000, 14000);
    const b = getRandomInt(500, 5000);
    setNumA(a);
    setNumB(b);
  };

  const updateValA = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumA((prev) => Math.max(1000, Math.min(15000, prev + delta)));
  };

  const updateValB = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setNumB((prev) => Math.max(100, Math.min(5000, prev + delta)));
  };

  // Υπολογισμός ποσοστιαίου πλάτους για το δυναμικό SVG Part-Part-Whole
  const pctA = Math.max(15, Math.min(85, Math.round((numA / sum) * 100)));
  const widthA = Math.round((460 * pctA) / 100);
  const widthB = 460 - widthA;

  return (
    <Layout
      title="Πρόσθεση και Αφαίρεση: Αντίστροφες Πράξεις - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς συνδέονται η πρόσθεση με την αφαίρεση, τους όρους των πράξεων και πώς κάνουμε δοκιμή με διαδραστικό εργαστήριο."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/3-prosthesi-afairesi-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                ➕➖ Πρόσθεση και Αφαίρεση: Αντίστροφες Πράξεις
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε πώς συνδέονται η πρόσθεση με την αφαίρεση και πώς χρησιμοποιούμε τη μία πράξη για να ελέγξουμε την άλλη!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις ασκήσεις στις αντίστροφες πράξεις για να σιγουρευτείς ότι τα έμαθες όλα!
              </p>
              <Link
                href="/d-dimotikou/3-prosthesi-afairesi-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - SECTION 1 */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Αναλυτική Θεωρία και Ορισμοί
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Αντίστροφες Πράξεις */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>🔄</span> Τι σημαίνει «Αντίστροφες Πράξεις»;
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Η <strong>πρόσθεση</strong> και η <strong>αφαίρεση</strong> είναι αντίστροφες πράξεις επειδή η μία ακυρώνει το αποτέλεσμα της άλλης:
              </p>
              <div className="inline-flex flex-wrap items-center justify-center sm:justify-start gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-indigo-100 text-xs sm:text-sm text-indigo-950 font-medium w-full">
                <span>Αν ξεκινήσουμε από έναν αριθμό, προσθέσουμε <strong className="text-blue-600 font-bold">5</strong> και έπειτα αφαιρέσουμε <strong className="text-rose-600 font-bold">5</strong>, επιστρέφουμε στον αρχικό μας αριθμό!</span>
              </div>
            </div>

            {/* Ορολογία */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-emerald-900 flex items-center gap-2">
                <span>🏷️</span> Οι Όροι των Πράξεων
              </h3>
              <div className="space-y-2 text-xs sm:text-sm font-mono">
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-emerald-200 w-full text-slate-900 font-bold">
                  <span className="text-blue-600">Προσθετέος</span>
                  <span>＋</span>
                  <span className="text-blue-600">Προσθετέος</span>
                  <span>＝</span>
                  <span className="text-emerald-700 font-black">Άθροισμα</span>
                </div>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-white rounded-xl border border-emerald-200 w-full text-slate-900 font-bold">
                  <span className="text-purple-600">Μειωτέος</span>
                  <span>－</span>
                  <span className="text-rose-600">Αφαιρετέος</span>
                  <span>＝</span>
                  <span className="text-amber-700 font-black">Διαφορά</span>
                </div>
              </div>
            </div>
          </div>

          {/* ΔΟΚΙΜΗ ΠΡΟΣΘΕΣΗΣ ΚΑΙ ΑΦΑΙΡΕΣΗΣ */}
          <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
              ✅ Πώς κάνουμε Δοκιμή στις Πράξεις;
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-blue-700 border-b pb-1">
                  1. Δοκιμή Πρόσθεσης (με Αφαίρεση)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Για να ελέγξουμε αν μια πρόσθεση είναι σωστή, αφαιρούμε έναν προσθετέο από το άθροισμα:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-blue-50/80 rounded-xl border border-blue-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>Άθροισμα</span>
                  <span>－</span>
                  <span>Προσθετέος</span>
                  <span>＝</span>
                  <span className="text-blue-700 font-black">Άλλος Προσθετέος</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-purple-700 border-b pb-1">
                  2. Δοκιμή Αφαίρεσης (με Πρόσθεση)
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  Για να ελέγξουμε αν μια αφαίρεση είναι σωστή, προσθέτουμε τη διαφορά στον αφαιρετέο:
                </p>
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 leading-relaxed break-words px-3 py-2 bg-purple-50/80 rounded-xl border border-purple-200/80 font-mono font-bold text-slate-900 w-full">
                  <span>Διαφορά</span>
                  <span>＋</span>
                  <span>Αφαιρετέος</span>
                  <span>＝</span>
                  <span className="text-purple-700 font-black">Μειωτέος</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Αντίστροφων Πράξεων
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Άλλαξε τους αριθμούς και παρατήρησε πώς η πρόσθεση μετατρέπεται άμεσα στις δύο αντίστροφες αφαιρέσεις!
              </p>
            </div>

            <button
              onClick={handleRandomize}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center gap-2 self-start sm:self-auto active:scale-95 touch-manipulation"
            >
              <span>🎲</span> Τυχαίοι Αριθμοί
            </button>
          </div>

          {/* TOUCH SLIDERS ΧΕΙΡΙΣΜΟΥ (ΚΑΝΟΝΑΣ 2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200">
            {/* Slider Αριθμού α */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">1ος ΑΡΙΘΜΟΣ (α)</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-blue-600 text-base">
                  {formatNumber(numA)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateValA(e, -100)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Μείωση κατά 100"
                  aria-label="Μείωση 1ου αριθμού"
                >
                  －
                </button>

                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="50"
                  value={numA}
                  onChange={(e) => setNumA(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-blue-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateValA(e, 100)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Αύξηση κατά 100"
                  aria-label="Αύξηση 1ου αριθμού"
                >
                  ＋
                </button>
              </div>
            </div>

            {/* Slider Αριθμού β */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="h-8 flex items-center justify-between text-center px-1">
                <span className="text-xs font-black uppercase text-slate-500">2ος ΑΡΙΘΜΟΣ (β)</span>
                <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-indigo-600 text-base">
                  {formatNumber(numB)}
                </span>
              </div>

              <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                <button
                  onClick={(e) => updateValB(e, -50)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Μείωση κατά 50"
                  aria-label="Μείωση 2ου αριθμού"
                >
                  －
                </button>

                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={numB}
                  onChange={(e) => setNumB(Number(e.target.value))}
                  className="w-full min-w-0 max-w-full accent-indigo-600 cursor-pointer"
                />

                <button
                  onClick={(e) => updateValB(e, 50)}
                  className="w-9 h-9 shrink-0 flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                  title="Αύξηση κατά 50"
                  aria-label="Αύξηση 2ου αριθμού"
                >
                  ＋
                </button>
              </div>
            </div>
          </div>

          {/* RESPONSIVE SVG: ΟΠΤΙΚΟΠΟΙΗΣΗ «ΜΕΡΟΣ - ΜΕΡΟΣ - ΟΛΟΝ» (ΧΩΡΙΣ SCROLLBAR) */}
          <div className="p-3 sm:p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-inner">
            <svg
              viewBox="0 0 500 135"
              className="w-full h-auto max-w-xl mx-auto block select-none font-sans"
            >
              {/* Επάνω Μπάρα: Το Όλον (Άθροισμα) */}
              <rect x="20" y="15" width="460" height="42" rx="10" fill="#10b981" />
              <text
                x="250"
                y="35"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                ΤΟ ΟΛΟΝ (ΑΘΡΟΙΣΜΑ)
              </text>
              <text
                x="250"
                y="50"
                fill="#ffffff"
                fontSize="14"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatNumber(sum)}
              </text>

              {/* Κάτω Μπάρες: Μέρος α + Μέρος β */}
              {/* Μέρος α */}
              <rect x="20" y="70" width={widthA} height="42" rx="10" fill="#3b82f6" />
              <text
                x={20 + widthA / 2}
                y="90"
                fill="#ffffff"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                ΜΕΡΟΣ (α)
              </text>
              <text
                x={20 + widthA / 2}
                y="105"
                fill="#ffffff"
                fontSize="13"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatNumber(numA)}
              </text>

              {/* Μέρος β */}
              <rect x={20 + widthA + 2} y="70" width={Math.max(10, widthB - 2)} height="42" rx="10" fill="#6366f1" />
              <text
                x={20 + widthA + widthB / 2}
                y="90"
                fill="#ffffff"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
              >
                ΜΕΡΟΣ (β)
              </text>
              <text
                x={20 + widthA + widthB / 2}
                y="105"
                fill="#ffffff"
                fontSize="13"
                fontWeight="900"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {formatNumber(numB)}
              </text>

              {/* Υποσημείωση */}
              <text
                x="250"
                y="128"
                fill="#94a3b8"
                fontSize="9.5"
                fontWeight="600"
                textAnchor="middle"
              >
                Όλον ＝ Μέρος (α) ＋ Μέρος (β) ➔ Μέρος (α) ＝ Όλον － Μέρος (β)
              </text>
            </svg>
          </div>

          {/* ΠΡΟΒΟΛΗ ΑΝΤΙΣΤΡΟΦΩΝ ΠΡΑΞΕΩΝ ΣΕ ΚΑΡΤΕΣ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Κάρτα 1: Πρόσθεση */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 sm:p-6 rounded-2xl border border-blue-200/90 space-y-3 text-center shadow-sm">
              <span className="bg-blue-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                1. ΑΡΧΙΚΗ ΠΡΟΣΘΕΣΗ
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 pt-1">
                <span className="text-blue-600">{formatNumber(numA)}</span>
                {' ＋ '}
                <span className="text-indigo-600">{formatNumber(numB)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-600 border-t pt-2 border-blue-200/80">
                ＝ {formatNumber(sum)}
              </div>
              <p className="text-xs text-slate-500 font-medium">Προσθέσαμε τους δύο αριθμούς</p>
            </div>

            {/* Κάρτα 2: 1η Αντίστροφη Αφαίρεση */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 sm:p-6 rounded-2xl border border-purple-200/90 space-y-3 text-center shadow-sm">
              <span className="bg-purple-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                2. ΑΝΤΙΣΤΡΟΦΗ (1)
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 pt-1">
                <span className="text-emerald-600">{formatNumber(sum)}</span>
                {' － '}
                <span className="text-indigo-600">{formatNumber(numB)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-blue-600 border-t pt-2 border-purple-200/80">
                ＝ {formatNumber(numA)}
              </div>
              <p className="text-xs text-slate-500 font-medium">Αφαιρέσαμε τον 2ο αριθμό και βρήκαμε τον 1ο!</p>
            </div>

            {/* Κάρτα 3: 2η Αντίστροφη Αφαίρεση */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-6 rounded-2xl border border-emerald-200/90 space-y-3 text-center shadow-sm">
              <span className="bg-emerald-600 text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
                3. ΑΝΤΙΣΤΡΟΦΗ (2)
              </span>
              <div className="text-xl sm:text-2xl font-mono font-black text-slate-800 pt-1">
                <span className="text-emerald-600">{formatNumber(sum)}</span>
                {' － '}
                <span className="text-blue-600">{formatNumber(numA)}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-black text-indigo-600 border-t pt-2 border-emerald-200/80">
                ＝ {formatNumber(numB)}
              </div>
              <p className="text-xs text-slate-500 font-medium">Αφαιρέσαμε τον 1ο αριθμό και βρήκαμε τον 2ο!</p>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Κατάλαβες πώς η πρόσθεση και η αφαίρεση είναι αντίστροφες πράξεις; Κάνε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/3-prosthesi-afairesi-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}

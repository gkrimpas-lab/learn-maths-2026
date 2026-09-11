// pages/d-dimotikou/18-simmetria.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function SimmetriaTheoryPage() {
  const [shape, setShape] = useState('square'); // 'square', 'rectangle', 'isoscelesTriangle', 'equilateralTriangle', 'scaleneTriangle', 'rhombus', 'circle'
  const [activeAxis, setActiveAxis] = useState('vertical'); // 'vertical', 'horizontal', 'diag1', 'diag2', 'axisA', 'axisB', 'axisC'
  const [foldProgress, setFoldProgress] = useState(0); // 0 έως 100

  // Στοιχεία ανά σχήμα
  const shapeData = {
    square: {
      name: 'Τετράγωνο',
      totalAxes: 4,
      allowedAxes: ['vertical', 'horizontal', 'diag1', 'diag2'],
      desc: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους).',
      halfPerimeter: '25',
      halfArea: '50'
    },
    rectangle: {
      name: 'Ορθογώνιο',
      totalAxes: 2,
      allowedAxes: ['vertical', 'horizontal'],
      desc: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του δεν είναι άξονες συμμετρίας!',
      halfPerimeter: '22',
      halfArea: '40'
    },
    isoscelesTriangle: {
      name: 'Ισοσκελές Τρίγωνο',
      totalAxes: 1,
      allowedAxes: ['vertical'],
      desc: 'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 κατακόρυφο άξονα συμμετρίας.',
      halfPerimeter: '16',
      halfArea: '12'
    },
    equilateralTriangle: {
      name: 'Ισόπλευρο Τρίγωνο',
      totalAxes: 3,
      allowedAxes: ['axisA', 'axisB', 'axisC'],
      desc: 'Το ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει 3 άξονες συμμετρίας (έναν από κάθε κορυφή).',
      halfPerimeter: '18',
      halfArea: '15,5'
    },
    scaleneTriangle: {
      name: 'Σκαληνό Τρίγωνο',
      totalAxes: 0,
      allowedAxes: [],
      desc: 'Το σκαληνό τρίγωνο (με όλες τις πλευρές άνισες) δεν έχει κανέναν άξονα συμμετρίας (0).',
      halfPerimeter: '—',
      halfArea: '—'
    },
    rhombus: {
      name: 'Ρόμβος',
      totalAxes: 2,
      allowedAxes: ['vertical', 'horizontal'],
      desc: 'Ο ρόμβος έχει 2 άξονες συμμετρίας (τις δύο διαγώνιους του: την κατακόρυφη και την οριζόντια).',
      halfPerimeter: '20',
      halfArea: '24'
    },
    circle: {
      name: 'Κύκλος',
      totalAxes: 'Άπειροι (∞)',
      allowedAxes: ['vertical', 'horizontal', 'diag1', 'diag2'],
      desc: 'Ο κύκλος έχει αμέτρητους (άπειρους) άξονες συμμετρίας! Κάθε ευθεία που διέρχεται από το κέντρο του είναι άξονας συμμετρίας.',
      halfPerimeter: '18,7',
      halfArea: '39,25'
    }
  };

  const activeData = shapeData[shape];

  // Επαναφορά αξόνων κατά την αλλαγή σχήματος
  const handleShapeChange = (e, newShape) => {
    e.preventDefault();
    e.stopPropagation();
    setShape(newShape);
    setFoldProgress(0);
    const available = shapeData[newShape].allowedAxes;
    if (available.length > 0 && !available.includes(activeAxis)) {
      setActiveAxis(available[0]);
    }
  };

  const handleAxisSelect = (e, axisKey) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveAxis(axisKey);
    setFoldProgress(0);
  };

  const updateFoldDelta = (e, delta) => {
    e.preventDefault();
    e.stopPropagation();
    setFoldProgress((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  return (
    <Layout
      title="Συμμετρία και Άξονας Συμμετρίας - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τι είναι ο άξονας συμμετρίας, το πλήθος αξόνων στα γεωμετρικά σχήματα και την ισότητα περιμέτρου και εμβαδού με διαδραστικό εργαστήριο αναδίπλωσης."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/18-simmetria-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                🦋 Η Έννοια της Συμμετρίας
              </h1>
              <p className="text-purple-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε τι είναι ο άξονας συμμετρίας, πώς ένα σχήμα μπορεί να έχει έναν, περισσότερους ή κανέναν άξονα και γιατί τα συμμετρικά μέρη έχουν πάντοτε ίση περίμετρο και ίσο εμβαδόν!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-purple-100">
                Δοκίμασε τις ασκήσεις στη συμμετρία για να σιγουρευτείς ότι κατανόησες πλήρως τους άξονες συμμετρίας!
              </p>
              <Link
                href="/d-dimotikou/18-simmetria-ask"
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
              <span>📖</span> Αναλυτική Θεωρία και Βασικοί Κανόνες
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Άξονας Συμμετρίας */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-purple-900 flex items-center gap-2">
                <span>✂️</span> Άξονας Συμμετρίας
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Άξονας συμμετρίας</strong> ονομάζεται η ευθεία γραμμή που χωρίζει ένα γεωμετρικό σχήμα σε <strong>δύο ακριβώς ίδια μέρη</strong>. Αν διπλώσουμε το σχήμα πάνω σε αυτή τη γραμμή, τα δύο μέρη <strong>ταυτίζονται τέλεια</strong>.
              </p>
            </div>

            {/* 2. Πλήθος Αξόνων */}
            <div className="bg-pink-50/70 p-5 sm:p-6 rounded-2xl border border-pink-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-pink-900 flex items-center gap-2">
                <span>🔢</span> Πλήθος Αξόνων
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ένα σχήμα μπορεί να έχει <strong>έναν</strong> άξονα (ισοσκελές τρίγωνο), <strong>περισσότερους</strong> (τετράγωνο: 4, ισόπλευρο: 3, κύκλος: άπειροι) ή και <strong>κανέναν</strong> άξονα συμμετρίας (σκαληνό τρίγωνο).
              </p>
            </div>

            {/* 3. Ίση Περίμετρος & Εμβαδόν */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-indigo-900 flex items-center gap-2">
                <span>📐</span> Ίση Περίμετρος & Εμβαδόν
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Επειδή τα δύο συμμετρικά μέρη είναι <strong>απολύτως ίσα</strong> μεταξύ τους, έχουν <strong>πάντοτε την ίδια περίμετρο</strong> και <strong>το ίδιο εμβαδόν</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ - SECTION 2 */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4 border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο Συμμετρίας & Αναδίπλωσης
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm">
                Επίλεξε σχήμα, διάλεξε άξονα και σύρε το slider για να δεις το δίπλωμα και την τέλεια ταύτιση!
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΧΗΜΑΤΟΣ */}
            <div className="flex flex-wrap gap-1.5 self-start sm:self-auto">
              <button
                onClick={(e) => handleShapeChange(e, 'square')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'square'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ❏ Τετράγωνο (4)
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'rectangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'rectangle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ▭ Ορθογώνιο (2)
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'isoscelesTriangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'isoscelesTriangle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ▲ Ισοσκελές (1)
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'equilateralTriangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'equilateralTriangle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ▲ Ισόπλευρο (3)
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'scaleneTriangle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'scaleneTriangle'
                    ? 'bg-rose-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ▲ Σκαληνό (0)
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'rhombus')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'rhombus'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ◇ Ρόμβος (2)
              </button>
              <button
                onClick={(e) => handleShapeChange(e, 'circle')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  shape === 'circle'
                    ? 'bg-purple-600 text-white font-black shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ◯ Κύκλος (∞)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ & ΑΝΑΔΙΠΛΩΣΗΣ (RESPONSIVE SVG ΧΩΡΙΣ SCROLL) */}
            <div className="bg-slate-950 p-4 sm:p-7 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-4">
              {/* SHAPE BADGE & INFO */}
              <div className="bg-purple-600 text-white px-4 py-1.5 rounded-2xl font-black text-xs sm:text-sm shadow-md flex items-center gap-2">
                <span>🦋 {activeData.name}</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-mono">
                  Άξονες: {activeData.totalAxes}
                </span>
              </div>

              <div className="w-full max-w-[340px] aspect-[5/4] bg-slate-900/60 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full block select-none" viewBox="0 0 400 320">
                  {(() => {
                    const rad = (foldProgress * 1.8 * Math.PI) / 180;
                    const scaleFold = Math.cos(rad);

                    return (
                      <g transform="translate(200, 160)">
                        {/* ΣΚΑΛΗΝΟ ΤΡΙΓΩΝΟ (0 ΑΞΟΝΕΣ) */}
                        {shape === 'scaleneTriangle' && (
                          <g>
                            <polygon points="-40,-70 -90,70 100,70" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3.5" strokeLinejoin="round" />
                            <text x="0" y="5" fill="#fb7185" fontWeight="900" fontSize="13" fontFamily="sans-serif" textAnchor="middle">
                              Κανένας Άξονας Συμμετρίας (0)
                            </text>
                          </g>
                        )}

                        {/* 1. ΚΑΤΑΚΟΡΥΦΟΣ ΑΞΟΝΑΣ */}
                        {activeAxis === 'vertical' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'rectangle' && <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'isoscelesTriangle' && <path d="M 0,-100 L 100,80 L 0,80 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'rhombus' && <path d="M 0,-100 L 110,0 L 0,100 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'circle' && <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                              </g>
                            )}

                            {shape === 'square' && <path d="M -90,-90 L 0,-90 L 0,90 L -90,90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'rectangle' && <path d="M -120,-70 L 0,-70 L 0,70 L -120,70 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'isoscelesTriangle' && <path d="M 0,-100 L -100,80 L 0,80 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'rhombus' && <path d="M 0,-100 L -110,0 L 0,100 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'circle' && <path d="M 0,-90 A 90,90 0 0,0 0,90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}

                            <g transform={`scale(${scaleFold}, 1)`}>
                              {shape === 'square' && <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'rectangle' && <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'isoscelesTriangle' && <path d="M 0,-100 L 100,80 L 0,80 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'rhombus' && <path d="M 0,-100 L 110,0 L 0,100 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'circle' && <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                            </g>
                          </g>
                        )}

                        {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΑΞΟΝΑΣ */}
                        {activeAxis === 'horizontal' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && <path d="M -90,0 L 90,0 L 90,90 L -90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'rectangle' && <path d="M -120,0 L 120,0 L 120,70 L -120,70 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'rhombus' && <path d="M -110,0 L 0,100 L 110,0 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'circle' && <path d="M -90,0 A 90,90 0 0,0 90,0 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                              </g>
                            )}

                            {shape === 'square' && <path d="M -90,-90 L 90,-90 L 90,0 L -90,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'rectangle' && <path d="M -120,-70 L 120,-70 L 120,0 L -120,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'rhombus' && <path d="M -110,0 L 0,-100 L 110,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'circle' && <path d="M -90,0 A 90,90 0 0,1 90,0 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}

                            <g transform={`scale(1, ${scaleFold})`}>
                              {shape === 'square' && <path d="M -90,0 L 90,0 L 90,90 L -90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'rectangle' && <path d="M -120,0 L 120,0 L 120,70 L -120,70 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'rhombus' && <path d="M -110,0 L 0,100 L 110,0 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'circle' && <path d="M -90,0 A 90,90 0 0,0 90,0 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                            </g>
                          </g>
                        )}

                        {/* 3. ΔΙΑΓΩΝΙΟΙ */}
                        {activeAxis === 'diag1' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && <path d="M -90,-90 L 90,-90 L 90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'circle' && <path d="M -63.6,-63.6 A 90,90 0 0,1 63.6,63.6 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                              </g>
                            )}
                            {shape === 'square' && <path d="M -90,-90 L -90,90 L 90,90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'circle' && <path d="M -63.6,-63.6 A 90,90 0 0,0 63.6,63.6 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}

                            <g transform={`rotate(-45) scale(${scaleFold}, 1) rotate(45)`}>
                              {shape === 'square' && <path d="M -90,-90 L 90,-90 L 90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'circle' && <path d="M -63.6,-63.6 A 90,90 0 0,1 63.6,63.6 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                            </g>
                          </g>
                        )}

                        {activeAxis === 'diag2' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                          <g>
                            {foldProgress > 0 && (
                              <g opacity="0.4">
                                {shape === 'square' && <path d="M -90,-90 L 90,-90 L -90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                {shape === 'circle' && <path d="M -63.6,63.6 A 90,90 0 0,1 63.6,-63.6 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                              </g>
                            )}
                            {shape === 'square' && <path d="M -90,90 L 90,90 L 90,-90 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}
                            {shape === 'circle' && <path d="M -63.6,63.6 A 90,90 0 0,0 63.6,-63.6 Z" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />}

                            <g transform={`rotate(45) scale(${scaleFold}, 1) rotate(-45)`}>
                              {shape === 'square' && <path d="M -90,-90 L 90,-90 L -90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              {shape === 'circle' && <path d="M -63.6,63.6 A 90,90 0 0,1 63.6,-63.6 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                            </g>
                          </g>
                        )}

                        {/* 4. ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ */}
                        {shape === 'equilateralTriangle' && (() => {
                          let rotDeg = 0;
                          if (activeAxis === 'axisA') rotDeg = 0;
                          if (activeAxis === 'axisB') rotDeg = -120;
                          if (activeAxis === 'axisC') rotDeg = 120;

                          return (
                            <g transform={`translate(0, 20) rotate(${rotDeg})`}>
                              {foldProgress > 0 && (
                                <polygon points="0,-100 86.6,50 0,50" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" opacity="0.4" />
                              )}
                              <polygon points="0,-100 -86.6,50 0,50" fill="#a855f7" fillOpacity="0.35" stroke="#c084fc" strokeWidth="3" />
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <polygon points="0,-100 86.6,50 0,50" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                              </g>
                            </g>
                          );
                        })()}

                        {/* ΓΡΑΜΜΕΣ ΑΞΟΝΩΝ ΣΥΜΜΕΤΡΙΑΣ */}
                        {activeData.allowedAxes.includes('vertical') && (
                          <g opacity={activeAxis === 'vertical' ? 1 : 0.25}>
                            <line x1="0" y1="-135" x2="0" y2="135" stroke="#f59e0b" strokeWidth={activeAxis === 'vertical' ? '4' : '2'} strokeDasharray="6,6" />
                          </g>
                        )}
                        {activeData.allowedAxes.includes('horizontal') && (
                          <g opacity={activeAxis === 'horizontal' ? 1 : 0.25}>
                            <line x1="-155" y1="0" x2="155" y2="0" stroke="#10b981" strokeWidth={activeAxis === 'horizontal' ? '4' : '2'} strokeDasharray="6,6" />
                          </g>
                        )}
                        {activeData.allowedAxes.includes('diag1') && (
                          <g opacity={activeAxis === 'diag1' ? 1 : 0.25}>
                            <line x1="-125" y1="-125" x2="125" y2="125" stroke="#3b82f6" strokeWidth={activeAxis === 'diag1' ? '4' : '2'} strokeDasharray="6,6" />
                          </g>
                        )}
                        {activeData.allowedAxes.includes('diag2') && (
                          <g opacity={activeAxis === 'diag2' ? 1 : 0.25}>
                            <line x1="125" y1="-125" x2="-125" y2="125" stroke="#3b82f6" strokeWidth={activeAxis === 'diag2' ? '4' : '2'} strokeDasharray="6,6" />
                          </g>
                        )}

                        {shape === 'equilateralTriangle' && (
                          <g>
                            <line x1="0" y1="-115" x2="0" y2="95" stroke="#f59e0b" strokeWidth={activeAxis === 'axisA' ? '4' : '2'} strokeDasharray="6,6" opacity={activeAxis === 'axisA' ? 1 : 0.3} />
                            <line x1="-105" y1="80" x2="68" y2="-20" stroke="#10b981" strokeWidth={activeAxis === 'axisB' ? '4' : '2'} strokeDasharray="6,6" opacity={activeAxis === 'axisB' ? 1 : 0.3} />
                            <line x1="105" y1="80" x2="-68" y2="-20" stroke="#3b82f6" strokeWidth={activeAxis === 'axisC' ? '4' : '2'} strokeDasharray="6,6" opacity={activeAxis === 'axisC' ? 1 : 0.3} />
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>
              </div>

              <p className="text-center text-xs font-bold text-slate-300 max-w-xs leading-relaxed">
                {activeData.desc}
              </p>
            </div>

            {/* CONTROLS SLIDERS & AXES SELECTION (ΚΑΝΟΝΑΣ 2) */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              {/* 1. ΕΠΙΛΟΓΗ ΕΝΕΡΓΟΥ ΑΞΟΝΑ */}
              {activeData.allowedAxes.length > 0 ? (
                <div className="space-y-2.5">
                  <span className="text-[11px] font-black uppercase text-slate-600 block">
                    🎯 ΕΠΙΛΕΞΕ ΑΞΟΝΑ ΓΙΑ ΔΙΠΛΩΜΑ:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeData.allowedAxes.includes('vertical') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'vertical')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'vertical'
                            ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🟡 Κατακόρυφος</span>
                        <span>{activeAxis === 'vertical' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeData.allowedAxes.includes('horizontal') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'horizontal')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'horizontal'
                            ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🟢 Οριζόντιος</span>
                        <span>{activeAxis === 'horizontal' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeData.allowedAxes.includes('diag1') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'diag1')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'diag1'
                            ? 'bg-blue-600 text-white font-black border-blue-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🔵 Διαγώνιος 1</span>
                        <span>{activeAxis === 'diag1' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeData.allowedAxes.includes('diag2') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'diag2')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'diag2'
                            ? 'bg-blue-600 text-white font-black border-blue-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🔵 Διαγώνιος 2</span>
                        <span>{activeAxis === 'diag2' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeData.allowedAxes.includes('axisA') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'axisA')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'axisA'
                            ? 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🟡 Άξονας 1 (Κορυφή Α)</span>
                        <span>{activeAxis === 'axisA' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeData.allowedAxes.includes('axisB') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'axisB')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'axisB'
                            ? 'bg-emerald-600 text-white font-black border-emerald-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🟢 Άξονας 2 (Κορυφή Β)</span>
                        <span>{activeAxis === 'axisB' ? '🔘' : '⚪'}</span>
                      </button>
                    )}

                    {activeData.allowedAxes.includes('axisC') && (
                      <button
                        onClick={(e) => handleAxisSelect(e, 'axisC')}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition flex items-center justify-between active:scale-95 touch-manipulation ${
                          activeAxis === 'axisC'
                            ? 'bg-blue-600 text-white font-black border-blue-700 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>🔵 Άξονας 3 (Κορυφή Γ)</span>
                        <span>{activeAxis === 'axisC' ? '🔘' : '⚪'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-rose-800 text-xs font-bold text-center shadow-sm">
                  ⚠️ Το Σκαληνό Τρίγωνο δεν διαθέτει κανέναν άξονα συμμετρίας, επομένως δεν μπορεί να διπλωθεί σε δύο ίσα μέρη.
                </div>
              )}

              {/* 2. TOUCH SLIDER ΑΝΑΔΙΠΛΩΣΗΣ */}
              {activeData.allowedAxes.length > 0 && (
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
                  <div className="h-8 flex items-center justify-between text-center px-1">
                    <span className="text-[11px] font-black uppercase text-purple-950 truncate">
                      ΔΙΠΛΩΜΑ ΠΑΝΩ ΣΤΟΝ ΑΞΟΝΑ
                    </span>
                    <span className="min-w-[72px] text-center whitespace-nowrap font-mono font-black text-purple-700 text-base">
                      {foldProgress}%
                    </span>
                  </div>

                  <div className="grid grid-cols-[36px_1fr_36px] items-center h-11 w-full gap-2">
                    <button
                      onClick={(e) => updateFoldDelta(e, -10)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title="Μείωση αναδίπλωσης"
                      aria-label="Μείωση αναδίπλωσης"
                    >
                      －
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={foldProgress}
                      onChange={(e) => setFoldProgress(Number(e.target.value))}
                      className="w-full min-w-0 max-w-full accent-purple-600 cursor-pointer"
                    />

                    <button
                      onClick={(e) => updateFoldDelta(e, 10)}
                      className="w-9 h-9 shrink-0 flex items-center justify-center bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-800 font-black text-base rounded-xl transition active:scale-95 select-none touch-manipulation"
                      title="Αύξηση αναδίπλωσης"
                      aria-label="Αύξηση αναδίπλωσης"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              )}

              {/* 3. ΠΙΝΑΚΑΣ ΙΣΟΤΗΤΑΣ ΠΕΡΙΜΕΤΡΟΥ & ΕΜΒΑΔΟΥ */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2.5 shadow-sm">
                <span className="text-[11px] font-black uppercase text-indigo-950 block">
                  📏 ΣΥΓΚΡΙΣΗ ΣΥΜΜΕΤΡΙΚΩΝ ΜΕΡΩΝ:
                </span>

                <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                  <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                    <span className="text-purple-900 block text-[10px] font-black">🟣 1ο Μέρος</span>
                    <p className="text-purple-700 font-mono text-xs sm:text-sm mt-1">Π: {activeData.halfPerimeter} {activeData.halfPerimeter !== '—' ? 'cm' : ''}</p>
                    <p className="text-purple-700 font-mono text-xs sm:text-sm">Ε: {activeData.halfArea} {activeData.halfArea !== '—' ? 'cm²' : ''}</p>
                  </div>

                  <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-100">
                    <span className="text-pink-900 block text-[10px] font-black">🌸 2ο Μέρος</span>
                    <p className="text-pink-700 font-mono text-xs sm:text-sm mt-1">Π: {activeData.halfPerimeter} {activeData.halfPerimeter !== '—' ? 'cm' : ''}</p>
                    <p className="text-pink-700 font-mono text-xs sm:text-sm">Ε: {activeData.halfArea} {activeData.halfArea !== '—' ? 'cm²' : ''}</p>
                  </div>
                </div>

                {activeData.totalAxes !== 0 ? (
                  <p className="text-[11px] font-bold text-center text-emerald-800 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                    Τα δύο συμμετρικά μέρη έχουν ακριβώς την ίδια περίμετρο και το ίδιο εμβαδόν.
                  </p>
                ) : (
                  <p className="text-[11px] font-bold text-center text-rose-800 bg-rose-50 p-2 rounded-xl border border-rose-200">
                    Δεν υπάρχουν συμμετρικά μέρη σε αυτό το σχήμα.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τη συμμετρία και τους άξονες συμμετρίας; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/18-simmetria-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}

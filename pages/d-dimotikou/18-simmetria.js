import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

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
      halfPerimeter: 25,
      halfArea: 50
    },
    rectangle: {
      name: 'Ορθογώνιο',
      totalAxes: 2,
      allowedAxes: ['vertical', 'horizontal'],
      desc: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του ΔΕΝ είναι άξονες συμμετρίας!',
      halfPerimeter: 22,
      halfArea: 40
    },
    isoscelesTriangle: {
      name: 'Ισοσκελές Τρίγωνο',
      totalAxes: 1,
      allowedAxes: ['vertical'],
      desc: 'Το ισοσκελές τρίγωνο (με 2 ίσες πλευρές) έχει μόνο 1 κατακόρυφο άξονα συμμετρίας.',
      halfPerimeter: 16,
      halfArea: 12
    },
    equilateralTriangle: {
      name: 'Ισόπλευρο Τρίγωνο',
      totalAxes: 3,
      allowedAxes: ['axisA', 'axisB', 'axisC'],
      desc: 'Το ισόπλευρο τρίγωνο (με 3 ίσες πλευρές) έχει 3 άξονες συμμετρίας (έναν από κάθε κορυφή).',
      halfPerimeter: 18,
      halfArea: 15.5
    },
    scaleneTriangle: {
      name: 'Σκαληνό Τρίγωνο',
      totalAxes: 0,
      allowedAxes: [],
      desc: 'Το σκαληνό τρίγωνο (με όλες τις πλευρές άνισες) ΔΕΝ έχει κανέναν άξονα συμμετρίας (0).',
      halfPerimeter: '-',
      halfArea: '-'
    },
    rhombus: {
      name: 'Ρόμβος',
      totalAxes: 2,
      allowedAxes: ['vertical', 'horizontal'],
      desc: 'Ο ρόμβος έχει 2 άξονες συμμετρίας (τις δύο διαγώνιους του: την κατακόρυφη και την οριζόντια).',
      halfPerimeter: 20,
      halfArea: 24
    },
    circle: {
      name: 'Κύκλος',
      totalAxes: 'Απεριόριστοι',
      allowedAxes: ['vertical', 'horizontal', 'diag1', 'diag2'],
      desc: 'Ο κύκλος έχει αμέτρητους (άπειρους) άξονες συμμετρίας! Κάθε ευθεία που περνάει από το κέντρο του είναι άξονας συμμετρίας.',
      halfPerimeter: '18,7',
      halfArea: '39,25'
    }
  };

  const activeData = shapeData[shape];

  // Επαναφορά αξόνων κατά την αλλαγή σχήματος
  const handleShapeChange = (newShape) => {
    setShape(newShape);
    setFoldProgress(0);
    const available = shapeData[newShape].allowedAxes;
    if (available.length > 0 && !available.includes(activeAxis)) {
      setActiveAxis(available[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>🦋 Συμμετρία & Άξονας Συμμετρίας - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/d-dimotikou/18-simmetria-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
                <span>📝</span> Ασκήσεις
              </Link>
              <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
                🔙 Επιστροφή
              </Link>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-10 space-y-8`}>
          
          {/* HEADER & EXERCISES PROMO CARD */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ • ΕΝΟΤΗΤΑ 18
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  🦋 Η Έννοια της Συμμετρίας
                </h1>
                <p className="text-purple-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τι είναι **άξονας συμμετρίας**, πώς ένα σχήμα μπορεί να έχει **περισσότερους από έναν άξονες** και γιατί τα συμμετρικά μέρη έχουν **ίδια περίμετρο και ίδιο εμβαδόν**!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-purple-100">Δοκίμασε τις ασκήσεις στη συμμετρία για να σιγουρευτείς ότι την έμαθες!</p>
                <Link 
                  href="/d-dimotikou/18-simmetria-ask"
                  className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - SECTION 1 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-8">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Αναλυτική Θεωρία & Βασικοί Κανόνες
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Άξονας Συμμετρίας */}
              <div className="bg-purple-50/70 p-6 rounded-2xl border border-purple-100 space-y-3">
                <h3 className="text-lg font-bold text-purple-900 flex items-center gap-2">
                  <span>✂️</span> Άξονας Συμμετρίας
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  <strong>Άξονας συμμετρίας</strong> είναι η ευθεία γραμμή που χωρίζει ένα σχήμα σε <strong>δύο ακριβώς ίδια μέρη</strong>. Αν διπλώσουμε το σχήμα πάνω σε αυτή τη γραμμή, τα δύο μέρη <strong>ταυτίζονται τέλεια</strong>!
                </p>
              </div>

              {/* 2. Πλήθος Αξόνων */}
              <div className="bg-pink-50/70 p-6 rounded-2xl border border-pink-100 space-y-3">
                <h3 className="text-lg font-bold text-pink-900 flex items-center gap-2">
                  <span>🔢</span> Πλήθος Αξόνων
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Ένα σχήμα μπορεί να έχει <strong>έναν</strong> άξονα (π.χ. ισοσκελές τρίγωνο), <strong>περισσότερους</strong> (π.χ. τετράγωνο = 4, ισόπλευρο τρίγωνο = 3, κύκλος = άπειρους) ή και <strong>κανέναν</strong> άξονα συμμετρίας (π.χ. σκαληνό τρίγωνο)!
                </p>
              </div>

              {/* 3. Ίση Περίμετρος & Εμβαδόν */}
              <div className="bg-indigo-50/70 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                  <span>📐</span> Ίση Περίμετρος & Εμβαδόν
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Επειδή τα δύο συμμετρικά μέρη είναι <strong>ακριβώς ίσα</strong> μεταξύ τους, έχουν **πάντα την ίδια περίμετρο** και **το ίδιο εμβαδόν**!
                </p>
              </div>

            </div>

          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ - SECTION 2 */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4 border-gray-100">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <span>🧮</span> Διαδραστικό Εργαστήριο Συμμετρίας & Αναδίπλωσης
                </h2>
                <p className="text-gray-500 text-sm">
                  Επίλεξε σχήμα, διάλεξε **ποιον άξονα συμμετρίας** θέλεις και σύρε το slider για να δεις το δίπλωμα!
                </p>
              </div>

              {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΧΗΜΑΤΟΣ */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleShapeChange('square')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'square' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ❏ Τετράγωνο (4)
                </button>
                <button
                  onClick={() => handleShapeChange('rectangle')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'rectangle' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▭ Ορθογώνιο (2)
                </button>
                <button
                  onClick={() => handleShapeChange('isoscelesTriangle')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'isoscelesTriangle' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▲ Ισοσκελές Τρίγωνο (1)
                </button>
                <button
                  onClick={() => handleShapeChange('equilateralTriangle')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'equilateralTriangle' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▲ Ισόπλευρο Τρίγωνο (3)
                </button>
                <button
                  onClick={() => handleShapeChange('scaleneTriangle')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'scaleneTriangle' ? 'bg-rose-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▲ Σκαληνό Τρίγωνο (0)
                </button>
                <button
                  onClick={() => handleShapeChange('rhombus')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'rhombus' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ◇ Ρόμβος (2)
                </button>
                <button
                  onClick={() => handleShapeChange('circle')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'circle' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ◯ Κύκλος (∞)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              
              {/* CANVAS ΟΠΤΙΚΟΠΟΙΗΣΗΣ & ΑΝΑΔΙΠΛΩΣΗΣ */}
              <div className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                
                {/* SHAPE BADGE & INFO */}
                <div className="bg-purple-600 text-white px-5 py-2 rounded-2xl font-black text-sm shadow-md flex items-center gap-2">
                  <span>🦋 {activeData.name}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs">
                    Άξονες: {activeData.totalAxes}
                  </span>
                </div>

                <div className="w-full max-w-md h-[360px] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 320">
                    
                    {(() => {
                      const rad = (foldProgress * 1.8 * Math.PI) / 180;
                      const scaleFold = Math.cos(rad);

                      return (
                        <g transform="translate(200, 160)">
                          
                          {/* ------------------------------------------- */}
                          {/* ΣΚΑΛΗΝΟ ΤΡΙΓΩΝΟ (0 ΑΞΟΝΕΣ - ΚΑΜΙΑ ΑΝΑΔΙΠΛΩΣΗ) */}
                          {/* ------------------------------------------- */}
                          {shape === 'scaleneTriangle' && (
                            <g>
                              <polygon points="-40,-70 -90,70 100,70" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                              <text x="0" y="0" fill="#f43f5e" fontWeight="black" fontSize="14" textAnchor="middle">
                                ❌ Κανένας Άξονας Συμμετρίας
                              </text>
                            </g>
                          )}

                          {/* ------------------------------------------- */}
                          {/* 1. ΚΑΤΑΚΟΡΥΦΟΣ ΑΞΟΝΑΣ (VERTICAL FOLD) */}
                          {/* ------------------------------------------- */}
                          {activeAxis === 'vertical' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                            <g>
                              {foldProgress > 0 && (
                                <g opacity="0.5">
                                  {shape === 'square' && <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'rectangle' && <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'isoscelesTriangle' && <path d="M 0,-100 L 100,80 L 0,80 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'rhombus' && <path d="M 0,-100 L 110,0 L 0,100 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'circle' && <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                </g>
                              )}

                              {shape === 'square' && <path d="M -90,-90 L 0,-90 L 0,90 L -90,90 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'rectangle' && <path d="M -120,-70 L 0,-70 L 0,70 L -120,70 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'isoscelesTriangle' && <path d="M 0,-100 L -100,80 L 0,80 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'rhombus' && <path d="M 0,-100 L -110,0 L 0,100 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'circle' && <path d="M 0,-90 A 90,90 0 0,0 0,90 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}

                              <g transform={`scale(${scaleFold}, 1)`}>
                                {shape === 'square' && <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'rectangle' && <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'isoscelesTriangle' && <path d="M 0,-100 L 100,80 L 0,80 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'rhombus' && <path d="M 0,-100 L 110,0 L 0,100 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'circle' && <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              </g>
                            </g>
                          )}

                          {/* ------------------------------------------- */}
                          {/* 2. ΟΡΙΖΟΝΤΙΟΣ ΑΞΟΝΑΣ (HORIZONTAL FOLD) */}
                          {/* ------------------------------------------- */}
                          {activeAxis === 'horizontal' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                            <g>
                              {foldProgress > 0 && (
                                <g opacity="0.5">
                                  {shape === 'square' && <path d="M -90,0 L 90,0 L 90,90 L -90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'rectangle' && <path d="M -120,0 L 120,0 L 120,70 L -120,70 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'rhombus' && <path d="M -110,0 L 0,100 L 110,0 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'circle' && <path d="M -90,0 A 90,90 0 0,0 90,0 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                </g>
                              )}

                              {shape === 'square' && <path d="M -90,-90 L 90,-90 L 90,0 L -90,0 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'rectangle' && <path d="M -120,-70 L 120,-70 L 120,0 L -120,0 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'rhombus' && <path d="M -110,0 L 0,-100 L 110,0 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'circle' && <path d="M -90,0 A 90,90 0 0,1 90,0 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}

                              <g transform={`scale(1, ${scaleFold})`}>
                                {shape === 'square' && <path d="M -90,0 L 90,0 L 90,90 L -90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'rectangle' && <path d="M -120,0 L 120,0 L 120,70 L -120,70 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'rhombus' && <path d="M -110,0 L 0,100 L 110,0 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'circle' && <path d="M -90,0 A 90,90 0 0,0 90,0 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              </g>
                            </g>
                          )}

                          {/* ------------------------------------------- */}
                          {/* 3. ΔΙΑΓΩΝΙΟΣ 1 / ΔΙΑΓΩΝΙΟΣ 2 */}
                          {/* ------------------------------------------- */}
                          {activeAxis === 'diag1' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                            <g>
                              {foldProgress > 0 && (
                                <g opacity="0.5">
                                  {shape === 'square' && <path d="M -90,-90 L 90,-90 L 90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'circle' && <path d="M -63.6,-63.6 A 90,90 0 0,1 63.6,63.6 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                </g>
                              )}
                              {shape === 'square' && <path d="M -90,-90 L -90,90 L 90,90 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'circle' && <path d="M -63.6,-63.6 A 90,90 0 0,0 63.6,63.6 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}

                              <g transform={`rotate(-45) scale(${scaleFold}, 1) rotate(45)`}>
                                {shape === 'square' && <path d="M -90,-90 L 90,-90 L 90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'circle' && <path d="M -63.6,-63.6 A 90,90 0 0,1 63.6,63.6 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              </g>
                            </g>
                          )}

                          {activeAxis === 'diag2' && shape !== 'scaleneTriangle' && shape !== 'equilateralTriangle' && (
                            <g>
                              {foldProgress > 0 && (
                                <g opacity="0.5">
                                  {shape === 'square' && <path d="M -90,-90 L 90,-90 L -90,90 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                  {shape === 'circle' && <path d="M -63.6,63.6 A 90,90 0 0,1 63.6,-63.6 Z" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />}
                                </g>
                              )}
                              {shape === 'square' && <path d="M -90,90 L 90,90 L 90,-90 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}
                              {shape === 'circle' && <path d="M -63.6,63.6 A 90,90 0 0,0 63.6,-63.6 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />}

                              <g transform={`rotate(45) scale(${scaleFold}, 1) rotate(-45)`}>
                                {shape === 'square' && <path d="M -90,-90 L 90,-90 L -90,90 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                                {shape === 'circle' && <path d="M -63.6,63.6 A 90,90 0 0,1 63.6,-63.6 Z" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />}
                              </g>
                            </g>
                          )}

                          {/* ------------------------------------------- */}
                          {/* 4. ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ - ΑΚΡΙΒΕΙΣ ΑΝΑΚΛΑΣΕΙΣ (3 ΑΞΟΝΕΣ) */}
                          {/* ------------------------------------------- */}
                          {shape === 'equilateralTriangle' && (
                            <g>
                              {/* ΑΞΟΝΑΣ 1: Πάνω Κορυφή (Κατακόρυφος Άξονας) */}
                              {activeAxis === 'axisA' && (
                                <g>
                                  {foldProgress > 0 && <polygon points="0,-90 90,65 0,65" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />}
                                  {/* Σταθερό Αριστερό Μισό */}
                                  <polygon points="0,-90 -90,65 0,65" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                                  {/* Αναδιπλούμενο Δεξί Μισό */}
                                  <g transform={`scale(${scaleFold}, 1)`}>
                                    <polygon points="0,-90 90,65 0,65" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                                  </g>
                                </g>
                              )}

                              {/* ΑΞΟΝΑΣ 2: Δεξιά Κορυφή (Άξονας στις -30 μοίρες) */}
                              {activeAxis === 'axisB' && (
                                <g>
                                  {foldProgress > 0 && (
                                    <g opacity="0.5">
                                      <polygon points="0,-90 90,65 -90,65" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                    </g>
                                  )}
                                  {/* Σταθερό Μισό */}
                                  <polygon points="0,-90 90,65 -90,65" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                                  {/* Αναδιπλούμενο Μισό με σωστή περιστροφή άξονα (-30 deg) */}
                                  <g transform={`rotate(-30) scale(${scaleFold}, 1) rotate(30)`}>
                                    <polygon points="0,-90 90,65 0,-90" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                                  </g>
                                </g>
                              )}

                              {/* ΑΞΟΝΑΣ 3: Αριστερή Κορυφή (Άξονας στις +30 μοίρες) */}
                              {activeAxis === 'axisC' && (
                                <g>
                                  {foldProgress > 0 && (
                                    <g opacity="0.5">
                                      <polygon points="0,-90 -90,65 90,65" fill="none" stroke="#f472b6" strokeWidth="2" strokeDasharray="5,5" />
                                    </g>
                                  )}
                                  {/* Σταθερό Μισό */}
                                  <polygon points="0,-90 -90,65 90,65" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                                  {/* Αναδιπλούμενο Μισό με σωστή περιστροφή άξονα (+30 deg) */}
                                  <g transform={`rotate(30) scale(${scaleFold}, 1) rotate(-30)`}>
                                    <polygon points="0,-90 -90,65 0,-90" fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="3.5" />
                                  </g>
                                </g>
                              )}
                            </g>
                          )}

                          {/* ------------------------------------------- */}
                          {/* ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ (Ο ΕΝΕΡΓΟΣ ΕΙΝΑΙ ΕΝΤΟΝΟΣ) */}
                          {/* ------------------------------------------- */}
                          {activeData.allowedAxes.includes('vertical') && (
                            <g opacity={activeAxis === 'vertical' ? 1 : 0.25}>
                              <line x1="0" y1="-140" x2="0" y2="140" stroke="#f59e0b" strokeWidth={activeAxis === 'vertical' ? "4" : "2"} strokeDasharray="6,6" />
                            </g>
                          )}

                          {activeData.allowedAxes.includes('horizontal') && (
                            <g opacity={activeAxis === 'horizontal' ? 1 : 0.25}>
                              <line x1="-160" y1="0" x2="160" y2="0" stroke="#10b981" strokeWidth={activeAxis === 'horizontal' ? "4" : "2"} strokeDasharray="6,6" />
                            </g>
                          )}

                          {activeData.allowedAxes.includes('diag1') && (
                            <g opacity={activeAxis === 'diag1' ? 1 : 0.25}>
                              <line x1="-130" y1="-130" x2="130" y2="130" stroke="#3b82f6" strokeWidth={activeAxis === 'diag1' ? "4" : "2"} strokeDasharray="6,6" />
                            </g>
                          )}

                          {activeData.allowedAxes.includes('diag2') && (
                            <g opacity={activeAxis === 'diag2' ? 1 : 0.25}>
                              <line x1="130" y1="-130" x2="-130" y2="130" stroke="#3b82f6" strokeWidth={activeAxis === 'diag2' ? "4" : "2"} strokeDasharray="6,6" />
                            </g>
                          )}

                          {/* ΑΞΟΝΕΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ */}
                          {shape === 'equilateralTriangle' && (
                            <g>
                              <line x1="0" y1="-120" x2="0" y2="100" stroke="#f59e0b" strokeWidth={activeAxis === 'axisA' ? "4" : "2"} strokeDasharray="6,6" opacity={activeAxis === 'axisA' ? 1 : 0.3} />
                              <line x1="-110" y1="80" x2="70" y2="-40" stroke="#10b981" strokeWidth={activeAxis === 'axisB' ? "4" : "2"} strokeDasharray="6,6" opacity={activeAxis === 'axisB' ? 1 : 0.3} />
                              <line x1="110" y1="80" x2="-70" y2="-40" stroke="#3b82f6" strokeWidth={activeAxis === 'axisC' ? "4" : "2"} strokeDasharray="6,6" opacity={activeAxis === 'axisC' ? 1 : 0.3} />
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

              {/* CONTROLS SLIDERS & AXES SELECTION */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6">
                
                {/* 1. ΕΠΙΛΟΓΗ ΕΝΕΡΓΟΥ ΑΞΟΝΑ ΑΝΑΔΙΠΛΩΣΗΣ */}
                {activeData.allowedAxes.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
                      <span>🎯</span> Επίλεξε Άξονα για Δίπλωμα:
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeData.allowedAxes.includes('vertical') && (
                        <button
                          onClick={() => { setActiveAxis('vertical'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'vertical' ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🟡 Κατακόρυφος</span>
                          <span>{activeAxis === 'vertical' ? '🔘' : '⚪'}</span>
                        </button>
                      )}

                      {activeData.allowedAxes.includes('horizontal') && (
                        <button
                          onClick={() => { setActiveAxis('horizontal'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'horizontal' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🟢 Οριζόντιος</span>
                          <span>{activeAxis === 'horizontal' ? '🔘' : '⚪'}</span>
                        </button>
                      )}

                      {activeData.allowedAxes.includes('diag1') && (
                        <button
                          onClick={() => { setActiveAxis('diag1'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'diag1' ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🔵 Διαγώνιος 1</span>
                          <span>{activeAxis === 'diag1' ? '🔘' : '⚪'}</span>
                        </button>
                      )}

                      {activeData.allowedAxes.includes('diag2') && (
                        <button
                          onClick={() => { setActiveAxis('diag2'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'diag2' ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🔵 Διαγώνιος 2</span>
                          <span>{activeAxis === 'diag2' ? '🔘' : '⚪'}</span>
                        </button>
                      )}

                      {/* ΑΞΟΝΕΣ ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ */}
                      {activeData.allowedAxes.includes('axisA') && (
                        <button
                          onClick={() => { setActiveAxis('axisA'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'axisA' ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🟡 Άξονας 1 (Πάνω Κορυφή)</span>
                          <span>{activeAxis === 'axisA' ? '🔘' : '⚪'}</span>
                        </button>
                      )}

                      {activeData.allowedAxes.includes('axisB') && (
                        <button
                          onClick={() => { setActiveAxis('axisB'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'axisB' ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🟢 Άξονας 2 (Δεξιά Κορυφή)</span>
                          <span>{activeAxis === 'axisB' ? '🔘' : '⚪'}</span>
                        </button>
                      )}

                      {activeData.allowedAxes.includes('axisC') && (
                        <button
                          onClick={() => { setActiveAxis('axisC'); setFoldProgress(0); }}
                          className={`p-3 rounded-2xl text-xs font-black border transition flex items-center justify-between ${
                            activeAxis === 'axisC' ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <span>🔵 Άξονας 3 (Αριστερή Κορυφή)</span>
                          <span>{activeAxis === 'axisC' ? '🔘' : '⚪'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-rose-800 text-xs font-bold text-center">
                    ⚠️ Το Σκαληνό Τρίγωνο δεν έχει κανέναν άξονα συμμετρίας, επομένως δεν μπορεί να διπλωθεί σε δύο ίσα μέρη.
                  </div>
                )}

                {/* 2. SLIDER ΑΝΑΔΙΠΛΩΣΗΣ */}
                {activeData.allowedAxes.length > 0 && (
                  <div className="space-y-2 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                    <div className="flex justify-between items-center text-xs font-black uppercase text-purple-900">
                      <span>📄 Δίπλωμα πάνω στον επιλεγμένο άξονα:</span>
                      <span className="text-purple-700 font-mono text-base font-black">{foldProgress}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={foldProgress} 
                      onChange={(e) => setFoldProgress(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                    <p className="text-[11px] text-purple-800 font-medium">
                      Στο 50% το σχήμα γίνεται μια λεπτή γραμμή πάνω στον άξονα, και στο 100% ταυτίζεται απόλυτα με το απέναντι μέρος!
                    </p>
                  </div>
                )}

                {/* 3. ΠΙΝΑΚΑΣ ΙΣΟΤΗΤΑΣ ΠΕΡΙΜΕΤΡΟΥ & ΕΜΒΑΔΟΥ */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
                  <h4 className="text-xs font-black uppercase text-indigo-900 flex items-center gap-2">
                    <span>📏</span> Σύγκριση Συμμετρικών Μερών
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <span className="text-purple-900 block text-[11px]">🟣 1o Μέρος</span>
                      <p className="text-purple-700 font-mono text-sm mt-1">Περίμετρος: {activeData.halfPerimeter} {activeData.halfPerimeter !== '-' ? 'cm' : ''}</p>
                      <p className="text-purple-700 font-mono text-sm">Εμβαδόν: {activeData.halfArea} {activeData.halfArea !== '-' ? 'cm²' : ''}</p>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">
                      <span className="text-pink-900 block text-[11px]">🌸 2o Μέρος</span>
                      <p className="text-pink-700 font-mono text-sm mt-1">Περίμετρος: {activeData.halfPerimeter} {activeData.halfPerimeter !== '-' ? 'cm' : ''}</p>
                      <p className="text-pink-700 font-mono text-sm">Εμβαδόν: {activeData.halfArea} {activeData.halfArea !== '-' ? 'cm²' : ''}</p>
                    </div>
                  </div>

                  {activeData.totalAxes !== 0 ? (
                    <p className="text-[11px] font-bold text-center text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ✅ Τα δύο συμμετρικά μέρη έχουν ακριβώς την ίδια περίμετρο και το ίδιο εμβαδόν!
                    </p>
                  ) : (
                    <p className="text-[11px] font-bold text-center text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
                      ❌ Δεν υπάρχουν συμμετρικά μέρη σε αυτό το σχήμα.
                    </p>
                  )}
                </div>

              </div>

            </div>

          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες τη συμμετρία και τους άξονες συμμετρίας; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/18-simmetria-ask"
              className="bg-gray-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
            >
              Ξεκίνα τις Ασκήσεις ➔
            </Link>
          </div>

        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}

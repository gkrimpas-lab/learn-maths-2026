import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function SimmetriaTheoryPage() {
  const [shape, setShape] = useState('square'); // 'square', 'rectangle', 'triangle', 'rhombus', 'circle'
  const [showVertical, setShowVertical] = useState(true);
  const [showHorizontal, setShowHorizontal] = useState(false);
  const [showDiag1, setShowDiag1] = useState(false);
  const [showDiag2, setShowDiag2] = useState(false);
  const [foldProgress, setFoldProgress] = useState(0); // 0 (ανοιχτό) έως 100 (διπλωμένο)

  // Στοιχεία ανά σχήμα
  const shapeData = {
    square: {
      name: 'Τετράγωνο',
      totalAxes: 4,
      desc: 'Το τετράγωνο έχει 4 άξονες συμμετρίας (1 κατακόρυφο, 1 οριζόντιο και 2 διαγώνιους).',
      side: 10, // cm
      getPerimeter: () => 40,
      getArea: () => 100,
      halfPerimeter: 25,
      halfArea: 50
    },
    rectangle: {
      name: 'Ορθογώνιο',
      totalAxes: 2,
      desc: 'Το ορθογώνιο έχει 2 άξονες συμμετρίας (1 κατακόρυφο και 1 οριζόντιο). Οι διαγώνιοί του ΔΕΝ είναι άξονες συμμετρίας!',
      getPerimeter: () => 36,
      getArea: () => 80,
      halfPerimeter: 22,
      halfArea: 40
    },
    triangle: {
      name: 'Ισοσκελές Τρίγωνο',
      totalAxes: 1,
      desc: 'Το ισοσκελές τρίγωνο έχει μόνο 1 κατακόρυφο άξονα συμμετρίας.',
      getPerimeter: () => 24,
      getArea: () => 24,
      halfPerimeter: 16,
      halfArea: 12
    },
    rhombus: {
      name: 'Ρόμβος',
      totalAxes: 2,
      desc: 'Ο ρόμβος έχει 2 άξονες συμμετρίας (τις δύο διαγώνιους του).',
      getPerimeter: () => 32,
      getArea: () => 48,
      halfPerimeter: 20,
      halfArea: 24
    },
    circle: {
      name: 'Κύκλος',
      totalAxes: 'Απεριόριστοι',
      desc: 'Ο κύκλος έχει αμέτρητους (απειρους) άξονες συμμετρίας! Κάθε ευθεία που περνάει από το κέντρο του είναι άξονας συμμετρίας.',
      getPerimeter: () => '31,4',
      getArea: () => '78,5',
      halfPerimeter: '18,7',
      halfArea: '39,25'
    }
  };

  const activeData = shapeData[shape];

  // Επαναφορά αξόνων κατά την αλλαγή σχήματος
  const handleShapeChange = (newShape) => {
    setShape(newShape);
    setFoldProgress(0);
    if (newShape === 'square') {
      setShowVertical(true); setShowHorizontal(false); setShowDiag1(false); setShowDiag2(false);
    } else if (newShape === 'rectangle' || newShape === 'triangle') {
      setShowVertical(true); setShowHorizontal(false); setShowDiag1(false); setShowDiag2(false);
    } else if (newShape === 'rhombus') {
      setShowVertical(true); setShowHorizontal(false); setShowDiag1(false); setShowDiag2(false);
    } else if (newShape === 'circle') {
      setShowVertical(true); setShowHorizontal(true); setShowDiag1(true); setShowDiag2(true);
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
                  Ένα σχήμα μπορεί να έχει <strong>έναν</strong> άξονα (π.χ. ισοσκελές τρίγωνο), <strong>περισσότερους</strong> (π.χ. τετράγωνο = 4, κύκλος = άπειρους) ή και <strong>κανέναν</strong> άξονα συμμετρίας!
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
                  Επίλεξε σχήμα, ενεργοποίησε άξονες συμμετρίας και σύρε το slider για να διπλώσεις το σχήμα!
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
                  onClick={() => handleShapeChange('triangle')}
                  className={`px-3 py-2 rounded-xl text-xs md:text-sm font-black transition ${
                    shape === 'triangle' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ▲ Τρίγωνο (1)
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
                    
                    {/* Yπολογισμός Folding Transformation */}
                    {(() => {
                      const scaleFold = (100 - foldProgress) / 100;

                      return (
                        <g transform="translate(200, 160)">
                          
                          {/* 1. ΤΕΤΡΑΓΩΝΟ */}
                          {shape === 'square' && (
                            <g>
                              {/* Σταθερό Αριστερό Μισό */}
                              <path d="M -90,-90 L 0,-90 L 0,90 L -90,90 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                              {/* Αναδιπλούμενο Δεξί Μισό */}
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <path d="M 0,-90 L 90,-90 L 90,90 L 0,90 Z" fill="#ec4899" fillOpacity="0.5" stroke="#f472b6" strokeWidth="3" />
                              </g>
                            </g>
                          )}

                          {/* 2. ΟΡΘΟΓΩΝΙΟ */}
                          {shape === 'rectangle' && (
                            <g>
                              {/* Αριστερό Μισό */}
                              <path d="M -120,-70 L 0,-70 L 0,70 L -120,70 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                              {/* Δεξί Μισό */}
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <path d="M 0,-70 L 120,-70 L 120,70 L 0,70 Z" fill="#ec4899" fillOpacity="0.5" stroke="#f472b6" strokeWidth="3" />
                              </g>
                            </g>
                          )}

                          {/* 3. ΙΣΟΣΚΕΛΕΣ ΤΡΙΓΩΝΟ */}
                          {shape === 'triangle' && (
                            <g>
                              {/* Αριστερό Μισό */}
                              <path d="M 0,-100 L -100,80 L 0,80 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                              {/* Δεξί Μισό */}
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <path d="M 0,-100 L 100,80 L 0,80 Z" fill="#ec4899" fillOpacity="0.5" stroke="#f472b6" strokeWidth="3" />
                              </g>
                            </g>
                          )}

                          {/* 4. ΡΟΜΒΟΣ */}
                          {shape === 'rhombus' && (
                            <g>
                              {/* Αριστερό Μισό */}
                              <path d="M 0,-100 L -110,0 L 0,100 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                              {/* Δεξί Μισό */}
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <path d="M 0,-100 L 110,0 L 0,100 Z" fill="#ec4899" fillOpacity="0.5" stroke="#f472b6" strokeWidth="3" />
                              </g>
                            </g>
                          )}

                          {/* 5. ΚΥΚΛΟΣ */}
                          {shape === 'circle' && (
                            <g>
                              {/* Αριστερό Ημικύκλιο */}
                              <path d="M 0,-90 A 90,90 0 0,0 0,90 Z" fill="#a855f7" fillOpacity="0.4" stroke="#c084fc" strokeWidth="3" />
                              {/* Δεξί Ημικύκλιο */}
                              <g transform={`scale(${scaleFold}, 1)`}>
                                <path d="M 0,-90 A 90,90 0 0,1 0,90 Z" fill="#ec4899" fillOpacity="0.5" stroke="#f472b6" strokeWidth="3" />
                              </g>
                            </g>
                          )}

                          {/* ------------------------------------------- */}
                          {/* ΑΞΟΝΕΣ ΣΥΜΜΕΤΡΙΑΣ (ΔΙΑΚΕΚΟΜΜΕΝΕΣ ΓΡΑΜΜΕΣ) */}
                          {/* ------------------------------------------- */}
                          
                          {/* Κατακόρυφος Άξονας */}
                          {showVertical && (
                            <g>
                              <line x1="0" y1="-140" x2="0" y2="140" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,6" />
                              <circle cx="0" cy="-135" r="4" fill="#f59e0b" />
                              <circle cx="0" cy="135" r="4" fill="#f59e0b" />
                            </g>
                          )}

                          {/* Οριζόντιος Άξονας */}
                          {showHorizontal && (shape === 'square' || shape === 'rectangle' || shape === 'circle') && (
                            <g>
                              <line x1="-160" y1="0" x2="160" y2="0" stroke="#10b981" strokeWidth="3" strokeDasharray="6,6" />
                              <circle cx="-155" cy="0" r="4" fill="#10b981" />
                              <circle cx="155" cy="0" r="4" fill="#10b981" />
                            </g>
                          )}

                          {/* Διαγώνιος 1 (Top-Left -> Bottom-Right) */}
                          {showDiag1 && (shape === 'square' || shape === 'rhombus' || shape === 'circle') && (
                            <line x1="-120" y1="-120" x2="120" y2="120" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,6" />
                          )}

                          {/* Διαγώνιος 2 (Top-Right -> Bottom-Left) */}
                          {showDiag2 && (shape === 'square' || shape === 'rhombus' || shape === 'circle') && (
                            <line x1="120" y1="-120" x2="-120" y2="120" stroke="#3b82f6" strokeWidth="3" strokeDasharray="6,6" />
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

              {/* CONTROLS SLIDERS & AXES TOGGLES */}
              <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 space-y-6">
                
                {/* 1. SLIDER ΑΝΑΔΙΠΛΩΣΗΣ */}
                <div className="space-y-2 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                  <div className="flex justify-between items-center text-xs font-black uppercase text-purple-900">
                    <span>📄 Αναδίπλωση (Δίπλωμα) Σχήματος:</span>
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
                    Σύρε το slider στο 100% για να δεις το δεξί μέρος να διπλώνει πάνω στο αριστερό!
                  </p>
                </div>

                {/* 2. ΚΟΥΜΠΙΑ ΕΝΕΡΓΟΠΟΙΗΣΗΣ ΑΞΟΝΩΝ */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-gray-500">Εμφάνιση Αξόνων Συμμετρίας:</h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShowVertical(!showVertical)}
                      className={`p-3 rounded-xl text-xs font-black border transition flex items-center justify-between ${
                        showVertical ? 'bg-amber-100 text-amber-900 border-amber-400' : 'bg-white text-gray-500 border-gray-200'
                      }`}
                    >
                      <span>🟡 Κατακόρυφος</span>
                      <span>{showVertical ? '✅' : '⚪'}</span>
                    </button>

                    {(shape === 'square' || shape === 'rectangle' || shape === 'circle') && (
                      <button
                        onClick={() => setShowHorizontal(!showHorizontal)}
                        className={`p-3 rounded-xl text-xs font-black border transition flex items-center justify-between ${
                          showHorizontal ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-white text-gray-500 border-gray-200'
                        }`}
                      >
                        <span>🟢 Οριζόντιος</span>
                        <span>{showHorizontal ? '✅' : '⚪'}</span>
                      </button>
                    )}

                    {(shape === 'square' || shape === 'rhombus' || shape === 'circle') && (
                      <>
                        <button
                          onClick={() => setShowDiag1(!showDiag1)}
                          className={`p-3 rounded-xl text-xs font-black border transition flex items-center justify-between ${
                            showDiag1 ? 'bg-blue-100 text-blue-900 border-blue-400' : 'bg-white text-gray-500 border-gray-200'
                          }`}
                        >
                          <span>🔵 Διαγώνιος 1</span>
                          <span>{showDiag1 ? '✅' : '⚪'}</span>
                        </button>

                        <button
                          onClick={() => setShowDiag2(!showDiag2)}
                          className={`p-3 rounded-xl text-xs font-black border transition flex items-center justify-between ${
                            showDiag2 ? 'bg-blue-100 text-blue-900 border-blue-400' : 'bg-white text-gray-500 border-gray-200'
                          }`}
                        >
                          <span>🔵 Διαγώνιος 2</span>
                          <span>{showDiag2 ? '✅' : '⚪'}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. ΠΙΝΑΚΑΣ ΙΣΟΤΗΤΑΣ ΠΕΡΙΜΕΤΡΟΥ & ΕΜΒΑΔΟΥ */}
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm">
                  <h4 className="text-xs font-black uppercase text-indigo-900 flex items-center gap-2">
                    <span>📏</span> Σύγκριση Συμμετρικών Μερών
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold">
                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100">
                      <span className="text-purple-900 block text-[11px]">🟣 Αριστερό Μισό</span>
                      <p className="text-purple-700 font-mono text-sm mt-1">Περίμετρος: {activeData.halfPerimeter} cm</p>
                      <p className="text-purple-700 font-mono text-sm">Εμβαδόν: {activeData.halfArea} cm²</p>
                    </div>

                    <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">
                      <span className="text-pink-900 block text-[11px]">🌸 Δεξί Μισό</span>
                      <p className="text-pink-700 font-mono text-sm mt-1">Περίμετρος: {activeData.halfPerimeter} cm</p>
                      <p className="text-pink-700 font-mono text-sm">Εμβαδόν: {activeData.halfArea} cm²</p>
                    </div>
                  </div>

                  <p className="text-[11px] font-bold text-center text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    ✅ Τα δύο συμμετρικά μέρη έχουν ακριβώς την ίδια περίμετρο και το ίδιο εμβαδόν!
                  </p>
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

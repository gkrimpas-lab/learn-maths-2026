// pages/d-dimotikou/27-sterea.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

// Δεδομένα για τα 7 γεωμετρικά στερεά
const SOLIDS_DATA = [
  {
    id: 'cube',
    name: 'Κύβος',
    category: 'Πολύεδρο',
    faces: 6,
    facesDesc: '6 ίσα τετράγωνα',
    edges: 12,
    vertices: 8,
    examples: 'Ζάρι, κύβος του Ρούμπικ, κουτί δώρου',
    tagBg: 'bg-blue-100 text-blue-900 border-blue-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Πίσω ακμές (διακεκομμένες) */}
        <line x1="50" y1="130" x2="50" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="110" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="90" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Έδρες & Ορατές ακμές */}
        <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.55" stroke="#1d4ed8" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'cuboid',
    name: 'Ορθογώνιο Παραλληλεπίπεδο',
    category: 'Πολύεδρο',
    faces: 6,
    facesDesc: '6 ορθογώνια (ανά 2 απέναντι ίσα)',
    edges: 12,
    vertices: 8,
    examples: 'Κουτί παπουτσιών, βιβλίο, τούβλο, ντουλάπα',
    tagBg: 'bg-teal-100 text-teal-900 border-teal-200',
    svg: (
      <svg className="w-52 h-48 mx-auto block select-none" viewBox="0 0 220 200">
        {/* Πίσω ακμές */}
        <line x1="40" y1="130" x2="40" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="80" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Ορατές έδρες */}
        <polygon points="80,100 170,100 170,160 80,160" fill="#14b8a6" fillOpacity="0.35" stroke="#0f766e" strokeWidth="3" />
        <polygon points="80,100 170,100 130,70 40,70" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="3" />
        <polygon points="170,100 170,160 130,130 130,70" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'sq-pyramid',
    name: 'Τετραγωνική Πυραμίδα',
    category: 'Πολύεδρο (Πυραμίδα)',
    faces: 5,
    facesDesc: '1 τετράγωνη βάση ＋ 4 τριγωνικές έδρες',
    edges: 8,
    vertices: 5,
    examples: 'Πυραμίδες της Αιγύπτου, σκηνή κάμπινγκ',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Πίσω ακμές */}
        <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="70" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Μπροστινές έδρες */}
        <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.55" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.25" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'tri-pyramid',
    name: 'Τριγωνική Πυραμίδα (Τετράεδρο)',
    category: 'Πολύεδρο (Πυραμίδα)',
    faces: 4,
    facesDesc: '1 τριγωνική βάση ＋ 3 τριγωνικές έδρες (4 τρίγωνα)',
    edges: 6,
    vertices: 4,
    examples: 'Τριγωνικό πακέτο χυμού, πυραμίδα παιχνίδι',
    tagBg: 'bg-rose-100 text-rose-950 border-rose-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Πίσω ακμές */}
        <line x1="90" y1="120" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="160" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Μπροστινές έδρες */}
        <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    id: 'cylinder',
    name: 'Κύλινδρος',
    category: 'Σώμα εκ Περιστροφής',
    faces: 3,
    facesDesc: '2 ίσοι κυκλικοί δίσκοι (βάσεις) ＋ 1 καμπύλη επιφάνεια',
    edges: 0,
    vertices: 0,
    examples: 'Κουτάκι αναψυκτικού, κερί, κονσέρβα',
    tagBg: 'bg-purple-100 text-purple-950 border-purple-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Πίσω διακεκομμένη καμπύλη κάτω βάσης */}
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Σώμα κυλίνδρου */}
        <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="3" />
        {/* Πάνω κυκλική βάση */}
        <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.65" stroke="#6d28d9" strokeWidth="3" />
      </svg>
    )
  },
  {
    id: 'cone',
    name: 'Κώνος',
    category: 'Σώμα εκ Περιστροφής',
    faces: 2,
    facesDesc: '1 κυκλική βάση ＋ 1 καμπύλη επιφάνεια',
    edges: 0,
    vertices: 1,
    examples: 'Χωνάκι παγωτού, κώνος τροχαίας, καπέλο πάρτι',
    tagBg: 'bg-cyan-100 text-cyan-950 border-cyan-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Πίσω διακεκομμένη καμπύλη βάσης */}
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Καμπύλη επιφάνεια κώνου */}
        <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="3" />
        {/* Κορυφή */}
        <circle cx="100" cy="40" r="4.5" fill="#fbbf24" />
      </svg>
    )
  },
  {
    id: 'sphere',
    name: 'Σφαίρα',
    category: 'Σώμα εκ Περιστροφής',
    faces: 1,
    facesDesc: '1 ενιαία καμπύλη επιφάνεια (καμία επίπεδη έδρα)',
    edges: 0,
    vertices: 0,
    examples: 'Μπάλα ποδοσφαίρου, υδρόγειος σφαίρα, πορτοκάλι',
    tagBg: 'bg-emerald-100 text-emerald-950 border-emerald-200',
    svg: (
      <svg className="w-48 h-48 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Κύριος κύκλος */}
        <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.35" stroke="#047857" strokeWidth="3" />
        {/* Διακεκομμένος ισημερινός πίσω */}
        <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Ισημερινός μπροστά */}
        <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2.5" />
        {/* Φωτισμός 3D */}
        <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
      </svg>
    )
  }
];

export default function StereaTheoryPage() {
  const [selectedSolidIndex, setSelectedSolidIndex] = useState(0);
  const currentSolid = SOLIDS_DATA[selectedSolidIndex];

  const handleSelectSolid = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex(index);
  };

  const handleNextSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev + 1) % SOLIDS_DATA.length);
  };

  const handlePrevSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev - 1 + SOLIDS_DATA.length) % SOLIDS_DATA.length);
  };

  return (
    <Layout
      title="Τα Γεωμετρικά Στερεά Σώματα - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε τα γεωμετρικά στερεά: κύβος, παραλληλεπίπεδο, πυραμίδες, κύλινδρος, κώνος και σφαίρα. Υπολογισμός εδρών, ακμών και κορυφών με διαδραστικό 3D εργαστήριο."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/27-sterea-ask"
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
                🧊 Τα Γεωμετρικά Στερεά Σώματα
              </h1>
              <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Εξερευνούμε τα τρισδιάστατα γεωμετρικά σχήματα: κύβος, παραλληλεπίπεδο, πυραμίδες, κύλινδρος, κώνος και σφαίρα! Μαθαίνουμε να μετράμε τις <strong>έδρες</strong>, τις <strong>ακμές</strong> και τις <strong>κορυφές</strong> τους.
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-blue-100">
                Δοκίμασε τις διαδραστικές ασκήσεις στα γεωμετρικά στερεά για να εμπεδώσεις τα χαρακτηριστικά τους!
              </p>
              <Link
                href="/d-dimotikou/27-sterea-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΑ 3 ΒΑΣΙΚΑ ΣΤΟΙΧΕΙΑ ΤΩΝ ΣΤΕΡΕΩΝ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-8">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Τα 3 Βασικά Στοιχεία των Πολυέδρων
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. ΕΔΡΕΣ */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                1. ΕΔΡΕΣ (Ε)
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950">
                Οι Επίπεδες Επιφάνειες
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Είναι τα επίπεδα γεωμετρικά σχήματα (τετράγωνα, ορθογώνια, τρίγωνα ή κύκλοι) που περικλείουν και σχηματίζουν το στερεό σώμα.
              </p>
            </div>

            {/* 2. ΑΚΜΕΣ */}
            <div className="bg-purple-50/70 p-5 sm:p-6 rounded-2xl border border-purple-100 space-y-3 shadow-sm">
              <div className="bg-purple-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                2. ΑΚΜΕΣ (Α)
              </div>
              <h3 className="text-base sm:text-lg font-bold text-purple-950">
                Οι Γραμμές Τομής
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Είναι τα ευθύγραμμα τμήματα όπου <strong>συναντώνται δύο γειτονικές έδρες</strong> του στερεού.
              </p>
            </div>

            {/* 3. ΚΟΡΥΦΕΣ */}
            <div className="bg-emerald-50/70 p-5 sm:p-6 rounded-2xl border border-emerald-100 space-y-3 shadow-sm">
              <div className="bg-emerald-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                3. ΚΟΡΥΦΕΣ (Κ)
              </div>
              <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                Τα Σημεία Ένωσης
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Είναι τα σημεία όπου <strong>ενώνονται τρεις ή περισσότερες ακμές</strong> (οι «γωνίες» του στερεού).
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΕΞΕΡΕΥΝΗΣΗΣ ΣΤΕΡΕΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🧮</span> Διαδραστικό Εργαστήριο Γεωμετρικών Στερεών
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Επίλεξε οποιοδήποτε στερεό σώμα για να παρατηρήσεις τη μορφή του, τις έδρες, τις ακμές και τις κορυφές του!
            </p>
          </div>

          {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ ΣΤΕΡΕΟΥ (ΚΑΝΟΝΑΣ 2) */}
          <div className="flex flex-wrap gap-1.5">
            {SOLIDS_DATA.map((s, idx) => (
              <button
                key={s.id}
                onClick={(e) => handleSelectSolid(e, idx)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation select-none ${
                  selectedSolidIndex === idx
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* ΚΑΡΤΕΛΑ ΑΝΑΛΥΣΗΣ ΤΟΥ ΕΠΙΛΕΓΜΕΝΟΥ ΣΤΕΡΕΟΥ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
            {/* ΑΡΙΣΤΕΡΑ: 3D SVG ΑΠΕΙΚΟΝΙΣΗ */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                {currentSolid.category}
              </span>

              <div className="py-2 w-full max-w-[240px] aspect-square flex items-center justify-center">
                {currentSolid.svg}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-mono text-center">
                {currentSolid.name}
              </h3>

              {/* Πλοήγηση Steppers */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevSolid}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation"
                  title="Προηγούμενο στερεό"
                >
                  ◀ Προηγούμενο
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {selectedSolidIndex + 1} / {SOLIDS_DATA.length}
                </span>
                <button
                  onClick={handleNextSolid}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation"
                  title="Επόμενο στερεό"
                >
                  Επόμενο ▶
                </button>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΑΝΑΛΥΤΙΚΑ ΣΤΟΙΧΕΙΑ */}
            <div className="space-y-4 bg-slate-50 p-5 sm:p-7 rounded-3xl border border-slate-200">
              <div className="flex justify-between items-center border-b pb-3 border-slate-200">
                <h4 className="text-lg sm:text-xl font-black text-slate-900">
                  📋 Ταυτότητα Στερεού
                </h4>
                <span className={`text-xs font-black px-3 py-1 rounded-full border ${currentSolid.tagBg}`}>
                  {currentSolid.category}
                </span>
              </div>

              {/* ΜΕΤΡΗΤΕΣ: ΕΔΡΕΣ - ΑΚΜΕΣ - ΚΟΡΥΦΕΣ */}
              <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase font-sans">Έδρες</span>
                  <span className="text-2xl sm:text-3xl font-black text-blue-600 min-w-[50px] inline-block">
                    {currentSolid.faces}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase font-sans">Ακμές</span>
                  <span className="text-2xl sm:text-3xl font-black text-purple-600 min-w-[50px] inline-block">
                    {currentSolid.edges}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 block uppercase font-sans">Κορυφές</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 min-w-[50px] inline-block">
                    {currentSolid.vertices}
                  </span>
                </div>
              </div>

              {/* ΠΕΡΙΓΡΑΦΗ ΕΔΡΩΝ & ΠΑΡΑΔΕΙΓΜΑΤΑ */}
              <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1 shadow-sm">
                  <p className="font-bold text-slate-900">📐 Είδος Επιφανειών / Εδρών:</p>
                  <p className="text-slate-600 leading-relaxed">{currentSolid.facesDesc}</p>
                </div>

                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/80 space-y-1 shadow-sm">
                  <p className="font-bold text-amber-950">🌍 Αντικείμενα στην καθημερινότητα:</p>
                  <p className="text-amber-900 leading-relaxed">{currentSolid.examples}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ΣΥΝΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΟΛΩΝ ΤΩΝ ΣΤΕΡΕΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📊</span> Συγκεντρωτικός Πίνακας Στερεών Σωμάτων
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                  <th className="p-3 rounded-l-xl">Στερεό Σώμα</th>
                  <th className="p-3">Κατηγορία</th>
                  <th className="p-3 text-center">Έδρες</th>
                  <th className="p-3 text-center">Ακμές</th>
                  <th className="p-3 text-center">Κορυφές</th>
                  <th className="p-3 rounded-r-xl">Σχήμα Εδρών / Βάσεων</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SOLIDS_DATA.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-black text-slate-900">{s.name}</td>
                    <td className="p-3 text-slate-600">{s.category}</td>
                    <td className="p-3 text-center font-bold font-mono text-blue-600">{s.faces}</td>
                    <td className="p-3 text-center font-bold font-mono text-purple-600">{s.edges}</td>
                    <td className="p-3 text-center font-bold font-mono text-emerald-600">{s.vertices}</td>
                    <td className="p-3 text-slate-600">{s.facesDesc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
            <p className="text-slate-800 text-sm md:text-base">
              Έμαθες τις έδρες, τις ακμές και τις κορυφές των γεωμετρικών στερεών; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/27-sterea-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}

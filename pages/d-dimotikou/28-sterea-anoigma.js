// pages/d-dimotikou/28-sterea-anoigma.js
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const NETS_DATA = [
  {
    id: 'cube',
    name: 'Κύβος',
    netDesc: '6 ίσα τετράγωνα ενωμένα σε σχήμα σταυρού (ή άλλες 11 ισοδύναμες παραλλαγές αναπτύγματος).',
    shapesCount: '6 Τετράγωνα',
    tagBg: 'bg-blue-100 text-blue-900 border-blue-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="50" y1="130" x2="50" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="110" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="90" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.55" stroke="#1d4ed8" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Σταυρός Κύβου (4 κάθετα ＋ 2 πλευρικά) */}
        <rect x="75" y="20" width="40" height="40" fill="#60a5fa" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="60" width="40" height="40" fill="#3b82f6" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="35" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="115" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="100" width="40" height="40" fill="#2563eb" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="140" width="40" height="40" fill="#1d4ed8" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        {/* Γραμμές διπλώματος */}
        <line x1="75" y1="60" x2="115" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="75" y1="100" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="75" y1="140" x2="115" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="75" y1="60" x2="75" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="115" y1="60" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'cuboid',
    name: 'Ορθογώνιο Παραλληλεπίπεδο',
    netDesc: '6 ορθογώνια παραλληλόγραμμα (ανά 2 απέναντι είναι ίσα μεταξύ τους).',
    shapesCount: '6 Ορθογώνια',
    tagBg: 'bg-teal-100 text-teal-900 border-teal-200',
    solidSvg: (
      <svg className="w-48 h-36 mx-auto block select-none" viewBox="0 0 220 180">
        {/* Πίσω ακμές (διακεκομμένες) */}
        <line x1="30" y1="115" x2="30" y2="60" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="30" y1="115" x2="130" y2="115" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="30" y1="115" x2="70" y2="145" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        {/* Ορατές έδρες */}
        <polygon points="70,90 170,90 170,145 70,145" fill="#14b8a6" fillOpacity="0.35" stroke="#0f766e" strokeWidth="3" />
        <polygon points="70,90 170,90 130,60 30,60" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="3" />
        <polygon points="170,90 170,145 130,115 130,60" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        {/* 1. Πάνω βάση */}
        <rect x="63" y="16" width="74" height="26" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
        {/* 2. Κύρια Μπροστινή Έδρα */}
        <rect x="63" y="42" width="74" height="38" fill="#14b8a6" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
        {/* Πλαϊνό Αριστερό */}
        <rect x="37" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.35" stroke="#0f766e" strokeWidth="2" />
        {/* Πλαϊνό Δεξί */}
        <rect x="137" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.35" stroke="#0f766e" strokeWidth="2" />
        {/* 3. Κάτω Βάση */}
        <rect x="63" y="80" width="74" height="26" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
        {/* 4. Πίσω Έδρα */}
        <rect x="63" y="106" width="74" height="38" fill="#0f766e" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
        {/* Διακεκομμένες γραμμές διπλώματος */}
        <line x1="63" y1="42" x2="137" y2="42" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="63" y1="80" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="63" y1="106" x2="137" y2="106" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="63" y1="42" x2="63" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="137" y1="42" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'sq-pyramid',
    name: 'Τετραγωνική Πυραμίδα',
    netDesc: '1 τετράγωνο στο κέντρο (βάση) και 4 τρίγωνα περιμετρικά (παράπλευρες έδρες) σε σχήμα αστεριού.',
    shapesCount: '1 Τετράγωνο ＋ 4 Τρίγωνα',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="70" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.55" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.25" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Κεντρικό τετράγωνο */}
        <rect x="75" y="75" width="50" height="50" fill="#fbbf24" fillOpacity="0.45" stroke="#b45309" strokeWidth="2" />
        {/* 4 Τρίγωνα γύρω */}
        <polygon points="75,75 125,75 100,25" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="75,125 125,125 100,175" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="75,75 75,125 25,100" fill="#d97706" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="125,75 125,125 175,100" fill="#d97706" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        {/* Γραμμές διπλώματος */}
        <rect x="75" y="75" width="50" height="50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'tri-pyramid',
    name: 'Τριγωνική Πυραμίδα (Τετράεδρο)',
    netDesc: '1 κεντρικό τρίγωνο (βάση) και 3 τρίγωνα συνδεδεμένα στις πλευρές του (σύνολο 4 ισόπλευρα τρίγωνα).',
    shapesCount: '4 Τρίγωνα',
    tagBg: 'bg-rose-100 text-rose-950 border-rose-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="90" y1="120" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="160" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Μεγάλο τρίγωνο χωρισμένο σε 4 μικρά */}
        <polygon points="100,30 35,145 165,145" fill="#fda4af" fillOpacity="0.25" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="67.5,87.5 132.5,87.5 100,145" fill="#f43f5e" fillOpacity="0.5" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
        {/* Γραμμές διπλώματος */}
        <polygon points="67.5,87.5 132.5,87.5 100,145" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'cylinder',
    name: 'Κύλινδρος',
    netDesc: '1 ορθογώνιο παραλληλόγραμμο (παράπλευρη επιφάνεια) και 2 ίσοι κυκλικοί δίσκοι (πάνω και κάτω βάση).',
    shapesCount: '1 Ορθογώνιο ＋ 2 Κύκλοι',
    tagBg: 'bg-purple-100 text-purple-950 border-purple-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="3" />
        <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.65" stroke="#6d28d9" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Πάνω κύκλος */}
        <circle cx="100" cy="38" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
        {/* Ορθογώνιο (σώμα) */}
        <rect x="40" y="65" width="120" height="70" rx="2" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="2" />
        {/* Κάτω κύκλος */}
        <circle cx="100" cy="162" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
        {/* Σημεία επαφής */}
        <circle cx="100" cy="65" r="3" fill="#f59e0b" />
        <circle cx="100" cy="135" r="3" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'cone',
    name: 'Κώνος',
    netDesc: '1 κυκλικός τομέας (τμήμα κύκλου σαν βεντάλια) και 1 κυκλικός δίσκος (βάση) που εφάπτεται στο κυρτό του τόξο.',
    shapesCount: '1 Κυκλικός Τομέας ＋ 1 Κύκλος',
    tagBg: 'bg-cyan-100 text-cyan-950 border-cyan-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="3" />
        <circle cx="100" cy="40" r="4.5" fill="#fbbf24" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        {/* Κυκλικός Τομέας */}
        <path
          d="M 100,25 L 35,95 A 95,95 0 0,0 165,95 Z"
          fill="#06b6d4"
          fillOpacity="0.35"
          stroke="#0e7490"
          strokeWidth="2.5"
        />
        {/* Κυκλική Βάση */}
        <circle
          cx="100"
          cy="144"
          r="24"
          fill="#67e8f9"
          fillOpacity="0.55"
          stroke="#0e7490"
          strokeWidth="2.5"
        />
        {/* Σημείο Κορυφής */}
        <circle cx="100" cy="25" r="3.5" fill="#fbbf24" />
        {/* Σημείο Επαφής */}
        <circle cx="100" cy="120" r="3" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'sphere',
    name: 'Σφαίρα',
    netDesc: 'Η σφαίρα δεν έχει επίπεδο ανάπτυγμα. Η καμπύλη επιφάνειά της δεν μπορεί να απλωθεί σε επίπεδο χαρτί χωρίς να τσαλακωθεί ή να σκιστεί.',
    shapesCount: 'Κανένα Επίπεδο Ανάπτυγμα',
    tagBg: 'bg-emerald-100 text-emerald-950 border-emerald-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.35" stroke="#047857" strokeWidth="3" />
        <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2.5" />
        <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
      </svg>
    ),
    netSvg: (
      <div className="flex flex-col items-center justify-center h-44 text-center p-4">
        <span className="text-4xl mb-2">🚫 🗺️</span>
        <p className="text-xs font-bold text-rose-600">
          Η σφαίρα <strong>δεν ανοίγει</strong> σε επίπεδο ανάπτυγμα!
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          (Όπως ακριβώς δεν μπορούμε να ισιώσουμε απόλυτα τη φλούδα ενός πορτοκαλιού)
        </p>
      </div>
    )
  }
];

export default function StereaAnoigmaTheoryPage() {
  const [selectedSolidIndex, setSelectedSolidIndex] = useState(0);
  const currentSolid = NETS_DATA[selectedSolidIndex];

  const handleSelectSolid = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex(index);
  };

  const handleNextSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev + 1) % NETS_DATA.length);
  };

  const handlePrevSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev - 1 + NETS_DATA.length) % NETS_DATA.length);
  };

  return (
    <Layout
      title="Τα Αναπτύγματα των Στερεών Σωμάτων - Θεωρία | LearnMaths.gr"
      description="Μαθαίνουμε πώς ανοίγουν και αναπτύσσονται σε επίπεδο τα γεωμετρικά στερεά: κύβος, παραλληλεπίπεδο, πυραμίδες, κύλινδρος, κώνος και η ιδιαιτερότητα της σφαίρας."
      backUrl="/d-dimotikou"
      backText="Δ' Δημοτικού"
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/28-sterea-anoigma-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Ασκήσεις
        </Link>
      }
    >
      <div className="space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                Δ' ΔΗΜΟΤΙΚΟΥ
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📦 Τα Αναπτύγματα των Στερεών Σωμάτων
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                Μαθαίνουμε τι συμβαίνει όταν «ανοίγουμε» (ξεδιπλώνουμε) ένα γεωμετρικό στερεό πάνω σε μία επίπεδη επιφάνεια και πώς μπορούμε να το ανακατασκευάσουμε!
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
              <p className="text-xs text-indigo-100">
                Δοκίμασε τις διαδραστικές ασκήσεις στα αναπτύγματα των στερεών για να ελέγξεις τις γνώσεις σου!
              </p>
              <Link
                href="/d-dimotikou/28-sterea-anoigma-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 Μετάβαση στις Ασκήσεις
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΙ ΕΙΝΑΙ ΤΟ ΑΝΑΠΤΥΓΜΑ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> Τι είναι το Ανάπτυγμα ενός Στερεού;
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Ξεδίπλωμα */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-blue-950 flex items-center gap-2">
                <span>✂️</span> 1. Το «Ξεδίπλωμα»
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong>Ανάπτυγμα</strong> ονομάζεται το επίπεδο σχέδιο από χαρτόνι που, αν το κόψουμε και το διπλώσουμε κατά μήκος των ακμών του, σχηματίζει το τρισδιάστατο στερεό.
              </p>
            </div>

            {/* 2. Σχήματα & Έδρες */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-indigo-950 flex items-center gap-2">
                <span>📐</span> 2. Επίπεδα Σχήματα
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Κάθε ανάπτυγμα αποτελείται από τα <strong>επίπεδα γεωμετρικά σχήματα των εδρών του</strong> (τετράγωνα, ορθογώνια, τρίγωνα ή κυκλικούς δίσκους).
              </p>
            </div>

            {/* 3. Η Εξαίρεση της Σφαίρας */}
            <div className="bg-rose-50/70 p-5 sm:p-6 rounded-2xl border border-rose-100 space-y-3 shadow-sm">
              <h3 className="text-base sm:text-lg font-bold text-rose-950 flex items-center gap-2">
                <span>⚽</span> 3. Η Σφαίρα
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Η <strong>σφαίρα δεν έχει επίπεδο ανάπτυγμα</strong>, επειδή η καμπύλη επιφάνειά της κάμπτεται προς όλες τις κατευθύνσεις και δεν μπορεί να ισιώσει τέλεια σε επίπεδο χαρτί.
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΠΤΥΓΜΑΤΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🧮</span> Διαδραστικό Εργαστήριο: 3D Στερεό & 2D Ανάπτυγμα
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Επίλεξε ένα στερεό σώμα για να συγκρίνεις δίπλα-δίπλα τη μορφή του (3D) με το επίπεδο ανάπτυγμά του (2D)!
            </p>
          </div>

          {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ (ΚΑΝΟΝΑΣ 2) */}
          <div className="flex flex-wrap gap-1.5">
            {NETS_DATA.map((item, idx) => (
              <button
                key={item.id}
                onClick={(e) => handleSelectSolid(e, idx)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation select-none ${
                  selectedSolidIndex === idx
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ: 3D ΣΤΕΡΕΟ VS 2D ΑΝΑΠΤΥΓΜΑ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
            {/* ΑΡΙΣΤΕΡΑ: ΤΟ 3D ΣΤΕΡΕΟ */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                1. Τρισδιάστατο Στερεό (3D)
              </span>

              <div className="py-2 w-full max-w-[220px] aspect-square flex items-center justify-center">
                {currentSolid.solidSvg}
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
                  {selectedSolidIndex + 1} / {NETS_DATA.length}
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

            {/* ΔΕΞΙΑ: ΤΟ ΕΠΙΠΕΔΟ ΑΝΑΠΤΥΓΜΑ (2D) */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl flex flex-col items-center justify-center space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                2. Επίπεδο Ανάπτυγμα (2D)
              </span>

              <div className="py-2 w-full max-w-[220px] aspect-square flex items-center justify-center">
                {currentSolid.netSvg}
              </div>

              <div className="text-center pt-1">
                <span className={`text-xs font-black px-3.5 py-1 rounded-full border ${currentSolid.tagBg}`}>
                  {currentSolid.shapesCount}
                </span>
              </div>
            </div>
          </div>

          {/* ΠΕΡΙΓΡΑΦΗ ΑΝΑΠΤΥΓΜΑΤΟΣ */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>💡</span> Πώς κατασκευάζεται το ανάπτυγμα για: <u>{currentSolid.name}</u>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentSolid.netDesc}
            </p>
            {currentSolid.id !== 'sphere' && (
              <p className="text-xs text-amber-800 font-bold">
                🔸 Οι πορτοκαλί διακεκομμένες γραμμές δείχνουν τα σημεία όπου διπλώνουμε το χαρτόνι!
              </p>
            )}
          </div>
        </div>

        {/* ΣΥΝΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΑΝΑΠΤΥΓΜΑΤΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📊</span> Συγκεντρωτικός Πίνακας Αναπτυγμάτων
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                  <th className="p-3 rounded-l-xl">Στερεό Σώμα</th>
                  <th className="p-3">Σχήματα στο Ανάπτυγμα</th>
                  <th className="p-3 rounded-r-xl">Χαρακτηριστικά</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {NETS_DATA.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-black text-slate-900">{item.name}</td>
                    <td className="p-3 font-bold font-mono text-indigo-600">{item.shapesCount}</td>
                    <td className="p-3 text-slate-600">{item.netDesc}</td>
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
              Έμαθες να αναγνωρίζεις τα αναπτύγματα των γεωμετρικών στερεών; Δοκίμασε τις διαδραστικές ασκήσεις!
            </p>
          </div>
          <Link
            href="/d-dimotikou/28-sterea-anoigma-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            Ξεκίνα τις Ασκήσεις ➔
          </Link>
        </div>
      </div>
    </Layout>
  );
}

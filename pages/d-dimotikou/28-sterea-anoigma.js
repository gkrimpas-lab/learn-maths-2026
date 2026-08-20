import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

const NETS_DATA = [
  {
    id: 'cube',
    name: 'Κύβος',
    netDesc: '6 ίσα τετράγωνα ενωμένα σε σχήμα σταυρού (ή άλλες 11 παραλλαγές).',
    shapesCount: '6 Τετράγωνα',
    tagBg: 'bg-blue-100 text-blue-800',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
        <line x1="50" y1="130" x2="50" y2="70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="50" y1="130" x2="110" y2="130" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="50" y1="130" x2="90" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.5" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.6" stroke="#1d4ed8" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        {/* Σταυρός Κύβου (4 κάθετα + 2 πλευρικά) */}
        <rect x="75" y="20" width="40" height="40" fill="#60a5fa" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="60" width="40" height="40" fill="#3b82f6" fillOpacity="0.5" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="35" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="115" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="100" width="40" height="40" fill="#2563eb" fillOpacity="0.5" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="140" width="40" height="40" fill="#1d4ed8" fillOpacity="0.4" stroke="#1d4ed8" strokeWidth="2" />
        {/* Γραμμές διπλώματος */}
        <line x1="75" y1="60" x2="115" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="75" y1="100" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="75" y1="140" x2="115" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="75" y1="60" x2="75" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="115" y1="60" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      </svg>
    )
  },
  {
    id: 'cuboid',
    name: 'Ορθογώνιο Παραλληλεπίπεδο',
    netDesc: '6 ορθογώνια παραλληλόγραμμα (ανά 2 απέναντι είναι ίσα).',
    shapesCount: '6 Ορθογώνια',
    tagBg: 'bg-teal-100 text-teal-800',
    solidSvg: (
      <svg className="w-48 h-36 mx-auto" viewBox="0 0 220 180">
        {/* Πίσω ακμές (διακεκομμένες) */}
        <line x1="30" y1="115" x2="30" y2="60" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="30" y1="115" x2="130" y2="115" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="30" y1="115" x2="70" y2="145" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        
        {/* Ορατές έδρες (Μακρόστενο Παραλληλεπίπεδο) */}
        {/* Μπροστινή κύρια έδρα (100 x 55) */}
        <polygon points="70,90 170,90 170,145 70,145" fill="#14b8a6" fillOpacity="0.4" stroke="#0f766e" strokeWidth="3" />
        
        {/* Πάνω έδρα */}
        <polygon points="70,90 170,90 130,60 30,60" fill="#2dd4bf" fillOpacity="0.5" stroke="#0f766e" strokeWidth="3" />
        
        {/* Δεξιά πλαϊνή έδρα */}
        <polygon points="170,90 170,145 130,115 130,60" fill="#0d9488" fillOpacity="0.6" stroke="#0f766e" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        {/* Κάθετη στήλη με 4 ξεκάθαρα μακρόστενα ορθογώνια */}
        {/* 1. Πάνω καπάκι (74 x 26) */}
        <rect x="63" y="16" width="74" height="26" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
        
        {/* 2. Κύρια Μπροστινή Έδρα (74 x 38) */}
        <rect x="63" y="42" width="74" height="38" fill="#14b8a6" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
        
        {/* Πλαϊνό Αριστερό (26 x 38) */}
        <rect x="37" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.4" stroke="#0f766e" strokeWidth="2" />
        
        {/* Πλαϊνό Δεξί (26 x 38) */}
        <rect x="137" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.4" stroke="#0f766e" strokeWidth="2" />
        
        {/* 3. Κάτω Βάση (74 x 26) */}
        <rect x="63" y="80" width="74" height="26" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
        
        {/* 4. Πίσω Έδρα (74 x 38) */}
        <rect x="63" y="106" width="74" height="38" fill="#0f766e" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />

        {/* Διακεκομμένες γραμμές διπλώματος */}
        <line x1="63" y1="42" x2="137" y2="42" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="63" y1="80" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="63" y1="106" x2="137" y2="106" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="63" y1="42" x2="63" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
        <line x1="137" y1="42" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      </svg>
    )
  },
  {
    id: 'sq-pyramid',
    name: 'Τετραγωνική Πυραμίδα',
    netDesc: '1 τετράγωνο στο κέντρο (βάση) και 4 τρίγωνα γύρω του (παράπλευρες έδρες) σε σχήμα αστεριού.',
    shapesCount: '1 Τετράγωνο + 4 Τρίγωνα',
    tagBg: 'bg-amber-100 text-amber-800',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
        <line x1="40" y1="130" x2="130" y2="130" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="40" y1="130" x2="70" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="40" y1="130" x2="100" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.4" stroke="#b45309" strokeWidth="3" />
        <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.6" stroke="#b45309" strokeWidth="3" />
        <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.3" stroke="#b45309" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        {/* Κεντρικό τετράγωνο */}
        <rect x="75" y="75" width="50" height="50" fill="#fbbf24" fillOpacity="0.5" stroke="#b45309" strokeWidth="2" />
        {/* 4 Τρίγωνα γύρω */}
        <polygon points="75,75 125,75 100,25" fill="#f59e0b" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
        <polygon points="75,125 125,125 100,175" fill="#f59e0b" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
        <polygon points="75,75 75,125 25,100" fill="#d97706" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
        <polygon points="125,75 125,125 175,100" fill="#d97706" fillOpacity="0.4" stroke="#b45309" strokeWidth="2" />
        {/* Γραμμές διπλώματος */}
        <rect x="75" y="75" width="50" height="50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      </svg>
    )
  },
  {
    id: 'tri-pyramid',
    name: 'Τριγωνική Πυραμίδα (Τετράεδρο)',
    netDesc: '1 κεντρικό τρίγωνο (βάση) και 3 τρίγωνα συνδεδεμένα στις πλευρές του (σύνολο 4 τρίγωνα).',
    shapesCount: '4 Τρίγωνα',
    tagBg: 'bg-rose-100 text-rose-800',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
        <line x1="90" y1="120" x2="100" y2="40" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="40" y1="150" x2="90" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <line x1="160" y1="150" x2="90" y2="120" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        {/* Μεγάλο τρίγωνο χωρισμένο σε 4 μικρά */}
        <polygon points="100,30 35,145 165,145" fill="#fda4af" fillOpacity="0.3" stroke="#be123c" strokeWidth="2" />
        <polygon points="67.5,87.5 132.5,87.5 100,145" fill="#f43f5e" fillOpacity="0.5" stroke="#be123c" strokeWidth="2" />
        {/* Γραμμές διπλώματος */}
        <polygon points="67.5,87.5 132.5,87.5 100,145" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3" />
      </svg>
    )
  },
  {
    id: 'cylinder',
    name: 'Κύλινδρος',
    netDesc: '1 ορθογώνιο παραλληλόγραμμο (καμπύλη επιφάνεια) και 2 ίσοι κυκλικοί δίσκοι (πάνω και κάτω βάση).',
    shapesCount: '1 Ορθογώνιο + 2 Κύκλοι',
    tagBg: 'bg-purple-100 text-purple-800',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.4" stroke="#6d28d9" strokeWidth="3" />
        <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.7" stroke="#6d28d9" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        {/* Πάνω κύκλος */}
        <circle cx="100" cy="38" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
        {/* Ορθογώνιο (σώμα) */}
        <rect x="40" y="65" width="120" height="70" fill="#8b5cf6" fillOpacity="0.4" stroke="#6d28d9" strokeWidth="2" />
        {/* Κάτω κύκλος */}
        <circle cx="100" cy="162" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
        {/* Σημείο επαφής */}
        <circle cx="100" cy="65" r="3" fill="#f59e0b" />
        <circle cx="100" cy="135" r="3" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'cone',
    name: 'Κώνος',
    netDesc: '1 κυκλικός τομέας (τμήμα κύκλου σαν "βεντάλια") και 1 κυκλικός δίσκος (βάση) που εφάπτεται στο τόξο του.',
    shapesCount: '1 Κυκλικός Τομέας + 1 Κύκλος',
    tagBg: 'bg-cyan-100 text-cyan-800',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.4" stroke="#0e7490" strokeWidth="3" />
        <circle cx="100" cy="40" r="4" fill="#fbbf24" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200">
        {/* Κυκλικός Τομέας (R = 95 από την κορυφή (100, 25)) */}
        <path 
          d="M 100,25 L 35,95 A 95,95 0 0,0 165,95 Z" 
          fill="#06b6d4" 
          fillOpacity="0.4" 
          stroke="#0e7490" 
          strokeWidth="2.5" 
        />
        
        {/* Κυκλική Βάση (r = 24 με κέντρο (100, 144) - Εφάπτεται απόλυτα στο (100, 120)) */}
        <circle 
          cx="100" 
          cy="144" 
          r="24" 
          fill="#67e8f9" 
          fillOpacity="0.6" 
          stroke="#0e7490" 
          strokeWidth="2.5" 
        />
        
        {/* Σημείο Κορυφής */}
        <circle cx="100" cy="25" r="3.5" fill="#fbbf24" />

        {/* Σημείο Επαφής (Ένωση Βάσης με Τομέα) */}
        <circle cx="100" cy="120" r="3" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'sphere',
    name: 'Σφαίρα',
    netDesc: 'Η σφαίρα ΔΕΝ έχει επίπεδο ανάπτυγμα! Η καμπύλη επιφάνειά της δεν μπορεί να απλωθεί σε επίπεδο χαρτί χωρίς να τσαλακωθεί.',
    shapesCount: 'Κανένα Επίπεδο Ανάπτυγμα',
    tagBg: 'bg-emerald-100 text-emerald-800',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.4" stroke="#047857" strokeWidth="3" />
        <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
        <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2" />
        <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
      </svg>
    ),
    netSvg: (
      <div className="flex flex-col items-center justify-center h-44 text-center p-4">
        <span className="text-4xl mb-2">🚫 🗺️</span>
        <p className="text-xs font-bold text-rose-600">
          Η σφαίρα <strong>δεν ανοίγει</strong> σε επίπεδο ανάπτυγμα!
        </p>
        <p className="text-[11px] text-gray-500 mt-1">
          (Όπως δεν μπορούμε να ισιώσουμε τέλεια τη φλούδα ενός πορτοκαλιού)
        </p>
      </div>
    )
  }
];

export default function StereaAnoigmaTheoryPage() {
  const [selectedSolidIndex, setSelectedSolidIndex] = useState(0);
  const currentSolid = NETS_DATA[selectedSolidIndex];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📦 Αναπτύγματα Στερεών Σωμάτων - LearnMaths.gr</title>
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
              <Link href="/d-dimotikou/28-sterea-anoigma-ask" className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2.5 rounded-xl text-sm transition shadow-sm flex items-center gap-2">
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
          <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-md relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                  Δ' ΔΗΜΟΤΙΚΟΥ
                </span>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  📦 Τα Αναπτύγματα των Στερεών Σωμάτων
                </h1>
                <p className="text-indigo-100 text-base lg:text-lg leading-relaxed">
                  Μαθαίνουμε τι συμβαίνει όταν «ανοίγουμε» (ξεδιπλώνουμε) ένα γεωμετρικό στερεό πάνω σε μία επίπεδη επιφάνεια και πώς το ξαναδιπλώνουμε!
                </p>
              </div>

              {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
                <div className="text-3xl">🚀</div>
                <h3 className="font-extrabold text-white text-lg">Έτοιμος για εξάσκηση;</h3>
                <p className="text-xs text-indigo-100">Δοκίμασε τις διαδραστικές ασκήσεις στα αναπτύγματα των στερεών!</p>
                <Link 
                  href="/d-dimotikou/28-sterea-anoigma-ask"
                  className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
                >
                  🎯 Μετάβαση στις Ασκήσεις
                </Link>
              </div>
            </div>
          </div>

          {/* ΘΕΩΡΙΑ - ΤΙ ΕΙΝΑΙ ΤΟ ΑΝΑΠΤΥΓΜΑ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📖</span> Τι είναι το Ανάπτυγμα ενός Στερεού;
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Ξεδίπλωμα */}
              <div className="bg-blue-50/80 p-6 rounded-2xl border border-blue-100 space-y-3">
                <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                  <span>✂️</span> 1. Το «Ξεδίπλωμα»
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  <strong>Ανάπτυγμα</strong> είναι το επίπεδο σχέδιο από χαρτί που, αν το κόψουμε και το διπλώσουμε κατά μήκος των ακμών του, σχηματίζει το τρισδιάστατο στερεό.
                </p>
              </div>

              {/* 2. Σχήματα & Έδρες */}
              <div className="bg-indigo-50/80 p-6 rounded-2xl border border-indigo-100 space-y-3">
                <h3 className="text-lg font-bold text-indigo-950 flex items-center gap-2">
                  <span>📐</span> 2. Επίπεδα Σχήματα
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Κάθε ανάπτυγμα αποτελείται από τα <strong>επίπεδα σχήματα των εδρών του</strong> (τετράγωνα, ορθογώνια, τρίγωνα ή κύκλους).
                </p>
              </div>

              {/* 3. Η Εξαίρεση της Σφαίρας */}
              <div className="bg-rose-50/80 p-6 rounded-2xl border border-rose-100 space-y-3">
                <h3 className="text-lg font-bold text-rose-950 flex items-center gap-2">
                  <span>⚽</span> 3. Η Σφαίρα
                </h3>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  Η <strong>σφαίρα δεν έχει ανάπτυγμα</strong>, γιατί η επιφάνειά της είναι καμπύλη προς όλες τις κατευθύνσεις και δεν μπορεί να ισιώσει σε επίπεδο χαρτί.
                </p>
              </div>

            </div>
          </div>

          {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΠΤΥΓΜΑΤΩΝ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>🧮</span> Διαδραστικό Εργαστήριο: Στερεό & Ανάπτυγμα
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Επίλεξε ένα στερεό για να δεις δίπλα-δίπλα τη μορφή του (3D) και το ανάπτυγμά του (2D)!
              </p>
            </div>

            {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ */}
            <div className="flex flex-wrap gap-2">
              {NETS_DATA.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSolidIndex(idx)}
                  className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-black transition shadow-sm ${
                    selectedSolidIndex === idx
                      ? 'bg-indigo-600 text-white shadow-indigo-200'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ: 3D ΣΤΕΡΕΟ VS 2D ΑΝΑΠΤΥΓΜΑ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-4">
              
              {/* ΑΡΙΣΤΕΡΑ: ΤΟ 3D ΣΤΕΡΕΟ */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                  1. Τρισδιαστατο Στερεο (3D)
                </span>

                <div className="py-2">
                  {currentSolid.solidSvg}
                </div>

                <h3 className="text-2xl font-black text-white font-mono">
                  {currentSolid.name}
                </h3>
              </div>

              {/* ΔΕΞΙΑ: ΤΟ ΕΠΙΠΕΔΟ ΑΝΑΠΤΥΓΜΑ (2D) */}
              <div className="bg-slate-900 p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-4 border-2 border-indigo-500/30">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  2. Επιπεδο Αναπτυγμα (2D)
                </span>

                <div className="py-2">
                  {currentSolid.netSvg}
                </div>

                <div className="text-center space-y-1">
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${currentSolid.tagBg}`}>
                    {currentSolid.shapesCount}
                  </span>
                </div>
              </div>

            </div>

            {/* ΠΕΡΙΓΡΑΦΗ ΑΝΑΠΤΥΓΜΑΤΟΣ */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <h4 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                <span>💡</span> Πώς κατασκευάζεται το ανάπτυγμα για: <u>{currentSolid.name}</u>
              </h4>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {currentSolid.netDesc}
              </p>
              {currentSolid.id !== 'sphere' && (
                <p className="text-[11px] text-amber-700 font-bold">
                  🔸 Οι διακεκομμένες γραμμές δείχνουν τα σημεία όπου διπλώνουμε το χαρτί!
                </p>
              )}
            </div>

          </div>

          {/* ΣΥΝΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΑΝΑΠΤΥΓΜΑΤΩΝ */}
          <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="border-b pb-4 border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                <span>📊</span> Συγκεντρωτικός Πίνακας Αναπτυγμάτων
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                    <th className="p-3.5 rounded-l-xl">Στερεο Σωμα</th>
                    <th className="p-3.5">Σχηματα στο Αναπτυγμα</th>
                    <th className="p-3.5 rounded-r-xl">Χαρακτηριστικα</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {NETS_DATA.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-3.5 font-black text-gray-900">{item.name}</td>
                      <td className="p-3.5 font-bold font-mono text-indigo-600">{item.shapesCount}</td>
                      <td className="p-3.5 text-gray-600">{item.netDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM EXERCISES CALLOUT BANNER */}
          <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-gray-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-2xl font-black">📝 Ώρα για Εξάσκηση!</h3>
              <p className="text-gray-800 text-sm md:text-base">
                Έμαθες να αναγνωρίζεις τα αναπτύγματα των γεωμετρικών στερεών; Δοκίμασε τις διαδραστικές ασκήσεις!
              </p>
            </div>
            <Link
              href="/d-dimotikou/28-sterea-anoigma-ask"
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

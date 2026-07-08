import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function OgkoiSximatonPage() {
  const [activeSolid, setActiveSolid] = useState('cube');

  // =========================================================================
  // ΡΥΘΜΙΣΕΙΣ ΔΙΑΣΤΑΣΕΩΝ ΣΧΗΜΑΤΩΝ (Για μελλοντική εύκολη αλλαγή)
  // =========================================================================
  const cubeSide = 120;       // Πλευρά κύβου
  const rectW = 160;          // Μήκος ορθογωνίου παραλληλεπιπέδου
  const rectH = 100;          // Ύψος ορθογωνίου παραλληλεπιπέδου
  const rectD = 70;           // Πλάτος (βάθος) ορθογωνίου παραλληλεπιπέδου
  const cylRadius = 60;       // Ακτίνα κυλίνδρου
  const cylHeight = 140;      // Ύψος κυλίνδρου
  const coneRadius = 60;      // Ακτίνα κώνου
  const coneHeight = 140;     // Ύψος κώνου
  const pyrSize = 130;        // Βάση πυραμίδας
  const pyrHeight = 140;      // Ύψος πυραμίδας
  const sphereRadius = 75;    // Ακτίνα σφαίρας
  // =========================================================================

  // Δεδομένα και παιδαγωγικές περιγραφές για κάθε στερεό
  const solidsData = {
    cube: {
      title: "🟩 Κύβος",
      desc: "Ο κύβος είναι το πιο «δίκαιο» στερεό! Έχει 6 τετράγωνες έδρες και όλες οι ακμές του (μήκος, πλάτος, ύψος) είναι ακριβώς ίσες.",
      formula: "Όγκος = Ακμή × Ακμή × Ακμή",
      example: "Παράδειγμα: Ένα ζάρι ή ο κύβος του Ρούμπικ."
    },
    box: {
      title: "🟧 Ορθογώνιο Παραλληλεπίπεδο",
      desc: "Μοιάζει με τον κύβο, αλλά οι έδρες του είναι ορθογώνια παραλληλόγραμμα. Έχει 3 διαφορετικές διαστάσεις: Μήκος, Πλάτος και Ύψος.",
      formula: "Όγκος = Μήκος × Πλάτος × Ύψος",
      example: "Παράδειγμα: Ένα κουτί παπουτσιών, ένα σπιρτόκουτο ή ένα βιβλίο."
    },
    cylinder: {
      title: "🥤 Κύλινδρος",
      desc: "Ο κύλινδρος έχει δύο ίσιους κύκλους για βάση (πάνω και κάτω) και μια καμπύλη επιφάνεια γύρω-γύρω που του επιτρέπει να κυλάει.",
      formula: "Όγκος = Εμβαδόν Κυκλικής Βάσης × Ύψος",
      example: "Παράδειγμα: Ένα κουτάκι αναψυκτικού ή ένα κερί."
    },
    cone: {
      title: "🍦 Κώνος",
      desc: "Ο κώνος έχει μία κυκλική βάση στο κάτω μέρος, αλλά καθώς ανεβαίνει στενεύει ομοιόμορφα μέχρι να καταλήξει σε μια μυτερή κορυφή.",
      formula: "Όγκος = (Εμβαδόν Βάσης × Ύψος) ÷ 3",
      example: "Παράδειγμα: Το χωνάκι του παγωτού ή οι κώνοι της τροχαίας."
    },
    pyramid: {
      title: "📐 Πυραμίδα",
      desc: "Η πυραμίδα έχει για βάση ένα σχήμα (συνήθως τετράγωνο) και οι πλαϊνές της επιφάνειες είναι τρίγωνα που ενώνονται όλα μαζί στην κορυφή.",
      formula: "Όγκος = (Εμβαδόν Βάσης × Ύψος) ÷ 3",
      example: "Παράδειγμα: Οι μεγάλες πυραμίδες της Αιγύπτου."
    },
    sphere: {
      title: "⚽ Σφαίρα",
      desc: "Η σφαίρα είναι απόλυτα στρογγυλή από όποια μεριά κι αν την κοιτάξεις! Δεν έχει καμία ίσια έδρα, καμία ακμή και καμία γωνία.",
      formula: "Ο όγκος εξαρτάται μόνο από την Ακτίνα της",
      example: "Παράδειγμα: Μια μπάλα ποδοσφαίρου, το μπαλάκι του τένις ή ο πλανήτης Γη."
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>📐 Τα Γεωμετρικά Στερεά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white w-full border-b border-gray-100">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/e-dimotikou" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            
            <Link href="/e-dimotikou" className="bg-[#f1f1f4] hover:bg-[#e4e4e8] text-[#4a4a52] px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 tracking-wide">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600 stroke-[3] stroke-current">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12 space-y-12`}>
          
          {/* SECTION 1: ΘΕΩΡΙΑ */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <span className="text-xl">📖</span> Θεωρία: Από τα Σχήματα στα Στερεά
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed">
              Τα σχήματα στο χαρτί (όπως το τετράγωνο και ο κύκλος) έχουν μόνο 2 διαστάσεις. Τα αντικείμενα όμως γύρω μας στον πραγματικό κόσμο έχουν 3 διαστάσεις και ονομάζονται <strong>Γεωμετρικά Στερεά</strong>. Κάθε στερεό πιάνει χώρο, δηλαδή έχει τον δικό του <strong>Όγκο</strong>!
            </p>
          </div>

          {/* SECTION 2: ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΛΕΙΟ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* ΑΡΙΣΤΕΡΗ ΠΛΕΥΡΑ: ΜΕΝΟΥ ΕΠΙΛΟΓΗΣ & ΠΛΗΡΟΦΟΡΙΕΣ */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[540px] w-full gap-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                    <span>🕹️</span> 1. Επίλεξε ένα Στερεό Σώμα
                  </h3>
                  
                  {/* Grid με τα κουμπιά επιλογής στερεών */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setActiveSolid('cube')}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs text-left transition shadow-sm border ${
                        activeSolid === 'cube' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🟩 Κύβος
                    </button>
                    <button
                      onClick={() => setActiveSolid('box')}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs text-left transition shadow-sm border ${
                        activeSolid === 'box' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🟧 Ορθογώνιο Παραλληλ.
                    </button>
                    <button
                      onClick={() => setActiveSolid('cylinder')}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs text-left transition shadow-sm border ${
                        activeSolid === 'cylinder' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🥤 Κύλινδρος
                    </button>
                    <button
                      onClick={() => setActiveSolid('cone')}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs text-left transition shadow-sm border ${
                        activeSolid === 'cone' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      🍦 Κώνος
                    </button>
                    <button
                      onClick={() => setActiveSolid('pyramid')}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs text-left transition shadow-sm border ${
                        activeSolid === 'pyramid' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      📐 Πυραμίδα
                    </button>
                    <button
                      onClick={() => setActiveSolid('sphere')}
                      className={`px-3 py-2.5 rounded-xl font-bold text-xs text-left transition shadow-sm border ${
                        activeSolid === 'sphere' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      ⚽ Σφαίρα
                    </button>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Δυναμική περιγραφή στερεού */}
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-slate-900">{solidsData[activeSolid].title}</h4>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                    {solidsData[activeSolid].desc}
                  </p>
                </div>
              </div>

              {/* ΠΡΑΣΙΝΗ ΚΑΡΤΑ: ΜΑΘΗΜΑΤΙΚΟΣ ΤΥΠΟΣ & ΠΑΡΑΔΕΙΓΜΑ */}
              <div className="bg-emerald-50 text-slate-900 p-5 rounded-2xl border border-emerald-100 space-y-2 shadow-sm mt-auto">
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-center font-black text-sm md:text-base text-emerald-600">
                  {solidsData[activeSolid].formula}
                </div>
                <p className="text-xs text-emerald-800 text-center font-bold font-sans italic pt-1">
                  {solidsData[activeSolid].example}
                </p>
              </div>
            </div>

            {/* ΔΕΞΙΑ ΠΛΕΥΡΑ: ΤΡΙΣΔΙΑΣΤΑΤΗ SVG ΟΠΤΙΚΟΠΟΙΗΣΗ ΣΧΗΜΑΤΩΝ */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[540px] w-full relative overflow-hidden">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-6 block text-center">
                Καθαρή Γεωμετρική Προβολή Στερεού
              </span>

              {/* Καμβάς Σχεδίασης */}
              <div className="w-full max-w-[340px] h-[320px] bg-slate-50/50 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center">
                <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible" shapeRendering="geometricPrecision">
                  
                  {/* ΚΥΒΟΣ */}
                  {activeSolid === 'cube' && (
                    <g transform="translate(90, 90)">
                      <rect x="0" y="40" width={cubeSide} height={cubeSide} fill="#93c5fd" stroke="#2563eb" strokeWidth="2" opacity="0.85"/>
                      <path d={`M 0 40 L 40 0 L ${cubeSide + 40} 0 L ${cubeSide} 40 Z`} fill="#bfdbfe" stroke="#2563eb" strokeWidth="2"/>
                      <path d={`M ${cubeSide} 40 L ${cubeSide + 40} 0 L ${cubeSide + 40} ${cubeSide} L ${cubeSide} ${cubeSide + 40} Z`} fill="#60a5fa" stroke="#2563eb" strokeWidth="2"/>
                    </g>
                  )}

                  {/* ΟΡΘΟΓΩΝΙΟ ΠΑΡΑΛΛΗΛΕΠΙΠΕΔΟ */}
                  {activeSolid === 'box' && (
                    <g transform="translate(60, 100)">
                      <rect x="0" y={rectD} width={rectW} height={rectH} fill="#fde68a" stroke="#d97706" strokeWidth="2" opacity="0.85"/>
                      <path d={`M 0 ${rectD} L ${rectD} 0 L ${rectW + rectD} 0 L ${rectW} ${rectD} Z`} fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
                      <path d={`M ${rectW} ${rectD} L ${rectW + rectD} 0 L ${rectW + rectD} ${rectH} L ${rectW} ${rectH + rectD} Z`} fill="#fcd34d" stroke="#d97706" strokeWidth="2"/>
                    </g>
                  )}

                  {/* ΚΥΛΙΝΔΡΟΣ */}
                  {activeSolid === 'cylinder' && (
                    <g transform="translate(150, 60)">
                      <path d={`M ${-cylRadius} 30 L ${-cylRadius} ${cylHeight} A ${cylRadius} 25 0 0 0 ${cylRadius} ${cylHeight} L ${cylRadius} 30 Z`} fill="#a7f3d0" stroke="#059669" strokeWidth="2"/>
                      <ellipse cx="0" cy={cylHeight} rx={cylRadius} ry="25" fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="4 4"/>
                      <ellipse cx="0" cy="30" rx={cylRadius} ry="25" fill="#d1fae5" stroke="#059669" strokeWidth="2"/>
                    </g>
                  )}

                  {/* ΚΩΝΟΣ */}
                  {activeSolid === 'cone' && (
                    <g transform="translate(150, 60)">
                      <path d={`M ${-coneRadius} ${coneHeight} L 0 0 L ${coneRadius} ${coneHeight} A ${coneRadius} 25 0 0 1 ${-coneRadius} ${coneHeight} Z`} fill="#fbcfe8" stroke="#db2777" strokeWidth="2"/>
                      <path d={`M ${-coneRadius} ${coneHeight} A ${coneRadius} 25 0 0 0 ${coneRadius} ${coneHeight}`} fill="none" stroke="#db2777" strokeWidth="2" strokeDasharray="4 4"/>
                    </g>
                  )}

                  {/* ΠΥΡΑΜΙΔΑ */}
                  {activeSolid === 'pyramid' && (
                    <g transform="translate(150, 60)">
                      <path d={`M ${-pyrSize/2} ${pyrHeight} L 0 0 L ${pyrSize/2} ${pyrHeight} Z`} fill="#fed7aa" stroke="#ea580c" strokeWidth="2"/>
                      <path d={`M ${pyrSize/2} ${pyrHeight} L ${pyrSize/2 + 40} ${pyrHeight - 20} L 0 0 Z`} fill="#ffedd5" stroke="#ea580c" strokeWidth="2"/>
                      <path d={`M ${-pyrSize/2} ${pyrHeight} L ${40 - pyrSize/2} ${pyrHeight - 20} L ${pyrSize/2 + 40} ${pyrHeight - 20}`} fill="none" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="4 4"/>
                    </g>
                  )}

                  {/* ΣΦΑΙΡΑ */}
                  {activeSolid === 'sphere' && (
                    <g transform="translate(150, 150)">
                      <circle cx="0" cy="0" r={sphereRadius} fill="#fca5a5" stroke="#dc2626" strokeWidth="2" opacity="0.85"/>
                      <ellipse cx="0" cy="0" rx={sphereRadius} ry="25" fill="none" stroke="#dc2626" strokeWidth="2" strokeDasharray="5 5"/>
                      <ellipse cx="0" cy="0" rx={sphereRadius} ry="24" fill="none" stroke="#dc2626" strokeWidth="1" opacity="0.4"/>
                    </g>
                  )}
                </svg>
              </div>

              {/* Ετικέτα Διαστάσεων */}
              <div className="w-full flex justify-center text-xs font-bold text-slate-400 pt-4 border-t border-gray-50 mt-6 text-center">
                <span>💡 Τα στερεά σώματα έχουν τρεις διαστάσεις: Μήκος, Πλάτος και Ύψος.</span>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Διαδραστική Γεωμετρία Στερεών.</p>
      </footer>
    </div>
  );
}
